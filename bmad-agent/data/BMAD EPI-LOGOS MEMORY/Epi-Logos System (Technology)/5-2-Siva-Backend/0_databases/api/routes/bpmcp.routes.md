# bpmcp.routes.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/api/routes/bpmcp.routes.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
BPMCP API routes providing HTTP endpoints for calling BPMCP MCP server tools. Handles tool invocation, result processing, timeout management, and specialized endpoints for document listing, coordinate resolution, and astrological data. Serves as the primary HTTP interface for frontend applications to access BPMCP functionality with comprehensive error handling and result formatting.

## System Integration
### Imports
- **express**: Express.js router for HTTP endpoint definition
- **bpmcpService**: BPMCP service for MCP server tool calls

### Exports
- **router**: Express router with BPMCP API endpoints

### Dependencies
- **BPMCP Service**: Core dependency for all MCP tool operations
- **Express.js**: Web framework for HTTP endpoint handling
- **BPMCP MCP Server**: External MCP server for tool execution

### Dependents
- **Frontend Applications**: Primary consumers of BPMCP API endpoints
- **Document Service**: Uses BPMCP routes for document operations
- **Analysis Pipeline**: Accesses BPMCP tools via HTTP endpoints
- **Backend Index**: Mounts BPMCP routes at /api/bpmcp

## Key Functions/Components
### POST /api/bpmcp/call-tool (Lines 16-79)
**Purpose**: Generic endpoint for calling any BPMCP tool with specialized handling
**Parameters**: toolName (string), args (object)
**Returns**: JSON response with tool results
**Notes**: Includes timeout handling for listDocuments, result format parsing, comprehensive error handling

### GET /api/bpmcp/list-tools (Lines 86-94)
**Purpose**: List all available BPMCP tools
**Parameters**: None
**Returns**: JSON array of available tools
**Notes**: Simple passthrough to BPMCP service listTools

### POST /api/bpmcp/resolveBimbaCoordinate (Lines 101-117)
**Purpose**: Resolve Bimba coordinate to associated Notion page URL
**Parameters**: targetCoordinate (string)
**Returns**: JSON response with resolved coordinate data
**Notes**: Validates coordinate parameter, handles resolution errors

### POST /api/bpmcp/astrology/current (Lines 124-200)
**Purpose**: Get current astrological data using Astrologer API
**Parameters**: location (object with latitude, longitude, timezone)
**Returns**: JSON response with astrological data
**Notes**: Epic 2 Story E2_F1_S2 implementation, includes RapidAPI integration

### Timeout Handling (Lines 27-52)
**Purpose**: Special timeout management for long-running listDocuments operations
**Parameters**: None (internal logic)
**Returns**: Empty array on timeout instead of error
**Notes**: 30-second timeout with Promise.race pattern, graceful degradation

### Result Processing (Lines 58-71)
**Purpose**: Parse BPMCP tool result format and extract actual data
**Parameters**: BPMCP tool result
**Returns**: Processed result data
**Notes**: Handles BPMCP content format with JSON parsing fallback

## Data Flow
1. **HTTP Request**: Frontend request → Express router → Route handler
2. **Tool Invocation**: Route handler → BPMCP service → MCP server tool execution
3. **Result Processing**: Tool result → Format parsing → JSON response preparation
4. **Response**: Processed result → HTTP response → Frontend application
5. **Error Handling**: Errors caught → Error logging → Error response with status codes

## Configuration
### API Endpoints
- **POST /call-tool**: Generic tool invocation endpoint
- **GET /list-tools**: Available tools listing endpoint
- **POST /resolveBimbaCoordinate**: Coordinate resolution endpoint
- **POST /astrology/current**: Astrological data endpoint

### Timeout Settings
- **listDocuments Timeout**: 30 seconds for document listing operations
- **Promise.race Pattern**: Timeout vs actual request completion
- **Graceful Degradation**: Empty array return on timeout

### External API Integration
- **RapidAPI Key**: Hardcoded API key for Astrologer API
- **Default Location**: New York coordinates for astrological calculations
- **API Endpoints**: astrologer.p.rapidapi.com integration

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- `../../bpmcp/bpMCP.service.mjs` - BPMCP service for tool execution
- Express.js framework for HTTP handling

### Integration Points
- **Backend Index**: Mounts routes at /api/bpmcp prefix
- **Frontend Services**: Primary consumers of BPMCP API
- **Document Operations**: Document listing and management
- **Analysis Pipeline**: Tool access for document analysis

### External Services
- **BPMCP MCP Server**: Core tool execution service
- **Astrologer API**: External astrological data service
- **Notion API**: Via BPMCP for coordinate resolution

## Development Notes
- **Timeout Management**: Specialized handling for long-running document operations
- **Result Format Parsing**: Handles BPMCP MCP server response format variations
- **Error Resilience**: Comprehensive error handling with appropriate HTTP status codes
- **API Integration**: External API integration for astrological data (Epic 2)
- **Graceful Degradation**: Returns empty arrays instead of errors for timeouts
- **Logging Strategy**: Extensive logging for debugging and monitoring
- **Parameter Validation**: Input validation for required parameters
- **JSON Processing**: Robust JSON parsing with fallback handling
- **HTTP Standards**: Proper HTTP status codes and response formats
