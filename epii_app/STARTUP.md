# Server Startup Instructions

## Backend Server
1. Navigate to backend directory:
   ```bash
   cd friendly-file-backend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   - Runs on port 3001 (configured in .env as BACKEND_PORT, used by index.mjs)

## Ingestion Pipeline
1. Ensure the file(s) to ingest are in the `friendly-file-backend/test_data` directory.
2. Navigate to backend directory:
   ```bash
   cd friendly-file-backend
   ```
3. Run the ingestion script:
   ```bash
   npm run ingest
   ```
   - This will process files in `test_data` and send them to the LightRAG server.

## Frontend Server
1. Navigate to frontend directory:
   ```bash
   cd friendly-file-front
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   - Runs on port 3000 (configured in vite.config.ts)

## Accessing the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Requirements
- Node.js installed
- MongoDB running (for backend)
- npm dependencies installed (`npm install` in both directories)

---

## LightRAG MCP Server

To start the Python LightRAG MCP server with the correct environment and configuration, run:

```bash
cd /Users/admin/Documents/Cline/MCP/lightrag-mcp-server/ && /Users/admin/Documents/Cline/MCP/lightrag-mcp-server/venv_312/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

This launches the FastAPI server on port 8001 using the paid Gemini model, with verbose logging and UUID fix active.

## Graphiti MCP Server

To start the Graphiti MCP server for temporal knowledge graph functionality:

**Prerequisites:**
- Ensure you have configured the `.env` file in the Graphiti MCP server directory
- Neo4j database should be running with the "pratibimba" database created
- Google Gemini API key should be set in the environment

**Setup (First Time Only):**
```bash
cd /Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/graphiti-mcp-server
cp .env.example .env
# Edit .env file with your actual Neo4j credentials and OpenAI API key
```

**Start Command:**
```bash
cd /Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/graphiti-mcp-server && python3 start_server.py
```

This launches the Graphiti MCP server on port 8002 using the "pratibimba" Neo4j database for temporal knowledge graph storage.

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

A.  **Bimba-Pratibimba MCP Server (Node.js - Port 3030):**
    *Note: Start this server FIRST before the backend.*
    ```bash
    # Find and forcefully stop the process currently using port 3030
    lsof -ti :3030 | xargs kill -9 || true
    # Wait 1 second for the port to free up
    sleep 1
    # Navigate to the INTERNAL MCP server directory
    cd /Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/Bimba-Pratibimba-Memory-MCP && node build/index.js
    # Start the server using its build file

    ```

B.  **LightRAG MCP Server (Python/FastAPI/Uvicorn):**
    *Note: Start this server SECOND before the backend.*
    ```bash
    # Changes to LightRAG MCP dir, activates venv, starts Uvicorn server
    cd /Users/admin/Documents/Cline/MCP/lightrag-mcp-server/ && /Users/admin/Documents/Cline/MCP/lightrag-mcp-server/venv_312/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8001
    ```

C.  **Graphiti MCP Server (Python/FastMCP - Port 8000):**
    *Note: Start this server THIRD before the backend.*
    ```bash
    # Navigate to Graphiti MCP server directory and start the server
    cd /Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/graphiti-mcp-server && python3 -m mcp_server.graphiti_mcp_server --group-id default --transport sse
    ```

D.  **Backend (Node.js Server - Port 3001):**
    *Note: Start this server AFTER all three MCP servers are running.*
    ```bash
    # Kills any process using port 3001, changes to backend dir, starts server
    kill -9 $(lsof -ti:3001) || true && cd epii_app/friendly-file-backend && npm run dev
    ```

E.  **Frontend (Vite Dev Server - Port 3000):**
    *Note: Start this server LAST after the backend is running.*
    ```bash
    # Kills any process using port 3000, changes to frontend dir, starts dev server
    kill -9 $(lsof -ti:3000) || true && cd epii_app/friendly-file-front && npm run dev
    ```

**Additional Information about the Bimba-Pratibimba MCP Server:**
*   **Purpose:** Provides core Bimba/Pratibimba/Notion tools (like `getNodeOverview`, `queryBimbaGraph`, etc.).
*   **Location:** Runs from `/Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/Bimba-Pratibimba-Memory-MCP/`. This is part of the project directory.
*   **Connection:** The main backend (`epii_app/friendly-file-backend/services/bpMCPService.mjs`) connects to this server via WebSocket using the URL `ws://localhost:3030/mcp` (defined in the backend's `.env` file as `BP_MCP_WS_URL`).
*   **Verification:** Check terminal logs for "WebSocket MCP server running on port 3030".
*   **Troubleshooting:** If you see `ECONNREFUSED` errors in the backend logs, it means:
    - The MCP server is not running
    - The server is running on a different port than expected
    - There's a network issue preventing the connection

    Make sure to start the MCP server **before** starting the backend.

*   **Note about Duplication:** There are two copies of the MCP server in the system:
    - INTERNAL: `/Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/Bimba-Pratibimba-Memory-MCP/` (use this one)
    - EXTERNAL: `/Users/admin/Documents/Cline/MCP/Bimba-Pratibimba-Memory-MCP/` (ignore this one)

    Always use the INTERNAL copy for this project to avoid confusion.

**Verification Checklist:**

1. **Bimba-Pratibimba MCP Server:**
   * Terminal should show: "WebSocket MCP server running on port 3030"
   * No error messages about failed tool registrations

2. **LightRAG MCP Server:**
   * Terminal should show: "INFO: Application startup complete."
   * Server should be accessible at http://localhost:8001/docs

3. **Graphiti MCP Server:**
   * Terminal should show: "Starting Graphiti MCP server..." and "Server will be available at: http://localhost:8002"
   * Server should be accessible at http://localhost:8002
   * Check that it's using the "pratibimba" database (should see "Using Neo4j database: pratibimba" in logs)

4. **Backend Server:**
   * Terminal should show: "Server running on port 3001"
   * No WebSocket connection errors (ECONNREFUSED)
   * Successful initialization messages for Neo4jGraph, QdrantClient, etc.

5. **Frontend Server:**
   * Terminal should show: "Local: http://localhost:3000/"
   * Frontend should be accessible at http://localhost:3000
   * No console errors in browser developer tools

**If you encounter WebSocket connection errors:**
1. Make sure the Bimba-Pratibimba MCP Server is running on port 3030
2. Verify you're using the INTERNAL copy at `/Users/admin/Documents/Epi-Logos_Seed_Files/Cline/MCP/Bimba-Pratibimba-Memory-MCP/`
3. Check that the BP_MCP_WS_URL in the backend .env file is set to ws://localhost:3030/mcp
4. Restart the servers in the correct order: MCP → LightRAG MCP → Backend → Frontend
