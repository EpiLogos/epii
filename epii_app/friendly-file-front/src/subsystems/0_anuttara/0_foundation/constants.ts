/**
 * Constants for the Meta2D visualization
 * 
 * Bimba Tech Architecture Alignment:
 * - #5-3-0-0 (Bimba Vis / Geom Ground - Foundation)
 */

// Node size constants
export const NODE_BASE_SIZE = 30;
export const NODE_ROOT_SIZE_MULTIPLIER = 2.0;
export const NODE_SUBSYSTEM_SIZE_MULTIPLIER = 1.5;
export const NODE_MAPPED_SIZE_MULTIPLIER = 1.2;

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
export const LINK_BASE_WIDTH = 1.0;
export const LINK_HIGHLIGHTED_WIDTH = 2.0;
export const LINK_CORE_WIDTH = 1.5;
export const LINK_OTHER_WIDTH = 0.5;

// Pulse animation constants
export const PULSE_MIN_FACTOR = 0.5;
export const PULSE_MAX_FACTOR = 1.5;
export const PULSE_DURATION = 2000; // ms

// Physics constants
export const PHYSICS_ALPHA_DECAY = 0.005;
export const PHYSICS_VELOCITY_DECAY = 0.1;
export const PHYSICS_ALPHA_MIN = 0.0005;
