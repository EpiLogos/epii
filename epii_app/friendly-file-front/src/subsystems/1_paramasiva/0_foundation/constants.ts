/**
 * Constants for the Meta3D visualization
 * 
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-0 (QL/AT Vis - Foundation)
 */

// Node size constants
export const NODE_BASE_SIZE = 3;
export const NODE_ROOT_SIZE_MULTIPLIER = 6.0;
export const NODE_SUBSYSTEM_SIZE_MULTIPLIER = 4.0;
export const NODE_MAPPED_SIZE_MULTIPLIER = 3.0;

// Node color constants
export const NODE_ROOT_COLOR = '#00ffff';
export const NODE_SUBSYSTEM_COLORS = [
  '#ff0000', // #0 Anuttara - Red
  '#ffff00', // #1 Paramasiva - Yellow
  '#00ff00', // #2 Parashakti - Green
  '#0000ff', // #3 Mahamaya - Blue
  '#ff00ff', // #4 Nara - Magenta
  '#ffffff', // #5 Epii - White
];

// Link constants
export const LINK_BASE_WIDTH = 0.2;
export const LINK_HIGHLIGHTED_WIDTH = 2.0;
export const LINK_CORE_WIDTH = 0.5;
export const LINK_OTHER_WIDTH = 0.2;

// Pulse animation constants
export const PULSE_MIN_FACTOR = 0.3;
export const PULSE_MAX_FACTOR = 1.0;
export const PULSE_DURATION = 15000; // ms

// Physics constants
export const PHYSICS_ALPHA_DECAY = 0.0005;
export const PHYSICS_VELOCITY_DECAY = 0.05;
export const PHYSICS_ALPHA_MIN = 0.001;

// Diamond constants
export const DIAMOND_BASE_DISTANCE = 1200;
export const DIAMOND_DISTANCE_SCALE_FACTOR = 0.3;

// Torus constants
export const TORUS_RADIUS = 1200;
export const TORUS_TUBE_RADIUS = 16;
export const TORUS_TUBE_SEGMENTS = 24;
export const TORUS_RADIAL_SEGMENTS = 48;
export const TORUS_OPACITY = 0.3;
