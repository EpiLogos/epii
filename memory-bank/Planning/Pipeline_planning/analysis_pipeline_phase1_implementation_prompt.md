# Epii Analysis Pipeline Enhancement: Phase 1 - Bimba Context Integration

## Overview

The Epii Document Analysis Pipeline is designed to analyze documents and extract mappings that connect document content to the Bimba coordinate system. The pipeline follows a 6-stage structure that mirrors the inverse QL cycle:

- Stage -5: Fetch Document (corresponds to +0)
- Stage -4: Contextualize Analysis (corresponds to +1)
- Stage -3: Integrate Structure (corresponds to +2)
- Stage -2: Relate Concepts & Identify Variations (corresponds to +3)
- Stage -1: Define Core Elements (corresponds to +4)
- Stage -0: Synthesize Payload (corresponds to +5)

Phase 1 focuses on enhancing the Bimba context integration in the pipeline, specifically in Stages -4 and -3. The goal is to ensure that the full Bimba and project context is included in the chunking and analysis process, and that the Bimba map serves as the ultimate context for all analysis.

## Current Implementation

The current implementation has several limitations:

1. **Limited Context Integration**: The pipeline retrieves Bimba context for the target coordinate, but doesn't fully integrate it into the analysis process.
2. **Context Fragmentation**: The chunking process loses important context, leading to fragmented analysis.
3. **Static View of Bimba**: The pipeline treats the Bimba structure as a static reference point rather than a dynamic, evolving framework.

## Anthropic's Contextual RAG Approach

Anthropic's Contextual Retrieval approach offers valuable insights for enhancing the analysis pipeline:

1. **Context Preservation**: Prepending chunk-specific explanatory context to each chunk to preserve context during chunking.
2. **Hierarchical Context**: Using a hierarchical context structure that includes different levels of context (chunk, document, Bimba, project).
3. **Hybrid Retrieval**: Combining semantic embeddings with lexical matching for better retrieval.
4. **Reranking**: Implementing a reranking step to prioritize the most relevant results.

## Bimba Coordinate System

The Bimba coordinate system is a hierarchical addressing system that follows a mod6 structure (6-fold hexagonal structure). Coordinates are formatted as "#X-Y-Z" where X, Y, Z are numbers representing different levels in the hierarchy. Each parent node can have up to 6 subnodes (0-5).

The Bimba structure serves as the ultimate context for the analysis pipeline, providing the conceptual framework for understanding documents. Document ingestion should be seen as a self-learning process, where the Bimba structure evolves through the analysis of new documents.

## Required Changes

### Stage -4: Contextualize Analysis

1. **Enhance `runStageMinus4` function**:
   - Retrieve full Bimba map and project context from graphData
   - Generate Bimba-enhanced document context using LLM
   - Add Bimba-enhanced context to state

2. **Add new functions**:
   - `getFullBimbaMapFromGraphData`: Extract the full Bimba map from graphData
   - `getProjectContextFromGraphData`: Extract project-level context from graphData
   - `generateBimbaEnhancedContext`: Generate comprehensive context using LLM

### Stage -3: Integrate Structure

1. **Enhance `chunkDocument` function**:
   - Modify to accept Bimba-enhanced context, full Bimba map, and project context
   - Generate context windows for each chunk
   - Preserve full Bimba context when chunking

2. **Add new functions**:
   - `generateContextWindow`: Create hierarchical context windows for chunks
   - `extractRelevantBimbaContext`: Extract relevant Bimba context for each chunk
   - `generateChunkContext`: Generate chunk-specific context using LLM

### Stage -2: Relate Concepts & Identify Variations

1. **Update `analyzeChunk` function**:
   - Modify to use context windows for analysis
   - Update prompts to focus on natural elaborations rather than variations
   - Use MEF as an analytical toolkit

## Implementation Approach

1. **Start with Stage -4**:
   - Implement the enhanced `runStageMinus4` function
   - Add the new helper functions
   - Test the enhanced context generation

2. **Move to Stage -3**:
   - Implement the enhanced `chunkDocument` function
   - Add the new helper functions
   - Test the context preservation during chunking

3. **Update Stage -2**:
   - Modify the `analyzeChunk` function to use context windows
   - Update the analysis prompts
   - Test the enhanced analysis process

## Code Examples

### Stage -4 Enhancements

```javascript
/**
 * Retrieves the full Bimba map from graphData.
 * 
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - The full Bimba map with hierarchical structure
 */
function getFullBimbaMapFromGraphData(graphData) {
    // Extract the full Bimba map from graphData
    const fullBimbaMap = {
        nodes: graphData.nodes,
        relationships: graphData.edges || graphData.links || [],
        structure: {} // Hierarchical structure of the Bimba map
    };
    
    // Build hierarchical structure
    for (const node of graphData.nodes) {
        if (node.bimbaCoordinate) {
            const coordinate = node.bimbaCoordinate;
            const parts = coordinate.split('-');
            
            // Build hierarchical structure
            let current = fullBimbaMap.structure;
            let currentPath = '';
            
            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}-${part}` : part;
                
                if (!current[part]) {
                    current[part] = {
                        coordinate: currentPath,
                        node: node,
                        children: {}
                    };
                }
                
                current = current[part].children;
            }
        }
    }
    
    return fullBimbaMap;
}

/**
 * Retrieves project-level context from graphData.
 * 
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - Project-level context
 */
function getProjectContextFromGraphData(graphData) {
    // Extract project-level context from graphData
    const projectNodes = graphData.nodes.filter(node => 
        node.bimbaCoordinate && 
        node.bimbaCoordinate.startsWith('#') && 
        node.bimbaCoordinate.split('-').length === 1
    );
    
    return {
        projectNodes,
        projectName: "Epi-Logos Project",
        projectDescription: "A comprehensive framework for understanding and implementing the Epi-Logos system."
    };
}

/**
 * Generates Bimba-enhanced context for a document.
 * 
 * @param {string} documentContent - The content of the document
 * @param {string} sourceFileName - The name of the document file
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {object} bimbaContext - The Bimba context for the target coordinate
 * @param {object} fullBimbaMap - The full Bimba map
 * @param {object} projectContext - Project-level context
 * @returns {Promise<string>} - The Bimba-enhanced context
 */
async function generateBimbaEnhancedContext(
    documentContent, 
    sourceFileName, 
    targetCoordinate, 
    bimbaContext,
    fullBimbaMap,
    projectContext
) {
    // Use LLM to generate Bimba-enhanced context
    const prompt = `Generate a comprehensive Bimba-enhanced context for the following document:
    
    Document: ${sourceFileName}
    Target Coordinate: ${targetCoordinate}
    
    Bimba Context for Target Coordinate:
    ${JSON.stringify(bimbaContext, null, 2)}
    
    Project Context:
    ${JSON.stringify(projectContext, null, 2)}
    
    Document Content Preview:
    ${documentContent.substring(0, 1000)}...
    
    Your task is to create a comprehensive context that:
    1. Explains what this document is about
    2. Describes how it relates to the target coordinate
    3. Identifies potential connections to other parts of the Bimba structure
    4. Provides a framework for analyzing the document using the Meta-Epistemic Framework (MEF)
    
    This context will be used to enhance the analysis of the document, so make it as comprehensive and useful as possible.`;
    
    const content = await epiiLLMService.generateContent(-4, "You are a Bimba-aware document context generator.", prompt);
    
    return content;
}
```

### Stage -3 Enhancements

```javascript
/**
 * Generates a context window for a chunk.
 * 
 * @param {string} chunkContent - The content of the chunk
 * @param {string} documentContent - The content of the document
 * @param {string} bimbaEnhancedContext - The Bimba-enhanced context for the document
 * @param {object} fullBimbaMap - The full Bimba map
 * @param {object} projectContext - Project-level context
 * @returns {Promise<object>} - The context window
 */
async function generateContextWindow(
    chunkContent, 
    documentContent, 
    bimbaEnhancedContext, 
    fullBimbaMap, 
    projectContext
) {
    // Extract relevant Bimba context for this chunk
    const relevantBimbaContext = await extractRelevantBimbaContext(
        chunkContent, 
        fullBimbaMap
    );
    
    // Generate chunk-specific context
    const chunkContext = await generateChunkContext(
        chunkContent, 
        documentContent, 
        bimbaEnhancedContext
    );
    
    // Combine into hierarchical context window
    const contextWindow = {
        chunkContext,
        documentContext: bimbaEnhancedContext,
        bimbaContext: relevantBimbaContext,
        projectContext,
        contextText: `
# Context Window

## Chunk Context
${chunkContext}

## Document Context
${bimbaEnhancedContext.substring(0, 500)}...

## Bimba Context
${JSON.stringify(relevantBimbaContext, null, 2)}

## Analysis Framework
Use the Meta-Epistemic Framework (MEF) as an analytical toolkit to examine this chunk from multiple perspectives.
`
    };
    
    return contextWindow;
}

/**
 * Extracts relevant Bimba context for a chunk.
 * 
 * @param {string} chunkContent - The content of the chunk
 * @param {object} fullBimbaMap - The full Bimba map
 * @returns {Promise<object>} - The relevant Bimba context
 */
async function extractRelevantBimbaContext(chunkContent, fullBimbaMap) {
    // Extract potential coordinates mentioned in the chunk
    const coordinatePattern = /#[0-5](-[0-5])*\b/g;
    const mentionedCoordinates = chunkContent.match(coordinatePattern) || [];
    
    // Find relevant nodes from the Bimba map
    const relevantNodes = [];
    
    for (const node of fullBimbaMap.nodes) {
        if (node.bimbaCoordinate) {
            const coordinate = node.bimbaCoordinate;
            
            // Check if this coordinate is mentioned in the chunk
            if (mentionedCoordinates.includes(coordinate)) {
                relevantNodes.push(node);
                continue;
            }
            
            // Check if this coordinate is a parent of a mentioned coordinate
            for (const mentionedCoordinate of mentionedCoordinates) {
                if (mentionedCoordinate.startsWith(coordinate + '-')) {
                    relevantNodes.push(node);
                    break;
                }
            }
        }
    }
    
    return {
        relevantNodes,
        mentionedCoordinates
    };
}

/**
 * Generates chunk-specific context.
 * 
 * @param {string} chunkContent - The content of the chunk
 * @param {string} documentContent - The content of the document
 * @param {string} bimbaEnhancedContext - The Bimba-enhanced context for the document
 * @returns {Promise<string>} - The chunk-specific context
 */
async function generateChunkContext(chunkContent, documentContent, bimbaEnhancedContext) {
    // Use LLM to generate chunk-specific context
    const prompt = `Here is the overall document context:
    ${bimbaEnhancedContext}
    
    Here is a chunk from this document:
    ${chunkContent}
    
    Please give a comprehensive context to situate this chunk within the overall document and the Bimba structure. Your context should:
    1. Explain what this chunk is about
    2. Identify any Bimba coordinates mentioned or implied in the chunk
    3. Describe how this chunk relates to the overall document
    4. Suggest which MEF lenses would be most useful for analyzing this chunk
    
    Provide a concise but comprehensive context (100-200 words).`;
    
    const content = await epiiLLMService.generateContent(-3, "You are a Bimba-aware chunk context generator.", prompt);
    
    return content;
}
```

## Testing

1. **Unit Tests**:
   - Test each new function individually
   - Verify that the context is properly generated and preserved

2. **Integration Tests**:
   - Test the entire pipeline with a sample document
   - Verify that the analysis results are improved

3. **Evaluation Metrics**:
   - Compare the quality of mappings before and after the enhancement
   - Measure the reduction in false variations
   - Assess the improvement in context integration

## Resources

1. **Anthropic's Contextual RAG Paper**: https://www.anthropic.com/news/contextual-retrieval
2. **Bimba Coordinate System Documentation**: Available in the codebase
3. **Current Analysis Pipeline Code**: epii_app/friendly-file-backend/pipelines/epii_analysis_pipeline.mjs
