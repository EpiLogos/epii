/**
 * Controls for document analysis and Notion integration
 * Bimba Coordinate: #5-3-4.5-3-2
 */

import React, { useState, useEffect } from 'react';
import { Play, Loader2, Sparkles, ChevronDown, ChevronUp, FileText, ExternalLink, X, Map, CheckCircle } from 'lucide-react';
import { AnalysisResults } from '../0_foundation/epiiTypes';
import { formatBimbaCoordinate } from '../1_utils/epiiFormatters';
import { isValidBimbaCoordinate } from '../1_utils/epiiHelpers';
import { onAGUIEvent, offAGUIEvent } from '../1_services/webSocketService';

interface DocumentControlsProps {
  onStartAnalysis: (targetCoordinate: string) => void;
  onCrystallize?: (results: AnalysisResults) => void;
  onCrystalliseToNotion?: () => void;
  onOpenBimbaUpdate?: (coordinate: string) => void;
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
  onCrystalliseToNotion,
  onOpenBimbaUpdate,
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

  // AG-UI Progress state
  const [analysisProgress, setAnalysisProgress] = useState<{
    stage: string;
    progress: number;
    currentStep: string;
    stageId?: string;
    currentStageNumber?: number;
    totalStages?: number;
  } | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);

  // Update target coordinate when default changes
  useEffect(() => {
    if (defaultCoordinate && defaultCoordinate !== targetCoordinate) {
      console.log(`DocumentControls: Setting target coordinate from defaultCoordinate: ${defaultCoordinate}`);
      setTargetCoordinate(defaultCoordinate);
      setIsCoordinateValid(isValidBimbaCoordinate(defaultCoordinate));
    }
  }, [defaultCoordinate, targetCoordinate]);

  // Initialize target coordinate on mount if not set
  useEffect(() => {
    if (!targetCoordinate && defaultCoordinate) {
      console.log(`DocumentControls: Initializing target coordinate with defaultCoordinate: ${defaultCoordinate}`);
      setTargetCoordinate(defaultCoordinate);
      setIsCoordinateValid(isValidBimbaCoordinate(defaultCoordinate));
    }
  }, []);

  // AG-UI Event Handlers for Pipeline Progress
  useEffect(() => {
    // Handler for Step Started (AG-UI Protocol)
    const handleStepStarted = (event: any) => {
      console.log('📊 DocumentControls: Pipeline step started:', event);

      setAnalysisProgress({
        stage: event.stepName || 'processing',
        progress: event.progress || 0,
        currentStep: `Starting: ${event.stepName || 'Unknown Step'}`,
        stageId: event.details?.stageId,
        currentStageNumber: event.details?.currentStage,
        totalStages: event.details?.totalStages || 6
      });
      setProgressError(null);
    };

    // Handler for Step Finished (AG-UI Protocol)
    const handleStepFinished = (event: any) => {
      console.log('✅ DocumentControls: Pipeline step finished:', event);

      setAnalysisProgress({
        stage: event.stepName || 'processing',
        progress: event.progress || 0,
        currentStep: `Completed: ${event.stepName || 'Unknown Step'}`,
        stageId: event.details?.stageId,
        currentStageNumber: event.details?.currentStage,
        totalStages: event.details?.totalStages || 6
      });
    };

    // Handler for Analysis Completion
    const handleAnalysisCompleted = (event: any) => {
      console.log('🎉 DocumentControls: Analysis completed:', event);

      // Keep progress visible after completion - don't clear it
      // Update to show completion status
      setAnalysisProgress(prev => prev ? {
        ...prev,
        currentStep: 'Analysis completed successfully',
        progress: 100
      } : null);
      setProgressError(null);
    };

    // Handler for Run Errors - only stop on true critical errors
    const handleRunError = (event: any) => {
      console.error('❌ DocumentControls: AG-UI Run Error:', event);
      console.log('🔍 DocumentControls: Error event details:', JSON.stringify(event, null, 2));

      // Check if this is a critical error that should stop the pipeline
      const isCriticalError = event.code === 'CRITICAL_PIPELINE_FAILURE' ||
                             event.code === 'PIPELINE_EXECUTION_ERROR' ||
                             event.details?.critical === true;

      if (isCriticalError) {
        // Only stop tracking on true critical errors
        console.log('🛑 Critical error detected - stopping analysis tracking');
        setAnalysisProgress(prev => prev ? {
          ...prev,
          currentStep: 'Analysis failed - critical error',
          progress: prev.progress
        } : null);
        setProgressError(event.message || 'Analysis failed');
        onAnalysisComplete(); // Stop the analysis
      } else {
        // For non-critical errors, just log but continue tracking
        console.warn('⚠️ Non-critical error during analysis - continuing to track progress');
        setAnalysisProgress(prev => prev ? {
          ...prev,
          currentStep: `Warning: ${event.message || 'Non-critical error'} - continuing...`,
          progress: prev.progress
        } : null);
        // Clear the warning after a delay to avoid persistent warning states
        setTimeout(() => {
          setAnalysisProgress(prev => prev ? {
            ...prev,
            currentStep: prev.currentStep.includes('Warning:') ? 'Processing...' : prev.currentStep
          } : null);
        }, 3000);
      }
    };

    // Handler for Run Finished - properly stop tracking with deduplication
    const handleRunFinished = (event: any) => {
      console.log('✅ DocumentControls: AG-UI Run Finished:', event);
      console.log('🔍 DocumentControls: Run Finished event details:', JSON.stringify(event, null, 2));

      // Check if we've already completed this analysis to prevent duplicate completion handling
      if (analysisProgress?.currentStep === 'Analysis completed successfully') {
        console.log('🔄 DocumentControls: Ignoring duplicate RUN_FINISHED event - analysis already completed');
        return;
      }

      setAnalysisProgress(prev => prev ? {
        ...prev,
        currentStep: 'Analysis completed successfully',
        progress: 100
      } : null);
      setProgressError(null);
      onAnalysisComplete(); // Stop the analysis
    };

    // Register event handlers only when analyzing
    if (isAnalyzing) {
      console.log('📝 DocumentControls: Registering AG-UI event handlers...');
      onAGUIEvent('StepStarted', handleStepStarted);
      onAGUIEvent('StepFinished', handleStepFinished);
      onAGUIEvent('DocumentAnalysisCompleted', handleAnalysisCompleted);
      onAGUIEvent('RunFinished', handleRunFinished);
      onAGUIEvent('RunError', handleRunError);

      // Cleanup on unmount or when analysis stops
      return () => {
        console.log('🧹 DocumentControls: Cleaning up AG-UI event handlers');
        offAGUIEvent('StepStarted', handleStepStarted);
        offAGUIEvent('StepFinished', handleStepFinished);
        offAGUIEvent('DocumentAnalysisCompleted', handleAnalysisCompleted);
        offAGUIEvent('RunFinished', handleRunFinished);
        offAGUIEvent('RunError', handleRunError);
      };
    } else {
      // Don't clear progress when not analyzing - keep it visible for user reference
      // Only clear if there's no progress to show
      if (!analysisProgress) {
        setProgressError(null);
      }
    }
  }, [isAnalyzing]);

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
    if (isCoordinateValid && !isAnalyzing && targetCoordinate) {
      console.log(`DocumentControls: Starting analysis with coordinate: ${targetCoordinate}`);

      // Set initial progress state immediately when analysis starts
      setAnalysisProgress({
        stage: 'Initializing',
        progress: 0,
        currentStep: 'Starting analysis pipeline...',
        currentStageNumber: 1,
        totalStages: 6
      });
      setProgressError(null);

      onStartAnalysis(targetCoordinate);
    } else {
      console.warn(`DocumentControls: Cannot start analysis - isValid: ${isCoordinateValid}, isAnalyzing: ${isAnalyzing}, coordinate: ${targetCoordinate}`);
    }
  };

  // Handle crystallize
  const handleCrystallize = () => {
    if (analysisResults && onCrystallize) {
      onCrystallize(analysisResults);
    }
  };

  // Handle crystallise to Notion
  const handleCrystalliseToNotion = () => {
    if (onCrystalliseToNotion) {
      onCrystalliseToNotion();
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
  const showCrystalliseToNotionButton = documentType === 'pratibimba' && (documentStatus === 'ready_for_notion' || documentStatus === 'analyzed');
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
            <span className="text-sm font-medium text-gray-300">
              {documentType === 'pratibimba' ? 'Target Coordinate:' : 'Bimba Coordinate:'}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              documentType === 'pratibimba' ? 'bg-green-600 text-green-100' : 'bg-epii-dark'
            }`}>
              {formatBimbaCoordinate(targetCoordinate)}
              {documentType === 'pratibimba' && <span className="ml-1 text-xs">(Fixed)</span>}
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

            {/* AG-UI Pipeline Progress Display - Show when analyzing or when there's progress to display */}
            {(isAnalyzing || analysisProgress) && (
              <div className="bg-epii-darker p-4 rounded-md border border-epii-neon/30 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-epii-neon text-sm">🤖 Analysis Progress</h5>
                  {analysisProgress && (
                    <span className="text-xs text-gray-400">
                      Stage {analysisProgress.currentStageNumber || 1} of {analysisProgress.totalStages || 6}
                    </span>
                  )}
                </div>

                {progressError ? (
                  <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                    ❌ {progressError}
                  </div>
                ) : analysisProgress ? (
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-epii-neon h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${analysisProgress.progress}%` }}
                      />
                    </div>

                    {/* Progress Details */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Stage: <span className="text-epii-neon font-medium">{analysisProgress.stage}</span>
                      </span>
                      <span className="text-gray-300">
                        {analysisProgress.progress}%
                      </span>
                    </div>

                    {/* Current Step */}
                    <div className="text-xs text-gray-400">
                      {analysisProgress.currentStep}
                    </div>

                    {/* Pipeline Stage Indicators */}
                    <div className="flex items-center space-x-1 text-xs overflow-x-auto">
                      {[
                        { name: 'Fetch Document', progress: 10 },
                        { name: 'Contextualize', progress: 25 },
                        { name: 'Integrate Structure', progress: 40 },
                        { name: 'Relate Concepts', progress: 60 },
                        { name: 'Define Elements', progress: 80 },
                        { name: 'Synthesize', progress: 100 }
                      ].map((stage, index) => {
                        const isActive = analysisProgress?.stage === stage.name;
                        const isCompleted = (analysisProgress?.progress || 0) >= stage.progress;
                        const isNext = !isCompleted && (analysisProgress?.progress || 0) >= (index > 0 ? [10, 25, 40, 60, 80, 100][index - 1] : 0);

                        return (
                          <div
                            key={stage.name}
                            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                              isActive
                                ? 'bg-epii-neon/20 text-epii-neon border border-epii-neon/50'
                                : isCompleted
                                ? 'bg-green-600/20 text-green-300'
                                : isNext
                                ? 'bg-yellow-600/20 text-yellow-300'
                                : 'bg-gray-600/20 text-gray-400'
                            }`}
                            title={`Stage ${index + 1}: ${stage.name} (${stage.progress}%)`}
                          >
                            {isActive && (
                              <div className="animate-spin h-3 w-3 border border-epii-neon border-t-transparent rounded-full" />
                            )}
                            {isCompleted && !isActive && (
                              <CheckCircle size={12} />
                            )}
                            {isNext && !isActive && !isCompleted && (
                              <div className="h-3 w-3 border border-yellow-300 border-dashed rounded-full" />
                            )}
                            <span className="whitespace-nowrap">{stage.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Show initial state when no progress data yet
                  <div className="space-y-3">
                    {/* Initial Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-epii-neon h-2 rounded-full transition-all duration-300 ease-out animate-pulse" style={{ width: '5%' }} />
                    </div>

                    {/* Initial Progress Details */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Stage: <span className="text-epii-neon font-medium">Initializing...</span>
                      </span>
                      <span className="text-gray-300">0%</span>
                    </div>

                    {/* Current Step */}
                    <div className="text-xs text-gray-400">
                      Starting analysis pipeline...
                    </div>

                    {/* Initial Pipeline Stage Indicators */}
                    <div className="flex items-center space-x-1 text-xs overflow-x-auto">
                      {[
                        { name: 'Fetch Document', progress: 10 },
                        { name: 'Contextualize', progress: 25 },
                        { name: 'Integrate Structure', progress: 40 },
                        { name: 'Relate Concepts', progress: 60 },
                        { name: 'Define Elements', progress: 80 },
                        { name: 'Synthesize', progress: 100 }
                      ].map((stage, index) => (
                        <div
                          key={stage.name}
                          className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-gray-600/20 text-gray-400"
                          title={`Stage ${index + 1}: ${stage.name} (${stage.progress}%)`}
                        >
                          <div className="h-3 w-3 border border-gray-400 border-dashed rounded-full" />
                          <span className="whitespace-nowrap">{stage.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
            {/* Crystallise to Notion button */}
            {showCrystalliseToNotionButton && (
              <button
                onClick={handleCrystalliseToNotion}
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
                    <span>Crystallising to Notion...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink size={18} />
                    <span>Crystallise to Notion</span>
                  </>
                )}
              </button>
            )}

            {/* Update Bimba Map button */}
            {onOpenBimbaUpdate && (
              <button
                onClick={() => onOpenBimbaUpdate(targetCoordinate)}
                disabled={isSendingToNotion}
                className={`w-full px-4 py-2 rounded-md flex items-center justify-center space-x-2 ${
                  isSendingToNotion
                    ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                    : 'bg-epii-neon/20 border border-epii-neon/50 text-epii-neon hover:bg-epii-neon/30'
                }`}
              >
                <Map size={18} />
                <span>Update Bimba Map for {formatBimbaCoordinate(targetCoordinate)}</span>
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
