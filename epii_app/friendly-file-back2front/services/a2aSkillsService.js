/**
 * A2A Skills Service
 * Provides the interface between agents and the skills registry
 * Enables A2A-aligned skill execution and orchestration
 *
 * Epic: 002 - A2A Skill Management Framework
 * Story: 2.1 - Skills Registry and Router Implementation
 */

const { getInstance } = require('../skills/bimba-skills-registry');

class A2ASkillsService {
  constructor() {
    this.registry = getInstance(); // Use singleton instance
    this.executionHistory = new Map();
    this.performanceMetrics = new Map();
  }

  /**
   * Execute a skill by ID with given parameters
   * @param {string} skillId - The ID of the skill to execute
   * @param {Object} params - Parameters to pass to the skill
   * @param {Object} [context] - Execution context (agent info, etc.)
   * @returns {Promise<Object>} - Skill execution result
   */
  async executeSkill(skillId, params, context = {}) {
    const startTime = Date.now();
    const logPrefix = `[A2ASkills:${skillId}]`;

    console.log(`${logPrefix} Executing skill with params:`, JSON.stringify(params, null, 2));

    try {
      // Get skill from registry
      const skill = this.registry.getSkillById(skillId);
      if (!skill) {
        throw new Error(`Skill not found: ${skillId}`);
      }

      // Validate skill handler
      if (!skill.handler || typeof skill.handler !== 'function') {
        throw new Error(`Skill ${skillId} has no valid handler function`);
      }

      // Add execution context
      const enhancedParams = {
        ...params,
        _context: {
          agentId: context.agentId || 'unknown',
          agentCoordinate: context.agentCoordinate || '#5',
          executionId: this._generateExecutionId(),
          timestamp: new Date().toISOString(),
          ...context
        }
      };

      // Execute skill
      const result = await skill.handler(enhancedParams);

      // Record execution metrics
      const executionTime = Date.now() - startTime;
      this._recordExecution(skillId, enhancedParams, result, executionTime);

      console.log(`${logPrefix} Completed in ${executionTime}ms`);

      return {
        success: true,
        skillId,
        result,
        executionTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`${logPrefix} Error:`, error);

      // Record failed execution
      this._recordExecution(skillId, params, { error: error.message }, executionTime, false);

      return {
        success: false,
        skillId,
        error: error.message,
        executionTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Find skills that match given criteria
   * @param {Object} criteria - Search criteria
   * @param {string} [criteria.query] - Text query for skill name/description
   * @param {string} [criteria.bimbaCoordinate] - Bimba coordinate to match
   * @param {string} [criteria.agentId] - Agent ID to filter by
   * @param {number} [criteria.qlPosition] - QL position to match
   * @returns {Array} - Array of matching skills
   */
  findSkills(criteria = {}) {
    const logPrefix = `[A2ASkills:Search]`;
    console.log(`${logPrefix} Searching skills with criteria:`, criteria);

    // Convert bimbaCoordinate to bimbaPrefix for registry search
    const searchCriteria = { ...criteria };
    if (criteria.bimbaCoordinate) {
      searchCriteria.bimbaPrefix = criteria.bimbaCoordinate;
      delete searchCriteria.bimbaCoordinate;
    }

    const results = this.registry.findSkills(searchCriteria);
    console.log(`${logPrefix} Found ${results.length} matching skills`);

    return results.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      bimbaCoordinate: skill.bimbaCoordinate,
      agentId: skill.agentId,
      qlMetadata: skill.qlMetadata
    }));
  }

  /**
   * Get skill by Bimba coordinate
   * @param {string} coordinate - Bimba coordinate
   * @returns {Object|null} - Skill metadata or null
   */
  getSkillByCoordinate(coordinate) {
    const skill = this.registry.getSkillByBimbaCoordinate(coordinate);
    if (!skill) return null;

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      bimbaCoordinate: skill.bimbaCoordinate,
      agentId: skill.agentId,
      qlMetadata: skill.qlMetadata
    };
  }

  /**
   * Execute the unified RAG skill - convenience method
   * @param {Object} params - UnifiedRAG parameters
   * @param {Object} [context] - Execution context
   * @returns {Promise<Object>} - Unified context result
   */
  async executeUnifiedRAG(params, context = {}) {
    return this.executeSkill('unifiedRAG', params, context);
  }

  /**
   * Get skills for a specific agent
   * @param {string} agentId - Agent ID
   * @returns {Array} - Array of skills for the agent
   */
  getSkillsForAgent(agentId) {
    const skills = this.registry.getSkillsForAgent(agentId);
    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      bimbaCoordinate: skill.bimbaCoordinate,
      qlMetadata: skill.qlMetadata
    }));
  }

  /**
   * Get all available skills
   * @returns {Array} - Array of all skills
   */
  getAllSkills() {
    const skills = this.registry.getAllSkills();
    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      bimbaCoordinate: skill.bimbaCoordinate,
      agentId: skill.agentId,
      qlMetadata: skill.qlMetadata
    }));
  }

  /**
   * Get execution history for a skill
   * @param {string} skillId - Skill ID
   * @param {number} [limit=10] - Maximum number of executions to return
   * @returns {Array} - Array of execution records
   */
  getExecutionHistory(skillId, limit = 10) {
    const history = this.executionHistory.get(skillId) || [];
    return history.slice(-limit);
  }

  /**
   * Get performance metrics for a skill
   * @param {string} skillId - Skill ID
   * @returns {Object} - Performance metrics
   */
  getPerformanceMetrics(skillId) {
    return this.performanceMetrics.get(skillId) || {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecuted: null
    };
  }

  /**
   * Register a new skill
   * @param {Object} skillDefinition - Skill definition
   * @returns {Object} - Registered skill
   */
  registerSkill(skillDefinition) {
    return this.registry.registerSkill(skillDefinition);
  }

  /**
   * Create a relationship between skills
   * @param {string} skillId1 - First skill ID
   * @param {string} skillId2 - Second skill ID
   * @param {string} relationshipType - Type of relationship
   * @returns {boolean} - Success status
   */
  createSkillRelationship(skillId1, skillId2, relationshipType) {
    return this.registry.createSkillRelationship(skillId1, skillId2, relationshipType);
  }

  /**
   * Get related skills
   * @param {string} skillId - Skill ID
   * @param {string} [relationshipType] - Optional relationship type filter
   * @returns {Array} - Array of related skills
   */
  getRelatedSkills(skillId, relationshipType = null) {
    return this.registry.getRelatedSkills(skillId, relationshipType);
  }

  /**
   * Generate unique execution ID
   * @private
   */
  _generateExecutionId() {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Record skill execution for metrics and history
   * @private
   */
  _recordExecution(skillId, params, result, executionTime, success = true) {
    // Record in execution history
    if (!this.executionHistory.has(skillId)) {
      this.executionHistory.set(skillId, []);
    }

    const history = this.executionHistory.get(skillId);
    history.push({
      timestamp: new Date().toISOString(),
      params,
      result,
      executionTime,
      success
    });

    // Keep only last 50 executions
    if (history.length > 50) {
      history.shift();
    }

    // Update performance metrics
    const metrics = this.performanceMetrics.get(skillId) || {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      totalExecutionTime: 0,
      averageExecutionTime: 0,
      lastExecuted: null
    };

    metrics.totalExecutions++;
    metrics.totalExecutionTime += executionTime;
    metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalExecutions;
    metrics.lastExecuted = new Date().toISOString();

    if (success) {
      metrics.successfulExecutions++;
    } else {
      metrics.failedExecutions++;
    }

    this.performanceMetrics.set(skillId, metrics);
  }

  /**
   * Get service status and statistics
   * @returns {Object} - Service status
   */
  getServiceStatus() {
    const allSkills = this.getAllSkills();
    const totalExecutions = Array.from(this.performanceMetrics.values())
      .reduce((sum, metrics) => sum + metrics.totalExecutions, 0);

    return {
      status: 'active',
      skillsRegistered: allSkills.length,
      totalExecutions,
      availableSkills: allSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        bimbaCoordinate: skill.bimbaCoordinate
      })),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
module.exports = new A2ASkillsService();
