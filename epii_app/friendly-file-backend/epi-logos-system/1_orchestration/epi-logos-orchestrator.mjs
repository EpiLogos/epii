/**
 * Epi-Logos Universal Orchestrator
 * The core orchestrating intelligence that coordinates all subsystem experts
 */

import { SubsystemExperts, AgentRequestTypes, ContextFrames, OrchestrationStates } from '../0_foundation/types.mjs';
import BPMCPAgentIntegration from '../5_integration/bpmcp-agent-integration.mjs';

class EpiLogosOrchestrator {
  constructor(config = {}) {
    this.state = OrchestrationStates.IDLE;
    this.activeContext = null;
    this.sessionHistory = [];
    this.subsystemExperts = new Map();
    this.knowledgeBase = null; // BPMCP integration
    this.currentRequest = null;
    this.bpmcpIntegration = new BPMCPAgentIntegration();
    
    this.initializeSubsystemExperts();
    this.initializeBPMCP();
  }

  /**
   * Initialize connections to all subsystem expert agents
   */
  initializeSubsystemExperts() {
    // Map subsystem experts for orchestration
    this.subsystemExperts.set(SubsystemExperts.ANUTTARA, {
      agent: null, // Will connect to anuttara.expert.agent.mjs
      domain: 'transcendent_void',
      capabilities: ['void_logic', 'proto_analysis', 'foundational_patterns']
    });
    
    this.subsystemExperts.set(SubsystemExperts.PARAMASIVA, {
      agent: null, // Will connect to paramasiva.expert.agent.mjs
      domain: 'quaternal_logic',
      capabilities: ['algebraic_topology', 'logical_structures', 'mathematical_analysis']
    });
    
    this.subsystemExperts.set(SubsystemExperts.PARASHAKTI, {
      agent: null, // Will connect to parashakti.expert.agent.mjs
      domain: 'cosmic_experientiality',
      capabilities: ['experiential_analysis', 'dynamic_processing', 'flow_coordination']
    });
    
    this.subsystemExperts.set(SubsystemExperts.MAHAMAYA, {
      agent: null, // Will connect to mahamaya.expert.agent.mjs
      domain: 'cosmic_imagination',
      capabilities: ['visualization', 'imagination_synthesis', 'creative_analysis']
    });
    
    this.subsystemExperts.set(SubsystemExperts.NARA, {
      agent: null, // Will connect to nara.expert.agent.mjs
      domain: 'individualized_cognition',
      capabilities: ['user_interaction', 'personal_context', 'identity_management']
    });
    
    this.subsystemExperts.set(SubsystemExperts.EPII, {
      agent: null, // Will connect to epii.expert.agent.mjs
      domain: 'self_awareness',
      capabilities: ['document_analysis', 'memory_crystallization', 'meta_reflection']
    });
  }

  /**
   * Initialize BPMCP knowledge integration
   */
  async initializeBPMCP() {
    try {
      await this.bpmcpIntegration.initialize();
      this.knowledgeBase = this.bpmcpIntegration;
      console.log('[EpiLogosOrchestrator] BPMCP knowledge base initialized');
    } catch (error) {
      console.error('[EpiLogosOrchestrator] Failed to initialize BPMCP:', error);
    }
  }

  /**
   * Main orchestration method - receives user requests and coordinates response
   */
  async orchestrate(request) {
    this.setState(OrchestrationStates.ANALYZING);
    this.currentRequest = request;

    try {
      // Analyze request to determine orchestration strategy
      const orchestrationPlan = await this.analyzeRequest(request);
      
      // Execute orchestration plan
      const result = await this.executeOrchestrationPlan(orchestrationPlan);
      
      // Synthesize and respond
      this.setState(OrchestrationStates.SYNTHESIZING);
      const response = await this.synthesizeResponse(result);
      
      this.setState(OrchestrationStates.RESPONDING);
      return response;
      
    } catch (error) {
      console.error('Orchestration error:', error);
      this.setState(OrchestrationStates.IDLE);
      throw error;
    } finally {
      this.setState(OrchestrationStates.IDLE);
      this.currentRequest = null;
    }
  }

  /**
   * Analyze incoming request to determine which subsystems to engage
   */
  async analyzeRequest(request) {
    const { type, content, context } = request;
    
    // Query BPMCP knowledge base for context
    let knowledgeContext = null;
    if (this.knowledgeBase && content) {
      try {
        knowledgeContext = await this.knowledgeBase.universalKnowledgeQuery(content, {
          coordinateFilter: context?.coordinates,
          maxResults: 5
        });
      } catch (error) {
        console.warn('[EpiLogosOrchestrator] Knowledge query failed:', error.message);
      }
    }
    
    // Determine primary subsystem based on request domain and knowledge context
    let primarySubsystem = null;
    let supportingSubsystems = [];
    
    if (context?.document || type === AgentRequestTypes.ANALYSIS) {
      primarySubsystem = SubsystemExperts.EPII;
    } else if (context?.coordinate || context?.graph) {
      primarySubsystem = SubsystemExperts.PARAMASIVA;
    } else if (context?.user || type === AgentRequestTypes.QUERY) {
      primarySubsystem = SubsystemExperts.NARA;
    } else {
      // Use knowledge context to determine best subsystem
      if (knowledgeContext?.synthesis?.topRelevantCoordinates?.length > 0) {
        const topCoord = knowledgeContext.synthesis.topRelevantCoordinates[0].coordinate;
        primarySubsystem = this.coordinateToSubsystem(topCoord);
      } else {
        // Default to epii for general requests
        primarySubsystem = SubsystemExperts.EPII;
      }
    }

    // Determine supporting subsystems based on complexity and knowledge context
    if (this.isComplexRequest(request) || knowledgeContext?.synthesis?.totalResults > 3) {
      supportingSubsystems = this.determineSupportingSubsystems(request, primarySubsystem, knowledgeContext);
    }

    return {
      primarySubsystem,
      supportingSubsystems,
      orchestrationStrategy: this.determineOrchestrationStrategy(request),
      context: this.enrichContext(context),
      knowledgeContext
    };
  }

  /**
   * Execute the orchestration plan by coordinating subsystem experts
   */
  async executeOrchestrationPlan(plan) {
    this.setState(OrchestrationStates.DELEGATING);
    
    const { primarySubsystem, supportingSubsystems, orchestrationStrategy } = plan;
    
    if (orchestrationStrategy === 'single') {
      // Simple delegation to primary subsystem
      return await this.delegateToSubsystem(primarySubsystem, this.currentRequest);
    } else if (orchestrationStrategy === 'coordinated') {
      // Coordinate multiple subsystems
      this.setState(OrchestrationStates.COORDINATING);
      return await this.coordinateMultipleSubsystems(primarySubsystem, supportingSubsystems);
    } else if (orchestrationStrategy === 'sequential') {
      // Sequential processing through multiple subsystems
      return await this.sequentialProcessing(primarySubsystem, supportingSubsystems);
    }
  }

  /**
   * Delegate request to specific subsystem expert
   */
  async delegateToSubsystem(subsystemKey, request) {
    const subsystem = this.subsystemExperts.get(subsystemKey);
    if (!subsystem || !subsystem.agent) {
      throw new Error(`Subsystem ${subsystemKey} not available`);
    }

    // Route to appropriate subsystem expert agent
    // This will interface with existing expert agents like epii.expert.agent.mjs
    return await subsystem.agent.process(request);
  }

  /**
   * Coordinate processing across multiple subsystems using BPMCP knowledge base
   */
  async coordinateMultipleSubsystems(primary, supporting) {
    const results = new Map();
    
    // Process with primary subsystem using BPMCP tools
    const primaryResult = await this.processSubsystemRequest(primary, this.currentRequest);
    results.set(primary, primaryResult);
    
    // Process with supporting subsystems in parallel using BPMCP tools
    const supportingPromises = supporting.map(async (subsystem) => {
      const result = await this.processSubsystemRequest(subsystem, this.currentRequest);
      results.set(subsystem, result);
      return result;
    });
    
    await Promise.all(supportingPromises);
    return results;
  }

  /**
   * Process subsystem request using BPMCP knowledge instead of delegation
   */
  async processSubsystemRequest(subsystemKey, request) {
    // Map subsystem to coordinate prefix for BPMCP queries
    const coordinateMap = {
      'anuttara': '#0',
      'paramasiva': '#1', 
      'parashakti': '#2',
      'mahamaya': '#3',
      'nara': '#4',
      'epii': '#5'
    };

    const coordinate = coordinateMap[subsystemKey.toLowerCase()] || '#5';

    // Use BPMCP knowledge base to get subsystem-specific insights
    const knowledge = await this.knowledgeBase.queryBimbaGraph(
      `MATCH (n {bimbaCoordinate: '${coordinate}'}) 
       OPTIONAL MATCH (n)-[r]-(related)
       RETURN n, collect({rel: r, node: related}) as relationships LIMIT 10`,
      { includeRelationships: true }
    );

    const semanticInsights = await this.knowledgeBase.bimbaKnowing(
      request.content || request.query || '',
      { 
        coordinateFilter: coordinate,
        topK: 5,
        threshold: 0.7
      }
    );

    return {
      subsystem: subsystemKey,
      coordinate,
      knowledge,
      semanticInsights,
      analysisType: 'subsystem-specific'
    };
  }

  /**
   * Helper methods
   */
  setState(newState) {
    this.state = newState;
    this.emit('stateChange', { state: newState, timestamp: new Date() });
  }

  isComplexRequest(request) {
    return request.content?.length > 500 || 
           request.context?.multiDocument || 
           request.type === AgentRequestTypes.ORCHESTRATION;
  }

  determineOrchestrationStrategy(request) {
    if (this.isComplexRequest(request)) {
      return 'coordinated';
    }
    return 'single';
  }

  coordinateToSubsystem(coordinate) {
    // Map Bimba coordinates to subsystems
    if (coordinate.startsWith('#0')) return SubsystemExperts.ANUTTARA;
    if (coordinate.startsWith('#1')) return SubsystemExperts.PARAMASIVA;
    if (coordinate.startsWith('#2')) return SubsystemExperts.PARASHAKTI;
    if (coordinate.startsWith('#3')) return SubsystemExperts.MAHAMAYA;
    if (coordinate.startsWith('#4')) return SubsystemExperts.NARA;
    if (coordinate.startsWith('#5')) return SubsystemExperts.EPII;
    return SubsystemExperts.EPII; // Default
  }

  determineSupportingSubsystems(request, primary, knowledgeContext = null) {
    // Logic to determine which additional subsystems should be involved
    const supporting = [];
    
    if (request.context?.coordinate) {
      supporting.push(SubsystemExperts.PARAMASIVA);
    }
    if (request.context?.document && primary !== SubsystemExperts.EPII) {
      supporting.push(SubsystemExperts.EPII);
    }
    if (request.context?.user && primary !== SubsystemExperts.NARA) {
      supporting.push(SubsystemExperts.NARA);
    }
    
    // Add subsystems based on knowledge context
    if (knowledgeContext?.synthesis?.topRelevantCoordinates) {
      knowledgeContext.synthesis.topRelevantCoordinates.slice(1, 3).forEach(coord => {
        const subsystem = this.coordinateToSubsystem(coord.coordinate);
        if (subsystem !== primary && !supporting.includes(subsystem)) {
          supporting.push(subsystem);
        }
      });
    }
    
    return supporting.filter(s => s !== primary);
  }

  enrichContext(context) {
    // Add universal context enrichment
    return {
      ...context,
      timestamp: new Date(),
      sessionId: this.getSessionId(),
      orchestratorState: this.state
    };
  }

  async synthesizeResponse(results) {
    // Synthesize responses from multiple subsystems into coherent response
    if (results instanceof Map) {
      // Multiple subsystem results - synthesize
      return this.synthesizeMultipleResults(results);
    } else {
      // Single subsystem result - pass through with orchestrator context
      return {
        content: results,
        orchestrator: {
          strategy: 'single',
          timestamp: new Date(),
          sessionId: this.getSessionId()
        }
      };
    }
  }

  synthesizeMultipleResults(resultsMap) {
    // Complex synthesis logic for multiple subsystem results
    const synthesis = {
      primary: null,
      supporting: [],
      integration: null,
      orchestrator: {
        strategy: 'coordinated',
        timestamp: new Date(),
        sessionId: this.getSessionId()
      }
    };

    // Implementation for multi-subsystem synthesis
    return synthesis;
  }

  getSessionId() {
    // Return current session identifier
    return 'session_' + Date.now();
  }

  // Event emitter methods
  emit(event, data) {
    // Implement event emission for state changes
    console.log(`EpiLogosOrchestrator event: ${event}`, data);
  }
}

export default EpiLogosOrchestrator;