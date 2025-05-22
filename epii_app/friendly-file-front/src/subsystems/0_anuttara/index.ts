/**
 * 0_anuttara Subsystem Index
 * 
 * Bimba Tech Architecture Alignment:
 * - #5-3-0 (Bimba Vis / Geom Ground)
 * 
 * This file exports all components and utilities from the 0_anuttara subsystem.
 */

// 0_foundation
export * from './0_foundation/constants';

// 1_utils
export * from './1_utils/depthCalculation';
export * from './1_utils/geometryUtils';

// 2_hooks
export * from './2_hooks/useGraphData';

// 3_visualization
export * from './3_visualization/useGraphProcessing';
export * from './3_visualization/Meta2DFoundation';

// 4_context
// export * from './4_context/Meta2DContainer';

// 5_integration
export { default as Meta2DIntegration } from './5_integration/Meta2DIntegration';
