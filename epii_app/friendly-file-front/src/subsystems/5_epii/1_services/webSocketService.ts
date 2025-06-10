/**
 * WebSocket Service
 * Bimba Coordinate: #5-1-1-2
 *
 * Provides WebSocket connection to the backend for real-time updates.
 */

import documentCacheService from './documentCacheService';

// Define WebSocket message types
interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// Define WebSocket event types
interface DocumentCacheUpdateEvent {
  type: 'document_cache_update';
  documentId: string;
  analysisResults: any;
  timestamp: string;
}

// AG-UI Event types
interface AGUIEvent {
  type: string;
  runId?: string;
  threadId?: string;
  targetCoordinate?: string;
  [key: string]: any;
}

// AG-UI Event handlers
type AGUIEventHandler = (event: AGUIEvent) => void;
const aguiEventHandlers = new Map<string, AGUIEventHandler[]>();

// WebSocket connection state
let socket: WebSocket | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

/**
 * Initialize WebSocket connection with AG-UI support
 * Connects to the A2A server with AG-UI Gateway integration
 */
export const initializeWebSocket = (): void => {
  console.log('🚀 Initializing WebSocket connection with AG-UI support...');

  // A2A server URL with AG-UI Gateway
  const wsUrl = import.meta.env.VITE_A2A_WS_URL || 'ws://localhost:3033';

  // Close existing connection if any
  if (socket) {
    socket.close();
  }

  // Create new WebSocket connection to A2A server
  socket = new WebSocket(wsUrl);

  // Connection opened
  socket.addEventListener('open', () => {
    console.log('✅ WebSocket connection established with A2A server');
    isConnected = true;
    reconnectAttempts = 0;

    // Register as frontend client with AG-UI capabilities
    const registrationMessage = {
      type: 'registration',
      agentId: 'frontend-client',
      agentName: 'Frontend Client',
      capabilities: ['ag-ui-events', 'bimba-updates', 'document-analysis', 'chat']
    };

    sendWebSocketMessage(registrationMessage);
  });

  // Connection closed
  socket.addEventListener('close', (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    isConnected = false;

    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(initializeWebSocket, RECONNECT_DELAY);
    }
  });

  // Connection error
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

  // Listen for messages
  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });
};

/**
 * Handle WebSocket messages with AG-UI support
 * @param data Message data
 */
const handleWebSocketMessage = (data: WebSocketMessage): void => {
  console.log('📨 Received WebSocket message:', data);

  // Handle AG-UI events
  if (isAGUIEvent(data)) {
    console.log('✅ Identified as AG-UI event:', data.type);
    handleAGUIEvent(data as AGUIEvent);
    return;
  } else {
    console.log('❌ Not identified as AG-UI event. Type:', data.type);
    console.log('🔍 Available AG-UI event types:', [
      'BimbaUpdateSuggestions', 'BimbaAnalysisProgress', 'BimbaContextUpdate',
      'RunStarted', 'RunFinished', 'RunError', 'StepStarted', 'StepFinished'
    ]);
  }

  // Handle traditional message types
  switch (data.type) {
    case 'registration_confirmation':
      console.log('✅ Registration confirmed with A2A server');
      console.log('📡 Client should now be visible to AG-UI Gateway');

      // Immediately subscribe to all AG-UI events so we're ready to receive them
      console.log('🔔 Auto-subscribing to all AG-UI events...');
      subscribeToAGUIEvents('*'); // Subscribe to all events
      break;

    case 'ag-ui-registration-confirmation':
      console.log('✅ AG-UI registration confirmed');
      break;

    case 'ag-ui-subscription-confirmation':
      console.log('✅ AG-UI subscription confirmed:', data);
      break;

    case 'event':
      // Handle event messages
      handleEventMessage(data.event);
      break;

    case 'document_cache_update':
      // Handle document cache update directly
      handleDocumentCacheUpdate(data as DocumentCacheUpdateEvent);
      break;

    default:
      console.log(`Unhandled WebSocket message type: ${data.type}`);
  }
};

/**
 * Check if message is an AG-UI event
 */
const isAGUIEvent = (data: WebSocketMessage): boolean => {
  const aguiEventTypes = [
    'BimbaUpdateSuggestions',
    'BimbaAnalysisProgress',
    'BimbaContextUpdate',
    'RunStarted',
    'RunFinished',
    'RunError',
    'StepStarted',
    'StepFinished',
    // Document lifecycle AG-UI events
    'DocumentCreated',
    'DocumentUpdated',
    'DocumentDeleted',
    'DocumentAnalysisCompleted',
    'DocumentCoordinateAssigned',
    'DocumentServiceCreated',
    'DocumentServiceUpdated',
    'DocumentServiceDeleted',
    'DocumentServiceCreatedWithType',
    'PratibimbaCreated',
    'CoordinateDocumentsUpdated',
    'DocumentStateRefresh'
  ];

  return aguiEventTypes.includes(data.type);
};

/**
 * Handle AG-UI events
 */
const handleAGUIEvent = (event: AGUIEvent): void => {
  console.log(`🎯 Handling AG-UI event: ${event.type}`, event);

  // Call registered handlers for this event type
  const handlers = aguiEventHandlers.get(event.type) || [];
  handlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      console.error(`Error in AG-UI event handler for ${event.type}:`, error);
    }
  });

  // Call global handlers
  const globalHandlers = aguiEventHandlers.get('*') || [];
  globalHandlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      console.error(`Error in global AG-UI event handler:`, error);
    }
  });
};

/**
 * Handle event messages
 * @param event Event data
 */
const handleEventMessage = (event: any): void => {
  if (!event || !event.type) {
    console.warn('Received invalid event message:', event);
    return;
  }

  console.log(`Received event: ${event.type}`);

  // Handle different event types
  switch (event.type) {
    case 'document_cache_update':
      handleDocumentCacheUpdate(event as DocumentCacheUpdateEvent);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

/**
 * Handle document cache update events
 * @param event Document cache update event
 */
const handleDocumentCacheUpdate = (event: DocumentCacheUpdateEvent): void => {
  console.log(`Received document cache update for document ${event.documentId}`);

  // Update the document in the cache
  if (event.documentId && event.analysisResults) {
    documentCacheService.updateDocumentWithAnalysisResults(
      event.documentId,
      event.analysisResults
    );
  }
};

/**
 * Send a message to the WebSocket server
 * @param message Message to send
 * @returns True if the message was sent successfully
 */
export const sendWebSocketMessage = (message: WebSocketMessage): boolean => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected, cannot send message');
    return false;
  }

  try {
    socket.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
    return false;
  }
};

/**
 * Subscribe to AG-UI events
 * @param eventType Event type to subscribe to (or '*' for all events)
 * @param runId Optional run ID to filter events
 * @param threadId Optional thread ID to filter events
 */
export const subscribeToAGUIEvents = (eventType: string, runId?: string, threadId?: string): void => {
  const subscriptionMessage = {
    type: 'subscribe',
    eventType: eventType === '*' ? undefined : eventType,
    runId,
    threadId
  };

  sendWebSocketMessage(subscriptionMessage);
};

/**
 * Unsubscribe from AG-UI events
 * @param eventType Event type to unsubscribe from
 * @param runId Optional run ID
 * @param threadId Optional thread ID
 */
export const unsubscribeFromAGUIEvents = (eventType: string, runId?: string, threadId?: string): void => {
  const unsubscriptionMessage = {
    type: 'unsubscribe',
    eventType: eventType === '*' ? undefined : eventType,
    runId,
    threadId
  };

  sendWebSocketMessage(unsubscriptionMessage);
};

/**
 * Register an AG-UI event handler
 * @param eventType Event type to handle (or '*' for all events)
 * @param handler Handler function
 */
export const onAGUIEvent = (eventType: string, handler: AGUIEventHandler): void => {
  if (!aguiEventHandlers.has(eventType)) {
    aguiEventHandlers.set(eventType, []);
  }

  aguiEventHandlers.get(eventType)!.push(handler);

  console.log(`📝 Registered AG-UI event handler for: ${eventType}`);
};

/**
 * Remove an AG-UI event handler
 * @param eventType Event type
 * @param handler Handler function to remove
 */
export const offAGUIEvent = (eventType: string, handler: AGUIEventHandler): void => {
  const handlers = aguiEventHandlers.get(eventType);
  if (handlers) {
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      console.log(`🗑️ Removed AG-UI event handler for: ${eventType}`);
    }
  }
};

/**
 * Execute a skill via A2A with AG-UI support
 * @param skillId Skill ID to execute
 * @param parameters Skill parameters
 * @param context Execution context
 * @param aguiOptions AG-UI options (runId, threadId, etc.)
 */
export const executeSkillWithAGUI = (
  skillId: string,
  parameters: any,
  context: any = {},
  aguiOptions: { runId?: string; threadId?: string; enableAGUI?: boolean } = {}
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isConnected) {
      reject(new Error('WebSocket not connected'));
      return;
    }

    const requestId = Date.now().toString();
    const { runId, threadId, enableAGUI = true } = aguiOptions;

    // Enhanced parameters with AG-UI metadata
    const enhancedParameters = {
      ...parameters,
      ...(enableAGUI && runId ? { aguiRunId: runId } : {}),
      ...(enableAGUI && threadId ? { aguiThreadId: threadId } : {})
    };

    // Enhanced context with AG-UI metadata
    const enhancedContext = {
      ...context,
      ...(enableAGUI ? { aguiMetadata: { runId, threadId, enableAGUI } } : {})
    };

    const skillRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'executeSkill',
      params: {
        skillId,
        parameters: enhancedParameters,
        context: enhancedContext
      }
    };

    // Set up response handler
    const responseHandler = (event: any) => {
      if (event.data) {
        try {
          const message = JSON.parse(event.data);
          if (message.jsonrpc === '2.0' && message.id === requestId) {
            socket?.removeEventListener('message', responseHandler);

            if (message.result) {
              resolve(message.result);
            } else if (message.error) {
              reject(new Error(message.error.message || 'Skill execution failed'));
            }
          }
        } catch (error) {
          // Ignore parsing errors for other messages
        }
      }
    };

    socket?.addEventListener('message', responseHandler);

    // Send the request
    if (!sendWebSocketMessage(skillRequest)) {
      socket?.removeEventListener('message', responseHandler);
      reject(new Error('Failed to send skill execution request'));
    }

    // Set timeout based on skill type
    // Analysis pipeline needs longer timeout due to LLM operations in stage -1
    const timeoutDuration = skillId === 'epii-analysis-pipeline' ? 300000 : 30000; // 5 minutes for analysis, 30s for others

    setTimeout(() => {
      socket?.removeEventListener('message', responseHandler);
      reject(new Error('Skill execution timeout'));
    }, timeoutDuration);
  });
};

/**
 * Check if WebSocket is connected
 * @returns True if connected
 */
export const isWebSocketConnected = (): boolean => {
  return isConnected;
};

// Initialize WebSocket connection when the service is imported
initializeWebSocket();

// Export the WebSocket service with AG-UI support
const webSocketService = {
  initializeWebSocket,
  sendWebSocketMessage,
  isWebSocketConnected,
  subscribeToAGUIEvents,
  unsubscribeFromAGUIEvents,
  onAGUIEvent,
  offAGUIEvent,
  executeSkillWithAGUI
};

export default webSocketService;
