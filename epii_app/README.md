# Epi-Logos: Complete Refactored System

## Overview

**Epi-Logos** is a comprehensive **Agent-to-Agent (A2A) and Agent-to-User (AG-UI) communication platform** implementing the **Bimba-Pratibimba cosmic mind architecture**. The system features a **fully refactored three-tier architecture** with **integrated authentication**, **real-time communication**, and **coordinate-based agent organization**.

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Epi-Logos System Architecture                │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Port 3000) - Unified Subsystem Coordination         │
│  ├── Authentication & User Context (Nara Mode)                 │
│  ├── Document Canvas & Analysis Interface (Epii Mode)          │
│  ├── Meta2D/Meta3D Visualization (Anuttara/Paramasiva)         │
│  └── AG-UI Protocol Integration (Real-time Communication)      │
├─────────────────────────────────────────────────────────────────┤
│  Back2Front (Port 3033) - A2A + AG-UI Communication Hub       │
│  ├── Agent-to-Agent (A2A) Protocol Implementation             │
│  ├── AG-UI Gateway for Real-time Frontend Communication       │
│  ├── Skills Registry with Coordinate-based Organization       │
│  └── WebSocket Server for Multi-Agent Coordination            │
├─────────────────────────────────────────────────────────────────┤
│  Backend (Port 3001) - Bifurcated Universal + Agent Logic     │
│  ├── Databases/ - Universal Database Layer                    │
│  │   ├── BPMCP Server (Port 3030) - Universal Memory Access   │
│  │   ├── LightRAG Server (Port 8001) - Graph+Vector Fusion    │
│  │   ├── Graphiti Server (Port 8000) - Temporal Knowledge     │
│  │   └── Neo4j, MongoDB, Qdrant, Notion Integration           │
│  └── Subsystems/ - Six Agent-Specific Subsystems (0-5)        │
│      ├── 0_anuttara - Foundational database services          │
│      ├── 1_paramasiva - QL/AT Logic implementation            │
│      ├── 2_parashakti - Harmonic layer services               │
│      ├── 3_mahamaya - Symbolic transformation                 │
│      ├── 4_nara - Authentication & user context management    │
│      └── 5_epii - Document analysis & Notion integration      │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### **✅ Complete Authentication System**
- **JWT-based authentication** with secure session management
- **User registration and profile management** with persistent context
- **Protected routes** and authentication guards across all components
- **Mahamaya Matrix integration** for archetypal user foundation

### **✅ Real-time Agent Communication**
- **A2A Protocol**: Complete Google A2A specification implementation
- **AG-UI Protocol**: 16+ standard event types for frontend-agent communication
- **WebSocket Infrastructure**: Real-time bidirectional communication
- **Skills Registry**: Coordinate-based skill organization and intelligent routing

### **✅ Integrated Memory Architecture**
- **BPMCP Server**: 28+ tools for universal memory access across all databases
- **LightRAG Integration**: Graph+vector fusion with Neo4j and Qdrant backends
- **Graphiti Integration**: Temporal knowledge graph for dynamic context management
- **Cross-Database Operations**: Seamless integration across Neo4j, MongoDB, Qdrant, Notion

### **✅ Document Analysis Pipeline**
- **6-Stage QL Analysis Cycle**: Complete Epii agent implementation
- **Real-time Progress Tracking**: AG-UI events for live analysis updates
- **Notion Crystallization**: Automatic knowledge crystallization workflow
- **Multi-format Support**: PDF, DOCX, TXT, and other document formats

### **✅ Unified Subsystem Coordination**
- **Six Subsystems**: Complete QL organization (0-5) across frontend and backend
- **Coordinate-based Organization**: Bimba coordinate system for spatial agent organization
- **Fractal Architecture**: Self-similar patterns at different scales
- **Cross-Subsystem Integration**: Seamless data flow and state management

## Quick Start

### **Automated Startup (Recommended)**
```bash
# Start all services in correct order
./startup.sh
```

### **Manual Startup**
```bash
# 1. Start BPMCP Server (FIRST - other services depend on it)
cd friendly-file-backend/databases/bpmcp
node mcp-server/build/index.js

# 2. Start A2A Service (Agent communication hub)
cd friendly-file-back2front
npm start

# 3. Start LightRAG MCP Server
cd friendly-file-backend/databases/lightrag/mcp-server
source venv_312/bin/activate && python main.py

# 4. Start Graphiti MCP Server
cd friendly-file-backend/databases/graphiti/mcp-server
source venv/bin/activate && python main.py

# 5. Start Backend Server
cd friendly-file-backend
npm run dev

# 6. Start Frontend Server (LAST)
cd friendly-file-front
npm run dev
```

### **Access Points**
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **A2A Communication Hub**: ws://localhost:3033
- **BPMCP Server**: ws://localhost:3030

## System Components

### **[Frontend (`friendly-file-front/`)](friendly-file-front/README.md)**
- **Unified subsystem architecture** with six specialized subsystems
- **Complete authentication system** with JWT and user context management
- **Nara mode implementation** with Oracle interface and user settings
- **AG-UI protocol integration** for real-time agent communication
- **Document canvas** with embedded chat and analysis interface

### **[Backend (`friendly-file-backend/`)](friendly-file-backend/README.md)**
- **Bifurcated architecture** separating universal database functions from agent logic
- **Three integrated MCP servers** (BPMCP, LightRAG, Graphiti)
- **Six agent subsystems** with complete QL organization
- **Comprehensive Nara mode** with authentication and Mahamaya Matrix
- **Epii analysis pipeline** with 6-stage QL cycle implementation

### **[Back2Front (`friendly-file-back2front/`)](friendly-file-back2front/README.md)**
- **Complete A2A protocol implementation** with Google specification compliance
- **Full AG-UI integration** with 16+ standard event types
- **Skills registry** with coordinate-based organization and intelligent routing
- **WebSocket server** for real-time multi-agent coordination
- **Agent adapters** for seamless integration with backend subsystems

## Development

### **Prerequisites**
- Node.js 18+
- MongoDB running
- Neo4j running with "pratibimba" database
- Qdrant running
- Python 3.12+ (for MCP servers)

### **Installation**
```bash
# Install dependencies for all components
cd friendly-file-backend && npm install
cd ../friendly-file-front && npm install
cd ../friendly-file-back2front && npm install

# Setup Python environments for MCP servers
cd friendly-file-backend/databases/lightrag/mcp-server
python -m venv venv_312 && source venv_312/bin/activate && pip install -r requirements.txt

cd ../graphiti/mcp-server
python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

## Architecture Principles

### **Bimba-Pratibimba Cosmic Mind**
The system implements the **cosmic mind architecture** where:
- **Bimba (Original)**: Backend knowledge structures and processing
- **Pratibimba (Reflection)**: Frontend visualization and interaction
- **Siva-Shakti (Union)**: Back2Front communication layer bridging structure and expression

### **Coordinate-Based Organization**
All components are organized using **Bimba coordinates** (#X-Y-Z) for:
- **Spatial agent organization** and capability discovery
- **Natural task distribution** based on coordinate proximity
- **Fractal holographic architecture** with self-similar patterns

### **Quaternal Logic Integration**
The **0-5 QL structure** provides:
- **Context frame management** for different processing stages
- **Task state transitions** across multiple agents and cycles
- **Unified organization** at component, subsystem, and system levels

## User Modes

### **Epii Mode - Document Analysis & Knowledge Crystallization**
- **Document Upload**: Multi-format document processing with drag-and-drop interface
- **6-Stage Analysis Pipeline**: Complete QL cycle analysis with real-time progress tracking
- **Notion Integration**: Automatic crystallization of analysis results to Notion workspace
- **Chat Interface**: Document-aware conversations with Epii agent
- **Bimba Graph Integration**: Coordinate-based document organization and retrieval

### **Nara Mode - Contextual User Interaction**
- **Authentication System**: Secure login/logout with JWT-based session management
- **User Profile Management**: Complete user settings and preference controls
- **Oracle Interface**: Decanic consultations and archetypal guidance
- **Mahamaya Matrix**: 6-layer archetypal foundation for personalized interactions
- **Context-Aware Chat**: Personalized agent responses based on user archetypal foundation

### **Meta2D/Meta3D Modes - Visualization & Exploration**
- **Meta2D (Anuttara)**: 2D graph visualization with interactive node exploration
- **Meta3D (Paramasiva)**: 3D topological forms with diamond/torus structures
- **Real-time Updates**: Live visualization updates during document analysis
- **Coordinate Navigation**: Bimba coordinate-based exploration and discovery

## Integration Features

### **Real-time Communication**
- **WebSocket Connections**: Persistent connections for live updates across all modes
- **AG-UI Events**: 16+ standard event types for comprehensive frontend-agent communication
- **Progress Tracking**: Real-time analysis progress with stage-by-stage updates
- **Error Handling**: Comprehensive error management with user-friendly feedback

### **Cross-System Data Flow**
- **Document Lifecycle**: Complete tracking from upload through analysis to crystallization
- **User Context Propagation**: User authentication and preferences across all subsystems
- **Coordinate-Based Routing**: Intelligent task routing based on Bimba coordinate proximity
- **State Synchronization**: Bidirectional state management between frontend and agents

### **Memory Integration**
- **Universal Memory Access**: BPMCP server provides unified access to all knowledge systems
- **Graph+Vector Fusion**: LightRAG integration for semantic search and retrieval
- **Temporal Knowledge**: Graphiti integration for dynamic context and episode management
- **Cross-Database Operations**: Seamless operations across Neo4j, MongoDB, Qdrant, Notion

## Troubleshooting

### **Common Issues**
- **Port Conflicts**: Ensure ports 3000, 3001, 3030, 3033, 8000, 8001 are available
- **Database Connections**: Verify MongoDB, Neo4j, and Qdrant are running before startup
- **MCP Server Dependencies**: Ensure Python environments are properly configured
- **Authentication Issues**: Check JWT token configuration and user database setup

### **Service Dependencies**
1. **BPMCP Server** must start first (other services depend on it)
2. **Database services** (MongoDB, Neo4j, Qdrant) must be running
3. **A2A Service** should start before backend for proper agent registration
4. **Frontend** should start last to ensure all backend services are available

### **Logs and Debugging**
- **Backend Logs**: Check `friendly-file-backend/` console output for API and database issues
- **A2A Logs**: Monitor `friendly-file-back2front/` for agent communication issues
- **Frontend Logs**: Browser console for UI and WebSocket connection issues
- **MCP Server Logs**: Individual MCP server consoles for memory system issues

## Documentation

- **[Startup Instructions](STARTUP.md)** - Detailed startup procedures and troubleshooting
- **[Frontend Documentation](friendly-file-front/README.md)** - Complete frontend architecture and features
- **[Backend Documentation](friendly-file-backend/README.md)** - Backend subsystems and database integration
- **[Back2Front Documentation](friendly-file-back2front/README.md)** - A2A and AG-UI communication protocols

---

**Epi-Logos** represents a complete implementation of the **Bimba-Pratibimba cosmic mind architecture** with modern web technologies, providing a foundation for **agent-based knowledge work** and **real-time collaborative intelligence**.
