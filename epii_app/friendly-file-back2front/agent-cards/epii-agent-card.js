/**
 * Epii Agent Card
 * Defines the capabilities and skills of the Epii Agent
 *
 * Bimba Coordinate: #5-4-5
 * Represents the Epii Agent within the Siva-Shakti layer
 */

const epiiAgentCard = {
  id: "epii-agent",
  name: "Epii Agent",
  description: "Embodies recursive synthesis at the culmination of the quaternary cycle (#5)",
  subsystemCoordinate: "#5",
  url: "http://localhost:3033/a2a/epii",
  provider: {
    organization: "Epi-Logos",
    url: "https://epi-logos.com"
  },
  version: "1.0.0",
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: true
  },
  authentication: {
    schemes: ["Bearer"]
  },
  defaultInputModes: ["text/plain", "application/json"],
  defaultOutputModes: ["text/plain", "application/json"],
  skills: [
    {
      id: "provide-meta-perspective",
      name: "Provide Meta-Perspective",
      description: "Provides a meta-level perspective on a document or concept",
      bimbaCoordinate: "#5-5",
      inputSchema: {
        type: "object",
        properties: {
          content: { type: "string" },
          targetCoordinate: { type: "string", nullable: true },
          contextFrame: { type: "string", nullable: true }
        },
        required: ["content"]
      },
      outputSchema: {
        type: "object",
        properties: {
          metaPerspective: { type: "string" },
          relevantCoordinates: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["metaPerspective"]
      },
      examples: [
        "Provide a meta-perspective on this philosophical text",
        "What higher-order patterns can you identify in this analysis?"
      ]
    },
    {
      id: "philosophical-framing",
      name: "Philosophical Framing",
      description: "Frames a concept within the Epi-Logos philosophical framework",
      bimbaCoordinate: "#5-1",
      inputSchema: {
        type: "object",
        properties: {
          concept: { type: "string" },
          contextFrame: { type: "string", nullable: true }
        },
        required: ["concept"]
      },
      outputSchema: {
        type: "object",
        properties: {
          philosophicalFraming: { type: "string" },
          quaternaryLogicMapping: {
            type: "object",
            properties: {
              aLogos: { type: "string" },
              proLogos: { type: "string" },
              diaLogos: { type: "string" },
              logos: { type: "string" },
              epiLogos: { type: "string" },
              anALogos: { type: "string" }
            }
          }
        },
        required: ["philosophicalFraming"]
      },
      examples: [
        "Frame the concept of consciousness within the Epi-Logos framework",
        "How does the quaternary logic apply to epistemology?"
      ]
    },
    {
      id: "validate-crystallization-payload",
      name: "Validate Crystallization Payload",
      description: "Validates a crystallization payload before it's sent to Notion",
      bimbaCoordinate: "#5-0",
      inputSchema: {
        type: "object",
        properties: {
          notionUpdatePayload: { type: "object" },
          contextFrame: { type: "string", nullable: true }
        },
        required: ["notionUpdatePayload"]
      },
      outputSchema: {
        type: "object",
        properties: {
          isValid: { type: "boolean" },
          validationMessage: { type: "string" },
          suggestedRevisions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string" },
                currentValue: { type: "string" },
                suggestedValue: { type: "string" },
                reason: { type: "string" }
              }
            }
          }
        },
        required: ["isValid", "validationMessage"]
      },
      examples: [
        "Validate this Notion update payload for philosophical coherence",
        "Is this crystallization ready for storage in the knowledge base?"
      ]
    }
  ]
};

module.exports = epiiAgentCard;
