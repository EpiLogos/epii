/**
 * Quaternal Logic (QL) Utilities
 *
 * This module provides utilities for working with Quaternal Logic (QL) data,
 * including formatting QL context for LLM consumption and extracting QL-specific
 * information from Bimba nodes and relationships.
 */

/**
 * Format Quaternal Logic context for LLM consumption
 *
 * This function takes QL context data (typically retrieved via bimbaKnowing)
 * and formats it into a structured, LLM-consumable Markdown string.
 *
 * @param {Object} qlContext - The QL context object from bimbaKnowing
 * @returns {string} - Formatted Markdown string for LLM consumption
 */
export function formatQLContext(qlContext) {
    if (!qlContext) {
        return "No Quaternal Logic context available.";
    }

    // Parse the context if it's a string
    const parsedContext = typeof qlContext === 'string'
        ? JSON.parse(qlContext)
        : qlContext;

    // Get the results (nodes) - handle different possible structures
    let results = [];
    if (parsedContext.results) {
        results = parsedContext.results;
    } else if (parsedContext.nodes) {
        results = parsedContext.nodes;
    } else if (Array.isArray(parsedContext)) {
        results = parsedContext;
    }

    // Get relationships if available - handle different possible structures
    let relationships = [];
    if (parsedContext.relationships) {
        relationships = parsedContext.relationships;
    } else if (parsedContext.relations) {
        relationships = parsedContext.relations;
    } else if (parsedContext.edges) {
        relationships = parsedContext.edges;
    }

    // Helper function to safely access properties that might be nested
    const getNodeProperty = (node, propName, defaultValue = '') => {
        if (!node) return defaultValue;

        // Check if the property exists directly on the node
        if (node[propName] !== undefined) {
            return node[propName];
        }

        // Check if the property exists in a properties object
        if (node.properties && node.properties[propName] !== undefined) {
            return node.properties[propName];
        }

        // Check if the property exists in a data object
        if (node.data && node.data[propName] !== undefined) {
            return node.data[propName];
        }

        return defaultValue;
    };

    // Helper function to safely check if a node has a specific QL operator type
    const hasQLOperatorType = (node, type) => {
        const operatorTypes = getNodeProperty(node, 'qlOperatorTypes', []);

        if (Array.isArray(operatorTypes)) {
            return operatorTypes.includes(type);
        }

        if (typeof operatorTypes === 'string') {
            return operatorTypes.split(',').map(t => t.trim()).includes(type);
        }

        return false;
    };

    // Categorize operators by type
    const structuralOperators = results.filter(node => hasQLOperatorType(node, 'structural'));
    const processualOperators = results.filter(node => hasQLOperatorType(node, 'processual'));
    const contextualOperators = results.filter(node => hasQLOperatorType(node, 'contextual'));

    // Format for LLM consumption
    let formattedContext = "### QL Operator Categories\n\n";

    // Add structural operators section
    formattedContext += "#### Structural Operators\n";
    if (structuralOperators.length > 0) {
        structuralOperators.forEach(op => {
            const name = getNodeProperty(op, 'name', 'Unnamed');
            const description = getNodeProperty(op, 'description', 'No description available');
            formattedContext += `- **${name}**: ${description}\n`;
        });
    } else {
        formattedContext += "No structural operators found in this context.\n";
    }

    // Add processual operators section
    formattedContext += "\n#### Processual Operators\n";
    if (processualOperators.length > 0) {
        processualOperators.forEach(op => {
            const name = getNodeProperty(op, 'name', 'Unnamed');
            const description = getNodeProperty(op, 'description', 'No description available');
            formattedContext += `- **${name}**: ${description}\n`;
        });
    } else {
        formattedContext += "No processual operators found in this context.\n";
    }

    // Add contextual operators section
    formattedContext += "\n#### Contextual Operators\n";
    if (contextualOperators.length > 0) {
        contextualOperators.forEach(op => {
            const name = getNodeProperty(op, 'name', 'Unnamed');
            const description = getNodeProperty(op, 'description', 'No description available');
            formattedContext += `- **${name}**: ${description}\n`;
        });
    } else {
        formattedContext += "No contextual operators found in this context.\n";
    }

    // Add QL relationship types section
    formattedContext += "\n### QL Relationship Types\n";
    formattedContext += "- **0_POTENTIAL_RELATION**: Relationships originating from Position #0 (Implicit Theme or Field of Potential)\n";
    formattedContext += "- **1_MATERIAL_RELATION**: Relationships originating from Position #1 (Material Cause or \"What\")\n";
    formattedContext += "- **2_PROCESSUAL_RELATION**: Relationships originating from Position #2 (Efficient Cause or \"How\")\n";
    formattedContext += "- **3_MEDIATING_RELATION**: Relationships originating from Position #3 (Formal Mediation)\n";
    formattedContext += "- **4_CONTEXTUAL_RELATION**: Relationships originating from Position #4 (Contextual Arena)\n";
    formattedContext += "- **5_QUINTESSENTIAL_RELATION**: Relationships originating from Position #5 (Quintessence)\n";

    // Add QL dynamics section
    formattedContext += "\n### QL Dynamics\n";
    formattedContext += "- **foundational_emergence**: Transition from potential to material definition (0->1)\n";
    formattedContext += "- **processual_activation**: Transition from definition to process (1->2)\n";
    formattedContext += "- **formal_mediation**: Transition from process to integration (2->3)\n";
    formattedContext += "- **contextual_embedding**: Transition from integration to context (3->4)\n";
    formattedContext += "- **quintessential_synthesis**: Transition from context to synthesis (4->5)\n";
    formattedContext += "- **recursive_renewal**: Transition from synthesis back to potential (5->0)\n";

    // Add QL context frames section
    formattedContext += "\n### QL Context Frames\n";
    formattedContext += "- **0000**: The transcendental frame\n";
    formattedContext += "- **0/1**: The foundation and definition frame\n";
    formattedContext += "- **0/1/2**: The activation and process frame\n";
    formattedContext += "- **0/1/2/3**: The integration and mediation frame\n";
    formattedContext += "- **4.0-4/5**: The application and personalization frame\n";
    formattedContext += "- **5/0**: The synthesis and renewal frame\n";

    // Add relationships section if available
    if (relationships.length > 0) {
        formattedContext += "\n### QL Relationships in Context\n";

        // Helper function to safely get relationship properties
        const getRelProperty = (rel, propName, defaultValue = '') => {
            if (!rel) return defaultValue;

            if (rel[propName] !== undefined) {
                return rel[propName];
            }

            // Handle different property naming conventions
            const propMap = {
                'source': ['from', 'start', 'sourceId', 'source_id', 'fromId', 'from_id'],
                'target': ['to', 'end', 'targetId', 'target_id', 'toId', 'to_id'],
                'type': ['relationType', 'relation_type', 'label', 'kind'],
                'qlType': ['ql_type', 'qlRelationType', 'ql_relation_type'],
                'qlDynamics': ['ql_dynamics', 'dynamics', 'qlDynamic'],
                'qlContextFrame': ['ql_context_frame', 'contextFrame', 'context_frame']
            };

            // Try alternative property names
            if (propMap[propName]) {
                for (const alt of propMap[propName]) {
                    if (rel[alt] !== undefined) {
                        return rel[alt];
                    }
                }
            }

            return defaultValue;
        };

        // Group relationships by type
        const relationshipsByType = {};
        relationships.forEach(rel => {
            const type = getRelProperty(rel, 'type', 'Unknown');
            if (!relationshipsByType[type]) {
                relationshipsByType[type] = [];
            }
            relationshipsByType[type].push(rel);
        });

        // Add each relationship type
        for (const [type, rels] of Object.entries(relationshipsByType)) {
            formattedContext += `\n#### ${type} Relationships\n`;
            rels.slice(0, 5).forEach(rel => {
                const source = getRelProperty(rel, 'source', 'Unknown');
                const target = getRelProperty(rel, 'target', 'Unknown');
                formattedContext += `- ${source} → ${target}`;

                // Add QL properties if available
                const qlProps = [];

                const qlType = getRelProperty(rel, 'qlType', '');
                if (qlType) qlProps.push(`Type: ${qlType}`);

                const qlDynamics = getRelProperty(rel, 'qlDynamics', '');
                if (qlDynamics) qlProps.push(`Dynamics: ${qlDynamics}`);

                const qlContextFrame = getRelProperty(rel, 'qlContextFrame', '');
                if (qlContextFrame) qlProps.push(`Context Frame: ${qlContextFrame}`);

                if (qlProps.length > 0) {
                    formattedContext += ` (${qlProps.join(', ')})`;
                }

                formattedContext += '\n';
            });

            // If there are more relationships of this type, indicate that
            if (rels.length > 5) {
                formattedContext += `- ... and ${rels.length - 5} more ${type} relationships\n`;
            }
        }
    }

    // Add QL-Bimba relationship explanation
    formattedContext += "\n### QL-Bimba Relationship\n";
    formattedContext += "QL provides the foundational, generative logic (comprising specific structural, processual, and contextual operators/dynamics), while the Bimba Coordinate System is the manifested, navigable map built upon and through these QL principles. The QL properties of nodes and relationships in the Bimba map provide a deeper understanding of their roles and dynamics within the system.\n";

    // Add usage guide for analysis
    formattedContext += "\n### Using QL in Analysis\n";
    formattedContext += "When analyzing content, consider how it relates to the QL framework:\n";
    formattedContext += "- **Structural Operators**: How does the content define or establish foundational elements?\n";
    formattedContext += "- **Processual Operators**: What dynamic processes or transformations are described?\n";
    formattedContext += "- **Contextual Operators**: How does the content relate to broader contexts or applications?\n";
    formattedContext += "- **QL Dynamics**: What transitions or flows between positions are evident?\n";
    formattedContext += "- **QL Context Frames**: Which frame(s) best describe the context of this content?\n";

    return formattedContext;
}

/**
 * Extract QL properties from a node
 *
 * @param {Object} node - A Bimba node
 * @returns {Object} - Object containing QL properties
 */
export function extractQLProperties(node) {
    if (!node) return {};

    // Handle both direct properties and nested properties
    const properties = node.properties || node;

    return {
        qlPosition: properties.qlPosition,
        qlCategory: properties.qlCategory,
        qlOperatorTypes: properties.qlOperatorTypes,
        contextFrame: properties.contextFrame
    };
}

/**
 * Determine the QL position of a coordinate
 *
 * @param {string} coordinate - A Bimba coordinate
 * @returns {number|null} - The QL position (0-5) or null if cannot be determined
 */
export function determineQLPositionFromCoordinate(coordinate) {
    if (!coordinate) return null;

    // Extract the first number from the coordinate
    const match = coordinate.match(/#(\d+)/);
    if (match) {
        const mainNumber = parseInt(match[1]);

        // Map main subsystem numbers to QL positions
        if (mainNumber >= 0 && mainNumber <= 5) {
            return mainNumber;
        }
    }

    return null;
}

/**
 * Get a human-readable description of a QL position
 *
 * @param {number} position - The QL position (0-5)
 * @returns {string} - Human-readable description
 */
export function getQLPositionDescription(position) {
    switch (position) {
        case 0: return "Position #0: Implicit Theme or Field of Potential";
        case 1: return "Position #1: Material Cause or \"What\"";
        case 2: return "Position #2: Efficient Cause or \"How\"";
        case 3: return "Position #3: Formal Mediation";
        case 4: return "Position #4: Contextual Arena";
        case 5: return "Position #5: Quintessence";
        default: return "Unknown QL Position";
    }
}

/**
 * Get a human-readable description of a QL dynamic
 *
 * @param {string} dynamic - The QL dynamic
 * @returns {string} - Human-readable description
 */
export function getQLDynamicDescription(dynamic) {
    switch (dynamic) {
        case 'foundational_emergence': return "Transition from potential to material definition (0->1)";
        case 'processual_activation': return "Transition from definition to process (1->2)";
        case 'formal_mediation': return "Transition from process to integration (2->3)";
        case 'contextual_embedding': return "Transition from integration to context (3->4)";
        case 'quintessential_synthesis': return "Transition from context to synthesis (4->5)";
        case 'recursive_renewal': return "Transition from synthesis back to potential (5->0)";
        default: return "Unknown QL Dynamic";
    }
}
