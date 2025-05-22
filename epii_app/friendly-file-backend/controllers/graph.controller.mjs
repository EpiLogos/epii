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

// Add other graph-related controller functions here if needed
