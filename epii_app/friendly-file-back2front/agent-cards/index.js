/**
 * Agent Cards Index
 * Exports all agent cards for the A2A framework
 *
 * Bimba Coordinate: #5-4
 * Represents the collection of agent definitions in the Siva-Shakti layer
 */

const epiiAgentCard = require('./epii-agent-card');
const naraAgentCard = require('./nara-agent-card');

// Placeholder for Anuttara Agent (#0)
const anuttaraAgentCard = {
  id: "anuttara-agent",
  name: "Anuttara Agent",
  description: "Provides foundational grounding and transcendent context (#0)",
  subsystemCoordinate: "#0",
  url: "http://localhost:3033/a2a/anuttara",
  version: "0.1.0",
  capabilities: {
    streaming: true,
    pushNotifications: false
  },
  skills: [
    {
      id: "provide-foundational-context",
      name: "Provide Foundational Context",
      description: "Provides transcendent context and grounding for concepts",
      bimbaCoordinate: "#0-0",
      examples: [
        "What is the foundational context for this concept?",
        "How does this relate to the transcendent void?"
      ]
    }
  ]
};

// Placeholder for Paramasiva Agent (#1)
const paramasivaAgentCard = {
  id: "paramasiva-agent",
  name: "Paramasiva Agent",
  description: "Handles logical structure and formal patterns (#1)",
  subsystemCoordinate: "#1",
  url: "http://localhost:3033/a2a/paramasiva",
  version: "0.1.0",
  capabilities: {
    streaming: true,
    pushNotifications: false
  },
  skills: [
    {
      id: "identify-topological-potential",
      name: "Identify Topological Potential",
      description: "Identifies the topological potential in a concept or structure",
      bimbaCoordinate: "#1-0",
      examples: [
        "What is the topological structure of this concept?",
        "Identify the genus-1 structure in this framework"
      ]
    }
  ]
};

// Placeholder for Parashakti Agent (#2)
const parashaktiAgentCard = {
  id: "parashakti-agent",
  name: "Parashakti Agent",
  description: "Manages dynamic processes and transformations (#2)",
  subsystemCoordinate: "#2",
  url: "http://localhost:3033/a2a/parashakti",
  version: "0.1.0",
  capabilities: {
    streaming: true,
    pushNotifications: false
  },
  skills: [
    {
      id: "identify-harmonic-relationships",
      name: "Identify Harmonic Relationships",
      description: "Identifies harmonic relationships and resonances in concepts",
      bimbaCoordinate: "#2-0",
      examples: [
        "What are the harmonic relationships in this concept?",
        "How does this concept resonate with other concepts?"
      ]
    }
  ]
};

// Placeholder for Mahamaya Agent (#3)
const mahamayaAgentCard = {
  id: "mahamaya-agent",
  name: "Mahamaya Agent",
  description: "Handles integration and manifestation (#3)",
  subsystemCoordinate: "#3",
  url: "http://localhost:3033/a2a/mahamaya",
  version: "0.1.0",
  capabilities: {
    streaming: true,
    pushNotifications: false
  },
  skills: [
    {
      id: "symbolic-integration",
      name: "Symbolic Integration",
      description: "Integrates concepts into symbolic representations",
      bimbaCoordinate: "#3-0",
      examples: [
        "What symbolic representations can be derived from this concept?",
        "How does this concept integrate with existing symbolic frameworks?"
      ]
    }
  ]
};

// Nara Agent (#4) - Imported from nara-agent-card.js

// Tool Agent Cards
const bimbaGraphToolCard = {
  id: "bimba-graph-tool",
  name: "Bimba Graph Tool",
  description: "Provides access to the Bimba knowledge graph",
  url: "http://localhost:3033/a2a/tools/bimba-graph",
  version: "0.1.0",
  skills: [
    {
      id: "query-bimba-graph",
      name: "Query Bimba Graph",
      description: "Queries the Bimba knowledge graph",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          bimbaCoordinate: { type: "string", nullable: true }
        },
        required: ["query"]
      },
      outputSchema: {
        type: "object",
        properties: {
          results: { type: "array" },
          count: { type: "integer" }
        },
        required: ["results", "count"]
      }
    }
  ]
};

const pratibimbaStoreToolCard = {
  id: "pratibimba-store-tool",
  name: "Pratibimba Store Tool",
  description: "Provides access to the Pratibimba semantic store",
  url: "http://localhost:3033/a2a/tools/pratibimba-store",
  version: "0.1.0",
  skills: [
    {
      id: "search-pratibimba-context",
      name: "Search Pratibimba Context",
      description: "Searches the Pratibimba semantic store",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          filters: { type: "object", nullable: true }
        },
        required: ["query"]
      },
      outputSchema: {
        type: "object",
        properties: {
          results: { type: "array" },
          count: { type: "integer" }
        },
        required: ["results", "count"]
      }
    }
  ]
};

// Export all agent cards
module.exports = {
  epiiAgentCard,
  anuttaraAgentCard,
  paramasivaAgentCard,
  parashaktiAgentCard,
  mahamayaAgentCard,
  naraAgentCard,
  bimbaGraphToolCard,
  pratibimbaStoreToolCard
};
