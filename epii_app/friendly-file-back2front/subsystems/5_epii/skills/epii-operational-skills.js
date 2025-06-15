/**
 * Epii Operational Skills
 * Registers Epii's actual operational capabilities as A2A-aligned skills
 * These are the functions that other agents can call to leverage Epii's capabilities
 *
 * Focus: Operational capabilities, not domain knowledge
 * Domain knowledge is accessed via UnifiedRAG at coordinate #
 */

/**
 * Initialize Epii's operational skills
 * @param {Object} epiiAgentService The Epii agent service
 * @param {Object} skillsRegistry The Bimba Skills Registry
 * @param {Object} bpMCPService The BPMCP service
 * @returns {Object} The initialized skills registry
 */
async function initializeEpiiOperationalSkills(epiiAgentService, skillsRegistry, bpMCPService) {
  console.log('[EpiiOperationalSkills] Registering Epii operational capabilities...');

  // Import the new A2A-integrated pipeline skill
  const { EpiiAnalysisPipelineSkill } = await import('./epii-analysis-pipeline-skill.js');

  // #5-0: Document Analysis Pipeline (A2A-Integrated)
  const pipelineSkill = new EpiiAnalysisPipelineSkill();
  skillsRegistry.registerSkill({
    ...pipelineSkill.getSkillMetadata(),
    handler: pipelineSkill.execute.bind(pipelineSkill)
  });

  // #5-1: Notion Crystallization
  skillsRegistry.registerSkill({
    id: 'epii-notion-crystallization',
    name: 'Epii Notion Crystallization',
    description: 'Crystallizes analysis results or content into Notion with proper Bimba coordinate alignment',
    bimbaCoordinate: '#5-1',
    agentId: 'epii-agent',
    version: '1.0.0',
    inputSchema: {
      type: 'object',
      required: ['content', 'targetCoordinate'],
      properties: {
        content: { type: 'object', description: 'Content to crystallize' },
        targetCoordinate: { type: 'string', description: 'Target Bimba coordinate' },
        title: { type: 'string', description: 'Page title' },
        properties: { type: 'object', description: 'Additional Notion properties' },
        relations: { type: 'array', description: 'Related coordinates' }
      }
    },
    handler: async (params, context) => {
      try {
        const result = await bpMCPService.crystallizeToNotion({
          targetBimbaCoordinate: params.targetCoordinate,
          title: params.title,
          properties: params.properties,
          contentBlocks: params.content,
          relations: params.relations,
          createIfNotExists: true
        });

        return {
          success: true,
          data: result,
          skillId: 'epii-notion-crystallization',
          coordinate: params.targetCoordinate
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          skillId: 'epii-notion-crystallization'
        };
      }
    }
  });

  // #5-2: Bimba Graph Management
  skillsRegistry.registerSkill({
    id: 'epii-bimba-management',
    name: 'Epii Bimba Graph Management',
    description: 'Creates, updates, and manages Bimba graph nodes and relationships',
    bimbaCoordinate: '#5-2',
    agentId: 'epii-agent',
    version: '1.0.0',
    inputSchema: {
      type: 'object',
      required: ['operation'],
      properties: {
        operation: { type: 'string', enum: ['create', 'update', 'delete', 'relate'] },
        coordinate: { type: 'string', description: 'Bimba coordinate' },
        properties: { type: 'object', description: 'Node properties' },
        relations: { type: 'array', description: 'Relationships to create' },
        query: { type: 'string', description: 'Custom Cypher query for complex operations' }
      }
    },
    handler: async (params, context) => {
      try {
        let result;

        switch (params.operation) {
          case 'create':
            result = await bpMCPService.createBimbaNode({
              coordinate: params.coordinate,
              properties: params.properties,
              relations: params.relations
            });
            break;

          case 'update':
            result = await bpMCPService.updateBimbaGraph(
              `MATCH (n {bimbaCoordinate: $coord}) SET n += $props RETURN n`,
              { coord: params.coordinate, props: params.properties }
            );
            break;

          case 'relate':
            result = await bpMCPService.manageBimbaRelationships({
              sourceCoordinate: params.coordinate,
              relationships: params.relations
            });
            break;

          case 'delete':
            result = await bpMCPService.updateBimbaGraph(
              `MATCH (n {bimbaCoordinate: $coord}) DETACH DELETE n`,
              { coord: params.coordinate }
            );
            break;

          default:
            if (params.query) {
              result = await bpMCPService.queryBimbaGraph(params.query, params.properties || {});
            } else {
              throw new Error('Invalid operation or missing query');
            }
        }

        return {
          success: true,
          data: result,
          skillId: 'epii-bimba-management',
          operation: params.operation
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          skillId: 'epii-bimba-management'
        };
      }
    }
  });

  // #5-3: Synthesis & Analysis
  skillsRegistry.registerSkill({
    id: 'epii-synthesis-analysis',
    name: 'Epii Synthesis & Analysis',
    description: 'Performs deep synthesis and analysis using Epii\'s LLM capabilities',
    bimbaCoordinate: '#5-3',
    agentId: 'epii-agent',
    version: '1.0.0',
    inputSchema: {
      type: 'object',
      required: ['content', 'analysisType'],
      properties: {
        content: { type: 'string', description: 'Content to analyze' },
        analysisType: { type: 'string', enum: ['synthesis', 'structural', 'semantic', 'philosophical'] },
        context: { type: 'object', description: 'Additional context for analysis' },
        targetCoordinate: { type: 'string', description: 'Focus coordinate for analysis' }
      }
    },
    handler: async (params, context) => {
      try {
        // Use Epii's synthesis capabilities
        const result = await epiiAgentService.processChatMessage(params.content, {
          ...context,
          mode: params.analysisType,
          targetCoordinate: params.targetCoordinate,
          analysisContext: params.context
        });

        return {
          success: true,
          data: result,
          skillId: 'epii-synthesis-analysis',
          analysisType: params.analysisType
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          skillId: 'epii-synthesis-analysis'
        };
      }
    }
  });

  // #5-4: Integration & Orchestration
  skillsRegistry.registerSkill({
    id: 'epii-integration-orchestration',
    name: 'Epii Integration & Orchestration',
    description: 'Orchestrates complex multi-step workflows across Epii\'s capabilities',
    bimbaCoordinate: '#5-4',
    agentId: 'epii-agent',
    version: '1.0.0',
    inputSchema: {
      type: 'object',
      required: ['workflow'],
      properties: {
        workflow: { type: 'string', enum: ['document-to-knowledge', 'research-synthesis', 'coordinate-expansion'] },
        input: { type: 'object', description: 'Workflow input data' },
        options: { type: 'object', description: 'Workflow options' }
      }
    },
    handler: async (params, context) => {
      try {
        let result;

        switch (params.workflow) {
          case 'document-to-knowledge':
            // Full pipeline: Document → Analysis → Notion → Bimba
            result = await epiiAgentService.processDocumentToKnowledge(params.input, params.options);
            break;

          case 'research-synthesis':
            // Research → Synthesis → Crystallization
            result = await epiiAgentService.processResearchSynthesis(params.input, params.options);
            break;

          case 'coordinate-expansion':
            // Expand knowledge around a coordinate
            result = await epiiAgentService.processCoordinateExpansion(params.input, params.options);
            break;

          default:
            throw new Error(`Unknown workflow: ${params.workflow}`);
        }

        return {
          success: true,
          data: result,
          skillId: 'epii-integration-orchestration',
          workflow: params.workflow
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          skillId: 'epii-integration-orchestration'
        };
      }
    }
  });

  // #5-5: Knowledge Retrieval & Context
  skillsRegistry.registerSkill({
    id: 'epii-knowledge-retrieval',
    name: 'Epii Knowledge Retrieval & Context',
    description: 'Retrieves and contextualizes knowledge using Epii\'s advanced RAG capabilities',
    bimbaCoordinate: '#5-5',
    agentId: 'epii-agent',
    version: '1.0.0',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Knowledge query' },
        coordinates: { type: 'array', description: 'Focus coordinates' },
        sources: { type: 'object', description: 'Data sources to use' },
        contextDepth: { type: 'number', default: 2, description: 'Context depth' }
      }
    },
    handler: async (params, context) => {
      try {
        // This delegates to the UnifiedRAG skill but with Epii-specific enhancements
        const unifiedRAGSkill = skillsRegistry.getSkillById('unifiedRAG');
        const ragResult = await unifiedRAGSkill.handler(params, context);

        // Add Epii-specific context enhancement
        if (ragResult.success) {
          const enhancedResult = await epiiAgentService.enhanceKnowledgeContext(
            ragResult.data,
            params.query,
            context
          );

          return {
            success: true,
            data: enhancedResult,
            skillId: 'epii-knowledge-retrieval',
            baseRAG: ragResult.data
          };
        }

        return ragResult;
      } catch (error) {
        return {
          success: false,
          error: error.message,
          skillId: 'epii-knowledge-retrieval'
        };
      }
    }
  });

  console.log('[EpiiOperationalSkills] Registered 6 operational skills for Epii agent (including A2A-integrated pipeline)');
  return skillsRegistry;
}

module.exports = {
  initializeEpiiOperationalSkills
};
