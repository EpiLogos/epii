/**
 * Execute Frontend Action Skill
 * Bimba Coordinate: #
 * 
 * Universal A2A skill for executing frontend actions through AG-UI events.
 * Part of the Epi-Logos Universal Orchestrator Agent at root coordinate "#".
 * Implements fire-and-forget pattern for agent-to-frontend action invocation.
 * Follows semantic separation: agent awareness of frontend capabilities.
 */

// Note: FrontendContextManager is in the backend, not directly importable from A2A layer
// We'll handle AG-UI event emission through the A2A gateway instead

class ExecuteFrontendActionSkill {
  constructor() {
    this.skillId = 'execute-frontend-action';
    this.bimbaCoordinate = '#';
    this.a2aGateway = null;
    
    // Set up AG-UI event emission through the A2A gateway
    this.setupAGUIIntegration();
  }

  /**
   * Get skill metadata for registration
   */
  getSkillMetadata() {
    return {
      id: this.skillId,
      name: 'Execute Frontend Action',
      description: 'Execute actions on frontend components through AG-UI events',
      bimbaCoordinate: this.bimbaCoordinate,
      agentId: 'epi-logos-agent',
      category: 'frontend-interaction',
      version: '1.0.0',
      
      parameters: {
        actionId: {
          type: 'string',
          description: 'Unique identifier for the frontend action to execute',
          required: true,
          examples: ['selectDocument', 'highlightText', 'openPanel', 'navigateToCoordinate']
        },
        targetComponent: {
          type: 'string', 
          description: 'Frontend component to target for the action',
          required: false,
          examples: ['documentCanvas', 'meta2d', 'meta3d', 'floatingAgent']
        },
        parameters: {
          type: 'object',
          description: 'Parameters to pass to the frontend action',
          required: false,
          default: {}
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for AG-UI event routing',
          required: false,
          properties: {
            runId: { type: 'string', description: 'AG-UI run identifier' },
            threadId: { type: 'string', description: 'AG-UI thread identifier' },
            bimbaCoordinates: { type: 'array', description: 'Related Bimba coordinates' }
          }
        }
      },

      returns: {
        type: 'object',
        description: 'Action execution confirmation (fire-and-forget)',
        properties: {
          success: { type: 'boolean' },
          actionId: { type: 'string' },
          targetComponent: { type: 'string' },
          timestamp: { type: 'string' },
          agUIEventId: { type: 'string' }
        }
      },

      examples: [
        {
          name: 'Select document in canvas',
          parameters: {
            actionId: 'selectDocument',
            targetComponent: 'documentCanvas',
            parameters: { documentId: 'doc123', highlight: true }
          }
        },
        {
          name: 'Navigate to Bimba coordinate',
          parameters: {
            actionId: 'navigateToCoordinate',
            targetComponent: 'meta2d',
            parameters: { coordinate: '#5-1-2', centerView: true }
          }
        },
        {
          name: 'Show notification',
          parameters: {
            actionId: 'showNotification',
            parameters: { 
              message: 'Analysis complete', 
              type: 'success',
              duration: 5000 
            }
          }
        }
      ]
    };
  }

  /**
   * Set up AG-UI integration for event emission
   */
  setupAGUIIntegration() {
    // AG-UI integration will be set up when A2A gateway is connected
    console.log('[ExecuteFrontendActionSkill] AG-UI integration ready for gateway connection');
  }

  /**
   * Execute the skill - fire frontend action via AG-UI event
   */
  async execute(parameters, context = {}) {
    console.log(`[ExecuteFrontendActionSkill] Executing frontend action:`, parameters);

    const { 
      actionId, 
      targetComponent, 
      parameters: actionParams = {}, 
      metadata = {} 
    } = parameters;

    try {
      // Validate required parameters
      if (!actionId) {
        throw new Error('actionId is required for frontend action execution');
      }

      // Generate AG-UI event for frontend action
      const agUIEventId = this.generateEventId();
      const timestamp = new Date().toISOString();

      const agUIEvent = {
        type: 'frontend:invokeAction',
        requestId: agUIEventId,
        timestamp,
        metadata: {
          runId: metadata.runId || context.aguiRunId,
          threadId: metadata.threadId || context.aguiThreadId,
          bimbaCoordinates: metadata.bimbaCoordinates || context.bimbaCoordinates,
          skillId: this.skillId,
          skillCoordinate: this.bimbaCoordinate,
          ...metadata
        },
        payload: {
          actionId,
          parameters: actionParams,
          targetComponent,
          timestamp
        }
      };

      // Emit AG-UI event (fire-and-forget)
      const emissionSuccess = this.emitAGUIEvent(agUIEvent);

      // Prepare response
      const response = {
        success: emissionSuccess,
        actionId,
        targetComponent: targetComponent || 'global',
        timestamp,
        agUIEventId,
        eventType: 'frontend:invokeAction',
        
        // Fire-and-forget confirmation
        message: emissionSuccess 
          ? `Frontend action '${actionId}' sent successfully via AG-UI`
          : `Failed to emit AG-UI event for action '${actionId}'`
      };

      console.log(`[ExecuteFrontendActionSkill] Action execution result:`, response);
      return response;

    } catch (error) {
      console.error(`[ExecuteFrontendActionSkill] Error executing frontend action:`, error);
      
      return {
        success: false,
        actionId: actionId || 'unknown',
        targetComponent: targetComponent || 'unknown',
        timestamp: new Date().toISOString(),
        error: error.message,
        message: `Frontend action execution failed: ${error.message}`
      };
    }
  }

  /**
   * Emit AG-UI event through A2A gateway
   */
  emitAGUIEvent(event) {
    try {
      // This will be connected to the A2A WebSocket gateway
      if (this.a2aGateway) {
        this.a2aGateway.emitAGUIEvent(event);
        return true;
      } else {
        // Fallback: emit through context manager for now
        console.log(`[ExecuteFrontendActionSkill] Emitting AG-UI event:`, event);
        
        // This should eventually go through the actual A2A gateway
        // For now, we'll use the event system
        if (typeof process !== 'undefined' && process.emit) {
          process.emit('agui-event', event);
        }
        
        return true;
      }
    } catch (error) {
      console.error(`[ExecuteFrontendActionSkill] Failed to emit AG-UI event:`, error);
      return false;
    }
  }

  /**
   * Set A2A gateway reference for AG-UI event emission
   */
  setA2AGateway(gateway) {
    this.a2aGateway = gateway;
    console.log(`[ExecuteFrontendActionSkill] A2A gateway connected`);
  }

  /**
   * Generate unique event ID
   */
  generateEventId() {
    return `frontend_action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get available frontend actions (this could be enhanced to be dynamic)
   */
  getAvailableFrontendActions() {
    return [
      {
        actionId: 'selectDocument',
        description: 'Select and focus a document in the canvas',
        targetComponents: ['documentCanvas'],
        parameters: {
          documentId: { type: 'string', required: true },
          highlight: { type: 'boolean', default: true }
        }
      },
      {
        actionId: 'highlightText',
        description: 'Highlight specific text in a document',
        targetComponents: ['documentCanvas'],
        parameters: {
          text: { type: 'string', required: true },
          color: { type: 'string', default: 'yellow' }
        }
      },
      {
        actionId: 'navigateToCoordinate',
        description: 'Navigate to a specific Bimba coordinate',
        targetComponents: ['meta2d', 'meta3d'],
        parameters: {
          coordinate: { type: 'string', required: true },
          centerView: { type: 'boolean', default: true }
        }
      },
      {
        actionId: 'showNotification',
        description: 'Display a notification to the user',
        targetComponents: ['global'],
        parameters: {
          message: { type: 'string', required: true },
          type: { type: 'string', enum: ['info', 'success', 'warning', 'error'], default: 'info' },
          duration: { type: 'number', default: 5000 }
        }
      },
      {
        actionId: 'openPanel',
        description: 'Open a specific UI panel',
        targetComponents: ['global'],
        parameters: {
          panelId: { type: 'string', required: true },
          data: { type: 'object', default: {} }
        }
      },
      {
        actionId: 'updateComponentState',
        description: 'Update state of a specific component',
        targetComponents: ['any'],
        parameters: {
          stateDelta: { type: 'object', required: true },
          merge: { type: 'boolean', default: true }
        }
      }
    ];
  }

  /**
   * Validate action parameters against available actions
   */
  validateActionParameters(actionId, parameters, targetComponent) {
    const availableActions = this.getAvailableFrontendActions();
    const action = availableActions.find(a => a.actionId === actionId);
    
    if (!action) {
      throw new Error(`Unknown frontend action: ${actionId}`);
    }

    // Validate target component
    if (targetComponent && action.targetComponents.length > 0 && 
        !action.targetComponents.includes('any') && 
        !action.targetComponents.includes(targetComponent)) {
      throw new Error(`Action '${actionId}' not supported for component '${targetComponent}'. Supported: ${action.targetComponents.join(', ')}`);
    }

    // Validate required parameters
    if (action.parameters) {
      for (const [paramName, paramConfig] of Object.entries(action.parameters)) {
        if (paramConfig.required && !parameters.hasOwnProperty(paramName)) {
          throw new Error(`Required parameter '${paramName}' missing for action '${actionId}'`);
        }
      }
    }

    return true;
  }

  /**
   * Get skill status and diagnostics
   */
  getStatus() {
    return {
      skillId: this.skillId,
      coordinate: this.bimbaCoordinate,
      status: 'active',
      a2aGatewayConnected: !!this.a2aGateway,
      availableActions: this.getAvailableFrontendActions().length,
      lastActivity: new Date().toISOString()
    };
  }
}

module.exports = ExecuteFrontendActionSkill;