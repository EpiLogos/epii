# a2a-server.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-back2front/shared/a2a/a2a-server.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
A2A (Agent-to-Agent) server main entry point implementing the Siva-Shakti communication layer. Provides WebSocket and HTTP server functionality for agent-to-agent communication using JSON-RPC protocol. Integrates with AG-UI gateway for frontend communication and manages agent registration, skill routing, and message orchestration across the Epi-Logos system.

## System Integration
### Imports
- **WebSocket (ws)**: WebSocket server implementation
- **http**: HTTP server for REST endpoints
- **uuid**: Unique identifier generation
- **EpiiAgentAdapter**: Epii agent integration adapter
- **epiiAgentCard**: Agent capability definitions
- **AGUIGateway**: Agent-to-UI communication gateway
- **AGUIEventTypes, createAGUIEvent**: AG-UI event system
- **a2a-message.schema**: Message validation and AG-UI event extraction

### Exports
- **A2A Server Instance**: WebSocket and HTTP server for agent communication
- **Agent Registration**: Agent card and capability endpoints
- **Skills Registry Integration**: Registry query and management endpoints

### Dependencies
- **Agent Adapters**: Epii agent adapter for skill execution
- **AG-UI Gateway**: Frontend communication integration
- **Skills Registry**: Bimba skills registry for skill routing
- **Environment Variables**: Google API key and configuration
- **Backend Services**: Mock Epii agent service integration

### Dependents
- **Frontend WebSocket Client**: Connects to A2A server for agent communication
- **Agent Adapters**: All agent adapters connect through this server
- **Skills System**: Skills execution routed through A2A server
- **AG-UI System**: Frontend updates via AG-UI gateway integration

## Key Functions/Components
### HTTP Server Creation (Lines 103-174)
**Purpose**: Create HTTP server with CORS support and REST endpoints
**Parameters**: req (IncomingMessage), res (ServerResponse)
**Returns**: HTTP server instance
**Notes**: Handles agent cards, registry queries, and JSON-RPC requests

### WebSocket Server Setup (Lines 300-400)
**Purpose**: Initialize WebSocket server for real-time agent communication
**Parameters**: WebSocket connection objects
**Returns**: WebSocket server instance
**Notes**: Handles connection management, message routing, and error handling

### Agent Card Endpoint (Lines 117-121)
**Purpose**: Serve agent capability definitions via HTTP
**Parameters**: HTTP request for /.well-known/agent/epii-agent
**Returns**: JSON agent card with capabilities
**Notes**: Standard agent discovery endpoint

### Registry Query Handler (Lines 124-174)
**Purpose**: Handle registry queries for available agents and skills
**Parameters**: POST request with query type
**Returns**: Registry data with agents, skills, and chat skills
**Notes**: Integrates with Bimba skills registry for dynamic discovery

### JSON-RPC Handler (Lines 177-250)
**Purpose**: Process JSON-RPC 2.0 requests for agent method calls
**Parameters**: JSON-RPC request with method and parameters
**Returns**: JSON-RPC response with results or errors
**Notes**: Validates protocol compliance and routes to appropriate handlers

### Mock Epii Agent Service (Lines 28-80)
**Purpose**: Mock implementation of Epii agent for testing and development
**Parameters**: message (string), state (object)
**Returns**: Mock agent response with perspective and metadata
**Notes**: Simulates real agent behavior for development purposes

### AG-UI Integration (Lines 400-500)
**Purpose**: Integrate with AG-UI gateway for frontend communication
**Parameters**: AG-UI events and WebSocket connections
**Returns**: Frontend event emissions
**Notes**: Bridges agent responses to frontend via AG-UI protocol

## Data Flow
1. **Server Initialization**: HTTP server created → WebSocket server attached → AG-UI gateway initialized
2. **Agent Registration**: Agent cards served → Registry queries handled → Skills discovery enabled
3. **Message Processing**: WebSocket messages received → JSON-RPC validation → Agent adapter routing
4. **Response Handling**: Agent responses processed → AG-UI events created → Frontend updates sent
5. **Error Management**: Errors caught → Error responses sent → Connection cleanup performed

## Configuration
### Environment Variables
- **GOOGLE_API_KEY**: Required for agent operations
- **Backend .env**: Loaded from friendly-file-backend/.env

### Server Settings
- **HTTP Port**: Configurable server port
- **WebSocket**: Attached to HTTP server
- **CORS**: Enabled for all origins with standard headers
- **JSON-RPC**: Version 2.0 protocol compliance

### Agent Integration
- **Epii Agent**: Primary agent adapter integration
- **Mock Services**: Development mock implementations
- **Registry Integration**: Dynamic skills and agent discovery

## Testing
Mock implementations provided for development and testing scenarios

## Related Files
### Core Dependencies
- `../../subsystems/5_epii/adapters/epii-agent-adapter.js` - Epii agent integration
- `../../subsystems/5_epii/agent-cards/index.js` - Agent capability definitions
- `../ag-ui/ag-ui-gateway.js` - Frontend communication gateway
- `../ag-ui/ag-ui-event-schema.js` - Event type definitions

### Message Handling
- `./a2a-message.schema.js` - Message validation and AG-UI event extraction
- `../services/bimba-skills-registry.js` - Skills registry integration

### Integration Points
- **Frontend WebSocket Client**: Real-time communication
- **Backend Services**: Agent service integration
- **Skills System**: Skill execution and routing

## Development Notes
- **Protocol Compliance**: Full JSON-RPC 2.0 implementation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **CORS Support**: Full CORS implementation for frontend integration
- **Mock Services**: Development mocks for testing without full backend
- **AG-UI Integration**: Seamless frontend communication via AG-UI gateway
- **Registry Integration**: Dynamic agent and skill discovery
- **WebSocket Management**: Proper connection lifecycle management
- **Environment Loading**: Proper environment variable loading from backend
- **Logging Strategy**: Comprehensive logging for debugging and monitoring
- **Modular Design**: Clean separation of concerns with adapter pattern
