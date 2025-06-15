/**
 * Bimba Update Management Skill
 * Analyzes documents and suggests Bimba node updates with QL-aware relationships
 *
 * Bimba Coordinate: #5-2 (Technical Architecture / Process Dynamics)
 */

// Load environment variables from the backend .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../friendly-file-backend/.env') });

const { AGUIEventTypes, createAGUIEvent } = require('../ag-ui/ag-ui-event-schema');

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

      // Check if AG-UI gateway is available for progress reporting
      const aguiGateway = context?.aguiGateway;
      const runId = context?.runId;
      const threadId = context?.threadId;
      const isAGUIEnabled = !!(aguiGateway && runId);

      // Emit progress event: Starting analysis
      if (isAGUIEnabled) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId,
          threadId,
          stage: 'llm-analysis',
          progress: 10,
          currentStep: 'Validating parameters and preparing analysis'
        }), {
          bimbaCoordinates: [actualParams.coordinate],
          qlStage: 2,
          contextFrame: '(0/1/2)'
        });
      }

      // Note: In Phase 1, we're using the existing parameter data
      // Phase 2 will implement complete node data fetching from Bimba graph
      console.log(`${logPrefix} Using provided node data (Phase 1 implementation)`);
      console.log(`${logPrefix} Node data summary:`, {
        propertiesCount: Object.keys(actualParams.nodeProperties || {}).length,
        relationshipsCount: (actualParams.relationships || []).length
      });

      // Log detailed relationship information for debugging
      if (actualParams.relationships && actualParams.relationships.length > 0) {
        console.log(`${logPrefix} Detailed relationships:`,
          actualParams.relationships.map(rel => ({
            type: rel.type,
            direction: rel.direction,
            properties: rel.properties,
            relatedNode: {
              coordinate: rel.relatedNode?.coordinate,
              title: rel.relatedNode?.title,
              labels: rel.relatedNode?.labels
            }
          }))
        );
      }

      // Emit progress event: Building prompt
      if (isAGUIEnabled) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId,
          threadId,
          stage: 'llm-analysis',
          progress: 30,
          currentStep: 'Building analysis prompt'
        }), {
          bimbaCoordinates: [actualParams.coordinate],
          qlStage: 2,
          contextFrame: '(0/1/2)'
        });
      }

      // Build the analysis prompt
      const analysisPrompt = this._buildAnalysisPrompt(actualParams);

      // Emit progress event: Starting LLM call
      if (isAGUIEnabled) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId,
          threadId,
          stage: 'llm-analysis',
          progress: 50,
          currentStep: 'Calling LLM for analysis'
        }), {
          bimbaCoordinates: [actualParams.coordinate],
          qlStage: 2,
          contextFrame: '(0/1/2)'
        });
      }

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

      // Emit progress event: Parsing response
      if (isAGUIEnabled) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId,
          threadId,
          stage: 'json-parsing',
          progress: 80,
          currentStep: 'Parsing LLM response'
        }), {
          bimbaCoordinates: [actualParams.coordinate],
          qlStage: 2,
          contextFrame: '(0/1/2)'
        });
      }

      // Parse and structure the response
      const structuredResult = this._parseLLMResponse(response, logPrefix, actualParams);

      // Emit progress event: Validation and completion
      if (isAGUIEnabled) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId,
          threadId,
          stage: 'validation',
          progress: 90,
          currentStep: 'Validating results'
        }), {
          bimbaCoordinates: [actualParams.coordinate],
          qlStage: 2,
          contextFrame: '(0/1/2)'
        });
      }

      // Emit comprehensive AG-UI event with suggestions for frontend consumption
      if (isAGUIEnabled) {
        console.log(`${logPrefix} Emitting comprehensive AG-UI update suggestions event`);

        // Enhanced suggestions event with complete data for frontend
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_UPDATE_SUGGESTIONS, {
          runId,
          threadId,
          targetCoordinate: actualParams.coordinate, // Critical: target coordinate for frontend
          propertyUpdates: structuredResult.propertyUpdates || {},
          relationshipSuggestions: structuredResult.relationshipSuggestions || [],
          reasoning: 'Comprehensive analysis completed with enhanced property extraction',
          qlAlignment: `Aligned with QL position #2 (Process Dynamics) analyzing target coordinate ${actualParams.coordinate}`,
          analysisMetadata: {
            llmModel: 'gemini-2.0-flash-exp',
            processingTime: Date.now(),
            targetCoordinate: actualParams.coordinate,
            skillCoordinate: this.bimbaCoordinate,
            documentSource: actualParams.documentName,
            documentType: actualParams.documentType,
            propertyCount: Object.keys(structuredResult.propertyUpdates || {}).length,
            relationshipCount: (structuredResult.relationshipSuggestions || []).length,
            analysisDepth: 'comprehensive'
          },
          // Include complete context for frontend processing
          analysisContext: {
            originalNodeProperties: actualParams.nodeProperties,
            originalRelationships: actualParams.relationships,
            documentContent: actualParams.documentContent.substring(0, 500) + '...',
            targetCoordinate: actualParams.coordinate,
            skillExecutionPath: `${this.bimbaCoordinate} -> ${actualParams.coordinate}`
          }
        }), {
          bimbaCoordinates: [actualParams.coordinate], // Target coordinate, not skill coordinate
          qlStage: 2,
          contextFrame: '(0/1/2)',
          targetCoordinate: actualParams.coordinate
        });

        // Final progress event with completion details
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId,
          threadId,
          stage: 'completion',
          progress: 100,
          currentStep: `Analysis completed for coordinate ${actualParams.coordinate}`,
          completionDetails: {
            targetCoordinate: actualParams.coordinate,
            propertiesGenerated: Object.keys(structuredResult.propertyUpdates || {}).length,
            relationshipsGenerated: (structuredResult.relationshipSuggestions || []).length,
            analysisSuccess: true
          }
        }), {
          bimbaCoordinates: [actualParams.coordinate],
          qlStage: 2,
          contextFrame: '(0/1/2)',
          targetCoordinate: actualParams.coordinate
        });

        console.log(`${logPrefix} AG-UI events emitted successfully for coordinate ${actualParams.coordinate}`);
      }

      console.log(`${logPrefix} Skill execution completed successfully`);

      // Return the result in the format expected by the A2A server
      // IMPORTANT: Use the TARGET coordinate, not the skill's coordinate
      return {
        success: true,
        skillId: this.skillId,
        bimbaCoordinate: actualParams.coordinate, // TARGET coordinate, not skill coordinate
        targetCoordinate: actualParams.coordinate, // Explicitly set target coordinate
        agentId: 'epii-agent',
        qlMetadata: {
          qlPosition: 2, // This is the skill's QL position
          contextFrame: '(0/1/2)',
          qlMode: 'ascending',
          targetCoordinate: actualParams.coordinate // Target coordinate metadata
        },
        data: {
          ...structuredResult,
          targetCoordinate: actualParams.coordinate, // Ensure target coordinate is in data
          analysisContext: {
            skillCoordinate: this.bimbaCoordinate, // #5-2 (skill's coordinate)
            targetCoordinate: actualParams.coordinate, // The actual target being analyzed
            documentSource: actualParams.documentName
          }
        }
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

TASK: Generate foundational property updates for this Bimba node based on the document content, strictly prioritizing the four core relational properties from the Notion crystallisation framework.

**🎯 FOUNDATIONAL PRIORITY: The Four Core Relational Properties**

These FOUR properties are the foundational layer and MUST be prioritized above all others:

1. **qlOperators** (Rich Text) - ESSENTIAL FOUNDATION
   - Identify and structure the quaternary logic operators present in the document
   - Format as structured text describing the QL operational patterns
   - Focus on how the document reveals specific QL operational dynamics
   - Example: "Material emergence (0→1), processual activation (1→2), formal mediation (2→3), contextual embedding (3→4)"

2. **epistemicEssence** (Rich Text) - ESSENTIAL FOUNDATION
   - Extract deep insights about the epistemic nature revealed by the document
   - Focus on knowledge structures, truth patterns, and cognitive architectures
   - Capture the essential knowing patterns embedded in the content
   - Example: "Recursive knowledge structures that self-reference through quaternary logic patterns, revealing emergent epistemic properties"

3. **archetypalAnchors** (Rich Text) - ESSENTIAL FOUNDATION
   - Identify archetypal patterns and symbolic anchors for manual page creation
   - Focus on universal patterns, symbolic structures, and archetypal resonances
   - Provide structured content suitable for Notion page creation
   - Example: "The Quaternary Mandala: Four-fold patterns reflecting cosmic order, with center-periphery dynamics and recursive self-similarity"

4. **semanticFramework** (Rich Text) - ESSENTIAL FOUNDATION
   - Derive the semantic framework structure from document analysis
   - Focus on meaning relationships, conceptual hierarchies, and semantic networks
   - Capture how concepts relate within the quaternary logic structure
   - Example: "Hierarchical semantic network with quaternary branching: concept → sub-concepts (4) → sub-sub-concepts (16) → applications (64)"

**Secondary QL Properties** (include if document supports them):
- qlPosition → Select (0,1,2,3,4,5)
- qlCategory → Select (implicate, explicate)
- qlOperatorTypes → Multi-select (structural, processual, contextual)
- qlVariant → Text (default: "4/6")
- qlDynamics → Select (emergence, activation, mediation, etc.)
- relationshipStrength → Number (percentage)

**Moderate Additional Properties** (only if strongly supported):
- description → Enhanced description (only if document provides significant new insights)
- summary → Concise summary (only if document warrants it)
- lastAnalyzed → Current date
- documentSource → Source document name
- contextualRelevance → "high", "medium", or "low"

**CRITICAL GUIDELINES**:
1. **Foundation First**: The four core relational properties are MANDATORY - always attempt to generate meaningful content for these
2. **Quality over Quantity**: 6-10 total properties maximum, with the four foundational properties taking priority
3. **Semantic Alignment**: Ensure each foundational property captures the specific aspect it represents
4. **Document Grounding**: All suggestions must be directly supported by document content
5. **Structured Format**: Format foundational properties as rich text suitable for Notion database integration

2. **QL-Aware Relationship Suggestions**: Create meaningful connections based on semantic analysis

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

Respond with a JSON object in this exact format, prioritizing the FOUR FOUNDATIONAL RELATIONAL PROPERTIES:
{
  "propertyUpdates": {
    // 🎯 FOUNDATIONAL LAYER - MANDATORY (The Four Core Relational Properties)
    "qlOperators": "Structured description of quaternary logic operators identified in the document - focus on operational patterns and QL dynamics",
    "epistemicEssence": "Deep insights about the epistemic nature and knowledge structures revealed by the document content",
    "archetypalAnchors": "Archetypal patterns, symbolic structures, and universal resonances suitable for Notion page creation",
    "semanticFramework": "Semantic framework structure showing meaning relationships and conceptual hierarchies within QL context",

    // SECONDARY QL PROPERTIES (include if document supports them)
    "qlPosition": 2,
    "qlCategory": "explicate",
    "qlOperatorTypes": ["processual", "contextual"],
    "qlVariant": "4/6",
    "qlDynamics": "mediation",
    "relationshipStrength": 0.85,

    // MODERATE ADDITIONAL PROPERTIES (only if strongly supported by document)
    "description": "Enhanced description only if document provides significant new insights",
    "summary": "Concise summary only if document warrants it",
    "lastAnalyzed": "2024-01-XX",
    "documentSource": "source_document_name",
    "contextualRelevance": "high"
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
        "description": "Detailed description",
        "semanticBasis": "Why this relationship exists semantically",
        "functionalRole": "What role this relationship plays"
      },
      "reasoning": "Detailed reasoning for this relationship suggestion",
      "confidence": 0.8
    }
  ]
}

CRITICAL REQUIREMENTS:
1. **FOUNDATIONAL PRIORITY**: The four core relational properties (qlOperators, epistemicEssence, archetypalAnchors, semanticFramework) are MANDATORY and must be included with meaningful content derived from the document.
2. **Quality over Quantity**: Maximum 6-10 total properties, with foundational properties taking precedence.
3. **Document Grounding**: Every property must be directly supported by document content - no generic or template responses.
4. **Structured Format**: Format foundational properties as rich text suitable for Notion database integration.
5. **Semantic Alignment**: Ensure each foundational property captures its specific epistemic aspect as defined above.
6. **No Generic Content**: Avoid placeholder text - provide substantive, document-specific insights for each foundational property.
7. Do NOT include reasoning or qlAlignment fields in the top level of your JSON response.
8. For relationships, use standard Neo4j relationship types like RELATES_TO, IMPLEMENTS, DEFINES, etc.`;
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
