/**
 * Nara Agent Card
 * Defines the capabilities and skills of the Nara Agent
 *
 * Bimba Coordinate: #5-4-4
 * Represents the Nara Agent within the Siva-Shakti layer
 */

const naraAgentCard = {
  id: "nara-agent",
  name: "Nara Agent",
  description: "Manages contextual application, personalization, and user dialogue (#4)",
  subsystemCoordinate: "#4",
  url: "http://localhost:3033/a2a/nara",
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
      id: "generate-personal-archetypal-signature",
      name: "Generate Personal Archetypal Signature",
      description: "Creates a unique archetypal profile for a user by synthesizing birthdate encoding and natal chart data",
      bimbaCoordinate: "#4-0",
      examples: [
        "Generate an archetypal signature for user with ID 12345",
        "What is my archetypal signature based on my birthdate?"
      ],
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string" },
          birthdate: { type: "string", nullable: true },
          natalChart: { type: "object", nullable: true }
        },
        required: ["userId"]
      },
      outputSchema: {
        type: "object",
        properties: {
          signature: { type: "object" },
          keyNumbers: { type: "array", items: { type: "number" } },
          decanicAlignments: { type: "array", items: { type: "string" } },
          coreArchetypes: { type: "array", items: { type: "string" } }
        },
        required: ["signature"]
      }
    },
    {
      id: "interpret-symbolic-input-personalized",
      name: "Interpret Symbolic Input Personalized",
      description: "Interprets symbolic input specifically for a given user, filtering through their unique archetypal signature",
      bimbaCoordinate: "#4-2",
      examples: [
        "Interpret these Tarot cards for user 12345",
        "What does this dream symbol mean for me specifically?"
      ],
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string" },
          symbolicInput: { 
            type: "object",
            properties: {
              type: { type: "string", enum: ["tarot", "dream", "vision", "symbol"] },
              content: { type: "object" }
            },
            required: ["type", "content"]
          },
          context: { type: "string", nullable: true }
        },
        required: ["userId", "symbolicInput"]
      },
      outputSchema: {
        type: "object",
        properties: {
          interpretation: { type: "string" },
          relatedBimbaCoordinates: { type: "array", items: { type: "string" } }
        },
        required: ["interpretation"]
      }
    },
    {
      id: "generate-bespoke-psycho-techne",
      name: "Generate Bespoke Psycho-Techne",
      description: "Generates personalized practical guidance such as rituals, meditations, or daily routines",
      bimbaCoordinate: "#4-3",
      examples: [
        "Create a ritual for integrating my recent vision",
        "Design a meditation practice for my current situation"
      ],
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string" },
          goalOrContext: { type: "string" },
          guidanceType: { type: "string", enum: ["ritual", "decanic_plan", "meditation_image", "sigil", "daily_routine"] }
        },
        required: ["userId", "goalOrContext", "guidanceType"]
      },
      outputSchema: {
        type: "object",
        properties: {
          guidance: { type: "string" },
          steps: { type: "array", items: { type: "string" } },
          imagePrompt: { type: "string", nullable: true }
        },
        required: ["guidance"]
      }
    },
    {
      id: "map-user-to-concrescence-cycle",
      name: "Map User to Concrescence Cycle",
      description: "Determines the user's current phase within the 12-Fold Concrescence model",
      bimbaCoordinate: "#4-4",
      examples: [
        "What phase of the concrescence cycle am I in?",
        "Map my current state to the concrescence model"
      ],
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string" },
          userContextDescription: { type: "string" }
        },
        required: ["userId", "userContextDescription"]
      },
      outputSchema: {
        type: "object",
        properties: {
          phase: { type: "string" },
          explanation: { type: "string" },
          recommendations: { type: "array", items: { type: "string" } }
        },
        required: ["phase", "explanation"]
      }
    },
    {
      id: "personalize-dialogue",
      name: "Personalize Dialogue",
      description: "Personalizes dialogue responses based on user context and identity",
      bimbaCoordinate: "#4-5",
      examples: [
        "How would you explain this concept to me specifically?",
        "Adapt this explanation to my level of understanding"
      ],
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string" },
          content: { type: "string" },
          universalContext: { type: "string", nullable: true }
        },
        required: ["userId", "content"]
      },
      outputSchema: {
        type: "object",
        properties: {
          personalizedResponse: { type: "string" },
          suggestedVisualizations: { type: "array", items: { type: "object" } },
          suggestedPractices: { type: "array", items: { type: "string" } }
        },
        required: ["personalizedResponse"]
      }
    }
  ]
};

module.exports = naraAgentCard;
