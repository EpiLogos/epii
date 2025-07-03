/**
 * Epi-Logos Orchestration Skill
 * Universal agent skill for cross-subsystem orchestration at root coordinate "#"
 */

const path = require('path');

class EpiLogosOrchestrationSkill {
  constructor() {
    this.orchestrator = null; // Will be initialized when backend connects
    this.frontendContextManager = null;
    this.orchestrationPipeline = null;
    this.skillId = 'epi-logos-orchestration';
    this.agentId = 'epi-logos-agent';
  }

  /**
   * Get skill metadata for registration
   */
  getSkillMetadata() {
    return {
      id: this.skillId,
      name: 'Epi-Logos Universal Orchestration',
      description: 'Universal agent orchestration across all subsystems with frontend awareness',
      bimbaCoordinate: '#', // Root coordinate - universal
      agentId: this.agentId,
      qlMetadata: {
        qlPosition: 0, // Ground - foundational orchestration
        contextFrame: '(0)', // Universal context
        qlMode: 'universal'
      },
      harmonicMetadata: {
        frequency: 'universal',
        resonance: 'all_subsystems',
        harmonics: ['#0', '#1', '#2', '#3', '#4', '#5']
      },
      capabilities: [
        'universal-orchestration',
        'cross-subsystem-coordination', 
        'frontend-context-awareness',
        'document-analysis-orchestration',
        'multi-coordinate-analysis',
        'knowledge-synthesis',
        'conversational-interaction'
      ],
      inputSchema: {
        type: 'object',
        properties: {
          requestType: {
            type: 'string',
            enum: ['orchestrate', 'analyze', 'synthesize', 'reflect', 'coordinate']
          },
          content: { type: 'string' },
          context: { type: 'object' },
          targetSubsystems: { type: 'array', items: { type: 'string' } },
          orchestrationStrategy: {
            type: 'string',
            enum: ['single', 'coordinated', 'sequential', 'parallel']
          }
        },
        required: ['requestType', 'content']
      }
    };
  }

  /**
   * Initialize orchestrator connection
   */
  async initialize(orchestrator, frontendContextManager, orchestrationPipeline) {
    this.orchestrator = orchestrator;
    this.frontendContextManager = frontendContextManager;
    this.orchestrationPipeline = orchestrationPipeline;
    console.log('[EpiLogosOrchestrationSkill] Initialized with backend orchestrator');
  }

  /**
   * Execute orchestration skill
   */
  async execute(args, context = {}) {
    try {
      const { requestType, content, targetSubsystems, orchestrationStrategy } = args;
      
      console.log(`[EpiLogosOrchestrationSkill] Executing ${requestType} orchestration`);

      // Ensure orchestrator is available
      if (!this.orchestrator) {
        throw new Error('Epi-Logos Orchestrator not initialized');
      }

      const request = {
        type: requestType,
        content,
        context: {
          ...context,
          ...args.context,
          skillId: this.skillId,
          agentId: this.agentId,
          timestamp: new Date().toISOString()
        },
        targetSubsystems,
        orchestrationStrategy: orchestrationStrategy || 'single'
      };

      // Route to appropriate orchestration method
      switch (requestType) {
        case 'orchestrate':
          return await this.executeUniversalOrchestration(request);
          
        case 'analyze':
          return await this.executeDocumentAnalysis(request);
          
        case 'synthesize':
          return await this.executeKnowledgeSynthesis(request);
          
        case 'coordinate':
          return await this.executeMultiCoordinateAnalysis(request);
          
        case 'reflect':
          return await this.executeContextReflection(request);
          
        default:
          throw new Error(`Unknown orchestration request type: ${requestType}`);
      }

    } catch (error) {
      console.error('[EpiLogosOrchestrationSkill] Execution error:', error);
      throw error;
    }
  }

  /**
   * Execute universal orchestration
   */
  async executeUniversalOrchestration(request) {
    console.log('[EpiLogosOrchestrationSkill] Executing universal orchestration');
    
    // Get frontend context for orchestration awareness
    let frontendContext = null;
    try {
      frontendContext = await this.frontendContextManager.getFrontendContext(
        'documentCanvas', 
        'fullState'
      );
    } catch (error) {
      console.warn('[EpiLogosOrchestrationSkill] Could not get frontend context:', error.message);
    }

    // Enrich request with frontend context
    const enrichedRequest = {
      ...request,
      context: {
        ...request.context,
        frontendContext,
        orchestrationMode: 'universal'
      }
    };

    // Execute through orchestrator
    const result = await this.orchestrator.orchestrate(enrichedRequest);

    return {
      success: true,
      result,
      metadata: {
        skill: this.skillId,
        orchestrationType: 'universal',
        frontendContextAvailable: !!frontendContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Execute document analysis orchestration
   */
  async executeDocumentAnalysis(request) {
    console.log('[EpiLogosOrchestrationSkill] Executing document analysis orchestration');
    
    if (!this.orchestrationPipeline) {
      throw new Error('Orchestration pipeline not available');
    }

    const result = await this.orchestrationPipeline.executeDocumentAnalysisPipeline(request);

    return {
      success: true,
      result,
      metadata: {
        skill: this.skillId,
        orchestrationType: 'document-analysis',
        pipeline: 'universal-orchestration-pipeline',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Execute multi-coordinate analysis
   */
  async executeMultiCoordinateAnalysis(request) {
    console.log('[EpiLogosOrchestrationSkill] Executing multi-coordinate analysis');
    
    if (!this.orchestrationPipeline) {
      throw new Error('Orchestration pipeline not available');
    }

    const result = await this.orchestrationPipeline.executeMultiCoordinateAnalysisPipeline(request);

    return {
      success: true,
      result,
      metadata: {
        skill: this.skillId,
        orchestrationType: 'multi-coordinate-analysis',
        coordinateCount: request.targetCoordinates?.length || 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Execute knowledge synthesis
   */
  async executeKnowledgeSynthesis(request) {
    console.log('[EpiLogosOrchestrationSkill] Executing knowledge synthesis');
    
    if (!this.orchestrationPipeline) {
      throw new Error('Orchestration pipeline not available');
    }

    const result = await this.orchestrationPipeline.executeKnowledgeSynthesisPipeline(request);

    return {
      success: true,
      result,
      metadata: {
        skill: this.skillId,
        orchestrationType: 'knowledge-synthesis',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Execute context reflection
   */
  async executeContextReflection(request) {
    console.log('[EpiLogosOrchestrationSkill] Executing context reflection');
    
    // Get comprehensive frontend context
    const frontendContext = await this.frontendContextManager.getContextSummary();
    
    // Create reflection request
    const reflectionRequest = {
      ...request,
      context: {
        ...request.context,
        frontendContext,
        reflectionType: 'context-aware'
      }
    };

    const result = await this.orchestrator.orchestrate(reflectionRequest);

    return {
      success: true,
      result,
      frontendContext,
      metadata: {
        skill: this.skillId,
        orchestrationType: 'context-reflection',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get current orchestrator status
   */
  getStatus() {
    return {
      orchestratorConnected: !!this.orchestrator,
      frontendContextManagerConnected: !!this.frontendContextManager,
      pipelineConnected: !!this.orchestrationPipeline,
      skillId: this.skillId,
      agentId: this.agentId,
      coordinate: '#'
    };
  }

  /**
   * Handle frontend action execution
   */
  async executeFrontendAction(actionName, componentId, args = {}) {
    if (!this.frontendContextManager) {
      throw new Error('Frontend context manager not available');
    }

    return await this.frontendContextManager.executeFrontendAction(actionName, componentId, args);
  }

  /**
   * Get frontend context
   */
  async getFrontendContext(componentId, contextType = 'fullState') {
    if (!this.frontendContextManager) {
      throw new Error('Frontend context manager not available');
    }

    return await this.frontendContextManager.getFrontendContext(componentId, contextType);
  }
}

module.exports = EpiLogosOrchestrationSkill;