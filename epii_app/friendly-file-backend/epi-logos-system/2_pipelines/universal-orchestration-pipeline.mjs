/**
 * Universal Orchestration Pipeline for Epi-Logos Agent
 * Orchestrates complex workflows across multiple subsystems
 */

import { SubsystemExperts, AgentRequestTypes, ContextFrames } from '../0_foundation/types.mjs';

class UniversalOrchestrationPipeline {
  constructor(orchestrator, frontendContextManager) {
    this.orchestrator = orchestrator;
    this.frontendContextManager = frontendContextManager;
    this.activeWorkflows = new Map();
  }

  /**
   * Document Analysis Pipeline
   * Orchestrates document analysis across epii, paramasiva, and nara subsystems
   */
  async executeDocumentAnalysisPipeline(request) {
    const workflowId = this.generateWorkflowId('document-analysis');
    
    try {
      this.activeWorkflows.set(workflowId, {
        type: 'document-analysis',
        startTime: new Date(),
        status: 'running',
        stages: []
      });

      // Stage 1: Get current document context from frontend
      const documentContext = await this.frontendContextManager.getFrontendContext(
        'documentCanvas', 
        'document'
      );

      this.updateWorkflowStage(workflowId, 'frontend-context', 'completed', documentContext);

      // Stage 2: Primary analysis through epii subsystem
      const primaryAnalysis = await this.orchestrator.delegateToSubsystem(
        SubsystemExperts.EPII,
        {
          type: AgentRequestTypes.ANALYSIS,
          content: request.content || documentContext.document,
          context: { ...request.context, documentContext }
        }
      );

      this.updateWorkflowStage(workflowId, 'primary-analysis', 'completed', primaryAnalysis);

      // Stage 3: Coordinate analysis if coordinates are involved
      let coordinateAnalysis = null;
      if (documentContext.selectedCoordinates?.length > 0) {
        coordinateAnalysis = await this.orchestrator.delegateToSubsystem(
          SubsystemExperts.PARAMASIVA,
          {
            type: AgentRequestTypes.ANALYSIS,
            content: request.content,
            context: { 
              ...request.context, 
              coordinates: documentContext.selectedCoordinates,
              contextFrame: ContextFrames.COORDINATE
            }
          }
        );

        this.updateWorkflowStage(workflowId, 'coordinate-analysis', 'completed', coordinateAnalysis);
      }

      // Stage 4: User context enrichment through nara
      const userContext = await this.orchestrator.delegateToSubsystem(
        SubsystemExperts.NARA,
        {
          type: AgentRequestTypes.QUERY,
          content: request.content,
          context: {
            ...request.context,
            contextFrame: ContextFrames.UNIVERSAL,
            userSession: true
          }
        }
      );

      this.updateWorkflowStage(workflowId, 'user-context', 'completed', userContext);

      // Stage 5: Synthesis
      const synthesis = await this.synthesizeDocumentAnalysis(
        primaryAnalysis,
        coordinateAnalysis,
        userContext,
        documentContext
      );

      this.updateWorkflowStage(workflowId, 'synthesis', 'completed', synthesis);

      // Complete workflow
      this.completeWorkflow(workflowId, synthesis);

      return {
        workflowId,
        result: synthesis,
        metadata: {
          pipeline: 'document-analysis',
          stages: this.activeWorkflows.get(workflowId).stages,
          duration: Date.now() - this.activeWorkflows.get(workflowId).startTime.getTime()
        }
      };

    } catch (error) {
      this.failWorkflow(workflowId, error);
      throw error;
    }
  }

  /**
   * Multi-Coordinate Analysis Pipeline
   * Handles document analysis across multiple user-specified coordinates
   */
  async executeMultiCoordinateAnalysisPipeline(request) {
    const workflowId = this.generateWorkflowId('multi-coordinate');
    
    try {
      this.activeWorkflows.set(workflowId, {
        type: 'multi-coordinate-analysis',
        startTime: new Date(),
        status: 'running',
        stages: []
      });

      // Stage 1: Get frontend context for coordinate selection
      const coordinateContext = await this.frontendContextManager.getFrontendContext(
        'bimbaUpdateOverlay',
        'coordinates'
      );

      this.updateWorkflowStage(workflowId, 'coordinate-context', 'completed', coordinateContext);

      // Stage 2: Coordinate-specific analysis for each target
      const coordinateResults = new Map();
      const { targetCoordinates, document } = request;

      for (const coordinate of targetCoordinates) {
        // Use BPMCP tools for coordinate-specific analysis instead of delegation
        const coordinateKnowledge = await this.orchestrator.knowledgeBase.queryBimbaGraph(
          `MATCH (n {bimbaCoordinate: '${coordinate.coordinate}'}) 
           OPTIONAL MATCH (n)-[r]-(related)
           RETURN n, collect({rel: r, node: related}) as relationships`,
          { includeRelationships: true }
        );

        const semanticAnalysis = await this.orchestrator.knowledgeBase.bimbaKnowing(
          `${coordinate.relevanceHint || ''} ${document.substring(0, 500)}`,
          { 
            coordinateFilter: coordinate.coordinate,
            topK: 5,
            threshold: 0.6
          }
        );

        const result = {
          coordinate: coordinate.coordinate,
          coordinateKnowledge,
          semanticAnalysis,
          relevanceHint: coordinate.relevanceHint,
          analysisType: 'coordinate-specific'
        };

        coordinateResults.set(coordinate.coordinate, result);
        this.updateWorkflowStage(
          workflowId, 
          `coordinate-${coordinate.coordinate}`, 
          'completed', 
          result
        );
      }

      // Stage 3: Cross-coordinate relationship analysis
      const relationshipAnalysis = await this.analyzeCoordinateRelationships(
        coordinateResults,
        request
      );

      this.updateWorkflowStage(workflowId, 'relationship-analysis', 'completed', relationshipAnalysis);

      // Stage 4: Generate coordinated suggestions
      const coordinatedSuggestions = await this.generateCoordinatedSuggestions(
        coordinateResults,
        relationshipAnalysis,
        request
      );

      this.updateWorkflowStage(workflowId, 'coordinated-suggestions', 'completed', coordinatedSuggestions);

      // Complete workflow
      const result = {
        coordinateResults: Object.fromEntries(coordinateResults),
        relationshipAnalysis,
        coordinatedSuggestions,
        workflow: {
          id: workflowId,
          type: 'multi-coordinate-analysis',
          targetCoordinates: targetCoordinates.map(c => c.coordinate)
        }
      };

      this.completeWorkflow(workflowId, result);
      return result;

    } catch (error) {
      this.failWorkflow(workflowId, error);
      throw error;
    }
  }

  /**
   * Universal Knowledge Synthesis Pipeline
   * Synthesizes knowledge across all memory systems
   */
  async executeKnowledgeSynthesisPipeline(request) {
    const workflowId = this.generateWorkflowId('knowledge-synthesis');
    
    try {
      this.activeWorkflows.set(workflowId, {
        type: 'knowledge-synthesis',
        startTime: new Date(),
        status: 'running',
        stages: []
      });

      // Stage 1: Query unified knowledge base (through existing UnifiedRAG)
      const unifiedQuery = await this.queryUnifiedKnowledge(request.query, request.context);
      this.updateWorkflowStage(workflowId, 'unified-query', 'completed', unifiedQuery);

      // Stage 2: Foundational insights using BPMCP query for foundational coordinates
      const foundationalInsights = await this.orchestrator.knowledgeBase.queryBimbaGraph(
        `MATCH (n {bimbaCoordinate: '#0'}) RETURN n LIMIT 1
         UNION 
         MATCH (n)-[r:FOUNDATIONAL_RELATION]-(m) WHERE n.bimbaCoordinate STARTS WITH '#0' RETURN n, r, m LIMIT 5`,
        { includeRelationships: true }
      );

      this.updateWorkflowStage(workflowId, 'foundational-insights', 'completed', foundationalInsights);

      // Stage 3: Structural analysis using BPMCP knowing for structural patterns
      const structuralAnalysis = await this.orchestrator.knowledgeBase.bimbaKnowing(
        `quaternal logic structural patterns ${request.query}`,
        { 
          coordinateFilter: '#1',
          topK: 8,
          threshold: 0.7
        }
      );

      this.updateWorkflowStage(workflowId, 'structural-analysis', 'completed', structuralAnalysis);

      // Stage 4: Synthesis across all knowledge sources
      const synthesis = await this.synthesizeUniversalKnowledge(
        unifiedQuery,
        foundationalInsights,
        structuralAnalysis,
        request
      );

      this.updateWorkflowStage(workflowId, 'universal-synthesis', 'completed', synthesis);

      this.completeWorkflow(workflowId, synthesis);
      return synthesis;

    } catch (error) {
      this.failWorkflow(workflowId, error);
      throw error;
    }
  }

  /**
   * Helper methods for synthesis and analysis
   */
  async synthesizeDocumentAnalysis(primary, coordinate, user, documentContext) {
    return {
      documentTitle: documentContext.document?.title || 'Untitled',
      primaryInsights: primary?.insights || [],
      coordinateInsights: coordinate?.insights || [],
      userContextInsights: user?.insights || [],
      unifiedSynthesis: {
        summary: "Synthesized analysis combining epii document analysis, coordinate insights, and user context",
        recommendations: [],
        nextSteps: []
      },
      confidence: 0.85,
      timestamp: new Date()
    };
  }

  async analyzeCoordinateRelationships(coordinateResults, request) {
    // Analyze relationships between target coordinates
    const coordinates = Array.from(coordinateResults.keys());
    const relationships = [];

    for (let i = 0; i < coordinates.length; i++) {
      for (let j = i + 1; j < coordinates.length; j++) {
        const coord1 = coordinates[i];
        const coord2 = coordinates[j];
        
        // Analyze relationship between coord1 and coord2 based on their results
        const relationship = await this.analyzeCoordinatePair(
          coord1, coordinateResults.get(coord1),
          coord2, coordinateResults.get(coord2)
        );
        
        relationships.push(relationship);
      }
    }

    return { relationships, coordinateCount: coordinates.length };
  }

  async analyzeCoordinatePair(coord1, result1, coord2, result2) {
    // Simple relationship analysis - can be enhanced with more sophisticated logic
    return {
      source: coord1,
      target: coord2,
      relationshipType: 'RELATES_TO', // Could be HARMONIZES_WITH, CONTRASTS_WITH, etc.
      strength: 0.7,
      reasoning: `Analysis suggests connection between ${coord1} and ${coord2} based on document content`
    };
  }

  async generateCoordinatedSuggestions(coordinateResults, relationshipAnalysis, request) {
    return {
      individualSuggestions: Object.fromEntries(
        Array.from(coordinateResults.entries()).map(([coord, result]) => [
          coord,
          { 
            updates: [`Update suggestion for ${coord} based on document analysis`],
            confidence: 0.8
          }
        ])
      ),
      relationshipSuggestions: relationshipAnalysis.relationships.map(rel => ({
        action: 'CREATE_RELATIONSHIP',
        source: rel.source,
        target: rel.target,
        type: rel.relationshipType,
        properties: { strength: rel.strength, reasoning: rel.reasoning }
      })),
      coordinatedUpdates: "Coordinated suggestions across all target coordinates"
    };
  }

  async synthesizeUniversalKnowledge(unified, foundational, structural, request) {
    return {
      unifiedKnowledge: unified,
      foundationalPerspective: foundational,
      structuralPerspective: structural,
      synthesis: {
        universalInsights: "Synthesis across all knowledge systems and subsystems",
        recommendations: [],
        emergentPatterns: []
      },
      confidence: 0.9,
      timestamp: new Date()
    };
  }

  async queryUnifiedKnowledge(query, context) {
    // This would integrate with the existing UnifiedRAG service
    return {
      lightragResults: [],
      bimbaResults: [],
      graphitiResults: [],
      query,
      context
    };
  }

  /**
   * Workflow management methods
   */
  generateWorkflowId(type) {
    return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateWorkflowStage(workflowId, stageName, status, result) {
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow) {
      workflow.stages.push({
        name: stageName,
        status,
        result,
        timestamp: new Date()
      });
    }
  }

  completeWorkflow(workflowId, result) {
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow) {
      workflow.status = 'completed';
      workflow.endTime = new Date();
      workflow.result = result;
    }
  }

  failWorkflow(workflowId, error) {
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow) {
      workflow.status = 'failed';
      workflow.endTime = new Date();
      workflow.error = error.message;
    }
  }

  getWorkflowStatus(workflowId) {
    return this.activeWorkflows.get(workflowId);
  }

  getActiveWorkflows() {
    return Array.from(this.activeWorkflows.entries()).map(([id, workflow]) => ({
      id,
      type: workflow.type,
      status: workflow.status,
      startTime: workflow.startTime,
      stages: workflow.stages.length
    }));
  }
}

export default UniversalOrchestrationPipeline;