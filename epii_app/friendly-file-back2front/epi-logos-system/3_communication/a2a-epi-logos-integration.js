/**
 * A2A Epi-Logos Integration Service
 * Connects the Epi-Logos Agent orchestrator with the A2A layer
 */

const path = require('path');

class A2AEpiLogosIntegration {
  constructor() {
    this.orchestrator = null;
    this.frontendContextManager = null;
    this.orchestrationPipeline = null;
    this.isInitialized = false;
    this.a2aServer = null;
    this.skillRegistry = null;
  }

  /**
   * Initialize integration with backend orchestrator and A2A server
   */
  async initialize(a2aServer, skillRegistry) {
    try {
      this.a2aServer = a2aServer;
      this.skillRegistry = skillRegistry;

      console.log('[A2AEpiLogosIntegration] Initializing Epi-Logos Agent integration...');

      // Import backend orchestrator components
      await this.initializeBackendComponents();

      // Initialize Epi-Logos orchestration skill with backend components
      await this.initializeOrchestrationSkill();

      // Set up AG-UI event handlers for frontend communication
      this.setupAGUIEventHandlers();

      this.isInitialized = true;
      console.log('[A2AEpiLogosIntegration] Epi-Logos Agent integration initialized successfully');

    } catch (error) {
      console.error('[A2AEpiLogosIntegration] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize backend orchestrator components
   */
  async initializeBackendComponents() {
    try {
      // Import backend orchestrator
      const { default: EpiLogosOrchestrator } = await import('../../../friendly-file-backend/epi-logos-system/1_orchestration/epi-logos-orchestrator.mjs');
      this.orchestrator = new EpiLogosOrchestrator();

      // Import frontend context manager
      const { default: FrontendContextManager } = await import('../../../friendly-file-backend/epi-logos-system/4_communication/frontend-context-manager.mjs');
      this.frontendContextManager = new FrontendContextManager();

      // Import orchestration pipeline
      const { default: UniversalOrchestrationPipeline } = await import('../../../friendly-file-backend/epi-logos-system/2_pipelines/universal-orchestration-pipeline.mjs');
      this.orchestrationPipeline = new UniversalOrchestrationPipeline(this.orchestrator, this.frontendContextManager);

      console.log('[A2AEpiLogosIntegration] Backend components initialized');

    } catch (error) {
      console.error('[A2AEpiLogosIntegration] Backend component initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize the orchestration skill with backend components
   */
  async initializeOrchestrationSkill() {
    try {
      const registry = await this.skillRegistry.getInstance();
      const orchestrationSkill = registry.getSkillByIdAndCoordinate('epi-logos-orchestration', '#');
      
      if (orchestrationSkill) {
        // Get the skill instance and initialize it with backend components
        const skillInstance = orchestrationSkill;
        await skillInstance.initialize(
          this.orchestrator,
          this.frontendContextManager,
          this.orchestrationPipeline
        );

        console.log('[A2AEpiLogosIntegration] Orchestration skill initialized with backend components');
      } else {
        console.warn('[A2AEpiLogosIntegration] Epi-Logos orchestration skill not found in registry');
      }

    } catch (error) {
      console.error('[A2AEpiLogosIntegration] Orchestration skill initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up AG-UI event handlers for frontend communication
   */
  setupAGUIEventHandlers() {
    if (!this.frontendContextManager) {
      console.warn('[A2AEpiLogosIntegration] Frontend context manager not available for AG-UI setup');
      return;
    }

    // Listen for AG-UI events from frontend context manager
    this.frontendContextManager.on('agui-event', (event) => {
      this.handleAGUIEvent(event);
    });

    // Set up context update handlers
    this.frontendContextManager.on('context:any', (contextUpdate) => {
      this.handleContextUpdate(contextUpdate);
    });

    console.log('[A2AEpiLogosIntegration] AG-UI event handlers set up');
  }

  /**
   * Handle AG-UI events from frontend context manager
   */
  handleAGUIEvent(event) {
    if (!this.a2aServer) {
      console.warn('[A2AEpiLogosIntegration] A2A server not available for AG-UI event handling');
      return;
    }

    // Forward AG-UI events through A2A server to frontend
    try {
      this.a2aServer.emitAGUIEvent(event);
      console.log(`[A2AEpiLogosIntegration] Forwarded AG-UI event: ${event.type}`);
    } catch (error) {
      console.error('[A2AEpiLogosIntegration] Failed to forward AG-UI event:', error);
    }
  }

  /**
   * Handle context updates from frontend
   */
  handleContextUpdate(contextUpdate) {
    console.log(`[A2AEpiLogosIntegration] Context update received for component: ${contextUpdate.componentId}`);
    
    // Context updates are automatically handled by the frontend context manager
    // This is just for logging and potential additional processing
  }

  /**
   * Handle incoming AG-UI events from frontend (response to requests)
   */
  handleIncomingAGUIEvent(event) {
    if (!this.frontendContextManager) {
      console.warn('[A2AEpiLogosIntegration] Frontend context manager not available');
      return;
    }

    switch (event.type) {
      case 'frontend:contextResponse':
        this.frontendContextManager.handleFrontendContextResponse(event.payload);
        break;
        
      case 'frontend:contextUpdate':
        this.frontendContextManager.handleContextUpdate(
          event.payload.componentId,
          event.payload.context
        );
        break;
        
      default:
        console.log(`[A2AEpiLogosIntegration] Unhandled AG-UI event type: ${event.type}`);
    }
  }

  /**
   * Execute Epi-Logos orchestration through A2A layer
   */
  async executeOrchestration(requestType, content, context = {}, targetSubsystems = []) {
    if (!this.isInitialized) {
      throw new Error('A2A Epi-Logos integration not initialized');
    }

    try {
      const registry = await this.skillRegistry.getInstance();
      const result = await registry.executeSkill('epi-logos-orchestration', {
        requestType,
        content,
        context,
        targetSubsystems,
        orchestrationStrategy: context.orchestrationStrategy || 'single'
      });

      return result;

    } catch (error) {
      console.error('[A2AEpiLogosIntegration] Orchestration execution failed:', error);
      throw error;
    }
  }

  /**
   * Get frontend context through A2A layer
   */
  async getFrontendContext(componentId, contextType = 'fullState') {
    if (!this.frontendContextManager) {
      throw new Error('Frontend context manager not available');
    }

    return await this.frontendContextManager.getFrontendContext(componentId, contextType);
  }

  /**
   * Execute frontend action through A2A layer
   */
  async executeFrontendAction(actionName, componentId, args = {}) {
    if (!this.frontendContextManager) {
      throw new Error('Frontend context manager not available');
    }

    return await this.frontendContextManager.executeFrontendAction(actionName, componentId, args);
  }

  /**
   * Get integration status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      orchestratorAvailable: !!this.orchestrator,
      frontendContextManagerAvailable: !!this.frontendContextManager,
      orchestrationPipelineAvailable: !!this.orchestrationPipeline,
      a2aServerConnected: !!this.a2aServer,
      skillRegistryConnected: !!this.skillRegistry
    };
  }

  /**
   * Get orchestration metrics
   */
  getMetrics() {
    const status = this.getStatus();
    
    return {
      ...status,
      activeWorkflows: this.orchestrationPipeline?.getActiveWorkflows() || [],
      contextSummary: this.frontendContextManager?.getContextSummary() || {},
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = A2AEpiLogosIntegration;