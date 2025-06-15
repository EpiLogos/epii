import bpMCPService from '../../bpmcp/bpMCP.service.mjs'; // Adjust path if needed

/**
 * Controller to fetch node details and associated documents.
 * Uses the listDocumentsByCoordinate tool directly.
 */
export const getNodeDetails = async (req, res) => {
  const { bimbaCoordinate } = req.params;

  if (!bimbaCoordinate) {
    return res.status(400).json({ error: 'Bimba coordinate parameter is required.' });
  }

  try {
    console.log(`Fetching documents for coordinate: ${bimbaCoordinate}`);

    // Use the listDocumentsByCoordinate tool directly
    const documents = await bpMCPService.listDocumentsByCoordinate(bimbaCoordinate);

    // Create a node details structure with the documents
    const nodeDetails = {
      bimbaCoordinate: bimbaCoordinate,
      targetNodeProperties: {
        title: bimbaCoordinate,
        name: bimbaCoordinate,
        description: `Documents for ${bimbaCoordinate}`
      },
      documents: documents || []
    };

    // If we have a document with a notionPageId, add it to the node details
    if (documents && documents.length > 0) {
      const docWithNotionId = documents.find(doc => doc.notionPageId);
      if (docWithNotionId) {
        nodeDetails.targetNodeProperties.notionPageId = docWithNotionId.notionPageId;
      }
    }

    console.log(`Successfully fetched ${documents ? documents.length : 0} documents for coordinate: ${bimbaCoordinate}`);
    return res.json(nodeDetails);
  } catch (error) {
    console.error(`Error fetching documents for ${bimbaCoordinate}:`, error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to fetch node details due to an internal server error.';
    res.status(statusCode).json({ error: message });
  }
};
