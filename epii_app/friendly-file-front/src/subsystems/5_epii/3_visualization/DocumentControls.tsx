/**
 * Controls for document analysis and Notion integration
 * Bimba Coordinate: #5-3-4.5-3-2
 */

import React, { useState, useEffect } from 'react';
import { Play, Loader2, Sparkles, ChevronDown, ChevronUp, FileText, ExternalLink, X } from 'lucide-react';
import { AnalysisResults } from '../0_foundation/epiiTypes';
import { formatBimbaCoordinate } from '../1_utils/epiiFormatters';
import { isValidBimbaCoordinate } from '../1_utils/epiiHelpers';

interface DocumentControlsProps {
  onStartAnalysis: (targetCoordinate: string) => void;
  onCrystallize?: (results: AnalysisResults) => void;
  onPreviewNotionUpdate?: () => void;
  onSendToNotion?: () => void;
  onClose?: () => void;
  isAnalyzing?: boolean;
  isSendingToNotion?: boolean;
  analysisResults?: AnalysisResults | null;
  defaultCoordinate?: string;
  documentType: 'bimba' | 'pratibimba';
  documentStatus?: string;
  notionPageUrl?: string;
}

const DocumentControls: React.FC<DocumentControlsProps> = ({
  onStartAnalysis,
  onCrystallize,
  onPreviewNotionUpdate,
  onSendToNotion,
  onClose,
  isAnalyzing = false,
  isSendingToNotion = false,
  analysisResults = null,
  defaultCoordinate = '#5-2-1',
  documentType,
  documentStatus = 'draft',
  notionPageUrl
}) => {
  const [targetCoordinate, setTargetCoordinate] = useState(defaultCoordinate);
  const [isCoordinateValid, setIsCoordinateValid] = useState(true);

  // Update target coordinate when default changes
  useEffect(() => {
    if (defaultCoordinate && defaultCoordinate !== targetCoordinate) {
      setTargetCoordinate(defaultCoordinate);
      setIsCoordinateValid(isValidBimbaCoordinate(defaultCoordinate));
    }
  }, [defaultCoordinate]);

  // Handle coordinate change
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetCoordinate(value);
    setIsCoordinateValid(isValidBimbaCoordinate(value));
  };

  // Handle coordinate selection
  const handleCoordinateSelect = (value: string) => {
    setTargetCoordinate(value);
    setIsCoordinateValid(true);
  };

  // Handle start analysis
  const handleStartAnalysis = () => {
    if (isCoordinateValid && !isAnalyzing) {
      onStartAnalysis(targetCoordinate);
    }
  };

  // Handle crystallize
  const handleCrystallize = () => {
    if (analysisResults && onCrystallize) {
      onCrystallize(analysisResults);
    }
  };

  // Handle preview Notion update
  const handlePreviewNotionUpdate = () => {
    if (onPreviewNotionUpdate) {
      onPreviewNotionUpdate();
    }
  };

  // Handle send to Notion
  const handleSendToNotion = () => {
    if (onSendToNotion) {
      onSendToNotion();
    }
  };

  // Determine if controls should be shown based on document type and status
  const showAnalysisControls = documentType === 'bimba';

  // Check for analysis results in both possible locations
  const hasAnalysisResults = analysisResults &&
    (analysisResults.extractedMappings ||
     analysisResults.notionUpdatePayload ||
     (analysisResults.analysisResults &&
      (analysisResults.analysisResults.extractedMappings ||
       analysisResults.analysisResults.notionUpdatePayload)));

  const showCrystallizeButton = documentType === 'bimba' && hasAnalysisResults;
  const showNotionPreviewButton = documentType === 'pratibimba' && documentStatus !== 'sent_to_notion';
  const showSendToNotionButton = documentType === 'pratibimba' && (documentStatus === 'ready_for_notion' || documentStatus === 'analyzed');
  const showNotionLink = documentType === 'pratibimba' && documentStatus === 'sent_to_notion' && notionPageUrl;

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between border-b border-epii-dark">
        <h3 className="font-medium text-lg">
          {documentType === 'bimba' ? 'Analysis Controls' : 'Notion Integration'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-epii-dark rounded-md transition-all"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-3 space-y-4 flex-grow overflow-auto">
        {/* Document coordinate indicator */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Bimba Coordinate:</span>
            <span className="text-sm font-medium bg-epii-dark px-2 py-1 rounded">
              {formatBimbaCoordinate(targetCoordinate)}
            </span>
          </div>

          {/* Document status indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Status:</span>
            <span className={`text-sm px-2 py-0.5 rounded-full ${
              documentStatus === 'draft' ? 'bg-gray-600 text-gray-200' :
              documentStatus === 'analyzed' ? 'bg-blue-600 text-blue-100' :
              documentStatus === 'ready_for_notion' ? 'bg-yellow-600 text-yellow-100' :
              documentStatus === 'sent_to_notion' ? 'bg-green-600 text-green-100' :
              'bg-gray-600 text-gray-200'
            }`}>
              {documentStatus === 'draft' ? 'Draft' :
               documentStatus === 'analyzed' ? 'Analyzed' :
               documentStatus === 'ready_for_notion' ? 'Ready for Notion' :
               documentStatus === 'sent_to_notion' ? 'Sent to Notion' :
               'Unknown'}
            </span>
          </div>
        </div>

        {/* Related coordinates section */}
        {analysisResults?.notionUpdatePayload?.relatedCoordinates && analysisResults.notionUpdatePayload.relatedCoordinates.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Related Coordinates:</h4>
            <div className="flex flex-wrap gap-2">
              {analysisResults.notionUpdatePayload.relatedCoordinates.map((coord, index) => (
                <span key={index} className="text-xs bg-epii-dark px-2 py-1 rounded">
                  {formatBimbaCoordinate(coord)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Raw document controls */}
        {showAnalysisControls && (
          <>
            {/* Analysis action button */}
            <div className="pt-2">
              <button
                onClick={handleStartAnalysis}
                disabled={!isCoordinateValid || isAnalyzing}
                className={`w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 ${
                  !isCoordinateValid || isAnalyzing
                    ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                    : 'bg-epii-neon text-black hover:bg-epii-neon/80'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Analyzing Document</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
              <p className="text-xs text-center mt-1 text-gray-400">
                Analysis will use coordinate: {formatBimbaCoordinate(targetCoordinate)}
              </p>
            </div>

            {/* Crystallize button (only shown when results are available) */}
            {showCrystallizeButton && (
              <div className="pt-2">
                <button
                  onClick={handleCrystallize}
                  disabled={isAnalyzing}
                  className={`w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 ${
                    isAnalyzing
                      ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <Sparkles size={18} />
                  <span>Crystallize Results</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Crystallization document controls */}
        {documentType === 'pratibimba' && (
          <div className="space-y-4">
            {/* Preview Notion Update button */}
            {showNotionPreviewButton && (
              <button
                onClick={handlePreviewNotionUpdate}
                className="w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <FileText size={18} />
                <span>Preview Notion Update</span>
              </button>
            )}

            {/* Send to Notion button */}
            {showSendToNotionButton && (
              <button
                onClick={handleSendToNotion}
                disabled={isSendingToNotion}
                className={`w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 ${
                  isSendingToNotion
                    ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSendingToNotion ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending to Notion...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink size={18} />
                    <span>Send to Notion</span>
                  </>
                )}
              </button>
            )}

            {/* Notion link */}
            {showNotionLink && (
              <div className="pt-2">
                <a
                  href={notionPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 bg-gray-600 text-white hover:bg-gray-700"
                >
                  <ExternalLink size={18} />
                  <span>View in Notion</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentControls;
