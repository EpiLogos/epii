import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Plus, CheckCircle, Loader2 } from 'lucide-react';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeCreated: (coordinate: string) => void;
  fullGraphData: any;
}

interface ParsedCoordinate {
  fullCoordinate: string;
  parts: number[];
  qlPosition: number;
  isValid: boolean;
}

const CreateNodeModal: React.FC<CreateNodeModalProps> = ({
  isOpen,
  onClose,
  onNodeCreated,
  fullGraphData
}) => {
  const [coordinate, setCoordinate] = useState('#');
  const [parentCoordinate, setParentCoordinate] = useState<string | null>(null);
  const [suggestedRelationType, setSuggestedRelationType] = useState('CONTAINS');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Parse coordinate with support for both "-" and "." separators
  const parseCoordinate = (input: string): ParsedCoordinate => {
    try {
      if (!input || input === '#') {
        return { fullCoordinate: '', parts: [], qlPosition: 0, isValid: false };
      }

      // Handle both "-" and "." separators equally
      const normalized = input.replace(/\./g, '-');
      const cleanInput = normalized.startsWith('#') ? normalized.slice(1) : normalized;
      const parts = cleanInput.split('-').map(part => {
        const num = parseInt(part.trim());
        if (isNaN(num)) throw new Error('Invalid number');
        return num;
      });

      if (parts.length === 0) {
        return { fullCoordinate: '', parts: [], qlPosition: 0, isValid: false };
      }

      return {
        fullCoordinate: `#${parts.join('-')}`,
        parts,
        qlPosition: parts[parts.length - 1], // Final number for QL position
        isValid: true
      };
    } catch {
      return { fullCoordinate: input, parts: [], qlPosition: 0, isValid: false };
    }
  };

  // Infer parent coordinate from structure
  const inferParentCoordinate = (coord: string): string | null => {
    const parsed = parseCoordinate(coord);
    if (!parsed.isValid || parsed.parts.length <= 1) return null;
    
    // Parent is coordinate with one less level
    const parentParts = parsed.parts.slice(0, -1);
    return `#${parentParts.join('-')}`;
  };

  // Check if coordinate already exists
  const coordinateExists = (coord: string): boolean => {
    if (!fullGraphData?.nodes) return false;
    return fullGraphData.nodes.some((node: any) => node.bimbaCoordinate === coord);
  };

  // Check if parent exists
  const parentExists = (parentCoord: string): boolean => {
    if (!parentCoord || !fullGraphData?.nodes) return false;
    return fullGraphData.nodes.some((node: any) => node.bimbaCoordinate === parentCoord);
  };

  // Suggest relationship type based on parent's existing relationships
  const suggestRelationshipType = async (parentCoord: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      
      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'queryBimbaGraph',
          args: {
            query: `
              MATCH (parent {bimbaCoordinate: $parentCoordinate})-[r]->(child)
              RETURN type(r) as relType, count(*) as frequency
              ORDER BY frequency DESC
              LIMIT 3
            `,
            params: { parentCoordinate: parentCoord }
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const relationships = result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
        
        if (relationships?.records && relationships.records.length > 0) {
          // Use most common relationship type
          setSuggestedRelationType(relationships.records[0].relType);
        } else {
          // Fallback to CONTAINS for fundamental connectivity
          setSuggestedRelationType('CONTAINS');
        }
      }
    } catch (error) {
      console.warn('Failed to suggest relationship type:', error);
      setSuggestedRelationType('CONTAINS');
    }
  };

  // Auto-update parent when coordinate changes
  useEffect(() => {
    if (coordinate.length > 1) {
      const inferred = inferParentCoordinate(coordinate);
      setParentCoordinate(inferred);
      
      if (inferred && parentExists(inferred)) {
        suggestRelationshipType(inferred);
      }
    } else {
      setParentCoordinate(null);
    }
    
    // Clear previous errors when coordinate changes
    setError(null);
    setSuccess(false);
  }, [coordinate, fullGraphData]);

  // Handle coordinate input
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Ensure it starts with #
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    
    setCoordinate(value);
  };

  // Validate before creation
  const validateCreation = (): string | null => {
    const parsed = parseCoordinate(coordinate);
    
    if (!parsed.isValid) {
      return 'Invalid coordinate format. Use #1-2-3 or #1.2.3 format.';
    }
    
    if (coordinateExists(parsed.fullCoordinate)) {
      return 'A node with this coordinate already exists.';
    }
    
    if (parentCoordinate && !parentExists(parentCoordinate)) {
      return `Parent coordinate ${parentCoordinate} does not exist.`;
    }
    
    return null;
  };

  // Create the node
  const handleCreate = async () => {
    const validationError = validateCreation();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const parsed = parseCoordinate(coordinate);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      // Initialize QL-aware properties
      const nodeProperties = {
        bimbaCoordinate: parsed.fullCoordinate,
        qlPosition: parsed.qlPosition,
        name: `Node ${parsed.fullCoordinate}`,
        title: `QL Position ${parsed.qlPosition}`,
        description: `Quaternal Logic position ${parsed.qlPosition} node`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create node with parent relationship
      let query: string;
      let params: any;

      if (parentCoordinate) {
        query = `
          CREATE (newNode:BimbaNode $nodeProperties)
          WITH newNode
          MATCH (parent:BimbaNode {bimbaCoordinate: $parentCoordinate})
          CREATE (parent)-[r:${suggestedRelationType}]->(newNode)
          SET r.createdAt = datetime()
          RETURN newNode, parent, r
        `;
        params = { nodeProperties, parentCoordinate };
      } else {
        // Root level node
        query = `
          CREATE (newNode:BimbaNode $nodeProperties)
          RETURN newNode
        `;
        params = { nodeProperties };
      }

      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'updateBimbaGraph',
          args: { query, params }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create node: ${errorText}`);
      }

      setSuccess(true);
      
      // Auto-close and trigger navigation after brief success display
      setTimeout(() => {
        onNodeCreated(parsed.fullCoordinate);
        onClose();
        resetForm();
      }, 1000);

    } catch (error) {
      console.error('Error creating node:', error);
      setError(error instanceof Error ? error.message : 'Failed to create node');
    } finally {
      setIsCreating(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCoordinate('#');
    setParentCoordinate(null);
    setSuggestedRelationType('CONTAINS');
    setError(null);
    setSuccess(false);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isCreating) {
      resetForm();
      onClose();
    }
  };

  const parsed = parseCoordinate(coordinate);
  const validationError = coordinate.length > 1 ? validateCreation() : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-epii-dark border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-epii-neon text-lg">Create New Bimba Node</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new node to the sacred Bimba knowledge graph
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Coordinate Input */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2 block">
              Bimba Coordinate
            </Label>
            <Input
              value={coordinate}
              onChange={handleCoordinateChange}
              placeholder="#1-2-3 or #1.2.3"
              className="bg-epii-darker border-gray-600 text-gray-200 focus:border-epii-neon"
              disabled={isCreating}
            />
            {parsed.isValid && (
              <div className="text-xs text-gray-400 mt-1">
                QL Position: {parsed.qlPosition}
              </div>
            )}
          </div>

          {/* Parent Detection */}
          {parentCoordinate && (
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">
                Detected Parent
              </Label>
              <div className="text-sm text-gray-400 bg-epii-darker p-2 rounded border border-gray-600">
                {parentCoordinate} → {suggestedRelationType} → {parsed.fullCoordinate}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              {error}
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="text-green-400 text-sm bg-green-900/20 p-3 rounded-md flex items-center">
              <CheckCircle size={16} className="mr-2" />
              Node created successfully! Navigating to editor...
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="text-gray-400 hover:text-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !parsed.isValid || !!validationError}
              className="bg-epii-neon text-epii-darker hover:bg-epii-neon/90"
            >
              {isCreating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Create Sacred Node
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNodeModal;
