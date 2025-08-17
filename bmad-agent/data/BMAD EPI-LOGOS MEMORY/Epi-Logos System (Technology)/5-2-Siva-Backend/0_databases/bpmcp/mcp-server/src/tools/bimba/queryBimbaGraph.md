# queryBimbaGraph.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/queryBimbaGraph.ts`
**Bimba Coordinate**: `#5-2-0-16`
**Last Updated**: `2025-08-02`

## Purpose & Role
Query Bimba Graph Tool providing read operations for the Neo4j Bimba graph database through MCP (Model Context Protocol). Handles complex Cypher queries with coordinate detection, caching optimization, and comprehensive result processing. Serves as the primary read interface for Bimba coordinate system exploration within the BPMCP server architecture with sophisticated query analysis, performance optimization, and intelligent caching strategies.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized error handling
- **Neo4j Driver**: neo4j, Session for database connectivity and session management
- **Bimba Schemas**: QueryBimbaGraphSchema for input validation
- **Utility Functions**: zodToJsonSchema for schema conversion, handleError for error processing
- **Type Definitions**: Tool, ToolDependencies for MCP tool structure

### Exports
- **queryBimbaGraphTool**: Tool definition with name, description, and input schema
- **handleQueryBimbaGraph**: Main handler function for query operations

### Dependencies
- **Neo4j Driver**: Database connection and session management
- **Zod Validation**: Input schema validation and parsing
- **MCP Framework**: Model Context Protocol tool structure
- **Error Handling**: Centralized error processing and logging

### Dependents
- **BPMCP Service**: Primary consumer for graph query operations
- **Frontend Query Operations**: Components requiring graph data retrieval
- **Analysis Pipeline**: Systems needing to query graph for analysis
- **Coordinate Exploration**: Systems exploring Bimba coordinate relationships

## Key Functions/Components
### queryBimbaGraphTool Definition (Lines 9-13)
**Purpose**: MCP tool definition with metadata and schema specification
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition object for MCP registration
**Notes**: 220 lines implementing comprehensive graph query operations

### handleQueryBimbaGraph Function (Lines 21-220)
**Purpose**: Main handler function executing read Cypher queries against Neo4j
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Tool response with query results and metadata
**Notes**: Comprehensive query handler with caching optimization and coordinate detection

### Coordinate Detection (Lines 25-35)
**Purpose**: Detects Bimba coordinates in queries using regex patterns
**Parameters**: Query string and coordinate detection patterns
**Returns**: Detected coordinates for caching optimization
**Notes**: Supports both direct coordinate strings and Cypher query coordinate extraction

### Input Validation (Lines 40-50)
**Purpose**: Validates input arguments using Zod schema validation
**Parameters**: Raw input arguments from MCP call
**Returns**: Validated arguments conforming to QueryBimbaGraphSchema
**Notes**: Strict validation ensures query integrity and prevents malformed operations

### Caching Strategy (Lines 55-85)
**Purpose**: Implements intelligent caching for coordinate-specific queries
**Parameters**: Detected coordinates and query characteristics
**Returns**: Cache optimization decisions and strategies
**Notes**: Performance optimization through coordinate-based caching

### Neo4j Session Management (Lines 87-105)
**Purpose**: Manages Neo4j database session lifecycle with proper cleanup
**Parameters**: Neo4j driver from dependencies
**Returns**: Database session for query execution
**Notes**: Proper session management prevents connection leaks

### Cypher Query Execution (Lines 107-150)
**Purpose**: Executes read Cypher queries with performance monitoring
**Parameters**: Validated Cypher query and optional parameters
**Returns**: Query execution results with performance metrics
**Notes**: Supports parameterized queries for security and performance

### Result Processing (Lines 152-190)
**Purpose**: Processes Neo4j query results into standardized response format
**Parameters**: Raw Neo4j query results and metadata
**Returns**: Formatted response with records, summary, and performance data
**Notes**: Comprehensive result processing with statistics and optimization insights

### Cache Management (Lines 192-210)
**Purpose**: Manages query result caching for performance optimization
**Parameters**: Query results and caching strategies
**Returns**: Cache storage and retrieval operations
**Notes**: Intelligent caching based on coordinate detection and query patterns

### Error Handling (Lines 212-220)
**Purpose**: Handles errors with proper logging and standardized error responses
**Parameters**: Error objects and execution context
**Returns**: Standardized MCP error responses
**Notes**: Comprehensive error handling with session cleanup and detailed logging

## Data Flow
1. **Request Reception**: MCP call received → Input validation → Schema parsing → Coordinate detection
2. **Cache Check**: Coordinate detection → Cache lookup → Cache hit/miss determination → Query optimization
3. **Session Management**: Neo4j driver → Session creation → Connection establishment → Query preparation
4. **Query Execution**: Cypher query → Parameter binding → Query execution → Result collection
5. **Result Processing**: Raw results → Data formatting → Performance metrics → Cache storage → Response return

## Configuration
### Tool Configuration
- **Tool Name**: "queryBimbaGraph" for MCP tool registration
- **Description**: Clear description of read operation capabilities
- **Input Schema**: QueryBimbaGraphSchema for strict input validation
- **Error Handling**: Standardized MCP error codes and messages

### Coordinate Detection Configuration
- **Direct Coordinate Regex**: Pattern for detecting coordinate strings with '#' prefix
- **Cypher Query Regex**: Pattern for extracting coordinates from MATCH queries
- **Coordinate Validation**: Validation of detected coordinate formats
- **Cache Key Generation**: Coordinate-based cache key generation

### Neo4j Configuration
- **Session Management**: Proper session lifecycle with cleanup
- **Read Transactions**: Read-only transactions for data consistency
- **Query Execution**: Parameterized queries for security
- **Performance Monitoring**: Query performance tracking and optimization

### Caching Configuration
- **Coordinate-Based Caching**: Intelligent caching based on coordinate detection
- **Cache Strategies**: Different caching strategies for different query types
- **Performance Optimization**: Cache-based performance improvements
- **Cache Invalidation**: Proper cache invalidation strategies

## Testing
No explicit test files referenced, but includes comprehensive error handling and validation for robust operation

## Related Files
### Core Dependencies
- **./schemas.js**: QueryBimbaGraphSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../utils/error.js**: Centralized error handling
- **../../types/index.js**: Type definitions for MCP tools

### Integration Points
- **BPMCP Service**: Primary consumer for graph query operations
- **Neo4j Database**: Direct integration with Bimba graph database
- **MCP Server**: Integration with Model Context Protocol server
- **Frontend Systems**: Components requiring graph data retrieval

### Tool Architecture
- **Read Operations**: Comprehensive query operations with optimization
- **Caching System**: Intelligent caching for performance optimization
- **Error Handling**: Robust error handling with detailed logging
- **Validation Framework**: Strict input validation and sanitization

## Development Notes
- **Read-Only Operations**: Focused on graph query operations with performance optimization
- **Coordinate Intelligence**: Sophisticated coordinate detection for caching optimization
- **Performance Focus**: Intelligent caching strategies based on coordinate patterns
- **Security Emphasis**: Parameterized queries prevent injection attacks
- **MCP Integration**: Proper MCP tool structure with standardized interfaces
- **Validation Framework**: Strict input validation ensures query integrity
- **Resource Management**: Efficient Neo4j session management prevents connection leaks
- **Caching Optimization**: Coordinate-based caching for improved performance
- **Logging Integration**: Comprehensive logging for debugging and monitoring
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture

## Change Log
### 2025-08-02: Standardized Query Format Implementation
**Issue Resolved**: LLM tool awareness gap - agents lacked guidance on proper coordinate-based query formatting for optimal bimba graph exploration.

**Changes Applied**:
- Enhanced tool description with standardized query format: `MATCH (n) WHERE n.bimbaCoordinate STARTS WITH '#coordinate' RETURN {nodes: collect(n), relationships: []} as graphData`
- Added APOC integration guidance for embedding property removal using `apoc.map.removeKeys(properties(node), ['embedding'])`
- Implemented coordinate syntax guide for single nodes, branch exploration, and full subsystem queries
- Updated both TypeScript source and JavaScript build files for immediate runtime effect

**Impact**: LLMs now receive comprehensive query format guidance as part of tool context, ensuring consistent coordinate-based exploration patterns and optimal result structuring.
