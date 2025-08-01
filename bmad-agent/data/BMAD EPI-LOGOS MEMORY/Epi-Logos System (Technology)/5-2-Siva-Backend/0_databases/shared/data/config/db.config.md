# db.config.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/shared/data/config/db.config.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Database configuration module providing MongoDB connection setup using Mongoose ODM. Handles environment variable validation, connection establishment with proper error handling, and database name configuration. Serves as the primary MongoDB connection initializer for the entire backend system with graceful failure handling and process exit on critical errors.

## System Integration
### Imports
- **mongoose**: MongoDB object modeling library for Node.js

### Exports
- **connectDB**: Async function for establishing MongoDB connection

### Dependencies
- **Environment Variables**: MONGODB_URI (required), MONGODB_DB_NAME (optional)
- **MongoDB Atlas**: External MongoDB database service
- **Mongoose ODM**: Object Document Mapping library

### Dependents
- **Backend Index**: Main application entry point imports and calls connectDB
- **All Backend Services**: Depend on established MongoDB connection
- **Data Models**: Mongoose models require active database connection
- **API Controllers**: Database operations require connection

## Key Functions/Components
### connectDB() (Lines 3-29)
**Purpose**: Establish MongoDB connection with environment validation and error handling
**Parameters**: None
**Returns**: Promise<void> - Resolves on successful connection
**Notes**: Process exits on failure, validates environment variables, uses explicit database name

### Environment Validation (Lines 5-12)
**Purpose**: Validate required MongoDB URI environment variable
**Parameters**: None
**Returns**: void (exits process on failure)
**Notes**: Logs detailed error messages, exits with code 1 on missing URI

### Connection Configuration (Lines 15-19)
**Purpose**: Configure Mongoose connection with optimal settings
**Parameters**: None
**Returns**: Mongoose connection promise
**Notes**: Uses new URL parser, unified topology, explicit database name

### Error Handling (Lines 22-26)
**Purpose**: Handle connection errors with logging and process termination
**Parameters**: Error object from connection attempt
**Returns**: void (exits process)
**Notes**: Logs error details, exits with code 1 on connection failure

## Data Flow
1. **Environment Loading**: Environment variables read → URI validation → Database name defaulting
2. **Connection Attempt**: Mongoose.connect() called → Configuration applied → Connection established
3. **Success Path**: Connection successful → Success logging → Function resolves
4. **Error Path**: Connection fails → Error logging → Process exit with code 1

## Configuration
### Environment Variables
- **MONGODB_URI** (Required): MongoDB connection string (e.g., mongodb+srv://...)
- **MONGODB_DB_NAME** (Optional): Database name (defaults to 'EpiiTest')

### Mongoose Configuration
- **useNewUrlParser**: true - Use new MongoDB connection string parser
- **useUnifiedTopology**: true - Use new Server Discover and Monitoring engine
- **dbName**: Explicitly set database name from environment or default

### Error Handling
- **Missing URI**: Process exit with code 1 and detailed error logging
- **Connection Failure**: Process exit with code 1 and error message logging
- **Success Logging**: Confirmation of successful connection with database name

## Testing
No explicit test files referenced, but includes comprehensive error logging and validation

## Related Files
### Core Integration
- `../../../index.mjs` - Main application entry point that calls connectDB
- `../models/` - Data models that depend on established connection

### Environment Configuration
- `../../../../.env` - Environment variables file containing MONGODB_URI
- Process environment variables for configuration

### Database Services
- `../../mongodb/mongo.service.mjs` - MongoDB service layer
- All controllers and services requiring database access

## Development Notes
- **Process Exit Strategy**: Terminates process on critical failures to prevent undefined behavior
- **Environment Validation**: Comprehensive validation with helpful error messages
- **Database Name Flexibility**: Supports both environment variable and default database names
- **Connection Optimization**: Uses recommended Mongoose connection options
- **Error Logging**: Detailed error logging for debugging connection issues
- **Atlas Integration**: Designed for MongoDB Atlas cloud service
- **Graceful Failure**: Clean process termination on connection failures
- **Success Confirmation**: Clear logging of successful connections with database name
- **ODM Integration**: Uses Mongoose for object document mapping capabilities
