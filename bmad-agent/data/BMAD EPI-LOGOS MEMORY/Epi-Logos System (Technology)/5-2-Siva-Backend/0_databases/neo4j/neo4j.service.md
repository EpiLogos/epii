# neo4j.service.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/neo4j/neo4j.service.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Neo4j database service initialization and configuration module. Provides a singleton Neo4jGraph instance from LangChain for graph database operations. Handles environment variable loading, connection configuration, and error handling for Neo4j database connectivity. Serves as the foundational database connection for all graph-based operations in the Epi-Logos system.

## System Integration
### Imports
- **@langchain/community/graphs/neo4j_graph**: Neo4jGraph class for database connectivity
- **dotenv**: Environment variable configuration management
- **path**: File system path utilities
- **fileURLToPath**: ES module URL to file path conversion

### Exports
- **graph**: Neo4jGraph instance (singleton) for database operations

### Dependencies
- **Neo4j Database**: External Neo4j database instance
- **Environment Variables**: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
- **LangChain Community**: Neo4j graph integration library

### Dependents
- **BPMCP Service**: Uses graph instance for Cypher queries via MCP server
- **Backend Controllers**: Indirect usage through BPMCP service
- **Analysis Pipeline**: Graph operations for document analysis
- **All Graph-Based Operations**: Any component requiring Neo4j access

## Key Functions/Components
### Environment Configuration (Lines 9-18)
**Purpose**: Load and validate Neo4j connection environment variables
**Parameters**: None
**Returns**: void
**Notes**: Loads .env from project root, validates required variables, warns if missing

### Graph Configuration (Lines 20-24)
**Purpose**: Define Neo4j connection configuration object
**Parameters**: None
**Returns**: Configuration object with url, username, password
**Notes**: Uses environment variables for connection parameters

### Graph Initialization (Lines 26-33)
**Purpose**: Initialize Neo4jGraph instance with error handling
**Parameters**: None
**Returns**: Neo4jGraph instance or null on failure
**Notes**: Singleton pattern with comprehensive error handling and logging

## Data Flow
1. **Module Load**: Environment variables loaded → Configuration object created
2. **Initialization**: Neo4jGraph instantiated → Connection established → Success/failure logged
3. **Export**: Graph instance exported for use by other modules
4. **Usage**: Other modules import graph → Execute Cypher queries → Return results

## Configuration
### Environment Variables (Required)
- **NEO4J_URI**: Neo4j database connection URI (e.g., bolt://localhost:7687)
- **NEO4J_USERNAME**: Database authentication username
- **NEO4J_PASSWORD**: Database authentication password

### Connection Settings
- **Configuration Path**: Loads .env from friendly-file-backend root directory
- **Error Handling**: Graceful degradation with null graph on connection failure
- **Logging**: Console warnings for missing variables, success/error messages

### LangChain Integration
- **Graph Type**: Uses LangChain Neo4jGraph for standardized operations
- **Community Package**: Leverages @langchain/community for Neo4j integration

## Testing
No explicit test files referenced, but includes connection validation and error logging

## Related Files
### Core Dependencies
- `../../.env` - Environment variable configuration file
- External Neo4j database instance

### Primary Consumers
- `../bpmcp/bpMCP.service.mjs` - Primary consumer via BPMCP MCP server
- `../bpmcp/bpWebSocketClient.mjs` - WebSocket client for MCP operations

### Integration Points
- **BPMCP MCP Server**: All Neo4j operations routed through BPMCP tools
- **Analysis Pipeline**: Graph operations for document analysis
- **Backend API Routes**: Indirect usage through service layers

## Development Notes
- **Singleton Pattern**: Single graph instance shared across application
- **Error Resilience**: Graceful handling of connection failures
- **Environment Validation**: Comprehensive validation of required variables
- **LangChain Integration**: Uses standardized LangChain graph interface
- **Path Resolution**: Proper ES module path handling for .env loading
- **Connection Lazy Loading**: Graph initialized at module load time
- **Logging Strategy**: Clear success/failure logging for debugging
- **Null Safety**: Returns null on failure to prevent application crashes
