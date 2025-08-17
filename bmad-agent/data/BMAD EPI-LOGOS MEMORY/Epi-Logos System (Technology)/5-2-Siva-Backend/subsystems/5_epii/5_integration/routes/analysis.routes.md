# analysis.routes.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/routes/analysis.routes.mjs`
**Bimba Coordinate**: `#5-5-2-1`
**Last Updated**: `2025-01-30`

## Purpose & Role
Analysis Routes for Epii Analysis Pipeline providing RESTful API endpoints for document analysis operations with comprehensive controller integration. Handles analysis initiation, session management, result retrieval, and Notion integration coordination. Serves as the primary API routing layer enabling document analysis operations, session tracking, and comprehensive analysis result management through HTTP endpoints.

## System Integration
### Imports
- **Express Framework**: express from express for HTTP routing and middleware support
- **Analysis Controllers**: startDocumentAnalysis, getAnalysisSessionStatus, getLatestAnalysisResults, createCrystallizationFromAnalysis, updateDocumentStatus, getNotionUpdatePayload from ../../4_controllers/analysis.controller.mjs

### Exports
- **router**: Express router instance with configured analysis routes and endpoint definitions
- **Analysis API Endpoints**: RESTful endpoints for document analysis operations and session management

### Dependencies
- **Express Router**: Express routing framework for HTTP endpoint management
- **Analysis Controllers**: Controller functions for analysis operations and business logic
- **HTTP Protocol**: RESTful HTTP protocol for API communication and endpoint access
- **Session Management**: Analysis session tracking and status management

### Dependents
- **API Gateway**: API gateway systems consuming analysis routes for endpoint access
- **Frontend Applications**: Frontend applications utilizing analysis API endpoints
- **Analysis Clients**: Client applications requiring document analysis operations
- **Integration Services**: Integration services consuming analysis API for automation

## Key Functions/Components
### Express Router Configuration (Lines 20)
**Purpose**: Configures Express router instance for analysis route management and endpoint organization
**Parameters**: Express router instance for route configuration and endpoint management
**Returns**: Configured router with analysis endpoints and middleware integration
**Notes**: 47 lines implementing comprehensive analysis routes with RESTful API design and controller integration

### POST /start Endpoint (Lines 22-24)
**Purpose**: Initiates document analysis operations through startDocumentAnalysis controller
**Parameters**: HTTP POST request with document analysis parameters and configuration
**Returns**: Analysis session initiation response with session ID and status information
**Notes**: Analysis initiation endpoint enabling document processing and pipeline execution

### GET /session/:sessionId Endpoint (Lines 26-28)
**Purpose**: Retrieves analysis session status through getAnalysisSessionStatus controller
**Parameters**: HTTP GET request with sessionId parameter for status retrieval
**Returns**: Session status response with analysis progress and current state information
**Notes**: Session tracking endpoint enabling real-time analysis progress monitoring

### GET /results/:documentId Endpoint (Lines 30-32)
**Purpose**: Retrieves latest analysis results through getLatestAnalysisResults controller
**Parameters**: HTTP GET request with documentId parameter for result retrieval
**Returns**: Analysis results response with comprehensive analysis data and insights
**Notes**: Result retrieval endpoint enabling access to completed analysis data

### POST /crystallize Endpoint (Lines 34-36)
**Purpose**: Creates crystallization from analysis through createCrystallizationFromAnalysis controller
**Parameters**: HTTP POST request with crystallization parameters and analysis data
**Returns**: Crystallization response with processed analysis and structured output
**Notes**: Crystallization endpoint enabling analysis result processing and structuring

### PUT /document/:documentId/status Endpoint (Lines 38-40)
**Purpose**: Updates document status through updateDocumentStatus controller
**Parameters**: HTTP PUT request with documentId and status update parameters
**Returns**: Status update response with document state and processing information
**Notes**: Document status management endpoint enabling status tracking and updates

### GET /notion-payload/:documentId Endpoint (Lines 42-47)
**Purpose**: Retrieves Notion update payload through getNotionUpdatePayload controller
**Parameters**: HTTP GET request with documentId parameter for Notion payload generation
**Returns**: Notion payload response with formatted data for Notion integration
**Notes**: Notion integration endpoint enabling automated Notion updates and data synchronization

## Data Flow
1. **Analysis Initiation**: POST /start → Controller execution → Analysis pipeline → Session creation → Response delivery
2. **Session Monitoring**: GET /session/:sessionId → Status retrieval → Progress tracking → Status response → Client update
3. **Result Access**: GET /results/:documentId → Result retrieval → Data formatting → Response delivery → Client consumption
4. **Crystallization**: POST /crystallize → Analysis processing → Crystallization creation → Structured output → Response delivery
5. **Status Management**: PUT /document/:documentId/status → Status update → Document tracking → Response confirmation → State synchronization
6. **Notion Integration**: GET /notion-payload/:documentId → Payload generation → Notion formatting → Integration data → Response delivery

## Configuration
### Route Configuration
- **RESTful Design**: Comprehensive RESTful API design with standard HTTP methods and resource organization
- **Controller Integration**: Analysis controller integration for business logic separation and modularity
- **Parameter Handling**: URL parameter handling for resource identification and operation targeting
- **Response Management**: HTTP response management with proper status codes and data formatting

### Endpoint Configuration
- **Analysis Operations**: Document analysis initiation, session management, and result retrieval
- **Status Management**: Document status tracking and update operations
- **Integration Support**: Notion integration with payload generation and data formatting
- **Session Tracking**: Analysis session monitoring with real-time progress updates

### API Design Configuration
- **HTTP Methods**: Appropriate HTTP method usage (GET, POST, PUT) for different operations
- **Resource Organization**: Logical resource organization with clear endpoint structure
- **Parameter Patterns**: Consistent parameter patterns for resource identification
- **Response Standards**: Standardized response formats for consistent API behavior

## Testing
Analysis routes testing available in subsystems/5_epii/tests/integration/ directory with comprehensive API endpoint and route functionality testing

## Related Files
### Core Dependencies
- **../../4_controllers/analysis.controller.mjs**: Analysis controllers for business logic and operations
- **Express Framework**: Express routing framework for HTTP endpoint management

### Integration Points
- **../pipelines/epii_analysis_pipeline.mjs**: Analysis pipeline utilized by controller functions
- **API Gateway**: API gateway systems consuming analysis routes
- **Frontend Applications**: Frontend applications utilizing analysis endpoints
- **Integration Services**: Services consuming analysis API for automation

### System Architecture
- **API Routing Layer**: Primary API routing layer for document analysis operations
- **Controller Integration**: Comprehensive controller integration for business logic separation
- **RESTful Design**: Advanced RESTful API design with standard HTTP patterns
- **Session Management**: Analysis session tracking and status management integration

## Development Notes
- **RESTful API Excellence**: Comprehensive analysis routes enabling consistent document analysis operations through RESTful HTTP endpoints
- **Controller Integration**: Advanced controller integration with clear separation of routing and business logic
- **Session Management**: Sophisticated session tracking with real-time progress monitoring and status updates
- **Notion Integration**: Comprehensive Notion integration with payload generation and automated data synchronization
- **API Design Standards**: RESTful API design following standard HTTP patterns and resource organization
- **Parameter Handling**: Advanced parameter handling with URL parameters for resource identification and operation targeting
- **Development Support**: Clear API routing boundaries and comprehensive endpoint management
- **Production API**: Scalable analysis routes suitable for production document analysis operations
- **Debugging Excellence**: Comprehensive API endpoint monitoring and route functionality tracking
- **BPMCP Alignment**: Analysis routes integration with sophisticated Bimba coordinate system and document analysis support
