/**
 * useAgentAction Hook
 * Custom hook for registering and executing agent actions
 * Provides type-safe action management and execution tracking
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { agentActionRegistry, ActionDefinition, ActionExecutionResult } from './AgentActionRegistry';
import { registerFrontendAction, unregisterFrontendAction } from '../../../epi-logos-system/3_services/webSocketService';

// Types
export interface AgentActionHook {
  // Action registration
  registerAction: (actionDefinition: ActionDefinition) => void;
  unregisterAction: (actionId: string) => void;
  
  // Action execution
  executeAction: (actionId: string, parameters?: any) => Promise<ActionExecutionResult>;
  
  // Action queries
  getAction: (actionId: string) => ActionDefinition | undefined;
  getAllActions: () => ActionDefinition[];
  getActionsByCategory: (category: string) => ActionDefinition[];
  
  // Execution tracking
  executionHistory: ActionExecutionResult[];
  isExecuting: boolean;
  lastExecutionResult: ActionExecutionResult | null;
  
  // Utilities
  validateParameters: (actionId: string, parameters: any) => { valid: boolean; error?: string };
  getActionInfo: (actionId: string) => ActionInfo | null;
}

interface ActionInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  parameterCount: number;
  requiredParameters: string[];
  optionalParameters: string[];
  targetComponents: string[];
}

export const useAgentAction = (): AgentActionHook => {
  const [executionHistory, setExecutionHistory] = useState<ActionExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutionResult, setLastExecutionResult] = useState<ActionExecutionResult | null>(null);
  const registeredActionsRef = useRef<Set<string>>(new Set());

  // Load initial execution history
  useEffect(() => {
    const history = agentActionRegistry.getExecutionHistory();
    setExecutionHistory(history);
  }, []);

  // Register action with both local registry and WebSocket service
  const registerAction = useCallback((actionDefinition: ActionDefinition) => {
    // Register with local registry
    agentActionRegistry.registerAction(actionDefinition);
    
    // Register with WebSocket service for agent communication
    registerFrontendAction(actionDefinition.id, actionDefinition.handler);
    
    // Track registered actions for cleanup
    registeredActionsRef.current.add(actionDefinition.id);
    
    console.log(`[useAgentAction] Registered action: ${actionDefinition.id}`);
  }, []);

  // Unregister action from both registries
  const unregisterAction = useCallback((actionId: string) => {
    // Unregister from local registry
    agentActionRegistry.unregisterAction(actionId);
    
    // Unregister from WebSocket service
    unregisterFrontendAction(actionId);
    
    // Remove from tracking
    registeredActionsRef.current.delete(actionId);
    
    console.log(`[useAgentAction] Unregistered action: ${actionId}`);
  }, []);

  // Execute action with tracking
  const executeAction = useCallback(async (actionId: string, parameters: any = {}): Promise<ActionExecutionResult> => {
    setIsExecuting(true);
    
    try {
      console.log(`[useAgentAction] Executing action '${actionId}':`, parameters);
      
      const result = await agentActionRegistry.executeAction(actionId, parameters);
      
      // Update tracking state
      setLastExecutionResult(result);
      setExecutionHistory(prev => [...prev, result].slice(-50)); // Keep last 50 results
      
      if (result.success) {
        console.log(`[useAgentAction] Action '${actionId}' completed successfully:`, result.result);
      } else {
        console.error(`[useAgentAction] Action '${actionId}' failed:`, result.error);
      }
      
      return result;
    } catch (error) {
      const errorResult: ActionExecutionResult = {
        success: false,
        actionId,
        parameters,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setLastExecutionResult(errorResult);
      setExecutionHistory(prev => [...prev, errorResult].slice(-50));
      
      console.error(`[useAgentAction] Action '${actionId}' threw error:`, error);
      return errorResult;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  // Get action definition
  const getAction = useCallback((actionId: string): ActionDefinition | undefined => {
    return agentActionRegistry.getAction(actionId);
  }, []);

  // Get all actions
  const getAllActions = useCallback((): ActionDefinition[] => {
    return agentActionRegistry.getAllActions();
  }, []);

  // Get actions by category
  const getActionsByCategory = useCallback((category: string): ActionDefinition[] => {
    return agentActionRegistry.getActionsByCategory(category);
  }, []);

  // Validate parameters for an action
  const validateParameters = useCallback((actionId: string, parameters: any): { valid: boolean; error?: string } => {
    const action = agentActionRegistry.getAction(actionId);
    if (!action) {
      return { valid: false, error: `Action '${actionId}' not found` };
    }

    // Use the registry's internal validation method
    try {
      // We need to access the private method, so we'll replicate the validation logic
      for (const [paramName, paramDef] of Object.entries(action.parameters)) {
        const value = parameters[paramName];

        // Check required parameters
        if (paramDef.required && (value === undefined || value === null)) {
          return { valid: false, error: `Required parameter '${paramName}' is missing` };
        }

        // Skip validation for optional undefined parameters
        if (value === undefined || value === null) {
          continue;
        }

        // Type validation
        if (!validateType(value, paramDef.type)) {
          return { valid: false, error: `Parameter '${paramName}' must be of type ${paramDef.type}` };
        }

        // Enum validation
        if (paramDef.enum && !paramDef.enum.includes(value)) {
          return { valid: false, error: `Parameter '${paramName}' must be one of: ${paramDef.enum.join(', ')}` };
        }

        // Custom validation
        if (paramDef.validation) {
          const validationResult = paramDef.validation(value);
          if (validationResult !== true) {
            return { 
              valid: false, 
              error: typeof validationResult === 'string' ? validationResult : `Parameter '${paramName}' validation failed` 
            };
          }
        }
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Validation error' };
    }
  }, []);

  // Helper function for type validation
  const validateType = (value: any, expectedType: string): boolean => {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  };

  // Get comprehensive action info
  const getActionInfo = useCallback((actionId: string): ActionInfo | null => {
    const action = agentActionRegistry.getAction(actionId);
    if (!action) {
      return null;
    }

    const parameters = Object.entries(action.parameters);
    const requiredParameters = parameters
      .filter(([_, def]) => def.required)
      .map(([name, _]) => name);
    const optionalParameters = parameters
      .filter(([_, def]) => !def.required)
      .map(([name, _]) => name);

    return {
      id: action.id,
      name: action.name,
      description: action.description,
      category: action.category,
      parameterCount: parameters.length,
      requiredParameters,
      optionalParameters,
      targetComponents: action.targetComponents || []
    };
  }, []);

  // Cleanup registered actions on unmount
  useEffect(() => {
    return () => {
      // Cleanup all actions registered by this hook instance
      for (const actionId of registeredActionsRef.current) {
        unregisterFrontendAction(actionId);
      }
    };
  }, []);

  return {
    registerAction,
    unregisterAction,
    executeAction,
    getAction,
    getAllActions,
    getActionsByCategory,
    executionHistory,
    isExecuting,
    lastExecutionResult,
    validateParameters,
    getActionInfo
  };
};

export default useAgentAction;