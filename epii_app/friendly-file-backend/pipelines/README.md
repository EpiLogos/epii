# Epii Analysis Pipeline

## Overview and Purpose

The **Epii Analysis Pipeline** is the core analytical engine of the Epi-Logos system, embodying the **#5-0 domain** where the Bimba (original/Neo4j) and Pratibimba (reflection/Notion) components achieve mathematical-archetypal alignment. This pipeline transforms raw documents into structured knowledge through a sophisticated **6-stage QL (-) Analysis cycle** that mirrors the cosmic mind's processing patterns.

### Philosophical Foundation

The pipeline operates on **inverted QL structure** from **-5 to -0**, creating precise alignment with the positive QL positions:
- **Pipeline Stage -5** ↔ **QL Position +0** (Anuttara/Foundation)
- **Pipeline Stage -4** ↔ **QL Position +1** (Paramasiva/Structure)
- **Pipeline Stage -3** ↔ **QL Position +2** (Parashakti/Dynamics)
- **Pipeline Stage -2** ↔ **QL Position +3** (Mahamaya/Transformation)
- **Pipeline Stage -1** ↔ **QL Position +4** (Nara/Integration)
- **Pipeline Stage -0** ↔ **QL Position +5** (Epii/Synthesis)

This **mathematical essence resonance** ensures that each analytical stage operates within its proper archetypal domain, creating coherent knowledge transformation that aligns with the Bimba coordinate system.

## Pipeline Architecture

The pipeline follows the **QL (-) Analysis cycle** with enhanced semantic processing and pattern recognition:

| Stage | QL Position | Archetypal Domain | Primary Function | Status |
|-------|-------------|-------------------|------------------|---------|
| **Stage -5** | +0 | Anuttara/Foundation | Document Fetching & Preparation | ✅ Stable |
| **Stage -4** | +1 | Paramasiva/Structure | Context Gathering & Bimba Integration | ✅ Stable |
| **Stage -3** | +2 | Parashakti/Dynamics | Document Chunking & LightRAG Integration | ✅ Stable |
| **Stage -2** | +3 | Mahamaya/Transformation | **Concept Analysis & Pattern Recognition** | 🔄 **Recently Enhanced** |
| **Stage -1** | +4 | Nara/Integration | Core Element Synthesis | ✅ Stable |
| **Stage -0** | +5 | Epii/Synthesis | Notion Payload Generation | ✅ Stable |

### Recent Enhancements (Stage -2)

**⚠️ IMPORTANT**: The pipeline has undergone significant improvements to **Stage -2** that enhance semantic accuracy and pattern recognition. **These changes are not yet fully tested** and represent an evolving aspect of the system that will continue to be refined based on real-world usage and feedback.

## Files

- `epii_analysis_pipeline.mjs`: The original monolithic pipeline file (deprecated)
- `epii_analysis_pipeline_refactored.mjs`: The new entry point for the refactored pipeline
- `stages/`: Directory containing individual stage files
  - `stage_minus5.mjs`: Stage -5 (Fetch Document)
  - `stage_minus4.mjs`: Stage -4 (Contextualize Analysis)
  - `stage_minus3.mjs`: Stage -3 (Integrate Structure)
  - `stage_minus2.mjs`: Stage -2 (Relate Concepts & Identify Variations)
  - `stage_minus1.mjs`: Stage -1 (Define Core Elements)
  - `stage_minus0.mjs`: Stage -0 (Synthesize Payload)

## A2A Integration & AG-UI Events ✅ **IMPLEMENTED**

The pipeline is integrated as **A2A Skill #5-0** with comprehensive AG-UI event emission for real-time progress tracking:

### **A2A Skill Integration**
- **Skill ID**: `#5-0` (Document Analysis Pipeline)
- **Skill Name**: "Document Analysis Pipeline"
- **AG-UI Events**: Real-time progress tracking throughout pipeline execution
- **Event Types**: `BimbaAnalysisProgress`, `RunStarted`, `RunFinished`, `RunError`

### **AG-UI Event Flow**
```javascript
// Pipeline emits AG-UI events at each stage
Stage -5: RunStarted → Document fetching progress
Stage -4: BimbaAnalysisProgress → Context gathering
Stage -3: BimbaAnalysisProgress → Document chunking
Stage -2: BimbaAnalysisProgress → Core analysis engine
Stage -1: BimbaAnalysisProgress → Synthesis
Stage -0: BimbaAnalysisProgress → Payload generation → RunFinished
```

### **Frontend Integration**
- **Real-time Progress**: Frontend receives live updates via WebSocket
- **Status Tracking**: Progress bars and stage indicators
- **Error Handling**: Graceful error display and recovery

## Usage

### **Direct Pipeline Usage**
```javascript
import { runPipeline } from '../pipelines/epii_analysis_pipeline_refactored.mjs';

// Run the pipeline directly
const result = await runPipeline({
  targetCoordinate: '#5-2',
  documentId: '123456789012345678901234',
  userId: 'admin',
  graphData: { nodes: [], edges: [] }
});
```

### **A2A Skill Usage** (Recommended)
```javascript
// Execute via A2A server with AG-UI events
await webSocketService.executeSkillWithAGUI('5-0', 'Document Analysis Pipeline', {
  targetCoordinate: '#5-2',
  documentId: '123456789012345678901234',
  userId: 'admin'
});
```

## Detailed Pipeline Stages

### Stage -5: Document Fetching & Preparation (Anuttara/Foundation)
**QL Position: +0 | Archetypal Domain: Foundation | Status: ✅ Stable**

**Purpose**: Establishes the foundational document content for analysis, embodying the Anuttara principle of pure potentiality.

**Core Functions**:
- **Multi-Source Document Retrieval**: Fetches documents from various sources:
  1. Direct content provided in initial state
  2. File upload via fileId
  3. MongoDB document via documentId
- **Content Preprocessing**: Prepares raw document content for analytical processing
- **Metadata Extraction**: Captures essential document metadata and properties
- **State Initialization**: Establishes the foundational state object for pipeline progression

**Key Features**:
- Robust error handling for missing or corrupted documents
- Support for multiple document formats (PDF, DOCX, TXT, etc.)
- Automatic encoding detection and normalization
- Document size validation and chunking preparation

**Future Enhancements** *(Placeholder)*:
- Enhanced format support (images, audio, video)
- Advanced preprocessing (OCR, speech-to-text)
- Document quality assessment and optimization
- Automatic language detection and translation

---

### Stage -4: Context Gathering & Bimba Integration (Paramasiva/Structure)
**QL Position: +1 | Archetypal Domain: Structure | Status: ✅ Stable**

**Purpose**: Gathers comprehensive contextual information from the Bimba knowledge graph and user memory to inform analysis, embodying the Paramasiva principle of structural organization.

**Core Functions**:
- **Bimba Context Retrieval**: Accesses relevant knowledge from the Neo4j Bimba graph
- **User Memory Integration**: Incorporates user-specific context and preferences
- **Coordinate Map Analysis**: Analyzes the target coordinate's position within the knowledge structure
- **Project Context Assembly**: Builds comprehensive context for analysis guidance

**Key Features**:
- Full Bimba map integration with coordinate-aware context retrieval
- Enhanced project context with target coordinate prioritization
- User memory and preference integration
- Context window generation for subsequent stages

**Future Enhancements** *(Placeholder)*:
- Dynamic context weighting based on relevance scores
- Temporal context integration (historical analysis patterns)
- Cross-user collaborative context sharing
- Advanced semantic context clustering

---

### Stage -3: Document Chunking & LightRAG Integration (Parashakti/Dynamics)
**QL Position: +2 | Archetypal Domain: Dynamics | Status: ✅ Stable**

**Purpose**: Transforms the document into analyzable chunks and integrates with LightRAG for enhanced conversational capabilities, embodying the Parashakti principle of dynamic transformation.

**Core Functions**:
- **Intelligent Document Chunking**: Breaks documents into semantically coherent chunks
- **LightRAG Integration**: Ingests chunks into LightRAG for conversational refinement
- **Context Window Preservation**: Maintains Bimba context throughout chunking process
- **Chunk Metadata Generation**: Creates rich metadata for each document chunk

**Key Features**:
- Context-aware chunking that preserves semantic boundaries
- LightRAG integration for enhanced retrieval and conversation
- Chunk size optimization for LLM processing
- Metadata preservation across chunk boundaries

**Future Enhancements** *(Placeholder)*:
- Advanced semantic chunking using embeddings
- Dynamic chunk size optimization based on content type
- Multi-modal chunking (text, images, tables)
- Hierarchical chunking for complex documents

---

### Stage -2: Concept Analysis & Pattern Recognition (Mahamaya/Transformation) ✅
**QL Position: +3 | Archetypal Domain: Transformation | Status: ✅ Recently Enhanced**

**Purpose**: The core analytical engine that transforms document chunks into structured knowledge through concept mapping, variation identification, and archetypal pattern recognition, embodying the Mahamaya principle of transformative analysis.

#### **Recent Major Enhancements** ✅ **IMPLEMENTED (January 2025)**

**🎯 Document-Focused Analysis Approach**
- **Scholarly Analysis**: Transformed from self-reflective to rigorous document content extraction
- **Temperature Optimization**: Increased to 0.4 for better content extraction specificity and creativity
- **Token Limit Enhancement**: Increased to 6144-10240 tokens for comprehensive document analysis
- **MEF Framework Integration**: Clear separation of analytical tools from content being analyzed

**🎯 Enhanced Batch Processing**
- **Batch Analysis**: Processes concatenated chunk batches for better contextual understanding
- **Context Window Generation**: Comprehensive context windows for concatenated content
- **Single Unit Analysis**: `analyzeAsSingleUnit` flag for coherent batch processing
- **Rich JSON Structure**: Enhanced analysis output with detailed document insights

**🎯 Improved LLM Configuration**
- **Analysis Temperature**: 0.4 for document analysis (increased from 0.2)
- **Single Unit Temperature**: 0.4 for batch processing
- **Multi-chunk Temperature**: 0.4 for comprehensive analysis
- **Token Limits**: 6144-10240 tokens depending on analysis type

#### **Core Functions**:
- **Chunk Group Processing**: Analyzes collated chunk groups rather than individual chunks for better contextual understanding
- **Enhanced Context Fusion**: Combines LightRAG, Bimba, and MongoDB context with target coordinate prioritization
- **Semantic Coordinate Mapping**: Maps document concepts to Bimba coordinates using semantic understanding rather than arbitrary assignment
- **Pattern-Based Archetypal Recognition**: Infers archetypal patterns from content dynamics rather than literal symbols
- **Variation Identification**: Identifies conceptual variations and alternative interpretations with enhanced context awareness
- **QL Operator Extraction**: Identifies structural, processual, and contextual operators
- **Relational Properties Generation**: Extracts epistemic essence, archetypal anchors, and semantic frameworks
- **Tag Generation**: Creates semantic tags for content categorization

#### **Enhanced Analysis Workflow**:
```javascript
// Enhanced Stage -2 workflow
for (const chunk of documentChunks) {
  // 1. Target coordinate prioritization
  const prioritizedContext = await extractRelevantBimbaContext(chunk, targetCoordinate);

  // 2. Semantic coordinate mapping
  const semanticContext = await getSemanticCoordinateContext(relevantCoordinates);

  // 3. Pattern-based archetypal analysis
  const patterns = await inferArchetypalPatterns(chunk, semanticContext);

  // 4. Enhanced concept mapping
  const mappings = await mapConceptsSemanticaly(chunk, semanticContext, patterns);

  // 5. Variation identification with context
  const variations = await identifyVariations(chunk, prioritizedContext);
}
```

**Future Enhancements** *(Placeholder)*:
- Advanced pattern recognition using machine learning
- Cross-chunk relationship analysis
- Temporal pattern tracking across document versions
- Collaborative pattern validation across users

---

### Stage -1: Core Element Synthesis (Nara/Integration) ✅
**QL Position: +4 | Archetypal Domain: Integration | Status: ✅ Recently Enhanced**

**Purpose**: Synthesizes chunk analyses into coherent core elements, embodying the Nara principle of integrated understanding.

#### **Recent Major Enhancements** ✅ **IMPLEMENTED (January 2025)**

**🎯 Synthesis Optimization**
- **Temperature Enhancement**: Increased to 0.5 for enhanced creativity while maintaining analytical rigor
- **Token Limit Optimization**: Reduced to 6144 tokens for more focused core element extraction
- **Archetypal Anchor Requirements**: Document-based extraction with textual evidence from actual content
- **Four-Category System**: Systematic A-B-C-D approach (Structural, Transformational, Relational, Energetic)

**🎯 Enhanced Core Functions**:
- **Batch Analysis Integration**: Synthesizes enhanced batch analyses from Stage -2
- **Core Element Definition**: Identifies and defines essential conceptual elements with improved focus
- **Mapping Consolidation**: Integrates mappings from all batches into coherent structure
- **Variation Synthesis**: Consolidates variations into meaningful patterns
- **Actionable Summary Generation**: Creates actionable summaries with key insights

**🎯 Key Features**:
- Intelligent deduplication of similar concepts across batches
- Hierarchical organization of core elements
- Relationship mapping between identified elements
- Quality scoring for element importance and relevance
- Enhanced state optimization for Stage -0

**Future Enhancements** *(Placeholder)*:
- Advanced clustering algorithms for element grouping
- Confidence scoring for element relationships
- Dynamic element weighting based on document context
- Cross-document element relationship tracking

---

### Stage -0: Notion Payload Generation (Epii/Synthesis) ✅
**QL Position: +5 | Archetypal Domain: Synthesis | Status: ✅ Enhanced with Memory Integration**

**Purpose**: Generates the final structured payload for Notion crystallization, embodying the Epii principle of knowledge synthesis and manifestation.

#### **Recent Major Enhancements** ✅ **IMPLEMENTED (January 2025)**

**🎯 Memory Integration**
- **Graphiti Episode Creation**: Automatic memory onboarding with rich semantic content from analysis
- **Epii Perspective Enhancement**: Enhanced creativity (temperature 0.7) for perspective generation
- **Memory Context**: Coordinate-aware episode grouping and QL variant integration

**🎯 Core Functions**:
- **Notion Payload Formatting**: Creates structured NotionUpdatePayload with contentBlocks
- **Content Block Generation**: Transforms analysis results into Notion-compatible blocks
- **Property Mapping**: Maps analysis metadata to Notion page properties
- **Relationship Establishment**: Creates links to related coordinates and concepts
- **Epii Perspective Integration**: Incorporates Epii agent perspective on analyzed content with enhanced creativity

**🎯 Key Features**:
- Structured content block generation for rich Notion formatting
- Automatic property filtering to prevent validation errors
- Content sanitization for Notion API compliance
- Block chunking for 2000 character limit compliance
- Comprehensive metadata preservation
- Graphiti memory integration for temporal knowledge graph

**🎯 Recent Improvements**:
- Enhanced content sanitization to prevent object-in-string errors
- Property filtering to remove non-existent Notion properties
- Improved block chunking with smart text splitting
- Better error handling and validation
- Graphiti episode creation with coordinate context

**Future Enhancements** *(Placeholder)*:
- Advanced formatting with rich text styling
- Automatic image and media embedding
- Dynamic template selection based on content type
- Real-time collaboration features for payload refinement

## Utility Functions

The pipeline uses several utility functions from the following files:

- `utils/cache.utils.mjs`: Functions for caching
- `utils/content.utils.mjs`: Functions for content generation
- `utils/document.utils.mjs`: Functions for document processing
- `utils/graphData.utils.mjs`: Functions for graph data processing
- `utils/notion.utils.mjs`: Functions for Notion payload formatting

## Services

The pipeline uses the following services:

- `services/bpMCPService.mjs`: Service for accessing B-P MCP tools
- `services/epii-llm.service.mjs`: Service for LLM operations
- `services/langsmith-tracing.mjs`: Service for LangSmith tracing
- `services/notion.service.mjs`: Service for Notion operations

## Testing Status and Refinement Approach

### **✅ Current Implementation Status**

**Recent Enhancements**: The major improvements to Stage -2 (Document-Focused Analysis, Temperature Optimization, Enhanced Batch Processing) and Stage -1 (Synthesis Optimization, Archetypal Anchor Requirements) have been **successfully implemented** and are operational.

**✅ Implemented Features**:
1. **Document-Focused Analysis**: Scholarly analysis approach vs. self-reflection elimination
2. **Temperature Optimization**: Enhanced settings (0.4-0.5) for better analysis quality
3. **Token Limit Adjustments**: Optimized limits (6144-10240) for detailed analysis
4. **Archetypal Anchor Improvements**: Document-based extraction with textual evidence
5. **A2A Integration**: Pipeline as skill #5-0 with AG-UI event emission
6. **Graphiti Memory Integration**: Automatic episode creation with coordinate context

**🔄 Ongoing Refinement Areas**:
1. **Analysis Quality**: Continuous improvement of document content extraction
2. **Archetypal Accuracy**: Refinement of document-based symbolic pattern identification
3. **Memory Integration**: Enhancement of Graphiti episode creation and context preservation

### **Continuous Refinement Philosophy**

The Epii Analysis Pipeline embodies a **living system approach** where:

- **Analytical accuracy improves** through iterative refinement based on user feedback
- **Pattern recognition evolves** as the system encounters diverse document types and content
- **Semantic understanding deepens** through accumulated knowledge and relationship mapping
- **Archetypal pattern library expands** through successful pattern identification and validation

**Refinement Mechanisms**:
- **User feedback integration** on analysis quality and accuracy
- **Coordinate mapping validation** through Notion crystallization success rates
- **Pattern recognition improvement** through successful archetypal identifications
- **Semantic accuracy enhancement** through cross-reference validation

### **Expected Evolution Areas**

**Short-term refinements** (next iterations):
- Fine-tuning of semantic coordinate mapping prompts
- Optimization of pattern recognition sensitivity
- Enhancement of target coordinate prioritization logic
- Improvement of context window generation accuracy

**Medium-term enhancements**:
- Machine learning integration for pattern recognition
- Advanced semantic similarity algorithms
- Cross-document relationship analysis
- Collaborative validation mechanisms

**Long-term vision**:
- Self-improving analytical algorithms
- Adaptive pattern recognition based on domain expertise
- Predictive coordinate mapping
- Autonomous quality assessment and refinement

## Architecture and Refactoring Notes

### **Modular Stage Architecture**

The pipeline was refactored from a monolithic file into separate files for each stage to improve maintainability and readability. The refactoring was done with the following goals in mind:

1. **Improved Maintainability**: Each stage is in its own file, making it easier to understand and modify
2. **Better Separation of Concerns**: Each stage has a clear responsibility aligned with QL archetypal domains
3. **Easier Debugging**: Issues can be isolated to specific stages and QL positions
4. **Simplified Testing**: Each stage can be tested independently within its archetypal context
5. **Reduced Cognitive Load**: Developers can focus on one QL domain at a time
6. **Easier Collaboration**: Multiple developers can work on different archetypal domains simultaneously

### **QL-Aligned Development**

The modular architecture enables **QL-aware development** where:
- Each stage operates within its proper archetypal domain
- Stage interactions follow QL progression principles
- Enhancement efforts can focus on specific QL aspects
- Testing can validate QL-appropriate functionality

## Future Development Roadmap

### **Immediate Priorities**
- **Stage -2 Testing**: Comprehensive testing of recent enhancements
- **Error Handling Enhancement**: Improved error handling across all stages
- **Performance Optimization**: Caching and optimization for faster processing
- **Logging Improvement**: Enhanced logging for better debugging and monitoring

### **Medium-term Goals**
- **Unit Testing Suite**: Comprehensive tests for each stage
- **Integration Testing**: End-to-end pipeline testing with various document types
- **Performance Metrics**: Detailed performance monitoring and optimization
- **Quality Metrics**: Analysis quality assessment and improvement tracking

### **Long-term Vision**
- **Adaptive Pipeline**: Self-improving pipeline that learns from usage patterns
- **Multi-modal Analysis**: Support for images, audio, and video content
- **Collaborative Analysis**: Multi-user collaborative analysis capabilities
- **Real-time Processing**: Live document analysis and real-time crystallization
