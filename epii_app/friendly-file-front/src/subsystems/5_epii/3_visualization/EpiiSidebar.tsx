/**
 * Sidebar for Epii mode with Bimba coordinates and documents
 * Bimba Coordinate: #5-3-4.5-3
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload } from 'lucide-react';
import { useBimbaCoordinates, BimbaCoordinate, Document } from '../2_hooks/useBimbaCoordinates';
import { useEpii } from '../4_context/EpiiContext';
import { useDocumentUpload } from '../2_hooks/useEpiiDocument';
import CoordinateItem from './RecursiveCoordinateTree';
import { standardizeDocumentContent } from '../1_services/documentCacheService';

interface EpiiSidebarProps {
  onSelectDocument?: (document: Document) => void;
  onSelectCoordinate?: (coordinate: BimbaCoordinate) => void;
}

const EpiiSidebar: React.FC<EpiiSidebarProps> = ({
  onSelectDocument,
  onSelectCoordinate
}) => {
  const { state, dispatch } = useEpii();
  const { isLoading: isLoadingDocuments } = state;
  const { coordinates, isLoading: isLoadingCoordinates, error, fetchDocumentsForCoordinate } = useBimbaCoordinates(isLoadingDocuments);
  const { uploadDocument, isUploading } = useDocumentUpload('default-user');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState<string | null>(null);
  const [expandedCoordinates, setExpandedCoordinates] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCoordinates, setFilteredCoordinates] = useState<BimbaCoordinate[]>([]);

  // Filter coordinates based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCoordinates(coordinates);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = coordinates.filter(coord =>
      coord.coordinate.toLowerCase().includes(query) ||
      coord.title.toLowerCase().includes(query)
    );

    setFilteredCoordinates(filtered);
  }, [searchQuery, coordinates]);

  // Toggle coordinate expansion
  const toggleCoordinate = (coordinate: string) => {
    setExpandedCoordinates(prev => {
      const isExpanded = !prev[coordinate];

      // If expanding, fetch documents for this coordinate
      if (isExpanded) {
        fetchDocumentsForCoordinate(coordinate);
      }

      // Set as selected coordinate for uploads
      setSelectedCoordinate(coordinate);

      return {
        ...prev,
        [coordinate]: isExpanded
      };
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      // Check if a document with the same name already exists
      const existingDocuments = coordinates
        .flatMap(coord => coord.documents || [])
        .filter(doc => doc.name === file.name);

      if (existingDocuments.length > 0) {
        // Ask user if they want to replace the existing document
        const confirmReplace = window.confirm(
          `A document with the name "${file.name}" already exists. Do you want to replace it?`
        );

        if (confirmReplace) {
          // Read file content
          const fileContent = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsText(file);
          });

          // Get the existing document
          const existingDoc = existingDocuments[0];

          // Update the existing document with new content
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: existingDoc.id,
              content: fileContent,
              forceSync: true // Force sync to MongoDB
            }
          });

          // Set as current document
          dispatch({
            type: 'SET_CURRENT_DOCUMENT',
            payload: existingDoc.id
          });

          // Show success message
          dispatch({
            type: 'SET_STATUS_MESSAGE',
            payload: {
              type: 'success',
              text: `Document "${file.name}" replaced successfully.`
            }
          });

          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          return;
        }
      }

      // Upload the file without requiring a coordinate initially
      // This allows users to view the document first, then assign a coordinate
      const uploadedDoc = await uploadDocument(file, null);

      if (uploadedDoc) {
        // Read file content directly if needed
        const fileContent = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsText(file);
        });

        // Create a document object
        const newDoc = {
          id: typeof uploadedDoc === 'object' && 'id' in uploadedDoc ? uploadedDoc.id : `doc-${Date.now()}`,
          name: file.name,
          content: fileContent,
          lastModified: new Date(),
          versions: [{ timestamp: new Date(), content: fileContent }],
          bimbaCoordinate: selectedCoordinate, // Use selected coordinate if available
          documentType: 'bimba' as const // Default to bimba document type
        };

        // Add document to state
        dispatch({
          type: 'ADD_DOCUMENT',
          payload: newDoc
        });

        // Set current document to view it immediately
        dispatch({
          type: 'SET_CURRENT_DOCUMENT',
          payload: newDoc.id
        });

        // Show success message with instructions
        dispatch({
          type: 'SET_STATUS_MESSAGE',
          payload: {
            type: 'success',
            text: `Document "${file.name}" uploaded successfully. ${!selectedCoordinate ? 'You can now assign a Bimba coordinate in the document view.' : ''}`
          }
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  // Handle document selection
  const handleDocumentSelect = async (document: any) => {
    // Ensure document has an id property (use _id if id is missing)
    if (!document.id && document._id) {
      document.id = document._id;
    }

    // Ensure document has a name property
    if (!document.name && (document.originalName || document.fileName || document.title)) {
      document.name = document.originalName || document.fileName || document.title;
    }

    // Ensure document has a bimbaCoordinate property
    if (!document.bimbaCoordinate && document.targetCoordinate) {
      document.bimbaCoordinate = document.targetCoordinate;
    }

    // Add detailed logging for debugging
    console.log('Document selected:', document);
    console.log('Document type:', document.documentType);
    console.log('Document ID:', document.id);
    console.log('Document name:', document.name);
    console.log('Document bimbaCoordinate:', document.bimbaCoordinate);
    console.log('Document bimbaId:', document.bimbaId);

    if (onSelectDocument) {
      onSelectDocument(document);
    }

    try {
      // Check if this is a pratibimba document
      const isPratibimba = document.documentType === 'pratibimba';

      // Import document cache service
      const documentCacheService = (await import('../1_services/documentCacheService')).default;

      // First check if the document is already in the state with textContent
      const existingDoc = state.documents.find(doc => doc.id === document.id && doc.textContent);

      if (existingDoc && existingDoc.textContent) {
        console.log(`Using document ${document.id} from state with textContent length: ${existingDoc.textContent.length}`);

        // Set the current document - no need to update since it's already in state
        dispatch({
          type: 'SET_CURRENT_DOCUMENT',
          payload: document.id
        });

        return;
      }

      // Next check if the document is in the cache
      const cachedDoc = documentCacheService.getDocumentById(document.id);

      if (cachedDoc && (cachedDoc.textContent || cachedDoc.content)) {
        console.log(`Using document ${document.id} from cache with textContent length: ${
          cachedDoc.textContent?.length || cachedDoc.content?.length || 0
        }`);

        // DEBUG: Log the entire cached document to see what fields are actually present
        console.log('Cached document object:', JSON.stringify(cachedDoc, null, 2));

        const documentContent = cachedDoc.textContent || cachedDoc.content || '';
        console.log(`Document content to be dispatched: ${documentContent.substring(0, 50)}...`);

        // First check if the document exists in the documents array
        const existingDocInState = state.documents.find(doc => doc.id === document.id);

        if (existingDocInState) {
          console.log(`Document ${document.id} already exists in state, updating it`);

          // Update the EpiiContext with the cached document
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: document.id,
              textContent: documentContent,
              name: cachedDoc.name || cachedDoc.fileName || cachedDoc.originalName || document.name,
              documentType: isPratibimba ? 'pratibimba' : 'bimba',
              forceSync: false
            }
          });
        } else {
          console.log(`Document ${document.id} not found in state, adding it as a new document`);

          // Create a new document object
          const newDoc = {
            id: document.id,
            name: cachedDoc.name || cachedDoc.fileName || cachedDoc.originalName || document.name,
            textContent: documentContent,
            lastModified: new Date(cachedDoc.lastModified || cachedDoc.uploadDate || Date.now()),
            bimbaCoordinate: cachedDoc.bimbaCoordinate || cachedDoc.targetCoordinate,
            documentType: isPratibimba ? 'pratibimba' : 'bimba',
            versions: []
          };

          // Add the document to the state
          dispatch({
            type: 'ADD_DOCUMENT',
            payload: newDoc
          });
        }

        // Set the current document
        dispatch({
          type: 'SET_CURRENT_DOCUMENT',
          payload: document.id
        });

        return;
      }

      // If not in state or cache, then as a last resort, fetch from MongoDB
      console.log(`Document ${document.id} not found in state or cache, fetching from MongoDB...`);

      const collection = isPratibimba ? 'pratibimbaDocuments' : 'Documents';

      // Import the document service
      const { documentService } = await import('../1_services/documentService');

      // Use the document service to get the document with content
      const fullDocument = await documentService.getDocument(document.id, collection, true);

      if (fullDocument) {
        console.log(`Retrieved document ${document.id} from MongoDB with textContent length: ${
          fullDocument.textContent?.length || fullDocument.content?.length || 0
        }`);

        // First check if the document exists in the documents array
        const existingDocInState = state.documents.find(doc => doc.id === document.id);
        const documentContent = fullDocument.textContent || fullDocument.content || '';

        if (existingDocInState) {
          console.log(`Document ${document.id} already exists in state, updating it`);

          // Update the EpiiContext with the fetched document
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: document.id,
              textContent: documentContent,
              name: fullDocument.name || fullDocument.fileName || fullDocument.originalName || document.name,
              documentType: isPratibimba ? 'pratibimba' : 'bimba',
              forceSync: false
            }
          });
        } else {
          console.log(`Document ${document.id} not found in state, adding it as a new document`);

          // Create a new document object
          const newDoc = {
            id: document.id,
            name: fullDocument.name || fullDocument.fileName || fullDocument.originalName || document.name,
            textContent: documentContent,
            lastModified: new Date(fullDocument.lastModified || fullDocument.uploadDate || Date.now()),
            bimbaCoordinate: fullDocument.bimbaCoordinate || fullDocument.targetCoordinate,
            documentType: isPratibimba ? 'pratibimba' : 'bimba',
            versions: []
          };

          // Add the document to the state
          dispatch({
            type: 'ADD_DOCUMENT',
            payload: newDoc
          });
        }

        // Set the current document
        dispatch({
          type: 'SET_CURRENT_DOCUMENT',
          payload: document.id
        });
      } else {
        console.warn(`Document ${document.id} not found in MongoDB or has no content`);

        // First check if the document exists in the documents array
        const existingDocInState = state.documents.find(doc => doc.id === document.id);

        if (existingDocInState) {
          console.log(`Document ${document.id} already exists in state, updating it with empty content`);

          // Update the EpiiContext with empty content
          dispatch({
            type: 'UPDATE_DOCUMENT',
            payload: {
              id: document.id,
              textContent: '',
              name: document.name,
              documentType: isPratibimba ? 'pratibimba' : 'bimba',
              forceSync: false
            }
          });
        } else {
          console.log(`Document ${document.id} not found in state, adding it as a new document with empty content`);

          // Create a new document object with empty content
          const newDoc = {
            id: document.id,
            name: document.name,
            textContent: '',
            lastModified: new Date(),
            bimbaCoordinate: document.bimbaCoordinate,
            documentType: isPratibimba ? 'pratibimba' : 'bimba',
            versions: []
          };

          // Add the document to the state
          dispatch({
            type: 'ADD_DOCUMENT',
            payload: newDoc
          });
        }

        // Set the current document
        dispatch({
          type: 'SET_CURRENT_DOCUMENT',
          payload: document.id
        });
      }
    } catch (error) {
      console.error('Error fetching document content:', error);

      // Check if this is a pratibimba document
      const isPratibimba = document.documentType === 'pratibimba';

      // First check if the document exists in the documents array
      const existingDocInState = state.documents.find(doc => doc.id === document.id);

      if (existingDocInState) {
        console.log(`Document ${document.id} already exists in state, updating it with empty content (error case)`);

        // Update the EpiiContext with empty content
        dispatch({
          type: 'UPDATE_DOCUMENT',
          payload: {
            id: document.id,
            textContent: '',
            name: document.name,
            documentType: isPratibimba ? 'pratibimba' : 'bimba',
            forceSync: false
          }
        });
      } else {
        console.log(`Document ${document.id} not found in state, adding it as a new document with empty content (error case)`);

        // Create a new document object with empty content
        const newDoc = {
          id: document.id,
          name: document.name,
          textContent: '',
          lastModified: new Date(),
          bimbaCoordinate: document.bimbaCoordinate,
          documentType: isPratibimba ? 'pratibimba' : 'bimba',
          versions: []
        };

        // Add the document to the state
        dispatch({
          type: 'ADD_DOCUMENT',
          payload: newDoc
        });
      }

      // Set the current document
      dispatch({
        type: 'SET_CURRENT_DOCUMENT',
        payload: document.id
      });

      // Show error message
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to load ${isPratibimba ? 'pratibimba' : 'bimba'} document content: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  // Handle coordinate selection
  const handleCoordinateSelect = (coordinate: BimbaCoordinate) => {
    if (onSelectCoordinate) {
      onSelectCoordinate(coordinate);
    }
  };

  // Build a nested structure of coordinates that can handle any depth
  const buildNestedCoordinates = (coords: BimbaCoordinate[]) => {
    // Define a recursive node type that can handle any depth
    type NestedNode = {
      coordinate: BimbaCoordinate;
      children: Record<string, NestedNode>;
    };

    // Create a map to store the nested structure
    const nestedMap: Record<string, NestedNode> = {};

    // First, ensure we have a root node
    const rootCoord = coords.find(c => c.coordinate === '#');
    if (rootCoord) {
      nestedMap['#'] = {
        coordinate: rootCoord,
        children: {}
      };
    } else {
      // Create a placeholder root node if it doesn't exist
      nestedMap['#'] = {
        coordinate: {
          coordinate: '#',
          title: 'Root',
          labels: []
        },
        children: {}
      };
    }

    // Create a map for quick coordinate lookup
    const coordMap = new Map<string, BimbaCoordinate>();
    coords.forEach(coord => {
      coordMap.set(coord.coordinate, coord);
    });

    // Helper function to get parent coordinate
    const getParentCoordinate = (coordinate: string): string => {
      if (coordinate === '#' || !coordinate.includes('-') && !coordinate.includes('.')) {
        return '#'; // Root is parent of top-level coordinates
      }

      // Find the last delimiter (- or .)
      const lastDashIndex = coordinate.lastIndexOf('-');
      const lastDotIndex = coordinate.lastIndexOf('.');

      // Use the rightmost delimiter
      const lastDelimiterIndex = Math.max(lastDashIndex, lastDotIndex);

      if (lastDelimiterIndex > 0) {
        return coordinate.substring(0, lastDelimiterIndex);
      }

      return '#'; // Default to root if no delimiter found
    };

    // Sort coordinates by depth to ensure parents are processed before children
    const sortedCoords = [...coords].sort((a, b) => {
      const depthA = (a.coordinate.match(/[-]/g) || []).length + (a.coordinate.match(/[.]/g) || []).length;
      const depthB = (b.coordinate.match(/[-]/g) || []).length + (b.coordinate.match(/[.]/g) || []).length;
      return depthA - depthB;
    });

    // Process each coordinate
    sortedCoords.forEach(coord => {
      if (coord.coordinate === '#') return; // Skip root

      const parentCoord = getParentCoordinate(coord.coordinate);

      // Find or create parent node
      let parentNode: NestedNode;

      if (parentCoord === '#') {
        parentNode = nestedMap['#'];
      } else {
        // Find the parent node in the tree

        // Traverse the tree to find the parent
        const findParent = (node: NestedNode, target: string): NestedNode | null => {
          if (node.coordinate.coordinate === target) {
            return node;
          }

          for (const childKey in node.children) {
            const result = findParent(node.children[childKey], target);
            if (result) return result;
          }

          return null;
        };

        const foundParent = findParent(nestedMap['#'], parentCoord);

        if (foundParent) {
          parentNode = foundParent;
        } else {
          // If parent not found, create it recursively

          // Recursively create parent nodes
          const createParentNodes = (coordinate: string): NestedNode => {
            if (coordinate === '#') {
              return nestedMap['#'];
            }

            const grandParentCoord = getParentCoordinate(coordinate);
            const grandParent = createParentNodes(grandParentCoord);

            if (!grandParent.children[coordinate]) {
              const coordObj = coordMap.get(coordinate) || {
                coordinate: coordinate,
                title: coordinate,
                labels: []
              };

              grandParent.children[coordinate] = {
                coordinate: coordObj,
                children: {}
              };
            }

            return grandParent.children[coordinate];
          };

          parentNode = createParentNodes(parentCoord);
        }
      }

      // Add this coordinate as a child of its parent
      parentNode.children[coord.coordinate] = {
        coordinate: coord,
        children: {}
      };
    });

    return nestedMap;
  };

  // Build the nested structure
  const nestedCoordinates = buildNestedCoordinates(filteredCoordinates);

  // Sort top-level subsystems numerically, with root (#) first
  const sortedSubsystems = Object.keys(nestedCoordinates).sort((a, b) => {
    // Root coordinate (#) should always be first
    if (a === '#') return -1;
    if (b === '#') return 1;

    // Extract numbers from coordinates
    const numA = parseInt(a.replace(/[^\d]/g, ''));
    const numB = parseInt(b.replace(/[^\d]/g, ''));

    // Handle non-numeric coordinates
    if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;

    return numA - numB;
  });

  return (
    <div className="w-64 h-full flex flex-col bg-epii-dark rounded-lg overflow-hidden shadow-lg border border-gray-700">
      {/* Header */}
      <div className="p-2 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-epii-neon">Bimba Navigator</h2>
        <div className="mt-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coordinates..."
            className="w-full p-1.5 pl-7 bg-epii-darker rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-epii-neon"
          />
          <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Coordinates List */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden p-1 scrollbar-thin scrollbar-thumb-epii-dark scrollbar-track-transparent">
        {isLoadingCoordinates && <div className="text-gray-400 text-sm p-2">Loading coordinates...</div>}

        {isLoadingDocuments && <div className="text-gray-400 text-sm p-2">Loading documents...</div>}

        {error && <div className="text-red-400 text-sm p-2">{error}</div>}

        {!isLoadingCoordinates && !isLoadingDocuments && !error && filteredCoordinates.length === 0 && (
          <div className="text-gray-400 text-sm p-2">No coordinates found</div>
        )}

        {/* Render nested coordinates using recursive component */}
        {!isLoadingDocuments && sortedSubsystems.map(topLevel => {
          const topLevelItem = nestedCoordinates[topLevel];

          return (
            <CoordinateItem
              key={topLevel}
              coordinate={topLevelItem.coordinate}
              children={topLevelItem.children}
              expandedCoordinates={expandedCoordinates}
              toggleCoordinate={toggleCoordinate}
              handleCoordinateSelect={handleCoordinateSelect}
              handleDocumentSelect={handleDocumentSelect}
              isSubsystem={topLevel !== '#' && /^#[0-5]$/.test(topLevel)}
            />
          );
        })}


      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        <input
          type="file"
          id="sidebar-file-upload"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".txt,.md,.pdf,.docx,.doc,.html,.htm,.json,.csv,.xml,.rtf"
        />
        <button
          className={`w-full p-2 ${isUploading ? 'bg-gray-600' : 'bg-epii-neon'} text-epii-darker rounded-md hover:brightness-110 transition-all flex items-center justify-center`}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-epii-darker border-t-transparent rounded-full" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              <span>Upload Document{selectedCoordinate ? ` to ${selectedCoordinate}` : ''}</span>
            </>
          )}
        </button>
        {selectedCoordinate && (
          <div className="mt-2 text-xs text-center text-gray-400">
            Selected coordinate: <span className="text-epii-neon">{selectedCoordinate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpiiSidebar;

