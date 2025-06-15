// Script to generate embeddings for all nodes without embeddings
import WebSocket from 'ws';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// BPMCP WebSocket server details
const WS_URL = process.env.WS_URL || 'ws://localhost:3030/mcp';

async function generateAllEmbeddings() {
  console.log('Starting embedding generation for all nodes without embeddings...');

  return new Promise((resolve, reject) => {
    // Connect to WebSocket server
    const ws = new WebSocket(WS_URL);

    // Handle connection open
    ws.on('open', () => {
      console.log('WebSocket connection established.');

      // Parameters for generating all embeddings
      const params = {
        // No focusCoordinate to generate for all nodes
        limit: 500 // Process up to 500 nodes at once
      };

      console.log(`\nSending request to generateBimbaEmbeddings with params:`, params);

      // Create a message ID
      const messageId = Date.now().toString();

      // Create the WebSocket message
      const message = {
        jsonrpc: "2.0",
        id: messageId,
        method: "callTool",
        params: {
          name: "generateBimbaEmbeddings",
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
            console.log(`- Success: ${resultData.success}`);
            console.log(`- Message: ${resultData.message}`);
            
            if (resultData.stats) {
              console.log(`- Nodes processed: ${resultData.stats.nodesProcessed}`);
              console.log(`- Nodes succeeded: ${resultData.stats.nodesSucceeded}`);
              console.log(`- Nodes failed: ${resultData.stats.nodesFailed}`);
            }
            
            if (resultData.nodes && resultData.nodes.length > 0) {
              console.log('\nProcessed nodes:');
              resultData.nodes.forEach(node => {
                console.log(`- Node ${node.id} (${node.name}, ${node.coordinate}): ${node.status}`);
              });
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            console.log('Raw response content:', response.result.content[0].text);
          }
        } else {
          console.log('Unexpected response format:', response);
        }

        console.log('\nEmbedding generation completed.');
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

    // Set a timeout (longer for embedding generation)
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        reject(new Error('Operation timed out after 5 minutes'));
      }
    }, 300000); // 5 minutes
  });
}

// Run the embedding generation
generateAllEmbeddings().catch(error => {
  console.error('Operation failed:', error);
  process.exit(1);
});
