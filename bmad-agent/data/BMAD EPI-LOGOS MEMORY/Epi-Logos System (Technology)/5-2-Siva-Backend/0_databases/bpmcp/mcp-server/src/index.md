# index.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/index.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Main Entry Point providing complete BPMCP server bootstrap and lifecycle management. Orchestrates configuration loading, database initialization, service setup, server creation, and graceful shutdown handling. Serves as the primary application entry point within the BPMCP server architecture ensuring proper initialization sequence and comprehensive error handling for the entire Bimba-Pratibimba Memory MCP service.

## System Integration
### Imports
- **Node.js Modules**: fileURLToPath, path, dotenv for ES module and environment support
- **Configuration**: loadConfig from config.js for environment setup
- **Database**: initializeDatabases, closeDatabases from db/index.js for database lifecycle
- **Services**: initializeServices from services/index.js for external service setup
- **Server**: setupServer from server.js for MCP server initialization
- **Types**: DatabaseConnections from types/index.js for type safety

### Exports
- **main**: Main application function (executed directly as entry point)

### Dependencies
- **Configuration System**: Environment variable loading and validation
- **Database Layer**: Neo4j, Qdrant, MongoDB connection management
- **Service Layer**: Notion, Google AI, embedding service initialization
- **Server Layer**: MCP server setup and transport configuration
- **Process Management**: Signal handling and graceful shutdown

### Dependents
- **Node.js Runtime**: Executed as main entry point for BPMCP server
- **Process Managers**: PM2, systemd, or other process managers
- **Container Orchestration**: Docker, Kubernetes deployment systems
- **Development Tools**: Direct execution for development and testing

## Key Functions/Components
### main Function (Lines 25-117)
**Purpose**: Main application function orchestrating complete server lifecycle
**Parameters**: None (reads from environment and command line)
**Returns**: Promise<void> with complete application lifecycle
**Notes**: 117 lines implementing comprehensive server bootstrap and lifecycle management

### Configuration Loading (Lines 27-35)
**Purpose**: Loads and validates configuration from environment variables
**Parameters**: Environment variables and .env file
**Returns**: Validated configuration object
**Notes**: Includes comprehensive error handling for configuration failures

### Database Initialization (Lines 37-50)
**Purpose**: Initializes all database connections (Neo4j, Qdrant, MongoDB)
**Parameters**: Database configuration from loaded config
**Returns**: Database connection objects
**Notes**: Sequential initialization with proper error handling and connection validation

### Service Initialization (Lines 52-65)
**Purpose**: Initializes external services (Notion, Google AI, embeddings)
**Parameters**: Service configuration and database connections
**Returns**: Service integration objects
**Notes**: Service setup with API key validation and connection testing

### Server Setup (Lines 67-80)
**Purpose**: Creates and configures MCP server with tools and transports
**Parameters**: Configuration and initialized dependencies
**Returns**: Configured server instance with WebSocket transport
**Notes**: Complete server setup with tool registration and transport configuration

### Graceful Shutdown (Lines 82-105)
**Purpose**: Handles process signals for graceful server shutdown
**Parameters**: Signal handlers for SIGINT and SIGTERM
**Returns**: Clean shutdown with resource cleanup
**Notes**: Comprehensive cleanup including database connections and server shutdown

### Error Handling (Lines 107-117)
**Purpose**: Handles application-level errors and ensures proper cleanup
**Parameters**: Error objects and cleanup procedures
**Returns**: Error logging and process termination
**Notes**: Comprehensive error handling with resource cleanup and proper exit codes

## Data Flow
1. **Application Start**: Process start → Configuration loading → Environment validation → Initialization sequence
2. **Database Setup**: Database configuration → Connection initialization → Connection validation → Service preparation
3. **Service Setup**: Service configuration → API initialization → Service validation → Server preparation
4. **Server Start**: Server configuration → Tool registration → Transport setup → Client availability
5. **Shutdown Sequence**: Signal reception → Server shutdown → Service cleanup → Database closure → Process termination

## Configuration
### Application Configuration
- **Entry Point**: #!/usr/bin/env node shebang for direct execution
- **ES Module**: Full ES module support with proper imports
- **Environment**: Comprehensive environment variable loading and validation
- **Logging**: Detailed logging throughout initialization and operation

### Initialization Sequence
1. **Configuration Loading**: Environment variables and .env file processing
2. **Database Initialization**: Neo4j, Qdrant, MongoDB connection setup
3. **Service Initialization**: External service API setup and validation
4. **Server Setup**: MCP server creation with tool registration
5. **Transport Configuration**: WebSocket and stdio transport setup

### Shutdown Configuration
- **Signal Handling**: SIGINT and SIGTERM signal handlers
- **Graceful Shutdown**: Proper resource cleanup and connection closure
- **Error Handling**: Comprehensive error handling with cleanup
- **Exit Codes**: Proper exit codes for different shutdown scenarios

### Process Management
- **Lifecycle Management**: Complete application lifecycle orchestration
- **Resource Cleanup**: Proper cleanup of all resources and connections
- **Error Recovery**: Comprehensive error handling and recovery procedures
- **Development Support**: Clear logging and error messages for development

## Testing
No explicit test files referenced, but includes comprehensive error handling and initialization validation

## Related Files
### Core Dependencies
- **./config.js**: Configuration loading and validation
- **./db/index.js**: Database initialization and management
- **./services/index.js**: External service initialization
- **./server.js**: MCP server setup and configuration
- **./types/index.js**: Type definitions for application components

### Integration Points
- **Node.js Runtime**: Direct execution as application entry point
- **Process Managers**: Integration with PM2, systemd, and container orchestration
- **Development Tools**: Direct execution for development and testing
- **Monitoring Systems**: Integration with logging and monitoring tools

### Application Architecture
- **Bootstrap Orchestration**: Complete application initialization sequence
- **Lifecycle Management**: Proper startup and shutdown procedures
- **Error Handling**: Comprehensive error handling and recovery
- **Resource Management**: Proper resource allocation and cleanup

## Development Notes
- **Complete Bootstrap**: Comprehensive application initialization with proper error handling
- **Graceful Shutdown**: Proper signal handling and resource cleanup for production deployment
- **ES Module Support**: Full ES module compatibility with proper imports and path resolution
- **Development Friendly**: Clear logging and error messages for development and debugging
- **Production Ready**: Robust initialization and error handling suitable for production deployment
- **Process Management**: Proper integration with process managers and container orchestration
- **Resource Management**: Comprehensive resource allocation and cleanup procedures
- **Error Recovery**: Robust error handling with proper cleanup and exit codes
- **Monitoring Integration**: Clear logging and status reporting for monitoring systems
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
