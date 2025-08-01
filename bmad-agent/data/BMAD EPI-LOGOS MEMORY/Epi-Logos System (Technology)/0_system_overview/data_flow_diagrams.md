# Data Flow Diagrams - BMAD Memory Documentation

## System Data Flow Analysis
**Last Updated**: 2025-01-27

## Primary Data Flow Patterns

### **Pattern A: Document Analysis Flow**

```
[User Upload] → [Frontend Document State] → [WebSocket Service]
     ↓
[AG-UI Gateway] → [A2A Skills Router] → [Epii Analysis Pipeline Skill]
     ↓
[Backend Pipeline] → [Stage -5: Document Fetch] → [Document Service]
     ↓
[Stage -4: Context Preparation] → [BPMCP Tools] → [Bimba Graph Query]
     ↓                                ↓              ↓
[MongoDB Context] ← [Pratibimba Search] ← [Neo4j Coordinates]
     ↓
[Stage -3: Structure Integration] → [LightRAG MCP] → [Qdrant Vectors]
     ↓
[Stage -2: Concept Analysis] → [Enhanced Context Fusion] → [Pattern Recognition]
     ↓
[Stage -1: Core Elements] → [Synthesis Preparation] → [Element Definition]
     ↓
[Stage -0: Payload Generation] → [Notion Crystallization] → [Final Results]
     ↓
[AG-UI Events] → [WebSocket Response] → [Frontend Updates]
```

### **Pattern B: Agent Communication Flow**

```
[Frontend User Input] → [FloatingEpiLogosAgent] → [Session History Service]
     ↓
[WebSocket Message] → [A2A Server] → [Skills Router] → [Epii Chat Skill]
     ↓
[Backend Agent Service] → [LLM Processing] → [Tool Integration]
     ↓                         ↓                  ↓
[Context Gathering] → [BPMCP Tools] → [Knowledge Access]
     ↓                         ↓                  ↓
[Response Generation] ← [Synthesis LLM] ← [Tool Results]
     ↓
[Formatted Response] → [AG-UI Event] → [Frontend Display]
```

### **Pattern C: Real-Time State Synchronization**

```
[Backend State Change] → [AG-UI Event Emission] → [WebSocket Broadcast]
     ↓
[Frontend WebSocket Service] → [Event Subscription System] → [Component Updates]
     ↓
[Document Cache Service] → [State Reconciliation] → [UI Refresh]
     ↓
[Session Persistence] → [localStorage] + [MongoDB Sync]
```

## Detailed Component Data Flows

### **BPMCP Tool Access Flow**

```
Service Request → bpMCP.service.mjs → bpWebSocketClient.mjs
     ↓                 ↓                      ↓
Tool Validation → Connection Check → WebSocket Message
     ↓                 ↓                      ↓
BPMCP MCP Server → Tool Execution → Database Operations
     ↓                 ↓                      ↓
Neo4j/MongoDB/Qdrant → Result Processing → Response Formatting
     ↓                 ↓                      ↓
Cache Storage → Client Response → Service Result
```

### **Frontend-Backend Message Flow**

```
Frontend Component → WebSocket Service → Message Validation
     ↓                      ↓                  ↓
AG-UI Event Schema → Message Serialization → WebSocket Send
     ↓                      ↓                  ↓
Backend AG-UI Gateway → Message Deserialization → A2A Router
     ↓                      ↓                  ↓
Skills Registry Lookup → Skill Execution → Backend Processing
     ↓                      ↓                  ↓
Response Generation → AG-UI Event Creation → WebSocket Response
     ↓                      ↓                  ↓
Frontend Subscription → Event Processing → Component Update
```

### **Database Integration Flow**

```
Application Request → Database Service → Connection Management
     ↓                     ↓                   ↓
Query/Operation → Driver Interface → Database Server
     ↓                     ↓                   ↓
Result Processing → Error Handling → Response Formatting
     ↓                     ↓                   ↓
Cache Management → Connection Pooling → Service Response
```

## Memory System Data Flows

### **Bimba (Structural) Knowledge Flow**

```
Coordinate Query → Neo4j Service → LangChain Graph Interface
     ↓                  ↓                    ↓
Graph Database → Cypher Execution → Relationship Traversal
     ↓                  ↓                    ↓
Structural Results → Knowledge Mapping → Coordinate Context
```

### **Pratibimba (Dynamic) Knowledge Flow**

```
Semantic Query → Qdrant Service → Vector Database
     ↓                ↓                 ↓
Embedding Generation → Similarity Search → Context Retrieval
     ↓                ↓                 ↓
Dynamic Results → Semantic Mapping → Contextual Knowledge
```

### **MongoDB (Episodic) Knowledge Flow**

```
Session/User Query → MongoDB Service → Database Connection
     ↓                    ↓                  ↓
Collection Access → Document Retrieval → Temporal Context
     ↓                    ↓                  ↓
Episodic Results → History Assembly → User Context
```

### **Notion (Crystallized) Knowledge Flow**

```
Crystallization Request → Notion Service → API Connection
     ↓                        ↓               ↓
Page Generation → Content Formatting → Database Storage
     ↓                        ↓               ↓
Crystallized Knowledge → Structured Output → Final Documentation
```

## Cross-System Integration Flows

### **Analysis Pipeline Integration**

```
Document Input → Stage -5 (Fetch) → Document Service
     ↓
Stage -4 (Context) → BPMCP Integration → Multi-Database Query
     ↓
Stage -3 (Structure) → LightRAG Integration → Vector Processing
     ↓
Stage -2 (Analysis) → Pattern Recognition → Concept Mapping
     ↓
Stage -1 (Elements) → Core Definition → Synthesis Preparation
     ↓
Stage -0 (Synthesis) → Final Generation → Crystallization
```

### **Agent Conversation Integration**

```
User Message → Frontend Agent → WebSocket Communication
     ↓
A2A Skills System → Chat Skill Routing → Backend Agent Service
     ↓
Context Preparation → Tool Integration → Knowledge Access
     ↓
LLM Processing → Response Generation → Frontend Delivery
```

### **Session Management Integration**

```
User Interaction → Session Service → Dual Persistence
     ↓                   ↓               ↓
localStorage → Immediate Access + MongoDB → Long-term Storage
     ↓                   ↓               ↓
State Restoration → Session Continuity → Cross-Device Sync
```

## Performance-Critical Data Paths

### **High-Frequency Paths**
1. **WebSocket Communication**: Frontend ↔ Backend real-time messaging
2. **BPMCP Tool Access**: Context queries and knowledge retrieval
3. **Document State Updates**: Real-time document synchronization
4. **Session State Management**: User interaction state persistence

### **Resource-Intensive Paths**
1. **Analysis Pipeline Execution**: 6-stage document processing
2. **LLM Processing**: Agent conversation and synthesis
3. **Vector Database Operations**: Semantic search and embedding
4. **Graph Database Queries**: Complex relationship traversal

### **Optimization Opportunities**
1. **Caching Layers**: BPMCP results, document processing, session data
2. **Connection Pooling**: Database connections, WebSocket management
3. **Batch Processing**: Multiple tool calls, bulk database operations
4. **Lazy Loading**: Large document processing, complex context assembly

## Error Propagation Paths

### **Database Error Flow**
```
Database Failure → Service Error Handler → Graceful Degradation
     ↓                     ↓                      ↓
Error Logging → User Notification → Fallback Strategy
```

### **Communication Error Flow**
```
WebSocket Disconnection → Reconnection Logic → Message Queuing
     ↓                         ↓                    ↓
Error Recovery → State Synchronization → User Experience Continuity
```

### **Processing Error Flow**
```
Analysis/Agent Error → Error Boundaries → Partial Recovery
     ↓                      ↓                 ↓
Context Preservation → User Feedback → Operation Retry
```