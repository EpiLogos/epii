/**
 * Epii Agent Client
 * Connects to the A2A server as the Epii agent
 *
 * This script:
 * 1. Connects to the A2A server
 * 2. Registers as the Epii agent
 * 3. Listens for messages and forwards them to the Epii agent service
 * 4. Sends responses back to the requesting agent
 *
 * Bimba Coordinate: #5-4-1
 * Represents the client implementation for the Epii Agent within the Siva-Shakti layer
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { epiiAgentCard } = require('./index');

// Configuration
const WS_URL = process.env.A2A_WS_URL || 'ws://localhost:3033';

/**
 * Epii Agent Client class
 */
class EpiiAgentClient {
  constructor(options = {}) {
    this.url = options.url || WS_URL;
    this.agentId = epiiAgentCard.id;
    this.agentName = epiiAgentCard.name;
    this.epiiAgentService = options.epiiAgentService;

    this.ws = null;
    this.connected = false;
    this.connecting = false;

    // Bind methods
    this.connect = this.connect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.close = this.close.bind(this);
  }

  /**
   * Connect to the A2A server
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connected || this.connecting) {
      return;
    }

    this.connecting = true;

    return new Promise((resolve, reject) => {
      console.log(`Connecting to A2A Server at ${this.url} as ${this.agentName}`);

      try {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
          console.log(`Connected to A2A Server`);
          this.connected = true;
          this.connecting = false;

          // Register with the server
          this.sendRegistration();

          resolve();
        });

        this.ws.on('message', this.handleMessage);

        this.ws.on('close', () => {
          console.log('Disconnected from A2A Server');
          this.connected = false;
          this.connecting = false;

          // Attempt to reconnect after a delay
          setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.connect().catch(error => {
              console.error('Reconnection failed:', error);
            });
          }, 5000);
        });

        this.ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          if (!this.connected) {
            this.connecting = false;
            reject(error);
          }
        });
      } catch (error) {
        this.connecting = false;
        console.error('Connection error:', error);
        reject(error);
      }
    });
  }

  /**
   * Send registration message to the server
   */
  sendRegistration() {
    if (!this.connected) {
      return;
    }

    const registrationMessage = {
      type: 'registration',
      agentId: this.agentId,
      agentName: this.agentName,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(registrationMessage));
    console.log(`Sent registration as ${this.agentName} (${this.agentId})`);
  }

  /**
   * Handle incoming messages
   * @param {Buffer|string} data The message data
   */
  async handleMessage(data) {
    try {
      const message = JSON.parse(data.toString());
      console.log(`Received message type: ${message.type || message.performative || 'unknown'}`);

      // Handle different message types
      if (message.type === 'connection') {
        console.log(`Connection established with client ID: ${message.clientId}`);
      } else if (message.type === 'registration_confirmation') {
        console.log(`Registration confirmed as ${message.agentId}`);
      } else if (message.performative === 'request') {
        await this.handleRequest(message);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  /**
   * Handle a request message
   * @param {Object} message The request message
   */
  async handleRequest(message) {
    console.log(`Received request from ${message.sender_id}`);

    try {
      if (!this.epiiAgentService) {
        throw new Error('Epii agent service not available');
      }

      // Extract the request content
      const content = message.content || {};

      // Ensure we have a valid text content
      let textContent;
      if (typeof content.question === 'string' && content.question.trim()) {
        textContent = content.question;
      } else if (Object.keys(content).length > 0) {
        textContent = JSON.stringify(content);
      } else {
        textContent = "Empty request";
      }

      // Prepare the initial state
      const initialState = {
        query: textContent,
        mode: 'epii',
        run_direction: 'analysis',
        conversation_id: message.conversation_id,
        metadata: message.metadata || {}
      };

      console.log(`Processing request: ${textContent ? textContent.substring(0, 100) : 'Empty request'}...`);

      // Process the request using the Epii agent service
      let result;

      // The Epii agent service has a processChatMessage method that should be used
      // This method will use the chat LLM to process the request
      if (this.epiiAgentService.processChatMessage) {
        console.log('Using Epii processChatMessage method to process request');
        // Use the processChatMessage method to let the chat LLM determine the appropriate action
        result = await this.epiiAgentService.processChatMessage(textContent, initialState);
      } else if (this.epiiAgentService.chat) {
        console.log('Using Epii chat LLM to process request');
        // Use the chat method to let the LLM determine the appropriate action
        result = await this.epiiAgentService.chat(textContent, initialState);
      } else if (this.epiiAgentService.processMessage) {
        console.log('Using Epii processMessage method to process request');
        // Alternative method name that might be used
        result = await this.epiiAgentService.processMessage(textContent, initialState);
      } else if (this.epiiAgentService.processQuery) {
        console.log('Using Epii processQuery method to process request');
        // Another alternative method name
        result = await this.epiiAgentService.processQuery(textContent, initialState);
      } else if (content.requestType === 'philosophical-framing') {
        // Handle philosophical framing request
        console.log('Processing philosophical framing request');
        const concept = content.concept || textContent;
        if (this.epiiAgentService.applyEpiiLens) {
          result = await this.epiiAgentService.applyEpiiLens(concept, initialState);
        } else {
          console.warn('No applyEpiiLens method found, falling back to runAnalysisPipeline');
          result = await this.epiiAgentService.runAnalysisPipeline({
            ...initialState,
            mode: 'lens',
            targetLens: 'philosophical'
          });
        }
      } else if (content.requestType === 'validate-crystallization-payload') {
        // Handle validation request
        console.log('Processing validation request');
        const payload = content.notionUpdatePayload || textContent;
        if (this.epiiAgentService.validateCrystallization) {
          result = await this.epiiAgentService.validateCrystallization(payload, initialState);
        } else {
          console.warn('No validateCrystallization method found, falling back to runAnalysisPipeline');
          result = await this.epiiAgentService.runAnalysisPipeline({
            ...initialState,
            mode: 'validation',
            notionUpdatePayload: payload
          });
        }
      } else {
        // If no chat method is available, log a warning and fall back to the pipeline
        console.warn('No chat processing method found in Epii agent service, falling back to direct pipeline call');
        console.warn('Available methods:', Object.keys(this.epiiAgentService).filter(key => typeof this.epiiAgentService[key] === 'function'));

        // Handle general request with direct pipeline call (not ideal)
        result = await this.epiiAgentService.runAnalysisPipeline(initialState);
      }

      // Extract the response content
      const responseContent = result.stage0Result || result.notionUpdatePayload || result;
      const responseText = responseContent.content || responseContent.response ||
                          responseContent.epiiPerspective || `Response from ${this.agentName}`;

      // Determine the Bimba coordinates based on the content
      let bimbaCoordinates = responseContent.bimbaCoordinates;

      // If no Bimba coordinates are provided, determine them based on the content
      if (!bimbaCoordinates || bimbaCoordinates.length === 0) {
        // Default coordinates
        bimbaCoordinates = ['#5-0', '#5-1', '#5-2'];

        // Check for specific content indicators
        const responseLower = responseText.toLowerCase();

        if (responseLower.includes('identity') || responseLower.includes('self')) {
          bimbaCoordinates = ['#5-0'];
        } else if (responseLower.includes('philosophy') || responseLower.includes('concept')) {
          bimbaCoordinates = ['#5-1'];
        } else if (responseLower.includes('architecture') || responseLower.includes('system')) {
          bimbaCoordinates = ['#5-2'];
        } else if (responseLower.includes('visualization') || responseLower.includes('display')) {
          bimbaCoordinates = ['#5-3'];
        } else if (responseLower.includes('integration') || responseLower.includes('connect')) {
          bimbaCoordinates = ['#5-4'];
        } else if (responseLower.includes('process') || responseLower.includes('flow')) {
          bimbaCoordinates = ['#5-5'];
        }
      }

      // Send the response
      const response = {
        message_id: uuidv4(),
        conversation_id: message.conversation_id,
        sender_id: this.agentId,
        receiver_id: message.sender_id,
        performative: 'inform',
        content: {
          response: responseText,
          metaPerspective: responseContent.metaPerspective || responseText,
          bimbaCoordinates: bimbaCoordinates
        },
        timestamp: new Date().toISOString(),
        metadata: {
          ...(responseContent.metadata || {}),
          bimbaCoordinates: bimbaCoordinates,
          qlStage: 5,
          qlStageName: 'An-a-logos',
          skillInfo: {
            primaryCoordinate: bimbaCoordinates[0],
            agentId: this.agentId,
            agentName: this.agentName
          }
        }
      };

      this.ws.send(JSON.stringify(response));
      console.log(`Sent response to ${message.sender_id}`);
    } catch (error) {
      console.error('Error processing request:', error);

      // Send error response
      const errorResponse = {
        message_id: uuidv4(),
        conversation_id: message.conversation_id,
        sender_id: this.agentId,
        receiver_id: message.sender_id,
        performative: 'failure',
        content: {
          error: `Error processing request: ${error.message}`
        },
        timestamp: new Date().toISOString()
      };

      this.ws.send(JSON.stringify(errorResponse));
    }
  }

  /**
   * Close the connection
   */
  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.connecting = false;
    }
  }
}

// Export the class
module.exports = EpiiAgentClient;
