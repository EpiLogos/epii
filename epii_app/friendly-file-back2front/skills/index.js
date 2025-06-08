/**
 * Skills Module Index
 * Exports all components of the skills module
 *
 * Bimba Coordinate: #5-4
 * Represents the skills module of the Siva-Shakti layer
 */

const { getInstance, initializeEpiiOperationalSkills } = require('./bimba-skills-registry');
const BimbaSkillsRouter = require('./bimba-skills-router');
const { bpMCPService } = require('./epii-skills-initializer');

// In a real implementation, we would import the actual BPMCP service
// const bpMCPService = require('../services/bpMCPService');

/**
 * Initialize the skills module
 * @param {Object} epiiAgentService The Epii agent service
 * @param {Object} [options] Additional options
 * @param {Object} [options.bpMCPService] The BPMCP service to use (defaults to mock)
 * @returns {Object} The initialized skills module
 */
function initializeSkillsModule(epiiAgentService, options = {}) {
  // Get the singleton skills registry (already has UnifiedRAG registered)
  const skillsRegistry = getInstance();

  // Use provided BPMCP service or the mock one
  const mcpService = options.bpMCPService || bpMCPService;

  // Initialize the Epii operational skills instead of domain-focused skills
  if (epiiAgentService) {
    initializeEpiiOperationalSkills(epiiAgentService, skillsRegistry, mcpService);
  }

  // Create the skills router
  const skillsRouter = new BimbaSkillsRouter(skillsRegistry);

  return {
    skillsRegistry,
    skillsRouter,
    bpMCPService: mcpService
  };
}

const BimbaSkillsRegistry = require('./bimba-skills-registry');

module.exports = {
  BimbaSkillsRegistry,
  BimbaSkillsRouter,
  getInstance,
  initializeEpiiOperationalSkills,
  initializeSkillsModule,
  bpMCPService
};
