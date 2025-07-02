/**
 * Animation Console Types
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-0 (Harmonic Layer - Foundation)
 *
 * This file defines the types and interfaces for the animation console system.
 * It provides a developer interface for managing animation parameters in real-time.
 */

import { AnimationSubsystem, AnimationCategory, AnimationPriority } from '../1_utils/AnimationManager';

// Parameter types that can be controlled
export enum ParameterType {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  COLOR = 'color'
}

// Parameter constraint interface
export interface ParameterConstraints {
  min?: number;
  max?: number;
  step?: number;
  options?: string[]; // For select type
}

// Individual parameter definition
export interface AnimationParameter {
  id: string;
  name: string;
  description: string;
  type: ParameterType;
  defaultValue: any;
  currentValue: any;
  constraints?: ParameterConstraints;
  category: string;
  subsystem: AnimationSubsystem;
  animationCategory: AnimationCategory;
}

// Animation group definition
export interface AnimationGroup {
  id: string;
  name: string;
  description: string;
  subsystem: AnimationSubsystem;
  category: AnimationCategory;
  parameters: AnimationParameter[];
  enabled: boolean;
}

// Console state interface
export interface AnimationConsoleState {
  isOpen: boolean;
  currentPage: 'meta2d' | 'meta3d';
  groups: AnimationGroup[];
  hasUnsavedChanges: boolean;
  savedStates: Record<string, any>; // Saved parameter states
}

// Parameter change event
export interface ParameterChangeEvent {
  parameterId: string;
  oldValue: any;
  newValue: any;
  timestamp: number;
}

// Console actions
export interface AnimationConsoleActions {
  openConsole: () => void;
  closeConsole: () => void;
  setCurrentPage: (page: 'meta2d' | 'meta3d') => void;
  updateParameter: (parameterId: string, value: any) => void;
  revertParameter: (parameterId: string) => void;
  revertAllParameters: () => void;
  saveCurrentState: (stateName: string) => void;
  loadSavedState: (stateName: string) => void;
  resetToDefaults: () => void;
}

// Predefined animation parameters for different systems
export const ANIMATION_PARAMETERS = {
  // AnimationManager parameters
  ANIMATION_MANAGER: {
    performanceMode: {
      id: 'animationManager.performanceMode',
      name: 'Performance Mode',
      description: 'Controls animation quality vs performance',
      type: ParameterType.SELECT,
      defaultValue: 'balanced',
      constraints: { options: ['high', 'balanced', 'low'] },
      category: 'System',
      subsystem: AnimationSubsystem.PARASHAKTI,
      animationCategory: AnimationCategory.SYSTEM
    },
    debugMode: {
      id: 'animationManager.debugMode',
      name: 'Debug Mode',
      description: 'Enable debug logging for animations',
      type: ParameterType.BOOLEAN,
      defaultValue: false,
      category: 'System',
      subsystem: AnimationSubsystem.PARASHAKTI,
      animationCategory: AnimationCategory.SYSTEM
    }
  },

  // Link pulse parameters
  LINK_PULSE: {
    cycleDuration: {
      id: 'linkPulse.cycleDuration',
      name: 'Pulse Cycle Duration',
      description: 'Duration of a complete pulse cycle in milliseconds',
      type: ParameterType.NUMBER,
      defaultValue: 2500,
      constraints: { min: 500, max: 10000, step: 100 },
      category: 'Link Animations',
      subsystem: AnimationSubsystem.PARASHAKTI,
      animationCategory: AnimationCategory.LINK
    },
    minPulseFactor: {
      id: 'linkPulse.minPulseFactor',
      name: 'Minimum Pulse Factor',
      description: 'Minimum opacity factor for pulse animation',
      type: ParameterType.NUMBER,
      defaultValue: 0.1,
      constraints: { min: 0, max: 1, step: 0.05 },
      category: 'Link Animations',
      subsystem: AnimationSubsystem.PARASHAKTI,
      animationCategory: AnimationCategory.LINK
    },
    maxPulseFactor: {
      id: 'linkPulse.maxPulseFactor',
      name: 'Maximum Pulse Factor',
      description: 'Maximum opacity factor for pulse animation',
      type: ParameterType.NUMBER,
      defaultValue: 0.5,
      constraints: { min: 0, max: 2, step: 0.05 },
      category: 'Link Animations',
      subsystem: AnimationSubsystem.PARASHAKTI,
      animationCategory: AnimationCategory.LINK
    },
    pulseSpeed: {
      id: 'linkPulse.pulseSpeed',
      name: 'Pulse Speed',
      description: 'Speed multiplier for pulse animation',
      type: ParameterType.NUMBER,
      defaultValue: 0.2,
      constraints: { min: 0.05, max: 2, step: 0.05 },
      category: 'Link Animations',
      subsystem: AnimationSubsystem.PARASHAKTI,
      animationCategory: AnimationCategory.LINK
    }
  },

  // Torus animation parameters
  TORUS_ANIMATION: {
    speed: {
      id: 'torusAnimation.speed',
      name: 'Rotation Speed',
      description: 'Speed multiplier for torus rotation',
      type: ParameterType.NUMBER,
      defaultValue: 1.0,
      constraints: { min: 0.1, max: 3.0, step: 0.1 },
      category: 'Wireframe Animations',
      subsystem: AnimationSubsystem.PARAMASIVA,
      animationCategory: AnimationCategory.WIREFRAME
    },
    cycleDuration: {
      id: 'torusAnimation.cycleDuration',
      name: 'Cycle Duration',
      description: 'Duration of a complete rotation cycle in milliseconds',
      type: ParameterType.NUMBER,
      defaultValue: 30000,
      constraints: { min: 5000, max: 120000, step: 1000 },
      category: 'Wireframe Animations',
      subsystem: AnimationSubsystem.PARAMASIVA,
      animationCategory: AnimationCategory.WIREFRAME
    }
  },

  // 3D Link pulse parameters (different from 2D)
  LINK_PULSE_3D: {
    pulseCycle: {
      id: 'linkPulse3D.pulseCycle',
      name: '3D Pulse Cycle',
      description: 'Duration of 3D pulse cycle in milliseconds',
      type: ParameterType.NUMBER,
      defaultValue: 5000,
      constraints: { min: 1000, max: 20000, step: 500 },
      category: '3D Link Animations',
      subsystem: AnimationSubsystem.PARAMASIVA,
      animationCategory: AnimationCategory.LINK
    },
    minRange: {
      id: 'linkPulse3D.minRange',
      name: '3D Pulse Min Range',
      description: 'Minimum value for 3D pulse factor',
      type: ParameterType.NUMBER,
      defaultValue: 0.3,
      constraints: { min: 0, max: 1, step: 0.05 },
      category: '3D Link Animations',
      subsystem: AnimationSubsystem.PARAMASIVA,
      animationCategory: AnimationCategory.LINK
    },
    maxRange: {
      id: 'linkPulse3D.maxRange',
      name: '3D Pulse Max Range',
      description: 'Maximum value for 3D pulse factor',
      type: ParameterType.NUMBER,
      defaultValue: 1.7,
      constraints: { min: 1, max: 3, step: 0.1 },
      category: '3D Link Animations',
      subsystem: AnimationSubsystem.PARAMASIVA,
      animationCategory: AnimationCategory.LINK
    }
  }
} as const;
