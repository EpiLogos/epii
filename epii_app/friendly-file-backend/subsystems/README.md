# Bimba-Aligned Backend Architecture

This directory contains the backend subsystems organized according to the Bimba-aligned vertical slice architecture.

## Bimba Tech Architecture Alignment

Our implementation aligns with the #5-4 -Siva lens modules from the Bimba tech architecture. The #5-4 lens represents the Backend/-Siva aspect of the system, which is responsible for the logical processing and data management.

| Bimba Tech Module | Description | Implementation |
|------------------|-------------|----------------|
| #5-4-0 (Bimba Graph) | Neo4j graph database integration | 0_anuttara subsystem (bpMCPService) |
| #5-4-1 (QL/AT Logic) | Quaternary logic implementation | 1_paramasiva subsystem (epii_analysis_pipeline) |
| #5-4-2 (Harmonic Layer) | Data harmonization and integration | 2_parashakti subsystem (LLM services) |
| #5-4-3 (Symbolic Transform) | Symbolic data processing | 3_mahamaya subsystem (mef-templates) |
| #5-4-4 (API Layer) | REST API and WebSocket services | 4_nara subsystem (controllers, routes) |
| #5-4-5 (Notion as Bimba) | Notion integration | 5_epii subsystem (notion.service) |

## Architecture Overview

The backend components are organized into subsystems that align with the Bimba structure:

1. **#0 Anuttara** - Foundational void, database connections, core services
2. **#1 Paramasiva** - Quaternary logic, pipeline processing, analysis stages
3. **#2 Parashakti** - Vibrational templates, LLM integration, embeddings
4. **#3 Mahamaya** - Symbolic integration, templates, transformations
5. **#4 Nara** - Contextual application, API endpoints, controllers
6. **#5 Epii** - Integration, Epii agent, Notion integration

## Directory Structure

Each subsystem follows the 0-5 QL structure internally:

```
subsystems/
├── 0_anuttara/                      # #5-4-0 (Bimba Graph)
│   ├── 0_foundation/                # Database connections
│   ├── 1_utils/                     # Utility functions
│   ├── 2_services/                  # Core services
│   ├── 3_models/                    # Data models
│   ├── 4_controllers/               # Controllers
│   └── 5_integration/               # Integration components
├── 1_paramasiva/                    # #5-4-1 (QL/AT Logic)
│   ├── 0_foundation/                # Pipeline foundation
│   ├── 1_utils/                     # Pipeline utilities
│   ├── 2_services/                  # Pipeline services
│   ├── 3_stages/                    # Pipeline stages
│   ├── 4_controllers/               # Pipeline controllers
│   └── 5_integration/               # Pipeline integration
├── 2_parashakti/                    # #5-4-2 (Harmonic Layer)
│   ├── 0_foundation/                # LLM foundation
│   ├── 1_utils/                     # LLM utilities
│   ├── 2_services/                  # LLM services
│   ├── 3_models/                    # LLM models
│   ├── 4_controllers/               # LLM controllers
│   └── 5_integration/               # LLM integration
├── 3_mahamaya/                      # #5-4-3 (Symbolic Transform)
│   ├── 0_foundation/                # Template foundation
│   ├── 1_utils/                     # Template utilities
│   ├── 2_services/                  # Template services
│   ├── 3_models/                    # Template models
│   ├── 4_controllers/               # Template controllers
│   └── 5_integration/               # Template integration
├── 4_nara/                          # #5-4-4 (API Layer)
│   ├── 0_foundation/                # API foundation
│   ├── 1_utils/                     # API utilities
│   ├── 2_services/                  # API services
│   ├── 3_models/                    # API models
│   ├── 4_controllers/               # API controllers
│   └── 5_integration/               # API integration
└── 5_epii/                          # #5-4-5 (Notion as Bimba)
    ├── 0_foundation/                # Notion foundation
    ├── 1_utils/                     # Notion utilities
    ├── 2_services/                  # Notion services
    ├── 3_models/                    # Notion models
    ├── 4_controllers/               # Notion controllers
    └── 5_integration/               # Notion integration
```

## Current Implementation Status

While the directory structure above represents the ideal Bimba-aligned architecture, the current implementation is in transition. Many components are still in their original locations:

- **Services** are in `/services`
- **Controllers** are in `/controllers`
- **Routes** are in `/routes`
- **Models** are in `/models`
- **Pipelines** are in `/pipelines`

The subsystems directory structure is being established to gradually migrate components to their proper Bimba-aligned locations.

## Component Responsibilities

### 0_anuttara (Bimba Graph)
- Neo4j graph database integration
- Bimba-Pratibimba MCP WebSocket client
- Core database services
- Base data models

### 1_paramasiva (QL/AT Logic)
- Epii analysis pipeline
- Quaternary logic implementation
- Document processing stages
- Chunking and analysis

### 2_parashakti (Harmonic Layer)
- LLM service integration
- Embeddings and vector search
- Semantic harmonization
- LightRAG integration

### 3_mahamaya (Symbolic Transform)
- MEF templates
- Symbolic data transformation
- Template rendering
- Data mapping

### 4_nara (API Layer)
- REST API endpoints
- WebSocket services
- Request handling
- Response formatting

### 5_epii (Notion as Bimba)
- Notion integration
- Epii agent implementation
- Chat functionality
- Knowledge crystallization

## Data Flow

The data flow in the backend follows the Bimba-Pratibimba memory architecture:

1. **Input** - Document or query received via API
2. **Processing** - Analysis through the Epii pipeline stages
3. **Storage** - Results stored in Neo4j (Bimba) and Qdrant (Pratibimba)
4. **Retrieval** - Context retrieved from both sources for responses
5. **Output** - Synthesized response returned to the client

## Usage

To use the backend services, start the server with:

```bash
cd epii_app/friendly-file-backend
npm run dev
```

The server will be available at `http://localhost:3001`.

## API Endpoints

- `/api/epii-agent/analyze` - Analyze a document
- `/api/epii-agent/chat` - Chat with the Epii agent
- `/files/upload` - Upload a file for analysis
- `/api/graph` - Access the Bimba graph data

## Benefits of This Architecture

1. **Alignment with Bimba Structure** - The code organization directly reflects the Bimba subsystems
2. **Separation of Concerns** - Each subsystem component handles a specific aspect of the backend
3. **Improved Data Flow** - Data processing is aligned with the Bimba-Pratibimba memory architecture
4. **Scalability** - New features can be added to the appropriate subsystem without affecting others
5. **Consistency with Frontend** - The backend structure mirrors the frontend's vertical slice architecture
6. **Philosophical Alignment** - The implementation embodies the philosophical principles of the Bimba tech architecture
7. **Complete Bimba Mapping** - Each file can be identified by its #5-4-X-Y coordinate
8. **Modular Organization** - The 0-5 QL structure within each subsystem provides a consistent organization pattern
