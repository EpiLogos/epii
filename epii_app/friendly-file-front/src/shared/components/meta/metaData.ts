
// Define node types based on Epi-Logos philosophical framework
export type NodeType = "anuttara" | "paramasiva" | "parashakti" | "mahamaya" | "nara" | "document";

export interface Node {
  id: string;
  label?: string;
  type?: string;
  x?: number;
  y?: number;
  z?: number; // For 3D positioning
  description?: string;
  bimbaCoordinate?: string;
  labels?: string[];
  // For fixed positioning
  fx?: number;
  fy?: number;
  fz?: number; // For 3D fixed positioning
  // For velocity in 3D space
  vx?: number;
  vy?: number;
  vz?: number;
  // For unmapped nodes to track their hierarchical depth
  virtualDepth?: number;
  // For tracking parent-child relationships
  parentId?: string;
  // For styling
  color?: string; // Node color
  val?: number; // Node size
  // For internal state tracking
  __dragging?: boolean;
}

export interface Edge {
  id?: string; // Optional: Add ID if backend provides it
  source: string | { id: string } | null;
  target: string | { id: string } | null;
  type?: string; // Add the type property, make it optional for flexibility
  // For styling
  color?: string; // Edge color
  width?: number; // Edge width
  // Could add type like "isomorphic" | "contains" | "influences" in the future
}

// Updated mock data to reflect the Epi-Logos philosophical structure
export const INITIAL_NODES: Node[] = [
  {
    id: "1",
    label: "Anuttara - Foundational Void",
    type: "anuttara",
    x: 50,
    y: 50,
    description: "The transcendent void, source of all potential"
  },
  {
    id: "2",
    label: "Paramasiva - Quaternary Logic",
    type: "paramasiva",
    x: 25,
    y: 25
  },
  {
    id: "3",
    label: "Parashakti - Vibrational Forms",
    type: "parashakti",
    x: 75,
    y: 25
  },
  {
    id: "4",
    label: "Mahamaya - Symbolic Integration",
    type: "mahamaya",
    x: 25,
    y: 75
  },
  {
    id: "5",
    label: "Nara - Contextual Application",
    type: "nara",
    x: 75,
    y: 75
  },
  {
    id: "6",
    label: "Mathematical Foundations",
    type: "document",
    x: 15,
    y: 15
  },
  {
    id: "7",
    label: "Logical Structures",
    type: "document",
    x: 35,
    y: 15
  },
  {
    id: "8",
    label: "Cymatics Research",
    type: "document",
    x: 65,
    y: 15
  },
  {
    id: "9",
    label: "Frequency Analysis",
    type: "document",
    x: 85,
    y: 15
  },
  {
    id: "10",
    label: "Tarot Correspondences",
    type: "document",
    x: 15,
    y: 85
  },
  {
    id: "11",
    label: "I Ching Mappings",
    type: "document",
    x: 35,
    y: 85
  },
  {
    id: "12",
    label: "Embodied Practice",
    type: "document",
    x: 65,
    y: 85
  },
  {
    id: "13",
    label: "Direct Path Inquiry",
    type: "document",
    x: 85,
    y: 85
  },
];

export const INITIAL_EDGES: Edge[] = [
  { source: "1", target: "2" },
  { source: "1", target: "3" },
  { source: "1", target: "4" },
  { source: "1", target: "5" },
  { source: "2", target: "6" },
  { source: "2", target: "7" },
  { source: "3", target: "8" },
  { source: "3", target: "9" },
  { source: "4", target: "10" },
  { source: "4", target: "11" },
  { source: "5", target: "12" },
  { source: "5", target: "13" },
  // Add cross-connections to show isomorphic relationships
  { source: "2", target: "3" },
  { source: "3", target: "4" },
  { source: "4", target: "5" },
  { source: "5", target: "2" },
  { source: "6", target: "8" }, // Mathematical foundations connect to cymatics
  { source: "7", target: "11" }, // Logical structures connect to I Ching
  { source: "9", target: "12" }, // Frequency analysis connects to embodied practice
  { source: "10", target: "13" } // Tarot connects to direct path inquiry
];
