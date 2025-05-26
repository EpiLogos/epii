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

export const handleSuggestRelationshipType = async (req, res) => {
  const { parentCoordinate } = req.params;
  if (!parentCoordinate) {
    return res.status(400).json({ message: 'Parent coordinate is required' });
  }

  const cypherQuery = `
    MATCH (parent {bimbaCoordinate: $parentCoordinate})-[r]->(child)
    RETURN type(r) as relType, count(*) as frequency
    ORDER BY frequency DESC
    LIMIT 3
  `;

  try {
    console.log(`Suggesting relationship type for parent: ${parentCoordinate}`);
    const result = await bpMCPService.callTool('queryBimbaGraph', {
      query: cypherQuery,
      params: { parentCoordinate },
    });

    // Assuming result is an array of records, e.g., [{ relType: 'CONTAINS', frequency: 5 }, ...]
    // Or it might be structured differently by bpMCPService, adjust parsing as needed.
    let suggestions = [];
    if (result && Array.isArray(result) && result.length > 0) {
       // Attempt to access the actual data if nested, e.g. result[0].data if that's how bpMCPService returns it
       // This part is speculative based on queryBimbaGraph's existing parsing in getFoundationalGraph
        let rawSuggestions = result;
        if (result[0] && result[0].data) { // Placeholder for actual result structure
            rawSuggestions = result[0].data;
        } else if (result[0] && Array.isArray(result[0])) { // Another common pattern
            rawSuggestions = result[0];
        }
        
        suggestions = rawSuggestions.map(record => record.relType);
    }
    
    if (suggestions.length === 0) {
        suggestions.push('CONTAINS'); // Default fallback
    }

    console.log(`Suggested types for ${parentCoordinate}: ${suggestions.join(', ')}`);
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error(`Error suggesting relationship type for ${parentCoordinate}:`, error);
    res.status(500).json({ message: 'Failed to suggest relationship type', error: error.message });
  }
};

export const handleCreateNode = async (req, res) => {
  const { nodeProperties, parentCoordinate, suggestedRelationType } = req.body;

  if (!nodeProperties || !nodeProperties.bimbaCoordinate) {
    return res.status(400).json({ message: 'Node properties with bimbaCoordinate are required' });
  }
  if (parentCoordinate && !suggestedRelationType) {
    return res.status(400).json({ message: 'Suggested relation type is required when parentCoordinate is provided' });
  }

  let creationQuery;
  const queryParams = { nodeProperties };

  if (parentCoordinate) {
    creationQuery = `
      CREATE (newNode:BimbaNode $nodeProperties)
      WITH newNode
      MATCH (parent:BimbaNode {bimbaCoordinate: $parentCoordinate})
      CREATE (parent)-[r:${suggestedRelationType}]->(newNode)
      SET r.createdAt = datetime()
      RETURN newNode, parent, r
    `;
    queryParams.parentCoordinate = parentCoordinate;
    // Note: suggestedRelationType is directly embedded in the query string.
    // This is generally safe if suggestedRelationType comes from a controlled list (e.g., our suggestions).
    // If it were user-input directly, it would be a security risk (Cypher injection).
  } else {
    creationQuery = `
      CREATE (newNode:BimbaNode $nodeProperties)
      RETURN newNode
    `;
  }

  try {
    console.log(`Creating node with coordinate: ${nodeProperties.bimbaCoordinate}`);
    // IMPORTANT ASSUMPTION: updateBimbaGraph tool accepts a 'query' and 'params' argument,
    // similar to queryBimbaGraph. This might need adjustment if the tool expects a different structure.
    const result = await bpMCPService.callTool('updateBimbaGraph', {
      query: creationQuery,
      params: queryParams,
    });

    // Assuming result contains the created node data.
    // The structure of 'result' from updateBimbaGraph might need specific parsing.
    // For now, we'll return the raw result, assuming it's meaningful.
    console.log(`Node creation result for ${nodeProperties.bimbaCoordinate}:`, result);
    res.status(201).json({ message: 'Node created successfully', data: result });
  } catch (error) {
    console.error(`Error creating node ${nodeProperties.bimbaCoordinate}:`, error);
    res.status(500).json({ message: 'Failed to create node', error: error.message });
  }
};

// Add other graph-related controller functions here if needed
