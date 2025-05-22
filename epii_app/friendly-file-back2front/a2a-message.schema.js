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

module.exports = { 
  A2AMessageSchema,
  createA2AMessage,
  getQLStageName
};
