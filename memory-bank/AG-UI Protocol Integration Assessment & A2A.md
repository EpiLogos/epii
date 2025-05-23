AG-UI Protocol Integration Assessment & Strategy
Executive Summary
The AG-UI (Agent-User Interaction) protocol presents a significant opportunity to enhance our fully agentic app development vision by providing standardized, real-time communication between our agents and frontend. The protocol aligns well with our existing A2A framework and can dramatically improve user experience through streaming interactions and real-time progress feedback.

1. Understanding AG-UI Protocol
Core Capabilities
AG-UI is an open, lightweight, event-based protocol that standardizes agent-frontend connections with:

16 Standard Event Types organized into 5 categories:
Lifecycle Events (RunStarted, RunFinished, RunError, StepStarted, StepFinished)
Text Message Events (TextMessageStart, TextMessageContent, TextMessageEnd)
Tool Call Events (ToolCallStart, ToolCallArgs, ToolCallEnd)
State Management Events (StateSnapshot, StateDelta, MessagesSnapshot)
Special Events (Raw, Custom)
Key Features:
Real-time streaming communication
Bi-directional state synchronization
Transport agnostic (WebSockets, SSE, webhooks)
React client libraries via CopilotKit
Flexible middleware for compatibility
2. Current Architecture Analysis
Integration Points Identified
Strengths for AG-UI Integration:

A2A Server: Already has WebSocket infrastructure and agent communication framework
BPMCP: Existing WebSocket transport for tool calls that can be mapped to AG-UI ToolCall events
Agent Adapters: Natural place to emit AG-UI events during agent task processing
Frontend Components: Epii mode components ready for real-time updates
Current Gaps AG-UI Could Fill:

No real-time progress feedback during analysis pipeline execution
Limited visibility into agent tool usage for users
No standardized streaming for LLM responses
Frontend-backend state synchronization challenges
Compatibility Assessment
Excellent Compatibility:

Our A2A message schema can be extended to support AG-UI events
Existing WebSocket infrastructure can be leveraged
Agent-centric architecture aligns with AG-UI's agent-user interaction model
Bimba metadata can be preserved through AG-UI's Custom events and metadata fields
3. Recommended Integration Strategy
Option 1: AG-UI as A2A Extension (Recommended)
Architecture:
Frontend (AG-UI Client) ←→ A2A Server (AG-UI Compatible) ←→ Agents
                                    ↓
                               BPMCP (Tool Events)

Benefits:

Leverages existing WebSocket infrastructure
Preserves A2A agent communication patterns
Natural integration point through agent adapters
Maintains Bimba architecture alignment
A2A to AG-UI Event Mapping
A2A Message Type	AG-UI Event	Use Case
request	RunStarted	Agent receives task
inform (progress)	StepStarted/StepFinished	Pipeline stage updates
inform (text)	TextMessage*	Streaming LLM responses
inform (tool)	ToolCall*	BPMCP tool usage
failure	RunError	Error conditions
agree	RunFinished	Task completion
4. Epii Agent Implementation Example
Analysis Pipeline AG-UI Integration
epii_app/friendly-file-backend/pipelines
// Enhanced pipeline with AG-UI events
async function runAnalysisPipeline(documentId, options = {}) {
  const runId = uuidv4();

  // Emit RunStarted
  emitAGUIEvent({
    type: 'RunStarted',
    runId,
    threadId: options.conversationId
  });

  try {
    // Stage -5: Document Fetch
    emitAGUIEvent({
      type: 'StepStarted',
      stepName: 'document-fetch'
    });

    const document = await stage_minus5(documentId);

    emitAGUIEvent({
      type: 'StepFinished',
      stepName: 'document-fetch'
    });

    // Continue with other stages...

    emitAGUIEvent({
      type: 'RunFinished',
      runId
    });

  } catch (error) {
    emitAGUIEvent({
      type: 'RunError',
      message: error.message,
      code: 'ANALYSIS_ERROR'
    });
  }
}
5. Frontend Integration Strategy
CopilotKit Integration Assessment
Pros:

Ready-made React hooks for AG-UI communication
Built-in UI components for streaming chat
Handles WebSocket connection management
Active community and documentation
Considerations:

Need to ensure compatibility with our Bimba metadata
May require customization for multi-agent scenarios
Should preserve our existing component architecture
Component Enhancement Plan
EpiiModePage Enhancements:

Real-time analysis progress visualization
Streaming chat responses
Live tool call visibility
State synchronization with backend
Key Components to Update:

DocumentChat: Replace HTTP polling with AG-UI streaming
DocumentControls: Show real-time analysis progress
AnalysisVisualizer: Update with streaming results
webSocketService: Replace with AG-UI client
6. Implementation Roadmap
Phase 1: A2A Server AG-UI Extension (2-3 weeks)
Deliverables:

Extended A2A message schema with AG-UI event types
Modified agent adapters to emit AG-UI events
Basic lifecycle events implementation
Testing framework for AG-UI events
Key Files to Modify:

a2a-message.schema.js: Add AG-UI event types
epii-agent-adapter.js: Add AG-UI event emission
a2a-server.js: Add AG-UI event routing
Phase 2: Epii Pipeline Integration (2-3 weeks)
Deliverables:

Pipeline stages emit AG-UI events
BPMCP tool calls mapped to ToolCall events
LLM response streaming via TextMessage events
State management with StateSnapshot/StateDelta
Key Files to Modify:

epii_analysis_pipeline_refactored.mjs: Add event emission
stage_minus*.mjs: Add step events
bpWebSocketClient.mjs: Add tool call event mapping
Phase 3: Frontend AG-UI Client (2-3 weeks)
Deliverables:

CopilotKit or custom AG-UI client integration
Updated Epii components for streaming
Real-time progress visualization
Error handling and reconnection logic
Key Files to Modify:

webSocketService.ts: Replace with AG-UI client
EpiiModePage.tsx: Add real-time updates
DocumentChat.tsx: Implement streaming chat
DocumentControls.tsx: Add progress indicators
Phase 4: Enhanced Features (2-3 weeks)
Deliverables:

Custom events for Bimba-specific functionality
Multi-agent coordination support
Advanced UI features (typing indicators, progress bars)
MessagesSnapshot for chat history sync
Phase 5: Testing and Documentation (1-2 weeks)
Deliverables:

End-to-end testing suite
Performance optimization
Documentation and examples
Migration guide for future agents
7. Challenges and Mitigation Strategies
Challenge 1: Bimba Metadata Preservation
Solution: Use AG-UI Custom events and extend standard events with Bimba metadata fields

Challenge 2: Multi-Agent Coordination
Solution: Implement agent routing in A2A server, use agent identification in AG-UI events

Challenge 3: BPMCP Tool Integration
Solution: Agent adapters translate BPMCP calls to AG-UI ToolCall events with streaming support

Challenge 4: State Synchronization Complexity
Solution: Implement careful state management with StateDelta events and conflict resolution

8. Benefits and Expected Outcomes
Immediate Benefits
Real-time User Feedback: Users see analysis progress as it happens
Enhanced Transparency: Tool usage and agent actions are visible
Improved Responsiveness: Streaming responses instead of waiting for completion
Standardized Communication: Consistent protocol across all agents
Long-term Benefits
Scalable Agent Integration: Easy to add new agents with AG-UI support
Enhanced User Experience: More engaging and interactive agent interactions
Better Debugging: Real-time visibility into agent operations
Future-Proof Architecture: Alignment with emerging agent-UI standards
9. Recommendations
Immediate Actions
Start with Phase 1: Extend A2A server with basic AG-UI event support
Prototype Integration: Create a simple demo showing AG-UI events from Epii agent
Evaluate CopilotKit: Assess compatibility with our Bimba architecture
Plan Resource Allocation: Assign team members to each phase
Strategic Considerations
Preserve Bimba Architecture: Ensure AG-UI integration enhances rather than replaces our coordinate system
Maintain A2A Compatibility: Keep agent-to-agent communication separate from agent-to-user
Plan for Scale: Design integration to support future agents (#0-4 subsystems)
Document Patterns: Create templates for future agent AG-UI integrations
This integration strategy positions us to significantly enhance our user experience while maintaining the integrity of our Bimba architecture and preparing for future agent developments. The AG-UI protocol provides exactly the standardization and real-time capabilities needed to realize our fully agentic app development vision.

---

# Detailed Epii Agent A2A & AG-UI Alignment Plan

## Executive Summary

This section provides a comprehensive plan to bring the current Epii agent system into full alignment with both A2A (Agent-to-Agent) and AG-UI (Agent-User Interaction) protocols. The Epii agent, as our most developed agent system, will serve as the template and foundation for future agent developments in the #0-4 subsystems.

## Current Epii System Architecture Analysis

### Backend Components

#### 1. Epii Expert Agent (`epii.expert.agent.mjs`)
**Current State:**
- Primary implementation file for the Epii Expert Agent at `epii_app/friendly-file-backend/subsystems/5_epii/epii.expert.agent.mjs`
- Implements LangChain-based agent with Google Generative AI
- Provides tools for BPMCP integration, LightRAG retrieval, and Notion operations
- Handles chat messages and document analysis via `epii-agent.service.mjs` wrapper
- Uses HTTP-based API communication

**A2A Alignment Needed:**
- Core agent logic modifications should target `epii.expert.agent.mjs` as the primary implementation
- Convert to A2A message-based communication through enhanced service wrapper
- Implement agent registration and capability advertisement
- Add task state management with QL transitions
- Integrate with A2A server for agent-to-agent communication

**AG-UI Alignment Needed:**
- Emit AG-UI events during tool usage and processing from core agent logic
- Stream LLM responses via TextMessage events
- Provide real-time progress updates during analysis
- Implement state synchronization with frontend
- Coordinate with `epii-agent.service.mjs` for event emission wrapper functionality

#### 2. Epii Analysis Pipeline (`epii_analysis_pipeline_refactored.mjs`)
**Current State:**
- Located at `epii_app/friendly-file-backend/pipelines/epii_analysis_pipeline_refactored.mjs`
- 6-stage pipeline following QL (-) cycle (stages -5 to -0)
- Sequential processing with error handling
- Returns final results after completion
- No real-time progress feedback
- Associated stage files: `stages/stage_minus*.mjs` in pipeline subdirectory

**Proposed Refactored Location:**
- Target location: `epii_app/friendly-file-backend/subsystems/5_epii/pipeline/epii_analysis_pipeline_refactored.mjs`
- Stage files: `epii_app/friendly-file-backend/subsystems/5_epii/pipeline/stages/stage_minus*.mjs`
- This aligns with Bimba architecture placing agent-specific logic in subsystem directories

**A2A Alignment Needed:**
- Each stage should emit A2A progress messages
- Pipeline should be invokable via A2A task requests
- Results should be communicated via A2A inform messages
- Error handling should use A2A failure messages

**AG-UI Alignment Needed:**
- Emit RunStarted at pipeline beginning
- Emit StepStarted/StepFinished for each stage
- Stream intermediate results via TextMessage events
- Emit ToolCall events for BPMCP tool usage
- Provide StateSnapshot/StateDelta for progress tracking
- Emit RunFinished/RunError at completion

#### 3. BPMCP Integration
**Current State:**
- WebSocket-based tool calling via bpWebSocketClient
- Direct tool invocation without event emission
- No visibility into tool execution progress

**A2A Alignment Needed:**
- Tool calls should be wrapped in A2A inform messages
- Tool results should be communicated back via A2A
- Tool errors should use A2A failure messages

**AG-UI Alignment Needed:**
- Emit ToolCallStart when invoking BPMCP tools
- Stream ToolCallArgs for complex tool parameters
- Emit ToolCallEnd when tool execution completes
- Provide error details via RunError events

### #5-4 Back2Front Integration Layer Refactoring

#### Current Structure Analysis
**Current State:**
- Located at `epii_app/friendly-file-back2front/` (designated as #5-4 "Siva-Shakti" integration layer)
- Core A2A files at root level: `a2a-server.js`, `a2a-message.schema.js`, `task-state-manager.js`
- Mixed concerns with adapters, agent-cards, and skills at same level
- No clear separation between A2A and AG-UI specific components

**Proposed Refactored Structure:**
```
epii_app/friendly-file-back2front/ (#5-4 "Siva-Shakti" Integration Layer)
├── a2a/                              # A2A core components
│   ├── a2a-server.js                 # (Moved from root)
│   ├── a2a-message.schema.js         # (Moved from root)
│   ├── task-state-manager.js         # (Moved from root)
│   ├── a2a-client.service.js         # (Moved from root)
│   └── integration.js                # (Updated paths to reference new structure)
├── ag-ui/                            # AG-UI specific components
│   ├── ag-ui-websocket-handler.js    # New: Centralized AG-UI WebSocket gateway
│   ├── ag-ui-event-definitions.js    # New: Project-specific AG-UI event extensions
│   ├── ag-ui-event-emitter.js        # New: Utility for emitting AG-UI events
│   └── README.md                     # AG-UI components documentation
├── adapters/
│   ├── epii-agent-adapter.js         # Enhanced EpiiAgentAdapter implementation
│   └── nara-agent-adapter.js         # Future agent adapters
├── agent-cards/
│   ├── epii-agent-card.js            # Enhanced with complete skill schemas
│   └── index.js                      # Updated agent registry
├── skills/
│   └── ...                           # Existing skills structure
└── README.md                         # Updated to reflect new structure
```

**Benefits of Refactored Structure:**
- Clear separation of A2A and AG-UI concerns
- Centralized AG-UI event handling through dedicated gateway
- Scalable structure for future agent integrations
- Better organization aligned with protocol responsibilities

### Frontend Components

#### 1. EpiiModePage (`EpiiModePage.tsx`)
**Current State:**
- Main integration page combining chat, canvas, and sidebar
- Uses HTTP API calls for backend communication
- Static state management without real-time updates
- Manual refresh required for state changes

**A2A Alignment Needed:**
- Connect to A2A server for agent communication
- Handle agent registration and capability discovery
- Manage multiple agent interactions if needed

**AG-UI Alignment Needed:**
- Replace HTTP polling with AG-UI WebSocket client
- Handle real-time event streams from agents
- Update UI components based on AG-UI events
- Implement error handling and reconnection logic

#### 2. DocumentCanvas (`DocumentCanvas.tsx`)
**Current State:**
- Document editing and analysis interface
- Manual analysis triggering via DocumentControls
- Static display of analysis results
- No real-time progress feedback

**A2A Alignment Needed:**
- Analysis requests should go through A2A protocol
- Document state should be synchronized via A2A

**AG-UI Alignment Needed:**
- Display real-time analysis progress
- Show streaming analysis results as they're generated
- Update document state based on StateDelta events
- Provide visual feedback for tool usage

#### 3. EpiiChat (`EpiiChat.tsx`)
**Current State:**
- HTTP-based chat with backend
- Static message display
- No streaming responses
- Manual message sending

**A2A Alignment Needed:**
- Chat messages should be sent via A2A protocol
- Support for multi-agent conversations if needed

**AG-UI Alignment Needed:**
- Implement streaming chat responses via TextMessage events
- Show typing indicators during response generation
- Display tool usage in chat interface
- Real-time message synchronization

#### 4. DocumentControls (`DocumentControls.tsx`)
**Current State:**
- Manual analysis triggering
- Static progress indicators
- No real-time feedback

**A2A Alignment Needed:**
- Analysis requests via A2A task messages
- Status updates via A2A inform messages

**AG-UI Alignment Needed:**
- Real-time progress bars during analysis
- Live status updates for each pipeline stage
- Tool usage visualization
- Error handling with user feedback

#### 5. AnalysisVisualizer (`AnalysisVisualizer.tsx`)
**Current State:**
- Static display of completed analysis results
- No real-time updates
- Manual refresh required

**A2A Alignment Needed:**
- Results delivered via A2A inform messages
- Support for incremental result updates

**AG-UI Alignment Needed:**
- Stream analysis results as they're generated
- Update visualizations in real-time
- Show progress through analysis stages
- Handle partial results gracefully

## Detailed Implementation Plan

### Phase 1: A2A Integration Foundation (Week 1-2)

#### 1.1 Directory Refactoring and A2A Foundation
**Files to Create/Move:**
- Create `epii_app/friendly-file-back2front/a2a/` directory
- Move `a2a-server.js` → `epii_app/friendly-file-back2front/a2a/a2a-server.js`
- Move `a2a-message.schema.js` → `epii_app/friendly-file-back2front/a2a/a2a-message.schema.js`
- Move `task-state-manager.js` → `epii_app/friendly-file-back2front/a2a/task-state-manager.js`
- Create `epii_app/friendly-file-back2front/ag-ui/` directory
- Create `epii_app/friendly-file-back2front/ag-ui/ag-ui-websocket-handler.js`
- Create `epii_app/friendly-file-back2front/ag-ui/ag-ui-event-definitions.js`

#### 1.2 Epii Agent A2A Registration
**Files to Modify:**
- `epii_app/friendly-file-back2front/adapters/epii-agent-adapter.js` - Enhance with full agent lifecycle
- `epii_app/friendly-file-back2front/agent-cards/epii-agent-card.js` - Complete agent capability definition
- `epii_app/friendly-file-back2front/a2a/a2a-server.js` - Add Epii agent registration handling
- `epii_app/friendly-file-backend/subsystems/5_epii/epii.expert.agent.mjs` - Core agent logic coordination

**Implementation Steps:**
1. **Enhanced Agent Card Definition:**
```javascript
const epiiAgentCard = {
  id: "epii-agent",
  name: "Epii Agent",
  description: "Recursive synthesis and document analysis agent (#5)",
  subsystemCoordinate: "#5",
  capabilities: {
    streaming: true,
    documentAnalysis: true,
    notionIntegration: true,
    bimbaKnowing: true,
    lightragRetrieval: true,
    stateTransitionHistory: true
  },
  skills: [
    {
      id: "document-analysis",
      name: "Document Analysis Pipeline",
      description: "6-stage QL analysis pipeline for documents",
      bimbaCoordinate: "#5-2",
      inputSchema: {
        documentId: "string",
        targetCoordinate: "string",
        graphData: "object"
      },
      outputSchema: {
        analysisResults: "object",
        notionPayload: "object",
        sessionId: "string"
      }
    },
    {
      id: "epii-chat",
      name: "Epii Chat Interface",
      description: "Contextual chat with document analysis integration",
      bimbaCoordinate: "#5-4",
      inputSchema: {
        message: "string",
        documentContext: "object",
        analysisSessionId: "string"
      }
    },
    {
      id: "bimba-knowing",
      name: "Bimba Knowledge Retrieval",
      description: "QL-aware knowledge graph querying",
      bimbaCoordinate: "#5-1"
    }
  ]
};
```

2. **Enhanced Agent Adapter Implementation:**
```javascript
// epii_app/friendly-file-back2front/adapters/epii-agent-adapter.js
const { TaskStateManager } = require('../a2a/task-state-manager');
const { AGUIWebSocketGateway } = require('../ag-ui/ag-ui-websocket-handler');
const { createAGUIEvent, AGUIEventTypes } = require('../ag-ui/ag-ui-event-definitions');

class EpiiAgentAdapter {
  constructor() {
    this.agentId = 'epii-agent';
    this.aguiGateway = null; // Will be injected
    this.epiiExpertAgent = null; // Reference to core agent
  }

  setAGUIGateway(gateway) {
    this.aguiGateway = gateway;
  }

  setEpiiExpertAgent(agent) {
    this.epiiExpertAgent = agent;
  }

  async handleTask(task, updateCallback) {
    const taskManager = new TaskStateManager(task.id);

    // Set initial QL stage and Bimba context
    taskManager.setQLStage(0, 'A-logos');
    taskManager.setBimbaCoordinates(task.metadata?.bimbaCoordinates || ['#5']);

    // Emit AG-UI RunStarted event
    this.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_STARTED, {
      runId: task.id,
      threadId: task.metadata?.conversationId || task.id
    }, {
      bimbaCoordinates: task.metadata?.bimbaCoordinates || ['#5'],
      qlStage: 0
    }));

    try {
      // Route task based on skill requested
      switch (task.content.skill) {
        case 'document-analysis':
          return await this.handleDocumentAnalysis(task, taskManager, updateCallback);
        case 'epii-chat':
          return await this.handleEpiiChat(task, taskManager, updateCallback);
        case 'bimba-knowing':
          return await this.handleBimbaKnowing(task, taskManager, updateCallback);
        default:
          throw new Error(`Unknown skill: ${task.content.skill}`);
      }
    } catch (error) {
      taskManager.setError(error.message);

      // Emit AG-UI RunError event
      this.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_ERROR, {
        runId: task.id,
        message: error.message,
        code: 'TASK_ERROR'
      }));

      updateCallback(taskManager.getTask());
      throw error;
    }
  }

  emitAGUIEvent(event) {
    if (this.aguiGateway) {
      this.aguiGateway.emitAGUIEvent(event);
    }
  }

  async handleDocumentAnalysis(task, taskManager, updateCallback) {
    const { documentId, targetCoordinate, graphData } = task.content;

    // Update task state
    taskManager.setQLStage(1, 'Logos');
    taskManager.addBimbaCoordinate(targetCoordinate);
    updateCallback(taskManager.getTask());

    // Call the analysis pipeline
    const result = await this.epiiAgentService.runAnalysisPipeline({
      documentId,
      targetCoordinate,
      graphData,
      taskId: task.id,
      updateCallback: (stage, progress) => {
        taskManager.setQLStage(stage + 2, this.getQLStageName(stage + 2));
        taskManager.addArtifact({
          type: 'stage_progress',
          stage: stage,
          progress: progress,
          timestamp: new Date().toISOString()
        });
        updateCallback(taskManager.getTask());
      }
    });

    // Final state update
    taskManager.setQLStage(5, 'Epii');
    taskManager.addArtifact({
      type: 'analysis_complete',
      result: result,
      timestamp: new Date().toISOString()
    });

    return result;
  }
}
```

#### 1.3 AG-UI WebSocket Gateway Implementation
**Files to Create:**
- `epii_app/friendly-file-back2front/ag-ui/ag-ui-websocket-handler.js` - Centralized AG-UI event gateway

**Implementation Steps:**
1. **Centralized AG-UI WebSocket Gateway:**
```javascript
// ag-ui-websocket-handler.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

class AGUIWebSocketGateway {
  constructor(options = {}) {
    this.port = options.port || 3034; // Separate port from A2A server
    this.clients = new Map(); // Map of client connections
    this.subscriptions = new Map(); // Map of runId/threadId subscriptions
    this.server = null;
  }

  start() {
    this.server = new WebSocket.Server({ port: this.port });

    this.server.on('connection', (ws) => {
      const clientId = uuidv4();
      this.clients.set(clientId, {
        ws,
        subscriptions: new Set()
      });

      ws.on('message', (message) => {
        this.handleClientMessage(clientId, JSON.parse(message));
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
      });

      // Send connection confirmation
      ws.send(JSON.stringify({
        type: 'connection',
        clientId,
        message: 'Connected to AG-UI Gateway'
      }));
    });

    console.log(`AG-UI WebSocket Gateway running on port ${this.port}`);
  }

  handleClientMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Handle subscription requests
    if (message.type === 'subscribe') {
      const { runId, threadId } = message;
      if (runId) client.subscriptions.add(`run:${runId}`);
      if (threadId) client.subscriptions.add(`thread:${threadId}`);
    }
  }

  // Method for agents to emit AG-UI events
  emitAGUIEvent(event) {
    const { runId, threadId, type } = event;

    // Find subscribed clients
    const targetClients = [];

    for (const [clientId, client] of this.clients) {
      const shouldReceive =
        (runId && client.subscriptions.has(`run:${runId}`)) ||
        (threadId && client.subscriptions.has(`thread:${threadId}`)) ||
        (!runId && !threadId); // Broadcast if no specific targeting

      if (shouldReceive) {
        targetClients.push(client.ws);
      }
    }

    // Send event to target clients
    const eventMessage = JSON.stringify({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    });

    targetClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(eventMessage);
      }
    });
  }
}

module.exports = AGUIWebSocketGateway;
```

2. **AG-UI Event Definitions:**
```javascript
// ag-ui-event-definitions.js
const AGUIEventTypes = {
  // Standard AG-UI events
  RUN_STARTED: 'RunStarted',
  RUN_FINISHED: 'RunFinished',
  RUN_ERROR: 'RunError',
  STEP_STARTED: 'StepStarted',
  STEP_FINISHED: 'StepFinished',
  TEXT_MESSAGE_START: 'TextMessageStart',
  TEXT_MESSAGE_CONTENT: 'TextMessageContent',
  TEXT_MESSAGE_END: 'TextMessageEnd',
  TOOL_CALL_START: 'ToolCallStart',
  TOOL_CALL_ARGS: 'ToolCallArgs',
  TOOL_CALL_END: 'ToolCallEnd',
  STATE_SNAPSHOT: 'StateSnapshot',
  STATE_DELTA: 'StateDelta',
  MESSAGES_SNAPSHOT: 'MessagesSnapshot',

  // Bimba-specific custom events
  BIMBA_CONTEXT_UPDATE: 'BimbaContextUpdate',
  QL_STAGE_TRANSITION: 'QLStageTransition',
  COORDINATE_CHANGE: 'CoordinateChange'
};

// Event factory functions with Bimba metadata support
const createAGUIEvent = (type, payload, bimbaMetadata = {}) => ({
  type,
  ...payload,
  metadata: {
    ...payload.metadata,
    bimbaCoordinates: bimbaMetadata.bimbaCoordinates || [],
    qlStage: bimbaMetadata.qlStage,
    contextFrame: bimbaMetadata.contextFrame,
    ...bimbaMetadata
  },
  timestamp: new Date().toISOString()
});

module.exports = { AGUIEventTypes, createAGUIEvent };
```

#### 1.4 A2A Message Integration
**Files to Modify:**
- `epii_app/friendly-file-back2front/a2a/a2a-message.schema.js` - Add Epii-specific message types
- `epii_app/friendly-file-backend/services/epii-agent.service.mjs` - Add A2A message emission
- `epii_app/friendly-file-backend/subsystems/5_epii/epii.expert.agent.mjs` - Core agent integration

**Implementation Steps:**
1. **Extended Message Schema:**
```javascript
const EpiiA2AMessageTypes = {
  // Analysis pipeline messages
  ANALYSIS_STARTED: 'epii.analysis.started',
  ANALYSIS_STAGE_PROGRESS: 'epii.analysis.stage.progress',
  ANALYSIS_COMPLETED: 'epii.analysis.completed',
  ANALYSIS_ERROR: 'epii.analysis.error',

  // Chat messages
  CHAT_MESSAGE: 'epii.chat.message',
  CHAT_RESPONSE: 'epii.chat.response',

  // Tool usage messages
  TOOL_CALL_START: 'epii.tool.call.start',
  TOOL_CALL_RESULT: 'epii.tool.call.result',

  // State synchronization
  DOCUMENT_STATE_UPDATE: 'epii.document.state.update',
  BIMBA_CONTEXT_UPDATE: 'epii.bimba.context.update'
};
```

2. **Service Integration:**
```javascript
class EpiiAgentService {
  constructor() {
    this.a2aClient = null; // Will be injected by adapter
  }

  setA2AClient(client) {
    this.a2aClient = client;
  }

  async emitA2AMessage(type, content, metadata = {}) {
    if (this.a2aClient) {
      await this.a2aClient.sendMessage('frontend', 'inform', {
        type,
        content,
        timestamp: new Date().toISOString()
      }, {
        bimbaCoordinates: metadata.bimbaCoordinates || ['#5'],
        qlStage: metadata.qlStage || 5,
        ...metadata
      });
    }
  }
}
```

### Phase 2: AG-UI Event Integration (Week 2-3)

#### 2.1 Analysis Pipeline AG-UI Events
**Files to Modify:**
- `epii_app/friendly-file-backend/subsystems/5_epii/pipeline/epii_analysis_pipeline_refactored.mjs` - Add AG-UI event emission
- `epii_app/friendly-file-backend/subsystems/5_epii/pipeline/stages/stage_minus*.mjs` - Add step-level events
- `epii_app/friendly-file-backend/subsystems/5_epii/epii.expert.agent.mjs` - Core agent coordination

**Implementation Steps:**
1. **Pipeline Event Emission:**
```javascript
async function runPipeline(initialState) {
  const runId = uuidv4();
  const threadId = initialState.conversationId || uuidv4();

  // Emit RunStarted
  await emitAGUIEvent({
    type: 'RunStarted',
    runId,
    threadId,
    metadata: {
      bimbaCoordinates: [initialState.targetCoordinate],
      qlStage: 0,
      documentId: initialState.documentId
    }
  });

  try {
    // Stage -5: Document Fetch
    await emitAGUIEvent({
      type: 'StepStarted',
      stepName: 'document-fetch',
      metadata: { qlStage: 0, bimbaCoordinate: '#5-0' }
    });

    const stageMinus5Output = await runStageMinus5(initialState, {
      onToolCall: (toolName, args) => emitToolCallEvents(toolName, args),
      onProgress: (progress) => emitStateUpdate('document-fetch', progress)
    });

    await emitAGUIEvent({
      type: 'StepFinished',
      stepName: 'document-fetch',
      metadata: { qlStage: 0 }
    });

    // Continue with other stages...

    await emitAGUIEvent({
      type: 'RunFinished',
      runId,
      result: finalResult
    });

    return finalResult;

  } catch (error) {
    await emitAGUIEvent({
      type: 'RunError',
      runId,
      message: error.message,
      code: 'PIPELINE_ERROR'
    });
    throw error;
  }
}

async function emitToolCallEvents(toolName, args) {
  const toolCallId = uuidv4();

  await emitAGUIEvent({
    type: 'ToolCallStart',
    toolCallId,
    toolCallName: toolName
  });

  // Stream args if they're complex
  if (typeof args === 'object' && Object.keys(args).length > 0) {
    await emitAGUIEvent({
      type: 'ToolCallArgs',
      toolCallId,
      delta: JSON.stringify(args)
    });
  }

  // Tool execution happens here...

  await emitAGUIEvent({
    type: 'ToolCallEnd',
    toolCallId
  });
}
```

2. **Stage-Level Event Integration:**
```javascript
// In stage_minus2.mjs (Analysis stage)
async function runStageMinus2(stageInput, eventCallbacks = {}) {
  const { onProgress, onTextGeneration } = eventCallbacks;

  // Emit progress updates
  onProgress?.({ stage: -2, status: 'starting', progress: 0 });

  // Process chunks with streaming
  for (let i = 0; i < chunks.length; i++) {
    onProgress?.({
      stage: -2,
      status: 'analyzing',
      progress: (i / chunks.length) * 100,
      currentChunk: i + 1,
      totalChunks: chunks.length
    });

    // Stream LLM responses
    const analysis = await analyzeChunk(chunks[i], {
      onToken: (token) => onTextGeneration?.(token)
    });

    // Emit state delta
    await emitAGUIEvent({
      type: 'StateDelta',
      delta: [{
        op: 'add',
        path: `/analysis/chunks/${i}`,
        value: analysis
      }]
    });
  }

  onProgress?.({ stage: -2, status: 'complete', progress: 100 });
  return stageOutput;
}
```

#### 2.2 Chat Streaming Integration
**Files to Modify:**
- `epii-agent.service.mjs` - Add streaming chat responses
- `EpiiChat.tsx` - Add AG-UI client integration

**Implementation Steps:**
1. **Backend Streaming:**
```javascript
async function processChatMessage(message, state, streamCallback) {
  const messageId = uuidv4();

  // Emit message start
  await streamCallback({
    type: 'TextMessageStart',
    messageId,
    role: 'assistant'
  });

  // Stream LLM response
  const llmResponse = await this.llm.stream(message, {
    onToken: async (token) => {
      await streamCallback({
        type: 'TextMessageContent',
        messageId,
        delta: token
      });
    }
  });

  // Emit message end
  await streamCallback({
    type: 'TextMessageEnd',
    messageId
  });

  return llmResponse;
}
```

2. **Frontend AG-UI Client:**
```typescript
// In EpiiChat.tsx
import { useAGUIClient } from '../hooks/useAGUIClient';

const EpiiChat: React.FC = () => {
  const { sendMessage, messages, isConnected } = useAGUIClient({
    agentId: 'epii-agent',
    onTextMessage: (event) => {
      // Handle streaming text messages
      if (event.type === 'TextMessageStart') {
        setStreamingMessage({ id: event.messageId, content: '' });
      } else if (event.type === 'TextMessageContent') {
        setStreamingMessage(prev => ({
          ...prev,
          content: prev.content + event.delta
        }));
      } else if (event.type === 'TextMessageEnd') {
        // Finalize message
        addMessageToChat(streamingMessage);
        setStreamingMessage(null);
      }
    },
    onToolCall: (event) => {
      // Show tool usage in chat
      if (event.type === 'ToolCallStart') {
        addToolCallIndicator(event.toolCallName);
      }
    },
    onStateUpdate: (event) => {
      // Update document state
      if (event.type === 'StateDelta') {
        updateDocumentState(event.delta);
      }
    }
  });

  // Rest of component...
};
```

### Phase 3: Frontend AG-UI Client Integration (Week 3-4)

#### 3.1 WebSocket Service Replacement
**Files to Modify:**
- `webSocketService.ts` - Replace with AG-UI client
- `EpiiModePage.tsx` - Integrate AG-UI provider

**Implementation Steps:**
1. **AG-UI Client Service:**
```typescript
// webSocketService.ts replacement - Custom AG-UI client for Bimba integration
class EpiiAGUIService {
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private currentRunId: string | null = null;
  private currentThreadId: string | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = import.meta.env.VITE_AGUI_WS_URL || 'ws://localhost:3034';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Connected to AG-UI Gateway');
      this.reconnectAttempts = 0;

      // Subscribe to current run/thread if available
      if (this.currentRunId || this.currentThreadId) {
        this.subscribe(this.currentRunId, this.currentThreadId);
      }
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleServerMessage(message);
    };

    this.ws.onclose = () => {
      this.handleReconnection();
    };

    this.ws.onerror = (error) => {
      console.error('AG-UI WebSocket error:', error);
    };
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }

  private subscribe(runId?: string | null, threadId?: string | null) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        runId,
        threadId
      }));

      this.currentRunId = runId;
      this.currentThreadId = threadId;
    }
  }

  private handleServerMessage(message: any) {
    const { type } = message;

    // Handle AG-UI events and preserve Bimba metadata
    switch (type) {
      case 'RunStarted':
        this.emit('analysis-started', message);
        // Auto-subscribe to this run
        this.subscribe(message.runId, message.threadId);
        break;
      case 'StepStarted':
        this.emit('step-started', message);
        break;
      case 'StepFinished':
        this.emit('step-finished', message);
        break;
      case 'TextMessageContent':
        this.emit('text-stream', message);
        break;
      case 'ToolCallStart':
        this.emit('tool-call-start', message);
        break;
      case 'StateDelta':
        this.emit('state-update', message);
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
  }

  async startDocumentAnalysis(documentId: string, targetCoordinate: string, bimbaContext?: any) {
    // Send A2A task request through WebSocket
    if (this.ws?.readyState === WebSocket.OPEN) {
      const taskRequest = {
        type: 'task-request',
        skill: 'document-analysis',
        parameters: {
          documentId,
          targetCoordinate,
          bimbaContext
        },
        metadata: {
          bimbaCoordinates: [targetCoordinate],
          qlStage: 0,
          timestamp: new Date().toISOString()
        }
      };

      this.ws.send(JSON.stringify(taskRequest));
      return taskRequest;
    }
    throw new Error('WebSocket not connected');
  }

  async sendChatMessage(message: string, context?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const chatMessage = {
        type: 'chat-message',
        content: message,
        context,
        metadata: {
          timestamp: new Date().toISOString()
        }
      };

      this.ws.send(JSON.stringify(chatMessage));
      return chatMessage;
    }
    throw new Error('WebSocket not connected');
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const epiiAGUIService = new EpiiAGUIService();
```

2. **Component Integration:**
```typescript
// EpiiModePage.tsx
const EpiiModeContent: React.FC = () => {
  const [analysisProgress, setAnalysisProgress] = useState<any>(null);
  const [toolCalls, setToolCalls] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to AG-UI events
    epiiAGUIService.on('analysis-started', (event) => {
      setAnalysisProgress({ stage: 'started', runId: event.runId });
    });

    epiiAGUIService.on('step-started', (event) => {
      setAnalysisProgress(prev => ({
        ...prev,
        currentStep: event.stepName,
        status: 'running'
      }));
    });

    epiiAGUIService.on('step-finished', (event) => {
      setAnalysisProgress(prev => ({
        ...prev,
        completedSteps: [...(prev.completedSteps || []), event.stepName]
      }));
    });

    epiiAGUIService.on('tool-call-start', (event) => {
      setToolCalls(prev => [...prev, {
        id: event.toolCallId,
        name: event.toolCallName,
        status: 'running',
        startTime: new Date()
      }]);
    });

    return () => {
      // Cleanup subscriptions
    };
  }, []);

  // Rest of component with real-time updates...
};
```

#### 3.2 Real-time Progress Visualization
**Files to Modify:**
- `DocumentControls.tsx` - Add progress indicators
- `AnalysisVisualizer.tsx` - Add streaming updates

**Implementation Steps:**
1. **Progress Indicators:**
```typescript
// DocumentControls.tsx
const DocumentControls: React.FC<DocumentControlsProps> = (props) => {
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);

  useEffect(() => {
    epiiAGUIService.on('step-started', (event) => {
      setAnalysisProgress(prev => ({
        ...prev,
        currentStep: event.stepName,
        stepProgress: 0
      }));
    });

    epiiAGUIService.on('step-finished', (event) => {
      setAnalysisProgress(prev => ({
        ...prev,
        completedSteps: [...(prev.completedSteps || []), event.stepName],
        stepProgress: 100
      }));
    });
  }, []);

  const renderProgressIndicator = () => {
    if (!analysisProgress) return null;

    const stages = [
      'document-fetch',
      'context-gathering',
      'document-chunking',
      'chunk-analysis',
      'synthesis',
      'notion-payload'
    ];

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Analysis Progress</h4>
        {stages.map((stage, index) => {
          const isCompleted = analysisProgress.completedSteps?.includes(stage);
          const isCurrent = analysisProgress.currentStep === stage;

          return (
            <div key={stage} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isCompleted ? 'bg-green-500' :
                isCurrent ? 'bg-blue-500 animate-pulse' :
                'bg-gray-500'
              }`} />
              <span className={`text-sm ${
                isCompleted ? 'text-green-400' :
                isCurrent ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              {isCurrent && (
                <Loader2 size={12} className="animate-spin text-blue-400" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Rest of component...
};
```

### Phase 4: State Synchronization & Advanced Features (Week 4-5)

#### 4.1 Bimba Context Synchronization
**Files to Modify:**
- `EpiiContext.tsx` - Add AG-UI state management
- `useBimbaCoordinates.ts` - Add real-time updates

**Implementation Steps:**
1. **Context State Management:**
```typescript
// EpiiContext.tsx
const EpiiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(epiiReducer, initialState);

  useEffect(() => {
    // Subscribe to state updates from AG-UI
    epiiAGUIService.on('state-update', (event) => {
      if (event.type === 'StateDelta') {
        // Apply JSON Patch operations
        const newState = applyPatch(state, event.delta);
        dispatch({ type: 'SYNC_STATE', payload: newState });
      } else if (event.type === 'StateSnapshot') {
        dispatch({ type: 'REPLACE_STATE', payload: event.snapshot });
      }
    });

    epiiAGUIService.on('bimba-context-update', (event) => {
      dispatch({
        type: 'UPDATE_BIMBA_CONTEXT',
        payload: event.bimbaContext
      });
    });
  }, [state]);

  // Rest of provider...
};
```

#### 4.2 Multi-Agent Coordination Support
**Files to Modify:**
- `a2a-server.js` - Add multi-agent routing
- `EpiiModePage.tsx` - Add agent selection

**Implementation Steps:**
1. **Agent Coordination:**
```javascript
// a2a-server.js enhancement
class A2AServer {
  async routeMessage(message) {
    const { receiver_id, content } = message;

    // Handle multi-agent scenarios
    if (content.requiresMultipleAgents) {
      const agents = content.requiredAgents || ['epii-agent'];
      const results = await Promise.all(
        agents.map(agentId => this.forwardToAgent(agentId, message))
      );

      // Coordinate results
      return this.coordinateAgentResults(results);
    }

    // Single agent routing
    return this.forwardToAgent(receiver_id, message);
  }
}
```

### Phase 5: Testing & Documentation (Week 5-6)

#### 5.1 Integration Testing
**Test Files to Create:**
- `epii-a2a-integration.test.js`
- `epii-agui-events.test.js`
- `epii-frontend-streaming.test.js`

#### 5.2 Documentation Updates
**Documentation to Create:**
- Epii A2A Integration Guide
- AG-UI Event Reference for Epii
- Frontend Component Integration Guide
- Migration Guide from HTTP to AG-UI

## Benefits and Expected Outcomes

### Immediate Benefits
1. **Real-time Analysis Feedback**: Users see each stage of the analysis pipeline as it executes
2. **Streaming Chat Responses**: No more waiting for complete responses
3. **Tool Usage Transparency**: Users can see when and how BPMCP tools are being used
4. **Better Error Handling**: Real-time error feedback with context

### Long-term Benefits
1. **Template for Future Agents**: Epii becomes the reference implementation for #0-4 agents
2. **Scalable Architecture**: Easy to add new agents with consistent communication patterns
3. **Enhanced User Experience**: More engaging and responsive agent interactions
4. **Debugging Capabilities**: Real-time visibility into agent operations

## Migration Strategy

### Backward Compatibility
- Maintain existing HTTP endpoints during transition
- Gradual migration of frontend components
- Feature flags for AG-UI vs HTTP communication

### Rollback Plan
- Keep original implementations as fallbacks
- Environment variables to switch between modes
- Comprehensive testing before full deployment

## Success Metrics

### Technical Metrics
- WebSocket connection stability (>99% uptime)
- Event delivery latency (<100ms)
- Frontend responsiveness improvement (>50% faster perceived performance)
- Error rate reduction (>80% fewer timeout errors)

### User Experience Metrics
- User engagement increase (measured by session duration)
- Task completion rate improvement
- User satisfaction scores for real-time features

This comprehensive plan ensures that the Epii agent becomes fully aligned with both A2A and AG-UI protocols while serving as the foundation for future agent developments. The phased approach allows for iterative testing and refinement, ensuring a robust and scalable implementation.

---

## Alignment with Bimba Tech Architecture

### Cross-Reference to Bimba Plan

This AG-UI integration plan explicitly aligns with the **Bimba Tech Architecture Refactoring Plan** in the following key areas:

#### 1. Subsystem Organization (Reference: Bimba Plan Section 3.2)
- **Epii Expert Agent**: Core logic remains in `subsystems/5_epii/epii.expert.agent.mjs` as specified in the Bimba Plan
- **Pipeline Location**: Analysis pipeline moved to `subsystems/5_epii/pipeline/` to align with agent-specific logic placement
- **#5-4 Integration Layer**: Enhanced back2front structure maintains the "Siva-Shakti" integration principle

#### 2. QL Cycle Integration (Reference: Bimba Plan Section 2.1)
- **AG-UI Events**: Mapped to QL stages with proper metadata preservation
- **State Transitions**: QL stage changes trigger both A2A messages and AG-UI events
- **Context Frames**: Bimba context frames preserved in all event emissions

#### 3. Coordinate System Preservation (Reference: Bimba Plan Section 4.1)
- **Bimba Coordinates**: All AG-UI events carry bimbaCoordinates metadata
- **Target Coordinates**: Document analysis maintains coordinate targeting
- **Coordinate Transitions**: Custom AG-UI events for coordinate changes

### Enhanced Directory Structure Alignment

The proposed refactored structure aligns with Bimba principles:

```
epii_app/
├── friendly-file-backend/
│   ├── subsystems/
│   │   └── 5_epii/                    # Agent-specific subsystem
│   │       ├── epii.expert.agent.mjs  # Core agent (Bimba Plan reference)
│   │       └── pipeline/               # Agent-specific pipeline
│   └── databases/                      # Universal data functions (BPMCP, etc.)
├── friendly-file-back2front/
│   ├── a2a/                           # A2A protocol components
│   ├── ag-ui/                         # AG-UI protocol components
│   ├── adapters/                      # Agent adapters
│   └── agent-cards/                   # Agent capability definitions
└── friendly-file-front/               # Shakti (frontend) - less structured
```

### Protocol Standardization Benefits

#### 1. Template for Future Agents (#0-4)
- **Standardized Patterns**: A2A and AG-UI integration patterns established for Epii can be replicated for agents in subsystems #0-4
- **Consistent Event Schemas**: AG-UI event definitions provide template for all agent communications
- **Scalable Architecture**: Centralized AG-UI gateway supports multiple agent connections

#### 2. Bimba Metadata Preservation
- **Custom Events**: Bimba-specific events (QLStageTransition, CoordinateChange, BimbaContextUpdate) extend standard AG-UI
- **Metadata Fields**: All events carry Bimba coordinates, QL stages, and context frames
- **Coordinate Awareness**: Frontend components receive real-time Bimba context updates

#### 3. Enhanced User Experience Alignment
- **Real-time Feedback**: Users see QL stage transitions and coordinate changes as they happen
- **Transparent Operations**: Tool usage and agent reasoning visible through AG-UI events
- **Context Awareness**: Frontend maintains synchronized Bimba context state

### Implementation Considerations

#### 1. Backward Compatibility
- **Gradual Migration**: Existing HTTP endpoints maintained during transition
- **Feature Flags**: Environment variables control A2A vs HTTP communication modes
- **Fallback Mechanisms**: Error handling preserves functionality during protocol transitions

#### 2. Performance Optimization
- **Event Filtering**: AG-UI gateway only sends relevant events to subscribed clients
- **Connection Management**: Automatic reconnection and subscription restoration
- **State Synchronization**: Efficient StateDelta events minimize data transfer

#### 3. Future Extensibility
- **Multi-Agent Support**: Architecture supports coordination between multiple agents
- **Protocol Evolution**: AG-UI event definitions can be extended for new capabilities
- **Integration Points**: Clear interfaces for adding new agents and protocols

This alignment ensures that the AG-UI integration enhances rather than replaces the Bimba architecture, providing a solid foundation for the fully agentic app development vision while maintaining the integrity of the coordinate system and QL principles.