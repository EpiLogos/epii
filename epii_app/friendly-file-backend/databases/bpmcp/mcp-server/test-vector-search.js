// Script to test vector search with db.index.vector.queryNodes
import WebSocket from 'ws';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// BPMCP WebSocket server details
const WS_URL = process.env.WS_URL || 'ws://localhost:3030/mcp';

async function testVectorSearch() {
  console.log('Testing vector search with db.index.vector.queryNodes...');

  return new Promise((resolve, reject) => {
    // Connect to WebSocket server
    const ws = new WebSocket(WS_URL);

    // Handle connection open
    ws.on('open', () => {
      console.log('WebSocket connection established.');

      // Parameters for the bimbaKnowing query
      const params = {
        query: "information about coordinate #4",
        contextDepth: 2,
        limit: 5,
        focusCoordinate: "#4"
      };

      console.log(`\nSending bimbaKnowing request with params:`, params);

      // Create a message ID
      const messageId = Date.now().toString();

      // Create the WebSocket message
      const message = {
        jsonrpc: "2.0",
        id: messageId,
        method: "callTool",
        params: {
          name: "bimbaKnowing",
          arguments: params
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
            
            // Log the vector search method used
            if (resultData.vectorSearchUsed) {
              console.log(`- Vector search used: ${resultData.vectorSearchUsed}`);
            } else {
              console.log(`- Vector search method not specified in response`);
            }
            
            // Log the number of results
            console.log(`- Number of results: ${resultData.results ? resultData.results.length : 0}`);
            
            if (resultData.results && resultData.results.length > 0) {
              console.log('\nResults:');
              resultData.results.forEach((result, index) => {
                console.log(`\nResult ${index + 1}:`);
                console.log(`- Node: ${result.matchedNode.properties.name || 'Unnamed'}`);
                console.log(`- Coordinate: ${result.matchedNode.properties.bimbaCoordinate || 'No coordinate'}`);
                console.log(`- Score: ${result.matchedNode.score}`);
                
                if (result.context && result.context.length > 0) {
                  console.log(`- Context nodes: ${result.context.length}`);
                }
              });
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

        console.log('\nTest completed.');
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
        reject(new Error('Operation timed out after 30 seconds'));
      }
    }, 30000);
  });
}

// Run the test
testVectorSearch().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
