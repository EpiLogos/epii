# config.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/config.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Configuration Management providing centralized environment variable loading and validation for the BPMCP server. Handles .env file loading, required variable validation, and configuration object creation with comprehensive error handling and logging. Serves as the foundational configuration system within the BPMCP server architecture ensuring proper environment setup and configuration validation across all server components.

## System Integration
### Imports
- **dotenv**: Environment variable loading from .env files
- **path**: File path utilities for .env file location
- **fileURLToPath**: URL to file path conversion for ES modules
- **Config**: Type definition from types/index.js for configuration structure

### Exports
- **loadConfig**: Main function loading and validating configuration from environment variables

### Dependencies
- **Environment Variables**: .env file and process.env for configuration values
- **Type Definitions**: Config interface from types/index.js
- **File System**: Path resolution for .env file location

### Dependents
- **Main Server**: index.ts uses loadConfig for server initialization
- **Database Connections**: Database initialization requires configuration values
- **Service Integrations**: External services require API keys and configuration
- **Server Setup**: Server configuration depends on loaded configuration

## Key Functions/Components
### loadConfig Function (Lines 15-74)
**Purpose**: Main function loading and validating configuration from environment variables
**Parameters**: None (reads from environment and .env file)
**Returns**: Config object with validated configuration values
**Notes**: 74 lines implementing comprehensive configuration loading with validation

### Environment File Loading (Lines 17-24)
**Purpose**: Loads environment variables from .env file with path resolution
**Parameters**: Resolved .env file path
**Returns**: Environment variable loading status
**Notes**: Includes warning and success logging for .env file loading

### Required Variables Validation (Lines 27-40)
**Purpose**: Validates presence of all required environment variables
**Parameters**: Array of required variable names
**Returns**: Validation results and error handling
**Notes**: Comprehensive validation with detailed error messages for missing variables

### Database Configuration (Lines 42-50)
**Purpose**: Extracts and validates database connection configuration
**Parameters**: Environment variables for Neo4j, Qdrant, MongoDB
**Returns**: Database configuration object
**Notes**: Includes connection strings, credentials, and database names

### Service Configuration (Lines 52-65)
**Purpose**: Extracts and validates external service configuration
**Parameters**: Environment variables for Notion, Google AI, embedding services
**Returns**: Service configuration object
**Notes**: Includes API keys, model names, and service endpoints

### Configuration Object Creation (Lines 67-74)
**Purpose**: Creates and returns complete configuration object
**Parameters**: Validated environment variables
**Returns**: Complete Config object with all configuration values
**Notes**: Structured configuration object for server initialization

## Data Flow
1. **Environment Loading**: .env file path resolution → dotenv loading → Environment variable availability → Loading status logging
2. **Variable Validation**: Required variables check → Missing variable detection → Error handling → Validation completion
3. **Configuration Extraction**: Environment variables → Database configuration → Service configuration → Configuration structuring
4. **Configuration Return**: Complete configuration → Type validation → Configuration object return → Server initialization
5. **Error Handling**: Missing variables → Error logging → Process termination → Configuration failure

## Configuration
### Required Environment Variables
- **Neo4j Database**: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
- **Qdrant Vector DB**: QDRANT_URL for vector database connection
- **MongoDB**: MONGODB_URI, MONGODB_DB_NAME for document database
- **Notion Integration**: NOTION_API_KEY for Notion workspace access
- **Google AI**: GOOGLE_API_KEY, GEMINI_EMBEDDING_MODEL for embedding generation

### Configuration Structure
- **Database Connections**: All database connection parameters and credentials
- **Service Integrations**: External service API keys and configuration
- **Server Settings**: Server-specific configuration and options
- **Environment Validation**: Comprehensive validation and error handling

### File Loading Configuration
- **.env File Path**: Resolved relative to server source directory
- **Path Resolution**: ES module compatible path resolution
- **Loading Validation**: Success and failure logging for .env file loading
- **Environment Fallback**: Graceful handling when .env file is not found

## Testing
No explicit test files referenced, but includes comprehensive validation and error handling for configuration loading

## Related Files
### Core Dependencies
- **./types/index.js**: Config interface and type definitions
- **dotenv**: Environment variable loading library
- **path**: Node.js path utilities
- **url**: ES module URL utilities

### Integration Points
- **index.ts**: Main server entry point using loadConfig
- **db/index.js**: Database initialization requiring configuration
- **services/index.js**: Service initialization requiring configuration
- **server.ts**: Server setup requiring configuration

### Configuration Architecture
- **Centralized Loading**: Single source of truth for all configuration
- **Environment Validation**: Comprehensive validation and error handling
- **Type Safety**: Strongly typed configuration object
- **Error Handling**: Graceful handling of missing or invalid configuration

## Development Notes
- **Centralized Configuration**: Single source of truth for all BPMCP server configuration
- **Environment Variable Validation**: Comprehensive validation prevents runtime configuration errors
- **Type Safety**: Strongly typed configuration object ensures compile-time validation
- **Error Handling**: Graceful handling of missing or invalid environment variables
- **Logging Integration**: Comprehensive logging for configuration loading and validation
- **ES Module Compatibility**: Proper ES module path resolution and imports
- **Development Support**: Clear error messages and logging for development debugging
- **Production Ready**: Robust configuration loading suitable for production deployment
- **Extensible Design**: Easy addition of new configuration parameters and validation
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
