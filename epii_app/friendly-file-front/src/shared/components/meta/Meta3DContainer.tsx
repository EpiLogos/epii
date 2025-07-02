/**
 * Meta3DContainer Component - DEPRECATED
 *
 * THIS COMPONENT IS DEPRECATED AND WILL BE REMOVED IN A FUTURE VERSION.
 * Please use the version in subsystems/1_paramasiva/4_context/Meta3DContainer.tsx instead.
 *
 * This component served as a container for the Meta3D visualization.
 * It provided shared context and state for all subsystem components.
 *
 * The duplicate implementation has been consolidated into the Paramasiva subsystem
 * to align with the Bimba Tech Architecture.
 */

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import GeometricBackground from '../ui/GeometricBackground';
import { Node, Edge } from './metaData";

// Define the context interface
interface Meta3DContextType {
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
  // Animation state
  pulsationFactor: number;
  setPulsationFactor: (factor: number) => void;
}

// Create the context
const Meta3DContext = createContext<Meta3DContextType | null>(null);

// Custom hook for using the context
export const useMeta3D = () => {
  const context = useContext(Meta3DContext);
  if (!context) {
    throw new Error('useMeta3D must be used within a Meta3DProvider');
  }
  return context;
};

// Props interface
interface Meta3DContainerProps {
  children: ReactNode;
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  error: Error | null;
}

export const Meta3DContainer: React.FC<Meta3DContainerProps> = ({
  children,
  nodes,
  edges,
  isLoading,
  error
}) => {
  // Display a console warning about deprecation
  React.useEffect(() => {
    console.warn(
      'DEPRECATION WARNING: You are using the deprecated Meta3DContainer from components/meta/Meta3DContainer.tsx. ' +
      'Please update your imports to use the version in subsystems/1_paramasiva/4_context/Meta3DContainer.tsx instead.'
    );
  }, []);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // State
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());
  const [pulsationFactor, setPulsationFactor] = useState<number>(1.0);

  // Calculate dimensions
  const width = containerRef.current?.clientWidth || 800;
  const height = containerRef.current?.clientHeight || 600;

  // Context value
  const contextValue: Meta3DContextType = {
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
    setHighlightedLinks,
    pulsationFactor,
    setPulsationFactor
  };

  // Handle background click
  const handleBackgroundClick = () => {
    setActiveNode(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
  };

  return (
    <Meta3DContext.Provider value={contextValue}>
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
    </Meta3DContext.Provider>
  );
};

export default Meta3DContainer;
