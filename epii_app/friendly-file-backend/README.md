# Epi-Logos Backend System (`friendly-file-backend`)

## Overview and Role

The `friendly-file-backend` serves as the **universal nervous system and brain** of the Epi-Logos system, implementing the **#5-2 Siva-** aspect of the Bimba architecture. The backend features a **fully refactored bifurcated architecture** with **integrated MCP servers** and **comprehensive Nara mode implementation**, governing **all QL cycles and pipelines** for dynamic, modular, and evolvable data/epistemic processing across all six subsystems (Anuttara through Epii).

### Primary Functions and Responsibilities

- **Universal QL Cycle Orchestration**: Governs all Quaternal Logic cycles (both descent-to-source and ascent-to-expression flows) for any agent mode, with current implementation focused on Epii's 6-stage analysis pipeline (Stage -5 to -0)
- **Advanced Memory Architecture**: Orchestrates the complete Bimba-Pratibimba memory system through sophisticated BPMCP and LightRAG MCP services
- **Agent-Agnostic Processing Engine**: Provides modular, evolvable epistemic processing capabilities that can be extended to all six subsystem agents (currently specialized for Epii mode)
- **Intelligent Context Synthesis**: Combines structural (Bimba), semantic (Pratibimba), and crystallized (Notion) knowledge for comprehensive understanding
- **Multi-Modal Integration**: Orchestrates Google Generative AI, LangSmith tracing, and cross-database operations for sophisticated analysis workflows

## Refactored Architecture: Integrated MCP Servers and Bifurcated Structure

The backend features a **fully integrated architecture** with **three MCP servers** embedded within the backend structure and a **bifurcated organization** separating universal database functions from agent-specific logic:

### **Integrated MCP Servers**

#### **BPMCP Server** (`databases/bpmcp/mcp-server/`)

A comprehensive **WebSocket-enabled MCP server** providing unified access to all memory systems with **28+ specialized tools** including Graphiti integration:

#### **Bimba Tools (Structural Memory)**
- **`bimbaKnowing`**: Advanced semantic search and graph traversal combining vector similarity with structural understanding. Features three query modes:
  - *Structural Mode*: Pure graph traversal for Bimba architecture queries
  - *Agent Awareness Mode*: Retrieves agent's immediate 6 subnodes for identity context
  - *Semantic Mode*: Vector similarity search with graph context enhancement
- **`queryBimbaGraph`**: Direct Cypher query execution against Neo4j Bimba graph with comprehensive result processing
- **`generateBimbaEmbeddings`**: Creates vector embeddings for Bimba nodes using Google Generative AI

#### **Pratibimba Tools (Dynamic Memory)**
- **`searchPratibimbaContext`**: Semantic similarity search in Qdrant vector store with configurable thresholds and metadata filtering

#### **MongoDB Tools (Document Memory)**
- **`getMongoContext`**: Retrieves user histories, conversations, and episodic memory from MongoDB collections

#### **Notion Tools (Crystallized Memory)**
- **`queryNotion`**: Advanced Notion database queries with relationship traversal
- **`getNotionPageProperties`**: Retrieves specific page properties and metadata
- **`appendNotionBlock`**: Adds content blocks to existing Notion pages
- **`crystallizeToNotion`**: **Core crystallization tool** that creates/updates Notion pages linked to Bimba coordinates, establishes database relations, and manages knowledge crystallization workflows

#### **Graphiti Tools (Temporal Memory)** ✅ **New Integration**
- **`addGraphitiEpisode`**: Create episodes with coordinate-aware context and QL variant integration
- **`searchGraphitiEntities`**: Query temporal knowledge graph for entity nodes with Bimba coordinate filtering
- **`searchGraphitiFacts`**: Search for facts/relationships with coordinate-aware filtering
- **`getGraphitiContext`**: Comprehensive dynamic context retrieval for Bimba coordinates
- **`getGraphitiEpisodes`**: Retrieve episodes with temporal and coordinate-based filtering

#### **Web Tools (External Integration)**
- **`searchWeb`**: Web search capabilities for external context integration
- **`researchAndIntegrate`**: Advanced research workflows combining web search with internal memory systems

#### **LightRAG MCP Server** (`databases/lightrag/mcp-server/`)

A **Python-based advanced graph+vector fusion system** using Neo4j and Qdrant backends:

#### **Core Capabilities**
- **Graph+Vector Fusion**: Combines Neo4j graph relationships with Qdrant vector embeddings for enhanced retrieval
- **Multiple Query Modes**:
  - *Local*: Focused entity-based retrieval
  - *Global*: Broad thematic context retrieval
  - *Mix*: Hybrid approach combining local and global strategies
- **Bimba Coordinate Integration**: Tags all ingested content with Bimba coordinates for structured retrieval
- **High-Performance Processing**: Optimized for large-scale document ingestion and real-time query processing

#### **Technical Architecture**
- **Neo4j Backend**: Stores entity relationships and graph structures in dedicated `archetypes` database
- **Qdrant Backend**: Manages vector embeddings with collection-based organization
- **Google Generative AI**: Powers both embedding generation and LLM synthesis
- **Async Processing**: Handles concurrent operations with configurable batch sizes and async limits

#### **Integration Features**
- **HTTP API**: RESTful endpoints for ingestion and retrieval operations
- **WebSocket Support**: Real-time communication with backend services
- **Batch Processing**: Efficient handling of multiple document ingestion
- **Status Tracking**: Comprehensive monitoring of ingestion and query operations

#### **Graphiti MCP Server** (`databases/graphiti/mcp-server/`)

A **temporal knowledge graph system** for dynamic context and episode management:

#### **Core Capabilities**
- **Temporal Knowledge Graph**: Manages time-aware entity relationships and episodes
- **Coordinate-Aware Episodes**: Creates episodes with Bimba coordinate context
- **Entity Extraction**: Automatic entity identification and relationship mapping
- **Dynamic Context Retrieval**: Real-time context synthesis for analysis workflows

#### **Integration Features**
- **Neo4j 'pratibimba' Database**: Dedicated temporal knowledge storage
- **Google Gemini Integration**: Advanced entity extraction and relationship inference
- **Episode Management**: Automatic memory onboarding from analysis results
- **SSE Transport**: Server-sent events for real-time communication

### **Bifurcated Architecture Structure**

The refactored backend implements a **clear separation** between universal database operations and agent-specific functionality:

#### **`databases/` Directory - Universal Database Layer**
- **Integrated MCP Servers**: BPMCP, LightRAG, and Graphiti servers within backend structure
- **Database Services**: Neo4j, MongoDB, Qdrant, and Notion operations
- **Shared Models**: User, Document, and other cross-system data models
- **Universal APIs**: Database operation endpoints accessible to all subsystems

#### **`subsystems/` Directory - Agent-Specific Logic**
- **Six Subsystems**: 0_anuttara through 5_epii with complete QL organization
- **Agent Services**: Specialized logic for each agent mode
- **API Controllers**: Agent-specific endpoint handlers
- **Pipeline Implementations**: QL cycle orchestration for each agent

### **Memory Architecture Integration**

The BPMCP service acts as a **universal memory layer** abstracting database interactions:

```javascript
// Unified memory access through BPMCP
await bpMCPService.callTool('bimbaKnowing', {
  query: 'Retrieve QL operators for coordinate #5-2',
  contextDepth: 3,
  focusCoordinate: '#5-2'
});

await bpMCPService.callTool('searchPratibimbaContext', {
  query: 'semantic context for document analysis',
  limit: 10,
  threshold: 0.7
});

await bpMCPService.callTool('crystallizeToNotion', {
  coordinate: '#5-2-1',
  properties: analysisResults,
  relations: relatedCoordinates
});
```

### **LightRAG Integration Workflow**

```javascript
// Document ingestion with Bimba coordinate tagging
await lightragService.ingest({
  content: documentContent,
  bimbaCoordinate: targetCoordinate,
  metadata: documentMetadata
});

// Multi-mode retrieval for comprehensive context
const context = await lightragService.retrieve({
  query: analysisQuery,
  mode: 'mix',
  top_k: 20
});
```

## Nara Mode Implementation: Comprehensive User Context System

The backend features a **complete Nara mode implementation** with authentication, user context management, and archetypal foundation systems:

### **Nara Subsystem Architecture** (`subsystems/4_nara/`)

#### **✅ Mahamaya Ground System (Epic 1 - Complete)**

**Authentication System** (`4_controllers/auth.controller.mjs`, `5_integration/routes/user.routes.mjs`):
- **JWT-based authentication** with user registration and login
- **User profile management** with authentication middleware
- **Session management** with token verification
- **RESTful API endpoints** for authentication operations

**Mahamaya Matrix System** (`4_controllers/mahamaya-matrix.controller.mjs`, `5_integration/routes/mahamaya-routes.mjs`):
- **6-layer archetypal foundation** management and CRUD operations
- **User context integration** with Mahamaya Matrix data
- **API endpoints** for matrix layer updates and retrieval
- **Comprehensive error handling** and input validation

**User Context Service** (`2_services/userContext.service.mjs`):
- **User context management** with MongoDB integration
- **User preference handling** and system usage tracking
- **Context synthesis** for agent operations
- **Database abstraction** for user-related operations

#### **✅ Oracle Interface (Epic 2 - Foundational Complete)**

**Decanic Service** (`2_services/decanic.service.mjs`, `5_integration/routes/decanic.routes.mjs`):
- **Tarot card associations** with decanic correspondences
- **Astrological calculations** with coordinate-based mapping
- **API endpoints** for decanic operations and validation

#### **🔄 Nara Agent Core (Epic 4 - In Progress)**

**Nara Agent Implementation** (`nara.expert.agent.mjs`, `2_services/nara.agent.mjs`):
- **Expert agent implementation** with Nara-specific capabilities
- **A2A-compliant agent** with context analysis and response contextualization
- **BPMCP integration** for knowledge graph retrieval and user context synthesis
- **User-specific memory management** with MongoDB and Neo4j coordination

**API Integration** (Complete routing structure):
- **Authentication routes** (`5_integration/routes/user.routes.mjs`) with JWT middleware
- **Mahamaya Matrix routes** (`5_integration/routes/mahamaya-routes.mjs`) for archetypal foundation
- **Decanic routes** (`5_integration/routes/decanic.routes.mjs`) for Oracle interface
- **Comprehensive error handling** and input validation across all endpoints

## Epii Agent Analysis Pipeline: Advanced QL Cycle Implementation

The backend also features a sophisticated **Epii agent mode** with a **6-stage QL (-) analysis cycle** that demonstrates the system's capacity for deep epistemic processing:

### **Epii-Specific Analysis Features**

#### **Stage -5: Document Fetching and Preprocessing**
- **Multi-source document retrieval**: Direct content, file uploads, MongoDB documents
- **Content extraction**: Supports PDF, DOCX, TXT with intelligent text extraction
- **Metadata preservation**: Maintains document provenance and Bimba coordinate associations
- **Cache optimization**: Implements document caching to prevent redundant MongoDB fetches

#### **Stage -4: Contextual Analysis Preparation**
- **Comprehensive context gathering**: Integrates Bimba map, user memory, and coordinate-specific context
- **Enhanced BimbaKnowing integration**: Leverages QL-aware queries for structural understanding
- **Project context synthesis**: Incorporates full project scope awareness for analysis depth
- **Dynamic context window generation**: Creates tailored context based on target coordinate and analysis intent

#### **Stage -3: Structural Integration and LightRAG Ingestion**
- **Intelligent document chunking**: Preserves semantic coherence while optimizing for analysis
- **LightRAG integration**: Ingests chunks into graph+vector fusion system for conversational refinement
- **Bimba coordinate tagging**: Associates all chunks with appropriate coordinate mappings
- **Context preservation**: Maintains Bimba context throughout chunking process

#### **Stage -2: Core Analysis Engine** ✅ **Recently Enhanced**

**Recent Major Enhancements** (January 2025):
- **🎯 Document-Focused Analysis**: Transformed from self-reflective to scholarly document analysis approach
- **🎯 Enhanced Prompt Engineering**: Improved temperature settings (0.4) and token limits (6144-10240) for better content extraction
- **🎯 Archetypal Anchor Extraction**: Document-based symbolic pattern identification with textual evidence requirements
- **🎯 MEF Framework Integration**: Clear separation of analytical tools from content being analyzed

**Core Functions**:
- **Chunk group processing**: Analyzes collated chunk groups rather than individual chunks
- **Enhanced context fusion**: Combines LightRAG, Bimba, and MongoDB context with target coordinate prioritization
- **Semantic coordinate mapping**: Maps concepts to coordinates based on semantic meaning rather than arbitrary assignment
- **Pattern-based archetypal recognition**: Infers archetypal patterns from content dynamics rather than literal symbols
- **QL operator extraction**: Identifies structural, processual, and contextual operators
- **Relational properties generation**: Extracts epistemic essence, archetypal anchors, and semantic frameworks
- **Variation identification**: Detects conceptual variations and analytical nuances with enhanced context awareness

#### **Stage -1: Synthesis and Core Element Definition** ✅ **Recently Enhanced**

**Recent Improvements** (January 2025):
- **🎯 Temperature Optimization**: Increased to 0.5 for enhanced creativity while maintaining analytical rigor
- **🎯 Token Limit Optimization**: Reduced to 6144 tokens for more focused core element extraction
- **🎯 Archetypal Anchor Requirements**: Document-based extraction with textual evidence from actual content
- **🎯 Four-Category System**: Systematic A-B-C-D approach (Structural, Transformational, Relational, Energetic)

**Core Functions**:
- **Analysis integration**: Synthesizes chunk analyses into coherent understanding
- **Core element extraction**: Identifies fundamental concepts and relationships
- **Relational properties synthesis**: Consolidates QL operators and epistemic frameworks
- **Preparation for crystallization**: Structures insights for Notion integration

#### **Stage -0: Payload Generation and Epii Perspective** ✅ **Enhanced with Memory Integration**
- **Notion payload formatting**: Creates structured updates for knowledge crystallization
- **Epii perspective generation**: Leverages Epii agent for meta-reflective synthesis with enhanced creativity (temperature 0.7)
- **Graphiti episode creation**: Automatic memory onboarding with rich semantic content from analysis
- **Property generation**: Produces approximately 12 properties per analysis with balanced core elements
- **Crystallization preparation**: Formats results for seamless Notion database integration

### **Advanced Epii Capabilities**

#### **Context Window Enhancement**
- **Multi-layered context synthesis**: Combines project overview, Bimba map, coordinate-specific context, and user memory
- **Usage guides generation**: Provides comprehensive guidance for analysis utilization
- **QL-aware context retrieval**: Leverages enhanced BimbaKnowing for coordinate relationships and QL dynamics

#### **Intelligent Caching and Optimization**
- **Document cache management**: Prevents redundant database operations through sophisticated caching
- **Analysis session tracking**: Maintains comprehensive records of analysis workflows and results
- **Performance optimization**: Implements strategic caching for graph data, MEF templates, and LLM responses

#### **Integration with Crystallization Workflow**
- **Notion database preparation**: Six interconnected databases ready for knowledge integration
- **Relational link establishment**: Creates connections between coordinates, content nodes, concepts, and symbols
- **Sync capability development**: Progressing toward full Bimba updating from crystallized knowledge

### **Pipeline Testing Status and Continuous Refinement**

**⚠️ Current Testing Status**: The recent Stage -2 enhancements (Target Coordinate Prioritization, Semantic Mappings Logic, and Archetypal Anchors Pattern Inference) are **not yet fully tested** in production environments. These improvements represent significant advances in analytical accuracy but require real-world validation.

**Continuous Refinement Philosophy**: The Epii Analysis Pipeline embodies a **living system approach** where:
- **Analytical accuracy improves** through iterative refinement based on user feedback
- **Pattern recognition evolves** as the system encounters diverse document types and content
- **Semantic understanding deepens** through accumulated knowledge and relationship mapping
- **Archetypal pattern library expands** through successful pattern identification and validation

**Testing Priorities**:
1. **Target Coordinate Prioritization**: Verify that analysis properly focuses on the specified target coordinate
2. **Semantic Mapping Accuracy**: Validate that concepts are mapped to coordinates based on semantic meaning rather than arbitrary assignment
3. **Pattern Recognition Quality**: Assess the effectiveness of pattern-based archetypal identification vs. literal symbol detection

**Expected Evolution Areas**:
- **Short-term**: Fine-tuning of semantic coordinate mapping prompts and pattern recognition sensitivity
- **Medium-term**: Machine learning integration for pattern recognition and advanced semantic similarity algorithms
- **Long-term**: Self-improving analytical algorithms and adaptive pattern recognition based on domain expertise

*For detailed pipeline documentation, see [pipelines/README.md](./pipelines/README.md)*

### **Extensibility for Future Agent Modes**

The Epii implementation serves as a **template and foundation** for future agent subsystems:
- **Modular QL cycle architecture**: Can be adapted for different agent-specific processing needs
- **Universal memory access patterns**: BPMCP and LightRAG integration applicable to all agents
- **Configurable pipeline stages**: Framework supports different stage configurations for various agent modes
- **Shared utility functions**: QL utilities, content processing, and memory management available system-wide

## Refactored Backend Structure

The backend now implements the **complete bifurcated Bimba architecture** with integrated MCP servers and agent-specific subsystems:

```
friendly-file-backend/
├── databases/            # Universal Database Layer (#5-2 Universal)
│   ├── bpmcp/           # Integrated BPMCP MCP Server
│   │   ├── mcp-server/  # TypeScript MCP server with build/ directory
│   │   └── bpWebSocketClient.mjs # BPMCP WebSocket client service
│   ├── lightrag/        # Integrated LightRAG MCP Server
│   │   ├── mcp-server/  # Python FastAPI server with venv_312
│   │   └── qdrant.service.mjs # Qdrant vector database service
│   ├── graphiti/        # Integrated Graphiti MCP Server
│   │   └── mcp-server/  # Python MCP server for temporal knowledge
│   ├── neo4j/           # Neo4j Graph Database Services
│   │   ├── neo4j.service.mjs # Neo4j connection and query service
│   │   └── bimbaPratibimbaClient.mjs # Bimba-specific graph operations
│   ├── mongodb/         # MongoDB Database Services
│   ├── notion/          # Notion Database Services
│   ├── shared/          # Shared database utilities and models
│   │   ├── models/      # User, Document, and cross-system models
│   │   ├── utils/       # QL utilities, graphData, caching
│   │   └── schemas/     # Database schema definitions
│   ├── cache/           # Caching services and utilities
│   └── api/             # Universal database operation endpoints
├── subsystems/           # Agent-Specific Logic (#5-4-X Agents)
│   ├── 0_anuttara/      # Foundational agent (#5-4-0)
│   │   ├── 0_foundation/ # Core utilities and foundational logic
│   │   ├── 1_utils/     # Anuttara-specific utilities
│   │   ├── 2_services/  # Foundational services
│   │   ├── 3_models/    # Foundational data models
│   │   ├── 4_controllers/ # Foundational controllers
│   │   ├── 5_integration/ # Integration endpoints
│   │   └── docs/        # Documentation
│   ├── 1_paramasiva/    # QL/AT Logic agent (#5-4-1)
│   │   ├── paramasiva.expert.agent.mjs # Paramasiva agent implementation
│   │   └── [0-5 structure] # Complete QL organization
│   ├── 2_parashakti/    # Harmonic layer agent (#5-4-2)
│   ├── 3_mahamaya/      # Symbolic transformation agent (#5-4-3)
│   ├── 4_nara/          # Contextual application agent (#5-4-4)
│   │   ├── 0_foundation/ # Nara foundational types and utilities
│   │   ├── 1_utils/     # Nara-specific utilities
│   │   ├── 2_services/  # Auth, Mahamaya Matrix, Nara agent, user context
│   │   ├── 3_models/    # Mahamaya schema documentation
│   │   ├── 4_controllers/ # Auth, user, and Mahamaya Matrix controllers
│   │   ├── 5_integration/ # API routes (auth, user, mahamaya, decanic)
│   │   ├── docs/        # OpenAPI/Swagger specifications
│   │   └── nara.expert.agent.mjs # Nara agent implementation
│   └── 5_epii/          # Epii agent (#5-4-5)
│       ├── 0_foundation/ # Epii foundational utilities
│       ├── 1_utils/     # Document utils, notion utils, content processing
│       ├── 2_services/  # Analysis and crystallization services
│       ├── 3_models/    # Analysis session and document models
│       ├── 4_controllers/ # Analysis and chat controllers
│       ├── 5_integration/ # Pipelines, prompts, routes
│       └── docs/        # Epii documentation
├── Root-level files:     # Main application files
│   ├── index.mjs        # Main application entry point
│   ├── test-*.mjs       # Various test and verification scripts
│   ├── verify_connections.mjs # Connection verification utility
│   └── debug-cache.mjs  # Cache debugging utility
└── config/              # Configuration management
    ├── db.config.mjs    # MongoDB connection configuration
    └── cors.config.mjs  # CORS policy configuration
```

## Refactoring Achievement: Complete Bimba Architecture Implementation

The backend has **successfully completed** the **systematic refactoring** towards a **bifurcated Bimba architecture** that separates universal database functions from agent-specific logic, as outlined in the [Bimba Tech Architecture Refactoring Plan](../../refactor_COMPLETE/Bimba_Tech_Architecture_Refactoring_Blueprint.md).

### ✅ Completed Refactoring Achievements

#### **✅ Integrated MCP Servers**
- **BPMCP Server**: Migrated from external Cline/MCP to `databases/bpmcp/mcp-server/`
- **LightRAG Server**: Migrated from external to `databases/lightrag/mcp-server/`
- **Graphiti Server**: Integrated at `databases/graphiti/mcp-server/`
- **Unified Startup**: All MCP servers start as part of backend infrastructure

#### **✅ Bifurcated Architecture Implementation**
- **Universal Database Layer**: Complete `databases/` directory with shared services
- **Agent-Specific Logic**: Six subsystems with complete QL organization (0-5 structure)
- **Shared Models**: User, Document models migrated to `databases/shared/models/`
- **Legacy Compatibility**: Original structure maintained for smooth transition

#### **✅ Nara Mode Integration**
- **Complete Mahamaya Ground**: Authentication, user context, archetypal foundation
- **Oracle Interface**: Tarot, decanic, and natal chart systems
- **Agent Implementation**: A2A-compliant Nara agent with BPMCP integration
- **API Layer**: RESTful endpoints with JWT authentication and validation

### Migration Completion Status

**✅ Completed Migrations**:
- **MCP Servers**: All three servers integrated within backend structure
- **Nara Subsystem**: Complete implementation with Epic 1 and Epic 2 features
- **Shared Models**: User and Document models in `databases/shared/`
- **Database Services**: Neo4j, MongoDB, Qdrant services organized by database type
- **Agent Services**: Epii and Nara agent logic in respective subsystems

**🔄 Ongoing Development**:
- **Continued enhancement** of agent-specific subsystems
- **Additional MCP integrations** as needed
- **Performance optimization** and monitoring improvements

## Philosophical Alignment (Bimba Principles)

The refactoring aligns with core Bimba philosophical principles:

### **Fractal Holographic Architecture**
Each subsystem contains the complete QL structure (0-5) internally, creating self-similar patterns at different scales where each part reflects the whole.

### **Siva-Shakti Dynamics**
The backend embodies the **Siva** (structural, logical) aspect, providing stable processing architecture that interfaces with the **Shakti** (expressive, dynamic) frontend.

### **Bimba-Pratibimba Memory Pattern**
- **Bimba** (Original): Neo4j graph as authoritative ontological structure
- **Pratibimba** (Reflection): Dynamic processing through QL cycles, contextual synthesis via semantic/vector stores
- **Crystallization (Notion)**: Human-validated insights feeding back to refine the Bimba

### **Quaternal Logic Implementation**
The 6-fold QL cycle (4 explicate + 2 implicate) drives the analysis pipeline, implementing descent-to-source (-5 to -3) and ascent-to-expression (-2 to -0) flows.

## Integration with A2A and AG-UI Systems

The backend fully integrates with the `friendly-file-back2front` **Agent-to-Agent (A2A) communication framework** and **AG-UI protocol** (#5-4 Siva-Shakti):

### **✅ Complete A2A Integration**
- **WebSocket Communication**: Backend services communicate via WebSocket protocols
- **BPMCP Service**: Universal memory layer abstracts database interactions
- **Agent Implementation**: Epii and Nara agents fully integrated with A2A framework
- **Skills Registry**: 4 operational skills including Epii Analysis Pipeline as A2A skill (#5-0)

### **✅ AG-UI Protocol Implementation**
- **Real-time Communication**: 16 standard event types for frontend-agent communication
- **Progress Tracking**: Analysis pipeline emits progress events for frontend display
- **Event Emission**: All backend operations emit appropriate AG-UI events
- **WebSocket Gateway**: Centralized event routing through A2A service

### **✅ Subsystem Agent Architecture**
- **Agent Cards**: Each backend subsystem (0-5) has corresponding A2A agent representation
- **Coordinate-Based Skills**: Skills mapped to QL coordinates for systematic organization
- **Task State Management**: A2A framework manages QL cycle transitions and task routing
- **Unified Memory Access**: All database interactions flow through integrated BPMCP service

### **Communication Flow**
```
Frontend → AG-UI Gateway → A2A Framework → Backend Subsystems → Integrated MCP Servers
    ↑                                                              ↓
    ←─────── Real-time Events ←─────── Crystallized Knowledge ←────
```

## Key Technologies and Dependencies

### **Core Framework**
- **Node.js** with **Express.js** - Web server and API framework
- **ES Modules** - Modern JavaScript module system

### **Database Technologies**
- **MongoDB** with **Mongoose** - Document storage and ODM
- **Neo4j** with **LangChain** - Graph database integration
- **Qdrant** - Vector database for embeddings
- **Notion API** - Knowledge crystallization platform

### **AI/ML Integration**
- **Google Generative AI** - LLM services
- **LangChain** - AI application framework
- **LangGraph** - Workflow orchestration for QL cycles
- **LangSmith** - Tracing and monitoring

### **Communication Protocols**
- **WebSocket** (`ws`) - Real-time communication
- **Model Context Protocol (MCP)** - Memory-coupled peripheral integration
- **CORS** - Cross-origin resource sharing

### **Development Tools**
- **dotenv** - Environment variable management
- **UUID** - Unique identifier generation
- **Multer** - File upload handling

## Setup and Contribution

### **Development Environment Setup**

1. **Install Dependencies**:
   ```bash
   cd epii_app/friendly-file-backend
   npm install
   ```

2. **Environment Configuration**:
   Create `.env` file with required variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/epi-logos
   NEO4J_URI=bolt://localhost:7687
   QDRANT_URL=http://localhost:6333
   NOTION_API_KEY=your_notion_api_key
   GOOGLE_API_KEY=your_google_api_key
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3001`

### **Contribution Guidelines**

#### **During Transition Period**
- **Maintain existing structure** - Add new features to current directories
- **Document Bimba alignment** - Indicate target subsystem for new components
- **Test thoroughly** - Ensure functionality during migration steps

#### **Post-Refactoring**
- **Follow Bimba coordinates** - Place components in appropriate subsystem directories
- **Respect QL structure** - Use internal 0-5 organization when warranted
- **Maintain philosophical alignment** - Ensure code reflects Bimba principles

#### **Code Standards**
- **ES Modules** - Use `import/export` syntax
- **Async/Await** - Prefer over Promise chains
- **Error Handling** - Implement comprehensive error catching
- **Documentation** - Include JSDoc comments for complex functions
- **Testing** - Add unit tests for new functionality

### **API Documentation**

Key endpoints available at `http://localhost:3001`:

#### **Epii Agent Endpoints**
- `POST /api/epii-agent/analyze` - Analyze document through QL pipeline
- `POST /api/epii-agent/chat` - Chat with Epii agent
- `POST /files/upload` - Upload document for analysis
- `GET /api/graph` - Retrieve Bimba graph data
- `GET /api/notion/coordinate/:coordinate` - Resolve Bimba coordinate to Notion

#### **Nara Mode Endpoints**
- `POST /api/auth/register` - User registration with Mahamaya Matrix initialization
- `POST /api/auth/login` - JWT-based authentication
- `GET /api/auth/profile` - Get authenticated user profile
- `POST /api/auth/refresh` - Refresh JWT tokens
- `GET /api/mahamaya/matrix` - Get user's complete Mahamaya Matrix
- `PUT /api/mahamaya/layer/:layerName` - Update specific Mahamaya Ground layer
- `POST /api/bpmcp/astrology/natal-chart` - Generate natal chart from user data

#### **Database Endpoints**
- `GET /api/database/neo4j/query` - Execute Neo4j Cypher queries
- `POST /api/database/lightrag/ingest` - Ingest documents into LightRAG
- `GET /api/database/lightrag/retrieve` - Retrieve context from LightRAG
- `POST /api/database/graphiti/episode` - Create Graphiti episodes

For detailed API documentation, see:
- **Nara API**: `subsystems/4_nara/docs/` directory for OpenAPI specifications
- **Epii API**: `subsystems/5_epii/docs/` directory for pipeline documentation
- **Database APIs**: `databases/api/` directory for universal database operations
