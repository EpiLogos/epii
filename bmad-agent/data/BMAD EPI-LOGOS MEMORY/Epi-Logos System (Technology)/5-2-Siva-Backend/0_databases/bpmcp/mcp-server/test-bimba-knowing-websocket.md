# test-bimba-knowing-websocket.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/test-bimba-knowing-websocket.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
WebSocket Testing Script for bimbaKnowing Tool providing comprehensive WebSocket-based testing and validation of bimbaKnowing MCP tool functionality with real-time communication. Handles WebSocket connection management, tool parameter testing, response validation, and comprehensive testing workflow coordination. Serves as the primary WebSocket testing utility enabling bimbaKnowing tool validation, real-time API testing, and advanced tool functionality verification with comprehensive error handling.

## System Integration
### Imports
- **WebSocket (ws)**: WebSocket client library for real-time communication with BPMCP server
- **dotenv**: Environment variable configuration for server connection settings

### Exports
- **Test Script**: Standalone WebSocket test script for bimbaKnowing tool validation and functionality testing
- **Testing Functions**: Comprehensive testing functions with WebSocket communication and response validation

### Dependencies
- **BPMCP WebSocket Server**: BPMCP MCP server providing WebSocket interface and bimbaKnowing tool functionality
- **bimbaKnowing Tool**: MCP tool providing semantic search and graph traversal capabilities
- **Environment Configuration**: Environment variables for WebSocket connection and testing setup

### Dependents
- **Tool Development**: Tool development workflow requiring bimbaKnowing functionality validation via WebSocket
- **Quality Assurance**: QA processes utilizing WebSocket test script for tool verification
- **Integration Testing**: Integration testing systems requiring WebSocket-based tool functionality validation
- **Development Workflow**: Development processes requiring WebSocket tool testing and validation

## Key Functions/Components
### testBimbaKnowingWebSocket Function (Lines 11-130)
**Purpose**: Main WebSocket testing function for bimbaKnowing tool with comprehensive parameter testing and response validation
**Parameters**: WebSocket connection and test parameters for bimbaKnowing tool validation
**Returns**: Test results with WebSocket response validation and error handling
**Notes**: 130 lines implementing comprehensive WebSocket test script with real-time communication and tool validation

### WebSocket Connection Management (Lines 16-20)
**Purpose**: Manages WebSocket connection to BPMCP server with comprehensive connection handling
**Parameters**: WebSocket URL and connection configuration for server communication
**Returns**: Established WebSocket connection for bimbaKnowing tool testing
**Notes**: Advanced WebSocket connection management with error handling and connection validation

### Test Parameters Setup (Lines 23-28)
**Purpose**: Configures test parameters for bimbaKnowing tool validation with comprehensive parameter coverage
**Parameters**: Query string, context depth, result limit, and focus coordinate for testing
**Returns**: Configured test parameters for tool validation and functionality testing
**Notes**: Comprehensive parameter setup enabling thorough tool functionality validation via WebSocket

### Response Processing (Lines 40-80)
**Purpose**: Processes bimbaKnowing tool responses with comprehensive validation and analysis
**Parameters**: WebSocket response data and validation criteria for result assessment
**Returns**: Processed response results with validation status and performance metrics
**Notes**: Advanced response processing with comprehensive validation and WebSocket communication handling

### Error Handling (Lines 81-130)
**Purpose**: Handles WebSocket communication errors with comprehensive error processing and reporting
**Parameters**: Error objects and WebSocket context for error handling and recovery
**Returns**: Error handling with detailed error reporting and connection recovery
**Notes**: Comprehensive error handling ensuring robust WebSocket communication and testing coverage

## Data Flow
1. **Test Initialization**: Script startup → Environment loading → WebSocket configuration → Connection establishment
2. **WebSocket Communication**: Connection setup → Parameter transmission → Server communication → Tool execution
3. **Tool Testing**: bimbaKnowing request → Tool execution → Response processing → Validation assessment
4. **Response Validation**: Response analysis → Result verification → Validation assessment → Status reporting
5. **Error Handling**: Error detection → Error processing → Recovery strategies → Test completion

## Configuration
**Environment Variables**: WS_URL for WebSocket server connection (default: ws://localhost:3030/mcp)
**Test Parameters**: Query, contextDepth, limit, focusCoordinate for comprehensive bimbaKnowing tool testing
**WebSocket Configuration**: WebSocket client configuration for server communication and testing

## Testing
WebSocket test script provides comprehensive bimbaKnowing tool validation with real-time communication and response verification

## Related Files
**bimbaKnowing Tool**: MCP tool being tested for functionality validation via WebSocket
**BPMCP WebSocket Server**: WebSocket server providing bimbaKnowing tool interface and communication
**test-bimba-knowing.js**: HTTP-based test script for bimbaKnowing tool functionality

## Development Notes
- **WebSocket Testing Excellence**: Comprehensive WebSocket test script enabling consistent bimbaKnowing tool validation and real-time functionality verification
- **Real-time Communication**: Advanced WebSocket integration with comprehensive communication and error handling
- **Parameter Validation**: Sophisticated parameter testing with comprehensive coverage and WebSocket validation
- **Response Verification**: Advanced response validation ensuring tool functionality and result accuracy via WebSocket
- **Error Handling Resilience**: Comprehensive error handling ensuring testing coverage and detailed error reporting
- **Development Support**: Clear testing boundaries and comprehensive WebSocket tool validation management
- **Quality Assurance**: Scalable WebSocket test script suitable for production tool validation and QA processes
- **BPMCP Alignment**: WebSocket test script integration with sophisticated Bimba coordinate system and MCP tool support
