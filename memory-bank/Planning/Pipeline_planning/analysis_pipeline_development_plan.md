# Analysis Pipeline Development Plan

## Vision Statement

The Epii Document Analysis Pipeline will embody the principles of Quaternary Logic (QL) to transform raw documents into crystallized knowledge that enhances the Bimba structure. The pipeline will follow the inverse QL cycle (-5 to -0) to analyze documents, extract mappings, identify true variations, and generate comprehensive payloads for Notion integration.

The pipeline will embrace the dynamic, recursive nature of QL, recognizing that the analysis process naturally moves from less detail to more detail, with each completion leading to a new beginning. It will transcend binary thinking by recognizing natural elaborations as expected extensions rather than deviations.

## Guiding Principles

1. **Holographic Understanding**: Each part contains the whole; each document fragment reflects aspects of the entire Bimba structure.
2. **Dynamic Evolution**: The Bimba structure is not static but evolves through the analysis of new documents, with document ingestion as a self-learning process.
3. **Recursive Completion**: Each analysis cycle completes by feeding back into the beginning of a new cycle.
4. **Non-Binary Thinking**: Transcend simple binary distinctions to recognize complementary, paradoxical, and integrative perspectives.
5. **Context Preservation**: Maintain the full Bimba and project context throughout the analysis process.
6. **Crystallization Process**: Refine raw documents into detailed Bimba-aligned structural elements.
7. **Bimba as Ultimate Context**: The Bimba map serves as the ultimate context for all analysis, providing the conceptual framework for understanding documents.
8. **MEF as Analysis Toolkit**: The Meta-Epistemic Framework serves as a comprehensive analytical toolkit, not just a reference structure.

## Pipeline Structure

The pipeline follows a 6-stage structure that mirrors the inverse QL cycle:

### Stage -5: Fetch Document (corresponds to +0)
- **Purpose**: Retrieve and prepare the document for analysis
- **Input**: Document ID or file upload
- **Output**: Preprocessed document content
- **QL Alignment**: Corresponds to +0 (Void/Potential)

### Stage -4: Contextualize Analysis (corresponds to +1)
- **Purpose**: Gather and integrate full Bimba and project context
- **Input**: Document content, target coordinate, graphData
- **Output**: Document with comprehensive Bimba-enhanced contextual information
- **QL Alignment**: Corresponds to +1 (Definition)

### Stage -3: Integrate Structure (corresponds to +2)
- **Purpose**: Chunk document while preserving full Bimba and project context
- **Input**: Document with Bimba-enhanced context
- **Output**: Contextualized chunks with "context windows" containing full Bimba context
- **QL Alignment**: Corresponds to +2 (Process)

### Stage -2: Relate Concepts & Identify Variations (corresponds to +3)
- **Purpose**: Analyze chunks to extract mappings and identify true variations (contradictions in mapping names/positions)
- **Input**: Contextualized chunks with full Bimba context
- **Output**: Chunk analysis results with mappings and true variations
- **QL Alignment**: Corresponds to +3 (Mediation)

### Stage -1: Define Core Elements (corresponds to +4)
- **Purpose**: Consolidate and synthesize analysis results, generate natural language summary of Bimba map
- **Input**: Chunk analysis results, full Bimba context
- **Output**: Consolidated analysis data with Bimba map summary
- **QL Alignment**: Corresponds to +4 (Contextualization)

### Stage -0: Synthesize Payload (corresponds to +5)
- **Purpose**: Format analysis into Notion update payload structured for synthesis pipeline
- **Input**: Consolidated analysis data with Bimba map summary
- **Output**: Notion update payload ready for synthesis pipeline integration
- **QL Alignment**: Corresponds to +5 (Synthesis/Integration)

## Implementation Plan

### Phase 1: Enhance Bimba Context Integration

1. **Update Stage -4 (Contextualize Analysis)**
   - Implement Bimba-enhanced contextual retrieval approach
   - Integrate full Bimba and project context from graphData
   - Modify `runStageMinus4` function to generate comprehensive Bimba-aware document context
   - Use Bimba as the ultimate context for all analysis

2. **Update Stage -3 (Integrate Structure)**
   - Modify `chunkDocument` function to preserve full Bimba context when chunking
   - Implement "context windows" containing chunk, document, and Bimba context
   - Update `sendChunksToLightRAG` function to include hierarchical context structure

### Phase 2: Refine Analysis Logic

1. **Update Stage -2 (Relate Concepts & Identify Variations)**
   - Modify LLM prompts to focus on natural elaborations as expected extensions of the Bimba
   - Update `analyzeChunk` function to use Bimba-aware contextual prompting
   - Implement hybrid retrieval combining Bimba structural context with semantic matching
   - Update variation detection to focus only on contradictions in mapping names or positions
   - Use MEF as an analytical toolkit for comprehensive document analysis

2. **Update Stage -1 (Define Core Elements)**
   - Enhance consolidation logic to better synthesize results
   - Implement reranking to prioritize relevant mappings
   - Update `runStageMinus1` function to generate natural language summary of Bimba map
   - Structure consolidated results for seamless integration with synthesis pipeline

### Phase 3: Prepare for Synthesis Pipeline Integration

1. **Update Stage -0 (Synthesize Payload)**
   - Structure payload for seamless integration with future synthesis pipeline
   - Enhance payload format for optimal Notion integration
   - Update `runStagePlus0` function to prepare analysis results for Bimba enhancement
   - Ensure payload contains all necessary data for updating the Bimba structure

2. **Update Pipeline Entry Point**
   - Modify `runEpiiPipeline` function to view document ingestion as a self-learning process
   - Prepare for integration with future synthesis pipeline
   - Structure the pipeline to support the full Meta-Techne loop

### Phase 4: Implement Technical Improvements

1. **Implement Bimba-Enhanced Hybrid Retrieval**
   - Combine Bimba structural context with semantic and lexical matching
   - Integrate Bimba map as a primary context source
   - Update relevant functions to use this integrated approach

2. **Enhance MEF Integration**
   - Implement MEF as a comprehensive analytical toolkit
   - Use different MEF lenses for multi-perspective analysis
   - Update relevant functions to leverage MEF's analytical capabilities

3. **Optimize Context Windows**
   - Refine the hierarchical context structure
   - Optimize context window size and content
   - Ensure efficient use of context in LLM calls

## Specific Code Changes

### Stage -4 (Contextualize Analysis)

```javascript
// Current implementation
async function runStageMinus4(state) {
    // ...existing code...

    // Retrieve Bimba context
    const bimbaContext = getBimbaContextFromGraphData(targetCoordinate, state.graphData);

    // ...existing code...

    return await runStageMinus3(stageMinus4Output);
}

// Proposed implementation
async function runStageMinus4(state) {
    // ...existing code...

    // Retrieve full Bimba and project context
    const bimbaContext = getBimbaContextFromGraphData(targetCoordinate, state.graphData);
    const fullBimbaMap = getFullBimbaMapFromGraphData(state.graphData);
    const projectContext = getProjectContextFromGraphData(state.graphData);

    // Generate Bimba-enhanced document context
    const bimbaEnhancedContext = await generateBimbaEnhancedContext(
        documentContent,
        sourceFileName,
        targetCoordinate,
        bimbaContext,
        fullBimbaMap,
        projectContext
    );

    // ...existing code...

    // Add Bimba-enhanced context to state
    const stageMinus4Output = {
        // ...existing properties...
        bimbaEnhancedContext,
        fullBimbaMap,
        projectContext
    };

    return await runStageMinus3(stageMinus4Output);
}

// New function to generate Bimba-enhanced context
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

// New function to get full Bimba map from graphData
function getFullBimbaMapFromGraphData(graphData) {
    // Extract the full Bimba map from graphData
    const fullBimbaMap = {
        nodes: graphData.nodes,
        relationships: graphData.relationships,
        structure: {} // Hierarchical structure of the Bimba map
    };

    // Build hierarchical structure
    for (const node of graphData.nodes) {
        if (node.properties && node.properties.coordinate) {
            const coordinate = node.properties.coordinate;
            const parts = coordinate.split('-');

            // Build hierarchical structure
            let current = fullBimbaMap.structure;
            let currentPath = '';

            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}-${part}` : part;

                if (!current[part]) {
                    current[part] = {
                        coordinate: currentPath,
                        children: {}
                    };
                }

                current = current[part].children;
            }
        }
    }

    return fullBimbaMap;
}

// New function to get project context from graphData
function getProjectContextFromGraphData(graphData) {
    // Extract project-level context from graphData
    const projectNodes = graphData.nodes.filter(node =>
        node.properties &&
        node.properties.coordinate &&
        node.properties.coordinate.startsWith('#') &&
        node.properties.coordinate.split('-').length === 1
    );

    return {
        projectNodes,
        projectName: "Epi-Logos Project",
        projectDescription: "A comprehensive framework for understanding and implementing the Epi-Logos system."
    };
}
```

### Stage -3 (Integrate Structure)

```javascript
// Current implementation
async function chunkDocument(documentContent) {
    // ...existing code...

    const chunks = docs.map(doc => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata || {}
    }));

    return chunks;
}

// Proposed implementation
async function chunkDocument(documentContent, bimbaEnhancedContext, fullBimbaMap, projectContext) {
    // ...existing code...

    // Process each chunk to add context window
    const contextualizedChunks = [];

    for (const doc of docs) {
        // Generate chunk-specific context window
        const contextWindow = await generateContextWindow(
            doc.pageContent,
            documentContent,
            bimbaEnhancedContext,
            fullBimbaMap,
            projectContext
        );

        // Prepend context window to chunk
        contextualizedChunks.push({
            pageContent: `${contextWindow.contextText}\n\n${doc.pageContent}`,
            originalContent: doc.pageContent,
            metadata: {
                ...doc.metadata,
                contextWindow
            }
        });
    }

    return contextualizedChunks;
}

// New function to generate context window
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

// New function to extract relevant Bimba context
async function extractRelevantBimbaContext(chunkContent, fullBimbaMap) {
    // Use hybrid retrieval to find relevant Bimba nodes
    // This combines semantic matching with Bimba structural awareness

    // For now, we'll use a simplified approach
    // In the full implementation, this would use vector similarity and BM25

    // Extract potential coordinates mentioned in the chunk
    const coordinatePattern = /#[0-5](-[0-5])*\b/g;
    const mentionedCoordinates = chunkContent.match(coordinatePattern) || [];

    // Find relevant nodes from the Bimba map
    const relevantNodes = [];

    for (const node of fullBimbaMap.nodes) {
        if (node.properties && node.properties.coordinate) {
            const coordinate = node.properties.coordinate;

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

// New function to generate chunk-specific context
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

## Success Metrics

1. **Mapping Quality**: Increase in the quality and relevance of extracted mappings
2. **Variation Accuracy**: Reduction in false variations, focus on true contradictions in mapping names/positions
3. **Subnode Coverage**: Increase in the number and quality of subnode mappings
4. **Context Integration**: Improved integration of full Bimba and project context in analysis
5. **Synthesis Pipeline Readiness**: Analysis results structured for seamless integration with future synthesis pipeline
6. **MEF Integration**: Evidence of MEF being used as a comprehensive analytical toolkit
7. **User Satisfaction**: Positive feedback from users on the quality of analysis results



