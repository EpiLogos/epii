/**
 * Agent Action Registry
 * Centralized registry for frontend actions that agents can invoke
 * Provides type-safe action definitions and execution
 */

import documentCacheService from '../../services/documentCacheService';

// Type definitions
export interface ActionDefinition {
  id: string;
  name: string;
  description: string;
  category: 'document' | 'navigation' | 'ui' | 'state' | 'notification';
  parameters: Record<string, ActionParameter>;
  handler: (parameters: any) => Promise<any>;
  targetComponents?: string[];
  requiresPermission?: boolean;
}

export interface ActionParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  validation?: (value: any) => boolean | string;
}

export interface ActionExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  timestamp: string;
  actionId: string;
  parameters: any;
}

// Action registry class
class AgentActionRegistry {
  private actions = new Map<string, ActionDefinition>();
  private executionHistory: ActionExecutionResult[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.registerDefaultActions();
  }

  /**
   * Register a new action
   */
  registerAction(action: ActionDefinition): void {
    this.actions.set(action.id, action);
    console.log(`[AgentActionRegistry] Registered action: ${action.id}`);
  }

  /**
   * Unregister an action
   */
  unregisterAction(actionId: string): boolean {
    const result = this.actions.delete(actionId);
    if (result) {
      console.log(`[AgentActionRegistry] Unregistered action: ${actionId}`);
    }
    return result;
  }

  /**
   * Get action definition
   */
  getAction(actionId: string): ActionDefinition | undefined {
    return this.actions.get(actionId);
  }

  /**
   * Get all registered actions
   */
  getAllActions(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  /**
   * Get actions by category
   */
  getActionsByCategory(category: string): ActionDefinition[] {
    return Array.from(this.actions.values()).filter(action => action.category === category);
  }

  /**
   * Execute an action with validation
   */
  async executeAction(actionId: string, parameters: any = {}): Promise<ActionExecutionResult> {
    const timestamp = new Date().toISOString();
    const result: ActionExecutionResult = {
      success: false,
      actionId,
      parameters,
      timestamp
    };

    try {
      // Get action definition
      const action = this.actions.get(actionId);
      if (!action) {
        throw new Error(`Action '${actionId}' not found`);
      }

      // Validate parameters
      const validationResult = this.validateParameters(action, parameters);
      if (!validationResult.valid) {
        throw new Error(`Parameter validation failed: ${validationResult.error}`);
      }

      // Execute action
      console.log(`[AgentActionRegistry] Executing action '${actionId}':`, parameters);
      const actionResult = await action.handler(parameters);

      result.success = true;
      result.result = actionResult;

    } catch (error) {
      console.error(`[AgentActionRegistry] Action '${actionId}' failed:`, error);
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Add to execution history
    this.addToHistory(result);

    return result;
  }

  /**
   * Validate action parameters
   */
  private validateParameters(action: ActionDefinition, parameters: any): { valid: boolean; error?: string } {
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
      if (!this.validateType(value, paramDef.type)) {
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
  }

  /**
   * Validate parameter type
   */
  private validateType(value: any, expectedType: string): boolean {
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
  }

  /**
   * Add execution result to history
   */
  private addToHistory(result: ActionExecutionResult): void {
    this.executionHistory.push(result);
    
    // Trim history if too large
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory = this.executionHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit?: number): ActionExecutionResult[] {
    if (limit) {
      return this.executionHistory.slice(-limit);
    }
    return [...this.executionHistory];
  }

  /**
   * Register default actions available to agents
   */
  private registerDefaultActions(): void {
    // Document actions
    this.registerAction({
      id: 'selectDocument',
      name: 'Select Document',
      description: 'Select and focus a document in the canvas',
      category: 'document',
      targetComponents: ['documentCanvas'],
      parameters: {
        documentId: {
          type: 'string',
          description: 'Unique identifier of the document to select',
          required: true
        },
        highlight: {
          type: 'boolean',
          description: 'Whether to highlight the selected document',
          default: true
        }
      },
      handler: async ({ documentId, highlight = true }) => {
        // Get document from cache
        const document = documentCacheService.getDocumentById(documentId);
        if (!document) {
          throw new Error(`Document with ID '${documentId}' not found`);
        }

        // Emit selection event
        window.dispatchEvent(new CustomEvent('agent:documentSelected', {
          detail: { documentId, document, highlight }
        }));

        return { success: true, documentId, highlighted: highlight };
      }
    });

    this.registerAction({
      id: 'highlightText',
      name: 'Highlight Text',
      description: 'Highlight specific text in the current document',
      category: 'document',
      targetComponents: ['documentCanvas'],
      parameters: {
        text: {
          type: 'string',
          description: 'Text to highlight',
          required: true
        },
        color: {
          type: 'string',
          description: 'Highlight color',
          default: 'yellow',
          enum: ['yellow', 'blue', 'green', 'red', 'purple']
        }
      },
      handler: async ({ text, color = 'yellow' }) => {
        window.dispatchEvent(new CustomEvent('agent:highlightText', {
          detail: { text, color }
        }));
        return { success: true, text, color };
      }
    });

    // Navigation actions
    this.registerAction({
      id: 'navigateToCoordinate',
      name: 'Navigate to Coordinate',
      description: 'Navigate to a specific Bimba coordinate in the visualization',
      category: 'navigation',
      targetComponents: ['meta2d', 'meta3d'],
      parameters: {
        coordinate: {
          type: 'string',
          description: 'Bimba coordinate to navigate to (e.g., #5-1-2)',
          required: true,
          validation: (value: string) => {
            return /^#\d+(-\d+)*$/.test(value) || 'Invalid Bimba coordinate format';
          }
        },
        centerView: {
          type: 'boolean',
          description: 'Whether to center the view on the coordinate',
          default: true
        }
      },
      handler: async ({ coordinate, centerView = true }) => {
        window.dispatchEvent(new CustomEvent('agent:navigateToCoordinate', {
          detail: { coordinate, centerView }
        }));
        return { success: true, coordinate, centered: centerView };
      }
    });

    // UI actions
    this.registerAction({
      id: 'showNotification',
      name: 'Show Notification',
      description: 'Display a notification to the user',
      category: 'notification',
      parameters: {
        message: {
          type: 'string',
          description: 'Notification message',
          required: true
        },
        type: {
          type: 'string',
          description: 'Notification type',
          default: 'info',
          enum: ['info', 'success', 'warning', 'error']
        },
        duration: {
          type: 'number',
          description: 'Duration in milliseconds (0 for persistent)',
          default: 5000
        }
      },
      handler: async ({ message, type = 'info', duration = 5000 }) => {
        window.dispatchEvent(new CustomEvent('agent:showNotification', {
          detail: { message, type, duration }
        }));
        return { success: true, message, type, duration };
      }
    });

    this.registerAction({
      id: 'openPanel',
      name: 'Open Panel',
      description: 'Open a specific UI panel or dialog',
      category: 'ui',
      parameters: {
        panelId: {
          type: 'string',
          description: 'Identifier of the panel to open',
          required: true,
          enum: ['nodeDetails', 'documentDetails', 'settings', 'help']
        },
        data: {
          type: 'object',
          description: 'Data to pass to the panel',
          default: {}
        }
      },
      handler: async ({ panelId, data = {} }) => {
        window.dispatchEvent(new CustomEvent('agent:openPanel', {
          detail: { panelId, data }
        }));
        return { success: true, panelId, data };
      }
    });

    // State management actions  
    this.registerAction({
      id: 'updateComponentState',
      name: 'Update Component State',
      description: 'Update the state of a specific component',
      category: 'state',
      parameters: {
        componentId: {
          type: 'string',
          description: 'Identifier of the component to update',
          required: true
        },
        stateDelta: {
          type: 'object',
          description: 'State changes to apply',
          required: true
        },
        merge: {
          type: 'boolean',
          description: 'Whether to merge with existing state or replace',
          default: true
        }
      },
      handler: async ({ componentId, stateDelta, merge = true }) => {
        window.dispatchEvent(new CustomEvent('agent:updateComponentState', {
          detail: { componentId, stateDelta, merge }
        }));
        return { success: true, componentId, stateDelta, merge };
      }
    });

    console.log(`[AgentActionRegistry] Registered ${this.actions.size} default actions`);
  }
}

// Create singleton instance
export const agentActionRegistry = new AgentActionRegistry();

export default agentActionRegistry;