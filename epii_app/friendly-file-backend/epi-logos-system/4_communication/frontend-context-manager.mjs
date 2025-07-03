/**
 * Frontend Context Manager for Epi-Logos Agent
 * Handles agent awareness of frontend state - "What is the agent AWARE OF?"
 */

import { EventEmitter } from 'events';

class FrontendContextManager extends EventEmitter {
  constructor() {
    super();
    this.activeContexts = new Map();
    this.contextPromises = new Map();
    this.timeoutHandlers = new Map();
    this.defaultTimeout = 30000; // 30 seconds
  }

  /**
   * Get frontend context - core agent awareness function
   * This implements the semantic separation: agent awareness, not data operations
   */
  async getFrontendContext(componentId, contextType = 'fullState') {
    const requestId = this.generateRequestId();
    
    // Create promise for frontend response
    const contextPromise = new Promise((resolve, reject) => {
      // Set up timeout
      const timeoutId = setTimeout(() => {
        this.cleanupRequest(requestId);
        reject(new Error(`Frontend context request timed out after ${this.defaultTimeout}ms`));
      }, this.defaultTimeout);
      
      this.timeoutHandlers.set(requestId, timeoutId);
      
      // Store resolver for when frontend responds
      this.contextPromises.set(requestId, { resolve, reject, componentId, contextType });
    });

    // Emit AG-UI event to request frontend context
    const agUIEvent = {
      type: 'frontend:getContext',
      requestId,
      payload: {
        componentId,
        contextType,
        timestamp: new Date().toISOString()
      }
    };

    // This will be sent through the AG-UI gateway
    this.emit('agui-event', agUIEvent);
    
    return contextPromise;
  }

  /**
   * Handle frontend context response
   */
  handleFrontendContextResponse(eventData) {
    const { requestId, context, error } = eventData;
    
    const pendingRequest = this.contextPromises.get(requestId);
    if (!pendingRequest) {
      console.warn(`Received context response for unknown request: ${requestId}`);
      return;
    }

    this.cleanupRequest(requestId);

    if (error) {
      pendingRequest.reject(new Error(error));
    } else {
      // Store active context for agent awareness
      this.activeContexts.set(pendingRequest.componentId, {
        context,
        timestamp: new Date(),
        contextType: pendingRequest.contextType
      });
      
      pendingRequest.resolve(context);
    }
  }

  /**
   * Execute frontend action - agent awareness of frontend capabilities
   */
  async executeFrontendAction(actionName, componentId, args = {}) {
    const actionEvent = {
      type: 'frontend:invokeAction',
      payload: {
        actionName,
        componentId,
        args,
        timestamp: new Date().toISOString()
      }
    };

    // Fire-and-forget action execution
    this.emit('agui-event', actionEvent);
    
    return { 
      success: true, 
      message: `Action ${actionName} sent to frontend component ${componentId}` 
    };
  }

  /**
   * Get currently cached frontend context
   */
  getCachedContext(componentId) {
    return this.activeContexts.get(componentId);
  }

  /**
   * Get all active contexts (for agent universal awareness)
   */
  getAllActiveContexts() {
    return Object.fromEntries(this.activeContexts);
  }

  /**
   * Clean up request resources
   */
  cleanupRequest(requestId) {
    // Clear timeout
    const timeoutId = this.timeoutHandlers.get(requestId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutHandlers.delete(requestId);
    }
    
    // Remove promise
    this.contextPromises.delete(requestId);
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Register context change handler for real-time awareness
   */
  onContextChange(componentId, handler) {
    this.on(`context:${componentId}`, handler);
  }

  /**
   * Handle real-time context updates from frontend
   */
  handleContextUpdate(componentId, newContext) {
    this.activeContexts.set(componentId, {
      context: newContext,
      timestamp: new Date(),
      contextType: 'update'
    });
    
    this.emit(`context:${componentId}`, newContext);
    this.emit('context:any', { componentId, context: newContext });
  }

  /**
   * Get context summary for agent decision making
   */
  getContextSummary() {
    const contexts = this.getAllActiveContexts();
    
    return {
      activeComponents: Object.keys(contexts).length,
      lastUpdated: Math.max(...Object.values(contexts).map(c => c.timestamp?.getTime() || 0)),
      documentContext: contexts['documentCanvas']?.context,
      selections: this.extractSelections(contexts),
      viewport: this.extractViewport(contexts),
      summary: this.generateContextSummary(contexts)
    };
  }

  /**
   * Extract selection data from contexts
   */
  extractSelections(contexts) {
    const selections = [];
    for (const [componentId, contextData] of Object.entries(contexts)) {
      if (contextData.context?.selections) {
        selections.push(...contextData.context.selections);
      }
    }
    return selections;
  }

  /**
   * Extract viewport information
   */
  extractViewport(contexts) {
    for (const [componentId, contextData] of Object.entries(contexts)) {
      if (contextData.context?.viewport) {
        return contextData.context.viewport;
      }
    }
    return null;
  }

  /**
   * Generate human-readable context summary
   */
  generateContextSummary(contexts) {
    const components = Object.keys(contexts);
    if (components.length === 0) {
      return "No active frontend contexts";
    }
    
    return `Agent is aware of ${components.length} active frontend component(s): ${components.join(', ')}`;
  }
}

export default FrontendContextManager;