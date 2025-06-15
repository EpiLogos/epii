// Test script for bimbaKnowing tool
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// BPMCP server details
const BPMCP_URL = process.env.BPMCP_URL || 'http://localhost:3030';

async function testBimbaKnowing() {
  console.log('Testing bimbaKnowing tool...');

  try {
    // Test parameters
    const testParams = {
      query: "information about coordinate #4",
      contextDepth: 2,
      limit: 5,
      focusCoordinate: "#4"
    };

    console.log(`\nSending request to bimbaKnowing with params:`, testParams);

    // Call the bimbaKnowing tool directly via HTTP
    const response = await axios.post(`${BPMCP_URL}/api/call-tool`, {
      name: 'bimbaKnowing',
      arguments: testParams
    });

    console.log('\nResponse status:', response.status);

    if (response.data && response.data.content && response.data.content.length > 0) {
      // Parse the JSON response
      try {
        const resultData = JSON.parse(response.data.content[0].text);
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
        console.log('Raw response content:', response.data.content[0].text);
      }
    } else {
      console.log('Unexpected response format:', response.data);
    }

    console.log('\nTest completed successfully.');

  } catch (error) {
    console.error('Error testing bimbaKnowing tool:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the BPMCP server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testBimbaKnowing().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
