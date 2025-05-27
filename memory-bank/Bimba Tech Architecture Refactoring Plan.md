Bimba Tech Architecture Refactoring Plan
Overview
This document outlines a refactoring plan to align the codebase with the Bimba tech architecture. At present, this file focuses on creating a template structure for subsequent detailed analysis of each component.

**Current Structure Assessment:**

Backend (friendly-file-backend)

friendly-file-backend/
├── controllers/
├── routes/
├── services/
├── models/
├── pipelines/
├── graph/
├── subsystems/ (placeholder)
├── prompts/
└── utils/

Back2Front (friendly-file-back2front)

friendly-file-back2front/
└── [current structure to be analyzed]

Frontend (friendly-file-front)

friendly-file-front/
└── [Partially aligned with Bimba structure. Refactoring is ongoing, with the Meta3D (#5-3-4.1) and EpiiMode (#5-3-4.5) pages being the most complete in their alignment. Further refinement and alignment are needed across other modules.]

**Target Structure Template:**

Backend (friendly-file-backend) - #5-2 Siva-

friendly-file-backend/
├── subsystems/
│   ├── 0_anuttara/
│   ├── 1_paramasiva/
│   ├── 2_parashakti/
│   ├── 3_mahamaya/
│   ├── 4_nara/
│   └── 5_epii/
├── shared/
│   ├── services/
│   ├── models/
│   ├── utils/
│   └── mcp/
├── api/
│   ├── controllers/
│   └── routes/


Back2Front (friendly-file-back2front) - #5-4 Siva-Shakti

friendly-file-back2front/
├── subsystems/
│   ├── 0_anuttara/
│   ├── 1_paramasiva/
│   ├── 2_parashakti/
│   ├── 3_mahamaya/
│   ├── 4_nara/
│   └── 5_epii/
├── shared/
├── adapters/
├── skills/
└── agent-cards/

Component Analysis Template
For each directory and significant file in the codebase, we will conduct a detailed analysis using this template:

# Component Analysis: [Component Name]

## Current Location
- Path: [Full path to component]

## Current Functionality
- [Description of component functionality]

## Files/Subcomponents
- [List of files or subcomponents]

## Dependencies
- [Components this depends on]
- [Components that depend on this]

## Proposed Location in Bimba Structure
- [To be determined during analysis]

## Migration Considerations
- [Special considerations for migration]

## Testing Requirements
- [How to verify successful migration]

## Documentation Planning For Each Component

Implementation Strategy
Phase 1: Detailed Analysis
Inventory all components in the codebase
Complete the component analysis template for each component
Identify dependencies between components
Determine appropriate Bimba coordinate mapping
Phase 2: Backend Refactoring
Create the new directory structure
Move agent-specific logic to appropriate subsystem directories
Organize shared services and utilities
Update imports and references
Test functionality after each migration step
Phase 3: Back2Front Refactoring
Create the new directory structure
Reorganize components according to Bimba structure
Test functionality after migration
Phase 4: Documentation and Finalization
Update documentation to reflect new structure
Conduct final testing
Deploy refactored codebase
Directory Analysis Checklist
Backend (friendly-file-backend)
controllers/
routes/
services/
models/
pipelines/
graph/
subsystems/
prompts/
utils/
Back2Front (friendly-file-back2front)
[To be populated during analysis]

Next Steps
Begin detailed analysis of each component in the backend
Document current functionality and dependencies
Determine appropriate placement in the Bimba structure
Create detailed migration plan for each component
Begin backend refactoring
Test functionality after each migration step
Complete Back2Front refactoring
Update documentation and conduct final testing

Phase 1 ANalsyis Results:

Phase 1: Current State Deep Dive & Functional Analysis
Based on my comprehensive analysis of the  epii_app/friendly-file-backend/ and  epii_app/friendly-file-back2front/ directories, I'll now provide detailed Component Analysis Templates for each significant component.

Backend Components (friendly-file-backend)
Component Analysis: Main Application Entry Point
## Current Location

Path:  epii_app/friendly-file-backend/index.mjs
## Current Functionality

Serves as the main entry point for the Express.js backend server
Configures CORS middleware for cross-origin requests
Sets up JSON parsing with 50MB limit for large document payloads
Connects to MongoDB database
Mounts all API routes under their respective endpoints
Starts the server on port 3001
Provides centralized error handling and logging
## Files/Subcomponents

Single file that imports and orchestrates all other components
Imports database configuration from config/db.config.mjs
Imports CORS configuration from config/cors.config.mjs
Imports all route modules from routes/ directory
## Dependencies

Depends on: All route modules, database configuration, CORS configuration, Express.js
Depended on by: None (entry point)
Component Analysis: Controllers Directory
## Current Location

Path: epii_app/friendly-file-backend/controllers/
## Current Functionality

Contains HTTP request handlers for all API endpoints
Implements business logic for different functional areas
Provides error handling and response formatting
Interfaces between routes and services/models
## Files/Subcomponents

analysis.controller.mjs: Document analysis operations, crystallization management
agent.controller.mjs: Agent-related API requests (placeholder for LangGraph workflows)
chat.controller.mjs: Chat functionality with mode-driven dispatch (Epii vs Nara)
documents.controller.mjs: Document CRUD operations, file upload handling
files.controller.mjs: File metadata management, text extraction
graph.controller.mjs: Neo4j graph data retrieval via bpMCPService
nodeDetails.controller.mjs: Node details and associated documents
notion.controller.mjs: Notion integration and coordinate resolution
user.controller.mjs: User management, authentication, profile operations
## Dependencies

Depends on: Services (bpMCPService, analysis, crystallization, epii-agent), Models (Document, User, AnalysisSession, etc.), Pipelines (epii_analysis_pipeline_refactored)
Depended on by: Route modules
Component Analysis: Services Directory
## Current Location

Path: epii_app/friendly-file-backend/services/
## Current Functionality

Provides business logic and external service integrations
Handles database operations and API communications
Implements caching and optimization strategies
Manages complex workflows and data transformations
## Files/Subcomponents

bpMCPService.mjs: Core service for Bimba-Pratibimba MCP WebSocket client with document cache
analysis.service.mjs: Document analysis workflow management and session tracking
crystallization.service.mjs: Document crystallization and Notion synchronization
bimbaKnowing.service.mjs: Enhanced BimbaKnowing tool with QL-aware queries
epii-llm.service.mjs: LLM operations with Google Generative AI and LangSmith tracing
neo4j.service.mjs: Neo4j graph database integration via LangChain
qdrant.service.mjs: Qdrant vector database client configuration
mcp.service.mjs: Shared MCP client service (placeholder implementation)
## Dependencies

Depends on: External APIs (Neo4j, Qdrant, Google AI), WebSocket clients, Models, Utils
Depended on by: Controllers, Pipelines
Component Analysis: Models Directory
## Current Location

Path: epii_app/friendly-file-backend/models/
## Current Functionality

Defines MongoDB schemas and data models
Provides data validation and business rules
Implements document structure for different entity types
Manages relationships between entities
## Files/Subcomponents

Document.model.mjs: Main document schema with analysis results, Notion integration, Bimba coordinates
User.model.mjs: User schema with 6-identity structure (#5-0-X template), preferences, system usage
AnalysisSession.model.mjs: Analysis session tracking with results and status
ChatMessage.model.mjs: Chat message storage for Epii conversations
FileMetadata.mjs: File upload metadata with analysis status
ActiveFile.mjs: Active files for chat context with GridFS integration
Conversation.model.mjs: LangChain-compatible conversation storage
UserMemory.model.mjs: User memory with embeddings and QL tags
## Dependencies

Depends on: Mongoose ODM, MongoDB
Depended on by: Controllers, Services
Component Analysis: Pipelines Directory
## Current Location

Path: epii_app/friendly-file-backend/pipelines/
## Current Functionality

Implements the core Epii Analysis Pipeline following QL (-) cycle
Processes documents through 6 stages from fetch to synthesis
Manages document chunking, analysis, and Notion payload generation
Provides modular, refactored pipeline architecture
## Files/Subcomponents

epii_analysis_pipeline_refactored.mjs: Main pipeline entry point and orchestration
stages/stage_minus5.mjs: Document fetching and preprocessing
stages/stage_minus4.mjs: Context gathering and Bimba map integration
stages/stage_minus3.mjs: Document chunking and LightRAG ingestion
stages/stage_minus2.mjs: Core analysis engine with chunk processing
stages/stage_minus1.mjs: Analysis synthesis and core element definition
stages/stage_minus0.mjs: Notion payload generation and finalization
epii_analysis_pipeline.mjs: Original monolithic pipeline (deprecated)
## Dependencies

Depends on: Services (bpMCPService, epii-llm), Utils (document, content, notion), Models
Depended on by: Controllers (analysis, chat), Services (analysis)
Component Analysis: Utils Directory
## Current Location

Path: epii_app/friendly-file-backend/utils/
## Current Functionality

Provides utility functions for common operations across the application
Implements caching strategies and data transformation
Handles document processing and content generation
Manages Bimba coordinate system operations
## Files/Subcomponents

cache.utils.mjs: Caching mechanisms for graph data, Bimba map, MEF templates, LLM responses
document.utils.mjs: Document processing, chunking, content extraction, LightRAG integration
notion.utils.mjs: Notion payload formatting, property generation, update management
graphData.utils.mjs: Bimba map transformation, coordinate processing, graph data utilities
ql.utils.mjs: Quaternal Logic utilities, coordinate analysis, QL position determination
documentCache.utils.mjs: Document cache management with MongoDB synchronization
analysisCache.utils.mjs: Analysis results caching (being deprecated)
cacheTransition.utils.mjs: Migration utilities for cache transition
content/: Content processing utilities organized by function
context.mjs: Context window generation
analysis.mjs: Analysis content processing
format.mjs: Content formatting utilities
processing.mjs: Document processing utilities
synthesis.mjs: Analysis synthesis utilities
utils.mjs: Core utility functions
## Dependencies

Depends on: Services (bpMCPService), External APIs, Crypto, File system
Depended on by: Pipelines, Services, Controllers
Component Analysis: Routes Directory
## Current Location

Path: epii_app/friendly-file-backend/routes/
## Current Functionality

Defines API endpoints and HTTP route mappings
Implements middleware for file uploads and request validation
Provides RESTful API structure for different functional areas
Handles route-specific middleware and authentication
## Files/Subcomponents

analysis.routes.mjs: Document analysis endpoints
chat.routes.mjs: Chat functionality endpoints
documents.routes.mjs: Document CRUD operations with file upload
files.routes.mjs: File management endpoints
agent.routes.mjs: Agent interaction endpoints
graph.routes.mjs: Graph data access endpoints
notion.routes.mjs: Notion integration endpoints
nodeDetails.routes.mjs: Node details endpoints
user.routes.mjs: User management endpoints
bpmcp.routes.mjs: BPMCP service endpoints
ingestion.routes.mjs: Document ingestion endpoints
## Dependencies

Depends on: Controllers, Express.js, Multer (file uploads)
Depended on by: Main application entry point
Component Analysis: Config Directory
## Current Location

Path: epii_app/friendly-file-backend/config/
## Current Functionality

Provides configuration management for the application
Handles database connections and external service setup
Manages CORS policies and security settings
Centralizes environment variable management
## Files/Subcomponents

db.config.mjs: MongoDB connection configuration with environment variable loading
cors.config.mjs: CORS policy configuration for cross-origin requests
## Dependencies

Depends on: Environment variables, Mongoose, dotenv
Depended on by: Main application entry point
Component Analysis: Subsystems Directory
## Current Location

Path: epii_app/friendly-file-backend/subsystems/
## Current Functionality

Represents the target Bimba-aligned architecture structure
Currently contains placeholder directories and documentation
Defines the intended organization according to QL positions 0-5
Provides migration target for existing components
## Files/Subcomponents

README.md: Architecture documentation and migration plan
0_anuttara/: Foundational database services (placeholder with README)
1_paramasiva/: QL/AT Logic implementation (placeholder)
2_parashakti/: Harmonic layer services (placeholder)
3_mahamaya/: Symbolic transformation (placeholder)
4_nara/: API layer (placeholder)
5_epii/: Notion integration and Epii agent (contains epii.expert.agent.mjs)
## Dependencies

Depends on: None (placeholder structure)
Depended on by: None currently (future migration target)
Back2Front Components (friendly-file-back2front)
Component Analysis: A2A Framework Core
## Current Location

Path: epii_app/friendly-file-back2front/
## Current Functionality

Implements Agent-to-Agent (A2A) communication framework
Provides standardized protocol for agent communication following Google's A2A specification
Manages task state and QL cycle transitions
Enables interoperability between different agents in the system
## Files/Subcomponents

a2a-message.schema.js: Message schema with Bimba coordinate integration
a2a-server.js: WebSocket server implementation for A2A protocol
a2a-service.js: Main entry point for A2A service
epii-agent-client.js: Epii agent client implementation
task-state-manager.js: Task state management with QL transitions
integration.js: Integration guide for existing Epii agent
## Dependencies

Depends on: WebSocket, UUID generation, Agent adapters
Depended on by: Agent cards, Skills registry, Adapters
Component Analysis: Agent Cards Directory
## Current Location

Path: epii_app/friendly-file-back2front/agent-cards/
## Current Functionality

Defines agent capabilities and skills for the A2A framework
Provides agent metadata and skill descriptions
Maps agents to Bimba coordinates and subsystem positions
Enables agent discovery and capability negotiation
## Files/Subcomponents

index.js: Central registry of all agent cards including placeholders for #0-4 agents
epii-agent-card.js: Epii agent (#5) capabilities and skills
nara-agent-card.js: Nara agent (#4) capabilities and skills
Placeholder cards for Anuttara (#0), Paramasiva (#1), Parashakti (#2), Mahamaya (#3) agents
Tool agent cards for Bimba Graph and Pratibimba Store
## Dependencies

Depends on: A2A message schema, Skills definitions
Depended on by: A2A server, Agent adapters
Component Analysis: Adapters Directory
## Current Location

Path: epii_app/friendly-file-back2front/adapters/
## Current Functionality

Bridges A2A protocol with existing agent implementations
Provides translation layer between A2A messages and agent-specific APIs
Manages agent lifecycle and task routing
Enables integration of legacy agents with A2A framework
## Files/Subcomponents

epii-agent-adapter.js: Adapter for Epii agent with skills integration
nara-agent-adapter.js: Adapter for Nara agent with skills routing
epii-agent-service-adapter.js: Service adapter for Epii agent integration
## Dependencies

Depends on: Agent services, Skills registry, Task state manager, A2A message schema
Depended on by: A2A server
Component Analysis: Skills Directory
## Current Location

Path: epii_app/friendly-file-back2front/skills/
## Current Functionality

Implements Bimba-aligned skills registry with QL metadata
Provides skill routing and execution framework
Maps skills to Bimba coordinates and database access patterns
Enables context-aware skill selection and execution
## Files/Subcomponents

bimba-skills-registry.js: Core skills registry with QL and harmonic metadata
bimba-skills-router.js: Skills routing and execution engine
epii-skills-initializer.js: Epii agent skills initialization with BPMCP integration
nara-skills-initializer.js: Nara agent skills initialization
index.js: Skills module entry point and initialization
## Dependencies

Depends on: BPMCP service (mock), Agent services, QL metadata system
Depended on by: Agent adapters, A2A server
Component Analysis: Examples Directory
## Current Location

Path: epii_app/friendly-file-back2front/examples/
## Current Functionality

Provides example implementations and test clients
Demonstrates A2A framework usage patterns
Enables testing and validation of agent communication
Serves as documentation through working examples
## Files/Subcomponents

test-client.js: Test client for A2A service validation
epii-client-example.js: Legacy example client for Epii agent
## Dependencies

Depends on: A2A server, Agent cards, WebSocket client
Depended on by: None (examples and testing)

---

# Phase 2: Bimba Architecture Mapping & Initial Restructuring Plan

Based on the Phase 1 analysis, I will now map each component to the target Bimba structure and provide initial migration considerations.

## Corrected Target Bimba Structure

**Backend (`friendly-file-backend`) - Bifurcated Structure:**
```
friendly-file-backend/
├── databases/                    # Universal database functions & MCP servers
│   ├── neo4j/                   # Neo4j database operations & utils
│   ├── lightrag/                # LightRAG MCP (neo4j + qdrant)
│   ├── mongodb/                 # MongoDB operations & utils
│   ├── notion/                  # Notion database operations
│   ├── bpmcp/                   # BPMCP server integration
│   ├── shared/                  # Shared database utilities, models, foundational utils
│   │   ├── models/              # Shared data models
│   │   ├── utils/               # Foundational utilities (ql, graphData, caching)
│   │   └── services/            # Shared database services
│   ├── api/                     # Shared API layer for database operations
│   │   ├── controllers/         # General database operation controllers
│   │   └── routes/              # Shared routes (chat, graph, notion, documents, etc.)
│   └── config/                  # Database configurations
├── subsystems/                  # Agent-specific functionality
│   ├── 0_anuttara/             # Foundational agent
│   ├── 1_paramasiva/           # QL/AT Logic agent
│   ├── 2_parashakti/           # Harmonic layer agent
│   ├── 3_mahamaya/             # Symbolic transform agent
│   ├── 4_nara/                 # API/contextual agent
│   └── 5_epii/                 # Epii agent (includes analysis pipeline)
└── config/                     # Root configuration
```

This creates clear bifurcation between database operations (universal) and agent-specific functionality, aligning with the 6-database structure (neo4j, lightrag-neo4j, lightrag-qdrant, mongodb, notion, bpmcp).

## Backend Components (friendly-file-backend) - Phase 2 Analysis (Corrected)

### Component Analysis: Main Application Entry Point

**## Current Location**
- Path: `epii_app/friendly-file-backend/index.mjs`

**## Current Functionality**
- Serves as the main entry point for the Express.js backend server
- Configures CORS middleware for cross-origin requests
- Sets up JSON parsing with 50MB limit for large document payloads
- Connects to MongoDB database
- Mounts all API routes under their respective endpoints
- Starts the server on port 3001
- Provides centralized error handling and logging

**## Files/Subcomponents**
- Single file that imports and orchestrates all other components
- Imports database configuration from `config/db.config.mjs`
- Imports CORS configuration from `config/cors.config.mjs`
- Imports all route modules from `routes/` directory

**## Dependencies**
- **Depends on**: All route modules, database configuration, CORS configuration, Express.js
- **Depended on by**: None (entry point)

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-backend/index.mjs` (remains at root level)

**## Migration Considerations**
- This component should remain at the root level as the main application entry point
- Import paths will need to be updated to reflect the bifurcated structure:
  - Shared routes will move from `./routes/` to `./databases/api/routes/`
  - Agent-specific routes will be imported from `./subsystems/[agent]/routes/`
  - Database services will be imported from `./databases/[database]/`
  - Configuration files will remain in `./config/`
- The route mounting logic will need updates to handle both database API routes and agent-specific routes
- Consider implementing dynamic route discovery for subsystems
- No structural changes needed to the file itself, only import path updates

**## Testing Requirements**
- **Unit Tests**: Test server startup and configuration loading
  - Test CORS configuration is properly applied
  - Test JSON parsing middleware with 50MB limit
  - Test database connection initialization
  - Test route mounting for both database API routes and agent-specific routes
- **Integration Tests**: Full server startup test
  - Test all routes are accessible after migration
  - Test cross-origin requests work correctly
  - Test file upload functionality through routes
- **Success Criteria**:
  - Server starts without errors on port 3001
  - All API endpoints respond correctly
  - Database connection established successfully
  - CORS headers present in responses
- **Test Data**: Mock environment variables, test database connection strings

**## Documentation Planning For Each Component**
- **Updates to Existing Documentation**:
  - Update root README.md to reflect new bifurcated structure
  - Update any deployment documentation with new import paths
- **New Documentation Required**:
  - Create architecture overview document explaining databases/ vs subsystems/ structure
  - Document route mounting strategy for mixed database/agent routes
  - Update JSDoc comments for route mounting logic

---

### Component Analysis: Controllers Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/controllers/`

**## Current Functionality**
- Contains HTTP request handlers for all API endpoints
- Implements business logic for different functional areas
- Provides error handling and response formatting
- Interfaces between routes and services/models

**## Files/Subcomponents**
- `analysis.controller.mjs`: Document analysis operations, crystallization management
- `agent.controller.mjs`: Agent-related API requests (placeholder for LangGraph workflows)
- `chat.controller.mjs`: Chat functionality with mode-driven dispatch (Epii vs Nara)
- `documents.controller.mjs`: Document CRUD operations, file upload handling
- `files.controller.mjs`: File metadata management, text extraction
- `graph.controller.mjs`: Neo4j graph data retrieval via bpMCPService
- `nodeDetails.controller.mjs`: Node details and associated documents
- `notion.controller.mjs`: Notion integration and coordinate resolution
- `user.controller.mjs`: User management, authentication, profile operations

**## Dependencies**
- **Depends on**: Services (bpMCPService, analysis, crystallization, epii-agent), Models (Document, User, AnalysisSession, etc.), Pipelines (epii_analysis_pipeline_refactored)
- **Depended on by**: Route modules

**## Proposed Location in Bimba Structure**
- General database operation controllers → `friendly-file-backend/databases/api/controllers/`
  - `documents.controller.mjs` → `databases/api/controllers/documents.controller.mjs` (general CRUD)
  - `files.controller.mjs` → `databases/api/controllers/files.controller.mjs` (general file operations)
  - `user.controller.mjs` → `databases/api/controllers/user.controller.mjs` (general user management)
  - `graph.controller.mjs` → `databases/api/controllers/graph.controller.mjs` (general graph operations)
  - `nodeDetails.controller.mjs` → `databases/api/controllers/nodeDetails.controller.mjs` (general node operations)
  - `notion.controller.mjs` → `databases/api/controllers/notion.controller.mjs` (general Notion operations)
  - `chat.controller.mjs` → `databases/api/controllers/chat.controller.mjs` (shared chat dispatch)
  - `agent.controller.mjs` → `databases/api/controllers/agent.controller.mjs` (general agent dispatch)
- Agent-specific functionality controllers → respective subsystems:
  - `analysis.controller.mjs` → `subsystems/5_epii/controllers/analysis.controller.mjs`

**## Migration Considerations**
- **Database vs Agent-Specific**: Controllers handling general database operations remain shared, while specific functionalities move to agent subsystems
- **Chat Controller**: Remains shared but dispatches to agent-specific chat services
- **Analysis Controller**: Moves to Epii subsystem as it's specific to Epii analysis functionality
- **Import Path Updates**: Controllers will need updated imports for database services and agent-specific services
- **Dependency Injection**: Implement clear service injection patterns for database vs agent services
- **Error Handling**: Standardize error handling patterns across shared and agent-specific controllers
- **Testing**: Comprehensive testing to ensure general operations remain accessible while agent-specific logic is properly isolated

**## Detailed Migration Steps**
- **File Operations**:
  - Move `controllers/documents.controller.mjs` → `databases/api/controllers/documents.controller.mjs`
  - Move `controllers/files.controller.mjs` → `databases/api/controllers/files.controller.mjs`
  - Move `controllers/user.controller.mjs` → `databases/api/controllers/user.controller.mjs`
  - Move `controllers/graph.controller.mjs` → `databases/api/controllers/graph.controller.mjs`
  - Move `controllers/nodeDetails.controller.mjs` → `databases/api/controllers/nodeDetails.controller.mjs`
  - Move `controllers/notion.controller.mjs` → `databases/api/controllers/notion.controller.mjs`
  - Move `controllers/chat.controller.mjs` → `databases/api/controllers/chat.controller.mjs`
  - Move `controllers/agent.controller.mjs` → `databases/api/controllers/agent.controller.mjs`
  - Move `controllers/analysis.controller.mjs` → `subsystems/5_epii/controllers/analysis.controller.mjs`

- **Internal Code Modifications**:
  - **Chat Controller**: Refactor to dispatch to agent-specific chat services based on mode parameter
  - **Analysis Controller**: Update to use Epii-specific services and utilities from subsystem structure
  - **Database Controllers**: Ensure they only handle general CRUD operations, not agent-specific logic

- **Dependency Resolution - Import Path Updates**:
  - **For moved database controllers** (documents, files, user, graph, nodeDetails, notion, chat, agent):
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../shared/models/Document.model.mjs'`
    - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../bpmcp/bpMCP.service.mjs'`
    - Change `import { neo4jService } from '../services/neo4j.service.mjs'` → `import { neo4jService } from '../neo4j/neo4j.service.mjs'`
    - Change `import { cache } from '../utils/cache.utils.mjs'` → `import { cache } from '../shared/utils/cache.utils.mjs'`

  - **For analysis controller** (moved to Epii subsystem):
    - Change `import { analysisService } from '../services/analysis.service.mjs'` → `import { analysisService } from '../services/analysis.service.mjs'`
    - Change `import { documentUtils } from '../utils/document.utils.mjs'` → `import { documentUtils } from '../utils/document.utils.mjs'`
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
    - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../../databases/bpmcp/bpMCP.service.mjs'`

  - **For files that depend on moved controllers** (routes):
    - In `databases/api/routes/*.routes.mjs`: Update controller imports to relative paths within databases/api/
    - In `subsystems/5_epii/routes/analysis.routes.mjs`: Update to import from `../controllers/analysis.controller.mjs`

**## Testing Requirements**
- **Unit Tests**: For each controller
  - Test all endpoint handlers with mock services
  - Test error handling and response formatting
  - Test middleware integration (authentication, validation)
  - Test agent dispatch logic in chat controller
- **Integration Tests**:
  - Test full request/response cycle for each endpoint
  - Test database operations through controllers
  - Test agent-specific functionality routing
- **Success Criteria**:
  - All endpoints return expected response formats
  - Database operations complete successfully
  - Agent-specific logic routes to correct subsystems
  - Error handling preserves existing behavior
- **Test Data**: Mock request objects, test database records, mock agent responses

**## Documentation Planning For Each Component**
- **Updates to Existing Documentation**:
  - Update API documentation to reflect new controller locations
  - Update controller JSDoc comments with new import paths
- **New Documentation Required**:
  - Create README.md in `databases/api/controllers/` explaining general database operation controllers
  - Create README.md in `subsystems/5_epii/controllers/` explaining agent-specific controllers
  - Document chat controller dispatch logic
  - Update OpenAPI/Swagger documentation with new structure

---

### Component Analysis: Services Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/services/`

**## Current Functionality**
- Provides business logic and external service integrations
- Handles database operations and API communications
- Implements caching and optimization strategies
- Manages complex workflows and data transformations

**## Files/Subcomponents**
- `bpMCPService.mjs`: Core service for Bimba-Pratibimba MCP WebSocket client with document cache
- `analysis.service.mjs`: Document analysis workflow management and session tracking
- `crystallization.service.mjs`: Document crystallization and Notion synchronization
- `bimbaKnowing.service.mjs`: Enhanced BimbaKnowing tool with QL-aware queries
- `epii-llm.service.mjs`: LLM operations with Google Generative AI and LangSmith tracing
- `neo4j.service.mjs`: Neo4j graph database integration via LangChain
- `qdrant.service.mjs`: Qdrant vector database client configuration
- `mcp.service.mjs`: Shared MCP client service (placeholder implementation)

**## Dependencies**
- **Depends on**: External APIs (Neo4j, Qdrant, Google AI), WebSocket clients, Models, Utils
- **Depended on by**: Controllers, Pipelines

**## Proposed Location in Bimba Structure**
- Database services → `friendly-file-backend/databases/`
  - `bpMCPService.mjs` → `databases/bpmcp/bpMCPService.mjs`
  - `neo4j.service.mjs` → `databases/neo4j/neo4j.service.mjs`
  - `qdrant.service.mjs` → `databases/lightrag/qdrant.service.mjs` (part of LightRAG)
  - `mcp.service.mjs` → `databases/shared/mcp.service.mjs`
- Agent-specific services → respective subsystems:
  - `analysis.service.mjs` → `subsystems/5_epii/services/analysis.service.mjs`
  - `crystallization.service.mjs` → `subsystems/5_epii/services/crystallization.service.mjs`
  - `bimbaKnowing.service.mjs` → `subsystems/0_anuttara/services/bimbaKnowing.service.mjs`
  - `epii-llm.service.mjs` → `subsystems/2_parashakti/services/llm.service.mjs`

**## Migration Considerations**
- **Database vs Agent Classification**: Clear distinction between database operations (universal) and agent-specific functionality
- **6-Database Structure**: Aligns with neo4j, lightrag-neo4j, lightrag-qdrant, mongodb, notion, bpmcp structure
- **MCP Services**: Database-related MCP services grouped under respective database directories
- **LLM Service**: Moves to Parashakti subsystem (harmonic layer) and can be generalized for multiple agents
- **Import Dependencies**: Extensive import path updates needed to reflect databases/ vs subsystems/ structure
- **Service Discovery**: Implement clear patterns for accessing database services vs agent services
- **Configuration Management**: Database services need accessible configuration from databases/ structure
- **Testing**: Each service needs testing to ensure database operations vs agent functionality distinction is maintained

**## Detailed Migration Steps**
- **File Operations**:
  - Move `services/bpMCPService.mjs` → `databases/bpmcp/bpMCP.service.mjs`
  - Move `services/neo4j.service.mjs` → `databases/neo4j/neo4j.service.mjs`
  - Move `services/qdrant.service.mjs` → `databases/lightrag/qdrant.service.mjs`
  - Move `services/mcp.service.mjs` → `databases/shared/services/mcp.service.mjs`
  - Move `services/analysis.service.mjs` → `subsystems/5_epii/services/analysis.service.mjs`
  - Move `services/crystallization.service.mjs` → `subsystems/5_epii/services/crystallization.service.mjs`
  - Move `services/bimbaKnowing.service.mjs` → `subsystems/0_anuttara/services/bimbaKnowing.service.mjs`
  - Move `services/epii-llm.service.mjs` → `subsystems/2_parashakti/services/llm.service.mjs`

- **Internal Code Modifications**:
  - **bpMCP.service.mjs**: Refactor configuration to accept parameters from central config
  - **neo4j.service.mjs**: Ensure it only handles general graph operations, not agent-specific queries
  - **llm.service.mjs**: Generalize for use by multiple agents, remove Epii-specific hardcoding
  - **analysis.service.mjs**: Update to use Epii subsystem structure for dependencies
  - **crystallization.service.mjs**: Update to use Epii-specific utilities and Notion operations

- **Dependency Resolution - Import Path Updates**:
  - **For bpMCP.service.mjs** (moved to databases/bpmcp/):
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../shared/models/Document.model.mjs'`
    - Change `import { cache } from '../utils/cache.utils.mjs'` → `import { cache } from '../shared/utils/cache.utils.mjs'`
    - Change `import { documentCache } from '../utils/documentCache.utils.mjs'` → `import { documentCache } from '../shared/utils/documentCache.utils.mjs'`

  - **For neo4j.service.mjs** (moved to databases/neo4j/):
    - Change `import { graphData } from '../utils/graphData.utils.mjs'` → `import { graphData } from '../shared/utils/graphData.utils.mjs'`
    - Change `import { ql } from '../utils/ql.utils.mjs'` → `import { ql } from '../shared/utils/ql.utils.mjs'`

  - **For qdrant.service.mjs** (moved to databases/lightrag/):
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../shared/models/Document.model.mjs'`

  - **For analysis.service.mjs** (moved to subsystems/5_epii/services/):
    - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../../databases/bpmcp/bpMCP.service.mjs'`
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
    - Change `import { documentUtils } from '../utils/document.utils.mjs'` → `import { documentUtils } from '../utils/document.utils.mjs'`
    - Change `import { AnalysisSession } from '../models/AnalysisSession.model.mjs'` → `import { AnalysisSession } from '../models/AnalysisSession.model.mjs'`

  - **For crystallization.service.mjs** (moved to subsystems/5_epii/services/):
    - Change `import { notionUtils } from '../utils/notion.utils.mjs'` → `import { notionUtils } from '../utils/notion.utils.mjs'`
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
    - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../../databases/bpmcp/bpMCP.service.mjs'`

  - **For files that depend on moved services**:
    - Controllers: Update imports to new service locations
    - Pipelines: Update imports to new service locations
    - Other services: Update cross-service dependencies

**## Testing Requirements**
- **Unit Tests**: For each service
  - **bpMCP.service.mjs**: Test WebSocket connection, message sending/receiving, document caching
  - **neo4j.service.mjs**: Test graph queries, connection management, data transformation
  - **qdrant.service.mjs**: Test vector operations, embedding storage/retrieval
  - **analysis.service.mjs**: Test analysis workflow, session management, pipeline integration
  - **crystallization.service.mjs**: Test document crystallization, Notion synchronization
  - **llm.service.mjs**: Test LLM operations, prompt handling, response processing
- **Integration Tests**:
  - Test service interactions with databases
  - Test agent-specific services with their subsystem components
  - Test cross-subsystem service communication
- **Success Criteria**:
  - All database connections work correctly
  - Service APIs remain functional
  - Agent-specific services integrate properly with subsystems
  - Performance characteristics preserved
- **Test Data**: Mock database responses, test documents, sample LLM responses

**## Documentation Planning For Each Component**
- **Updates to Existing Documentation**:
  - Update service JSDoc comments with new locations and dependencies
  - Update architecture diagrams showing service distribution
- **New Documentation Required**:
  - Create README.md in each database service directory explaining purpose and usage
  - Create README.md in each subsystem service directory
  - Document service discovery patterns for databases vs agents
  - Create service interaction diagrams for new structure
  - Document configuration patterns for database services

---

### Component Analysis: Models Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/models/`

**## Current Functionality**
- Defines MongoDB schemas and data models
- Provides data validation and business rules
- Implements document structure for different entity types
- Manages relationships between entities

**## Files/Subcomponents**
- `Document.model.mjs`: Main document schema with analysis results, Notion integration, Bimba coordinates
- `User.model.mjs`: User schema with 6-identity structure (#5-0-X template), preferences, system usage
- `AnalysisSession.model.mjs`: Analysis session tracking with results and status
- `ChatMessage.model.mjs`: Chat message storage for Epii conversations
- `FileMetadata.mjs`: File upload metadata with analysis status
- `ActiveFile.mjs`: Active files for chat context with GridFS integration
- `Conversation.model.mjs`: LangChain-compatible conversation storage
- `UserMemory.model.mjs`: User memory with embeddings and QL tags

**## Dependencies**
- **Depends on**: Mongoose ODM, MongoDB
- **Depended on by**: Controllers, Services

**## Proposed Location in Bimba Structure**
- Core shared models → `friendly-file-backend/databases/shared/models/`
  - `Document.model.mjs` → `databases/shared/models/Document.model.mjs`
  - `User.model.mjs` → `databases/shared/models/User.model.mjs`
  - `FileMetadata.mjs` → `databases/shared/models/FileMetadata.model.mjs`
  - `ActiveFile.mjs` → `databases/shared/models/ActiveFile.model.mjs`
  - `Conversation.model.mjs` → `databases/shared/models/Conversation.model.mjs`
  - `UserMemory.model.mjs` → `databases/shared/models/UserMemory.model.mjs`
- Agent-specific models → respective subsystems:
  - `AnalysisSession.model.mjs` → `subsystems/5_epii/models/AnalysisSession.model.mjs`
  - `ChatMessage.model.mjs` → `subsystems/5_epii/models/ChatMessage.model.mjs`

**## Migration Considerations**
- **Database Structure**: Most models are shared across multiple agents and belong in `databases/shared/models/`
- **Naming Consistency**: Standardize model file naming (add `.model.mjs` suffix to all files)
- **Schema Validation**: Ensure all models have proper validation rules before migration
- **Index Optimization**: Review and optimize database indexes during migration
- **Import Path Updates**: Update all imports across controllers and services to reflect databases/ structure
- **Model Relationships**: Preserve existing relationships between models during migration
- **Testing**: Comprehensive model testing to ensure schema integrity is maintained
- **Database Migration**: Consider if any database schema changes are needed during the refactoring

**## Detailed Migration Steps**
- **File Operations**:
  - Move `models/Document.model.mjs` → `databases/shared/models/Document.model.mjs`
  - Move `models/User.model.mjs` → `databases/shared/models/User.model.mjs`
  - Rename and move `models/FileMetadata.mjs` → `databases/shared/models/FileMetadata.model.mjs`
  - Rename and move `models/ActiveFile.mjs` → `databases/shared/models/ActiveFile.model.mjs`
  - Move `models/Conversation.model.mjs` → `databases/shared/models/Conversation.model.mjs`
  - Move `models/UserMemory.model.mjs` → `databases/shared/models/UserMemory.model.mjs`
  - Move `models/AnalysisSession.model.mjs` → `subsystems/5_epii/models/AnalysisSession.model.mjs`
  - Move `models/ChatMessage.model.mjs` → `subsystems/5_epii/models/ChatMessage.model.mjs`

- **Internal Code Modifications**:
  - **All models**: Standardize file naming with `.model.mjs` suffix
  - **Shared models**: Ensure they contain only general schema definitions, no agent-specific logic
  - **Agent-specific models**: Update to reference shared models where appropriate
  - **Index optimization**: Review and optimize database indexes for new structure

- **Dependency Resolution - Import Path Updates**:
  - **For files that import shared models** (controllers, services in databases/):
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../shared/models/Document.model.mjs'`
    - Change `import { User } from '../models/User.model.mjs'` → `import { User } from '../shared/models/User.model.mjs'`
    - Change `import { FileMetadata } from '../models/FileMetadata.mjs'` → `import { FileMetadata } from '../shared/models/FileMetadata.model.mjs'`

  - **For files in subsystems that import shared models**:
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
    - Change `import { User } from '../models/User.model.mjs'` → `import { User } from '../../databases/shared/models/User.model.mjs'`

  - **For files in subsystems that import agent-specific models**:
    - Change `import { AnalysisSession } from '../models/AnalysisSession.model.mjs'` → `import { AnalysisSession } from '../models/AnalysisSession.model.mjs'`
    - Change `import { ChatMessage } from '../models/ChatMessage.model.mjs'` → `import { ChatMessage } from '../models/ChatMessage.model.mjs'`

  - **For files that import models from other locations**:
    - Update all import statements across controllers, services, pipelines, and utilities
    - Ensure consistent import paths based on new model locations

**## Testing Requirements**
- **Unit Tests**: For each model
  - Test schema validation rules
  - Test model relationships and references
  - Test default values and required fields
  - Test custom validation methods
  - Test index performance
- **Integration Tests**:
  - Test model interactions with database
  - Test cross-model relationships
  - Test agent-specific model integration with subsystems
- **Success Criteria**:
  - All schema validations work correctly
  - Database operations complete successfully
  - Model relationships preserved
  - No performance degradation
  - Agent-specific models integrate properly with subsystems
- **Test Data**: Sample documents, user records, analysis sessions, chat messages

**## Documentation Planning For Each Component**
- **Updates to Existing Documentation**:
  - Update model JSDoc comments with new locations
  - Update database schema documentation
  - Update API documentation referencing models
- **New Documentation Required**:
  - Create README.md in `databases/shared/models/` explaining shared model structure
  - Create README.md in `subsystems/5_epii/models/` explaining agent-specific models
  - Document model relationship patterns between shared and agent-specific models
  - Update database migration documentation
  - Create model usage guidelines for new structure

---

### Component Analysis: Pipelines Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/pipelines/`

**## Current Functionality**
- Implements the core Epii Analysis Pipeline following QL (-) cycle
- Processes documents through 6 stages from fetch to synthesis
- Manages document chunking, analysis, and Notion payload generation
- Provides modular, refactored pipeline architecture

**## Files/Subcomponents**
- `epii_analysis_pipeline_refactored.mjs`: Main pipeline entry point and orchestration
- `stages/stage_minus5.mjs`: Document fetching and preprocessing
- `stages/stage_minus4.mjs`: Context gathering and Bimba map integration
- `stages/stage_minus3.mjs`: Document chunking and LightRAG ingestion
- `stages/stage_minus2.mjs`: Core analysis engine with chunk processing
- `stages/stage_minus1.mjs`: Analysis synthesis and core element definition
- `stages/stage_minus0.mjs`: Notion payload generation and finalization
- `epii_analysis_pipeline.mjs`: Original monolithic pipeline (deprecated)

**## Dependencies**
- **Depends on**: Services (bpMCPService, epii-llm), Utils (document, content, notion), Models
- **Depended on by**: Controllers (analysis, chat), Services (analysis)

**## Proposed Location in Bimba Structure**
- Epii-specific pipeline → `friendly-file-backend/subsystems/5_epii/pipelines/`
  - `epii_analysis_pipeline_refactored.mjs` → `subsystems/5_epii/pipelines/epii_analysis_pipeline.mjs`
  - `stages/` → `subsystems/5_epii/pipelines/stages/`
    - `stage_minus5.mjs` → `pipelines/stages/stage_minus5.mjs`
    - `stage_minus4.mjs` → `pipelines/stages/stage_minus4.mjs`
    - `stage_minus3.mjs` → `pipelines/stages/stage_minus3.mjs`
    - `stage_minus2.mjs` → `pipelines/stages/stage_minus2.mjs`
    - `stage_minus1.mjs` → `pipelines/stages/stage_minus1.mjs`
    - `stage_minus0.mjs` → `pipelines/stages/stage_minus0.mjs`

**## Migration Considerations**
- **Agent-Specific Pipeline**: The Epii analysis pipeline is specific to the Epii agent and should be housed within the 5_epii subsystem
- **Pipeline Integration**: Stages should be nested within the agent's pipeline integration for proper modularity
- **Agent Alignment**: This keeps pipelines and agent-specific orchestrations stored in the correct places
- **Import Path Updates**: Extensive updates needed for database services, shared utils, and models imports
- **Database Dependencies**: Pipeline will access database services from `../../databases/` structure
- **Shared Utils**: Pipeline will access shared QL and graph utilities from `../../databases/shared/utils/`
- **Agent Utils**: Pipeline will access Epii-specific document utils from `../utils/`
- **Testing**: Each stage needs individual testing plus integration testing for the full pipeline within the Epii subsystem
- **Deprecation**: Remove the deprecated monolithic pipeline file during migration
- **Documentation**: Update pipeline documentation to reflect agent-specific organization

**## Detailed Migration Steps**
- **File Operations**:
  - Move `pipelines/epii_analysis_pipeline_refactored.mjs` → `subsystems/5_epii/pipelines/epii_analysis_pipeline.mjs`
  - Move `pipelines/stages/stage_minus5.mjs` → `subsystems/5_epii/pipelines/stages/stage_minus5.mjs`
  - Move `pipelines/stages/stage_minus4.mjs` → `subsystems/5_epii/pipelines/stages/stage_minus4.mjs`
  - Move `pipelines/stages/stage_minus3.mjs` → `subsystems/5_epii/pipelines/stages/stage_minus3.mjs`
  - Move `pipelines/stages/stage_minus2.mjs` → `subsystems/5_epii/pipelines/stages/stage_minus2.mjs`
  - Move `pipelines/stages/stage_minus1.mjs` → `subsystems/5_epii/pipelines/stages/stage_minus1.mjs`
  - Move `pipelines/stages/stage_minus0.mjs` → `subsystems/5_epii/pipelines/stages/stage_minus0.mjs`
  - Delete `pipelines/epii_analysis_pipeline.mjs` (deprecated monolithic version)

- **Internal Code Modifications**:
  - **Main pipeline**: Update orchestration logic to use new subsystem structure
  - **Stage imports**: Update all stage imports to use relative paths within subsystem
  - **Service integration**: Update to use both database services and agent-specific services
  - **Configuration**: Ensure pipeline configuration is accessible from subsystem location

- **Dependency Resolution - Import Path Updates**:
  - **For main pipeline file** (`subsystems/5_epii/pipelines/epii_analysis_pipeline.mjs`):
    - Change `import stage_minus5 from './stages/stage_minus5.mjs'` → `import stage_minus5 from './stages/stage_minus5.mjs'` (no change, relative)
    - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../../databases/bpmcp/bpMCP.service.mjs'`
    - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
    - Change `import { analysisService } from '../services/analysis.service.mjs'` → `import { analysisService } from '../services/analysis.service.mjs'`

  - **For each stage file** (`subsystems/5_epii/pipelines/stages/*.mjs`):
    - Change `import bpMCPService from '../../services/bpMCPService.mjs'` → `import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs'`
    - Change `import { documentUtils } from '../../utils/document.utils.mjs'` → `import { documentUtils } from '../../utils/document.utils.mjs'`
    - Change `import { contentUtils } from '../../utils/content/utils.mjs'` → `import { contentUtils } from '../../utils/content/utils.mjs'`
    - Change `import { ql } from '../../utils/ql.utils.mjs'` → `import { ql } from '../../../databases/shared/utils/ql.utils.mjs'`
    - Change `import { graphData } from '../../utils/graphData.utils.mjs'` → `import { graphData } from '../../../databases/shared/utils/graphData.utils.mjs'`
    - Change `import { Document } from '../../models/Document.model.mjs'` → `import { Document } from '../../../databases/shared/models/Document.model.mjs'`
    - Change `import { notionUtils } from '../../utils/notion.utils.mjs'` → `import { notionUtils } from '../../utils/notion.utils.mjs'`

  - **For files that depend on the pipeline**:
    - **Analysis controller**: Change `import { epiiAnalysisPipeline } from '../pipelines/epii_analysis_pipeline_refactored.mjs'` → `import { epiiAnalysisPipeline } from '../pipelines/epii_analysis_pipeline.mjs'`
    - **Analysis service**: Update pipeline import to new location within subsystem
    - **Chat controller**: Update pipeline import for Epii mode

**## Testing Requirements**
- **Unit Tests**: For each stage
  - **Stage -5**: Test document fetching and preprocessing
  - **Stage -4**: Test context gathering and Bimba map integration
  - **Stage -3**: Test document chunking and LightRAG ingestion
  - **Stage -2**: Test core analysis engine with chunk processing
  - **Stage -1**: Test analysis synthesis and core element definition
  - **Stage -0**: Test Notion payload generation and finalization
- **Integration Tests**:
  - Test full pipeline execution from start to finish
  - Test pipeline integration with Epii subsystem services
  - Test pipeline access to database services
  - Test error handling and recovery at each stage
- **Performance Tests**:
  - Test pipeline performance with various document sizes
  - Test memory usage during pipeline execution
  - Test concurrent pipeline executions
- **Success Criteria**:
  - All stages execute successfully in sequence
  - Pipeline produces expected analysis results
  - Notion payloads are correctly formatted
  - Performance characteristics preserved
  - Error handling works correctly
- **Test Data**: Sample documents, mock Bimba maps, test analysis results

**## Documentation Planning For Each Component**
- **Updates to Existing Documentation**:
  - Update pipeline JSDoc comments with new locations and dependencies
  - Update stage documentation with new import paths
  - Update pipeline architecture diagrams
- **New Documentation Required**:
  - Create README.md in `subsystems/5_epii/pipelines/` explaining Epii analysis pipeline
  - Create README.md in `subsystems/5_epii/pipelines/stages/` explaining each stage
  - Document pipeline integration with subsystem architecture
  - Create pipeline flow diagrams showing new structure
  - Document pipeline configuration and environment setup
  - Create troubleshooting guide for pipeline issues

---

### Component Analysis: Utils Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/utils/`

**## Current Functionality**
- Provides utility functions for common operations across the application
- Implements caching strategies and data transformation
- Handles document processing and content generation
- Manages Bimba coordinate system operations

**## Files/Subcomponents**
- `cache.utils.mjs`: Caching mechanisms for graph data, Bimba map, MEF templates, LLM responses
- `document.utils.mjs`: Document processing, chunking, content extraction, LightRAG integration
- `notion.utils.mjs`: Notion payload formatting, property generation, update management
- `graphData.utils.mjs`: Bimba map transformation, coordinate processing, graph data utilities
- `ql.utils.mjs`: Quaternal Logic utilities, coordinate analysis, QL position determination
- `documentCache.utils.mjs`: Document cache management with MongoDB synchronization
- `analysisCache.utils.mjs`: Analysis results caching (being deprecated)
- `cacheTransition.utils.mjs`: Migration utilities for cache transition
- `content/`: Content processing utilities organized by function

**## Dependencies**
- **Depends on**: Services (bpMCPService), External APIs, Crypto, File system
- **Depended on by**: Pipelines, Services, Controllers

**## Proposed Location in Bimba Structure**
- Foundational shared utilities → `friendly-file-backend/databases/shared/utils/`
  - `ql.utils.mjs` → `databases/shared/utils/ql.utils.mjs` (foundational QL operations)
  - `graphData.utils.mjs` → `databases/shared/utils/graphData.utils.mjs` (foundational graph operations)
  - `cache.utils.mjs` → `databases/shared/utils/cache.utils.mjs` (general caching)
  - `documentCache.utils.mjs` → `databases/shared/utils/documentCache.utils.mjs` (general document caching)
  - `cacheTransition.utils.mjs` → `databases/shared/utils/cacheTransition.utils.mjs` (temporary)
- Agent-specific utilities → respective subsystems:
  - `document.utils.mjs` → `subsystems/5_epii/utils/document.utils.mjs` (Epii-specific document processing)
  - `notion.utils.mjs` → `subsystems/5_epii/utils/notion.utils.mjs` (Epii-specific Notion operations)
  - `content/` → `subsystems/5_epii/utils/content/` (Epii-specific content processing)
- Deprecated utilities → Remove during migration:
  - `analysisCache.utils.mjs` → Delete (functionality moved to documentCache)

**## Migration Considerations**
- **Foundational vs Agent-Specific**: QL and graphData utilities are foundational and shared; document and content utilities are Epii-specific
- **Agent Alignment**: Document processing utilities align with Epii agent functionality and should be housed there
- **Content Utils**: The content/ subdirectory is Epii-specific and should move with document utilities
- **Cache Consolidation**: Complete the transition from analysisCache to documentCache before migration - can delete analysisCache entirely
- **Import Dependencies**: Utilities are heavily used throughout the codebase, requiring extensive import updates
- **Database Access**: Agent-specific utilities will access database services via relative paths to databases/
- **Testing**: Each utility module needs comprehensive testing to ensure functionality is preserved
- **Documentation**: Update utility documentation to reflect foundational vs agent-specific organization
- **Deprecation Cleanup**: Remove deprecated utilities and transition utilities during migration

**## Detailed Migration Steps**
- **File Operations**:
  - Move `utils/ql.utils.mjs` → `databases/shared/utils/ql.utils.mjs`
  - Move `utils/graphData.utils.mjs` → `databases/shared/utils/graphData.utils.mjs`
  - Move `utils/cache.utils.mjs` → `databases/shared/utils/cache.utils.mjs`
  - Move `utils/documentCache.utils.mjs` → `databases/shared/utils/documentCache.utils.mjs`
  - Move `utils/cacheTransition.utils.mjs` → `databases/shared/utils/cacheTransition.utils.mjs` (temporary)
  - Move `utils/document.utils.mjs` → `subsystems/5_epii/utils/document.utils.mjs`
  - Move `utils/notion.utils.mjs` → `subsystems/5_epii/utils/notion.utils.mjs`
  - Move `utils/content/` → `subsystems/5_epii/utils/content/`
  - Delete `utils/analysisCache.utils.mjs` (deprecated)

- **Internal Code Modifications**:
  - **Shared utilities**: Ensure they contain only foundational logic, no agent-specific code
  - **Agent-specific utilities**: Update to use database services via proper import paths
  - **Content utilities**: Update all content processing utilities to use new structure
  - **Cache utilities**: Complete transition from analysisCache to documentCache

- **Dependency Resolution - Import Path Updates**:
  - **For shared utilities** (`databases/shared/utils/*.mjs`):
    - **ql.utils.mjs**: No internal imports typically, but update any if present
    - **graphData.utils.mjs**:
      - Change `import { ql } from './ql.utils.mjs'` → `import { ql } from './ql.utils.mjs'` (no change, same directory)
      - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../bpmcp/bpMCP.service.mjs'`
    - **cache.utils.mjs**:
      - Change `import { graphData } from './graphData.utils.mjs'` → `import { graphData } from './graphData.utils.mjs'` (no change)
    - **documentCache.utils.mjs**:
      - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../models/Document.model.mjs'`

  - **For agent-specific utilities** (`subsystems/5_epii/utils/*.mjs`):
    - **document.utils.mjs**:
      - Change `import bpMCPService from '../services/bpMCPService.mjs'` → `import bpMCPService from '../../databases/bpmcp/bpMCP.service.mjs'`
      - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
      - Change `import { ql } from './ql.utils.mjs'` → `import { ql } from '../../databases/shared/utils/ql.utils.mjs'`
      - Change `import { cache } from './cache.utils.mjs'` → `import { cache } from '../../databases/shared/utils/cache.utils.mjs'`

    - **notion.utils.mjs**:
      - Change `import { Document } from '../models/Document.model.mjs'` → `import { Document } from '../../databases/shared/models/Document.model.mjs'`
      - Change `import { ql } from '../utils/ql.utils.mjs'` → `import { ql } from '../../databases/shared/utils/ql.utils.mjs'`
      - Change `import { graphData } from '../utils/graphData.utils.mjs'` → `import { graphData } from '../../databases/shared/utils/graphData.utils.mjs'`

    - **content/*.mjs** (all files in content directory):
      - Update imports to use new utility locations
      - Change shared utility imports to `../../../databases/shared/utils/`
      - Change agent-specific utility imports to relative paths within subsystem

  - **For files that depend on moved utilities**:
    - **Pipeline stages**: Update imports to new utility locations
    - **Services**: Update imports based on whether they moved to databases/ or subsystems/
    - **Controllers**: Update imports to new utility locations

**## Testing Requirements**
- **Unit Tests**: For each utility module
  - **ql.utils.mjs**: Test QL coordinate parsing, position determination, validation
  - **graphData.utils.mjs**: Test Bimba map transformation, coordinate processing
  - **cache.utils.mjs**: Test caching mechanisms, cache invalidation, performance
  - **documentCache.utils.mjs**: Test document caching, MongoDB synchronization
  - **document.utils.mjs**: Test document processing, chunking, content extraction
  - **notion.utils.mjs**: Test Notion payload formatting, property generation
  - **content utilities**: Test each content processing function
- **Integration Tests**:
  - Test utility interactions with database services
  - Test agent-specific utilities with subsystem components
  - Test shared utilities across multiple subsystems
- **Performance Tests**:
  - Test caching performance and memory usage
  - Test document processing performance with large files
  - Test utility function execution times
- **Success Criteria**:
  - All utility functions work correctly
  - Performance characteristics preserved
  - Cache mechanisms function properly
  - Agent-specific utilities integrate with subsystems
  - Shared utilities accessible from all locations
- **Test Data**: Sample documents, test coordinates, mock cache data, Notion payloads

**## Documentation Planning For Each Component**
- **Updates to Existing Documentation**:
  - Update utility JSDoc comments with new locations and dependencies
  - Update utility usage examples in documentation
- **New Documentation Required**:
  - Create README.md in `databases/shared/utils/` explaining foundational utilities
  - Create README.md in `subsystems/5_epii/utils/` explaining agent-specific utilities
  - Create README.md in `subsystems/5_epii/utils/content/` explaining content processing utilities
  - Document utility usage patterns for new structure
  - Create utility function reference documentation
  - Document caching strategies and best practices

---

### Component Analysis: Routes Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/routes/`

**## Current Functionality**
- Defines API endpoints and HTTP route mappings
- Implements middleware for file uploads and request validation
- Provides RESTful API structure for different functional areas
- Handles route-specific middleware and authentication

**## Files/Subcomponents**
- `analysis.routes.mjs`: Document analysis endpoints
- `chat.routes.mjs`: Chat functionality endpoints
- `documents.routes.mjs`: Document CRUD operations with file upload
- `files.routes.mjs`: File management endpoints
- `agent.routes.mjs`: Agent interaction endpoints
- `graph.routes.mjs`: Graph data access endpoints
- `notion.routes.mjs`: Notion integration endpoints
- `nodeDetails.routes.mjs`: Node details endpoints
- `user.routes.mjs`: User management endpoints
- `bpmcp.routes.mjs`: BPMCP service endpoints
- `ingestion.routes.mjs`: Document ingestion endpoints

**## Dependencies**
- **Depends on**: Controllers, Express.js, Multer (file uploads)
- **Depended on by**: Main application entry point

**## Proposed Location in Bimba Structure**
- Shared API routes (general database operations) → `friendly-file-backend/databases/api/routes/`
  - `documents.routes.mjs` → `databases/api/routes/documents.routes.mjs` (general CRUD)
  - `files.routes.mjs` → `databases/api/routes/files.routes.mjs` (general file operations)
  - `user.routes.mjs` → `databases/api/routes/user.routes.mjs` (general user management)
  - `bpmcp.routes.mjs` → `databases/api/routes/bpmcp.routes.mjs` (general BPMCP operations)
  - `ingestion.routes.mjs` → `databases/api/routes/ingestion.routes.mjs` (general ingestion)
  - `chat.routes.mjs` → `databases/api/routes/chat.routes.mjs` (shared chat dispatch to agent services)
  - `graph.routes.mjs` → `databases/api/routes/graph.routes.mjs` (general graph database operations)
  - `notion.routes.mjs` → `databases/api/routes/notion.routes.mjs` (general Notion database operations)
  - `nodeDetails.routes.mjs` → `databases/api/routes/nodeDetails.routes.mjs` (general node operations)
  - `agent.routes.mjs` → `databases/api/routes/agent.routes.mjs` (general agent dispatch)
- Agent-specific functionality routes → respective subsystems:
  - `analysis.routes.mjs` → `subsystems/5_epii/routes/analysis.routes.mjs` (Epii-specific analysis)

**## Migration Considerations**
- **Database vs Functionality**: Routes for general database operations remain shared; specific functionalities move to agent subsystems
- **Chat Routes Shared**: Chat routes remain shared but dispatch to different agent-specific chat services
- **Graph/Notion Shared**: These handle general database operations, not agent-specific functionality
- **Analysis Routes Agent-Specific**: Analysis is specific to Epii functionality and should move to Epii subsystem
- **Controller Alignment**: Routes should align with their corresponding controller locations
- **Middleware Preservation**: Ensure file upload and validation middleware is preserved in shared routes
- **Route Mounting**: Update main application to mount both shared API routes and agent-specific routes
- **Service Dispatch**: Shared routes will dispatch to appropriate database services or agent services
- **Authentication**: Standardize authentication middleware across shared and agent-specific routes
- **Testing**: Comprehensive route testing to ensure general operations remain accessible while agent-specific functionality is properly routed

---

### Component Analysis: Config Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/config/`

**## Current Functionality**
- Provides configuration management for the application
- Handles database connections and external service setup
- Manages CORS policies and security settings
- Centralizes environment variable management

**## Files/Subcomponents**
- `db.config.mjs`: MongoDB connection configuration with environment variable loading
- `cors.config.mjs`: CORS policy configuration for cross-origin requests

**## Dependencies**
- **Depends on**: Environment variables, Mongoose, dotenv
- **Depended on by**: Main application entry point

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-backend/config/` (remains at root level)
  - `db.config.mjs` → `config/db.config.mjs`
  - `cors.config.mjs` → `config/cors.config.mjs`

**## Migration Considerations**
- **Root Level Preservation**: Configuration should remain at the root level for easy access
- **Environment Management**: Ensure environment variables remain accessible from all subsystems
- **Configuration Expansion**: Consider adding subsystem-specific configuration files
- **Security**: Review and enhance security configurations during migration
- **Documentation**: Update configuration documentation
- **Testing**: Ensure configuration loading works correctly from all new locations

---

### Component Analysis: Subsystems Directory

**## Current Location**
- Path: `epii_app/friendly-file-backend/subsystems/`

**## Current Functionality**
- Represents the target Bimba-aligned architecture structure
- Currently contains placeholder directories and documentation
- Defines the intended organization according to QL positions 0-5
- Provides migration target for existing components

**## Files/Subcomponents**
- `README.md`: Architecture documentation and migration plan
- `0_anuttara/`: Foundational database services (placeholder with README)
- `1_paramasiva/`: QL/AT Logic implementation (placeholder)
- `2_parashakti/`: Harmonic layer services (placeholder)
- `3_mahamaya/`: Symbolic transformation (placeholder)
- `4_nara/`: API layer (placeholder)
- `5_epii/`: Notion integration and Epii agent (contains `epii.expert.agent.mjs`)

**## Dependencies**
- **Depends on**: None (placeholder structure)
- **Depended on by**: None currently (future migration target)

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-backend/subsystems/` (target structure, will be populated during migration)
- Each subsystem will follow internal QL structure:
  - `0_foundation/`: Core foundations and configurations
  - `1_utils/`: Subsystem-specific utilities
  - `2_services/`: Business logic services
  - `3_models/` or `3_stages/`: Data models or processing stages
  - `4_controllers/`: Request handlers and routes
  - `5_integration/`: Integration components

**## Migration Considerations**
- **Target Structure**: This represents the destination for the migration, not a source to be moved
- **Gradual Population**: Subsystems will be populated as components are migrated from their current locations
- **Internal Organization**: Each subsystem should follow the 0-5 QL internal structure where it makes sense
- **Documentation**: Update subsystem READMEs as components are migrated
- **Existing Content**: The current `epii.expert.agent.mjs` in 5_epii should be reviewed and potentially reorganized
- **Testing**: Each subsystem will need its own testing strategy and test files
- **Integration**: Ensure subsystems can communicate effectively with shared components
- **Validation**: Validate that the subsystem structure works as intended during migration

---

## Back2Front Components (friendly-file-back2front) - Phase 2 Analysis

### Component Analysis: A2A Framework Core

**## Current Location**
- Path: `epii_app/friendly-file-back2front/` (root files)

**## Current Functionality**
- Implements Agent-to-Agent (A2A) communication framework
- Provides standardized protocol for agent communication following Google's A2A specification
- Manages task state and QL cycle transitions
- Enables interoperability between different agents in the system

**## Files/Subcomponents**
- `a2a-message.schema.js`: Message schema with Bimba coordinate integration
- `a2a-server.js`: WebSocket server implementation for A2A protocol
- `a2a-service.js`: Main entry point for A2A service
- `epii-agent-client.js`: Epii agent client implementation
- `task-state-manager.js`: Task state management with QL transitions
- `integration.js`: Integration guide for existing Epii agent

**## Dependencies**
- **Depends on**: WebSocket, UUID generation, Agent adapters
- **Depended on by**: Agent cards, Skills registry, Adapters

**## Proposed Location in Bimba Structure**
- Core A2A framework → `friendly-file-back2front/shared/`
  - `a2a-message.schema.js` → `shared/schemas/a2a-message.schema.js`
  - `a2a-server.js` → `shared/services/a2a-server.js`
  - `a2a-service.js` → `shared/services/a2a-service.js`
  - `task-state-manager.js` → `shared/services/task-state-manager.js`
  - `integration.js` → `shared/docs/integration.js`
- Agent-specific clients → respective subsystems:
  - `epii-agent-client.js` → `subsystems/5_epii/2_services/epii-agent-client.js`

**## Migration Considerations**
- **Framework Foundation**: Core A2A components should be shared since they serve all agents
- **Schema Centralization**: Message schemas belong in a shared schemas directory
- **Service Organization**: A2A server and service are foundational and should be shared
- **Client Distribution**: Agent-specific clients should move to their respective subsystems
- **Documentation**: Integration guide should be preserved in shared documentation
- **Testing**: Comprehensive testing needed for the A2A protocol implementation
- **Backward Compatibility**: Ensure existing integrations continue to work during migration

---

### Component Analysis: Agent Cards Directory

**## Current Location**
- Path: `epii_app/friendly-file-back2front/agent-cards/`

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-back2front/agent-cards/` (remains at current location)

**## Migration Considerations**
- **Preserve Structure**: Agent cards directory is well-organized and should remain as-is
- **Update References**: Update any import paths that reference moved components
- **Documentation**: Ensure agent card definitions remain accurate after component migrations

---

### Component Analysis: Adapters Directory

**## Current Location**
- Path: `epii_app/friendly-file-back2front/adapters/`

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-back2front/adapters/` (remains at current location)

**## Migration Considerations**
- **Preserve Structure**: Adapters directory is appropriately organized
- **Update Dependencies**: Update imports to reflect new locations of services and schemas
- **Testing**: Ensure adapters continue to function correctly with moved components

---

### Component Analysis: Skills Directory

**## Current Location**
- Path: `epii_app/friendly-file-back2front/skills/`

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-back2front/skills/` (remains at current location)

**## Migration Considerations**
- **Preserve Structure**: Skills directory organization aligns well with Bimba principles
- **Update Dependencies**: Update imports for any moved services or utilities
- **Testing**: Comprehensive testing of skills functionality after migration

---

### Component Analysis: Examples Directory

**## Current Location**
- Path: `epii_app/friendly-file-back2front/examples/`

**## Proposed Location in Bimba Structure**
- Path: `friendly-file-back2front/examples/` (remains at current location)

**## Migration Considerations**
- **Update Examples**: Modify example code to reflect new import paths and structure
- **Documentation**: Update example documentation to match new architecture
- **Testing**: Ensure examples continue to work as demonstrations of the framework

# Phase 2 Summary (Corrected)

Phase 2 has successfully mapped all components from Phase 1 to the corrected target Bimba structure with proper bifurcation. Key findings:

## Backend Migration Strategy (Corrected)
- **Bifurcated Structure**: Clear separation between `databases/` (universal database operations) and `subsystems/` (agent-specific functionality)
- **Database Components**: bpMCPService → `databases/bpmcp/`, neo4j → `databases/neo4j/`, qdrant → `databases/lightrag/`, etc.
- **Agent-Specific Components**: Epii analysis pipeline → `subsystems/5_epii/pipelines/`, Epii services → `subsystems/5_epii/services/`, Epii utilities → `subsystems/5_epii/utils/`
- **Shared Foundational**: QL and graphData utilities → `databases/shared/utils/`, models → `databases/shared/models/`
- **API Layer**: General database operation routes → `databases/api/routes/`, agent-specific functionality routes → respective subsystems
- **6-Database Alignment**: neo4j, lightrag-neo4j, lightrag-qdrant, mongodb, notion, bpmcp

## Back2Front Migration Strategy
- **Minimal Changes**: Most directories (agent-cards, adapters, skills, examples) remain in place
- **Shared Framework**: Core A2A components move to `shared/` for cross-agent usage
- **Agent Clients**: Move to respective subsystems

## Key Architectural Insights
- **Functionality-First**: Agent-specific pipelines and utilities properly housed with their agents
- **Database vs Agent Distinction**: Clear separation between universal database operations and agent-specific functionality
- **Modular Agent Design**: Each agent subsystem contains its own pipelines, services, utilities, controllers, and routes
- **Philosophical Alignment**: Backend structure reflects the bifurcated mod6 structure with proper QL alignment

## Next Steps for Phase 3
- Detailed dependency resolution planning
- Specific import path mapping for databases/ vs subsystems/ structure
- Testing strategy development
- Migration sequence planning

---

# Phase 3 Progress Summary

Phase 3 detailed planning has been completed for the core backend components:

## Completed Detailed Planning:
1. **Main Application Entry Point** - ✅ Complete with testing and documentation plans
2. **Controllers Directory** - ✅ Complete with detailed migration steps, dependency resolution, testing, and documentation
3. **Services Directory** - ✅ Complete with comprehensive file operations, code modifications, and testing requirements
4. **Models Directory** - ✅ Complete with standardization, import path updates, and testing strategies
5. **Pipelines Directory** - ✅ Complete with agent-specific migration, stage-by-stage planning, and performance testing
6. **Utils Directory** - ✅ Complete with shared vs agent-specific classification and comprehensive testing

## Key Phase 3 Achievements:
- **Exhaustive Dependency Resolution**: Detailed import path mappings for databases/ vs subsystems/ structure
- **Comprehensive Testing Strategies**: Unit, integration, and performance tests for each component
- **Detailed File Operations**: Specific move, rename, and delete operations for each component
- **Documentation Planning**: Complete documentation update and creation requirements
- **Internal Code Modifications**: Specific refactoring requirements for each component

## Remaining Components for Phase 3:
- Routes Directory (detailed planning needed)
- Config Directory (detailed planning needed)
- Subsystems Directory (detailed planning needed)
- Back2Front Components (detailed planning needed)

The detailed planning demonstrates the complexity and thoroughness required for successful migration, with particular attention to the bifurcated databases/ vs subsystems/ architecture and proper agent-specific component organization.

---

# Phase 4: Plan Consolidation, Phased Execution Strategy, and README Documentation Guidance

This phase consolidates the detailed component migration plans from Phase 3 into a cohesive master plan, develops a phased execution strategy, and establishes comprehensive README documentation guidance.

## Part 1: Master Refactoring Plan Summary

### Overview of Consolidated Migration Plan

The Phase 3 detailed planning has revealed a comprehensive refactoring effort involving:

**Total Components to Migrate:** 6 major component categories
- Main Application Entry Point (1 file)
- Controllers Directory (9 controllers)
- Services Directory (8 services)
- Models Directory (8 models)
- Pipelines Directory (1 main pipeline + 6 stages)
- Utils Directory (8 utility modules + content subdirectory)

**Total File Operations:** Approximately 35+ individual file moves, renames, and deletions
**Total Import Path Updates:** 100+ import statements requiring updates
**New Directory Structure:** 15+ new directories to be created

### Cross-Component Dependencies Identified

1. **Critical Dependency Chain:**
   - Models → Services → Controllers → Routes → Main Application
   - Shared utilities must be migrated before agent-specific components
   - Database services must be migrated before agent services

2. **Circular Dependencies to Resolve:**
   - Services importing from each other across database/subsystem boundaries
   - Utilities accessing services that are also moving
   - Pipeline stages accessing both shared and agent-specific utilities

3. **Configuration Dependencies:**
   - Database configurations needed by multiple services
   - Environment variables accessed from new locations
   - Service discovery patterns for new structure

### Risk Assessment

**High Risk Areas:**
- Pipeline stage import path updates (complex nested dependencies)
- Service-to-service communication across database/subsystem boundaries
- Cache utility transitions and deprecation cleanup

**Medium Risk Areas:**
- Controller dispatch logic for agent-specific functionality
- Model relationship preservation during migration
- Testing framework updates for new structure

**Low Risk Areas:**
- Main application entry point updates
- Configuration file locations
- Documentation updates

## Part 2: Phased Execution Strategy

### Phase 1: Foundation Migration (Estimated Effort: High)
**Objective:** Establish the bifurcated structure and migrate foundational components

**Components:**
1. Create new directory structure (databases/, subsystems/)
2. Migrate shared models to `databases/shared/models/`
3. Migrate foundational utilities to `databases/shared/utils/`
4. Migrate database services to respective `databases/[service]/` directories
5. Update configuration files and main application entry point

**Deliverables:**
- Complete bifurcated directory structure
- All shared models accessible from new locations
- Foundational utilities (QL, graphData, caching) operational
- Database services (bpMCP, neo4j, qdrant) functional
- Server startup successful with new structure

**Success Criteria:**
- Application starts without errors
- Database connections established
- Shared utilities accessible from all locations
- No broken imports in migrated components

### Phase 2: Database API Layer Migration (Estimated Effort: Medium)
**Objective:** Migrate general database operation controllers and routes

**Components:**
1. Migrate database operation controllers to `databases/api/controllers/`
2. Migrate shared routes to `databases/api/routes/`
3. Update route mounting in main application
4. Update controller imports and dependencies

**Deliverables:**
- All general CRUD operations functional
- Chat dispatch system operational
- File upload and user management working
- Graph and Notion database operations accessible

**Success Criteria:**
- All API endpoints respond correctly
- Database operations complete successfully
- Route mounting works for both database and agent routes
- Middleware (authentication, validation) preserved

### Phase 3: Agent Subsystem Migration (Estimated Effort: High)
**Objective:** Migrate agent-specific components to subsystems

**Components:**
1. Migrate Epii analysis pipeline to `subsystems/5_epii/pipelines/`
2. Migrate agent-specific services to respective subsystems
3. Migrate agent-specific utilities to subsystems
4. Migrate agent-specific models and controllers
5. Update all cross-subsystem dependencies

**Deliverables:**
- Epii analysis pipeline fully operational in subsystem
- Agent-specific services accessible from subsystems
- Document and content utilities functional
- Analysis controller operational in Epii subsystem

**Success Criteria:**
- Full pipeline execution successful
- Agent-specific functionality preserved
- Cross-subsystem communication working
- Performance characteristics maintained

### Phase 4: Integration and Optimization (Estimated Effort: Medium)
**Objective:** Complete integration testing and optimize the new structure

**Components:**
1. Complete comprehensive testing suite
2. Optimize import paths and service discovery
3. Clean up deprecated components
4. Performance testing and optimization
5. Documentation completion

**Deliverables:**
- Complete test suite passing
- Performance benchmarks met
- All deprecated code removed
- Comprehensive documentation

**Success Criteria:**
- All tests passing (unit, integration, performance)
- No performance degradation
- Clean codebase with no deprecated components
- Complete documentation coverage

### Phase 5: Back2Front Integration (Estimated Effort: Low-Medium)
**Objective:** Complete Back2Front component migration and integration

**Components:**
1. Migrate A2A framework core components
2. Update agent cards and adapters
3. Complete skills registry migration
4. Integration testing with backend changes

**Deliverables:**
- A2A framework operational with new backend structure
- Agent communication preserved
- Skills registry functional

**Success Criteria:**
- Agent-to-agent communication working
- Frontend integration preserved
- All examples and tests passing

## Part 3: README Documentation Guidance

### Identified Key Directories for READMEs

#### Backend (`epii_app/friendly-file-backend/`)
1. **Root Level:**
   - `epii_app/friendly-file-backend/README.md`
   - `epii_app/friendly-file-backend/config/README.md`

2. **Database Layer:**
   - `databases/README.md`
   - `databases/shared/README.md`
   - `databases/shared/models/README.md`
   - `databases/shared/utils/README.md`
   - `databases/shared/services/README.md`
   - `databases/neo4j/README.md`
   - `databases/lightrag/README.md`
   - `databases/mongodb/README.md`
   - `databases/notion/README.md`
   - `databases/bpmcp/README.md`
   - `databases/api/README.md`
   - `databases/api/controllers/README.md`
   - `databases/api/routes/README.md`

3. **Subsystems Layer:**
   - `subsystems/README.md`
   - `subsystems/0_anuttara/README.md`
   - `subsystems/1_paramasiva/README.md`
   - `subsystems/2_parashakti/README.md`
   - `subsystems/3_mahamaya/README.md`
   - `subsystems/4_nara/README.md`
   - `subsystems/5_epii/README.md`
   - `subsystems/5_epii/pipelines/README.md`
   - `subsystems/5_epii/pipelines/stages/README.md`
   - `subsystems/5_epii/services/README.md`
   - `subsystems/5_epii/utils/README.md`
   - `subsystems/5_epii/utils/content/README.md`
   - `subsystems/5_epii/controllers/README.md`
   - `subsystems/5_epii/models/README.md`

#### Frontend (`epii_app/friendly-file-front/`)
1. **Root Level:**
   - `epii_app/friendly-file-front/README.md`
   - `src/README.md`

2. **Component Structure:**
   - `src/components/README.md`
   - `src/pages/README.md`
   - `src/services/README.md`
   - `src/hooks/README.md`
   - `src/contexts/README.md`
   - `src/utils/README.md`

#### Back2Front Integration (`epii_app/friendly-file-back2front/`)
1. **Root Level:**
   - `epii_app/friendly-file-back2front/README.md`

2. **Framework Components:**
   - `shared/README.md`
   - `shared/schemas/README.md`
   - `shared/services/README.md`
   - `adapters/README.md`
   - `agent-cards/README.md`
   - `skills/README.md`
   - `examples/README.md`

#### MCP Servers & Related Repositories
1. **MCP Infrastructure:**
   - `Cline/MCP/servers/src/README.md`
   - `Cline/MCP/servers/src/github/README.md`
   - `Cline/MCP/servers/src/filesystem/README.md`
   - `Cline/MCP/servers/src/gitlab/README.md`
   - `Cline/MCP/servers/src/sqlite/README.md`
   - `Cline/MCP/Bimba-Pratibimba-Memory-MCP/README.md`
   - `neo4j-mcp/README.md`

### Standard README Content Structure Template

#### General README Template Structure

```markdown
# [Directory/Module Name]

## 1. Purpose/Overview
Brief description of the primary responsibility and role of this directory/module within the broader system. What kind of code/functionality resides here?

## 2. Key Components/Files
List major files or sub-directories and their specific roles:
- `filename.ext`: Description of purpose and functionality
- `subdirectory/`: Description of subdirectory contents

## 3. Structure Overview (If Complex)
Brief explanation of the sub-directory structure and organization principles.

## 4. How to Use/Interact
Instructions on how other parts of the system use this module:
- API endpoints exposed (for routes/controllers)
- Key functions/classes to import (for services/utils)
- Integration patterns

## 5. Setup & Configuration
- Environment variables needed
- Configuration files relevant to this module
- Dependencies and prerequisites

## 6. Running Tests
Commands to run unit/integration tests specific to this module:
```bash
npm test [specific-test-pattern]
```

## 7. Dependencies
- **Internal Dependencies**: Other modules within this project
- **External Dependencies**: Major external libraries or services

## 8. Architectural Notes
- Important design decisions or patterns used
- Links to relevant diagrams or detailed architecture documents
- Bimba coordinate alignment (where applicable)

## 9. Contribution Guidelines
- Specific coding standards or practices for this module
- Code review requirements
- Testing requirements

## 10. To-Do / Future Enhancements
- Known issues or planned improvements
- Migration notes (during refactoring period)
```

#### Specialized Templates by Directory Type

**Database Service Directories:**
- Add sections for connection management, query patterns, and data models
- Include performance considerations and scaling notes
- Document backup and recovery procedures

**Subsystem Directories:**
- Add sections for agent-specific functionality and QL alignment
- Include integration patterns with other subsystems
- Document agent communication protocols

**Pipeline Directories:**
- Add sections for stage descriptions and data flow
- Include performance benchmarks and optimization notes
- Document error handling and recovery procedures

**API Directories:**
- Add sections for endpoint documentation and request/response formats
- Include authentication and authorization patterns
- Document rate limiting and security considerations

### Documentation Standards and Guidelines

1. **Consistency Requirements:**
   - All READMEs must follow the standard template structure
   - Use consistent terminology across all documentation
   - Maintain up-to-date links and references

2. **Content Quality Standards:**
   - Clear, concise language accessible to new team members
   - Practical examples and code snippets where helpful
   - Accurate and current information

3. **Maintenance Requirements:**
   - READMEs must be updated with any structural changes
   - Version information should be maintained
   - Links and references must be validated regularly

4. **Integration with Architecture:**
   - Each README should explain its role in the overall Bimba architecture
   - Cross-references to related components should be included
   - Architectural diagrams should be referenced where relevant

This comprehensive README documentation guidance ensures that the refactored codebase will be well-documented, maintainable, and accessible to both current and future developers working with the Epi-Logos system.

---

# Phase 3: Detailed Migration, Dependency Resolution, Testing, and Documentation Plan

This phase transforms the initial migration considerations from Phase 2 into granular, step-by-step migration plans for each component, including detailed code changes, import path resolution, testing strategies, and documentation requirements.

## Backend Components (friendly-file-backend) - Phase 3 Detailed Planning