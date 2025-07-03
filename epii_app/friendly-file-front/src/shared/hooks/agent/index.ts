/**
 * Agent Hooks Index
 * Central export point for all agent-related hooks and providers
 */

// Context Provider
export { AgentContextProvider, useAgentContext as useAgentContextProvider } from './AgentContextProvider';

// Action Registry
export { agentActionRegistry } from './AgentActionRegistry';
export type { 
  ActionDefinition, 
  ActionParameter, 
  ActionExecutionResult 
} from './AgentActionRegistry';

// Hooks
export { useAgentContext } from './useAgentContext';
export { useAgentAction } from './useAgentAction';

// Types
export type { AgentContextHook } from './useAgentContext';
export type { AgentActionHook } from './useAgentAction';