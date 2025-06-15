# Epi-Logos Refactored Startup Instructions

## Quick Start (Automated)
Use the automated startup script to start all services:
```bash
./startup.sh
```

This will start all 6 components in the correct order with proper timing.

## Manual Startup Instructions

### Prerequisites
- Node.js installed
- MongoDB running
- Neo4j running with "pratibimba" database
- Qdrant running
- npm dependencies installed in all directories

### Startup Order (Important!)
1. BPMCP Server (Port 3030) - **START FIRST**
2. A2A Service (Port 3033)
3. LightRAG MCP (Port 8001)
4. Graphiti MCP (Port 8000)
5. Backend Server (Port 3001)
6. Frontend Server (Port 3000) - **START LAST**

---

## Individual Component Startup

### 1. BPMCP Server (Integrated)
**Location:** `friendly-file-backend/databases/bpmcp/`
```bash
cd friendly-file-backend/databases/bpmcp
node mcp-server/build/index.js
```
- Runs on port 3030
- **Must start FIRST** - other services depend on it

### 2. A2A Service (Agent-to-Agent Communication)
**Location:** `friendly-file-back2front/`
```bash
cd friendly-file-back2front
npm start
```
- Runs on port 3033
- Handles AG-UI protocol and skill execution

### 3. LightRAG MCP Server (Integrated)
**Location:** `friendly-file-backend/databases/lightrag/`
```bash
cd friendly-file-backend/databases/lightrag/mcp-server
source venv_312/bin/activate
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
```
- Runs on port 8001
- Handles document ingestion and vector search

### 4. Graphiti MCP Server (Integrated)
**Location:** `friendly-file-backend/databases/graphiti/`
```bash
cd friendly-file-backend/databases/graphiti/mcp-server
python3 -m mcp_server.graphiti_mcp_server --group-id default --transport sse
```
- Runs on port 8000
- Handles temporal knowledge graph operations

### 5. Backend Server
**Location:** `friendly-file-backend/`
```bash
cd friendly-file-backend
npm run dev
```
- Runs on port 3001
- Main API server

### 6. Frontend Server
**Location:** `friendly-file-front/`
```bash
cd friendly-file-front
npm run dev
```
- Runs on port 3000
- React/Vite development server

## Accessing the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **A2A Service:** http://localhost:3033
- **BPMCP Server:** ws://localhost:3030/mcp
- **LightRAG MCP:** http://localhost:8001/docs
- **Graphiti MCP:** http://localhost:8000

## Ingestion Pipeline
1. Place files in `friendly-file-backend/test_data/` directory
2. Navigate to backend directory:
   ```bash
   cd friendly-file-backend
   ```
3. Run ingestion:
   ```bash
   npm run ingest
   ```

# Epi-Logos Startup Procedure

This document outlines the steps to start all necessary services for the Epi-Logos application development environment on macOS.

**Prerequisites:**

*   Ensure Neo4j, Qdrant, and MongoDB databases are running.

**Startup Commands:**

Open separate terminal windows/tabs for each command. Execute them from the root project directory (`/Users/admin/Documents/Epi-Logos_Seed_Files`).

**Startup Script:**
- ./startup.sh
# Stop all servers
- ./shutdown.sh
**Recommended Startup Order:**

1. Start the External Bimba-Pratibimba MCP Server first (required for backend connectivity)
2. Start the LightRAG MCP Server (required for vector search and embeddings)
3. Start the Graphiti MCP Server (required for temporal knowledge graph)
4. Start the Backend Server
5. Start the Frontend Server

# A2A Service at - cd "/Users/admin/Documents/Epi-Logos_Seed_Files/epii_app/friendly-file-back2front" && npm start
# A2A epii agent example test - cd "/Users/admin/Documents/Epi-Logos_Seed_Files/epii_app/friendly-file-back2front" && npm run test:client

#Neo4j RAG Test - cd /Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/Bimba-Pratibimba-Memory-MCP && node test-bimba-knowing-websocket.js

## Refactored Integrated Commands (All MCP servers now integrated)

A.  **BPMCP Server (Integrated - Port 3030):**
    *Note: Start this server FIRST before the backend.*
    ```bash
    # Kill any process using port 3030 and start integrated BPMCP server
    kill -9 $(lsof -ti:3030) || true && sleep 1 && cd epii_app/friendly-file-backend/databases/bpmcp && node mcp-server/build/index.js
    ```

B.  **A2A Service (Port 3033):**
    *Note: Start this service SECOND.*
    ```bash
    # Start the A2A service for agent communication
    cd epii_app/friendly-file-back2front && npm start
    ```

C.  **LightRAG MCP Server (Integrated - Port 8001):**
    *Note: Start this server THIRD.*
    ```bash
    # Start integrated LightRAG MCP server with virtual environment
    cd epii_app/friendly-file-backend/databases/lightrag && cd mcp-server && source venv_312/bin/activate && python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
    ```

D.  **Graphiti MCP Server (Integrated - Port 8000):**
    *Note: Start this server FOURTH.*
    ```bash
    # Start integrated Graphiti MCP server
    cd epii_app/friendly-file-backend/databases/graphiti && cd mcp-server && python3 -m mcp_server.graphiti_mcp_server --group-id default --transport sse
    ```

E.  **Backend (Node.js Server - Port 3001):**
    *Note: Start this server FIFTH after all MCP servers are running.*
    ```bash
    # Start the main backend server
    kill -9 $(lsof -ti:3001) || true && cd epii_app/friendly-file-backend && npm run dev
    ```

F.  **Frontend (Vite Dev Server - Port 3000):**
    *Note: Start this server LAST after the backend is running.*
    ```bash
    # Start the frontend development server
    kill -9 $(lsof -ti:3000) || true && cd epii_app/friendly-file-front && npm run dev
    ```

**Additional Information about the Integrated MCP Servers:**

### **BPMCP Server (Integrated):**
*   **Purpose:** Provides core Bimba/Pratibimba/Notion tools (like `getNodeOverview`, `queryBimbaGraph`, etc.).
*   **Location:** Now integrated at `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/`
*   **Connection:** The main backend connects via WebSocket using `ws://localhost:3030/mcp`
*   **Verification:** Check terminal logs for "WebSocket MCP server running on port 3030"

### **LightRAG MCP Server (Integrated):**
*   **Purpose:** Handles document ingestion, vector search, and embeddings
*   **Location:** Now integrated at `epii_app/friendly-file-backend/databases/lightrag/mcp-server/`
*   **Virtual Environment:** Uses `venv_312` for Python dependencies
*   **Verification:** Check for "Application startup complete" and access http://localhost:8001/docs

### **Graphiti MCP Server (Integrated):**
*   **Purpose:** Manages temporal knowledge graph operations
*   **Location:** Now integrated at `epii_app/friendly-file-backend/databases/graphiti/mcp-server/`
*   **Database:** Uses Neo4j "pratibimba" database
*   **Verification:** Check for "Server will be available at: http://localhost:8000"

### **A2A Service:**
*   **Purpose:** Handles Agent-to-Agent communication and AG-UI protocol
*   **Location:** `epii_app/friendly-file-back2front/`
*   **Skills:** Manages all 4 agent skills including Analysis Pipeline
*   **Verification:** Check for successful startup on port 3033

**Verification Checklist (Refactored):**

1. **BPMCP Server (Integrated):**
   * Terminal should show: "WebSocket MCP server running on port 3030"
   * No error messages about failed tool registrations
   * Location: `epii_app/friendly-file-backend/databases/bpmcp/`

2. **A2A Service:**
   * Terminal should show successful startup on port 3033
   * All 4 skills should be registered and operational
   * AG-UI WebSocket connections established

3. **LightRAG MCP Server (Integrated):**
   * Terminal should show: "INFO: Application startup complete."
   * Server should be accessible at http://localhost:8001/docs
   * Virtual environment `venv_312` activated successfully
   * Location: `epii_app/friendly-file-backend/databases/lightrag/`

4. **Graphiti MCP Server (Integrated):**
   * Terminal should show: "Starting Graphiti MCP server..." and "Server will be available at: http://localhost:8000"
   * Server should be accessible at http://localhost:8000
   * Check that it's using the "pratibimba" database (should see "Using Neo4j database: pratibimba" in logs)
   * Location: `epii_app/friendly-file-backend/databases/graphiti/`

5. **Backend Server:**
   * Terminal should show: "Server running on port 3001"
   * No WebSocket connection errors (ECONNREFUSED)
   * Successful initialization messages for Neo4jGraph, QdrantClient, etc.
   * All MCP service connections established

6. **Frontend Server:**
   * Terminal should show: "Local: http://localhost:3000/"
   * Frontend should be accessible at http://localhost:3000
   * No console errors in browser developer tools
   * Auth route working (no 404 on /auth)

**If you encounter connection errors:**
1. Make sure all MCP servers are running in the correct integrated locations
2. Verify startup order: BPMCP → A2A → LightRAG → Graphiti → Backend → Frontend
3. Check that all environment variables are correctly set
4. Use the automated startup script: `./startup.sh` for proper timing and order

**🎉 All services are now integrated within the epii_app structure!**
