import bpMCPService from '../services/bpMCPService.mjs'; // Corrected: Import default export

// Cypher query to fetch foundational nodes and their relationships
const getGraphQuery = (depth = 1) => `
  // Fetch all nodes and relationships
  MATCH (n)
  OPTIONAL MATCH (n)-[r]->(m)
  WITH COLLECT(DISTINCT n {
    name: n.name,
    bimbaCoordinate: n.bimbaCoordinate,
    id: toString(id(n)),
    labels: labels(n)
  }) AS nodesData,
  COLLECT(DISTINCT r {
    id: toString(id(r)),
    source: toString(id(startNode(r))),
    target: toString(id(endNode(r))),
    type: type(r)
  }) AS linksData
  RETURN { nodes: nodesData, links: linksData } AS graphData
`;

export const getFoundationalGraph = async (req, res) => {
  console.log("Attempting to fetch foundational graph data...");
  try {
    // The WebSocket connection state is managed internally by bpWebSocketClient.mjs
    // We'll rely on the callTool function to handle connection issues.
    // if (!bpMCPService) { // Check if the service instance exists
    //   throw new Error('Bimba-Pratibimba MCP service is not available.');
    // }

    // Use the service instance's convenience method or the generic callTool
    // Using the convenience method:
    // const result = await bpMCPService.queryBimbaGraph(foundationalGraphQuery, {}); 
    
    // Using the generic callTool (as originally intended, assuming it handles connection):
    const depth = parseInt(req.query.depth) || 1;
    const query = getGraphQuery(depth);
    
    const result = await bpMCPService.callTool('queryBimbaGraph', {
      query: query,
      params: {}
    });

    console.log("Raw result from queryBimbaGraph:", result);

    // The tool likely returns a stringified JSON or the direct result.
    // Adjust parsing based on the actual tool output structure.
    let graphData = result; 
    if (typeof result === 'string') {
        try {
            graphData = JSON.parse(result);
        } catch (parseError) {
            console.error("Failed to parse graph data string:", parseError);
            // Attempt to handle cases where the tool might return the nested object directly
            if (result && typeof result === 'object' && result.graphData) {
              graphData = result.graphData;
            } else {
              throw new Error('Received non-JSON string or unexpected structure from queryBimbaGraph tool.');
            }
        }
    }

    // Extract graph data from the array response
    const finalData = graphData[0]?.graphData || graphData;

    if (!finalData || !Array.isArray(finalData.nodes) || !Array.isArray(finalData.links)) {
         console.error("Invalid graph data structure received:", finalData);
         throw new Error('Invalid graph data structure received from query.');
    }
    
    console.log(`Found ${finalData.nodes.length} nodes and ${finalData.links.length} links.`);
    res.status(200).json(finalData);

  } catch (error) {
    console.error('Error fetching foundational graph:', error);
    res.status(500).json({ message: 'Failed to fetch foundational graph data', error: error.message });
  }
};

export const createNode = async (req, res) => {
  try {
    const {
      bimbaCoordinate,
      parentCoordinate,
      relationshipType,
      nodeName,
      qlPosition, // Optional, might be undefined
      additionalProperties // Optional, might be undefined
    } = req.body;

    // Basic validation
    if (!bimbaCoordinate || !parentCoordinate || !relationshipType || !nodeName) {
      return res.status(400).json({ error: 'Missing required fields: bimbaCoordinate, parentCoordinate, relationshipType, nodeName are required.' });
    }

    // Further validation: Ensure parentCoordinate is not the same as bimbaCoordinate
    if (bimbaCoordinate === parentCoordinate) {
        return res.status(400).json({ error: 'Node coordinate cannot be the same as its parent coordinate.' });
    }
    
    // Optional: Validate bimbaCoordinate format if desired at controller level too
    // const coordinateRegex = /^#([a-zA-Z0-9_]+(-[a-zA-Z0-9_]+)*)?$/;
    // if (!coordinateRegex.test(bimbaCoordinate)) {
    //    return res.status(400).json({ error: 'Invalid Bimba coordinate format.' });
    // }

    // The service `createNodeInBimbaGraph` returns an array of Neo4j records.
    const serviceResult = await bpmcpService.createNodeInBimbaGraph({
      bimbaCoordinate,
      parentCoordinate,
      relationshipType,
      nodeName,
      qlPosition: qlPosition !== undefined ? qlPosition : null, // Ensure qlPosition is null if not provided
      additionalProperties: additionalProperties || {} // Default to empty object
    });

    // The service returns the direct result from the Neo4j driver, which is an array of records.
    // The query was: RETURN n AS createdNode, id(n) AS nodeId, p.bimbaCoordinate AS parentBimbaCoordinate, type(rel) AS relationshipTypeCreated
    // The prompt uses result.records.length, but the service method createNodeInBimbaGraph returns the array directly.
    if (serviceResult && Array.isArray(serviceResult) && serviceResult.length > 0) {
        const record = serviceResult[0]; // Get the first record
        
        // Access fields using .get() for Neo4j record objects
        const createdNodeData = record.get('createdNode');
        const nodeId = record.get('nodeId'); // Neo4j Integer object
        const parentCoord = record.get('parentBimbaCoordinate');
        const relType = record.get('relationshipTypeCreated');

        res.status(201).json({ 
            message: 'Node created successfully', 
            data: {
                ...createdNodeData.properties, // Spread node properties
                id: nodeId.toString(), // Convert Neo4j Integer to string
                parentCoordinate: parentCoord,
                relationshipType: relType
            }
        });
    } else {
        // This case implies the parent node was not found, as the MATCH query in the service would yield no path.
        // The service method `createNodeInBimbaGraph` currently logs a warning if result is empty and returns that empty result.
        // This condition is the primary way to detect it if the service doesn't throw.
        console.error('Node creation failed, possibly parent not found. Service returned empty result or null.', { parentCoordinate });
        res.status(404).json({ error: `Node creation failed. Parent node with coordinate ${parentCoordinate} may not exist.` });
    }

  } catch (error) {
    console.error('Error in createNode controller:', error.message, error.stack); // Log stack for more details
    
    // Customize error response based on error type if possible
    // The service's createNodeInBimbaGraph can throw an error for missing params or DB connection issues.
    // The prompt suggests the service throws "Parent node not found". If so, this will be caught.
    if (error.message.includes('Parent node not found') || error.message.includes("empty result") || (error.message.toLowerCase().includes('parent node') && error.message.toLowerCase().includes('not exist'))) {
      return res.status(404).json({ error: `Parent node not found with coordinate: ${req.body.parentCoordinate}. Details: ${error.message}` });
    }
    // Check for Neo4j unique constraint violation (e.g., if bimbaCoordinate is unique)
    if (error.message.toLowerCase().includes('already exists') || (error.neo4jError && error.neo4jError.code === 'Neo.ClientError.Schema.ConstraintValidationFailed')) {
        return res.status(409).json({ error: `Node with coordinate ${req.body.bimbaCoordinate} already exists. Details: ${error.message}` });
    }
    // General error
    res.status(500).json({ error: 'Server error during node creation.', details: error.message });
  }
};

export const getRelationshipSuggestions = async (req, res) => {
  try {
    const { parentCoordinate } = req.query;

    if (!parentCoordinate) {
      return res.status(400).json({ error: 'Missing required query parameter: parentCoordinate.' });
    }

    const suggestions = await bpmcpService.getHarmoniousRelationships(parentCoordinate);
    
    // The service method getHarmoniousRelationships returns an array of strings.
    // If the parent node doesn't exist or has no outgoing relationships, it returns an empty array.
    res.status(200).json(suggestions);

  } catch (error) {
    console.error('Error in getRelationshipSuggestions controller:', error.message, error.stack);
    // Check if the error is due to "parentCoordinate is required" from the service itself (though controller already checks)
    if (error.message.toLowerCase().includes('parentcoordinate is required')) {
        return res.status(400).json({ error: error.message });
    }
    // Other errors are likely server-side
    res.status(500).json({ error: 'Server error while fetching relationship suggestions.', details: error.message });
  }
};
export { getFoundationalGraph, createNode, getRelationshipSuggestions };
