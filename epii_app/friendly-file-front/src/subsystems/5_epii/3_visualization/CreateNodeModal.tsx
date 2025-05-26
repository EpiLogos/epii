import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { parseCoordinate as parseBimbaCoordinate, inferParentCoordinate as inferBimbaParentCoordinate, initializeQLProperties as initializeBimbaQLProperties } from '../../../utils/bimbaUtils';
import { fetchSuggestedRelationshipTypeAPI, createNodeInGraphAPI } from '@/services/bimbaApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Plus, CheckCircle, Loader2 } from 'lucide-react';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeCreated: (coordinate: string) => void;
  fullGraphData: any;
}

// Interface ParsedCoordinate is no longer needed as bimbaUtils.ts parseCoordinate returns a different shape
// interface ParsedCoordinate {
//   fullCoordinate: string;
//   parts: number[];
//   qlPosition: number;
//   isValid: boolean;
// }

const CreateNodeModal: React.FC<CreateNodeModalProps> = ({
  isOpen,
  onClose,
  onNodeCreated,
  fullGraphData
}) => {
  const [coordinate, setCoordinate] = useState('#');
  const [parentCoordinate, setParentCoordinate] = useState<string | null>(null);
  const [suggestedRelationType, setSuggestedRelationType] = useState('HAS_INTERNAL_COMPONENT');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Internal utility functions parseCoordinate and inferParentCoordinate are removed.
  // We will use the imported versions from bimbaUtils.ts.
  // Note: The imported parseCoordinate returns null for invalid inputs, 
  // and its return type is { fullCoordinate: string; parts: number[]; qlPosition: number } | null
  // The `isValid` field is not present, so logic will need to check for null instead.

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
      // const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'; // Removed
      // const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, { ... }); // Removed
      
      const suggestions = await fetchSuggestedRelationshipTypeAPI(parentCoord); // Placeholder
      if (suggestions && suggestions.length > 0) {
        // If API returns suggestions, use the first one.
        // User might want more sophisticated logic here in future, e.g. if 'HAS_INTERNAL_COMPONENT' is among suggestions, prefer it.
        // For now, just using the first one if available, otherwise defaulting.
        setSuggestedRelationType(suggestions[0]); 
      } else {
        // If API returns no suggestions, default to HAS_INTERNAL_COMPONENT
        setSuggestedRelationType('HAS_INTERNAL_COMPONENT'); 
      }
    } catch (error) {
      console.warn('Failed to suggest relationship type via API:', error);
      // If API call fails, default to HAS_INTERNAL_COMPONENT
      setSuggestedRelationType('HAS_INTERNAL_COMPONENT'); 
    }
  };

  // Auto-update parent when coordinate changes
  useEffect(() => {
    if (coordinate.length > 1) {
      const parsedCoord = parseBimbaCoordinate(coordinate); // Use imported util
      if (parsedCoord) { // Check if parsing was successful
        const inferred = inferBimbaParentCoordinate(coordinate); // Use imported util
        setParentCoordinate(inferred);
        
        if (inferred && parentExists(inferred)) {
          suggestRelationshipType(inferred);
        }
      } else {
        setParentCoordinate(null); // If coordinate is invalid, clear parent
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
    const parsed = parseBimbaCoordinate(coordinate); // Use imported util
    
    if (!parsed) { // Check for null, as imported util returns null for invalid
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
      const parsed = parseBimbaCoordinate(coordinate); // Use imported util
      if (!parsed) { // Should be caught by validateCreation, but double check
        setError("Cannot create node: Invalid coordinate.");
        setIsCreating(false);
        return;
      }

      // const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'; // Removed

      // Initialize QL-aware properties using imported utility
      const nodeProperties = initializeBimbaQLProperties(parsed.fullCoordinate);
      if (!nodeProperties) {
        setError("Failed to initialize node properties. Coordinate might be invalid.");
        setIsCreating(false);
        return;
      }
      
      // Create node with parent relationship - API call replaced
      // let query: string; // Removed
      // let params: any; // Removed
      // ... query building logic removed ...

      // const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, { ... }); // Removed
      
      let finalRelationType = suggestedRelationType; // Use current state by default

      // --- BEGIN NEW SAFEGUARD ---
      if (parentCoordinate) {
        finalRelationType = 'HAS_INTERNAL_COMPONENT';
        console.log('[CreateNodeModal] Safeguard: Ensuring relation type is HAS_INTERNAL_COMPONENT for parented node creation.');
      }
      // --- END NEW SAFEGUARD ---

      // Call the placeholder API function, passing finalRelationType
      await createNodeInGraphAPI(nodeProperties, parentCoordinate, finalRelationType);

      // if (!response.ok) { // Removed
      //   const errorText = await response.text(); // Removed
      //   throw new Error(`Failed to create node: ${errorText}`); // Removed
      // }

      setSuccess(true);
      
      // Auto-close and trigger navigation after brief success display
      setTimeout(() => {
        onNodeCreated(parsed.fullCoordinate); // Use fullCoordinate from parsed
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
    setSuggestedRelationType('HAS_INTERNAL_COMPONENT'); // Update reset value
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

  const parsed = parseBimbaCoordinate(coordinate); // Use imported util
  // The validationError check below will use the result of validateCreation,
  // which itself now uses the imported parseBimbaCoordinate.
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
            {/* Use parsed from the imported function. Check if parsed is not null before accessing properties. */}
            {parsed && ( 
              <div className="text-xs text-gray-400 mt-1">
                QL Position: {parsed.qlPosition}
              </div>
            )}
          </div>

          {/* Parent Detection */}
          {/* Ensure parsed is not null before accessing its properties here too */}
          {parentCoordinate && parsed && (
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
              // Check if parsed is not null for button disabled state
              disabled={isCreating || !parsed || !!validationError} 
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
