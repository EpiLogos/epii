# Integrating A2A with Epii Agent

This document provides detailed instructions for integrating the A2A framework with your existing Epii agent implementation.

## Overview

The A2A (Agent-to-Agent) framework provides a standardized way for agents to communicate with each other. This integration allows your existing Epii agent to participate in the A2A ecosystem, enabling it to receive requests from and send responses to other agents.

## Integration Approach

The integration uses a two-part approach:

1. **Server-Side Integration**: An adapter pattern bridges between the A2A framework's expectations and your actual Epii agent implementation. This allows you to integrate without modifying your existing Epii agent code.

2. **Client-Side Integration**: The Epii agent connects to the A2A server as a WebSocket client, allowing it to receive messages from and send responses to other agents.

## Prerequisites

- Node.js 16+
- Your existing Epii agent implementation
- The A2A framework (this repository)

## Integration Steps

### 1. Use the A2A Service

The simplest way to integrate is to use the A2A service, which handles both the server-side and client-side integration:

```javascript
const { startA2AService } = require('./friendly-file-front-back - (#5-4: Siva-Shakti)/a2a-service');

// Start the A2A service
startA2AService()
  .then(service => {
    console.log('A2A service running');

    // To stop the service
    // await service.stop();
  })
  .catch(error => {
    console.error('Failed to start A2A service:', error);
  });
```

### 2. Manual Integration (Advanced)

If you need more control over the integration process, you can perform the integration manually:

#### 2.1. Import the Required Modules

```javascript
const { integrateA2AWithEpiiAgent } = require('./friendly-file-front-back - (#5-4: Siva-Shakti)/integration');
const EpiiAgentClient = require('./friendly-file-front-back - (#5-4: Siva-Shakti)/epii-agent-client');
```

#### 2.2. Import Your Epii Agent Service

For ESM modules (.mjs files), you'll need to use dynamic import:

```javascript
// Using dynamic import for ESM modules
async function importEpiiAgentService() {
  const module = await import('./epii_app/friendly-file-backend/services/epii-agent.service.mjs');
  return module.default || module;
}

// Then in your async function:
const epiiAgentService = await importEpiiAgentService();
```

#### 2.3. Initialize the A2A Server with Your Epii Agent

```javascript
const server = integrateA2AWithEpiiAgent({
  port: 3033,
  epiiAgentService
});
```

#### 2.4. Connect the Epii Agent as a Client

```javascript
const epiiClient = new EpiiAgentClient({
  epiiAgentService
});

await epiiClient.connect();
```

### 3. Start Your Express Server Alongside the A2A Server (Optional)

If you have an existing Express server, you can start it alongside the A2A server:

```javascript
const express = require('express');
const app = express();

// Set up your Express routes
app.get('/', (req, res) => {
  res.send('Epii Backend Server');
});

// Start both servers
const { expressApp, a2aServer } = startA2AServerWithExpress(app, epiiAgentService, 3033);
```

## Example Integration

See the `a2a-service.js` file for a complete example of how to integrate the A2A framework with your Epii agent.

```bash
node friendly-file-front-back\ -\ \(\#5-4\:\ Siva-Shakti\)/a2a-service.js
```

## Integration with the Epii Agent's Chat LLM

The A2A service is designed to connect to the Epii agent's chat LLM, not directly to the pipeline. This is important because:

1. The chat LLM acts as the orchestrator that determines which functions, tools, knowledge bases, and pipelines to use
2. Bypassing the chat LLM and directly calling the pipeline can lead to errors and unexpected behavior

The integration looks for the following methods in the Epii agent service:

1. **chat**: The primary method for interacting with the chat LLM
2. **processMessage**: An alternative method name that might be used
3. **processQuery**: Another alternative method name that might be used

Only if none of these methods are found will it fall back to directly calling the pipeline methods:

1. **runAnalysisPipeline**: For general requests
2. **applyEpiiLens**: For philosophical framing requests
3. **validateCrystallization**: For validation requests

For proper integration, ensure that your Epii agent service exposes a chat LLM method (e.g., `chat`, `processMessage`, or `processQuery`).

## Testing the Integration

After integrating, you can test the connection using the test client:

```bash
cd friendly-file-front-back\ -\ \(\#5-4\:\ Siva-Shakti\)
npm run test:client
```

This will connect to the A2A server, register as a test agent, and send a message to the Epii agent. The Epii agent will process the message and send a response back to the test agent.

## Customizing the Adapter

If your Epii agent has different method names or signatures, you can customize the adapter in `adapters/epii-agent-service-adapter.js` to match your implementation.

## Troubleshooting

- **Connection Issues**: Ensure the A2A server is running on the expected port (default: 3033)
- **Method Not Found**: Check that your Epii agent service has the expected methods or that the adapter correctly maps to your actual methods
- **Response Format Errors**: Verify that the adapter correctly transforms your Epii agent's responses to the format expected by the A2A framework

## Next Steps

1. **Implement Actual Agent Logic**: Replace the mock implementations with your actual agent logic
2. **Add Authentication**: Implement authentication for secure agent-to-agent communication
3. **Extend Capabilities**: Add additional capabilities to your agent card as your agent evolves
