import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// Import any icons if needed, e.g., import { SomeIcon } from 'lucide-react';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { coordinate: string; nodeName: string; relationshipType: string; detectedParent: string }) => void;
}

const CreateNodeModal: React.FC<CreateNodeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [coordinate, setCoordinate] = useState('#');
  const [nodeName, setNodeName] = useState('');
  const [relationshipType, setRelationshipType] = useState('HAS_INTERNAL_COMPONENT');
  const [detectedParent, setDetectedParent] = useState('');
  const [coordinateError, setCoordinateError] = useState('');
  const [relationshipSuggestions, setRelationshipSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Ensure coordinate starts with # when modal is open
    if (isOpen && (coordinate === '' || !coordinate.startsWith('#'))) {
      setCoordinate('#');
      setDetectedParent(''); // Reset parent if coordinate is reset
      setCoordinateError('');
      return; // Return early, effect will re-run with '#'
    }

    // 2. Normalize: replace . with -
    // Also remove any trailing hyphens or dots, and multiple consecutive hyphens/dots
    let normalized = coordinate.replace(/\./g, '-');
    normalized = normalized.replace(/-+/g, '-'); // Replace multiple hyphens with a single one
    // Do not allow trailing hyphen unless it's just "#-" which is invalid anyway
    if (normalized.length > 1 && normalized.endsWith('-')) {
        // This case will be caught by validation later, but we can choose to trim it
        // For now, let validation handle it to show error for inputs like "#segment1-"
    }


    // 3. Update coordinate state if normalization changed it.
    // This will re-trigger the effect.
    if (normalized !== coordinate) {
      setCoordinate(normalized);
      return; 
    }

    // 4. Basic validation for overall format
    // Regex: starts with #, followed by alphanumeric segments separated by single hyphens.
    // Allows "#" or "#segment" or "#segment1-segment2"
    // Invalidates: "#-segment", "#segment-", "#segment--segment" (multiple hyphens handled by normalization)
    const isValidFormat = /^#([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)?$/.test(normalized) || normalized === '#';
    
    if (!isValidFormat && normalized !== '#') {
        setCoordinateError('Invalid format. Use # or #segment1-segment2. Segments are alphanumeric.');
        setDetectedParent('');
        return;
    } else if (normalized.startsWith('#-')) { // Specifically catch cases like "#-foo"
        setCoordinateError('Invalid format: Segment cannot start immediately after # with a hyphen.');
        setDetectedParent('');
        return;
    } else {
        setCoordinateError(''); // Clear error if format is valid
    }

    // 5. Parent detection logic
    if (normalized === '#') {
      setDetectedParent(''); // Root or no parent
    } else if (isValidFormat && normalized.length > 1) {
      const partsString = normalized.substring(1); // Remove #
      if (partsString === '') { // Handles case if coordinate somehow became just "#" after normalization from something invalid
        setDetectedParent('');
      } else {
        const parts = partsString.split('-');
        if (parts.length > 1) {
          const parentParts = parts.slice(0, -1);
          setDetectedParent(`#${parentParts.join('-')}`);
        } else { // Single segment like #1 or #abc
          setDetectedParent('#');
        }
      }
    } else {
      // Should be caught by validation, but as a fallback:
      setDetectedParent('');
    }

  }, [coordinate, isOpen, setCoordinate, setDetectedParent, setCoordinateError]); // Existing useEffect

  // useEffect for fetching relationship suggestions
  useEffect(() => {
    // Fetch only if the modal is open and detectedParent is valid (not empty and not the root '#')
    if (isOpen && detectedParent && detectedParent !== '#') {
      const fetchSuggestions = async () => {
        setIsLoadingSuggestions(true);
        setRelationshipSuggestions([]); // Clear previous suggestions
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || ''; // Fallback to empty string if undefined
          const response = await axios.get(
            `${backendUrl}/api/graph/relationship-suggestions?parentCoordinate=${encodeURIComponent(detectedParent)}`
          );
          if (response.data && Array.isArray(response.data)) {
            setRelationshipSuggestions(response.data);
            // If the current relationshipType is not among the new suggestions (and not the default),
            // and suggestions are available, reset to default or first suggestion.
            // For now, keeping it simple: user has to manually change if their previous choice is no longer suggested.
            // Or, if current type is not in (new suggestions + default), reset to default.
            if (response.data.length > 0 && !response.data.includes(relationshipType) && relationshipType !== "HAS_INTERNAL_COMPONENT") {
                // If the current type is no longer valid and it's not the default, reset to default.
                // This can be refined later. For now, let's not auto-change selection aggressively.
            } else if (response.data.length === 0 && relationshipType !== "HAS_INTERNAL_COMPONENT") {
                // If no suggestions and current type is not default, maybe reset to default.
                // setRelationshipType("HAS_INTERNAL_COMPONENT"); // Example of resetting
            }

          } else {
            setRelationshipSuggestions([]);
          }
        } catch (error) {
          console.error('Error fetching relationship suggestions:', error);
          setRelationshipSuggestions([]); // Clear suggestions on error
        } finally {
          setIsLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    } else {
      setRelationshipSuggestions([]); // Clear suggestions if no valid parent or modal is closed
      // Optionally, reset relationshipType to default if it's not already.
      // if (relationshipType !== "HAS_INTERNAL_COMPONENT") {
      //   setRelationshipType("HAS_INTERNAL_COMPONENT");
      // }
    }
  }, [detectedParent, isOpen, relationshipType]); // Added relationshipType to deps for the reset logic if implemented

  const handleSubmit = async () => {
    setSubmissionError(null); // Clear previous errors

    if (coordinateError) {
      setSubmissionError(`Invalid coordinate: ${coordinateError}`);
      return;
    }
    if (coordinate === '#') {
      setSubmissionError('Cannot create a node with coordinate "#". Please specify a segment (e.g., "#segmentName").');
      return;
    }
    if (!nodeName.trim()) {
      setSubmissionError('Node name is required.');
      return;
    }
    // detectedParent should be valid if coordinateError is not set and coordinate is not '#'.
    // For a coordinate like #node1, detectedParent will be '#'. This is a valid parent for the backend.
    if (!detectedParent && coordinate !== '#') { // Should not happen if coordinate logic is correct
        setSubmissionError('Parent could not be detected. Please check the coordinate.');
        return;
    }


    if (!window.confirm("You are about to add a new node to the sacred Bimba map. Proceed?")) {
      return;
    }

    setIsSubmitting(true);

    let qlPositionVal = null;
    if (coordinate && coordinate.startsWith('#') && coordinate.length > 1) {
      const parts = coordinate.substring(1).split('-');
      if (parts.length > 0) {
        const lastSegment = parts[parts.length - 1];
        if (lastSegment) { // Ensure lastSegment is not empty string if coordinate ends with - (e.g. #1-2-)
          const num = parseInt(lastSegment, 10);
          if (!isNaN(num)) {
            qlPositionVal = num;
          }
        }
      }
    }
  
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.post(`${backendUrl}/api/graph/create-node`, {
        bimbaCoordinate: coordinate,
        parentCoordinate: detectedParent,
        relationshipType,
        nodeName,
        qlPosition: qlPositionVal,
        additionalProperties: { uiSource: 'EPII_CREATE_NODE_MODAL' }
      });

      if (response.status === 201) {
        await queryClient.invalidateQueries({ queryKey: ['fullGraph'] });
        onSubmit(response.data); // This will also close the modal as per Meta2DIntegration's onSubmit
        // Reset form states after successful submission for next time modal opens
        setCoordinate('#');
        setNodeName('');
        setRelationshipType('HAS_INTERNAL_COMPONENT');
        setDetectedParent('');
        setRelationshipSuggestions([]);
      }
    } catch (error: any) {
      console.error('Error creating node:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setSubmissionError(error.response.data.error);
      } else {
        setSubmissionError('An unexpected error occurred during node creation.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        // Reset states when modal is closed externally too
        setCoordinate('#');
        setNodeName('');
        setRelationshipType('HAS_INTERNAL_COMPONENT');
        setDetectedParent('');
        setSubmissionError(null);
        setCoordinateError('');
        setRelationshipSuggestions([]);
        setIsSubmitting(false); // Ensure submitting state is reset
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Bimba Node</DialogTitle>
          <DialogDescription>
            Enter the details for the new node. The parent will be auto-detected from the coordinate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Coordinate Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coordinate" className="text-right">Bimba Coordinate</Label>
            <Input 
              id="coordinate" 
              value={coordinate} 
              onChange={(e) => setCoordinate(e.target.value)} 
              className={`col-span-3 ${coordinateError ? 'border-red-500' : ''}`}
              placeholder="e.g., #1-2-3" 
              disabled={isSubmitting}
            />
            {coordinateError && <p className="col-span-4 text-red-500 text-sm">{coordinateError}</p>}
          </div>
          {/* Detected Parent Display */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="detectedParent" className="text-right">Detected Parent</Label>
            <Input 
              id="detectedParent" 
              value={detectedParent} 
              readOnly 
              className="col-span-3 bg-muted" 
              disabled={isSubmitting} // Technically not needed as it's readOnly
            />
          </div>
          {/* Node Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nodeName" className="text-right">Node Name</Label>
            <Input 
              id="nodeName" 
              value={nodeName} 
              onChange={(e) => setNodeName(e.target.value)} 
              className="col-span-3" 
              disabled={isSubmitting}
            />
          </div>
          {/* Relationship Type Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relationshipType" className="text-right">Relationship Type</Label>
            <Select 
              value={relationshipType} 
              onValueChange={setRelationshipType} 
              disabled={isLoadingSuggestions || isSubmitting}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HAS_INTERNAL_COMPONENT">HAS_INTERNAL_COMPONENT</SelectItem>
                {relationshipSuggestions
                  .filter(suggestion => suggestion !== "HAS_INTERNAL_COMPONENT") 
                  .map(suggestion => (
                    <SelectItem key={suggestion} value={suggestion}>{suggestion}</SelectItem>
                ))}
                {isLoadingSuggestions && <SelectItem value="loading_suggestions" disabled>Loading suggestions...</SelectItem>}
                { !isLoadingSuggestions && relationshipSuggestions.length === 0 && detectedParent && detectedParent !== '#' && 
                  <SelectItem value="no_suggestions" disabled>No suggestions found for parent.</SelectItem>
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        {submissionError && (
          <div className="col-span-4 p-2 mb-2 text-center text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">
            {submissionError}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating Node...' : 'Create Node'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNodeModal;
