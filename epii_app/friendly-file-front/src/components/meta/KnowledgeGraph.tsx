
import React from "react";
import { Plus } from "lucide-react";
import { Node, Edge, NodeType } from "./metaData";

interface KnowledgeGraphProps {
  nodes: Node[];
  edges: Edge[];
  nodePosition: (node: Node) => { x: number; y: number };
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
  graphRef: React.RefObject<HTMLDivElement>;
  startDrag: (e: React.MouseEvent) => void;
  onDrag: (e: React.MouseEvent) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  nodes,
  edges,
  nodePosition,
  activeNode,
  setActiveNode,
  graphRef,
  startDrag,
  onDrag,
}) => {
  // Node type styling
  const getNodeStyle = (type: NodeType) => {
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
      case "document":
        return "bg-white/10 border-white/30 text-white/80";
      default:
        return "bg-white/10 border-white/30 text-white/80";
    }
  };

  return (
    <div 
      ref={graphRef}
      className="bg-epii-dark/40 neo-glow rounded-lg h-[600px] w-full overflow-hidden relative cursor-move"
      onMouseDown={startDrag}
      onMouseMove={onDrag}
    >
      {/* Edges */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (!fromNode || !toNode) return null;
          
          const fromPos = nodePosition(fromNode);
          const toPos = nodePosition(toNode);
          
          // Determine color based on node types and active state
          let strokeColor = "rgba(255, 255, 255, 0.15)";
          let strokeWidth = 1;
          
          if (activeNode && (edge.from === activeNode || edge.to === activeNode)) {
            strokeColor = "rgba(0, 229, 255, 0.7)";
            strokeWidth = 2;
          } else if (fromNode.type === "anuttara" || toNode.type === "anuttara") {
            strokeColor = "rgba(0, 229, 255, 0.3)";
          } else if (fromNode.type === "paramasiva" || toNode.type === "paramasiva") {
            strokeColor = "rgba(255, 0, 102, 0.3)";
          }
          
          return (
            <line
              key={index}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </svg>
      
      {/* Nodes */}
      {nodes.map((node) => {
        const position = nodePosition(node);
        const isActive = activeNode === node.id;
        
        return (
          <div
            key={node.id}
            className={`absolute p-3 border rounded-md transform -translate-x-1/2 -translate-y-1/2 transition-shadow cursor-pointer select-none ${
              getNodeStyle(node.type)
            } ${isActive ? 'ring-2 ring-epii-neon shadow-lg shadow-epii-neon/20' : ''}`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: isActive ? 10 : 1
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveNode(isActive ? null : node.id);
            }}
          >
            {node.label}
          </div>
        );
      })}
      
      {/* Empty state indicator - shown when no nodes available */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-epii-neon/10 mb-4">
              <Plus className="h-8 w-8 text-epii-neon" />
            </div>
            <h3 className="text-xl mb-2">No nodes yet</h3>
            <p className="text-foreground/70">
              Add nodes to start building your meta structure
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
