/**
 * Bimba Skills Router
 * Routes requests to the appropriate skill based on Bimba coordinates and Quaternary Logic
 *
 * Bimba Coordinate: #5-4-4
 * Represents the skills routing component of the Siva-Shakti layer
 */

class BimbaSkillsRouter {
  constructor(skillsRegistry) {
    this.skillsRegistry = skillsRegistry;
  }

  /**
   * Route a request to the appropriate skill
   * @param {Object} request The request to route
   * @param {string} [request.skillId] Explicit skill ID to use
   * @param {string} [request.bimbaCoordinate] Bimba coordinate to route to
   * @param {string} [request.content] Content of the request
   * @param {Object} [request.context] Additional context for the request
   * @param {number} [request.qlPosition] Position in the QL cycle (0-5)
   * @param {string} [request.contextFrame] QL context frame (e.g., '(0/1)', '(0/1/2)')
   * @param {string} [request.qlMode] QL mode (e.g., 'ascending', 'descending')
   * @returns {Promise<Object>} The result of the skill execution
   */
  async routeRequest(request) {
    console.log(`Routing request: ${JSON.stringify(request)}`);

    // Find the appropriate skill
    let skill = null;

    // If skill ID is provided, use it directly
    if (request.skillId) {
      skill = this.skillsRegistry.getSkillById(request.skillId);
      if (!skill) {
        throw new Error(`Skill not found with ID: ${request.skillId}`);
      }
    }
    // If Bimba coordinate is provided, look it up
    else if (request.bimbaCoordinate) {
      skill = this.skillsRegistry.getSkillByBimbaCoordinate(request.bimbaCoordinate);
      if (!skill) {
        throw new Error(`No skill found for Bimba coordinate: ${request.bimbaCoordinate}`);
      }
    }
    // If QL position is provided, find a skill matching that position
    else if (request.qlPosition !== undefined) {
      const skills = this.skillsRegistry.findSkillsByQLPosition(request.qlPosition);
      if (skills.length > 0) {
        // If multiple skills match, use content to determine the best match
        if (skills.length > 1 && request.content) {
          skill = await this.determineSkillFromContentAndQLPosition(request.content, request.qlPosition, request.context);
        } else {
          skill = skills[0];
        }
      }
      if (!skill) {
        throw new Error(`No skill found for QL position: ${request.qlPosition}`);
      }
    }
    // If context frame is provided, find a skill matching that frame
    else if (request.contextFrame) {
      const skills = this.skillsRegistry.findSkillsByContextFrame(request.contextFrame);
      if (skills.length > 0) {
        // If multiple skills match, use content to determine the best match
        if (skills.length > 1 && request.content) {
          skill = await this.determineSkillFromContentAndContextFrame(request.content, request.contextFrame, request.context);
        } else {
          skill = skills[0];
        }
      }
      if (!skill) {
        throw new Error(`No skill found for context frame: ${request.contextFrame}`);
      }
    }
    // Otherwise, determine the skill based on content
    else if (request.content) {
      skill = await this.determineSkillFromContent(request.content, request.context);
      if (!skill) {
        throw new Error(`Could not determine appropriate skill for request`);
      }
    }
    else {
      throw new Error(`Request must include skillId, bimbaCoordinate, qlPosition, contextFrame, or content`);
    }

    console.log(`Selected skill: ${skill.name} (${skill.bimbaCoordinate}), QL Position: ${skill.qlMetadata?.qlPosition}, Context Frame: ${skill.qlMetadata?.contextFrame}`);

    // Check if this skill has a double-covered counterpart
    const relatedSkills = this.skillsRegistry.getRelatedSkills(skill.id, 'double_covered');
    if (relatedSkills.length > 0 && request.qlMode) {
      // If qlMode is specified, try to find a matching counterpart
      const counterpart = relatedSkills.find(rel =>
        rel.skill.qlMetadata && rel.skill.qlMetadata.qlMode === request.qlMode
      );
      if (counterpart) {
        skill = counterpart.skill;
        console.log(`Using double-covered counterpart: ${skill.name} (${skill.qlMetadata.qlMode} mode)`);
      }
    }

    // Execute the skill
    try {
      // Add QL metadata to the context if available
      const enhancedContext = {
        ...request.context,
        qlMetadata: skill.qlMetadata
      };

      const result = await skill.handler(request.content, enhancedContext);
      return {
        success: true,
        skillId: skill.id,
        bimbaCoordinate: skill.bimbaCoordinate,
        agentId: skill.agentId,
        qlMetadata: skill.qlMetadata,
        result
      };
    } catch (error) {
      console.error(`Error executing skill ${skill.id}:`, error);
      return {
        success: false,
        skillId: skill.id,
        bimbaCoordinate: skill.bimbaCoordinate,
        agentId: skill.agentId,
        qlMetadata: skill.qlMetadata,
        error: error.message
      };
    }
  }

  /**
   * Determine the appropriate skill based on content
   * @param {string} content The content to analyze
   * @param {Object} context Additional context
   * @returns {Promise<Object>} The selected skill
   */
  async determineSkillFromContent(content, context) {
    // This would typically use an LLM to determine the appropriate skill
    // For now, we'll use a simple heuristic based on keywords

    const contentLower = content.toLowerCase();

    // Check for explicit Bimba coordinate mentions
    const bimbaMatch = content.match(/#(\d+)-(\d+)/);
    if (bimbaMatch) {
      const coordinate = bimbaMatch[0];
      const skill = this.skillsRegistry.getSkillByBimbaCoordinate(coordinate);
      if (skill) return skill;
    }

    // Check for QL position mentions
    const qlPositionMatch = contentLower.match(/\b(position|stage|phase|ql position|ql stage|ql phase)\s*(\d)\b/);
    if (qlPositionMatch) {
      const position = parseInt(qlPositionMatch[2], 10);
      if (position >= 0 && position <= 5) {
        const skills = this.skillsRegistry.findSkillsByQLPosition(position);
        if (skills.length > 0) {
          return skills[0];
        }
      }
    }

    // Check for context frame mentions
    const contextFrameMatch = contentLower.match(/\b(context frame|frame|context)\s*\(([^)]+)\)/);
    if (contextFrameMatch) {
      const frame = `(${contextFrameMatch[2]})`;
      const skills = this.skillsRegistry.findSkillsByContextFrame(frame);
      if (skills.length > 0) {
        return skills[0];
      }
    }

    // Check for keywords related to different skills
    if (contentLower.includes('identity') || contentLower.includes('self')) {
      return this.skillsRegistry.getSkillByBimbaCoordinate('#5-0');
    }

    if (contentLower.includes('philosophy') || contentLower.includes('concept')) {
      return this.skillsRegistry.getSkillByBimbaCoordinate('#5-1');
    }

    if (contentLower.includes('architecture') || contentLower.includes('system')) {
      return this.skillsRegistry.getSkillByBimbaCoordinate('#5-2');
    }

    if (contentLower.includes('visualization') || contentLower.includes('display')) {
      return this.skillsRegistry.getSkillByBimbaCoordinate('#5-3');
    }

    if (contentLower.includes('integration') || contentLower.includes('connect')) {
      return this.skillsRegistry.getSkillByBimbaCoordinate('#5-4');
    }

    if (contentLower.includes('process') || contentLower.includes('flow')) {
      return this.skillsRegistry.getSkillByBimbaCoordinate('#5-5');
    }

    // Check for QL-related keywords
    if (contentLower.includes('potential') || contentLower.includes('foundation') || contentLower.includes('a-logos')) {
      return this._findSkillByQLPosition(0);
    }

    if (contentLower.includes('material') || contentLower.includes('what') || contentLower.includes('pre-logos')) {
      return this._findSkillByQLPosition(1);
    }

    if (contentLower.includes('process') || contentLower.includes('how') || contentLower.includes('pro-logos')) {
      return this._findSkillByQLPosition(2);
    }

    if (contentLower.includes('form') || contentLower.includes('who') || contentLower.includes('logos')) {
      return this._findSkillByQLPosition(3);
    }

    if (contentLower.includes('context') || contentLower.includes('where') || contentLower.includes('epi-logos')) {
      return this._findSkillByQLPosition(4);
    }

    if (contentLower.includes('purpose') || contentLower.includes('why') || contentLower.includes('an-a-logos')) {
      return this._findSkillByQLPosition(5);
    }

    // Default to the first skill for the Epii agent
    const epiiSkills = this.skillsRegistry.getSkillsForAgent('epii-agent');
    return epiiSkills[0] || null;
  }

  /**
   * Find a skill by QL position
   * @private
   * @param {number} position The QL position (0-5)
   * @returns {Object|null} The skill, or null if not found
   */
  _findSkillByQLPosition(position) {
    const skills = this.skillsRegistry.findSkillsByQLPosition(position);
    return skills.length > 0 ? skills[0] : null;
  }

  /**
   * Determine the appropriate skill based on content and QL position
   * @param {string} content The content to analyze
   * @param {number} qlPosition The QL position (0-5)
   * @param {Object} context Additional context
   * @returns {Promise<Object>} The selected skill
   */
  async determineSkillFromContentAndQLPosition(content, qlPosition, context) {
    // Get all skills matching the QL position
    const skills = this.skillsRegistry.findSkillsByQLPosition(qlPosition);
    if (skills.length === 0) {
      return null;
    }

    // If only one skill matches, return it
    if (skills.length === 1) {
      return skills[0];
    }

    // Otherwise, use content to determine the best match
    const contentLower = content.toLowerCase();

    // Check for explicit Bimba coordinate mentions
    const bimbaMatch = content.match(/#(\d+)-(\d+)/);
    if (bimbaMatch) {
      const coordinate = bimbaMatch[0];
      const skill = skills.find(s => s.bimbaCoordinate === coordinate);
      if (skill) return skill;
    }

    // Check for keywords related to different skills
    for (const skill of skills) {
      const bimbaCoord = skill.bimbaCoordinate;

      if (bimbaCoord.includes('#5-0') && (contentLower.includes('identity') || contentLower.includes('self'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-1') && (contentLower.includes('philosophy') || contentLower.includes('concept'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-2') && (contentLower.includes('architecture') || contentLower.includes('system'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-3') && (contentLower.includes('visualization') || contentLower.includes('display'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-4') && (contentLower.includes('integration') || contentLower.includes('connect'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-5') && (contentLower.includes('process') || contentLower.includes('flow'))) {
        return skill;
      }
    }

    // If no specific match is found, return the first skill
    return skills[0];
  }

  /**
   * Determine the appropriate skill based on content and context frame
   * @param {string} content The content to analyze
   * @param {string} contextFrame The QL context frame
   * @param {Object} context Additional context
   * @returns {Promise<Object>} The selected skill
   */
  async determineSkillFromContentAndContextFrame(content, contextFrame, context) {
    // Get all skills matching the context frame
    const skills = this.skillsRegistry.findSkillsByContextFrame(contextFrame);
    if (skills.length === 0) {
      return null;
    }

    // If only one skill matches, return it
    if (skills.length === 1) {
      return skills[0];
    }

    // Otherwise, use content to determine the best match
    const contentLower = content.toLowerCase();

    // Check for explicit Bimba coordinate mentions
    const bimbaMatch = content.match(/#(\d+)-(\d+)/);
    if (bimbaMatch) {
      const coordinate = bimbaMatch[0];
      const skill = skills.find(s => s.bimbaCoordinate === coordinate);
      if (skill) return skill;
    }

    // Check for QL position mentions
    const qlPositionMatch = contentLower.match(/\b(position|stage|phase|ql position|ql stage|ql phase)\s*(\d)\b/);
    if (qlPositionMatch) {
      const position = parseInt(qlPositionMatch[2], 10);
      if (position >= 0 && position <= 5) {
        const skill = skills.find(s => s.qlMetadata && s.qlMetadata.qlPosition === position);
        if (skill) return skill;
      }
    }

    // Check for keywords related to different skills
    for (const skill of skills) {
      const bimbaCoord = skill.bimbaCoordinate;

      if (bimbaCoord.includes('#5-0') && (contentLower.includes('identity') || contentLower.includes('self'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-1') && (contentLower.includes('philosophy') || contentLower.includes('concept'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-2') && (contentLower.includes('architecture') || contentLower.includes('system'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-3') && (contentLower.includes('visualization') || contentLower.includes('display'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-4') && (contentLower.includes('integration') || contentLower.includes('connect'))) {
        return skill;
      }

      if (bimbaCoord.includes('#5-5') && (contentLower.includes('process') || contentLower.includes('flow'))) {
        return skill;
      }
    }

    // If no specific match is found, return the first skill
    return skills[0];
  }
}

module.exports = BimbaSkillsRouter;
