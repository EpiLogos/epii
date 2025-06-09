/**
 * AG-UI Integration Test Suite
 * Tests the complete AG-UI event flow from frontend to skill execution
 * 
 * Bimba Coordinate: #5-4-6
 * Represents testing framework within the Siva-Shakti layer
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { AGUIEventTypes, createAGUIEvent, validateAGUIEvent } = require('./ag-ui-event-schema');
const { A2AAGUIEventTypes, createAGUIA2AMessage, isAGUIEvent } = require('./a2a-message.schema');

const A2A_WS_URL = 'ws://localhost:3033';

/**
 * Test Suite Class for AG-UI Integration
 */
class AGUIIntegrationTestSuite {
  constructor() {
    this.testResults = [];
    this.ws = null;
    this.connected = false;
    this.receivedEvents = [];
    this.testTimeout = 30000; // 30 seconds
  }

  /**
   * Run all AG-UI integration tests
   */
  async runAllTests() {
    console.log('🧪 Starting AG-UI Integration Test Suite\n');
    
    try {
      await this.connectToA2AServer();
      
      // Phase 1 Tests
      await this.testEventSchemaValidation();
      await this.testA2AMessageExtensions();
      await this.testAGUIGatewayBasics();
      await this.testSkillExecutionWithAGUI();
      await this.testBimbaUpdateManagementSkillAGUI();
      await this.testProgressReporting();
      await this.testErrorHandling();
      await this.testBackwardCompatibility();
      
      this.printTestResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    } finally {
      if (this.ws) {
        this.ws.close();
      }
    }
  }

  /**
   * Connect to A2A server
   */
  async connectToA2AServer() {
    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to A2A server...');
      
      this.ws = new WebSocket(A2A_WS_URL);
      
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      this.ws.on('open', () => {
        clearTimeout(timeout);
        this.connected = true;
        console.log('✅ Connected to A2A server');
        
        // Register as test client
        this.ws.send(JSON.stringify({
          type: 'registration',
          agentId: 'ag-ui-test-client',
          agentName: 'AG-UI Test Client',
          capabilities: ['ag-ui-testing']
        }));
        
        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.receivedEvents.push({
            timestamp: new Date().toISOString(),
            message
          });
        } catch (error) {
          console.warn('Failed to parse message:', error);
        }
      });

      this.ws.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Test 1: Event Schema Validation
   */
  async testEventSchemaValidation() {
    console.log('📋 Test 1: Event Schema Validation');
    
    try {
      // Test valid AG-UI events
      const validEvents = [
        createAGUIEvent(AGUIEventTypes.RUN_STARTED, { runId: uuidv4() }),
        createAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, {
          runId: uuidv4(),
          stage: 'llm-analysis',
          progress: 50
        }),
        createAGUIEvent(AGUIEventTypes.BIMBA_UPDATE_SUGGESTIONS, {
          runId: uuidv4(),
          propertyUpdates: { test: 'value' },
          relationshipSuggestions: []
        })
      ];

      for (const event of validEvents) {
        validateAGUIEvent(event);
      }

      // Test invalid events
      try {
        validateAGUIEvent({ type: 'InvalidType' });
        throw new Error('Should have failed validation');
      } catch (error) {
        if (!error.message.includes('Unknown AG-UI event type')) {
          throw error;
        }
      }

      this.addTestResult('Event Schema Validation', true, 'All event validations passed');
      
    } catch (error) {
      this.addTestResult('Event Schema Validation', false, error.message);
    }
  }

  /**
   * Test 2: A2A Message Extensions
   */
  async testA2AMessageExtensions() {
    console.log('📋 Test 2: A2A Message Extensions');
    
    try {
      // Test AG-UI A2A message creation
      const aguiMessage = createAGUIA2AMessage({
        sender_id: 'test-client',
        receiver_id: 'epii-agent',
        conversation_id: uuidv4(),
        agui_event_type: A2AAGUIEventTypes.AGUI_BIMBA_NODE_ANALYSIS_REQUEST,
        agui_payload: {
          runId: uuidv4(),
          coordinate: '#5-2'
        },
        bimbaMetadata: {
          bimbaCoordinates: ['#5-2'],
          qlStage: 2
        }
      });

      // Test AG-UI event detection
      if (!isAGUIEvent(aguiMessage)) {
        throw new Error('Failed to detect AG-UI event');
      }

      this.addTestResult('A2A Message Extensions', true, 'AG-UI message extensions working');
      
    } catch (error) {
      this.addTestResult('A2A Message Extensions', false, error.message);
    }
  }

  /**
   * Test 3: AG-UI Gateway Basics
   */
  async testAGUIGatewayBasics() {
    console.log('📋 Test 3: AG-UI Gateway Basics');
    
    try {
      // Test subscription
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        eventType: AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS
      }));

      // Wait for subscription confirmation
      await this.waitForMessage('ag-ui-subscription-confirmation', 5000);

      this.addTestResult('AG-UI Gateway Basics', true, 'Subscription mechanism working');
      
    } catch (error) {
      this.addTestResult('AG-UI Gateway Basics', false, error.message);
    }
  }

  /**
   * Test 4: Skill Execution with AG-UI
   */
  async testSkillExecutionWithAGUI() {
    console.log('📋 Test 4: Skill Execution with AG-UI');
    
    try {
      const runId = uuidv4();
      const threadId = uuidv4();

      // Subscribe to this specific run
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        runId: runId
      }));

      // Send skill execution request with AG-UI metadata
      const skillRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'executeSkill',
        params: {
          skillId: 'bimba-update-management',
          parameters: {
            coordinate: '#5-2',
            nodeProperties: { name: 'Test Node', type: 'TestNode' },
            relationships: [],
            documentContent: 'Test document content for AG-UI integration testing.',
            documentType: 'bimba',
            documentName: 'ag-ui-test.md',
            aguiRunId: runId,
            aguiThreadId: threadId
          },
          context: {
            agentId: 'ag-ui-test-client',
            targetCoordinate: '#5-2',
            aguiMetadata: {
              runId,
              threadId,
              eventType: 'BimbaNodeAnalysisRequest'
            }
          }
        }
      };

      this.ws.send(JSON.stringify(skillRequest));

      // Wait for RunStarted event
      await this.waitForAGUIEvent(AGUIEventTypes.RUN_STARTED, 10000);

      // Wait for skill execution result
      await this.waitForMessage('result', 20000);

      this.addTestResult('Skill Execution with AG-UI', true, 'AG-UI skill execution working');
      
    } catch (error) {
      this.addTestResult('Skill Execution with AG-UI', false, error.message);
    }
  }

  /**
   * Test 5: Bimba Update Management Skill AG-UI Integration
   */
  async testBimbaUpdateManagementSkillAGUI() {
    console.log('📋 Test 5: Bimba Update Management Skill AG-UI Integration');
    
    try {
      const runId = uuidv4();
      
      // Subscribe to progress events
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        runId: runId,
        eventType: AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS
      }));

      // Execute the skill with complete test data
      const skillRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'executeSkill',
        params: {
          skillId: 'bimba-update-management',
          parameters: {
            coordinate: '#5-2',
            nodeProperties: {
              name: 'Process Dynamics Node',
              description: 'Technical architecture process dynamics',
              type: 'ProcessNode',
              qlPosition: 2
            },
            relationships: [
              {
                type: 'RELATES_TO',
                direction: 'outgoing',
                relatedNode: { coordinate: '#5-1', title: 'Material Foundation' }
              }
            ],
            documentContent: `# AG-UI Integration Test Document

This document tests the AG-UI integration with the Bimba Update Management Skill.

## Key Concepts
- AG-UI protocol integration
- Real-time progress reporting
- Event-driven architecture
- Bimba coordinate system alignment

## Technical Details
The integration enables direct frontend-to-agent communication via WebSocket events,
eliminating the need for HTTP API calls and ensuring complete node data transfer.

## Expected Outcomes
- Property updates based on document analysis
- Relationship suggestions aligned with QL principles
- Real-time progress updates during analysis`,
            documentType: 'bimba',
            documentName: 'ag-ui-integration-test.md',
            aguiRunId: runId,
            aguiThreadId: uuidv4()
          },
          context: {
            agentId: 'ag-ui-test-client',
            targetCoordinate: '#5-2',
            aguiMetadata: { runId }
          }
        }
      };

      this.ws.send(JSON.stringify(skillRequest));

      // Wait for progress events
      await this.waitForAGUIEvent(AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS, 15000);
      
      // Wait for final suggestions
      await this.waitForAGUIEvent(AGUIEventTypes.BIMBA_UPDATE_SUGGESTIONS, 20000);

      this.addTestResult('Bimba Update Management Skill AG-UI', true, 'Complete AG-UI integration working');
      
    } catch (error) {
      this.addTestResult('Bimba Update Management Skill AG-UI', false, error.message);
    }
  }

  /**
   * Test 6: Progress Reporting
   */
  async testProgressReporting() {
    console.log('📋 Test 6: Progress Reporting');
    
    try {
      // Check if we received progress events in previous tests
      const progressEvents = this.receivedEvents.filter(event => 
        event.message.type === AGUIEventTypes.BIMBA_ANALYSIS_PROGRESS
      );

      if (progressEvents.length === 0) {
        throw new Error('No progress events received');
      }

      // Validate progress event structure
      const progressEvent = progressEvents[0].message;
      if (!progressEvent.stage || typeof progressEvent.progress !== 'number') {
        throw new Error('Invalid progress event structure');
      }

      this.addTestResult('Progress Reporting', true, `Received ${progressEvents.length} progress events`);
      
    } catch (error) {
      this.addTestResult('Progress Reporting', false, error.message);
    }
  }

  /**
   * Test 7: Error Handling
   */
  async testErrorHandling() {
    console.log('📋 Test 7: Error Handling');
    
    try {
      // Test invalid skill execution
      const invalidRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'executeSkill',
        params: {
          skillId: 'non-existent-skill',
          parameters: {},
          context: { aguiMetadata: { runId: uuidv4() } }
        }
      };

      this.ws.send(JSON.stringify(invalidRequest));

      // Wait for error response
      await this.waitForMessage('error', 10000);

      this.addTestResult('Error Handling', true, 'Error handling working correctly');
      
    } catch (error) {
      this.addTestResult('Error Handling', false, error.message);
    }
  }

  /**
   * Test 8: Backward Compatibility
   */
  async testBackwardCompatibility() {
    console.log('📋 Test 8: Backward Compatibility');
    
    try {
      // Test traditional skill execution without AG-UI
      const traditionalRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'executeSkill',
        params: {
          skillId: 'bimba-update-management',
          parameters: {
            coordinate: '#5-2',
            nodeProperties: { name: 'Test' },
            relationships: [],
            documentContent: 'Test content',
            documentType: 'bimba',
            documentName: 'test.md'
          },
          context: {
            agentId: 'test-client',
            targetCoordinate: '#5-2'
          }
        }
      };

      this.ws.send(JSON.stringify(traditionalRequest));

      // Wait for traditional response
      await this.waitForMessage('result', 15000);

      this.addTestResult('Backward Compatibility', true, 'Traditional execution still works');
      
    } catch (error) {
      this.addTestResult('Backward Compatibility', false, error.message);
    }
  }

  /**
   * Wait for specific message type
   */
  async waitForMessage(messageType, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkForMessage = () => {
        const found = this.receivedEvents.find(event => 
          event.message.type === messageType || 
          (event.message.jsonrpc && messageType === 'result' && event.message.result) ||
          (event.message.jsonrpc && messageType === 'error' && event.message.error)
        );
        
        if (found) {
          resolve(found.message);
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout waiting for message type: ${messageType}`));
          return;
        }
        
        setTimeout(checkForMessage, 100);
      };
      
      checkForMessage();
    });
  }

  /**
   * Wait for specific AG-UI event
   */
  async waitForAGUIEvent(eventType, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkForEvent = () => {
        const found = this.receivedEvents.find(event => 
          event.message.type === eventType
        );
        
        if (found) {
          resolve(found.message);
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout waiting for AG-UI event: ${eventType}`));
          return;
        }
        
        setTimeout(checkForEvent, 100);
      };
      
      checkForEvent();
    });
  }

  /**
   * Add test result
   */
  addTestResult(testName, passed, details) {
    this.testResults.push({
      testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  /**
   * Print final test results
   */
  printTestResults() {
    console.log('\n📊 AG-UI Integration Test Results');
    console.log('================================');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (passed === total) {
      console.log('\n🎉 All AG-UI integration tests passed!');
      console.log('✅ Phase 1 implementation is working correctly');
    } else {
      console.log('\n⚠️ Some tests failed. Review the details above.');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new AGUIIntegrationTestSuite();
  
  testSuite.runAllTests()
    .then(() => {
      console.log('\n✅ Test suite completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = AGUIIntegrationTestSuite;
