
import React from "react";
import { Plus, ZoomIn, ZoomOut, RotateCcw, Move, RefreshCw, Box, Square } from "lucide-react";

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onAddNode?: () => void; // Make optional for 3D view
  onRefresh?: () => void; // Optional refresh handler
  viewMode?: '2D' | '3D'; // Optional view mode
  onViewModeChange?: () => void; // Optional handler for switching view modes
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onAddNode,
  onRefresh,
  viewMode = '2D',
  onViewModeChange
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-2">
        <button
          className="bg-epii-dark neo-glow rounded-md p-2"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="bg-epii-dark neo-glow rounded-md p-2"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          className="bg-epii-dark neo-glow rounded-md p-2"
          onClick={onReset}
          title="Reset View"
        >
          <RotateCcw size={20} />
        </button>
        {onRefresh && (
          <button
            className="bg-epii-dark neo-glow rounded-md p-2"
            onClick={onRefresh}
            title="Refresh Graph"
          >
            <RefreshCw size={20} />
          </button>
        )}
        {onViewModeChange && (
          <button
            className="bg-epii-dark neo-glow rounded-md p-2"
            onClick={onViewModeChange}
            title={viewMode === '2D' ? 'Switch to 3D View' : 'Switch to 2D View'}
          >
            {viewMode === '2D' ? <Box size={20} /> : <Square size={20} />}
          </button>
        )}
        <div className="bg-epii-dark neo-glow rounded-md px-3 flex items-center">
          <Move size={16} className="mr-2" />
          <span>{viewMode === '3D' ? 'Fly to navigate' : 'Drag to pan'}</span>
        </div>
      </div>

      {onAddNode && (
        <button
          className="bg-epii-neon text-epii-darker rounded-md px-4 py-2 hover:brightness-110 transition-all flex items-center gap-2"
          onClick={onAddNode}
        >
          <Plus size={18} />
          <span>Add Node</span>
        </button>
      )}
    </div>
  );
};
