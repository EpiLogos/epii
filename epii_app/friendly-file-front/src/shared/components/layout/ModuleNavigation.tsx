/**
 * ModuleNavigation Component
 *
 * This component provides navigation links between the different modules in the Epi-Logos frontend.
 * It follows the Bimba architecture with modules numbered according to the quaternary logic structure.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Layers, User, Brain } from 'lucide-react';

interface ModuleNavigationProps {
  currentModule: '0000' | '0/1' | '4' | '5/0';
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ currentModule }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 mt-4">
      <Link
        to="/meta2d"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentModule === '0000'
            ? 'bg-epii-neon/20 text-epii-neon'
            : 'bg-epii-dark/40 text-foreground/70 hover:bg-epii-dark/60 hover:text-foreground'
        }`}
      >
        <Grid className="h-4 w-4" />
        <span>2D Graph (#0000)</span>
      </Link>

      <Link
        to="/meta3d"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentModule === '0/1'
            ? 'bg-epii-neon/20 text-epii-neon'
            : 'bg-epii-dark/40 text-foreground/70 hover:bg-epii-dark/60 hover:text-foreground'
        }`}
      >
        <Box className="h-4 w-4" />
        <span>3D Graph (#0/1)</span>
      </Link>

      <Link
        to="/chat"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentModule === '4'
            ? 'bg-epii-neon/20 text-epii-neon'
            : 'bg-epii-dark/40 text-foreground/70 hover:bg-epii-dark/60 hover:text-foreground'
        }`}
      >
        <User className="h-4 w-4" />
        <span>Nara Mode (#4)</span>
      </Link>

      <Link
        to="/epii"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentModule === '5/0'
            ? 'bg-epii-neon/20 text-epii-neon'
            : 'bg-epii-dark/40 text-foreground/70 hover:bg-epii-dark/60 hover:text-foreground'
        }`}
      >
        <Brain className="h-4 w-4" />
        <span>Epii Mode (#5/0)</span>
      </Link>
    </div>
  );
};

export default ModuleNavigation;
