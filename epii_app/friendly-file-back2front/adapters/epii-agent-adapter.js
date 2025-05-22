/**
 * Epii Agent Adapter
 * Bridges between the A2A protocol and the existing Epii agent implementation
 *
 * Bimba Coordinate: #5-4-5
 * Represents the adapter for the Epii Agent within the Siva-Shakti layer
 */

const TaskStateManager = require('../task-state-manager');
const epiiAgentCard = require('../agent-cards/epii-agent-card');
const { v4: uuidv4 } = require('uuid');
const { initializeSkillsModule } = require('../skills');

/**
 * Adapter class that connects the A2A protocol with the existing Epii agent
 * This allows the existing LangChain/LangGraph implementation to be used with A2A
 */
class EpiiAgentAdapter {
  constructor(options = {}) {
    this.epiiAgentService = options.epiiAgentService; // Existing Epii agent service
    this.taskStore = new Map(); // Store for active tasks

    // Initialize the skills module
    const { skillsRegistry, skillsRouter } = initializeSkillsModule(this.epiiAgentService);
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
   * Get the agent card for the Epii agent
   * @returns {Object} The agent card
   */
  getAgentCard() {
    return epiiAgentCard;
  }

  /**
   * Handle an A2A task by translating it to Epii agent calls
   * @param {Object} task The A2A task
   * @param {Function} updateCallback Callback for task updates
   * @returns {Promise<Object>} The task result
   */
  async handleTask(task, updateCallback) {
    // Create a task state manager for this task
    const taskManager = new TaskStateManager(task.id);
    this.taskStore.set(task.id, taskManager);

    try {
      // Extract message content from the task
      const message = task.message;
      if (!message || !message.parts || message.parts.length === 0) {
        throw new Error('Invalid message format: missing parts');
      }

      // Extract text content from message parts
      const textParts = message.parts.filter(part => part.type === 'text');
      if (textParts.length === 0) {
        throw new Error('No text content found in message');
      }

      const textContent = textParts.map(part => part.text).join('\n');

      // Extract file content if present
      const fileParts = message.parts.filter(part => part.type === 'file');
      const files = fileParts.map(part => ({
        name: part.file.name,
        content: part.file.bytes,
        mimeType: part.file.mimeType
      }));

      // Prepare initial state for Epii agent
      const initialState = {
        documentContent: textContent,
        targetCoordinate: null, // Extract from message metadata if available
        sourceFileName: files.length > 0 ? files[0].name : 'A2A Task',
        documentId: task.id,
        mode: 'epii' // Use Epii mode for document analysis
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

      // Convert Epii agent result to A2A artifact
      const artifact = {
        parts: [
          {
            type: 'text',
            text: result.epiiPerspective || result.response || 'No result available'
          }
        ],
        index: 0
      };

      // Add metadata if available
      if (result.metadata || result.bimbaCoordinates) {
        artifact.metadata = {
          ...(result.metadata || {}),
          bimbaCoordinates: result.bimbaCoordinates || []
        };
      }

      // Update task state with the result
      taskManager.addArtifact(artifact);
      taskManager.advanceQLStage(); // Move to next QL stage
      taskManager.advanceQLStage(); // Move to next QL stage
      taskManager.advanceQLStage(); // Move to next QL stage
      taskManager.advanceQLStage(); // Move to next QL stage
      taskManager.advanceQLStage(); // Move to next QL stage
      taskManager.advanceQLStage(); // Move to final QL stage (completed)

      // Send completed status update
      if (updateCallback) {
        updateCallback({
          status: {
            state: 'completed',
            timestamp: new Date().toISOString()
          },
          artifact,
          final: true
        });
      }

      return {
        id: task.id,
        status: {
          state: 'completed',
          timestamp: new Date().toISOString()
        },
        artifacts: [artifact]
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

  /**
   * Get the current state of a task
   * @param {string} taskId The task ID
   * @returns {Object|null} The task state or null if not found
   */
  getTaskState(taskId) {
    const taskManager = this.taskStore.get(taskId);
    return taskManager ? taskManager.getState() : null;
  }
}

module.exports = EpiiAgentAdapter;
