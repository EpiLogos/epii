/**
 * Visualization of analysis results
 * Bimba Coordinate: #5-3-4.5-3-3
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { AnalysisResults, AnalysisMapping, AnalysisVariation } from '../0_foundation/epiiTypes';
import { formatBimbaCoordinate } from '../1_utils/epiiFormatters';

interface AnalysisVisualizerProps {
  results: AnalysisResults;
  onClose?: () => void;
}

const AnalysisVisualizer: React.FC<AnalysisVisualizerProps> = ({
  results,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mappings: true,
    variations: true,
    summary: true
  });
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Check if results are empty
  const isEmpty = 
    (!results.extractedMappings || results.extractedMappings.length === 0) &&
    (!results.identifiedVariations || results.identifiedVariations.length === 0) &&
    !results.overallSummary;
  
  if (isEmpty) {
    return (
      <div className="p-4 bg-epii-darker rounded-lg border border-epii-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Analysis Results</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-epii-dark rounded-md transition-all"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <p className="text-gray-400">No analysis results available.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-epii-darker rounded-lg border border-epii-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Analysis Results</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-epii-dark rounded-md transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Extracted Mappings */}
      {results.extractedMappings && results.extractedMappings.length > 0 && (
        <div className="mb-4">
          <div 
            className="flex items-center justify-between p-2 bg-epii-dark rounded-md cursor-pointer"
            onClick={() => toggleSection('mappings')}
          >
            <h4 className="font-medium">Extracted Mappings</h4>
            {expandedSections.mappings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.mappings && (
            <div className="mt-2 space-y-3 pl-2">
              {results.extractedMappings.map((mapping: AnalysisMapping, index: number) => (
                <div key={index} className="p-2 bg-epii-dark/50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{mapping.mappingType}</span>
                    <span className="text-epii-neon">{formatBimbaCoordinate(mapping.mappingValue)}</span>
                  </div>
                  {mapping.reasoning && (
                    <p className="mt-1 text-sm text-gray-400">{mapping.reasoning}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Identified Variations */}
      {results.identifiedVariations && results.identifiedVariations.length > 0 && (
        <div className="mb-4">
          <div 
            className="flex items-center justify-between p-2 bg-epii-dark rounded-md cursor-pointer"
            onClick={() => toggleSection('variations')}
          >
            <h4 className="font-medium">Identified Variations</h4>
            {expandedSections.variations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.variations && (
            <div className="mt-2 space-y-3 pl-2">
              {results.identifiedVariations.map((variation: AnalysisVariation, index: number) => (
                <div key={index} className="p-2 bg-epii-dark/50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{variation.variationType}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      variation.status === 'confirmed' 
                        ? 'bg-green-900/50 text-green-200' 
                        : variation.status === 'rejected'
                          ? 'bg-red-900/50 text-red-200'
                          : 'bg-yellow-900/50 text-yellow-200'
                    }`}>
                      {variation.status}
                    </span>
                  </div>
                  {variation.variationText && (
                    <p className="mt-1 text-sm text-gray-400">{variation.variationText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Overall Summary */}
      {results.overallSummary && (
        <div>
          <div 
            className="flex items-center justify-between p-2 bg-epii-dark rounded-md cursor-pointer"
            onClick={() => toggleSection('summary')}
          >
            <h4 className="font-medium">Overall Summary</h4>
            {expandedSections.summary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.summary && (
            <div className="mt-2 p-3 bg-epii-dark/50 rounded-md">
              <p className="text-gray-300">{results.overallSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisVisualizer;
