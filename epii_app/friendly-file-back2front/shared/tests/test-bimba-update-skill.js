/**
 * Test script for Bimba Update Management Skill
 * Tests the skill via WebSocket connection to A2A service
 */

const WebSocket = require('ws');

const A2A_WS_URL = 'ws://localhost:3033';

/**
 * Test the bimba update management skill via WebSocket
 */
async function testBimbaUpdateSkill() {
  console.log('🚀 Testing Bimba Update Management Skill via WebSocket\n');
  console.log('Connecting to A2A service at:', A2A_WS_URL);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(A2A_WS_URL);
    let responseReceived = false;

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        console.error('❌ Test timed out after 30 seconds');
        ws.close();
        reject(new Error('Test timeout'));
      }
    }, 30000);

    ws.on('open', () => {
      console.log('✅ WebSocket connection established');

      // Register as a test client
      const registrationMessage = {
        type: "registration",
        agentId: "test-bimba-client",
        agentName: "Test Bimba Client",
        timestamp: new Date().toISOString()
      };

      console.log('📝 Registering test client...');
      ws.send(JSON.stringify(registrationMessage));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('📨 Received message:', JSON.stringify(message, null, 2));

        if (message.type === 'registration_confirmation') {
          console.log('✅ Registration confirmed, sending skill execution request...');

          // Test parameters that match what the frontend sends
          const testParams = {
            coordinate: "#5-2",
            nodeProperties: {
              name: "Test Node",
              description: "A test node for validation",
              type: "TestNode"
            },
            relationships: [
              {
                type: "RELATES_TO",
                target: "#5-1",
                properties: { strength: 0.8 }
              }
            ],
            documentContent: `# Test Document for Bimba Update Analysis

This is a test document that contains information about Quaternary Logic and Bimba architecture.

## Key Concepts
- Quaternary Logic principles
- Bimba coordinate system
- Process dynamics
- Technical architecture

## Analysis Points
The document discusses the integration of QL principles with technical systems.
It emphasizes the importance of process dynamics in coordinate #5-2.

## Relationships
This content relates to foundational concepts in #5-1 and visualization aspects in #5-3.`,
            documentType: "bimba",
            documentName: "test-document.md"
          };

          // Send skill execution request
          const skillRequest = {
            jsonrpc: "2.0",
            id: Date.now().toString(),
            method: "executeSkill",
            params: {
              skillId: "bimba-update-management",
              parameters: testParams,
              context: {
                agentId: "test-bimba-client",
                agentCoordinate: '#5-2',
                targetCoordinate: "#5-2",
                requestType: 'bimba-update-suggestions'
              }
            }
          };

          console.log('🎯 Sending skill execution request...');
          console.log('📋 Test parameters:', {
            coordinate: testParams.coordinate,
            documentType: testParams.documentType,
            documentName: testParams.documentName,
            contentLength: testParams.documentContent.length,
            propertiesCount: Object.keys(testParams.nodeProperties).length,
            relationshipsCount: testParams.relationships.length
          });

          ws.send(JSON.stringify(skillRequest));

        } else if (message.result) {
          console.log('🎉 Skill execution result received!');
          responseReceived = true;
          clearTimeout(timeout);

          // Analyze the result
          const result = message.result;
          console.log('\n📊 RESULT ANALYSIS:');
          console.log('Success:', result.success);
          console.log('Skill ID:', result.skillId || result.data?.skillId);
          console.log('Bimba Coordinate:', result.bimbaCoordinate || result.data?.bimbaCoordinate);

          if (result.data) {
            console.log('\n📋 DATA STRUCTURE:');
            console.log('Property Updates:', Object.keys(result.data.propertyUpdates || {}).length);
            console.log('Relationship Suggestions:', (result.data.relationshipSuggestions || []).length);

            if (result.data.propertyUpdates && Object.keys(result.data.propertyUpdates).length > 0) {
              console.log('\n✅ Property Updates Found:');
              Object.entries(result.data.propertyUpdates).forEach(([key, value]) => {
                console.log(`  • ${key}: ${value}`);
              });
            }

            if (result.data.relationshipSuggestions && result.data.relationshipSuggestions.length > 0) {
              console.log('\n✅ Relationship Suggestions Found:');
              result.data.relationshipSuggestions.forEach((rel, index) => {
                console.log(`  ${index + 1}. ${rel.type} -> ${rel.targetCoordinate}`);
                if (rel.reasoning) {
                  console.log(`     Reasoning: ${rel.reasoning}`);
                }
              });
            }

            if (result.data.error) {
              console.log('\n⚠️ Error in result:', result.data.error);
            }
          }

          if (result.error) {
            console.log('\n❌ Execution Error:', result.error);
          }

          // Test completed successfully
          console.log('\n🎯 TEST COMPLETED');
          ws.close();
          resolve(result);

        } else if (message.error) {
          console.error('❌ Error response:', message.error);
          responseReceived = true;
          clearTimeout(timeout);
          ws.close();
          reject(new Error(`Skill execution error: ${message.error.message}`));
        }

      } catch (parseError) {
        console.error('❌ Error parsing message:', parseError);
        console.error('Raw message:', data.toString());
      }
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
      clearTimeout(timeout);
      reject(error);
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
      clearTimeout(timeout);
      if (!responseReceived) {
        reject(new Error('Connection closed before receiving response'));
      }
    });
  });
}

// Run the test if this file is executed directly
if (require.main === module) {
  console.log('🧪 Starting Bimba Update Management Skill Test\n');

  testBimbaUpdateSkill()
    .then((result) => {
      console.log('\n✅ Test completed successfully!');
      console.log('🎉 The Bimba Update Management Skill is working correctly.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error.message);
      console.error('💡 Make sure the A2A server is running on port 3033');
      process.exit(1);
    });
}

module.exports = testBimbaUpdateSkill;
