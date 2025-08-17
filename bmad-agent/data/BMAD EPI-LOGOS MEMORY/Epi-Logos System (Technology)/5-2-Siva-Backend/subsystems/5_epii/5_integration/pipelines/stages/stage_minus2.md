# stage_minus0.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/pipelines/stages/stage_minus2.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Pipeline Stage -2 (Chunk Analysis Engine) providing comprehensive chunk analysis and concept relationship identification for the Epii analysis pipeline. Handles deep chunk analysis, Bimba coordinate alignment, concept mapping extraction, variation identification, and context-aware processing. Serves as the core analysis engine in the Epii analysis pipeline enabling sophisticated chunk-level analysis, coordinate alignment assessment, and comprehensive concept relationship mapping with enhanced context windows and Bimba-centric processing.

## System Integration
### Imports
- **Epii LLM Service**: epiiLLMService from epii-llm.service.mjs for LLM-based chunk analysis and concept mapping
- **LangSmith Tracing**: langsmithTracing from langsmith-tracing.mjs for operation tracking and performance monitoring

### Exports
- **runStageMinus2**: Main pipeline stage function for chunk analysis and concept relationship identification

### Dependencies
- **Stage -3 Output**: Requires document chunks and metadata from previous pipeline stage
- **Epii LLM Service**: LLM operations for chunk analysis, concept mapping, and variation identification
- **LangSmith Tracing**: Operation monitoring and performance tracking
- **Bimba Coordinate System**: Coordinate alignment assessment and Bimba-centric analysis

### Dependents
- **Stage -1**: Consumes chunk analysis results for synthesis and core element extraction
- **Pipeline Orchestrator**: Manages stage execution and chunk analysis coordination
- **Analysis Engine**: Provides core analysis capabilities for concept relationship mapping

## Key Functions/Components
### runStageMinus2 Function (Lines 26-422)
**Purpose**: Main pipeline stage function executing comprehensive chunk analysis and concept relationship identification
**Parameters**: state (object) - Document chunks and metadata from Stage -3 with sourceMetadata and processing context
**Returns**: Promise<object> - Analysis state with chunkAnalyses, mappings, variations, and tags
**Notes**: 422 lines implementing sophisticated chunk analysis engine with enhanced context windows and Bimba-centric processing

### Input Validation (Lines 27-45)
**Purpose**: Validates required state properties from previous pipeline stage
**Parameters**: State object with documentChunks, originalChunks, sourceMetadata, and processing context
**Returns**: Validated state ensuring chunk availability and pipeline continuity
**Notes**: Comprehensive validation ensuring chunk completeness and metadata integrity

### Chunk Iteration Engine (Lines 47-120)
**Purpose**: Iterates through document chunks for individual analysis processing
**Parameters**: Document chunks array and analysis configuration
**Returns**: Individual chunk analysis results with context awareness
**Notes**: Enhanced iteration with context windows for improved analysis quality and chunk relationship understanding

### Bimba Coordinate Alignment (Lines 122-180)
**Purpose**: Assesses alignment between text chunks and Bimba coordinates with deep elaboration
**Parameters**: Chunk content, target coordinate, and alignment assessment configuration
**Returns**: Alignment analysis with significance, nuances, and implications
**Notes**: Enhanced alignment assessment going beyond simple confirmation to provide deep elaboration on coordinate relationships

### Concept Mapping Extraction (Lines 182-240)
**Purpose**: Extracts concept mappings and relationships from chunk content
**Parameters**: Analyzed chunks and concept extraction configuration
**Returns**: Concept mappings with relationship identification and coordinate alignment
**Notes**: Sophisticated mapping extraction with enhanced Bimba-centric analysis and coordinate relationship identification

### Variation Identification (Lines 242-300)
**Purpose**: Identifies variations, contradictions, and concept differences across chunks
**Parameters**: Chunk analyses and variation detection configuration
**Returns**: Variation analysis with classification and significance assessment
**Notes**: Advanced variation detection with clearer differentiation between QL and Bimba perspectives

### Tagging System (Lines 302-360)
**Purpose**: Tags chunks with relevant categories, themes, and analytical markers
**Parameters**: Chunk content and tagging configuration
**Returns**: Comprehensive tagging with thematic and analytical categorization
**Notes**: Enhanced tagging system with improved categorization and analytical depth

### Context Window Processing (Lines 362-400)
**Purpose**: Processes chunks with enhanced context windows for better analysis quality
**Parameters**: Chunk content, surrounding context, and window configuration
**Returns**: Context-aware analysis with improved understanding and relationship identification
**Notes**: Advanced context processing enabling better chunk relationship understanding and analysis quality

### Analysis Consolidation (Lines 402-422)
**Purpose**: Consolidates individual chunk analyses into comprehensive analysis state
**Parameters**: Individual chunk analyses, mappings, variations, and tags
**Returns**: Consolidated analysis state ready for Stage -1 synthesis
**Notes**: Comprehensive consolidation ensuring complete analysis coverage and state preparation

## Data Flow
1. **Input Processing**: Stage -3 output → Input validation → Chunk preparation → Analysis initialization
2. **Chunk Analysis**: Individual chunks → Context window processing → Bimba alignment → Concept extraction
3. **Mapping Extraction**: Chunk concepts → Relationship identification → Coordinate alignment → Mapping consolidation
4. **Variation Detection**: Cross-chunk analysis → Contradiction identification → Variation classification → Significance assessment
5. **Tagging Processing**: Chunk content → Thematic analysis → Analytical categorization → Tag assignment
6. **Analysis Consolidation**: Individual analyses → Mapping consolidation → Variation synthesis → State preparation → Stage -1 handoff

## Configuration
### Pipeline Configuration
- **Stage Position**: Core analysis stage (-2) in Epii analysis pipeline
- **Input Requirements**: Document chunks and metadata from Stage -3
- **Output Format**: Comprehensive analysis state with mappings, variations, and tags
- **Processing Focus**: Deep chunk analysis with Bimba coordinate alignment

### Analysis Configuration
- **Enhanced Context Windows**: Improved context processing for better analysis quality
- **Bimba-Centric Processing**: Deep coordinate alignment with significance elaboration
- **Concept Mapping**: Sophisticated relationship extraction and coordinate alignment
- **Variation Detection**: Advanced contradiction and difference identification

### Quality Enhancement Configuration
- **Deep Elaboration**: Beyond simple alignment confirmation to comprehensive significance analysis
- **QL/Bimba Differentiation**: Clearer distinction between QL and Bimba perspectives
- **Context Awareness**: Enhanced context windows for improved chunk relationship understanding
- **Analytical Depth**: Sophisticated analysis with nuanced understanding and implication assessment

## Testing
Pipeline stage testing available in databases/shared/data/tests/pipelines/stages/ directory with specific stage_minus2.test.mjs

## Related Files
### Pipeline Dependencies
- **../stage_minus3.mjs**: Previous pipeline stage providing document chunks and metadata
- **../stage_minus1.mjs**: Next pipeline stage consuming chunk analysis results
- **../../epii_analysis_pipeline.mjs**: Main pipeline orchestrator managing chunk analysis execution
- **../../../2_services/epii-llm.service.mjs**: LLM service for chunk analysis operations

### System Integration
- **langsmith-tracing.mjs**: Operation monitoring and performance tracking
- **Bimba Coordinate System**: Coordinate alignment assessment and Bimba-centric processing
- **Analysis Services**: Chunk analysis and concept mapping capabilities

### Pipeline Ecosystem
- **stage_minus1.mjs**: Core elements synthesis and analysis consolidation
- **stage_minus0.mjs**: Final synthesis and payload generation
- **stage_minus3.mjs**: Content extraction and initial analysis
- **stage_minus4.mjs**: Document processing and preparation
- **stage_minus5.mjs**: Document fetch and initialization

## Development Notes
- **Core Analysis Engine**: Sophisticated chunk analysis with enhanced context windows and Bimba-centric processing
- **Enhanced Elaboration**: Deep significance analysis going beyond simple alignment confirmation
- **Context Window Enhancement**: Improved context processing for better chunk relationship understanding
- **Bimba Coordinate Integration**: Advanced coordinate alignment with nuanced understanding and implication assessment
- **Concept Mapping Excellence**: Sophisticated relationship extraction with coordinate alignment and mapping consolidation
- **Variation Intelligence**: Advanced contradiction detection with clearer QL/Bimba differentiation
- **Analytical Depth**: Comprehensive chunk analysis with enhanced categorization and thematic understanding
- **Performance Monitoring**: LangSmith integration for operation tracking and analysis optimization
- **Development Support**: Clear analysis boundaries and comprehensive chunk processing management
- **BPMCP Alignment**: Enhanced coordinate-aware processing with sophisticated Bimba system integration
