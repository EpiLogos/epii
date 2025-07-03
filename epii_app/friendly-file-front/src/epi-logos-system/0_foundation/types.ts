/**
 * Epi-Logos Universal Agent Foundation Types
 * TypeScript interfaces for the universal orchestrating agent frontend
 */

export enum SubsystemExperts {
  ANUTTARA = 'anuttara',
  PARAMASIVA = 'paramasiva',
  PARASHAKTI = 'parashakti',
  MAHAMAYA = 'mahamaya',
  NARA = 'nara',
  EPII = 'epii'
}

export enum AgentRequestTypes {
  QUERY = 'query',
  ANALYSIS = 'analysis',
  ORCHESTRATION = 'orchestration',
  REFLECTION = 'reflection',
  ACTION = 'action'
}

export enum ContextFrames {
  DOCUMENT = 'document',
  SELECTION = 'selection',
  GRAPH = 'graph',
  COORDINATE = 'coordinate',
  UNIVERSAL = 'universal'
}

export enum OrchestrationStates {
  IDLE = 'idle',
  ANALYZING = 'analyzing',
  DELEGATING = 'delegating',
  COORDINATING = 'coordinating',
  SYNTHESIZING = 'synthesizing',
  RESPONDING = 'responding'
}

export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  context?: AgentContext;
  metadata?: AgentMessageMetadata;
}

export interface AgentContext {
  document?: DocumentContext;
  selections?: TextSelection[];
  coordinates?: string[];
  viewport?: ViewportInfo;
  sessionId?: string;
  componentId?: string;
  [key: string]: any;
}

export interface DocumentContext {
  id?: string;
  title?: string;
  content?: string;
  type?: string;
  bimbaCoordinate?: string;
  lastModified?: Date;
}

export interface TextSelection {
  id: string;
  documentId: string;
  start: number;
  end: number;
  text: string;
  timestamp: Date;
  isPratibimba?: boolean;
  bimbaCoordinate?: string;
}

export interface ViewportInfo {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  component: string;
}

export interface AgentMessageMetadata {
  orchestrationType?: string;
  subsystemsInvolved?: SubsystemExperts[];
  processingTime?: number;
  confidence?: number;
  workflowId?: string;
  skillsUsed?: string[];
}

export interface AgentSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  messageCount: number;
  context: AgentContext;
  preferences?: AgentSessionPreferences;
}

export interface AgentSessionPreferences {
  maxMessagesInMemory: number;
  contextCompactingThreshold: number;
  preferredOrchestrationStrategy: 'single' | 'coordinated' | 'sequential';
  enabledSubsystems: SubsystemExperts[];
}

export interface OrchestrationRequest {
  type: AgentRequestTypes;
  content: string;
  context?: AgentContext;
  targetSubsystems?: SubsystemExperts[];
  orchestrationStrategy?: 'single' | 'coordinated' | 'sequential' | 'parallel';
}

export interface OrchestrationResponse {
  success: boolean;
  result: any;
  metadata: {
    orchestrationType: string;
    processingTime: number;
    subsystemsInvolved: SubsystemExperts[];
    workflowId?: string;
    timestamp: string;
  };
  error?: string;
}

export interface GenerativeUIComponent {
  componentName: string;
  props: Record<string, any>;
  fallbackText?: string;
  metadata?: {
    source: 'agent' | 'subsystem';
    confidence: number;
  };
}

export interface AgentActionRegistryEntry {
  actionName: string;
  componentId: string;
  handler: (args: any) => void | Promise<void>;
  description?: string;
  schema?: any;
}

export interface AgentContextRegistryEntry {
  componentId: string;
  contextProvider: () => any;
  updateHandler?: (newContext: any) => void;
  dependencies?: string[];
}

export interface FrontendContextRequest {
  componentId: string;
  contextType: 'selection' | 'fullState' | 'viewport' | 'document';
  timeout?: number;
}

export interface FrontendActionRequest {
  actionName: string;
  componentId: string;
  args: Record<string, any>;
}

export interface AGUIEvent {
  type: string;
  payload: any;
  timestamp: string;
  requestId?: string;
}

export interface StateDelta {
  componentId: string;
  stateKey: string;
  newValue: any;
  previousValue?: any;
  timestamp: Date;
  source: 'agent' | 'user' | 'system';
}

// Session Management Types
export interface SessionHistoryEntry {
  sessionId: string;
  messages: AgentMessage[];
  context: AgentContext;
  startTime: Date;
  endTime?: Date;
  archived: boolean;
}

export interface ContextCompactingResult {
  compactedMessages: AgentMessage[];
  preservedContext: AgentContext;
  compressionRatio: number;
  originalMessageCount: number;
  compactedMessageCount: number;
}

// Component State Types
export interface FloatingAgentState {
  isVisible: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  currentSession: AgentSession;
  messageHistory: AgentMessage[];
  isProcessing: boolean;
  orchestrationState: OrchestrationStates;
}

export interface DocumentCanvasAgentState {
  currentDocument: DocumentContext | null;
  selections: TextSelection[];
  analysisResults: any[];
  isAnalyzing: boolean;
  graphLayout: any;
  uiFlags: Record<string, boolean>;
}

// Error Types
export interface AgentError {
  code: string;
  message: string;
  context?: any;
  timestamp: Date;
  recoverable: boolean;
}

// Utility Types
export type ComponentContextProvider<T = any> = () => T;
export type ComponentActionHandler<T = any> = (args: T) => void | Promise<void>;
export type ContextUpdateHandler<T = any> = (newContext: T) => void;

// Events Types for WebSocket Communication
export interface WebSocketAgentEvent {
  type: 'agent:message' | 'agent:state' | 'agent:error' | 'agent:orchestration';
  payload: any;
  sessionId: string;
  timestamp: string;
}