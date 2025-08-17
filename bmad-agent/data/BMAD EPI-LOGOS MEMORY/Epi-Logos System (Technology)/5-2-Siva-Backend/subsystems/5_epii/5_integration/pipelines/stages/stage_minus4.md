# stage_minus0.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/pipelines/stages/stage_minus4.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Pipeline Stage -4 (Context Analysis and Document Preparation) providing comprehensive context gathering and document preparation for the Epii analysis pipeline. Handles Bimba context retrieval, project context integration, coordinate mapping generation, and Bimba-enhanced document contextualization. Serves as the context analysis stage in the Epii analysis pipeline enabling context-aware document preparation, coordinate-specific analysis enhancement, and comprehensive context integration corresponding to the +1 (Definition) stage in the Quaternary Logic cycle.

## System Integration
### Imports
- **Epii LLM Service**: defaultEpiiLLMService from epii-llm.service.mjs for LLM-based context analysis and enhancement
- **Context Utils**: generateBimbaMapSummary from context.mjs for Bimba map summarization and context window generation
- **Graph Utils**: getBimbaContextFromBimbaMap, getProjectContextFromBimbaMap, getBimbaCoordinateMapFromBimbaMap from graphData.utils.mjs for context retrieval and mapping

### Exports
- **runStageMinus4**: Main pipeline stage function for context analysis and document preparation

### Dependencies
- **Stage -5 Output**: Requires document content and bimbaMap from previous pipeline stage
- **Epii LLM Service**: LLM operations for context analysis and document enhancement
- **Context Utilities**: Bimba map summarization and context window generation
- **Graph Data Utilities**: Bimba context retrieval, project context extraction, and coordinate mapping
- **Stage -3**: Next pipeline stage for structure integration and chunking

### Dependents
- **Stage -3**: Consumes contextualized document state for chunking and RAG preparation
- **Pipeline Orchestrator**: Manages stage execution and context analysis coordination
- **Context Analysis**: Provides comprehensive context integration for downstream analysis
- **Document Enhancement**: Delivers Bimba-enhanced document context for analysis pipeline

## Key Functions/Components
### runStageMinus4 Function (Lines 32-296)
**Purpose**: Main pipeline stage function executing context analysis and document preparation
**Parameters**: state (object) - Document content and bimbaMap from Stage -5 with target coordinate information
**Returns**: Promise<object> - Contextualized state with bimbaEnhancedContext, projectContext, and coordinate mapping
**Notes**: 296 lines implementing comprehensive context analysis with Bimba coordinate integration and Quaternary Logic alignment

### Input Validation (Lines 33-50)
**Purpose**: Validates required state properties from previous pipeline stage
**Parameters**: State object with documentContent, bimbaMap, targetCoordinate, and processing context
**Returns**: Validated state ensuring content and context availability for analysis
**Notes**: Comprehensive validation ensuring document content, bimbaMap integrity, and coordinate specification

### Bimba Context Retrieval (Lines 52-100)
**Purpose**: Retrieves relevant Bimba context for the target coordinate from bimbaMap
**Parameters**: Target coordinate, bimbaMap, and context retrieval configuration
**Returns**: Bimba context with coordinate-specific information and relationships
**Notes**: Advanced context retrieval with coordinate-specific filtering and relationship mapping

### Project Context Integration (Lines 102-150)
**Purpose**: Retrieves and integrates project context from bimbaMap for comprehensive analysis
**Parameters**: BimbaMap, project identification, and context integration configuration
**Returns**: Project context with comprehensive project-level information and relationships
**Notes**: Project-level context integration providing broader analytical context and project awareness

### Coordinate Mapping Generation (Lines 152-200)
**Purpose**: Generates Bimba coordinate map from bimbaMap for coordinate relationship understanding
**Parameters**: BimbaMap, coordinate mapping configuration, and relationship analysis settings
**Returns**: Coordinate map with relationship structures and coordinate interconnections
**Notes**: Advanced coordinate mapping enabling comprehensive coordinate relationship analysis and navigation

### Bimba-Enhanced Context Creation (Lines 202-240)
**Purpose**: Creates Bimba-enhanced document context by integrating document content with Bimba context
**Parameters**: Document content, Bimba context, project context, and enhancement configuration
**Returns**: Enhanced document context with integrated Bimba coordinate awareness
**Notes**: Sophisticated context enhancement enabling coordinate-aware document analysis and processing

### Bimba Map Summarization (Lines 242-270)
**Purpose**: Generates Bimba map summary for context windows and analysis optimization
**Parameters**: BimbaMap, summarization configuration, and context window requirements
**Returns**: Bimba map summary optimized for context windows and analysis processing
**Notes**: Advanced summarization providing concise yet comprehensive context for analysis stages

### State Preparation (Lines 272-290)
**Purpose**: Prepares clean contextualized state for Stage -3 with enhanced document and context
**Parameters**: Enhanced context, coordinate mapping, and state configuration
**Returns**: Optimized state ready for structure integration and chunking
**Notes**: State optimization ensuring efficient Stage -3 processing with comprehensive context integration

### Pipeline Continuation (Lines 292-296)
**Purpose**: Initiates Stage -3 execution with prepared contextualized state
**Parameters**: Prepared state and pipeline configuration
**Returns**: Stage -3 execution results and pipeline continuation
**Notes**: Seamless pipeline transition with contextualized state handoff and structure integration initiation

## Data Flow
1. **Input Processing**: Stage -5 output → Input validation → Content and context preparation → Analysis initialization
2. **Context Retrieval**: Target coordinate → Bimba context retrieval → Project context integration → Context consolidation
3. **Coordinate Mapping**: BimbaMap → Coordinate relationship analysis → Mapping generation → Relationship structuring
4. **Document Enhancement**: Document content → Bimba context integration → Enhanced contextualization → Context-aware preparation
5. **Map Summarization**: BimbaMap → Summarization processing → Context window optimization → Analysis preparation
6. **State Preparation**: Enhanced context → State optimization → Structure preparation → Stage -3 handoff

## Configuration
### Pipeline Configuration
- **Stage Position**: Context analysis stage (-4) in Epii analysis pipeline
- **Input Requirements**: Document content and bimbaMap from Stage -5
- **Output Format**: Contextualized state with enhanced document and comprehensive context
- **Processing Focus**: Context analysis with Bimba coordinate integration and document enhancement

### Context Analysis Configuration
- **Bimba Context Retrieval**: Coordinate-specific context extraction with relationship mapping
- **Project Context Integration**: Comprehensive project-level context integration and awareness
- **Coordinate Mapping**: Advanced coordinate relationship analysis and navigation structures
- **Document Enhancement**: Bimba-enhanced document contextualization with coordinate awareness

### Quaternary Logic Integration
- **QL Cycle Alignment**: Corresponds to +1 (Definition) stage in Quaternary Logic cycle
- **Context Definition**: Comprehensive context definition and integration for analysis preparation
- **Coordinate Awareness**: Enhanced coordinate understanding and relationship mapping
- **Analysis Preparation**: Context-aware document preparation for downstream analysis stages

## Testing
Pipeline stage testing available in databases/shared/data/tests/pipelines/stages/ directory with specific stage_minus4.test.mjs

## Related Files
### Pipeline Dependencies
- **../stage_minus5.mjs**: Previous pipeline stage providing document content and bimbaMap
- **../stage_minus3.mjs**: Next pipeline stage consuming contextualized document state
- **../../epii_analysis_pipeline.mjs**: Main pipeline orchestrator managing context analysis execution
- **../../../2_services/epii-llm.service.mjs**: LLM service for context analysis operations

### System Integration
- **../../../1_utils/content/context.mjs**: Context utilities for Bimba map summarization and context window generation
- **../../../../../databases/shared/utils/graphData.utils.mjs**: Graph data utilities for context retrieval and coordinate mapping
- **Context Analysis Services**: Comprehensive context integration and enhancement capabilities

### Pipeline Ecosystem
- **stage_minus3.mjs**: Structure integration and RAG preparation
- **stage_minus2.mjs**: Chunk analysis and concept relationship identification
- **stage_minus1.mjs**: Core elements synthesis and analysis consolidation
- **stage_minus0.mjs**: Final synthesis and payload generation
- **stage_minus5.mjs**: Document fetch and initialization

## Development Notes
- **Context Analysis Excellence**: Comprehensive context gathering with Bimba coordinate integration and project awareness
- **Quaternary Logic Alignment**: Corresponds to +1 (Definition) stage enabling context definition and analysis preparation
- **Document Enhancement**: Advanced Bimba-enhanced document contextualization with coordinate awareness
- **Coordinate Mapping**: Sophisticated coordinate relationship analysis and navigation structure generation
- **Project Integration**: Comprehensive project-level context integration providing broader analytical perspective
- **Context Optimization**: Advanced context summarization and optimization for downstream analysis stages
- **State Management**: Comprehensive contextualized state preparation with enhanced document and context integration
- **Pipeline Integration**: Seamless context analysis integration with structure preparation and analysis stages
- **Development Support**: Clear context boundaries and comprehensive context analysis management
- **BPMCP Alignment**: Advanced Bimba coordinate integration with sophisticated context analysis and enhancement
