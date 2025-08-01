# queryNotion.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/notion/queryNotion.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Notion Query Tool providing Notion workspace search capabilities for the BPMCP server. Handles page and database search with query processing, result filtering, and response formatting with comprehensive error handling. Serves as the primary Notion integration layer within the BPMCP tool ecosystem enabling workspace search, content discovery, and Notion data access across all knowledge management operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: QueryNotionSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **queryNotionTool**: Tool definition for MCP tool registration
- **handleQueryNotion**: Main handler function for Notion search operations

### Dependencies
- **Notion Client**: Notion API client through ToolDependencies for workspace access
- **Schema Validation**: QueryNotionSchema for input validation
- **Error Handling**: Centralized error handling for search operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Knowledge Management**: Knowledge-based operations requiring Notion search capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring Notion workspace access
- **Content Discovery**: Systems requiring Notion content search and retrieval

## Key Functions/Components
### queryNotionTool Definition (Lines 8-12)
**Purpose**: Defines the MCP tool for Notion search operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 95 lines implementing comprehensive Notion workspace search with API integration

### handleQueryNotion Function (Lines 20-95)
**Purpose**: Main handler function for Notion search operations
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Search results with pages and databases from Notion workspace
**Notes**: Comprehensive Notion search with result processing and formatting

### Input Validation (Lines 22-24)
**Purpose**: Validates input arguments against QueryNotionSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring search query and parameters integrity

### Search Parameters Preparation (Lines 29-40)
**Purpose**: Prepares search parameters for Notion API request
**Parameters**: Validated search query and optional filters
**Returns**: Formatted search parameters for Notion API
**Notes**: Query preparation with optional filtering and pagination support

### Notion API Search (Lines 42-55)
**Purpose**: Executes search request against Notion API
**Parameters**: Search parameters and Notion client
**Returns**: Raw search results from Notion workspace
**Notes**: Notion API integration with error handling and result validation

### Result Processing (Lines 57-75)
**Purpose**: Processes and formats search results from Notion API
**Parameters**: Raw Notion search results
**Returns**: Formatted search results with metadata
**Notes**: Result formatting, type classification, and metadata extraction

### Page Processing (Lines 77-85)
**Purpose**: Processes page results with title and metadata extraction
**Parameters**: Page objects from Notion search results
**Returns**: Formatted page information with titles and properties
**Notes**: Page title extraction and property processing

### Database Processing (Lines 87-95)
**Purpose**: Processes database results with title and schema information
**Parameters**: Database objects from Notion search results
**Returns**: Formatted database information with titles and schemas
**Notes**: Database title extraction and schema processing

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Query extraction
2. **Search Preparation**: Search query → Parameter preparation → API formatting → Request preparation
3. **Notion Search**: API request → Notion workspace search → Result retrieval → Response validation
4. **Result Processing**: Raw results → Result formatting → Type classification → Metadata extraction
5. **Response Delivery**: Formatted results → Response structuring → Client response → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "queryNotion" for MCP tool identification
- **Description**: Clear description of Notion search functionality
- **Input Schema**: QueryNotionSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Search Configuration
- **Query Processing**: Search query validation and preparation
- **Result Filtering**: Optional filtering by page type and properties
- **Pagination Support**: Configurable result limits and pagination
- **Error Handling**: Comprehensive search error handling

### Notion API Configuration
- **Workspace Access**: Notion workspace search and content access
- **API Integration**: Notion API client for search operations
- **Authentication**: Notion API key authentication and authorization
- **Rate Limiting**: Proper rate limiting and API usage management

## Testing
No explicit test files referenced, but includes comprehensive input validation and Notion API operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: QueryNotionSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling

### Integration Points
- **Notion API**: Notion workspace search and content access
- **MCP Server**: Tool registration and execution
- **Client Applications**: Notion search requests and responses
- **Knowledge Management**: Notion content discovery and access systems

### Tool Architecture
- **Notion Search**: Primary Notion workspace search functionality
- **API Integration**: Notion API client integration and management
- **Result Processing**: Search result formatting and metadata extraction
- **Error Handling**: Comprehensive error handling and validation

## Development Notes
- **Notion Integration**: Comprehensive Notion workspace search with API integration
- **Search Capabilities**: Advanced search with filtering and pagination support
- **Result Processing**: Rich result formatting with page and database classification
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for search operations and API issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable Notion search suitable for production knowledge management
- **Development Support**: Clear search operations and API integration for development
- **Extensible Design**: Easy addition of new search features and result processing
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
