# bimba.schema.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/shared/schemas/bimba.schema.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Enhanced Bimba Node and Relation Schemas defining comprehensive data structures for Bimba nodes and relations with enhanced Quaternary Logic (QL) properties. Provides validation and documentation schemas throughout the Epii Analysis Pipeline with deep QL integration for improved retrieval and analysis. Serves as the foundational data model for the entire Bimba coordinate system with sophisticated metadata and relationship management.

## System Integration
### Imports
- **No external imports**: Pure JavaScript schema definitions

### Exports
- **BimbaNodeSchema**: Enhanced schema for Bimba nodes with QL properties
- **BimbaRelationSchema**: Schema for relationships between Bimba nodes
- **QLPropertySchemas**: Quaternary Logic property definitions
- **ValidationSchemas**: Validation rules for node and relation data

### Dependencies
- **Quaternary Logic System**: QL properties and categorization
- **Bimba Coordinate System**: Coordinate-based organization
- **Analysis Pipeline**: Schema validation and data structure

### Dependents
- **Neo4j Database**: Node and relation storage validation
- **BPMCP Tools**: Schema validation for graph operations
- **Analysis Pipeline**: Data structure validation
- **Frontend Services**: Type safety for Bimba operations

## Key Functions/Components
### BimbaNodeSchema (Lines 14-200)
**Purpose**: Enhanced schema for Bimba nodes incorporating Quaternary Logic properties
**Parameters**: Core properties (bimbaCoordinate, name, description), QL properties (qlPosition, qlCategory, qlOperatorTypes), metadata properties
**Returns**: Complete node schema definition
**Notes**: 514 lines total, consolidates description/role/function into comprehensive description

### Core Node Properties (Lines 16-32)
**Purpose**: Essential properties for Bimba node identification and description
**Parameters**: bimbaCoordinate (required string), name (required string), description (required string)
**Returns**: Core node property definitions
**Notes**: Comprehensive description consolidates role, function, and descriptive elements

### Quaternary Logic Properties (Lines 35-80)
**Purpose**: QL-specific properties for enhanced retrieval and analysis
**Parameters**: qlPosition (0-5), qlCategory (implicate/explicate), qlOperatorTypes (structural/processual/contextual)
**Returns**: QL property definitions
**Notes**: Deep integration with Quaternary Logic system for coordinate-aware operations

### Metadata Properties (Lines 85-150)
**Purpose**: Additional metadata for enhanced node context and analysis
**Parameters**: Various metadata fields including timestamps, analysis context, relevance scores
**Returns**: Metadata property definitions
**Notes**: Extensible metadata system for custom properties

### BimbaRelationSchema (Lines 250-400)
**Purpose**: Schema for relationships between Bimba nodes with QL integration
**Parameters**: Source/target coordinates, relationship type, QL properties, metadata
**Returns**: Complete relation schema definition
**Notes**: Comprehensive relationship modeling with QL-aware properties

### Validation Rules (Lines 450-514)
**Purpose**: Validation rules and constraints for node and relation data
**Parameters**: Various validation constraints and rules
**Returns**: Validation schema definitions
**Notes**: Comprehensive validation ensuring data integrity

## Data Flow
1. **Schema Definition**: Schema objects → Property definitions → Validation rules → Type safety
2. **Node Creation**: Node data → BimbaNodeSchema validation → QL property assignment → Database storage
3. **Relation Creation**: Relation data → BimbaRelationSchema validation → Relationship establishment → Graph updates
4. **Data Validation**: Incoming data → Schema validation → Error handling → Validated output
5. **QL Integration**: Node/relation data → QL property extraction → Enhanced retrieval → Analysis optimization

## Configuration
### Core Node Properties
- **bimbaCoordinate**: Unique coordinate identifier (required string, e.g., "#5-2")
- **name**: Node name (required string)
- **description**: Comprehensive description consolidating role, function, and descriptive elements (required string)

### Quaternary Logic Properties
- **qlPosition**: Position in QL cycle (number, enum: 0-5)
- **qlCategory**: QL category (string, enum: 'implicate', 'explicate')
- **qlOperatorTypes**: Operator types (array of strings, enum: 'structural', 'processual', 'contextual')
- **qlDynamics**: QL dynamics classification (string)
- **qlContextFrame**: Context frame for operational context (string)

### QL Categories
- **Implicate Elements**: Positions 0 and 5 (foundational and transcendent)
- **Explicate Elements**: Positions 1-4 (manifest and operational)
- **Structural Operators**: Structural relationships and dependencies
- **Processual Operators**: Process-based relationships and flows
- **Contextual Operators**: Context-aware relationships and associations

### Metadata Properties
- **createdAt**: Creation timestamp (ISO string)
- **updatedAt**: Last update timestamp (ISO string)
- **analysisContext**: Analysis pipeline context (string)
- **relevanceScore**: Relevance score (number, 0.0-1.0)
- **tags**: Classification tags (array of strings)
- **customProperties**: Extensible custom properties (object)

### Relation Properties
- **sourceCoordinate**: Source node coordinate (required string)
- **targetCoordinate**: Target node coordinate (required string)
- **relationshipType**: Type of relationship (required string)
- **strength**: Relationship strength (number, 0.0-1.0)
- **confidence**: Relationship confidence (number, 0.0-1.0)
- **qlRelationType**: QL-specific relation type (string)

## Testing
No explicit test files referenced, but schemas provide comprehensive validation for all Bimba operations

## Related Files
### Core Dependencies
- **Quaternary Logic System**: QL properties and categorization framework
- **Bimba Coordinate System**: Coordinate-based organization system

### Integration Points
- **Neo4j Database**: Node and relation storage with schema validation
- **BPMCP Tools**: Schema validation for all graph operations
- **Analysis Pipeline**: Data structure validation and QL integration
- **Frontend Services**: Type safety for Bimba operations

### Schema Architecture
- **Comprehensive Coverage**: Complete node and relation modeling
- **QL Integration**: Deep integration with Quaternary Logic system
- **Extensible Design**: Flexible metadata and custom properties

## Development Notes
- **Enhanced QL Integration**: Comprehensive Quaternary Logic properties for improved retrieval and analysis
- **Consolidated Description**: Merges role, function, and descriptive elements into single comprehensive description
- **Extensible Metadata**: Flexible metadata system supporting custom properties and analysis context
- **Validation Framework**: Comprehensive validation rules ensuring data integrity
- **Coordinate-Aware**: Full integration with Bimba coordinate system
- **Relationship Modeling**: Sophisticated relationship schema with QL-aware properties
- **Analysis Pipeline Integration**: Direct integration with Epii Analysis Pipeline
- **Type Safety**: Complete schema definitions for frontend and backend type safety
- **Performance Optimization**: QL properties enable enhanced retrieval and filtering
- **Future-Proof Design**: Extensible architecture supporting system evolution
