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
    
    // Sub-skills
    this.subSkills = {
      updateApplication: {
        skillId: 'bimba-update-application',
        name: 'Bimba Update Application',
        description: 'Triggers frontend update mechanisms via AG-UI events for agent-assisted workflow optimization',
        bimbaCoordinate: '#5-2-0',
        parentSkill: '#5-2',
        version: '1.0.0'
      }
    };
  }

  /**
   * Execute update application - triggers frontend update mechanisms via AG-UI
   * @param {Object} params - Update application parameters
   * @param {string} params.action - 'apply-suggestions', 'apply-updates', or 'apply-specific'
   * @param {Array} params.coordinates - Optional: specific coordinates to apply updates for  
   * @param {Object} context - Execution context with AG-UI gateway
   * @returns {Promise<Object>} Result of update application trigger
   */
  async executeUpdateApplication(params, context) {
    console.log('[BimbaUpdateManagement] Executing update application request');
    
    try {
      const result = await this._triggerUpdateApplication({
        action: params.action || 'apply-suggestions',
        coordinates: params.coordinates,
        context: {
          aguiGateway: context.aguiGateway,
          runId: context.runId || params.runId,
          threadId: context.threadId || params.threadId
        }
      });
      
      return {
        success: result.success,
        skillId: this.skillId,
        bimbaCoordinate: this.bimbaCoordinate,
        agentId: 'epii-agent',
        operationType: 'update-application',
        data: result
      };
      
    } catch (error) {
      console.error('[BimbaUpdateManagement] Update application execution failed:', error);
      return {
        success: false,
        skillId: this.skillId,
        agentId: 'epii-agent',
        error: error.message,
        operationType: 'update-application'
      };
    }
  }

  /**
   * Execute the Bimba Update Management skill
   * @param {Object} params - Skill parameters
   * @param {string|Array} params.coordinate - Target Bimba coordinate(s) - can be single string or array for multi-coordinate analysis
   * @param {Object} params.nodeProperties - Current node properties (filtered)
   * @param {Array} params.relationships - Current node relationships
   * @param {string} params.documentContent - Document content to analyze
   * @param {string} params.documentType - Type of document (bimba/pratibimba)
   * @param {string} params.documentName - Name of the document
   * @param {boolean} params.multiCoordinateMode - Whether this is a multi-coordinate analysis
   * @param {Array} params.targetCoordinates - Array of coordinates for multi-coordinate mode
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Structured suggestions for Bimba updates (single or multi-coordinate)
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
    if (!actualParams.coordinate && !actualParams.targetCoordinates && context) {
      actualParams = {
        coordinate: context.targetCoordinate || actualParams.coordinate,
        nodeProperties: actualParams.nodeProperties || {},
        relationships: actualParams.relationships || [],
        documentContent: context.documentContent || actualParams.documentContent,
        documentType: actualParams.documentType,
        documentName: actualParams.documentName,
        multiCoordinateMode: actualParams.multiCoordinateMode || false,
        targetCoordinates: actualParams.targetCoordinates || context.targetCoordinates
      };
    }

    // Detect multi-coordinate mode
    const isMultiCoordinateMode = actualParams.multiCoordinateMode || 
                                 Array.isArray(actualParams.coordinate) || 
                                 (actualParams.targetCoordinates && actualParams.targetCoordinates.length > 1);
    
    // Normalize coordinates for processing
    let targetCoordinates;
    if (isMultiCoordinateMode) {
      targetCoordinates = actualParams.targetCoordinates || 
                         (Array.isArray(actualParams.coordinate) ? actualParams.coordinate : [actualParams.coordinate]);
    } else {
      targetCoordinates = [actualParams.coordinate];
    }

    // Update actualParams to include normalized data
    actualParams.multiCoordinateMode = isMultiCoordinateMode;
    actualParams.targetCoordinates = targetCoordinates;

    const logPrefix = `[BimbaUpdateManagement:${isMultiCoordinateMode ? 'MULTI' : (actualParams.coordinate || 'unknown')}]`;
    console.log(`${logPrefix} Executing skill with extracted params:`, {
      coordinate: actualParams.coordinate,
      multiCoordinateMode: isMultiCoordinateMode,
      targetCoordinates: targetCoordinates,
      coordinateCount: targetCoordinates.length,
      documentType: actualParams.documentType,
      documentName: actualParams.documentName,
      hasContent: !!actualParams.documentContent,
      contentLength: actualParams.documentContent ? actualParams.documentContent.length : 0,
      propertiesCount: Object.keys(actualParams.nodeProperties || {}).length,
      relationshipsCount: (actualParams.relationships || []).length
    });

    try {
      // Validate that we have the minimum required parameters
      if (!isMultiCoordinateMode && !actualParams.coordinate) {
        console.warn(`${logPrefix} Missing coordinate parameter for single-coordinate mode, cannot proceed`);
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

      if (isMultiCoordinateMode && (!targetCoordinates || targetCoordinates.length === 0)) {
        console.warn(`${logPrefix} Missing target coordinates for multi-coordinate mode, cannot proceed`);
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
          error: 'Missing required parameter: targetCoordinates for multi-coordinate mode',
          data: {
            error: 'Missing required parameter: targetCoordinates for multi-coordinate mode',
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

      console.log(`${logPrefix} Parameters validated, proceeding with ${isMultiCoordinateMode ? 'multi-coordinate' : 'single-coordinate'} analysis`);

      // Check if AG-UI gateway is available for progress reporting
      const aguiGateway = context?.aguiGateway;
      const runId = context?.runId;
      const threadId = context?.threadId;
      const isAGUIEnabled = !!(aguiGateway && runId);

      // Branch execution based on mode
      if (isMultiCoordinateMode) {
        return await this._executeMultiCoordinateAnalysis(actualParams, context, aguiGateway, runId, threadId, logPrefix);
      } else {
        return await this._executeSingleCoordinateAnalysis(actualParams, context, aguiGateway, runId, threadId, logPrefix);
      }


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
   * Execute multi-coordinate analysis - processes multiple coordinates simultaneously
   * Routes through Epi-Logos Agent for conversational approval and presentation
   */
  async _executeMultiCoordinateAnalysis(actualParams, context, aguiGateway, runId, threadId, logPrefix) {
    console.log(`${logPrefix} Starting multi-coordinate analysis for ${actualParams.targetCoordinates.length} coordinates`);
    
    const isAGUIEnabled = !!(aguiGateway && runId);
    const targetCoordinates = actualParams.targetCoordinates;
    
    if (isAGUIEnabled) {
      aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
        runId,
        threadId,
        stage: 'multi-coordinate-analysis',
        progress: 10,
        currentStep: `Analyzing ${targetCoordinates.length} coordinates simultaneously`
      }), {
        bimbaCoordinates: targetCoordinates,
        qlStage: 2,
        contextFrame: '(0/1/2)'
      });
    }

    // Hinted node creation - create user-specified coordinate spaces for philosophical exploration
    let nodeCreationResult = null;
    if (actualParams.hintedCoordinates && actualParams.hintedCoordinates.length > 0) {
      console.log(`${logPrefix} Processing user-hinted coordinates for philosophical exploration...`);
      try {
        nodeCreationResult = await this._createHintedNodes({
          hintedCoordinates: actualParams.hintedCoordinates,
          targetCoordinates: targetCoordinates,
          documentName: actualParams.documentName,
          philosophicalContext: actualParams.philosophicalContext,
          documentContent: actualParams.documentContent // Pass document content for content allocation
        });
        
        if (nodeCreationResult.created.length > 0) {
          console.log(`${logPrefix} Created ${nodeCreationResult.created.length} hinted coordinate spaces for philosophical exploration`);
          
          if (isAGUIEnabled) {
            aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
              runId,
              threadId,
              stage: 'hinted-node-creation',
              progress: 25,
              currentStep: `Created ${nodeCreationResult.created.length} user-hinted coordinate spaces`,
              createdNodes: nodeCreationResult.created
            }), {
              bimbaCoordinates: [...targetCoordinates, ...nodeCreationResult.created.map(n => n.coordinate)],
              qlStage: 2,
              contextFrame: '(0/1/2)'
            });
          }
        }
      } catch (nodeCreationError) {
        console.warn(`${logPrefix} Hinted node creation failed:`, nodeCreationError);
        nodeCreationResult = { 
          created: [], 
          errors: [{ general: nodeCreationError.message }],
          message: 'Hinted coordinate creation encountered errors'
        };
      }
    }

    // Build multi-coordinate analysis prompt
    const multiPrompt = this._buildMultiCoordinateAnalysisPrompt(actualParams);
    
    // Direct LLM analysis for structured results
    console.log(`${logPrefix} Performing direct LLM analysis for multi-coordinate structured results...`);
    
    const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
    
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-2.0-flash-exp',
      temperature: 0.3,
      maxOutputTokens: 4096
    });

    const response = await llm.invoke([
      ["system", "You are an expert in Quaternal Logic and Bimba knowledge graph management. Analyze the provided document for multiple coordinates and suggest precise, structured updates including cross-coordinate relationships. Always respond with valid JSON in the exact format requested."],
      ["human", multiPrompt]
    ]);

    // Parse the multi-coordinate response
    const structuredResult = this._parseMultiCoordinateLLMResponse(response, logPrefix, actualParams);
    
    // Emit AG-UI events for each coordinate's suggestions
    if (isAGUIEnabled && structuredResult.multiCoordinateResults) {
      for (const [coordinate, coordinateResult] of Object.entries(structuredResult.multiCoordinateResults)) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_UPDATE_SUGGESTIONS, {
          runId,
          threadId,
          targetCoordinate: coordinate,
          propertyUpdates: coordinateResult.propertyUpdates || {},
          relationshipSuggestions: coordinateResult.relationshipSuggestions || [],
          crossCoordinateRelationships: structuredResult.crossCoordinateRelationships || [],
          relevanceScore: coordinateResult.relevanceScore,
          keyAspects: coordinateResult.keyAspects,
          reasoning: `Multi-coordinate analysis: ${coordinateResult.keyAspects?.join(', ') || 'Coordinate-specific insights'}`,
          qlAlignment: `Multi-coordinate QL analysis for ${coordinate} (relevance: ${coordinateResult.relevanceScore})`
        }), {
          bimbaCoordinates: targetCoordinates,
          qlStage: 2,
          contextFrame: '(0/1/2)',
          targetCoordinate: coordinate,
          multiCoordinateMode: true
        });
      }
      
      // Emit summary progress event
      aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
        runId,
        threadId,
        stage: 'multi-coordinate-suggestions-generated',
        progress: 90,
        currentStep: `Generated suggestions for ${Object.keys(structuredResult.multiCoordinateResults).length} coordinates with ${structuredResult.crossCoordinateRelationships?.length || 0} cross-coordinate relationships`,
        coordinateCount: Object.keys(structuredResult.multiCoordinateResults).length,
        relationshipCount: structuredResult.crossCoordinateRelationships?.length || 0
      }), {
        bimbaCoordinates: targetCoordinates,
        qlStage: 2,
        contextFrame: '(0/1/2)'
      });
    }
    
    // Also route through Epi-Logos Agent for conversational presentation (optional)
    const conversationalResult = await this._routeToEpiLogosAgent({
      type: 'multi-coordinate-bimba-analysis',
      coordinates: targetCoordinates,
      documentContent: actualParams.documentContent,
      documentName: actualParams.documentName,
      prompt: multiPrompt,
      structuredResults: structuredResult, // Include structured results for agent context
      context: {
        runId,
        threadId,
        aguiGateway
      }
    });

    return {
      success: true,
      skillId: this.skillId,
      bimbaCoordinate: this.bimbaCoordinate,
      agentId: 'epii-agent',
      multiCoordinateMode: true,
      targetCoordinates: targetCoordinates,
      qlMetadata: {
        qlPosition: 2,
        contextFrame: '(0/1/2)',
        qlMode: 'ascending',
        analysisType: 'multi-coordinate'
      },
      data: conversationalResult,
      nodeCreation: nodeCreationResult // Include dynamic node creation results
    };
  }

  /**
   * Execute single-coordinate analysis - original workflow
   */
  async _executeSingleCoordinateAnalysis(actualParams, context, aguiGateway, runId, threadId, logPrefix) {
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
    console.log(`${logPrefix} Using provided node data (Phase 1 implementation)`);
    
    // Hinted node creation - create user-specified coordinate spaces for philosophical exploration
    let nodeCreationResult = null;
    if (actualParams.hintedCoordinates && actualParams.hintedCoordinates.length > 0) {
      console.log(`${logPrefix} Processing user-hinted coordinates for philosophical exploration...`);
      try {
        nodeCreationResult = await this._createHintedNodes({
          hintedCoordinates: actualParams.hintedCoordinates,
          targetCoordinates: [actualParams.coordinate],
          documentName: actualParams.documentName,
          philosophicalContext: actualParams.philosophicalContext,
          documentContent: actualParams.documentContent // Pass document content for content allocation
        });
        
        if (nodeCreationResult.created.length > 0) {
          console.log(`${logPrefix} Created ${nodeCreationResult.created.length} hinted coordinate spaces for philosophical exploration`);
          
          if (isAGUIEnabled) {
            aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
              runId,
              threadId,
              stage: 'hinted-node-creation',
              progress: 15,
              currentStep: `Created ${nodeCreationResult.created.length} user-hinted coordinate spaces`,
              createdNodes: nodeCreationResult.created
            }), {
              bimbaCoordinates: [actualParams.coordinate, ...nodeCreationResult.created.map(n => n.coordinate)],
              qlStage: 2,
              contextFrame: '(0/1/2)'
            });
          }
        }
      } catch (nodeCreationError) {
        console.warn(`${logPrefix} Hinted node creation failed:`, nodeCreationError);
        nodeCreationResult = { 
          created: [], 
          errors: [{ general: nodeCreationError.message }],
          message: 'Hinted coordinate creation encountered errors'
        };
      }
    }
    
    // Build the analysis prompt
    const analysisPrompt = this._buildAnalysisPrompt(actualParams);

    // Make a direct LLM call using ChatGoogleGenerativeAI
    console.log(`${logPrefix} Making direct LLM call for analysis...`);

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

    // Parse and structure the response
    const structuredResult = this._parseLLMResponse(response, logPrefix, actualParams);

    // Emit comprehensive AG-UI event with suggestions for frontend consumption
    if (isAGUIEnabled) {
      aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_UPDATE_SUGGESTIONS, {
        runId,
        threadId,
        targetCoordinate: actualParams.coordinate,
        propertyUpdates: structuredResult.propertyUpdates || {},
        relationshipSuggestions: structuredResult.relationshipSuggestions || [],
        reasoning: 'Comprehensive analysis completed with enhanced property extraction',
        qlAlignment: `Aligned with QL position #2 (Process Dynamics) analyzing target coordinate ${actualParams.coordinate}`
      }), {
        bimbaCoordinates: [actualParams.coordinate],
        qlStage: 2,
        contextFrame: '(0/1/2)',
        targetCoordinate: actualParams.coordinate
      });
    }

    return {
      success: true,
      skillId: this.skillId,
      bimbaCoordinate: actualParams.coordinate,
      targetCoordinate: actualParams.coordinate,
      agentId: 'epii-agent',
      qlMetadata: {
        qlPosition: 2,
        contextFrame: '(0/1/2)',
        qlMode: 'ascending',
        targetCoordinate: actualParams.coordinate
      },
      data: {
        ...structuredResult,
        targetCoordinate: actualParams.coordinate,
        analysisContext: {
          skillCoordinate: this.bimbaCoordinate,
          targetCoordinate: actualParams.coordinate,
          documentSource: actualParams.documentName
        }
      }
    };
  }

  /**
   * Parse multi-coordinate LLM response 
   */
  _parseMultiCoordinateLLMResponse(response, logPrefix, params) {
    const responseText = response.content || response.text || String(response);
    console.log(`${logPrefix} Parsing multi-coordinate LLM response...`);
    
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      console.log(`${logPrefix} Successfully parsed multi-coordinate response:`, {
        coordinateCount: Object.keys(parsed.multiCoordinateResults || {}).length,
        crossRelationshipCount: (parsed.crossCoordinateRelationships || []).length,
        hasAnalysisOverview: !!parsed.analysisOverview
      });
      
      return {
        multiCoordinateResults: parsed.multiCoordinateResults || {},
        crossCoordinateRelationships: parsed.crossCoordinateRelationships || [],
        analysisOverview: parsed.analysisOverview || {},
        coordinateCount: Object.keys(parsed.multiCoordinateResults || {}).length,
        relationshipCount: (parsed.crossCoordinateRelationships || []).length
      };
      
    } catch (error) {
      console.warn(`${logPrefix} Failed to parse multi-coordinate LLM response:`, error);
      
      // Fallback: create empty structure for all target coordinates
      const fallbackResults = {};
      params.targetCoordinates.forEach(coord => {
        fallbackResults[coord] = {
          relevanceScore: 0.5,
          keyAspects: ['Parsing error - manual review needed'],
          propertyUpdates: {},
          relationshipSuggestions: []
        };
      });
      
      return {
        multiCoordinateResults: fallbackResults,
        crossCoordinateRelationships: [],
        analysisOverview: {
          totalRelevantCoordinates: params.targetCoordinates.length,
          documentFocus: 'Parsing error - manual review needed'
        },
        coordinateCount: params.targetCoordinates.length,
        relationshipCount: 0,
        parseError: error.message
      };
    }
  }

  /**
   * Build multi-coordinate analysis prompt
   */
  _buildMultiCoordinateAnalysisPrompt(params) {
    const coordinates = params.targetCoordinates;
    return `As the Epii agent specializing in Multi-Coordinate Bimba Analysis, analyze this document and suggest relevance-aware updates for multiple Bimba coordinates simultaneously.

TARGET COORDINATES: ${coordinates.join(', ')}

DOCUMENT ANALYSIS:
- Document Type: ${params.documentType}
- Document Name: ${params.documentName}
- Content: ${params.documentContent}

TASK: Perform relevance-aware analysis for each coordinate, identifying which aspects of the document are most relevant to each specific coordinate, and generate tailored property updates and relationship suggestions.

For each coordinate, analyze:
1. **Relevance Score** (0.0-1.0): How relevant is this document to this specific coordinate?
2. **Key Aspects**: Which specific parts of the document relate to this coordinate?
3. **Property Updates**: Coordinate-specific property suggestions based on relevance
4. **Cross-Coordinate Relationships**: Identify meaningful relationships between target coordinates

**Cross-Coordinate Relationship Analysis:**
- Look for conceptual connections, dependencies, or harmonies between coordinates
- Consider QL dynamics and processual relationships
- Identify archetypal patterns that link coordinates
- Suggest relationship types: HARMONIZES_WITH, MEDIATES, TRANSCENDS, CONTAINS, HAS_COMPONENT, etc.
- Include detailed relationship properties with semantic framework, epistemic essence, and archetypal anchors
- Provide clear reasoning for each suggested relationship

Respond with JSON in this format:
{
  "multiCoordinateResults": {
    ${coordinates.map(coord => `"${coord}": {
      "relevanceScore": 0.8,
      "keyAspects": ["List of relevant document aspects"],
      "propertyUpdates": {
        "qlOperators": "Coordinate-specific QL operators...",
        "epistemicEssence": "Coordinate-specific epistemic insights...",
        "archetypalAnchors": "Coordinate-specific archetypal patterns...",
        "semanticFramework": "Coordinate-specific semantic structure..."
      },
      "relationshipSuggestions": []
    }`).join(',\n    ')}
  },
  "crossCoordinateRelationships": [
    {
      "sourceCoordinate": "#X",
      "targetCoordinate": "#Y", 
      "type": "RELATIONSHIP_TYPE",
      "properties": {
        "strength": 0.8,
        "confidence": 0.9,
        "bidirectional": true,
        "qlType": "processual_mediation",
        "semanticFramework": "Synthesizes, Transcends",
        "epistemicEssence": "Conceptual Integration",
        "archetypalAnchors": "Divine Marriage, Axis Mundi"
      },
      "reasoning": "Why these coordinates should be connected based on document analysis",
      "bidirectional": true
    }
  ],
  "analysisOverview": {
    "totalRelevantCoordinates": 3,
    "primaryCoordinate": "#most-relevant-coordinate",
    "documentFocus": "What this document primarily addresses"
  }
}`;
  }

  /**
   * Route to Epi-Logos Agent for conversational workflow
   * CORRECTED ARCHITECTURE: Routes through #5 Chat Skill as foundational conversational identity
   * Epi-Logos Agent provides transcendent harmony, #5 Chat Skill provides domain expertise
   */
  async _routeToEpiLogosAgent(requestData) {
    console.log('[BimbaUpdateManagement] Routing through Epi-Logos Agent → #5 Chat Skill for conversational approval');
    
    try {
      // Step 1: Epi-Logos Agent provides transcendent context and coordination
      const transcendentContext = await this._getEpiLogosTranscendentContext(requestData);
      
      // Step 2: Route through #5 Chat Skill as the foundational conversational identity
      const conversationalResult = await this._routeToEpiiChatSkill({
        ...requestData,
        transcendentContext,
        workflow: 'multi-coordinate-bimba-analysis',
        conversationalPrompt: this._buildConversationalPrompt(requestData, transcendentContext)
      });
      
      return {
        status: 'conversational_analysis_complete',
        message: 'Multi-coordinate analysis presented through #5 Chat Skill with Epi-Logos transcendent harmony',
        coordinates: requestData.coordinates,
        analysisType: 'multi-coordinate',
        conversationalPresentation: conversationalResult,
        transcendentContext: transcendentContext
      };
      
    } catch (error) {
      console.error('[BimbaUpdateManagement] Error in agent routing:', error);
      return {
        status: 'agent_routing_error',
        message: 'Failed to route through agent workflow',
        error: error.message,
        coordinates: requestData.coordinates
      };
    }
  }

  /**
   * Get transcendent context from Epi-Logos Agent
   * Provides overarching coordination without bypassing subsystem identity
   */
  async _getEpiLogosTranscendentContext(requestData) {
    // This is where Epi-Logos Agent provides transcendent perspective
    // without replacing the subsystem conversational identity
    return {
      coordinationStrategy: 'multi-coordinate-harmony',
      transcendentPerspective: `Harmonizing analysis across ${requestData.coordinates.length} coordinates through Epii foundational identity`,
      subsystemIdentity: '#5', // Respects Epii as the foundational chat identity
      documentFocus: requestData.documentName,
      crossCoordinateInsights: `Document relevance spans multiple coordinates: ${requestData.coordinates.join(', ')}`
    };
  }

  /**
   * Route to #5 Chat Skill as foundational conversational interface
   * The chat skill provides domain expertise and conversational style
   */
  async _routeToEpiiChatSkill(enhancedRequestData) {
    console.log('[BimbaUpdateManagement] Delegating to #5 Chat Skill for conversational presentation');
    
    try {
      // Import and instantiate the real EpiiChatSkill
      const EpiiChatSkill = require('../../subsystems/5_epii/skills/epii-chat-skill');
      const epiiChatSkill = new EpiiChatSkill();
      
      // Prepare context for EpiiChatSkill execution
      const chatContext = {
        agentId: 'epii-agent',
        userId: enhancedRequestData.userId || 'bimba-update-user',
        _epiiAgentService: enhancedRequestData.epiiAgentService, // Pass service if available
        _skillsRegistry: enhancedRequestData.skillsRegistry // Pass skills registry if available
      };
      
      // Build conversational prompt for multi-coordinate analysis
      const conversationalPrompt = this._buildEpiiConversationalPrompt(enhancedRequestData);
      
      // Prepare parameters for EpiiChatSkill
      const chatParams = {
        message: conversationalPrompt,
        history: enhancedRequestData.history || [],
        targetCoordinate: enhancedRequestData.coordinates[0], // Primary coordinate
        documentContent: enhancedRequestData.documentContent,
        documentId: enhancedRequestData.documentId,
        context: {
          multiCoordinateMode: true,
          targetCoordinates: enhancedRequestData.coordinates,
          transcendentContext: enhancedRequestData.transcendentContext,
          workflow: enhancedRequestData.workflow,
          fromBimbaUpdateManagement: true,
          enhancedCreativity: true,
          perspectiveDepth: 'profound'
        }
      };
      
      console.log('[BimbaUpdateManagement] Executing EpiiChatSkill with parameters:', {
        messageLength: conversationalPrompt.length,
        coordinates: enhancedRequestData.coordinates,
        hasDocumentContent: !!enhancedRequestData.documentContent,
        multiCoordinateMode: true
      });
      
      // Execute the actual EpiiChatSkill
      const chatResult = await epiiChatSkill.execute(chatParams, chatContext);
      
      if (chatResult.success) {
        console.log('[BimbaUpdateManagement] EpiiChatSkill executed successfully');
        
        return {
          conversationalStyle: 'epii-meta-perspective',
          domainExpertise: 'multi-coordinate-bimba-analysis',
          message: chatResult.data.message,
          coordinateInsights: enhancedRequestData.coordinates.map(coord => ({
            coordinate: coord,
            relevanceAnalysis: `Document relevance to ${coord} analyzed through Epii's integral perspective`,
            conversationalPresentation: `Analysis presented through #5 Chat Skill's meta-perspective`
          })),
          foundationalIdentity: '#5',
          transcendentHarmony: enhancedRequestData.transcendentContext,
          chatResult: chatResult.data,
          executionTime: chatResult.executionTime
        };
      } else {
        console.warn('[BimbaUpdateManagement] EpiiChatSkill execution failed:', chatResult.error);
        throw new Error(`EpiiChatSkill execution failed: ${chatResult.error}`);
      }
      
    } catch (error) {
      console.error('[BimbaUpdateManagement] Error routing to EpiiChatSkill:', error);
      
      // Fallback to placeholder response if real routing fails
      return {
        conversationalStyle: 'epii-meta-perspective',
        domainExpertise: 'multi-coordinate-bimba-analysis',
        message: `I understand you're requesting multi-coordinate analysis for ${enhancedRequestData.coordinates.join(', ')}. The routing to my foundational chat identity encountered an issue: ${error.message}. This suggests the EpiiChatSkill integration needs refinement.`,
        coordinateInsights: enhancedRequestData.coordinates.map(coord => ({
          coordinate: coord,
          relevanceAnalysis: `Document relevance to ${coord} requires proper #5 Chat Skill integration`,
          conversationalPresentation: `Analysis routing to #5 Chat Skill needs attention`
        })),
        foundationalIdentity: '#5',
        transcendentHarmony: enhancedRequestData.transcendentContext,
        error: error.message,
        fallbackResponse: true
      };
    }
  }

  /**
   * Build conversational prompt that harmonizes transcendent and foundational perspectives
   */
  _buildConversationalPrompt(requestData, transcendentContext) {
    return `As the Epii agent (#5 foundational identity), present this multi-coordinate Bimba analysis with your characteristic meta-perspective, informed by transcendent coordination:

TRANSCENDENT CONTEXT: ${JSON.stringify(transcendentContext, null, 2)}

MULTI-COORDINATE ANALYSIS REQUEST:
- Coordinates: ${requestData.coordinates.join(', ')}
- Document: ${requestData.documentName}
- Analysis Type: ${requestData.type}

Present this analysis through your Epii conversational identity while acknowledging the transcendent coordination provided by the Epi-Logos Agent.`;
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
   * Create hinted Bimba nodes for philosophical exploration
   * Creates user-specified coordinate spaces to support philosophical development
   * @param {Object} params - Analysis parameters
   * @param {Array} params.hintedCoordinates - User-provided coordinate hints for new exploration spaces
   * @param {Array} params.targetCoordinates - Coordinates being analyzed
   * @param {string} params.documentName - Name of the document for context
   * @param {string} params.philosophicalContext - User's philosophical context/intention
   * @returns {Promise<Object>} Result of hinted node creation operations
   * @private
   */
  async _createHintedNodes(params) {
    const logPrefix = '[BimbaUpdateManagement:HintedNodeCreation]';
    console.log(`${logPrefix} Processing user-hinted coordinates for philosophical exploration`);
    
    try {
      // Use user-provided coordinate hints instead of auto-detection
      const hintedCoordinates = params.hintedCoordinates || [];
      
      if (hintedCoordinates.length === 0) {
        console.log(`${logPrefix} No coordinate hints provided by user`);
        return { 
          created: [], 
          skipped: [], 
          message: 'No coordinate hints provided - proceeding with existing coordinate space' 
        };
      }
      
      console.log(`${logPrefix} User hinted ${hintedCoordinates.length} coordinates for creation:`, hintedCoordinates);
      console.log(`${logPrefix} Philosophical context: ${params.philosophicalContext || 'Not specified'}`);
      
      console.log(`${logPrefix} Checking ${hintedCoordinates.length} hinted coordinates for existence`);
      
      // Check which hinted coordinates already exist using BPMCP
      const existingCoordinatesQuery = `
        MATCH (n:Bimba) 
        WHERE n.bimbaCoordinate IN $coordinates 
        RETURN n.bimbaCoordinate as coordinate
      `;
      
      const bpMCPService = require('../../friendly-file-backend/databases/bpmcp/bpMCP.service.mjs').default;
      const existingResult = await bpMCPService.queryBimbaGraph(existingCoordinatesQuery, {
        coordinates: hintedCoordinates
      });
      
      const existingCoordinates = existingResult.records?.map(record => record.coordinate) || [];
      const coordinatesToCreate = hintedCoordinates.filter(coord => !existingCoordinates.includes(coord));
      
      console.log(`${logPrefix} Found ${coordinatesToCreate.length} new coordinates to create:`, coordinatesToCreate);
      
      if (coordinatesToCreate.length === 0) {
        return { 
          created: [], 
          skipped: existingCoordinates, 
          message: 'All hinted coordinates already exist in the philosophical space' 
        };
      }
      
      // Create hinted coordinate nodes for philosophical exploration
      const createdNodes = [];
      const errors = [];
      
      for (const coordinate of coordinatesToCreate) {
        try {
          console.log(`${logPrefix} Creating node for coordinate: ${coordinate}`);
          
          // Parse coordinate to determine parent relationships
          const coordinateParts = coordinate.replace('#', '').split(/[-\.]/);
          const parentCoordinate = coordinateParts.length > 1 
            ? `#${coordinateParts.slice(0, -1).join('-')}`
            : null;
          
          // Create basic node with foundational properties
          const createNodeQuery = `
            CREATE (n:Bimba {
              bimbaCoordinate: $coordinate,
              name: $name,
              description: $description,
              qlOperators: $qlOperators,
              epistemicEssence: $epistemicEssence,
              archetypalAnchors: $archetypalAnchors,
              semanticFramework: $semanticFramework,
              createdAt: datetime(),
              createdBy: 'user-hint',
              sourceDocument: $sourceDocument,
              philosophicalContext: $philosophicalContext,
              hintedCreation: true
            })
            RETURN n
          `;
          
          // Analyze document content for this specific coordinate
          const coordinateContent = this._extractCoordinateContent(params.documentContent, coordinate);
          
          const nodeProperties = {
            coordinate: coordinate,
            name: `Philosophical exploration space ${coordinate}`,
            description: `User-hinted coordinate space for philosophical development. Context: ${params.philosophicalContext || 'Exploring new philosophical territory'}`,
            qlOperators: coordinateContent.qlOperators || `Quaternary logic operations for ${coordinate} - space for philosophical exploration`,
            epistemicEssence: coordinateContent.epistemicEssence || `Epistemic patterns to be developed at ${coordinate} - philosophical workspace`,
            archetypalAnchors: coordinateContent.archetypalAnchors || `Archetypal resonances for ${coordinate} - open for philosophical investigation`,
            semanticFramework: coordinateContent.semanticFramework || `Semantic relationships and meaning structures for ${coordinate} - ready for development`,
            sourceDocument: params.documentName,
            philosophicalContext: params.philosophicalContext || 'User-initiated exploration',
            allocatedContent: coordinateContent.rawContent || null
          };
          
          const createResult = await bpMCPService.callTool('updateBimbaGraph', {
            query: createNodeQuery,
            params: nodeProperties
          });
          
          // Create parent relationship if applicable
          if (parentCoordinate && createResult.records?.length > 0) {
            const relationshipQuery = `
              MATCH (parent:Bimba {bimbaCoordinate: $parentCoordinate})
              MATCH (child:Bimba {bimbaCoordinate: $childCoordinate})
              CREATE (parent)-[:CHILD_OF]->(child)
              RETURN parent, child
            `;
            
            try {
              await bpMCPService.callTool('updateBimbaGraph', {
                query: relationshipQuery,
                params: {
                  parentCoordinate: parentCoordinate,
                  childCoordinate: coordinate
                }
              });
              console.log(`${logPrefix} Created parent relationship: ${parentCoordinate} -> ${coordinate}`);
            } catch (relationshipError) {
              console.warn(`${logPrefix} Could not create parent relationship for ${coordinate}:`, relationshipError);
            }
          }
          
          createdNodes.push({
            coordinate: coordinate,
            parentCoordinate: parentCoordinate,
            sourceDocument: params.documentName
          });
          
          console.log(`${logPrefix} Successfully created node: ${coordinate}`);
          
        } catch (nodeError) {
          console.error(`${logPrefix} Error creating node ${coordinate}:`, nodeError);
          errors.push({
            coordinate: coordinate,
            error: nodeError.message
          });
        }
      }
      
      const result = {
        created: createdNodes,
        errors: errors,
        skipped: existingCoordinates,
        message: `Created ${createdNodes.length} new nodes, ${errors.length} errors, ${existingCoordinates.length} already existed`
      };
      
      console.log(`${logPrefix} Dynamic node creation completed:`, result);
      return result;
      
    } catch (error) {
      console.error(`${logPrefix} Error in dynamic node creation:`, error);
      return {
        created: [],
        errors: [{ general: error.message }],
        message: 'Failed to perform dynamic node creation'
      };
    }
  }

  /**
   * Extract and allocate document content to specific coordinate spaces
   * Analyzes document content to find philosophical material relevant to a coordinate
   * @param {string} documentContent - Full document content
   * @param {string} coordinate - Target coordinate to analyze for
   * @returns {Object} Extracted content structured for the coordinate
   * @private
   */
  _extractCoordinateContent(documentContent, coordinate) {
    if (!documentContent || !coordinate) {
      return {
        qlOperators: null,
        epistemicEssence: null,
        archetypalAnchors: null,
        semanticFramework: null,
        rawContent: null
      };
    }

    try {
      // Look for explicit coordinate references in the document
      const coordinatePattern = new RegExp(`${coordinate.replace('.', '\\.')}[^\\w]*([^#]*?)(?=#\\d|$)`, 'gi');
      const coordinateMatches = documentContent.match(coordinatePattern) || [];
      
      // Also look for content around coordinate mentions
      const contextPattern = new RegExp(`([^.]{0,200}${coordinate.replace('.', '\\.')}[^.]{0,200})`, 'gi');
      const contextMatches = documentContent.match(contextPattern) || [];
      
      const relevantContent = [...coordinateMatches, ...contextMatches].join(' ').trim();
      
      if (!relevantContent) {
        return {
          qlOperators: null,
          epistemicEssence: null,
          archetypalAnchors: null,
          semanticFramework: null,
          rawContent: null
        };
      }

      // Basic content allocation - this could be enhanced with LLM analysis
      const contentLower = relevantContent.toLowerCase();
      
      return {
        qlOperators: contentLower.includes('logic') || contentLower.includes('operator') 
          ? `QL operations derived from document: ${relevantContent.substring(0, 200)}...`
          : null,
        epistemicEssence: contentLower.includes('knowledge') || contentLower.includes('epistemic') || contentLower.includes('knowing')
          ? `Epistemic patterns from document: ${relevantContent.substring(0, 200)}...`
          : null,
        archetypalAnchors: contentLower.includes('archetype') || contentLower.includes('symbol') || contentLower.includes('pattern')
          ? `Archetypal resonances from document: ${relevantContent.substring(0, 200)}...`
          : null,
        semanticFramework: contentLower.includes('meaning') || contentLower.includes('semantic') || contentLower.includes('concept')
          ? `Semantic structures from document: ${relevantContent.substring(0, 200)}...`
          : null,
        rawContent: relevantContent.substring(0, 500) // Store first 500 chars of relevant content
      };
      
    } catch (error) {
      console.warn('[BimbaUpdateManagement] Error extracting coordinate content:', error);
      return {
        qlOperators: null,
        epistemicEssence: null,
        archetypalAnchors: null,
        semanticFramework: null,
        rawContent: null
      };
    }
  }

  /**
   * Trigger update application via AG-UI events
   * Allows agent to programmatically apply suggestions and updates to frontend
   * @param {Object} params - Update application parameters
   * @param {string} params.action - 'apply-suggestions', 'apply-updates', or 'apply-specific'
   * @param {Array} params.coordinates - Optional: specific coordinates to apply updates for
   * @param {Object} params.context - Context including aguiGateway, runId, threadId
   * @returns {Promise<Object>} Result of update application request
   * @private
   */
  async _triggerUpdateApplication(params) {
    const logPrefix = '[BimbaUpdateManagement:UpdateApplication]';
    console.log(`${logPrefix} Triggering update application:`, params.action);
    
    try {
      const { action, coordinates, context } = params;
      const { aguiGateway, runId, threadId } = context || {};
      
      if (!aguiGateway || !runId) {
        console.warn(`${logPrefix} No AG-UI gateway or runId available for update application`);
        return {
          success: false,
          message: 'AG-UI gateway not available for update application'
        };
      }
      
      let eventType, eventPayload;
      
      switch (action) {
        case 'apply-suggestions':
          eventType = AGUIEventTypes.BIMBA_APPLY_SUGGESTIONS;
          eventPayload = {
            runId,
            threadId,
            coordinates: coordinates || [],
            requestType: 'agent-triggered',
            message: 'Agent requesting to apply LLM suggestions to form'
          };
          break;
          
        case 'apply-updates':
          eventType = AGUIEventTypes.BIMBA_APPLY_UPDATES;
          eventPayload = {
            runId,
            threadId,
            coordinates: coordinates || [],
            requestType: 'agent-triggered',
            message: 'Agent requesting to commit pending changes to backend'
          };
          break;
          
        case 'apply-specific':
          eventType = AGUIEventTypes.BIMBA_APPLY_UPDATES;
          eventPayload = {
            runId,
            threadId,
            coordinates: coordinates || [],
            requestType: 'agent-triggered-specific',
            message: `Agent requesting to apply updates for specific coordinates: ${coordinates?.join(', ') || 'all'}`
          };
          break;
          
        default:
          throw new Error(`Unknown update application action: ${action}`);
      }
      
      // Emit AG-UI event to frontend
      aguiGateway.emitAGUIEvent(createAGUIEvent(eventType, eventPayload), {
        bimbaCoordinates: coordinates || [],
        qlStage: 2,
        contextFrame: '(0/1/2)',
        agentInitiated: true
      });
      
      console.log(`${logPrefix} Emitted ${eventType} event for ${coordinates?.length || 'all'} coordinates`);
      
      // Return success immediately - actual application happens in frontend
      return {
        success: true,
        action: action,
        coordinates: coordinates || [],
        message: `Update application event sent to frontend: ${action}`,
        eventType: eventType
      };
      
    } catch (error) {
      console.error(`${logPrefix} Error triggering update application:`, error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to trigger update application'
      };
    }
  }

  /**
   * Build conversational prompt for EpiiChatSkill integration
   * Formats multi-coordinate analysis requests for natural conversation
   * @param {Object} enhancedRequestData - Enhanced request data with all context
   * @returns {string} Conversational prompt for EpiiChatSkill
   * @private
   */
  _buildEpiiConversationalPrompt(enhancedRequestData) {
    const { coordinates, documentContent, documentName, workflow, transcendentContext } = enhancedRequestData;
    
    // Build conversational prompt that leverages EpiiChatSkill's natural language processing
    let prompt = `I need your perspective on a multi-coordinate Bimba analysis for the document "${documentName}". `;
    
    if (coordinates.length === 1) {
      prompt += `Please analyze how this document relates to coordinate ${coordinates[0]} and suggest specific updates to its Bimba node properties.`;
    } else {
      prompt += `This involves ${coordinates.length} coordinates: ${coordinates.join(', ')}. Please provide a unified analysis that considers the relationships between these coordinates.`;
    }
    
    // Add context about the workflow stage
    if (workflow === 'multi-coordinate-selection') {
      prompt += `\n\nThis is part of a multi-coordinate selection workflow where we're exploring how this document content maps across multiple QL coordinates simultaneously.`;
    }
    
    // Add transcendent context if available
    if (transcendentContext && transcendentContext.transcendentPrompt) {
      prompt += `\n\nTranscendent Context: ${transcendentContext.transcendentPrompt}`;
    }
    
    // Add document content context
    if (documentContent) {
      const contentPreview = documentContent.length > 500 
        ? documentContent.substring(0, 500) + '...'
        : documentContent;
      prompt += `\n\nDocument Content Preview:\n${contentPreview}`;
    }
    
    // Add specific request for Bimba update suggestions
    prompt += `\n\nPlease provide your analysis with specific suggestions for:
1. Property updates for the involved Bimba nodes
2. Relationship changes or additions
3. Coordinate-specific insights
4. Cross-coordinate synthesis if multiple coordinates are involved

Focus on the four foundational relational properties: qlOperators, epistemicEssence, archetypalAnchors, and semanticFramework.`;
    
    console.log(`[BimbaUpdateManagement] Built conversational prompt for ${coordinates.length} coordinates:`, {
      promptLength: prompt.length,
      coordinates: coordinates,
      hasTranscendentContext: !!transcendentContext?.transcendentPrompt,
      documentName: documentName
    });
    
    return prompt;
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
          documentName: { type: 'string', description: 'Name of the document' },
          hintedCoordinates: { type: 'array', description: 'Optional: User-hinted coordinates to create for philosophical exploration', items: { type: 'string' } },
          philosophicalContext: { type: 'string', description: 'Optional: Philosophical context or intention for the analysis' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          propertyUpdates: { type: 'object', description: 'Suggested property updates' },
          relationshipSuggestions: { type: 'array', description: 'Suggested relationship changes' }
        }
      },
      subSkills: this.subSkills
    };
  }

  /**
   * Get metadata for the update application sub-skill (#5-2-0)
   */
  getUpdateApplicationSkillMetadata() {
    return {
      id: this.subSkills.updateApplication.skillId,
      name: this.subSkills.updateApplication.name,
      description: this.subSkills.updateApplication.description,
      bimbaCoordinate: this.subSkills.updateApplication.bimbaCoordinate,
      parentSkill: this.subSkills.updateApplication.parentSkill,
      version: this.subSkills.updateApplication.version,
      agentId: 'epii-agent',
      qlMetadata: {
        qlPosition: 0, // Sub-skill at position 0 within #5-2 context
        contextFrame: '(0/1/2/0)',
        qlMode: 'execution'
      },
      harmonicMetadata: {
        resonantFrequency: 'workflow optimization',
        harmonicRelations: ['#5-2'], // Parent skill
        paraVakAspect: 'vaikhari', // Spoken/executed level
        ontologicalLayer: 'co-homo-logos'
      },
      databaseMetadata: {
        primaryDatabase: 'ag-ui-events',
        secondaryDatabases: ['frontend-state'],
        accessPattern: 'event-trigger'
      },
      inputSchema: {
        type: 'object',
        required: ['action'],
        properties: {
          action: { 
            type: 'string', 
            enum: ['apply-suggestions', 'apply-updates', 'apply-specific'],
            description: 'Type of update application to trigger' 
          },
          coordinates: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Optional: specific coordinates to apply updates for' 
          },
          runId: { type: 'string', description: 'AG-UI run ID' },
          threadId: { type: 'string', description: 'AG-UI thread ID' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          action: { type: 'string' },
          coordinates: { type: 'array' },
          message: { type: 'string' },
          eventType: { type: 'string' }
        }
      }
    };
  }
}

module.exports = BimbaUpdateManagementSkill;
