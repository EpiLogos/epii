/**
 * Agent Components
 * Central export point for all agent-related components
 */

export { default as GenerativeUIRenderer, GenerativeUIContainer, useGenerativeUI } from './GenerativeUIRenderer';
export { 
  componentRegistry, 
  getComponent, 
  getComponentMetadata, 
  hasComponent, 
  getAvailableComponents,
  validateComponentProps,
  getComponentExample,
  registerComponent,
  unregisterComponent,
  getComponentsByCategory 
} from './componentRegistry';

export type { 
  ComponentRegistryEntry, 
  GenerativeUIComponent 
} from './componentRegistry';