# getNotionPageProperties.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/notion/getNotionPageProperties.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Notion Page Properties Retrieval Tool providing comprehensive page data access capabilities for Notion pages within the BPMCP server. Handles page property extraction, content retrieval, file content processing, and metadata analysis with flexible content inclusion options. Serves as the primary page data access layer within the BPMCP Notion tools ecosystem enabling comprehensive page analysis, property inspection, and content extraction across all Notion-based operations.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized MCP error handling
- **Schemas**: GetNotionPagePropertiesSchema for input validation and type safety
- **Utils**: zodToJsonSchema for schema conversion, handleError for error management
- **Types**: Tool, ToolDependencies for tool definition and dependency injection

### Exports
- **getNotionPagePropertiesTool**: Tool definition for MCP tool registration
- **handleGetNotionPageProperties**: Main handler function for page properties retrieval operations

### Dependencies
- **Notion Client**: Notion API client through ToolDependencies for workspace integration
- **Schema Validation**: GetNotionPagePropertiesSchema for input validation
- **Error Handling**: Centralized error handling for retrieval operations
- **MCP Protocol**: Model Context Protocol compliance for tool integration

### Dependents
- **Page Analysis**: Page-based operations requiring comprehensive property access capabilities
- **Tool Registry**: MCP server tool registration and execution
- **Client Applications**: Applications requiring Notion page data inspection functionality
- **Content Management**: Systems requiring detailed page property and content analysis

## Key Functions/Components
### getNotionPagePropertiesTool Definition (Lines 8-12)
**Purpose**: Defines the MCP tool for Notion page properties retrieval operations
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition for MCP registration
**Notes**: 184 lines implementing comprehensive Notion page properties retrieval with API integration

### handleGetNotionPageProperties Function (Lines 20-184)
**Purpose**: Main handler function for comprehensive Notion page properties retrieval
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Page properties and content with comprehensive metadata and optional file content
**Notes**: Advanced page analysis with flexible content inclusion and file processing capabilities

### Input Validation (Lines 22-27)
**Purpose**: Validates input arguments against GetNotionPagePropertiesSchema
**Parameters**: Raw input arguments from client
**Returns**: Validated arguments with type safety
**Notes**: Zod schema validation ensuring page ID and content inclusion options integrity

### Page Retrieval Logging (Line 27)
**Purpose**: Logs page properties retrieval details for monitoring and debugging
**Parameters**: Page ID information
**Returns**: Comprehensive logging for page operation tracking
**Notes**: Detailed logging with page awareness and operation tracking

### Page Data Retrieval (Lines 30-45)
**Purpose**: Retrieves page data from Notion API with comprehensive metadata
**Parameters**: Page ID and Notion client configuration
**Returns**: Complete page data with properties and metadata
**Notes**: Direct Notion API integration with comprehensive page data access

### Property Processing (Lines 47-80)
**Purpose**: Processes and formats page properties for comprehensive analysis
**Parameters**: Raw page properties and processing configuration
**Returns**: Formatted properties with type-specific handling and metadata
**Notes**: Advanced property processing with type-aware formatting and analysis

### Content Retrieval (Lines 82-120)
**Purpose**: Retrieves page content blocks when content inclusion is enabled
**Parameters**: Page ID, content inclusion flags, and retrieval configuration
**Returns**: Page content blocks with structured formatting
**Notes**: Optional content retrieval with block-level processing and formatting

### File Content Processing (Lines 122-160)
**Purpose**: Processes file properties and retrieves file content when enabled
**Parameters**: File properties, content inclusion flags, and file processing configuration
**Returns**: File content with metadata and processing information
**Notes**: Advanced file content processing with type-specific handling and content extraction

### Metadata Analysis (Lines 162-175)
**Purpose**: Analyzes page metadata and provides comprehensive page information
**Parameters**: Page data and metadata analysis configuration
**Returns**: Comprehensive metadata analysis with page insights
**Notes**: Advanced metadata processing with page relationship and context analysis

### Response Formatting (Lines 177-184)
**Purpose**: Formats comprehensive page properties response for client consumption
**Parameters**: Page properties, content, file data, and metadata
**Returns**: Formatted response with comprehensive page analysis and data
**Notes**: Structured response format for client consumption with complete page information

## Data Flow
1. **Request Reception**: Client request → Input validation → Schema validation → Parameter extraction
2. **Page Access**: Page ID → Notion API retrieval → Page data access → Metadata extraction
3. **Property Processing**: Raw properties → Type-specific formatting → Property analysis → Metadata processing
4. **Content Processing**: Content inclusion → Block retrieval → Content formatting → File processing
5. **Response Assembly**: Comprehensive data → Response formatting → Client delivery → Operation completion

## Configuration
### Tool Configuration
- **Tool Name**: "getNotionPageProperties" for MCP tool identification
- **Description**: Comprehensive description of Notion page properties retrieval functionality
- **Input Schema**: GetNotionPagePropertiesSchema for input validation
- **MCP Compliance**: Full Model Context Protocol compliance

### Retrieval Configuration
- **Page Access**: Comprehensive page data retrieval and property access
- **Content Inclusion**: Optional content retrieval with block-level processing
- **File Processing**: Optional file content extraction and processing
- **Metadata Analysis**: Comprehensive page metadata analysis and insights

### Notion Integration Configuration
- **API Integration**: Direct Notion API integration for page operations
- **Property Processing**: Type-aware property formatting and analysis
- **Content Management**: Block-level content retrieval and processing
- **File Handling**: File property processing and content extraction

## Testing
No explicit test files referenced, but includes comprehensive input validation and Notion API operation testing

## Related Files
### Core Dependencies
- **./schemas.js**: GetNotionPagePropertiesSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../types/index.js**: Tool and dependency type definitions
- **../../utils/error.js**: Centralized error handling

### Notion Tools Ecosystem
- **./queryNotion.ts**: Notion workspace search and discovery
- **./appendNotionBlock.ts**: Block content addition to pages
- **./crystallizeToNotion.ts**: Comprehensive page creation with coordinate integration
- **./schemas.ts**: Schema definitions for all Notion tools validation
- **./index.ts**: Notion tools module exports and organization

### Integration Points
- **Notion API**: Notion workspace integration and page data access
- **MCP Server**: Tool registration and execution
- **Client Applications**: Page properties requests and comprehensive analysis responses
- **Content Management**: Page analysis and property inspection systems

## Development Notes
- **Comprehensive Analysis**: Advanced Notion page properties retrieval with complete data access
- **Flexible Content**: Optional content and file processing with configurable inclusion
- **Property Processing**: Type-aware property formatting with comprehensive analysis
- **Input Validation**: Robust input validation with Zod schema validation
- **Error Handling**: Comprehensive error handling for Notion operations and API issues
- **MCP Compliance**: Full Model Context Protocol compliance for tool integration
- **Production Ready**: Scalable page analysis suitable for production Notion operations
- **Development Support**: Clear page operations and comprehensive data access for development
- **Extensible Design**: Easy addition of new property features and content processing
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
