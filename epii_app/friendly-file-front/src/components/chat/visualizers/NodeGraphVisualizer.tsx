
import React, { useState } from "react";
import { Plus } from "lucide-react";

// Export the interface
export interface NodeGraphData {
  nodes: {
    id: string;
    label: string;
    type: string;
  }[];
  edges?: {
    from: string;
    to: string;
  }[];
}

interface NodeGraphVisualizerProps {
  data: NodeGraphData;
}

export const NodeGraphVisualizer: React.FC<NodeGraphVisualizerProps> = ({ data }) => {
  const [scale, setScale] = useState(1);
  
  // Node type styling based on philosophical concepts
  const getNodeStyle = (type: string) => {
    switch (type) {
      case "anuttara":
        return "bg-epii-neon/20 border-epii-neon text-epii-neon";
      case "paramasiva":
        return "bg-epii-accent/20 border-epii-accent text-white";
      case "parashakti":
        return "bg-purple-500/20 border-purple-500 text-purple-300";
      case "mahamaya":
        return "bg-amber-500/20 border-amber-500 text-amber-300";
      case "nara":
        return "bg-teal-500/20 border-teal-500 text-teal-300";
      default:
        return "bg-white/10 border-white/30 text-white/80";
    }
  };
  
  if (!data.nodes || data.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-epii-neon/10 mb-4">
            <Plus className="h-8 w-8 text-epii-neon" />
          </div>
          <h3 className="text-xl mb-2">No visualization data</h3>
          <p className="text-foreground/70">
            This response doesn't contain graph data
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full relative overflow-hidden bg-epii-darker/40 rounded-lg p-4">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          className="bg-epii-dark neo-glow rounded-md p-2"
          onClick={() => setScale(prev => Math.min(prev + 0.2, 2))}
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div 
        className="h-full relative"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Simple visualization of nodes */}
        <div className="absolute inset-0 flex items-center justify-center">
          {data.nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute p-3 border rounded-md transform -translate-x-1/2 -translate-y-1/2 transition-shadow cursor-pointer ${getNodeStyle(node.type)}`}
              style={{
                left: `${50 + (node.id === 'anuttara' ? -15 : node.id === 'paramasiva' ? 15 : 0)}%`,
                top: `${50 + (node.id === 'anuttara' ? -15 : node.id === 'paramasiva' ? 15 : 0)}%`,
              }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
