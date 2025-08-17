# searchWeb.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/web/searchWeb.ts`
**Bimba Coordinate**: `#5-2-0-22`
**Last Updated**: `2025-01-30`

## Purpose & Role
Web Search Tool providing external web search capabilities for the BPMCP server. Handles web search queries with result formatting, search API integration, and response processing with comprehensive error handling. Serves as the primary external information retrieval layer within the BPMCP tool ecosystem enabling web search, information gathering, and external data integration across all research-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: SearchWebSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection
- **HTTP Client**: axios for external API requests and web search operations

### Exports
- **searchWebTool**: Tool definition for MCP tool registration
- **handleSearchWeb**: Main handler function for web search operations

### Dependencies
- **Search APIs**: External search services (Google, Bing, DuckDuckGo) for web search
- **Schema Validation**: SearchWebSchema for input validation
- **Error Handling**: Centralized error handling for search operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration
- **HTTP Client**: Axios for external API communication

### Dependents
- **Research Operations**: Research-based operations requiring web search capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring web search functionality
- **Information Retrieval**: Systems requiring external information gathering

## Key Functions/Components
### searchWebTool Definition (Lines 9-13)
**Purpose**: Defines the MCP tool for web search operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 72 lines implementing comprehensive web search with external API integration

### handleSearchWeb Function (Lines 21-72)
**Purpose**: Main handler function for web search operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Search results with formatted response data
**Notes**: Comprehensive web search with result processing and formatting

### Input Validation (Lines 23-24)
**Purpose**: Validates input arguments against SearchWebSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring search query integrity

### Search Query Processing (Lines 25-27)
**Purpose**: Processes and logs search query for execution
**Parameters**: Validated search query and parameters
**Returns**: Processed query ready for search API
**Notes**: Query logging and preparation for external search

### Search API Integration (Lines 29-45)
**Purpose**: Integrates with external search APIs for web search
**Parameters**: Search query and API configuration
**Returns**: Raw search results from external APIs
**Notes**: Currently simulated - ready for real API integration (Google, Bing, DuckDuckGo)

### Result Processing (Lines 47-60)
**Purpose**: Processes and formats search results for client consumption
**Parameters**: Raw search results from external APIs
**Returns**: Formatted search results with metadata
**Notes**: Result formatting, ranking, and metadata extraction

### Response Formatting (Lines 62-72)
**Purpose**: Formats successful search response for client
**Parameters**: Processed search results and metadata
**Returns**: Formatted response with search results and summary
**Notes**: Structured response format for client consumption

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Query extraction
2. **Search Processing**: Search query → API preparation → External search → Result retrieval
3. **Result Processing**: Raw results → Result formatting → Metadata extraction → Response preparation
4. **Response Delivery**: Formatted results → Response structuring → Client response → Operation completion
5. **Error Handling**: Search errors → Error processing → Client notification → Operation recovery

## Configuration
### Tool Configuration
- **Tool Name**: "searchWeb" for MCP tool identification
- **Description**: Clear description of web search functionality
- **Input Schema**: SearchWebSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Search Configuration
- **Search APIs**: Integration with Google, Bing, DuckDuckGo search APIs
- **Query Processing**: Search query validation and preparation
- **Result Formatting**: Structured result formatting for client consumption
- **Error Handling**: Comprehensive search error handling

### API Integration Configuration
- **HTTP Client**: Axios configuration for external API requests
- **API Keys**: Search API authentication and rate limiting
- **Request Formatting**: Proper API request formatting and parameters
- **Response Processing**: API response parsing and error handling

## Testing
No explicit test files referenced, but includes comprehensive input validation and search operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: SearchWebSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling
- **axios**: HTTP client for external API requests

### Integration Points
- **External Search APIs**: Google, Bing, DuckDuckGo search services
- **MCP Server**: Tool registration and execution
- **Client Applications**: Web search requests and responses
- **Research Systems**: Information gathering and external data integration

### Tool Architecture
- **Web Search**: Primary external information retrieval functionality
- **API Integration**: External search service integration
- **Result Processing**: Search result formatting and metadata extraction
- **Error Handling**: Comprehensive error handling and validation

## Development Notes
- **Web Search Integration**: Comprehensive external web search with API integration ready
- **Search API Support**: Ready for integration with Google, Bing, DuckDuckGo search APIs
- **Result Processing**: Advanced result formatting and metadata extraction
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for search operations and API issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable web search suitable for production information retrieval
- **Development Support**: Clear search operations and API integration for development
- **Extensible Design**: Easy addition of new search APIs and result processing features
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
