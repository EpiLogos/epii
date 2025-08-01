# index.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/types/index.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Type Definitions providing comprehensive TypeScript interfaces and types for the BPMCP server architecture. Defines tool interfaces, database connections, service integrations, and dependency injection patterns with complete type safety. Serves as the foundational type system within the BPMCP server ensuring consistent interfaces and proper TypeScript compilation across all tools and operations.

## System Integration
### Imports
- **MCP SDK**: McpError for error type integration
- **Neo4j Driver**: Driver for Neo4j database connection types
- **Qdrant Client**: QdrantClient for vector database connection types
- **MongoDB**: MongoClient, Db for MongoDB connection types
- **Notion Client**: Client for Notion API integration types
- **LangChain**: GoogleGenerativeAIEmbeddings for embedding service types

### Exports
- **Tool**: Interface defining MCP tool structure
- **DatabaseConnections**: Interface for all database connection types
- **Services**: Interface for external service integrations
- **ToolDependencies**: Interface for dependency injection pattern
- **ToolResponse**: Interface for standardized tool responses

### Dependencies
- **External Libraries**: Neo4j, Qdrant, MongoDB, Notion, LangChain for service type definitions
- **MCP SDK**: Model Context Protocol types for tool integration
- **TypeScript**: Core TypeScript type system

### Dependents
- **All BPMCP Tools**: Every tool uses these type definitions for consistency
- **Database Operations**: Database connection types ensure proper typing
- **Service Integrations**: Service types ensure proper external API integration
- **MCP Server**: Server uses these types for dependency injection and tool management

## Key Functions/Components
### Tool Interface (Lines 11-15)
**Purpose**: Defines the structure for MCP tool definitions
**Parameters**: name (string), description (string), inputSchema (object)
**Returns**: Tool interface for MCP tool registration
**Notes**: 86 lines implementing comprehensive type definitions for BPMCP architecture

### DatabaseConnections Interface (Lines 20-25)
**Purpose**: Defines all database connection types for dependency injection
**Parameters**: neo4jDriver, qdrantClient, mongoClient, mongoDb
**Returns**: DatabaseConnections interface for database access
**Notes**: Comprehensive database connection typing for all supported databases

### Services Interface (Lines 30-40)
**Purpose**: Defines external service integration types
**Parameters**: notionClient, embeddings service types
**Returns**: Services interface for external API integration
**Notes**: Complete service integration typing for Notion and embedding services

### ToolDependencies Interface (Lines 45-55)
**Purpose**: Defines dependency injection pattern for tool functions
**Parameters**: db (DatabaseConnections), services (Services)
**Returns**: ToolDependencies interface for consistent dependency injection
**Notes**: Centralized dependency injection pattern for all BPMCP tools

### ToolResponse Interface (Lines 60-70)
**Purpose**: Defines standardized response structure for tool operations
**Parameters**: content, isError, metadata
**Returns**: ToolResponse interface for consistent tool responses
**Notes**: Standardized response format ensuring consistency across all tools

### Error Integration Types (Lines 75-86)
**Purpose**: Integrates MCP error types with application type system
**Parameters**: MCP error types and application-specific extensions
**Returns**: Comprehensive error type integration
**Notes**: Seamless integration between MCP protocol and application error handling

## Data Flow
1. **Type Definition**: Interface definition → TypeScript compilation → Type checking → Runtime validation
2. **Dependency Injection**: ToolDependencies → Database connections → Service integrations → Tool execution
3. **Tool Registration**: Tool interface → MCP registration → Tool availability → Client access
4. **Response Processing**: Tool execution → ToolResponse formatting → Type validation → Client response
5. **Error Handling**: Error occurrence → Type classification → MCP integration → Standardized response

## Configuration
### Tool Interface Configuration
- **Name**: String identifier for MCP tool registration
- **Description**: Human-readable tool description
- **Input Schema**: JSON schema object for input validation
- **Type Safety**: Full TypeScript type checking and validation

### Database Connection Configuration
- **Neo4j Driver**: Graph database connection with session management
- **Qdrant Client**: Vector database connection for embedding operations
- **MongoDB Client**: Document database connection and database reference
- **Connection Pooling**: Proper connection management and resource optimization

### Service Integration Configuration
- **Notion Client**: Notion API client for workspace integration
- **Embedding Service**: Google Generative AI embeddings for vector generation
- **Service Authentication**: Proper authentication and API key management
- **Rate Limiting**: Service-specific rate limiting and error handling

### Dependency Injection Configuration
- **Database Dependencies**: All database connections in single interface
- **Service Dependencies**: All external services in single interface
- **Tool Dependencies**: Combined dependencies for tool function injection
- **Type Safety**: Full type checking for dependency injection

## Testing
No explicit test files referenced, but includes comprehensive type definitions for compile-time validation and runtime type safety

## Related Files
### Core Dependencies
- **@modelcontextprotocol/sdk/types.js**: MCP protocol type integration
- **neo4j-driver**: Neo4j database connection types
- **@qdrant/js-client-rest**: Qdrant vector database types
- **mongodb**: MongoDB database connection types
- **@notionhq/client**: Notion API client types
- **@langchain/google-genai**: Google AI embedding service types

### Integration Points
- **All BPMCP Tools**: Universal type definitions across all tools
- **Database Operations**: Type safety for all database operations
- **Service Integrations**: Type safety for external API integrations
- **MCP Server**: Server-level type definitions and dependency injection

### Type Architecture
- **Interface Definitions**: Comprehensive interface definitions for all system components
- **Dependency Injection**: Centralized dependency injection pattern
- **Type Safety**: Full TypeScript type checking and validation
- **Service Integration**: Complete external service type integration

## Development Notes
- **Comprehensive Type Safety**: Full TypeScript type coverage for entire BPMCP system
- **Dependency Injection Pattern**: Centralized dependency injection for consistent tool architecture
- **Service Integration**: Complete type integration for all external services and APIs
- **MCP Protocol Compliance**: Full type integration with Model Context Protocol standards
- **Database Abstraction**: Unified database connection interface for multiple database types
- **Extensible Design**: Easy addition of new services and database types
- **Compile-Time Validation**: TypeScript compilation ensures type safety and prevents runtime errors
- **Runtime Type Safety**: Interface definitions provide runtime type validation
- **Consistent Architecture**: Uniform type definitions across all BPMCP components
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
