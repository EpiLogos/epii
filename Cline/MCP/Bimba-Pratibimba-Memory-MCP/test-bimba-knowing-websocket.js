// Test script for bimbaKnowing tool via WebSocket
import WebSocket from 'ws';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// BPMCP WebSocket server details
const WS_URL = process.env.WS_URL || 'ws://localhost:3030/mcp';

async function testBimbaKnowingWebSocket() {
  console.log('Testing bimbaKnowing tool via WebSocket...');

  return new Promise((resolve, reject) => {
    // Connect to WebSocket server
    const ws = new WebSocket(WS_URL);

    // Handle connection open
    ws.on('open', () => {
      console.log('WebSocket connection established.');

      // Test parameters
      const testParams = {
        query: "information about coordinate #4",
        contextDepth: 2,
        limit: 2, // Use a different integer value
        focusCoordinate: "#4"
      };

      console.log(`\nSending request to bimbaKnowing with params:`, testParams);

      // Create a message ID
      const messageId = Date.now().toString();

      // Create the WebSocket message
      const message = {
        jsonrpc: "2.0",
        id: messageId,
        method: "callTool",
        params: {
          name: "bimbaKnowing",
          arguments: testParams
        }
      };

      // Send the message
      ws.send(JSON.stringify(message));
      console.log('Request sent.');
    });

    // Handle incoming messages
    ws.on('message', (data) => {
      console.log('\nReceived response from WebSocket server.');

      try {
        const response = JSON.parse(data.toString());

        if (response.error) {
          console.error('Error from server:', response.error);
          ws.close();
          reject(new Error(`Server error: ${JSON.stringify(response.error)}`));
          return;
        }

        if (response.result && response.result.content && response.result.content.length > 0) {
          // Parse the JSON response
          try {
            const resultData = JSON.parse(response.result.content[0].text);
            console.log('\nResults summary:');
            console.log(`- Query: ${resultData.query}`);
            console.log(`- Context depth: ${resultData.contextDepth}`);
            console.log(`- Focus coordinate: ${resultData.focusCoordinate}`);
            console.log(`- Vector search used: ${resultData.vectorSearchUsed}`);
            console.log(`- Number of results: ${resultData.results.length}`);

            if (resultData.results.length > 0) {
              console.log('\nTop result:');
              const topResult = resultData.results[0];
              console.log(`- Node name: ${topResult.matchedNode.properties.name || 'N/A'}`);
              console.log(`- Bimba coordinate: ${topResult.matchedNode.properties.bimbaCoordinate || 'N/A'}`);
              console.log(`- Score: ${topResult.matchedNode.score}`);
              console.log(`- Context nodes: ${topResult.context.length}`);
            } else {
              console.log('\nNo results found.');
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            console.log('Raw response content:', response.result.content[0].text);
          }
        } else {
          console.log('Unexpected response format:', response);
        }

        console.log('\nTest completed successfully.');
        ws.close();
        resolve();
      } catch (error) {
        console.error('Error processing response:', error);
        ws.close();
        reject(error);
      }
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    });

    // Handle connection close
    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });

    // Set a timeout
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        reject(new Error('Test timed out after 10 seconds'));
      }
    }, 10000);
  });
}

// Run the test
testBimbaKnowingWebSocket().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
