
import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios for API calls
import { X, Maximize2, Minimize2, Download, Link, Image as ImageIcon, FileText, Loader2 } from "lucide-react"; // Added icons
import { Message } from "../../5_integration/Chat";
// Import NodeGraphData type along with the component
import { NodeGraphVisualizer, NodeGraphData } from "./visualizers/NodeGraphVisualizer";
import { DocumentVisualizer } from "./visualizers/DocumentVisualizer";

interface DataVisualizerProps {
  visualData: Message["visualData"] | null;
  displayCoordinate: string | null; // Add prop for the selected coordinate
}

// Define a type for the fetched Notion properties
interface NotionProperties {
    title: string | null;
    contentBody: string | null;
    visualEncapsulationUrl: string | null;
    pageUrl: string | null;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ visualData, displayCoordinate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notionProps, setNotionProps] = useState<NotionProperties | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch Notion data when displayCoordinate changes
  useEffect(() => {
    if (displayCoordinate) {
      const fetchNotionData = async () => {
        setIsLoading(true);
        setError(null);
        setNotionProps(null); // Reset previous data
        console.log(`DataVisualizer: Fetching Notion data for coordinate: ${displayCoordinate}`);
        try {
          // Use the correct backend API endpoint URL
          const apiUrl = `/api/notion-content/${encodeURIComponent(displayCoordinate)}`;
          const response = await axios.get<NotionProperties>(apiUrl);
          console.log("Notion API Response Data:", response.data);
          setNotionProps(response.data);
        } catch (err: unknown) { // Use unknown instead of any
          console.error("Error fetching Notion data:", err);
          // Type check before accessing properties
          let errorMessage = "Failed to fetch Notion content.";
          if (axios.isAxiosError(err) && err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          setError(errorMessage);
          setNotionProps(null); // Clear data on error
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotionData();
    } else {
      // Reset state if displayCoordinate is null
      setNotionProps(null);
      setError(null);
      setIsLoading(false);
    }
  }, [displayCoordinate]); // Dependency array ensures this runs when coordinate changes

  // --- Render Logic ---

  // 1. If specific visualData is provided, render it
  if (visualData) {
    return (
      <div className={`bg-epii-dark/40 neo-glow rounded-lg overflow-hidden flex flex-col ${
        isExpanded ? 'absolute inset-24 z-10' : 'w-96 hidden md:flex'
      }`}>
        {/* Header (same as before) */}
        <div className="p-4 border-b border-epii-neon/10 flex justify-between items-center">
          <div className="text-epii-neon font-light">
            {visualData.type === 'graph' && 'Knowledge Graph'}
            {visualData.type === 'document' && 'Document View'}
            {visualData.type === 'image' && 'Image Visualization'}
            {visualData.type === 'code' && 'Code Example'}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:bg-epii-neon/10 rounded"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button className="p-1 hover:bg-epii-neon/10 rounded">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Content (same as before) */}
        <div className="flex-grow overflow-auto p-4">
          {visualData.type === 'graph' && <NodeGraphVisualizer data={visualData.data as NodeGraphData} />}
          {visualData.type === 'document' && <DocumentVisualizer data={visualData.data} />}
          {visualData.type === 'image' && (
            <div className="flex items-center justify-center h-full">
              <img
                src={(visualData.data as { src: string }).src}
                alt={(visualData.data as { alt?: string }).alt || "Visualization"}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          {visualData.type === 'code' && (
            <div className="bg-epii-darker/80 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre>{(visualData.data as { code: string }).code}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. If no visualData, render Notion content based on displayCoordinate fetch status
  return (
    <div className={`bg-epii-dark/40 neo-glow rounded-lg overflow-hidden flex flex-col ${
      isExpanded ? 'absolute inset-24 z-10' : 'w-96 hidden md:flex'
    }`}>
      {/* Header - Simplified for Notion view */}
      <div className="p-4 border-b border-epii-neon/10 flex justify-between items-center">
        <div className="text-epii-neon font-light">
          {notionProps?.title ? `Notion: ${notionProps.title}` : 'Notion Context'}
        </div>
        <div className="flex items-center gap-2">
           {/* Optionally add expand/download if relevant for this view */}
           {notionProps?.pageUrl && (
             <a href={notionProps.pageUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-epii-neon/10 rounded" title="Open in Notion">
               <Link size={18} />
             </a>
           )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-auto p-4 flex flex-col gap-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-foreground/60">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading Notion Content...
          </div>
        )}
        {error && (
          <div className="text-red-500 p-4 bg-red-900/20 rounded">
            Error: {error}
          </div>
        )}
        {!isLoading && !error && notionProps && (
          <>
            {/* Textual Content Area */}
            <div className="flex-1 bg-epii-darker/50 rounded p-3 overflow-auto min-h-[150px]">
              <h3 className="text-epii-neon/80 text-sm mb-2 flex items-center gap-1"><FileText size={16}/> Content Body</h3>
              <p className="text-foreground/80 text-sm whitespace-pre-wrap">
                {notionProps.contentBody || <span className="text-foreground/50 italic">No content body property found.</span>}
              </p>
            </div>
            {/* Visual Content Area */}
            <div className="flex-1 bg-epii-darker/50 rounded p-3 overflow-auto min-h-[150px] flex items-center justify-center">
               <h3 className="text-epii-neon/80 text-sm mb-2 absolute top-2 left-2 flex items-center gap-1"><ImageIcon size={16}/> Visual Encapsulation</h3>
              {notionProps.visualEncapsulationUrl ? (
                <img
                  src={notionProps.visualEncapsulationUrl}
                  alt={notionProps.title || 'Visual Encapsulation'}
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <p className="text-foreground/50 italic text-sm">No visual encapsulation found.</p>
              )}
            </div>
          </>
        )}
         {!isLoading && !error && !notionProps && (
             <div className="text-center p-4 flex-grow flex items-center justify-center">
                <p className="text-foreground/60 text-sm">
                    No relevant Notion context to display.
                </p>
            </div>
         )}
      </div>
    </div>
  );
};
