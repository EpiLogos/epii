/**
 * Skills Module Index
 * Exports all components of the skills module
 *
 * Bimba Coordinate: #5-4
 * Represents the skills module of the Siva-Shakti layer
 */

const { getInstance } = require('./bimba-skills-registry');
const BimbaSkillsRouter = require('./bimba-skills-router');
const { bpMCPService } = require('../../subsystems/5_epii/skills/epii-skills-initializer');

// In a real implementation, we would import the actual BPMCP service
// const bpMCPService = require('../services/bpMCPService');

/**
 * Initialize the skills module
 * @param {Object} epiiAgentService The Epii agent service
 * @param {Object} [options] Additional options
 * @param {Object} [options.bpMCPService] The BPMCP service to use (defaults to mock)
 * @returns {Object} The initialized skills module
 */
async function initializeSkillsModule(epiiAgentService, options = {}) {
  // Get the singleton skills registry (already has all skills registered including #5-0)
  const skillsRegistry = await getInstance();

  // Create the skills router
  const skillsRouter = new BimbaSkillsRouter(skillsRegistry);

  return {
    skillsRegistry,
    skillsRouter,
    bpMCPService: options.bpMCPService || bpMCPService
  };
}

const BimbaSkillsRegistry = require('./bimba-skills-registry');

module.exports = {
  BimbaSkillsRegistry,
  BimbaSkillsRouter,
  getInstance,
  initializeSkillsModule,
  bpMCPService
};
