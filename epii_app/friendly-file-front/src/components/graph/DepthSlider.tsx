import { Slider } from '@mui/material';
import { useState } from 'react';

interface DepthSliderProps {
  maxDepth: number;
  onDepthChange: (depth: number) => void;
}

export default function DepthSlider({ maxDepth, onDepthChange }: DepthSliderProps) {
  const [depth, setDepth] = useState(1);

  const handleChange = (event: Event, newValue: number | number[]) => {
    const depthValue = typeof newValue === 'number' ? newValue : newValue[0];
    setDepth(depthValue);
    onDepthChange(depthValue);
  };

  return (
    <div className="depth-slider">
      <Slider
        value={depth}
        onChange={handleChange}
        min={1}
        max={maxDepth}
        step={1}
        valueLabelDisplay="auto"
        aria-label="Graph depth"
      />
      <div className="slider-label">Graph Depth: {depth}</div>
    </div>
  );
}
