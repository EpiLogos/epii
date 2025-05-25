/**
 * Recursive component for rendering Bimba coordinates at any depth
 * Bimba Coordinate: #5-3-4.5-3-1
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Hash, Sparkles } from 'lucide-react';
import { BimbaCoordinate, Document } from '../2_hooks/useBimbaCoordinates';
import { useEpii } from '../4_context/EpiiContext';

interface CoordinateItemProps {
  coordinate: BimbaCoordinate;
  children: Record<string, {
    coordinate: BimbaCoordinate;
    children: Record<string, any>;
  }>;
  depth?: number;
  isSubsystem?: boolean;
  expandedCoordinates: Record<string, boolean>;
  toggleCoordinate: (coordinate: string) => void;
  handleCoordinateSelect: (coordinate: BimbaCoordinate) => void;
  handleDocumentSelect: (document: Document) => void;
}

const CoordinateItem: React.FC<CoordinateItemProps> = ({
  coordinate,
  children,
  depth = 0,
  isSubsystem = false,
  expandedCoordinates,
  toggleCoordinate,
  handleCoordinateSelect,
  handleDocumentSelect
}) => {
  // Get documents from context
  const { state } = useEpii();
  // Filter documents to get only pratibimba documents
  const pratibimbaDocuments = state.documents.filter(doc => doc.documentType === 'pratibimba');

  // Track expanded state for pratibimba documents
  const [expandedPratibimba, setExpandedPratibimba] = useState<Record<string, boolean>>({});

  // Determine icon size and padding based on depth
  const iconSize = Math.max(16 - depth * 1, 10);
  const padding = depth === 0 ? 'p-1.5' : 'p-1';

  // Sort children by coordinate for consistent display
  const sortedChildKeys = Object.keys(children).sort((a, b) => {
    // Split by both delimiters
    const partsA = a.split(/[-\.]/);
    const partsB = b.split(/[-\.]/);

    // Compare each segment numerically if possible
    const minLength = Math.min(partsA.length, partsB.length);

    for (let i = 0; i < minLength; i++) {
      // Extract numbers for numeric sorting
      const numA = parseInt(partsA[i].replace(/[^\d]/g, ''));
      const numB = parseInt(partsB[i].replace(/[^\d]/g, ''));

      // Handle non-numeric segments
      if (isNaN(numA) && isNaN(numB)) {
        const compare = partsA[i].localeCompare(partsB[i]);
        if (compare !== 0) return compare;
      } else if (isNaN(numA)) {
        return 1;
      } else if (isNaN(numB)) {
        return -1;
      } else if (numA !== numB) {
        return numA - numB;
      }
    }

    // If all segments are equal up to the minimum length, shorter coordinates come first
    return partsA.length - partsB.length;
  });

  // Toggle pratibimba expansion for a document
  const togglePratibimba = (docId: string) => {
    setExpandedPratibimba(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  return (
    <div className={depth === 0 ? "mb-4" : "mb-1"}>
      {/* Header for top-level items */}
      {depth === 0 && (
        <div className="text-sm font-medium text-gray-400 mb-1 px-2">
          {coordinate.coordinate === '#' ? 'System' : `Subsystem ${coordinate.coordinate}`}
        </div>
      )}

      {/* Coordinate item */}
      <div className={depth === 0 ? "mb-1" : ""}>
        <div
          className={`flex items-center ${padding} rounded-md hover:bg-epii-dark cursor-pointer ${depth > 0 ? 'ml-2' : ''}`}
          onClick={() => toggleCoordinate(coordinate.coordinate)}
          title={`${coordinate.title || coordinate.coordinate} (${coordinate.coordinate})`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCoordinate(coordinate.coordinate);
            }}
            className="mr-0.5 p-0.5 hover:bg-epii-darker rounded-md"
          >
            {expandedCoordinates[coordinate.coordinate] ? (
              <ChevronDown size={iconSize} />
            ) : (
              <ChevronRight size={iconSize} />
            )}
          </button>
          <Hash size={iconSize} className="mr-1 text-epii-neon" />
          <div className="flex-grow min-w-0">
            <div className={`${depth === 0 ? 'text-sm' : 'text-xs'} font-medium truncate`}>
              {coordinate.title || coordinate.coordinate}
            </div>
            <div className="text-xs text-gray-400 truncate">{coordinate.coordinate}</div>
          </div>
        </div>

        {/* Expanded content */}
        {expandedCoordinates[coordinate.coordinate] && (
          <div className="ml-6 space-y-1">
            {/* Documents */}
            <div className="mt-1 mb-2">
              <div className="text-xs font-medium text-gray-400 mb-1 px-1">Documents</div>
              {coordinate.documents && coordinate.documents.length > 0 ? (
                coordinate.documents.map(doc => {
                  // Skip pratibimba documents here, they'll be shown under their bimba parents
                  if (doc.documentType === 'pratibimba') {
                    return null;
                  }

                  // Find any pratibimba documents associated with this bimba document
                  // Only match by bimbaId for a tighter link between bimba and pratibimba
                  // Use _id or id for matching since MongoDB uses _id
                  const relatedPratibimbas = pratibimbaDocuments.filter(
                    pratibimba => pratibimba.bimbaId === (doc._id || doc.id)
                  );

                  const hasPratibimbas = relatedPratibimbas.length > 0;

                  // Log for debugging
                  if (hasPratibimbas) {
                    console.log(`Found ${relatedPratibimbas.length} pratibimba documents for bimba document ${doc.id} with coordinate ${doc.bimbaCoordinate}`);
                  }

                  return (
                    <div key={doc.id} className="ml-1">
                      <div className="flex items-center">
                        {hasPratibimbas ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePratibimba(doc.id);
                            }}
                            className="mr-0.5 p-0.5 hover:bg-epii-darker rounded-md flex items-center"
                          >
                            {expandedPratibimba[doc.id] ? (
                              <ChevronDown size={10} />
                            ) : (
                              <ChevronRight size={10} />
                            )}
                            <Sparkles size={8} className="ml-0.5 text-purple-400" />
                          </button>
                        ) : (
                          <div className="w-[18px]"></div> /* Spacer for alignment */
                        )}
                        <div
                          className="flex items-center p-1 rounded-md hover:bg-epii-dark cursor-pointer flex-grow"
                          onClick={() => handleDocumentSelect(doc)}
                          title={doc.name}
                        >
                          <FileText size={12} className="mr-1 flex-shrink-0 text-gray-400" />
                          <div className="text-xs truncate max-w-[140px]">{doc.name}</div>
                        </div>
                      </div>

                      {/* Pratibimba documents */}
                      {hasPratibimbas && expandedPratibimba[doc.id] && (
                        <div className="ml-4 mt-1">
                          {relatedPratibimbas.map(pratibimba => (
                            <div
                              key={pratibimba._id || pratibimba.id}
                              className="flex items-center p-1 rounded-md hover:bg-epii-dark cursor-pointer"
                              onClick={() => {
                                // Just pass the pratibimba document directly without any transformations
                                // The document is already in the cache and state, so it should work as is
                                handleDocumentSelect(pratibimba);
                              }}
                              title={pratibimba.name}
                            >
                              <Sparkles size={10} className="mr-1 flex-shrink-0 text-purple-400" />
                              <div className="text-xs truncate max-w-[120px] text-purple-200">
                                {pratibimba.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-gray-500 p-1 ml-1">No documents</div>
              )}

              {/* Standalone Pratibimba documents (not associated with any bimba document) */}
              {coordinate.documents && coordinate.documents.some(doc => doc.documentType === 'pratibimba' && !doc.bimbaId) && (
                <div className="mt-2">
                  {coordinate.documents
                    .filter(doc => doc.documentType === 'pratibimba' && !doc.bimbaId)
                    .map(pratibimba => (
                      <div
                        key={pratibimba._id || pratibimba.id}
                        className="flex items-center p-1 rounded-md hover:bg-epii-dark cursor-pointer ml-1"
                        onClick={() => {
                          // Just pass the pratibimba document directly
                          handleDocumentSelect(pratibimba);
                        }}
                        title={pratibimba.name}
                      >
                        <Sparkles size={10} className="mr-1 flex-shrink-0 text-purple-400" />
                        <div className="text-xs truncate max-w-[140px] text-purple-200">
                          {pratibimba.name}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Child coordinates */}
            {sortedChildKeys.length > 0 && (
              <div className="mt-1">
                <div className="text-xs font-medium text-gray-400 mb-1 px-1">Child Coordinates</div>
                {sortedChildKeys.map(childKey => (
                  <CoordinateItem
                    key={childKey}
                    coordinate={children[childKey].coordinate}
                    children={children[childKey].children}
                    depth={depth + 1}
                    expandedCoordinates={expandedCoordinates}
                    toggleCoordinate={toggleCoordinate}
                    handleCoordinateSelect={handleCoordinateSelect}
                    handleDocumentSelect={handleDocumentSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinateItem;
