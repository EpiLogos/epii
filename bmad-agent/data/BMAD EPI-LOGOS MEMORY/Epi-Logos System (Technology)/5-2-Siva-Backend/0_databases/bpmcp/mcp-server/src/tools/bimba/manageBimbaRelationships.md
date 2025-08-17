# manageBimbaRelationships.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/bimba/manageBimbaRelationships.ts`
**Bimba Coordinate**: `#5-2-0-19`
**Last Updated**: `2025-01-30`

## Purpose & Role
Manage Bimba Relationships Tool providing comprehensive relationship management for the Bimba graph database through MCP (Model Context Protocol). Handles create, update, and delete operations for relationships between any nodes regardless of labels with flexible node identification and comprehensive validation. Serves as the primary relationship management interface within the BPMCP server architecture for maintaining graph structure and connectivity across the Bimba coordinate system.

## System Integration
### Imports
- **MCP SDK**: McpError, ErrorCode for standardized error handling
- **Bimba Schemas**: ManageBimbaRelationshipsSchema for input validation
- **Utility Functions**: zodToJsonSchema for schema conversion, handleError for error processing
- **Type Definitions**: Tool, ToolDependencies for MCP tool structure

### Exports
- **manageBimbaRelationshipsTool**: Tool definition with name, description, and input schema
- **handleManageBimbaRelationships**: Main handler function for relationship management operations

### Dependencies
- **Neo4j Driver**: Database connection and session management
- **Zod Validation**: Input schema validation and parsing
- **MCP Framework**: Model Context Protocol tool structure
- **Error Handling**: Centralized error processing and logging

### Dependents
- **BPMCP Service**: Primary consumer for relationship management operations
- **Graph Structure Management**: Systems requiring relationship CRUD operations
- **Frontend Relationship Operations**: Components managing node relationships
- **Graph Analysis**: Systems analyzing and modifying graph connectivity

## Key Functions/Components
### manageBimbaRelationshipsTool Definition (Lines 8-12)
**Purpose**: MCP tool definition with metadata and schema specification
**Parameters**: Tool name, description, and input schema
**Returns**: Tool definition object for MCP registration
**Notes**: 316 lines implementing comprehensive relationship management operations

### handleManageBimbaRelationships Function (Lines 20-316)
**Purpose**: Main handler function executing relationship management operations against Neo4j
**Parameters**: dependencies (ToolDependencies), args (validated input arguments)
**Returns**: Tool response with operation results and metadata
**Notes**: Comprehensive relationship management with flexible node identification and operation types

### Input Validation (Lines 25-35)
**Purpose**: Validates input arguments using Zod schema validation
**Parameters**: Raw input arguments from MCP call
**Returns**: Validated arguments conforming to ManageBimbaRelationshipsSchema
**Notes**: Strict validation ensures operation integrity and parameter correctness

### Operation Type Routing (Lines 40-60)
**Purpose**: Routes requests to appropriate operation handlers based on operation type
**Parameters**: Operation type and validated arguments
**Returns**: Operation-specific handler execution
**Notes**: Supports CREATE, UPDATE, DELETE operations with unified interface

### Node Resolution (Lines 65-120)
**Purpose**: Resolves node references using either bimbaCoordinate property or node IDs
**Parameters**: Node identifiers and resolution strategy
**Returns**: Resolved node references for relationship operations
**Notes**: Flexible node identification supporting both coordinate and ID-based lookup

### Create Relationship Operations (Lines 125-180)
**Purpose**: Creates new relationships between identified nodes
**Parameters**: Source node, target node, relationship type, and properties
**Returns**: Created relationship information and metadata
**Notes**: Comprehensive relationship creation with property support and validation

### Update Relationship Operations (Lines 185-240)
**Purpose**: Updates existing relationships with new properties or types
**Parameters**: Relationship identification, updated properties, and validation rules
**Returns**: Updated relationship information and change metadata
**Notes**: Flexible relationship updates with property modification and type changes

### Delete Relationship Operations (Lines 245-280)
**Purpose**: Deletes existing relationships based on identification criteria
**Parameters**: Relationship identification and deletion criteria
**Returns**: Deletion results and affected relationship metadata
**Notes**: Safe relationship deletion with validation and cascade handling

### Relationship Validation (Lines 285-310)
**Purpose**: Validates relationship operations and ensures graph integrity
**Parameters**: Relationship data and validation rules
**Returns**: Validation results and integrity checks
**Notes**: Comprehensive validation prevents invalid graph states

### Error Handling and Cleanup (Lines 311-316)
**Purpose**: Handles errors with proper logging and resource cleanup
**Parameters**: Error objects and execution context
**Returns**: Standardized MCP error responses
**Notes**: Comprehensive error handling with session cleanup and detailed logging

## Data Flow
1. **Request Reception**: MCP call received → Input validation → Schema parsing → Operation type identification
2. **Node Resolution**: Node identifiers → Resolution strategy → Node lookup → Reference validation
3. **Operation Execution**: Operation type → Handler routing → Database operations → Result collection
4. **Validation and Integrity**: Operation results → Validation checks → Integrity verification → Error handling
5. **Response Processing**: Operation results → Response formatting → Metadata addition → MCP response return

## Configuration
### Tool Configuration
- **Tool Name**: "manageBimbaRelationships" for MCP tool registration
- **Description**: Clear description of relationship management capabilities
- **Input Schema**: ManageBimbaRelationshipsSchema for strict input validation
- **Error Handling**: Standardized MCP error codes and messages

### Operation Types Configuration
- **CREATE**: Create new relationships between nodes with properties
- **UPDATE**: Update existing relationships with new properties or types
- **DELETE**: Delete existing relationships based on identification criteria
- **Validation**: Comprehensive validation for all operation types

### Node Identification Configuration
- **Coordinate-Based**: Node identification using bimbaCoordinate property
- **ID-Based**: Node identification using Neo4j node IDs
- **Flexible Resolution**: Support for both identification methods
- **Validation**: Strict validation of node references and existence

### Relationship Management Configuration
- **Property Support**: Full support for relationship properties
- **Type Management**: Relationship type creation and modification
- **Integrity Checks**: Graph integrity validation and maintenance
- **Transaction Safety**: Proper transaction handling for data consistency

## Testing
No explicit test files referenced, but includes comprehensive validation and error handling for robust relationship management

## Related Files
### Core Dependencies
- **./schemas.js**: ManageBimbaRelationshipsSchema for input validation
- **../../utils/zodToJsonSchema.js**: Schema conversion utilities
- **../../utils/error.js**: Centralized error handling
- **../../types/index.js**: Type definitions for MCP tools

### Integration Points
- **BPMCP Service**: Primary consumer for relationship management operations
- **Neo4j Database**: Direct integration with Bimba graph database
- **MCP Server**: Integration with Model Context Protocol server
- **Graph Structure Systems**: Systems requiring relationship CRUD operations

### Tool Architecture
- **Relationship CRUD**: Complete create, read, update, delete operations for relationships
- **Flexible Identification**: Support for multiple node identification methods
- **Operation Routing**: Unified interface with operation-specific handlers
- **Validation Framework**: Comprehensive validation and integrity checking

## Development Notes
- **Comprehensive Management**: Complete relationship lifecycle management with all CRUD operations
- **Flexible Node Identification**: Support for both coordinate-based and ID-based node identification
- **Operation Routing**: Clean operation routing with unified interface and specialized handlers
- **Graph Integrity**: Comprehensive validation and integrity checking for graph consistency
- **Transaction Safety**: Proper transaction handling ensures data consistency across operations
- **Property Support**: Full support for relationship properties and metadata
- **Error Resilience**: Comprehensive error handling with detailed logging and cleanup
- **MCP Integration**: Proper MCP tool structure with standardized interfaces
- **Performance Optimization**: Efficient database operations for relationship management
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
