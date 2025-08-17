# mef-templates.service.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/2_services/mef-templates.service.mjs`
**Bimba Coordinate**: `#5-2-1-4`
**Last Updated**: `2025-01-30`

## Purpose & Role
MEF Templates Service for Epii Analysis Pipeline providing comprehensive MEF (Metalogikon Epistemic Framework) template retrieval and management with Bimba graph integration and caching optimization. Handles template retrieval, cache management, template validation, and comprehensive MEF template coordination. Serves as the primary template service layer enabling MEF template operations, cache optimization, and advanced template management with BPMCP integration.

## System Integration
### Imports
- **BPMCP Service**: bpMCPService from ../../../databases/bpmcp/bpMCP.service.mjs for knowledge base integration and template retrieval

### Exports
- **MEFTemplatesService**: Main service class for MEF template management and retrieval
- **mefTemplatesService**: Service instance for template operations and cache management
- **getMEFTemplates**: Function for retrieving MEF templates with caching optimization
- **invalidateCache**: Function for cache invalidation and template refresh

### Dependencies
- **BPMCP Service**: BPMCP service for knowledge base operations and template retrieval from Bimba graph
- **Cache System**: Internal caching system for template storage and performance optimization
- **MEF Framework**: Metalogikon Epistemic Framework for template structure and validation
- **Template Management**: Template management utilities for validation and coordination

### Dependents
- **Analysis Pipeline**: Analysis pipeline stages utilizing MEF templates for content processing
- **Template Processing**: Template processing systems requiring MEF template access
- **Knowledge Operations**: Knowledge operations requiring MEF template integration
- **Analysis Coordination**: Analysis coordination systems utilizing template management

## Key Functions/Components
### MEFTemplatesService Class (Lines 7-115)
**Purpose**: Main service class providing comprehensive MEF template retrieval and management with caching optimization
**Parameters**: Service configuration with cache management and template retrieval capabilities
**Returns**: Service instance with template access and cache optimization
**Notes**: 115 lines implementing comprehensive MEF templates service with Bimba graph integration and caching optimization

### Constructor (Lines 8-12)
**Purpose**: Initializes MEF templates service with cache configuration and expiry management
**Parameters**: Service initialization with cache settings and expiry configuration
**Returns**: Configured service instance with cache management capabilities
**Notes**: Comprehensive service initialization with cache configuration and expiry management

### getMEFTemplates Function (Lines 19-70)
**Purpose**: Retrieves MEF templates from Bimba graph with comprehensive caching and optimization
**Parameters**: forceRefresh (boolean) - Whether to force cache refresh and template retrieval
**Returns**: Promise<Array> - Array of MEF templates with comprehensive template data
**Notes**: Advanced template retrieval with cache optimization and comprehensive template management

### Cache Management (Lines 21-30)
**Purpose**: Manages template cache with expiry validation and performance optimization
**Parameters**: Cache validation with expiry checking and refresh coordination
**Returns**: Cache management with performance optimization and template delivery
**Notes**: Comprehensive cache management with expiry validation and performance optimization

### Template Retrieval (Lines 32-55)
**Purpose**: Retrieves templates from BPMCP service with comprehensive error handling and validation
**Parameters**: Template retrieval parameters with BPMCP integration and validation
**Returns**: Retrieved templates with validation and error handling
**Notes**: Advanced template retrieval with BPMCP integration and comprehensive validation

### Cache Update (Lines 57-70)
**Purpose**: Updates template cache with new data and timestamp management
**Parameters**: Template data and cache update parameters with timestamp coordination
**Returns**: Cache update completion with template storage and management
**Notes**: Comprehensive cache updating with template storage and timestamp management

### invalidateCache Function (Lines 72-80)
**Purpose**: Invalidates template cache for forced refresh and template updates
**Parameters**: No parameters - comprehensive cache invalidation and reset
**Returns**: void - Cache invalidation completion with reset coordination
**Notes**: Advanced cache invalidation ensuring template refresh and data consistency

### Template Validation (Lines 82-100)
**Purpose**: Validates MEF templates for structure integrity and framework compliance
**Parameters**: Template validation parameters with structure checking and compliance assessment
**Returns**: Validation results with template integrity and compliance information
**Notes**: Comprehensive template validation ensuring MEF framework compliance and structure integrity

### Error Handling (Lines 102-115)
**Purpose**: Handles template service errors with comprehensive error processing and recovery
**Parameters**: Error objects and service context for error handling and recovery
**Returns**: Error handling with service resilience and graceful failure management
**Notes**: Advanced error handling ensuring service resilience and template operation continuity

## Data Flow
1. **Template Request**: Template request → Cache validation → Template retrieval → Cache update → Template delivery
2. **Cache Management**: Cache check → Expiry validation → Cache hit/miss → Template coordination → Performance optimization
3. **BPMCP Integration**: Template request → BPMCP service → Graph query → Template retrieval → Data formatting
4. **Cache Invalidation**: Invalidation request → Cache reset → Template refresh → Cache coordination → Update completion
5. **Template Validation**: Template data → Structure validation → Framework compliance → Validation results → Quality assurance
6. **Error Handling**: Error detection → Error processing → Recovery strategies → Service continuity → Operation completion

## Configuration
### Service Configuration
- **MEF Framework**: Metalogikon Epistemic Framework integration for template structure and validation
- **Cache Management**: Advanced cache management with expiry validation and performance optimization
- **BPMCP Integration**: Knowledge base integration for template retrieval from Bimba graph
- **Template Validation**: Comprehensive template validation ensuring framework compliance

### Cache Configuration
- **Cache Expiry**: 1-hour cache expiry for template data with automatic refresh coordination
- **Performance Optimization**: Cache optimization for template retrieval and performance management
- **Memory Management**: Template cache memory management with efficient storage and retrieval
- **Invalidation Strategy**: Cache invalidation strategy for forced refresh and data consistency

### Template Configuration
- **MEF Structure**: MEF template structure validation and framework compliance
- **Graph Integration**: Bimba graph integration for template retrieval and data access
- **Template Management**: Comprehensive template management with validation and coordination
- **Framework Compliance**: MEF framework compliance ensuring template integrity and structure

## Testing
MEF templates service testing available in subsystems/5_epii/tests/services/ directory with comprehensive template retrieval and cache management testing

## Related Files
### Core Dependencies
- **../../../databases/bpmcp/bpMCP.service.mjs**: BPMCP service for knowledge base integration and template retrieval

### Integration Points
- **./epii-agent.service.mjs**: Epii agent service consuming MEF templates for analysis operations
- **../5_integration/pipelines/stages/**: Pipeline stages utilizing MEF templates for content processing
- **Template Processing**: Template processing systems requiring MEF template access
- **Knowledge Operations**: Knowledge operations requiring MEF template integration

### System Architecture
- **Template Service Layer**: Primary template service layer for MEF template retrieval and management
- **Cache Optimization**: Advanced cache optimization with expiry management and performance coordination
- **BPMCP Integration**: Comprehensive BPMCP integration for template retrieval from Bimba graph
- **MEF Framework**: MEF framework integration for template structure and validation

## Development Notes
- **Template Service Excellence**: Comprehensive MEF templates service enabling consistent template retrieval and management operations
- **Cache Optimization**: Advanced cache management with expiry validation and performance optimization for template operations
- **BPMCP Integration**: Sophisticated BPMCP service integration for template retrieval from Bimba graph with comprehensive data access
- **MEF Framework Integration**: Advanced MEF framework integration ensuring template structure integrity and framework compliance
- **Performance Management**: Comprehensive performance management with cache optimization and efficient template retrieval
- **Error Handling Resilience**: Advanced error handling ensuring service resilience and template operation continuity
- **Development Support**: Clear template service boundaries and comprehensive template management
- **Production Service**: Scalable MEF templates service suitable for production template retrieval operations
- **Debugging Excellence**: Comprehensive template service monitoring and cache management tracking
- **BPMCP Alignment**: MEF templates service integration with sophisticated Bimba coordinate system and knowledge base support
