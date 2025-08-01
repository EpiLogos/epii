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
import { agentRegistrationService } from '../3_services/AgentRegistrationService';

export type SubsystemMode = 'epii' | 'nara' | 'paramasiva' | 'anuttara' | 'universal';

export interface ActiveModeContext {
  currentMode: SubsystemMode;
  currentCoordinate: string;
  expertSkillId: string;
  modeCapabilities: string[];
  modeName: string;
  modeDescription: string;
}

// Static page preferences (what we'd prefer if the agent exists)
const PAGE_PREFERENCES: Record<string, {
  preferredSkillId: string;
  currentCoordinate: string;
  modeCapabilities: string[];
  modeName: string;
  modeDescription: string;
}> = {
  '/epii': {
    currentCoordinate: '#5',
    preferredSkillId: 'epii-chat',
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
    preferredSkillId: 'nara-chat',
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
    preferredSkillId: 'paramasiva-chat',
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
    preferredSkillId: 'anuttara-chat',
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
    preferredSkillId: 'universal-chat',
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

// Function to resolve preferred skill to actual available skill
async function resolveExpertSkillId(preferredSkillId: string): Promise<string> {
  try {
    // Check if preferred skill actually exists
    const hasPreferred = await agentRegistrationService.hasSkill(preferredSkillId);
    if (hasPreferred) {
      console.log(`[ActiveModeProvider] Using preferred skill: ${preferredSkillId}`);
      return preferredSkillId;
    }

    // Get best available chat skill as fallback
    const bestSkill = await agentRegistrationService.getBestChatSkill(preferredSkillId);
    console.log(`[ActiveModeProvider] Preferred skill ${preferredSkillId} not available, using: ${bestSkill.id}`);
    return bestSkill.id;
  } catch (error) {
    console.error(`[ActiveModeProvider] Error resolving skill ${preferredSkillId}:`, error);
    // Hard fallback to known working skill
    return 'epii-chat';
  }
}

// Default universal mode (will be updated with actual available skill)
const getDefaultMode = async (): Promise<ActiveModeContext> => {
  const expertSkillId = await resolveExpertSkillId('universal-chat');
  return {
    currentMode: 'universal',
    currentCoordinate: '#',
    expertSkillId,
    modeCapabilities: ['cross-system-coordination', 'general-queries'],
    modeName: 'Universal Mode',
    modeDescription: 'Universal/Root Expert - Cross-system coordination and general operations'
  };
};

// Create context
const ActiveModeContext = createContext<ActiveModeContext | undefined>(undefined);

// Provider component
export const ActiveModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [modeContext, setModeContext] = useState<ActiveModeContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine mode from current route with registration-aware resolution
  useEffect(() => {
    const resolveMode = async () => {
      try {
        setIsLoading(true);
        const pathname = location.pathname;
        
        // Find matching page preference
        const pagePreference = PAGE_PREFERENCES[pathname];
        
        if (pagePreference) {
          console.log(`[ActiveModeProvider] Resolving mode for ${pathname}, preferred skill: ${pagePreference.preferredSkillId}`);
          
          // Resolve actual available skill
          const expertSkillId = await resolveExpertSkillId(pagePreference.preferredSkillId);
          
          // Determine subsystem mode from coordinate
          let currentMode: SubsystemMode;
          switch (pagePreference.currentCoordinate) {
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
            currentCoordinate: pagePreference.currentCoordinate,
            expertSkillId, // Use resolved skill, not preferred
            modeCapabilities: pagePreference.modeCapabilities,
            modeName: pagePreference.modeName,
            modeDescription: pagePreference.modeDescription
          };

          setModeContext(newModeContext);

          // Emit AG-UI event for mode change
          emitAGUIEvent('StateDelta', {
            type: 'mode-change',
            subsystem: 'epi-logos-system',
            activeMode: currentMode,
            activeCoordinate: pagePreference.currentCoordinate,
            expertSkillId, // Use resolved skill
            capabilities: pagePreference.modeCapabilities,
            timestamp: new Date().toISOString()
          });

          console.log(`[ActiveModeProvider] Mode resolved to ${currentMode} with skill: ${expertSkillId}`);
        } else {
          // Fallback to universal mode
          const defaultMode = await getDefaultMode();
          setModeContext(defaultMode);
          
          emitAGUIEvent('StateDelta', {
            type: 'mode-change',
            subsystem: 'epi-logos-system',
            activeMode: 'universal',
            activeCoordinate: '#',
            expertSkillId: defaultMode.expertSkillId,
            capabilities: defaultMode.modeCapabilities,
            timestamp: new Date().toISOString()
          });

          console.log(`[ActiveModeProvider] Unknown route ${pathname}, using universal mode with skill: ${defaultMode.expertSkillId}`);
        }
      } catch (error) {
        console.error('[ActiveModeProvider] Failed to resolve mode:', error);
        // Hard fallback to known working configuration
        const fallbackMode: ActiveModeContext = {
          currentMode: 'universal',
          currentCoordinate: '#',
          expertSkillId: 'epii-chat', // Known to exist
          modeCapabilities: ['general-queries'],
          modeName: 'Universal Mode',
          modeDescription: 'Fallback mode'
        };
        setModeContext(fallbackMode);
      } finally {
        setIsLoading(false);
      }
    };

    resolveMode();
  }, [location.pathname]);

  // Show loading state while resolving registration data
  if (isLoading || !modeContext) {
    return (
      <ActiveModeContext.Provider value={undefined}>
        {children}
      </ActiveModeContext.Provider>
    );
  }

  return (
    <ActiveModeContext.Provider value={modeContext}>
      {children}
    </ActiveModeContext.Provider>
  );
};

// Hook for using the context
export const useActiveMode = (): ActiveModeContext | undefined => {
  const context = useContext(ActiveModeContext);
  return context;
};

// Hook that throws error if context is undefined (for components that require mode)
export const useActiveModeSafe = (): ActiveModeContext => {
  const context = useActiveMode();
  if (context === undefined) {
    throw new Error('useActiveModeSafe must be used within an ActiveModeProvider and mode must be resolved');
  }
  return context;
};

// Helper hooks for specific functionality
export const useCurrentExpert = () => {
  const modeContext = useActiveMode();
  if (!modeContext) {
    return null; // Return null during loading
  }
  
  const { expertSkillId, currentCoordinate, modeName, modeDescription } = modeContext;
  return {
    expertSkillId,
    coordinate: currentCoordinate,
    name: modeName,
    description: modeDescription
  };
};

export const useModeCapabilities = () => {
  const modeContext = useActiveMode();
  if (!modeContext) {
    return {
      capabilities: [],
      mode: null,
      hasCapability: () => false
    };
  }
  
  const { modeCapabilities, currentMode } = modeContext;
  return {
    capabilities: modeCapabilities,
    mode: currentMode,
    hasCapability: (capability: string) => modeCapabilities.includes(capability)
  };
};

export const useModeTransition = () => {
  const modeContext = useActiveMode();
  
  const emitModeTransition = (targetMode: SubsystemMode, metadata?: Record<string, any>) => {
    if (!modeContext) return; // Don't emit during loading
    
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
    currentMode: modeContext?.currentMode || null,
    emitModeTransition
  };
};