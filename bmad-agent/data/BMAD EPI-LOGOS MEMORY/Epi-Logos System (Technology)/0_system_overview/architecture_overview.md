# Architecture Overview - BMAD Memory Documentation

## System Architecture Overview
**Last Updated**: 2025-01-27

## High-Level System Design

### Three-Tier Architecture
The Epi-Logos system implements a sophisticated three-tier architecture that mirrors the Bimba coordinate system's philosophical structure:

#### 1. **5-2 Siva-Backend** - Universal Database & Subsystem Logic
- **Universal Database Layer**: Centralized access to Neo4j, MongoDB, Qdrant, Notion
- **MCP Server Integration**: BPMCP (28+ tools), LightRAG, Graphiti for knowledge processing
- **Subsystem-Specific Logic**: Six expert agents (0-Anuttara through 5-Epii) with specialized capabilities
- **QL Cycle Orchestration**: Quaternal Logic processing pipelines

#### 2. **5-3 Shakti-Frontend** - User Interface & Visualization
- **Subsystem Modes**: Six specialized interfaces (Meta2D, Meta3D, Document Canvas, Oracle, etc.)
- **Universal Agent Interface**: Floating Epi-Logos Agent accessible from any mode
- **Context Awareness**: Real-time document state and session management
- **Dynamic UI**: Generative components based on agent responses

#### 3. **5-4 Siva-Shakti-Back2Front** - Communication & Skills
- **A2A Protocol**: Agent-to-Agent communication infrastructure
- **AG-UI System**: Real-time frontend-agent communication via WebSocket
- **Skills Registry**: Coordinate-based skill organization and routing
- **Agent Adapters**: Interface layer between agents and communication systems

## Core Integration Patterns

### Data Flow Architecture
```
Frontend (UI) → AG-UI Events → A2A Router → Skills → Backend Services → MCP Tools → Databases
                    ↑                                                                      ↓
                WebSocket ←←←←←←←←←←←←←←← Response Flow ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### Memory System Integration
- **Bimba (Structural)**: Neo4j graph for coordinate-based knowledge organization
- **Pratibimba (Dynamic)**: Qdrant vector database for semantic search and context
- **MongoDB (Episodic)**: User conversations, sessions, and temporal data
- **Notion (Crystallized)**: Processed insights and knowledge crystallization

### Agent Communication Flow
1. **Frontend**: User interaction in any subsystem mode
2. **AG-UI Gateway**: Context-aware routing based on active mode and document state
3. **A2A Router**: Routes to appropriate subsystem skill based on Bimba coordinates
4. **Skills Layer**: Agent "personality skin" with specific conversational identity
5. **Backend Services**: Functional processing and database operations
6. **MCP Tools**: Specialized knowledge operations and memory access

## Philosophical Architecture Alignment

### Bimba Coordinate System Integration
- **#0 Anuttara**: Foundational void, meta-patterns, Meta2D visualization
- **#1 Paramasiva**: Quaternal Logic, algebraic topology, Meta3D visualization
- **#2 Parashakti**: Harmonic experientiality, developer console
- **#3 Mahamaya**: Symbolic imagination, transformation interfaces
- **#4 Nara**: Individualized cognition, oracle and identity management
- **#5 Epii**: Self-awareness, document analysis and crystallization

### Holographic Subsystem Architecture
Each subsystem contains its complete domain holographically:
- **Complete Internal Structure**: Each subsystem (0-5) has its own 0-5 internal organization
- **Domain Expertise**: Features naturally belong to their epistemic subsystem
- **Universal Orchestration**: Epi-Logos Agent operates BETWEEN subsystems, not within them
- **Preserved Integrity**: Each subsystem maintains specialized expertise and internal coherence

## Technology Stack Integration

### Backend Technologies
- **Node.js/Express**: Core backend framework
- **Neo4j**: Graph database for Bimba structural knowledge
- **MongoDB**: Document database for episodic memory
- **Qdrant**: Vector database for Pratibimba semantic search
- **Notion API**: Knowledge crystallization and external integration

### Frontend Technologies
- **React/TypeScript**: Modern frontend framework with type safety
- **Three.js**: 3D visualization for Meta3D (Paramasiva mode)
- **D3.js**: 2D visualization for Meta2D (Anuttara mode)
- **WebSocket**: Real-time AG-UI communication
- **Tailwind CSS**: Utility-first styling framework

### Communication Technologies
- **WebSocket Server**: A2A communication hub
- **MCP Protocol**: Model Context Protocol for agent-tool integration
- **AG-UI Events**: Custom event system for frontend-agent communication
- **JSON Schema**: Message validation and type safety

## Scalability & Performance Considerations

### Horizontal Scaling Points
- **MCP Servers**: Can be distributed across multiple instances
- **Database Layer**: Each database type can scale independently
- **Skills Processing**: Stateless skills enable easy horizontal scaling
- **Frontend Distribution**: Static assets and CDN-friendly architecture

### Performance Optimizations
- **Document Caching**: In-memory caching at multiple layers
- **Vector Search**: Optimized Qdrant queries with coordinate filtering
- **Connection Pooling**: Database connection management
- **Lazy Loading**: Frontend component and route splitting

### Future Architecture Evolution
- **Microservices Migration**: Backend services can be extracted to independent services
- **Event Sourcing**: Potential migration to event-driven architecture
- **CQRS Implementation**: Command-Query Responsibility Segregation for complex operations
- **GraphQL Gateway**: Unified API layer over microservices