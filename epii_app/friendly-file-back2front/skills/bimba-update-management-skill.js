/**
 * Bimba Update Management Skill
 * Analyzes documents and suggests Bimba node updates with QL-aware relationships
 * 
 * Bimba Coordinate: #5-2 (Technical Architecture / Process Dynamics)
 */

class BimbaUpdateManagementSkill {
  constructor() {
    this.skillId = 'bimba-update-management';
    this.name = 'Bimba Update Management';
    this.description = 'Analyzes documents and suggests Bimba node updates with QL-aware relationships';
    this.bimbaCoordinate = '#5-2';
    this.version = '1.0.0';
  }

  /**
   * Execute the Bimba Update Management skill
   * @param {Object} params - Skill parameters
   * @param {string} params.coordinate - Target Bimba coordinate
   * @param {Object} params.nodeProperties - Current node properties (filtered)
   * @param {Array} params.relationships - Current node relationships
   * @param {string} params.documentContent - Document content to analyze
   * @param {string} params.documentType - Type of document (bimba/pratibimba)
   * @param {string} params.documentName - Name of the document
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Structured suggestions for Bimba updates
   */
  async execute(params, context) {
    const logPrefix = `[BimbaUpdateManagement:${params.coordinate}]`;
    console.log(`${logPrefix} Executing skill with params:`, {
      coordinate: params.coordinate,
      documentType: params.documentType,
      documentName: params.documentName,
      hasContent: !!params.documentContent,
      propertiesCount: Object.keys(params.nodeProperties || {}).length,
      relationshipsCount: (params.relationships || []).length
    });

    try {
      // Get the Epii agent service from context
      const epiiAgentService = context._epiiAgentService;
      if (!epiiAgentService) {
        throw new Error('Epii agent service not available in context');
      }

      // Build the analysis prompt for the Epii agent
      const analysisPrompt = this._buildAnalysisPrompt(params);

      // Process through Epii agent with enhanced context
      console.log(`${logPrefix} Calling Epii agent for analysis...`);
      const result = await epiiAgentService.processChatMessage(analysisPrompt, {
        ...context,
        targetCoordinate: '#5-2',
        mode: 'bimba-update-analysis',
        qlMetadata: {
          qlPosition: 2,
          contextFrame: '(0/1/2)',
          qlMode: 'ascending'
        },
        documentContext: {
          coordinate: params.coordinate,
          documentType: params.documentType,
          documentName: params.documentName,
          hasContent: !!params.documentContent
        }
      });

      console.log(`${logPrefix} Epii agent response received`);

      // Parse and structure the response
      const structuredResult = this._parseEpiiResponse(result, logPrefix);

      console.log(`${logPrefix} Skill execution completed successfully`);
      return structuredResult;

    } catch (error) {
      console.error(`${logPrefix} Skill execution failed:`, error);
      return {
        error: 'Skill execution failed',
        message: error.message,
        reasoning: 'Unable to process document for Bimba updates',
        coordinate: params.coordinate
      };
    }
  }

  /**
   * Build the analysis prompt for the Epii agent
   * @param {Object} params - Skill parameters
   * @returns {string} Formatted prompt
   */
  _buildAnalysisPrompt(params) {
    return `As the Epii agent specializing in Bimba Update Management at coordinate #5-2, analyze this document and suggest specific updates for the Bimba node.

CURRENT BIMBA NODE:
- Coordinate: ${params.coordinate}
- Properties: ${JSON.stringify(params.nodeProperties, null, 2)}
- Current Relationships: ${JSON.stringify(params.relationships, null, 2)}

DOCUMENT ANALYSIS:
- Document Type: ${params.documentType}
- Document Name: ${params.documentName}
- Content: ${params.documentContent}

TASK: Provide structured suggestions for updating this Bimba node based on the document content. Focus on:

1. Property updates that reflect the document insights
2. New QL-aware relationships to create based on semantic analysis
3. Relationship properties that align with Quaternal Logic principles

QL RELATIONSHIP SCHEMA REFERENCE:
- 0_POTENTIAL_RELATION: Position #0 (Implicit Theme or Field of Potential)
- 1_MATERIAL_RELATION: Position #1 (Material Cause or "What")
- 2_PROCESSUAL_RELATION: Position #2 (Efficient Cause or "How")
- 3_MEDIATING_RELATION: Position #3 (Formal Mediation)
- 4_CONTEXTUAL_RELATION: Position #4 (Contextual Arena)
- 5_QUINTESSENTIAL_RELATION: Position #5 (Quintessence)

QL Dynamics:
- foundational_emergence: 0→1 (From potential to material definition)
- processual_activation: 1→2 (From definition to process)
- formal_mediation: 2→3 (From process to integration)
- contextual_embedding: 3→4 (From integration to context)
- quintessential_synthesis: 4→5 (From context to synthesis)
- recursive_renewal: 5→0 (From synthesis back to potential)

Respond with a JSON object in this exact format:
{
  "propertyUpdates": {
    "property_name": "new_value"
  },
  "relationshipSuggestions": [
    {
      "action": "create",
      "type": "RELATIONSHIP_TYPE",
      "targetCoordinate": "#X-Y-Z",
      "properties": {
        "qlType": "1_MATERIAL_RELATION",
        "qlDynamics": "foundational_emergence",
        "qlContextFrame": "0/1",
        "strength": 0.8,
        "description": "Detailed description"
      },
      "reasoning": "Why this relationship is suggested"
    }
  ],
  "reasoning": "Overall reasoning for the suggestions based on document analysis",
  "qlAlignment": "How suggestions align with Quaternal Logic principles"
}`;
  }

  /**
   * Parse the Epii agent response and structure it
   * @param {*} result - Raw result from Epii agent
   * @param {string} logPrefix - Logging prefix
   * @returns {Object} Structured result
   */
  _parseEpiiResponse(result, logPrefix) {
    // Try to extract JSON from the result
    if (typeof result === 'string') {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log(`${logPrefix} Successfully parsed JSON response`);
          return parsed;
        } catch (parseError) {
          console.warn(`${logPrefix} Could not parse JSON from Epii agent response:`, parseError);
        }
      }
    }

    // If result is already an object, validate and return it
    if (typeof result === 'object' && result !== null) {
      console.log(`${logPrefix} Using object response directly`);
      return result;
    }

    // Fallback for unparseable responses
    console.warn(`${logPrefix} Could not parse response, returning fallback structure`);
    return {
      rawResponse: typeof result === 'string' ? result : JSON.stringify(result),
      error: 'Could not parse as structured JSON',
      reasoning: 'Skill executed but response format needs adjustment',
      propertyUpdates: {},
      relationshipSuggestions: []
    };
  }

  /**
   * Get skill metadata for registration
   */
  getSkillMetadata() {
    return {
      id: this.skillId,
      name: this.name,
      description: this.description,
      bimbaCoordinate: this.bimbaCoordinate,
      version: this.version,
      agentId: 'epii-agent',
      qlMetadata: {
        qlPosition: 2,
        contextFrame: '(0/1/2)',
        qlMode: 'ascending'
      },
      harmonicMetadata: {
        resonantFrequency: 'process dynamics',
        harmonicRelations: ['#5-1', '#2-0'],
        paraVakAspect: 'madhyama',
        ontologicalLayer: 'co-homo-logos'
      },
      databaseMetadata: {
        primaryDatabase: 'neo4j-bimba',
        secondaryDatabases: ['notion-coordinates'],
        accessPattern: 'process'
      },
      inputSchema: {
        type: 'object',
        required: ['coordinate', 'nodeProperties', 'documentContent'],
        properties: {
          coordinate: { type: 'string', description: 'Target Bimba coordinate' },
          nodeProperties: { type: 'object', description: 'Current node properties (filtered)' },
          relationships: { type: 'array', description: 'Current node relationships' },
          documentContent: { type: 'string', description: 'Document content to analyze' },
          documentType: { type: 'string', description: 'Type of document (bimba/pratibimba)' },
          documentName: { type: 'string', description: 'Name of the document' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          propertyUpdates: { type: 'object', description: 'Suggested property updates' },
          relationshipSuggestions: { type: 'array', description: 'Suggested relationship changes' },
          reasoning: { type: 'string', description: 'Overall reasoning for suggestions' },
          qlAlignment: { type: 'string', description: 'QL alignment explanation' }
        }
      }
    };
  }
}

module.exports = BimbaUpdateManagementSkill;
