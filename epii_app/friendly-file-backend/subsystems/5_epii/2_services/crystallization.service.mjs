/**
 * Crystallization Service
 *
 * Provides methods for creating and managing crystallized documents:
 * - Creating crystallized documents from original content
 * - Storing crystallizations in MongoDB
 * - Updating Notion with crystallized content
 *
 * This service implements the crystallization phase of the Meta-Techne loop:
 * Ingest → Tag → Embed → Store → Retrieve → Synthesize → Crystallize → Sync
 */

import mongoose from 'mongoose';
import Document from '../../../databases/shared/models/Document.model.mjs';
import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs';
import fetch from 'node-fetch';

/**
 * Create a crystallized document from original content
 * @param {Object} params - Parameters for crystallization
 * @param {string} params.originalDocumentId - ID of the original document
 * @param {string} params.userId - ID of the user creating the crystallization
 * @param {string} params.content - Content of the crystallization
 * @param {string} params.title - Title of the crystallization
 * @param {string} params.targetCoordinate - Bimba coordinate for the crystallization
 * @param {Array} params.relatedCoordinates - Related Bimba coordinates
 * @returns {Promise<Object>} - The created crystallization document
 */
export const createCrystallization = async ({
  originalDocumentId,
  userId,
  content,
  contentBlocks = [],
  title,
  targetCoordinate,
  relatedCoordinates = []
}) => {
  try {
    // Log the parameters we received
    console.log(`Creating crystallization with parameters:
      - originalDocumentId: ${originalDocumentId}
      - userId: ${userId}
      - content length: ${content ? content.length : 0} characters
      - contentBlocks: ${contentBlocks.length} structured blocks
      - title: ${title}
      - targetCoordinate: ${targetCoordinate}
    `);

    // Provide defaults for missing parameters
    const safeUserId = userId || 'system';
    const safeContent = content || 'No content provided';
    const safeTitle = title || 'Untitled Crystallization';
    const safeTargetCoordinate = targetCoordinate || '#';

    // Only validate the document ID
    if (!originalDocumentId) {
      throw new Error('Missing required parameter: originalDocumentId');
    }

    // Get the original document - try both MongoDB and BPMCP service
    let originalDocument;

    try {
      // First try to get the document from MongoDB
      originalDocument = await Document.findById(originalDocumentId);
    } catch (mongoError) {
      console.warn(`Error finding document in MongoDB: ${mongoError.message}`);
      // Continue to try BPMCP service
    }

    // If not found in MongoDB, try BPMCP service
    if (!originalDocument) {
      try {
        console.log(`Document not found in MongoDB, trying BPMCP service for ID: ${originalDocumentId}`);
        const bpmcpResult = await bpMCPService.callTool('getDocumentById', {
          documentId: originalDocumentId
        });

        // Process the result from BPMCP
        if (Array.isArray(bpmcpResult) && bpmcpResult.length > 0) {
          originalDocument = bpmcpResult[0];
        } else if (bpmcpResult && typeof bpmcpResult === 'object' && bpmcpResult._id) {
          originalDocument = bpmcpResult;
        }

        if (originalDocument) {
          console.log(`Successfully retrieved document from BPMCP service: ${originalDocumentId}`);
        }
      } catch (bpmcpError) {
        console.error(`Error getting document from BPMCP service: ${bpmcpError.message}`);
      }
    }

    // If still not found, throw error
    if (!originalDocument) {
      throw new Error(`Original document not found: ${originalDocumentId}`);
    }

    // Instead of using the Document model directly, use the bpMCPService to store the document
    // in the correct collection (pratibimbaDocuments)
    console.log(`Using bpMCPService to store crystallization in pratibimbaDocuments collection`);

    const crystallizationData = {
      title: safeTitle,
      textContent: safeContent, // Use textContent as the primary field
      contentBlocks: contentBlocks.length > 0 ? contentBlocks : undefined, // Include structured content blocks
      userId: safeUserId,
      documentType: 'pratibimba', // Use 'pratibimba' instead of 'crystallization'
      // Add required fields for the storeDocument tool
      originalName: safeTitle,  // Required by the storeDocument tool
      fileName: safeTitle,      // Also commonly used
      mimeType: 'text/plain',   // Default mime type for text
      size: safeContent.length, // Size in characters
      // IMPORTANT: targetCoordinate must be at the top level, not in metadata
      targetCoordinate: safeTargetCoordinate,
      metadata: {
        originalDocumentId,
        originalTitle: originalDocument.title || originalDocument.fileName || 'Unknown',
        relatedCoordinates,
        crystallizationDate: new Date(),
        status: 'draft',
        hasStructuredContent: contentBlocks.length > 0 // Flag to indicate structured content
      }
    };

    // Call the bpMCPService to store the document in the pratibimbaDocuments collection
    const result = await bpMCPService.callTool('storeDocument', {
      document: crystallizationData,
      collection: 'pratibimbaDocuments' // Explicitly specify the collection name
    });

    // Emit AG-UI event for pratibimba document creation
    try {
      const { emitDocumentCreated } = await import('../utils/agui-integration.mjs');

      emitDocumentCreated({
        documentId: result.documentId || crystallizationData._id,
        documentName: crystallizationData.title || crystallizationData.fileName || 'Crystallized Document',
        targetCoordinate: crystallizationData.targetCoordinate || '#5',
        documentType: 'pratibimba',
        collection: 'pratibimbaDocuments',
        metadata: {
          originalDocumentId: originalDocumentId,
          crystallizationType: 'analysis_results',
          crystallizationDate: new Date().toISOString()
        }
      }, 'crystallization-service', 'crystallization-thread');

      console.log('✅ Emitted AG-UI DocumentCreated event for pratibimba document');
    } catch (aguiError) {
      console.warn('⚠️ Failed to emit AG-UI DocumentCreated event:', aguiError);
      // Don't throw - AG-UI events are enhancement, not critical
    }

    // Parse the result to get the crystallization document
    let crystallization;
    try {
      if (typeof result === 'string') {
        crystallization = JSON.parse(result);
      } else if (result.content && result.content[0] && result.content[0].text) {
        crystallization = JSON.parse(result.content[0].text);
      } else {
        crystallization = result;
      }

      console.log(`Successfully created crystallization document with ID: ${crystallization._id}`);
    } catch (parseError) {
      console.error(`Error parsing crystallization result:`, parseError);
      throw new Error(`Failed to parse crystallization result: ${parseError.message}`);
    }

    // Update the original document with a reference to this crystallization
    try {
      // If the original document is from MongoDB, update it directly
      if (originalDocument instanceof mongoose.Model) {
        originalDocument.metadata = originalDocument.metadata || {};
        originalDocument.metadata.crystallizations = [
          ...(originalDocument.metadata.crystallizations || []),
          {
            crystallizationId: crystallization._id,
            title: safeTitle,
            targetCoordinate: safeTargetCoordinate,
            createdAt: new Date()
          }
        ];
        await originalDocument.save();
      }
      // If the original document is from BPMCP, use the BPMCP service to update it
      else {
        console.log(`Updating BPMCP document ${originalDocumentId} with crystallization reference`);

        // Prepare the update data
        const updateData = {
          $set: {
            'metadata.crystallizationCreated': true,
            'metadata.crystallizationId': crystallization._id.toString(),
            'metadata.crystallizationStatus': 'created',
            'metadata.crystallizationTimestamp': new Date()
          }
        };

        // If the document already has crystallizations, append to them
        if (originalDocument.metadata && Array.isArray(originalDocument.metadata.crystallizations)) {
          updateData.$push = {
            'metadata.crystallizations': {
              crystallizationId: crystallization._id.toString(),
              title: safeTitle,
              targetCoordinate: safeTargetCoordinate,
              createdAt: new Date()
            }
          };
        }
        // Otherwise, create a new array
        else {
          updateData.$set['metadata.crystallizations'] = [{
            crystallizationId: crystallization._id.toString(),
            title: safeTitle,
            targetCoordinate: safeTargetCoordinate,
            createdAt: new Date()
          }];
        }

        // Update the document via BPMCP
        await bpMCPService.updateDocument(originalDocumentId, updateData);
        console.log(`Successfully updated BPMCP document ${originalDocumentId} with crystallization reference`);
      }
    } catch (updateError) {
      console.error(`Error updating original document with crystallization reference: ${updateError.message}`);
      // Continue even if this fails - we still want to return the crystallization
    }

    return crystallization;
  } catch (error) {
    console.error('Error creating crystallization:', error);
    throw error;
  }
};

/**
 * Update Notion with crystallized content
 * @param {Object} params - Parameters for Notion update
 * @param {string} params.crystallizationId - ID of the crystallization document
 * @param {string} params.userId - ID of the user updating Notion
 * @param {Object} params.notionPayload - Payload for Notion update
 * @returns {Promise<Object>} - Result of the Notion update
 */
export const updateNotionWithCrystallization = async ({
  crystallizationId,
  userId,
  notionPayload
}) => {
  try {
    // Validate required parameters
    if (!crystallizationId || !userId || !notionPayload) {
      throw new Error('Missing required parameters for Notion update');
    }

    // Get the crystallization document
    const crystallization = await Document.findById(crystallizationId);
    if (!crystallization) {
      throw new Error(`Crystallization document not found: ${crystallizationId}`);
    }

    // Execute the Notion proposal
    const result = await executeNotionProposal({
      userId,
      notionUpdatePayload: notionPayload,
      sourceDocumentId: crystallizationId
    });

    // Update the crystallization document with Notion reference
    crystallization.metadata.notionReference = {
      updated: true,
      updateDate: new Date(),
      notionPageId: result.notionPageId || null,
      status: 'synced'
    };
    await crystallization.save();

    return {
      success: true,
      crystallization,
      notionResult: result
    };
  } catch (error) {
    console.error('Error updating Notion with crystallization:', error);
    throw error;
  }
};

/**
 * Execute a Notion update proposal from the analysis pipeline
 * @param {Object} params - Parameters for the Notion update
 * @param {string} params.userId - ID of the user executing the proposal
 * @param {Object} params.notionUpdatePayload - Payload from the analysis pipeline
 * @param {string} [params.sourceDocumentId] - Optional ID of the source document
 * @returns {Promise<Object>} - Result of the Notion update
 */
export const executeNotionProposal = async ({
  userId,
  notionUpdatePayload,
  sourceDocumentId
}) => {
  try {
    // Validate required parameters
    if (!userId || !notionUpdatePayload) {
      throw new Error('Missing required parameters for Notion proposal execution');
    }

    // Extract data from the payload
    const {
      targetCoordinate,
      title,
      properties: payloadProperties = {},
      contentBlocks = [],
      content, // Legacy field for backward compatibility
      analysisResults,
      relatedCoordinates = [],
      tags = []
    } = notionUpdatePayload;

    if (!targetCoordinate) {
      throw new Error('Notion update payload must include targetCoordinate');
    }

    // Validate that we have either contentBlocks or legacy content
    if (!contentBlocks.length && !content) {
      throw new Error('Notion update payload must include either contentBlocks or content');
    }

    // Filter out non-existent properties that cause validation errors
    const filteredPayloadProperties = {};
    const INVALID_PROPERTIES = [
      'Analysis Status',
      'Analysis Date',
      'Mappings Count',
      'Variations Count',
      'Tags'
    ];

    if (payloadProperties && typeof payloadProperties === 'object') {
      Object.entries(payloadProperties).forEach(([key, value]) => {
        if (!INVALID_PROPERTIES.includes(key)) {
          filteredPayloadProperties[key] = value;
        } else {
          console.log(`Filtered out non-existent property: ${key}`);
        }
      });
    }

    // Prepare properties for Notion
    const properties = {
      // Set default properties
      "Content Type": "Crystallization",  // Simple string value
      "Status": "1",  // Simple string value

      // Merge in FILTERED properties from the payload
      ...filteredPayloadProperties
    };

    // Log the exact properties being sent
    console.log("Notion properties being sent:", JSON.stringify(properties, null, 2));

    // Note: "🗺️ Bimba Address" is redundant and already set on the page
    // The targetCoordinate is already used to find the correct Notion page

    // REMOVED: Tags property - doesn't exist on Notion pages
    // Tags information is included in the content blocks instead
    // if (tags && tags.length > 0) {
    //   properties['Tags'] = tags;
    // }

    // Add analysis results as properties if available
    if (analysisResults) {
      // For relational properties, we'll add notes to the content if they don't exist
      // This is because relation properties require UUIDs, not just text values
      let missingRelations = [];

      // Handle QL Operators (relation to Quaternal Logic DB)
      if (analysisResults.logicOperators && analysisResults.logicOperators.length > 0) {
        missingRelations.push({
          property: '💠 QL Operators',
          values: analysisResults.logicOperators
        });
      }

      // Handle Semantic Framework (relation to Semantics DB)
      if (analysisResults.semanticFramework && analysisResults.semanticFramework.length > 0) {
        missingRelations.push({
          property: '🕸️ Semantic Framework',
          values: analysisResults.semanticFramework
        });
      }

      // Handle Archetypal Anchors (relation to Symbols DB)
      if (analysisResults.symbolicAnchors && analysisResults.symbolicAnchors.length > 0) {
        missingRelations.push({
          property: '⚕️ Archetypal Anchors',
          values: analysisResults.symbolicAnchors
        });
      }

      // Handle Epistemic Essence (relation to Concepts DB)
      if (analysisResults.conceptualFramework && analysisResults.conceptualFramework.length > 0) {
        missingRelations.push({
          property: '📚 Epistemic Essence',
          values: analysisResults.conceptualFramework
        });
      }

      // If we have missing relations, append notes to the content
      if (missingRelations.length > 0) {
        let relationNotes = '\n\n---\n\n## Relation Properties to Set Manually\n\n';
        relationNotes += 'The following properties need to be set manually in Notion:\n\n';

        missingRelations.forEach(relation => {
          relationNotes += `### ${relation.property}\n\n`;
          relation.values.forEach(value => {
            relationNotes += `- ${value}\n`;
          });
          relationNotes += '\n';
        });

        // Append to the content
        content += relationNotes;
      }
    }

    // First, we need to check if the page already exists and find the "Coordinate Summary" block
    let notionPageId = null;

    try {
      // Resolve the Bimba coordinate to a Notion page ID
      const resolveResult = await bpMCPService.resolveBimbaCoordinate(targetCoordinate);
      console.log(`Resolved Bimba coordinate ${targetCoordinate} to Notion page ID:`, resolveResult);

      if (resolveResult && resolveResult.notionPageId) {
        notionPageId = resolveResult.notionPageId;

        console.log(`Using direct Notion API to find and update the "Coordinate Summary" callout block`);

        // Get all blocks from the page
        const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${notionPageId}/children`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28'
          }
        });

        if (!blocksResponse.ok) {
          throw new Error(`Failed to get blocks: ${blocksResponse.statusText}`);
        }

        const blocks = await blocksResponse.json();
        console.log(`Retrieved ${blocks.results?.length || 0} blocks from Notion page`);

        // Find the "Coordinate Summary" callout block
        let coordinateSummaryBlock = null;

        if (blocks && blocks.results) {
          for (const block of blocks.results) {
            if (block.type === 'callout') {
              // Get the text content of the callout
              const calloutText = block.callout?.rich_text?.map(rt => rt.plain_text).join('') || '';

              if (calloutText.includes('Coordinate Summary')) {
                coordinateSummaryBlock = block;
                console.log(`Found "Coordinate Summary" callout block with ID ${block.id}`);
                break;
              }
            }
          }
        }

        if (coordinateSummaryBlock) {
          // Append a new paragraph block as a child of the callout block
          console.log(`Appending content to "Coordinate Summary" callout block with ID ${coordinateSummaryBlock.id}`);

          // Format the content with proper spacing
          const formattedContent = content.trim();

          // Create a paragraph block to append
          const paragraphBlock = {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: formattedContent
                  }
                }
              ]
            }
          };

          // Append the paragraph block as a child of the callout block
          const appendResponse = await fetch(`https://api.notion.com/v1/blocks/${coordinateSummaryBlock.id}/children`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              children: [paragraphBlock]
            })
          });

          if (!appendResponse.ok) {
            throw new Error(`Failed to append block: ${appendResponse.statusText}`);
          }

          const appendResult = await appendResponse.json();
          console.log(`Successfully appended content to "Coordinate Summary" callout block`);

          // Update the page properties
          const updatePropertiesResponse = await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              properties: {
                "Content Type": {
                  select: {
                    name: "Crystallization"
                  }
                },
                "Status": {
                  status: {
                    name: "1"
                  }
                }
              }
            })
          });

          if (!updatePropertiesResponse.ok) {
            throw new Error(`Failed to update properties: ${updatePropertiesResponse.statusText}`);
          }

          console.log(`Successfully updated properties for Notion page ${notionPageId}`);

          // Return a success result
          return {
            success: true,
            notionPageId: notionPageId,
            url: `https://www.notion.so/${notionPageId.replace(/-/g, '')}`,
            targetCoordinate
          };
        } else {
          console.log(`"Coordinate Summary" block not found, using standard crystallizeToNotion tool`);

          // Use structured contentBlocks if available, otherwise fall back to legacy content
          let crystallizeArgs;

          if (contentBlocks.length > 0) {
            console.log(`Using structured contentBlocks (${contentBlocks.length} blocks) for crystallization`);

            // Use the new structured approach with contentBlocks
            crystallizeArgs = {
              targetBimbaCoordinate: targetCoordinate,
              title: title || `Content for ${targetCoordinate}`,
              properties,
              contentBlocks, // Pass the structured blocks directly
              createIfNotExists: true
            };
          } else {
            console.log(`Using legacy content approach for crystallization`);

            // Fall back to legacy content approach
            const formattedContent = `\n\n${content}`;
            crystallizeArgs = {
              targetBimbaCoordinate: targetCoordinate,
              contentToAppend: formattedContent,
              title: title || `Content for ${targetCoordinate}`,
              properties,
              createIfNotExists: true,
              contentFormat: 'markdown'
            };
          }

          // Use the crystallizeToNotion tool with the appropriate arguments
          const result = await bpMCPService.crystallizeToNotion(crystallizeArgs);

          return result;
        }
      }
    } catch (error) {
      console.warn(`Error finding existing Notion page: ${error.message}`);
      // Continue with normal crystallization if there was an error
    }

    // If we couldn't find the page or the "Coordinate Summary" block, use the standard crystallizeToNotion tool
    let fallbackArgs;

    if (contentBlocks.length > 0) {
      console.log(`Using structured contentBlocks (${contentBlocks.length} blocks) for fallback crystallization`);

      // Use the new structured approach with contentBlocks
      fallbackArgs = {
        targetBimbaCoordinate: targetCoordinate,
        title: title || `Content for ${targetCoordinate}`,
        properties,
        contentBlocks, // Pass the structured blocks directly
        createIfNotExists: true
      };
    } else {
      console.log(`Using legacy content approach for fallback crystallization`);

      // Fall back to legacy content approach
      fallbackArgs = {
        targetBimbaCoordinate: targetCoordinate,
        contentToAppend: content,
        title: title || `Content for ${targetCoordinate}`,
        properties,
        createIfNotExists: true,
        contentFormat: 'markdown'
      };
    }

    const result = await bpMCPService.crystallizeToNotion(fallbackArgs);

    // Log the result
    console.log(`Notion update result for ${targetCoordinate}:`, result);

    // If we have a source document, update it with the Notion reference
    if (sourceDocumentId) {
      try {
        const sourceDocument = await Document.findById(sourceDocumentId);
        if (sourceDocument) {
          sourceDocument.metadata.notionReference = {
            updated: true,
            updateDate: new Date(),
            notionPageId: result.notionPageId || null,
            status: 'synced'
          };
          await sourceDocument.save();
        }
      } catch (docError) {
        console.error(`Error updating source document ${sourceDocumentId}:`, docError);
        // Continue even if this fails
      }
    }

    return {
      success: true,
      notionPageId: result.notionPageId,
      url: result.url,
      targetCoordinate
    };
  } catch (error) {
    console.error('Error executing Notion proposal:', error);
    throw error;
  }
};

/**
 * Get crystallizations for a document
 * @param {string} originalDocumentId - ID of the original document
 * @returns {Promise<Array>} - Array of crystallization documents
 */
export const getCrystallizationsForDocument = async (originalDocumentId) => {
  try {
    // Validate required parameter
    if (!originalDocumentId) {
      throw new Error('Missing required parameter: originalDocumentId');
    }

    // Find all crystallizations for the original document
    const crystallizations = await Document.find({
      'metadata.originalDocumentId': originalDocumentId,
      documentType: 'pratibimba' // Use 'pratibimba' instead of 'crystallization'
    }).sort({ 'metadata.crystallizationDate': -1 });

    return crystallizations;
  } catch (error) {
    console.error('Error getting crystallizations for document:', error);
    throw error;
  }
};

export default {
  createCrystallization,
  updateNotionWithCrystallization,
  executeNotionProposal,
  getCrystallizationsForDocument
};
