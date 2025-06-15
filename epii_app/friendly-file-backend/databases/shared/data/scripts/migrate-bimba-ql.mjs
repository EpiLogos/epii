/**
 * Bimba to Quaternal Logic (QL) Migration Script
 *
 * This script migrates existing Neo4j Bimba nodes and relations to incorporate
 * Quaternal Logic (QL) properties. It enhances the Bimba knowledge graph with
 * QL awareness for more consistent and reliable retrieval.
 *
 * Usage:
 * node epii_app/friendly-file-backend/scripts/migrate-bimba-ql.mjs
 */

import bpMCPService from '../databases/bpmcp/bpMCP.service.mjs';
import { graph } from '../databases/neo4j/neo4j.service.mjs';
import { BimbaNodeSchema, BimbaRelationSchema } from '../schemas/bimba.schema.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main migration function
 */
async function migrateBimbaToQL() {
  console.log('Starting migration of Bimba nodes and relations to QL system...');

  try {
    // Create a log file for the migration
    const logStream = await createLogStream();

    // 1. Retrieve all Bimba nodes
    const allNodes = await getAllBimbaNodes();
    logMessage(`Retrieved ${allNodes.length} Bimba nodes for migration.`, logStream);

    // 2. Analyze node coordinates to determine QL positions
    const enhancedNodes = allNodes.map(node => {
      // Determine QL position based on coordinate pattern or existing metadata
      const qlPosition = determineQLPosition(node);

      // Determine QL category (implicate or explicate)
      const qlCategory = (qlPosition === 0 || qlPosition === 5) ? 'implicate' : 'explicate';

      // Consolidate description, role, and function
      const enhancedDescription = consolidateDescription(node);

      // Determine QL operator types
      const qlOperatorTypes = determineQLOperatorTypes(node);

      // Determine context frame
      const contextFrame = determineContextFrame(node, qlPosition);

      return {
        ...node,
        qlPosition,
        qlCategory,
        description: enhancedDescription,
        qlOperatorTypes,
        contextFrame
      };
    });

    // 3. Update nodes with enhanced QL properties
    logMessage('Updating nodes with QL properties...', logStream);
    let updatedNodeCount = 0;

    for (const node of enhancedNodes) {
      try {
        await updateBimbaNode(node);
        updatedNodeCount++;

        if (updatedNodeCount % 10 === 0) {
          logMessage(`Updated ${updatedNodeCount}/${enhancedNodes.length} nodes with QL properties.`, logStream);
        }
      } catch (error) {
        logMessage(`Error updating node ${node.bimbaCoordinate}: ${error.message}`, logStream, 'ERROR');
      }
    }

    logMessage(`Completed updating ${updatedNodeCount}/${enhancedNodes.length} nodes with QL properties.`, logStream);

    // 4. Retrieve all Bimba relations
    const allRelations = await getAllBimbaRelations();
    logMessage(`Retrieved ${allRelations.length} Bimba relations for migration.`, logStream);

    // 5. Enhance relations with QL properties
    const enhancedRelations = allRelations.map(relation => {
      // Find source and target nodes
      const sourceNode = enhancedNodes.find(n => n.id === relation.source || n.bimbaCoordinate === relation.source);
      const targetNode = enhancedNodes.find(n => n.id === relation.target || n.bimbaCoordinate === relation.target);

      if (!sourceNode || !targetNode) {
        logMessage(`Could not find source or target node for relation ${relation.id || relation.type}.`, logStream, 'WARN');
        return relation;
      }

      // Determine QL properties based on source and target nodes
      const qlProperties = determineQLProperties(sourceNode, targetNode, relation);

      return {
        ...relation,
        ...qlProperties
      };
    });

    // 6. Update relations with enhanced QL properties
    logMessage('Updating relations with QL properties...', logStream);
    let updatedRelationCount = 0;

    for (const relation of enhancedRelations) {
      if (!relation.qlType || !relation.qlDynamics) {
        logMessage(`Skipping relation ${relation.id || relation.type} - missing required QL properties.`, logStream, 'WARN');
        continue;
      }

      try {
        await updateBimbaRelation(relation);
        updatedRelationCount++;

        if (updatedRelationCount % 10 === 0) {
          logMessage(`Updated ${updatedRelationCount}/${enhancedRelations.length} relations with QL properties.`, logStream);
        }
      } catch (error) {
        logMessage(`Error updating relation ${relation.id || relation.type}: ${error.message}`, logStream, 'ERROR');
      }
    }

    logMessage(`Completed updating ${updatedRelationCount}/${enhancedRelations.length} relations with QL properties.`, logStream);
    logMessage('Migration completed successfully!', logStream);

    // Close the log stream
    await closeLogStream(logStream);
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

/**
 * Create a log stream for the migration
 * @returns {Promise<fs.FileHandle>} The log stream
 */
async function createLogStream() {
  const logDir = path.join(__dirname, '../logs');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logPath = path.join(logDir, `bimba-ql-migration-${timestamp}.log`);

  try {
    // Ensure the log directory exists
    await fs.mkdir(logDir, { recursive: true });

    // Create and return the log stream
    return fs.open(logPath, 'w');
  } catch (error) {
    console.error('Error creating log stream:', error);
    return null;
  }
}

/**
 * Log a message to the console and the log stream
 * @param {string} message - The message to log
 * @param {fs.FileHandle} logStream - The log stream
 * @param {string} level - The log level (INFO, WARN, ERROR)
 */
async function logMessage(message, logStream, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;

  // Log to console
  if (level === 'ERROR') {
    console.error(formattedMessage);
  } else if (level === 'WARN') {
    console.warn(formattedMessage);
  } else {
    console.log(formattedMessage);
  }

  // Log to file if stream is available
  if (logStream) {
    try {
      await logStream.write(formattedMessage);
    } catch (error) {
      console.error('Error writing to log stream:', error);
    }
  }
}

/**
 * Close the log stream
 * @param {fs.FileHandle} logStream - The log stream
 */
async function closeLogStream(logStream) {
  if (logStream) {
    try {
      await logStream.close();
    } catch (error) {
      console.error('Error closing log stream:', error);
    }
  }
}

/**
 * Get all nodes from Neo4j (not just those with bimbaCoordinate)
 * @returns {Promise<Array>} Array of all nodes
 */
async function getAllBimbaNodes() {
  const query = `
    MATCH (n)
    RETURN n, labels(n) as nodeLabels
    LIMIT 1000
  `;

  try {
    // Use Neo4j service directly instead of BPMCP
    if (!graph) {
      throw new Error('Neo4j graph service is not available');
    }

    console.log('Executing query directly with Neo4j service...');
    const result = await graph.query(query);

    console.log(`Neo4j query returned ${result.length} records`);

    if (!result || result.length === 0) {
      throw new Error('No nodes found in database');
    }

    // Process the results from Neo4j LangChain service
    return result.map((record, index) => {
      // The LangChain Neo4j service returns results in a different format
      const node = record.n;
      const labels = record.nodeLabels;

      return {
        id: node.identity ? node.identity.toString() : index.toString(),
        labels: labels || [],
        ...node.properties
      };
    });
  } catch (error) {
    console.error('Error retrieving nodes:', error);
    throw error;
  }
}

/**
 * Get all relations from Neo4j
 * @returns {Promise<Array>} Array of all relations
 */
async function getAllBimbaRelations() {
  const query = `
    MATCH (source)-[r]->(target)
    RETURN ID(r) AS id, TYPE(r) AS type,
           COALESCE(source.bimbaCoordinate, ID(source)) AS source,
           COALESCE(target.bimbaCoordinate, ID(target)) AS target,
           r
    LIMIT 1000
  `;

  try {
    // Use Neo4j service directly instead of BPMCP
    if (!graph) {
      throw new Error('Neo4j graph service is not available');
    }

    console.log('Executing relations query directly with Neo4j service...');
    const result = await graph.query(query);

    console.log(`Neo4j relations query returned ${result.length} records`);

    if (!result || result.length === 0) {
      console.log('No relations found in database');
      return [];
    }

    // Process the results from Neo4j LangChain service
    return result.map(record => {
      const relation = record.r;
      return {
        id: record.id.toString(),
        type: record.type,
        source: record.source.toString(),
        target: record.target.toString(),
        ...relation.properties
      };
    });
  } catch (error) {
    console.error('Error retrieving relations:', error);
    throw error;
  }
}

/**
 * Update a node in Neo4j
 * @param {Object} node - The node to update
 * @returns {Promise<void>}
 */
async function updateBimbaNode(node) {
  // Use bimbaCoordinate if available, otherwise use node ID
  const query = node.bimbaCoordinate ? `
    MATCH (n)
    WHERE n.bimbaCoordinate = $bimbaCoordinate
    SET n.qlPosition = $qlPosition,
        n.qlCategory = $qlCategory,
        n.description = $description,
        n.qlOperatorTypes = $qlOperatorTypes,
        n.contextFrame = $contextFrame,
        n.updatedAt = datetime()
    RETURN n
  ` : `
    MATCH (n)
    WHERE ID(n) = $nodeId
    SET n.qlPosition = $qlPosition,
        n.qlCategory = $qlCategory,
        n.description = $description,
        n.qlOperatorTypes = $qlOperatorTypes,
        n.contextFrame = $contextFrame,
        n.updatedAt = datetime()
    RETURN n
  `;

  const params = {
    ...(node.bimbaCoordinate ? { bimbaCoordinate: node.bimbaCoordinate } : { nodeId: parseInt(node.id) }),
    qlPosition: node.qlPosition,
    qlCategory: node.qlCategory,
    description: node.description,
    qlOperatorTypes: node.qlOperatorTypes,
    contextFrame: node.contextFrame
  };

  try {
    await graph.query(query, params);
  } catch (error) {
    console.error(`Error updating node ${node.bimbaCoordinate || node.id}:`, error);
    throw error;
  }
}

/**
 * Update a relation in Neo4j
 * @param {Object} relation - The relation to update
 * @returns {Promise<void>}
 */
async function updateBimbaRelation(relation) {
  // Use relation ID to update directly
  const query = `
    MATCH ()-[r]->()
    WHERE ID(r) = $relationId
    SET r.qlType = $qlType,
        r.qlDynamics = $qlDynamics,
        r.qlContextFrame = $qlContextFrame,
        r.qlCycle = $qlCycle,
        r.updatedAt = datetime()
    RETURN r
  `;

  const params = {
    relationId: parseInt(relation.id),
    qlType: relation.qlType,
    qlDynamics: relation.qlDynamics,
    qlContextFrame: relation.qlContextFrame,
    qlCycle: relation.qlCycle
  };

  try {
    await graph.query(query, params);
  } catch (error) {
    console.error(`Error updating relation ${relation.id} from ${relation.source} to ${relation.target}:`, error);
    throw error;
  }
}

/**
 * Determine the QL position of a node based on its properties
 * @param {Object} node - The node to analyze
 * @returns {number} The QL position (0-5)
 */
function determineQLPosition(node) {
  // If the node already has a qlPosition, use it
  if (node.qlPosition !== undefined && node.qlPosition !== null) {
    return parseInt(node.qlPosition);
  }

  // Try to extract from bimbaCoordinate if available
  if (node.bimbaCoordinate) {
    const coord = node.bimbaCoordinate;
    const match = coord.match(/#(\d+)/);
    if (match) {
      const mainNumber = parseInt(match[1]);

      // Map main subsystem numbers to QL positions
      switch (mainNumber) {
        case 0: return 0; // Anuttara -> QL Position 0
        case 1: return 1; // Paramasiva -> QL Position 1
        case 2: return 2; // Parashakti -> QL Position 2
        case 3: return 3; // Mahamaya -> QL Position 3
        case 4: return 4; // Nara -> QL Position 4
        case 5: return 5; // Pratibimba -> QL Position 5
        default: return determineQLPositionFromLabels(node);
      }
    }
  }

  // If no bimbaCoordinate, try to determine from labels or other properties
  return determineQLPositionFromLabels(node);
}

/**
 * Determine the QL position of a node based on its labels
 * @param {Object} node - The node to analyze
 * @returns {number} The QL position (0-5)
 */
function determineQLPositionFromLabels(node) {
  const labels = node.labels || [];

  if (labels.includes('AnuttaraComponent')) return 0;
  if (labels.includes('ParamasivaComponent')) return 1;
  if (labels.includes('ParashaktiComponent')) return 2;
  if (labels.includes('MahamayaComponent')) return 3;
  if (labels.includes('NaraComponent')) return 4;
  if (labels.includes('PratibimbaComponent') || labels.includes('Lens')) return 5;

  // Default to 0 if we can't determine
  return 0;
}

/**
 * Consolidate description, content, concept, role, and function into a comprehensive description
 * @param {Object} node - The node to analyze
 * @returns {string} The consolidated description
 */
function consolidateDescription(node) {
  let parts = [];

  // Add existing description if available
  if (node.description) {
    parts.push(node.description);
  }

  // Add content if available and not already in description
  if (node.content && (!node.description || !node.description.includes(node.content))) {
    parts.push(`Content: ${node.content}`);
  }

  // Add concept if available and not already in description
  if (node.concept && (!node.description || !node.description.includes(node.concept))) {
    parts.push(`Concept: ${node.concept}`);
  }

  // Add role if available and not already in description
  if (node.role && (!node.description || !node.description.includes(node.role))) {
    parts.push(`Role: ${node.role}`);
  }

  // Add function if available and not already in description
  if (node.function && (!node.description || !node.description.includes(node.function))) {
    parts.push(`Function: ${node.function}`);
  }

  // If no parts, provide a default description based on what's available
  if (parts.length === 0) {
    if (node.bimbaCoordinate) {
      return `Bimba node at coordinate ${node.bimbaCoordinate}`;
    } else if (node.name) {
      return `Node: ${node.name}`;
    } else {
      return `Node with ID ${node.id}`;
    }
  }

  return parts.join(' | ');
}

/**
 * Determine the QL operator types of a node based on its properties
 * @param {Object} node - The node to analyze
 * @returns {Array<string>} The QL operator types
 */
function determineQLOperatorTypes(node) {
  const types = [];
  const qlPosition = node.qlPosition || determineQLPosition(node);
  const description = (node.description || '').toLowerCase();
  const name = (node.name || '').toLowerCase();

  // Structural operators (typically in positions 0, 1)
  if (qlPosition === 0 || qlPosition === 1 ||
      description.includes('structure') || description.includes('foundation') ||
      name.includes('structure') || name.includes('foundation')) {
    types.push('structural');
  }

  // Processual operators (typically in positions 1, 2)
  if (qlPosition === 1 || qlPosition === 2 ||
      description.includes('process') || description.includes('dynamic') ||
      name.includes('process') || name.includes('dynamic')) {
    types.push('processual');
  }

  // Contextual operators (typically in positions 3, 4)
  if (qlPosition === 3 || qlPosition === 4 ||
      description.includes('context') || description.includes('environment') ||
      name.includes('context') || name.includes('environment')) {
    types.push('contextual');
  }

  // Ensure at least one type is assigned
  if (types.length === 0) {
    // Default based on QL position
    if (qlPosition === 0 || qlPosition === 5) {
      types.push('structural', 'processual', 'contextual'); // Implicate positions have all types
    } else if (qlPosition === 1) {
      types.push('structural');
    } else if (qlPosition === 2) {
      types.push('processual');
    } else if (qlPosition === 3 || qlPosition === 4) {
      types.push('contextual');
    } else {
      types.push('structural'); // Default to structural
    }
  }

  return types;
}

/**
 * Determine the context frame of a node based on its properties
 * @param {Object} node - The node to analyze
 * @param {number} qlPosition - The QL position of the node
 * @returns {string} The context frame
 */
function determineContextFrame(node, qlPosition) {
  // If the node already has a contextFrame, use it
  if (node.contextFrame) {
    return node.contextFrame;
  }

  // Determine based on QL position
  switch (qlPosition) {
    case 0: return '0000';
    case 1: return '0/1';
    case 2: return '0/1/2';
    case 3: return '0/1/2/3';
    case 4: return '4.0-4/5';
    case 5: return '5/0';
    default: return '0/1'; // Default to 0/1
  }
}

/**
 * QL-based relationship types aligned with Quaternal Logic positions
 */
const QL_RELATIONSHIP_TYPES = {
  POTENTIAL_RELATION: '0_POTENTIAL_RELATION',       // Position #0: Implicit Theme or Field of Potential
  MATERIAL_RELATION: '1_MATERIAL_RELATION',         // Position #1: Material Cause or "What"
  PROCESSUAL_RELATION: '2_PROCESSUAL_RELATION',     // Position #2: Efficient Cause or "How"
  MEDIATING_RELATION: '3_MEDIATING_RELATION',       // Position #3: Formal Mediation
  CONTEXTUAL_RELATION: '4_CONTEXTUAL_RELATION',     // Position #4: Contextual Arena
  QUINTESSENTIAL_RELATION: '5_QUINTESSENTIAL_RELATION' // Position #5: Quintessence
};

/**
 * Determine the QL properties of a relation based on its source and target nodes
 * @param {Object} sourceNode - The source node
 * @param {Object} targetNode - The target node
 * @param {Object} relation - The relation
 * @returns {Object} The QL properties (qlType, qlDynamics, qlContextFrame, qlCycle)
 */
function determineQLProperties(sourceNode, targetNode, relation) {
  const sourcePosition = sourceNode.qlPosition || determineQLPosition(sourceNode);
  const targetPosition = targetNode.qlPosition || determineQLPosition(targetNode);

  // Determine QL type based on source position
  let qlType;
  switch (sourcePosition) {
    case 0: qlType = QL_RELATIONSHIP_TYPES.POTENTIAL_RELATION; break;
    case 1: qlType = QL_RELATIONSHIP_TYPES.MATERIAL_RELATION; break;
    case 2: qlType = QL_RELATIONSHIP_TYPES.PROCESSUAL_RELATION; break;
    case 3: qlType = QL_RELATIONSHIP_TYPES.MEDIATING_RELATION; break;
    case 4: qlType = QL_RELATIONSHIP_TYPES.CONTEXTUAL_RELATION; break;
    case 5: qlType = QL_RELATIONSHIP_TYPES.QUINTESSENTIAL_RELATION; break;
    default: qlType = QL_RELATIONSHIP_TYPES.MATERIAL_RELATION; // Default
  }

  // Determine QL dynamics based on source and target positions
  let qlDynamics;
  if (sourcePosition === 0 && targetPosition === 1) {
    qlDynamics = 'foundational_emergence';
  } else if (sourcePosition === 1 && targetPosition === 2) {
    qlDynamics = 'processual_activation';
  } else if (sourcePosition === 2 && targetPosition === 3) {
    qlDynamics = 'formal_mediation';
  } else if (sourcePosition === 3 && targetPosition === 4) {
    qlDynamics = 'contextual_embedding';
  } else if (sourcePosition === 4 && targetPosition === 5) {
    qlDynamics = 'quintessential_synthesis';
  } else if (sourcePosition === 5 && targetPosition === 0) {
    qlDynamics = 'recursive_renewal';
  } else {
    // If no direct match, determine based on relation type
    const relationType = relation.type || '';

    if (relationType.includes('CONTAINS') || relationType.includes('HAS_')) {
      qlDynamics = 'foundational_emergence';
    } else if (relationType.includes('DEVELOPS') || relationType.includes('ACTIVATES')) {
      qlDynamics = 'processual_activation';
    } else if (relationType.includes('MEDIATES') || relationType.includes('BRIDGES')) {
      qlDynamics = 'formal_mediation';
    } else if (relationType.includes('CONTEXT') || relationType.includes('EMBEDS')) {
      qlDynamics = 'contextual_embedding';
    } else if (relationType.includes('SYNTHESIZES') || relationType.includes('INTEGRATES')) {
      qlDynamics = 'quintessential_synthesis';
    } else if (relationType.includes('RETURNS') || relationType.includes('RECURS')) {
      qlDynamics = 'recursive_renewal';
    } else {
      // Default based on source position
      switch (sourcePosition) {
        case 0: qlDynamics = 'foundational_emergence'; break;
        case 1: qlDynamics = 'processual_activation'; break;
        case 2: qlDynamics = 'formal_mediation'; break;
        case 3: qlDynamics = 'contextual_embedding'; break;
        case 4: qlDynamics = 'quintessential_synthesis'; break;
        case 5: qlDynamics = 'recursive_renewal'; break;
        default: qlDynamics = 'foundational_emergence'; // Default
      }
    }
  }

  // Determine QL context frame based on source position
  let qlContextFrame;
  switch (sourcePosition) {
    case 0: qlContextFrame = '0000'; break;
    case 1: qlContextFrame = '0/1'; break;
    case 2: qlContextFrame = '0/1/2'; break;
    case 3: qlContextFrame = '0/1/2/3'; break;
    case 4: qlContextFrame = '4.0-4/5'; break;
    case 5: qlContextFrame = '5/0'; break;
    default: qlContextFrame = '0/1'; // Default
  }

  // Determine QL cycle (simplified for now, can be expanded later)
  const qlCycle = `${sourcePosition}->${targetPosition}`;

  return {
    qlType,
    qlDynamics,
    qlContextFrame,
    qlCycle
  };
}

// Run the migration
migrateBimbaToQL().then(() => {
  console.log('Migration script completed.');
  process.exit(0);
}).catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
