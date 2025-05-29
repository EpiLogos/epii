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
  // If parentCoordinate is provided, suggestedRelationType is also expected.
  if (parentCoordinate && !suggestedRelationType) {
    return res.status(400).json({ message: 'Suggested relation type is required when parentCoordinate is provided' });
  }

  let creationQuery;
  const queryParams = { nodeProperties }; 

  if (parentCoordinate) {
    // Ensure suggestedRelationType is a string and does not contain problematic characters
    // For now, we assume it's a safe, system-defined value like 'HAS_INTERNAL_COMPONENT'
    // If it could be arbitrary, further sanitization or different query construction would be needed.
    const safeRelationType = String(suggestedRelationType).replace(/[^a-zA-Z0-9_]/g, '');
    if (!safeRelationType) {
        // Fallback or error if relation type becomes empty after sanitization
        console.error('Error: Invalid or empty suggestedRelationType after sanitization.');
        return res.status(400).json({ message: 'Invalid suggested relation type.' });
    }

    // TODO: Revisit this query and its return structure pending BPMCP refinements for updateBimbaGraph 
    // to better handle atomic node and relationship creation confirmation.
    // Current attempt simplifies RETURN to see if tool provides basic created node data.
    creationQuery = `
      CREATE (newNode:BimbaNode $nodeProperties)
      WITH newNode
      OPTIONAL MATCH (parent:BimbaNode {bimbaCoordinate: $parentCoordinate})
      WITH newNode, parent // Carry parent over (it's null if not found by OPTIONAL MATCH)
      FOREACH (_ IN CASE WHEN parent IS NOT NULL THEN [1] ELSE [] END |
        CREATE (parent)-[r_actual:${safeRelationType}]->(newNode)
        SET r_actual.createdAt = datetime()
      )
      WITH newNode, parent // Critical WITH clause
      // The OPTIONAL MATCH for r_check is removed for this test, as we are simplifying the RETURN.
      // If parent was found and FOREACH ran, the relationship should be created.
      // We are now testing if updateBimbaGraph returns at least newNode.
      RETURN newNode
    `;
    // queryParams already includes nodeProperties. parentCoordinate is used in the query directly.
    queryParams.parentCoordinate = parentCoordinate; // Still needed for the OPTIONAL MATCH and the re-match
  } else {
    creationQuery = `
      CREATE (newNode:BimbaNode $nodeProperties)
      RETURN newNode
    `;
  }

  console.log('[handleCreateNode] Attempting to create node.');
  console.log('[handleCreateNode] Received nodeProperties:', JSON.stringify(nodeProperties, null, 2));
  console.log('[handleCreateNode] Received parentCoordinate:', parentCoordinate);
  console.log('[handleCreateNode] Received suggestedRelationType:', suggestedRelationType);
  console.log('[handleCreateNode] Constructed Cypher Query:', creationQuery);
  console.log('[handleCreateNode] Query Parameters:', JSON.stringify(queryParams, null, 2));

  try {
    const result = await bpMCPService.callTool('updateBimbaGraph', {
      query: creationQuery,
      params: queryParams,
    });

    console.log('[handleCreateNode] Raw result from bpMCPService.callTool("updateBimbaGraph"):', JSON.stringify(result, null, 2));
    
    if (result && Array.isArray(result) && result.length > 0) {
        const record = result[0]; // Assuming the first record is most relevant
        console.log(`[handleCreateNode] Successfully processed updateBimbaGraph. Records returned: ${result.length}`);
        if (record) {
            console.log(`[handleCreateNode] Record details: newNode present: ${!!record.newNode}, parent present: ${!!record.parent}, relationship present: ${!!record.r}`);
            if (parentCoordinate && (!record.parent || !record.r)) {
                console.warn(`[handleCreateNode] WARNING: Node ${nodeProperties.bimbaCoordinate} created, but parent match or relationship creation might have failed. ParentCoordinate specified: ${parentCoordinate}. Check if parent exists and matches, or if relationship 'r' was returned as null.`);
            } else if (parentCoordinate && record.parent && record.r) {
                console.log(`[handleCreateNode] Successfully created node AND relationship to parent ${parentCoordinate}.`);
            } else if (record.newNode) { // newNode should always be present
                 console.log(`[handleCreateNode] Successfully created node ${nodeProperties.bimbaCoordinate} (no parent specified, or parent not found, or relationship not created).`);
            } else {
                 console.warn('[handleCreateNode] Node creation might have failed as newNode is not present in the result.');
            }
        } else {
            console.warn('[handleCreateNode] updateBimbaGraph returned an array with null/undefined records.');
        }
    } else if (result && typeof result === 'object' && Object.keys(result).length === 0 && result.constructor === Object) {
        // Specifically check for an empty object {} which might indicate issues if data was expected.
        console.warn('[handleCreateNode] updateBimbaGraph returned an empty object. This might indicate the write operation did not return data or did not perform as expected (e.g., parent not found for relationship). Query was:', creationQuery);
    } else if (result) {
        console.log('[handleCreateNode] updateBimbaGraph processed. Result (not an array, or not an empty object):', JSON.stringify(result, null, 2));
    } else {
        console.warn('[handleCreateNode] updateBimbaGraph call returned undefined or null result.');
    }

    res.status(201).json({ message: 'Node created successfully (or creation process initiated)', data: result });
  } catch (error) {
    console.error(`[handleCreateNode] Error creating node ${nodeProperties.bimbaCoordinate}:`, error.message);
    // Log the full error object if it might contain more details like a stack trace
    console.error('[handleCreateNode] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ message: 'Failed to create node', error: error.message });
  }
};

// Add other graph-related controller functions here if needed
