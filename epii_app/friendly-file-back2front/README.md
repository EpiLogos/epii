# Siva-Shakti A2A Framework (#5-4)

This directory contains the implementation of the Agent-to-Agent (A2A) communication framework for the Epi-Logos system, representing the Siva-Shakti layer (Bimba Coordinate #5-4) that connects frontend modules with the backend QL pipeline and BPMCP memory service.

## Overview

The A2A framework provides a standardized way for agents within the Epi-Logos system to communicate with each other. It follows Google's A2A protocol specification, enabling interoperability with other A2A-compatible agents.

The framework consists of:

1. **A2A Message Schema**: Defines the structure for agent communication messages
2. **A2A Server**: Handles incoming A2A requests and routes them to the appropriate agent
3. **Task State Manager**: Manages task state and QL cycle transitions
4. **Agent Cards**: Define agent capabilities and skills
5. **A2A Client**: Enables agents to communicate with each other
6. **Adapters**: Bridge between the A2A protocol and existing agent implementations

## Directory Structure

```
friendly-file-front-back - (#5-4: Siva-Shakti)/
├── a2a-message.schema.js       # Message schema
├── a2a-server.js               # A2A server implementation
├── a2a-service.js              # Main entry point for the A2A service
├── epii-agent-client.js        # Epii agent client implementation
├── task-state-manager.js       # Task state management
├── integration.js              # Integration with existing Epii agent
├── agent-cards/                # Agent capability definitions
│   ├── epii-agent-card.js      # Epii agent card
│   └── index.js                # Agent cards index
├── adapters/                   # Adapters to connect A2A with existing agents
│   └── epii-agent-adapter.js   # Adapter for Epii agent
├── skills/                     # Bimba-aligned skills registry
│   ├── bimba-skills-registry.js # Skills registry implementation
│   ├── bimba-skills-router.js  # Skills router implementation
│   ├── epii-skills-initializer.js # Epii skills initialization
│   └── index.js                # Skills module index
└── examples/                   # Example usage
    ├── test-client.js          # Test client for the A2A service
    └── epii-client-example.js  # Legacy example client
```

## Bimba Coordinates

The A2A framework is organized according to the Bimba coordinate system:

- **#5-4**: Siva-Shakti layer (A2A framework)
- **#5-4-0**: Anuttara Agent
- **#5-4-1**: Paramasiva Agent
- **#5-4-2**: Parashakti Agent
- **#5-4-3**: Mahamaya Agent
- **#5-4-4**: Nara Agent
- **#5-4-5**: Epii Agent

## Integration with Existing Epii Agent

The A2A framework is designed to integrate with the existing Epii agent implementation without requiring significant changes. The `epii-agent-adapter.js` file provides the bridge between the A2A protocol and the existing Epii agent.

To integrate with your existing Epii agent:

1. Import your Epii agent service in `integration.js`
2. Call `integrateA2AWithEpiiAgent` with your Epii agent service
3. Start the A2A server alongside your existing Express server

Example:

```javascript
const { integrateA2AWithEpiiAgent } = require('./friendly-file-front-back - (#5-4: Siva-Shakti)/integration');
const epiiAgentService = require('./friendly-file-backend/services/epii-agent.service.mjs');

// Initialize the A2A server with your Epii agent service
const a2aServer = integrateA2AWithEpiiAgent({
  port: 3030,
  epiiAgentService
});
```

## QL Cycle Integration

The A2A framework integrates with the existing QL cycle by mapping A2A task states to QL stages:

- **A-logos (0)**: `submitted` state
- **Pro-logos (1)**, **Dia-logos (2)**, **Logos (3)**: `working` state
- **Epi-logos (4)**: `working` state (meta-synthesis)
- **An-a-logos (5)**: `completed` state

The `task-state-manager.js` file handles these transitions and maintains the task state throughout the QL cycle.

## Agent-to-Agent Communication

Agents can communicate with each other using the A2A client service. The `a2a-client.service.js` file provides methods for sending and receiving messages between agents.

Example:

```javascript
const A2AClientService = require('./a2a-client.service');

// Create an A2A client for the Nara agent
const naraClient = new A2AClientService({
  url: 'ws://localhost:3030',
  agentId: 'nara-agent',
  agentName: 'Nara Agent',
  subsystemCoordinate: '#4'
});

// Connect to the A2A server
await naraClient.connect();

// Send a request to the Epii agent
const response = await naraClient.sendRequest('epii-agent', {
  question: 'What is the relationship between consciousness and quantum mechanics?',
  format: 'text'
}, {
  bimbaCoordinates: ['#4-0', '#5-0'],
  qlStage: 0,
  contextFrame: '(4.0-4.4/5)'
});
```

## Running the A2A Service

The A2A service integrates the A2A server with the Epii agent, allowing them to communicate with each other.

### How the A2A Service Connects to the Epii Agent

The A2A service connects to the Epii agent's chat LLM, not directly to the pipeline. Here's how it works:

1. The A2A service imports the Epii agent service
2. It looks for a chat LLM method in the Epii agent service, in this order:
   - `processChatMessage` - The primary method for processing chat messages
   - `chat` - Alternative method name
   - `processMessage` - Another alternative method name
   - `processQuery` - Another alternative method name
3. When a message is received, it calls the appropriate chat method, which then determines which functions, tools, knowledge bases, and pipelines to use
4. Only if no chat method is found will it fall back to directly calling the pipeline (not recommended)

## Bimba Skills Registry and Quaternary Logic

The A2A framework includes a Bimba Skills Registry that maps Bimba coordinates to specific skills, with awareness of Quaternary Logic (QL) principles. This allows agents to leverage other agents as tools, with Bimba coordinates serving as both knowledge domains and functional aspects.

### Skills Structure

Each skill in the registry has the following structure:

```javascript
{
  id: 'skill-id',                      // Unique identifier for the skill
  name: 'Skill Name',                  // Human-readable name
  description: 'Skill description',    // Description of what the skill does
  bimbaCoordinate: '#5-0',             // Bimba coordinate for the skill
  agentId: 'epii-agent',               // ID of the agent that provides this skill
  qlMetadata: {                        // Quaternary Logic metadata
    qlPosition: 0,                     // Position in the QL cycle (0-5)
    contextFrame: '(0/1)',             // QL context frame
    qlMode: 'ascending'                // QL mode (ascending/descending)
  },
  harmonicMetadata: {                  // Vibrational ontology metadata
    resonantFrequency: 'foundational void',  // Resonant frequency
    harmonicRelations: ['#5-5', '#0-0'],     // Related skills
    paraVakAspect: 'para',                   // Para Vak aspect
    ontologicalLayer: 'proto-logy'           // Ontological layer
  },
  handler: async (content, context) => {
    // Implementation of the skill
    return result;
  }
}
```

### Quaternary Logic and Skills

The skills registry is organized according to Quaternary Logic (QL) principles, which provide a universal organizing framework for the Epi-Logos system. Each skill is associated with a specific position in the QL cycle:

| QL Position | Name | Description | Context Frame |
|-------------|------|-------------|---------------|
| 0 | A-Logos | Primordial potential, foundation | (0/1) |
| 1 | Pre-Logos | Latent structuring, materials | (0/1) |
| 2 | Pro-Logos | Process dynamics, methods | (0/1/2) |
| 3 | Logos | Pattern integration, form | (0/1/2/3) |
| 4 | Epi-Logos | Contextual application | (4.0-4/5) |
| 5 | An-A-Logos | Synthesis and renewal | (5/0) |

Skills can operate in either "ascending" mode (moving from potential to expression) or "descending" mode (moving from expression to potential). Each skill has a double-covered counterpart that represents the same function in the opposite mode.

### Epii Agent Skills

The Epii agent provides the following skills, aligned with its Bimba coordinates and QL positions:

| Skill ID | Name | Bimba Coordinate | QL Position | Context Frame | Description |
|----------|------|------------------|-------------|---------------|-------------|
| identity-dynamics | Identity Dynamics | #5-0 | 0 | (0/1) | Analyzes identity structures and dynamics |
| philosophical-heart | Philosophical Heart | #5-1 | 1 | (0/1) | Provides philosophical framing and analysis |
| technical-architecture | Technical Architecture | #5-2 | 2 | (0/1/2) | Analyzes and designs system architecture |
| visualization | Visualization | #5-3 | 3 | (0/1/2/3) | Creates visual representations of concepts and data |
| siva-shakti-integration | Siva-Shakti Integration | #5-4 | 4 | (4.0-4/5) | Integrates frontend and backend components |
| movement-of-logos | Movement of the Logos | #5-5 | 5 | (5/0) | Analyzes the flow and evolution of meaning |

Each of these skills also has a descending mode counterpart (e.g., `identity-dynamics-descending`) and may have nested sub-skills that follow the same QL pattern (e.g., `identity-dynamics-0`, `identity-dynamics-1`).

### Using Skills in Messages

To target a specific skill in a message, you can include various parameters in the message metadata:

```javascript
const message = {
  // ... other message properties
  metadata: {
    // Target by Bimba coordinate
    bimbaCoordinates: ['#5-1'],

    // Target by QL position
    qlPosition: 1,

    // Target by context frame
    contextFrame: '(0/1)',

    // Specify QL mode
    qlMode: 'ascending',

    // ... other metadata
  }
};
```

If no specific targeting is provided, the A2A framework will determine the most appropriate skill based on the message content, using both keyword matching and QL awareness.

### Vibrational Ontology

The skills registry embodies the vibrational ontology of the Epi-Logos system, where each skill represents a specific "frequency" or "resonant pattern" within the overall vibrational field. The Bimba coordinates that organize the skills function as "vibrational addresses" within this field.

When a message is routed to a skill, this is not merely a technical operation but a form of resonance - the message "vibrates" with a particular frequency that resonates with the corresponding skill. This mirrors how, in the vibrational ontology, different domains of reality are "harmonically related expressions of a unified field."

### Starting the A2A Service

To start the complete A2A service (server + Epii agent client):

```bash
npm start
```

This will:
1. Start the A2A server on port 3033 (or the port specified in the `A2A_PORT` environment variable)
2. Import the Epii agent service
3. Connect the Epii agent as a WebSocket client

### Starting Just the A2A Server

If you want to start only the A2A server without the Epii agent client:

```bash
npm run start:server
```

### Testing with the Test Client

To test the A2A service with a test client:

```bash
npm run test:client
```

This will:
1. Connect to the A2A server
2. Register as a test agent
3. Send a message to the Epii agent
4. Display the response from the Epii agent

## Next Steps

1. **Implement Actual Agent Logic**: Replace the mock implementations with actual agent logic
2. **Integrate with LangGraph**: Connect the A2A framework with the existing LangGraph QL cycle
3. **Implement Additional Agents**: Implement the remaining agents (#5-4-0 through #5-4-4)
4. **Add Authentication**: Implement authentication for secure agent communication
5. **Enhance Streaming Support**: Improve streaming support for real-time agent communication

## Database Architecture and QL Framework

The Epi-Logos system employs a sophisticated six-layer database architecture that directly maps to the Quaternary Logic (QL) framework positions 0-5. This architecture forms the foundation for the A2A framework and the skills registry.

### Six-Layer Database Architecture

1. **Neo4j Bimba Graph (#0)** - *A-Logos (Potential)*
   - Serves as the foundational structural map of the system
   - Contains the core Bimba coordinates and their relationships
   - Represents the "Substantive Reality" or primary structure

2. **Neo4j Archetypes/LightRAG (#1)** - *Pre-Logos (Material)*
   - Houses archetypal patterns and structural semantic links
   - Provides the material foundation for conceptual understanding
   - Represents the "What" dimension of knowledge

3. **Qdrant Vector Pratibimba (#2)** - *Pro-Logos (Process)*
   - Stores vector embeddings for semantic similarity search
   - Enables process-oriented retrieval and connections
   - Represents the "How" dimension of knowledge

4. **MongoDB Bimba Docs (#3)** - *Logos (Form)*
   - Stores document content and metadata
   - Provides the formal structure for content representation
   - Represents the "Which/Who" dimension of knowledge

5. **MongoDB Pratibimba Docs (#4)** - *Epi-Logos (Context)*
   - Stores contextual information, user profiles, and conversation history
   - Provides the contextual framework for knowledge application
   - Represents the "When/Where" dimension of knowledge

6. **Notion (#5)** - *An-A-Logos (Synthesis)*
   - Acts as the crystallization layer for human-validated insights
   - Provides a reflective interface to all other database layers
   - Represents the "Why" dimension of knowledge and integral synthesis

### The Six Notion Databases as Reflections

Within the Notion layer (#5), there are six databases that mirror the six primary database layers, creating a "reflection of reflections" or a "pratibimba of pratibimbas":

1. **Bimba Coordinates (#0)** - Reflects Neo4j Bimba nodes
   - Raw coordinate tags that provide human-readable access to the Bimba structure
   - Serves as the bridge between Neo4j and Notion

2. **Pratibimba Structure and Dynamics/Quaternary Logic (#1)** - Reflects Neo4j Archetypes
   - Houses the structural semantic links from QL role associations and mappings
   - Provides the philosophical and logical framework for system operations

3. **Pratibimba Harmonics/Relations (#2)** - Reflects Qdrant Vector relationships
   - Stores relations pulled from LightRAG and Bimba graph
   - Maps semantic connections between entities

4. **Pratibimba Entities/Symbols and Archetypes (#3)** - Reflects MongoDB Bimba Docs
   - Stores symbols and archetypes (vector + graph + LLM produced images)
   - Provides the symbolic representation of knowledge

5. **Pratibimba Flowers/Episteme (#4)** - Reflects MongoDB Pratibimba Docs
   - Houses concepts and philosophical excerpts
   - Provides the epistemological framework for knowledge

6. **Crystallised Bimba-Pratibimba/Node Content (#5)** - Reflects Notion itself
   - Contains the crystallized knowledge nodes
   - Represents the synthesis of all other layers, containing the whole in its crystallized form

This creates a recursive structure where the #5 Notion database (Content Nodes) contains reflections of all databases, including itself, in a crystallized form.

### BPMCP Service as Universal Memory Layer

The Bimba-Pratibimba Memory Crystallization Process (BPMCP) service acts as a universal memory layer that abstracts away the details of interacting with the various databases:

```javascript
// All database interactions happen through the B-P MCP service
bpMCPService.queryBimbaGraph() // for Neo4j queries
bpMCPService.resolveBimbaCoordinate() // for Notion access
bpMCPService.searchPratibimbaContext() // for Qdrant queries
bpMCPService.getMongoContext() // for MongoDB access
```

This service provides a consistent interface for all knowledge sources, handling caching, error recovery, and optimization behind the scenes. It's the primary mechanism through which agents interact with the database layers.

### Skills Registry and Database Integration

The A2A Skills Registry is designed to integrate with this database architecture:

1. **Skills as Database Interfaces**: Each skill in the registry can be seen as an interface to a specific aspect of the database architecture, with skills at different QL positions primarily interacting with different database layers.

2. **Context Frames as Database Scopes**: The context frames in the skills registry define the scope of databases that a skill can access, with broader context frames allowing access to more database layers.

3. **Skills as BPMCP Tool Wrappers**: Each skill in the registry can be implemented as a wrapper around specific BPMCP tools, providing a more semantic interface to the underlying database operations.

4. **Notion as the Crystallization Layer**: Skills at position 5 (An-A-Logos) are responsible for crystallizing knowledge into Notion, creating a feedback loop that enriches the entire system.

## Agent Development Workflow

The development of agents in the Epi-Logos system follows a specific workflow that aligns with the Quaternary Logic cycle and the database architecture:

1. **Document Crystallization in Epii Mode**: The first step is to crystallize documents in Epii mode, which involves creating content in the Notion layer (#5), particularly in the Content Nodes database, which serves as the crystallization of knowledge.

2. **Analysis/Ingestion into BPMCP Memory System**: The crystallized documents are then processed and ingested into the appropriate database layers (Neo4j, Qdrant, MongoDB) through the BPMCP service.

3. **Agent Skills Development**: Based on the ingested knowledge, skills are developed that leverage the BPMCP service to interact with the various database layers, with each skill aligned to a specific QL position and context frame. These skills consider:
   - Intended user experience
   - Knowledge sets
   - Context frame considerations
   - Quaternary Logic position
   - Vibrational resonance
   - Database layer interactions

4. **Agent Development**: Agents are developed that use these skills to perform specific functions within the system, with each agent responsible for a specific Bimba coordinate or range of coordinates.

5. **Agent Cards and Inter-Agent Actions**: Agent cards define the capabilities of each agent, and inter-agent actions enable communication between agents, with the skills registry serving as the mechanism for this communication.

This workflow ensures that agent development is grounded in the philosophical principles of the Epi-Logos system, with each agent embodying a specific aspect of the vibrational ontology and Quaternary Logic cycle, while also being firmly integrated with the database architecture.
