/**
 * Recursive Full Bimba Tree Component
 * Bimba Coordinate: #5-3-4.5-3-3
 *
 * Displays the complete Bimba tree including nodes without bimbaCoordinates,
 * leveraging the same graph data loaded on startup and properly handling
 * how these nodes relate to bimbaCoord-defined nodes.
 */

import React from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, Settings, Circle } from 'lucide-react';

interface GraphNode {
  id: string;
  labels?: string[];
  bimbaCoordinate?: string;
  name?: string;
  title?: string;
  label?: string;
  description?: string;
  [key: string]: any;
}

interface GraphLink {
  source: string | { id: string };
  target: string | { id: string };
  type?: string;
  properties?: Record<string, any>;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface RecursiveFullBimbaTreeProps {
  graphData: GraphData;
  expandedNodes: Record<string, boolean>;
  toggleNode: (nodeId: string) => void;
  onNodeSelect: (node: GraphNode) => void;
  selectedNodeId?: string;
  rootNodeId?: string;
  coordinateChanges?: Map<string, any>; // Change counts per coordinate
}

interface TreeNode {
  node: GraphNode | null;
  children: TreeNode[];
  level: number;
}

const RecursiveFullBimbaTree: React.FC<RecursiveFullBimbaTreeProps> = ({
  graphData,
  expandedNodes,
  toggleNode,
  onNodeSelect,
  selectedNodeId,
  rootNodeId,
  coordinateChanges
}) => {

  // Build tree structure using coordinate-based hierarchy (like RecursiveCoordinateTree)
  const buildTreeStructure = React.useMemo(() => {
    // Create a map of nodes by their bimba coordinates for quick lookup
    const nodesByCoordinate = new Map<string, GraphNode>();
    const nodesWithoutCoords: GraphNode[] = [];

    graphData.nodes.forEach(node => {
      if (node.bimbaCoordinate) {
        nodesByCoordinate.set(node.bimbaCoordinate, node);
      } else {
        nodesWithoutCoords.push(node);
      }
    });

    // Build nested coordinate structure (same logic as EpiiSidebar)
    const nestedCoordinates: Record<string, any> = {};

    // Helper function to get parent coordinate (handles both - and . separators)
    const getParentCoordinate = (coordinate: string): string | null => {
      if (!coordinate || coordinate === '#') return null;

      // Handle both - and . separators
      let lastSeparatorIndex = -1;
      let lastSeparator = '';

      // Find the last separator (either - or .)
      for (let i = coordinate.length - 1; i >= 0; i--) {
        if (coordinate[i] === '-' || coordinate[i] === '.') {
          lastSeparatorIndex = i;
          lastSeparator = coordinate[i];
          break;
        }
      }

      if (lastSeparatorIndex === -1) {
        // No separator found, parent is root
        return '#';
      }

      return coordinate.substring(0, lastSeparatorIndex);
    };

    // Create root node first
    const rootCoord = Array.from(nodesByCoordinate.keys()).find(c => c === '#');
    nestedCoordinates['#'] = {
      coordinate: '#',
      node: nodesByCoordinate.get('#') || null,
      children: {},
      nonCoordNodes: []
    };

    // Get all coordinates and sort by depth
    const coordinates = Array.from(nodesByCoordinate.keys()).sort((a, b) => {
      const depthA = (a.match(/[-]/g) || []).length + (a.match(/[.]/g) || []).length;
      const depthB = (b.match(/[-]/g) || []).length + (b.match(/[.]/g) || []).length;
      return depthA - depthB;
    });



    // Function to find a node in the nested structure
    const findNode = (tree: any, targetCoord: string): any => {
      if (tree.coordinate === targetCoord) return tree;

      for (const childKey in tree.children) {
        const found = findNode(tree.children[childKey], targetCoord);
        if (found) return found;
      }
      return null;
    };

    // Function to create parent nodes recursively
    const createParentNodes = (coordinate: string): any => {
      if (coordinate === '#') {
        return nestedCoordinates['#'];
      }

      const parentCoord = getParentCoordinate(coordinate);
      if (!parentCoord) return nestedCoordinates['#'];

      const parent = createParentNodes(parentCoord);

      if (!parent.children[coordinate]) {
        parent.children[coordinate] = {
          coordinate: coordinate,
          node: nodesByCoordinate.get(coordinate) || null,
          children: {},
          nonCoordNodes: []
        };
      }

      return parent.children[coordinate];
    };

    // Process each coordinate
    coordinates.forEach(coord => {
      if (coord === '#') return; // Skip root, already created

      const parentCoord = getParentCoordinate(coord);
      if (!parentCoord) return;

      // Find or create parent
      let parentNode = findNode(nestedCoordinates['#'], parentCoord);

      if (!parentNode) {
        parentNode = createParentNodes(parentCoord);
      }

      // Add this coordinate to parent
      if (!parentNode.children[coord]) {
        parentNode.children[coord] = {
          coordinate: coord,
          node: nodesByCoordinate.get(coord) || null,
          children: {},
          nonCoordNodes: []
        };
      }
    });

    // Helper function to score relationship types (higher = more hierarchical)
    function getRelationshipScore(type?: string): number {
      if (!type) return 0;
      const scores: Record<string, number> = {
        'CONTAINS': 10,
        'HAS_CHILD': 10,
        'PARENT_OF': 10,
        'SUBSYSTEM_OF': 9,
        'META_STRUCTURE_ELEMENT_OF': 9,
        'COMPONENT_OF': 8,
        'HAS_LENS': 7,
        'PART_OF': 6,
        'BELONGS_TO': 5
      };
      return scores[type] || 1;
    }

    // Attach nodes without coordinates to their best coordinate nodes
    nodesWithoutCoords.forEach(node => {
      let bestCoordinateNode: GraphNode | null = null;
      let bestScore = 0;

      graphData.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source?.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target?.id;

        if (sourceId === node.id) {
          const targetNode = graphData.nodes.find(n => n.id === targetId);
          if (targetNode?.bimbaCoordinate) {
            const score = getRelationshipScore(link.type);
            if (score > bestScore) {
              bestScore = score;
              bestCoordinateNode = targetNode;
            }
          }
        } else if (targetId === node.id) {
          const sourceNode = graphData.nodes.find(n => n.id === sourceId);
          if (sourceNode?.bimbaCoordinate) {
            const score = getRelationshipScore(link.type);
            if (score > bestScore) {
              bestScore = score;
              bestCoordinateNode = sourceNode;
            }
          }
        }
      });

      // Add to the best coordinate node found
      if (bestCoordinateNode?.bimbaCoordinate) {
        const findAndAddNode = (tree: any, targetCoord: string): boolean => {
          for (const key in tree) {
            if (key === targetCoord && tree[key].nonCoordNodes) {
              tree[key].nonCoordNodes.push(node);
              return true;
            }
            if (tree[key].children && findAndAddNode(tree[key].children, targetCoord)) {
              return true;
            }
          }
          return false;
        };

        findAndAddNode(nestedCoordinates, bestCoordinateNode.bimbaCoordinate);
      }
    });

    // Convert to TreeNode structure
    const convertToTreeNode = (coordData: any, level: number = 0): TreeNode | null => {
      const children: TreeNode[] = [];

      // Sort child keys (same as RecursiveCoordinateTree)
      const sortedChildKeys = Object.keys(coordData.children).sort((a, b) => {
        if (a === '#') return -1;
        if (b === '#') return 1;
        return a.localeCompare(b);
      });

      // Add coordinate children
      sortedChildKeys.forEach(childKey => {
        const childTree = convertToTreeNode(coordData.children[childKey], level + 1);
        if (childTree) {
          children.push(childTree);
        }
      });

      // Add non-coordinate nodes
      if (coordData.nonCoordNodes) {
        coordData.nonCoordNodes.forEach((node: GraphNode) => {
          children.push({
            node,
            children: [],
            level: level + 1
          });
        });
      }

      return {
        node: coordData.node,
        children,
        level
      };
    };

    // Start from root
    const rootData = nestedCoordinates['#'];
    return rootData ? convertToTreeNode(rootData) : null;
  }, [graphData, rootNodeId]);

  const renderTreeNode = (treeNode: TreeNode): React.ReactNode => {
    const { node, children, level } = treeNode;
    const hasChildren = children.length > 0;

    // Handle case where node might be null (intermediate coordinate levels)
    if (!node) {
      // Just render children without a node display
      return (
        <div key={`level-${level}`}>
          {children.map((child, index) => renderTreeNode(child))}
        </div>
      );
    }

    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;
    const hasBimbaCoord = !!node.bimbaCoordinate;

    // Get change count for this coordinate
    const changeCount = node.bimbaCoordinate && coordinateChanges
      ? Object.keys(coordinateChanges.get(node.bimbaCoordinate) || {}).length
      : 0;

    // Create a better display name
    let displayName = '';

    if (node.bimbaCoordinate) {
      // For coordinate nodes, show coordinate and name
      const nodeName = node.name || node.title || node.label;
      if (nodeName && nodeName !== node.bimbaCoordinate) {
        displayName = `${node.bimbaCoordinate} - ${nodeName}`;
      } else {
        displayName = node.bimbaCoordinate;
      }
    } else {
      // For non-coordinate nodes, just show the name
      displayName = node.name || node.title || node.label || `Node ${node.id}`;
    }

    const nodeIcon = hasBimbaCoord ? (
      <Settings size={14} className="text-epii-neon" />
    ) : hasChildren ? (
      <Folder size={14} className="text-gray-400" />
    ) : (
      <Circle size={14} className="text-gray-400 fill-current" />
    );

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors duration-150 ${
            isSelected
              ? 'bg-epii-neon/20 text-epii-neon'
              : 'hover:bg-epii-dark/50 text-gray-300 hover:text-white'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onNodeSelect(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-1 p-0.5 rounded hover:bg-epii-dark/50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={12} className="text-gray-400" />
              ) : (
                <ChevronRight size={12} className="text-gray-400" />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-4 mr-1" />}

          {/* Change count indicator */}
          {changeCount > 0 && (
            <div className="mr-1 bg-epii-neon text-epii-darker text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {changeCount}
            </div>
          )}

          <div className="mr-2">{nodeIcon}</div>

          <span className="text-sm truncate flex-1" title={displayName}>
            {displayName}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {children.map((child, index) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (!buildTreeStructure) {
    return (
      <div className="text-gray-400 text-sm p-4">
        No tree structure found
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderTreeNode(buildTreeStructure)}
    </div>
  );
};

export default RecursiveFullBimbaTree;
