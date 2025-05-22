import React from 'react';
import PageTransition from "../components/layout/PageTransition";
import GeometricBackground from "../components/ui/GeometricBackground";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import DocumentCanvas from "../components/DocumentCanvas";

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


const EpiiChatPage = () => {
  // Sample metadata for display
  const metadata = {
    bimbaCoordinate: "#5-2-1",
    notionPageUrl: "https://www.notion.so/example-page",
    sourceDocName: "Example Document",
  };

  // Sample state values
  const isAnalyzing = false;
  const statusMessage = null;
  const lastUpdateTimestamps = { notion: new Date(2023, 5, 15), bimba: new Date(2023, 5, 16) };

  // Sample related coordinates
  const relatedCoordinates = ["#5-2-0", "#5-2-2", "#4-1-0"];

  // Sample payload
  const originalPayload = {
    sourceDocument: { type: "NotionPage", id: "example-id" },
    analysisSummary: "Example analysis summary",
    proposedUpdates: []
  } as NotionUpdatePayload;

  // Function to handle opening related coordinate
  const handleOpenRelatedCoordinate = (coordinate: string) => {
    console.log("Opening related coordinate:", coordinate);
    // This would normally update state, but we're using static data for now
    alert(`Loading context for ${coordinate}...`);
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
          <div className="flex h-full gap-4"> {/* Match Chat.tsx main flex */}

            {/* Chat Sidebar - Pass load draft handler */}
            <ChatSidebar
              // TODO: Pass handleLoadDraft properly if sidebar structure allows
              // onLoadDraft={handleLoadDraft}
            />

            {/* Main Content Area (Combined Chat + Canvas) */}
            <div className="flex-grow flex bg-epii-dark/40 neo-glow rounded-lg overflow-hidden"> {/* Match Chat.tsx styling */}

              {/* Left Pane: Chat Interaction */}
              <div className="w-1/3 flex flex-col border-r border-gray-600 p-4"> {/* Adjusted border color */}
                <h2 className="text-xl font-semibold mb-4 text-epii-neon">Epii Analysis</h2> {/* Adjusted title & color */}

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

                <div className="flex-grow overflow-y-auto mb-4 p-2"> {/* Removed extra border */}
                  {/* Mock message display */}
                  <div className="mb-2 p-2 rounded bg-gray-700 text-gray-300 self-start text-sm">Upload a document to the canvas to begin analysis...</div>
                </div>
                {/* Simple placeholder for chat input */}
                <div className="mt-auto">
                   <textarea
                      className={`w-full p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-gray-200 placeholder-gray-500 focus:ring-epii-neon focus:border-epii-neon ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      rows={3}
                      placeholder="Enter message or context to trigger Epii analysis..."
                      disabled={isAnalyzing}
                   ></textarea>
                   <Button
                      className={`w-full bg-epii-purple text-white p-2 rounded hover:bg-epii-purple-dark transition-colors duration-200 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isAnalyzing}
                   >
                      {isAnalyzing ? 'Analyzing...' : 'Send & Analyze'}
                   </Button>
                </div>
                {/* OR Replace above with a dedicated ChatInterface component */}
                {/* <ChatInterface messages={chatMessages} onSendMessage={handleSendMessage} /> */}
              </div>

              {/* Right Pane: Document Canvas */}
              <div className="w-2/3 flex flex-col p-4">
                {/* Metadata Display */}
                <div className="mb-4 p-3 border border-gray-600 rounded bg-gray-800/50 text-gray-300 text-sm">
                  <h3 className="text-base font-semibold mb-2 text-epii-neon">Context</h3>
                  {metadata.bimbaCoordinate ? (
                    <div className="space-y-1">
                      <p><strong>Bimba Coordinate:</strong> {metadata.bimbaCoordinate}</p>
                      <p><strong>Notion Page:</strong> <a href={metadata.notionPageUrl} target="_blank" rel="noopener noreferrer" className="text-epii-link hover:underline break-all">{metadata.notionPageUrl || 'N/A'}</a></p>
                      <p><strong>Source Document:</strong> {metadata.sourceDocName || 'N/A'}</p>
                      <p><strong>Last Notion Update:</strong> {formatDate(lastUpdateTimestamps.notion)}</p>
                      <p><strong>Last Bimba Sync:</strong> {formatDate(lastUpdateTimestamps.bimba)}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No analysis context loaded.</p>
                  )}
                </div>

                {/* Document Canvas */}
                <div className="flex-grow">
                  <DocumentCanvas userId="admin" />
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
      </div> {/* End Page Wrapper */}
    </PageTransition>
  );
};

export default EpiiChatPage;
