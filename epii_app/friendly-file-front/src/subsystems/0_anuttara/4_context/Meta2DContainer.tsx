/**
 * Meta2DContainer Component
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-4 (Bimba Vis / Geom Ground - Context)
 *
 * This component serves as a container for the Meta2D visualization.
 * It provides shared context and state for all subsystem components.
 * It aligns with the #0000 module (Anuttara).
 */

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import GeometricBackground from '../../../components/ui/GeometricBackground';
import { Node, Edge } from '../../../components/meta/metaData';

// Define the context interface
interface Meta2DContextType {
  // Graph data
  nodes: Node[];
  edges: Edge[];
  // Graph dimensions
  width: number;
  height: number;
  // Graph refs
  graphRef: React.RefObject<any>;
  containerRef: React.RefObject<HTMLDivElement>;
  // Graph state
  isLoading: boolean;
  error: Error | null;
  // Active node
  activeNode: Node | null;
  setActiveNode: (node: Node | null) => void;
  // Highlighted elements
  highlightedNodes: Set<string>;
  setHighlightedNodes: (nodes: Set<string>) => void;
  highlightedLinks: Set<string>;
  setHighlightedLinks: (links: Set<string>) => void;
}

// Create the context
const Meta2DContext = createContext<Meta2DContextType | null>(null);

// Custom hook for using the context
export const useMeta2D = () => {
  const context = useContext(Meta2DContext);
  if (!context) {
    throw new Error('useMeta2D must be used within a Meta2DProvider');
  }
  return context;
};

// Props interface
interface Meta2DContainerProps {
  children: ReactNode;
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  error: Error | null;
}

export const Meta2DContainer: React.FC<Meta2DContainerProps> = ({
  children,
  nodes,
  edges,
  isLoading,
  error
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // State
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());

  // Calculate dimensions
  const width = containerRef.current?.clientWidth || 800;
  const height = containerRef.current?.clientHeight || 600;

  // Context value
  const contextValue: Meta2DContextType = {
    nodes,
    edges,
    width,
    height,
    graphRef,
    containerRef,
    isLoading,
    error,
    activeNode,
    setActiveNode,
    highlightedNodes,
    setHighlightedNodes,
    highlightedLinks,
    setHighlightedLinks
  };

  // Handle background click
  const handleBackgroundClick = () => {
    setActiveNode(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
  };

  return (
    <Meta2DContext.Provider value={contextValue}>
      <div className="flex flex-col w-full">
        <div className="relative mb-8 overflow-hidden rounded-lg border bg-background/80 shadow backdrop-blur" ref={containerRef}>
          {/* Background */}
          <GeometricBackground className="absolute inset-0 -z-10" />

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-epii-neon" />
                <p className="text-sm text-epii-neon">Loading Meta Structure...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center gap-2 max-w-md p-4 bg-background/80 rounded-lg border border-destructive">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-destructive">Error loading Meta Structure: {error.message}</p>
              </div>
            </div>
          )}

          {/* Graph content */}
          {!isLoading && !error && children}
        </div>
      </div>
    </Meta2DContext.Provider>
  );
};

export default Meta2DContainer;
