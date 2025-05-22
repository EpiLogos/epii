/**
 * Node Style Utilities Proxy
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-1-1 (Paramasiva - Utils)
 *
 * This file re-exports the node styling utilities from the mahamaya subsystem.
 * This ensures that the correct utility functions are used throughout the application.
 */

import { calculateNodeColor, calculateNodeSize } from '../../3_mahamaya/1_utils/nodeStyleUtils';

export { calculateNodeColor, calculateNodeSize };
