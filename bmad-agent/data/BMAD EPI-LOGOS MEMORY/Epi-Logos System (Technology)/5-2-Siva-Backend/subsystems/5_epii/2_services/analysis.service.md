# analysis.service.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/2_services/analysis.service.mjs`
**Bimba Coordinate**: `#5-2-1-1`
**Last Updated**: `2025-01-30`

## Purpose & Role
Analysis Service for Epii Analysis Pipeline providing comprehensive document analysis operations with Meta-Techne loop integration and session management. Handles analysis initiation, session tracking, result retrieval, and comprehensive analysis coordination. Serves as the primary service layer enabling document analysis operations, session management, and advanced analysis workflow coordination with BPMCP integration and agent service coordination.

## System Integration
### Imports
- **Database Models**: mongoose, Document from shared models, AnalysisSession from models for data persistence
- **BPMCP Service**: bpMCPService from databases/bpmcp for knowledge base integration
- **Epii Agent Service**: epiiAgentService for agent-based analysis operations

### Exports
- **startDocumentAnalysis**: Function for initiating document analysis with session creation
- **getAnalysisSessionStatus**: Function for retrieving analysis session status and progress
- **getLatestAnalysisResults**: Function for accessing latest analysis results and data
- **updateAnalysisSession**: Function for updating analysis session status and progress
- **deleteAnalysisSession**: Function for cleaning up analysis sessions and data

### Dependencies
- **Document Model**: Document database model for document data management and persistence
- **Analysis Session Model**: AnalysisSession model for session tracking and status management
- **BPMCP Service**: BPMCP service for knowledge base operations and integration
- **Epii Agent Service**: Agent service for analysis processing and coordination

### Dependents
- **Analysis Controller**: Analysis controller consuming service for HTTP request handling
- **Pipeline Stages**: Pipeline stages utilizing service for analysis operations and coordination
- **Analysis Automation**: Automation systems requiring analysis service functionality
- **Session Management**: Session management systems utilizing service for tracking and coordination

## Key Functions/Components
### startDocumentAnalysis Function (Lines 27-120)
**Purpose**: Initiates document analysis with comprehensive validation, session creation, and agent coordination
**Parameters**: documentId (string), userId (string), targetCoordinate (string) - Analysis initiation parameters
**Returns**: Promise<Object> - Created analysis session with status and tracking information
**Notes**: 353 lines implementing comprehensive analysis service with Meta-Techne loop integration and session management

### Document Validation (Lines 35-50)
**Purpose**: Validates document existence and accessibility for analysis processing
**Parameters**: documentId for document lookup and validation
**Returns**: Document validation results with error handling for missing documents
**Notes**: Comprehensive document validation ensuring analysis readiness and data availability

### Session Creation (Lines 55-85)
**Purpose**: Creates analysis session with comprehensive tracking and status management
**Parameters**: Analysis parameters with document, user, and coordinate information
**Returns**: Created analysis session with unique session ID and initial status
**Notes**: Advanced session creation with status tracking and comprehensive metadata management

### getAnalysisSessionStatus Function (Lines 122-180)
**Purpose**: Retrieves analysis session status with comprehensive progress tracking and monitoring
**Parameters**: sessionId (string) - Session identifier for status retrieval
**Returns**: Promise<Object> - Session status with progress information and current state
**Notes**: Advanced session status retrieval with real-time progress monitoring and state tracking

### getLatestAnalysisResults Function (Lines 182-250)
**Purpose**: Retrieves latest analysis results with comprehensive data formatting and presentation
**Parameters**: documentId (string) - Document identifier for result retrieval
**Returns**: Promise<Object> - Analysis results with insights, mappings, and comprehensive data
**Notes**: Comprehensive result retrieval with data formatting and presentation optimization

### updateAnalysisSession Function (Lines 252-320)
**Purpose**: Updates analysis session with status changes, progress updates, and result integration
**Parameters**: sessionId (string), updateData (object) - Session update parameters and data
**Returns**: Promise<Object> - Updated session with new status and progress information
**Notes**: Advanced session updating with status management and progress tracking coordination

### deleteAnalysisSession Function (Lines 322-353)
**Purpose**: Cleans up analysis sessions with comprehensive data removal and resource management
**Parameters**: sessionId (string) - Session identifier for cleanup operations
**Returns**: Promise<void> - Session cleanup completion with resource deallocation
**Notes**: Comprehensive session cleanup with data removal and resource management coordination

## Data Flow
1. **Analysis Initiation**: Analysis request → Document validation → Session creation → Agent coordination → Analysis start
2. **Session Management**: Session tracking → Status updates → Progress monitoring → State coordination → Management completion
3. **Result Processing**: Analysis completion → Result formatting → Data storage → Result retrieval → Data delivery
4. **Status Tracking**: Status queries → Session lookup → Progress calculation → Status formatting → Status delivery
5. **Session Updates**: Update requests → Validation → Data modification → Status coordination → Update completion
6. **Session Cleanup**: Cleanup requests → Session validation → Data removal → Resource deallocation → Cleanup completion

## Configuration
### Service Configuration
- **Meta-Techne Loop**: Integration with Meta-Techne loop phases for comprehensive analysis workflow
- **Session Management**: Advanced session tracking with status monitoring and progress updates
- **BPMCP Integration**: Knowledge base integration for enhanced analysis capabilities
- **Agent Coordination**: Epii agent service integration for analysis processing and coordination

### Analysis Configuration
- **Document Processing**: Document validation and analysis readiness assessment
- **Session Tracking**: Comprehensive session tracking with unique identifiers and status management
- **Result Management**: Analysis result storage, retrieval, and formatting for consumption
- **Progress Monitoring**: Real-time progress monitoring with status updates and tracking

### Integration Configuration
- **Database Integration**: MongoDB integration with Document and AnalysisSession models
- **Service Coordination**: Multi-service coordination with BPMCP and agent services
- **Error Handling**: Comprehensive error handling with validation and graceful failure management
- **Resource Management**: Session resource management with cleanup and deallocation

## Testing
Analysis service testing available in subsystems/5_epii/tests/services/ directory with comprehensive service operations and integration testing

## Related Files
### Core Dependencies
- **../3_models/AnalysisSession.model.mjs**: Analysis session model for session management
- **../../../databases/shared/models/Document.model.mjs**: Document model for data management
- **../../../databases/bpmcp/bpMCP.service.mjs**: BPMCP service for knowledge base integration
- **./epii-agent.service.mjs**: Epii agent service for analysis processing

### Integration Points
- **../4_controllers/analysis.controller.mjs**: Analysis controller consuming service functions
- **../5_integration/pipelines/**: Pipeline stages utilizing service for analysis operations
- **Analysis Automation**: Automation systems requiring analysis service functionality
- **Session Management**: Session management systems utilizing service for tracking

### System Architecture
- **Service Layer**: Primary service layer for document analysis operations and session management
- **Meta-Techne Integration**: Comprehensive Meta-Techne loop integration with analysis workflow
- **Session Management**: Advanced session management with tracking, status monitoring, and coordination
- **Multi-Service Coordination**: Advanced coordination with BPMCP and agent services for comprehensive analysis

## Development Notes
- **Service Excellence**: Comprehensive analysis service enabling consistent document analysis operations and session management
- **Meta-Techne Loop Integration**: Advanced Meta-Techne loop integration with comprehensive analysis workflow coordination
- **Session Management**: Sophisticated session management with tracking, status monitoring, and progress updates
- **BPMCP Integration**: Advanced BPMCP service integration for knowledge base operations and enhanced analysis capabilities
- **Agent Coordination**: Comprehensive agent service coordination for analysis processing and workflow management
- **Error Handling Resilience**: Advanced error handling ensuring service resilience and graceful failure management
- **Development Support**: Clear service boundaries and comprehensive analysis operation management
- **Production Service**: Scalable analysis service suitable for production document analysis operations
- **Debugging Excellence**: Comprehensive service monitoring and analysis operation tracking
- **BPMCP Alignment**: Analysis service integration with sophisticated Bimba coordinate system and Meta-Techne loop support
