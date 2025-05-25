/**
 * Payload Sync Service
 * Handles bidirectional synchronization between textContent and metadata.notionUpdatePayload
 *
 * DEVELOPMENT STATUS: FEATURE TEMPORARILY DEFERRED
 *
 * SYNC FEATURE IMPLEMENTATION ATTEMPTS:
 * 1. Block-level comparison and replacement
 * 2. Field-level change detection with JSON path tracking
 * 3. React state management and re-rendering optimization
 *
 * CHALLENGES ENCOUNTERED:
 * - React component re-rendering complexities
 * - State management race conditions between useEffect and manual updates
 * - Complex nested object synchronization between textContent JSON and metadata
 * - Performance impacts from frequent sync operations and debug logging
 *
 * CURRENT WORKAROUND:
 * - Users can edit textContent in DocumentCanvas for analysis and review
 * - Crystallization to Notion uses existing metadata.notionUpdatePayload as-is
 * - Post-crystallization edits can be made directly in Notion
 *
 * FUTURE IMPLEMENTATION APPROACHES:
 * 1. Generate metadata.notionUpdatePayload AFTER textContent edits (post-edit approach)
 * 2. Implement more robust React state management for payload updates
 * 3. Add granular change detection with cursor position tracking
 * 4. Consider alternative UI patterns (e.g., explicit "sync" button)
 *
 * DEFERRED FUNCTIONS:
 * - syncTextContentToMetadata() - Field-level sync implementation (commented out in usage)
 * - Related debugging and state management logic
 */

import { NotionUpdatePayload } from '../0_foundation/epiiTypes';

/**
 * Validates if a parsed object looks like a valid NotionUpdatePayload
 */
export function isValidNotionUpdatePayload(obj: any): obj is NotionUpdatePayload {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.targetCoordinate === 'string' &&
    Array.isArray(obj.contentBlocks) &&
    obj.contentBlocks.length > 0
  );
}

/**
 * Extracts text content from a Notion block for comparison
 */
function extractBlockTextContent(block: any): string {
  if (!block || typeof block !== 'object' || !block.type) {
    return '';
  }

  const blockData = block[block.type];
  if (!blockData || typeof blockData !== 'object') {
    return '';
  }

  // Handle rich_text arrays
  if ('rich_text' in blockData && Array.isArray(blockData.rich_text)) {
    return blockData.rich_text
      .map((rt: any) => rt.text?.content || rt.plain_text || '')
      .join('')
      .trim();
  }

  // Handle direct text content
  if ('text' in blockData && typeof blockData.text === 'string') {
    return blockData.text;
  }

  // Handle content field
  if ('content' in blockData && typeof blockData.content === 'string') {
    return blockData.content;
  }

  return '';
}

/**
 * Updates a block's text content while preserving its structure
 */
function updateBlockTextContent(block: any, newTextContent: string): any {
  if (!block || typeof block !== 'object' || !block.type) {
    return block;
  }

  const blockData = block[block.type];
  if (!blockData || typeof blockData !== 'object') {
    return block;
  }

  // Handle rich_text arrays (most common case)
  if ('rich_text' in blockData && Array.isArray(blockData.rich_text)) {
    return {
      ...block,
      [block.type]: {
        ...blockData,
        rich_text: [{
          type: "text",
          text: {
            content: newTextContent
          }
        }]
      }
    };
  }

  // Handle direct text content
  if ('text' in blockData) {
    return {
      ...block,
      [block.type]: {
        ...blockData,
        text: newTextContent
      }
    };
  }

  // Handle content field
  if ('content' in blockData) {
    return {
      ...block,
      [block.type]: {
        ...blockData,
        content: newTextContent
      }
    };
  }

  return block;
}

/**
 * Field-level change tracking interface
 */
interface FieldChange {
  fieldPath: string;
  oldValue: any;
  newValue: any;
  blockIndex?: number;
}

/**
 * Generates a unique field path for a JSON property
 */
function generateFieldPath(path: string[]): string {
  return path.join('.');
}

/**
 * Gets a value from an object using a dot-notation path
 */
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (current === null || current === undefined) return undefined;

    // Handle array indices
    if (key.includes('[') && key.includes(']')) {
      const [arrayKey, indexStr] = key.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      return current[arrayKey]?.[index];
    }

    return current[key];
  }, obj);
}

/**
 * Sets a value in an object using a dot-notation path
 */
function setValueByPath(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;

  const target = keys.reduce((current, key) => {
    if (current === null || current === undefined) return {};

    // Handle array indices
    if (key.includes('[') && key.includes(']')) {
      const [arrayKey, indexStr] = key.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      if (!current[arrayKey]) current[arrayKey] = [];
      if (!current[arrayKey][index]) current[arrayKey][index] = {};
      return current[arrayKey][index];
    }

    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);

  // Handle array index in last key
  if (lastKey.includes('[') && lastKey.includes(']')) {
    const [arrayKey, indexStr] = lastKey.split('[');
    const index = parseInt(indexStr.replace(']', ''));
    if (!target[arrayKey]) target[arrayKey] = [];
    target[arrayKey][index] = value;
  } else {
    target[lastKey] = value;
  }
}

/**
 * Detects field-level changes between two JSON objects
 */
function detectFieldChanges(oldObj: any, newObj: any, basePath: string[] = []): FieldChange[] {
  const changes: FieldChange[] = [];

  // Get all unique keys from both objects
  const allKeys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {})
  ]);

  for (const key of allKeys) {
    const currentPath = [...basePath, key];
    const fieldPath = generateFieldPath(currentPath);
    const oldValue = oldObj?.[key];
    const newValue = newObj?.[key];

    // Skip if values are identical
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
      continue;
    }

    // Handle arrays (like contentBlocks)
    if (Array.isArray(newValue) && Array.isArray(oldValue)) {
      const maxLength = Math.max(newValue.length, oldValue.length);

      for (let i = 0; i < maxLength; i++) {
        const arrayPath = [...currentPath, `[${i}]`];
        const oldItem = oldValue[i];
        const newItem = newValue[i];

        if (newItem === undefined) {
          // Item was deleted
          changes.push({
            fieldPath: generateFieldPath(arrayPath),
            oldValue: oldItem,
            newValue: undefined,
            blockIndex: key === 'contentBlocks' ? i : undefined
          });
        } else if (oldItem === undefined) {
          // Item was added
          changes.push({
            fieldPath: generateFieldPath(arrayPath),
            oldValue: undefined,
            newValue: newItem,
            blockIndex: key === 'contentBlocks' ? i : undefined
          });
        } else if (typeof newItem === 'object' && typeof oldItem === 'object') {
          // Recursively check object properties
          const nestedChanges = detectFieldChanges(oldItem, newItem, arrayPath);
          changes.push(...nestedChanges);
        } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
          // Primitive value changed
          changes.push({
            fieldPath: generateFieldPath(arrayPath),
            oldValue: oldItem,
            newValue: newItem,
            blockIndex: key === 'contentBlocks' ? i : undefined
          });
        }
      }
    }
    // Handle nested objects
    else if (typeof newValue === 'object' && typeof oldValue === 'object' &&
             newValue !== null && oldValue !== null) {
      const nestedChanges = detectFieldChanges(oldValue, newValue, currentPath);
      changes.push(...nestedChanges);
    }
    // Handle primitive values
    else {
      changes.push({
        fieldPath,
        oldValue,
        newValue,
        blockIndex: basePath[0] === 'contentBlocks' ? parseInt(basePath[1]?.replace(/[\[\]]/g, '') || '-1') : undefined
      });
    }
  }

  return changes;
}

/**
 * Applies field-level changes to a target object
 */
function applyFieldChanges(targetObj: any, changes: FieldChange[]): any {
  // Deep clone the target object to avoid mutations
  const result = JSON.parse(JSON.stringify(targetObj));

  for (const change of changes) {
    if (change.newValue === undefined) {
      // Handle deletion - this is complex for nested paths, skip for now
      console.log(`Skipping deletion of ${change.fieldPath} - not implemented`);
      continue;
    }

    try {
      setValueByPath(result, change.fieldPath, change.newValue);
      console.log(`Applied change: ${change.fieldPath} = ${JSON.stringify(change.newValue).substring(0, 100)}...`);
    } catch (error) {
      console.warn(`Failed to apply change to ${change.fieldPath}:`, error);
    }
  }

  return result;
}

/**
 * SIMPLIFIED DIRECT SYNC: Direct JSON structure to metadata.notionUpdatePayload mapping
 * Focuses on the 1-to-1 isomorphism between JSON and block array objects
 */
export function syncTextContentToMetadata(
  textContent: string,
  currentMetadata: any = {}
): { success: boolean; metadata: any; error?: string; changedFields?: FieldChange[] } {
  try {
    // Parse the textContent as JSON
    const parsedPayload = JSON.parse(textContent);

    // Validate the parsed payload
    if (!isValidNotionUpdatePayload(parsedPayload)) {
      return {
        success: false,
        metadata: currentMetadata,
        error: 'Parsed content is not a valid NotionUpdatePayload structure'
      };
    }

    // Get the current payload from metadata
    const currentPayload = currentMetadata?.notionUpdatePayload;

    // If no current payload exists, use the parsed payload as-is
    if (!currentPayload || !isValidNotionUpdatePayload(currentPayload)) {
      console.log('No existing payload found, using parsed payload as-is');
      const processedPayload = processPayloadForNotion(parsedPayload);

      const updatedMetadata = {
        ...currentMetadata,
        notionUpdatePayload: processedPayload,
        status: 'ready_for_notion'
      };

      return {
        success: true,
        metadata: updatedMetadata,
        changedFields: [] // All fields are new
      };
    }

    // SIMPLIFIED APPROACH: Direct block-by-block comparison and replacement
    console.log('Performing direct JSON-to-metadata sync...');

    // Start with current payload structure
    const updatedPayload = {
      ...currentPayload,
      // Update top-level properties directly from parsed JSON
      targetCoordinate: parsedPayload.targetCoordinate || currentPayload.targetCoordinate,
      title: parsedPayload.title || currentPayload.title,
      properties: parsedPayload.properties || currentPayload.properties,
      timestamp: parsedPayload.timestamp || currentPayload.timestamp
    };

    // Handle contentBlocks array with direct comparison
    const changes: FieldChange[] = [];
    const currentBlocks = currentPayload.contentBlocks || [];
    const parsedBlocks = parsedPayload.contentBlocks || [];

    // Compare block arrays directly
    if (JSON.stringify(currentBlocks) !== JSON.stringify(parsedBlocks)) {
      console.log('ContentBlocks array changed - performing direct replacement');

      // For each block, check if it changed
      const maxBlocks = Math.max(currentBlocks.length, parsedBlocks.length);

      for (let i = 0; i < maxBlocks; i++) {
        const currentBlock = currentBlocks[i];
        const parsedBlock = parsedBlocks[i];

        if (JSON.stringify(currentBlock) !== JSON.stringify(parsedBlock)) {
          changes.push({
            fieldPath: `contentBlocks[${i}]`,
            oldValue: currentBlock,
            newValue: parsedBlock,
            blockIndex: i
          });

          console.log(`Block ${i} changed:`, {
            old: currentBlock ? 'exists' : 'undefined',
            new: parsedBlock ? 'exists' : 'undefined'
          });
        }
      }

      // DIRECT REPLACEMENT: Use the parsed blocks array as-is
      updatedPayload.contentBlocks = parsedBlocks;
      console.log(`Replaced contentBlocks array: ${currentBlocks.length} → ${parsedBlocks.length} blocks`);
    } else {
      console.log('ContentBlocks array unchanged');
    }

    // Process for Notion compliance (chunking large blocks)
    const processedPayload = processPayloadForNotion(updatedPayload);

    // Update metadata
    const updatedMetadata = {
      ...currentMetadata,
      notionUpdatePayload: processedPayload,
      status: 'ready_for_notion'
    };

    console.log(`Direct sync completed: ${changes.length} block changes detected`);

    // Verify the sync worked
    const finalBlockCount = updatedMetadata.notionUpdatePayload?.contentBlocks?.length || 0;
    console.log(`Final metadata has ${finalBlockCount} content blocks`);

    return {
      success: true,
      metadata: updatedMetadata,
      changedFields: changes
    };
  } catch (parseError) {
    return {
      success: false,
      metadata: currentMetadata,
      error: `Failed to parse textContent as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
    };
  }
}

/**
 * Syncs metadata.notionUpdatePayload to textContent
 * Stringifies the structured payload for editing
 */
export function syncMetadataToTextContent(
  metadata: any
): { success: boolean; textContent: string; error?: string } {
  try {
    // Check if metadata has notionUpdatePayload
    if (!metadata?.notionUpdatePayload) {
      return {
        success: false,
        textContent: '',
        error: 'No notionUpdatePayload found in metadata'
      };
    }

    // Validate the payload structure
    if (!isValidNotionUpdatePayload(metadata.notionUpdatePayload)) {
      return {
        success: false,
        textContent: '',
        error: 'Invalid notionUpdatePayload structure in metadata'
      };
    }

    // Stringify the payload with proper formatting
    const textContent = JSON.stringify(metadata.notionUpdatePayload, null, 2);

    console.log(`Synced metadata to textContent: ${textContent.length} characters`);

    return {
      success: true,
      textContent
    };
  } catch (stringifyError) {
    return {
      success: false,
      textContent: '',
      error: `Failed to stringify metadata: ${stringifyError instanceof Error ? stringifyError.message : 'Unknown error'}`
    };
  }
}

/**
 * Performs bidirectional sync check and returns the authoritative version
 * Determines which source (textContent or metadata) should be considered authoritative
 */
export function performSyncCheck(
  textContent: string,
  metadata: any,
  lastModified?: Date
): {
  shouldSyncToMetadata: boolean;
  shouldSyncToTextContent: boolean;
  authoritativeSource: 'textContent' | 'metadata' | 'none';
  error?: string;
} {
  const hasValidTextContent = textContent && textContent.trim().length > 0;
  const hasValidMetadata = metadata?.notionUpdatePayload && isValidNotionUpdatePayload(metadata.notionUpdatePayload);

  // If both are valid, prefer metadata as source of truth (structured data)
  if (hasValidTextContent && hasValidMetadata) {
    try {
      const parsedTextContent = JSON.parse(textContent);
      const metadataPayload = metadata.notionUpdatePayload;

      // Compare content blocks length as a simple sync check
      const textContentBlocksLength = parsedTextContent.contentBlocks?.length || 0;
      const metadataBlocksLength = metadataPayload.contentBlocks?.length || 0;

      if (textContentBlocksLength !== metadataBlocksLength) {
        // They're out of sync - prefer metadata as source of truth
        return {
          shouldSyncToMetadata: false,
          shouldSyncToTextContent: true,
          authoritativeSource: 'metadata'
        };
      }

      // They appear to be in sync
      return {
        shouldSyncToMetadata: false,
        shouldSyncToTextContent: false,
        authoritativeSource: 'metadata'
      };
    } catch {
      // textContent is invalid JSON, sync from metadata
      return {
        shouldSyncToMetadata: false,
        shouldSyncToTextContent: true,
        authoritativeSource: 'metadata'
      };
    }
  }

  // If only metadata is valid, sync to textContent
  if (!hasValidTextContent && hasValidMetadata) {
    return {
      shouldSyncToMetadata: false,
      shouldSyncToTextContent: true,
      authoritativeSource: 'metadata'
    };
  }

  // If only textContent is valid, sync to metadata
  if (hasValidTextContent && !hasValidMetadata) {
    return {
      shouldSyncToMetadata: true,
      shouldSyncToTextContent: false,
      authoritativeSource: 'textContent'
    };
  }

  // Neither is valid
  return {
    shouldSyncToMetadata: false,
    shouldSyncToTextContent: false,
    authoritativeSource: 'none',
    error: 'Neither textContent nor metadata contains valid NotionUpdatePayload'
  };
}

/**
 * Chunks large text content into smaller pieces for Notion blocks
 * Notion has a 2000 character limit per text block
 */
function chunkTextContent(text: string, maxLength: number = 1900): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let chunkEnd = currentIndex + maxLength;

    // If we're not at the end, try to break at a sentence or word boundary
    if (chunkEnd < text.length) {
      // Look for sentence endings first
      const sentenceEnd = text.lastIndexOf('.', chunkEnd);
      const questionEnd = text.lastIndexOf('?', chunkEnd);
      const exclamationEnd = text.lastIndexOf('!', chunkEnd);

      const bestSentenceEnd = Math.max(sentenceEnd, questionEnd, exclamationEnd);

      if (bestSentenceEnd > currentIndex + maxLength * 0.5) {
        chunkEnd = bestSentenceEnd + 1;
      } else {
        // Fall back to word boundary
        const wordEnd = text.lastIndexOf(' ', chunkEnd);
        if (wordEnd > currentIndex + maxLength * 0.5) {
          chunkEnd = wordEnd;
        }
      }
    }

    chunks.push(text.slice(currentIndex, chunkEnd).trim());
    currentIndex = chunkEnd;
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Sanitizes rich_text content to ensure all content fields are strings
 */
function sanitizeRichTextContent(richTextArray: any[]): any[] {
  return richTextArray.map(rt => {
    if (rt.text && rt.text.content !== undefined) {
      // Ensure content is always a string
      if (typeof rt.text.content !== 'string') {
        console.warn('Converting non-string content to string:', typeof rt.text.content);
        rt.text.content = typeof rt.text.content === 'object'
          ? JSON.stringify(rt.text.content, null, 2)
          : String(rt.text.content);
      }
    }
    return rt;
  });
}

/**
 * Sanitizes a single block to ensure all text content is properly stringified
 */
function sanitizeBlock(block: any): any {
  if (!block || typeof block !== 'object' || !block.type) {
    return block;
  }

  const blockData = block[block.type];
  if (!blockData || typeof blockData !== 'object') {
    return block;
  }

  // Sanitize rich_text arrays
  if ('rich_text' in blockData && Array.isArray(blockData.rich_text)) {
    return {
      ...block,
      [block.type]: {
        ...blockData,
        rich_text: sanitizeRichTextContent(blockData.rich_text)
      }
    };
  }

  // Sanitize direct text content
  if ('text' in blockData && typeof blockData.text !== 'string') {
    return {
      ...block,
      [block.type]: {
        ...blockData,
        text: typeof blockData.text === 'object'
          ? JSON.stringify(blockData.text, null, 2)
          : String(blockData.text)
      }
    };
  }

  // Sanitize content field
  if ('content' in blockData && typeof blockData.content !== 'string') {
    return {
      ...block,
      [block.type]: {
        ...blockData,
        content: typeof blockData.content === 'object'
          ? JSON.stringify(blockData.content, null, 2)
          : String(blockData.content)
      }
    };
  }

  return block;
}

/**
 * Processes a NotionUpdatePayload to ensure all blocks comply with Notion's limits
 * Splits large blocks into multiple smaller blocks and sanitizes content
 */
export function processPayloadForNotion(payload: NotionUpdatePayload): NotionUpdatePayload {
  if (!payload.contentBlocks || !Array.isArray(payload.contentBlocks)) {
    return payload;
  }

  const processedBlocks: any[] = [];

  payload.contentBlocks.forEach((block, index) => {
    if (!block || typeof block !== 'object' || !block.type) {
      console.warn(`Skipping invalid block at index ${index}:`, block);
      return;
    }

    // FIRST: Sanitize the block to ensure all content is properly stringified
    const sanitizedBlock = sanitizeBlock(block);

    // Get the block's text content from sanitized block
    const blockData = sanitizedBlock[sanitizedBlock.type];
    if (!blockData || typeof blockData !== 'object') {
      processedBlocks.push(sanitizedBlock);
      return;
    }

    let needsChunking = false;

    // Check if block has rich_text that might be too long
    if ('rich_text' in blockData && Array.isArray(blockData.rich_text)) {
      const richTextArray = blockData.rich_text;
      let totalLength = 0;

      // Calculate total text length
      richTextArray.forEach((rt: any) => {
        if (rt.text?.content) {
          totalLength += rt.text.content.length;
        }
      });

      if (totalLength > 1900) {
        needsChunking = true;

        // Extract all text content
        const fullText = richTextArray
          .map((rt: any) => rt.text?.content || '')
          .join('');

        // Chunk the text
        const textChunks = chunkTextContent(fullText);

        // Create multiple blocks from chunks
        textChunks.forEach((chunk, chunkIndex) => {
          const newBlock = {
            ...sanitizedBlock,
            [sanitizedBlock.type]: {
              ...blockData,
              rich_text: [{
                type: "text",
                text: {
                  content: chunk // chunk is already a string from chunkTextContent
                }
              }]
            }
          };

          processedBlocks.push(newBlock);
        });

        console.log(`Chunked block ${index} (${totalLength} chars) into ${textChunks.length} blocks`);
      }
    }

    if (!needsChunking) {
      processedBlocks.push(sanitizedBlock);
    }
  });

  return {
    ...payload,
    contentBlocks: processedBlocks
  };
}

/**
 * Extracts a summary of the payload for display purposes
 */
export function getPayloadSummary(payload: NotionUpdatePayload): {
  blockCount: number;
  title: string;
  targetCoordinate: string;
  hasProperties: boolean;
  propertyCount: number;
} {
  return {
    blockCount: payload.contentBlocks?.length || 0,
    title: payload.title || 'Untitled',
    targetCoordinate: payload.targetCoordinate || '#',
    hasProperties: !!(payload.properties && Object.keys(payload.properties).length > 0),
    propertyCount: payload.properties ? Object.keys(payload.properties).length : 0
  };
}
