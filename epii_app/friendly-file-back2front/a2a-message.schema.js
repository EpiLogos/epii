/**
 * A2A Message Schema
 * Defines the structure for Agent-to-Agent communication messages
 * with Bimba coordinate integration
 *
 * Bimba Coordinate: #5-4
 * Represents the foundational communication protocol for the Siva-Shakti layer
 */

const A2AMessageSchema = {
  type: 'object',
  required: [
    'message_id',
    'sender_id',
    'receiver_id',
    'conversation_id',
    'performative',
    'content',
    'timestamp'
  ],
  properties: {
    message_id: { type: 'string', format: 'uuid' },
    sender_id: { type: 'string' },
    receiver_id: { type: 'string' },
    conversation_id: { type: 'string' },
    performative: {
      type: 'string',
      enum: ['request', 'inform', 'failure', 'query-ref', 'agree', 'refuse']
    },
    content: { type: 'object' },
    content_language: { type: 'string', default: 'json' },
    ontology: { type: 'string', nullable: true },
    timestamp: { type: 'string', format: 'date-time' },
    metadata: {
      type: 'object',
      properties: {
        bimbaCoordinates: {
          type: 'array',
          items: { type: 'string' }
        },
        qlStage: { type: 'integer', minimum: 0, maximum: 5 },
        qlStageName: { type: 'string' },
        contextFrame: { type: 'string' },
        subsystemPath: { type: 'string' },
        userArchetype: { type: 'string', nullable: true },
        epistemologyArchetype: { type: 'string', nullable: true }
      }
    }
  }
};

// Helper function to map QL stage to name
const getQLStageName = (stage) => {
  const qlStageNames = [
    "A-logos",    // 0
    "Pro-logos",  // 1
    "Dia-logos",  // 2
    "Logos",      // 3
    "Epi-logos",  // 4
    "An-a-logos"  // 5
  ];

  return qlStageNames[stage % 6]; // Ensure we stay within 0-5 range
};

// Helper function to create a new A2A message
const createA2AMessage = ({
  sender_id,
  receiver_id,
  conversation_id,
  performative,
  content,
  bimbaCoordinates = [],
  qlStage = null,
  contextFrame = null,
  subsystemPath = null,
  userArchetype = null,
  epistemologyArchetype = null,
  content_language = 'json',
  ontology = null
}) => {
  const message_id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  const timestamp = new Date().toISOString();

  // Determine QL stage name if qlStage is provided
  const qlStageName = qlStage !== null ? getQLStageName(qlStage) : null;

  return {
    message_id,
    sender_id,
    receiver_id,
    conversation_id,
    performative,
    content,
    content_language,
    ontology,
    timestamp,
    metadata: {
      bimbaCoordinates,
      qlStage,
      qlStageName,
      contextFrame,
      subsystemPath,
      userArchetype,
      epistemologyArchetype
    }
  };
};

/**
 * AG-UI Event Types for A2A Integration
 * Extends A2A protocol with AG-UI event support
 */
const A2AAGUIEventTypes = {
  // Standard AG-UI lifecycle events
  AGUI_RUN_STARTED: 'agui.run.started',
  AGUI_RUN_FINISHED: 'agui.run.finished',
  AGUI_RUN_ERROR: 'agui.run.error',
  AGUI_STEP_STARTED: 'agui.step.started',
  AGUI_STEP_FINISHED: 'agui.step.finished',

  // AG-UI text streaming events
  AGUI_TEXT_MESSAGE_START: 'agui.text.message.start',
  AGUI_TEXT_MESSAGE_CONTENT: 'agui.text.message.content',
  AGUI_TEXT_MESSAGE_END: 'agui.text.message.end',

  // AG-UI tool call events
  AGUI_TOOL_CALL_START: 'agui.tool.call.start',
  AGUI_TOOL_CALL_ARGS: 'agui.tool.call.args',
  AGUI_TOOL_CALL_END: 'agui.tool.call.end',

  // AG-UI state management events
  AGUI_STATE_SNAPSHOT: 'agui.state.snapshot',
  AGUI_STATE_DELTA: 'agui.state.delta',
  AGUI_MESSAGES_SNAPSHOT: 'agui.messages.snapshot',

  // Bimba-specific AG-UI events
  AGUI_BIMBA_NODE_ANALYSIS_REQUEST: 'agui.bimba.node.analysis.request',
  AGUI_BIMBA_ANALYSIS_PROGRESS: 'agui.bimba.analysis.progress',
  AGUI_BIMBA_UPDATE_SUGGESTIONS: 'agui.bimba.update.suggestions',
  AGUI_BIMBA_CONTEXT_UPDATE: 'agui.bimba.context.update',
  AGUI_QL_STAGE_TRANSITION: 'agui.ql.stage.transition',
  AGUI_COORDINATE_CHANGE: 'agui.coordinate.change'
};

/**
 * Extended A2A Message Schema with AG-UI Support
 * Maintains backward compatibility while adding AG-UI event capabilities
 */
const ExtendedA2AMessageSchema = {
  ...A2AMessageSchema,
  properties: {
    ...A2AMessageSchema.properties,
    // AG-UI specific fields (optional for backward compatibility)
    agui_event_type: {
      type: 'string',
      enum: Object.values(A2AAGUIEventTypes),
      nullable: true
    },
    agui_run_id: {
      type: 'string',
      format: 'uuid',
      nullable: true
    },
    agui_thread_id: {
      type: 'string',
      format: 'uuid',
      nullable: true
    },
    agui_step_name: {
      type: 'string',
      nullable: true
    },
    agui_tool_call_id: {
      type: 'string',
      format: 'uuid',
      nullable: true
    },
    agui_message_id: {
      type: 'string',
      format: 'uuid',
      nullable: true
    },
    agui_delta: {
      type: 'string',
      nullable: true
    }
  }
};

/**
 * Create AG-UI compatible A2A message
 * @param {Object} options - Message options
 * @param {string} options.sender_id - Sender agent ID
 * @param {string} options.receiver_id - Receiver agent ID
 * @param {string} options.conversation_id - Conversation ID
 * @param {string} options.agui_event_type - AG-UI event type
 * @param {Object} options.agui_payload - AG-UI event payload
 * @param {Object} [options.bimbaMetadata] - Bimba metadata
 * @returns {Object} AG-UI compatible A2A message
 */
const createAGUIA2AMessage = ({
  sender_id,
  receiver_id,
  conversation_id,
  agui_event_type,
  agui_payload = {},
  bimbaMetadata = {}
}) => {
  const baseMessage = createA2AMessage({
    sender_id,
    receiver_id,
    conversation_id,
    performative: 'inform',
    content: {
      agui_event_type,
      ...agui_payload
    },
    ...bimbaMetadata
  });

  // Add AG-UI specific fields
  return {
    ...baseMessage,
    agui_event_type,
    agui_run_id: agui_payload.runId || null,
    agui_thread_id: agui_payload.threadId || null,
    agui_step_name: agui_payload.stepName || null,
    agui_tool_call_id: agui_payload.toolCallId || null,
    agui_message_id: agui_payload.messageId || null,
    agui_delta: agui_payload.delta || null
  };
};

/**
 * Validate AG-UI A2A message
 * @param {Object} message - Message to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
const validateAGUIA2AMessage = (message) => {
  // Validate base A2A message structure
  if (!message.message_id || !message.sender_id || !message.receiver_id) {
    throw new Error('Invalid A2A message: missing required fields');
  }

  // Validate AG-UI event type if present
  if (message.agui_event_type && !Object.values(A2AAGUIEventTypes).includes(message.agui_event_type)) {
    throw new Error(`Invalid AG-UI event type: ${message.agui_event_type}`);
  }

  // Validate AG-UI run/thread IDs format if present
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (message.agui_run_id && !uuidRegex.test(message.agui_run_id)) {
    throw new Error('Invalid AG-UI run ID format');
  }

  if (message.agui_thread_id && !uuidRegex.test(message.agui_thread_id)) {
    throw new Error('Invalid AG-UI thread ID format');
  }

  return true;
};

/**
 * Check if message is an AG-UI event
 * @param {Object} message - Message to check
 * @returns {boolean} True if AG-UI event
 */
const isAGUIEvent = (message) => {
  return !!(message.agui_event_type ||
           (message.content && message.content.agui_event_type));
};

/**
 * Extract AG-UI event data from A2A message
 * @param {Object} message - A2A message
 * @returns {Object|null} AG-UI event data or null
 */
const extractAGUIEventData = (message) => {
  if (!isAGUIEvent(message)) {
    return null;
  }

  const eventType = message.agui_event_type || message.content.agui_event_type;

  return {
    type: eventType,
    runId: message.agui_run_id,
    threadId: message.agui_thread_id,
    stepName: message.agui_step_name,
    toolCallId: message.agui_tool_call_id,
    messageId: message.agui_message_id,
    delta: message.agui_delta,
    payload: message.content,
    metadata: message.metadata,
    timestamp: message.timestamp
  };
};

module.exports = {
  A2AMessageSchema,
  ExtendedA2AMessageSchema,
  A2AAGUIEventTypes,
  createA2AMessage,
  createAGUIA2AMessage,
  validateAGUIA2AMessage,
  isAGUIEvent,
  extractAGUIEventData,
  getQLStageName
};
