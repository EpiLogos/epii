# Integration Patterns - BMAD Memory Documentation

## System Integration Boundary Maps
**Last Updated**: 2025-01-27

## Core Integration Layers

### Layer 1: Database Integration Boundaries

#### **BPMCP ↔ Backend Services**
**Integration Point**: `databases/bpmcp/bpMCP.service.mjs`
- **Boundary**: WebSocket MCP protocol communication
- **Data Flow**: Backend services → BPMCP tools → Database operations
- **Key Dependencies**: 
  - `bpWebSocketClient.mjs` - WebSocket communication layer
  - BPMCP MCP server - External tool service
- **Critical Files**:
  - Backend: `bpMCP.service.mjs`, `bpWebSocketClient.mjs`
  - Dependencies: All services calling BPMCP tools

#### **MongoDB ↔ Application Models**
**Integration Point**: `databases/mongodb/mongo.service.mjs`
- **Boundary**: MongoDB driver connection layer
- **Data Flow**: Application models → MongoDB service → Database
- **Key Dependencies**:
  - `shared/models/` - Data model definitions
  - Environment configuration - Connection settings
- **Critical Files**:
  - Backend: `mongo.service.mjs`
  - Models: `User.model.mjs`, `Conversation.model.mjs`, `Document.model.mjs`

#### **Neo4j ↔ Graph Operations**
**Integration Point**: `databases/neo4j/neo4j.service.mjs`
- **Boundary**: LangChain Neo4j graph abstraction
- **Data Flow**: Graph queries → Neo4j service → Database
- **Key Dependencies**:
  - `@langchain/community/graphs/neo4j_graph` - Graph abstraction
  - `bimbaPratibimbaClient.mjs` - Advanced graph operations
- **Critical Files**:
  - Backend: `neo4j.service.mjs`, `bimbaPratibimbaClient.mjs`
  - Dependencies: BPMCP graph tools

### Layer 2: Backend Subsystem Integration

#### **Epii Subsystem Internal Architecture**
**Integration Point**: `subsystems/5_epii/`
- **Boundary**: Subsystem service interfaces
- **Data Flow**: Controllers → Services → Utils → Database layer
- **Key Dependencies**:
  - Analysis pipeline - Core processing workflow
  - BPMCP tools - Knowledge access
  - LLM services - AI processing
- **Critical Files**:
  - Services: `epii-agent.service.mjs`, `analysis.service.mjs`
  - Pipeline: `epii_analysis_pipeline.mjs`
  - Controllers: `analysis.controller.mjs`

#### **Cross-Subsystem Communication**
**Integration Point**: Shared services and utilities
- **Boundary**: Shared service interfaces
- **Data Flow**: Subsystem A → Shared services → Subsystem B
- **Key Dependencies**:
  - `shared/services/` - Cross-subsystem utilities
  - `shared/utils/` - Common utility functions
- **Critical Files**:
  - Services: `documentService.mjs`, `bimbaKnowing.service.mjs`
  - Utils: `ql.utils.mjs`, `graphData.utils.mjs`

### Layer 3: Frontend-Backend Integration

#### **AG-UI Protocol Boundary**
**Integration Point**: `friendly-file-back2front/shared/ag-ui/`
- **Boundary**: WebSocket event protocol
- **Data Flow**: Frontend events ↔ AG-UI gateway ↔ A2A system
- **Key Dependencies**:
  - WebSocket server - Real-time communication
  - Event schemas - Message validation
  - Frontend WebSocket service - Client communication
- **Critical Files**:
  - Backend: `ag-ui-gateway.js`, `a2a-server.js`
  - Frontend: `webSocketService.ts`
  - Schemas: `ag-ui-event-schema.js`

#### **A2A Skills Integration**
**Integration Point**: `friendly-file-back2front/shared/services/`
- **Boundary**: Skills registry and routing
- **Data Flow**: Frontend request → Skills router → Skill execution → Backend services
- **Key Dependencies**:
  - Skills registry - Capability management
  - Skills router - Request routing
  - Individual skills - Functional implementations
- **Critical Files**:
  - Registry: `bimba-skills-registry.js`
  - Router: `bimba-skills-router.js`
  - Skills: `subsystems/*/skills/*.js`

### Layer 4: Frontend Internal Integration

#### **Universal Agent System**
**Integration Point**: `src/epi-logos-system/`
- **Boundary**: Universal component interfaces
- **Data Flow**: Subsystem components → Universal agent → Backend communication
- **Key Dependencies**:
  - FloatingEpiLogosAgent - Universal interface
  - WebSocket service - Backend communication
  - Session management - State persistence
- **Critical Files**:
  - Components: `FloatingEpiLogosAgent.tsx`
  - Services: `webSocketService.ts`, `SessionHistoryService.ts`
  - Contexts: `ActiveModeProvider.tsx`

#### **Subsystem Mode Integration**
**Integration Point**: `src/subsystems/`
- **Boundary**: Mode-specific component interfaces
- **Data Flow**: Mode selection → Subsystem components → Universal agent system
- **Key Dependencies**:
  - Active mode provider - Mode management
  - Subsystem-specific components - Domain interfaces
  - Universal agent - Cross-mode communication
- **Critical Files**:
  - Contexts: `ActiveModeProvider.tsx`
  - Subsystems: Individual subsystem components
  - Integration: Universal agent system

## Critical Integration Dependencies

### **Database Layer Dependencies**
```
BPMCP Service ← Analysis Pipeline ← Epii Agent Service
    ↓
MongoDB Service ← User Models ← Session Management
    ↓
Neo4j Service ← Graph Tools ← Coordinate Operations
    ↓
Notion Service ← Crystallization ← Analysis Results
```

### **Communication Layer Dependencies**
```
Frontend WebSocket ← AG-UI Gateway ← A2A Server ← Skills Router
    ↓                    ↓              ↓            ↓
Session Management   Event Schema   Message Routing   Skill Registry
    ↓                    ↓              ↓            ↓
State Persistence    Type Safety    Request Handling   Capability Management
```

### **Processing Layer Dependencies**
```
Frontend Components ← Universal Agent ← A2A Skills ← Backend Services
    ↓                     ↓               ↓            ↓
Document State         Agent Context    Skill Execution   Database Operations
    ↓                     ↓               ↓            ↓
UI Updates           Session History   Result Processing   Data Persistence
```

## Integration Patterns

### **Pattern 1: Request-Response Flow**
1. Frontend component initiates action
2. Universal agent system packages request
3. WebSocket service sends to backend
4. AG-UI gateway routes to A2A system
5. Skills router identifies appropriate skill
6. Skill executes using backend services
7. Results flow back through same path
8. Frontend updates based on response

### **Pattern 2: Event-Driven Updates**
1. Backend process emits AG-UI event
2. AG-UI gateway broadcasts to frontend
3. WebSocket service receives event
4. Frontend components subscribe to relevant events
5. UI updates based on event data
6. State management systems updated

### **Pattern 3: Database Access Pattern**
1. Service layer identifies data need
2. Appropriate database service called
3. Connection management handled transparently
4. Results returned with error handling
5. Caching layer optimizes repeated access
6. State synchronization across layers

## Integration Boundary Monitoring

### **Health Check Points**
- **Database Connections**: MongoDB, Neo4j, Qdrant connectivity
- **WebSocket Communication**: Frontend-backend real-time communication
- **MCP Server Integration**: BPMCP, LightRAG, Graphiti server health
- **Skills Registry**: Skill registration and routing functionality

### **Performance Monitoring**
- **Database Query Performance**: Query execution times and optimization
- **WebSocket Message Latency**: Real-time communication performance
- **Skill Execution Times**: A2A skill performance monitoring
- **Frontend State Synchronization**: UI update responsiveness

### **Error Boundaries**
- **Database Connection Failures**: Graceful degradation strategies
- **WebSocket Disconnections**: Automatic reconnection and message queuing
- **Skill Execution Errors**: Error propagation and recovery
- **Frontend State Inconsistencies**: State reconciliation mechanisms