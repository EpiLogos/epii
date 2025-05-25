/**
 * Main integration page for Epii mode
 * Bimba Coordinate: #5-3-4.5-5
 */

import React, { useState } from 'react';
import PageTransition from "../../../components/layout/PageTransition";
import GeometricBackground from "../../../components/ui/GeometricBackground";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Info, Menu, X } from "lucide-react";
import DocumentCanvas from '../3_visualization/DocumentCanvas';
import EpiiSidebar from '../3_visualization/EpiiSidebar';
import EpiiChat from '../3_visualization/EpiiChat';
import BimbaUpdateOverlay from '../3_visualization/BimbaUpdateOverlay';
import { EpiiProvider, useEpii } from '../4_context/EpiiContext';
import { BimbaCoordinate, Document as BimbaDocument, useBimbaCoordinates } from '../2_hooks/useBimbaCoordinates';

// Define interface for the overall payload
interface NotionUpdatePayload {
  sourceDocument: {
    type: "NotionPage" | "URL" | "BimbaCoordinate";
    id: string;
  };
  analysisSummary: string;
  proposedUpdates: Array<{
    targetType: string;
    targetId: string;
    targetBimbaCoordinate: string;
    updateAction: string;
    content?: unknown[];
  }>;
}

const EpiiModeContent: React.FC = () => {
  const { state } = useEpii();
  const { statusMessage } = state;
  const [selectedCoordinate, setSelectedCoordinate] = useState<BimbaCoordinate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [bimbaUpdateOpen, setBimbaUpdateOpen] = useState<boolean>(false);

  // Use the Bimba coordinates hook
  const { coordinates, getRelatedCoordinates, refreshCoordinateDocuments } = useBimbaCoordinates();

  // Get current document
  const currentDocument = state.documents.find(doc => doc.id === state.currentDocumentId);

  // Metadata for display
  const metadata = {
    bimbaCoordinate: selectedCoordinate?.coordinate || "#5-2-1", // Use selected coordinate or default
    notionPageUrl: "https://www.notion.so/example-page", // This would come from the analysis results
    sourceDocName: currentDocument?.name || "No document loaded",
  };

  // State values
  const isAnalyzing = state.isLoading;
  const lastUpdateTimestamps = {
    notion: currentDocument?.lastModified || new Date(),
    bimba: new Date()
  };

  // Handle document selection from sidebar
  const handleDocumentSelect = (document: any) => {
    // Ensure document has both id and _id properties
    if (!document.id && document._id) {
      document.id = document._id;
    }
    if (!document._id && document.id) {
      document._id = document.id;
    }

    console.log("Selected document:", document);
    // This is handled by the EpiiSidebar component
  };

  // Handle coordinate selection from sidebar
  const handleCoordinateSelect = (coordinate: BimbaCoordinate) => {
    console.log("Selected coordinate:", coordinate);
    setSelectedCoordinate(coordinate);
  };

  // Handle opening the Bimba update overlay
  const handleOpenBimbaUpdate = () => {
    setBimbaUpdateOpen(true);
    setSidebarOpen(false); // Close sidebar when opening overlay
  };

  // Get related coordinates from the selected coordinate
  const relatedCoordinates = selectedCoordinate
    ? getRelatedCoordinates(selectedCoordinate.coordinate)
    : [];

  // Sample payload
  const originalPayload = {
    sourceDocument: { type: "NotionPage", id: "example-id" },
    analysisSummary: "Example analysis summary",
    proposedUpdates: []
  } as NotionUpdatePayload;

  // Function to handle opening related coordinate
  const handleOpenRelatedCoordinate = (coordinate: string) => {
    console.log("Opening related coordinate:", coordinate);

    // Find the coordinate in the list of coordinates
    const selectedCoord = coordinates.find(c => c.coordinate === coordinate);

    if (selectedCoord) {
      // Update the selected coordinate
      setSelectedCoordinate(selectedCoord);
    } else {
      console.warn(`Coordinate ${coordinate} not found in the list of coordinates`);
    }
  };

  // Helper to format date
  const formatDate = (date?: Date) => {
    return date ? date.toLocaleString() : 'N/A';
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-6"> {/* Match Chat.tsx padding */}
        <GeometricBackground density={8} opacity={0.02} />

        <div className="container mx-auto px-4 h-[calc(100vh-8rem)]"> {/* Match Chat.tsx container */}
          <div className="flex h-full gap-4 relative"> {/* Match Chat.tsx main flex */}

            {/* Sidebar Toggle Button - Positioned to avoid being covered */}
            <button
              className={`absolute top-2 ${sidebarOpen ? 'left-[270px]' : 'left-2'} z-30 p-2 rounded-md bg-epii-dark text-white hover:bg-epii-dark/90 transition-all duration-300`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay to close sidebar when clicking outside */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/20 z-10"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Epii Sidebar - Collapsible */}
            <div className={`absolute top-0 left-0 h-full z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <EpiiSidebar
                onSelectDocument={(doc) => {
                  // Ensure document has both id and _id properties
                  if (!doc.id && doc._id) {
                    doc.id = doc._id;
                  }
                  if (!doc._id && doc.id) {
                    doc._id = doc.id;
                  }

                  handleDocumentSelect(doc);
                  setSidebarOpen(false);
                }}
                onSelectCoordinate={(coord) => {
                  handleCoordinateSelect(coord);
                  setSidebarOpen(false);
                }}
                onOpenBimbaUpdate={handleOpenBimbaUpdate}
              />
            </div>

            {/* Main Content Area (Combined Chat + Canvas) */}
            <div className="flex-grow flex bg-epii-dark/40 neo-glow rounded-lg overflow-hidden w-full"> {/* Match Chat.tsx styling */}

              {/* Left Pane: Chat Interaction */}
              <div className="w-1/3 flex flex-col border-r border-gray-600 p-4"> {/* Adjusted border color */}
                <div className="flex justify-end mb-4">
                  <h2 className="text-xl font-semibold text-epii-neon">Epii Analysis</h2> {/* Moved to right side */}
                </div>

                {/* Status Message Display */}
                {statusMessage && (
                  <div className={`mb-3 p-2 rounded text-sm flex items-center gap-2 ${
                    statusMessage.type === 'success' ? 'bg-green-900/50 text-green-300' :
                    statusMessage.type === 'error' ? 'bg-red-900/50 text-red-300' :
                    'bg-blue-900/50 text-blue-300'
                  }`}>
                    {statusMessage.type === 'success' && <CheckCircle size={16} />}
                    {statusMessage.type === 'error' && <AlertTriangle size={16} />}
                    {statusMessage.type === 'info' && <Info size={16} />}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                {/* Epii Chat Component */}
                <EpiiChat
                  userId="admin"
                />
              </div>

              {/* Right Pane: Document Canvas */}
              <div className="w-2/3 flex flex-col p-4">
                {/* Metadata Display - Compact with scrollbar */}
                <div className="mb-2 p-2 border border-gray-600 rounded bg-gray-800/50 text-gray-300 text-sm max-h-24 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-epii-neon">Context</h3>
                    {currentDocument?.bimbaCoordinate ? (
                      <span className="text-xs bg-epii-dark text-epii-neon px-2 py-0.5 rounded-md">
                        {currentDocument.bimbaCoordinate}
                      </span>
                    ) : (
                      <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-md">
                        #
                      </span>
                    )}
                  </div>
                  {currentDocument ? (
                    <div className="text-xs space-y-0.5 mt-1">
                      <p><strong>Document:</strong> {metadata.sourceDocName}</p>
                      <p><strong>Notion:</strong> <a href={metadata.notionPageUrl} target="_blank" rel="noopener noreferrer" className="text-epii-link hover:underline">{metadata.notionPageUrl.split('/').pop() || 'N/A'}</a></p>
                      <p><strong>Modified:</strong> {formatDate(lastUpdateTimestamps.notion)}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">No document loaded. Upload a document to begin analysis.</p>
                  )}
                </div>

                {/* Document Canvas - More vertical space */}
                <div className="flex-grow">
                  <DocumentCanvas
                    userId="admin"
                    onDocumentDeleted={(documentId, coordinate) => {
                      console.log(`Document ${documentId} deleted with coordinate ${coordinate}, refreshing...`);

                      // Refresh the coordinate's documents if a coordinate was provided
                      if (coordinate) {
                        refreshCoordinateDocuments(coordinate);
                      }

                      // Open sidebar to show updated list
                      setTimeout(() => {
                        setSidebarOpen(true);
                      }, 500);
                    }}
                  />
                </div>

                {/* Related Coordinates Section (Only shows if payload loaded) */}
                {originalPayload && relatedCoordinates.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-600">
                    <h4 className="text-sm font-semibold mb-2 text-epii-neon">Related Coordinates</h4>
                    <div className="flex flex-wrap gap-2">
                      {relatedCoordinates.map(coord => (
                        <Button
                          key={coord}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300"
                          onClick={() => handleOpenRelatedCoordinate(coord)}
                        >
                          {coord}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div> {/* End Main Content Area */}
          </div> {/* End Main Flex */}
        </div> {/* End Container */}

        {/* Bimba Update Overlay */}
        <BimbaUpdateOverlay
          isOpen={bimbaUpdateOpen}
          onClose={() => setBimbaUpdateOpen(false)}
        />
      </div> {/* End Page Wrapper */}
    </PageTransition>
  );
};

const EpiiModePage: React.FC = () => {
  return (
    <EpiiProvider>
      <EpiiModeContent />
    </EpiiProvider>
  );
};

export default EpiiModePage;
