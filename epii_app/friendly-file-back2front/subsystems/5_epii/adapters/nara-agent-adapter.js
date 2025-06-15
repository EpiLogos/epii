/**
 * Nara Agent Adapter
 * Connects the A2A protocol with the existing Nara agent
 *
 * Bimba Coordinate: #5-4-4
 * Represents the Nara Agent adapter within the Siva-Shakti layer
 */

const { v4: uuidv4 } = require('uuid');
const { initializeNaraSkills } = require('../../4_nara/skills/nara-skills-initializer');
const { BimbaSkillsRegistry } = require('../../../shared/services/bimba-skills-registry');
const { BimbaSkillsRouter } = require('../../../shared/services/bimba-skills-router');
const naraAgentCard = require('../../4_nara/agent-cards/nara-agent-card');
const TaskStateManager = require('../../../shared/a2a/task-state-manager');

/**
 * Initialize the skills module
 * @param {Object} naraAgentService The Nara agent service
 * @returns {Object} The skills registry and router
 */
function initializeSkillsModule(naraAgentService) {
  // Create a new skills registry
  const skillsRegistry = new BimbaSkillsRegistry();

  // Initialize Nara skills
  initializeNaraSkills(naraAgentService, skillsRegistry);

  // Create a skills router
  const skillsRouter = new BimbaSkillsRouter(skillsRegistry);

  return { skillsRegistry, skillsRouter };
}

/**
 * Adapter class that connects the A2A protocol with the existing Nara agent
 * This allows the existing LangChain/LangGraph implementation to be used with A2A
 */
class NaraAgentAdapter {
  constructor(options = {}) {
    this.naraAgentService = options.naraAgentService; // Existing Nara agent service
    this.taskStore = new Map(); // Store for active tasks

    // Initialize the skills module
    const { skillsRegistry, skillsRouter } = initializeSkillsModule(this.naraAgentService);
    this.skillsRegistry = skillsRegistry;
    this.skillsRouter = skillsRouter;

    // Bind methods
    this.handleTask = this.handleTask.bind(this);
    this.getAgentCard = this.getAgentCard.bind(this);
    this.getSkillsForAgent = this.getSkillsForAgent.bind(this);
  }

  /**
   * Get all skills for a specific agent
   * @param {string} agentId The ID of the agent
   * @returns {Array} Array of skills provided by the agent
   */
  getSkillsForAgent(agentId) {
    return this.skillsRegistry.getSkillsForAgent(agentId);
  }

  /**
   * Get the agent card for the Nara agent
   * @returns {Object} The agent card
   */
  getAgentCard() {
    return naraAgentCard;
  }

  /**
   * Handle an A2A task by translating it to Nara agent calls
   * @param {Object} task The A2A task
   * @param {Function} updateCallback Callback for task updates
   * @returns {Promise<Object>} The task result
   */
  async handleTask(task, updateCallback) {
    // Create a task state manager for this task
    const taskManager = new TaskStateManager(task.id);
    this.taskStore.set(task.id, taskManager);

    try {
      console.log(`Nara Agent Adapter: Handling task ${task.id}`);
      
      // Extract the message from the task
      const message = task.messages[task.messages.length - 1];
      
      // Extract text content from the message
      let textContent = '';
      let files = [];
      
      if (message.parts) {
        for (const part of message.parts) {
          if (part.type === 'text') {
            textContent += part.text;
          } else if (part.type === 'file') {
            files.push(part.file);
          }
        }
      }
      
      // Update task state
      taskManager.updateState('received');
      
      // Prepare initial state for Nara agent
      const initialState = {
        query: textContent,
        user_id: task.user_id || 'anonymous',
        run_direction: 'synthesis', // Default to synthesis mode
        history: task.history || [],
        mode: 'nara'
      };
      
      // Send working status update
      if (updateCallback) {
        updateCallback({
          status: {
            state: 'working',
            message: {
              role: 'agent',
              parts: [{ type: 'text', text: 'Processing your request...' }]
            },
            timestamp: new Date().toISOString()
          },
          final: false
        });
        
        // Update task state
        taskManager.updateState('working');
      }
      
      // Extract Bimba coordinates from message metadata if available
      let bimbaCoordinate = null;
      if (message.metadata && message.metadata.bimbaCoordinates && message.metadata.bimbaCoordinates.length > 0) {
        bimbaCoordinate = message.metadata.bimbaCoordinates[0];
      }
      
      // Prepare the request for the skills router
      const request = {
        content: textContent,
        bimbaCoordinate,
        context: {
          ...initialState,
          taskId: task.id,
          files
        }
      };
      
      // Log the request
      console.log(`Routing task ${task.id} to skills router with request:`, {
        content: textContent.substring(0, 100) + (textContent.length > 100 ? '...' : ''),
        bimbaCoordinate,
        contextKeys: Object.keys(request.context)
      });
      
      // Route the request to the appropriate skill
      const routerResult = await this.skillsRouter.routeRequest(request);
      
      // Check if the router was successful
      if (!routerResult.success) {
        throw new Error(`Skill execution failed: ${routerResult.error}`);
      }
      
      // Extract the result
      const result = routerResult.result;
      
      // Send intermediate update if processing is taking time
      if (updateCallback && result.processingStage) {
        updateCallback({
          status: {
            state: 'working',
            message: {
              role: 'agent',
              parts: [{ type: 'text', text: `${result.processingStage}...` }]
            },
            timestamp: new Date().toISOString()
          },
          final: false
        });
      }
      
      // Extract the response content
      const responseContent = result.content || result.response || result.personalizedResponse || result.interpretation || result.guidance || `Response from Nara agent (${routerResult.skillId})`;
      
      // Update task state
      taskManager.updateState('completed');
      
      // Send completed status update
      if (updateCallback) {
        updateCallback({
          status: {
            state: 'completed',
            message: {
              role: 'agent',
              parts: [{ type: 'text', text: responseContent }]
            },
            timestamp: new Date().toISOString()
          },
          final: true
        });
      }
      
      // Return the task result
      return {
        id: task.id,
        status: {
          state: 'completed',
          message: {
            role: 'agent',
            parts: [{ type: 'text', text: responseContent }]
          },
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error(`Error processing task ${task.id}:`, error);
      
      // Update task state with the error
      taskManager.updateState('failed');
      
      // Send error status update
      if (updateCallback) {
        updateCallback({
          status: {
            state: 'failed',
            message: {
              role: 'agent',
              parts: [{ type: 'text', text: `Error: ${error.message}` }]
            },
            timestamp: new Date().toISOString()
          },
          final: true
        });
      }
      
      return {
        id: task.id,
        status: {
          state: 'failed',
          message: {
            role: 'agent',
            parts: [{ type: 'text', text: `Error: ${error.message}` }]
          },
          timestamp: new Date().toISOString()
        }
      };
    } finally {
      // Clean up task state after completion
      setTimeout(() => {
        this.taskStore.delete(task.id);
      }, 60000); // Keep task state for 1 minute for potential follow-up
    }
  }
}

module.exports = NaraAgentAdapter;
