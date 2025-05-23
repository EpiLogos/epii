# Epii Analysis Pipeline Enhancement: Phase 3 - Notion Update Payload Enhancement

## Overview

Phase 3 of the Epii Analysis Pipeline Enhancement focuses on refining the Notion update payload structure, standardizing property naming, eliminating redundancies, and ensuring consistent handling of the new fields added in Phase 2. This phase will prepare the pipeline for seamless integration with the Notion API and future synthesis pipeline.

## Current Status Assessment

We've successfully implemented:

1. **Phase 1: Bimba Context Integration**
   - Added functions to extract the full Bimba map from graphData
   - Implemented context window generation for better analysis
   - Enhanced chunking to preserve context during document processing

2. **Phase 2: Refine Analysis Logic**
   - Implemented hybrid retrieval combining structural, semantic, and lexical matching
   - Enhanced MEF integration as an analytical toolkit
   - Added support for natural elaborations vs. true variations
   - Implemented reranking and enhanced consolidation in Stage -1
   - Added natural language summary generation

## Issues Requiring Attention

1. **Property Naming Inconsistency**:
   - Multiple property names for document content: `content`, `textContent`, `text`, etc.
   - Inconsistent node property access: `node.name || node.title || node.label`
   - Inconsistent handling of node IDs and relationships

2. **Notion Update Payload Structure**:
   - New fields (naturalElaborations, mefLensInsights, bimbaMapSummary) are only in `_originalData`
   - Subnode payloads don't include these new fields
   - Payload structure needs to be properly formatted for Notion API requirements

3. **Content Generation**:
   - `generateSubnodeContent` hasn't been updated to include new fields
   - Inconsistent formatting across content generation functions
   - Redundant code in content generation logic

4. **Redundant Code**:
   - Multiple functions with similar graphData validation logic
   - Repeated error handling patterns
   - Duplicate code for extracting data from nodes and relationships

## Implementation Plan

### 1. Create Utility Modules

1. **GraphData Utility Module** (`graphData.utils.mjs`):
   - `validateGraphData(graphData)`: Validate graphData structure and provide default values
   - `getNodeById(graphData, nodeId)`: Get a node by its ID with proper error handling
   - `getNodeByCoordinate(graphData, coordinate)`: Get a node by its Bimba coordinate
   - `getNodeName(node)`: Get the name of a node with fallbacks (name → title → label)
   - `getNodeDescription(node)`: Get the description of a node with fallbacks
   - `getNodeRelationships(graphData, nodeId)`: Get all relationships for a node
   - `getBimbaHierarchy(graphData)`: Build the Bimba hierarchy from graphData
   - `getParentCoordinate(coordinate)`: Get the parent coordinate of a given coordinate
   - `getChildCoordinates(graphData, coordinate)`: Get all child coordinates of a given coordinate
   - `getSiblingCoordinates(graphData, coordinate)`: Get all sibling coordinates of a given coordinate
   - `isChildCoordinate(childCoord, parentCoord)`: Check if a coordinate is a child of another
   - `getBimbaContextFromGraphData(graphData, coordinate)`: Get Bimba context for a coordinate
   - `getFullBimbaMapFromGraphData(graphData)`: Get the full Bimba map with hierarchical structure
   - `getProjectContextFromGraphData(graphData)`: Get project-level context
   - `getBimbaCoordinateMapFromGraphData(graphData)`: Get a map of coordinates to their metadata

2. **Document Utility Module** (`document.utils.mjs`):
   - `getDocumentContent(document)`: Get the content of a document with fallbacks
   - `getDocumentTitle(document)`: Get the title of a document with fallbacks
   - `getDocumentMetadata(document)`: Get the metadata of a document with fallbacks
   - `detectDocumentFormat(content, fileName)`: Detect the format of a document
   - `preprocessDocumentContent(content, fileName)`: Pre-process document content
   - `createStandardDocument(documentId, content, title, metadata)`: Create a standardized document object
   - `extractDocumentFromBPMCPResult(result)`: Extract a document from BPMCP service result

3. **Content Generation Utility Module** (`content.utils.mjs`):
   - `generateSectionHeader(title, level)`: Generate a section header in markdown format
   - `generateMappingsSection(mappings)`: Generate a section for mappings
   - `generateVariationsSection(variations)`: Generate a section for variations
   - `generateNaturalElaborationsSection(elaborations)`: Generate a section for natural elaborations
   - `generateMEFLensInsightsSection(mefLensInsights)`: Generate a section for MEF lens insights
   - `generateSubnodeMappingsSection(subnodeMappings)`: Generate a section for subnode mappings
   - `generateStructuralContextSection(targetCoordinate, graphData)`: Generate a section for structural context
   - `generateContentFromAnalysis(analysisData, sourceMetadata, graphData)`: Generate content from analysis data
   - `generateSubnodeContent(subnodeData, subnodeCoordinate, sourceMetadata)`: Generate content for a subnode

4. **Notion Utility Module** (`notion.utils.mjs`):
   - `formatTextProperty(text)`: Format a text property for Notion
   - `formatRichTextProperty(text)`: Format a rich text property for Notion
   - `formatSelectProperty(value)`: Format a select property for Notion
   - `formatMultiSelectProperty(values)`: Format a multi-select property for Notion
   - `formatNumberProperty(value)`: Format a number property for Notion
   - `formatDateProperty(date)`: Format a date property for Notion
   - `formatCheckboxProperty(checked)`: Format a checkbox property for Notion
   - `formatRelationProperty(pageIds)`: Format a relation property for Notion
   - `formatStatusProperty(value)`: Format a status property for Notion
   - `formatContentTypeProperty(contentType)`: Format a content type property for Notion
   - `formatParagraphBlock(text)`: Format a paragraph block for Notion
   - `formatHeadingBlock(text, level)`: Format a heading block for Notion
   - `formatBulletedListItemBlock(text)`: Format a bulleted list item block for Notion
   - `formatNumberedListItemBlock(text)`: Format a numbered list item block for Notion
   - `formatCodeBlock(code, language)`: Format a code block for Notion
   - `formatCalloutBlock(text, emoji)`: Format a callout block for Notion
   - `formatDividerBlock()`: Format a divider block for Notion
   - `formatToggleBlock(text, children)`: Format a toggle block for Notion
   - `markdownToNotionBlocks(markdown)`: Convert markdown content to Notion blocks

### 2. Update Pipeline Functions to Use Utility Modules

1. **Update `getDocumentFromBPMCP` Function**:
   - Use `document.utils.mjs` functions for document content access
   - Standardize on `content` as the property name
   - Improve error handling and logging

2. **Update `runStageMinus4` Function**:
   - Use `graphData.utils.mjs` functions for Bimba context access
   - Improve error handling and logging
   - Ensure consistent property access

3. **Update `runStageMinus3` Function**:
   - Use `document.utils.mjs` functions for document content access
   - Use `graphData.utils.mjs` functions for Bimba context access
   - Improve error handling and logging

4. **Update `runStageMinus2` Function**:
   - Use `graphData.utils.mjs` functions for Bimba context access
   - Improve error handling and logging
   - Ensure consistent property access

5. **Update `runStageMinus1` Function**:
   - Use `graphData.utils.mjs` functions for Bimba context access
   - Improve error handling and logging
   - Ensure consistent property access

6. **Update `runStagePlus0` Function**:
   - Use `content.utils.mjs` functions for content generation
   - Use `notion.utils.mjs` functions for Notion payload formatting
   - Enhance payload structure to include new fields from Phase 2
   - Improve error handling and logging

### 3. Enhance Notion Update Payload Structure

1. **Main Payload Structure**:
   - Update `runStagePlus0` to include `naturalElaborations`, `mefLensInsights`, and `bimbaMapSummary` in the main payload
   - Use `notion.utils.mjs` functions to format fields properly for Notion
   - Ensure proper handling of relation properties, status properties, and content type properties

2. **Subnode Payload Structure**:
   - Update subnode payload generation to include new fields from Phase 2
   - Use `notion.utils.mjs` functions to format fields properly for Notion
   - Add support for natural elaborations and MEF lens insights in subnode payloads

3. **Content Generation**:
   - Use `content.utils.mjs` functions for content generation
   - Update `generateSubnodeContent` to include sections for naturalElaborations and mefLensInsights
   - Ensure consistent formatting with main content generation

### 4. Clean Up Implementation

1. **Remove Redundant Code**:
   - Replace direct graphData access with utility functions
   - Replace direct document content access with utility functions
   - Replace direct content generation with utility functions
   - Replace direct Notion payload formatting with utility functions

2. **Update Documentation**:
   - Ensure all functions have proper JSDoc comments
   - Update comments to reflect current implementation
   - Add examples where appropriate

### 5. Error Handling

1. **Standardize Error Handling**:
   - Create consistent error handling patterns
   - Ensure proper logging with meaningful messages
   - Implement appropriate fallbacks for error conditions

## Implementation Steps

### Step 1: Create Utility Modules
1. ✅ Create `graphData.utils.mjs` with core functions for working with graphData
2. ✅ Create `document.utils.mjs` with functions for document content access
3. ✅ Create `content.utils.mjs` with functions for content generation
4. ✅ Create `notion.utils.mjs` with functions for Notion payload formatting

### Step 2: Update Document Handling
1. Update `getDocumentFromBPMCP` to use `document.utils.mjs` functions
2. Standardize on `content` as the property name for document content
3. Improve error handling and logging for document retrieval

### Step 3: Update GraphData Access
1. Update all functions that access graphData to use `graphData.utils.mjs` functions
2. Replace direct node property access with utility functions
3. Replace direct relationship property access with utility functions

### Step 4: Update Content Generation
1. Update `generateContentFromAnalysis` to use `content.utils.mjs` functions
2. Update `generateSubnodeContent` to include new fields from Phase 2
3. Ensure consistent formatting across all content generation

### Step 5: Enhance Notion Update Payload
1. Update `runStagePlus0` to include new fields in the main payload
2. Update subnode payload generation to include new fields
3. Use `notion.utils.mjs` functions for proper Notion formatting

### Step 6: Clean Up Implementation
1. Remove redundant code and functions
2. Update documentation and comments
3. Ensure consistent error handling across the pipeline

## Detailed Implementation Tasks

### Task 1: Update `getDocumentFromBPMCP` Function
```javascript
// Before
async function getDocumentFromBPMCP(documentId) {
    try {
        const result = await bpmcpService.getDocument(documentId);

        // Handle different response formats
        let document = null;

        if (Array.isArray(result) && result.length > 0) {
            document = result[0];
        } else if (result && typeof result === 'object' && result._id) {
            document = result;
        }

        if (!document) {
            throw new Error(`Document not found: ${documentId}`);
        }

        // Get the document content with multiple fallbacks
        const content = document.content ||
                        document.textContent ||
                        document.text ||
                        document.rawContent ||
                        document.raw ||
                        (document.metadata && document.metadata.textContent) ||
                        (document.versions && document.versions[0] && document.versions[0].content) || '';

        return {
            document,
            content
        };
    } catch (error) {
        console.error(`Error retrieving document from BPMCP:`, error);
        throw new Error(`Failed to retrieve document: ${error.message}`);
    }
}

// After
import { extractDocumentFromBPMCPResult, getDocumentContent } from '../utils/document.utils.mjs';

async function getDocumentFromBPMCP(documentId) {
    try {
        const result = await bpmcpService.getDocument(documentId);

        const document = extractDocumentFromBPMCPResult(result);

        if (!document) {
            throw new Error(`Document not found: ${documentId}`);
        }

        const content = getDocumentContent(document);

        return {
            document,
            content
        };
    } catch (error) {
        console.error(`Error retrieving document from BPMCP:`, error);
        throw new Error(`Failed to retrieve document: ${error.message}`);
    }
}
```

### Task 2: Update GraphData Access Functions
```javascript
// Before
function getBimbaContextFromGraphData(graphData, coordinate) {
    if (!graphData || !graphData.nodes || !coordinate) {
        return [];
    }

    // Find the target node
    const targetNode = graphData.nodes.find(node => node.bimbaCoordinate === coordinate);

    if (!targetNode) {
        return [];
    }

    // Get all connections to/from this node
    const connections = [];
    const edges = graphData.edges || graphData.links || [];

    for (const edge of edges) {
        const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
        const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

        if (sourceId === targetNode.id || targetId === targetNode.id) {
            const direction = sourceId === targetNode.id ? 'outgoing' : 'incoming';
            const connectedNodeId = direction === 'outgoing' ? targetId : sourceId;
            const connectedNode = graphData.nodes.find(node => node.id === connectedNodeId);

            if (connectedNode) {
                connections.push({
                    relationship: edge.type || 'CONNECTED_TO',
                    direction,
                    node: connectedNode
                });
            }
        }
    }

    return [{
        node: targetNode,
        connections
    }];
}

// After
import { getBimbaContextFromGraphData } from '../utils/graphData.utils.mjs';

// Use the imported function directly
```

### Task 3: Update Content Generation Functions
```javascript
// Before
function generateContentFromAnalysis(analysisData, sourceMetadata) {
    // Generate markdown content from analysis data
    let content = `# Analysis of ${sourceMetadata.sourceFileName}\n\n`;

    // Add Bimba map summary if available
    if (analysisData.bimbaMapSummary) {
        content += `## Bimba Map Summary\n\n${analysisData.bimbaMapSummary}\n\n`;
    }

    // Add overall summary
    content += `## Overall Summary\n\n${analysisData.overallSummary}\n\n`;

    // Add mappings section
    content += `## Extracted Mappings\n\n`;
    if (analysisData.extractedMappings && analysisData.extractedMappings.length > 0) {
        analysisData.extractedMappings.forEach((mapping, index) => {
            content += `### Mapping ${index + 1}: ${mapping.mappingType}\n`;
            content += `- Value: ${mapping.mappingValue}\n`;
            if (mapping.reasoning) {
                content += `- Reasoning: ${mapping.reasoning}\n`;
            }
            content += `- QL Phase: ${mapping.qlPhase || 'Not specified'}\n\n`;
        });
    } else {
        content += "No mappings extracted.\n\n";
    }

    // Add variations section
    content += `## Identified Variations\n\n`;
    if (analysisData.identifiedVariations && analysisData.identifiedVariations.length > 0) {
        analysisData.identifiedVariations.forEach((variation, index) => {
            content += `### Variation ${index + 1}: ${variation.variationType}\n`;
            content += `- Status: ${variation.status}\n`;
            if (variation.variationText) {
                content += `- Text: ${variation.variationText}\n\n`;
            }
            if (variation.proposedResolution) {
                content += `- Proposed Resolution: ${variation.proposedResolution}\n\n`;
            }
        });
    } else {
        content += "No variations identified.\n\n";
    }

    // Add natural elaborations section
    content += `## Natural Elaborations\n\n`;
    if (analysisData.naturalElaborations && analysisData.naturalElaborations.length > 0) {
        analysisData.naturalElaborations.forEach((elaboration, index) => {
            content += `### Elaboration ${index + 1}: ${elaboration.elaborationType}\n`;
            content += `- Target Coordinate: ${elaboration.targetCoordinate || 'Not specified'}\n`;
            if (elaboration.elaborationText) {
                content += `- Text: ${elaboration.elaborationText}\n\n`;
            }
            if (elaboration.confidenceScore) {
                content += `- Confidence: ${elaboration.confidenceScore.toFixed(2)}\n\n`;
            }
        });
    } else {
        content += "No natural elaborations identified.\n\n";
    }

    // Add MEF lens insights section
    content += `## MEF Lens Insights\n\n`;
    if (analysisData.mefLensInsights && Object.keys(analysisData.mefLensInsights).length > 0) {
        Object.entries(analysisData.mefLensInsights).forEach(([lens, insight]) => {
            content += `### ${lens}\n`;
            content += `${insight}\n\n`;
        });
    } else {
        content += "No MEF lens insights identified.\n\n";
    }

    return content;
}

// After
import { generateContentFromAnalysis } from '../utils/content.utils.mjs';

// Use the imported function directly
```

### Task 4: Update Notion Payload Formatting
```javascript
// Before
function formatNotionPayload(analysisData, sourceMetadata) {
    return {
        targetCoordinate: sourceMetadata.targetCoordinate,
        notionPageId: sourceMetadata.notionPageId,
        content: generateContentFromAnalysis(analysisData, sourceMetadata),
        title: `Analysis of ${sourceMetadata.sourceFileName}`,
        properties: {
            Status: {
                status: {
                    name: "Ready for Review"
                }
            },
            "Content Type": {
                select: {
                    name: "Analysis"
                }
            }
        }
    };
}

// After
import { formatTextProperty, formatStatusProperty, formatSelectProperty } from '../utils/notion.utils.mjs';
import { generateContentFromAnalysis } from '../utils/content.utils.mjs';

function formatNotionPayload(analysisData, sourceMetadata) {
    return {
        targetCoordinate: sourceMetadata.targetCoordinate,
        notionPageId: sourceMetadata.notionPageId,
        content: generateContentFromAnalysis(analysisData, sourceMetadata, graphData),
        title: `Analysis of ${sourceMetadata.sourceFileName}`,
        properties: {
            Status: formatStatusProperty("Ready for Review"),
            "Content Type": formatSelectProperty("Analysis"),
            "Natural Elaborations": formatNumberProperty(
                (analysisData.naturalElaborations || []).length
            ),
            "MEF Lens Insights": formatNumberProperty(
                Object.keys(analysisData.mefLensInsights || {}).length
            )
        },
        naturalElaborations: analysisData.naturalElaborations || [],
        mefLensInsights: analysisData.mefLensInsights || {},
        bimbaMapSummary: analysisData.bimbaMapSummary || ''
    };
}

## Success Metrics

1. **Code Quality**: Reduction in redundant code and consistent property naming
2. **Notion Integration**: Properly formatted payload for Notion API requirements
3. **Content Generation**: Consistent and comprehensive content generation for main and subnode content
4. **Error Handling**: Robust error handling with meaningful messages and appropriate fallbacks
5. **Documentation**: Comprehensive and up-to-date documentation for all functions
