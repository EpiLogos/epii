/**
 * Test script for the updated Stage -4 of the Epii Analysis Pipeline
 *
 * This script tests the functionality of the updated stage_minus4.mjs that works
 * directly with bimbaMap format instead of converting to graphData.
 */

import { runStageMinus4 } from '../pipelines/stages/stage_minus4.mjs';

// Mock data for testing
const mockBimbaMap = {
  nodes: [
    {
      id: 'node1',
      coordinate: '#0',
      name: 'Anuttara',
      description: 'The foundation subsystem',
      type: 'Subsystem'
    },
    {
      id: 'node2',
      coordinate: '#1',
      name: 'Paramasiva',
      description: 'The logic subsystem',
      type: 'Subsystem'
    },
    {
      id: 'node3',
      coordinate: '#2',
      name: 'Parashakti',
      description: 'The templates subsystem',
      type: 'Subsystem'
    },
    {
      id: 'node4',
      coordinate: '#3',
      name: 'Mahamaya',
      description: 'The integration subsystem',
      type: 'Subsystem'
    },
    {
      id: 'node5',
      coordinate: '#4',
      name: 'Nara',
      description: 'The application subsystem',
      type: 'Subsystem'
    },
    {
      id: 'node6',
      coordinate: '#5',
      name: 'Epii',
      description: 'The integration subsystem',
      type: 'Subsystem'
    },
    {
      id: 'node7',
      coordinate: '#5-1',
      name: 'Epii Subnode 1',
      description: 'A subnode of Epii',
      type: 'Subnode'
    },
    {
      id: 'node8',
      coordinate: '#5-2',
      name: 'Epii Subnode 2',
      description: 'Another subnode of Epii',
      type: 'Subnode'
    }
  ],
  relationships: [
    {
      from: 'node1',
      to: 'node2',
      type: 'CONNECTS_TO'
    },
    {
      from: 'node2',
      to: 'node3',
      type: 'CONNECTS_TO'
    },
    {
      from: 'node3',
      to: 'node4',
      type: 'CONNECTS_TO'
    },
    {
      from: 'node4',
      to: 'node5',
      type: 'CONNECTS_TO'
    },
    {
      from: 'node5',
      to: 'node6',
      type: 'CONNECTS_TO'
    },
    {
      from: 'node6',
      to: 'node1',
      type: 'CONNECTS_TO'
    },
    {
      from: 'node6',
      to: 'node7',
      type: 'CONTAINS'
    },
    {
      from: 'node6',
      to: 'node8',
      type: 'CONTAINS'
    }
  ],
  structure: {},
  summary: {
    totalNodes: 8,
    totalRelationships: 8,
    rootNodes: [
      { coordinate: '#0', name: 'Anuttara' },
      { coordinate: '#1', name: 'Paramasiva' },
      { coordinate: '#2', name: 'Parashakti' },
      { coordinate: '#3', name: 'Mahamaya' },
      { coordinate: '#4', name: 'Nara' },
      { coordinate: '#5', name: 'Epii' }
    ]
  }
};

// Mock epiiLLMService
const mockLLMService = {
  generateContent: async (stage, systemPrompt, userPrompt, options) => {
    console.log(`Mock LLM called for stage ${stage}`);
    return `# Mock LLM Response for ${stage}

This is a mock response from the LLM service for testing purposes.
The system prompt was: ${systemPrompt.substring(0, 50)}...
The user prompt was: ${userPrompt.substring(0, 50)}...

## Mock Content

This is some mock content that would normally be generated by the LLM.
`;
  }
};

// Create a mock state from stage -5
const mockStageMinus5Output = {
  documentContent: 'This is a test document for the Epii Analysis Pipeline. It contains information about the Bimba coordinate system and the six subsystems: Anuttara, Paramasiva, Parashakti, Mahamaya, Nara, and Epii.',
  sourceFileName: 'test_document.md',
  sourceType: 'direct_content',
  fileId: null,
  userId: 'admin',
  targetCoordinate: '#5',
  documentId: 'test-doc-123',
  document: {
    _id: 'test-doc-123',
    textContent: 'This is a test document for the Epii Analysis Pipeline. It contains information about the Bimba coordinate system and the six subsystems: Anuttara, Paramasiva, Parashakti, Mahamaya, Nara, and Epii.',
    title: 'test_document.md'
  },
  bimbaMap: mockBimbaMap,
  documentFetched: true,
  sourceMetadata: {
    documentId: 'test-doc-123',
    sourceFileName: 'test_document.md',
    targetCoordinate: '#5',
    sourceType: 'direct_content'
  },
  bpMCPService: {
    updateDocument: async (documentId, update) => {
      console.log(`Mock updateDocument called for ${documentId}`);
      return { success: true };
    }
  },
  // Add the mock LLM service directly to the state
  epiiLLMService: mockLLMService
};

// We'll use a different approach to mock the LLM service
// Instead of trying to override the import, we'll pass it directly to the functions that need it

// Test stage -4
async function testStageMinus4() {
  console.log('=== Testing Updated Stage -4 (Contextualize Analysis) ===');

  try {
    const result = await runStageMinus4(mockStageMinus5Output);
    console.log('Stage -4 completed successfully');
    console.log(`Bimba-enhanced context length: ${result.bimbaEnhancedContext.length}`);
    console.log(`Bimba map summary length: ${result.bimbaMapSummary.length}`);
    console.log(`Coordinate map entries: ${Object.keys(result.coordinateMap).length}`);

    // Verify that no graphData or bimbaMapAsGraphData is present
    if (result.graphData) {
      console.error('ERROR: graphData is present in the result');
    } else {
      console.log('PASS: No graphData in the result');
    }

    if (result.bimbaMapAsGraphData) {
      console.error('ERROR: bimbaMapAsGraphData is present in the result');
    } else {
      console.log('PASS: No bimbaMapAsGraphData in the result');
    }

    return true;
  } catch (error) {
    console.error('Stage -4 failed:', error);
    return false;
  }
}

// Run the test
async function runTests() {
  console.log('Starting Updated Stage -4 tests...');

  const stageMinus4Result = await testStageMinus4();

  console.log('\nTest Results:');
  console.log(`Updated Stage -4 Test: ${stageMinus4Result ? 'PASSED' : 'FAILED'}`);

  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
