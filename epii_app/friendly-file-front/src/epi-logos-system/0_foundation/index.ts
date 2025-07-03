/**
 * Epi-Logos System Foundation Exports
 * Central export point for all foundation types and utilities
 */

export * from './types';

// Re-export commonly used types with aliases for convenience
export type {
  AgentMessage as Message,
  AgentContext as Context,
  OrchestrationRequest as Request,
  OrchestrationResponse as Response,
  AgentSession as Session
} from './types';

// Constants
export const EPI_LOGOS_AGENT_ID = 'epi-logos-agent';
export const ROOT_COORDINATE = '#';
export const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const DEFAULT_CONTEXT_COMPACTING_THRESHOLD = 50; // messages
export const DEFAULT_MAX_MESSAGES_IN_MEMORY = 100;

// Agent Configuration
export const AGENT_CONFIG = {
  sessionTimeout: DEFAULT_SESSION_TIMEOUT,
  contextCompactingThreshold: DEFAULT_CONTEXT_COMPACTING_THRESHOLD,
  maxMessagesInMemory: DEFAULT_MAX_MESSAGES_IN_MEMORY,
  enableGenerativeUI: true,
  enableFrontendContextAwareness: true,
  defaultOrchestrationStrategy: 'single' as const,
  enabledSubsystems: [
    'anuttara',
    'paramasiva', 
    'parashakti',
    'mahamaya',
    'nara',
    'epii'
  ]
};

// UI Configuration
export const UI_CONFIG = {
  floatingAgent: {
    defaultPosition: { x: window.innerWidth - 80, y: window.innerHeight - 80 }, // Bottom right anchor
    anchorPosition: { x: window.innerWidth - 80, y: window.innerHeight - 80 }, // Default anchor
    minimizedSize: 60, // Circular size when minimized
    minWidth: 320,
    maxWidth: 600,
    minHeight: 400,
    maxHeight: 800,
    zIndex: 1000
  },
  styling: {
    primary: 'bg-epii-dark',
    accent: 'text-epii-neon',
    border: 'border-epii-neon/20',
    glass: 'backdrop-blur-sm bg-black/80'
  }
};