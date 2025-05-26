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
import Document from '../models/Document.model.mjs';
import bpMCPService from './bpMCPService.mjs';
import fetch from 'node-fetch';
import { NotionPropertyMappings } from '../schemas/bimba.schema.mjs';

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
        status: 'draft'
      }
    };

    // Call the bpMCPService to store the document in the pratibimbaDocuments collection
    const result = await bpMCPService.callTool('storeDocument', {
      document: crystallizationData,
      collection: 'pratibimbaDocuments' // Explicitly specify the collection name
    });

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
    let { // Use let for content as it might be modified by relation notes
      targetCoordinate,
      title: payloadTitle, // Renamed to avoid conflict with title property in NotionPropertyMappings
      properties: payloadProperties = {},
      contentBlocks = [],
      content, // Legacy field for backward compatibility, potentially modified.
      analysisResults,
      relatedCoordinates = [], // Not directly used unless mapped via a property
      // tags = [], // Not directly used unless mapped via a property
      contentType: payloadContentType = "Crystallization", // Allow override from payload
      status: payloadStatus = "1" // Allow override from payload
    } = notionUpdatePayload;

    if (!targetCoordinate) {
      throw new Error('Notion update payload must include targetCoordinate');
    }

    // Ensure content is mutable and initialized if needed for relation notes
    let mutableContent = content || ""; 
    if (!contentBlocks.length && !mutableContent && notionUpdatePayload.analysisResults) {
        mutableContent = ""; // Initialize if no content and analysis results might add notes
    }

    const INVALID_PROPERTIES = [ // Properties to explicitly filter out
      'Analysis Status', 'Analysis Date', 'Mappings Count', 'Variations Count', 'Tags'
    ];

    let transformedProperties = {};
    let relationNotesToAppend = "";

    // Integrate analysisResults into payloadProperties for schema-aware processing
    // This assumes analysisResults keys might match Bimba property names intended for Notion.
    if (analysisResults) {
        const analysisMappings = {
            '💠 QL Operators': analysisResults.logicOperators,
            '🕸️ Semantic Framework': analysisResults.semanticFramework,
            '⚕️ Archetypal Anchors': analysisResults.symbolicAnchors,
            '📚 Epistemic Essence': analysisResults.conceptualFramework
            // Add other analysisResult fields here if they should become properties
        };
        for (const propName in analysisMappings) {
            if (analysisMappings[propName] && analysisMappings[propName].length > 0) {
                // Only set from analysisResults if not already present in payloadProperties
                if (!payloadProperties.hasOwnProperty(propName)) {
                    payloadProperties[propName] = analysisMappings[propName];
                }
            }
        }
    }

    for (const [key, rawValue] of Object.entries(payloadProperties)) {
      if (INVALID_PROPERTIES.includes(key)) {
        console.log(`Filtered out explicitly invalid property: ${key}`);
        continue;
      }

      const mapping = NotionPropertyMappings[key]; // Assumes key is the Bimba Property Name

      if (mapping) {
        const { notionType, options, multiple, format } = mapping; // format is for rich_text
        try {
          switch (notionType) {
            case 'title':
              transformedProperties[key] = { title: [{ type: 'text', text: { content: String(rawValue) } }] };
              break;
            case 'select':
              if (options && !options.includes(String(rawValue))) {
                console.warn(`Value "${rawValue}" for select property "${key}" is not in defined options: ${options.join(', ')}.`);
              }
              transformedProperties[key] = { select: { name: String(rawValue) } };
              break;
            case 'multi_select':
              if (Array.isArray(rawValue)) {
                const validValues = rawValue.map(v => {
                  if (options && !options.includes(String(v))) {
                    console.warn(`Value "${v}" for multi-select property "${key}" is not in defined options: ${options.join(', ')}.`);
                  }
                  return { name: String(v) };
                });
                transformedProperties[key] = { multi_select: validValues };
              } else {
                console.warn(`Value for multi-select property "${key}" is not an array. Received: ${typeof rawValue}. Skipping.`);
              }
              break;
            case 'number':
              const numValue = Number(rawValue);
              if (isNaN(numValue)) {
                console.warn(`Value "${rawValue}" for number property "${key}" is not a valid number. Skipping.`);
              } else {
                transformedProperties[key] = { number: numValue };
              }
              break;
            case 'date':
              try {
                transformedProperties[key] = { date: { start: new Date(rawValue).toISOString() } };
              } catch (dateError) {
                console.warn(`Value "${rawValue}" for date property "${key}" is not a valid date. Error: ${dateError.message}. Skipping.`);
              }
              break;
            case 'rich_text':
              if (format !== 'structured_list') { // Check if it's not a special structured list
                transformedProperties[key] = { rich_text: [{ type: 'text', text: { content: String(rawValue) } }] };
              } else {
                // Structured lists (like QL Operators from schema if they were rich_text) are typically
                // handled by appending to content; this path is for simple rich_text properties.
                console.log(`Property '${key}' is a 'structured_list' rich_text. This type is usually handled in content blocks or relation notes.`);
              }
              break;
            case 'relation':
              const coordinatesToResolve = Array.isArray(rawValue) ? rawValue : (rawValue ? [String(rawValue)] : []);
              
              if (coordinatesToResolve.length === 0 && multiple) {
                  transformedProperties[key] = { relation: [] };
                  break;
              }
              if (coordinatesToResolve.length === 0) {
                  if (rawValue !== null && rawValue !== undefined && String(rawValue).trim() !== "") {
                     if (!relationNotesToAppend) relationNotesToAppend = '\n\n---\n\n## Manual Action Required for Relations\nCould not automatically set the following relations:\n';
                     relationNotesToAppend += `- Relation property "${key}" was provided a value ("${rawValue}") but no valid coordinates to resolve.\n`;
                  }
                  break;
              }

              let resolvedRelationIds = [];
              let unresolvedNotesForThisKey = [];

              for (const bimbaCoordString of coordinatesToResolve) {
                if (typeof bimbaCoordString !== 'string' || bimbaCoordString.trim() === "") {
                    console.warn(`Invalid Bimba coordinate string for relation '${key}': "${bimbaCoordString}". Skipping.`);
                    unresolvedNotesForThisKey.push(`- "${key}": Invalid/empty coordinate value "${bimbaCoordString}"`);
                    continue;
                }
                try {
                    const resolved = await bpMCPService.resolveBimbaCoordinate(bimbaCoordString.trim());
                    if (resolved && resolved.notionPageId) {
                        resolvedRelationIds.push({ id: resolved.notionPageId });
                    } else {
                        console.warn(`Could not resolve Bimba coordinate "${bimbaCoordString}" for relation property "${key}".`);
                        unresolvedNotesForThisKey.push(`- "${key}": Coordinate "${bimbaCoordString}" (unresolved)`);
                    }
                } catch (resolveError) {
                    console.error(`Error resolving Bimba coordinate "${bimbaCoordString}" for property "${key}": ${resolveError.message}`);
                    unresolvedNotesForThisKey.push(`- "${key}": Coordinate "${bimbaCoordString}" (resolution error: ${resolveError.message})`);
                }
              }

              if (resolvedRelationIds.length > 0) {
                transformedProperties[key] = { relation: resolvedRelationIds };
              }
              if (unresolvedNotesForThisKey.length > 0) {
                if (!relationNotesToAppend) relationNotesToAppend = '\n\n---\n\n## Manual Action Required for Relations\nCould not automatically set the following relations:\n';
                relationNotesToAppend += unresolvedNotesForThisKey.join('\n') + '\n';
              }
              break;
            default:
              console.warn(`Unknown notionType "${mapping.notionType}" for property "${key}". Passing as raw value.`);
              transformedProperties[key] = rawValue; 
          }
        } catch (transformError) {
            console.error(`Error transforming property "${key}" with value "${JSON.stringify(rawValue)}": ${transformError.message}. Skipping.`);
        }
      } else {
        console.warn(`Property '${key}' has no defined Notion mapping. Passing as raw value.`);
        transformedProperties[key] = rawValue; // Pass raw value for Notion API to handle or error on.
      }
    }
    
    if (relationNotesToAppend) {
        if (contentBlocks.length > 0) {
            contentBlocks.push({
                object: 'block', type: 'paragraph',
                paragraph: { rich_text: [{ type: 'text', text: { content: relationNotesToAppend } }] }
            });
        } else {
            mutableContent += relationNotesToAppend;
        }
    }

    const propertiesForNotion = {
      ...transformedProperties,
      "Content Type": { select: { name: String(payloadContentType) } },
      "Status": { status: { name: String(payloadStatus) } }
    };
    
    // Determine the title for page creation.
    // If 'bimbaCoordinate' is mapped to be the Notion title property, use its value from payloadProperties.
    // Otherwise, use the payloadTitle or default to targetCoordinate.
    let pageCreationTitle = payloadTitle || `Node ${targetCoordinate}`; // Default
    if (NotionPropertyMappings.bimbaCoordinate?.notionType === 'title' && payloadProperties.bimbaCoordinate) {
        pageCreationTitle = String(payloadProperties.bimbaCoordinate);
    } else if (NotionPropertyMappings.name?.notionType === 'title' && payloadProperties.name) {
        pageCreationTitle = String(payloadProperties.name);
    }


    console.log("Final Transformed Notion properties being sent:", JSON.stringify(propertiesForNotion, null, 2));
    if (contentBlocks.length === 0 && !mutableContent.trim()) {
        console.log("Warning: No contentBlocks and mutableContent is empty. Page might be created with no content.");
    }


    let notionPageId = null;

    try {
      // Resolve the Bimba coordinate to a Notion page ID
      const resolveResult = await bpMCPService.resolveBimbaCoordinate(targetCoordinate);
      console.log(`Resolved Bimba coordinate ${targetCoordinate} to Notion page ID:`, resolveResult ? resolveResult.notionPageId : 'null');

      if (resolveResult && resolveResult.notionPageId) {
        notionPageId = resolveResult.notionPageId;
        console.log(`Existing Notion page found: ${notionPageId}. Attempting to update.`);

        // Update the page properties directly using transformed propertiesForNotion
        const updatePropertiesResponse = await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ properties: propertiesForNotion })
        });

        let propUpdateStatus = 'failed';
        if (!updatePropertiesResponse.ok) {
          const errorBody = await updatePropertiesResponse.text();
          console.error(`Failed to update properties for page ${notionPageId}: ${updatePropertiesResponse.statusText}. Body: ${errorBody}`);
        } else {
          propUpdateStatus = 'succeeded';
          console.log(`Successfully updated properties for Notion page ${notionPageId}`);
        }

        // Append content (if any)
        // The specific "Coordinate Summary" block logic is removed for broader applicability.
        let contentAppended = false;
        if (contentBlocks.length > 0) {
           await bpMCPService.appendNotionBlock(notionPageId, contentBlocks); // Assumes this service exists and works
           console.log(`Attempted to append contentBlocks to Notion page ${notionPageId}`);
           contentAppended = true;
        } else if (mutableContent && mutableContent.trim() !== "") {
            const simpleTextBlock = [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: mutableContent.trim() } }] } }];
            await bpMCPService.appendNotionBlock(notionPageId, simpleTextBlock); // Assumes this service exists and works
            console.log(`Attempted to append legacy content to Notion page ${notionPageId}`);
            contentAppended = true;
        }

        return {
          success: propUpdateStatus === 'succeeded', // Overall success might depend on property update
          notionPageId: notionPageId,
          url: `https://www.notion.so/${notionPageId.replace(/-/g, '')}`,
          targetCoordinate,
          message: `Page ${notionPageId} update attempt. Properties update ${propUpdateStatus}. Content append ${contentAppended ? 'attempted' : 'skipped (no content)'}.`
        };
      }
    } catch (error) {
      console.warn(`Error during existing page check/update for ${targetCoordinate}: ${error.message}. Proceeding to create new page.`);
    }

    // If page was not found or an error occurred in updating it, create a new page.
    console.log(`Creating new page for ${targetCoordinate} with title "${pageCreationTitle}".`);

    let crystallizeArgs;
    const currentContentToAppend = (mutableContent && mutableContent.trim() !== "") ? mutableContent : ((contentBlocks.length > 0) ? "" : "No content provided.");

    if (contentBlocks.length > 0) {
      console.log(`Using structured contentBlocks (${contentBlocks.length} blocks) for new page crystallization.`);
      crystallizeArgs = {
        targetBimbaCoordinate: targetCoordinate,
        title: pageCreationTitle,
        properties: propertiesForNotion,
        contentBlocks, // Pass the structured blocks directly
        createIfNotExists: true
      };
    } else {
      console.log(`Using legacy content approach for new page crystallization. Content to append length: ${currentContentToAppend.length}`);
      crystallizeArgs = {
        targetBimbaCoordinate: targetCoordinate,
        contentToAppend: currentContentToAppend,
        title: pageCreationTitle,
        properties: propertiesForNotion,
        createIfNotExists: true,
        contentFormat: 'markdown' 
      };
    }
    
    const result = await bpMCPService.crystallizeToNotion(crystallizeArgs);

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
