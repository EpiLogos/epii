# Epii Analysis Pipeline Optimization Plan

## Overview

This document outlines a comprehensive plan to optimize the Epii Analysis Pipeline, focusing on context window generation, analysis logic, and payload structure. The plan addresses specific issues in each pipeline stage while ensuring that the payload structure and document service logic remain intact.

## Key Principles

1. **Context Window Optimization**:
   - Lightweight context windows for RAG ingestion (stage -3)
   - Comprehensive context windows for analysis (stage -2)
   - Generate context windows once and reuse them

2. **Bimba Map Integration**:
   - Ensure the full Bimba map is available for analysis
   - Use the Bimba map as primary context for coordinate-based analyses
   - Extract project context from the root node (#)

3. **Analysis Logic Enhancement**:
   - Align analysis parameters with Notion properties
   - Improve extraction of relational properties
   - Enhance MEF application in analysis

4. **Epii Perspective Enhancement**:
   - Leverage LightRAG retrieval for summarized analysis
   - Ensure perspective is included in the update payload
   - Send perspective to frontend chat component

## Stage-by-Stage Optimization Plan

### Stage -4: Contextualize Analysis
#### Current Issues:
- The `bimbaContext` property might not fully represent the target coordinate's position within the Bimba map's hierarchy (lacking parent/child relationships).
- Project context summaries may not be sufficiently informative, potentially missing nuances from subsystem coordinates or consistent handling of coordinate separators ("-" vs ".").
- Risk of premature content truncation, which could hinder the generation of a complete contextual understanding.

#### Optimization Plan:

1.  **Enhance `bimbaContext` Generation**:
    *   **Hierarchical Contextualization**: Modify the logic that populates the `bimbaContext` to not only include the target coordinate but also its direct parent and child coordinates from the Bimba graph data. This will provide a richer, more localized hierarchical view.
    *   **Graph Traversal**: Implement or refine graph traversal utilities to efficiently fetch these surrounding coordinates.

2.  **Improve Project Context Logic**:
    *   **Comprehensive Summaries**: Revise the project context generation to create more informative summaries. This should involve:
        *   Aggregating information from the main project root ("#") coordinate.
        *   Incorporating details from key subsystem coordinates to reflect the project's structure and components.
    *   **Separator Handling**: Ensure that the logic consistently processes and normalizes Bimba coordinates, whether they use "-" or "." as separators, especially when identifying project and subsystem nodes.
    *   **Informative Output**: The project context should clearly articulate the project's overall theme and its main structural parts.

3.  **Optimize Content Handling for Context Generation**:
    *   **Prevent Unnecessary Truncation**: Review all points where content (document content, node descriptions, etc.) is processed or truncated before being used for context generation. Ensure that truncations are minimal and strategically applied to preserve essential information needed for a full contextual understanding.
    *   **Dynamic Truncation**: If truncation is necessary (e.g., for token limits), implement smarter, context-aware truncation strategies rather than fixed-length cuts.

```javascript
// Example: Potential area for enhancement in a conceptual function
// (Illustrative - actual file and function may vary)
// In a relevant utility, e.g., graphData.utils.mjs or context.utils.mjs

async function getEnhancedBimbaContext(targetCoordinate, fullBimbaMap) {
    // ... existing code ...

    // NEW: Logic to fetch parent and child coordinates
    const targetNode = fullBimbaMap.nodes.find(n => n.coordinate === targetCoordinate);
    let parentCoords = [];
    let childCoords = [];

    if (targetNode) {
        // Example: Fetch parent (assuming coordinate structure like #A-B-C)
        const parts = targetCoordinate.split('-');
        if (parts.length > 1) {
            parentCoords.push(parts.slice(0, -1).join('-'));
        }

        // Example: Fetch children (nodes that start with targetCoordinate + '-')
        childCoords = fullBimbaMap.nodes
            .filter(n => n.coordinate.startsWith(targetCoordinate + '-'))
            .map(n => n.coordinate);
    }

    const bimbaContext = {
        target: targetNode,
        parents: parentCoords.map(pc => fullBimbaMap.nodes.find(n => n.coordinate === pc)).filter(n => n), // fetch full node
        children: childCoords.map(cc => fullBimbaMap.nodes.find(n => n.coordinate === cc)).filter(n => n) // fetch full node
        // ... other relevant context ...
    };

    return bimbaContext;
}

export function getProjectContextFromBimbaMap(bimbaMap, options = {}) {
    // ... existing code ...
    // Ensure rootNode selection considers both "#" and relevant subsystem coordinates
    // Ensure consistent handling of "-" and "." in coordinate matching
    // Build a more descriptive projectDescription based on these nodes.

    let projectDescription = "Project Overview: ";
    const rootNode = bimbaMap.nodes.find(node => {
        const coord = node.coordinate || node.bimbaCoordinate;
        return coord === '#'; // Primary root
    });

    if (rootNode) {
        projectDescription += rootNode.description || rootNode.name || "";
    }

    // NEW: Incorporate subsystem info (example: nodes starting with #S or similar pattern)
    const subsystemNodes = bimbaMap.nodes.filter(node => {
        const coord = node.coordinate || node.bimbaCoordinate;
        // This pattern needs to be defined based on your actual subsystem coordinate scheme
        return coord && (coord.startsWith("#S-") || coord.startsWith("#S."));
    });

    if (subsystemNodes.length > 0) {
        projectDescription += "\nSubsystems: ";
        projectDescription += subsystemNodes.map(sn => sn.name || sn.coordinate).join(", ");
    }
    // ... existing code ...
    return {
        // ...
        projectDescription: projectDescription, // Updated description
        // ...
    };
}
```

### Stage -3: Integrate Structure (Chunk & Ingest for RAG)

#### Current Issues:
- Context windows are lightweight but may be missing essential context for proper chunk contextualization
- Project context extraction doesn't specifically focus on the "#" root node
- Coordinate handling doesn't consistently manage both "-" and "." separators
- Context windows lack clear guidance on how they should be used
- The hierarchical structure of context windows could be more clearly defined

#### Optimization Plan:

1. **Enhance Coordinate Handling**:
   - Update coordinate detection logic to handle both "-" and "." separators equally
   - Normalize coordinates consistently throughout the pipeline
   - Implement in both `extractRelevantBimbaContext` and other coordinate-related functions
   ```javascript
   // In graphData.utils.mjs - extractRelevantBimbaContext function
   export async function extractRelevantBimbaContext(chunkContent, fullBimbaMap) {
       // Extract potential coordinates mentioned in the chunk - handle both separators
       const dashCoordinatePattern = /#[0-5](-[0-5])*\b/g;
       const dotCoordinatePattern = /#[0-5](\\.[0-5])*\b/g;

       const dashCoordinates = chunkContent.match(dashCoordinatePattern) || [];
       const dotCoordinates = chunkContent.match(dotCoordinatePattern) || [];

       // Normalize dot notation to dash notation for consistency
       const normalizedDotCoordinates = dotCoordinates.map(coord => coord.replace(/\./g, '-'));

       // Combine and remove duplicates
       const mentionedCoordinates = [...new Set([...dashCoordinates, ...normalizedDotCoordinates])];

       // Find relevant nodes from the Bimba map
       const relevantNodes = [];

       for (const node of fullBimbaMap.nodes) {
           if (!node) continue;

           // Get the coordinate, handling both property names
           const nodeCoord = node.coordinate || node.bimbaCoordinate;
           if (!nodeCoord) continue;

           // Normalize the node coordinate (replace dots with dashes)
           const normalizedNodeCoord = nodeCoord.replace(/\./g, '-');

           // Check if this coordinate is mentioned in the chunk
           if (mentionedCoordinates.includes(normalizedNodeCoord)) {
               relevantNodes.push({
                   ...node,
                   normalizedCoordinate: normalizedNodeCoord
               });
               continue;
           }

           // Check if this coordinate is a parent of a mentioned coordinate
           for (const mentionedCoordinate of mentionedCoordinates) {
               if (mentionedCoordinate.startsWith(normalizedNodeCoord + '-')) {
                   relevantNodes.push({
                       ...node,
                       normalizedCoordinate: normalizedNodeCoord,
                       relationToMentioned: 'parent'
                   });
                   break;
               }
           }
       }

       return {
           relevantNodes,
           mentionedCoordinates
       };
   }
   ```

2. **Refine Project Context Extraction**:
   - Focus specifically on the "#" root node for project context
   - Extract a clear project description from the root node
   - Include minimal but sufficient project hierarchy information
   ```javascript
   // In graphData.utils.mjs - getProjectContextFromBimbaMap function
   export function getProjectContextFromBimbaMap(bimbaMap, options = {}) {
       if (!bimbaMap || !bimbaMap.nodes || !Array.isArray(bimbaMap.nodes)) {
           console.warn(`Invalid bimbaMap provided to getProjectContextFromBimbaMap`);
           return {
               rootNode: null,
               projectName: "Unknown Project",
               projectDescription: "No project context available."
           };
       }

       // Focus specifically on the "#" root node for project context
       // Look for exact match on "#" coordinate
       const rootNode = bimbaMap.nodes.find(node => {
           const coord = node.coordinate || node.bimbaCoordinate;
           return coord === '#';
       });

       // If no root node found, look for nodes that start with "#"
       const projectNodes = rootNode ? [rootNode] : bimbaMap.nodes.filter(node => {
           const coord = node.coordinate || node.bimbaCoordinate;
           return coord && coord.startsWith('#') && !coord.includes('-') && !coord.includes('.');
       });

       // Extract project description from the root node
       const projectDescription = rootNode && rootNode.description
           ? rootNode.description
           : "A comprehensive framework for understanding and implementing the Epi-Logos system.";

       // Return focused project context
       return {
           rootNode,
           projectNodes,
           projectName: rootNode ? (rootNode.name || "Epi-Logos Project") : "Epi-Logos Project",
           projectDescription,
           // Include minimal hierarchy information
           topLevelNodes: bimbaMap.nodes
               .filter(node => {
                   const coord = node.coordinate || node.bimbaCoordinate;
                   return coord && coord.startsWith('#') &&
                       (coord.split('-').length === 2 || coord.split('.').length === 2);
               })
               .map(node => ({
                   coordinate: node.coordinate || node.bimbaCoordinate,
                   name: node.name || 'Unnamed',
                   type: node.type || 'Unknown'
               }))
       };
   }
   ```

3. **Optimize Lightweight Context Windows**:
   - Create more informative but still lightweight context windows for RAG ingestion
   - Include essential context without the full Bimba map
   - Add clear guidance on how the context window should be used
   - Ensure a clear hierarchical structure
   ```javascript
   // In content.utils.mjs - generateContextWindow function
   export function generateContextWindow(
       chunkContent,
       documentContent,
       bimbaEnhancedContext,
       fullBimbaMap,
       projectContext,
       bimbaMapSummary = null,
       options = {}
   ) {
       const { forAnalysis = false } = options;

       // For RAG chunks (stage -3), create a lightweight context window
       if (!forAnalysis) {
           // Extract chunk-specific context
           const chunkContext = {
               content: chunkContent.substring(0, 100) + "...",
               position: documentContent ? documentContent.indexOf(chunkContent) : -1,
               length: chunkContent.length
           };

           // Create a more informative but still lightweight context window
           const lightContextWindow = {
               // Structured data for programmatic access
               chunkContext,
               documentContext: bimbaEnhancedContext ? {
                   summary: bimbaEnhancedContext.substring(0, 500) + "..."
               } : null,
               projectContext: {
                   projectName: projectContext.projectName,
                   projectDescription: projectContext.projectDescription,
                   rootNode: projectContext.rootNode ? {
                       name: projectContext.rootNode.name,
                       coordinate: projectContext.rootNode.coordinate || projectContext.rootNode.bimbaCoordinate
                   } : null
               },
               bimbaMapSummary: bimbaMapSummary ? {
                   rootNodeDescription: bimbaMapSummary.rootNodeDescription,
                   totalNodes: bimbaMapSummary.totalNodes,
                   nodesWithCoordinates: bimbaMapSummary.nodesWithCoordinates
               } : null,

               // Formatted text for LLM consumption with smart truncation
               contextText: `
# Context Window

## How to Use This Context
This context window provides essential information to help understand this chunk in relation to the document and project. It contains:
- Chunk Context: What this specific chunk is about
- Document Context: Information about the overall document
- Project Context: The broader project this document belongs to
- Bimba Map Summary: A summary of the relevant Bimba structure

## Chunk Context
${chunkContent.substring(0, 150)}...

## Document Context
${bimbaEnhancedContext ? bimbaEnhancedContext.substring(0, 500) + "..." : "No document context available."}

## Project Context
${projectContext.projectDescription}

## Bimba Map Summary
${bimbaMapSummary ? bimbaMapSummary.rootNodeDescription : 'No Bimba map summary available.'}
`
           };

           return lightContextWindow;
       }

       // For analysis (stage -2), create a comprehensive context window
       // This will be handled in the Stage -2 improvements
   }
   ```



### Stage -2: Relate Concepts & Identify Variations

#### Current Issues:
- Context windows are regenerated for each chunk group, causing redundant processing
- The Bimba map isn't properly leveraged as global context for analysis
- Analysis prompts don't fully align with the project's intended functionality
- The MEF isn't being fully utilized as an analytical toolkit
- Relational properties extraction (QL Operators, Epistemic Essence, etc.) isn't robust
- The distinction between true variations (contradictions) and natural elaborations (extensions) isn't clear

#### Optimization Plan:

1. **Generate Comprehensive Context Windows Once**:
   - Generate all context windows at the beginning of stage -2
   - Set `forAnalysis: true` to create comprehensive windows with full Bimba context
   - Store these windows in the state and reuse them throughout the analysis process
   - Implement code to prevent regeneration of context windows in `analyzeChunkGroup`
   - Include clear instructions in the context window about how it should be used for analysis
   ```javascript
   // In content.utils.mjs - generateContextWindow function
   // Add a section explaining how to use the context window
   const contextUsageGuide = `
   # HOW TO USE THIS CONTEXT WINDOW

   This context window provides essential information to help you analyze the document chunk.
   It contains:

   1. CHUNK CONTEXT: Specific information about this chunk and its content
   2. DOCUMENT CONTEXT: Information about the overall document
   3. BIMBA CONTEXT: Relevant nodes from the Bimba coordinate system
   4. PROJECT CONTEXT: Information about the project this document belongs to

   When analyzing this chunk:
   - Use the Bimba context to identify relevant coordinates and concepts
   - Consider how this chunk relates to the overall document
   - Apply the MEF lenses to examine the content from multiple perspectives
   - Extract relational properties that connect this content to the broader knowledge structure

   Your analysis should be informed by this context, but not limited by it.
   `;

   // Include this guide in the context window
   contextWindow.contextText = `
   ${contextUsageGuide}

   ${contextWindow.contextText}
   `;
   ```
   ```javascript
   // In stage_minus2.mjs - runStageMinus2 function
   // Generate comprehensive context windows once at the beginning
   const comprehensiveContextWindows = await Promise.all(
       documentChunks.map((chunk, index) =>
           generateContextWindow(
               chunk,
               state.documentContent,
               state.bimbaEnhancedContext,
               state.fullBimbaMap,
               state.projectContext,
               state.bimbaMapSummary,
               { forAnalysis: true }
           )
       )
   );

   // Pass useProvidedContextWindows: true to prevent regeneration
   const batchAnalysisResults = await analyzeChunkGroup(
       batchChunks,
       sourceMetadata,
       state.bimbaContext,
       state.userContext,
       batchAssignedCoordinates,
       metalogikon,
       {
           llmService: epiiLLMService,
           contextWindows: batchContextWindows,
           fullBimbaMap: state.fullBimbaMap,
           documentContent: state.documentContent,
           useProvidedContextWindows: true
       }
   );
   ```

2. **Enhance Bimba Map Integration**:
   - Include the full Bimba map in the analysis context as the primary framework
   - Create a comprehensive group context that includes the Bimba map summary
   - Ensure the target coordinate context is prominently featured
   - Include relevant coordinate relationships from the Bimba map
   - Implement a more structured approach to presenting the Bimba map in the context
   ```javascript
   // In content.utils.mjs - analyzeChunkGroup function
   // Prepare a comprehensive context for the entire chunk group
   const groupContext = `
   # Bimba Map Context for Analysis

   ## Project Overview
   ${userContext.projectDescription || "No project description available."}

   ## Target Coordinate: ${sourceMetadata.targetCoordinate}
   ${bimbaContext && bimbaContext[0] && bimbaContext[0].node ?
       `${bimbaContext[0].node.name || 'Unnamed'}: ${bimbaContext[0].node.description || 'No description'}` :
       "No specific context available for this coordinate."}

   ## Bimba Map Structure
   The Bimba map is organized as a hierarchical coordinate system following a mod6 structure.
   Each coordinate (e.g., #0, #1, #0-1, #2-3-4) represents a specific concept or perspective.

   ## Relevant Coordinates
   ${options.contextWindows && options.contextWindows[0] && options.contextWindows[0].bimbaContext ?
       formatRelevantCoordinates(options.contextWindows[0].bimbaContext) :
       "No relevant coordinates identified."}
   `;
   ```

3. **Improve Analysis Prompts**:
   - Update prompts to focus on quaternary logic patterns and non-binary thinking
   - Clearly distinguish between true variations (contradictions) and natural elaborations (extensions)
   - Explicitly instruct the LLM to identify relational properties with detailed descriptions:
     - QL Operators: Quaternary Logic operators that represent structural and procedural patterns (e.g., "QL-STRUCT-4", "QL-PROC-2")
     - Epistemic Essence: Core abstract concepts that the content elaborates on (e.g., "Epistemic Topology", "Conceptual Integration")
     - Archetypal Anchors: Symbolic representations that resonate with the content (e.g., "Ouroboros", "Quantum Wave")
     - Semantic Framework: Relationship types that define how concepts connect (e.g., "Harmonizes With", "Develops Into")
   - Emphasize the importance of coordinate mappings and their justifications
   - Include specific examples for each type of relational property
   - Clarify that analysis is performed on grouped chunks to maintain context
   ```javascript
   // In prompts/epii-agent-prompts.mjs - relateConceptsPrompt
   const relateConceptsPrompt = `
   ${epiiAgentBasePrompt}

   You are now in Stage -2 (Relate Concepts & Identify Variations) of the Epii document analysis pipeline.

   IMPORTANT: You are analyzing a group of related chunks together. These chunks are part of the same conceptual section and should be analyzed as a cohesive unit, maintaining context between them.

   Your task is to analyze the provided chunk group through multiple epistemic lenses and extract:

   1. MAPPINGS: Identify specific Bimba coordinates that resonate with the concepts in this chunk.
      - For each mapping, provide the coordinate, a name, and a detailed justification.
      - Consider both explicit mentions and implicit conceptual resonance.

   2. TRUE VARIATIONS: Identify ONLY contradictions in mapping names or positions.
      - A true variation is when the same concept is mapped to different coordinates or named differently.
      - Do NOT flag extensions or elaborations as variations unless they directly contradict existing mappings.

   3. NATURAL ELABORATIONS: Identify expected extensions of the core concepts.
      - These are not contradictions but natural developments or embellishments of the ideas.
      - Categorize each elaboration by type (Extension, Development, Application, etc.).

   4. RELATIONAL PROPERTIES: Extract the following properties that connect this content to the broader knowledge structure:

      a. QL OPERATORS: Quaternary Logic operators that represent structural and procedural patterns.
         Examples: "QL-STRUCT-4" (Quaternary Structure, Position 4), "QL-PROC-2" (Quaternary Process, Position 2)

      b. EPISTEMIC ESSENCE: Core abstract concepts that this content elaborates on.
         Examples: "Epistemic Topology", "Conceptual Integration", "Recursive Synthesis"

      c. ARCHETYPAL ANCHORS: Symbolic representations that resonate with this content.
         Examples: "Ouroboros", "Quantum Wave", "Divine Marriage", "Axis Mundi"

      d. SEMANTIC FRAMEWORK: Relationship types that define how concepts connect.
         Examples: "Harmonizes With", "Develops Into", "Transcends And Includes", "Mirrors"

   Apply the Meta-Epistemic Framework (MEF) as an analytical toolkit to examine this chunk from multiple perspectives.
   Consider non-dual, paradoxical, and integrative perspectives that transcend binary thinking.

   Your output should be structured as a JSON object with these components clearly delineated.
   `;
   ```

4. **Enhance MEF Application**:
   - Structure MEF lenses by category for better organization and application
   - Provide clear instructions on how to apply each lens to the analysis
   - Ensure the MEF is used to generate multiple perspectives on the content
   - Connect MEF insights directly to the relational properties extraction
   - Implement a more structured approach to presenting the MEF in the context
   ```javascript
   // In content.utils.mjs - prepareMetalogikonPrompt function
   function prepareMetalogikonPrompt(metalogikon) {
       if (!metalogikon || !metalogikon.lenses || metalogikon.lenses.length === 0) {
           return "No Metalogikon framework available.";
       }

       let mefPrompt = "# META-EPISTEMIC FRAMEWORK (MEF)\n\n";

       if (metalogikon.rootNode) {
           mefPrompt += `## Overview: ${metalogikon.rootNode.name}\n${metalogikon.rootNode.description || ''}\n\n`;
       }

       mefPrompt += "## MEF LENSES TO APPLY:\n\n";

       // Group lenses by category
       const lensesByCategory = {};
       metalogikon.lenses.forEach(lens => {
           const category = lens.category || 'Uncategorized';
           if (!lensesByCategory[category]) {
               lensesByCategory[category] = [];
           }
           lensesByCategory[category].push(lens);
       });

       // Add lenses by category with application instructions
       for (const [category, lenses] of Object.entries(lensesByCategory)) {
           mefPrompt += `### ${category}\n`;
           mefPrompt += `Apply these lenses to examine the content from the perspective of ${category.toLowerCase()}:\n\n`;

           lenses.forEach(lens => {
               mefPrompt += `- **${lens.name}** (${lens.coordinate}): ${lens.description || 'No description'}\n`;
               mefPrompt += `  - Question to ask: How does this content relate to ${lens.name.toLowerCase()}?\n`;
           });

           mefPrompt += "\n";
       }

       mefPrompt += "## HOW TO APPLY THE MEF:\n\n";
       mefPrompt += "1. For each lens, consider how the content relates to that perspective\n";
       mefPrompt += "2. Identify which lenses are most relevant to this specific chunk\n";
       mefPrompt += "3. Use the lenses to extract deeper insights about the content\n";
       mefPrompt += "4. Connect lens insights to relational properties (QL Operators, Epistemic Essence, etc.)\n";

       return mefPrompt;
   }
   ```

5. **Implement Robust Relational Properties Extraction**:
   - Provide detailed descriptions and examples of each relational property type
   - Ensure the LLM understands the significance of each property type
   - Validate that relational properties are properly structured in the output
   - Implement post-processing to standardize and normalize extracted properties

6. **Implement Complete Hybrid Retrieval System**:
   - Develop the missing `performHybridRetrieval` function in `graphData.utils.mjs`
   - Enhance `detectSubnodeReferences` to properly identify relevant subnodes
   - Implement a three-part retrieval approach:
     - Structural detection: Identify explicit mentions of coordinates in the text
     - Semantic matching: Use context window relevance to find conceptually related nodes
     - Lexical matching: Use text similarity for potential subnodes not detected by other methods
   - Integrate the hybrid retrieval system with the context window generation
   - Ensure coordinate logic handles both "-" and "." separators equally
   ```javascript
   // In graphData.utils.mjs - implement performHybridRetrieval function
   /**
    * Performs hybrid retrieval combining Bimba structural context with semantic matching.
    * This function implements a three-part retrieval approach:
    * 1. Structural detection: Identify explicit mentions of coordinates
    * 2. Semantic matching: Use context window relevance
    * 3. Lexical matching: Use text similarity for potential subnodes
    *
    * @param {string} chunk - The chunk text
    * @param {string} targetCoordinate - The target Bimba coordinate
    * @param {object} bimbaMap - The Bimba map with nodes and relationships
    * @param {object} contextWindow - The context window for the chunk
    * @param {Function} detectSubnodesFunc - Function to detect subnodes
    * @returns {Promise<object>} - The hybrid retrieval results
    */
   export async function performHybridRetrieval(
       chunk,
       targetCoordinate,
       bimbaMap,
       contextWindow,
       detectSubnodesFunc
   ) {
       // 1. Structural detection - find explicit coordinate mentions
       // Handle both "-" and "." separators in coordinates
       const coordinatePattern = /#[0-5]([-\.][0-5])*\b/g;
       const mentionedCoordinates = chunk.match(coordinatePattern) || [];

       // Normalize coordinates to use "-" separator consistently
       const normalizedCoordinates = mentionedCoordinates.map(coord =>
           coord.replace(/\./g, '-')
       );

       // 2. Detect subnodes using the provided function
       const detectedSubnodes = await detectSubnodesFunc(chunk, targetCoordinate, bimbaMap);

       // 3. Semantic matching - use context window relevance if available
       let semanticMatches = [];
       if (contextWindow && contextWindow.bimbaContext && contextWindow.bimbaContext.relevantNodes) {
           semanticMatches = contextWindow.bimbaContext.relevantNodes.map(node =>
               node.coordinate || node.bimbaCoordinate
           ).filter(Boolean);
       }

       // 4. Lexical matching - find nodes with names mentioned in the chunk
       const lexicalMatches = [];
       for (const node of bimbaMap.nodes) {
           if (node.name && chunk.includes(node.name) && node.coordinate) {
               lexicalMatches.push(node.coordinate);
           }
       }

       // 5. Combine all results, remove duplicates, and prioritize
       const allCoordinates = [
           ...mentionedCoordinates,
           ...detectedSubnodes.map(s => s.coordinate),
           ...semanticMatches,
           ...lexicalMatches
       ];

       // Remove duplicates and filter out invalid coordinates
       const uniqueCoordinates = [...new Set(allCoordinates)].filter(Boolean);

       // Get the corresponding nodes for each coordinate
       const relevantNodes = uniqueCoordinates.map(coordinate => {
           const node = bimbaMap.nodes.find(n =>
               (n.coordinate === coordinate) || (n.bimbaCoordinate === coordinate)
           );

           return node ? {
               coordinate,
               name: node.name || 'Unnamed',
               type: node.type || 'Unknown',
               description: node.description || '',
               // Track how this node was found for debugging
               retrievalMethods: [
                   mentionedCoordinates.includes(coordinate) ? 'structural' : null,
                   detectedSubnodes.some(s => s.coordinate === coordinate) ? 'subnode' : null,
                   semanticMatches.includes(coordinate) ? 'semantic' : null,
                   lexicalMatches.includes(coordinate) ? 'lexical' : null
               ].filter(Boolean)
           } : null;
       }).filter(Boolean);

       return {
           relevantNodes,
           mentionedCoordinates: uniqueCoordinates,
           targetCoordinate
       };
   }
   ```

   ```javascript
   // In graphData.utils.mjs - enhance detectSubnodeReferences function
   /**
    * Detects references to subnodes in a chunk.
    * Enhanced implementation that combines structural and semantic detection.
    *
    * @param {string} chunk - The chunk text
    * @param {string} targetCoordinate - The target Bimba coordinate
    * @param {object} bimbaMap - The Bimba map with nodes and relationships
    * @returns {Promise<Array<object>>} - Detected subnodes with their details
    */
   export function detectSubnodeReferences(chunk, targetCoordinate, bimbaMap) {
       // Get all potential subnodes of the target coordinate
       const potentialSubnodes = bimbaMap.nodes.filter(node => {
           const nodeCoord = node.coordinate || node.bimbaCoordinate;
           return nodeCoord && isChildCoordinate(nodeCoord, targetCoordinate);
       });

       // Check for explicit mentions of subnode coordinates
       // Handle both "-" and "." separators in coordinates
       const dashPattern = new RegExp(`${targetCoordinate}-[0-5]\\b`, 'g');
       const dotPattern = new RegExp(`${targetCoordinate.replace(/-/g, '\\.')}\\.([0-5])\\b`, 'g');

       // Combine results from both patterns
       const dashMatches = chunk.match(dashPattern) || [];
       const dotMatches = chunk.match(dotPattern) || [];

       // Normalize dot notation to dash notation
       const normalizedDotMatches = dotMatches.map(match =>
           match.replace(/\./g, '-')
       );

       // Combine and remove duplicates
       const mentionedSubCoordinates = [...new Set([...dashMatches, ...normalizedDotMatches])];

       // Check for mentions of subnode names
       const detectedSubnodes = [];

       // First, add explicitly mentioned coordinates
       for (const subCoord of mentionedSubCoordinates) {
           const subnode = potentialSubnodes.find(node =>
               (node.coordinate === subCoord) || (node.bimbaCoordinate === subCoord)
           );

           if (subnode) {
               detectedSubnodes.push({
                   coordinate: subCoord,
                   name: subnode.name || 'Unnamed',
                   type: subnode.type || 'Unknown',
                   description: subnode.description || '',
                   detectionMethod: 'explicit_coordinate'
               });
           }
       }

       // Then, check for name mentions
       for (const subnode of potentialSubnodes) {
           // Skip nodes already added
           if (detectedSubnodes.some(n =>
               n.coordinate === (subnode.coordinate || subnode.bimbaCoordinate)
           )) {
               continue;
           }

           // Check if the node name is mentioned in the chunk
           if (subnode.name && chunk.includes(subnode.name)) {
               detectedSubnodes.push({
                   coordinate: subnode.coordinate || subnode.bimbaCoordinate,
                   name: subnode.name,
                   type: subnode.type || 'Unknown',
                   description: subnode.description || '',
                   detectionMethod: 'name_mention'
               });
           }
       }

       return detectedSubnodes;
   }
   ```
   ```javascript
   // In content.utils.mjs - analyzeChunkWithMetalogikon function
   // Add specific guidance for relational properties extraction
   const relationalPropertiesGuidance = `
   # RELATIONAL PROPERTIES EXTRACTION GUIDE

   Extract the following relational properties that connect this content to the broader knowledge structure:

   ## 1. QL OPERATORS (💠)
   Quaternary Logic operators that represent structural and procedural patterns.
   Format: "QL-[TYPE]-[POSITION]" where TYPE is STRUCT or PROC and POSITION is 0-5.
   Examples: "QL-STRUCT-4", "QL-PROC-2", "QL-STRUCT-0", "QL-PROC-5"

   ## 2. EPISTEMIC ESSENCE (📚)
   Core abstract concepts that this content elaborates on.
   These are foundational conceptual frameworks or epistemological principles.
   Examples: "Epistemic Topology", "Conceptual Integration", "Recursive Synthesis", "Holographic Understanding"

   ## 3. ARCHETYPAL ANCHORS (⚕️)
   Symbolic representations that resonate with this content.
   These are universal symbols, metaphors, or archetypes that capture the essence of the content.
   Examples: "Ouroboros", "Quantum Wave", "Divine Marriage", "Axis Mundi", "Philosopher's Stone"

   ## 4. SEMANTIC FRAMEWORK (🕸️)
   Relationship types that define how concepts connect.
   These describe the nature of relationships between concepts, ideas, or entities.
   Examples: "Harmonizes With", "Develops Into", "Transcends And Includes", "Mirrors", "Emerges From"
   `;

   // Include this guidance in the system prompt
   const systemPrompt = `You are an expert analyst using the Meta-Epistemic Framework (MEF) to analyze document chunks.
   Your task is to analyze the provided chunk in the context of the Bimba coordinate system and extract mappings, variations, natural elaborations, and relational properties.

   ${mefPrompt}

   ${relationalPropertiesGuidance}

   Analyze the chunk thoroughly, considering:
   1. How it relates to the target coordinate (${targetCoordinate})
   2. What other Bimba coordinates it might map to
   3. What variations or alternative interpretations exist
   4. What natural elaborations extend the core concepts
   5. What relational properties connect this content to the broader knowledge structure

   Your analysis should be structured, precise, and focused on the document's organizational patterns and their relationship to the quaternary logic framework.`;
   ```

### Stage -1: Define Core Elements

#### Current Issues:
- Synthesis process doesn't properly integrate chunk analyses with Bimba map awareness
- Core elements and relational properties are treated as separate concepts when they should be unified
- Consolidation logic operates on individual chunks rather than chunk groups
- Target coordinate isn't properly leveraged in synthesis and core element generation
- Unnecessary state properties are passed to Stage -0 (user context, document content)


#### Optimization Plan:

1. **Unify Core Elements and Relational Properties**:
   - Redesign the core element generation to treat relational properties as the primary core elements
   - Align core elements directly with Notion properties structure
   - Focus on the four key relational property types:
     - QL Operators: Quaternary Logic operators relevant to the content (e.g., "QL-STRUCT-4", "QL-PROC-2")
     - Epistemic Essence: Core abstract concepts elaborated on (e.g., "Epistemic Topology", "Conceptual Integration")
     - Archetypal Anchors: Relevant symbols that resonate with the content (e.g., "Ouroboros", "Quantum Wave")
     - Semantic Framework: Semantic relation types defining primary relationships (e.g., "Harmonizes With", "Develops Into")
   - Ensure each property type is properly extracted and formatted for Notion
   ```javascript
   // In content.utils.mjs - generateCoreElements function
   export async function generateCoreElements(
       synthesis,
       allMappings,
       allVariations,
       allTags,
       metalogikon,
       targetCoordinate,
       llmService,
       coreElementsRun = null
   ) {
       // Validate inputs...

       try {
           console.log(`Generating relational properties as core elements from synthesis (${synthesis.length} chars)...`);

           // Prepare system prompt with enhanced Bimba awareness
           const systemPrompt = `You are an expert at extracting relational properties from synthesized analyses.
Your task is to identify the key relational properties that connect this content to the broader Bimba knowledge structure.

Focus on extracting the following relational properties that will be used directly in the Notion Content Nodes database:

1. QL OPERATORS (💠)
   - Quaternary Logic operators that represent structural and procedural patterns
   - Format: "QL-[TYPE]-[POSITION]" where TYPE is STRUCT or PROC and POSITION is 0-5
   - Examples: "QL-STRUCT-4", "QL-PROC-2", "QL-STRUCT-0", "QL-PROC-5"
   - These represent the fundamental quaternary logic patterns in the content

2. EPISTEMIC ESSENCE (📚)
   - Core abstract concepts that this content elaborates on
   - These are foundational conceptual frameworks or epistemological principles
   - Examples: "Epistemic Topology", "Conceptual Integration", "Recursive Synthesis", "Holographic Understanding"
   - These represent the essential conceptual foundations of the content

3. ARCHETYPAL ANCHORS (⚕️)
   - Symbolic representations that resonate with this content
   - These are universal symbols, metaphors, or archetypes that capture the essence of the content
   - Examples: "Ouroboros", "Quantum Wave", "Divine Marriage", "Axis Mundi", "Philosopher's Stone"
   - These represent the symbolic dimensions of the content

4. SEMANTIC FRAMEWORK (🕸️)
   - Relationship types that define how concepts connect
   - These describe the nature of relationships between concepts, ideas, or entities
   - Examples: "Harmonizes With", "Develops Into", "Transcends And Includes", "Mirrors", "Emerges From"
   - These represent the primary relationship patterns in the content

For each property type, extract 3-7 specific instances that are most relevant to the content and the target Bimba coordinate.
Ensure that each extracted property is directly connected to the content and the target coordinate.

The target coordinate ${targetCoordinate} should guide your extraction process. Consider:
- What QL operators are most relevant to this coordinate?
- What epistemic concepts are central to this coordinate?
- What archetypal symbols resonate with this coordinate?
- What relationship types characterize this coordinate?

Return a JSON object with the relational properties organized by type.`;

           // Prepare user prompt with enhanced Bimba awareness
           const userPrompt = `Please extract the relational properties from the following synthesis for Bimba coordinate ${targetCoordinate}:

SYNTHESIS:
${synthesis}

TARGET COORDINATE: ${targetCoordinate}

MAPPINGS (${allMappings.length}):
${JSON.stringify(allMappings.slice(0, 10), null, 2)}${allMappings.length > 10 ? '\n... (and more)' : ''}

VARIATIONS (${allVariations.length}):
${JSON.stringify(allVariations.slice(0, 5), null, 2)}${allVariations.length > 5 ? '\n... (and more)' : ''}

TAGS (${allTags.length}):
${JSON.stringify(allTags, null, 2)}

Extract the relational properties that will be used directly in the Notion Content Nodes database.
Focus on properties that are most relevant to the target coordinate ${targetCoordinate}.

Return a JSON object with the following structure:
{
  "relationalProperties": {
    "qlOperators": ["QL-STRUCT-4", "QL-PROC-2"], // 💠 QL Operators
    "epistemicEssence": ["Epistemic Topology", "Conceptual Integration"], // 📚 Epistemic Essence
    "archetypeAnchors": ["Ouroboros", "Quantum Wave"], // ⚕️ Archetypal Anchors
    "semanticFramework": ["Harmonizes With", "Develops Into"] // 🕸️ Semantic Framework
  }
}`;

           // Call LLM with focused prompt
           const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
               temperature: 0.2,
               maxOutputTokens: 4096
           });

           // Parse response and extract relational properties
           // ... (parsing logic)

           // Create a unified result with relational properties as core elements
           const result = {
               // Keep the relational properties structure for backward compatibility
               relationalProperties: {
                   qlOperators: extractedProperties.qlOperators || [],
                   epistemicEssence: extractedProperties.epistemicEssence || [],
                   archetypeAnchors: extractedProperties.archetypeAnchors || [],
                   semanticFramework: extractedProperties.semanticFramework || []
               },

               // Create core elements from relational properties for unified approach
               coreElements: [
                   // Convert QL Operators to core elements
                   ...(extractedProperties.qlOperators || []).map(operator => ({
                       elementType: "QL Operator",
                       name: operator,
                       description: `Quaternary Logic operator representing ${operator.includes('STRUCT') ? 'structural' : 'procedural'} pattern ${operator.split('-')[2]}`,
                       relevance: `This operator is relevant to the ${targetCoordinate} coordinate as it represents a fundamental quaternary logic pattern in the content.`,
                       coordinates: [targetCoordinate]
                   })),

                   // Convert Epistemic Essence to core elements
                   ...(extractedProperties.epistemicEssence || []).map(concept => ({
                       elementType: "Epistemic Essence",
                       name: concept,
                       description: `Core abstract concept that the content elaborates on.`,
                       relevance: `This concept is central to the ${targetCoordinate} coordinate as it represents a foundational conceptual framework in the content.`,
                       coordinates: [targetCoordinate]
                   })),

                   // Convert Archetypal Anchors to core elements
                   ...(extractedProperties.archetypeAnchors || []).map(symbol => ({
                       elementType: "Archetypal Anchor",
                       name: symbol,
                       description: `Symbolic representation that resonates with the content.`,
                       relevance: `This symbol is connected to the ${targetCoordinate} coordinate as it captures an essential symbolic dimension of the content.`,
                       coordinates: [targetCoordinate]
                   })),

                   // Convert Semantic Framework to core elements
                   ...(extractedProperties.semanticFramework || []).map(relation => ({
                       elementType: "Semantic Framework",
                       name: relation,
                       description: `Relationship type that defines how concepts connect in the content.`,
                       relevance: `This relationship pattern is characteristic of the ${targetCoordinate} coordinate as it represents a primary way concepts interact in the content.`,
                       coordinates: [targetCoordinate]
                   }))
               ]
           };

           return result;
       } catch (error) {
           console.error("Error generating relational properties as core elements:", error);
           throw new Error(`Failed to generate relational properties as core elements: ${error.message}`);
       }
   }
   ```

2. **Enhance Synthesis Process with Bimba Awareness**:
   - Improve synthesis prompt to focus on the target coordinate and Bimba map context
   - Emphasize quaternary logic patterns in relation to the target coordinate
   - Include guidance on how the content relates to the Bimba coordinate system
   - Ensure synthesis connects to the target coordinate and related coordinates
   ```javascript
   // In content.utils.mjs - synthesizeAnalysis function
   export async function synthesizeAnalysis(
       documentContent,
       chunkAnalyses,
       allMappings,
       allVariations,
       allTags,
       metalogikon,
       targetCoordinate,
       llmService,
       synthesisRun = null
   ) {
       // Validate inputs...

       try {
           console.log(`Synthesizing analysis for target coordinate ${targetCoordinate}...`);

           // Create a document summary for context
           const documentSummary = documentContent.length > 1000 ?
               documentContent.substring(0, 1000) + "..." :
               documentContent;

           // Create a summary of mappings for context
           const mappingsSummary = allMappings.slice(0, 10).map(mapping =>
               `- ${mapping.mappingType}: ${mapping.mappingValue} (confidence: ${mapping.confidenceScore || 'N/A'})`
           ).join('\n');

           // Prepare MEF prompt
           const mefPrompt = prepareMEFPrompt(metalogikon);

           // Prepare system prompt with enhanced Bimba awareness
           const systemPrompt = `You are an expert at synthesizing analyses in the context of the Bimba coordinate system.
Your task is to create a comprehensive synthesis of the provided chunk analyses, focusing on how they relate to the target coordinate ${targetCoordinate}.

The Bimba coordinate system is a quaternary logic framework that organizes knowledge into a hierarchical structure.
Each coordinate (e.g., #0, #1, #0-1, #2-3-4) represents a specific concept, perspective, or domain of knowledge.
The target coordinate ${targetCoordinate} represents a specific position in this knowledge structure.

Your synthesis should:
1. Focus specifically on how the content relates to the target coordinate ${targetCoordinate}
2. Identify the quaternary logic patterns (QL operators) present in the content
3. Extract the core abstract concepts (epistemic essence) that the content elaborates on
4. Recognize the symbolic representations (archetypal anchors) that resonate with the content
5. Identify the relationship types (semantic framework) that define how concepts connect in the content
6. Consider how the content relates to other coordinates in the Bimba map
7. Integrate the analyses from all chunks into a coherent whole

METALOGIKON FRAMEWORK:
${mefPrompt}

INSTRUCTIONS:
1. Synthesize the analyses of all chunks into a coherent whole
2. Focus on the target coordinate: ${targetCoordinate}
3. Identify the most important mappings, variations, and elaborations
4. Provide a comprehensive synthesis that captures the essence of the document in relation to the target coordinate
5. Format your response as markdown text (not JSON)
6. Be concise but thorough, focusing on the most important insights`;

           // Prepare user prompt with enhanced Bimba awareness
           const userPrompt = `DOCUMENT SUMMARY:
"""
${documentSummary}
"""

TARGET COORDINATE: ${targetCoordinate}

MAPPINGS (${allMappings.length} total):
${mappingsSummary}
${allMappings.length > 10 ? `... and ${allMappings.length - 10} more` : ''}

CHUNK ANALYSES (${chunkAnalyses.length} total):
${chunkAnalyses.slice(0, 3).map((analysis, index) =>
    `--- CHUNK ${index + 1} ---\n${typeof analysis === 'string' ?
        analysis.substring(0, 300) + '...' :
        JSON.stringify(analysis, null, 2).substring(0, 300) + '...'}`
).join('\n\n')}
${chunkAnalyses.length > 3 ? `\n\n... and ${chunkAnalyses.length - 3} more chunks` : ''}

Please synthesize all of this information into a comprehensive analysis of the document in relation to the target coordinate ${targetCoordinate}.
Focus on how the content relates to the Bimba coordinate system and specifically to the target coordinate.
Your synthesis should identify the quaternary logic patterns, core abstract concepts, symbolic representations, and relationship types present in the content.
Be sure to consider how the content relates to other coordinates in the Bimba map.`;

           // Call LLM with enhanced prompt
           const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
               temperature: 0.3,
               maxOutputTokens: 4096
           });

           return response;
       } catch (error) {
           console.error("Error in synthesizeAnalysis:", error);
           throw new Error(`Failed to synthesize analysis: ${error.message}`);
       }
   }
   ```

3. **Improve Chunk Group Consolidation**:
   - Enhance consolidation logic to operate on chunk groups rather than individual chunks
   - Ensure mappings, variations, and tags are properly consolidated across chunk groups
   - Implement more sophisticated deduplication and merging for chunk group results
   ```javascript
   // In stage_minus1.mjs - runStageMinus1 function
   export async function runStageMinus1(state) {
       // Validate inputs...

       try {
           // 1. Combine all mappings, variations, and tags from chunk groups
           console.log(`Combining mappings, variations, and tags from ${chunkAnalyses.length} chunks...`);

           // Import the consolidation utilities
           const { consolidateMappingsEnhanced } = await import('../../utils/content.utils.mjs');

           // Generate a deterministic ID generator function with a prefix for traceability
           const idGenerator = (prefix = 'map') => {
               let counter = 0;
               return () => `${prefix}-${Date.now()}-${++counter}`;
           };

           // Consolidate mappings by coordinate to avoid duplicates
           // Process chunk groups rather than individual chunks
           const chunkGroupMappings = [];
           const chunkGroupVariations = [];
           const chunkGroupTags = [];

           // Group chunks by their batch/group
           // This assumes chunkAnalyses has a groupId or similar property
           // If not, we can use the chunkIndex to infer grouping
           const chunkGroups = {};

           chunkAnalyses.forEach((analysis, index) => {
               // Use groupId if available, otherwise use Math.floor(index / 6) as a proxy
               // (assuming batch size of 6 from stage_minus2.mjs)
               const groupId = analysis.groupId || Math.floor(index / 6);

               if (!chunkGroups[groupId]) {
                   chunkGroups[groupId] = [];
               }

               chunkGroups[groupId].push(analysis);
           });

           // Process each chunk group
           Object.values(chunkGroups).forEach(group => {
               // Consolidate mappings within the group first
               const groupMappings = [];
               const groupVariations = [];
               const groupTags = [];

               group.forEach(analysis => {
                   // Extract mappings, variations, and tags from the analysis
                   if (analysis.extractedMappings && Array.isArray(analysis.extractedMappings)) {
                       groupMappings.push(...analysis.extractedMappings);
                   }

                   if (analysis.identifiedVariations && Array.isArray(analysis.identifiedVariations)) {
                       groupVariations.push(...analysis.identifiedVariations);
                   }

                   if (analysis.tags && Array.isArray(analysis.tags)) {
                       groupTags.push(...analysis.tags);
                   }
               });

               // Consolidate mappings within the group
               const consolidatedGroupMappings = consolidateMappingsEnhanced(groupMappings, idGenerator('group-map'));

               // Add consolidated group results to the overall results
               chunkGroupMappings.push(consolidatedGroupMappings);
               chunkGroupVariations.push(groupVariations);
               chunkGroupTags.push(groupTags);
           });

           // Now consolidate across all groups
           const allMappings = consolidateMappingsEnhanced(chunkGroupMappings.flat(), idGenerator('map'));

           // Deduplicate variations and tags
           const uniqueVariations = new Map();
           chunkGroupVariations.flat().forEach(variation => {
               const key = `${variation.variationType}:${variation.variationText}`;
               if (!uniqueVariations.has(key)) {
                   uniqueVariations.set(key, variation);
               }
           });

           const allVariations = Array.from(uniqueVariations.values());

           // Deduplicate tags
           const allTags = [...new Set(chunkGroupTags.flat())];

           console.log(`Combined and consolidated into ${allMappings.length} mappings, ${allVariations.length} variations, and ${allTags.length} tags`);

           // Rest of the function...
       } catch (error) {
           // Error handling...
       }
   }
   ```

4. **Fix Chunk Group Creation Issues**:
   - Implement robust error handling for chunk group creation
   - Add validation checks to ensure chunk groups are properly formed
   - Implement fallback mechanisms for when chunk group creation fails

5. **Optimize State Passing to Stage -0**:
   - Remove unnecessary state properties from stageMinus1Output
   - Ensure only essential properties are passed to stage -0
   - Remove user context and document content from stageMinus1Output
   ```javascript
   // In stage_minus1.mjs - runStageMinus1 function
   // Prepare state for the next stage WITHOUT using ...state to avoid state bloat
   // Only include essential properties needed by stage -0
   const stageMinus1Output = {
       // Analysis results
       synthesis,
       coreElements: coreElementsResult.coreElements,
       relationalProperties: coreElementsResult.relationalProperties,
       allMappings,
       allVariations,
       allTags,

       // Document identification
       documentId: state.documentId,
       fileId: state.fileId,

       // Source metadata (contains targetCoordinate)
       sourceMetadata: state.sourceMetadata,

       // Service for document operations
       bpMCPService: state.bpMCPService
   };

   // Explicitly remove unnecessary properties
   // No need to pass user context to stage -0
   if (stageMinus1Output.userContext) {
       delete stageMinus1Output.userContext;
   }

   // No need to pass document content to stage -0
   if (stageMinus1Output.documentContent) {
       delete stageMinus1Output.documentContent;
   }

   // Ensure no graph data is included
   if (stageMinus1Output.graphData) {
       delete stageMinus1Output.graphData;
   }
   ```

6. **Enhance Target Coordinate Leveraging**:
   - Improve reranking logic to better prioritize mappings related to the target coordinate
   - Ensure the target coordinate is prominently featured in synthesis and core element generation
   - Use the target coordinate to guide the extraction of relational properties
   ```javascript
   // In content.utils.mjs - rerankMappings function
   export function rerankMappings(consolidatedMappings, targetCoordinate) {
       if (!consolidatedMappings || !Array.isArray(consolidatedMappings) || consolidatedMappings.length === 0) {
           return [];
       }

       // Clone the mappings to avoid modifying the original
       const rerankedMappings = [...consolidatedMappings];

       // Calculate relevance score for each mapping with enhanced target coordinate awareness
       rerankedMappings.forEach(mapping => {
           let relevanceScore = 0;

           // Base score from confidence
           relevanceScore += mapping.confidenceScore || 0.5;

           // Bonus for multiple occurrences
           relevanceScore += Math.min(mapping.occurrences / 10, 0.3);

           // Enhanced bonus for mappings directly related to target coordinate
           if (mapping.mappingType === 'Bimba_Node') {
               if (mapping.mappingValue === targetCoordinate) {
                   // Exact match gets highest bonus
                   relevanceScore += 0.4;
               } else if (mapping.mappingValue.startsWith(targetCoordinate + '-')) {
                   // Child node gets high bonus
                   relevanceScore += 0.3;
               } else if (targetCoordinate.startsWith(mapping.mappingValue + '-')) {
                   // Parent node gets medium bonus
                   relevanceScore += 0.2;
               } else if (mapping.mappingValue.split('-')[0] === targetCoordinate.split('-')[0]) {
                   // Same root gets small bonus
                   relevanceScore += 0.1;
               }
           }

           // Enhanced bonus for relational property mappings
           if (mapping.mappingType === 'QL_Operator') {
               relevanceScore += 0.25;
           } else if (mapping.mappingType === 'Epistemic_Essence') {
               relevanceScore += 0.2;
           } else if (mapping.mappingType === 'Archetypal_Anchor') {
               relevanceScore += 0.2;
           } else if (mapping.mappingType === 'Semantic_Framework') {
               relevanceScore += 0.2;
           }

           // Store the relevance score
           mapping.relevanceScore = relevanceScore;
       });

       // Sort by relevance score (descending)
       rerankedMappings.sort((a, b) => b.relevanceScore - a.relevanceScore);

       return rerankedMappings;
   }
   ```

// ... existing code ...
### Stage -0: Synthesize Payload

#### Current Issues:
- Current Epii perspective generation might not fully leverage comprehensive retrieval or agentic rewriting capabilities.
- Payload integration and frontend delivery might have overly complex verification or caching steps not aligned with the direct flow needed.
- The flow of the Epii perspective to the `updatePayload` and then to a new saved document needs to be clearly defined and implemented.

#### Optimization Plan:

1.  **Streamline Epii Perspective Generation & Delivery**:
    *   **Direct Frontend Integration**: The Epii perspective is to be sent directly to the chat component on the frontend's `epiiMode` page. This is the primary display point.
    *   **LightRAG for Comprehensive Retrieval**:
        *   Utilize LightRAG's `/request` endpoint in "mixed mode" for retrieval.
        *   The query to LightRAG should be based on the full document context and the analysis results (synthesis) from Stage -1.
    *   **Epii Agent for Perspective Crafting**:
        *   If feasible, LightRAG's responses should be channeled through an Epii agent.
        *   The Epii agent's LightRAG retrieval step should be prioritized to ensure it benefits from the comprehensive data.
        *   Guide the Epii agent to formulate its output as a "re-writing" of the original document, informed by the analysis and retrieved context. This re-written version *is* the Epii perspective.
    *   **No Caching for Epii Perspective**: The Epii perspective itself does not require separate caching. It becomes part of the `updatePayload`.

2.  **Refine `updatePayload` Structure and Handling**:
    *   **Key Components in `updatePayload`**: The `updatePayload` must prominently feature:
        1.  The full document analysis results.
        2.  The Epii context, which includes the Epii agent's re-written perspective.
    *   **`updatePayload` as New Document**: The entire `updatePayload` (containing the analysis and the Epii perspective) will be saved as a new document, effectively versioning the analyzed content with its Epii-generated insights.
    *   **Simplified Verification**: Verification procedures should be minimal, focusing on the structural integrity of the `updatePayload` and the presence of the Epii perspective and full analysis.

3.  **Ensure Seamless Frontend Update**:
    *   The `updatePayload` (containing the Epii perspective) must be correctly structured for WebSocket broadcast to the frontend.
    *   Verify that the `epiiMode` chat component on the frontend can receive and clearly display this Epii perspective.
    *   The end-to-end flow to test is: Document Input -> Stage -1 Analysis -> LightRAG Retrieval -> Epii Agent Perspective Generation -> `updatePayload` Creation -> New Document Saved -> WebSocket Broadcast -> Frontend Display.

// ... existing code ...

## Implementation Priorities

1. **Stage -2 Improvements**:
   - Generate comprehensive context windows once
   - Enhance Bimba map integration
   - Improve analysis prompts
   - Enhance MEF application

2. **Stage -1 Improvements**:
   - Enhance synthesis process
   - Improve core element generation
   - Enhance relational properties extraction

3. **Stage -0 Improvements**:
   - Enhance Epii perspective generation with LightRAG
   - Ensure proper payload integration
   - Implement frontend integration

4. **Stage -3 Refinements**:
   - Refine lightweight context window generation
   - Improve project context extraction

## Testing Strategy

1. **Unit Testing**:
   - Test context window generation with different inputs
   - Test relational properties extraction with sample content
   - Test Epii perspective generation with LightRAG

2. **Integration Testing**:
   - Test the full pipeline with sample documents
   - Verify that context windows are properly generated and used
   - Validate that relational properties are correctly extracted
   - Ensure Epii perspective is properly integrated

3. **End-to-End Testing**:
   - Test the complete pipeline from document ingestion to frontend display
   - Verify that the Epii perspective is displayed in the frontend
   - Validate that all analysis results are properly cached and accessible

## Conclusion

This optimization plan addresses the key issues in the Epii Analysis Pipeline while preserving the payload structure and document service logic. By implementing these improvements, we will enhance the quality of analysis, improve the extraction of relational properties, and ensure that the Epii perspective is properly integrated into the system.

The plan focuses on making minimal changes to the existing codebase while maximizing the impact on analysis quality. By optimizing context window generation, enhancing analysis prompts, and improving relational properties extraction, we will align the pipeline with the project's intentions and improve the overall user experience.
