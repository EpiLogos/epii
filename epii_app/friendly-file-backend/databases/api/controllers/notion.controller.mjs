import dotenv from 'dotenv';
import { mcpClient } from '../../shared/services/mcp.service.mjs'; // Import the shared client
import { executeNotionProposal } from '../../../subsystems/5_epii/2_services/crystallization.service.mjs';

// Load environment variables (adjust path if needed relative to execution context)
// Assuming .env is in the backend root where node is executed
dotenv.config({ path: './.env' });


// Controller function for fetching Notion page properties based on Bimba coordinate
export const getNotionContentByCoordinate = async (req, res) => {
    const { coordinate } = req.params; // Extract coordinate from URL parameter
    console.log(`[Notion Controller] Received request for coordinate: ${coordinate}`);

    if (!coordinate) {
        return res.status(400).json({ error: 'Bimba coordinate parameter is required.' });
    }

    try {
        // Step 1: Resolve Bimba Coordinate to Notion Page ID using MCP tool
        console.log(`[Notion Controller] Resolving coordinate ${coordinate} to Notion Page ID...`);
        const resolveResult = await mcpClient.useTool(
            'Bimba-Pratibimba-Memory-MCP', // Target MCP Server Name
            'resolveBimbaCoordinate',
            { bimbaCoordinate: coordinate }
        );

        // Check for errors from the tool call itself or if the tool returned an error structure
        if (!resolveResult || resolveResult.error || !resolveResult.notionPageId) {
            const errorMessage = resolveResult?.error || `Notion Page ID not found for coordinate ${coordinate}.`;
            console.log(`[Notion Controller] Failed to resolve coordinate: ${errorMessage}`);
            return res.status(404).json({ error: errorMessage });
        }

        const notionPageId = resolveResult.notionPageId;
        console.log(`[Notion Controller] Found Notion Page ID: ${notionPageId}`);

        // Step 2: Get Notion Page Properties using the Page ID via MCP tool
        console.log(`[Notion Controller] Fetching properties for Notion Page ID: ${notionPageId}...`);
        const propertiesResult = await mcpClient.useTool(
            'Bimba-Pratibimba-Memory-MCP', // Target MCP Server Name
            'getNotionPageProperties',
            { notionPageId: notionPageId }
        );

        // Check for errors from the tool call or if the tool returned an error structure
        if (!propertiesResult || propertiesResult.error) {
            const errorMessage = propertiesResult?.error || `Failed to fetch properties for Notion Page ID ${notionPageId}.`;
            console.error(`[Notion Controller] Error fetching properties: ${errorMessage}`);
            // Use 500 for failure to fetch properties unless a specific error suggests otherwise
            return res.status(500).json({ error: errorMessage });
        }

        console.log(`[Notion Controller] Successfully fetched properties for ${coordinate}`);
        res.json(propertiesResult); // Send the fetched properties back

    } catch (error) {
        // Catch errors from the mcpClient.useTool calls (e.g., SDK communication errors)
        console.error(`[Notion Controller] Unhandled error processing request for coordinate ${coordinate}:`, error);
        res.status(500).json({ error: error.message || 'An unexpected error occurred while fetching Notion content.' });
    }
};

/**
 * Controller function for executing a Notion update proposal
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing the Notion update payload
 * @param {Object} req.body.notionUpdatePayload - Payload from the analysis pipeline
 * @param {string} req.body.sourceDocumentId - Optional ID of the source document
 * @param {Object} res - Express response object
 */
export const executeNotionUpdateProposal = async (req, res) => {
    const { notionUpdatePayload, sourceDocumentId } = req.body;
    const userId = req.user?.id || 'system'; // Get user ID from request or default to 'system'

    console.log(`[Notion Controller] Received Notion update proposal for coordinate: ${notionUpdatePayload?.targetCoordinate}`);

    if (!notionUpdatePayload) {
        return res.status(400).json({ error: 'Notion update payload is required.' });
    }

    try {
        // Execute the Notion proposal
        const result = await executeNotionProposal({
            userId,
            notionUpdatePayload,
            sourceDocumentId
        });

        // Ensure the document is properly updated in MongoDB
        if (sourceDocumentId) {
            try {
                // Import Document model
                const Document = (await import('../models/Document.model.mjs')).default;

                // Find and update the document
                const sourceDocument = await Document.findById(sourceDocumentId);
                if (sourceDocument) {
                    // Update the document's Notion reference
                    sourceDocument.metadata = sourceDocument.metadata || {};
                    sourceDocument.metadata.notionReference = {
                        updated: true,
                        updateDate: new Date(),
                        notionPageId: result.notionPageId || null,
                        status: 'synced'
                    };

                    // Update the document's status
                    sourceDocument.metadata.status = 'sent_to_notion';

                    // Save the updated document
                    await sourceDocument.save();

                    console.log(`[Notion Controller] Updated source document ${sourceDocumentId} with Notion reference`);
                } else {
                    console.warn(`[Notion Controller] Source document ${sourceDocumentId} not found`);
                }
            } catch (docError) {
                console.error(`[Notion Controller] Error updating source document ${sourceDocumentId}:`, docError);
                // Continue even if this fails
            }
        }

        console.log(`[Notion Controller] Successfully executed Notion update proposal for ${notionUpdatePayload.targetCoordinate}`);
        res.json(result);
    } catch (error) {
        console.error(`[Notion Controller] Error executing Notion update proposal:`, error);
        res.status(500).json({ error: error.message || 'An unexpected error occurred while executing Notion update proposal.' });
    }
};
