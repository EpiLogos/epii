/**
 * Animation Console Trigger Component
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-5 (Harmonic Layer - Integration)
 *
 * This component provides the cog wheel trigger for opening the animation console.
 * It integrates with Meta2D and Meta3D pages to provide context-aware animation controls.
 */

import React, { useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useAnimationConsole } from '../4_context/AnimationConsoleContext';

interface AnimationConsoleTriggerProps {
  page: 'meta2d' | 'meta3d';
  className?: string;
}

export const AnimationConsoleTrigger: React.FC<AnimationConsoleTriggerProps> = ({ 
  page, 
  className = '' 
}) => {
  const { openConsole, setCurrentPage, isOpen } = useAnimationConsole();

  // Update the current page when this trigger is mounted
  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  const handleClick = () => {
    if (!isOpen) {
      setCurrentPage(page);
      openConsole();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative p-2 
        bg-epii-dark/40 hover:bg-epii-dark/60 
        border border-epii-neon/20 hover:border-epii-neon/40
        rounded-lg transition-all duration-200
        shadow-lg hover:shadow-xl
        ${className}
      `}
      title={`Open Animation Console (${page.toUpperCase()})`}
    >
      <Settings 
        size={20} 
        className="text-foreground/70 group-hover:text-epii-neon transition-colors duration-200 group-hover:rotate-90" 
      />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg bg-epii-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      {/* Page indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-epii-neon/80 rounded-full text-[8px] font-bold text-black flex items-center justify-center">
        {page === 'meta2d' ? '2' : '3'}
      </div>
    </button>
  );
};

export default AnimationConsoleTrigger;
