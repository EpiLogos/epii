/**
 * A2A Server Main Entry Point
 * Initializes and starts the A2A server with the Epii agent adapter
 *
 * Bimba Coordinate: #5-4
 * Represents the main entry point for the Siva-Shakti A2A server
 */

const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const EpiiAgentAdapter = require('./adapters/epii-agent-adapter');
const { epiiAgentCard } = require('./agent-cards');

// Load environment variables from the backend .env file
require('dotenv').config({ path: path.resolve(__dirname, '../friendly-file-backend/.env') });

console.log('[A2A Server] Environment variables loaded');
console.log('[A2A Server] GOOGLE_API_KEY available:', !!process.env.GOOGLE_API_KEY);

// Mock implementation of the existing Epii agent service
// In a real implementation, this would be imported from your existing codebase
const mockEpiiAgentService = {
  processChatMessage: async (message, state) => {
    console.log(`Processing chat message: ${message}`);
    console.log(`State:`, state);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      epiiPerspective: `Epii perspective on: ${message}`,
      processingStage: 'Analyzing document structure',
      bimbaCoordinates: ['#5-0', '#5-1', '#5-2'],
      metadata: {
        analysisDepth: 'deep',
        qlStage: 5
      }
    };
  },

  processPhilosophicalFraming: async (concept, state) => {
    console.log(`Processing philosophical framing for: ${concept}`);
    console.log(`State:`, state);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      response: `Philosophical framing of ${concept} within the Quaternary Logic framework...`,
      processingStage: 'Applying QL framework',
      bimbaCoordinates: ['#1-0', '#1-1', '#1-2'],
      metadata: {
        quaternaryLogicMapping: {
          aLogos: 'Potential state',
          proLogos: 'Initial manifestation',
          diaLogos: 'Relational dynamics',
          logos: 'Structural integration',
          epiLogos: 'Meta-synthesis',
          anALogos: 'Recursive return'
        }
      }
    };
  },

  validateNotionPayload: async (payload, state) => {
    console.log(`Validating Notion payload: ${payload}`);
    console.log(`State:`, state);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      response: `Validation result for Notion payload: Valid`,
      processingStage: 'Checking structural integrity',
      bimbaCoordinates: ['#5-0', '#5-5'],
      metadata: {
        isValid: true,
        validationMessage: 'Payload structure is valid for crystallization'
      }
    };
  }
};

/**
 * Initialize the A2A server with the Epii agent adapter
 * @param {Object} epiiAgentService The existing Epii agent service
 * @param {number} port The port to listen on
 * @returns {Object} The initialized server
 */
function initializeA2AServer(epiiAgentService, port = 3033) {
  // Create the Epii agent adapter
  const epiiAgentAdapter = new EpiiAgentAdapter({
    epiiAgentService
  });

  // Create HTTP server
  const server = http.createServer((req, res) => {
    // Handle agent card requests
    if (req.url === '/.well-known/agent/epii-agent') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(epiiAgentCard));
      return;
    }

    // Handle JSON-RPC requests to /a2a/epii
    if (req.url === '/a2a/epii' && req.method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const { jsonrpc, id, method, params } = JSON.parse(body);

          if (jsonrpc !== '2.0') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32600,
                message: 'Invalid Request'
              }
            }));
          }

          // Handle different A2A methods
          switch (method) {
            case 'tasks/send': {
              // Handle synchronous task processing
              const task = params;
              const result = await epiiAgentAdapter.handleTask(task);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({
                jsonrpc: '2.0',
                id,
                result
              }));
            }

            case 'tasks/sendSubscribe': {
              // Handle streaming task processing
              const task = params;

              // Set up SSE headers
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              });

              // Process task with streaming updates
              epiiAgentAdapter.handleTask(task, (update) => {
                res.write(`data: ${JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: {
                    id: task.id,
                    ...update
                  }
                })}\n\n`);

                // End the response if this is the final update
                if (update.final) {
                  res.end();
                }
              }).catch(error => {
                console.error('Error processing streaming task:', error);
                res.write(`data: ${JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  error: {
                    code: -32603,
                    message: 'Internal error',
                    data: error.message
                  }
                })}\n\n`);
                res.end();
              });

              // Handle client disconnect
              req.on('close', () => {
                console.log(`Client disconnected from streaming task ${task.id}`);
              });

              break;
            }

            case 'tasks/get': {
              // Handle task status retrieval
              const { id: taskId } = params;
              const taskState = epiiAgentAdapter.getTaskState(taskId);

              if (!taskState) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  error: {
                    code: -32602,
                    message: 'Task not found',
                    data: `Task ${taskId} not found`
                  }
                }));
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({
                jsonrpc: '2.0',
                id,
                result: taskState
              }));
            }

            default:
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({
                jsonrpc: '2.0',
                id,
                error: {
                  code: -32601,
                  message: 'Method not found',
                  data: `Method ${method} not supported`
                }
              }));
          }
        } catch (error) {
          console.error('Error handling A2A request:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32603,
              message: 'Internal error',
              data: error.message
            }
          }));
        }
      });

      return;
    }

    // Default response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('A2A Server is running');
  });

  // Create WebSocket server
  const wss = new WebSocket.Server({ server });

  // Store connected clients and agent registrations
  const clients = new Map();
  const agentConnections = new Map();

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    const clientId = uuidv4();
    clients.set(clientId, ws);

    console.log(`New WebSocket connection established: ${clientId}`);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to A2A Server',
      clientId
    }));

    // Handle messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);

        // Handle registration message
        if (data.type === 'registration') {
          console.log(`Client ${clientId} registering as agent: ${data.agentId}`);

          // Store the agent connection mapping
          agentConnections.set(data.agentId, ws);

          // Send confirmation
          ws.send(JSON.stringify({
            type: 'registration_confirmation',
            agentId: data.agentId,
            message: `Registered as ${data.agentName || data.agentId}`
          }));

          return;
        }

        // Handle skill execution requests
        if (data.type === 'skill-execution' || (data.jsonrpc === '2.0' && data.method === 'executeSkill')) {
          console.log(`Received skill execution request: ${data.params?.skillId || data.skillId}`);

          // Extract skill execution parameters
          const skillId = data.params?.skillId || data.skillId;
          const parameters = data.params?.parameters || data.parameters || {};
          const context = data.params?.context || data.context || {};
          const requestId = data.id || Date.now().toString();

          // Execute the skill using the adapter
          try {
            const result = await epiiAgentAdapter.executeSkill(skillId, parameters, context);
            console.log(`Skill execution result:`, JSON.stringify(result, null, 2));

            // Send success response
            const response = {
              jsonrpc: '2.0',
              id: requestId,
              result: result
            };
            console.log(`Sending response to frontend:`, JSON.stringify(response, null, 2));
            ws.send(JSON.stringify(response));

          } catch (error) {
            console.error('Skill execution error:', error);

            // Send error response
            ws.send(JSON.stringify({
              jsonrpc: '2.0',
              id: requestId,
              error: {
                code: -32603,
                message: 'Internal error',
                data: error.message
              }
            }));
          }

          return;
        }

        // Handle A2A protocol messages
        if (data.performative) {
          console.log(`Received ${data.performative} message from ${data.sender_id} to ${data.receiver_id}`);

          // Find the target agent's connection
          const targetConnection = agentConnections.get(data.receiver_id);

          if (targetConnection) {
            // Forward the message to the target agent
            targetConnection.send(JSON.stringify(data));
            console.log(`Message forwarded to ${data.receiver_id}`);

            // Send acknowledgment to sender
            ws.send(JSON.stringify({
              type: 'ack',
              message_id: data.message_id,
              timestamp: new Date().toISOString()
            }));
          } else {
            // Target agent not found
            console.log(`Target agent ${data.receiver_id} not found`);
            ws.send(JSON.stringify({
              type: 'error',
              message_id: data.message_id,
              error: {
                type: 'agent_not_found',
                message: `Agent ${data.receiver_id} not found`
              },
              timestamp: new Date().toISOString()
            }));
          }
        } else {
          // Unknown message type
          console.log(`Received unknown message type from ${clientId}`);
          ws.send(JSON.stringify({
            type: 'error',
            error: {
              type: 'unknown_message_type',
              message: 'Unknown message type'
            },
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          error: {
            type: 'message_processing_error',
            message: error.message
          },
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Handle connection close
    ws.on('close', () => {
      console.log(`WebSocket connection closed: ${clientId}`);

      // Remove client from maps
      clients.delete(clientId);

      // Remove any agent registrations for this connection
      for (const [agentId, conn] of agentConnections.entries()) {
        if (conn === ws) {
          console.log(`Unregistering agent: ${agentId}`);
          agentConnections.delete(agentId);
        }
      }
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });
  });

  // Log the Epii agent card information
  // Note: The agent will be properly registered when it connects via WebSocket
  console.log(`Epii agent card loaded: ${epiiAgentCard.id}`);

  // Get the skills for the Epii agent
  const epiiSkills = epiiAgentAdapter.getSkillsForAgent('epii-agent');
  console.log(`Epii agent skills loaded: ${epiiSkills.length}`);
  epiiSkills.forEach(skill => {
    console.log(`  - ${skill.name} (${skill.bimbaCoordinate}): ${skill.description}`);
  });

  // Start the server
  server.listen(port, () => {
    console.log(`A2A Server listening on port ${port}`);
  });

  return server;
}

// If this file is run directly, start the server with the mock Epii agent service
if (require.main === module) {
  const port = process.env.A2A_PORT || 3033;
  initializeA2AServer(mockEpiiAgentService, port);
}

module.exports = {
  initializeA2AServer
};
