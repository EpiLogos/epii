# mongo.service.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/mongodb/mongo.service.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
MongoDB database service providing connection management and database access for the Epi-Logos system. Implements singleton pattern for database connections with automatic reconnection logic. Handles user data, conversations, document metadata, and session history storage. Serves as the primary document database for all non-graph data operations.

## System Integration
### Imports
- **mongodb**: MongoClient for database connectivity
- **dotenv**: Environment variable configuration management
- **path**: File system path utilities
- **fileURLToPath**: ES module URL to file path conversion

### Exports
- **connectToMongoDB**: Async function to establish database connection
- **getDb**: Async function to get database instance with auto-connection
- **getClient**: Async function to get client instance with auto-connection
- **MONGODB_DB_NAME**: Database name constant for reference

### Dependencies
- **MongoDB Database**: External MongoDB database instance
- **Environment Variables**: MONGODB_URI, MONGODB_DB_NAME (optional)
- **MongoDB Driver**: Native MongoDB Node.js driver

### Dependents
- **Backend Controllers**: User, conversation, document controllers
- **Session Management**: Chat session and history storage
- **Document Storage**: Document metadata and content storage
- **BPMCP Service**: Document retrieval and caching operations

## Key Functions/Components
### connectToMongoDB() (Lines 26-51)
**Purpose**: Establish MongoDB connection with error handling and connection reuse
**Parameters**: None
**Returns**: Promise<{client, db}> - Connection objects or null on failure
**Notes**: Checks existing connection before creating new one, comprehensive error handling

### getDb() (Lines 55-60)
**Purpose**: Get database instance with automatic connection establishment
**Parameters**: None
**Returns**: Promise<Db> - MongoDB database instance
**Notes**: Auto-connects if not connected, ensures database availability

### getClient() (Lines 63-68)
**Purpose**: Get MongoDB client instance with automatic connection establishment
**Parameters**: None
**Returns**: Promise<MongoClient> - MongoDB client instance
**Notes**: Auto-connects if not connected, provides direct client access

### Environment Configuration (Lines 14-21)
**Purpose**: Load and validate MongoDB connection environment variables
**Parameters**: None
**Returns**: void
**Notes**: Validates MONGODB_URI, provides default database name, warns on missing variables

## Data Flow
1. **Module Load**: Environment variables loaded → Configuration validated → Warning if missing
2. **Connection Request**: getDb()/getClient() called → Connection check → Auto-connect if needed
3. **Connection Establishment**: MongoClient created → Connection established → Database selected
4. **Database Operations**: Database instance returned → Collections accessed → CRUD operations performed
5. **Connection Reuse**: Subsequent calls reuse existing connection if still active

## Configuration
### Environment Variables
- **MONGODB_URI** (Required): MongoDB connection string (e.g., mongodb://localhost:27017)
- **MONGODB_DB_NAME** (Optional): Database name (defaults to 'epii_logos_db')

### Connection Settings
- **Configuration Path**: Loads .env from friendly-file-backend root directory
- **Default Database**: 'epii_logos_db' if MONGODB_DB_NAME not specified
- **Connection Reuse**: Singleton pattern with connection state checking
- **Error Handling**: Graceful degradation with null returns on failure

### Database Structure
- **Default Database**: epii_logos_db
- **Collections**: Users, conversations, documents, sessions, analysis results
- **Connection Pooling**: Uses MongoDB driver default connection pooling

## Testing
No explicit test files referenced, but includes connection validation and error logging

## Related Files
### Core Dependencies
- `../../.env` - Environment variable configuration file
- External MongoDB database instance

### Primary Consumers
- `../shared/data/config/db.config.mjs` - Database configuration and initialization
- `../../subsystems/4_nara/` - User and conversation management
- `../../subsystems/5_epii/` - Document storage and analysis results

### Integration Points
- **Backend Controllers**: All controllers requiring document storage
- **Session Management**: Chat session persistence
- **Document Pipeline**: Document metadata and analysis results storage
- **User Management**: User profiles and authentication data

## Development Notes
- **Singleton Pattern**: Single client/database instance shared across application
- **Auto-Reconnection**: Automatic connection establishment on database access
- **Connection State Checking**: Uses topology.isConnected() for connection validation
- **Error Resilience**: Graceful handling of connection failures without throwing
- **Environment Validation**: Comprehensive validation with helpful error messages
- **Path Resolution**: Proper ES module path handling for .env loading
- **Default Values**: Sensible defaults for optional configuration
- **Connection Reuse**: Efficient connection management with state checking
- **Logging Strategy**: Clear connection status and error logging for debugging
