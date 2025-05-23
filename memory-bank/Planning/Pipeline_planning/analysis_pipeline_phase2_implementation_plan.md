# Epii Analysis Pipeline Enhancement: Phase 2 - Refine Analysis Logic

## Overview

Phase 2 of the Epii Analysis Pipeline Enhancement focuses on refining the analysis logic in Stage -2 (Relate Concepts & Identify Variations) and Stage -1 (Define Core Elements). The goal is to improve the quality of mappings and variations, implement hybrid retrieval, and enhance the use of the Meta-Epistemic Framework (MEF) as an analytical toolkit.

Building on the context integration improvements from Phase 1, this phase will focus on:

1. Enhancing the analysis logic to focus on natural elaborations as expected extensions of the Bimba
2. Implementing hybrid retrieval combining Bimba structural context with semantic matching
3. Updating variation detection to focus only on contradictions in mapping names or positions
4. Leveraging the MEF as an analytical toolkit for comprehensive document analysis
5. Enhancing consolidation logic and implementing reranking in Stage -1

## Current Implementation Analysis

### Stage -2 (Relate Concepts & Identify Variations)

The current implementation of Stage -2 has the following characteristics:

1. **Chunk Analysis**: Uses `analyzeChunk` to extract mappings and identify variations from each chunk.
2. **Prompt Structure**: The LLM prompt includes MEF overview, QL framework, and analysis tasks.
3. **Variation Detection**: Identifies variations broadly without focusing specifically on contradictions in mapping names or positions.
4. **MEF Integration**: Uses MEF as a reference structure rather than a comprehensive analytical toolkit.
5. **Context Usage**: Already enhanced with context windows from Phase 1, but doesn't fully leverage them for hybrid retrieval.

### Stage -1 (Define Core Elements)

The current implementation of Stage -1 has the following characteristics:

1. **Consolidation Logic**: Basic consolidation of mappings and variations by simple keys.
2. **No Reranking**: No prioritization of relevant mappings.
3. **Limited Natural Language Summary**: No generation of a comprehensive natural language summary of the Bimba map.

## Required Changes

### Stage -2 (Relate Concepts & Identify Variations)

1. **Enhance `analyzeChunk` Function**:
   - Modify LLM prompts to focus on natural elaborations as expected extensions of the Bimba
   - Implement hybrid retrieval combining Bimba structural context with semantic matching
   - Update variation detection to focus only on contradictions in mapping names or positions
   - Use MEF as an analytical toolkit for comprehensive document analysis

2. **Implement Hybrid Retrieval**:
   - Create a new function `performHybridRetrieval` to combine Bimba structural context with semantic matching
   - Enhance `detectSubnodeReferences` to use hybrid retrieval for better subnode detection
   - Integrate with context windows from Phase 1

3. **Enhance MEF Integration**:
   - Update the MEF prompt to emphasize its role as an analytical toolkit
   - Reference the 36-node structure of the MEF as defined in the Bimba map
   - Avoid making assumptions about the MEF structure

### Stage -1 (Define Core Elements)

1. **Enhance Consolidation Logic**:
   - Improve the consolidation of mappings and variations
   - Implement more sophisticated deduplication and merging

2. **Implement Reranking**:
   - Create a new function `rerankMappings` to prioritize relevant mappings
   - Use confidence scores and relevance metrics for reranking

3. **Generate Natural Language Summary**:
   - Update `runStageMinus1` to generate a natural language summary of the Bimba map
   - Create a new function `generateBimbaMapSummary` to generate the summary

## Implementation Details

### Stage -2 (Relate Concepts & Identify Variations)

#### 1. Enhance `analyzeChunk` Function

The enhanced `analyzeChunk` function will:
- Update the prompt to focus on natural elaborations vs. true variations
- Separate "variations" (contradictions) from "natural elaborations" (extensions)
- Emphasize the MEF as an analytical toolkit
- Include a more structured output format that captures both variations and elaborations

Key prompt changes:
```
2. Natural Elaborations and True Variations:
   - Focus on natural elaborations as expected extensions of the Bimba structure
   - Identify true variations ONLY as contradictions in mapping names or positions
   - Do not flag extensions or embellishments as variations unless they directly contradict existing mappings
   - Consider non-dual, paradoxical, and integrative perspectives that transcend binary thinking
```

Output format changes:
```json
{
  "mappings": [...],
  "variations": [...],
  "naturalElaborations": [
    {
      "elaborationType": "Extension",
      "elaborationText": "This chunk extends the concept of recursive synthesis by showing how Epii integrates multiple perspectives.",
      "targetCoordinate": "#5-0",
      "confidenceScore": 0.91
    }
  ],
  "subnodeMappings": {...}
}
```

#### 2. Implement Hybrid Retrieval

The new `performHybridRetrieval` function will:
- Combine structural detection (explicit mentions of coordinates)
- Semantic matching (using context window relevance)
- Lexical matching (for potential subnodes not detected by other methods)

This will enhance subnode detection and provide more accurate context for analysis.

#### 3. Enhance MEF Integration

The MEF integration will be enhanced by:
- Referencing the 36-node structure as defined in the Bimba map
- Emphasizing its role as an analytical toolkit for comprehensive document analysis
- Avoiding making assumptions about the MEF structure

### Stage -1 (Define Core Elements)

#### 1. Enhance Consolidation Logic

The enhanced consolidation logic will:
- Group mappings by type and value
- Calculate average confidence scores
- Combine reasonings from multiple occurrences
- Track occurrence counts for better relevance assessment

#### 2. Implement Reranking

The new `rerankMappings` function will:
- Calculate relevance scores based on confidence, occurrences, and mapping type
- Prioritize mappings directly related to the target coordinate
- Boost important mapping types (QL_Stage, MEF_Lens)
- Sort mappings by relevance score

#### 3. Generate Natural Language Summary

The new `generateBimbaMapSummary` function will:
- Use LLM to generate a comprehensive summary of the Bimba map
- Integrate mappings, variations, and natural elaborations
- Provide a holistic overview of the coordinate and its subnodes
- Format the summary as markdown with appropriate structure

## Implementation Approach

1. **Start with Stage -2**:
   - Implement the enhanced `analyzeChunk` function
   - Add the new `performHybridRetrieval` function
   - Update the MEF integration
   - Test the enhanced analysis process

2. **Move to Stage -1**:
   - Implement the enhanced consolidation logic
   - Add the new `rerankMappings` function
   - Implement the `generateBimbaMapSummary` function
   - Test the enhanced consolidation and summary generation

## Success Metrics

1. **Mapping Quality**: Increase in the quality and relevance of extracted mappings
2. **Variation Accuracy**: Reduction in false variations, focus on true contradictions in mapping names/positions
3. **Natural Elaborations**: Proper identification of natural elaborations as extensions rather than variations
4. **Subnode Coverage**: Increase in the number and quality of subnode mappings
5. **MEF Integration**: Evidence of MEF being used as a comprehensive analytical toolkit
6. **Summary Quality**: Comprehensive and accurate natural language summaries of the Bimba map

## Testing Plan

1. **Unit Tests**:
   - Test each new function individually
   - Verify that the hybrid retrieval correctly identifies subnodes
   - Verify that the reranking correctly prioritizes relevant mappings

2. **Integration Tests**:
   - Test the entire pipeline with a sample document
   - Verify that the analysis results are improved
   - Verify that the natural language summary is comprehensive and accurate

3. **Evaluation Metrics**:
   - Compare the quality of mappings before and after the enhancement
   - Measure the reduction in false variations
   - Assess the improvement in natural elaboration identification
   - Evaluate the quality of the natural language summary
