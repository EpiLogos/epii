/**
 * A2A Client Service
 * Client for Agent-to-Agent communication
 *
 * Bimba Coordinate: #5-4
 * Represents the client component of the Siva-Shakti communication layer
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { createA2AMessage } = require('./a2a-message.schema');

class A2AClientService {
  constructor(options = {}) {
    this.url = options.url || 'ws://localhost:3033';
    this.agentId = options.agentId;
    this.agentName = options.agentName || 'Unknown Agent';
    this.subsystemCoordinate = options.subsystemCoordinate;
    this.ws = null;
    this.connected = false;
    this.connecting = false;
    this.pendingRequests = new Map();
    this.messageHandlers = new Map();
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.requestTimeout = options.requestTimeout || 30000;

    // Bind methods
    this.connect = this.connect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.close = this.close.bind(this);
    this.registerMessageHandler = this.registerMessageHandler.bind(this);
  }

  async connect() {
    if (this.connected || this.connecting) {
      return;
    }

    this.connecting = true;

    return new Promise((resolve, reject) => {
      console.log(`Connecting to A2A Server at ${this.url}`);

      try {
        // Create WebSocket connection without custom headers
        // Let the ws library handle the WebSocket protocol
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
          console.log(`Connected to A2A Server as ${this.agentId}`);
          this.connected = true;
          this.connecting = false;

          // Register with the server
          this.sendRegistration();

          resolve();
        });

        this.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data);

            // Handle connection message
            if (message.type === 'connection') {
              console.log(`Connection established: ${message.message}`);
              return;
            }

            // Handle error message
            if (message.type === 'error') {
              console.error(`Error from server: ${message.error.type}`, message.error.details);

              // Resolve pending request with error
              if (message.message_id && this.pendingRequests.has(message.message_id)) {
                const { reject, timer } = this.pendingRequests.get(message.message_id);
                clearTimeout(timer);
                this.pendingRequests.delete(message.message_id);
                reject(new Error(`${message.error.type}: ${JSON.stringify(message.error.details)}`));
              }

              return;
            }

            // Handle A2A message
            if (message.message_id) {
              // Check if this is a response to a pending request
              if (this.pendingRequests.has(message.message_id)) {
                const { resolve, timer } = this.pendingRequests.get(message.message_id);
                clearTimeout(timer);
                this.pendingRequests.delete(message.message_id);
                resolve(message);
                return;
              }

              // Otherwise, handle as a new message
              this.handleIncomingMessage(message);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });

        this.ws.on('close', () => {
          console.log('Disconnected from A2A Server');
          this.connected = false;
          this.connecting = false;

          // Reject all pending requests
          for (const [id, { reject, timer }] of this.pendingRequests.entries()) {
            clearTimeout(timer);
            reject(new Error('Connection closed'));
          }
          this.pendingRequests.clear();

          // Attempt to reconnect
          setTimeout(() => {
            if (!this.connected && !this.connecting) {
              this.connect().catch(console.error);
            }
          }, this.reconnectInterval);
        });

        this.ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.connecting = false;
          reject(error);
        });
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        this.connecting = false;
        reject(error);
      }
    });
  }

  sendRegistration() {
    if (!this.connected || !this.ws) {
      throw new Error('Not connected to A2A Server');
    }

    const registrationMessage = {
      type: 'registration',
      agentId: this.agentId,
      agentName: this.agentName,
      subsystemCoordinate: this.subsystemCoordinate,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(registrationMessage));
  }

  async sendMessage(receiverId, performative, content, options = {}) {
    if (!this.connected || !this.ws) {
      await this.connect();
    }

    const message = createA2AMessage({
      sender_id: this.agentId,
      receiver_id: receiverId,
      conversation_id: options.conversation_id || uuidv4(),
      performative,
      content,
      bimbaCoordinates: options.bimbaCoordinates || [],
      qlStage: options.qlStage,
      contextFrame: options.contextFrame,
      subsystemPath: options.subsystemPath,
      userArchetype: options.userArchetype,
      epistemologyArchetype: options.epistemologyArchetype
    });

    return new Promise((resolve, reject) => {
      // Set timeout
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(message.message_id)) {
          this.pendingRequests.delete(message.message_id);
          reject(new Error(`Request timeout for message to ${receiverId}`));
        }
      }, this.requestTimeout);

      // Store pending request
      this.pendingRequests.set(message.message_id, { resolve, reject, timer });

      // Send message
      this.ws.send(JSON.stringify(message));

      console.log(`Sent ${performative} message to ${receiverId}`);
    });
  }

  handleIncomingMessage(message) {
    const { performative } = message;

    // Check if there's a handler for this performative
    if (this.messageHandlers.has(performative)) {
      const handler = this.messageHandlers.get(performative);
      handler(message);
    } else {
      console.log(`No handler for ${performative} message from ${message.sender_id}`);

      // Auto-respond with failure if no handler
      this.sendMessage(
        message.sender_id,
        'failure',
        {
          reason: `No handler for ${performative}`,
          original_message_id: message.message_id
        },
        {
          conversation_id: message.conversation_id
        }
      ).catch(console.error);
    }
  }

  registerMessageHandler(performative, handler) {
    this.messageHandlers.set(performative, handler);
    console.log(`Registered handler for ${performative} messages`);
    return this;
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.connecting = false;
    }
  }

  // Helper methods for common message types

  async sendRequest(receiverId, content, options = {}) {
    return this.sendMessage(receiverId, 'request', content, options);
  }

  async sendInform(receiverId, content, options = {}) {
    return this.sendMessage(receiverId, 'inform', content, options);
  }

  async sendQueryRef(receiverId, content, options = {}) {
    return this.sendMessage(receiverId, 'query-ref', content, options);
  }

  async sendAgree(receiverId, content, options = {}) {
    return this.sendMessage(receiverId, 'agree', content, options);
  }

  async sendRefuse(receiverId, content, options = {}) {
    return this.sendMessage(receiverId, 'refuse', content, options);
  }

  async sendFailure(receiverId, content, options = {}) {
    return this.sendMessage(receiverId, 'failure', content, options);
  }
}

module.exports = A2AClientService;
