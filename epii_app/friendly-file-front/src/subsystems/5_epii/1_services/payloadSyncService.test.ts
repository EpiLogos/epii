/**
 * Test file for payload sync service
 * Run this to verify the sync functionality works correctly
 */

import {
  syncTextContentToMetadata,
  syncMetadataToTextContent,
  performSyncCheck,
  isValidNotionUpdatePayload,
  processPayloadForNotion
} from './payloadSyncService';

// Mock NotionUpdatePayload for testing
const mockPayload = {
  targetCoordinate: "#1-4",
  title: "Test Analysis",
  properties: {
    "QL Operators": ["test-operator"],
    "Epistemic Essence": ["test-essence"]
  },
  contentBlocks: [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Analysis Summary"
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "This is a test analysis result."
            }
          }
        ]
      }
    }
  ],
  timestamp: "2025-05-23T12:05:07.419Z"
};

// Test functions
console.log('=== Testing Payload Sync Service ===\n');

// Test 1: Validate payload structure
console.log('Test 1: Validate payload structure');
const isValid = isValidNotionUpdatePayload(mockPayload);
console.log('Is valid payload:', isValid);
console.log('Expected: true\n');

// Test 2: Sync metadata to textContent
console.log('Test 2: Sync metadata to textContent');
const metadata = { notionUpdatePayload: mockPayload };
const syncToTextResult = syncMetadataToTextContent(metadata);
console.log('Sync success:', syncToTextResult.success);
console.log('TextContent length:', syncToTextResult.textContent.length);
console.log('TextContent preview:', syncToTextResult.textContent.substring(0, 100) + '...\n');

// Test 3: Sync textContent back to metadata
console.log('Test 3: Sync textContent back to metadata');
if (syncToTextResult.success) {
  const syncToMetadataResult = syncTextContentToMetadata(syncToTextResult.textContent, {});
  console.log('Sync success:', syncToMetadataResult.success);
  console.log('Metadata has payload:', !!syncToMetadataResult.metadata.notionUpdatePayload);
  console.log('Block count matches:',
    syncToMetadataResult.metadata.notionUpdatePayload?.contentBlocks?.length === mockPayload.contentBlocks.length);
}

console.log('\n=== Test Complete ===');

// Test 4: Block chunking for large content
console.log('\nTest 4: Block chunking for large content');
const largeContent = 'A'.repeat(5000); // 5000 character string
const payloadWithLargeBlock = {
  ...mockPayload,
  contentBlocks: [
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: largeContent
            }
          }
        ]
      }
    }
  ]
};

const processedPayload = processPayloadForNotion(payloadWithLargeBlock);
console.log('Original blocks:', payloadWithLargeBlock.contentBlocks.length);
console.log('Processed blocks:', processedPayload.contentBlocks.length);
console.log('Expected: More blocks due to chunking');

console.log('\n=== All Tests Complete ===');

// Test 5: Block-level change detection
console.log('\nTest 5: Block-level change detection');
const originalPayload = {
  ...mockPayload,
  contentBlocks: [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Original Heading"
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Original paragraph content."
            }
          }
        ]
      }
    }
  ]
};

// Create modified version with only second block changed
const modifiedPayload = {
  ...originalPayload,
  contentBlocks: [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Original Heading"  // Unchanged
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Modified paragraph content with new text."  // Changed
            }
          }
        ]
      }
    }
  ]
};

// Test block-level sync
const originalMetadata = { notionUpdatePayload: originalPayload };
const modifiedTextContent = JSON.stringify(modifiedPayload, null, 2);

const fieldSyncResult = syncTextContentToMetadata(modifiedTextContent, originalMetadata);
console.log('Field-level sync success:', fieldSyncResult.success);
console.log('Changed fields:', fieldSyncResult.changedFields?.length || 0);
console.log('Field paths:', fieldSyncResult.changedFields?.map(f => f.fieldPath) || []);

if (fieldSyncResult.success && fieldSyncResult.changedFields) {
  const hasExpectedChange = fieldSyncResult.changedFields.some(f =>
    f.fieldPath.includes('contentBlocks[1]') && f.fieldPath.includes('content')
  );
  console.log('Field-level sync working correctly:', hasExpectedChange);
  console.log('Expected: change in contentBlocks[1] content field');
}

console.log('\n=== All Tests Complete ===');

// Test 6: Content sanitization for Notion compliance
console.log('\nTest 6: Content sanitization for Notion compliance');
const payloadWithInvalidContent = {
  ...mockPayload,
  contentBlocks: [
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: {
              content: { // ❌ This is an object, should be a string
                name: "QL-PROC-1: Double Covering",
                description: "This is a complex object that should be stringified"
              }
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "This is valid string content" // ✅ This is already a string
            }
          }
        ]
      }
    }
  ]
};

const sanitizedPayload = processPayloadForNotion(payloadWithInvalidContent);
console.log('Original block 0 content type:', typeof payloadWithInvalidContent.contentBlocks[0].bulleted_list_item.rich_text[0].text.content);
console.log('Sanitized block 0 content type:', typeof sanitizedPayload.contentBlocks[0].bulleted_list_item.rich_text[0].text.content);
console.log('Sanitized content preview:', sanitizedPayload.contentBlocks[0].bulleted_list_item.rich_text[0].text.content.substring(0, 100) + '...');

console.log('\n=== All Tests Complete ===');