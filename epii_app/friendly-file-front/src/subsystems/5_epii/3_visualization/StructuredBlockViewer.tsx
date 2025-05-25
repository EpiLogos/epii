/**
 * Structured Block Viewer Component
 * Displays NotionUpdatePayload contentBlocks in a clean toggle tree format
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Hash, List, Code, Quote, ToggleLeft, CheckSquare, Minus } from 'lucide-react';
import { NotionUpdatePayload, NotionBlock } from '../0_foundation/epiiTypes';

interface StructuredBlockViewerProps {
  payload: NotionUpdatePayload;
  className?: string;
}

interface BlockViewerProps {
  block: NotionBlock;
  index: number;
  depth?: number;
}

const BlockViewer: React.FC<BlockViewerProps> = ({ block, index, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get block icon based on type
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        return <Hash size={14} className="text-blue-400" />;
      case 'paragraph':
        return <FileText size={14} className="text-gray-400" />;
      case 'bulleted_list_item':
      case 'numbered_list_item':
        return <List size={14} className="text-green-400" />;
      case 'code':
        return <Code size={14} className="text-purple-400" />;
      case 'quote':
        return <Quote size={14} className="text-yellow-400" />;
      case 'toggle':
        return <ToggleLeft size={14} className="text-indigo-400" />;
      case 'to_do':
        return <CheckSquare size={14} className="text-pink-400" />;
      case 'divider':
        return <Minus size={14} className="text-gray-500" />;
      default:
        return <FileText size={14} className="text-gray-400" />;
    }
  };

  // Extract text content from block
  const getBlockText = (block: NotionBlock): string => {
    if (!block || typeof block !== 'object') return '';

    const blockData = block[block.type as keyof NotionBlock];
    if (!blockData || typeof blockData !== 'object') return '';

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
  };

  // Get block preview text (truncated)
  const blockText = getBlockText(block);
  const previewText = blockText.length > 50 ? `${blockText.substring(0, 50)}...` : blockText;

  // Check if block has children
  const hasChildren = block.children && Array.isArray(block.children) && block.children.length > 0;

  const indentStyle = { paddingLeft: `${depth * 16}px` };

  return (
    <div className="border-l border-epii-dark/20">
      <div
        className="flex items-center space-x-2 p-2 hover:bg-epii-dark/10 cursor-pointer text-sm"
        style={indentStyle}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand/collapse icon */}
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown size={12} className="text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight size={12} className="text-gray-500 flex-shrink-0" />
          )
        ) : (
          <div className="w-3 h-3 flex-shrink-0" />
        )}

        {/* Block type icon */}
        <div className="flex-shrink-0">
          {getBlockIcon(block.type)}
        </div>

        {/* Block info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-blue-300 bg-blue-900/20 px-1 rounded">
              {block.type}
            </span>
            <span className="text-xs text-gray-500">#{index + 1}</span>
          </div>
          {previewText && (
            <div className="text-xs text-gray-300 truncate mt-1">
              {previewText}
            </div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="bg-epii-dark/5 border-l-2 border-blue-500/20">
          {/* Block details */}
          <div className="p-3 text-xs" style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="ml-2 font-mono text-blue-300">{block.type}</span>
              </div>

              {blockText && (
                <div>
                  <span className="text-gray-400">Content:</span>
                  <div className="ml-2 mt-1 p-2 bg-gray-800/50 rounded text-gray-200 font-mono text-xs whitespace-pre-wrap">
                    {blockText}
                  </div>
                </div>
              )}

              {/* Show raw block structure */}
              <details className="mt-2">
                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                  Raw Structure
                </summary>
                <pre className="mt-1 p-2 bg-gray-900/50 rounded text-xs text-gray-300 overflow-auto max-h-32">
                  {JSON.stringify(block, null, 2)}
                </pre>
              </details>
            </div>
          </div>

          {/* Render children */}
          {hasChildren && (
            <div>
              {block.children!.map((child: NotionBlock, childIndex: number) => (
                <BlockViewer
                  key={childIndex}
                  block={child}
                  index={childIndex}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StructuredBlockViewer: React.FC<StructuredBlockViewerProps> = ({ payload, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // SYNC FEATURE DEFERRED: Debug logging and force re-render logic removed for performance
  // TODO: Re-enable when sync feature is implemented

  if (!payload || !payload.contentBlocks || !Array.isArray(payload.contentBlocks)) {
    return (
      <div className={`p-4 bg-red-900/20 border border-red-500/30 rounded-md ${className}`}>
        <p className="text-red-300 text-sm">No valid content blocks found in payload</p>
      </div>
    );
  }

  const blockCount = payload.contentBlocks.length;

  return (
    <div className={`bg-epii-dark/30 border border-epii-dark/50 rounded-md ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-epii-dark/20 border-b border-epii-dark/30"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )}
          <FileText size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-gray-200">
            Content Blocks
          </span>
          <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
            {blockCount} blocks
          </span>
        </div>

        <div className="text-xs text-gray-400">
          {payload.targetCoordinate}
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {payload.contentBlocks.map((block, index) => (
            <BlockViewer
              key={index}
              block={block}
              index={index}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StructuredBlockViewer;
