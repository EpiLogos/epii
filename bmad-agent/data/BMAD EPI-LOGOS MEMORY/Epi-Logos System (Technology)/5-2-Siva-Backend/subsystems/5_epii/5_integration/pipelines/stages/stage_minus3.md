# stage_minus0.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/pipelines/stages/stage_minus3.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Pipeline Stage -3 (Structure Integration and RAG Preparation) providing document chunking and LightRAG ingestion for the Epii analysis pipeline. Handles intelligent document chunking, context window generation, LightRAG integration, and Bimba context preservation during chunking. Serves as the structure integration stage in the Epii analysis pipeline enabling conversational refinement capabilities, RAG-based analysis, and enhanced context preservation with Bimba-aware chunking strategies.

## System Integration
### Imports
- **Document Utils**: chunkDocument, sendChunksToLightRAG from document.utils.mjs for document chunking and RAG integration
- **Context Utils**: generateContextWindow from context.mjs for context window generation and preservation
- **Next Stage**: runStageMinus2 from stage_minus2.mjs for pipeline continuation

### Exports
- **runStageMinus3**: Main pipeline stage function for structure integration and RAG preparation

### Dependencies
- **Stage -4 Output**: Requires document content and metadata from previous pipeline stage
- **Document Utilities**: Document chunking and LightRAG ingestion capabilities
- **Context Utilities**: Context window generation and Bimba context preservation
- **LightRAG Service**: RAG ingestion and conversational refinement preparation
- **Stage -2**: Next pipeline stage for chunk analysis processing

### Dependents
- **Stage -2**: Consumes chunked document state for analysis processing
- **Pipeline Orchestrator**: Manages stage execution and chunking coordination
- **LightRAG System**: Receives chunks for conversational refinement capabilities
- **RAG Analysis**: Provides structured chunks for retrieval-augmented analysis

## Key Functions/Components
### runStageMinus3 Function (Lines 26-264)
**Purpose**: Main pipeline stage function executing structure integration and RAG preparation
**Parameters**: state (object) - Document content and metadata from Stage -4 with bimbaEnhancedContext
**Returns**: Promise<object> - Chunked state with documentChunks, originalChunks, and RAG integration
**Notes**: 264 lines implementing intelligent document chunking with context preservation and LightRAG integration

### Input Validation (Lines 27-40)
**Purpose**: Validates required state properties from previous pipeline stage
**Parameters**: State object with documentContent, sourceMetadata, and bimbaEnhancedContext
**Returns**: Validated state ensuring content availability and pipeline continuity
**Notes**: Comprehensive validation ensuring document content completeness and metadata integrity

### Chunking Configuration (Lines 14-16, 42-60)
**Purpose**: Configures document chunking parameters for optimal analysis processing
**Parameters**: Chunk size (1000), overlap (200), and chunking strategy configuration
**Returns**: Chunking configuration optimized for analysis pipeline
**Notes**: Balanced chunking strategy preserving context while enabling efficient analysis processing

### Document Chunking (Lines 62-120)
**Purpose**: Chunks document content using intelligent chunking strategies
**Parameters**: Document content, chunking configuration, and context preservation settings
**Returns**: Document chunks with preserved context and metadata
**Notes**: Enhanced chunking with context window integration for Bimba context preservation

### Context Window Generation (Lines 122-180)
**Purpose**: Generates context windows for chunks to preserve Bimba context during chunking
**Parameters**: Document chunks, Bimba context, and window generation configuration
**Returns**: Context-enhanced chunks with preserved Bimba relationships
**Notes**: Advanced context preservation ensuring Bimba coordinate awareness throughout chunking process

### LightRAG Integration (Lines 182-220)
**Purpose**: Sends chunks to LightRAG for ingestion and conversational refinement preparation
**Parameters**: Context-enhanced chunks and LightRAG integration configuration
**Returns**: RAG ingestion confirmation and conversational refinement readiness
**Notes**: LightRAG integration enabling future conversational refinement and retrieval-augmented analysis

### Chunk Metadata Processing (Lines 222-240)
**Purpose**: Processes and preserves chunk metadata for analysis pipeline
**Parameters**: Chunked content, source metadata, and processing configuration
**Returns**: Enhanced chunk metadata with source tracking and context preservation
**Notes**: Comprehensive metadata preservation ensuring traceability and context continuity

### State Preparation (Lines 242-260)
**Purpose**: Prepares chunked state for Stage -2 with enhanced chunks and metadata
**Parameters**: Processed chunks, metadata, and state configuration
**Returns**: Optimized state ready for chunk analysis processing
**Notes**: State optimization ensuring efficient Stage -2 processing and analysis readiness

### Pipeline Continuation (Lines 262-264)
**Purpose**: Initiates Stage -2 execution with prepared chunked state
**Parameters**: Prepared state and pipeline configuration
**Returns**: Stage -2 execution results and pipeline continuation
**Notes**: Seamless pipeline transition with chunked state handoff and analysis initiation

## Data Flow
1. **Input Processing**: Stage -4 output → Input validation → Content preparation → Chunking initialization
2. **Document Chunking**: Document content → Chunking strategy → Intelligent chunking → Chunk generation
3. **Context Enhancement**: Document chunks → Context window generation → Bimba context preservation → Enhanced chunks
4. **RAG Integration**: Enhanced chunks → LightRAG ingestion → Conversational preparation → RAG readiness
5. **Metadata Processing**: Chunk metadata → Source preservation → Context tracking → Enhanced metadata
6. **State Preparation**: Processed chunks → State optimization → Analysis preparation → Stage -2 handoff

## Configuration
### Pipeline Configuration
- **Stage Position**: Structure integration stage (-3) in Epii analysis pipeline
- **Input Requirements**: Document content and metadata from Stage -4
- **Output Format**: Chunked state with enhanced chunks and RAG integration
- **Processing Focus**: Document chunking with context preservation and RAG preparation

### Chunking Configuration
- **Chunk Size**: 1000 characters for optimal analysis processing
- **Chunk Overlap**: 200 characters for context continuity
- **Context Preservation**: Enhanced context windows for Bimba awareness
- **Intelligent Chunking**: Strategy optimization for analysis pipeline compatibility

### RAG Integration Configuration
- **LightRAG Ingestion**: Chunk ingestion for conversational refinement capabilities
- **Conversational Preparation**: RAG readiness for future interactive analysis
- **Retrieval Optimization**: Chunk structuring for efficient retrieval-augmented analysis
- **Context Enhancement**: Bimba-aware chunking for coordinate-sensitive RAG operations

## Testing
Pipeline stage testing available in databases/shared/data/tests/pipelines/stages/ directory with specific stage_minus3.test.mjs

## Related Files
### Pipeline Dependencies
- **../stage_minus4.mjs**: Previous pipeline stage providing document content and metadata
- **../stage_minus2.mjs**: Next pipeline stage consuming chunked document state
- **../../epii_analysis_pipeline.mjs**: Main pipeline orchestrator managing chunking execution
- **../../../1_utils/document.utils.mjs**: Document chunking and LightRAG integration utilities

### System Integration
- **../../../1_utils/content/context.mjs**: Context window generation and preservation utilities
- **LightRAG Service**: RAG ingestion and conversational refinement capabilities
- **Chunking Services**: Document chunking and content structuring operations

### Pipeline Ecosystem
- **stage_minus2.mjs**: Chunk analysis and concept relationship identification
- **stage_minus1.mjs**: Core elements synthesis and analysis consolidation
- **stage_minus0.mjs**: Final synthesis and payload generation
- **stage_minus4.mjs**: Document processing and preparation
- **stage_minus5.mjs**: Document fetch and initialization

## Development Notes
- **Structure Integration**: Intelligent document chunking with enhanced context preservation and RAG preparation
- **Context Preservation**: Advanced context window generation ensuring Bimba coordinate awareness throughout chunking
- **LightRAG Integration**: Comprehensive RAG ingestion enabling conversational refinement and retrieval-augmented analysis
- **Chunking Strategy**: Optimized chunking parameters balancing context preservation with analysis efficiency
- **Metadata Management**: Comprehensive metadata preservation ensuring traceability and context continuity
- **RAG Readiness**: Complete preparation for conversational refinement and interactive analysis capabilities
- **Pipeline Optimization**: Efficient chunking and state preparation for downstream analysis processing
- **Development Support**: Clear chunking boundaries and comprehensive content structuring management
- **Performance Balance**: Optimal chunk sizing for analysis efficiency while preserving context integrity
- **BPMCP Alignment**: Bimba-aware chunking strategies with coordinate-sensitive context preservation
