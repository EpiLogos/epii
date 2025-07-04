/**
 * Floating Epi-Logos Agent Component
 * Universal agent interface that can invoke any subsystem
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Minus, MessageCircle, Send, Settings, Archive, FileText } from 'lucide-react';
import { 
  AgentMessage, 
  AgentSession, 
  OrchestrationRequest,
  OrchestrationResponse,
  FloatingAgentState,
  OrchestrationStates,
  UI_CONFIG,
  EPI_LOGOS_AGENT_ID 
} from '../0_foundation';
import { sessionHistoryService } from '../3_services/SessionHistoryService';
import { contextCompactingService } from '../3_services/ContextCompactingService';
import { sendWebSocketMessage, subscribeToAGUIEvents, onAGUIEvent } from '../3_services/webSocketService';
import { GenerativeUIRenderer, type GenerativeUIComponent } from '../../shared/components/agent';
import { useUniversalDocumentState } from '../../subsystems/5_epii/1_hooks/useUniversalDocumentState';
import documentOperationsService from '../../subsystems/5_epii/1_services/documentOperationsService';
import { useActiveMode, useCurrentExpert } from '../4_contexts/ActiveModeProvider';
import { ChatSessionManager } from './ChatSessionManager';

interface FloatingEpiLogosAgentProps {
  initialPosition?: { x: number; y: number };
  onClose?: () => void;
}

// Calculate default position based on current window size
const getDefaultPosition = () => {
  if (typeof window !== 'undefined') {
    return {
      x: window.innerWidth - 80,
      y: window.innerHeight - 80
    };
  }
  return { x: 20, y: 20 };
};

export const FloatingEpiLogosAgent: React.FC<FloatingEpiLogosAgentProps> = ({
  initialPosition,
  onClose
}) => {
  // Calculate position with fallbacks
  const defaultPos = initialPosition || getDefaultPosition();
  
  // Document context awareness
  const documentState = useUniversalDocumentState();
  const { currentDocument, currentDocumentId, documents, selections } = documentState;
  
  // Active mode context for expert routing
  const activeMode = useActiveMode();
  const currentExpert = useCurrentExpert();
  
  // Component state
  const [state, setState] = useState<FloatingAgentState>({
    isVisible: true,
    isMinimized: true, // Start minimized as circular bubble
    position: defaultPos,
    currentSession: sessionHistoryService.getCurrentSession() || sessionHistoryService.startNewSession(),
    messageHistory: [],
    isProcessing: false,
    orchestrationState: OrchestrationStates.IDLE
  });

  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Performance optimization: Use refs for drag position tracking
  const dragPositionRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  
  const [inputMessage, setInputMessage] = useState('');
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'se' | 'sw' | 'ne' | 'nw' | 's' | 'e' | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: UI_CONFIG.floatingAgent.minWidth,
    height: UI_CONFIG.floatingAgent.minHeight
  });

  // Refs
  const agentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize component only once
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    if (!hasInitialized.current) {
      initializeAgent();
      setupEventListeners();
      hasInitialized.current = true;
      
      return () => {
        cleanupEventListeners();
      };
    }
  }, []);

  // Load message history when session changes
  useEffect(() => {
    if (state.currentSession) {
      const messages = sessionHistoryService.getCurrentSessionMessages();
      setState(prev => ({ ...prev, messageHistory: messages }));
    }
  }, [state.currentSession]);

  // Note: Welcome message useEffect moved after function declarations to avoid hoisting issues

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messageHistory]);

  // Focus management for input responsiveness
  useEffect(() => {
    if (!state.isMinimized && inputRef.current && !state.isProcessing) {
      // Focus input when expanded and not processing
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.isMinimized, state.isProcessing]);

  /**
   * Initialize agent and connect to backend
   */
  const initializeAgent = useCallback(() => {
    console.log('[FloatingEpiLogosAgent] Initializing universal agent...');
    
    // Set up MongoDB integration with user ID
    sessionHistoryService.setUserId('default-user'); // TODO: Replace with actual auth user ID
    
    // Subscribe to AG-UI events for orchestration responses
    subscribeToAGUIEvents('orchestration:response');
    subscribeToAGUIEvents('agent:message');
    subscribeToAGUIEvents('agent:state');
  }, []);

  /**
   * Set up event listeners
   */
  const setupEventListeners = useCallback(() => {
    // Listen for AG-UI orchestration responses
    onAGUIEvent('orchestration:response', handleOrchestrationResponse);
    onAGUIEvent('agent:message', handleAgentMessage);
    onAGUIEvent('agent:state', handleAgentStateUpdate);
    
    // Listen for context compacting events
    window.addEventListener('epi-logos:context-compacting-completed', handleContextCompactingCompleted);
  }, []);

  /**
   * Clean up event listeners
   */
  const cleanupEventListeners = useCallback(() => {
    window.removeEventListener('epi-logos:context-compacting-completed', handleContextCompactingCompleted);
  }, []);

  /**
   * Handle orchestration responses from backend
   */
  const handleOrchestrationResponse = useCallback(async (event: any) => {
    const response: OrchestrationResponse = event.payload;
    
    setState(prev => ({
      ...prev,
      isProcessing: false,
      orchestrationState: OrchestrationStates.IDLE
    }));

    // Add agent response message with MongoDB persistence
    const responseMessage = await sessionHistoryService.addMessageWithPersistence({
      type: 'agent',
      content: formatOrchestrationResponse(response),
      context: {
        sessionId: state.currentSession.id,
        orchestrationResponse: response
      },
      metadata: response.metadata
    });

    setState(prev => ({
      ...prev,
      messageHistory: [...prev.messageHistory, responseMessage]
    }));
  }, [state.currentSession]);

  /**
   * Handle direct agent messages
   */
  const handleAgentMessage = useCallback(async (event: any) => {
    const message = await sessionHistoryService.addMessageWithPersistence({
      type: 'agent',
      content: event.payload.content,
      context: event.payload.context,
      metadata: event.payload.metadata
    });

    setState(prev => ({
      ...prev,
      messageHistory: [...prev.messageHistory, message]
    }));
  }, []);

  /**
   * Handle agent state updates
   */
  const handleAgentStateUpdate = useCallback((event: any) => {
    const { orchestrationState } = event.payload;
    
    setState(prev => ({
      ...prev,
      orchestrationState: orchestrationState || OrchestrationStates.IDLE
    }));
  }, []);

  /**
   * Handle context compacting completion
   */
  const handleContextCompactingCompleted = useCallback((event: any) => {
    const { sessionId, result } = event.detail;
    
    if (sessionId === state.currentSession.id) {
      addSystemMessage(`📋 Context compacted: ${result.originalMessageCount} → ${result.compactedMessageCount} messages (${(result.compressionRatio * 100).toFixed(1)}% compression)`);
    }
  }, [state.currentSession]);

  /**
   * Add system message
   */
  const addSystemMessage = useCallback(async (content: string) => {
    const systemMessage = await sessionHistoryService.addMessageWithPersistence({
      type: 'system',
      content,
      context: {
        sessionId: state.currentSession.id
      }
    });

    setState(prev => ({
      ...prev,
      messageHistory: [...prev.messageHistory, systemMessage]
    }));
  }, [state.currentSession]);

  // Add welcome message for new sessions only (placed after addSystemMessage declaration)
  useEffect(() => {
    if (state.currentSession && state.messageHistory.length === 0 && hasInitialized.current) {
      // Check if this is truly a new session with no messages
      const sessionMessages = sessionHistoryService.getCurrentSessionMessages();
      if (sessionMessages.length === 0) {
        addSystemMessage('🌀 Epi-Logos Agent activated. I can assist you across all subsystems with document analysis, coordinate work, knowledge synthesis, and more.');
      }
    }
  }, [state.currentSession, state.messageHistory.length, addSystemMessage]);

  /**
   * Handle local document operations
   */
  const handleDocumentOperation = useCallback(async (message: string): Promise<boolean> => {
    const lowerMessage = message.toLowerCase();
    
    // Check for document operation commands
    if (lowerMessage.includes('create document') || lowerMessage.includes('new document')) {
      const match = message.match(/create document[s]?\s+["'](.+)["']/) || 
                   message.match(/new document[s]?\s+["'](.+)["']/);
      const name = match ? match[1] : 'Untitled Document';
      
      const result = await documentOperationsService.createDocument({
        name,
        content: '',
        coordinate: currentDocument?.bimbaCoordinate || '#5'
      });
      
      addSystemMessage(result.message);
      return true;
    }
    
    if (currentDocument && (lowerMessage.includes('analyze this document') || lowerMessage.includes('analyze current document'))) {
      const result = await documentOperationsService.startAnalysis({
        documentId: currentDocument.id,
        targetCoordinate: currentDocument.targetCoordinate || currentDocument.bimbaCoordinate
      });
      
      addSystemMessage(result.message);
      return true;
    }
    
    if (currentDocument && (lowerMessage.includes('save document') || lowerMessage.includes('save this document'))) {
      const result = await documentOperationsService.saveDocument(currentDocument.id);
      addSystemMessage(result.message);
      return true;
    }
    
    if (lowerMessage.includes('create crystallization') && currentDocument && selections.length > 0) {
      const currentDocumentSelections = selections.filter(sel => sel.documentId === currentDocument.id);
      if (currentDocumentSelections.length > 0) {
        const selection = currentDocumentSelections[0]; // Use first selection
        const result = await documentOperationsService.createPratibimba({
          sourceDocumentId: currentDocument.id,
          selection: {
            start: selection.startOffset,
            end: selection.endOffset,
            text: selection.text
          }
        });
        
        addSystemMessage(result.message);
        return true;
      }
    }
    
    return false; // Not a document operation
  }, [currentDocument, selections, addSystemMessage]);

  /**
   * Send message to agent
   */
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || state.isProcessing) {
      return;
    }

    const userMessage = await sessionHistoryService.addMessageWithPersistence({
      type: 'user',
      content: inputMessage.trim(),
      context: {
        sessionId: state.currentSession.id,
        componentId: 'floatingAgent'
      }
    });

    // Update UI with user message
    setState(prev => ({
      ...prev,
      messageHistory: [...prev.messageHistory, userMessage],
      isProcessing: true,
      orchestrationState: OrchestrationStates.ANALYZING
    }));

    // Clear input
    setInputMessage('');

    // Check if this is a local document operation
    const requestType = determineRequestType(inputMessage);
    if (requestType === 'document_operation') {
      const handled = await handleDocumentOperation(inputMessage);
      if (handled) {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          orchestrationState: OrchestrationStates.IDLE
        }));
        return;
      }
    }

    // Prepare document context for the agent
    const documentContext = currentDocument ? {
      documentId: currentDocument.id,
      documentName: currentDocument.name,
      documentType: currentDocument.documentType,
      bimbaCoordinate: currentDocument.bimbaCoordinate,
      targetCoordinate: currentDocument.targetCoordinate,
      analysisStatus: currentDocument.analysisStatus,
      contentLength: currentDocument.textContent?.length || 0,
      hasSelections: selections.filter(sel => sel.documentId === currentDocument.id).length > 0,
      selectionsCount: selections.filter(sel => sel.documentId === currentDocument.id).length
    } : null;

    // Send orchestration request to backend
    const orchestrationRequest: OrchestrationRequest = {
      type: determineRequestType(inputMessage),
      content: inputMessage.trim(),
      context: {
        sessionId: state.currentSession.id,
        messageHistory: state.messageHistory.slice(-10), // Recent context
        frontendComponent: 'floatingAgent',
        // Include document context for document-aware conversations
        documentContext,
        // Include global document state summary
        globalDocumentState: {
          totalDocuments: documents.length,
          currentDocumentId,
          hasActiveDocument: !!currentDocument
        },
        // Expert routing context
        expertRouting: {
          currentMode: activeMode.currentMode,
          currentCoordinate: activeMode.currentCoordinate,
          expertSkillId: activeMode.expertSkillId,
          capabilities: activeMode.modeCapabilities,
          modeName: activeMode.modeName,
          modeDescription: activeMode.modeDescription
        }
      },
      orchestrationStrategy: 'single'
    };

    try {
      // Send via WebSocket to A2A layer
      const success = sendWebSocketMessage({
        type: 'orchestration:request',
        agentId: EPI_LOGOS_AGENT_ID,
        payload: orchestrationRequest
      });

      if (!success) {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          orchestrationState: OrchestrationStates.IDLE
        }));
        
        addSystemMessage('⚠️ Failed to send message. Please check your connection.');
      }
    } catch (error) {
      console.error('[FloatingEpiLogosAgent] Failed to send orchestration request:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        orchestrationState: OrchestrationStates.IDLE
      }));
      
      addSystemMessage('⚠️ Error sending message. Please try again.');
    }
  }, [inputMessage, state.isProcessing, state.currentSession, state.messageHistory, currentDocument, currentDocumentId, documents, selections, handleDocumentOperation]);


  /**
   * Determine request type from input message
   */
  const determineRequestType = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Document operations
    if (lowerMessage.includes('create document') || lowerMessage.includes('new document') ||
        lowerMessage.includes('save document') || lowerMessage.includes('analyze this document') ||
        lowerMessage.includes('create crystallization')) {
      return 'document_operation';
    }
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
      return 'analyze';
    }
    if (lowerMessage.includes('synthesize') || lowerMessage.includes('synthesis')) {
      return 'synthesize';
    }
    if (lowerMessage.includes('coordinate') || lowerMessage.includes('multi')) {
      return 'coordinate';
    }
    if (lowerMessage.includes('reflect') || lowerMessage.includes('reflection')) {
      return 'reflect';
    }
    
    return 'orchestrate'; // Default
  };

  /**
   * Format orchestration response for display
   */
  const formatOrchestrationResponse = (response: OrchestrationResponse): string => {
    if (!response.success) {
      return `❌ **Error**: ${response.error || 'Unknown orchestration error'}`;
    }

    const { metadata } = response;
    let content = '';

    // Add orchestration type header
    content += `🔄 **${metadata.orchestrationType.replace('-', ' ').toUpperCase()}**\n\n`;

    // Add result content
    if (typeof response.result === 'string') {
      content += response.result;
    } else if (response.result?.synthesis) {
      content += response.result.synthesis;
    } else if (response.result?.content) {
      content += response.result.content;
    } else {
      content += JSON.stringify(response.result, null, 2);
    }

    // Add metadata footer
    content += `\n\n---\n*Processed in ${metadata.processingTime}ms`;
    if (metadata.subsystemsInvolved?.length > 0) {
      content += ` • Subsystems: ${metadata.subsystemsInvolved.join(', ')}`;
    }
    content += '*';

    return content;
  };

  /**
   * Check if message contains generative UI
   */
  const hasGenerativeUI = (message: AgentMessage): boolean => {
    return !!(message.context?.generativeUI || message.metadata?.generativeUI);
  };

  /**
   * Extract generative UI components from message
   */
  const extractGenerativeUI = (message: AgentMessage): GenerativeUIComponent[] => {
    const generativeUI = message.context?.generativeUI || message.metadata?.generativeUI;
    
    if (!generativeUI) {
      return [];
    }

    // Handle single component
    if (!Array.isArray(generativeUI)) {
      return [generativeUI];
    }

    // Handle array of components
    return generativeUI;
  };

  /**
   * Render message content with generative UI support
   */
  const renderMessageContent = (message: AgentMessage): React.ReactNode => {
    const hasGenUI = hasGenerativeUI(message);
    
    if (hasGenUI) {
      const components = extractGenerativeUI(message);
      
      return (
        <div className="space-y-3">
          {/* Regular text content */}
          {message.content && (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
          
          {/* Generative UI components */}
          {components.map((component, index) => (
            <GenerativeUIRenderer
              key={`${message.id}-${index}`}
              componentSpec={component}
              onSuccess={(componentName) => {
                console.log(`[FloatingAgent] Rendered ${componentName} successfully`);
              }}
              onError={(error, spec) => {
                console.error(`[FloatingAgent] Failed to render ${spec.componentName}:`, error);
              }}
            />
          ))}
        </div>
      );
    }

    // Regular text content
    return <div className="whitespace-pre-wrap">{message.content}</div>;
  };

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // Prevent default to avoid text selection
    e.preventDefault();
    
    if ((e.target as HTMLElement).closest('.drag-handle') || state.isMinimized) {
      setIsDragging(true);
      isDraggingRef.current = true;
      
      const rect = agentRef.current?.getBoundingClientRect();
      if (rect) {
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        setDragOffset({ x: offsetX, y: offsetY });
        dragOffsetRef.current = { x: offsetX, y: offsetY };
        
        // Initialize drag position ref
        dragPositionRef.current = { x: rect.left, y: rect.top };
      }
      
      // Add some visual feedback
      if (agentRef.current) {
        agentRef.current.style.cursor = 'grabbing';
        agentRef.current.style.userSelect = 'none';
      }
    }
  }, [state.isMinimized]);

  /**
   * Handle drag with optimized performance using refs
   */
  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !agentRef.current) return;
    
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;
    
    // Constrain to viewport bounds
    const maxX = window.innerWidth - (state.isMinimized ? UI_CONFIG.floatingAgent.minimizedSize : UI_CONFIG.floatingAgent.minWidth);
    const maxY = window.innerHeight - (state.isMinimized ? UI_CONFIG.floatingAgent.minimizedSize : 60);
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    // Update position immediately via direct style manipulation for smoothness
    agentRef.current.style.left = `${constrainedX}px`;
    agentRef.current.style.top = `${constrainedY}px`;
    
    // Store position in ref for final state update
    dragPositionRef.current = { x: constrainedX, y: constrainedY };
  }, [state.isMinimized]);

  /**
   * Handle drag end with anchoring logic
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
    
    // Reset cursor
    if (agentRef.current) {
      agentRef.current.style.cursor = state.isMinimized ? 'pointer' : 'default';
      agentRef.current.style.userSelect = '';
    }

    // Update state with final position from ref
    const finalPosition = dragPositionRef.current;
    setState(prev => ({
      ...prev,
      position: finalPosition
    }));

    // Anchoring logic: return to bottom-right if close enough
    const anchorPos = {
      x: window.innerWidth - UI_CONFIG.floatingAgent.minimizedSize - 20,
      y: window.innerHeight - UI_CONFIG.floatingAgent.minimizedSize - 20
    };
    
    const distance = Math.sqrt(
      Math.pow(finalPosition.x - anchorPos.x, 2) + 
      Math.pow(finalPosition.y - anchorPos.y, 2)
    );
    
    // If within threshold distance, animate back to anchor
    if (distance < UI_CONFIG.floatingAgent.anchorThreshold) {
      // Smooth animation back to anchor position
      const startPos = { ...finalPosition };
      const startTime = Date.now();
      const duration = UI_CONFIG.floatingAgent.anchorAnimationDuration;
      
      const animateToAnchor = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startPos.x + (anchorPos.x - startPos.x) * easeOut;
        const currentY = startPos.y + (anchorPos.y - startPos.y) * easeOut;
        
        if (agentRef.current) {
          agentRef.current.style.left = `${currentX}px`;
          agentRef.current.style.top = `${currentY}px`;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateToAnchor);
        } else {
          // Final state update
          setState(prev => ({
            ...prev,
            position: { x: currentX, y: currentY }
          }));
        }
      };
      
      requestAnimationFrame(animateToAnchor);
    }
  }, [state.isMinimized]);

  // Set up drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  // Handle window resize to keep agent in bounds
  useEffect(() => {
    const handleWindowResize = () => {
      setState(prev => {
        const maxX = window.innerWidth - (prev.isMinimized ? UI_CONFIG.floatingAgent.minimizedSize : windowSize.width);
        const maxY = window.innerHeight - (prev.isMinimized ? UI_CONFIG.floatingAgent.minimizedSize : windowSize.height);
        
        return {
          ...prev,
          position: {
            x: Math.max(0, Math.min(prev.position.x, maxX)),
            y: Math.max(0, Math.min(prev.position.y, maxY))
          }
        };
      });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [windowSize]);

  /**
   * Handle resize start
   */
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: 'se' | 'sw' | 'ne' | 'nw' | 's' | 'e') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  }, []);

  /**
   * Handle resize with constrained boundaries
   */
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeDirection || state.isMinimized) return;

    const rect = agentRef.current?.getBoundingClientRect();
    if (!rect) return;

    let newWidth = windowSize.width;
    let newHeight = windowSize.height;
    let newX = state.position.x;
    let newY = state.position.y;

    // Calculate new dimensions based on resize direction
    switch (resizeDirection) {
      case 'se': // Southeast corner
        newWidth = Math.max(UI_CONFIG.floatingAgent.minWidth, Math.min(UI_CONFIG.floatingAgent.maxWidth, e.clientX - state.position.x));
        newHeight = Math.max(UI_CONFIG.floatingAgent.minHeight, Math.min(UI_CONFIG.floatingAgent.maxHeight, e.clientY - state.position.y));
        break;
      case 'sw': // Southwest corner
        const newWidthSW = Math.max(UI_CONFIG.floatingAgent.minWidth, Math.min(UI_CONFIG.floatingAgent.maxWidth, state.position.x + windowSize.width - e.clientX));
        newWidth = newWidthSW;
        newX = state.position.x + windowSize.width - newWidthSW;
        newHeight = Math.max(UI_CONFIG.floatingAgent.minHeight, Math.min(UI_CONFIG.floatingAgent.maxHeight, e.clientY - state.position.y));
        break;
      case 'ne': // Northeast corner
        newWidth = Math.max(UI_CONFIG.floatingAgent.minWidth, Math.min(UI_CONFIG.floatingAgent.maxWidth, e.clientX - state.position.x));
        const newHeightNE = Math.max(UI_CONFIG.floatingAgent.minHeight, Math.min(UI_CONFIG.floatingAgent.maxHeight, state.position.y + windowSize.height - e.clientY));
        newHeight = newHeightNE;
        newY = state.position.y + windowSize.height - newHeightNE;
        break;
      case 'nw': // Northwest corner
        const newWidthNW = Math.max(UI_CONFIG.floatingAgent.minWidth, Math.min(UI_CONFIG.floatingAgent.maxWidth, state.position.x + windowSize.width - e.clientX));
        const newHeightNW = Math.max(UI_CONFIG.floatingAgent.minHeight, Math.min(UI_CONFIG.floatingAgent.maxHeight, state.position.y + windowSize.height - e.clientY));
        newWidth = newWidthNW;
        newHeight = newHeightNW;
        newX = state.position.x + windowSize.width - newWidthNW;
        newY = state.position.y + windowSize.height - newHeightNW;
        break;
      case 's': // South edge
        newHeight = Math.max(UI_CONFIG.floatingAgent.minHeight, Math.min(UI_CONFIG.floatingAgent.maxHeight, e.clientY - state.position.y));
        break;
      case 'e': // East edge
        newWidth = Math.max(UI_CONFIG.floatingAgent.minWidth, Math.min(UI_CONFIG.floatingAgent.maxWidth, e.clientX - state.position.x));
        break;
    }

    // Ensure window stays within viewport
    newX = Math.max(0, Math.min(newX, window.innerWidth - newWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - newHeight));

    setWindowSize({ width: newWidth, height: newHeight });
    setState(prev => ({
      ...prev,
      position: { x: newX, y: newY }
    }));
  }, [isResizing, resizeDirection, windowSize, state.position, state.isMinimized]);

  /**
   * Handle resize end
   */
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  // Set up resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  /**
   * Handle key press in input
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  /**
   * Start new session
   */
  const startNewSession = useCallback(async () => {
    const newSession = await sessionHistoryService.startNewSessionWithPersistence();
    setState(prev => ({
      ...prev,
      currentSession: newSession,
      messageHistory: []
    }));
    addSystemMessage('🆕 New session started. How can I help you?');
  }, [addSystemMessage]);

  /**
   * Switch to different session
   */
  const handleSessionChange = useCallback(async (sessionId: string) => {
    try {
      const session = await sessionHistoryService.getSession(sessionId);
      if (session) {
        setState(prev => ({
          ...prev,
          currentSession: session,
          messageHistory: session.messages || []
        }));
        addSystemMessage(`📂 Switched to session ${sessionId.slice(-8)}`);
      }
    } catch (error) {
      console.error('[FloatingAgent] Failed to switch session:', error);
      addSystemMessage('❌ Failed to switch session');
    }
  }, [addSystemMessage]);

  /**
   * Clear current session messages
   */
  const handleClearSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      messageHistory: []
    }));
    addSystemMessage('🧹 Session cleared. Starting fresh conversation.');
  }, [addSystemMessage]);

  /**
   * Export current session
   */
  const handleExportSession = useCallback(async (sessionId: string) => {
    try {
      const session = await sessionHistoryService.getSession(sessionId);
      if (session) {
        const exportData = {
          sessionId: session.id,
          timestamp: session.timestamp,
          messages: session.messages || state.messageHistory,
          context: session.context,
          metadata: {
            exportedAt: new Date().toISOString(),
            messageCount: session.messages?.length || state.messageHistory.length
          }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `epi-logos-session-${sessionId.slice(-8)}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        addSystemMessage('💾 Session exported successfully');
      }
    } catch (error) {
      console.error('[FloatingAgent] Failed to export session:', error);
      addSystemMessage('❌ Failed to export session');
    }
  }, [state.messageHistory, addSystemMessage]);

  /**
   * Toggle minimized state with smart positioning
   */
  const toggleMinimized = useCallback(() => {
    setState(prev => {
      const newMinimized = !prev.isMinimized;
      
      // If expanding from minimized, implement smart positioning
      if (!newMinimized && prev.isMinimized) {
        const bubbleX = prev.position.x;
        const bubbleY = prev.position.y;
        const modalWidth = windowSize.width;
        const modalHeight = windowSize.height;
        
        // Detect position relative to screen quadrants (more conservative thresholds)
        const isRightSide = bubbleX > window.innerWidth * 0.6;
        const isBottomSide = bubbleY > window.innerHeight * 0.6;
        
        let newX = bubbleX;
        let newY = bubbleY;
        
        // Smart horizontal positioning
        if (isRightSide) {
          // If on right side, open leftward - align right edges with buffer
          newX = Math.max(10, bubbleX + UI_CONFIG.floatingAgent.minimizedSize - modalWidth - 10);
        } else {
          // If on left side, open rightward (default behavior)
          newX = Math.min(bubbleX, window.innerWidth - modalWidth - 10);
        }
        
        // Smart vertical positioning
        if (isBottomSide) {
          // If on bottom side, open upward - align bottom edges with buffer
          newY = Math.max(10, bubbleY + UI_CONFIG.floatingAgent.minimizedSize - modalHeight - 10);
        } else {
          // If on top side, open downward (default behavior)
          newY = Math.min(bubbleY, window.innerHeight - modalHeight - 10);
        }
        
        // Ensure the modal stays within viewport bounds
        newX = Math.max(0, Math.min(newX, window.innerWidth - modalWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - modalHeight));
        
        return { 
          ...prev, 
          isMinimized: newMinimized,
          position: { x: newX, y: newY }
        };
      }
      
      // If minimizing, animate back to anchor position
      if (newMinimized && !prev.isMinimized) {
        const anchorPos = {
          x: window.innerWidth - UI_CONFIG.floatingAgent.minimizedSize - 20,
          y: window.innerHeight - UI_CONFIG.floatingAgent.minimizedSize - 20
        };
        
        // Start animation to anchor position
        const startPos = { ...prev.position };
        const startTime = Date.now();
        const duration = UI_CONFIG.floatingAgent.anchorAnimationDuration;
        
        const animateToAnchor = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          const currentX = startPos.x + (anchorPos.x - startPos.x) * easeOut;
          const currentY = startPos.y + (anchorPos.y - startPos.y) * easeOut;
          
          if (agentRef.current) {
            agentRef.current.style.left = `${currentX}px`;
            agentRef.current.style.top = `${currentY}px`;
          }
          
          if (progress < 1) {
            requestAnimationFrame(animateToAnchor);
          } else {
            // Final state update
            setState(current => ({
              ...current,
              position: { x: currentX, y: currentY }
            }));
          }
        };
        
        requestAnimationFrame(animateToAnchor);
        
        return { 
          ...prev, 
          isMinimized: newMinimized,
          // Don't update position immediately, let animation handle it
        };
      }
      
      return { ...prev, isMinimized: newMinimized };
    });
  }, [windowSize.width, windowSize.height]);

  // Memoized message list for performance
  const memoizedMessageList = useMemo(() => 
    state.messageHistory.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
            message.type === 'user'
              ? `${UI_CONFIG.styling.accent} bg-blue-600/20 border ${UI_CONFIG.styling.border}`
              : message.type === 'system'
              ? 'bg-yellow-600/20 border border-yellow-600/20 text-yellow-100'
              : `bg-white/5 border ${UI_CONFIG.styling.border} text-gray-100`
          }`}
        >
          {renderMessageContent(message)}
          {message.metadata && (
            <div className="text-xs opacity-60 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    )), 
    [state.messageHistory]
  );

  // Optimized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  }, []);

  if (!state.isVisible) {
    return null;
  }

  // Render minimized circular bubble
  if (state.isMinimized) {
    return (
      <div
        ref={agentRef}
        className={`fixed ${UI_CONFIG.styling.glass} ${UI_CONFIG.styling.border} border shadow-2xl transition-all duration-300 hover:shadow-xl hover:border-opacity-40 cursor-pointer`}
        style={{
          left: state.position.x,
          top: state.position.y,
          width: UI_CONFIG.floatingAgent.minimizedSize,
          height: UI_CONFIG.floatingAgent.minimizedSize,
          borderRadius: '50%',
          zIndex: UI_CONFIG.floatingAgent.zIndex,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseDown={handleDragStart}
        onClick={(e) => {
          if (!isDragging) {
            toggleMinimized();
          }
        }}
        title="Epi-Logos Agent - Click to expand"
      >
        <div className="relative">
          <MessageCircle 
            className={`w-6 h-6 ${UI_CONFIG.styling.accent} ${state.isProcessing ? 'animate-pulse' : ''}`} 
          />
          {state.orchestrationState !== OrchestrationStates.IDLE && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          )}
          {state.messageHistory.length > 0 && (
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
          )}
          {currentDocument && (
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full border border-white/20" title={`Document-aware: ${currentDocument.name}`}></div>
          )}
        </div>
      </div>
    );
  }

  // Render expanded agent interface
  return (
    <div
      ref={agentRef}
      className={`fixed ${UI_CONFIG.styling.glass} ${UI_CONFIG.styling.border} border rounded-lg shadow-2xl transition-all duration-300 ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-default'
      }`}
      style={{
        left: state.position.x,
        top: state.position.y,
        width: windowSize.width,
        height: windowSize.height,
        zIndex: UI_CONFIG.floatingAgent.zIndex,
        minWidth: UI_CONFIG.floatingAgent.minWidth,
        maxWidth: UI_CONFIG.floatingAgent.maxWidth,
        minHeight: UI_CONFIG.floatingAgent.minHeight,
        maxHeight: UI_CONFIG.floatingAgent.maxHeight
      }}
      onMouseDown={handleDragStart}
    >
      {/* Header */}
      <div className={`drag-handle flex items-center justify-between p-3 ${UI_CONFIG.styling.primary} border-b ${UI_CONFIG.styling.border} cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}>
        <div className="flex items-center gap-2">
          <MessageCircle className={`w-4 h-4 ${UI_CONFIG.styling.accent}`} />
          <span className={`text-sm font-medium ${UI_CONFIG.styling.accent}`}>
            Epi-Logos Agent
          </span>
          {currentDocument && (
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400" title={`Document-aware: ${currentDocument.name}`}>
                {currentDocument.name.length > 12 ? currentDocument.name.slice(0, 12) + '...' : currentDocument.name}
              </span>
            </div>
          )}
          {state.orchestrationState !== OrchestrationStates.IDLE && (
            <span className="text-xs text-yellow-400">
              {state.orchestrationState}...
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMinimized}
            className={`p-1 hover:bg-white/10 rounded ${UI_CONFIG.styling.accent}`}
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className={`p-1 hover:bg-white/10 rounded ${UI_CONFIG.styling.accent}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Session Manager */}
      <ChatSessionManager
        currentSession={state.currentSession}
        onSessionChange={handleSessionChange}
        onNewSession={startNewSession}
        onClearSession={handleClearSession}
        onExportSession={handleExportSession}
        messageCount={state.messageHistory.length}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ height: 'calc(100% - 120px)' }}>
            {memoizedMessageList}
            
            {state.isProcessing && (
              <div className="flex justify-start">
                <div className={`bg-white/5 border ${UI_CONFIG.styling.border} px-3 py-2 rounded-lg text-sm text-gray-100`}>
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full"></div>
                    Processing...
                  </div>
                </div>
              </div>
            )}
            
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-3 border-t ${UI_CONFIG.styling.border}`}>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={state.isProcessing ? "Processing... (you can type while I work)" : "Ask me anything across all subsystems..."}
            className={`flex-1 px-3 py-2 ${UI_CONFIG.styling.primary} ${UI_CONFIG.styling.border} border rounded text-sm text-white placeholder-gray-400 resize-none ${state.isProcessing ? 'border-yellow-400/30' : ''}`}
            rows={1}
            disabled={false}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || state.isProcessing}
            className={`px-3 py-2 ${UI_CONFIG.styling.accent} ${UI_CONFIG.styling.border} border rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resize Handles */}
      {!state.isMinimized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-50 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            style={{ background: 'linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 70%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize opacity-50 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 70%, transparent 70%)' }}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize opacity-50 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 70%, transparent 70%)' }}
          />
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize opacity-50 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            style={{ background: 'linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 70%, transparent 70%)' }}
          />
          
          {/* Edge handles */}
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize opacity-50 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 's')}
            style={{ background: 'rgba(255,255,255,0.2)' }}
          />
          <div
            className="absolute top-3 bottom-3 right-0 w-1 cursor-e-resize opacity-50 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            style={{ background: 'rgba(255,255,255,0.2)' }}
          />
        </>
      )}
    </div>
  );
};

export default FloatingEpiLogosAgent;