/**
 * Bimba Skills Registry
 * A registry for skills aligned with Bimba coordinates and Quaternary Logic
 *
 * Bimba Coordinate: #5-4-3
 * Represents the skills registry component of the Siva-Shakti layer
 */

class BimbaSkillsRegistry {
  constructor() {
    this.skills = new Map();
    this.agentSkills = new Map(); // Maps agent IDs to their skills
    this.skillRelationships = new Map(); // Maps skill IDs to their relationships
    this.nestedSkills = new Map(); // Maps parent skill IDs to their nested skills
  }

  /**
   * Register a skill with the registry
   * @param {Object} skill The skill to register
   * @param {string} skill.id Unique identifier for the skill
   * @param {string} skill.name Human-readable name for the skill
   * @param {string} skill.description Description of what the skill does
   * @param {string} skill.bimbaCoordinate Bimba coordinate for the skill
   * @param {string} skill.agentId ID of the agent that provides this skill
   * @param {Function} skill.handler Function that implements the skill
   * @param {Object} [skill.qlMetadata] Quaternary Logic metadata
   * @param {number} [skill.qlMetadata.qlPosition] Position in the QL cycle (0-5)
   * @param {string} [skill.qlMetadata.contextFrame] QL context frame (e.g., '(0/1)', '(0/1/2)')
   * @param {string} [skill.qlMetadata.qlMode] QL mode (e.g., 'ascending', 'descending')
   * @param {Object} [skill.harmonicMetadata] Harmonic metadata for vibrational ontology
   * @returns {Object} The registered skill
   */
  registerSkill(skill) {
    if (!skill.id || !skill.bimbaCoordinate || !skill.agentId) {
      throw new Error('Skills must have an ID, Bimba coordinate, and agent ID');
    }

    // Add default QL metadata if not provided
    if (!skill.qlMetadata) {
      skill.qlMetadata = this._inferQLMetadataFromBimbaCoordinate(skill.bimbaCoordinate);
    }

    // Store the skill
    this.skills.set(skill.id, skill);

    // Add to agent skills map
    if (!this.agentSkills.has(skill.agentId)) {
      this.agentSkills.set(skill.agentId, new Set());
    }
    this.agentSkills.get(skill.agentId).add(skill.id);

    console.log(`Registered skill: ${skill.name} (${skill.bimbaCoordinate}) for agent ${skill.agentId}`);
    return skill;
  }

  /**
   * Infer QL metadata from a Bimba coordinate
   * @private
   * @param {string} bimbaCoordinate The Bimba coordinate
   * @returns {Object} The inferred QL metadata
   */
  _inferQLMetadataFromBimbaCoordinate(bimbaCoordinate) {
    // Extract the last digit from the Bimba coordinate
    const match = bimbaCoordinate.match(/#(\d+)-(\d+)(?:-(\d+))?/);
    if (!match) {
      return {
        qlPosition: 0,
        contextFrame: '(0-5)',
        qlMode: 'ascending'
      };
    }

    const lastDigit = parseInt(match[match.length - 1], 10);
    const qlPosition = lastDigit % 6; // Ensure it's within the 0-5 range

    // Determine context frame based on QL position
    let contextFrame;
    switch (qlPosition) {
      case 0:
      case 1:
        contextFrame = '(0/1)';
        break;
      case 2:
        contextFrame = '(0/1/2)';
        break;
      case 3:
        contextFrame = '(0/1/2/3)';
        break;
      case 4:
        contextFrame = '(4.0-4/5)';
        break;
      case 5:
        contextFrame = '(5/0)';
        break;
      default:
        contextFrame = '(0-5)';
    }

    return {
      qlPosition,
      contextFrame,
      qlMode: 'ascending'
    };
  }

  /**
   * Get a skill by its ID
   * @param {string} skillId The ID of the skill to retrieve
   * @returns {Object|null} The skill, or null if not found
   */
  getSkillById(skillId) {
    return this.skills.get(skillId) || null;
  }

  /**
   * Get a skill by its Bimba coordinate
   * @param {string} coordinate The Bimba coordinate to look up
   * @returns {Object|null} The skill, or null if not found
   */
  getSkillByBimbaCoordinate(coordinate) {
    for (const skill of this.skills.values()) {
      if (skill.bimbaCoordinate === coordinate) {
        return skill;
      }
    }
    return null;
  }

  /**
   * Get all skills for a specific agent
   * @param {string} agentId The ID of the agent
   * @returns {Array} Array of skills provided by the agent
   */
  getSkillsForAgent(agentId) {
    const skillIds = this.agentSkills.get(agentId) || new Set();
    return Array.from(skillIds).map(id => this.getSkillById(id)).filter(Boolean);
  }

  /**
   * Get all skills in the registry
   * @returns {Array} Array of all registered skills
   */
  getAllSkills() {
    return Array.from(this.skills.values());
  }

  /**
   * Find skills that match a query
   * @param {Object} query Query parameters
   * @param {string} [query.agentId] Filter by agent ID
   * @param {string} [query.bimbaPrefix] Filter by Bimba coordinate prefix
   * @param {string} [query.textQuery] Filter by text in name or description
   * @param {number} [query.qlPosition] Filter by QL position (0-5)
   * @param {string} [query.contextFrame] Filter by QL context frame
   * @param {string} [query.qlMode] Filter by QL mode (ascending/descending)
   * @returns {Array} Array of matching skills
   */
  findSkills(query = {}) {
    let results = this.getAllSkills();

    // Filter by agent ID
    if (query.agentId) {
      results = results.filter(skill => skill.agentId === query.agentId);
    }

    // Filter by Bimba coordinate prefix
    if (query.bimbaPrefix) {
      results = results.filter(skill =>
        skill.bimbaCoordinate.startsWith(query.bimbaPrefix)
      );
    }

    // Filter by text query
    if (query.textQuery) {
      const lowerQuery = query.textQuery.toLowerCase();
      results = results.filter(skill =>
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by QL position
    if (query.qlPosition !== undefined) {
      results = results.filter(skill =>
        skill.qlMetadata && skill.qlMetadata.qlPosition === query.qlPosition
      );
    }

    // Filter by QL context frame
    if (query.contextFrame) {
      results = results.filter(skill =>
        skill.qlMetadata && skill.qlMetadata.contextFrame === query.contextFrame
      );
    }

    // Filter by QL mode
    if (query.qlMode) {
      results = results.filter(skill =>
        skill.qlMetadata && skill.qlMetadata.qlMode === query.qlMode
      );
    }

    return results;
  }

  /**
   * Create a relationship between two skills
   * @param {string} skillId1 ID of the first skill
   * @param {string} skillId2 ID of the second skill
   * @param {string} relationshipType Type of relationship (e.g., 'double_covered', 'nested', 'harmonic')
   * @returns {boolean} True if the relationship was created, false otherwise
   */
  createSkillRelationship(skillId1, skillId2, relationshipType) {
    const skill1 = this.getSkillById(skillId1);
    const skill2 = this.getSkillById(skillId2);

    if (!skill1 || !skill2) {
      console.error(`Cannot create relationship: one or both skills not found`);
      return false;
    }

    // Create relationship entry for skill1
    if (!this.skillRelationships.has(skillId1)) {
      this.skillRelationships.set(skillId1, new Map());
    }

    // Create relationship entry for skill2
    if (!this.skillRelationships.has(skillId2)) {
      this.skillRelationships.set(skillId2, new Map());
    }

    // Set bidirectional relationship
    this.skillRelationships.get(skillId1).set(skillId2, relationshipType);
    this.skillRelationships.get(skillId2).set(skillId1, relationshipType);

    console.log(`Created ${relationshipType} relationship between ${skill1.name} and ${skill2.name}`);
    return true;
  }

  /**
   * Get all skills related to a specific skill
   * @param {string} skillId ID of the skill
   * @param {string} [relationshipType] Optional filter by relationship type
   * @returns {Array} Array of related skills with relationship type
   */
  getRelatedSkills(skillId, relationshipType = null) {
    if (!this.skillRelationships.has(skillId)) {
      return [];
    }

    const relationships = this.skillRelationships.get(skillId);
    const results = [];

    for (const [relatedSkillId, relType] of relationships.entries()) {
      if (!relationshipType || relType === relationshipType) {
        const relatedSkill = this.getSkillById(relatedSkillId);
        if (relatedSkill) {
          results.push({
            skill: relatedSkill,
            relationshipType: relType
          });
        }
      }
    }

    return results;
  }

  /**
   * Register a skill with its double-covered counterpart
   * @param {Object} baseSkill The base skill
   * @param {Object} counterpartSkill The counterpart skill
   * @returns {Array} Array containing both registered skills
   */
  registerDoubleCoveredSkill(baseSkill, counterpartSkill) {
    // Register both skills
    this.registerSkill(baseSkill);
    this.registerSkill(counterpartSkill);

    // Create a relationship between them
    this.createSkillRelationship(baseSkill.id, counterpartSkill.id, 'double_covered');

    return [baseSkill, counterpartSkill];
  }

  /**
   * Register a skill with nested sub-skills following the QL pattern
   * @param {Object} parentSkill The parent skill
   * @param {Array} nestedSkills Array of nested skills
   * @returns {Object} The parent skill with references to nested skills
   */
  registerFractalSkill(parentSkill, nestedSkills) {
    // Register the parent skill
    this.registerSkill(parentSkill);

    // Register nested skills and create relationships
    for (const nestedSkill of nestedSkills) {
      this.registerSkill(nestedSkill);
      this.createSkillRelationship(parentSkill.id, nestedSkill.id, 'nested');

      // Add to nested skills map
      if (!this.nestedSkills.has(parentSkill.id)) {
        this.nestedSkills.set(parentSkill.id, new Set());
      }
      this.nestedSkills.get(parentSkill.id).add(nestedSkill.id);
    }

    return parentSkill;
  }

  /**
   * Get all nested skills for a parent skill
   * @param {string} parentSkillId ID of the parent skill
   * @returns {Array} Array of nested skills
   */
  getNestedSkills(parentSkillId) {
    if (!this.nestedSkills.has(parentSkillId)) {
      return [];
    }

    const nestedSkillIds = this.nestedSkills.get(parentSkillId);
    return Array.from(nestedSkillIds).map(id => this.getSkillById(id)).filter(Boolean);
  }

  /**
   * Find skills by QL context frame
   * @param {string} contextFrame The QL context frame (e.g., '(0/1)', '(0/1/2)')
   * @returns {Array} Array of skills matching the context frame
   */
  findSkillsByContextFrame(contextFrame) {
    return this.findSkills({ contextFrame });
  }

  /**
   * Find skills by QL position
   * @param {number} qlPosition The QL position (0-5)
   * @returns {Array} Array of skills matching the QL position
   */
  findSkillsByQLPosition(qlPosition) {
    return this.findSkills({ qlPosition });
  }
}

module.exports = BimbaSkillsRegistry;
