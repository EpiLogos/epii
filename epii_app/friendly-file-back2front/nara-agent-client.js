/**
 * Nara Agent Client
 * Client for the Nara agent to communicate with other agents via A2A
 *
 * Bimba Coordinate: #5-4-4
 * Represents the Nara Agent client within the Siva-Shakti layer
 */

const A2AClientService = require('./a2a-client.service');
const { v4: uuidv4 } = require('uuid');

/**
 * Client for the Nara agent to communicate with other agents via A2A
 */
class NaraAgentClient {
  /**
   * Create a new Nara agent client
   * @param {Object} options Options for the client
   * @param {Object} options.naraAgentService The Nara agent service
   * @param {string} options.url The URL of the A2A server
   */
  constructor(options = {}) {
    this.naraAgentService = options.naraAgentService;
    this.url = options.url || 'ws://localhost:3033';
    
    // Create an A2A client
    this.client = new A2AClientService({
      url: this.url,
      agentId: 'nara-agent',
      agentName: 'Nara Agent',
      subsystemCoordinate: '#4'
    });
    
    // Bind methods
    this.connect = this.connect.bind(this);
    this.close = this.close.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.handleQueryRef = this.handleQueryRef.bind(this);
    
    // Register message handlers
    this.client.registerMessageHandler('request', this.handleRequest);
    this.client.registerMessageHandler('query-ref', this.handleQueryRef);
  }
  
  /**
   * Connect to the A2A server
   * @returns {Promise<void>}
   */
  async connect() {
    await this.client.connect();
    console.log('Nara agent client connected to A2A server');
  }
  
  /**
   * Close the connection to the A2A server
   */
  close() {
    this.client.close();
    console.log('Nara agent client disconnected from A2A server');
  }
  
  /**
   * Handle a request message
   * @param {Object} message The A2A message
   * @returns {Promise<void>}
   */
  async handleRequest(message) {
    console.log(`Nara agent client received request from ${message.sender_id}:`, message.content);
    
    try {
      // Extract content from the message
      const { content, metadata } = message;
      
      // Prepare state for the Nara agent
      const state = {
        query: typeof content === 'string' ? content : JSON.stringify(content),
        user_id: content.userId || 'anonymous',
        run_direction: 'synthesis',
        history: [],
        mode: 'nara'
      };
      
      // Add metadata to state if available
      if (metadata) {
        if (metadata.bimbaCoordinates && metadata.bimbaCoordinates.length > 0) {
          state.targetCoordinate = metadata.bimbaCoordinates[0];
        }
        if (metadata.qlStage !== undefined) {
          state.qlStage = metadata.qlStage;
        }
        if (metadata.contextFrame) {
          state.contextFrame = metadata.contextFrame;
        }
      }
      
      // Process the request with the Nara agent
      let result;
      if (this.naraAgentService.processChatMessage) {
        result = await this.naraAgentService.processChatMessage(state.query, state);
      } else if (this.naraAgentService.naraAgentNode) {
        result = await this.naraAgentService.naraAgentNode(state);
      } else {
        throw new Error('No suitable method found in Nara agent service');
      }
      
      // Extract the response content
      const responseContent = result.content || result.response || result.synthesized_response || 
                             result.personalizedResponse || result.interpretation || result.guidance || 
                             `Response from Nara agent`;
      
      // Send the response
      await this.client.sendMessage(
        message.sender_id,
        'inform',
        {
          response: responseContent,
          metadata: {
            originalRequestId: message.message_id,
            processedBy: 'nara-agent',
            bimbaCoordinate: state.targetCoordinate || '#4'
          }
        },
        {
          conversation_id: message.conversation_id,
          bimbaCoordinates: metadata?.bimbaCoordinates || ['#4'],
          qlStage: metadata?.qlStage,
          contextFrame: metadata?.contextFrame
        }
      );
    } catch (error) {
      console.error('Error handling request in Nara agent client:', error);
      
      // Send failure message
      await this.client.sendMessage(
        message.sender_id,
        'failure',
        {
          reason: `Error processing request: ${error.message}`,
          original_message_id: message.message_id
        },
        {
          conversation_id: message.conversation_id
        }
      );
    }
  }
  
  /**
   * Handle a query-ref message
   * @param {Object} message The A2A message
   * @returns {Promise<void>}
   */
  async handleQueryRef(message) {
    console.log(`Nara agent client received query-ref from ${message.sender_id}:`, message.content);
    
    try {
      // Extract query from the message
      const { query, parameters } = message.content;
      
      // Handle different query types
      let result;
      switch (query) {
        case 'get-user-archetypal-signature':
          result = await this.getUserArchetypalSignature(parameters);
          break;
        case 'get-concrescence-phase':
          result = await this.getUserConcrescencePhase(parameters);
          break;
        default:
          throw new Error(`Unknown query type: ${query}`);
      }
      
      // Send the response
      await this.client.sendMessage(
        message.sender_id,
        'inform',
        {
          query_result: result,
          original_query: query,
          parameters
        },
        {
          conversation_id: message.conversation_id
        }
      );
    } catch (error) {
      console.error('Error handling query-ref in Nara agent client:', error);
      
      // Send failure message
      await this.client.sendMessage(
        message.sender_id,
        'failure',
        {
          reason: `Error processing query: ${error.message}`,
          original_message_id: message.message_id
        },
        {
          conversation_id: message.conversation_id
        }
      );
    }
  }
  
  /**
   * Get the archetypal signature for a user
   * @param {Object} parameters The query parameters
   * @returns {Promise<Object>} The archetypal signature
   */
  async getUserArchetypalSignature(parameters) {
    // This is a placeholder implementation
    // In a real implementation, this would query the user's archetypal signature from MongoDB
    return {
      userId: parameters.userId,
      signature: {
        keyNumbers: [1, 4, 7, 9],
        decanicAlignments: ['Mars in Scorpio', 'Venus in Taurus'],
        coreArchetypes: ['Warrior', 'Lover']
      },
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Get the concrescence phase for a user
   * @param {Object} parameters The query parameters
   * @returns {Promise<Object>} The concrescence phase
   */
  async getUserConcrescencePhase(parameters) {
    // This is a placeholder implementation
    // In a real implementation, this would determine the user's current concrescence phase
    return {
      userId: parameters.userId,
      phase: '+3',
      explanation: 'The user is currently in the integration phase of the concrescence cycle.',
      recommendations: [
        'Focus on synthesizing recent insights',
        'Practice symbolic integration exercises',
        'Prepare for the contextual application phase'
      ],
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Send a request to another agent
   * @param {string} receiverId The ID of the receiving agent
   * @param {Object} content The content of the request
   * @param {Object} options Options for the request
   * @returns {Promise<Object>} The response from the agent
   */
  async sendRequest(receiverId, content, options = {}) {
    return await this.client.sendRequest(receiverId, content, options);
  }
  
  /**
   * Send a query to another agent
   * @param {string} receiverId The ID of the receiving agent
   * @param {string} query The query to send
   * @param {Object} parameters Parameters for the query
   * @param {Object} options Options for the query
   * @returns {Promise<Object>} The response from the agent
   */
  async sendQuery(receiverId, query, parameters = {}, options = {}) {
    return await this.client.sendQuery(receiverId, query, parameters, options);
  }
}

module.exports = NaraAgentClient;
