
import React, { useState } from "react";
import { Node, Edge } from "./metaData"; // Keep Edge if needed for types
import { X, Loader2, ChevronDown, ChevronRight } from "lucide-react"; // Import close icon and Loader

// Define expected structure for MCP getNodeOverview response properties
export interface MCPNodeProperties { // <-- EXPORT
  name?: string;
  type?: string;
  description?: string;
  content?: string;
  function?: string;
  bimbaCoordinate?: string;
  notionPageId?: string;
  [key: string]: unknown; // Use unknown instead of any for better type safety
}

// Define expected structure for MCP getNodeOverview response connections
export interface MCPNodeConnection { // <-- EXPORT
  type: string;
  direction: 'in' | 'out';
  nodes: Array<{ name: string; bimbaCoordinate?: string }>;
}

// Define interface for Notion resolution data
export interface NotionResolution {
  targetCoordinate: string;
  foundCoordinate: string;
  notionPageId: string;
  notionPageUrl: string;
  labels: string[];
}

// Define interface matching the enriched data passed from MetaStructure
// This interface now includes the structure of the 'details' object
interface ActiveNodeData extends Node {
  details: {
    properties: MCPNodeProperties;
    connections: MCPNodeConnection[];
    notionResolution?: NotionResolution | null;
  } | null;
  connections: string[]; // IDs of connected nodes (calculated in MetaStructure) - might be redundant now
  highlightedLinks: Edge[]; // Highlighted links (calculated in MetaStructure) - might be redundant now
  error?: string;
  isLoading?: boolean; // Added for loading state
  virtualDepth?: number; // For unmapped nodes to track their hierarchical depth
  parentId?: string; // For tracking parent-child relationships
}

// Update props to accept the ActiveNodeData object
interface NodeDetailsPanelProps {
  activeNode: ActiveNodeData;
  onClose: () => void;
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  activeNode,
  onClose
}) => {
  // activeNode is the selected node with enriched details
  const selectedNode = activeNode;
  if (!selectedNode) return null;

  // State for collapsible sections
  const [showRelations, setShowRelations] = useState(false);

  // Extract details safely, providing defaults
  const isLoadingDetails = selectedNode.isLoading;
  const mcpDetails = selectedNode.details; // This now has the defined structure or is null
  const mcpProperties = mcpDetails?.properties || {};
  const mcpConnections = mcpDetails?.connections || [];

  // Determine best description using optional chaining and nullish coalescing
  let description = mcpProperties?.description ?? mcpProperties?.content ?? mcpProperties?.function ?? selectedNode.label ?? "No description available.";

  // For unmapped nodes, provide a special description
  if (!selectedNode.bimbaCoordinate) {
    description = selectedNode.label ?? "Unmapped Node";
    if (selectedNode.parentId) {
      description += " - This node is not directly mapped to the Bimba coordinate system. It is connected to the graph through its parent node.";
    } else {
      description += " - This node is not directly mapped to the Bimba coordinate system.";
    }
  }
  
  // Get Notion resolution data if available
  const notionResolution = mcpDetails?.notionResolution;
  const notionPageId = mcpProperties?.notionPageId;

  return (
    // Updated styling for positioning and appearance
    <div
      className="fixed right-4 top-24 bottom-16 w-96 bg-epii-dark/90 backdrop-blur-sm neo-glow rounded-lg p-6 animate-fade-in overflow-y-auto z-10 shadow-2xl flex flex-col"
      onClick={(e) => {
        // Prevent event propagation to avoid triggering background click
        e.stopPropagation();
      }}
    >
      <button
        onClick={(e) => {
          // Prevent event propagation to avoid triggering background click
          e.stopPropagation();
          // Call the onClose handler
          onClose();
        }}
        className="absolute top-3 right-3 text-foreground/50 hover:text-epii-neon transition-colors z-20"
        aria-label="Close details panel"
      >
        <X size={20} />
      </button>

      <h3 className="text-xl mb-4 text-epii-neon font-light border-b border-epii-neon/20 pb-2 flex-shrink-0">
        {/* Use name from MCP details first, fallback to node label */}
        {mcpProperties?.name ?? selectedNode.label ?? "Node Details"}
      </h3>

      {/* Display error if fetching details failed */}
      {selectedNode.error && !isLoadingDetails && (
        <p className="text-red-400 bg-red-900/30 p-2 rounded text-sm mb-4 flex-shrink-0">{selectedNode.error}</p>
      )}

      {/* Loading Indicator */}
      {isLoadingDetails && (
         <div className="flex-grow flex items-center justify-center">
           <Loader2 className="h-8 w-8 animate-spin text-epii-neon" />
         </div>
      )}

      {/* Content Area - show for unmapped nodes or if not loading and has details */}
      {(!isLoadingDetails && (mcpDetails || !selectedNode.bimbaCoordinate)) && (
        <div className="space-y-4 flex-grow overflow-y-auto pr-2 -mr-2"> {/* Added padding for scrollbar */}
          {/* Core Properties Section */}
          <div>
            <h4 className="text-foreground/70 text-sm font-semibold mb-1">Core Properties</h4>
            <div className="text-sm space-y-1 pl-2 border-l border-foreground/20">
              {/* Show Bimba coordinate prominently */}
              <p>
                <span className="text-foreground/60">Bimba:</span>
                <span className="text-epii-accent font-medium ml-1">
                  {selectedNode.bimbaCoordinate ?? "Unmapped Node"}
                </span>
              </p>

              {/* Use type from MCP details first, fallback to node type - only show if meaningful */}
              {(mcpProperties?.type || selectedNode.type) && (
                <p>
                  <span className="text-foreground/60">Type:</span>
                  <span className="ml-1">{mcpProperties?.type ?? selectedNode.type}</span>
                </p>
              )}

              {/* Show virtual depth for unmapped nodes */}
              {!selectedNode.bimbaCoordinate && selectedNode.virtualDepth !== undefined && (
                <p><span className="text-foreground/60">Virtual Depth:</span> {selectedNode.virtualDepth}</p>
              )}

              {/* Show parent node info for unmapped nodes */}
              {!selectedNode.bimbaCoordinate && selectedNode.parentId && (
                <p><span className="text-foreground/60">Parent Node:</span> {selectedNode.parentId}</p>
              )}

              {/* Display important metadata properties */}
              {mcpProperties?.createdAt && (
                <p><span className="text-foreground/60">Created:</span> {new Date(mcpProperties.createdAt as string).toLocaleString()}</p>
              )}

              {mcpProperties?.updatedAt && (
                <p><span className="text-foreground/60">Updated:</span> {new Date(mcpProperties.updatedAt as string).toLocaleString()}</p>
              )}

              {/* Display other relevant properties from MCP details */}
              {Object.entries(mcpProperties)
                .filter(([key, value]) => {
                  // Filter out already displayed props and empty/meaningless values
                  const excludedKeys = [
                    'name', 'type', 'description', 'content', 'function', 'bimbaCoordinate', 
                    'notionPageId', 'id', 'label', 'createdAt', 'updatedAt'
                  ];
                  return !excludedKeys.includes(key) && value !== null && value !== undefined && value !== '';
                })
                .map(([key, value]) => (
                  <p key={key}><span className="text-foreground/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(value)}</p>
                ))}

              {/* Show technical ID at the bottom */}
              <p className="text-xs text-foreground/40 mt-2">ID: {selectedNode.id}</p>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className="text-foreground/70 text-sm font-semibold mb-1">Description</h4>
            <p className="text-sm text-foreground/80 pl-2 border-l border-foreground/20">{mcpProperties?.description || description}</p>
          </div>

          {/* Function Section - only show if available */}
          {mcpProperties?.function && (
            <div>
              <h4 className="text-foreground/70 text-sm font-semibold mb-1">Function</h4>
              <p className="text-sm text-foreground/80 pl-2 border-l border-foreground/20">{mcpProperties.function}</p>
            </div>
          )}

          {/* Content Section - only show if available */}
          {mcpProperties?.content && (
            <div>
              <h4 className="text-foreground/70 text-sm font-semibold mb-1">Content</h4>
              <p className="text-sm text-foreground/80 pl-2 border-l border-foreground/20 whitespace-pre-wrap">{mcpProperties.content}</p>
            </div>
          )}

          {/* Relations Section - Collapsible */}
          {mcpConnections.length > 0 && (
            <div>
              <button
                onClick={() => setShowRelations(!showRelations)}
                className="w-full flex items-center justify-between text-foreground/70 text-sm font-semibold mb-1 hover:text-epii-neon transition-colors"
              >
                <span>Relations ({mcpConnections.length} connections)</span>
                {showRelations ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {!showRelations && (
                <div className="text-sm text-foreground/60 pl-2 border-l border-foreground/20 mb-2">
                  {mcpConnections.reduce((total, conn) => total + (conn.nodes?.length || 0), 0)} related nodes across {mcpConnections.length} connection types
                </div>
              )}

              {showRelations && (
                <div className="text-sm space-y-2 pl-2 border-l border-foreground/20">
                  {/* Group connections by type for better organization */}
                  {(() => {
                    // First, identify important relation types
                    const importantTypes = ['IMPLEMENTS', 'CONTAINS', 'RELATES_TO', 'DEPENDS_ON', 'EXTENDS'];

                    // Filter for important connections first
                    const keyConnections = mcpConnections.filter(conn =>
                      importantTypes.includes(conn.type.toUpperCase())
                    );

                    // If no important connections, show all
                    const connectionsToShow = keyConnections.length > 0 ? keyConnections : mcpConnections;

                    return connectionsToShow.map((conn: MCPNodeConnection, index: number) => (
                      <div key={index} className="mb-2">
                        <span className="font-medium text-epii-accent">
                          {conn.type} {conn.direction === 'in' ? '← (incoming)' : '→ (outgoing)'}
                        </span>
                        <ul className="ml-3 list-disc list-inside text-foreground/80">
                          {/* Display connected node names with bimba coordinates if available */}
                          {conn.nodes?.map((node) => (
                            <li key={node.bimbaCoordinate ?? node.name}>
                              {node.name}
                              {node.bimbaCoordinate &&
                                <span className="text-xs text-foreground/50 ml-1">
                                  ({node.bimbaCoordinate})
                                </span>
                              }
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  })()}

                  {/* Show summary if there are many more connections */}
                  {mcpConnections.length > 5 && (
                    <div className="mt-4 pt-2 border-t border-foreground/10">
                      <p className="text-foreground/60 text-xs">
                        Total: {mcpConnections.length} connections with {mcpConnections.reduce((total, conn) => total + (conn.nodes?.length || 0), 0)} related nodes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notion Link Button - prioritize BPMCP resolution */}
          {(notionResolution?.notionPageUrl || notionPageId) && (
             <button
                className="mt-4 w-full bg-epii-accent/80 text-white px-4 py-2 rounded hover:bg-epii-accent transition-colors text-sm flex-shrink-0"
                onClick={() => {
                  let notionUrl;

                  // Use BPMCP resolved URL if available
                  if (notionResolution?.notionPageUrl) {
                    notionUrl = notionResolution.notionPageUrl;
                  } else if (notionPageId) {
                    // Fallback to manual URL construction
                    if (notionPageId.startsWith('http')) {
                      notionUrl = notionPageId;
                    } else if (notionPageId.includes('-')) {
                      const cleanId = notionPageId.replace(/-/g, '');
                      notionUrl = `https://www.notion.so/${cleanId}`;
                    } else {
                      notionUrl = `https://www.notion.so/${notionPageId}`;
                    }
                  }

                  if (notionUrl) {
                    window.open(notionUrl, '_blank');
                  }
                }}
              >
                Open in Notion
                {notionResolution && (
                  <span className="text-xs opacity-75 ml-1">(BPMCP)</span>
                )}
              </button>
          )}
        </div>
      )}
    </div>
  );
};
