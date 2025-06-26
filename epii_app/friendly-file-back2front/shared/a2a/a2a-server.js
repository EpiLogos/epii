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
const EpiiAgentAdapter = require('../../subsystems/5_epii/adapters/epii-agent-adapter');
const { epiiAgentCard } = require('../../subsystems/5_epii/agent-cards');
const AGUIGateway = require('../ag-ui/ag-ui-gateway');
const { AGUIEventTypes, createAGUIEvent } = require('../ag-ui/ag-ui-event-schema');
const { isAGUIEvent, extractAGUIEventData } = require('./a2a-message.schema');

// Load environment variables from the backend .env file
require('dotenv').config({ path: path.resolve(__dirname, '../friendly-file-backend/.env') });

console.log('[A2A Server] Environment variables loaded');
console.log('[A2A Server] GOOGLE_API_KEY available:', !!process.env.GOOGLE_API_KEY);
console.log('[A2A Server] AG-UI Gateway integration enabled');

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
async function initializeA2AServer(epiiAgentService, port = 3033) {
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

  // Initialize AG-UI Gateway
  const aguiGateway = new AGUIGateway();
  console.log('[A2A Server] AG-UI Gateway initialized');

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
        console.log(`[A2A Server] Received message from ${clientId}:`, JSON.stringify(data, null, 2));

        // Handle registration message
        if (data.type === 'registration') {
          console.log(`Client ${clientId} registering as agent: ${data.agentId}`);

          // Store the agent connection mapping
          agentConnections.set(data.agentId, ws);

          // Register with AG-UI Gateway
          aguiGateway.registerClient(clientId, ws, {
            agentId: data.agentId,
            agentName: data.agentName,
            capabilities: data.capabilities || []
          });

          // Send confirmation
          ws.send(JSON.stringify({
            type: 'registration_confirmation',
            agentId: data.agentId,
            message: `Registered as ${data.agentName || data.agentId}`
          }));

          return;
        }

        // Handle AG-UI subscription requests
        if (data.type === 'subscribe') {
          console.log(`Client ${clientId} subscribing to AG-UI events:`, {
            runId: data.runId,
            threadId: data.threadId,
            eventType: data.eventType
          });

          aguiGateway.subscribe(clientId, data.runId, data.threadId, data.eventType);
          return;
        }

        // Handle AG-UI unsubscription requests
        if (data.type === 'unsubscribe') {
          console.log(`Client ${clientId} unsubscribing from AG-UI events:`, {
            runId: data.runId,
            threadId: data.threadId,
            eventType: data.eventType
          });

          aguiGateway.unsubscribe(clientId, data.runId, data.threadId, data.eventType);
          return;
        }

        // Handle AG-UI event emissions from frontend
        if (data.type === 'ag-ui-event') {
          console.log(`Client ${clientId} emitting AG-UI event: ${data.eventType}`);

          // Process the AG-UI event through the gateway
          const aguiEvent = {
            type: data.eventType,
            runId: data.data?.runId || uuidv4(),
            threadId: data.data?.threadId || uuidv4(),
            ...data.data,
            timestamp: new Date().toISOString()
          };

          // Emit through AG-UI Gateway
          aguiGateway.emitAGUIEvent(aguiEvent, data.data?.metadata || {});

          // Send acknowledgment
          ws.send(JSON.stringify({
            type: 'ag-ui-event-ack',
            eventType: data.eventType,
            timestamp: new Date().toISOString()
          }));

          return;
        }

        // Handle skill execution requests
        if (data.type === 'skill-execution' || (data.jsonrpc === '2.0' && data.method === 'executeSkill')) {
          console.log(`✅ Received skill execution request: ${data.params?.skillId || data.skillId}`);
          console.log(`🔍 Message type check: type=${data.type}, jsonrpc=${data.jsonrpc}, method=${data.method}`);

          // Extract skill execution parameters
          const skillId = data.params?.skillId || data.skillId;
          const parameters = data.params?.parameters || data.parameters || {};
          const context = data.params?.context || data.context || {};
          const requestId = data.id || Date.now().toString();

          // Check if this is an AG-UI enabled request
          const isAGUIRequest = !!(parameters.aguiRunId || context.aguiMetadata);
          let runId = parameters.aguiRunId || uuidv4();
          let threadId = parameters.aguiThreadId || uuidv4();

          // Execute the skill using the adapter
          try {
            // Emit AG-UI RunStarted event if this is an AG-UI request
            if (isAGUIRequest) {
              console.log(`[A2A Server] Starting AG-UI run: ${runId}`);

              aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_STARTED, {
                runId,
                threadId,
                skillId,
                parameters: {
                  coordinate: parameters.coordinate,
                  documentType: parameters.documentType,
                  analysisType: parameters.analysisType || 'update-suggestions'
                }
              }), {
                bimbaCoordinates: parameters.coordinate ? [parameters.coordinate] : [],
                qlStage: 2,
                contextFrame: '(0/1/2)'
              });
            }

            // Enhanced context for AG-UI
            const enhancedContext = {
              ...context,
              aguiGateway: isAGUIRequest ? aguiGateway : null,
              runId: isAGUIRequest ? runId : null,
              threadId: isAGUIRequest ? threadId : null
            };

            const result = await epiiAgentAdapter.executeSkill(skillId, parameters, enhancedContext);
            console.log(`Skill execution result:`, JSON.stringify(result, null, 2));

            // Emit AG-UI RunFinished event if this is an AG-UI request
            // Skip for pipeline skills that handle their own completion events
            const pipelineSkills = ['epii-analysis-pipeline'];
            const shouldEmitCompletion = isAGUIRequest && !pipelineSkills.includes(skillId);

            if (shouldEmitCompletion) {
              console.log(`[A2A Server] Completing AG-UI run: ${runId}`);

              aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_FINISHED, {
                runId,
                threadId,
                result: {
                  success: result.success,
                  dataKeys: result.data ? Object.keys(result.data) : []
                }
              }), {
                bimbaCoordinates: parameters.coordinate ? [parameters.coordinate] : [],
                qlStage: 2,
                contextFrame: '(0/1/2)'
              });
            } else if (isAGUIRequest && pipelineSkills.includes(skillId)) {
              console.log(`[A2A Server] Skipping RUN_FINISHED emission for pipeline skill: ${skillId} (skill wrapper will handle completion)`);
            }

            // Send success response with enhanced metadata
            const response = {
              jsonrpc: '2.0',
              id: requestId,
              result: {
                ...result,
                // Ensure target coordinate is preserved in response
                targetCoordinate: result.targetCoordinate || parameters.coordinate,
                // Add AG-UI metadata for frontend processing
                aguiMetadata: isAGUIRequest ? {
                  runId,
                  threadId,
                  eventsEmitted: true,
                  targetCoordinate: result.targetCoordinate || parameters.coordinate
                } : null
              }
            };

            console.log(`[A2A Server] Sending enhanced response to frontend for coordinate: ${result.targetCoordinate || parameters.coordinate}`);
            console.log(`Response structure:`, JSON.stringify(response, null, 2));
            ws.send(JSON.stringify(response));

          } catch (error) {
            console.error('Skill execution error:', error);

            // Emit AG-UI RunError event if this is an AG-UI request
            if (isAGUIRequest) {
              console.log(`[A2A Server] AG-UI run error: ${runId}`);

              aguiGateway.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_ERROR, {
                runId,
                threadId,
                message: error.message,
                code: 'SKILL_EXECUTION_ERROR'
              }), {
                bimbaCoordinates: parameters.coordinate ? [parameters.coordinate] : [],
                qlStage: 2,
                contextFrame: '(0/1/2)'
              });
            }

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
          console.log(`❌ Received unknown message type from ${clientId}`);
          console.log(`🔍 Message analysis: type=${data.type}, jsonrpc=${data.jsonrpc}, method=${data.method}, performative=${data.performative}`);
          console.log(`📋 Available message keys:`, Object.keys(data));
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

      // Unregister from AG-UI Gateway
      aguiGateway.unregisterClient(clientId);

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

  // Get the skills for the Epii agent (async)
  try {
    const epiiSkills = await epiiAgentAdapter.getSkillsForAgent('epii-agent');
    console.log(`Epii agent skills loaded: ${epiiSkills.length}`);
    epiiSkills.forEach(skill => {
      console.log(`  - ${skill.name} (${skill.bimbaCoordinate}): ${skill.description}`);
    });
  } catch (error) {
    console.error('Failed to load Epii agent skills:', error);
  }

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
