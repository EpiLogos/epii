/**
 * Bimba Update Management Skill
 * Analyzes documents and suggests Bimba node updates with QL-aware relationships
 *
 * Bimba Coordinate: #5-2 (Technical Architecture / Process Dynamics)
 */

// Load environment variables from the backend .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../friendly-file-backend/.env') });

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
    // Debug: Log the raw parameters to understand the structure
    console.log('[BimbaUpdateManagement] ===== SKILL EXECUTION START =====');
    console.log('[BimbaUpdateManagement] Raw params received:', JSON.stringify(params, null, 2));
    console.log('[BimbaUpdateManagement] Raw context received:', JSON.stringify(context, null, 2));
    console.log('[BimbaUpdateManagement] Params type:', typeof params);
    console.log('[BimbaUpdateManagement] Context type:', typeof context);

    // Extract parameters from multiple possible nested structures
    let actualParams = {};

    // Try different parameter extraction strategies
    if (params.parameters) {
      actualParams = params.parameters;
    } else if (context && context.parameters) {
      actualParams = context.parameters;
    } else if (params) {
      actualParams = params;
    }

    // If still no parameters, try to extract from context
    if (!actualParams.coordinate && context) {
      actualParams = {
        coordinate: context.targetCoordinate || actualParams.coordinate,
        nodeProperties: actualParams.nodeProperties || {},
        relationships: actualParams.relationships || [],
        documentContent: context.documentContent || actualParams.documentContent,
        documentType: actualParams.documentType,
        documentName: actualParams.documentName
      };
    }

    const logPrefix = `[BimbaUpdateManagement:${actualParams.coordinate || 'unknown'}]`;
    console.log(`${logPrefix} Executing skill with extracted params:`, {
      coordinate: actualParams.coordinate,
      documentType: actualParams.documentType,
      documentName: actualParams.documentName,
      hasContent: !!actualParams.documentContent,
      contentLength: actualParams.documentContent ? actualParams.documentContent.length : 0,
      propertiesCount: Object.keys(actualParams.nodeProperties || {}).length,
      relationshipsCount: (actualParams.relationships || []).length
    });

    try {
      // Validate that we have the minimum required parameters
      if (!actualParams.coordinate) {
        console.warn(`${logPrefix} Missing coordinate parameter, cannot proceed`);
        return {
          success: false,
          skillId: this.skillId,
          bimbaCoordinate: this.bimbaCoordinate,
          agentId: 'epii-agent',
          qlMetadata: {
            qlPosition: 2,
            contextFrame: '(0/1/2)',
            qlMode: 'ascending'
          },
          error: 'Missing required parameter: coordinate',
          data: {
            error: 'Missing required parameter: coordinate',
            propertyUpdates: {},
            relationshipSuggestions: []
          }
        };
      }

      if (!actualParams.documentContent) {
        console.warn(`${logPrefix} Missing document content, cannot analyze`);
        return {
          success: false,
          skillId: this.skillId,
          bimbaCoordinate: this.bimbaCoordinate,
          agentId: 'epii-agent',
          qlMetadata: {
            qlPosition: 2,
            contextFrame: '(0/1/2)',
            qlMode: 'ascending'
          },
          error: 'Missing required parameter: documentContent',
          data: {
            error: 'Missing required parameter: documentContent',
            propertyUpdates: {},
            relationshipSuggestions: []
          }
        };
      }

      console.log(`${logPrefix} Parameters validated, proceeding with analysis`);

      // Fetch complete node data from the Bimba graph instead of using limited params
      console.log(`${logPrefix} Fetching complete node data from Bimba graph for coordinate: ${actualParams.coordinate}`);
      const completeNodeData = await this._fetchCompleteNodeData(actualParams.coordinate, logPrefix);

      // Update actualParams with complete data
      actualParams.nodeProperties = completeNodeData.properties;
      actualParams.relationships = completeNodeData.relationships;

      console.log(`${logPrefix} Complete node data retrieved:`, {
        propertiesCount: Object.keys(actualParams.nodeProperties).length,
        relationshipsCount: actualParams.relationships.length
      });

      // Build the analysis prompt with complete data
      const analysisPrompt = this._buildAnalysisPrompt(actualParams);

      // Make a direct LLM call using ChatGoogleGenerativeAI
      console.log(`${logPrefix} Making direct LLM call for analysis...`);

      // Import the LLM
      const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');

      const llm = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: 'gemini-2.0-flash-exp',
        temperature: 0.3,
        maxOutputTokens: 4096
      });

      const response = await llm.invoke([
        ["system", "You are an expert in Quaternal Logic and Bimba knowledge graph management. Analyze the provided document and current node state to suggest precise, structured updates. Always respond with valid JSON in the exact format requested."],
        ["human", analysisPrompt]
      ]);

      console.log(`${logPrefix} LLM response received:`, JSON.stringify(response, null, 2));

      // Parse and structure the response
      const structuredResult = this._parseLLMResponse(response, logPrefix, actualParams);

      console.log(`${logPrefix} Skill execution completed successfully`);

      // Return the result in the format expected by the A2A server
      return {
        success: true,
        skillId: this.skillId,
        bimbaCoordinate: this.bimbaCoordinate,
        agentId: 'epii-agent',
        qlMetadata: {
          qlPosition: 2,
          contextFrame: '(0/1/2)',
          qlMode: 'ascending'
        },
        data: structuredResult
      };

    } catch (error) {
      console.error(`${logPrefix} Skill execution failed:`, error);
      return {
        success: false,
        skillId: this.skillId,
        bimbaCoordinate: this.bimbaCoordinate,
        agentId: 'epii-agent',
        qlMetadata: {
          qlPosition: 2,
          contextFrame: '(0/1/2)',
          qlMode: 'ascending'
        },
        error: error.message,
        data: {
          error: 'Skill execution failed',
          message: error.message,
          reasoning: 'Unable to process document for Bimba updates',
          coordinate: actualParams.coordinate,
          propertyUpdates: {},
          relationshipSuggestions: []
        }
      };
    }
  }

  /**
   * Build the analysis prompt for the Epii agent
   * @param {Object} params - Skill parameters
   * @returns {string} Formatted prompt
   */
  _buildAnalysisPrompt(params) {
    return `As the Epii agent specializing in Bimba Update Management, analyze this document and suggest specific updates for the Bimba node at coordinate ${params.coordinate}.

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
  ]
}

IMPORTANT:
1. Do NOT include any reasoning or qlAlignment fields in the top level of your JSON response.
2. Focus on extracting actual property values from the document content.
3. Ensure all property names match exactly what would be expected in the Bimba node.
4. For relationships, use standard Neo4j relationship types like RELATES_TO, IMPLEMENTS, DEFINES, etc.`;
  }

  /**
   * Parse the LLM response and structure it
   * @param {*} result - Raw result from LLM
   * @param {string} logPrefix - Logging prefix
   * @param {Object} actualParams - The actual parameters for fallback data
   * @returns {Object} Structured result
   */
  _parseLLMResponse(result, logPrefix, actualParams) {
    try {
      console.log(`${logPrefix} Parsing LLM response structure:`, typeof result);

      // Extract content from LLM response - handle different response structures
      let responseText = '';

      if (result && result.content) {
        responseText = result.content;
      } else if (result && result.text) {
        responseText = result.text;
      } else if (result && typeof result === 'string') {
        responseText = result;
      } else if (result && result.response) {
        responseText = result.response;
      } else if (result && result.message && result.message.content) {
        responseText = result.message.content;
      } else if (result && result.choices && result.choices[0] && result.choices[0].message) {
        responseText = result.choices[0].message.content;
      } else {
        console.error(`${logPrefix} Unknown response structure:`, Object.keys(result || {}));
        throw new Error('No valid response content found in LLM response');
      }

      console.log(`${logPrefix} Extracted response text:`, responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));

      // Try to extract JSON from the response - handle multiple JSON extraction strategies
      let jsonData = null;

      // Strategy 1: Look for JSON block with ```json
      const jsonBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        try {
          jsonData = JSON.parse(jsonBlockMatch[1]);
          console.log(`${logPrefix} Successfully parsed JSON from code block`);
        } catch (e) {
          console.warn(`${logPrefix} Failed to parse JSON from code block:`, e.message);
        }
      }

      // Strategy 2: Look for any JSON object in the response
      if (!jsonData) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0]);
            console.log(`${logPrefix} Successfully parsed JSON from regex match`);
          } catch (e) {
            console.warn(`${logPrefix} Failed to parse JSON from regex match:`, e.message);
          }
        }
      }

      // Strategy 3: Try to parse the entire response as JSON
      if (!jsonData) {
        try {
          jsonData = JSON.parse(responseText);
          console.log(`${logPrefix} Successfully parsed entire response as JSON`);
        } catch (e) {
          console.warn(`${logPrefix} Failed to parse entire response as JSON:`, e.message);
        }
      }

      if (jsonData) {
        console.log(`${logPrefix} Parsed JSON data:`, JSON.stringify(jsonData, null, 2));

        // Validate and structure the response
        const structuredResult = {
          propertyUpdates: jsonData.propertyUpdates || {},
          relationshipSuggestions: jsonData.relationshipSuggestions || []
        };

        console.log(`${logPrefix} Returning structured result:`, JSON.stringify(structuredResult, null, 2));
        return structuredResult;
      } else {
        throw new Error('No valid JSON found in LLM response');
      }

    } catch (parseError) {
      console.error(`${logPrefix} Could not parse LLM response:`, parseError);
      console.error(`${logPrefix} Raw response for debugging:`, result);

      // Return fallback structure with some basic analysis if we have document content
      const fallbackResult = {
        propertyUpdates: {},
        relationshipSuggestions: []
      };

      // If we have document content, try to provide some basic property updates
      if (actualParams && actualParams.documentContent) {
        fallbackResult.propertyUpdates = {
          lastAnalyzed: new Date().toISOString(),
          documentSource: actualParams.documentName || 'unknown',
          analysisStatus: 'partial_fallback'
        };
      }

      console.log(`${logPrefix} Returning fallback result:`, JSON.stringify(fallbackResult, null, 2));
      return fallbackResult;
    }
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
          relationshipSuggestions: { type: 'array', description: 'Suggested relationship changes' }
        }
      }
    };
  }
}

module.exports = BimbaUpdateManagementSkill;
