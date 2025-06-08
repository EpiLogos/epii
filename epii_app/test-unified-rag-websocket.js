/**
 * WebSocket Test for Unified RAG Skill
 * Tests the UnifiedRAG skill via WebSocket connection to A2A service
 */

const WebSocket = require('ws');

const A2A_WS_URL = 'ws://localhost:3033';

/**
 * Test the unified RAG skill via WebSocket
 */
async function testUnifiedRAGWebSocket() {
  console.log('🚀 Testing Unified RAG Skill via WebSocket\n');
  console.log('Connecting to A2A service at:', A2A_WS_URL);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(A2A_WS_URL);
    let testResults = [];

    ws.on('open', () => {
      console.log('✅ WebSocket connection established');

      // Register as a test client
      const registrationMessage = {
        type: 'registration',
        agentId: 'test-client',
        agentName: 'UnifiedRAG Test Client'
      };

      console.log('📝 Registering as test client...');
      ws.send(JSON.stringify(registrationMessage));
    });

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('📨 Received message:', message.type || message.jsonrpc);

        if (message.type === 'registration_confirmation') {
          console.log('✅ Registration confirmed:', message.message);
          
          // Now test the UnifiedRAG skill
          await runUnifiedRAGTests(ws);
          
        } else if (message.jsonrpc === '2.0' && message.result) {
          // Handle skill execution result
          console.log('🎯 Skill execution result received');
          console.log('Success:', message.result.success);
          
          if (message.result.success) {
            const unifiedContext = message.result.data;
            console.log('\n📊 Unified Context Summary:');
            console.log(`   Query: ${unifiedContext.query}`);
            console.log(`   Coordinates: ${JSON.stringify(unifiedContext.coordinates)}`);
            console.log(`   Sources Queried: ${unifiedContext.metadata.sourcesQueried.join(', ')}`);
            console.log(`   Execution Time: ${unifiedContext.metadata.executionTime}ms`);
            
            // Show source results
            console.log('\n📡 Source Results:');
            Object.entries(unifiedContext.sources).forEach(([source, result]) => {
              const status = result.success ? '✅' : '❌';
              console.log(`   ${status} ${source}: ${result.success ? 'Success' : result.error}`);
            });

            if (unifiedContext.synthesis) {
              console.log('\n🧠 Synthesis:');
              console.log(`   Summary: ${unifiedContext.synthesis.summary}`);
              console.log(`   Key Insights: ${unifiedContext.synthesis.keyInsights.length} insights`);
              console.log(`   Recommendations: ${unifiedContext.synthesis.recommendations.length} recommendations`);
            }
          } else {
            console.log('❌ Skill execution failed:', message.result.error);
          }

          testResults.push(message.result);
          
          // Close connection after test
          setTimeout(() => {
            ws.close();
            resolve(testResults);
          }, 1000);
          
        } else if (message.jsonrpc === '2.0' && message.error) {
          console.log('❌ Skill execution error:', message.error);
          testResults.push({ success: false, error: message.error });
          
          setTimeout(() => {
            ws.close();
            resolve(testResults);
          }, 1000);
        }
        
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      reject(error);
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        reject(new Error('Test timeout after 30 seconds'));
      }
    }, 30000);
  });
}

/**
 * Run UnifiedRAG skill tests
 */
async function runUnifiedRAGTests(ws) {
  console.log('\n🧪 Starting UnifiedRAG skill tests...');

  // Test case: Single coordinate query
  const testParams = {
    query: "What is the MEF - Meta-Logikon and how does it relate to the Parashakti subsystem?",
    coordinates: "#2-1",
    sources: {
      bimba: true,
      lightrag: true,
      graphiti: false, // Disable Graphiti for now since it might have issues
      notion: true
    },
    agentCoordinate: "#5"
  };

  console.log('📋 Test: Single Coordinate Query');
  console.log('📝 Query:', testParams.query);
  console.log('📍 Coordinate:', testParams.coordinates);
  console.log('🔧 Sources:', Object.keys(testParams.sources).filter(k => testParams.sources[k]).join(', '));

  // Create skill execution message
  const skillMessage = {
    jsonrpc: "2.0",
    id: Date.now().toString(),
    method: "executeSkill",
    params: {
      skillId: "unifiedRAG",
      parameters: testParams,
      context: {
        agentId: "test-client",
        requestId: `test_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    }
  };

  console.log('📤 Sending skill execution request...');
  ws.send(JSON.stringify(skillMessage));
}

/**
 * Test skills discovery
 */
async function testSkillsDiscovery() {
  console.log('\n🔍 Testing Skills Discovery via WebSocket\n');

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(A2A_WS_URL);

    ws.on('open', () => {
      console.log('✅ WebSocket connection established');

      // Register as a test client
      const registrationMessage = {
        type: 'registration',
        agentId: 'discovery-client',
        agentName: 'Skills Discovery Client'
      };

      ws.send(JSON.stringify(registrationMessage));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'registration_confirmation') {
          console.log('✅ Registration confirmed');
          
          // Request skills list
          const skillsRequest = {
            jsonrpc: "2.0",
            id: Date.now().toString(),
            method: "listSkills",
            params: {}
          };

          console.log('📤 Requesting skills list...');
          ws.send(JSON.stringify(skillsRequest));
          
        } else if (message.jsonrpc === '2.0' && message.result) {
          console.log('📋 Available skills:', message.result);
          ws.close();
          resolve(message.result);
          
        } else if (message.jsonrpc === '2.0' && message.error) {
          console.log('❌ Skills discovery error:', message.error);
          ws.close();
          resolve({ error: message.error });
        }
        
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        reject(new Error('Discovery timeout after 10 seconds'));
      }
    }, 10000);
  });
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🎯 Unified RAG WebSocket Test Suite');
  console.log('Epic 002: A2A Skill Management Framework');
  console.log('Testing via WebSocket connection to A2A service\n');

  try {
    // Test skills discovery first
    console.log('='.repeat(60));
    await testSkillsDiscovery();
    
    console.log('\n' + '='.repeat(60));
    // Test unified RAG functionality
    const results = await testUnifiedRAGWebSocket();
    
    console.log('\n🎉 All WebSocket tests completed!');
    console.log('\nResults summary:');
    results.forEach((result, index) => {
      console.log(`  Test ${index + 1}: ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success && result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testUnifiedRAGWebSocket,
  testSkillsDiscovery,
  runTests
};
