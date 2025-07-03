/**
 * Epi-Logos Universal Agent Foundation Types
 * Core type definitions for the universal orchestrating agent
 */

export const SubsystemExperts = {
  ANUTTARA: 'anuttara',
  PARAMASIVA: 'paramasiva', 
  PARASHAKTI: 'parashakti',
  MAHAMAYA: 'mahamaya',
  NARA: 'nara',
  EPII: 'epii'
};

export const AgentRequestTypes = {
  QUERY: 'query',
  ANALYSIS: 'analysis', 
  ORCHESTRATION: 'orchestration',
  REFLECTION: 'reflection',
  ACTION: 'action'
};

export const ContextFrames = {
  DOCUMENT: 'document',
  SELECTION: 'selection',
  GRAPH: 'graph',
  COORDINATE: 'coordinate',
  UNIVERSAL: 'universal'
};

export const OrchestrationStates = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  DELEGATING: 'delegating',
  COORDINATING: 'coordinating',
  SYNTHESIZING: 'synthesizing',
  RESPONDING: 'responding'
};