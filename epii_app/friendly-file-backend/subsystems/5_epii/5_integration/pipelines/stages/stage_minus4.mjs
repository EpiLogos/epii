/**
 * Stage -4: Contextualize Analysis
 *
 * This stage gathers relevant context from the Bimba map for the target coordinate
 * and prepares the document for analysis. It is responsible for:
 *
 * 1. Retrieving Bimba context for the target coordinate from the bimbaMap
 * 2. Retrieving project context from the bimbaMap
 * 3. Generating a Bimba coordinate map
 * 4. Creating Bimba-enhanced document context
 * 5. Generating a Bimba map summary for context windows
 * 6. Preparing a clean state for the next stage
 *
 * This stage corresponds to the +1 (Definition) stage in the Quaternary Logic cycle.
 */

// Import required modules
import defaultEpiiLLMService from '../../../2_services/epii-llm.service.mjs';
import { generateBimbaMapSummary } from '../../../1_utils/content/context.mjs';
import {
    getBimbaContextFromBimbaMap,
    getProjectContextFromBimbaMap,
    getBimbaCoordinateMapFromBimbaMap
} from '../../../../../databases/shared/utils/graphData.utils.mjs';

/**
 * Stage -4: Contextualize Analysis
 * Gathers relevant context from the Bimba map for the target coordinate and prepares
 * the document for analysis. This stage enhances the document with Bimba context,
 * project context, and coordinate mapping to enable more effective analysis in later stages.
 *
 * @param {object} state - The state from Stage -5
 * @param {string} state.targetCoordinate - The Bimba coordinate of the target node
 * @param {string} state.documentContent - The content of the document to analyze
 * @param {string} state.sourceFileName - The name of the source file
 * @param {object} state.bimbaMap - The Bimba map from Stage -5
 * @returns {Promise<object>} - A promise resolving to the state after Stage -4
 * @throws {Error} - If required parameters are missing or invalid
 */
export async function runStageMinus4(state) {
    console.log(`--- Epii Pipeline: Stage -4 (Contextualize Analysis) ---`);

    // Validate required parameters
    if (!state) {
        throw new Error("State object is required for Stage -4");
    }

    const { targetCoordinate, notionPageId, sourceFileName, documentContent } = state;

    if (!targetCoordinate) {
        throw new Error("Target coordinate is required for Stage -4");
    }

    if (!documentContent) {
        throw new Error("Document content is required for Stage -4");
    }

    if (!sourceFileName) {
        throw new Error("Source file name is required for Stage -4");
    }

    console.log(`Processing document "${sourceFileName}" for coordinate ${targetCoordinate}`);

    try {
        // 1. Validate and use bimbaMap from stage_minus5
        if (!state.bimbaMap) {
            throw new Error("bimbaMap is required from stage_minus5 but was not found in state");
        }

        if (!state.bimbaMap.nodes || !Array.isArray(state.bimbaMap.nodes)) {
            throw new Error("bimbaMap must have a nodes array");
        }

        if (!state.bimbaMap.relationships || !Array.isArray(state.bimbaMap.relationships)) {
            throw new Error("bimbaMap must have a relationships array");
        }

        console.log(`Using bimbaMap from previous stage with ${state.bimbaMap.nodes.length} nodes and ${state.bimbaMap.relationships.length} relationships`);
        const fullBimbaMap = state.bimbaMap;

        // 3. Retrieve Bimba context for targetCoordinate directly from bimbaMap
        console.log(`Retrieving Bimba context for coordinate ${targetCoordinate}...`);
        const bimbaContext = getBimbaContextFromBimbaMap(fullBimbaMap, targetCoordinate);

        if (!bimbaContext || !Array.isArray(bimbaContext)) {
            console.warn(`No Bimba context found for coordinate ${targetCoordinate}. Using empty context.`);
        } else {
            console.log(`Retrieved Bimba context with ${bimbaContext.length} records`);
        }

        // 4. Retrieve project context directly from bimbaMap
        // For stage -4, we need the full context for later stages
        console.log(`Retrieving full project context for analysis...`);
        const projectContext = getProjectContextFromBimbaMap(fullBimbaMap, { fullContext: true });

        if (!projectContext || !projectContext.projectNodes) {
            console.warn("No project context found. Using default project context.");
        } else {
            console.log(`Retrieved project context: ${projectContext.projectName}`);
            console.log(`Project description: ${projectContext.projectDescription.substring(0, 100)}...`);
            console.log(`Root node found: ${projectContext.rootNode ? 'Yes' : 'No'}`);
            console.log(`Subsystem nodes: ${projectContext.subsystemNodes ? projectContext.subsystemNodes.length : 0}`);
            console.log(`Full context included: ${projectContext.isFullContext}`);
        }

        // 5. User context is not needed for admin-only jobs
        const userContext = [];
        console.log(`User context retrieval skipped (admin-only job)`);

        // 6. Generate Bimba Coordinate Map directly from bimbaMap
        console.log(`Generating Bimba Coordinate Map...`);
        const coordinateMap = await getBimbaCoordinateMapFromBimbaMap(fullBimbaMap);

        if (!coordinateMap || Object.keys(coordinateMap).length === 0) {
            console.warn("No coordinate map generated. Using empty map.");
        } else {
            console.log(`Generated Bimba Coordinate Map with ${Object.keys(coordinateMap).length} coordinates`);
        }

        // Get the LLM service from state or use the default
        const llmService = state.epiiLLMService || defaultEpiiLLMService;

        // 7. Generate Bimba-enhanced document context
        console.log(`Generating Bimba-enhanced document context...`);
        // Create a simple context string combining available information
        const bimbaEnhancedContext = `# Document Context for ${sourceFileName}

## Target Coordinate: ${targetCoordinate}

## Project Context
Project: ${projectContext.projectName || 'Unknown Project'}
Description: ${projectContext.projectDescription || 'No project description available'}

## Bimba Context
${bimbaContext && bimbaContext.length > 0 ?
    bimbaContext.map(ctx => `- ${ctx.name || ctx.coordinate || 'Unknown'}: ${ctx.description || 'No description'}`).join('\n') :
    'No specific Bimba context available'}

## Document Information
File: ${sourceFileName}
Type: ${sourceFileName.split('.').pop().toLowerCase()}
Content Length: ${documentContent.length} characters
`;
        console.log(`Generated Bimba-enhanced context (${bimbaEnhancedContext.length} chars)`);

        // 8. Generate Bimba map summary for context window
        console.log(`Generating Bimba map summary for coordinate ${targetCoordinate}...`);
        const bimbaMapSummary = await generateBimbaMapSummary(
            // Pass empty analysis data since we're generating this before analysis
            {
                extractedMappings: [],
                identifiedVariations: [],
                naturalElaborations: [],
                processedSubnodeMappings: {}
            },
            targetCoordinate,
            fullBimbaMap, // Use fullBimbaMap directly instead of converting to graphData
            llmService
        );
        console.log(`Generated Bimba map summary (${bimbaMapSummary.length} chars)`);

        // Log the project context for debugging
        console.log(`--- Project Context Debug Information ---`);
        console.log(`Project Name: ${projectContext.projectName}`);
        console.log(`Project Description: ${projectContext.projectDescription.substring(0, 100)}...`);
        if (projectContext.rootNode) {
            console.log(`Root Node: ${projectContext.rootNode.name} (${projectContext.rootNode.coordinate})`);
        } else {
            console.log(`Root Node: Not found`);
        }
        console.log(`Subsystem Nodes: ${projectContext.subsystemNodes ? projectContext.subsystemNodes.length : 0}`);
        console.log(`Total Nodes with Coordinates: ${projectContext.allNodesWithCoordinates ? projectContext.allNodesWithCoordinates.length : 0}`);
        console.log(`--- End Project Context Debug Information ---`);

        // 9. Prepare comprehensive source metadata
        const sourceMetadata = {
            notionPageId,
            targetCoordinate,
            sourceFileName,
            documentId: state.documentId,
            documentType: sourceFileName.split('.').pop().toLowerCase(),
            sourceType: state.sourceType || 'unknown',
            processingTimestamp: new Date().toISOString()
        };

        // Add document metadata if available
        if (state.document && state.document.metadata) {
            sourceMetadata.documentMetadata = state.document.metadata;
        } else if (state.documentMetadata) {
            sourceMetadata.documentMetadata = state.documentMetadata;
        }

        // Add last modified date if available
        if (state.lastModified) {
            sourceMetadata.lastModified = state.lastModified;
        }

        // 10. Prepare clean state for the next stage
        const stageMinus4Output = {
            // Document content and metadata
            documentContent,
            sourceMetadata,

            // Bimba context and related information
            bimbaContext: bimbaContext || [],
            userContext,
            coordinateMap: coordinateMap || {},
            bimbaEnhancedContext,
            bimbaMapSummary,
            fullBimbaMap,
            projectContext: projectContext || {
                projectName: "Unknown Project",
                projectDescription: "No project context available"
            },

            // Essential properties from previous stage
            documentId: state.documentId,
            targetCoordinate,
            sourceFileName,
            sourceType: state.sourceType,
            fileId: state.fileId,
            userId: state.userId,
            documentFetched: state.documentFetched,

            // Document reference and services
            document: state.document,
            bpMCPService: state.bpMCPService,

            // AG-UI context for event emission
            skillContext: state.skillContext
        };

        // 11. Validate the output state
        if (!stageMinus4Output.documentContent) {
            throw new Error("Document content is required for the next stage");
        }

        if (!stageMinus4Output.bimbaEnhancedContext) {
            throw new Error("Bimba-enhanced context is required for the next stage");
        }

        if (!stageMinus4Output.fullBimbaMap) {
            throw new Error("Full Bimba map is required for the next stage");
        }

        // 12. Double-check that no graph data is included
        if (stageMinus4Output.graphData) {
            console.log(`Removing graphData from stageMinus4Output`);
            delete stageMinus4Output.graphData;
        }

        console.log("--- Epii Pipeline: Stage -4 Complete ---");
        return stageMinus4Output;

    } catch (error) {
        console.error(`Error in Epii Pipeline Stage -4 for coordinate ${targetCoordinate}:`, error);

        // Categorize the error for better debugging
        let errorType = 'GENERAL_ERROR';
        let errorMessage = error.message;

        if (errorMessage.includes('bimbaMap')) {
            errorType = 'BIMBA_MAP_ERROR';
        } else if (errorMessage.includes('context')) {
            errorType = 'CONTEXT_GENERATION_ERROR';
        } else if (errorMessage.includes('coordinate')) {
            errorType = 'COORDINATE_ERROR';
        } else if (errorMessage.includes('document')) {
            errorType = 'DOCUMENT_ERROR';
        }

        // Update document analysis status if possible
        if (state.documentId && state.bpMCPService) {
            try {
                console.log(`Updating document analysis status to 'failed' for document ${state.documentId}`);
                await state.bpMCPService.updateDocument(state.documentId, {
                    $set: {
                        'analysisStatus': 'failed',
                        'metadata.analysisStatus': 'failed',
                        'metadata.analysisError': errorMessage,
                        'metadata.analysisErrorType': errorType,
                        'metadata.analysisErrorStage': '-4',
                        'metadata.analysisErrorTimestamp': new Date()
                    }
                });
                console.log(`Successfully updated document analysis status to 'failed'`);
            } catch (updateError) {
                console.error(`Error updating document analysis status:`, updateError);
            }
        }

        // Throw a detailed error for the controller
        throw new Error(`Epii Pipeline Stage -4 failed [${errorType}]: ${errorMessage}`);
    }
}
