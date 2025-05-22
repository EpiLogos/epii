# Epii Analysis Pipeline

This directory contains the Epii Analysis Pipeline, which is responsible for analyzing documents and generating structured payloads for the Epii Canvas.

## Pipeline Structure

The pipeline follows the QL (-) Analysis cycle:

- **Stage -5**: Fetch Document (corresponds to +0)
- **Stage -4**: Contextualize Analysis (corresponds to +1)
- **Stage -3**: Integrate Structure (corresponds to +2)
- **Stage -2**: Relate Concepts & Identify Variations (corresponds to +3)
- **Stage -1**: Define Core Elements (corresponds to +4)
- **Stage -0**: Synthesize Payload (corresponds to +5)

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

## Usage

To use the pipeline, import the `runPipeline` function from `epii_analysis_pipeline_refactored.mjs`:

```javascript
import { runPipeline } from '../pipelines/epii_analysis_pipeline_refactored.mjs';

// Run the pipeline
const result = await runPipeline({
  targetCoordinate: '#5-2',
  documentId: '123456789012345678901234',
  userId: 'admin',
  graphData: { nodes: [], edges: [] }
});
```

## Pipeline Stages

### Stage -5: Fetch Document

This stage is responsible for fetching the document from various sources:
1. Direct content provided in the initial state
2. File upload (fileId provided)
3. MongoDB document (documentId provided)

The document content is then pre-processed and prepared for the next stage.

### Stage -4: Contextualize Analysis

This stage gathers relevant context from Bimba, user memory, and the coordinate map to inform the analysis. It is enhanced with full Bimba map and project context.

### Stage -3: Integrate Structure

This stage chunks the document and sends chunks for ingestion into LightRAG to enable conversational refinement later. It is enhanced with context windows to preserve Bimba context during chunking.

### Stage -2: Relate Concepts & Identify Variations

This is the core analysis engine. It iterates through chunks, tags them, extracts mappings, and identifies variations using LLMs and context. Enhanced with context windows for better analysis.

### Stage -1: Define Core Elements

This stage synthesizes the chunk analyses into a coherent whole, defining core elements and preparing for the final payload generation. It integrates the mappings, variations, and tags from all chunks.

### Stage -0: Synthesize Payload

This stage generates the final payload for updating Notion with the analysis results. It formats the synthesis, core elements, mappings, variations, and tags into a structured payload that can be used to update the Notion page.

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

## Refactoring Notes

The pipeline was refactored from a monolithic file into separate files for each stage to improve maintainability and readability. The refactoring was done with the following goals in mind:

1. **Improved Maintainability**: Each stage is in its own file, making it easier to understand and modify
2. **Better Separation of Concerns**: Each stage has a clear responsibility
3. **Easier Debugging**: Issues can be isolated to specific stages
4. **Simplified Testing**: Each stage can be tested independently
5. **Reduced Cognitive Load**: Developers can focus on one stage at a time
6. **Easier Collaboration**: Multiple developers can work on different stages simultaneously

The refactoring was done with care to ensure that all functionality was preserved and that the pipeline can be called in the same way as before.

## Future Improvements

- Add unit tests for each stage
- Add more detailed documentation for each stage
- Add more error handling and logging
- Add more caching to improve performance
- Add more tracing to improve debugging
- Add more metrics to improve monitoring
