/**
 * AG-UI Integration Utilities for Epii Analysis Pipeline
 * Provides utilities for emitting AG-UI events during pipeline execution
 */

// Import AG-UI event schema as CommonJS module
import aguiEventSchemaPkg from '../../../../friendly-file-back2front/shared/ag-ui/ag-ui-event-schema.js';
const { createAGUIEvent, AGUIEventTypes } = aguiEventSchemaPkg;

// Global AG-UI Gateway reference
let aguiGateway = null;

/**
 * Initialize AG-UI Gateway reference
 * @param {Object} gateway - AG-UI Gateway instance
 */
export function initializeAGUIGateway(gateway) {
  aguiGateway = gateway;
  console.log('[AG-UI] Gateway initialized for event emission');
}

/**
 * Get AG-UI Gateway instance
 * @returns {Object|null} AG-UI Gateway or null
 */
export function getAGUIGateway() {
  return aguiGateway;
}

/**
 * Stage mapping for the 6-stage pipeline following AG-UI protocol
 * Maps pipeline stages to AG-UI StepStarted/StepFinished events
 */
const PIPELINE_STAGE_MAP = {
  'stage_minus5': { name: 'Fetch Document', qlStage: 0, progress: 10 },
  'stage_minus4': { name: 'Contextualize Analysis', qlStage: 1, progress: 25 },
  'stage_minus3': { name: 'Integrate Structure', qlStage: 2, progress: 40 },
  'stage_minus2': { name: 'Relate Concepts', qlStage: 3, progress: 60 },
  'stage_minus1': { name: 'Define Core Elements', qlStage: 4, progress: 80 },
  'stage_minus0': { name: 'Synthesize Payload', qlStage: 5, progress: 100 }
};

/**
 * Calculate progress percentage for a given stage
 * @param {string} stageName - Name of the current stage
 * @param {boolean} isStarted - Whether the stage is starting (false) or finishing (true)
 * @returns {number} Progress percentage (0-100)
 */
function calculateStageProgress(stageName, isStarted = true) {
  const stageInfo = PIPELINE_STAGE_MAP[stageName];
  if (!stageInfo) return 0;

  if (isStarted) {
    // When stage starts, show progress at beginning of stage
    const prevStage = Object.values(PIPELINE_STAGE_MAP).find(s => s.qlStage === stageInfo.qlStage - 1);
    return prevStage ? prevStage.progress : 0;
  } else {
    // When stage finishes, show progress at end of stage
    return stageInfo.progress;
  }
}

/**
 * Emits AG-UI StepStarted event for pipeline stage (following AG-UI protocol)
 * @param {Object} skillContext - Context from the A2A skill
 * @param {string} stageName - Name of the current stage
 * @param {string} message - Step message
 * @param {Object} details - Additional details
 */
export function emitStageStarted(skillContext, stageName, message, details = {}) {
  const { aguiGateway, runId, threadId } = skillContext || {};

  if (!aguiGateway || !runId) {
    return; // No AG-UI context available
  }

  const stageInfo = PIPELINE_STAGE_MAP[stageName] || { name: stageName, qlStage: 0, progress: 0 };
  const progress = calculateStageProgress(stageName, true);

  try {
    const event = createAGUIEvent(AGUIEventTypes.STEP_STARTED, {
      runId,
      threadId,
      stepName: stageInfo.name,
      message: `${stageInfo.name}: ${message}`,
      progress: progress,
      details: {
        stageName: stageInfo.name,
        stageId: stageName,
        qlStage: stageInfo.qlStage,
        progress: progress,
        totalStages: 6,
        currentStage: stageInfo.qlStage + 1,
        ...details
      }
    });

    aguiGateway.emitAGUIEvent(event, {
      bimbaCoordinates: details.targetCoordinate ? [details.targetCoordinate] : []
    });

    console.log(`[AG-UI] ✅ Emitted StepStarted for ${stageName}: ${stageInfo.name} - ${progress}% - ${message}`);
    console.log(`[AG-UI] 📋 Event details: runId=${runId}, threadId=${threadId}, eventType=${event.type}`);
  } catch (error) {
    console.warn(`[AG-UI] ❌ Failed to emit StepStarted event for ${stageName}:`, error.message);
  }
}

/**
 * Emits AG-UI StepFinished event for stage completion (following AG-UI protocol)
 * @param {Object} skillContext - Context from the A2A skill
 * @param {string} stageName - Name of the completed stage
 * @param {Object} result - Stage result data
 */
export function emitStageFinished(skillContext, stageName, result = {}) {
  const { aguiGateway, runId, threadId } = skillContext || {};

  if (!aguiGateway || !runId) {
    return;
  }

  const stageInfo = PIPELINE_STAGE_MAP[stageName] || { name: stageName, qlStage: 0, progress: 0 };
  const progress = calculateStageProgress(stageName, false);

  try {
    const event = createAGUIEvent(AGUIEventTypes.STEP_FINISHED, {
      runId,
      threadId,
      stepName: stageInfo.name,
      progress: progress,
      result: {
        success: true,
        dataKeys: Object.keys(result),
        ...result
      }
    });

    aguiGateway.emitAGUIEvent(event, {
      bimbaCoordinates: result.targetCoordinate ? [result.targetCoordinate] : []
    });

    console.log(`[AG-UI] ✅ Emitted StepFinished for ${stageName}: ${stageInfo.name} - ${progress}%`);
    console.log(`[AG-UI] 📋 Event details: runId=${runId}, threadId=${threadId}, eventType=${event.type}`);
  } catch (error) {
    console.warn(`[AG-UI] ❌ Failed to emit StepFinished event for ${stageName}:`, error.message);
  }
}

/**
 * Emits AG-UI Custom event for stage error (NOT a pipeline failure)
 * @param {Object} skillContext - Context from the A2A skill
 * @param {string} stageName - Name of the failed stage
 * @param {Error} error - The error that occurred
 */
export function emitStageError(skillContext, stageName, error) {
  const { aguiGateway, runId, threadId } = skillContext || {};

  if (!aguiGateway || !runId) {
    return;
  }

  const stageInfo = PIPELINE_STAGE_MAP[stageName] || { name: stageName, qlStage: 0 };

  try {
    // Use CUSTOM event instead of RUN_ERROR to avoid indicating pipeline failure
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.CUSTOM, {
      runId,
      threadId,
      customType: 'StageError',
      message: `${stageInfo.name} encountered an error but pipeline continues`,
      stageError: {
        stageName: stageInfo.name,
        stageId: stageName,
        errorType: error.constructor.name,
        errorMessage: error.message,
        continuePipeline: true,
        severity: 'warning'
      }
    }), {
      bimbaCoordinates: []
    });

    console.log(`[AG-UI] Emitted StageError (non-fatal) for ${stageName}: ${error.message}`);
  } catch (emitError) {
    console.warn(`[AG-UI] Failed to emit StageError event for ${stageName}:`, emitError.message);
  }
}

/**
 * Emits AG-UI RunError event for critical pipeline failure
 * @param {Object} skillContext - Context from the A2A skill
 * @param {string} stageName - Name of the failed stage
 * @param {Error} error - The error that occurred
 */
export function emitPipelineFailure(skillContext, stageName, error) {
  const { aguiGateway, runId, threadId } = skillContext || {};

  if (!aguiGateway || !runId) {
    return;
  }

  const stageInfo = PIPELINE_STAGE_MAP[stageName] || { name: stageName, qlStage: 0 };

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_ERROR, {
      runId,
      threadId,
      message: `Critical pipeline failure in ${stageInfo.name}: ${error.message}`,
      code: 'CRITICAL_PIPELINE_FAILURE',
      details: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        stageName: stageInfo.name,
        stageId: stageName,
        critical: true
      }
    }), {
      bimbaCoordinates: []
    });

    console.log(`[AG-UI] Emitted RunError (critical failure) for ${stageName}: ${error.message}`);
  } catch (emitError) {
    console.warn(`[AG-UI] Failed to emit RunError event for ${stageName}:`, emitError.message);
  }
}

/**
 * Emits AG-UI event for Bimba update suggestions
 * @param {Object} skillContext - Context from the A2A skill
 * @param {Object} suggestions - Update suggestions data
 */
export function emitBimbaUpdateSuggestions(skillContext, suggestions) {
  const { aguiGateway, runId, threadId } = skillContext || {};

  if (!aguiGateway || !runId) {
    return;
  }

  try {
    // Transform the suggestions data to match the AG-UI schema requirements
    const propertyUpdates = {};
    const relationshipSuggestions = [];

    // Extract property updates from relationalProperties
    if (suggestions.relationalProperties) {
      // Convert relational properties to property updates format
      Object.entries(suggestions.relationalProperties).forEach(([category, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item, index) => {
            if (item.name && item.description) {
              propertyUpdates[`${category}_${index}_${item.name.replace(/\s+/g, '_').toLowerCase()}`] = item.description;
            }
          });
        }
      });
    }

    // Extract relationship suggestions from coreElements or other sources
    if (suggestions.coreElements && Array.isArray(suggestions.coreElements)) {
      suggestions.coreElements.forEach((element, index) => {
        if (element.coordinates && Array.isArray(element.coordinates)) {
          element.coordinates.forEach(coord => {
            if (coord !== suggestions.targetCoordinate) {
              relationshipSuggestions.push({
                action: 'create',
                type: 'RELATES_TO',
                targetCoordinate: coord,
                properties: {
                  qlType: '1_MATERIAL_RELATION',
                  qlDynamics: 'foundational_emergence',
                  qlContextFrame: '0/1',
                  strength: 0.7,
                  description: `Related through core element: ${element.name}`,
                  semanticBasis: element.description || 'Semantic relationship identified through analysis',
                  functionalRole: element.relevance || 'Functional relationship'
                },
                reasoning: `Core element "${element.name}" suggests relationship to coordinate ${coord}`,
                confidence: 0.7
              });
            }
          });
        }
      });
    }

    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.BIMBA_UPDATE_SUGGESTIONS, {
      runId,
      threadId,
      propertyUpdates,
      relationshipSuggestions,
      reasoning: `Analysis completed for coordinate ${suggestions.targetCoordinate}. Identified ${suggestions.coreElements?.length || 0} core elements and ${Object.keys(suggestions.relationalProperties || {}).length} relational property categories.`,
      qlAlignment: `Aligned with QL position #5 (Recursive Synthesis) analyzing target coordinate ${suggestions.targetCoordinate}`,
      analysisMetadata: {
        llmModel: 'epii-analysis-pipeline',
        processingTime: Date.now(),
        targetCoordinate: suggestions.targetCoordinate,
        coreElementsCount: suggestions.coreElements?.length || 0,
        relationalPropertiesCount: Object.keys(suggestions.relationalProperties || {}).length
      }
    }), {
      bimbaCoordinates: suggestions.targetCoordinate ? [suggestions.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted Bimba update suggestions for coordinate ${suggestions.targetCoordinate} with ${Object.keys(propertyUpdates).length} property updates and ${relationshipSuggestions.length} relationship suggestions`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit Bimba update suggestions:`, error.message);
  }
}

/**
 * Emits AG-UI Custom event for memory onboarding completion (using protocol Custom event)
 * @param {Object} skillContext - Context from the A2A skill
 * @param {Object} memoryData - Memory integration results
 */
export function emitMemoryOnboarding(skillContext, memoryData) {
  const { aguiGateway, runId, threadId } = skillContext || {};

  if (!aguiGateway || !runId) {
    return;
  }

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.CUSTOM, {
      runId,
      threadId,
      customType: 'MemoryOnboarding',
      memoryIntegration: {
        graphiti: memoryData.graphiti || null,
        lightrag: memoryData.lightrag || null,
        notion: memoryData.notion || null,
        bimba: memoryData.bimba || null,
        targetCoordinate: memoryData.targetCoordinate
      }
    }), {
      bimbaCoordinates: memoryData.targetCoordinate ? [memoryData.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted memory onboarding completion for coordinate ${memoryData.targetCoordinate}`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit memory onboarding event:`, error.message);
  }
}

/**
 * Emit document created event
 * @param {Object} documentData - Document creation data
 * @param {string} runId - Run ID
 * @param {string} threadId - Thread ID
 */
export function emitDocumentCreated(documentData, runId, threadId) {
  if (!aguiGateway) {
    console.warn('[AG-UI] Gateway not available for document created event');
    return;
  }

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.DOCUMENT_CREATED, {
      runId,
      threadId,
      documentId: documentData.documentId,
      documentName: documentData.documentName,
      targetCoordinate: documentData.targetCoordinate,
      documentType: documentData.documentType || 'bimba',
      collection: documentData.collection || 'Documents',
      metadata: documentData.metadata || {}
    }), {
      bimbaCoordinates: documentData.targetCoordinate ? [documentData.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted document created event for ${documentData.documentId} at coordinate ${documentData.targetCoordinate}`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit document created event:`, error.message);
  }
}

/**
 * Emit document analysis completed event
 * @param {Object} analysisData - Analysis completion data
 * @param {string} runId - Run ID
 * @param {string} threadId - Thread ID
 */
export function emitDocumentAnalysisCompleted(analysisData, runId, threadId) {
  if (!aguiGateway) {
    console.warn('[AG-UI] Gateway not available for document analysis completed event');
    return;
  }

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.DOCUMENT_ANALYSIS_COMPLETED, {
      runId,
      threadId,
      documentId: analysisData.documentId,
      targetCoordinate: analysisData.targetCoordinate,
      analysisResults: analysisData.analysisResults || {},
      pratibimbaCreated: analysisData.pratibimbaCreated || false,
      pratibimbaId: analysisData.pratibimbaId,
      memoryIntegration: analysisData.memoryIntegration || {}
    }), {
      bimbaCoordinates: analysisData.targetCoordinate ? [analysisData.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted document analysis completed event for ${analysisData.documentId} at coordinate ${analysisData.targetCoordinate}`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit document analysis completed event:`, error.message);
  }
}

/**
 * Emit pratibimba created event
 * @param {Object} pratibimbaData - Pratibimba creation data
 * @param {string} runId - Run ID
 * @param {string} threadId - Thread ID
 */
export function emitPratibimbaCreated(pratibimbaData, runId, threadId) {
  if (!aguiGateway) {
    console.warn('[AG-UI] Gateway not available for pratibimba created event');
    return;
  }

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.PRATIBIMBA_CREATED, {
      runId,
      threadId,
      pratibimbaId: pratibimbaData.pratibimbaId,
      sourceDocumentId: pratibimbaData.sourceDocumentId,
      targetCoordinate: pratibimbaData.targetCoordinate,
      pratibimbaName: pratibimbaData.pratibimbaName,
      analysisResults: pratibimbaData.analysisResults || {}
    }), {
      bimbaCoordinates: pratibimbaData.targetCoordinate ? [pratibimbaData.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted pratibimba created event for ${pratibimbaData.pratibimbaId} from ${pratibimbaData.sourceDocumentId}`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit pratibimba created event:`, error.message);
  }
}

/**
 * Emit coordinate documents updated event
 * @param {Object} updateData - Document update data
 * @param {string} runId - Run ID
 * @param {string} threadId - Thread ID
 */
export function emitCoordinateDocumentsUpdated(updateData, runId, threadId) {
  if (!aguiGateway) {
    console.warn('[AG-UI] Gateway not available for coordinate documents updated event');
    return;
  }

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.COORDINATE_DOCUMENTS_UPDATED, {
      runId,
      threadId,
      targetCoordinate: updateData.targetCoordinate,
      documentCount: updateData.documentCount || 0,
      documentIds: updateData.documentIds || [],
      updateType: updateData.updateType || 'updated'
    }), {
      bimbaCoordinates: updateData.targetCoordinate ? [updateData.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted coordinate documents updated event for ${updateData.targetCoordinate} (${updateData.updateType})`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit coordinate documents updated event:`, error.message);
  }
}

/**
 * Emit document state refresh event
 * @param {Object} refreshData - Refresh data
 * @param {string} runId - Run ID
 * @param {string} threadId - Thread ID
 */
export function emitDocumentStateRefresh(refreshData, runId, threadId) {
  if (!aguiGateway) {
    console.warn('[AG-UI] Gateway not available for document state refresh event');
    return;
  }

  try {
    aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.DOCUMENT_STATE_REFRESH, {
      runId,
      threadId,
      scope: refreshData.scope || 'coordinate',
      targetCoordinate: refreshData.targetCoordinate,
      documentId: refreshData.documentId,
      reason: refreshData.reason || 'state_update'
    }), {
      bimbaCoordinates: refreshData.targetCoordinate ? [refreshData.targetCoordinate] : [],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log(`[AG-UI] Emitted document state refresh event (${refreshData.scope}) for ${refreshData.targetCoordinate || refreshData.documentId}`);
  } catch (error) {
    console.warn(`[AG-UI] Failed to emit document state refresh event:`, error.message);
  }
}

/**
 * Wraps a stage function with AG-UI integration (following AG-UI protocol)
 * @param {Function} stageFunction - The original stage function
 * @param {string} stageName - Name of the stage
 * @returns {Function} Wrapped stage function with AG-UI events
 */
export function wrapStageWithAGUI(stageFunction, stageName) {
  return async function(state) {
    const skillContext = state.skillContext;

    try {
      // Emit StepStarted
      emitStageStarted(skillContext, stageName, 'Starting stage execution', {
        targetCoordinate: state.sourceMetadata?.targetCoordinate
      });

      // Execute the original stage function
      const result = await stageFunction(state);

      // Emit StepFinished
      emitStageFinished(skillContext, stageName, {
        targetCoordinate: state.sourceMetadata?.targetCoordinate,
        hasResult: !!result
      });

      return result;
    } catch (error) {
      // Only emit StageError for actual stage failures, not for handled exceptions
      // Check if this is a critical error that should stop the pipeline
      const isCriticalError = error.message.includes('Critical') ||
                             error.message.includes('Failed to') ||
                             stageName === 'stage_minus5' ||
                             stageName === 'stage_minus4';

      if (isCriticalError) {
        emitStageError(skillContext, stageName, error);
      } else {
        // For non-critical errors, just log them without emitting events
        console.warn(`⚠️ Non-critical error in ${stageName} (pipeline continues):`, error.message);
      }

      // Re-throw the error to maintain original behavior
      throw error;
    }
  };
}

/**
 * Utility to check if AG-UI context is available
 * @param {Object} state - Pipeline state
 * @returns {boolean} True if AG-UI context is available
 */
export function hasAGUIContext(state) {
  return !!(state.skillContext?.aguiGateway && state.skillContext?.runId);
}

/**
 * Gets the AG-UI context from pipeline state
 * @param {Object} state - Pipeline state
 * @returns {Object|null} AG-UI context or null
 */
export function getAGUIContext(state) {
  if (!hasAGUIContext(state)) {
    return null;
  }

  return state.skillContext;
}
