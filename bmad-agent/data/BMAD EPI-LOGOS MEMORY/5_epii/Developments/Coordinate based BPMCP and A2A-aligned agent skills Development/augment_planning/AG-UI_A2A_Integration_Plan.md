# AG-UI Protocol Integration with A2A Server
## Comprehensive Implementation Plan for Direct Frontend-to-Agent Data Flow

**Document Version:** 1.0
**Date:** 2024-12-19
**Target:** Bimba Update Management Skill Complete Node Data Access
**Coordinate:** #5-2 (Technical Architecture / Process Dynamics)

---

## Executive Summary

This plan addresses the critical limitation where the Bimba Update Management Skill receives arbitrarily filtered node properties and relationships instead of the complete data already loaded in the frontend. The solution implements AG-UI protocol integration with the A2A server to enable direct frontend-to-agent data flow, eliminating data duplication and ensuring agents receive ALL node information.

### Core Problem Statement
- **Current Issue**: Skill receives `params.nodeProperties` and `params.relationships` with limited/filtered data
- **Frontend Reality**: Complete node data already loaded via `useGraphData()` hook in `BimbaUpdateOverlay`
- **Data Loss**: Arbitrary filtering occurs between frontend and skill execution
- **Inefficiency**: Duplicate API calls and potential state inconsistency

### Strategic Solution
Implement AG-UI protocol as an extension to the existing A2A server, creating a direct data pipeline from frontend to agents while preserving Bimba metadata and enabling real-time progress streaming.

---

## 1. Research Analysis & Technical Foundation

### 1.1 AG-UI Protocol Capabilities
- **16 Standard Event Types** across 5 categories (Lifecycle, Text, Tool, State, Special)
- **Real-time streaming** with bi-directional state synchronization
- **Transport agnostic** design (WebSockets, SSE, webhooks)
- **React integration** via CopilotKit libraries
- **Flexible middleware** for protocol compatibility

### 1.2 A2A Server Integration Points
- **Existing WebSocket infrastructure** can be leveraged
- **Agent-centric architecture** aligns with AG-UI model
- **Bimba metadata preservation** through Custom events
- **Message schema extensibility** supports AG-UI events

### 1.3 Current Data Flow Analysis
```
Frontend (BimbaUpdateOverlay) → HTTP API → A2A Server → Skill
    ↓                              ↓           ↓         ↓
Complete Node Data            Limited Params  Routing   Filtered Data
```

**Problem**: Data gets filtered/limited during HTTP API processing

### 1.4 Target Data Flow Architecture
```
Frontend (AG-UI Client) → A2A Server (AG-UI Gateway) → Skill (Complete Data)
    ↓                           ↓                        ↓
Complete Node Data         Event Routing            Full Context Analysis
Real-time Updates         State Management         Progress Streaming
```

**Solution**: Direct event-based data transfer with complete context

---

## 2. Implementation Strategy & Architecture

### 2.1 Three-Layer Integration Approach

#### Layer 1: Protocol Extension
- Extend A2A message schema with AG-UI event types
- Create Bimba-specific AG-UI events for node operations
- Implement event validation and routing mechanisms

#### Layer 2: Gateway Implementation
- Transform A2A server into AG-UI-compatible gateway
- Add event subscription and broadcasting capabilities
- Implement session management for multi-step interactions

#### Layer 3: Client Integration
- Replace HTTP-based communication with AG-UI WebSocket client
- Implement real-time progress visualization
- Add state synchronization for frontend-agent consistency

### 2.2 Event-Driven Data Architecture

#### Core Events for Bimba Operations
1. **BimbaNodeAnalysisRequest**: Frontend → Agent with complete node data
2. **BimbaAnalysisProgress**: Agent → Frontend with real-time updates
3. **BimbaUpdateSuggestions**: Agent → Frontend with analysis results
4. **BimbaContextUpdate**: Bi-directional context synchronization

#### Data Payload Structure
```typescript
BimbaNodeAnalysisRequest {
  coordinate: string,
  nodeData: {
    properties: Record<string, any>,     // COMPLETE properties
    relationships: Array<Relationship>  // ALL relationships
  },
  documentContent: string,
  analysisType: 'update-suggestions'
}
```

### 2.3 Backward Compatibility Strategy
- Maintain existing HTTP endpoints during transition
- Implement feature flags for AG-UI vs HTTP modes
- Provide fallback mechanisms for error scenarios
- Gradual migration path for other skills

---

## 3. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
**Objective**: Establish AG-UI protocol foundation in A2A server

**Deliverables**:
- Extended A2A message schema with AG-UI event types
- Basic AG-UI event routing in A2A server
- Event validation and error handling
- Testing framework for AG-UI events

**Key Files**:
- `a2a-message.schema.js` - Add AG-UI event types
- `ag-ui-event-schema.js` - New Bimba-specific events
- `a2a-server.js` - Add AG-UI event routing
- `ag-ui-gateway.js` - New AG-UI gateway component

**Success Criteria**:
- A2A server can receive and route AG-UI events
- Event validation prevents malformed messages
- Basic lifecycle events (RunStarted, RunFinished) working

### Phase 2: Agent Integration (Week 2-3)
**Objective**: Integrate Bimba Update Management Skill with AG-UI events

**Deliverables**:
- Modified skill to receive complete node data via AG-UI
- Progress reporting during LLM analysis
- Streaming of intermediate results
- Error handling with AG-UI error events

**Key Files**:
- `bimba-update-management-skill.js` - AG-UI integration
- `epii-agent-adapter.js` - AG-UI event emission
- `bimba-skills-router.js` - AG-UI event handling

**Success Criteria**:
- Skill receives complete node properties and relationships
- Real-time progress updates during analysis
- Proper error handling and reporting

### Phase 3: Frontend Client (Week 3-4)
**Objective**: Replace HTTP communication with AG-UI client

**Deliverables**:
- AG-UI WebSocket client service
- React hooks for AG-UI integration
- Modified BimbaUpdateOverlay with real-time updates
- Progress visualization components

**Key Files**:
- `aguiService.ts` - New AG-UI client service
- `useAGUIClient.ts` - React hook for AG-UI
- `BimbaUpdateOverlay.tsx` - AG-UI integration
- `ProgressIndicator.tsx` - Real-time progress display

**Success Criteria**:
- Frontend sends complete node data via AG-UI
- Real-time progress visualization
- Streaming analysis results display

### Phase 4: Testing & Optimization (Week 4-5)
**Objective**: Comprehensive testing and performance optimization

**Deliverables**:
- End-to-end testing suite
- Performance benchmarks
- Error scenario testing
- Documentation and migration guide

**Key Files**:
- `ag-ui-integration.test.js` - Test suite
- `performance-benchmarks.js` - Performance tests
- `AG-UI_Migration_Guide.md` - Documentation

**Success Criteria**:
- All tests passing
- Performance meets or exceeds HTTP baseline
- Complete documentation for future implementations

---

## 4. Technical Specifications

### 4.1 Event Schema Definitions

#### BimbaNodeAnalysisRequest Event
```typescript
{
  type: 'BimbaNodeAnalysisRequest',
  runId: string,
  threadId: string,
  coordinate: string,
  nodeData: {
    properties: Record<string, any>,
    relationships: Relationship[]
  },
  documentContent: string,
  documentType: 'bimba' | 'pratibimba',
  documentName: string,
  analysisType: 'update-suggestions',
  metadata: {
    bimbaCoordinates: string[],
    qlStage: number,
    contextFrame: string
  }
}
```

#### BimbaAnalysisProgress Event
```typescript
{
  type: 'BimbaAnalysisProgress',
  runId: string,
  stage: 'llm-analysis' | 'json-parsing' | 'validation',
  progress: number, // 0-100
  currentStep: string,
  estimatedTimeRemaining: number,
  intermediateResults?: object
}
```

#### BimbaUpdateSuggestions Event
```typescript
{
  type: 'BimbaUpdateSuggestions',
  runId: string,
  propertyUpdates: Record<string, any>,
  relationshipSuggestions: RelationshipSuggestion[],
  reasoning: string,
  qlAlignment: string,
  confidence: number,
  analysisMetadata: {
    llmModel: string,
    processingTime: number,
    tokenUsage: object
  }
}
```

### 4.2 A2A Server Extensions

#### AG-UI Gateway Component
- **Event Subscription Management**: Track client subscriptions to runs/threads
- **Event Broadcasting**: Route events to subscribed clients
- **Session Management**: Maintain state for multi-step interactions
- **Error Handling**: Graceful degradation and error reporting

#### Message Routing Logic
- **AG-UI Event Detection**: Identify AG-UI events in A2A messages
- **Skill Routing**: Route events to appropriate skills
- **Response Transformation**: Convert skill responses to AG-UI events
- **Metadata Preservation**: Maintain Bimba coordinates and QL context

### 4.3 Frontend Integration Points

#### BimbaUpdateOverlay Modifications
- **AG-UI Client Integration**: Replace HTTP calls with AG-UI events
- **Real-time Progress**: Display analysis progress as it happens
- **Streaming Results**: Show suggestions as they're generated
- **Error Handling**: Graceful error display and recovery

#### State Management
- **Event-Driven Updates**: Update UI based on AG-UI events
- **Optimistic Updates**: Show immediate feedback for user actions
- **Conflict Resolution**: Handle concurrent updates gracefully
- **Cache Synchronization**: Keep frontend cache in sync with agent state

---

## 5. Migration Strategy

### 5.1 Gradual Migration Approach
1. **Parallel Implementation**: Run AG-UI alongside existing HTTP
2. **Feature Flagging**: Control which users/features use AG-UI
3. **A/B Testing**: Compare performance and user experience
4. **Gradual Rollout**: Migrate users incrementally
5. **HTTP Deprecation**: Remove HTTP endpoints after full migration

### 5.2 Fallback Mechanisms
- **Connection Failure**: Fall back to HTTP if WebSocket fails
- **Event Timeout**: Retry with HTTP if AG-UI events timeout
- **Partial Functionality**: Degrade gracefully if some features fail
- **Error Recovery**: Automatic reconnection and state recovery

### 5.3 Data Consistency
- **State Synchronization**: Ensure frontend and agent state match
- **Conflict Resolution**: Handle simultaneous updates
- **Cache Invalidation**: Clear stale data appropriately
- **Audit Trail**: Log all state changes for debugging

---

## 6. Success Metrics & Validation

### 6.1 Performance Metrics
- **Data Completeness**: 100% of node properties and relationships transferred
- **Latency Reduction**: Faster analysis due to eliminated API calls
- **Real-time Updates**: Sub-second progress update delivery
- **Error Rate**: <1% event delivery failure rate

### 6.2 User Experience Metrics
- **Progress Visibility**: Users see analysis progress in real-time
- **Response Time**: Faster perceived performance due to streaming
- **Error Recovery**: Graceful handling of connection issues
- **Feature Adoption**: High usage of real-time features

### 6.3 Technical Metrics
- **Event Throughput**: Handle concurrent analysis requests
- **Memory Usage**: Efficient event handling and cleanup
- **Connection Stability**: Reliable WebSocket connections
- **Scalability**: Support for multiple concurrent users

---

## 7. Risk Assessment & Mitigation

### 7.1 Technical Risks
- **WebSocket Reliability**: Mitigation via automatic reconnection
- **Event Ordering**: Mitigation via sequence numbers and timestamps
- **Memory Leaks**: Mitigation via proper event cleanup
- **Browser Compatibility**: Mitigation via WebSocket polyfills

### 7.2 Integration Risks
- **A2A Compatibility**: Mitigation via extensive testing
- **Skill Compatibility**: Mitigation via backward compatibility
- **Frontend Complexity**: Mitigation via incremental implementation
- **State Synchronization**: Mitigation via conflict resolution

### 7.3 Operational Risks
- **Deployment Complexity**: Mitigation via staged rollout
- **Monitoring Gaps**: Mitigation via comprehensive logging
- **Performance Regression**: Mitigation via performance testing
- **User Training**: Mitigation via documentation and examples

---

## 8. Future Considerations

### 8.1 Scalability Planning
- **Multi-Agent Support**: Extend to other Bimba skills
- **Cross-Subsystem Integration**: Apply to #0-4 subsystems
- **Load Balancing**: Distribute AG-UI events across servers
- **Caching Strategy**: Optimize for high-frequency operations

### 8.2 Feature Extensions
- **Collaborative Editing**: Multiple users editing same node
- **Conflict Resolution**: Handle simultaneous modifications
- **Audit Trail**: Track all changes with full history
- **Undo/Redo**: Support for operation reversal

### 8.3 Integration Opportunities
- **BPMCP Integration**: Map tool calls to AG-UI events
- **Neo4j Streaming**: Real-time database change notifications
- **LLM Streaming**: Token-level response streaming
- **Document Collaboration**: Real-time document editing

---

## Conclusion

This implementation plan provides a comprehensive roadmap for integrating AG-UI protocol with the A2A server to solve the critical data limitation issue in the Bimba Update Management Skill. The phased approach ensures minimal disruption while delivering significant improvements in data completeness, real-time feedback, and user experience.

The key innovation is transforming the A2A server into an AG-UI gateway that preserves complete node context while enabling real-time streaming communication. This establishes a foundation for future agent integrations across all Bimba subsystems.

**Next Steps**: Begin Phase 1 implementation with A2A message schema extension and basic AG-UI event routing.

```typescript
/**
 * AG-UI Service for Frontend-to-Agent Communication
 * Replaces HTTP-based communication with real-time WebSocket events
 */

import { EventEmitter } from 'events';

interface AGUIEvent {
  type: string;
  runId?: string;
  threadId?: string;
  metadata?: {
    bimbaCoordinates?: string[];
    qlStage?: number;
    contextFrame?: string;
    timestamp?: string;
  };
  [key: string]: any;
}

interface BimbaNodeData {
  coordinate: string;
  properties: Record<string, any>;
  relationships: Array<{
    type: string;
    properties: Record<string, any>;
    direction: 'incoming' | 'outgoing';
    relatedNode: {
      coordinate: string;
      title?: string;
      labels: string[];
    };
  }>;
}

class AGUIService extends EventEmitter {
  private ws: WebSocket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentRunId: string | null = null;
  private currentThreadId: string | null = null;
  private subscriptions = new Set<string>();

  constructor() {
    super();
    this.connect();
  }

  private connect() {
    const wsUrl = import.meta.env.VITE_AGUI_WS_URL || 'ws://localhost:3033';
    console.log('[AGUIService] Connecting to AG-UI Gateway:', wsUrl);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('[AGUIService] Connected to AG-UI Gateway');
      this.connected = true;
      this.reconnectAttempts = 0;

      // Register as AG-UI client
      this.sendRegistration();

      // Re-subscribe to active runs/threads
      if (this.currentRunId || this.currentThreadId) {
        this.subscribe(this.currentRunId, this.currentThreadId);
      }

      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleServerMessage(message);
      } catch (error) {
        console.error('[AGUIService] Error parsing message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('[AGUIService] Connection closed');
      this.connected = false;
      this.handleReconnection();
      this.emit('disconnected');
    };

    this.ws.onerror = (error) => {
      console.error('[AGUIService] WebSocket error:', error);
      this.emit('error', error);
    };
  }

  private sendRegistration() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const registrationMessage = {
      type: 'registration',
      agentId: 'bimba-frontend-client',
      agentName: 'Bimba Frontend AG-UI Client',
      capabilities: ['agui-events', 'bimba-operations'],
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(registrationMessage));
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[AGUIService] Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('[AGUIService] Max reconnection attempts reached');
      this.emit('max-reconnects-reached');
    }
  }

  private handleServerMessage(message: AGUIEvent) {
    const { type } = message;

    // Emit specific event types
    switch (type) {
      case 'RunStarted':
        this.currentRunId = message.runId || null;
        this.currentThreadId = message.threadId || null;
        this.emit('analysis-started', message);
        break;
      case 'RunFinished':
        this.emit('analysis-finished', message);
        break;
      case 'RunError':
        this.emit('analysis-error', message);
        break;
      case 'StepStarted':
        this.emit('step-started', message);
        break;
      case 'StepFinished':
        this.emit('step-finished', message);
        break;
      case 'TextMessageStart':
        this.emit('text-stream-start', message);
        break;
      case 'TextMessageContent':
        this.emit('text-stream-content', message);
        break;
      case 'TextMessageEnd':
        this.emit('text-stream-end', message);
        break;
      case 'ToolCallStart':
        this.emit('tool-call-start', message);
        break;
      case 'ToolCallEnd':
        this.emit('tool-call-end', message);
        break;
      case 'StateDelta':
        this.emit('state-update', message);
        break;
      case 'BimbaAnalysisProgress':
        this.emit('bimba-analysis-progress', message);
        break;
      case 'BimbaUpdateSuggestions':
        this.emit('bimba-update-suggestions', message);
        break;
      case 'BimbaContextUpdate':
        this.emit('bimba-context-update', message);
        break;
      case 'QLStageTransition':
        this.emit('ql-stage-transition', message);
        break;
      default:
        this.emit('raw-event', message);
    }

    // Emit generic event for all messages
    this.emit('message', message);
  }

  public subscribe(runId?: string | null, threadId?: string | null) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const subscriptionMessage = {
      type: 'subscribe',
      runId,
      threadId,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(subscriptionMessage));

    if (runId) this.subscriptions.add(`run:${runId}`);
    if (threadId) this.subscriptions.add(`thread:${threadId}`);
  }

  public unsubscribe(runId?: string | null, threadId?: string | null) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const unsubscriptionMessage = {
      type: 'unsubscribe',
      runId,
      threadId,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(unsubscriptionMessage));

    if (runId) this.subscriptions.delete(`run:${runId}`);
    if (threadId) this.subscriptions.delete(`thread:${threadId}`);
  }

  /**
   * Request Bimba node analysis with complete data
   * This is the key method that solves the data limitation problem
   */
  public requestBimbaNodeAnalysis(
    coordinate: string,
    nodeData: BimbaNodeData,
    documentContent: string,
    documentType: string = 'bimba',
    documentName: string = 'unknown'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('AG-UI service not connected'));
        return;
      }

      const runId = this.generateUUID();
      const threadId = this.generateUUID();

      // Set up one-time listeners for this specific analysis
      const timeout = setTimeout(() => {
        reject(new Error('Analysis request timeout'));
      }, 60000); // 60 second timeout

      const handleAnalysisStarted = (event: AGUIEvent) => {
        if (event.runId === runId) {
          clearTimeout(timeout);
          resolve(runId);
          this.off('analysis-started', handleAnalysisStarted);
        }
      };

      const handleAnalysisError = (event: AGUIEvent) => {
        if (event.runId === runId) {
          clearTimeout(timeout);
          reject(new Error(event.message || 'Analysis failed'));
          this.off('analysis-error', handleAnalysisError);
        }
      };

      this.on('analysis-started', handleAnalysisStarted);
      this.on('analysis-error', handleAnalysisError);

      // Send the analysis request with COMPLETE node data
      const analysisRequest = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'executeSkill',
        params: {
          skillId: 'bimba-update-management',
          parameters: {
            coordinate,
            nodeProperties: nodeData.properties,     // COMPLETE properties
            relationships: nodeData.relationships,   // COMPLETE relationships
            documentContent,
            documentType,
            documentName,
            // AG-UI specific metadata
            aguiRunId: runId,
            aguiThreadId: threadId,
            aguiEventType: 'BimbaNodeAnalysisRequest'
          },
          context: {
            agentId: 'bimba-frontend-client',
            targetCoordinate: coordinate,
            requestType: 'bimba-update-suggestions',
            aguiMetadata: {
              runId,
              threadId,
              eventType: 'BimbaNodeAnalysisRequest'
            }
          }
        }
      };

      console.log('[AGUIService] Sending Bimba analysis request:', {
        coordinate,
        propertiesCount: Object.keys(nodeData.properties).length,
        relationshipsCount: nodeData.relationships.length,
        documentLength: documentContent.length,
        runId
      });

      this.ws.send(JSON.stringify(analysisRequest));

      // Subscribe to this run
      this.subscribe(runId, threadId);
    });
  }

  public sendMessage(message: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[AGUIService] Cannot send message - not connected');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('[AGUIService] Error sending message:', error);
      return false;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Singleton instance
export const aguiService = new AGUIService();
export default aguiService;
```

### 3.2 React Hook for AG-UI Integration

**File:** `epii_app/friendly-file-front/src/hooks/useAGUIClient.ts`

```typescript
/**
 * React Hook for AG-UI Client Integration
 * Provides reactive state management for AG-UI events
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { aguiService } from '../services/aguiService';

interface AGUIClientState {
  connected: boolean;
  currentRunId: string | null;
  analysisProgress: {
    stage?: string;
    progress?: number;
    currentStep?: string;
    estimatedTimeRemaining?: number;
  } | null;
  streamingText: {
    messageId?: string;
    content: string;
  } | null;
  toolCalls: Array<{
    id: string;
    name: string;
    status: 'running' | 'completed' | 'error';
    startTime: Date;
    endTime?: Date;
  }>;
  suggestions: {
    propertyUpdates: Record<string, any>;
    relationshipSuggestions: Array<any>;
    reasoning?: string;
    qlAlignment?: string;
  } | null;
  error: string | null;
}

interface UseAGUIClientOptions {
  onAnalysisStarted?: (runId: string) => void;
  onAnalysisFinished?: (result: any) => void;
  onAnalysisError?: (error: string) => void;
  onProgressUpdate?: (progress: any) => void;
  onSuggestionsReceived?: (suggestions: any) => void;
}

export function useAGUIClient(options: UseAGUIClientOptions = {}) {
  const [state, setState] = useState<AGUIClientState>({
    connected: false,
    currentRunId: null,
    analysisProgress: null,
    streamingText: null,
    toolCalls: [],
    suggestions: null,
    error: null
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Connection management
  useEffect(() => {
    const handleConnected = () => {
      setState(prev => ({ ...prev, connected: true, error: null }));
    };

    const handleDisconnected = () => {
      setState(prev => ({ ...prev, connected: false }));
    };

    const handleError = (error: any) => {
      setState(prev => ({ ...prev, error: error.message || 'Connection error' }));
    };

    aguiService.on('connected', handleConnected);
    aguiService.on('disconnected', handleDisconnected);
    aguiService.on('error', handleError);

    // Set initial connection state
    setState(prev => ({ ...prev, connected: aguiService.isConnected() }));

    return () => {
      aguiService.off('connected', handleConnected);
      aguiService.off('disconnected', handleDisconnected);
      aguiService.off('error', handleError);
    };
  }, []);

  // Analysis lifecycle events
  useEffect(() => {
    const handleAnalysisStarted = (event: any) => {
      setState(prev => ({
        ...prev,
        currentRunId: event.runId,
        analysisProgress: { stage: 'started', progress: 0 },
        error: null
      }));
      optionsRef.current.onAnalysisStarted?.(event.runId);
    };

    const handleAnalysisFinished = (event: any) => {
      setState(prev => ({
        ...prev,
        analysisProgress: { stage: 'completed', progress: 100 },
        currentRunId: null
      }));
      optionsRef.current.onAnalysisFinished?.(event);
    };

    const handleAnalysisError = (event: any) => {
      setState(prev => ({
        ...prev,
        error: event.message || 'Analysis failed',
        currentRunId: null,
        analysisProgress: null
      }));
      optionsRef.current.onAnalysisError?.(event.message);
    };

    aguiService.on('analysis-started', handleAnalysisStarted);
    aguiService.on('analysis-finished', handleAnalysisFinished);
    aguiService.on('analysis-error', handleAnalysisError);

    return () => {
      aguiService.off('analysis-started', handleAnalysisStarted);
      aguiService.off('analysis-finished', handleAnalysisFinished);
      aguiService.off('analysis-error', handleAnalysisError);
    };
  }, []);

  // Progress tracking
  useEffect(() => {
    const handleStepStarted = (event: any) => {
      setState(prev => ({
        ...prev,
        analysisProgress: {
          ...prev.analysisProgress,
          currentStep: event.stepName,
          stage: 'running'
        }
      }));
    };

    const handleStepFinished = (event: any) => {
      setState(prev => ({
        ...prev,
        analysisProgress: {
          ...prev.analysisProgress,
          currentStep: undefined
        }
      }));
    };

    const handleBimbaProgress = (event: any) => {
      setState(prev => ({
        ...prev,
        analysisProgress: {
          ...prev.analysisProgress,
          stage: event.stage,
          progress: event.progress,
          currentStep: event.currentStep,
          estimatedTimeRemaining: event.estimatedTimeRemaining
        }
      }));
      optionsRef.current.onProgressUpdate?.(event);
    };

    aguiService.on('step-started', handleStepStarted);
    aguiService.on('step-finished', handleStepFinished);
    aguiService.on('bimba-analysis-progress', handleBimbaProgress);

    return () => {
      aguiService.off('step-started', handleStepStarted);
      aguiService.off('step-finished', handleStepFinished);
      aguiService.off('bimba-analysis-progress', handleBimbaProgress);
    };
  }, []);

  // Text streaming
  useEffect(() => {
    const handleTextStreamStart = (event: any) => {
      setState(prev => ({
        ...prev,
        streamingText: { messageId: event.messageId, content: '' }
      }));
    };

    const handleTextStreamContent = (event: any) => {
      setState(prev => ({
        ...prev,
        streamingText: prev.streamingText ? {
          ...prev.streamingText,
          content: prev.streamingText.content + (event.delta || '')
        } : null
      }));
    };

    const handleTextStreamEnd = (event: any) => {
      setState(prev => ({ ...prev, streamingText: null }));
    };

    aguiService.on('text-stream-start', handleTextStreamStart);
    aguiService.on('text-stream-content', handleTextStreamContent);
    aguiService.on('text-stream-end', handleTextStreamEnd);

    return () => {
      aguiService.off('text-stream-start', handleTextStreamStart);
      aguiService.off('text-stream-content', handleTextStreamContent);
      aguiService.off('text-stream-end', handleTextStreamEnd);
    };
  }, []);

  // Tool call tracking
  useEffect(() => {
    const handleToolCallStart = (event: any) => {
      setState(prev => ({
        ...prev,
        toolCalls: [...prev.toolCalls, {
          id: event.toolCallId,
          name: event.toolCallName,
          status: 'running',
          startTime: new Date()
        }]
      }));
    };

    const handleToolCallEnd = (event: any) => {
      setState(prev => ({
        ...prev,
        toolCalls: prev.toolCalls.map(call =>
          call.id === event.toolCallId
            ? { ...call, status: 'completed', endTime: new Date() }
            : call
        )
      }));
    };

    aguiService.on('tool-call-start', handleToolCallStart);
    aguiService.on('tool-call-end', handleToolCallEnd);

    return () => {
      aguiService.off('tool-call-start', handleToolCallStart);
      aguiService.off('tool-call-end', handleToolCallEnd);
    };
  }, []);

  // Suggestions handling
  useEffect(() => {
    const handleSuggestions = (event: any) => {
      setState(prev => ({
        ...prev,
        suggestions: {
          propertyUpdates: event.propertyUpdates || {},
          relationshipSuggestions: event.relationshipSuggestions || [],
          reasoning: event.reasoning,
          qlAlignment: event.qlAlignment
        }
      }));
      optionsRef.current.onSuggestionsReceived?.(event);
    };

    aguiService.on('bimba-update-suggestions', handleSuggestions);

    return () => {
      aguiService.off('bimba-update-suggestions', handleSuggestions);
    };
  }, []);

  // API methods
  const requestBimbaAnalysis = useCallback(async (
    coordinate: string,
    nodeData: any,
    documentContent: string,
    documentType?: string,
    documentName?: string
  ) => {
    try {
      const runId = await aguiService.requestBimbaNodeAnalysis(
        coordinate,
        nodeData,
        documentContent,
        documentType,
        documentName
      );
      return runId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Analysis request failed'
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSuggestions = useCallback(() => {
    setState(prev => ({ ...prev, suggestions: null }));
  }, []);

  return {
    ...state,
    requestBimbaAnalysis,
    clearError,
    clearSuggestions,
    isConnected: state.connected
  };
}
```
