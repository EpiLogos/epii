# index.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/index.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Main application entry point for the Epi-Logos backend server. Orchestrates the Express.js server initialization, database connections, middleware configuration, and route mounting for all subsystems and database services. Acts as the central nervous system coordinator for the entire backend architecture.

## System Integration
### Imports
- **dotenv**: Environment variable configuration management
- **express**: Core web application framework
- **cors**: Cross-origin resource sharing middleware
- **path, fileURLToPath**: File system path utilities
- **connectDB**: MongoDB database connection service
- **corsOptions**: CORS policy configuration
- **Route Modules**: 13 different route modules from databases, subsystems, and services

### Exports
- No explicit exports (application entry point)

### Dependencies
- **Database Layer**: `databases/shared/data/config/` (db.config.mjs, cors.config.mjs)
- **API Routes**: `databases/api/routes/` (8 universal database routes)
- **Subsystem Routes**: `subsystems/4_nara/` and `subsystems/5_epii/` integration routes
- **External Services**: MongoDB, Express.js framework

### Dependents
- **All Frontend Components**: Depends on this server for API access
- **Back2Front Layer**: Relies on mounted routes for agent communication
- **Development Tools**: Debug utilities and testing frameworks

## Key Functions/Components
### startServer() (Lines 47-90)
**Purpose**: Asynchronous server initialization and startup orchestration
**Parameters**: None
**Returns**: Promise (implicit)
**Notes**: Handles MongoDB connection, route initialization, middleware setup, and server listening

### Route Mounting (Lines 60-83)
**Purpose**: Systematic mounting of all API endpoints under organized URL patterns
**Parameters**: Express app instance
**Returns**: Configured Express application
**Notes**: 13 different route groups mounted with specific URL prefixes

### Environment Configuration (Lines 32-36)
**Purpose**: Environment variable loading and validation
**Parameters**: None
**Returns**: Console logging of configuration status
**Notes**: Validates critical environment variables like MONGODB_URI

## Data Flow
1. **Initialization**: Environment variables loaded → Database connection established
2. **Route Setup**: Nara Mahamaya routes initialized → All route modules mounted systematically
3. **Server Launch**: Express server starts listening on port 3001
4. **Request Handling**: Incoming requests routed through CORS → JSON parsing → Appropriate route handlers

## Configuration
### Environment Variables
- **MONGODB_URI**: MongoDB connection string (required)
- **PORT**: Server port (defaults to 3001)
- **NODE_ENV**: Environment mode configuration

### Server Settings
- **JSON Limit**: 50MB for large document payloads
- **Static Files**: `/uploads` directory served statically
- **CORS**: Configured via corsOptions from config file

### Route Prefixes
- `/api/chat`, `/api/agent`, `/api/graph`, `/api/node-details`
- `/api/epii-agent`, `/api/documents`, `/api/bpmcp`, `/api/conversations`
- `/api/users`, `/api/analysis`, `/api/nara/decanic`, `/api/skills`

## Testing
No explicit test files referenced in this entry point

## Related Files
### Core Configuration
- `databases/shared/data/config/db.config.mjs` - MongoDB connection setup
- `databases/shared/data/config/cors.config.mjs` - CORS policy definitions

### Database API Routes
- `databases/api/routes/chat.routes.mjs` - Chat functionality
- `databases/api/routes/bpmcp.routes.mjs` - BPMCP MCP server integration
- `databases/api/routes/skills.routes.mjs` - A2A skills coordination

### Subsystem Integration Routes
- `subsystems/5_epii/5_integration/routes/epii-agent.routes.mjs` - Epii agent endpoints
- `subsystems/4_nara/5_integration/routes/mahamaya-routes.mjs` - Nara Mahamaya matrix

## Development Notes
- Server startup includes comprehensive logging for debugging
- Route mounting follows systematic pattern with consistent URL prefixes
- Async initialization allows for proper error handling during startup
- Large JSON payload support (50MB) indicates document-heavy operations
- Modular route organization supports independent subsystem development
