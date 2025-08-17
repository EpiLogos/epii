# context.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/1_utils/content/context.mjs`
**Bimba Coordinate**: `#5-1-1-1`
**Last Updated**: `2025-01-30`

## Purpose & Role
Context generation utilities for Epii Analysis Pipeline providing consistent interface for generating context windows with proper formatting and error handling. Handles QL context formatting, Bimba context integration, coordinate-based context generation, and comprehensive context window creation. Serves as the primary context generation layer enabling analysis pipeline context management with Bimba knowing service integration and advanced context formatting capabilities.

## System Integration
### Imports
- **Bimba Services**: bimbaKnowingService from ../../../../databases/shared/services/bimbaKnowing.service.mjs for coordinate-based context
- **BPMCP Services**: bpMCPService from ../../../../databases/bpmcp/bpMCP.service.mjs for knowledge base integration
- **Utilities**: getParentCoordinate from ./utils.mjs for coordinate hierarchy management

### Exports
- **formatQLContext**: Function for formatting QL context for inclusion in context windows
- **generateContextWindow**: Function for generating comprehensive context windows for analysis
- **getBimbaContext**: Function for retrieving Bimba coordinate context and relationships
- **formatBimbaContext**: Function for formatting Bimba context for analysis integration

### Dependencies
- **Bimba Knowing Service**: Coordinate-based context retrieval and relationship management
- **BPMCP Service**: Knowledge base integration for context enhancement
- **Coordinate System**: Bimba coordinate hierarchy and relationship management
- **QL System**: Quaternary Logic context formatting and integration

### Dependents
- **Analysis Pipeline**: Primary consumer for context generation and formatting
- **Content Analysis**: Analysis utilities requiring context window generation
- **Pipeline Stages**: Pipeline stages requiring comprehensive context integration
- **Synthesis Operations**: Content synthesis requiring contextual information

## Key Functions/Components
### formatQLContext Function (Lines 18-60)
**Purpose**: Formats QL context for inclusion in context windows with comprehensive operator and relationship formatting
**Parameters**: qlContext (object) - QL context object with operators and relationships
**Returns**: String with formatted QL context for analysis integration
**Notes**: 792 lines implementing comprehensive context generation with Bimba integration and advanced formatting

### generateContextWindow Function (Lines 62-200)
**Purpose**: Generates comprehensive context windows for analysis with multi-source context integration
**Parameters**: contextConfig (object) - Context configuration with sources, coordinates, and formatting options
**Returns**: Promise<string> - Generated context window with comprehensive contextual information
**Notes**: Advanced context window generation with multi-source integration and comprehensive formatting

### getBimbaContext Function (Lines 202-320)
**Purpose**: Retrieves Bimba coordinate context and relationships for analysis integration
**Parameters**: coordinate (string), contextDepth (number) - Coordinate and context depth configuration
**Returns**: Promise<object> - Bimba context with coordinate relationships and hierarchical information
**Notes**: Comprehensive Bimba context retrieval with coordinate hierarchy and relationship management

### formatBimbaContext Function (Lines 322-420)
**Purpose**: Formats Bimba context for analysis integration with proper structure and hierarchy
**Parameters**: bimbaContext (object), formatOptions (object) - Context and formatting configuration
**Returns**: String with formatted Bimba context for analysis pipeline integration
**Notes**: Advanced Bimba context formatting with hierarchy preservation and relationship visualization

### getCoordinateHierarchy Function (Lines 422-520)
**Purpose**: Retrieves coordinate hierarchy for comprehensive context understanding
**Parameters**: coordinate (string), hierarchyDepth (number) - Coordinate and hierarchy depth configuration
**Returns**: Promise<object> - Coordinate hierarchy with parent-child relationships and context
**Notes**: Comprehensive coordinate hierarchy retrieval with relationship mapping and context integration

### formatContextSections Function (Lines 522-620)
**Purpose**: Formats context sections with proper structure and organization for analysis
**Parameters**: contextSections (array), sectionConfig (object) - Context sections and formatting configuration
**Returns**: String with formatted context sections for analysis pipeline integration
**Notes**: Advanced context section formatting with proper organization and structure

### integrateKnowledgeBase Function (Lines 622-720)
**Purpose**: Integrates knowledge base context from BPMCP service for enhanced analysis
**Parameters**: contextQuery (object), integrationConfig (object) - Query and integration configuration
**Returns**: Promise<object> - Knowledge base context with integrated information and relationships
**Notes**: Comprehensive knowledge base integration with BPMCP service and context enhancement

### validateContextWindow Function (Lines 722-792)
**Purpose**: Validates generated context windows for completeness and consistency
**Parameters**: contextWindow (string), validationConfig (object) - Context window and validation configuration
**Returns**: Object with validation results and context window quality assessment
**Notes**: Comprehensive context window validation ensuring quality and completeness for analysis pipeline

## Data Flow
1. **Context Request**: Analysis request → Context configuration → Source identification → Context generation
2. **QL Context**: QL data → Operator formatting → Relationship formatting → Context integration
3. **Bimba Context**: Coordinate input → Hierarchy retrieval → Relationship mapping → Context formatting
4. **Knowledge Integration**: Context query → BPMCP service → Knowledge retrieval → Context enhancement
5. **Window Generation**: Context sources → Section formatting → Window assembly → Validation
6. **Context Delivery**: Validated context → Analysis pipeline → Context utilization → Analysis execution

## Configuration
### Context Generation Configuration
- **Multi-source Integration**: QL context, Bimba context, and knowledge base integration
- **Formatting Options**: Comprehensive formatting with proper structure and organization
- **Hierarchy Management**: Coordinate hierarchy retrieval and relationship mapping
- **Validation Strategy**: Context window validation for quality and completeness

### Bimba Integration Configuration
- **Coordinate Context**: Coordinate-based context retrieval and relationship management
- **Hierarchy Depth**: Configurable hierarchy depth for comprehensive context understanding
- **Relationship Mapping**: Advanced relationship mapping and context integration
- **Service Integration**: Bimba knowing service integration for coordinate-based operations

### Knowledge Base Configuration
- **BPMCP Integration**: Knowledge base integration for context enhancement
- **Query Processing**: Advanced query processing for knowledge retrieval
- **Context Enhancement**: Knowledge-based context enhancement and integration
- **Service Coordination**: BPMCP service coordination for comprehensive knowledge access

## Testing
Context utilities testing available in subsystems/5_epii/tests/utils/ directory with comprehensive context generation and formatting testing

## Related Files
### Core Dependencies
- **../../../../databases/shared/services/bimbaKnowing.service.mjs**: Bimba knowing service for coordinate context
- **../../../../databases/bpmcp/bpMCP.service.mjs**: BPMCP service for knowledge base integration
- **./utils.mjs**: Utility functions for coordinate hierarchy management

### Integration Points
- **./analysis.mjs**: Analysis utilities consuming context generation functions
- **./processing.mjs**: Processing utilities requiring contextual information
- **../../../5_integration/pipelines/**: Pipeline stages utilizing context windows
- **Analysis Pipeline**: Primary consumer for context generation and formatting

### System Architecture
- **Context Generation**: Primary context generation layer for analysis pipeline
- **Multi-source Integration**: Comprehensive integration of QL, Bimba, and knowledge base context
- **Formatting Excellence**: Advanced formatting with proper structure and organization
- **Validation Framework**: Context window validation ensuring quality and completeness

## Development Notes
- **Context Generation Excellence**: Comprehensive context generation utilities enabling consistent analysis pipeline context management
- **Multi-source Integration**: Advanced integration of QL context, Bimba coordinate context, and knowledge base information
- **Bimba Coordinate Integration**: Sophisticated coordinate-based context retrieval with hierarchy and relationship management
- **Knowledge Base Enhancement**: BPMCP service integration for context enhancement and knowledge-based analysis support
- **Formatting Sophistication**: Advanced context formatting with proper structure, organization, and hierarchy preservation
- **Validation Framework**: Comprehensive context window validation ensuring quality and completeness for analysis operations
- **Development Support**: Clear context generation boundaries and comprehensive formatting management
- **Production Context**: Scalable context generation suitable for production analysis pipeline operations
- **Debugging Excellence**: Comprehensive context generation monitoring and formatting tracking
- **BPMCP Alignment**: Context generation integration with sophisticated Bimba coordinate system and knowledge base support
