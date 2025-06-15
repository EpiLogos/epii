/**
 * A2A Test Client
 * A client for testing the A2A service with the Epii agent
 *
 * Bimba Coordinate: #5-4-2
 * Represents a test client for the Siva-Shakti A2A framework
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// Configuration
const WS_URL = process.env.A2A_WS_URL || 'ws://localhost:3033';
const CLIENT_ID = process.env.A2A_CLIENT_ID || 'nara-agent';
const CLIENT_NAME = process.env.A2A_CLIENT_NAME || 'Nara Agent';

/**
 * A2A Test Client class
 */
class A2ATestClient {
  constructor(options = {}) {
    this.url = options.url || WS_URL;
    this.agentId = options.agentId || CLIENT_ID;
    this.agentName = options.agentName || CLIENT_NAME;

    this.ws = null;
    this.connected = false;
    this.connecting = false;

    // Bind methods
    this.connect = this.connect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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

        this.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            console.log('Received message:', message);

            // Handle different message types
            if (message.type === 'connection') {
              console.log(`Connection established with client ID: ${message.clientId}`);
            } else if (message.type === 'registration_confirmation') {
              console.log(`Registration confirmed as ${message.agentId}`);
            } else if (message.type === 'error') {
              console.error(`Error: ${message.error.message}`);
            } else if (message.type === 'ack') {
              console.log(`Message acknowledged: ${message.message_id}`);
            } else if (message.performative) {
              console.log(`Received A2A message with performative: ${message.performative}`);

              // If this is a response to our request, process it
              if (message.performative === 'inform' && message.content) {
                console.log('Response content:', message.content);
              }
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });

        this.ws.on('close', () => {
          console.log('Disconnected from A2A Server');
          this.connected = false;
          this.connecting = false;
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
   * Send a message to the Epii agent
   * @param {string} question The question to ask
   * @param {string} [bimbaCoordinate] Optional Bimba coordinate to target a specific skill
   * @returns {Promise<void>}
   */
  async sendMessage(question, bimbaCoordinate) {
    if (!this.connected) {
      throw new Error('Not connected to A2A Server');
    }

    // Determine Bimba coordinates based on the question or provided coordinate
    let bimbaCoordinates = ['#4-0', '#5-0']; // Default coordinates

    if (bimbaCoordinate) {
      // If a specific coordinate is provided, use it
      bimbaCoordinates = [bimbaCoordinate];
    } else {
      // Otherwise, try to determine based on content
      const questionLower = question.toLowerCase();

      if (questionLower.includes('identity') || questionLower.includes('self')) {
        bimbaCoordinates = ['#4-0', '#5-0'];
      } else if (questionLower.includes('philosophy') || questionLower.includes('concept')) {
        bimbaCoordinates = ['#4-0', '#5-1'];
      } else if (questionLower.includes('architecture') || questionLower.includes('system')) {
        bimbaCoordinates = ['#4-0', '#5-2'];
      } else if (questionLower.includes('visualization') || questionLower.includes('display')) {
        bimbaCoordinates = ['#4-0', '#5-3'];
      } else if (questionLower.includes('integration') || questionLower.includes('connect')) {
        bimbaCoordinates = ['#4-0', '#5-4'];
      } else if (questionLower.includes('process') || questionLower.includes('flow')) {
        bimbaCoordinates = ['#4-0', '#5-5'];
      }
    }

    const message = {
      message_id: uuidv4(),
      sender_id: this.agentId,
      receiver_id: 'epii-agent',
      conversation_id: uuidv4(),
      performative: 'request',
      content: {
        question,
        format: 'text'
      },
      timestamp: new Date().toISOString(),
      metadata: {
        bimbaCoordinates,
        qlStage: 0,
        contextFrame: '(4.0-4.4/5)',
        skillRequest: bimbaCoordinate ? true : false
      }
    };

    this.ws.send(JSON.stringify(message));
    console.log(`Sent message to Epii agent: ${question}`);
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

// If this file is run directly, start the client
if (require.main === module) {
  const client = new A2ATestClient();

  client.connect()
    .then(() => {
      // Wait for registration to complete
      setTimeout(() => {
        // Send a test message targeting the Identity Dynamics skill (#5-0)
        client.sendMessage('Tell me about yourself. Who are you as Epii, and what is your purpose in the Epi-Logos system?', '#5-0')
          .catch(error => {
            console.error('Error sending message:', error);
          });

        // Close the connection after 30 seconds
        setTimeout(() => {
          console.log('Closing connection...');
          client.close();
        }, 30000);
      }, 2000);
    })
    .catch(error => {
      console.error('Error connecting to A2A Server:', error);
    });
}

module.exports = A2ATestClient;
