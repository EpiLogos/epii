# Epi-Logos Backend System (`friendly-file-backend`)

## Overview and Role

The `friendly-file-backend` serves as the **universal nervous system and brain** of the Epi-Logos system, implementing the **#5-2 Siva-** aspect of the Bimba architecture. While the current implementation focuses on the **Epii agent mode**, the backend is architected to govern **all QL cycles and pipelines** for dynamic, modular, and evolvable data/epistemic processing across all six subsystems (Anuttara through Epii).

### Primary Functions and Responsibilities

- **Universal QL Cycle Orchestration**: Governs all Quaternal Logic cycles (both descent-to-source and ascent-to-expression flows) for any agent mode, with current implementation focused on Epii's 6-stage analysis pipeline (Stage -5 to -0)
- **Advanced Memory Architecture**: Orchestrates the complete Bimba-Pratibimba memory system through sophisticated BPMCP and LightRAG MCP services
- **Agent-Agnostic Processing Engine**: Provides modular, evolvable epistemic processing capabilities that can be extended to all six subsystem agents (currently specialized for Epii mode)
- **Intelligent Context Synthesis**: Combines structural (Bimba), semantic (Pratibimba), and crystallized (Notion) knowledge for comprehensive understanding
- **Multi-Modal Integration**: Orchestrates Google Generative AI, LangSmith tracing, and cross-database operations for sophisticated analysis workflows

## Advanced Memory Systems: BPMCP and LightRAG Integration

The backend leverages two sophisticated MCP (Memory-Coupled Peripherals) servers that provide unified access to the complete Bimba-Pratibimba memory architecture:

### **Bimba-Pratibimba Memory-MCP Server** (`Cline/MCP/Bimba-Pratibimba-Memory-MCP/`)

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

### **LightRAG MCP Server** (`Cline/MCP/lightrag-mcp-server/`)

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

## Epii Agent Analysis Pipeline: Current QL Cycle Implementation

The backend's current primary implementation focuses on the **Epii agent mode**, featuring a sophisticated **6-stage QL (-) analysis cycle** that demonstrates the system's capacity for deep epistemic processing:

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

## Current Backend Structure

The backend currently follows a traditional layered architecture while transitioning to the Bimba-aligned structure:

```
friendly-file-backend/
├── controllers/          # HTTP request handlers for API endpoints
│   ├── analysis.controller.mjs      # Document analysis operations
│   ├── chat.controller.mjs          # Chat functionality (Epii/Nara modes)
│   ├── documents.controller.mjs     # Document CRUD operations
│   ├── graph.controller.mjs         # Neo4j graph data retrieval
│   ├── notion.controller.mjs        # Notion integration
│   └── user.controller.mjs          # User management
├── routes/               # API endpoint definitions and middleware
│   ├── analysis.routes.mjs          # Document analysis endpoints
│   ├── chat.routes.mjs              # Chat functionality endpoints
│   ├── documents.routes.mjs         # Document management endpoints
│   └── graph.routes.mjs             # Graph data access endpoints
├── services/             # Business logic and external integrations
│   ├── bpMCPService.mjs             # Bimba-Pratibimba MCP WebSocket client
│   ├── epii-llm.service.mjs         # LLM operations with tracing
│   ├── neo4j.service.mjs            # Neo4j graph database integration
│   ├── crystallization.service.mjs  # Notion synchronization
│   └── analysis.service.mjs         # Document analysis workflows
├── models/               # MongoDB schemas and data models
│   ├── Document.model.mjs           # Main document schema with Bimba coordinates
│   ├── User.model.mjs               # User schema with 6-identity structure
│   ├── AnalysisSession.model.mjs    # Analysis session tracking
│   └── ChatMessage.model.mjs        # Chat message storage
├── pipelines/            # QL Cycle Implementations (currently Epii-specific)
│   ├── epii_analysis_pipeline_refactored.mjs  # Epii agent QL (-) cycle orchestration
│   └── stages/                      # Epii-specific pipeline stages (-5 to -0)
├── utils/                # Utility functions and helpers
│   ├── document.utils.mjs           # Document processing and chunking
│   ├── notion.utils.mjs             # Notion payload formatting
│   ├── ql.utils.mjs                 # Quaternal Logic utilities
│   └── content/                     # Content processing utilities
├── subsystems/           # Target Bimba-aligned architecture (in transition)
│   ├── 0_anuttara/                  # Foundational database services
│   ├── 1_paramasiva/                # QL/AT Logic implementation
│   ├── 2_parashakti/                # Harmonic layer services
│   ├── 3_mahamaya/                  # Symbolic transformation
│   ├── 4_nara/                      # API layer
│   └── 5_epii/                      # Epii agent and Notion integration
└── config/               # Configuration management
    ├── db.config.mjs                # MongoDB connection configuration
    └── cors.config.mjs              # CORS policy configuration
```

## Refactoring Plan: Towards Bimba Architecture

The backend is undergoing **systematic refactoring** towards a **bifurcated Bimba architecture** that separates universal database functions from agent-specific logic, as outlined in the [Bimba Tech Architecture Refactoring Plan](../../memory-bank/Bimba%20Tech%20Architecture%20Refactoring%20Plan.md).

### Corrected Target Bimba Structure

The refactoring introduces two primary organizational units:

#### **1. `databases/` Directory - Universal Database Functions**
```
databases/
├── neo4j/                # Neo4j operations & utilities
├── lightrag/             # LightRAG MCP (neo4j + qdrant fusion)
├── mongodb/              # MongoDB operations & utilities
├── notion/               # Notion database operations
├── bpmcp/                # BPMCP server integration
├── shared/               # Shared database utilities, models, foundational utils
├── api/                  # Shared API layer for database operations
└── config/               # Database configurations
```

#### **2. `subsystems/` Directory - Agent-Specific Functionality**
```
subsystems/
├── 0_anuttara/           # Foundational agent (#5-4-0)
├── 1_paramasiva/         # QL/AT Logic agent (#5-4-1)
├── 2_parashakti/         # Harmonic layer agent (#5-4-2)
├── 3_mahamaya/           # Symbolic transform agent (#5-4-3)
├── 4_nara/               # API/contextual agent (#5-4-4)
└── 5_epii/               # Epii agent (#5-4-5)
```

Each subsystem follows internal QL organization (0-5 structure) when functionality warrants it.

### Migration Strategy

**Current State**: Components remain in their original locations (`/services`, `/controllers`, `/routes`, `/models`, `/pipelines`)

**Target State**: Components will be reorganized according to their functional alignment:
- **Universal database operations** → `databases/` directory
- **Agent-specific logic** → appropriate `subsystems/` directory
- **Shared utilities** (QL, graphData, caching) → `databases/shared/`
- **Agent-specific utilities** (document utils for Epii) → respective subsystem

### Component Migration Examples

- `services/bpMCPService.mjs` → `databases/bpmcp/`
- `pipelines/epii_analysis_pipeline_refactored.mjs` → `subsystems/5_epii/`
- `utils/ql.utils.mjs` → `databases/shared/utils/`
- `utils/document.utils.mjs` → `subsystems/5_epii/` (Epii-specific)

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

## Integration with the back2front System

The backend integrates with the `friendly-file-back2front` **Agent-to-Agent (A2A) communication framework** (#5-4 Siva-Shakti):

### **Current Integration**
- **WebSocket Communication**: Backend services communicate via WebSocket protocols
- **BPMCP Service**: Universal memory layer abstracts database interactions
- **Agent Adapters**: A2A framework provides adapters for Epii and Nara agents

### **Post-Refactoring Integration**
- **Subsystem Agents**: Each backend subsystem (0-5) will have corresponding A2A agent cards
- **Skills Registry**: Bimba-aligned skills registry maps capabilities to QL coordinates
- **Task State Management**: A2A framework manages QL cycle transitions and task routing
- **Unified Memory Access**: All database interactions flow through BPMCP service

### **Communication Flow**
```
Frontend → A2A Framework → Backend Subsystems → Database Layer
    ↑                                              ↓
    ←─────── Crystallized Knowledge ←──────────────
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

- `POST /api/epii-agent/analyze` - Analyze document through QL pipeline
- `POST /api/epii-agent/chat` - Chat with Epii agent
- `POST /files/upload` - Upload document for analysis
- `GET /api/graph` - Retrieve Bimba graph data
- `GET /api/notion/coordinate/:coordinate` - Resolve Bimba coordinate to Notion

For detailed API documentation, see individual route files in `/routes` directory.
