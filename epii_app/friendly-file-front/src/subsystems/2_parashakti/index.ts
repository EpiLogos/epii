/**
 * 2_parashakti Subsystem Index
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2 (Harmonic Layer)
 *
 * This file exports all components and utilities from the 2_parashakti subsystem.
 */

// 0_foundation
export * from './0_foundation/animationConsoleTypes';

// 1_utils
export * from './1_utils/linkPulseUtils';
export { getAnimationManager, resetAnimationManagerSingleton } from './1_utils/AnimationManager';

// 2_hooks
export * from './2_hooks/useLinkPulse';
export { useLinkPulse3D } from './2_hooks/useLinkPulse3D';
export { useAnimationParameterSync, useAnimationMetrics } from './2_hooks/useAnimationParameterSync';

// 3_visualization
export { default as RelationVisualizer } from './3_visualization/RelationVisualizer';
export { AnimationConsole } from './3_visualization/AnimationConsole';

// 4_context
export { AnimationConsoleProvider, useAnimationConsole } from './4_context/AnimationConsoleContext';

// 5_integration
export { AnimationConsoleTrigger } from './5_integration/AnimationConsoleTrigger';
