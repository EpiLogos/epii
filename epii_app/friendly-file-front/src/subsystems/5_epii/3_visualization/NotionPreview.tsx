/**
 * Notion Update Preview Component
 * Displays a preview of the Notion update payload
 * Bimba Coordinate: #5-3-4.5-3-3
 */

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, FileText, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { NotionUpdatePayload } from '../0_foundation/epiiTypes';
import ReactMarkdown from 'react-markdown';

interface NotionPreviewProps {
  notionUpdatePayload: NotionUpdatePayload;
  onClose: () => void;
  onSendToNotion: (updatedPayload?: NotionUpdatePayload) => void;
  isSending: boolean;
}

const NotionPreview: React.FC<NotionPreviewProps> = ({
  notionUpdatePayload,
  onClose,
  onSendToNotion,
  isSending
}) => {
  // Ensure we have all required fields with defaults
  const {
    targetCoordinate = '#5-2-1',
    content: initialContent = 'No content available',
    title: initialTitle = 'Untitled Document',
    analysisResults = {},
    relatedCoordinates = [],
    tags = [],
    subnodePayloads = {}
  } = notionUpdatePayload || {};

  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(initialContent);
  const [editableTitle, setEditableTitle] = useState(initialTitle);

  // State for active tab (main or subnode coordinate)
  const [activeTab, setActiveTab] = useState<string>('main');

  // State for subnode editing
  const [editableSubnodeContent, setEditableSubnodeContent] = useState<{[key: string]: string}>({});
  const [editableSubnodeTitle, setEditableSubnodeTitle] = useState<{[key: string]: string}>({});

  // State for subnode section visibility
  const [showSubnodes, setShowSubnodes] = useState(Object.keys(subnodePayloads).length > 0);

  // Get list of subnodes
  const subnodeCoordinates = Object.keys(subnodePayloads);

  // Initialize subnode editable content
  useEffect(() => {
    const initialSubnodeContent: {[key: string]: string} = {};
    const initialSubnodeTitle: {[key: string]: string} = {};

    Object.entries(subnodePayloads).forEach(([coord, payload]) => {
      initialSubnodeContent[coord] = payload.content || '';
      initialSubnodeTitle[coord] = payload.title || '';
    });

    setEditableSubnodeContent(initialSubnodeContent);
    setEditableSubnodeTitle(initialSubnodeTitle);
  }, [subnodePayloads]);

  // Update the editable content when the notionUpdatePayload changes
  useEffect(() => {
    setEditableContent(initialContent);
    setEditableTitle(initialTitle);
  }, [initialContent, initialTitle]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-epii-darker border border-epii-dark rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-epii-dark flex items-center justify-between bg-epii-dark/50">
          <h2 className="text-xl font-medium flex items-center">
            <FileText size={20} className="mr-2 text-epii-neon" />
            Notion Update Preview
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-epii-dark rounded-md transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        {subnodeCoordinates.length > 0 && (
          <div className="flex border-b border-epii-dark overflow-x-auto">
            <button
              className={`px-4 py-2 ${activeTab === 'main' ? 'bg-epii-dark text-white' : 'text-gray-400 hover:bg-epii-dark/50'}`}
              onClick={() => setActiveTab('main')}
            >
              Main Content
            </button>

            <div className="flex items-center">
              <button
                className="p-1 rounded-full hover:bg-epii-dark/50 transition-colors"
                onClick={() => setShowSubnodes(!showSubnodes)}
                title={showSubnodes ? "Hide subnodes" : "Show subnodes"}
              >
                {showSubnodes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showSubnodes && (
                <div className="flex overflow-x-auto">
                  {subnodeCoordinates.map(coord => (
                    <button
                      key={coord}
                      className={`px-3 py-2 whitespace-nowrap ${activeTab === coord ? 'bg-epii-dark text-white' : 'text-gray-400 hover:bg-epii-dark/50'}`}
                      onClick={() => setActiveTab(coord)}
                    >
                      {coord}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {activeTab === 'main' ? (
            // Main content tab
            <>
              {/* Title */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Title</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs px-2 py-1 rounded bg-epii-dark hover:bg-epii-dark/80 flex items-center"
                  >
                    <Edit2 size={12} className="mr-1" />
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="w-full bg-epii-dark border border-gray-700 rounded px-3 py-2 text-lg font-medium"
                  />
                ) : (
                  <p className="text-lg font-medium">{editableTitle || `Content for ${targetCoordinate}`}</p>
                )}
              </div>

              {/* Target Coordinate */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Target Coordinate</h3>
                  {isEditing && (
                    <span className="text-xs text-gray-400">
                      (Automatically derived from document)
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={targetCoordinate}
                    readOnly
                    className="w-full bg-epii-dark border border-gray-700 rounded px-3 py-2 text-sm font-medium opacity-75"
                  />
                ) : (
                  <p className="bg-epii-dark px-2 py-1 rounded inline-block">{targetCoordinate}</p>
                )}
              </div>

              {/* Properties */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Properties</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Semantic Framework */}
                  {analysisResults?.semanticFramework && analysisResults.semanticFramework.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Semantic Framework</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResults.semanticFramework.map((item, index) => (
                          <span key={index} className="bg-blue-900/50 text-blue-200 text-xs px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symbolic Anchors */}
                  {analysisResults?.symbolicAnchors && analysisResults.symbolicAnchors.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Symbolic Anchors</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResults.symbolicAnchors.map((item, index) => (
                          <span key={index} className="bg-purple-900/50 text-purple-200 text-xs px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conceptual Framework */}
                  {analysisResults?.conceptualFramework && analysisResults.conceptualFramework.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Conceptual Framework</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResults.conceptualFramework.map((item, index) => (
                          <span key={index} className="bg-green-900/50 text-green-200 text-xs px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Logic Operators */}
                  {analysisResults?.logicOperators && analysisResults.logicOperators.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Logic Operators</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResults.logicOperators.map((item, index) => (
                          <span key={index} className="bg-yellow-900/50 text-yellow-200 text-xs px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Type */}
                  {analysisResults?.contentType && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Content Type</h4>
                      <span className="bg-red-900/50 text-red-200 text-xs px-2 py-0.5 rounded">
                        {analysisResults.contentType}
                      </span>
                    </div>
                  )}

                  {/* Related Coordinates */}
                  {relatedCoordinates && relatedCoordinates.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Related Coordinates</h4>
                      <div className="flex flex-wrap gap-1">
                        {relatedCoordinates.map((coord, index) => (
                          <span key={index} className="bg-epii-dark text-gray-300 text-xs px-2 py-0.5 rounded">
                            {coord}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                          <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subnode summary */}
                  {subnodeCoordinates.length > 0 && (
                    <div className="col-span-2 mt-2">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Subnode Mappings</h4>
                      <div className="bg-epii-dark/50 rounded-md p-2">
                        <p className="text-sm mb-2">This document contains mappings for {subnodeCoordinates.length} subnodes:</p>
                        <div className="flex flex-wrap gap-2">
                          {subnodeCoordinates.map(coord => (
                            <button
                              key={coord}
                              onClick={() => setActiveTab(coord)}
                              className="px-2 py-1 bg-epii-darker rounded-md hover:bg-epii-dark/80 text-sm"
                            >
                              {coord}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Content</h3>
                <div className="bg-epii-dark rounded-md p-4 overflow-auto max-h-[300px]">
                  {isEditing ? (
                    <textarea
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className="w-full h-[250px] bg-epii-darker border border-gray-700 rounded p-3 font-mono text-sm"
                      placeholder="Enter markdown content here..."
                    />
                  ) : (
                    editableContent ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                          {editableContent}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No content available</p>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            // Subnode content tab
            <>
              {/* Subnode title */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Subnode Title</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs px-2 py-1 rounded bg-epii-dark hover:bg-epii-dark/80 flex items-center"
                  >
                    <Edit2 size={12} className="mr-1" />
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableSubnodeTitle[activeTab] || ''}
                    onChange={(e) => {
                      const newTitles = { ...editableSubnodeTitle };
                      newTitles[activeTab] = e.target.value;
                      setEditableSubnodeTitle(newTitles);
                    }}
                    className="w-full bg-epii-dark border border-gray-700 rounded px-3 py-2 text-lg font-medium"
                  />
                ) : (
                  <p className="text-lg font-medium">{editableSubnodeTitle[activeTab] || `Content for ${activeTab}`}</p>
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Subnode Coordinate</h3>
                  <p className="bg-epii-dark px-2 py-1 rounded inline-block">{activeTab}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Parent Coordinate</h3>
                  <p className="bg-epii-dark px-2 py-1 rounded inline-block">{subnodePayloads[activeTab]?.parentCoordinate || targetCoordinate}</p>
                </div>
              </div>

              {/* Subnode content */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Content</h3>
                <div className="bg-epii-dark rounded-md p-4 overflow-auto max-h-[300px]">
                  {isEditing ? (
                    <textarea
                      value={editableSubnodeContent[activeTab] || ''}
                      onChange={(e) => {
                        const newContents = { ...editableSubnodeContent };
                        newContents[activeTab] = e.target.value;
                        setEditableSubnodeContent(newContents);
                      }}
                      className="w-full h-[250px] bg-epii-darker border border-gray-700 rounded p-3 font-mono text-sm"
                      placeholder="Enter markdown content here..."
                    />
                  ) : (
                    editableSubnodeContent[activeTab] ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                          {editableSubnodeContent[activeTab]}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No content available</p>
                    )
                  )}
                </div>
              </div>

              {/* Notion page ID if available */}
              {subnodePayloads[activeTab]?.notionPageId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Notion Page ID</h3>
                  <p className="bg-epii-dark px-2 py-1 rounded text-xs font-mono">{subnodePayloads[activeTab].notionPageId}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-epii-dark flex justify-between space-x-4 bg-epii-dark/50">
          <div>
            {activeTab !== 'main' && (
              <button
                onClick={() => setActiveTab('main')}
                className="px-4 py-2 bg-epii-dark hover:bg-epii-dark/80 rounded-md transition-colors"
              >
                Back to Main
              </button>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-epii-dark hover:bg-epii-dark/80 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Create an updated payload with our edited content
                const updatedPayload = {
                  ...notionUpdatePayload,
                  title: editableTitle,
                  content: editableContent,
                  // Update subnode payloads with edited content
                  subnodePayloads: Object.entries(subnodePayloads).reduce((acc, [coord, payload]) => {
                    acc[coord] = {
                      ...payload,
                      title: editableSubnodeTitle[coord] || payload.title,
                      content: editableSubnodeContent[coord] || payload.content
                    };
                    return acc;
                  }, {} as {[key: string]: any}),
                  // Add the correct properties structure for Notion
                  properties: {
                    // The title property is handled separately in the backend
                    // "Node Name" will be set to the title value

                    // Set non-relation properties directly
                    // Content Type is a select property - send as simple string
                    "Content Type": "Crystallization",  // Simple string value

                    // Status is a status property - send as simple string
                    "Status": "1"  // Simple string value

                    // Relation properties will be handled by the backend by adding notes to the content:
                    // - "💠 QL Operators" (relation to Quaternal Logic DB)
                    // - "🕸️ Semantic Framework" (relation to Semantics DB)
                    // - "⚕️ Archetypal Anchors" (relation to Symbols DB)
                    // - "📚 Epistemic Essence" (relation to Concepts DB)
                  }
                };
                // Call the original onSendToNotion with our updated payload
                onSendToNotion(updatedPayload);
              }}
              disabled={isSending}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                isSending
                  ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Sending to Notion...</span>
                </>
              ) : (
                <>
                  <ExternalLink size={18} />
                  <span>{activeTab === 'main' ? 'Send All to Notion' : `Send ${activeTab} to Notion`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotionPreview;
