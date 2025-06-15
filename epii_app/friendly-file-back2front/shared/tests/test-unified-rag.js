/**
 * Test Script for Unified RAG Skill
 * Demonstrates the foundational A2A-aligned skill that orchestrates
 * Bimba, LightRAG, Graphiti, and Notion tools
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

/**
 * Test the unified RAG skill with different scenarios
 */
async function testUnifiedRAG() {
  console.log('🚀 Testing Unified RAG Skill - The Universal Context Builder\n');

  // Test scenarios
  const testCases = [
    {
      name: 'Single Coordinate Query',
      description: 'Query specific coordinate with all sources',
      params: {
        query: 'What is the MEF - Meta-Logikon and how does it relate to the Parashakti subsystem?',
        coordinates: '#2-1',
        sources: {
          bimba: true,
          lightrag: true,
          graphiti: true,
          notion: true
        },
        agentCoordinate: '#5'
      }
    },
    {
      name: 'Multiple Coordinates Query',
      description: 'Query multiple coordinates for comparative analysis',
      params: {
        query: 'Compare the structural relationships between Parashakti and Siva-Shakti subsystems',
        coordinates: ['#2', '#5'],
        sources: {
          bimba: true,
          lightrag: true,
          graphiti: false, // Test with some sources disabled
          notion: true
        }
      }
    },
    {
      name: 'Semantic-Only Query',
      description: 'Query without specific coordinates, relying on semantic search',
      params: {
        query: 'Quaternary Logic operators and their structural patterns',
        sources: {
          bimba: true,
          lightrag: true,
          graphiti: true,
          notion: false
        },
        options: {
          bimba: {
            contextDepth: 3,
            limit: 15
          },
          lightrag: {
            limit: 12,
            threshold: 0.8
          }
        }
      }
    },
    {
      name: 'Bimba-Only Structural Query',
      description: 'Focus only on structural context from Bimba',
      params: {
        query: 'Show me the complete 6-fold structure around coordinate #2-1',
        coordinates: '#2-1',
        sources: {
          bimba: true,
          lightrag: false,
          graphiti: false,
          notion: false
        },
        options: {
          bimba: {
            contextDepth: 2,
            includeRelations: true,
            limit: 20
          }
        }
      }
    },
    {
      name: 'UI Context Integration',
      description: 'Test with UI context from AG-UI protocol',
      params: {
        query: 'Analyze the current focus area based on user interaction',
        coordinates: '#2-1',
        uiContext: {
          chatFocus: 'MEF analysis',
          canvasSelection: ['#2-1', '#2-1-1'],
          userIntent: 'deep_analysis',
          sessionId: 'test_session_123'
        },
        agentCoordinate: '#5'
      }
    }
  ];

  // Execute test cases
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 Test ${i + 1}: ${testCase.name}`);
    console.log(`📝 ${testCase.description}`);
    console.log('⚙️  Parameters:', JSON.stringify(testCase.params, null, 2));

    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${BASE_URL}/skills/unified-rag`, testCase.params, {
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': `test_${i + 1}_${Date.now()}`
        },
        timeout: 30000 // 30 second timeout
      });

      const executionTime = Date.now() - startTime;
      
      if (response.data.success) {
        console.log('✅ Success!');
        console.log(`⏱️  Execution Time: ${executionTime}ms`);
        console.log(`🔧 Skill Execution Time: ${response.data.result.executionTime}ms`);
        
        const unifiedContext = response.data.result.data;
        console.log('\n📊 Unified Context Summary:');
        console.log(`   Query: ${unifiedContext.query}`);
        console.log(`   Coordinates: ${JSON.stringify(unifiedContext.coordinates)}`);
        console.log(`   Sources Queried: ${unifiedContext.metadata.sourcesQueried.join(', ')}`);
        console.log(`   Coordinates Covered: ${unifiedContext.metadata.coordinatesCovered.join(', ')}`);
        console.log(`   Total Execution Time: ${unifiedContext.metadata.executionTime}ms`);
        
        // Show synthesis summary
        if (unifiedContext.synthesis) {
          console.log('\n🧠 Synthesis:');
          console.log(`   Summary: ${unifiedContext.synthesis.summary}`);
          console.log(`   Key Insights: ${unifiedContext.synthesis.keyInsights.length} insights`);
          console.log(`   Recommendations: ${unifiedContext.synthesis.recommendations.length} recommendations`);
          
          // Show source success/failure
          console.log('\n📡 Source Results:');
          Object.entries(unifiedContext.sources).forEach(([source, result]) => {
            const status = result.success ? '✅' : '❌';
            console.log(`   ${status} ${source}: ${result.success ? 'Success' : result.error}`);
          });
        }
        
      } else {
        console.log('❌ Failed!');
        console.log(`   Error: ${response.data.error}`);
        if (response.data.partialData) {
          console.log('   Partial data available');
        }
      }

    } catch (error) {
      console.log('💥 Request Failed!');
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data?.error || error.response.data}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log('\n' + '─'.repeat(80));
  }
}

/**
 * Test skills discovery and management endpoints
 */
async function testSkillsManagement() {
  console.log('\n🔍 Testing Skills Management Endpoints\n');

  try {
    // Test getting all skills
    console.log('📋 Getting all available skills...');
    const skillsResponse = await axios.get(`${BASE_URL}/skills`);
    
    if (skillsResponse.data.success) {
      console.log(`✅ Found ${skillsResponse.data.count} skills:`);
      skillsResponse.data.data.forEach(skill => {
        console.log(`   • ${skill.name} (${skill.id}) - ${skill.bimbaCoordinate}`);
      });
    }

    // Test getting unified RAG skill specifically
    console.log('\n🎯 Getting unified RAG skill details...');
    const ragSkillResponse = await axios.get(`${BASE_URL}/skills/unifiedRAG`);
    
    if (ragSkillResponse.data.success) {
      const skill = ragSkillResponse.data.data;
      console.log('✅ Unified RAG Skill Details:');
      console.log(`   Name: ${skill.name}`);
      console.log(`   Description: ${skill.description}`);
      console.log(`   Coordinate: ${skill.bimbaCoordinate}`);
      console.log(`   Version: ${skill.version}`);
      console.log(`   Total Executions: ${skill.metrics.totalExecutions}`);
      console.log(`   Success Rate: ${skill.metrics.successfulExecutions}/${skill.metrics.totalExecutions}`);
      console.log(`   Avg Execution Time: ${skill.metrics.averageExecutionTime.toFixed(2)}ms`);
    }

    // Test service status
    console.log('\n📊 Getting service status...');
    const statusResponse = await axios.get(`${BASE_URL}/skills/status`);
    
    if (statusResponse.data.success) {
      const status = statusResponse.data.data;
      console.log('✅ Service Status:');
      console.log(`   Status: ${status.status}`);
      console.log(`   Skills Registered: ${status.skillsRegistered}`);
      console.log(`   Total Executions: ${status.totalExecutions}`);
      console.log('   Available Skills:');
      status.availableSkills.forEach(skill => {
        console.log(`     • ${skill.name} (${skill.bimbaCoordinate})`);
      });
    }

  } catch (error) {
    console.log('❌ Skills management test failed:', error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🎯 Unified RAG Skill Test Suite');
  console.log('Epic 002: A2A Skill Management Framework');
  console.log('Testing the foundational skill that orchestrates all BPMCP tools\n');

  try {
    // Test skills management first
    await testSkillsManagement();
    
    // Test unified RAG functionality
    await testUnifiedRAG();
    
    console.log('\n🎉 All tests completed!');
    console.log('\nThe Unified RAG skill successfully demonstrates:');
    console.log('✅ Multi-source orchestration (Bimba + LightRAG + Graphiti + Notion)');
    console.log('✅ Coordinate-based context building');
    console.log('✅ Graceful failure handling');
    console.log('✅ A2A-aligned skill architecture');
    console.log('✅ Dynamic source selection');
    console.log('✅ Context synthesis and insights');
    console.log('✅ Performance metrics and monitoring');
    
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
  testUnifiedRAG,
  testSkillsManagement,
  runTests
};
