/**
 * Agent Context Provider
 * Provides global agent context and state management for the Epi-Logos system
 * Integrates with webSocketService for bidirectional agent-frontend communication
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { 
  onAGUIEvent, 
  requestFrontendContext, 
  registerFrontendAction,
  unregisterFrontendAction,
  emitAGUIEvent 
} from '../../../epi-logos-system/3_services/webSocketService';

// Types for agent context
interface AgentState {
  currentAgent: string | null;
  activeRuns: Map<string, AgentRun>;
  globalContext: Record<string, any>;
  registeredActions: Set<string>;
  isConnected: boolean;
  lastActivity: Date | null;
}

interface AgentRun {
  runId: string;
  agentId: string;
  status: 'starting' | 'running' | 'paused' | 'completed' | 'error';
  startTime: Date;
  endTime?: Date;
  metadata?: Record<string, any>;
  messages: AgentMessage[];
  context?: Record<string, any>;
}

interface AgentMessage {
  id: string;
  type: 'agent' | 'user' | 'system';
  content: string;
  timestamp: Date;
  runId?: string;
  metadata?: Record<string, any>;
}

interface AgentContextType {
  state: AgentState;
  actions: {
    // Agent lifecycle
    startAgentRun: (agentId: string, metadata?: Record<string, any>) => string;
    endAgentRun: (runId: string, status?: 'completed' | 'error') => void;
    pauseAgentRun: (runId: string) => void;
    resumeAgentRun: (runId: string) => void;
    
    // Context management
    updateGlobalContext: (key: string, value: any) => void;
    getGlobalContext: (key?: string) => any;
    requestContext: (componentId?: string, contextType?: string) => Promise<any>;
    
    // Action management
    registerAction: (actionId: string, handler: (params: any) => Promise<any>) => void;
    unregisterAction: (actionId: string) => void;
    executeAction: (actionId: string, parameters: any, targetComponent?: string) => Promise<any>;
    
    // Message handling
    addMessage: (runId: string, message: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
    getMessages: (runId: string) => AgentMessage[];
    
    // AG-UI events
    emitEvent: (eventType: string, payload: any, metadata?: any) => boolean;
    subscribeToEvent: (eventType: string, handler: (event: any) => void) => void;
  };
}

// Action types for reducer
type AgentAction =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CURRENT_AGENT'; payload: string | null }
  | { type: 'START_RUN'; payload: AgentRun }
  | { type: 'END_RUN'; payload: { runId: string; status: 'completed' | 'error'; endTime: Date } }
  | { type: 'PAUSE_RUN'; payload: string }
  | { type: 'RESUME_RUN'; payload: string }
  | { type: 'UPDATE_GLOBAL_CONTEXT'; payload: { key: string; value: any } }
  | { type: 'REGISTER_ACTION'; payload: string }
  | { type: 'UNREGISTER_ACTION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { runId: string; message: AgentMessage } }
  | { type: 'UPDATE_LAST_ACTIVITY' };

// Initial state
const initialState: AgentState = {
  currentAgent: null,
  activeRuns: new Map(),
  globalContext: {},
  registeredActions: new Set(),
  isConnected: false,
  lastActivity: null
};

// Reducer
const agentReducer = (state: AgentState, action: AgentAction): AgentState => {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
      
    case 'SET_CURRENT_AGENT':
      return { ...state, currentAgent: action.payload };
      
    case 'START_RUN': {
      const newRuns = new Map(state.activeRuns);
      newRuns.set(action.payload.runId, action.payload);
      return { 
        ...state, 
        activeRuns: newRuns,
        currentAgent: action.payload.agentId,
        lastActivity: new Date()
      };
    }
    
    case 'END_RUN': {
      const newRuns = new Map(state.activeRuns);
      const existingRun = newRuns.get(action.payload.runId);
      if (existingRun) {
        newRuns.set(action.payload.runId, {
          ...existingRun,
          status: action.payload.status,
          endTime: action.payload.endTime
        });
      }
      return { 
        ...state, 
        activeRuns: newRuns,
        lastActivity: new Date()
      };
    }
    
    case 'PAUSE_RUN': {
      const newRuns = new Map(state.activeRuns);
      const existingRun = newRuns.get(action.payload);
      if (existingRun) {
        newRuns.set(action.payload, { ...existingRun, status: 'paused' });
      }
      return { ...state, activeRuns: newRuns };
    }
    
    case 'RESUME_RUN': {
      const newRuns = new Map(state.activeRuns);
      const existingRun = newRuns.get(action.payload);
      if (existingRun) {
        newRuns.set(action.payload, { ...existingRun, status: 'running' });
      }
      return { ...state, activeRuns: newRuns };
    }
    
    case 'UPDATE_GLOBAL_CONTEXT':
      return {
        ...state,
        globalContext: {
          ...state.globalContext,
          [action.payload.key]: action.payload.value
        },
        lastActivity: new Date()
      };
      
    case 'REGISTER_ACTION': {
      const newActions = new Set(state.registeredActions);
      newActions.add(action.payload);
      return { ...state, registeredActions: newActions };
    }
    
    case 'UNREGISTER_ACTION': {
      const newActions = new Set(state.registeredActions);
      newActions.delete(action.payload);
      return { ...state, registeredActions: newActions };
    }
    
    case 'ADD_MESSAGE': {
      const newRuns = new Map(state.activeRuns);
      const existingRun = newRuns.get(action.payload.runId);
      if (existingRun) {
        newRuns.set(action.payload.runId, {
          ...existingRun,
          messages: [...existingRun.messages, action.payload.message]
        });
      }
      return { 
        ...state, 
        activeRuns: newRuns,
        lastActivity: new Date()
      };
    }
    
    case 'UPDATE_LAST_ACTIVITY':
      return { ...state, lastActivity: new Date() };
      
    default:
      return state;
  }
};

// Context
const AgentContext = createContext<AgentContextType | null>(null);

// Provider component
interface AgentContextProviderProps {
  children: ReactNode;
}

export const AgentContextProvider: React.FC<AgentContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  // Generate unique IDs
  const generateId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Agent lifecycle actions
  const startAgentRun = useCallback((agentId: string, metadata?: Record<string, any>): string => {
    const runId = generateId();
    const agentRun: AgentRun = {
      runId,
      agentId,
      status: 'starting',
      startTime: new Date(),
      messages: [],
      metadata,
      context: {}
    };
    
    dispatch({ type: 'START_RUN', payload: agentRun });
    
    // Emit AG-UI event for run start
    emitAGUIEvent('RunStarted', {
      runId,
      agentId,
      startTime: agentRun.startTime.toISOString(),
      metadata
    });
    
    return runId;
  }, [generateId]);

  const endAgentRun = useCallback((runId: string, status: 'completed' | 'error' = 'completed') => {
    const endTime = new Date();
    dispatch({ type: 'END_RUN', payload: { runId, status, endTime } });
    
    // Emit AG-UI event for run end
    emitAGUIEvent(status === 'completed' ? 'RunFinished' : 'RunError', {
      runId,
      endTime: endTime.toISOString(),
      status
    });
  }, []);

  const pauseAgentRun = useCallback((runId: string) => {
    dispatch({ type: 'PAUSE_RUN', payload: runId });
  }, []);

  const resumeAgentRun = useCallback((runId: string) => {
    dispatch({ type: 'RESUME_RUN', payload: runId });
  }, []);

  // Context management actions
  const updateGlobalContext = useCallback((key: string, value: any) => {
    dispatch({ type: 'UPDATE_GLOBAL_CONTEXT', payload: { key, value } });
  }, []);

  const getGlobalContext = useCallback((key?: string) => {
    if (key) {
      return state.globalContext[key];
    }
    return state.globalContext;
  }, [state.globalContext]);

  const requestContext = useCallback(async (componentId?: string, contextType?: string) => {
    try {
      const context = await requestFrontendContext(componentId, contextType);
      return context;
    } catch (error) {
      console.error('[AgentContextProvider] Failed to request context:', error);
      throw error;
    }
  }, []);

  // Action management
  const registerAction = useCallback((actionId: string, handler: (params: any) => Promise<any>) => {
    registerFrontendAction(actionId, handler);
    dispatch({ type: 'REGISTER_ACTION', payload: actionId });
  }, []);

  const unregisterAction = useCallback((actionId: string) => {
    unregisterFrontendAction(actionId);
    dispatch({ type: 'UNREGISTER_ACTION', payload: actionId });
  }, []);

  const executeAction = useCallback(async (actionId: string, parameters: any, targetComponent?: string) => {
    // This would trigger a frontend action - implementation depends on action registry
    console.log(`[AgentContextProvider] Executing action ${actionId}:`, parameters);
    
    // For now, just emit an AG-UI event
    return emitAGUIEvent('frontend:invokeAction', {
      actionId,
      parameters,
      targetComponent,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Message handling
  const addMessage = useCallback((runId: string, messageData: Omit<AgentMessage, 'id' | 'timestamp'>) => {
    const message: AgentMessage = {
      ...messageData,
      id: generateId(),
      timestamp: new Date(),
      runId
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: { runId, message } });
  }, [generateId]);

  const getMessages = useCallback((runId: string): AgentMessage[] => {
    const run = state.activeRuns.get(runId);
    return run?.messages || [];
  }, [state.activeRuns]);

  // AG-UI event handling
  const emitEvent = useCallback((eventType: string, payload: any, metadata?: any): boolean => {
    dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
    return emitAGUIEvent(eventType, payload, metadata);
  }, []);

  const subscribeToEvent = useCallback((eventType: string, handler: (event: any) => void) => {
    onAGUIEvent(eventType, handler);
  }, []);

  // Set up AG-UI event listeners
  useEffect(() => {
    // Listen for agent state updates
    const handleRunStarted = (event: any) => {
      dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
    };

    const handleRunFinished = (event: any) => {
      if (event.runId) {
        endAgentRun(event.runId, 'completed');
      }
    };

    const handleRunError = (event: any) => {
      if (event.runId) {
        endAgentRun(event.runId, 'error');
      }
    };

    // Subscribe to AG-UI events
    onAGUIEvent('RunStarted', handleRunStarted);
    onAGUIEvent('RunFinished', handleRunFinished);
    onAGUIEvent('RunError', handleRunError);

    // Set initial connection state
    dispatch({ type: 'SET_CONNECTED', payload: true });

    return () => {
      // Cleanup if needed
    };
  }, [endAgentRun]);

  // Context value
  const contextValue: AgentContextType = {
    state,
    actions: {
      startAgentRun,
      endAgentRun,
      pauseAgentRun,
      resumeAgentRun,
      updateGlobalContext,
      getGlobalContext,
      requestContext,
      registerAction,
      unregisterAction,
      executeAction,
      addMessage,
      getMessages,
      emitEvent,
      subscribeToEvent
    }
  };

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
};

// Hook to use agent context
export const useAgentContext = (): AgentContextType => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentContextProvider');
  }
  return context;
};

export default AgentContextProvider;