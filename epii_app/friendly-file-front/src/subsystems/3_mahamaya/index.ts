/**
 * 3_mahamaya Subsystem Index
 * 
 * Bimba Tech Architecture Alignment:
 * - #5-3-3 (Symbolic Transform Matrix)
 * 
 * This file exports all components and utilities from the 3_mahamaya subsystem.
 */

// 1_utils
export * from './1_utils/nodeStyleUtils';

// 2_hooks
export * from './2_hooks/useNodeStyling';
export * from './2_hooks/useNodeStyling3D';

// 3_visualization
export { default as SymbolicRepresentation } from './3_visualization/SymbolicRepresentation';
