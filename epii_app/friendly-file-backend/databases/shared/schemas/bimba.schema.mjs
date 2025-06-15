/**
 * Enhanced Bimba Node and Relation Schemas
 *
 * This file defines the schemas for Bimba nodes and relations with enhanced
 * Quaternal Logic (QL) properties. These schemas are used for validation and
 * documentation purposes throughout the Epii Analysis Pipeline.
 */

/**
 * Enhanced Bimba Node Schema that incorporates Quaternal Logic
 * Consolidates description, role, and function into a comprehensive description
 * Adds QL-specific properties for improved retrieval and analysis
 */
export const BimbaNodeSchema = {
  // Core properties
  bimbaCoordinate: {
    type: 'string',
    required: true,
    description: 'The unique coordinate identifier for this node in the Bimba map (e.g., "#5-2")'
  },
  name: {
    type: 'string',
    required: true,
    description: 'The name of this Bimba node'
  },

  // Enhanced description that consolidates role and function
  description: {
    type: 'string',
    required: true,
    description: 'Comprehensive description that consolidates the node\'s role, function, and other descriptive elements'
  },

  // Quaternal Logic properties
  qlPosition: {
    type: 'number',
    enum: [0, 1, 2, 3, 4, 5],
    description: 'The position in the Quaternal Logic cycle (0-5)'
  },
  qlCategory: {
    type: 'string',
    enum: ['implicate', 'explicate'],
    description: 'Whether this is an implicate (0,5) or explicate (1-4) element'
  },
  qlOperatorTypes: {
    type: 'array',
    items: {
      type: 'string',
      enum: ['structural', 'processual', 'contextual']
    },
    description: 'The types of QL operators associated with this node'
  },

  // Relational properties
  parentCoordinate: {
    type: 'string',
    description: 'The coordinate of this node\'s parent in the Bimba hierarchy'
  },
  childCoordinates: {
    type: 'array',
    items: { type: 'string' },
    description: 'The coordinates of this node\'s children in the Bimba hierarchy'
  },
  siblingCoordinates: {
    type: 'array',
    items: { type: 'string' },
    description: 'The coordinates of this node\'s siblings in the Bimba hierarchy'
  },

  // Contextual properties
  contextFrame: {
    type: 'string',
    enum: ['0000', '0/1', '0/1/2', '0/1/2/3', '4.0-4/5', '5/0'],
    description: 'The QL context frame this node operates within'
  },
  qlVariant: {
    type: 'string',
    enum: ['0/1', '2/3', '4/6', '7/8/9', '10/12', '16/24'],
    default: '4/6',
    description: 'The QL variant for this node (mod6 mappings)'
  },

  // Relational Properties (from Analysis Pipeline)
  // These properties store analysis results as simple text fields for easy editing
  qlOperators: {
    type: 'string',
    description: 'Quaternary Logic operators that represent structural and procedural patterns (e.g., "QL-STRUCT-3, QL-PROC-2"). Enter as comma-separated list or free text.'
  },
  epistemicEssence: {
    type: 'string',
    description: 'Core abstract concepts that this node elaborates on (e.g., "Epistemic Topology, Conceptual Integration"). Enter as comma-separated list or free text.'
  },
  archetypalAnchors: {
    type: 'string',
    description: 'Symbolic representations and archetypal patterns that resonate with this node (e.g., "Ouroboros, Divine Marriage, Axis Mundi"). Enter as comma-separated list or free text.'
  },
  semanticFramework: {
    type: 'string',
    description: 'Relationship types and semantic frameworks that connect this node to others (e.g., "Harmonizes With, Synthesizes, Transcends"). Enter as comma-separated list or free text.'
  },

  // Additional metadata
  createdAt: {
    type: 'date',
    default: 'Date.now',
    description: 'When this node was created'
  },
  updatedAt: {
    type: 'date',
    default: 'Date.now',
    description: 'When this node was last updated'
  },

  // Optional properties that may exist on some nodes
  role: {
    type: 'string',
    description: 'The role of this node (legacy field, may be consolidated into description)'
  },
  function: {
    type: 'string',
    description: 'The function of this node (legacy field, may be consolidated into description)'
  },
  notionPageId: {
    type: 'string',
    description: 'The ID of the corresponding Notion page, if any'
  }
};

/**
 * Enhanced Bimba Relation Schema that incorporates Quaternal Logic
 * Adds QL-specific properties for improved understanding of relationships
 * Based on the Quaternal Logic framework (0-5 positions)
 */
export const BimbaRelationSchema = {
  // Core properties
  source: {
    type: 'string',
    required: true,
    description: 'The bimbaCoordinate of the source node'
  },
  target: {
    type: 'string',
    required: true,
    description: 'The bimbaCoordinate of the target node'
  },
  type: {
    type: 'string',
    required: true,
    description: 'The type of relationship (e.g., "CONTAINS", "RELATES_TO", "IMPLEMENTS")'
  },

  // Enhanced description
  description: {
    type: 'string',
    required: true,
    description: 'Comprehensive description of the relationship'
  },

  // Quaternal Logic type property
  qlType: {
    type: 'string',
    enum: [
      '0_POTENTIAL_RELATION',       // Position #0: Implicit Theme or Field of Potential
      '1_MATERIAL_RELATION',        // Position #1: Material Cause or "What"
      '2_PROCESSUAL_RELATION',      // Position #2: Efficient Cause or "How"
      '3_MEDIATING_RELATION',       // Position #3: Formal Mediation
      '4_CONTEXTUAL_RELATION',      // Position #4: Contextual Arena
      '5_QUINTESSENTIAL_RELATION'   // Position #5: Quintessence
    ],
    description: 'The QL-based type of this relation based on its source node position'
  },

  // Quaternal Logic dynamics property
  qlDynamics: {
    type: 'string',
    enum: [
      'foundational_emergence',   // 0->1: From potential to material definition
      'processual_activation',    // 1->2: From definition to process
      'formal_mediation',         // 2->3: From process to integration
      'contextual_embedding',     // 3->4: From integration to context
      'quintessential_synthesis', // 4->5: From context to synthesis
      'recursive_renewal'         // 5->0: From synthesis back to potential
    ],
    description: 'The QL dynamic represented by this relation based on source->target transition'
  },

  // Quaternal Logic context frame property
  qlContextFrame: {
    type: 'string',
    enum: [
      '0000',            // The transcendental frame
      '0/1',             // The foundation and definition frame
      '0/1/2',           // The activation and process frame
      '0/1/2/3',         // The integration and mediation frame
      '4.0-4/5',         // The application and personalization frame
      '5/0'              // The synthesis and renewal frame
    ],
    description: 'The QL context frame this relation operates within'
  },

  // Quaternal Logic cycle property
  qlCycle: {
    type: 'string',
    description: 'The QL cycle this relation participates in (flexible definition for future expansion)'
  },

  // Relational properties
  bidirectional: {
    type: 'boolean',
    default: false,
    description: 'Whether this relationship applies in both directions'
  },
  strength: {
    type: 'number',
    min: 0,
    max: 1,
    default: 0.5,
    description: 'The strength of this relationship (0-1)'
  },

  // Additional metadata
  createdAt: {
    type: 'date',
    default: 'Date.now',
    description: 'When this relationship was created'
  },
  updatedAt: {
    type: 'date',
    default: 'Date.now',
    description: 'When this relationship was last updated'
  }
};

/**
 * Notion Property Integration Mappings
 * Defines how Bimba properties map to Notion property types
 * Supports the 5/0 synthesis pattern: Bimba (Position 5) → Notion (Position 0)
 */
export const NotionPropertyMappings = {
  // QL Core Properties
  qlPosition: {
    notionType: 'select',
    options: ['0', '1', '2', '3', '4', '5'],
    description: 'QL position mapping to Notion select property'
  },
  qlCategory: {
    notionType: 'select',
    options: ['implicate', 'explicate'],
    description: 'QL category mapping to Notion select property'
  },
  qlOperatorTypes: {
    notionType: 'multi_select',
    options: ['structural', 'processual', 'contextual'],
    description: 'QL operator types mapping to Notion multi-select property'
  },
  qlVariant: {
    notionType: 'select',
    options: ['0/1', '2/3', '4/6', '7/8/9', '10/12', '16/24'],
    description: 'QL variant mapping to Notion select property'
  },

  // Relational Properties (from Analysis Pipeline)
  qlOperators: {
    notionType: 'rich_text',
    format: 'structured_list',
    description: 'QL operators formatted as structured rich text in Notion'
  },
  epistemicEssence: {
    notionType: 'rich_text',
    format: 'structured_list',
    description: 'Epistemic essence formatted as structured rich text in Notion'
  },
  archetypalAnchors: {
    notionType: 'rich_text',
    format: 'structured_list',
    description: 'Archetypal anchors formatted as structured rich text for manual page creation in Notion'
  },
  semanticFramework: {
    notionType: 'rich_text',
    format: 'structured_list',
    description: 'Semantic framework formatted as structured rich text in Notion'
  },

  // Relationship Metadata
  relationshipStrength: {
    notionType: 'number',
    format: 'percent',
    description: 'Relationship strength as percentage in Notion'
  },
  relationshipConfidence: {
    notionType: 'number',
    format: 'percent',
    description: 'Relationship confidence as percentage in Notion'
  },
  qlDynamics: {
    notionType: 'select',
    options: [
      'foundational_emergence',
      'processual_activation',
      'formal_mediation',
      'contextual_embedding',
      'quintessential_synthesis',
      'recursive_renewal'
    ],
    description: 'QL dynamics mapping to Notion select property'
  },

  // Temporal Properties
  lastAnalyzed: {
    notionType: 'date',
    description: 'Last analysis timestamp in Notion'
  },
  analysisConfidence: {
    notionType: 'number',
    format: 'percent',
    description: 'Analysis confidence as percentage in Notion'
  },

  // Bimba Coordinate Properties
  bimbaCoordinate: {
    notionType: 'title',
    description: 'Bimba coordinate as page title in Notion'
  },
  parentCoordinate: {
    notionType: 'relation',
    targetDatabase: 'bimba_nodes',
    description: 'Parent coordinate as relation to other Bimba nodes'
  },
  childCoordinates: {
    notionType: 'relation',
    targetDatabase: 'bimba_nodes',
    multiple: true,
    description: 'Child coordinates as multiple relations to other Bimba nodes'
  }
};

/**
 * Helper function to validate a Bimba node against the schema
 * @param {Object} node - The node to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
export function validateBimbaNode(node) {
  const errors = [];

  // Check required fields
  if (!node.bimbaCoordinate) errors.push('Missing required field: bimbaCoordinate');
  if (!node.name) errors.push('Missing required field: name');
  if (!node.description) errors.push('Missing required field: description');

  // Check QL position if provided
  if (node.qlPosition !== undefined &&
      ![0, 1, 2, 3, 4, 5].includes(node.qlPosition)) {
    errors.push('Invalid qlPosition: must be 0, 1, 2, 3, 4, or 5');
  }

  // Check QL category if provided
  if (node.qlCategory &&
      !['implicate', 'explicate'].includes(node.qlCategory)) {
    errors.push('Invalid qlCategory: must be "implicate" or "explicate"');
  }

  // Check QL variant if provided
  if (node.qlVariant &&
      !['0/1', '2/3', '4/6', '7/8/9', '10/12', '16/24'].includes(node.qlVariant)) {
    errors.push('Invalid qlVariant: must be one of 0/1, 2/3, 4/6, 7/8/9, 10/12, 16/24');
  }

  // Validate relational properties are strings if provided
  const relationalProps = ['qlOperators', 'epistemicEssence', 'archetypalAnchors', 'semanticFramework'];
  for (const prop of relationalProps) {
    if (node[prop] !== undefined && typeof node[prop] !== 'string') {
      errors.push(`${prop} must be a string`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Helper function to validate a Bimba relation against the schema
 * @param {Object} relation - The relation to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
export function validateBimbaRelation(relation) {
  const errors = [];

  // Check required fields
  if (!relation.source) errors.push('Missing required field: source');
  if (!relation.target) errors.push('Missing required field: target');
  if (!relation.type) errors.push('Missing required field: type');
  if (!relation.description) errors.push('Missing required field: description');

  // Check QL dynamics if provided
  const validDynamics = [
    'foundational_emergence',
    'processual_activation',
    'formal_mediation',
    'contextual_embedding',
    'quintessential_synthesis',
    'recursive_renewal'
  ];

  if (relation.qlDynamics &&
      !validDynamics.includes(relation.qlDynamics)) {
    errors.push(`Invalid qlDynamics: must be one of ${validDynamics.join(', ')}`);
  }

  // Check QL type if provided
  const validTypes = [
    '0_POTENTIAL_RELATION',
    '1_MATERIAL_RELATION',
    '2_PROCESSUAL_RELATION',
    '3_MEDIATING_RELATION',
    '4_CONTEXTUAL_RELATION',
    '5_QUINTESSENTIAL_RELATION'
  ];

  if (relation.qlType &&
      !validTypes.includes(relation.qlType)) {
    errors.push(`Invalid qlType: must be one of ${validTypes.join(', ')}`);
  }

  // Check QL context frame if provided
  const validContextFrames = [
    '0000',
    '0/1',
    '0/1/2',
    '0/1/2/3',
    '4.0-4/5',
    '5/0'
  ];

  if (relation.qlContextFrame &&
      !validContextFrames.includes(relation.qlContextFrame)) {
    errors.push(`Invalid qlContextFrame: must be one of ${validContextFrames.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Default property fields for new Bimba nodes
 * These ensure that all nodes have the required relational property structure
 */
export const BimbaNodeDefaults = {
  // Default relational properties - empty strings that can be populated by analysis pipeline or manual editing
  qlOperators: '',
  epistemicEssence: '',
  archetypalAnchors: '',
  semanticFramework: '',

  // Default QL properties
  qlVariant: '4/6',
  qlPosition: null, // Will be derived from coordinate

  // Default metadata
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Helper function to create a complete node properties object with defaults
 * @param {Object} nodeProperties - The basic node properties (bimbaCoordinate, name, description)
 * @returns {Object} - Complete node properties with defaults applied
 */
export function createNodeWithDefaults(nodeProperties) {
  // Extract the final number from coordinate for qlPosition (e.g., "#4-3-5-4" → 4)
  let qlPosition = null;
  if (nodeProperties.bimbaCoordinate) {
    const match = nodeProperties.bimbaCoordinate.match(/-(\d+)$/);
    if (match) {
      qlPosition = parseInt(match[1], 10);
    }
  }

  return {
    ...BimbaNodeDefaults,
    ...nodeProperties,
    qlPosition: qlPosition,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Helper function to generate Cypher CREATE query with default properties
 * @param {Object} nodeProperties - The node properties
 * @param {string} labels - Neo4j labels (default: "VectorNode")
 * @returns {Object} - Query and params for node creation
 */
export function generateNodeCreationQuery(nodeProperties, labels = "VectorNode") {
  const completeProperties = createNodeWithDefaults(nodeProperties);

  const query = `
    CREATE (newNode:${labels})
    SET newNode += $nodeProperties
    RETURN newNode
  `;

  return {
    query,
    params: {
      nodeProperties: completeProperties
    }
  };
}

