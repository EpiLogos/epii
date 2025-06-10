/**
 * Utility functions for working with graphData in the Epii Analysis Pipeline.
 * These functions provide a consistent interface for accessing and manipulating
 * graph data, with proper validation and error handling.
 */

import bpMCPService from '../services/bpMCPService.mjs';

/**
 * Validates graphData structure and provides default values if needed.
 *
 * @param {object} graphData - The graph data to validate
 * @returns {object} - Validated graphData with default values for missing properties
 */
export function validateGraphData(graphData = {}) {
    // Ensure graphData has nodes and edges arrays
    const validatedData = {
        nodes: Array.isArray(graphData.nodes) ? graphData.nodes : [],
        // Support both 'edges' and 'links' property names
        edges: Array.isArray(graphData.edges) ? graphData.edges :
               (Array.isArray(graphData.links) ? graphData.links : [])
    };

    return validatedData;
}

/**
 * Gets a node by its ID with proper error handling.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @param {string} nodeId - The ID of the node to retrieve
 * @returns {object|null} - The node with the specified ID, or null if not found
 */
export function getNodeById(graphData, nodeId) {
    const { nodes } = validateGraphData(graphData);

    if (!nodeId) return null;

    return nodes.find(node => node.id === nodeId) || null;
}

/**
 * Gets a node by its Bimba coordinate with proper error handling.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @param {string} coordinate - The Bimba coordinate of the node to retrieve
 * @returns {object|null} - The node with the specified coordinate, or null if not found
 */
export function getNodeByCoordinate(graphData, coordinate) {
    const { nodes } = validateGraphData(graphData);

    if (!coordinate) return null;

    return nodes.find(node =>
        node.bimbaCoordinate === coordinate ||
        (node.properties && node.properties.coordinate === coordinate)
    ) || null;
}

/**
 * Gets the name of a node with fallbacks.
 *
 * @param {object} node - The node to get the name from
 * @returns {string} - The name of the node, or 'Unnamed Node' if not found
 */
export function getNodeName(node) {
    if (!node) return 'Unnamed Node';

    return node.name || node.title || node.label || 'Unnamed Node';
}

/**
 * Gets the description of a node with fallbacks.
 *
 * @param {object} node - The node to get the description from
 * @returns {string} - The description of the node, or an empty string if not found
 */
export function getNodeDescription(node) {
    if (!node) return '';

    return node.description || '';
}

/**
 * Gets all relationships for a node.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @param {string} nodeId - The ID of the node to get relationships for
 * @returns {Array<{relationship: string, direction: string, node: object}>} - Array of relationships
 */
export function getNodeRelationships(graphData, nodeId) {
    const { nodes, edges } = validateGraphData(graphData);

    if (!nodeId) return [];

    const connections = [];

    // Process edges to find connections
    for (const edge of edges) {
        const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
        const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

        // If this edge connects to our target node
        if (sourceId === nodeId || targetId === nodeId) {
            // Determine if this is incoming or outgoing
            const direction = sourceId === nodeId ? 'outgoing' : 'incoming';

            // Find the connected node
            const connectedNodeId = direction === 'outgoing' ? targetId : sourceId;
            const connectedNode = getNodeById(graphData, connectedNodeId);

            if (connectedNode) {
                connections.push({
                    relationship: edge.type || 'CONNECTED_TO',
                    direction,
                    node: connectedNode
                });
            }
        }
    }

    return connections;
}

/**
 * Gets the parent coordinate of a given coordinate.
 *
 * @param {string} coordinate - The coordinate to get the parent of
 * @returns {string|null} - The parent coordinate, or null if no parent
 */
export function getParentCoordinate(coordinate) {
    // If the coordinate is just "#", it has no parent
    if (!coordinate || coordinate === '#') return null;

    // Split the coordinate by "-"
    const parts = coordinate.split('-');

    // If there's only one part (e.g., "#5"), the parent is "#"
    if (parts.length === 1) return '#';

    // Otherwise, remove the last part and join the rest
    return parts.slice(0, -1).join('-');
}

/**
 * Checks if a coordinate is a child of another coordinate.
 *
 * @param {string} childCoord - The potential child coordinate
 * @param {string} parentCoord - The potential parent coordinate
 * @returns {boolean} - True if childCoord is a direct child of parentCoord
 */
export function isChildCoordinate(childCoord, parentCoord) {
    // If either coordinate is not provided, return false
    if (!childCoord || !parentCoord) return false;

    // If childCoord is the same as parentCoord, it's not a child
    if (childCoord === parentCoord) return false;

    // Check if childCoord starts with parentCoord and has exactly one more segment
    const parentParts = parentCoord.split('-');
    const childParts = childCoord.split('-');

    return childCoord.startsWith(parentCoord + '-') && childParts.length === parentParts.length + 1;
}

/**
 * Gets all child coordinates of a given coordinate.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @param {string} coordinate - The coordinate to get children for
 * @returns {Array<string>} - Array of child coordinates
 */
export function getChildCoordinates(graphData, coordinate) {
    const { nodes } = validateGraphData(graphData);

    if (!coordinate) return [];

    // Find all nodes that are children of the given coordinate
    const childNodes = nodes.filter(node => {
        // Get the node's coordinate from either bimbaCoordinate or properties.coordinate
        const nodeCoordinate = node.bimbaCoordinate ||
                              (node.properties && node.properties.coordinate) ||
                              null;

        return nodeCoordinate && isChildCoordinate(nodeCoordinate, coordinate);
    });

    // Return the coordinates, handling both formats
    return childNodes.map(node =>
        node.bimbaCoordinate ||
        (node.properties && node.properties.coordinate)
    );
}

/**
 * Gets all sibling coordinates of a given coordinate.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @param {string} coordinate - The coordinate to get siblings for
 * @returns {Array<string>} - Array of sibling coordinates
 */
export function getSiblingCoordinates(graphData, coordinate) {
    const { nodes } = validateGraphData(graphData);

    if (!coordinate) return [];

    // Get the parent coordinate
    const parentCoord = getParentCoordinate(coordinate);

    if (!parentCoord) return [];

    // Find all nodes that are children of the parent coordinate (siblings of the given coordinate)
    const siblingNodes = nodes.filter(node => {
        // Get the node's coordinate from either bimbaCoordinate or properties.coordinate
        const nodeCoordinate = node.bimbaCoordinate ||
                              (node.properties && node.properties.coordinate) ||
                              null;

        return nodeCoordinate &&
               nodeCoordinate !== coordinate &&
               getParentCoordinate(nodeCoordinate) === parentCoord;
    });

    // Return the coordinates, handling both formats
    return siblingNodes.map(node =>
        node.bimbaCoordinate ||
        (node.properties && node.properties.coordinate)
    );
}

/**
 * Gets Bimba context for a coordinate from graphData.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @param {string} coordinate - The Bimba coordinate to get context for
 * @returns {Array} - The Bimba context with node and connections
 */
export function getBimbaContextFromGraphData(graphData, coordinate) {
    const validatedData = validateGraphData(graphData);

    // Find the target node
    const targetNode = getNodeByCoordinate(validatedData, coordinate);

    if (!targetNode) {
        return [];
    }

    // Get all connections to/from this node
    const connections = getNodeRelationships(validatedData, targetNode.id);

    // Format the result to match the Neo4j query result format
    return [{
        node: targetNode,
        connections
    }];
}



/**
 * Builds the Bimba hierarchy from graphData.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - The Bimba hierarchy structure
 */
export function getBimbaHierarchy(graphData) {
    const { nodes } = validateGraphData(graphData);

    const structure = {};

    // Build hierarchical structure
    for (const node of nodes) {
        // Get coordinate from either bimbaCoordinate or properties.coordinate
        const coordinate = node.bimbaCoordinate ||
                          (node.properties && node.properties.coordinate) ||
                          null;

        if (coordinate) {
            const parts = coordinate.split('-');

            // Build hierarchical structure
            let current = structure;
            let currentPath = '';

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                // Handle the '#' prefix in the first part
                const cleanPart = i === 0 ? part.replace('#', '') : part;
                currentPath = currentPath ? `${currentPath}-${cleanPart}` : (i === 0 ? '#' + cleanPart : cleanPart);

                if (!current[cleanPart]) {
                    current[cleanPart] = {
                        coordinate: currentPath,
                        name: getNodeName(node),
                        description: getNodeDescription(node),
                        children: {}
                    };
                }

                // Only store the node at its exact coordinate level, not at parent levels
                if (i === parts.length - 1) {
                    current[cleanPart].node = {
                        id: node.id,
                        name: getNodeName(node),
                        description: getNodeDescription(node),
                        type: node.labels ? node.labels.join(', ') : 'Unknown'
                    };
                }

                current = current[cleanPart].children;
            }
        }
    }

    return structure;
}

/**
 * Gets the full Bimba map from graphData.
 * This is a critical function that transforms graphData into the standardized bimbaMap format
 * used throughout the pipeline. It ensures that no graphData leaks through the pipeline.
 *
 * SIMPLIFIED VERSION: Includes ALL nodes regardless of whether they have coordinates.
 * Nodes without coordinates will be positioned near their parent nodes in the visualization.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - The full Bimba map with hierarchical structure
 * @throws {Error} - If graphData is invalid or cannot be transformed
 */
export function getFullBimbaMapFromGraphData(graphData) {
    if (!graphData) {
        throw new Error("Cannot transform null or undefined graphData to bimbaMap");
    }

    console.log(`Transforming graphData to bimbaMap (${graphData.nodes?.length || 0} nodes, ${graphData.edges?.length || graphData.links?.length || 0} edges/links)`);

    try {
        // Validate the graphData structure
        const validatedData = validateGraphData(graphData);

        if (validatedData.nodes.length === 0) {
            console.warn("GraphData contains no nodes, creating empty bimbaMap");
            return {
                nodes: [],
                relationships: [],
                structure: {},
                summary: {
                    totalNodes: 0,
                    totalRelationships: 0,
                    rootNodes: []
                }
            };
        }

        // Create a flattened structure optimized for LLM consumption
        // INCLUDE ALL NODES regardless of whether they have coordinates
        const nodes = validatedData.nodes.map(node => {
            const coordinate = node.bimbaCoordinate ||
                              (node.properties && node.properties.coordinate) ||
                              null;

            // Log nodes without coordinates but don't exclude them
            if (!coordinate) {
                console.log(`Node ${node.id} has no coordinate but will be included in bimbaMap`);
            }

            return {
                id: node.id,
                coordinate: coordinate, // Can be null
                name: getNodeName(node),
                description: getNodeDescription(node),
                type: node.labels ? node.labels.join(', ') : 'Unknown'
            };
        });

        console.log(`Transformed ${validatedData.nodes.length} graphData nodes to ${nodes.length} bimbaMap nodes`);

        // Create relationships between ALL nodes, even those without coordinates
        const relationships = validatedData.edges.map(edge => {
            const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
            const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
            const sourceNode = getNodeById(validatedData, sourceId);
            const targetNode = getNodeById(validatedData, targetId);

            if (!sourceNode || !targetNode) {
                console.warn(`Edge between ${sourceId} and ${targetId} references missing nodes, it will be excluded from bimbaMap`);
                return null;
            }

            const sourceCoordinate = sourceNode ? (sourceNode.bimbaCoordinate || (sourceNode.properties && sourceNode.properties.coordinate)) : null;
            const targetCoordinate = targetNode ? (targetNode.bimbaCoordinate || (targetNode.properties && targetNode.properties.coordinate)) : null;

            // Include relationships even if nodes don't have coordinates
            return {
                type: edge.type || 'CONNECTED_TO',
                source: {
                    id: sourceId,
                    coordinate: sourceCoordinate, // Can be null
                    name: sourceNode ? getNodeName(sourceNode) : 'Unknown'
                },
                target: {
                    id: targetId,
                    coordinate: targetCoordinate, // Can be null
                    name: targetNode ? getNodeName(targetNode) : 'Unknown'
                }
            };
        }).filter(rel => rel !== null); // Only filter out relationships with missing nodes

        console.log(`Transformed ${validatedData.edges.length} graphData edges to ${relationships.length} bimbaMap relationships`);

        // Generate the hierarchical structure (this will only include nodes with coordinates)
        const structure = getBimbaHierarchy(validatedData);

        // Find root nodes (nodes with coordinates like #, #0, #1, #2, #3, #4, #5 ONLY)
        // The "#" coordinate represents the overarching project node
        // Exclude nodes with dots (like #4.0, #4.1) as these are not root nodes
        const rootNodes = nodes
            .filter(node => {
                if (!node.coordinate) return false;

                // Must start with # and not contain dots
                if (!node.coordinate.startsWith('#') || node.coordinate.includes('.')) return false;

                // Either exact "#" or single digit after # (like #0, #1, #2, #3, #4, #5)
                const afterHash = node.coordinate.substring(1);
                return afterHash === '' || (afterHash.length === 1 && /^[0-5]$/.test(afterHash));
            })
            .map(node => ({
                coordinate: node.coordinate,
                name: node.name,
                description: node.description || ''
            }));

        // Ensure the "#" root node is always first in the list if it exists
        rootNodes.sort((a, b) => {
            if (a.coordinate === '#') return -1;
            if (b.coordinate === '#') return 1;
            return a.coordinate.localeCompare(b.coordinate);
        });

        console.log(`Found ${rootNodes.length} root nodes in bimbaMap`);

        // Extract the full Bimba map from graphData with optimized structure
        const fullBimbaMap = {
            nodes: nodes, // All nodes, with or without coordinates
            relationships: relationships, // All relationships
            structure: structure, // Hierarchical structure (only for nodes with coordinates)
            // Add a summary section for quick reference
            summary: {
                totalNodes: nodes.length,
                totalRelationships: relationships.length,
                rootNodes: rootNodes,
                nodesWithCoordinates: nodes.filter(n => n.coordinate).length,
                nodesWithoutCoordinates: nodes.filter(n => !n.coordinate).length
            }
        };

        console.log(`Successfully transformed graphData to bimbaMap with ${nodes.length} nodes (${fullBimbaMap.summary.nodesWithCoordinates} with coordinates, ${fullBimbaMap.summary.nodesWithoutCoordinates} without) and ${relationships.length} relationships`);
        return fullBimbaMap;
    } catch (error) {
        console.error(`Error transforming graphData to bimbaMap:`, error);
        throw new Error(`Failed to transform graphData to bimbaMap: ${error.message}`);
    }
}

/**
 * Gets project-level context from graphData.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - Project-level context
 */
export function getProjectContextFromGraphData(graphData) {
    const { nodes } = validateGraphData(graphData);

    // Extract project-level context from graphData
    const projectNodes = nodes.filter(node =>
        node.bimbaCoordinate &&
        node.bimbaCoordinate.startsWith('#') &&
        node.bimbaCoordinate.split('-').length === 1
    );

    // Get the root node (if any)
    const rootNode = projectNodes.find(node => node.bimbaCoordinate === '#');

    return {
        projectNodes,
        rootNode,
        projectName: rootNode ? getNodeName(rootNode) : "Epi-Logos Project",
        projectDescription: rootNode ? getNodeDescription(rootNode) : "A comprehensive framework for understanding and implementing the Epi-Logos system."
    };
}

// First declaration of getProjectContextFromBimbaMap removed to fix duplicate declaration error.
// The implementation at line ~719 is kept as it's more advanced and focuses only on the "#" root node.



/**
 * Gets a map of Bimba coordinates to their metadata from graphData.
 *
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {object} - Map of coordinates to their metadata
 */
export function getBimbaCoordinateMapFromGraphData(graphData) {
    const { nodes } = validateGraphData(graphData);

    const coordinateMap = {};

    // Process all nodes with bimbaCoordinate
    for (const node of nodes) {
        if (node.bimbaCoordinate) {
            coordinateMap[node.bimbaCoordinate] = {
                title: getNodeName(node),
                labels: node.labels || [],
                notionPageId: node.notionPageId || node.notionCoordinatePageId,
                notionBlockId: node.notionBlockId || node.notionBimbaMapBlockId
            };
        }
    }

    return coordinateMap;
}

/**
 * Gets a map of Bimba coordinates to their metadata from bimbaMap.
 * This is a replacement for getBimbaCoordinateMapFromGraphData that works with bimbaMap.
 *
 * @param {object} bimbaMap - The Bimba map with nodes and relationships
 * @returns {Promise<object>} - Map of coordinates to their metadata
 */
export async function getBimbaCoordinateMapFromBimbaMap(bimbaMap) {
    console.log(`Generating Bimba coordinate map from bimbaMap (${bimbaMap.nodes.length} nodes)`);

    if (!bimbaMap || !bimbaMap.nodes) {
        console.warn(`Invalid bimbaMap provided to getBimbaCoordinateMapFromBimbaMap`);
        return {};
    }

    try {
        const { getCachedGraphData } = await import('./cache.utils.mjs');

        // Use cached coordinate map for performance
        return getCachedGraphData(() => {
            const coordinateMap = {};

            // Process all nodes with coordinate
            for (const node of bimbaMap.nodes) {
                if (node.coordinate) {
                    coordinateMap[node.coordinate] = {
                        title: node.name || 'Unnamed Node',
                        labels: node.type ? node.type.split(', ') : [],
                        notionPageId: node.notionPageId,
                        notionBlockId: node.notionBlockId
                    };
                }
            }

            return coordinateMap;
        });
    } catch (error) {
        console.error(`Error generating Bimba coordinate map from bimbaMap:`, error);
        return {};
    }
}

/**
 * Gets Bimba context for a coordinate from bimbaMap.
 * This is a replacement for getBimbaContextFromGraphData that works with bimbaMap.
 *
 * ENHANCED: This function now includes:
 * 1. The target node and its connections
 * 2. Parent nodes of the target coordinate
 * 3. Child nodes of the target coordinate
 * 4. Consistent handling of both "-" and "." separators
 *
 * @param {object} bimbaMap - The Bimba map with nodes and relationships
 * @param {string} coordinate - The Bimba coordinate to get context for
 * @returns {Array} - The enhanced Bimba context with target, parents, and children
 */
export function getBimbaContextFromBimbaMap(bimbaMap, coordinate) {
    if (!bimbaMap || !bimbaMap.nodes || !bimbaMap.relationships) {
        console.warn(`Invalid bimbaMap provided to getBimbaContextFromBimbaMap`);
        return [];
    }

    if (!coordinate) {
        console.warn(`No coordinate provided to getBimbaContextFromBimbaMap`);
        return [];
    }

    // Normalize the coordinate (replace dots with dashes for consistency)
    const normalizedCoordinate = coordinate.replace(/\./g, '-');

    // Find the target node
    const targetNode = bimbaMap.nodes.find(node => {
        // Normalize node coordinate for comparison
        const nodeCoord = node.coordinate ? node.coordinate.replace(/\./g, '-') : null;
        return nodeCoord === normalizedCoordinate;
    });

    if (!targetNode) {
        console.warn(`No node found for coordinate ${coordinate} in bimbaMap`);
        return [];
    }

    // Get all connections to/from this node
    const connections = [];

    for (const relationship of bimbaMap.relationships) {
        // Check if this relationship involves the target node
        if (relationship.from === targetNode.id || relationship.to === targetNode.id) {
            // Determine if this is incoming or outgoing
            const direction = relationship.from === targetNode.id ? 'outgoing' : 'incoming';

            // Find the connected node
            const connectedNodeId = direction === 'outgoing' ? relationship.to : relationship.from;
            const connectedNode = bimbaMap.nodes.find(node => node.id === connectedNodeId);

            if (connectedNode) {
                connections.push({
                    relationship: relationship.type || 'CONNECTED_TO',
                    direction,
                    node: connectedNode
                });
            }
        }
    }

    // Find parent nodes
    const parentNodes = [];

    // Helper function to get parent coordinate that handles both separators
    const getParentCoord = (coord) => {
        // If the coordinate is just "#", it has no parent
        if (coord === '#') return null;

        // Find the last delimiter (- or .)
        const lastDashIndex = coord.lastIndexOf('-');
        const lastDotIndex = coord.lastIndexOf('.');

        // Use the rightmost delimiter
        const lastDelimiterIndex = Math.max(lastDashIndex, lastDotIndex);

        if (lastDelimiterIndex > 0) {
            return coord.substring(0, lastDelimiterIndex);
        }

        return '#'; // Default to root if no delimiter found
    };

    // Get the parent coordinate
    const parentCoordinate = getParentCoord(targetNode.coordinate);

    if (parentCoordinate) {
        // Find the parent node
        const parentNode = bimbaMap.nodes.find(node => {
            // Normalize node coordinate for comparison
            const nodeCoord = node.coordinate ? node.coordinate.replace(/\./g, '-') : null;
            const normalizedParentCoord = parentCoordinate.replace(/\./g, '-');
            return nodeCoord === normalizedParentCoord;
        });

        if (parentNode) {
            parentNodes.push(parentNode);
        }
    }

    // Find child nodes
    const childNodes = [];

    // Helper function to check if a coordinate is a child of another coordinate
    const isChildCoordinate = (childCoord, parentCoord) => {
        // Normalize both coordinates (replace dots with dashes)
        const normalizedChildCoord = childCoord.replace(/\./g, '-');
        const normalizedParentCoord = parentCoord.replace(/\./g, '-');

        // If either coordinate is not provided, return false
        if (!normalizedChildCoord || !normalizedParentCoord) return false;

        // If childCoord is the same as parentCoord, it's not a child
        if (normalizedChildCoord === normalizedParentCoord) return false;

        // Check if childCoord starts with parentCoord and has exactly one more segment
        return (normalizedChildCoord.startsWith(normalizedParentCoord + '-') &&
                normalizedChildCoord.split('-').length === normalizedParentCoord.split('-').length + 1);
    };

    // Find all direct child nodes
    for (const node of bimbaMap.nodes) {
        if (node.coordinate && isChildCoordinate(node.coordinate, targetNode.coordinate)) {
            childNodes.push(node);
        }
    }

    // Format the result with enhanced structure
    return [{
        node: targetNode,
        connections,
        parents: parentNodes,
        children: childNodes,
        // Include the hierarchical context
        hierarchicalContext: {
            target: {
                coordinate: targetNode.coordinate,
                name: targetNode.name || 'Unnamed',
                description: targetNode.description || ''
            },
            parents: parentNodes.map(node => ({
                coordinate: node.coordinate,
                name: node.name || 'Unnamed',
                description: node.description || ''
            })),
            children: childNodes.map(node => ({
                coordinate: node.coordinate,
                name: node.name || 'Unnamed',
                description: node.description || ''
            }))
        }
    }];
}

/**
 * Gets project-level context from bimbaMap.
 * This is a replacement for getProjectContextFromGraphData that works with bimbaMap.
 *
 * ENHANCED: This function now:
 * 1. Prioritizes finding the root node by an exact match for the "#" coordinate
 * 2. Creates more informative summaries by aggregating information from the root node and key subsystem coordinates
 * 3. Handles both "-" and "." separators consistently
 * 4. Creates two different context structures:
 *    - A lightweight structure for RAG chunks (stage -3)
 *    - A comprehensive structure for analysis (stage -2)
 * 5. Implements smart truncation instead of arbitrary character limits
 * 6. Includes minimal hierarchy information for better context in RAG
 *
 * @param {object} bimbaMap - The bimba map with nodes and relationships
 * @param {object} options - Options for context generation
 * @param {boolean} options.fullContext - Whether to include full context (default: false)
 * @returns {object} - Project-level context with appropriate structure based on options
 */
export function getProjectContextFromBimbaMap(bimbaMap, options = {}) {
    const { fullContext = false } = options;

    if (!bimbaMap || !bimbaMap.nodes) {
        console.warn(`Invalid bimbaMap provided to getProjectContextFromBimbaMap`);
        return {
            projectNodes: [],
            rootNode: null,
            projectName: "Unknown Project",
            projectDescription: "No project context available.",
            topLevelNodes: [],
            isFullContext: false
        };
    }

    console.log(`Searching for root node with coordinate "#" in bimbaMap with ${bimbaMap.nodes.length} nodes`);

    // Find the root node with coordinate "#" - prioritize exact match
    const rootNode = bimbaMap.nodes.find(node => {
        const coord = node.coordinate || node.bimbaCoordinate;
        return coord === '#'; // Exact match for root
    });

    // Initialize project description with content from the root node
    let projectDescription = "Project Overview: ";
    if (rootNode && rootNode.description) {
        projectDescription += rootNode.description;
    } else if (rootNode && rootNode.name) {
        projectDescription += `${rootNode.name} - A comprehensive framework.`;
    } else {
        projectDescription = "A comprehensive framework for understanding and implementing the Epi-Logos system.";
    }

    // Find key subsystem nodes (e.g., #0, #1, #2, etc.)
    const subsystemNodes = bimbaMap.nodes.filter(node => {
        const coord = node.coordinate || node.bimbaCoordinate;
        if (!coord) return false;

        // Normalize coordinate (replace dots with dashes)
        const normalizedCoord = coord.replace(/\./g, '-');

        // Match top-level subsystem nodes like #0, #1, etc.
        return normalizedCoord.match(/^#[0-5]$/) !== null;
    });

    // Add subsystem information to the project description
    if (subsystemNodes.length > 0) {
        projectDescription += "\n\nSubsystems: ";
        projectDescription += subsystemNodes.map(node =>
            `${node.name || node.coordinate || 'Unnamed'}`
        ).join(", ");
    }

    // Find top-level nodes for minimal hierarchy (nodes with depth of 2 like #X-Y or #X.Y)
    const topLevelNodes = bimbaMap.nodes.filter(node => {
        const coord = node.coordinate || node.bimbaCoordinate;
        if (!coord) return false;

        // Normalize coordinate (replace dots with dashes)
        const normalizedCoord = coord.replace(/\./g, '-');

        // Match nodes with coordinate depth of 2 (like #X-Y)
        return normalizedCoord.startsWith('#') &&
               (normalizedCoord.split('-').length === 2 ||
                normalizedCoord.split('.').length === 2);
    }).map(node => ({
        coordinate: node.coordinate || node.bimbaCoordinate,
        name: node.name || 'Unnamed',
        description: node.description ?
            (node.description.length > 100 ? node.description.substring(0, 100) + "..." : node.description)
            : 'No description',
        type: node.type || 'Unknown'
    }));

    // Get all nodes with coordinates for reference, handling both separators
    const allNodesWithCoordinates = bimbaMap.nodes
        .filter(node => node.coordinate)
        .map(node => ({
            coordinate: node.coordinate,
            normalizedCoordinate: node.coordinate.replace(/\./g, '-'), // Add normalized version
            name: node.name || 'Unnamed',
            type: node.type || 'Unknown'
        }));

    // Create the base context object that's always returned
    const baseContext = {
        projectNodes: rootNode ? [rootNode] : [], // Contains ONLY the "#" root node
        rootNode,     // The "#" root node or null if not found
        projectName: rootNode ? rootNode.name : "Epi-Logos Project",
        projectDescription,
        subsystemNodes, // Include key subsystem nodes
        topLevelNodes,  // Include top-level nodes for minimal hierarchy
        allNodesWithCoordinates, // All nodes with coordinates for reference
        isFullContext: fullContext
    };

    // If full context is not needed (for RAG chunks in stage -3), return the lightweight version
    if (!fullContext) {
        return baseContext;
    }

    // For full context (for analysis in stage -2), add comprehensive structure
    // Get all nodes with coordinates and organize them by branch
    const nodesWithCoordinates = bimbaMap.nodes.filter(node => node.coordinate);

    // Create a hierarchical structure of coordinates that handles both separators
    const coordinateStructure = {};

    // Group nodes by their first segment (e.g., #0, #1, etc.)
    for (const node of nodesWithCoordinates) {
        // Normalize coordinate (replace dots with dashes)
        const normalizedCoord = node.coordinate.replace(/\./g, '-');
        const parts = normalizedCoord.split('-');
        const mainBranch = parts[0]; // e.g., "#", "#0", "#1"

        if (!coordinateStructure[mainBranch]) {
            coordinateStructure[mainBranch] = {
                name: normalizedCoord === mainBranch ? node.name : mainBranch,
                description: normalizedCoord === mainBranch ? node.description : '',
                coordinate: node.coordinate, // Keep original coordinate with dots if present
                children: {}
            };
        }

        // If this is not a main branch node, add it to the appropriate branch
        if (parts.length > 1) {
            let current = coordinateStructure[mainBranch].children;
            let currentPath = mainBranch;

            // Build the path through the hierarchy
            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                currentPath += `-${part}`;

                if (!current[part]) {
                    current[part] = {
                        coordinate: node.coordinate, // Keep original coordinate with dots if present
                        normalizedCoordinate: currentPath, // Add normalized version
                        name: normalizedCoord === currentPath ? node.name : '',
                        description: normalizedCoord === currentPath ? node.description : '',
                        children: {}
                    };
                }

                current = current[part].children;
            }
        }
    }

    // Create a lightweight index of all coordinates for quick reference
    const coordinateIndex = nodesWithCoordinates.map(node => ({
        coordinate: node.coordinate,
        normalizedCoordinate: node.coordinate.replace(/\./g, '-'), // Add normalized version
        name: node.name || 'Unnamed',
        type: node.type || 'Unknown'
    }));

    // Return the enhanced context with full structure
    return {
        ...baseContext,
        coordinateStructure, // Hierarchical structure of coordinates
        allNodesWithCoordinates: coordinateIndex, // Lightweight index of all coordinates
    };
}

/**
 * Retrieves the Metalogikon epistemic analysis template from the Bimba graph.
 * Gets all child nodes of #2-1 down to two layers of nesting.
 *
 * @param {object} coordinateMap - The Bimba coordinate map
 * @param {object} graphData - The graph data with nodes and edges (deprecated, use bimbaMap instead)
 * @returns {Promise<object>} - The Metalogikon template
 */
export function getMetalogikonTemplate(coordinateMap, graphData) {
    console.warn("getMetalogikonTemplate with graphData is deprecated. Use getMetalogikonTemplateFromBimbaMap instead.");

    const { nodes } = validateGraphData(graphData);

    // Find the MEF root node (#2-1)
    const mefRootCoord = '#2-1';
    const mefRootNode = getNodeByCoordinate(graphData, mefRootCoord);

    if (!mefRootNode) {
        return {
            rootNode: null,
            categories: {},
            lenses: []
        };
    }

    // Get all direct children of the MEF root node
    const categoryCoords = getChildCoordinates(graphData, mefRootCoord);
    const categories = {};
    const allLenses = [];

    // Process each category
    for (const categoryCoord of categoryCoords) {
        const categoryNode = getNodeByCoordinate(graphData, categoryCoord);

        if (categoryNode) {
            const categoryName = getNodeName(categoryNode);
            const lensCoords = getChildCoordinates(graphData, categoryCoord);
            const lenses = [];

            // Process each lens in this category
            for (const lensCoord of lensCoords) {
                const lensNode = getNodeByCoordinate(graphData, lensCoord);

                if (lensNode) {
                    const lens = {
                        coordinate: lensCoord,
                        name: getNodeName(lensNode),
                        description: getNodeDescription(lensNode),
                        category: categoryName
                    };

                    lenses.push(lens);
                    allLenses.push(lens);
                }
            }

            categories[categoryName] = {
                coordinate: categoryCoord,
                name: categoryName,
                description: getNodeDescription(categoryNode),
                lenses
            };
        }
    }

    return {
        rootNode: {
            coordinate: mefRootCoord,
            name: getNodeName(mefRootNode),
            description: getNodeDescription(mefRootNode)
        },
        categories,
        lenses: allLenses
    };
}

/**
 * Retrieves the Metalogikon epistemic analysis template from the Bimba map.
 * Gets all child nodes of #2-1 down to two layers of nesting.
 *
 * @param {object} coordinateMap - The Bimba coordinate map
 * @param {object} bimbaMap - The Bimba map with nodes and relationships
 * @returns {object} - The Metalogikon template
 */
export function getMetalogikonTemplateFromBimbaMap(coordinateMap, bimbaMap) {
    if (!bimbaMap || !bimbaMap.nodes || !Array.isArray(bimbaMap.nodes)) {
        console.warn(`Invalid bimbaMap provided to getMetalogikonTemplateFromBimbaMap`);
        return {
            rootNode: null,
            categories: {},
            lenses: []
        };
    }

    // Find the MEF root node (#2-1)
    const mefRootCoord = '#2-1';
    const mefRootNode = bimbaMap.nodes.find(node => node.coordinate === mefRootCoord);

    if (!mefRootNode) {
        console.warn(`MEF root node (#2-1) not found in bimbaMap`);
        return {
            rootNode: null,
            categories: {},
            lenses: []
        };
    }

    // Get all direct children of the MEF root node (category nodes)
    const categoryNodes = bimbaMap.nodes.filter(node =>
        node.coordinate &&
        node.coordinate.startsWith(mefRootCoord + '-') &&
        node.coordinate.split('-').length === mefRootCoord.split('-').length + 1
    );

    const categories = {};
    const allLenses = [];

    // Process each category
    for (const categoryNode of categoryNodes) {
        const categoryCoord = categoryNode.coordinate;
        const categoryName = categoryNode.name || 'Unnamed Category';

        // Get all lenses in this category
        const lensNodes = bimbaMap.nodes.filter(node =>
            node.coordinate &&
            node.coordinate.startsWith(categoryCoord + '-') &&
            node.coordinate.split('-').length === categoryCoord.split('-').length + 1
        );

        const lenses = [];

        // Process each lens in this category
        for (const lensNode of lensNodes) {
            const lens = {
                coordinate: lensNode.coordinate,
                name: lensNode.name || 'Unnamed Lens',
                description: lensNode.description || '',
                category: categoryName
            };

            lenses.push(lens);
            allLenses.push(lens);
        }

        categories[categoryName] = {
            coordinate: categoryCoord,
            name: categoryName,
            description: categoryNode.description || '',
            lenses
        };
    }

    return {
        rootNode: {
            coordinate: mefRootCoord,
            name: mefRootNode.name || 'Metalogikon',
            description: mefRootNode.description || ''
        },
        categories,
        lenses: allLenses
    };
}

/**
 * Assigns Bimba coordinates to a chunk based on content analysis.
 *
 * @param {string} chunk - The chunk text
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {object} coordinateMap - Map of coordinates to their metadata
 * @param {object} options - Additional options
 * @param {object} llmService - The LLM service
 * @returns {Promise<string[]>} - Array of assigned Bimba coordinates
 */
export async function assignCoordinates(chunk, sourceMetadata, coordinateMap, options = {}, llmService) {
    console.log(`Assigning coordinates for chunk related to ${sourceMetadata.targetCoordinate}...`);

    try {
        // Extract the target coordinate from sourceMetadata
        const targetCoordinate = sourceMetadata.targetCoordinate;

        if (!targetCoordinate) {
            console.warn("No target coordinate provided in sourceMetadata");
            return ["#0"]; // Default to Anuttara if no target coordinate, ALWAYS return an array
        }

        // Check if context window has pre-assigned coordinates
        if (options.contextWindow && options.contextWindow.bimbaContext &&
            options.contextWindow.bimbaContext.mentionedCoordinates &&
            options.contextWindow.bimbaContext.mentionedCoordinates.length > 0) {

            console.log(`Using pre-assigned coordinates from context window: ${options.contextWindow.bimbaContext.mentionedCoordinates.join(', ')}`);
            return options.contextWindow.bimbaContext.mentionedCoordinates;
        }

        // Check if the chunk explicitly mentions coordinates
        const coordinatePattern = /#[0-5](-[0-5])*\b/g;
        const mentionedCoordinates = chunk.match(coordinatePattern) || [];

        if (mentionedCoordinates.length > 0) {
            console.log(`Found explicit coordinate mentions in chunk: ${mentionedCoordinates.join(', ')}`);

            // Filter to keep only valid coordinates that exist in the coordinateMap
            const validMentionedCoords = mentionedCoordinates.filter(coord =>
                coordinateMap[coord] || coord === targetCoordinate
            );

            if (validMentionedCoords.length > 0) {
                // Always include the target coordinate if it's not already included
                if (!validMentionedCoords.includes(targetCoordinate)) {
                    validMentionedCoords.push(targetCoordinate);
                }

                console.log(`Using valid mentioned coordinates: ${validMentionedCoords.join(', ')}`);
                return validMentionedCoords;
            }
        }

        // If no valid mentioned coordinates, use SEMANTIC MAPPING with bimbaKnowing
        if (llmService) {
            try {
                console.log(`Using semantic mapping to assign coordinates for chunk content`);

                // First, get semantic context for the target coordinate and related coordinates
                const semanticContext = await getSemanticCoordinateContext(targetCoordinate, coordinateMap);

                // Prepare the enhanced system prompt with semantic understanding
                const systemPrompt = `You are Epii, an advanced AI system for semantic analysis of the Bimba coordinate system.
Your task is to assign the most semantically relevant Bimba coordinates to a chunk of text based on the actual meaning and purpose of each coordinate, not just their titles.

You have access to detailed semantic descriptions of each coordinate that explain what concepts, themes, and purposes they represent.`;

                // Prepare the enhanced user prompt with semantic context
                let userPrompt = `Please analyze this text chunk and assign the most semantically relevant Bimba coordinates based on the content's themes, concepts, and purposes.

TEXT CHUNK:
${chunk.substring(0, 2000)}${chunk.length > 2000 ? '...' : ''}

TARGET COORDINATE (Primary):
${targetCoordinate}

SEMANTIC COORDINATE CONTEXT:
${semanticContext}

SEMANTIC MAPPING INSTRUCTIONS:
1. The primary coordinate should be ${targetCoordinate} unless the content is clearly more relevant to a different coordinate.
2. Analyze the chunk's core concepts, themes, and purposes.
3. Match these to the semantic descriptions of the coordinates provided above.
4. Assign additional coordinates only if they are semantically aligned with the content.
5. Consider the hierarchical relationships between coordinates.
6. Return your answer as a comma-separated list of coordinates, e.g., "#1-2, #1-2-3, #4-5".
7. Do not explain your reasoning, just provide the list of coordinates.`;

                // Call the LLM service with enhanced semantic context
                const response = await llmService.generateContent(-1, systemPrompt, userPrompt, {
                    temperature: 0.1, // Lower temperature for more consistent semantic mapping
                    maxOutputTokens: 256
                });

                // Parse the response to extract coordinates
                const extractedCoords = response.match(/#[0-5](-[0-5])*\b/g) || [];

                if (extractedCoords.length > 0) {
                    console.log(`Semantic mapping assigned coordinates: ${extractedCoords.join(', ')}`);

                    // Filter to keep only valid coordinates that exist in the coordinateMap
                    const validExtractedCoords = extractedCoords.filter(coord =>
                        coordinateMap[coord] || coord === targetCoordinate
                    );

                    if (validExtractedCoords.length > 0) {
                        // Always include the target coordinate if it's not already included
                        if (!validExtractedCoords.includes(targetCoordinate)) {
                            validExtractedCoords.push(targetCoordinate);
                        }

                        console.log(`Using semantically mapped coordinates: ${validExtractedCoords.join(', ')}`);
                        return validExtractedCoords;
                    }
                }
            } catch (llmError) {
                console.error(`Error using semantic mapping to assign coordinates:`, llmError);
                // Continue to fallback
            }
        }

        // Fallback: Use the target coordinate
        console.log(`Using fallback coordinate: ${targetCoordinate}`);
        return [targetCoordinate]; // ALWAYS return an array
    } catch (error) {
        console.error(`Error assigning coordinates:`, error);
        return [sourceMetadata.targetCoordinate || "#0"]; // ALWAYS return an array
    }
}

/**
 * Consolidates mappings from multiple chunks.
 *
 * @param {Array} mappings - The mappings to consolidate
 * @returns {Array} - The consolidated mappings
 */
export function consolidateMappings(mappings) {
    if (!mappings || !Array.isArray(mappings) || mappings.length === 0) {
        return [];
    }

    // Group mappings by type and value
    const groupedMappings = {};

    for (const mapping of mappings) {
        const key = `${mapping.mappingType}:${mapping.mappingValue}`;

        if (!groupedMappings[key]) {
            groupedMappings[key] = {
                mappingType: mapping.mappingType,
                mappingValue: mapping.mappingValue,
                occurrences: 0,
                confidenceScores: [],
                reasonings: [],
                qlPhases: new Set()
            };
        }

        groupedMappings[key].occurrences++;

        if (mapping.confidenceScore !== undefined) {
            groupedMappings[key].confidenceScores.push(mapping.confidenceScore);
        }

        if (mapping.reasoning) {
            groupedMappings[key].reasonings.push(mapping.reasoning);
        }

        if (mapping.qlPhase) {
            groupedMappings[key].qlPhases.add(mapping.qlPhase);
        }
    }

    // Convert grouped mappings to array and calculate aggregate values
    const consolidatedMappings = Object.values(groupedMappings).map(group => {
        // Calculate average confidence score
        const avgConfidence = group.confidenceScores.length > 0
            ? group.confidenceScores.reduce((sum, score) => sum + score, 0) / group.confidenceScores.length
            : undefined;

        // Select the most detailed reasoning
        const reasoning = group.reasonings.length > 0
            ? group.reasonings.sort((a, b) => b.length - a.length)[0]
            : undefined;

        // Convert QL phases set to array
        const qlPhases = Array.from(group.qlPhases);

        return {
            mappingType: group.mappingType,
            mappingValue: group.mappingValue,
            occurrences: group.occurrences,
            confidenceScore: avgConfidence,
            reasoning,
            qlPhase: qlPhases.length > 0 ? qlPhases.join(', ') : undefined
        };
    });

    // Sort by occurrences and confidence
    return consolidatedMappings.sort((a, b) => {
        if (a.occurrences !== b.occurrences) {
            return b.occurrences - a.occurrences;
        }
        return (b.confidenceScore || 0) - (a.confidenceScore || 0);
    });
}

/**
 * Enhanced version of consolidateMappings that handles different mapping types.
 *
 * @param {Array} mappings - The mappings to consolidate
 * @returns {Array} - The consolidated mappings
 */
export function consolidateMappingsEnhanced(mappings) {
    if (!mappings || !Array.isArray(mappings) || mappings.length === 0) {
        return [];
    }

    // Group mappings by type
    const mappingsByType = {};

    for (const mapping of mappings) {
        if (!mappingsByType[mapping.mappingType]) {
            mappingsByType[mapping.mappingType] = [];
        }

        mappingsByType[mapping.mappingType].push(mapping);
    }

    // Process each type with appropriate consolidation strategy
    const consolidatedMappings = [];

    for (const [type, typeMappings] of Object.entries(mappingsByType)) {
        // Different consolidation strategies based on mapping type
        switch (type) {
            case 'Bimba Coordinate':
                // For coordinates, we want to keep all unique values but rank them
                consolidatedMappings.push(...consolidateCoordinateMappings(typeMappings));
                break;

            case 'Concept':
            case 'Entity':
            case 'Keyword':
                // For concepts and entities, consolidate similar values
                consolidatedMappings.push(...consolidateSimilarMappings(typeMappings));
                break;

            case 'Relationship':
                // For relationships, keep structure but consolidate duplicates
                consolidatedMappings.push(...consolidateRelationshipMappings(typeMappings));
                break;

            default:
                // Default consolidation for other types
                consolidatedMappings.push(...consolidateMappings(typeMappings));
        }
    }

    return consolidatedMappings;
}

/**
 * Helper function to consolidate coordinate mappings.
 *
 * @param {Array} mappings - The coordinate mappings to consolidate
 * @returns {Array} - The consolidated coordinate mappings
 */
function consolidateCoordinateMappings(mappings) {
    // Group by coordinate value
    const groupedByValue = {};

    for (const mapping of mappings) {
        const value = mapping.mappingValue;

        if (!groupedByValue[value]) {
            groupedByValue[value] = {
                mappingType: mapping.mappingType,
                mappingValue: value,
                occurrences: 0,
                confidenceScores: [],
                reasonings: [],
                qlPhases: new Set()
            };
        }

        groupedByValue[value].occurrences++;

        if (mapping.confidenceScore !== undefined) {
            groupedByValue[value].confidenceScores.push(mapping.confidenceScore);
        }

        if (mapping.reasoning) {
            groupedByValue[value].reasonings.push(mapping.reasoning);
        }

        if (mapping.qlPhase) {
            groupedByValue[value].qlPhases.add(mapping.qlPhase);
        }
    }

    // Convert to array and calculate aggregate values
    return Object.values(groupedByValue).map(group => {
        // Calculate average confidence score
        const avgConfidence = group.confidenceScores.length > 0
            ? group.confidenceScores.reduce((sum, score) => sum + score, 0) / group.confidenceScores.length
            : undefined;

        // Select the most detailed reasoning
        const reasoning = group.reasonings.length > 0
            ? group.reasonings.sort((a, b) => b.length - a.length)[0]
            : undefined;

        // Convert QL phases set to array
        const qlPhases = Array.from(group.qlPhases);

        return {
            mappingType: group.mappingType,
            mappingValue: group.mappingValue,
            occurrences: group.occurrences,
            confidenceScore: avgConfidence,
            reasoning,
            qlPhase: qlPhases.length > 0 ? qlPhases.join(', ') : undefined
        };
    }).sort((a, b) => {
        // Sort by occurrences and confidence
        if (a.occurrences !== b.occurrences) {
            return b.occurrences - a.occurrences;
        }
        return (b.confidenceScore || 0) - (a.confidenceScore || 0);
    });
}

/**
 * Helper function to consolidate similar mappings (concepts, entities, keywords).
 *
 * @param {Array} mappings - The similar mappings to consolidate
 * @returns {Array} - The consolidated similar mappings
 */
function consolidateSimilarMappings(mappings) {
    // Group by normalized value (lowercase)
    const groupedByNormalizedValue = {};

    for (const mapping of mappings) {
        const normalizedValue = mapping.mappingValue.toLowerCase();

        if (!groupedByNormalizedValue[normalizedValue]) {
            groupedByNormalizedValue[normalizedValue] = {
                mappingType: mapping.mappingType,
                mappingValues: [mapping.mappingValue],
                occurrences: 0,
                confidenceScores: [],
                reasonings: [],
                qlPhases: new Set()
            };
        } else if (!groupedByNormalizedValue[normalizedValue].mappingValues.includes(mapping.mappingValue)) {
            groupedByNormalizedValue[normalizedValue].mappingValues.push(mapping.mappingValue);
        }

        groupedByNormalizedValue[normalizedValue].occurrences++;

        if (mapping.confidenceScore !== undefined) {
            groupedByNormalizedValue[normalizedValue].confidenceScores.push(mapping.confidenceScore);
        }

        if (mapping.reasoning) {
            groupedByNormalizedValue[normalizedValue].reasonings.push(mapping.reasoning);
        }

        if (mapping.qlPhase) {
            groupedByNormalizedValue[normalizedValue].qlPhases.add(mapping.qlPhase);
        }
    }

    // Convert to array and calculate aggregate values
    return Object.values(groupedByNormalizedValue).map(group => {
        // Choose the most common case variant
        const valueFrequency = {};
        for (const value of group.mappingValues) {
            valueFrequency[value] = (valueFrequency[value] || 0) + 1;
        }
        const mostCommonValue = Object.entries(valueFrequency)
            .sort((a, b) => b[1] - a[1])[0][0];

        // Calculate average confidence score
        const avgConfidence = group.confidenceScores.length > 0
            ? group.confidenceScores.reduce((sum, score) => sum + score, 0) / group.confidenceScores.length
            : undefined;

        // Select the most detailed reasoning
        const reasoning = group.reasonings.length > 0
            ? group.reasonings.sort((a, b) => b.length - a.length)[0]
            : undefined;

        // Convert QL phases set to array
        const qlPhases = Array.from(group.qlPhases);

        return {
            mappingType: group.mappingType,
            mappingValue: mostCommonValue,
            occurrences: group.occurrences,
            confidenceScore: avgConfidence,
            reasoning,
            qlPhase: qlPhases.length > 0 ? qlPhases.join(', ') : undefined
        };
    }).sort((a, b) => {
        // Sort by occurrences and confidence
        if (a.occurrences !== b.occurrences) {
            return b.occurrences - a.occurrences;
        }
        return (b.confidenceScore || 0) - (a.confidenceScore || 0);
    });
}

/**
 * Helper function to consolidate relationship mappings.
 *
 * @param {Array} mappings - The relationship mappings to consolidate
 * @returns {Array} - The consolidated relationship mappings
 */
function consolidateRelationshipMappings(mappings) {
    // Group by source, target, and relationship type
    const groupedByRelationship = {};

    for (const mapping of mappings) {
        // Parse relationship from mappingValue
        const relationshipParts = mapping.mappingValue.split(' ');
        if (relationshipParts.length < 3) continue;

        const source = relationshipParts[0];
        const relationship = relationshipParts.slice(1, -1).join(' ');
        const target = relationshipParts[relationshipParts.length - 1];

        const key = `${source}|${relationship}|${target}`;

        if (!groupedByRelationship[key]) {
            groupedByRelationship[key] = {
                mappingType: mapping.mappingType,
                source,
                relationship,
                target,
                occurrences: 0,
                confidenceScores: [],
                reasonings: [],
                qlPhases: new Set()
            };
        }

        groupedByRelationship[key].occurrences++;

        if (mapping.confidenceScore !== undefined) {
            groupedByRelationship[key].confidenceScores.push(mapping.confidenceScore);
        }

        if (mapping.reasoning) {
            groupedByRelationship[key].reasonings.push(mapping.reasoning);
        }

        if (mapping.qlPhase) {
            groupedByRelationship[key].qlPhases.add(mapping.qlPhase);
        }
    }

    // Convert to array and calculate aggregate values
    return Object.values(groupedByRelationship).map(group => {
        // Calculate average confidence score
        const avgConfidence = group.confidenceScores.length > 0
            ? group.confidenceScores.reduce((sum, score) => sum + score, 0) / group.confidenceScores.length
            : undefined;

        // Select the most detailed reasoning
        const reasoning = group.reasonings.length > 0
            ? group.reasonings.sort((a, b) => b.length - a.length)[0]
            : undefined;

        // Convert QL phases set to array
        const qlPhases = Array.from(group.qlPhases);

        return {
            mappingType: group.mappingType,
            mappingValue: `${group.source} ${group.relationship} ${group.target}`,
            source: group.source,
            relationship: group.relationship,
            target: group.target,
            occurrences: group.occurrences,
            confidenceScore: avgConfidence,
            reasoning,
            qlPhase: qlPhases.length > 0 ? qlPhases.join(', ') : undefined
        };
    }).sort((a, b) => {
        // Sort by occurrences and confidence
        if (a.occurrences !== b.occurrences) {
            return b.occurrences - a.occurrences;
        }
        return (b.confidenceScore || 0) - (a.confidenceScore || 0);
    });
}

/**
 * Reranks mappings based on relevance to the target coordinate.
 *
 * @param {Array} mappings - The mappings to rerank
 * @param {string} targetCoordinate - The target coordinate
 * @returns {Array} - The reranked mappings
 */
export function rerankMappings(mappings, targetCoordinate) {
    if (!mappings || !Array.isArray(mappings) || mappings.length === 0) {
        return [];
    }

    // Clone the mappings to avoid modifying the original
    const rerankedMappings = [...mappings];

    // Adjust confidence scores based on relevance to target coordinate
    for (const mapping of rerankedMappings) {
        // Skip mappings without confidence scores
        if (mapping.confidenceScore === undefined) {
            mapping.confidenceScore = 0.5; // Default confidence
        }

        // Boost coordinate mappings that match the target coordinate
        if (mapping.mappingType === 'Bimba Coordinate') {
            if (mapping.mappingValue === targetCoordinate) {
                mapping.confidenceScore = Math.min(1.0, mapping.confidenceScore * 1.5);
                mapping.relevanceBoost = 'exact match';
            } else if (isChildCoordinate(mapping.mappingValue, targetCoordinate)) {
                mapping.confidenceScore = Math.min(1.0, mapping.confidenceScore * 1.3);
                mapping.relevanceBoost = 'child coordinate';
            } else if (isChildCoordinate(targetCoordinate, mapping.mappingValue)) {
                mapping.confidenceScore = Math.min(1.0, mapping.confidenceScore * 1.2);
                mapping.relevanceBoost = 'parent coordinate';
            }
        }

        // Adjust based on occurrences
        if (mapping.occurrences > 1) {
            const occurrenceBoost = Math.min(0.2, (mapping.occurrences - 1) * 0.05);
            mapping.confidenceScore = Math.min(1.0, mapping.confidenceScore + occurrenceBoost);
        }
    }

    // Sort by confidence score
    return rerankedMappings.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

/**
 * Generates a summary of the Bimba map for a specific coordinate.
 *
 * @param {string} coordinate - The coordinate to generate a summary for
 * @param {object} graphData - The graph data with nodes and edges
 * @returns {Promise<string>} - The generated summary
 */
export function generateBimbaMapSummary(coordinate, graphData) {
    const { nodes } = validateGraphData(graphData);

    // Find the target node
    const targetNode = getNodeByCoordinate(graphData, coordinate);

    if (!targetNode) {
        return `No Bimba node found for coordinate ${coordinate}.`;
    }

    // Get parent, siblings, and children
    const parentCoord = getParentCoordinate(coordinate);
    const parentNode = parentCoord ? getNodeByCoordinate(graphData, parentCoord) : null;

    const siblingCoords = getSiblingCoordinates(graphData, coordinate);
    const siblingNodes = siblingCoords.map(coord => getNodeByCoordinate(graphData, coord)).filter(Boolean);

    const childCoords = getChildCoordinates(graphData, coordinate);
    const childNodes = childCoords.map(coord => getNodeByCoordinate(graphData, coord)).filter(Boolean);

    // Generate summary
    let summary = `## Bimba Map Context for ${coordinate}\n\n`;

    // Target node details
    summary += `### ${getNodeName(targetNode)} (${coordinate})\n\n`;
    summary += `${getNodeDescription(targetNode) || 'No description available.'}\n\n`;

    // Parent details
    if (parentNode) {
        summary += `### Parent: ${getNodeName(parentNode)} (${parentCoord})\n\n`;
        summary += `${getNodeDescription(parentNode) || 'No description available.'}\n\n`;
    }

    // Sibling details
    if (siblingNodes.length > 0) {
        summary += `### Siblings (${siblingNodes.length})\n\n`;
        siblingNodes.forEach(node => {
            summary += `- ${getNodeName(node)} (${node.bimbaCoordinate})\n`;
        });
        summary += '\n';
    }

    // Child details
    if (childNodes.length > 0) {
        summary += `### Children (${childNodes.length})\n\n`;
        childNodes.forEach(node => {
            summary += `- ${getNodeName(node)} (${node.bimbaCoordinate})\n`;
        });
        summary += '\n';
    }

    // Relationships
    const relationships = getNodeRelationships(graphData, targetNode.id);
    if (relationships.length > 0) {
        summary += `### Relationships (${relationships.length})\n\n`;
        relationships.forEach(rel => {
            const direction = rel.direction === 'outgoing' ? '->' : '<-';
            const otherNode = rel.node;
            summary += `- ${getNodeName(targetNode)} ${direction} ${rel.relationship} ${direction} ${getNodeName(otherNode)}\n`;
        });
        summary += '\n';
    }

    return summary;
}

/**
 * Extracts related coordinates with structural awareness using graphData.
 *
 * @param {object[]} mappings - The mappings from analysis
 * @param {string} targetCoordinate - The target coordinate
 * @param {object} graphData - The graph data from frontend context
 * @returns {string[]} - The related coordinates
 */
export function extractRelatedCoordinatesWithStructure(mappings, targetCoordinate, graphData) {
    // Get coordinates from mappings
    const mappingCoordinates = mappings
        .filter(m => m.mappingType === 'Bimba_Node' && m.mappingValue !== targetCoordinate)
        .map(m => m.mappingValue);

    // If graphData is available, add structural context
    if (graphData && graphData.nodes) {
        try {
            // Helper function to get coordinate from a node
            const getNodeCoordinate = (node) =>
                node.bimbaCoordinate ||
                (node.properties && node.properties.coordinate) ||
                null;

            // Find the target node using either coordinate format
            const targetNode = graphData.nodes.find(node =>
                getNodeCoordinate(node) === targetCoordinate
            );

            if (targetNode) {
                // Find parent coordinate
                const parentCoord = getParentCoordinate(targetCoordinate);
                if (parentCoord && !mappingCoordinates.includes(parentCoord)) {
                    const parentNode = graphData.nodes.find(node =>
                        getNodeCoordinate(node) === parentCoord
                    );
                    if (parentNode) {
                        mappingCoordinates.push(parentCoord);
                    }
                }

                // Find child coordinates
                for (const node of graphData.nodes) {
                    const nodeCoord = getNodeCoordinate(node);
                    if (nodeCoord) {
                        const isChild = isChildCoordinate(nodeCoord, targetCoordinate);
                        if (isChild && !mappingCoordinates.includes(nodeCoord)) {
                            mappingCoordinates.push(nodeCoord);
                        }
                    }
                }

                // Find sibling coordinates
                if (parentCoord) {
                    for (const node of graphData.nodes) {
                        const nodeCoord = getNodeCoordinate(node);
                        if (nodeCoord && nodeCoord !== targetCoordinate) {
                            const nodeParent = getParentCoordinate(nodeCoord);
                            if (nodeParent === parentCoord && !mappingCoordinates.includes(nodeCoord)) {
                                mappingCoordinates.push(nodeCoord);
                            }
                        }
                    }
                }

                // Find related coordinates through relationships
                const relationships = getNodeRelationships(graphData, targetNode.id);
                for (const rel of relationships) {
                    const relatedNode = rel.node;
                    const relatedNodeCoord = getNodeCoordinate(relatedNode);
                    if (relatedNodeCoord && !mappingCoordinates.includes(relatedNodeCoord)) {
                        mappingCoordinates.push(relatedNodeCoord);
                    }
                }
            }
        } catch (structureError) {
            console.error(`Error processing structural context:`, structureError);
        }
    }

    // Remove duplicates and return
    return [...new Set(mappingCoordinates)];
}

/**
 * Gets semantic context for coordinates using bimbaKnowing to provide rich descriptions
 * for semantic mapping instead of just coordinate titles.
 *
 * @param {string} targetCoordinate - The target coordinate to focus on
 * @param {object} coordinateMap - Map of available coordinates
 * @returns {Promise<string>} - Rich semantic context for coordinate mapping
 */
async function getSemanticCoordinateContext(targetCoordinate, coordinateMap) {
    try {
        console.log(`Retrieving semantic context for coordinate mapping focused on ${targetCoordinate}`);

        // Get relevant coordinates (target + related)
        const relevantCoords = Object.keys(coordinateMap).filter(coord =>
            coord === targetCoordinate ||
            coord.startsWith(targetCoordinate + '-') ||
            targetCoordinate.startsWith(coord + '-') ||
            coord.split('-').slice(0, -1).join('-') === targetCoordinate.split('-').slice(0, -1).join('-')
        );

        console.log(`Found ${relevantCoords.length} relevant coordinates for semantic context`);

        // Use bimbaKnowing to get rich semantic descriptions
        let semanticContext = `TARGET COORDINATE: ${targetCoordinate}\n\n`;

        // Get semantic context for the target coordinate first
        try {
            const targetBimbaResult = await bpMCPService.callTool('bimbaKnowing', {
                query: `Provide detailed semantic description of coordinate ${targetCoordinate} including its purpose, themes, concepts, and what types of content it represents`,
                contextDepth: 2,
                focusCoordinate: targetCoordinate,
                includeRelations: true,
                includeQLContext: true
            });

            if (targetBimbaResult && targetBimbaResult.content && targetBimbaResult.content.length > 0) {
                const targetData = JSON.parse(targetBimbaResult.content[0].text);

                if (targetData.results && targetData.results.length > 0) {
                    const targetNode = targetData.results.find(node => node.coordinate === targetCoordinate);
                    if (targetNode) {
                        semanticContext += `${targetCoordinate}: ${targetNode.name || 'Unnamed'}\n`;
                        semanticContext += `Description: ${targetNode.description || 'No description available'}\n`;
                        semanticContext += `Semantic Purpose: Primary coordinate for this content\n\n`;
                    }
                }
            }
        } catch (targetError) {
            console.warn(`Could not get semantic context for target coordinate ${targetCoordinate}:`, targetError);
            semanticContext += `${targetCoordinate}: ${coordinateMap[targetCoordinate]?.title || 'Target coordinate'}\n`;
            semanticContext += `Description: Primary coordinate for this content\n\n`;
        }

        // Add context for related coordinates
        semanticContext += `RELATED COORDINATES:\n`;

        for (const coord of relevantCoords.slice(0, 8)) { // Limit to 8 to avoid token overflow
            if (coord === targetCoordinate) continue; // Already added above

            try {
                const coordBimbaResult = await bpMCPService.callTool('bimbaKnowing', {
                    query: `Provide semantic description of coordinate ${coord} including its purpose and what content themes it represents`,
                    contextDepth: 1,
                    focusCoordinate: coord,
                    includeRelations: false,
                    includeQLContext: false
                });

                if (coordBimbaResult && coordBimbaResult.content && coordBimbaResult.content.length > 0) {
                    const coordData = JSON.parse(coordBimbaResult.content[0].text);

                    if (coordData.results && coordData.results.length > 0) {
                        const coordNode = coordData.results.find(node => node.coordinate === coord);
                        if (coordNode) {
                            semanticContext += `${coord}: ${coordNode.name || 'Unnamed'}\n`;
                            semanticContext += `Description: ${coordNode.description || 'No description available'}\n`;

                            // Determine relationship to target
                            if (coord.startsWith(targetCoordinate + '-')) {
                                semanticContext += `Relationship: Child of target coordinate\n`;
                            } else if (targetCoordinate.startsWith(coord + '-')) {
                                semanticContext += `Relationship: Parent of target coordinate\n`;
                            } else {
                                semanticContext += `Relationship: Sibling of target coordinate\n`;
                            }
                            semanticContext += `\n`;
                        }
                    }
                }
            } catch (coordError) {
                console.warn(`Could not get semantic context for coordinate ${coord}:`, coordError);
                // Fallback to basic info from coordinate map
                semanticContext += `${coord}: ${coordinateMap[coord]?.title || 'Related coordinate'}\n`;
                semanticContext += `Description: Available coordinate for mapping\n\n`;
            }
        }

        semanticContext += `\nSEMANTIC MAPPING GUIDANCE:\n`;
        semanticContext += `- Match content themes and concepts to coordinate purposes\n`;
        semanticContext += `- Consider hierarchical relationships between coordinates\n`;
        semanticContext += `- Prioritize semantic relevance over superficial keyword matching\n`;
        semanticContext += `- Use the target coordinate unless content clearly belongs elsewhere\n`;

        console.log(`Generated semantic context with ${semanticContext.length} characters`);
        return semanticContext;

    } catch (error) {
        console.error(`Error generating semantic coordinate context:`, error);

        // Fallback to basic coordinate map info
        const fallbackContext = `TARGET COORDINATE: ${targetCoordinate}\n\n`;
        const relevantCoords = Object.entries(coordinateMap)
            .filter(([coord, _]) =>
                coord === targetCoordinate ||
                coord.startsWith(targetCoordinate + '-') ||
                targetCoordinate.startsWith(coord + '-')
            )
            .map(([coord, info]) => `${coord}: ${info.title || 'Untitled'}`)
            .join('\n');

        return fallbackContext + relevantCoords + '\n\nNote: Using basic coordinate information due to semantic context retrieval error.';
    }
}
