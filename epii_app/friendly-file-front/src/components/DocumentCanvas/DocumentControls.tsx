import React, { useState } from 'react';
import { Play, Loader, ChevronDown, ChevronUp } from 'lucide-react';

interface DocumentControlsProps {
  targetCoordinate: string;
  onTargetCoordinateChange: (value: string) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
  analysisResults: any;
}

const DocumentControls: React.FC<DocumentControlsProps> = ({
  targetCoordinate,
  onTargetCoordinateChange,
  onStartAnalysis,
  isAnalyzing,
  analysisResults
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Handle target coordinate change
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTargetCoordinateChange(e.target.value);
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Toggle results view
  const toggleResults = () => {
    setShowResults(!showResults);
  };
  
  return (
    <div className="border-b border-epii-dark">
      {/* Header */}
      <div 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-epii-dark/30 transition-colors"
        onClick={toggleExpanded}
      >
        <h3 className="font-medium">Analysis Controls</h3>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {/* Expanded controls */}
      {isExpanded && (
        <div className="p-3 space-y-3 border-t border-epii-dark/50">
          {/* Target coordinate input */}
          <div>
            <label htmlFor="target-coordinate" className="block text-sm mb-1">
              Target Bimba Coordinate
            </label>
            <input
              id="target-coordinate"
              type="text"
              value={targetCoordinate}
              onChange={handleTargetChange}
              placeholder="e.g., #5-2-3"
              className="w-full bg-epii-dark text-white p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-epii-neon"
            />
            <p className="text-xs text-gray-400 mt-1">
              Specify where this document should be analyzed in the Bimba structure
            </p>
          </div>
          
          {/* Analysis button */}
          <button
            onClick={onStartAnalysis}
            disabled={!targetCoordinate || isAnalyzing}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-md transition-all ${
              !targetCoordinate || isAnalyzing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-epii-neon text-epii-darker hover:brightness-110'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play size={18} />
                Start Analysis
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Analysis results (if available) */}
      {analysisResults && (
        <div className="border-t border-epii-dark/50">
          <div 
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-epii-dark/30 transition-colors"
            onClick={toggleResults}
          >
            <h3 className="font-medium text-epii-neon">Analysis Results</h3>
            {showResults ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {showResults && (
            <div className="p-3 space-y-3 border-t border-epii-dark/50 max-h-64 overflow-y-auto">
              {/* Mappings */}
              {analysisResults.extractedMappings && analysisResults.extractedMappings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Extracted Mappings</h4>
                  <div className="space-y-2">
                    {analysisResults.extractedMappings.slice(0, 3).map((mapping: any, index: number) => (
                      <div key={index} className="bg-epii-dark p-2 rounded-md text-xs">
                        <div className="flex justify-between">
                          <span className="text-epii-neon">{mapping.mappingType}</span>
                          <span className="text-gray-400">{mapping.mappingValue}</span>
                        </div>
                        <p className="mt-1 text-gray-300">{mapping.reasoning?.substring(0, 100)}...</p>
                      </div>
                    ))}
                    {analysisResults.extractedMappings.length > 3 && (
                      <p className="text-xs text-gray-400">
                        +{analysisResults.extractedMappings.length - 3} more mappings
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Variations */}
              {analysisResults.identifiedVariations && analysisResults.identifiedVariations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Identified Variations</h4>
                  <div className="space-y-2">
                    {analysisResults.identifiedVariations.slice(0, 2).map((variation: any, index: number) => (
                      <div key={index} className="bg-epii-dark p-2 rounded-md text-xs">
                        <div className="flex justify-between">
                          <span className="text-epii-neon">{variation.variationType}</span>
                          <span className="text-gray-400">{variation.status}</span>
                        </div>
                        <p className="mt-1 text-gray-300">{variation.variationText?.substring(0, 100)}...</p>
                      </div>
                    ))}
                    {analysisResults.identifiedVariations.length > 2 && (
                      <p className="text-xs text-gray-400">
                        +{analysisResults.identifiedVariations.length - 2} more variations
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Summary */}
              {analysisResults.overallSummary && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-xs text-gray-300 bg-epii-dark p-2 rounded-md">
                    {analysisResults.overallSummary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentControls;
