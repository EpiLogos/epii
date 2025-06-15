/**
 * Meta3DContainer Component
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-4 (QL/AT Vis - Context)
 *
 * This component serves as a container for the Meta3D visualization.
 * It provides shared context and state for all subsystem components.
 * It aligns with the #(0/1) module (Paramasiva).
 */

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import GeometricBackground from '../../../shared/components/ui/GeometricBackground';
import { Node, Edge } from "../../../shared/components/meta/metaData";

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
  pulsationFactor?: number; // Optional pulsation factor from useGraphRendering3D
}

export const Meta3DContainer: React.FC<Meta3DContainerProps> = ({
  children,
  nodes,
  edges,
  isLoading,
  error,
  pulsationFactor: propPulsationFactor
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // State
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());
  const [pulsationFactor, setPulsationFactor] = useState<number>(propPulsationFactor || 1.0);

  // Update pulsationFactor when prop changes
  useEffect(() => {
    if (propPulsationFactor) {
      setPulsationFactor(propPulsationFactor);
    }
  }, [propPulsationFactor]);

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

        {/* Philosophical Framework Note */}
        <div className="mt-8 bg-epii-dark/40 neo-glow rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="text-epii-neon mt-1 h-5 w-5" />
            <div>
              <h3 className="text-lg text-epii-neon mb-2">About the Meta Structure</h3>
              <p className="text-foreground/70 text-sm">
                This 3D visualization represents the ontology of isomorphism at the heart of Epi-Logos - where epistemology,
                form, and function interconnect. The core principles of Anuttara (foundational void), Paramasiva (quaternary logic),
                Parashakti (vibrational templates), and more are embodied in this dynamic knowledge architecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Meta3DContext.Provider>
  );
};

export default Meta3DContainer;
