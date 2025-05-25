/**
 * Crystallise to Notion Overlay Component
 * Simple review overlay showing document name, target coordinate, and resolved Notion page link
 * Bimba Coordinate: #5-3-4.5-3-4
 */

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, FileText, AlertCircle } from 'lucide-react';
import StructuredBlockViewer from './StructuredBlockViewer';
import { NotionUpdatePayload } from '../0_foundation/epiiTypes';

interface CrystalliseToNotionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedPayload?: any) => void;
  documentName: string;
  targetCoordinate: string;
  isLoading?: boolean;
  notionUpdatePayload?: NotionUpdatePayload | null;
}

const CrystalliseToNotionOverlay: React.FC<CrystalliseToNotionOverlayProps> = ({
  isOpen,
  onClose,
  onConfirm,
  documentName,
  targetCoordinate,
  isLoading = false,
  notionUpdatePayload = null
}) => {
  const [notionPageUrl, setNotionPageUrl] = useState<string | null>(null);
  const [isResolvingCoordinate, setIsResolvingCoordinate] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // SYNC FEATURE DEFERRED: Debug logging removed for performance
  // TODO: Re-enable when sync feature is implemented

  // Resolve coordinate to Notion page URL when overlay opens
  useEffect(() => {
    if (isOpen && targetCoordinate && targetCoordinate.trim() !== '') {
      resolveCoordinateToNotionUrl();
    }
  }, [isOpen, targetCoordinate]);

  const resolveCoordinateToNotionUrl = async () => {
    setIsResolvingCoordinate(true);
    setResolveError(null);
    setNotionPageUrl(null);

    try {
      console.log(`Resolving coordinate ${targetCoordinate} to Notion page URL...`);

      // Call the BPMCP resolveBimbaCoordinate tool via the backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/bpmcp/resolveBimbaCoordinate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetCoordinate }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Parse the result from the BPMCP tool
      let parsedResult;
      if (typeof result === 'string') {
        parsedResult = JSON.parse(result);
      } else if (result.content && result.content[0] && result.content[0].text) {
        parsedResult = JSON.parse(result.content[0].text);
      } else {
        parsedResult = result;
      }

      if (parsedResult.notionPageUrl) {
        setNotionPageUrl(parsedResult.notionPageUrl);
        console.log(`Successfully resolved ${targetCoordinate} -> ${parsedResult.notionPageUrl}`);
      } else {
        throw new Error('No Notion page URL found in response');
      }
    } catch (error) {
      console.error('Error resolving coordinate to Notion URL:', error);
      setResolveError('Failed to resolve coordinate to Notion page. The coordinate may not have an associated Notion page.');
    } finally {
      setIsResolvingCoordinate(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-epii-darker border border-epii-dark rounded-lg w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-epii-dark flex items-center justify-between bg-epii-dark/50">
          <h2 className="text-lg font-medium flex items-center">
            <FileText size={18} className="mr-2 text-epii-neon" />
            Crystallise to Notion
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-epii-dark rounded-md transition-all"
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Document Name */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Document</h3>
            <p className="text-white bg-epii-dark px-3 py-2 rounded-md">{documentName}</p>
          </div>

          {/* Target Coordinate */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Target Coordinate</h3>
            <p className="text-epii-neon bg-epii-dark px-3 py-2 rounded-md font-mono">{targetCoordinate}</p>
          </div>

          {/* Notion Page Link */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Notion Page</h3>
            {isResolvingCoordinate ? (
              <div className="bg-epii-dark px-3 py-2 rounded-md flex items-center">
                <Loader2 size={16} className="animate-spin mr-2" />
                <span className="text-gray-400">Resolving coordinate...</span>
              </div>
            ) : resolveError ? (
              <div className="bg-red-900/50 border border-red-800 px-3 py-2 rounded-md flex items-center">
                <AlertCircle size={16} className="text-red-400 mr-2 flex-shrink-0" />
                <span className="text-red-300 text-sm">{resolveError}</span>
              </div>
            ) : notionPageUrl ? (
              <a
                href={notionPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-epii-dark px-3 py-2 rounded-md flex items-center hover:bg-epii-dark/80 transition-colors"
              >
                <ExternalLink size={16} className="text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm truncate">{notionPageUrl}</span>
              </a>
            ) : (
              <div className="bg-epii-dark px-3 py-2 rounded-md">
                <span className="text-gray-400 text-sm">No Notion page found</span>
              </div>
            )}
          </div>

          {/* Structured Block Viewer */}
          {notionUpdatePayload && (
            <StructuredBlockViewer
              payload={notionUpdatePayload}
              className="mt-4"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-epii-dark flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              // Pass the resolved Notion page URL to avoid another resolve call
              onConfirm({
                targetCoordinate,
                notionPageUrl: notionPageUrl || undefined
              });
            }}
            disabled={isLoading || isResolvingCoordinate || !!resolveError}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
              isLoading || isResolvingCoordinate || !!resolveError
                ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Crystallising...</span>
              </>
            ) : (
              <>
                <ExternalLink size={16} />
                <span>Crystallise to Notion</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrystalliseToNotionOverlay;
