/**
 * Analysis Results Panel Component
 * Displays the results of document analysis
 * Bimba Coordinate: #5-3-4.5-3-4
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { AnalysisResults } from '../0_foundation/epiiTypes';
import { formatBimbaCoordinate } from '../1_utils/epiiFormatters';

interface AnalysisResultsPanelProps {
  analysisResults: AnalysisResults;
  onCrystallize: () => void;
  isOpen?: boolean;
}

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({
  analysisResults,
  onCrystallize,
  isOpen: initialIsOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  // Handle both possible locations for analysis results
  let extractedMappings = [];
  let identifiedVariations = [];
  let overallSummary = '';
  let notionUpdatePayload = null;

  // Check if results are directly in analysisResults
  if (analysisResults.extractedMappings) {
    extractedMappings = analysisResults.extractedMappings;
  }

  if (analysisResults.identifiedVariations) {
    identifiedVariations = analysisResults.identifiedVariations;
  }

  if (analysisResults.overallSummary) {
    overallSummary = analysisResults.overallSummary;
  }

  if (analysisResults.notionUpdatePayload) {
    notionUpdatePayload = analysisResults.notionUpdatePayload;
  }

  // Check if results are in analysisResults.analysisResults
  if (analysisResults.analysisResults) {
    if (analysisResults.analysisResults.extractedMappings) {
      extractedMappings = analysisResults.analysisResults.extractedMappings;
    }

    if (analysisResults.analysisResults.identifiedVariations) {
      identifiedVariations = analysisResults.analysisResults.identifiedVariations;
    }

    if (analysisResults.analysisResults.overallSummary) {
      overallSummary = analysisResults.analysisResults.overallSummary;
    }

    if (analysisResults.analysisResults.notionUpdatePayload) {
      notionUpdatePayload = analysisResults.analysisResults.notionUpdatePayload;
    }
  }

  // If notionUpdatePayload is directly in metadata, use it
  if (!notionUpdatePayload && analysisResults.notionUpdatePayload) {
    notionUpdatePayload = analysisResults.notionUpdatePayload;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
          {/* Overall Summary */}
          {overallSummary && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Overall Summary</h4>
              <p className="text-sm bg-epii-dark p-3 rounded-md">{overallSummary}</p>
            </div>
          )}

          {/* Extracted Mappings */}
          {extractedMappings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Extracted Mappings</h4>
              <div className="space-y-2">
                {extractedMappings.map((mapping, index) => (
                  <div key={index} className="bg-epii-dark p-3 rounded-md">
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded mr-2">
                        {mapping.mappingType}
                      </span>
                      <span className="text-sm font-medium">{mapping.mappingValue}</span>
                    </div>
                    {mapping.reasoning && (
                      <p className="text-xs text-gray-400">{mapping.reasoning}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Identified Variations */}
          {identifiedVariations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Identified Variations</h4>
              <div className="space-y-2">
                {identifiedVariations.map((variation, index) => (
                  <div key={index} className="bg-epii-dark p-3 rounded-md">
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded mr-2">
                        {variation.variationType}
                      </span>
                      <span className="text-xs font-medium bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                        {variation.status}
                      </span>
                    </div>
                    {variation.variationText && (
                      <p className="text-sm mt-1">{variation.variationText}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Coordinates */}
          {notionUpdatePayload?.relatedCoordinates && notionUpdatePayload.relatedCoordinates.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Related Coordinates</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {notionUpdatePayload.relatedCoordinates.map((coordinate, index) => (
                  <span key={index} className="bg-epii-dark text-xs px-2 py-1 rounded-md">
                    {formatBimbaCoordinate(coordinate)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notion Update Preview */}
          {notionUpdatePayload && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Notion Update Preview</h4>
              <div className="bg-epii-dark p-3 rounded-md">
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-400">Target Coordinate:</span>
                  <span className="ml-2 text-sm">{notionUpdatePayload.targetCoordinate || 'Not specified'}</span>
                </div>
                {notionUpdatePayload.title && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-400">Title:</span>
                    <span className="ml-2 text-sm">{notionUpdatePayload.title}</span>
                  </div>
                )}
                {notionUpdatePayload.content && (
                  <div>
                    <span className="text-xs font-medium text-gray-400 block mb-1">Content Preview:</span>
                    <div className="text-sm bg-epii-darker p-2 rounded-md max-h-[100px] overflow-auto">
                      {typeof notionUpdatePayload.content === 'string'
                        ? (notionUpdatePayload.content.substring(0, 200) +
                           (notionUpdatePayload.content.length > 200 ? '...' : ''))
                        : 'Content is not in text format'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AnalysisResultsPanel;
