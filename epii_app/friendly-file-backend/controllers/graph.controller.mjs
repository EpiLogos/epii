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

  // Simplified approach: Create node first, then handle relationship separately
  // ALWAYS add VectorNode label for vector indexing compatibility
  const creationQuery = `
    CREATE (newNode:VectorNode $nodeProperties)
    RETURN newNode
  `;
  const queryParams = { nodeProperties };

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

    // Handle both old and new response formats from updateBimbaGraph
    let parsedResult = null;

    // Check if it's the new format (direct object with success, recordCount, records)
    if (result && typeof result === 'object' && result.success !== undefined) {
      parsedResult = result;
    }
    // Check if it's the old format (content array with text)
    else if (result && result.content && result.content[0] && result.content[0].text) {
      try {
        parsedResult = JSON.parse(result.content[0].text);
      } catch (parseError) {
        console.error('[handleCreateNode] Failed to parse updateBimbaGraph response:', parseError);
      }
    }

    if (parsedResult && parsedResult.success && parsedResult.records && parsedResult.records.length > 0) {
        const record = parsedResult.records[0]; // First record contains our results
        console.log(`[handleCreateNode] ✅ Successfully created node. Records returned: ${parsedResult.recordCount}`);

        if (!record.newNode) {
          console.error('[handleCreateNode] ❌ CRITICAL: Node creation failed - newNode not present in result.');
          return res.status(500).json({ message: 'Node creation failed' });
        }

        console.log(`[handleCreateNode] ✅ Node ${nodeProperties.bimbaCoordinate} created successfully.`);

        // Now handle relationship creation if parent coordinate is provided
        if (parentCoordinate && suggestedRelationType) {
          console.log(`[handleCreateNode] Creating relationship to parent ${parentCoordinate}...`);

          try {
            // First, find the parent node and get its raw Neo4j ID for safety
            console.log(`[handleCreateNode] Looking up parent node ${parentCoordinate} to get its ID...`);
            const parentLookupResult = await bpMCPService.callTool('queryBimbaGraph', {
              query: 'MATCH (parent {bimbaCoordinate: $parentCoord}) RETURN parent, toString(id(parent)) as parentId',
              params: { parentCoord: parentCoordinate }
            });

            console.log('[handleCreateNode] Parent lookup result:', JSON.stringify(parentLookupResult, null, 2));

            // Check if parent was found
            if (!parentLookupResult || !parentLookupResult.processedRecords || parentLookupResult.processedRecords.length === 0) {
              console.error(`[handleCreateNode] ❌ Parent node ${parentCoordinate} not found in database!`);
              console.warn(`[handleCreateNode] ⚠️ WARNING: Node created but parent ${parentCoordinate} doesn't exist for relationship creation.`);
              return;
            }

            const parentRecord = parentLookupResult.processedRecords[0];
            const parentId = parentRecord.parentId;
            console.log(`[handleCreateNode] ✅ Found parent node ${parentCoordinate} with ID: ${parentId}`);

            // Now create the relationship using raw Neo4j IDs for maximum safety
            // No label assumptions - match any node with the given properties/IDs
            const relationshipQuery = `
              MATCH (parent), (target {bimbaCoordinate: $targetCoord})
              WHERE toString(id(parent)) = $parentId
              CREATE (parent)-[r:${suggestedRelationType}]->(target)
              SET r += $relProperties
              SET r.createdAt = datetime()
              RETURN parent, target, r,
                     true as parentFound,
                     true as targetFound,
                     true as relationshipCreated
            `;

            const relationshipResult = await bpMCPService.callTool('updateBimbaGraph', {
              query: relationshipQuery,
              params: {
                parentId: parentId,
                targetCoord: nodeProperties.bimbaCoordinate,
                relProperties: {
                  createdAt: new Date().toISOString()
                }
              }
            });

            console.log('[handleCreateNode] Relationship creation result:', JSON.stringify(relationshipResult, null, 2));

            if (relationshipResult && relationshipResult.success && relationshipResult.recordCount > 0) {
              console.log(`[handleCreateNode] ✅ Successfully created relationship ${parentCoordinate} (ID: ${parentId}) -[${suggestedRelationType}]-> ${nodeProperties.bimbaCoordinate}`);
            } else {
              console.warn(`[handleCreateNode] ⚠️ WARNING: Node created but relationship creation may have failed.`);
            }
          } catch (relationshipError) {
            console.error('[handleCreateNode] Error creating relationship:', relationshipError);
            console.warn(`[handleCreateNode] ⚠️ WARNING: Node created but relationship creation failed: ${relationshipError.message}`);
          }
        }
    } else if (parsedResult && !parsedResult.success) {
        console.error('[handleCreateNode] ❌ updateBimbaGraph reported failure:', parsedResult);
        return res.status(500).json({ message: 'Node creation failed', error: parsedResult });
    } else {
        console.warn('[handleCreateNode] ⚠️ updateBimbaGraph returned unexpected result format:', result);
        return res.status(500).json({ message: 'Node creation returned unexpected format' });
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
