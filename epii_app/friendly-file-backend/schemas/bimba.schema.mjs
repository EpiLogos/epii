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
