/**
 * Animation Console Context
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-4 (Harmonic Layer - Context)
 *
 * This context provides state management for the animation console system.
 * It manages parameter changes, state persistence, and real-time updates.
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  AnimationConsoleState,
  AnimationConsoleActions,
  AnimationParameter,
  AnimationGroup,
  ParameterChangeEvent,
  ANIMATION_PARAMETERS
} from '../0_foundation/animationConsoleTypes';
import { AnimationSubsystem, AnimationCategory } from '../1_utils/AnimationManager';

// Context type
interface AnimationConsoleContextType extends AnimationConsoleState, AnimationConsoleActions {}

// Action types for reducer
type AnimationConsoleAction =
  | { type: 'OPEN_CONSOLE' }
  | { type: 'CLOSE_CONSOLE' }
  | { type: 'SET_CURRENT_PAGE'; payload: 'meta2d' | 'meta3d' }
  | { type: 'UPDATE_PARAMETER'; payload: { parameterId: string; value: any } }
  | { type: 'REVERT_PARAMETER'; payload: string }
  | { type: 'REVERT_ALL_PARAMETERS' }
  | { type: 'SAVE_STATE'; payload: { stateName: string; state: Record<string, any> } }
  | { type: 'LOAD_STATE'; payload: string }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'SET_GROUPS'; payload: AnimationGroup[] };

// Create context
const AnimationConsoleContext = createContext<AnimationConsoleContextType | null>(null);

// Helper function to create animation groups from parameters
function createAnimationGroups(currentPage: 'meta2d' | 'meta3d'): AnimationGroup[] {
  const groups: Record<string, AnimationGroup> = {};

  // Process all animation parameters
  Object.values(ANIMATION_PARAMETERS).forEach(paramGroup => {
    Object.values(paramGroup).forEach(param => {
      const parameter: AnimationParameter = {
        ...param,
        currentValue: param.defaultValue
      };

      // Filter parameters based on current page
      const isRelevantForPage = 
        (currentPage === 'meta2d' && (
          parameter.subsystem === AnimationSubsystem.ANUTTARA ||
          parameter.subsystem === AnimationSubsystem.PARASHAKTI ||
          parameter.animationCategory === AnimationCategory.LINK ||
          parameter.animationCategory === AnimationCategory.SYSTEM
        )) ||
        (currentPage === 'meta3d' && (
          parameter.subsystem === AnimationSubsystem.PARAMASIVA ||
          parameter.subsystem === AnimationSubsystem.PARASHAKTI ||
          parameter.animationCategory === AnimationCategory.WIREFRAME ||
          parameter.animationCategory === AnimationCategory.SYSTEM
        ));

      if (!isRelevantForPage) return;

      // Group by category
      const groupId = parameter.category;
      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          name: parameter.category,
          description: `Parameters for ${parameter.category.toLowerCase()}`,
          subsystem: parameter.subsystem,
          category: parameter.animationCategory,
          parameters: [],
          enabled: true
        };
      }

      groups[groupId].parameters.push(parameter);
    });
  });

  return Object.values(groups);
}

// Initial state
const initialState: AnimationConsoleState = {
  isOpen: false,
  currentPage: 'meta2d',
  groups: [],
  hasUnsavedChanges: false,
  savedStates: {}
};

// Reducer
function animationConsoleReducer(
  state: AnimationConsoleState,
  action: AnimationConsoleAction
): AnimationConsoleState {
  switch (action.type) {
    case 'OPEN_CONSOLE':
      return { ...state, isOpen: true };

    case 'CLOSE_CONSOLE':
      return { ...state, isOpen: false };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
        groups: createAnimationGroups(action.payload)
      };

    case 'SET_GROUPS':
      return { ...state, groups: action.payload };

    case 'UPDATE_PARAMETER': {
      const { parameterId, value } = action.payload;
      const updatedGroups = state.groups.map(group => ({
        ...group,
        parameters: group.parameters.map(param =>
          param.id === parameterId
            ? { ...param, currentValue: value }
            : param
        )
      }));

      return {
        ...state,
        groups: updatedGroups,
        hasUnsavedChanges: true
      };
    }

    case 'REVERT_PARAMETER': {
      const parameterId = action.payload;
      const updatedGroups = state.groups.map(group => ({
        ...group,
        parameters: group.parameters.map(param =>
          param.id === parameterId
            ? { ...param, currentValue: param.defaultValue }
            : param
        )
      }));

      return {
        ...state,
        groups: updatedGroups,
        hasUnsavedChanges: true
      };
    }

    case 'REVERT_ALL_PARAMETERS': {
      const updatedGroups = state.groups.map(group => ({
        ...group,
        parameters: group.parameters.map(param => ({
          ...param,
          currentValue: param.defaultValue
        }))
      }));

      return {
        ...state,
        groups: updatedGroups,
        hasUnsavedChanges: false
      };
    }

    case 'SAVE_STATE': {
      const { stateName, state: savedState } = action.payload;
      return {
        ...state,
        savedStates: {
          ...state.savedStates,
          [stateName]: savedState
        },
        hasUnsavedChanges: false
      };
    }

    case 'LOAD_STATE': {
      const stateName = action.payload;
      const savedState = state.savedStates[stateName];
      if (!savedState) return state;

      const updatedGroups = state.groups.map(group => ({
        ...group,
        parameters: group.parameters.map(param => ({
          ...param,
          currentValue: savedState[param.id] ?? param.currentValue
        }))
      }));

      return {
        ...state,
        groups: updatedGroups,
        hasUnsavedChanges: false
      };
    }

    case 'RESET_TO_DEFAULTS': {
      const updatedGroups = state.groups.map(group => ({
        ...group,
        parameters: group.parameters.map(param => ({
          ...param,
          currentValue: param.defaultValue
        }))
      }));

      return {
        ...state,
        groups: updatedGroups,
        hasUnsavedChanges: false
      };
    }

    default:
      return state;
  }
}

// Provider component
export const AnimationConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(animationConsoleReducer, initialState);

  // Initialize groups when component mounts
  useEffect(() => {
    const groups = createAnimationGroups(state.currentPage);
    dispatch({ type: 'SET_GROUPS', payload: groups });
  }, []);

  // Actions
  const openConsole = useCallback(() => {
    dispatch({ type: 'OPEN_CONSOLE' });
  }, []);

  const closeConsole = useCallback(() => {
    dispatch({ type: 'CLOSE_CONSOLE' });
  }, []);

  const setCurrentPage = useCallback((page: 'meta2d' | 'meta3d') => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const updateParameter = useCallback((parameterId: string, value: any) => {
    dispatch({ type: 'UPDATE_PARAMETER', payload: { parameterId, value } });
  }, []);

  const revertParameter = useCallback((parameterId: string) => {
    dispatch({ type: 'REVERT_PARAMETER', payload: parameterId });
  }, []);

  const revertAllParameters = useCallback(() => {
    dispatch({ type: 'REVERT_ALL_PARAMETERS' });
  }, []);

  const saveCurrentState = useCallback((stateName: string) => {
    const currentState: Record<string, any> = {};
    state.groups.forEach(group => {
      group.parameters.forEach(param => {
        currentState[param.id] = param.currentValue;
      });
    });
    dispatch({ type: 'SAVE_STATE', payload: { stateName, state: currentState } });
  }, [state.groups]);

  const loadSavedState = useCallback((stateName: string) => {
    dispatch({ type: 'LOAD_STATE', payload: stateName });
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  }, []);

  const contextValue: AnimationConsoleContextType = {
    ...state,
    openConsole,
    closeConsole,
    setCurrentPage,
    updateParameter,
    revertParameter,
    revertAllParameters,
    saveCurrentState,
    loadSavedState,
    resetToDefaults
  };

  return (
    <AnimationConsoleContext.Provider value={contextValue}>
      {children}
    </AnimationConsoleContext.Provider>
  );
};

// Hook to use the context
export const useAnimationConsole = (): AnimationConsoleContextType => {
  const context = useContext(AnimationConsoleContext);
  if (!context) {
    throw new Error('useAnimationConsole must be used within an AnimationConsoleProvider');
  }
  return context;
};
