/**
 * Epii Client Example
 * Demonstrates how to use the A2A client to communicate with the Epii agent
 *
 * Bimba Coordinate: #5-4
 * Example client for the Siva-Shakti A2A framework
 */

const A2AClientService = require('../a2a-client.service');

// Create an A2A client for the Nara agent
const naraClient = new A2AClientService({
  url: 'ws://localhost:3033', // Use standard WebSocket connection without path
  agentId: 'nara-agent',
  agentName: 'Nara Agent',
  subsystemCoordinate: '#4'
});

// Example function to send a request to the Epii agent
async function askEpiiAgent(question) {
  try {
    // Connect to the A2A server
    await naraClient.connect();

    console.log(`Sending request to Epii agent: ${question}`);

    // Send a request to the Epii agent
    const response = await naraClient.sendRequest('epii-agent', {
      question,
      format: 'text'
    }, {
      bimbaCoordinates: ['#4-0', '#5-0'],
      qlStage: 0,
      contextFrame: '(4.0-4.4/5)'
    });

    console.log('Received response from Epii agent:');
    console.log(JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error('Error communicating with Epii agent:', error);
    throw error;
  } finally {
    // Close the connection
    naraClient.close();
  }
}

// Example function to request philosophical framing from the Epii agent
async function requestPhilosophicalFraming(concept) {
  try {
    // Connect to the A2A server
    await naraClient.connect();

    console.log(`Requesting philosophical framing for: ${concept}`);

    // Send a request to the Epii agent
    const response = await naraClient.sendRequest('epii-agent', {
      concept,
      requestType: 'philosophical-framing'
    }, {
      bimbaCoordinates: ['#4-1', '#5-1'],
      qlStage: 1,
      contextFrame: '(0/1)'
    });

    console.log('Received philosophical framing from Epii agent:');
    console.log(JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error('Error requesting philosophical framing:', error);
    throw error;
  } finally {
    // Close the connection
    naraClient.close();
  }
}

// Example function to validate a Notion payload
async function validateNotionPayload(payload) {
  try {
    // Connect to the A2A server
    await naraClient.connect();

    console.log(`Requesting validation for Notion payload`);

    // Send a request to the Epii agent
    const response = await naraClient.sendRequest('epii-agent', {
      notionUpdatePayload: payload,
      requestType: 'validate-crystallization-payload'
    }, {
      bimbaCoordinates: ['#4-5', '#5-0'],
      qlStage: 5,
      contextFrame: '(5/0)'
    });

    console.log('Received validation result from Epii agent:');
    console.log(JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error('Error validating Notion payload:', error);
    throw error;
  } finally {
    // Close the connection
    naraClient.close();
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  // Example usage
  const runExamples = async () => {
    try {
      // Example 1: Ask a question
      await askEpiiAgent('What is the relationship between consciousness and quantum mechanics?');

      // Example 2: Request philosophical framing
      await requestPhilosophicalFraming('consciousness');

      // Example 3: Validate a Notion payload
      await validateNotionPayload({
        title: 'Consciousness and Quantum Mechanics',
        content: 'This document explores the relationship between consciousness and quantum mechanics...',
        bimbaCoordinates: ['#1-2', '#3-4'],
        tags: ['consciousness', 'quantum', 'philosophy']
      });
    } catch (error) {
      console.error('Error running examples:', error);
    }
  };

  runExamples();
}

module.exports = {
  askEpiiAgent,
  requestPhilosophicalFraming,
  validateNotionPayload
};
