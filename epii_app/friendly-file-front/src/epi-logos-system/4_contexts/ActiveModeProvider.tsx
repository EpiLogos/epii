/**
 * Active Mode Context Provider
 * 
 * Tracks the current active page/mode and communicates it to the Epi-Logos Agent
 * for intelligent routing to appropriate subsystem experts.
 * 
 * This implements the Expert-Oriented Routing pattern where the universal agent
 * routes chat interactions to the correct subsystem expert based on context.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { emitAGUIEvent } from '../3_services/webSocketService';

export type SubsystemMode = 'epii' | 'nara' | 'paramasiva' | 'anuttara' | 'universal';

export interface ActiveModeContext {
  currentMode: SubsystemMode;
  currentCoordinate: string;
  expertSkillId: string;
  modeCapabilities: string[];
  modeName: string;
  modeDescription: string;
}

// Page-to-Mode Mapping
const PAGE_TO_MODE_MAP: Record<string, Omit<ActiveModeContext, 'currentMode'>> = {
  '/epii': {
    currentCoordinate: '#5',
    expertSkillId: 'epii-chat',
    modeCapabilities: [
      'document-analysis',
      'bimba-updates',
      'crystallization',
      'coordinate-assignment',
      'knowledge-synthesis'
    ],
    modeName: 'Epii Mode',
    modeDescription: 'Self-Awareness of Cosmic Mind - Document analysis and knowledge synthesis'
  },
  '/chat': {
    currentCoordinate: '#4',
    expertSkillId: 'nara-chat',
    modeCapabilities: [
      'user-context',
      'identity-mapping',
      'oracle-functions',
      'astrology-integration',
      'personal-journaling'
    ],
    modeName: 'Nara Mode',
    modeDescription: 'Individualized Cognition - Personal context and identity work'
  },
  '/meta3d': {
    currentCoordinate: '#1',
    expertSkillId: 'paramasiva-chat',
    modeCapabilities: [
      '3d-visualization',
      'topological-forms',
      'quaternary-logic',
      'geometric-processing',
      'dimensional-analysis'
    ],
    modeName: 'Paramasiva Mode',
    modeDescription: 'Quaternal Logic and Algebraic Topology - 3D visualization and QL processing'
  },
  '/meta2d': {
    currentCoordinate: '#0',
    expertSkillId: 'anuttara-chat',
    modeCapabilities: [
      '2d-visualization',
      'foundational-geometry',
      'void-operations',
      'particle-systems',
      'proto-logical-forms'
    ],
    modeName: 'Anuttara Mode',
    modeDescription: 'The Transcendent Void - 2D visualization and foundational geometry'
  },
  '/files': {
    currentCoordinate: '#',
    expertSkillId: 'universal-chat',
    modeCapabilities: [
      'cross-system-coordination',
      'file-management',
      'universal-operations',
      'system-orchestration',
      'general-queries'
    ],
    modeName: 'Universal Mode',
    modeDescription: 'Universal/Root Expert - Cross-system coordination and general operations'
  }
};

// Default universal mode
const DEFAULT_MODE: ActiveModeContext = {
  currentMode: 'universal',
  currentCoordinate: '#',
  expertSkillId: 'universal-chat',
  modeCapabilities: ['cross-system-coordination', 'general-queries'],
  modeName: 'Universal Mode',
  modeDescription: 'Universal/Root Expert - Cross-system coordination and general operations'
};

// Create context
const ActiveModeContext = createContext<ActiveModeContext | undefined>(undefined);

// Provider component
export const ActiveModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [modeContext, setModeContext] = useState<ActiveModeContext>(DEFAULT_MODE);

  // Determine mode from current route
  useEffect(() => {
    const pathname = location.pathname;
    
    // Find matching mode configuration
    const modeConfig = PAGE_TO_MODE_MAP[pathname];
    
    if (modeConfig) {
      // Determine subsystem mode from coordinate
      let currentMode: SubsystemMode;
      switch (modeConfig.currentCoordinate) {
        case '#5':
          currentMode = 'epii';
          break;
        case '#4':
          currentMode = 'nara';
          break;
        case '#1':
          currentMode = 'paramasiva';
          break;
        case '#0':
          currentMode = 'anuttara';
          break;
        case '#':
        default:
          currentMode = 'universal';
          break;
      }

      const newModeContext: ActiveModeContext = {
        currentMode,
        ...modeConfig
      };

      setModeContext(newModeContext);

      // Emit AG-UI event for mode change
      emitAGUIEvent('StateDelta', {
        type: 'mode-change',
        subsystem: 'epi-logos-system',
        activeMode: currentMode,
        activeCoordinate: modeConfig.currentCoordinate,
        expertSkillId: modeConfig.expertSkillId,
        capabilities: modeConfig.modeCapabilities,
        timestamp: new Date().toISOString()
      });

      console.log(`[ActiveModeProvider] Mode changed to ${currentMode} (${modeConfig.modeName})`);
    } else {
      // Fallback to universal mode
      setModeContext(DEFAULT_MODE);
      
      emitAGUIEvent('StateDelta', {
        type: 'mode-change',
        subsystem: 'epi-logos-system',
        activeMode: 'universal',
        activeCoordinate: '#',
        expertSkillId: 'universal-chat',
        capabilities: DEFAULT_MODE.modeCapabilities,
        timestamp: new Date().toISOString()
      });

      console.log(`[ActiveModeProvider] Unknown route ${pathname}, using universal mode`);
    }
  }, [location.pathname]);

  return (
    <ActiveModeContext.Provider value={modeContext}>
      {children}
    </ActiveModeContext.Provider>
  );
};

// Hook for using the context
export const useActiveMode = (): ActiveModeContext => {
  const context = useContext(ActiveModeContext);
  if (context === undefined) {
    throw new Error('useActiveMode must be used within an ActiveModeProvider');
  }
  return context;
};

// Helper hooks for specific functionality
export const useCurrentExpert = () => {
  const { expertSkillId, currentCoordinate, modeName, modeDescription } = useActiveMode();
  return {
    expertSkillId,
    coordinate: currentCoordinate,
    name: modeName,
    description: modeDescription
  };
};

export const useModeCapabilities = () => {
  const { modeCapabilities, currentMode } = useActiveMode();
  return {
    capabilities: modeCapabilities,
    mode: currentMode,
    hasCapability: (capability: string) => modeCapabilities.includes(capability)
  };
};

export const useModeTransition = () => {
  const modeContext = useActiveMode();
  
  const emitModeTransition = (targetMode: SubsystemMode, metadata?: Record<string, any>) => {
    emitAGUIEvent('Custom', {
      eventType: 'mode-transition',
      sourceMode: modeContext.currentMode,
      targetMode,
      sourceCoordinate: modeContext.currentCoordinate,
      metadata: {
        preserveContext: true,
        transitionType: 'user-initiated',
        ...metadata
      },
      timestamp: new Date().toISOString()
    });
  };

  return {
    currentMode: modeContext.currentMode,
    emitModeTransition
  };
};