/**
 * Epii Analysis Pipeline A2A Skill
 * Integrates the complete Epii Analysis Pipeline as skill #5-0: Document Analysis Pipeline
 *
 * This skill wraps the 6-stage pipeline (Stages -5 through -0) and provides:
 * - A2A-compatible interface for pipeline execution
 * - AG-UI event emission for real-time progress tracking
 * - Coordinate-based metadata integration
 * - Enhanced memory onboarding with Graphiti and LightRAG
 *
 * Bimba Coordinate: #5-0
 * QL Metadata: Position 0, Context Frame (0/1), Ascending Mode
 */

import { runPipeline } from '../../../../friendly-file-backend/subsystems/5_epii/5_integration/pipelines/epii_analysis_pipeline.mjs';
// Import AG-UI event schema as CommonJS module
import aguiEventSchemaPkg from '../../../shared/ag-ui/ag-ui-event-schema.js';
const { createAGUIEvent, AGUIEventTypes } = aguiEventSchemaPkg;

/**
 * Epii Analysis Pipeline Skill Class
 * Implements the A2A skill interface for the complete analysis pipeline
 */
class EpiiAnalysisPipelineSkill {
  constructor() {
    this.skillId = 'epii-analysis-pipeline';
    this.name = 'Epii Analysis Pipeline';
    this.description = 'Runs the complete 6-stage Epii document analysis pipeline with AG-UI progress tracking';
    this.bimbaCoordinate = '#5-0';
    this.version = '1.0.0';
  }

  /**
   * Get skill metadata for registration
   * @returns {Object} Skill metadata
   */
  getSkillMetadata() {
    return {
      id: this.skillId,
      name: this.name,
      description: this.description,
      bimbaCoordinate: this.bimbaCoordinate,
      agentId: 'epii-agent',
      version: this.version,
      qlMetadata: {
        qlPosition: 0,
        contextFrame: '(0/1)',
        qlMode: 'ascending'
      },
      harmonicMetadata: {
        resonantFrequency: 'foundational analysis',
        harmonicRelations: ['#5-1', '#5-2', '#5-3', '#5-4', '#5-5'],
        paraVakAspect: 'para', // Supreme, transcendent aspect
        ontologicalLayer: 'proto-logy'
      },
      databaseMetadata: {
        primaryDatabase: 'mongodb-documents',
        secondaryDatabases: ['neo4j-bimba', 'qdrant-pratibimba', 'notion-content'],
        accessPattern: 'comprehensive' // Full pipeline access to all systems
      },
      inputSchema: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            description: 'Document content to analyze',
            minLength: 10
          },
          targetCoordinate: {
            type: 'string',
            description: 'Target Bimba coordinate for analysis',
            pattern: '^#[0-9]+([-][0-9]+)*$',
            default: '#5'
          },
          analysisDepth: {
            type: 'string',
            enum: ['basic', 'standard', 'deep'],
            default: 'standard',
            description: 'Depth of analysis to perform'
          },
          includeNotion: {
            type: 'boolean',
            default: true,
            description: 'Whether to crystallize results to Notion'
          },
          includeBimba: {
            type: 'boolean',
            default: true,
            description: 'Whether to update Bimba graph'
          },
          includeGraphiti: {
            type: 'boolean',
            default: true,
            description: 'Whether to create Graphiti episodes for memory onboarding'
          },
          includeLightRAG: {
            type: 'boolean',
            default: true,
            description: 'Whether to ingest into LightRAG with coordinate metadata'
          },
          fileName: {
            type: 'string',
            description: 'Original filename for the document',
            default: 'untitled_document.txt'
          },
          userId: {
            type: 'string',
            description: 'User ID for the analysis session',
            default: 'admin'
          }
        }
      }
    };
  }

  /**
   * Execute the Epii Analysis Pipeline
   * @param {Object} params - Skill parameters
   * @param {Object} context - Execution context including AG-UI gateway
   * @returns {Promise<Object>} Analysis results
   */
  async execute(params, context = {}) {
    const { aguiGateway, runId, threadId } = context;
    const startTime = Date.now();

    console.log(`[EpiiAnalysisPipelineSkill] Starting pipeline execution for coordinate ${params.targetCoordinate}`);

    try {
      // Emit AG-UI start event
      if (aguiGateway && runId) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_STARTED, {
          runId,
          threadId,
          skillId: this.skillId,
          parameters: {
            coordinate: params.targetCoordinate,
            analysisDepth: params.analysisDepth,
            fileName: params.fileName
          }
        }), {
          bimbaCoordinates: [params.targetCoordinate],
          qlStage: 0,
          contextFrame: '(0/1)'
        });
      }

      // Prepare initial state for the pipeline
      const initialState = {
        // Document content and metadata
        documentContent: params.content,
        sourceFileName: params.fileName,
        targetCoordinate: params.targetCoordinate,
        userId: params.userId,

        // Analysis options
        analysisDepth: params.analysisDepth,
        includeNotion: params.includeNotion,
        includeBimba: params.includeBimba,
        includeGraphiti: params.includeGraphiti,
        includeLightRAG: params.includeLightRAG,

        // Document metadata from AG-UI protocol (avoids separate MongoDB fetch)
        documentId: params.documentMetadata?.documentId,
        sourceMetadata: {
          documentId: params.documentMetadata?.documentId,
          targetCoordinate: params.targetCoordinate,
          sourceFileName: params.fileName,
          sourceType: 'bimba',
          // Pass through LightRAG metadata from frontend
          lightRagMetadata: params.documentMetadata?.lightRagMetadata,
          analysisStatus: params.documentMetadata?.analysisStatus,
          collection: params.documentMetadata?.collection || 'Documents',
          documentType: params.documentMetadata?.documentType || 'bimba',
          lastModified: params.documentMetadata?.lastModified,
          // Include complete metadata from frontend
          ...params.documentMetadata
        },

        // A2A context
        skillContext: {
          skillId: this.skillId,
          runId,
          threadId,
          aguiGateway,
          startTime
        },

        // Graph data from frontend (will be transformed to bimbaMap in stage -5)
        graphData: params.graphData || { nodes: [], edges: [] },

        // Enable error handling for graceful degradation
        handleErrors: true
      };

      // The pipeline will emit StepStarted/StepFinished events for each stage
      // No need for manual progress events here

      // Execute the complete pipeline
      console.log(`[EpiiAnalysisPipelineSkill] Executing pipeline with state:`, {
        targetCoordinate: params.targetCoordinate,
        contentLength: params.content.length,
        analysisDepth: params.analysisDepth,
        hasAGUI: !!aguiGateway
      });

      const pipelineResult = await runPipeline(initialState);

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      // Emit success events
      if (aguiGateway && runId) {
        // First emit DocumentAnalysisCompleted for the analysis results panel
        const analysisCompletedEvent = createAGUIEvent(AGUIEventTypes.DOCUMENT_ANALYSIS_COMPLETED, {
          runId,
          threadId,
          documentId: pipelineResult.documentId || params.documentMetadata?.documentId,
          targetCoordinate: params.targetCoordinate,
          analysisResults: {
            synthesis: pipelineResult.synthesis,
            coreElements: pipelineResult.coreElements,
            relationalProperties: pipelineResult.relationalProperties,
            epiiPerspective: pipelineResult.epiiPerspective,
            mappings: pipelineResult.mappings,
            variations: pipelineResult.variations,
            tags: pipelineResult.tags,
            notionUpdatePayload: pipelineResult.notionUpdatePayload
          },
          pratibimbaCreated: false,
          memoryIntegration: {
            graphiti: true,
            lightrag: true,
            notion: !!pipelineResult.notionUpdatePayload
          }
        });

        aguiGateway.emitAGUIEvent(analysisCompletedEvent, {
          bimbaCoordinates: [params.targetCoordinate]
        });

        console.log(`[EpiiAnalysisPipelineSkill] ✅ Emitted DOCUMENT_ANALYSIS_COMPLETED event`);

        // Then emit RUN_FINISHED for general completion tracking
        const completionEvent = createAGUIEvent(AGUIEventTypes.RUN_FINISHED, {
          runId,
          threadId,
          result: {
            success: true,
            executionTime,
            stagesCompleted: 6,
            coreElementsCount: pipelineResult.coreElements?.length || 0,
            hasEpiiPerspective: !!pipelineResult.epiiPerspective
          }
        });

        aguiGateway.emitAGUIEvent(completionEvent, {
          bimbaCoordinates: [params.targetCoordinate]
        });

        console.log(`[EpiiAnalysisPipelineSkill] ✅ Emitted RUN_FINISHED event`);
        console.log(`[EpiiAnalysisPipelineSkill] 📋 Event details: runId=${runId}, threadId=${threadId}, eventType=${completionEvent.type}`);
      }

      console.log(`[EpiiAnalysisPipelineSkill] Pipeline completed successfully in ${executionTime}ms`);

      // Return A2A-compatible result
      return {
        success: true,
        data: {
          // Core analysis results
          synthesis: pipelineResult.synthesis,
          coreElements: pipelineResult.coreElements,
          relationalProperties: pipelineResult.relationalProperties,
          epiiPerspective: pipelineResult.epiiPerspective,

          // Metadata
          targetCoordinate: params.targetCoordinate,
          executionTime,
          timestamp: new Date().toISOString(),

          // Pipeline-specific data
          mappings: pipelineResult.mappings,
          variations: pipelineResult.variations,
          tags: pipelineResult.tags,

          // Notion payload if generated
          notionUpdatePayload: pipelineResult.notionUpdatePayload,

          // Document metadata
          sourceFileName: params.fileName,
          documentId: pipelineResult.documentId || params.documentMetadata?.documentId
        },
        skillId: this.skillId,
        coordinate: params.targetCoordinate,
        metadata: {
          pipelineStages: 6,
          analysisDepth: params.analysisDepth,
          memoryIntegration: {
            notion: params.includeNotion,
            bimba: params.includeBimba,
            graphiti: params.includeGraphiti,
            lightrag: params.includeLightRAG
          }
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;

      console.error(`[EpiiAnalysisPipelineSkill] Pipeline execution failed:`, error);

      // Emit error event
      if (aguiGateway && runId) {
        aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_ERROR, {
          runId,
          threadId,
          message: `Pipeline execution failed: ${error.message}`,
          code: 'PIPELINE_EXECUTION_ERROR',
          details: {
            stage: error.stage || 'unknown',
            executionTime,
            targetCoordinate: params.targetCoordinate
          }
        }), {
          bimbaCoordinates: [params.targetCoordinate]
        });
      }

      // Return A2A-compatible error result
      return {
        success: false,
        error: error.message,
        skillId: this.skillId,
        coordinate: params.targetCoordinate,
        metadata: {
          executionTime,
          failedStage: error.stage || 'unknown',
          errorType: error.constructor.name
        }
      };
    }
  }
}

export { EpiiAnalysisPipelineSkill };
