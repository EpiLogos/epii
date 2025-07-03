/**
 * useAgentContext Hook
 * Custom hook for accessing agent context and state
 * Provides convenient interface for agent communication
 */

import { useCallback, useEffect, useState } from 'react';
import { useAgentContext as useAgentContextProvider } from './AgentContextProvider';
import { agentActionRegistry, ActionExecutionResult } from './AgentActionRegistry';
import { emitAGUIEvent, onAGUIEvent, requestFrontendContext } from '../../../epi-logos-system/3_services/webSocketService';

// Types
export interface AgentContextHook {
  // Current state
  isConnected: boolean;
  currentAgent: string | null;
  activeRuns: string[];
  lastActivity: Date | null;
  
  // Agent lifecycle
  startRun: (agentId: string, metadata?: Record<string, any>) => string;
  endRun: (runId: string, status?: 'completed' | 'error') => void;
  pauseRun: (runId: string) => void;
  resumeRun: (runId: string) => void;
  
  // Context management
  getContext: (key?: string) => any;
  setContext: (key: string, value: any) => void;
  requestRemoteContext: (componentId?: string, contextType?: string) => Promise<any>;
  
  // Action execution
  executeAction: (actionId: string, parameters?: any) => Promise<ActionExecutionResult>;
  getAvailableActions: () => string[];
  
  // Messages
  sendMessage: (runId: string, content: string, type?: 'user' | 'agent' | 'system') => void;
  getMessages: (runId: string) => any[];
  
  // Events
  emitEvent: (eventType: string, payload: any, metadata?: any) => boolean;
  subscribeToEvent: (eventType: string, handler: (event: any) => void) => void;
  
  // Utilities
  isRunActive: (runId: string) => boolean;
  getRunStatus: (runId: string) => string | null;
}

export const useAgentContext = (): AgentContextHook => {
  const context = useAgentContextProvider();
  const [availableActions, setAvailableActions] = useState<string[]>([]);

  // Update available actions when registry changes
  useEffect(() => {
    const updateActions = () => {
      const actions = agentActionRegistry.getAllActions().map(action => action.id);
      setAvailableActions(actions);
    };

    updateActions();
    // You might want to listen for registry changes here
  }, []);

  // Agent lifecycle methods
  const startRun = useCallback((agentId: string, metadata?: Record<string, any>): string => {
    return context.actions.startAgentRun(agentId, metadata);
  }, [context.actions]);

  const endRun = useCallback((runId: string, status: 'completed' | 'error' = 'completed') => {
    context.actions.endAgentRun(runId, status);
  }, [context.actions]);

  const pauseRun = useCallback((runId: string) => {
    context.actions.pauseAgentRun(runId);
  }, [context.actions]);

  const resumeRun = useCallback((runId: string) => {
    context.actions.resumeAgentRun(runId);
  }, [context.actions]);

  // Context management
  const getContext = useCallback((key?: string) => {
    return context.actions.getGlobalContext(key);
  }, [context.actions]);

  const setContext = useCallback((key: string, value: any) => {
    context.actions.updateGlobalContext(key, value);
  }, [context.actions]);

  const requestRemoteContext = useCallback(async (componentId?: string, contextType?: string) => {
    return context.actions.requestContext(componentId, contextType);
  }, [context.actions]);

  // Action execution
  const executeAction = useCallback(async (actionId: string, parameters: any = {}): Promise<ActionExecutionResult> => {
    try {
      const result = await agentActionRegistry.executeAction(actionId, parameters);
      
      // Emit AG-UI event for action execution
      emitAGUIEvent('frontend:invokeAction', {
        actionId,
        parameters,
        result: result.success,
        timestamp: result.timestamp
      });
      
      return result;
    } catch (error) {
      const errorResult: ActionExecutionResult = {
        success: false,
        actionId,
        parameters,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      return errorResult;
    }
  }, []);

  const getAvailableActions = useCallback(() => {
    return availableActions;
  }, [availableActions]);

  // Message handling
  const sendMessage = useCallback((runId: string, content: string, type: 'user' | 'agent' | 'system' = 'user') => {
    context.actions.addMessage(runId, {
      type,
      content,
      metadata: { source: 'useAgentContext' }
    });
  }, [context.actions]);

  const getMessages = useCallback((runId: string) => {
    return context.actions.getMessages(runId);
  }, [context.actions]);

  // Event handling
  const emitEvent = useCallback((eventType: string, payload: any, metadata?: any): boolean => {
    return context.actions.emitEvent(eventType, payload, metadata);
  }, [context.actions]);

  const subscribeToEvent = useCallback((eventType: string, handler: (event: any) => void) => {
    context.actions.subscribeToEvent(eventType, handler);
  }, [context.actions]);

  // Utility methods
  const isRunActive = useCallback((runId: string): boolean => {
    const run = context.state.activeRuns.get(runId);
    return run ? ['starting', 'running'].includes(run.status) : false;
  }, [context.state.activeRuns]);

  const getRunStatus = useCallback((runId: string): string | null => {
    const run = context.state.activeRuns.get(runId);
    return run?.status || null;
  }, [context.state.activeRuns]);

  // Derived state
  const activeRuns = Array.from(context.state.activeRuns.keys());

  return {
    // State
    isConnected: context.state.isConnected,
    currentAgent: context.state.currentAgent,
    activeRuns,
    lastActivity: context.state.lastActivity,
    
    // Methods
    startRun,
    endRun,
    pauseRun,
    resumeRun,
    getContext,
    setContext,
    requestRemoteContext,
    executeAction,
    getAvailableActions,
    sendMessage,
    getMessages,
    emitEvent,
    subscribeToEvent,
    isRunActive,
    getRunStatus
  };
};

export default useAgentContext;