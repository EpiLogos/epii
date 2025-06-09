/**
 * Direct test of the Bimba Update Management Skill
 * Tests the skill directly without going through the A2A server
 */

const BimbaUpdateManagementSkill = require('./skills/bimba-update-management-skill');

async function testSkillDirect() {
  console.log('🧪 Testing Bimba Update Management Skill Directly\n');

  const skill = new BimbaUpdateManagementSkill();
  
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

  const testContext = {
    agentId: "test-direct",
    agentCoordinate: '#5-2',
    targetCoordinate: "#5-2",
    requestType: 'bimba-update-suggestions'
  };

  console.log('📋 Test parameters:', {
    coordinate: testParams.coordinate,
    documentType: testParams.documentType,
    documentName: testParams.documentName,
    contentLength: testParams.documentContent.length,
    propertiesCount: Object.keys(testParams.nodeProperties).length,
    relationshipsCount: testParams.relationships.length
  });

  try {
    console.log('\n🎯 Calling skill directly...');
    const result = await skill.execute(testParams, testContext);
    
    console.log('\n🎉 Skill execution completed!');
    console.log('📊 RESULT:', JSON.stringify(result, null, 2));
    
    // Analyze the result
    if (result.success) {
      console.log('\n✅ Skill executed successfully');
      
      if (result.data && result.data.propertyUpdates) {
        const propCount = Object.keys(result.data.propertyUpdates).length;
        console.log(`📋 Property Updates: ${propCount}`);
        
        if (propCount > 0) {
          console.log('Property Updates:');
          Object.entries(result.data.propertyUpdates).forEach(([key, value]) => {
            console.log(`  • ${key}: ${value}`);
          });
        }
      }
      
      if (result.data && result.data.relationshipSuggestions) {
        const relCount = result.data.relationshipSuggestions.length;
        console.log(`🔗 Relationship Suggestions: ${relCount}`);
        
        if (relCount > 0) {
          console.log('Relationship Suggestions:');
          result.data.relationshipSuggestions.forEach((rel, index) => {
            console.log(`  ${index + 1}. ${rel.type} -> ${rel.targetCoordinate}`);
            if (rel.reasoning) {
              console.log(`     Reasoning: ${rel.reasoning}`);
            }
          });
        }
      }
    } else {
      console.log('\n❌ Skill execution failed');
      console.log('Error:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('\n💥 Error during skill execution:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSkillDirect()
    .then((result) => {
      console.log('\n✅ Direct test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Direct test failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    });
}

module.exports = testSkillDirect;
