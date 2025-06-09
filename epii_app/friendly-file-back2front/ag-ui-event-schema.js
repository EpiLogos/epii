/**
 * AG-UI Event Schema for Bimba Operations
 * Defines event structures and validation for AG-UI protocol integration
 * with Bimba coordinate system and Quaternary Logic alignment
 *
 * Bimba Coordinate: #5-4-1
 * Represents AG-UI event schema within the Siva-Shakti layer
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Standard AG-UI Event Types
 * Based on AG-UI protocol specification
 */
const AGUIEventTypes = {
  // Lifecycle Events
  RUN_STARTED: 'RunStarted',
  RUN_FINISHED: 'RunFinished',
  RUN_ERROR: 'RunError',
  STEP_STARTED: 'StepStarted',
  STEP_FINISHED: 'StepFinished',

  // Text Message Events
  TEXT_MESSAGE_START: 'TextMessageStart',
  TEXT_MESSAGE_CONTENT: 'TextMessageContent',
  TEXT_MESSAGE_END: 'TextMessageEnd',

  // Tool Call Events
  TOOL_CALL_START: 'ToolCallStart',
  TOOL_CALL_ARGS: 'ToolCallArgs',
  TOOL_CALL_END: 'ToolCallEnd',

  // State Management Events
  STATE_SNAPSHOT: 'StateSnapshot',
  STATE_DELTA: 'StateDelta',
  MESSAGES_SNAPSHOT: 'MessagesSnapshot',

  // Special Events
  RAW: 'Raw',
  CUSTOM: 'Custom',

  // Bimba-specific Custom Events
  BIMBA_NODE_ANALYSIS_REQUEST: 'BimbaNodeAnalysisRequest',
  BIMBA_ANALYSIS_PROGRESS: 'BimbaAnalysisProgress',
  BIMBA_UPDATE_SUGGESTIONS: 'BimbaUpdateSuggestions',
  BIMBA_CONTEXT_UPDATE: 'BimbaContextUpdate',
  QL_STAGE_TRANSITION: 'QLStageTransition',
  COORDINATE_CHANGE: 'CoordinateChange'
};

/**
 * Bimba-specific Event Schemas
 * Defines the structure for Bimba operations within AG-UI
 */
const BimbaEventSchemas = {
  /**
   * BimbaNodeAnalysisRequest Event Schema
   * Sent from frontend to agent with complete node data
   */
  BimbaNodeAnalysisRequest: {
    type: 'object',
    required: ['coordinate', 'nodeData', 'documentContent', 'analysisType'],
    properties: {
      coordinate: { 
        type: 'string',
        pattern: '^#\\d+(-\\d+)*$',
        description: 'Bimba coordinate (e.g., #5-2)'
      },
      nodeData: {
        type: 'object',
        required: ['properties', 'relationships'],
        properties: {
          properties: { 
            type: 'object',
            description: 'Complete node properties from Neo4j'
          },
          relationships: {
            type: 'array',
            description: 'Complete relationships array from graph',
            items: {
              type: 'object',
              required: ['type', 'direction', 'relatedNode'],
              properties: {
                type: { type: 'string' },
                properties: { type: 'object' },
                direction: { enum: ['incoming', 'outgoing'] },
                relatedNode: {
                  type: 'object',
                  required: ['coordinate'],
                  properties: {
                    coordinate: { type: 'string' },
                    title: { type: 'string' },
                    labels: { 
                      type: 'array', 
                      items: { type: 'string' } 
                    }
                  }
                }
              }
            }
          }
        }
      },
      documentContent: { 
        type: 'string',
        minLength: 1,
        description: 'Document content to analyze'
      },
      documentType: { 
        type: 'string',
        enum: ['bimba', 'pratibimba'],
        default: 'bimba'
      },
      documentName: { 
        type: 'string',
        description: 'Name of the document'
      },
      analysisType: { 
        type: 'string',
        enum: ['update-suggestions', 'relationship-analysis', 'property-validation'],
        default: 'update-suggestions'
      }
    }
  },

  /**
   * BimbaAnalysisProgress Event Schema
   * Sent from agent to frontend with real-time progress updates
   */
  BimbaAnalysisProgress: {
    type: 'object',
    required: ['stage', 'progress'],
    properties: {
      stage: { 
        type: 'string',
        enum: ['llm-analysis', 'json-parsing', 'validation', 'completion'],
        description: 'Current analysis stage'
      },
      progress: { 
        type: 'number', 
        minimum: 0, 
        maximum: 100,
        description: 'Progress percentage (0-100)'
      },
      currentStep: { 
        type: 'string',
        description: 'Current processing step'
      },
      estimatedTimeRemaining: { 
        type: 'number',
        minimum: 0,
        description: 'Estimated time remaining in seconds'
      },
      intermediateResults: { 
        type: 'object',
        description: 'Partial results available during processing'
      }
    }
  },

  /**
   * BimbaUpdateSuggestions Event Schema
   * Sent from agent to frontend with analysis results
   */
  BimbaUpdateSuggestions: {
    type: 'object',
    required: ['propertyUpdates', 'relationshipSuggestions'],
    properties: {
      propertyUpdates: { 
        type: 'object',
        description: 'Suggested property updates for the node'
      },
      relationshipSuggestions: {
        type: 'array',
        description: 'Suggested relationship changes',
        items: {
          type: 'object',
          required: ['action', 'type', 'targetCoordinate'],
          properties: {
            action: { 
              enum: ['create', 'update', 'delete'],
              description: 'Action to perform on relationship'
            },
            type: { 
              type: 'string',
              description: 'Relationship type'
            },
            targetCoordinate: { 
              type: 'string',
              pattern: '^#\\d+(-\\d+)*$',
              description: 'Target Bimba coordinate'
            },
            properties: { 
              type: 'object',
              description: 'Relationship properties'
            },
            reasoning: { 
              type: 'string',
              description: 'Explanation for the suggestion'
            },
            confidence: { 
              type: 'number', 
              minimum: 0, 
              maximum: 1,
              description: 'Confidence score (0-1)'
            }
          }
        }
      },
      reasoning: { 
        type: 'string',
        description: 'Overall reasoning for the suggestions'
      },
      qlAlignment: { 
        type: 'string',
        description: 'Quaternary Logic alignment explanation'
      },
      analysisMetadata: {
        type: 'object',
        properties: {
          llmModel: { type: 'string' },
          processingTime: { type: 'number' },
          tokenUsage: { 
            type: 'object',
            properties: {
              promptTokens: { type: 'number' },
              completionTokens: { type: 'number' },
              totalTokens: { type: 'number' }
            }
          }
        }
      }
    }
  },

  /**
   * BimbaContextUpdate Event Schema
   * Bidirectional context synchronization
   */
  BimbaContextUpdate: {
    type: 'object',
    required: ['contextType', 'contextData'],
    properties: {
      contextType: {
        enum: ['coordinate-change', 'ql-stage-transition', 'node-selection'],
        description: 'Type of context update'
      },
      contextData: {
        type: 'object',
        description: 'Context-specific data'
      },
      bimbaCoordinates: {
        type: 'array',
        items: { type: 'string' },
        description: 'Affected Bimba coordinates'
      }
    }
  }
};

/**
 * Create AG-UI event with Bimba metadata support
 * @param {string} type - Event type from AGUIEventTypes
 * @param {Object} payload - Event payload
 * @param {Object} [bimbaMetadata] - Bimba-specific metadata
 * @returns {Object} AG-UI event with Bimba metadata
 */
const createAGUIEvent = (type, payload = {}, bimbaMetadata = {}) => {
  const event = {
    type,
    ...payload,
    metadata: {
      ...payload.metadata,
      bimbaCoordinates: bimbaMetadata.bimbaCoordinates || [],
      qlStage: bimbaMetadata.qlStage,
      contextFrame: bimbaMetadata.contextFrame,
      subsystemPath: bimbaMetadata.subsystemPath,
      timestamp: new Date().toISOString(),
      ...bimbaMetadata
    },
    timestamp: new Date().toISOString()
  };

  // Add runId and threadId if not present
  if (!event.runId && type !== AGUIEventTypes.RUN_STARTED) {
    event.runId = payload.runId || uuidv4();
  }
  
  if (!event.threadId) {
    event.threadId = payload.threadId || uuidv4();
  }

  return event;
};

/**
 * Validate AG-UI event against schema
 * @param {Object} event - Event to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
const validateAGUIEvent = (event) => {
  if (!event.type) {
    throw new Error('AG-UI event must have a type');
  }

  if (!Object.values(AGUIEventTypes).includes(event.type)) {
    throw new Error(`Unknown AG-UI event type: ${event.type}`);
  }

  // Validate Bimba-specific events
  const schema = BimbaEventSchemas[event.type];
  if (schema) {
    validateEventPayload(event, schema);
  }

  // Validate required fields for lifecycle events
  if ([AGUIEventTypes.RUN_STARTED, AGUIEventTypes.RUN_FINISHED, AGUIEventTypes.RUN_ERROR].includes(event.type)) {
    if (!event.runId) {
      throw new Error(`${event.type} event must have runId`);
    }
  }

  // Validate step events
  if ([AGUIEventTypes.STEP_STARTED, AGUIEventTypes.STEP_FINISHED].includes(event.type)) {
    if (!event.stepName) {
      throw new Error(`${event.type} event must have stepName`);
    }
  }

  // Validate tool call events
  if (event.type.startsWith('ToolCall')) {
    if (!event.toolCallId) {
      throw new Error(`${event.type} event must have toolCallId`);
    }
  }

  return true;
};

/**
 * Simple JSON schema validation for event payloads
 * @param {Object} event - Event to validate
 * @param {Object} schema - JSON schema
 * @throws {Error} If validation fails
 */
const validateEventPayload = (event, schema) => {
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in event)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  if (schema.properties) {
    for (const [field, fieldSchema] of Object.entries(schema.properties)) {
      if (field in event) {
        validateFieldValue(event[field], fieldSchema, field);
      }
    }
  }
};

/**
 * Validate individual field value
 * @param {*} value - Value to validate
 * @param {Object} schema - Field schema
 * @param {string} fieldName - Field name for error messages
 * @throws {Error} If validation fails
 */
const validateFieldValue = (value, schema, fieldName) => {
  if (schema.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== schema.type) {
      throw new Error(`Field ${fieldName} must be of type ${schema.type}, got ${actualType}`);
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    throw new Error(`Field ${fieldName} must be one of: ${schema.enum.join(', ')}`);
  }

  if (schema.pattern && typeof value === 'string') {
    const regex = new RegExp(schema.pattern);
    if (!regex.test(value)) {
      throw new Error(`Field ${fieldName} does not match pattern: ${schema.pattern}`);
    }
  }

  if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum) {
    throw new Error(`Field ${fieldName} must be >= ${schema.minimum}`);
  }

  if (schema.maximum !== undefined && typeof value === 'number' && value > schema.maximum) {
    throw new Error(`Field ${fieldName} must be <= ${schema.maximum}`);
  }

  if (schema.minLength !== undefined && typeof value === 'string' && value.length < schema.minLength) {
    throw new Error(`Field ${fieldName} must be at least ${schema.minLength} characters`);
  }
};

module.exports = {
  AGUIEventTypes,
  BimbaEventSchemas,
  createAGUIEvent,
  validateAGUIEvent,
  validateEventPayload
};
