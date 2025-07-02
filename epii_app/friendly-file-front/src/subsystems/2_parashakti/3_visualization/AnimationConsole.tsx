/**
 * Animation Console Component
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-3 (Harmonic Layer - Visualization)
 *
 * This component provides a developer console for managing animation parameters in real-time.
 * It displays parameter groups, sliders, and controls for saving/loading animation states.
 */

import React, { useState } from 'react';
import { X, Save, RotateCcw, Settings, Monitor, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnimationConsole } from '../4_context/AnimationConsoleContext';
import { useAnimationParameterSync, useAnimationMetrics } from '../2_hooks/useAnimationParameterSync';
import { ParameterType, AnimationParameter } from '../0_foundation/animationConsoleTypes';

// Parameter control component
const ParameterControl: React.FC<{
  parameter: AnimationParameter;
  onUpdate: (value: string | number | boolean) => void;
  onRevert: () => void;
}> = ({ parameter, onUpdate, onRevert }) => {
  const isChanged = parameter.currentValue !== parameter.defaultValue;

  const renderControl = () => {
    switch (parameter.type) {
      case ParameterType.NUMBER:
        return (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={parameter.constraints?.min ?? 0}
              max={parameter.constraints?.max ?? 100}
              step={parameter.constraints?.step ?? 1}
              value={parameter.currentValue}
              onChange={(e) => onUpdate(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-epii-dark/40 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min={parameter.constraints?.min}
              max={parameter.constraints?.max}
              step={parameter.constraints?.step}
              value={parameter.currentValue}
              onChange={(e) => onUpdate(parseFloat(e.target.value))}
              className="w-20 px-2 py-1 text-sm bg-epii-dark/40 border border-epii-neon/20 rounded text-foreground"
            />
          </div>
        );

      case ParameterType.BOOLEAN:
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={parameter.currentValue}
              onChange={(e) => onUpdate(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${
              parameter.currentValue ? 'bg-epii-neon' : 'bg-epii-dark/40'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                parameter.currentValue ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
          </label>
        );

      case ParameterType.SELECT:
        return (
          <select
            value={parameter.currentValue}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full px-3 py-2 bg-epii-dark/40 border border-epii-neon/20 rounded text-foreground"
          >
            {parameter.constraints?.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return <span className="text-foreground/60">Unsupported type</span>;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">{parameter.name}</label>
          {isChanged && (
            <button
              onClick={onRevert}
              className="ml-2 text-xs text-epii-neon hover:text-epii-neon/80 transition-colors"
              title="Revert to default"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
        <span className="text-xs text-foreground/60">
          {parameter.type === ParameterType.NUMBER ? parameter.currentValue.toFixed(2) : String(parameter.currentValue)}
        </span>
      </div>
      <div className="space-y-1">
        {renderControl()}
        <p className="text-xs text-foreground/60">{parameter.description}</p>
      </div>
    </div>
  );
};

// Main console component
export const AnimationConsole: React.FC = () => {
  const {
    isOpen,
    currentPage,
    groups,
    hasUnsavedChanges,
    savedStates,
    closeConsole,
    updateParameter,
    revertParameter,
    revertAllParameters,
    saveCurrentState,
    loadSavedState,
    resetToDefaults
  } = useAnimationConsole();

  useAnimationParameterSync(); // Sync parameters with animation systems
  const { getMetrics } = useAnimationMetrics();

  const [saveStateName, setSaveStateName] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isOpen) return null;

  const metrics = getMetrics();

  const handleSaveState = () => {
    if (saveStateName.trim()) {
      saveCurrentState(saveStateName.trim());
      setSaveStateName('');
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 w-80 max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="bg-epii-darker/95 backdrop-blur-md border border-epii-neon/30 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-epii-neon/20">
          <div className="flex items-center gap-2">
            <Settings className="text-epii-neon" size={20} />
            <h2 className="text-lg font-semibold text-foreground">Animation Console</h2>
            <span className="text-xs text-foreground/60 bg-epii-dark/40 px-2 py-1 rounded">
              {currentPage.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="p-1 text-foreground/60 hover:text-epii-neon transition-colors"
              title="Toggle metrics"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-foreground/60 hover:text-epii-neon transition-colors"
              title={isCollapsed ? "Expand console" : "Collapse console"}
            >
              {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
            <button
              onClick={closeConsole}
              className="p-1 text-foreground/60 hover:text-epii-neon transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-[80vh]'}`}>
          {!isCollapsed && (
            <>
            {/* Metrics Panel */}
            {showMetrics && (
          <div className="p-4 bg-epii-dark/20 border-b border-epii-neon/20">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-foreground/60">FPS:</span>
                <span className="ml-2 text-epii-neon font-mono">{metrics.fps.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-foreground/60">Frame Time:</span>
                <span className="ml-2 text-epii-neon font-mono">{metrics.frameTime.toFixed(1)}ms</span>
              </div>
              <div>
                <span className="text-foreground/60">Animations:</span>
                <span className="ml-2 text-epii-neon font-mono">{metrics.animationCount}</span>
              </div>
              <div>
                <span className="text-foreground/60">Status:</span>
                <span className={`ml-2 font-mono ${metrics.isRunning ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-4 border-b border-epii-neon/20 space-y-3">
          {/* Save/Load Controls */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="State name..."
                value={saveStateName}
                onChange={(e) => setSaveStateName(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-epii-dark/40 border border-epii-neon/20 rounded text-foreground"
              />
              <button
                onClick={handleSaveState}
                disabled={!saveStateName.trim()}
                className="px-3 py-2 bg-epii-neon/20 text-epii-neon rounded hover:bg-epii-neon/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={16} />
              </button>
            </div>

            {Object.keys(savedStates).length > 0 && (
              <select
                onChange={(e) => e.target.value && loadSavedState(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-epii-dark/40 border border-epii-neon/20 rounded text-foreground"
                defaultValue=""
              >
                <option value="">Load saved state...</option>
                {Object.keys(savedStates).map(stateName => (
                  <option key={stateName} value={stateName}>{stateName}</option>
                ))}
              </select>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={revertAllParameters}
              className="flex-1 px-3 py-2 text-sm bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors"
            >
              Revert All
            </button>
            <button
              onClick={resetToDefaults}
              className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
            >
              Reset Defaults
            </button>
          </div>

          {hasUnsavedChanges && (
            <div className="text-xs text-orange-400 flex items-center gap-1">
              <Zap size={12} />
              Unsaved changes
            </div>
          )}
        </div>

        {/* Parameter Groups */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {groups.map(group => (
            <div key={group.id} className="border-b border-epii-neon/10 last:border-b-0">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-epii-neon rounded-full"></span>
                  {group.name}
                </h3>
                <div className="space-y-4">
                  {group.parameters.map(parameter => (
                    <ParameterControl
                      key={parameter.id}
                      parameter={parameter}
                      onUpdate={(value) => updateParameter(parameter.id, value)}
                      onRevert={() => revertParameter(parameter.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
