# Epi-Logos Agent: Actionable Development Plan

**Version:** 1.1

**Objective:** To provide a detailed, context-rich, and sequential plan for a builder agent to execute the agentic redesign of the Epii subsystem, transforming it into the core of a unified **Epi-Logos Orchestrator Agent**.

**Guiding Principles:**

*   **Single Epi-Logos Orchestrator Agent:** We are building one, unified, linear agent to avoid the context-fragmentation pitfalls of multi-agent systems.
*   **Context is King:** All development is in service of creating a robust, bidirectional context flow between the agent and the user interface.
*   **Bimba-Grounded Cognition:** The agent's understanding, reasoning, and actions are fundamentally grounded in the Bimba coordinate system.
*   **Quaternal Logic (QL) as a Framework:** The agent's orchestration of tasks follows the QL meta-framework for problem-solving, moving from potential to integration.
*   **Universal System Architecture:** The Epi-Logos Agent operates as a universal system separate from subsystem-specific functionalities, with its own dedicated directory structure.
*   **Standard AG-UI Protocol Compliance:** All frontend-agent communication leverages the 16 standard AG-UI event types, minimizing custom event creation.

---

## Epic 0: Establish Epi-Logos System Architecture & Directory Structure

**Goal:** Create a dedicated "epi-logos-system" directory structure that separates the universal Epi-Logos Agent from subsystem-specific functionalities, establishing clear architectural boundaries.

### Sub-Tasks:

*   **[Backend] Task 0.1: Create Epi-Logos System Directory Structure**
    *   **Description:** Establish the new directory structure for the Epi-Logos Agent system alongside the existing subsystems directory.
    *   **Details:** Create a parallel directory structure that houses all Epi-Logos Agent components, tools, and services separate from subsystem-specific code.

    **CODEBASE CONTEXT:**
    *   **New Directory Structure:**
        ```
        epii_app/friendly-file-backend/
        ├── subsystems/           # Existing subsystem-specific code
        └── epi-logos-system/     # NEW - Universal Epi-Logos Agent
            ├── 0_foundation/     # Core agent infrastructure
            ├── 1_orchestration/  # Agent orchestration logic
            ├── 2_skills/         # Universal agent skills
            ├── 3_tools/          # BPMCP tools and utilities
            ├── 4_communication/  # AG-UI and A2A integration
            └── 5_integration/    # System-wide integrations
        ```
    *   **Back2Front Structure:**
        ```
        epii_app/friendly-file-back2front/
        ├── subsystems/           # Existing subsystem-specific code
        └── epi-logos-system/     # NEW - Universal Epi-Logos Agent
            ├── 0_foundation/     # Shared foundations
            ├── 1_orchestration/  # Agent core logic
            ├── 2_skills/         # Agent skills registry
            ├── 3_communication/  # AG-UI gateway enhancements
            ├── 4_integration/    # A2A server integration
            └── 5_services/       # Universal services
        ```
    *   **Migration Strategy:** Move existing epii-agent related files from subsystems/5_epii to epi-logos-system
    *   **Import Path Updates:** Update all import paths to reflect new structure


*   **[Frontend] Task 0.2: Create Frontend Epi-Logos System Structure**
    *   **Description:** Establish frontend directory structure for universal Epi-Logos Agent components.
    *   **Details:** Create dedicated directories for agent-related frontend components separate from subsystem-specific UI.

    **CODEBASE CONTEXT:**
    *   **New Frontend Structure:**
        ```
        epii_app/friendly-file-front/src/
        ├── subsystems/           # Existing subsystem-specific components
        └── epi-logos-system/     # NEW - Universal Agent Frontend
            ├── 0_foundation/     # Agent types and interfaces
            ├── 1_components/     # FloatingAgent, GenerativeUI
            ├── 2_hooks/          # Agent-specific hooks
            ├── 3_services/       # Agent communication services
            ├── 4_contexts/       # Agent context providers
            └── 5_integration/    # System-wide integrations
        ```
    *   **Component Migration:** Move FloatingAgent and related components here
    *   **Shared Components:** Keep in src/shared/ for cross-system usage


---

## Epic 1: Implement the Core Epi-Logos Orchestrator Agent & UI

**Goal:** To establish the foundational, user-facing agent and integrate it with the core backend reasoning and knowledge systems.

### Sub-Tasks:

*   **[Frontend] Task 1.1: Develop the Floating Epi-Logos Agent UI Component**
    *   **Description:** Create a new, persistent, overlay-style chat component using React. This component should be globally available and not tied to any specific page or route, with integrated session history and context compacting.
    *   **Details:** It must be able to render a stream of conversation history with session management, context compacting for long conversations, and seamless integration with the Epi-Logos Agent backend. The UI should be unobtrusive but easily accessible.
    *   **PRD Ref:** 3.1.1

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-front/src/epi-logos-system/1_components/FloatingEpiLogosAgent.tsx` (NEW FILE)
    *   **Session Management:** `epii_app/friendly-file-front/src/epi-logos-system/3_services/SessionHistoryService.ts` (NEW FILE)
    *   **Context Compacting:** `epii_app/friendly-file-front/src/epi-logos-system/3_services/ContextCompactingService.ts` (NEW FILE)
    *   **Integration Point:** Add to `epii_app/friendly-file-front/src/App.tsx` at line 57 (inside the main div, after Navbar)
    *   **Existing Patterns to Follow:**
        - Chat UI patterns from `epii_app/friendly-file-front/src/subsystems/4_nara/3_visualization/chat/ChatInput.tsx` (lines 30-42)
        - Chat message rendering from `epii_app/friendly-file-front/src/subsystems/4_nara/3_visualization/chat/ChatMessage.tsx` (lines 14-36)
        - Session history from `epii_app/friendly-file-front/src/subsystems/5_epii/4_context/EpiiContext.tsx` (lines 48-54, 322-332)
        - Overlay patterns from `epii_app/friendly-file-front/src/shared/components/ui/dialog.tsx` and `sheet.tsx`
    *   **Session Features:**
        - Persistent conversation history across page reloads
        - Context compacting when conversations exceed 50 messages
        - Session restoration with context preservation
        - Cross-document conversation continuity
        - New session creation and management
        - Chat history clearing and archiving
        - Session-specific context isolation
    *   **Styling:** Use existing epii theme classes (`bg-epii-dark`, `text-epii-neon`, `border-epii-neon/20`) from current components
    *   **State Management:** Connect to existing `webSocketService` at `epii_app/friendly-file-front/src/subsystems/5_epii/1_services/webSocketService.ts`
    *   **Positioning:** Fixed position overlay, z-index higher than navbar (z-50+), toggle button in bottom-right corner
    *   **Bimba Coordinate:** #0-3-1 (Universal Agent Interface)

*   **[Frontend] Task 1.2: Implement Generative UI Rendering**
    *   **Description:** The new agent UI must be capable of rendering more than just text. It needs a mechanism to dynamically render interactive React components based on instructions from the agent.
    *   **Details:** This will likely involve a mapping between a component name (sent from the agent) and the actual React component. This allows the agent to suggest actions, show confirmation dialogs, or display lists of documents directly in the chat.
    *   **PRD Ref:** 3.1.2

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-front/src/shared/components/agent/GenerativeUIRenderer.tsx` (NEW FILE)
    *   **Component Registry:** `epii_app/friendly-file-front/src/shared/components/agent/componentRegistry.ts` (NEW FILE)
    *   **Existing UI Components to Map:**
        - Button: `epii_app/friendly-file-front/src/shared/components/ui/button.tsx`
        - Dialog: `epii_app/friendly-file-front/src/shared/components/ui/dialog.tsx`
        - Alert Dialog: `epii_app/friendly-file-front/src/shared/components/ui/alert-dialog.tsx`
        - Command: `epii_app/friendly-file-front/src/shared/components/ui/command.tsx`
    *   **Dynamic Import Pattern:** Use React.lazy() and Suspense for component loading
    *   **Message Format:** Extend AG-UI event schema to include `generativeUI` field with component name and props
    *   **Integration:** Embed in FloatingAgent component's message rendering logic
    *   **Error Handling:** Fallback to text rendering if component not found or fails to load

*   **[Backend] Task 1.3: Integrate BPMCP as the Epi-Logos Agent's Core**
    *   **Description:** The new Epi-Logos Agent's reasoning loop will be fundamentally powered by the Bimba-Pratibimba Model-Context-Protocol (BPMCP) server. All agent **tools** will be managed and executed through this system. The A2A **skills** system will be how the agent specifies its actions as a universal orchestrator, with core skills at Root Coordinate # in the Skills Registry (universal skills) and subsystem-specific skills at their respective coordinates.
    *   **Philosophical Context:** This directly implements the principle of a single, unified Epi-Logos Agent. The BPMCP serves as the agent's "mind," providing the structure for its perception, cognition, and action, all grounded in the Bimba coordinate system.

    **CODEBASE CONTEXT:**
    *   **BPMCP Server Location:** `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/server.ts`
    *   **Current Tools:** Located in `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/`
        - `queryBimbaGraph` (lines 234-239 in server.ts)
        - `updateBimbaGraph` (NEW - needs implementation)
        - `bimbaKnowing` (lines 234-239 in server.ts)
        - `generateBimbaEmbeddings` (lines 234-239 in server.ts)
    *   **A2A Integration:** Already integrated via `epii_app/friendly-file-back2front/shared/a2a/a2a-server.js` (lines 96-100)
    *   **Skills Registry Migration:** Move to `epii_app/friendly-file-back2front/epi-logos-system/2_skills/epi-logos-skills-registry.js` (NEW FILE)
    *   **New Agent Core:** Create `epii_app/friendly-file-back2front/epi-logos-system/1_orchestration/epi-logos-orchestrator.js` (NEW FILE)
    *   **BPMCP Client:** Enhance `epii_app/friendly-file-backend/services/bpWebSocketClient.mjs` for agent orchestration
    *   **Startup Integration:** BPMCP server started in `epii_app/startup.sh` (needs verification)
    *   **Migration Path:** Move existing epii-agent files from subsystems/5_epii to epi-logos-system structure

*   **[Backend - Parallel Task] Task 1.4: Refine Core Bimba Knowledge Tools**
    *   **Description:** In parallel with UI development, refine the core knowledge-retrieval tools now that the Lightrag Qdrant (vector) and Neo4j (graph) stores are populated.
    *   **Details:** This involves enhancing `queryBimbaGraph` (for structured, relational queries) and `bimbaKnowing`. The goal is to ensure these tools are robust, efficient, and return rich, context-aware results that the agent can easily use.
    *   **PRD Ref:** 3.4.3 (Core Skill Focus)

    **CODEBASE CONTEXT:**
    *   **queryBimbaGraph Tool:** `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/` (needs enhancement)
    *   **bimbaKnowing Tool:** Same location (needs enhancement)
    *   **UnifiedRAG Service:** `epii_app/friendly-file-back2front/shared/services/unifiedRAG.js` (lines 136-155, 297-326)
        - LightRAG integration: lines 608-622
        - Bimba graph integration: lines 297-326
        - Graphiti integration: lines 314-319
    *   **Database Connections:**
        - Neo4j: Via BPMCP tools
        - LightRAG: `http://localhost:8001` (lines 614 in unifiedRAG.js)
        - Qdrant: Via LightRAG integration
    *   **Enhancement Areas:**
        - Add coordinate-based context retrieval
        - Improve relationship traversal depth
        - Add semantic similarity scoring
        - Implement caching for frequent queries
    *   **Testing:** Use existing patterns from `epii_app/friendly-file-back2front/shared/services/bimba-update-management-skill.js` (lines 35-620)

---

## Epic 1.5: DocumentCanvas Functionality Migration Plan

**Goal:** Systematically migrate all DocumentCanvas functionalities to work with the new Epi-Logos Agent while preserving the sophisticated selection system and coordinate awareness.

### Sub-Tasks:

*   **[Frontend] Task 1.5.1: Migrate Text Selection System to Agent Context**
    *   **Description:** Preserve the current sophisticated text selection system while integrating it with the Epi-Logos Agent for enhanced analysis and crystallization capabilities.
    *   **Details:** Maintain all current selection features (persistence, coordinate awareness, analyze/crystallize actions) while routing them through the agent for enhanced processing.

    **CODEBASE CONTEXT:**
    *   **Current Selection System:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentViewer.tsx` (lines 115-221)
    *   **Selection State Management:** `epii_app/friendly-file-front/src/subsystems/5_epii/4_context/EpiiContext.tsx` (lines 705-851)
    *   **Selection Actions:** DocumentCanvas.tsx (lines 589-611, 835-861)
    *   **Migration Strategy:**
        - Preserve TextSelection interface with enhanced properties (id, documentId, start, end, text, timestamp, isPratibimba, bimbaCoordinate)
        - Migrate selection state from EpiiContext to AgentContextProvider
        - Route selection actions through Epi-Logos Agent instead of direct handlers
        - Maintain selection persistence across document switches
        - Preserve coordinate-aware selection tracking
    *   **Agent Integration:**
        - Selection analysis → Agent skill execution with selection context
        - Crystallization → Agent-driven pratibimba creation with enhanced reasoning
        - Selection persistence → Agent session history integration
    *   **Backward Compatibility:** Maintain existing selection UI and behavior patterns

*   **[Frontend] Task 1.5.2: Migrate Document State Management to Agent-Driven Model**
    *   **Description:** Transition document state management from local EpiiContext to agent-driven state updates via AG-UI events.
    *   **Details:** Replace local document state with agent-managed state while preserving all current document operations (create, update, delete, coordinate assignment).

    **CODEBASE CONTEXT:**
    *   **Current Document State:** EpiiContext.tsx (lines 34-54, document management throughout)
    *   **Document Operations:** DocumentCanvas.tsx (lines 1065-1262, document CRUD operations)
    *   **Target Coordinate Management:** DocumentCanvas.tsx (lines 136-148, 1240-1252)
    *   **Migration Strategy:**
        - Replace EpiiContext document state with AG-UI StateDelta events
        - Migrate document operations to agent skills with AG-UI feedback
        - Preserve coordinate assignment logic with agent validation
        - Maintain document type detection (bimba vs pratibimba)
        - Keep document persistence patterns (MongoDB for permanent, localStorage for temp)
    *   **Agent Skills Integration:**
        - Document creation → Agent skill with validation and coordinate assignment
        - Document updates → Agent skill with change tracking and backup
        - Document deletion → Agent skill with confirmation and cleanup
        - Coordinate assignment → Agent skill with validation and relationship updates
    *   **State Synchronization:** Use AG-UI StateDelta events for real-time state updates

*   **[Frontend] Task 1.5.3: Preserve Document Analysis Integration**
    *   **Description:** Maintain the current document analysis capabilities while routing them through the Epi-Logos Agent for enhanced processing and context awareness.
    *   **Details:** Keep all existing analysis features (pipeline execution, result display, session management) while leveraging agent orchestration for improved results.

    **CODEBASE CONTEXT:**
    *   **Current Analysis Integration:** DocumentCanvas analysis button handlers and pipeline integration
    *   **Analysis State:** EpiiContext.tsx analysis sessions and results management
    *   **Pipeline Integration:** Existing epii-analysis-pipeline skill integration
    *   **Migration Strategy:**
        - Route analysis requests through Epi-Logos Agent instead of direct pipeline calls
        - Preserve analysis session management with agent context
        - Maintain analysis result display and interaction patterns
        - Enhance analysis with agent's multi-source knowledge integration
    *   **Agent Enhancement:**
        - Multi-document analysis with cross-reference capabilities
        - Enhanced context from agent's knowledge base
        - Improved result synthesis with QL-aware processing
        - Session continuity across document switches

---

## Epic 2: Establish Bidirectional Agent-Frontend Communication

**Goal:** To engineer the robust, real-time communication channel that allows the agent and the frontend to share context and commands, forming the central nervous system of the application.

### Sub-Tasks:

*   **[Back-to-Front] Task 2.1: Enhance the Central `webSocketService`**
    *   **Description:** The existing frontend `webSocketService` will be the single entry point for all AG-UI events. It must be enhanced to handle new event types for agent communication.
    *   **Details:** It needs to listen for `ToolCallStart` events with specific tool names (`frontend:getContext`, `frontend:invokeAction`) and route them to the new registry services (see below). It will also be responsible for sending `ToolCallEnd` events back to the backend with the results.
    *   **PRD Ref:** 3.2.2

    **CODEBASE CONTEXT:**
    *   **Target File:** `epii_app/friendly-file-front/src/subsystems/5_epii/1_services/webSocketService.ts`
    *   **Current AG-UI Handlers:** Lines 34-36 (aguiEventHandlers Map)
    *   **Message Handling:** Lines 258-277 (sendWebSocketMessage function)
    *   **Event Subscription:** Lines 436-450 (service exports)
    *   **Enhancement Areas:**
        - Add new event handlers for `frontend:getContext` and `frontend:invokeAction` in handleAGUIEvent function
        - Extend AG-UI event routing logic around lines 100-200
        - Add context registry and action registry integration
    *   **A2A Connection:** Already connected to A2A server at lines 52-76
    *   **Existing Patterns:** Follow patterns from BimbaUpdateOverlay integration (lines 221-243 in AG-UI guide)
    *   **Error Handling:** Use existing patterns from lines 258-277

*   **[Backend] Task 2.2: Create the `getFrontendContext` BPMCP Tool**
    *   **Description:** Develop a new asynchronous BPMCP tool that the agent can call to request context from the frontend.
    *   **Details:** When called, this tool will emit a `ToolCallStart` AG-UI event with the payload `{ "tool_name": "frontend:getContext", "args": { "componentId": "...", "contextType": "..." } }`. The tool will then wait until the corresponding `ToolCallEnd` event is received from the frontend before returning the result to the agent.
    *   **PRD Ref:** 3.4.1

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/getFrontendContext.ts` (NEW FILE)
    *   **Tool Registration:** Add to `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/index.ts`
    *   **Server Integration:** Update handlers map in `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/server.ts` (lines 51-67)
    *   **AG-UI Integration:** Use AG-UI Gateway from `epii_app/friendly-file-back2front/shared/ag-ui/ag-ui-gateway.js` (lines 155-202)
    *   **Event Schema:** Follow `epii_app/friendly-file-back2front/shared/ag-ui/ag-ui-event-schema.js` (lines 16-32)
    *   **Async Pattern:** Implement promise-based waiting for ToolCallEnd events
    *   **Timeout Handling:** Add 30-second timeout for frontend responses
    *   **Input Schema:** componentId (string), contextType (enum: 'selection', 'fullState', 'viewPort')

*   **[Backend] Task 2.3: Create the `executeFrontendAction` Epii Skill**
    *   **Description:** Develop a new universal agent skill that allows the agent to command the frontend to perform an action.
    *   **Details:** This skill will emit a `ToolCallStart` AG-UI event with the payload `{ "tool_name": "frontend:invokeAction", "args": { "actionName": "...", "componentId": "...", "args": { ... } } }`. This is a "fire-and-forget" action from the agent's perspective.
    *   **PRD Ref:** 3.4.2

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-back2front/subsystems/5_epii/skills/execute-frontend-action-skill.js` (NEW FILE)
    *   **Skill Registration:** Add to `epii_app/friendly-file-back2front/shared/services/bimba-skills-registry.js` (around lines 376-391)
    *   **Existing Skill Pattern:** Follow structure from `epii_app/friendly-file-back2front/shared/services/bimba-update-management-skill.js` (lines 14-35)
    *   **AG-UI Event Emission:** Use patterns from `epii_app/friendly-file-back2front/subsystems/5_epii/skills/epii-analysis-pipeline-skill.js` (lines 179-205)
    *   **Skill Metadata:** Bimba coordinate #5-1, QL Position 1, Context Frame (0/1)
    *   **Input Schema:** actionName (string), componentId (string), args (object)
    *   **Fire-and-Forget:** No waiting for response, immediate return after event emission

*   **[Frontend] Task 2.4: Implement Frontend Registries and Hooks**
    *   **Description:** Create the frontend infrastructure that allows components to respond to the agent.
    *   **Details:**
        1.  **`AgentContextProvider`:** A React Context provider to manage context-providing functions.
        2.  **`AgentActionRegistry`:** A service to map action names to handler functions.
        3.  **`useAgentContext` Hook:** A hook for components to register a function that provides their state (e.g., `useAgentContext('documentCanvas', () => ({ selectedNodes }))`).
        4.  **`useAgentAction` Hook:** A hook for components to register a function that can be called by the agent (e.g., `useAgentAction('showNotification', (args) => { ... })`).
    *   **PRD Ref:** 3.2.3

    **CODEBASE CONTEXT:**
    *   **Target Files:**
        - `epii_app/friendly-file-front/src/shared/contexts/AgentContextProvider.tsx` (NEW FILE)
        - `epii_app/friendly-file-front/src/shared/services/AgentActionRegistry.ts` (NEW FILE)
        - `epii_app/friendly-file-front/src/shared/hooks/useAgentContext.ts` (NEW FILE)
        - `epii_app/friendly-file-front/src/shared/hooks/useAgentAction.ts` (NEW FILE)
    *   **Integration Point:** Add AgentContextProvider to `epii_app/friendly-file-front/src/App.tsx` (around line 53, inside UserContextProvider)
    *   **Existing Context Pattern:** Follow `epii_app/friendly-file-front/src/subsystems/4_nara/4_context/UserContextProvider.tsx` (lines 105-269)
    *   **Hook Patterns:** Follow existing hooks in `epii_app/friendly-file-front/src/subsystems/5_epii/2_hooks/`
    *   **Registry Pattern:** Use Map-based registry similar to AG-UI event handlers (lines 34-36 in webSocketService.ts)
    *   **Component Integration:** Update DocumentCanvas (`epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentCanvas.tsx`) as reference implementation
    *   **Context Types:** Define interfaces for component state, selection data, viewport info

---

## Epic 2.7: Comprehensive Chat Session Management & History Controls

**Goal:** Implement complete chat session management with new session creation, history clearing, context compression, and UI for chat history storage, supporting both document-specific and general conversation contexts.

### Sub-Tasks:

*   **[Frontend] Task 2.7.1: Implement Chat Session Management UI**
    *   **Description:** Create comprehensive UI controls for managing chat sessions, including new session creation, history clearing, session switching, and context compression within the FloatingEpiLogosAgent.
    *   **Details:** Add session management controls that allow users to manage conversation contexts effectively across different modes and document contexts.

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-front/src/epi-logos-system/1_components/ChatSessionManager.tsx` (NEW FILE)
    *   **Integration Point:** Embed in FloatingEpiLogosAgent header/toolbar area
    *   **Current Chat Storage:** `epii_app/friendly-file-front/src/subsystems/5_epii/0_foundation/epiiDocStore.ts` (lines 206-234)
    *   **Current Message Patterns:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/EpiiChat.tsx` (lines 448-467)
    *   **Session Management Features:**
        - **New Session Button**: Clear current conversation and start fresh
        - **Session History Dropdown**: List of recent sessions with timestamps and context
        - **Clear History Button**: Remove all messages from current session
        - **Compress Context Button**: Summarize long conversations into context summary
        - **Session Context Indicator**: Show current session type (document-specific vs general)
        - **Export/Archive Session**: Save important conversations
    *   **UI Components:**
        ```typescript
        interface ChatSession {
          id: string;
          name: string;
          context: 'document' | 'general' | 'coordinate';
          contextId?: string; // documentId or coordinate
          messageCount: number;
          lastActivity: Date;
          isCompressed: boolean;
          summary?: string;
        }
        ```
    *   **Session Controls Layout:**
        - Header toolbar with session dropdown and controls
        - Context indicator showing current session type
        - Message count and compression status
        - Quick actions for new session, clear, compress

*   **[Backend] Task 2.7.2: Implement Session Management Service**
    *   **Description:** Create backend service for managing chat sessions, including session creation, history management, context compression, and session persistence across different conversation contexts.
    *   **Details:** Extend existing chat storage to support session-based organization with context awareness and compression capabilities.

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-backend/epi-logos-system/3_services/ChatSessionService.mjs` (NEW FILE)
    *   **Current Chat Storage:** `epii_app/friendly-file-backend/subsystems/5_epii/3_models/ChatMessage.model.mjs`
    *   **Current Conversation Model:** `epii_app/friendly-file-backend/databases/shared/models/Conversation.model.mjs`
    *   **Enhancement Strategy:**
        - Extend existing ChatMessage model with sessionId field
        - Add session metadata collection for session management
        - Implement context compression using LLM summarization
        - Support document-specific vs general conversation contexts
    *   **New Session Schema:**
        ```javascript
        const chatSessionSchema = new mongoose.Schema({
          sessionId: { type: String, required: true, unique: true },
          userId: { type: String, required: true, index: true },
          sessionType: { type: String, enum: ['document', 'general', 'coordinate'], required: true },
          contextId: { type: String }, // documentId or coordinate
          contextName: { type: String }, // document name or coordinate title
          messageCount: { type: Number, default: 0 },
          isCompressed: { type: Boolean, default: false },
          compressionSummary: { type: String },
          lastActivity: { type: Date, default: Date.now },
          createdAt: { type: Date, default: Date.now },
          archived: { type: Boolean, default: false }
        });
        ```
    *   **Service Methods:**
        - `createNewSession(userId, sessionType, contextId)`: Create new session
        - `getSessionHistory(userId, limit)`: Get recent sessions
        - `compressSessionContext(sessionId)`: Compress long conversations
        - `clearSessionMessages(sessionId)`: Clear session history
        - `archiveSession(sessionId)`: Archive old sessions

*   **[Frontend] Task 2.7.3: Implement Context-Aware Session Routing**
    *   **Description:** Create intelligent session routing that automatically creates or switches to appropriate sessions based on document context, coordinate context, or general conversation mode.
    *   **Details:** Implement automatic session management that creates document-specific sessions when in document context and general sessions for mode-specific conversations.

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-front/src/epi-logos-system/3_services/SessionRoutingService.ts` (NEW FILE)
    *   **Current Document Context:** DocumentCanvas active document tracking
    *   **Current Mode Detection:** ActiveModeProvider (from Epic 2.6)
    *   **Integration Points:**
        - FloatingEpiLogosAgent message sending
        - Document selection changes in DocumentCanvas
        - Mode transitions between subsystems
    *   **Routing Logic:**
        ```typescript
        interface SessionContext {
          type: 'document' | 'general' | 'coordinate';
          contextId?: string;
          contextName?: string;
          expertSkillId: string; // Which expert to route to
        }

        class SessionRoutingService {
          // Auto-create or switch to document session when document is active
          handleDocumentContext(documentId: string, documentName: string): string;

          // Auto-create or switch to general session for mode-specific chat
          handleGeneralContext(mode: string, expertSkillId: string): string;

          // Auto-create or switch to coordinate session for coordinate-specific chat
          handleCoordinateContext(coordinate: string): string;
        }
        ```
    *   **Session Switching Logic:**
        - Document selection → switch to document-specific session
        - Document deselection → switch to general mode session
        - Mode change → switch to appropriate expert session
        - Manual session creation → user-controlled session

*   **[Backend] Task 2.7.4: Implement Context Compression & History Management**
    *   **Description:** Create intelligent context compression that summarizes long conversations while preserving important context, and implement history management for session archiving and retrieval.
    *   **Details:** Use LLM-based summarization to compress conversation history when sessions become too long, while maintaining context continuity.

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-backend/epi-logos-system/3_services/ContextCompressionService.mjs` (NEW FILE)
    *   **Current LLM Integration:** `epii_app/friendly-file-backend/subsystems/5_epii/2_services/epii-llm.service.mjs`
    *   **Current Chat Storage:** ChatMessage model and conversation storage
    *   **Compression Strategy:**
        - Trigger compression when session exceeds 50 messages
        - Preserve last 10 messages + compressed summary of earlier messages
        - Maintain context continuity for document-specific conversations
        - Use expert-specific compression prompts for different modes
    *   **Compression Implementation:**
        ```javascript
        class ContextCompressionService {
          async compressSession(sessionId) {
            // Get all messages for session
            const messages = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 });

            // Keep recent messages, compress older ones
            const recentMessages = messages.slice(-10);
            const oldMessages = messages.slice(0, -10);

            // Generate compression summary
            const summary = await this.generateCompressionSummary(oldMessages);

            // Update session with compression
            await this.updateSessionCompression(sessionId, summary);

            // Archive old messages
            await this.archiveMessages(oldMessages);
          }
        }
        ```
    *   **History Management:**
        - Archive old sessions after 30 days of inactivity
        - Export session history for important conversations
        - Search across session history
        - Restore archived sessions on demand

*   **[Frontend] Task 2.7.5: Implement Session History UI & Storage Interface**
    *   **Description:** Create comprehensive UI for browsing, searching, and managing chat session history with visual indicators for session types, compression status, and context information.
    *   **Details:** Build intuitive interface for session management that integrates seamlessly with the FloatingEpiLogosAgent.

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-front/src/epi-logos-system/1_components/SessionHistoryPanel.tsx` (NEW FILE)
    *   **Current Storage Patterns:** `epii_app/friendly-file-front/src/subsystems/4_nara/4_context/astrologyStore.ts` (localStorage patterns)
    *   **Current UI Patterns:** Existing dropdown and panel components from shared/components/ui
    *   **History UI Features:**
        - **Session List**: Chronological list of sessions with context indicators
        - **Search & Filter**: Search by content, filter by type/date/context
        - **Session Preview**: Quick preview of session content and summary
        - **Bulk Actions**: Archive, delete, export multiple sessions
        - **Context Indicators**: Visual badges for document/general/coordinate sessions
        - **Compression Status**: Show compressed sessions with summary previews
    *   **UI Components:**
        ```typescript
        interface SessionHistoryProps {
          sessions: ChatSession[];
          currentSessionId: string;
          onSessionSelect: (sessionId: string) => void;
          onSessionDelete: (sessionId: string) => void;
          onSessionArchive: (sessionId: string) => void;
          onSessionExport: (sessionId: string) => void;
        }
        ```
    *   **Storage Integration:**
        - Local caching of recent sessions for quick access
        - Lazy loading of older sessions from backend
        - Real-time updates for active session changes
        - Offline support for recent session history

---

## Epic 3: Overhaul Frontend State Management & Refactor Key Components

**Goal:** To eliminate fragmented, buggy local state management in favor of a single, reliable source of truth driven by the agent and the backend, creating a seamless and predictable user experience.

### Sub-Tasks:

*   **[Frontend] Task 3.1: Refactor the Document Canvas**
    *   **Description:** Completely remove the local `EpiiContext` and `useEpiiAnalysis` hooks. The Document Canvas must be refactored to derive all of its state from the global `webSocketService`.
    *   **Details:** All state changes (`activeDocument`, `selectedNodes`, `graphLayout`, `analysisResults`, `uiFlags`) will be received as `StateDelta` AG-UI events from the backend. The component will become a "dumb" view that simply renders the state provided by the global service.
    *   **PRD Ref:** 3.3.1

    **CODEBASE CONTEXT:**
    *   **Target Component:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentCanvas.tsx`
    *   **Current Dependencies to Remove:**
        - `useEpii` hook import (line 13) from `../4_context/EpiiContext`
        - `useDocumentAnalysis` hook import (line 14) from `../2_hooks/useEpiiDocument`
        - Local state management throughout component
    *   **EpiiContext to Deprecate:** `epii_app/friendly-file-front/src/subsystems/5_epii/4_context/EpiiContext.tsx` (entire file)
    *   **useEpiiAnalysis to Deprecate:** `epii_app/friendly-file-front/src/subsystems/5_epii/2_hooks/useEpiiAnalysis.ts` (entire file)
    *   **State Migration:**
        - Replace local state with AG-UI event subscriptions via webSocketService
        - Add StateDelta event handlers for: activeDocument, selectedNodes, graphLayout, analysisResults, uiFlags
        - Use existing AG-UI patterns from BimbaUpdateOverlay (lines 1680-2860)
    *   **WebSocket Integration:** Connect to existing webSocketService (line 19 import)
    *   **Event Types:** Define new StateDelta event types in AG-UI schema
    *   **Backward Compatibility:** Maintain existing component interface while changing internal implementation

*   **[Frontend] Task 3.2: Deprecate Standalone Chat Components**
    *   **Description:** Remove the existing, isolated "Document Chat" functionality.
    *   **Details:** Its features will be entirely subsumed by the new global Floating Agent. The agent will be made context-aware of the active document to provide the same (and better) functionality.
    *   **PRD Ref:** 3.3.3

    **CODEBASE CONTEXT:**
    *   **Components to Deprecate:**
        - `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentChat.tsx` (remove from DocumentCanvas)
        - `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/EpiiChat.tsx` (entire component)
    *   **DocumentCanvas Integration:** Remove DocumentChat import and usage from DocumentCanvas.tsx
    *   **Chat History Migration:** Move chat history to global agent context
    *   **Context Awareness:** Implement document context in FloatingAgent via useAgentContext hook
    *   **Feature Preservation:**
        - Document-specific chat history (lines 453-467 in EpiiChat.tsx)
        - Text selection integration (lines 715-733 in EpiiChat.tsx)
        - Analysis integration (existing patterns)
    *   **Export Cleanup:** Remove from `epii_app/friendly-file-front/src/subsystems/5_epii/index.ts` (line 22)
    *   **Route Cleanup:** Check for any direct chat routes in routing configuration

*   **[Frontend] Task 3.3: Redesign the Bimba Update Overlay**
    *   **Description:** Convert the Bimba Update Overlay from a static form into a conversational, agent-driven workflow initiated from the "LLM Suggestions" button.
    *   **Details:** The user will interact with the agent in the new floating UI. The agent will use its skills (`UnifiedRag`, `suggestBimbaUpdate`) to discuss changes, present them for approval, and then apply them using `applyBimbaUpdate`. This makes the process interactive and context-rich.
    *   **PRD Ref:** 3.3.2

    **CODEBASE CONTEXT:**
    *   **Target Component:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/BimbaUpdateOverlay.tsx`
    *   **LLM Suggestions Button:** Currently around lines 2818-2860 (in review modal)
    *   **Current AG-UI Integration:** Already has AG-UI event handling (lines 1680-2860)
    *   **Workflow Redesign:**
        - Replace form-based interaction with conversational flow
        - Trigger FloatingAgent with specific context when "LLM Suggestions" clicked
        - Pass current coordinate and node data as agent context
        - Use agent skills for suggestion generation instead of direct API calls
    *   **Skills Integration:**
        - `UnifiedRag` skill: Already exists in `epii_app/friendly-file-back2front/shared/services/unifiedRAG.js`
        - `suggestBimbaUpdate`: Split from existing `bimba-update-management` skill
        - `applyBimbaUpdate`: Split from existing `bimba-update-management` skill
    *   **State Management:** Maintain existing change tracking but integrate with agent workflow
    *   **Approval Flow:** Implement conversational approval in FloatingAgent before applying changes
    *   **Backward Compatibility:** Keep existing overlay for manual editing, add agent-driven path

---

## Epic 2.5: Bimba Update Management Evolution - Document-to-Multiple-Nodes Analysis

**Goal:** Extend the existing Bimba update management system to support document analysis across multiple user-specified target coordinates, while preserving all current functionality and routing through the Epi-Logos Agent for conversational approval.

### Sub-Tasks:

*   **[Backend] Task 2.5.1: Extend Bimba Update Management Skill for Multi-Coordinate Analysis**
    *   **Description:** Enhance the existing bimba-update-management skill to accept multiple target coordinates for a single document, allowing the LLM to analyze document content and generate coordinated suggestions across all specified nodes.
    *   **Details:** Extend the current single-coordinate workflow to support multiple coordinates with relevance hints, while maintaining backward compatibility with the existing single-coordinate mode.

    **CODEBASE CONTEXT:**
    *   **Current Skill:** `epii_app/friendly-file-back2front/shared/services/bimba-update-management-skill.js`
    *   **Current Single Coordinate Flow:** Lines 786-807 in BimbaUpdateOverlay.tsx (executeSkillWithAGUI call)
    *   **Current Parameters:** Lines 788-795 (coordinate, nodeProperties, relationships, documentContent, documentType, documentName)
    *   **Enhancement Strategy:**
        - **Backward Compatibility**: Keep existing single-coordinate mode working
        - **Multi-Coordinate Mode**: Add new parameter structure for multiple coordinates
        - **Relevance-Aware Analysis**: Use relevance hints to guide LLM analysis for each coordinate
        - **Coordinated Suggestions**: Generate suggestions that consider relationships between target coordinates
    *   **Enhanced Skill Parameters:**
        ```javascript
        // New multi-coordinate mode
        {
          analysisMode: 'multi-coordinate', // vs existing 'single-coordinate'
          documentContent: '...', // Same as current
          documentName: 'Strategic Plan 2025.md', // Same as current
          documentType: 'markdown', // Same as current
          targetCoordinates: [
            {
              coordinate: '#5-1',
              relevanceHint: 'technical implementation',
              nodeProperties: {...}, // Current node properties including relational properties
              relationships: [...] // Current node relationships
            },
            {
              coordinate: '#5-2',
              relevanceHint: 'process dynamics',
              nodeProperties: {...},
              relationships: [...]
            }
          ]
        }
        ```
    *   **LLM Enhancement:** Modify the LLM prompt to analyze document content for relevance to each specified coordinate and generate coordinated suggestions
    *   **AG-UI Response:** Extend BIMBA_UPDATE_SUGGESTIONS event to include multi-coordinate results
    *   **Embedding Integration:** Include `generateBimbaEmbeddings` BPMCP tool call for all updated nodes to maintain embedding accuracy
    *   **Relational Property Management:** Support creation and updating of relational properties with detailed structures, ensuring coherence between Notion relational properties and Bimba graph relationships

*   **[Frontend] Task 2.5.2: Add Multi-Coordinate Selection Mode to BimbaUpdateOverlay**
    *   **Description:** Extend the existing BimbaUpdateOverlay interface to support a new "Document-to-Multiple-Nodes" workflow alongside the current single-coordinate workflow.
    *   **Details:** Add a workflow toggle and multi-coordinate selection interface while preserving all existing functionality.

    **CODEBASE CONTEXT:**
    *   **Current Component:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/BimbaUpdateOverlay.tsx`
    *   **Current Document Selection:** Lines 2456-2488 (existing document list with click selection)
    *   **Current Tree Selection:** Lines 625-640 (handleNodeSelect for single coordinate)
    *   **Current Generate Button:** Lines 2512-2524 (existing "Generate Suggestions" button)
    *   **Enhancement Strategy:**
        - **Workflow Toggle**: Add radio buttons for "Single Node Analysis" vs "Multi-Node Analysis"
        - **Preserve Existing Flow**: Keep current single-coordinate workflow unchanged
        - **Multi-Select Tree**: Enhance RecursiveFullBimbaTree to support checkbox selection
        - **Relevance Hints**: Add text inputs for each selected coordinate
    *   **New UI Elements:**
        - **Analysis Mode Toggle**: Radio buttons to switch between single/multi-coordinate modes
        - **Multi-Select Tree**: Checkboxes in RecursiveFullBimbaTree for multi-coordinate selection
        - **Selected Coordinates Panel**: List of selected coordinates with relevance hint inputs
        - **Enhanced Generate Button**: Context-aware button text based on selected mode
    *   **State Management Extensions:**
        ```typescript
        // Add to existing state
        const [analysisMode, setAnalysisMode] = useState<'single-coordinate' | 'multi-coordinate'>('single-coordinate');
        const [selectedCoordinates, setSelectedCoordinates] = useState<Array<{
          coordinate: string;
          relevanceHint: string;
          nodeTitle?: string;
        }>>([]);
        ```
    *   **Backward Compatibility**: All existing single-coordinate functionality remains unchanged

*   **[Frontend] Task 2.5.3: Enhance RecursiveFullBimbaTree for Multi-Selection**
    *   **Description:** Extend the existing RecursiveFullBimbaTree component to support checkbox-based multi-selection while maintaining the current single-selection functionality.
    *   **Details:** Add optional multi-select mode to the tree component without breaking existing usage.

    **CODEBASE CONTEXT:**
    *   **Current Component:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/RecursiveFullBimbaTree.tsx`
    *   **Current Selection:** Lines 336-346 (single node selection with onClick)
    *   **Current Node Rendering:** Lines 289-386 (renderTreeNode function)
    *   **Enhancement Strategy:**
        - **Optional Multi-Select**: Add optional props for multi-selection mode
        - **Checkbox Integration**: Add checkboxes when in multi-select mode
        - **Preserve Single-Select**: Keep existing single-selection behavior as default
    *   **New Props:**
        ```typescript
        interface RecursiveFullBimbaTreeProps {
          // ... existing props
          multiSelectMode?: boolean;
          selectedCoordinates?: string[];
          onCoordinateToggle?: (coordinate: string, selected: boolean) => void;
        }
        ```
    *   **Implementation**: Add checkboxes next to coordinate nodes when multiSelectMode is true
    *   **Backward Compatibility**: Component works exactly as before when multiSelectMode is false/undefined

*   **[Backend] Task 2.5.4: Implement Agent-Driven Multi-Coordinate Workflow**
    *   **Description:** Route the new multi-coordinate document analysis through the Epi-Logos Agent for conversational presentation and approval, while keeping the existing single-coordinate flow unchanged.
    *   **Details:** Create agent workflow for multi-coordinate analysis that provides conversational explanation and guided application.

    **CODEBASE CONTEXT:**
    *   **Current Direct Execution:** BimbaUpdateOverlay.tsx lines 786-807 (executeSkillWithAGUI call)
    *   **Agent Integration Strategy:**
        - **Mode Detection**: Route multi-coordinate requests through agent, keep single-coordinate direct
        - **Conversational Presentation**: Agent explains suggestions for each coordinate
        - **Interactive Approval**: User can approve/reject suggestions per coordinate
        - **Guided Application**: Agent applies approved changes with feedback
    *   **Agent Workflow:**
        ```
        User: [Selects multi-coordinate mode, chooses document + coordinates with hints]
        System: Routes to Epi-Logos Agent instead of direct skill execution
        Agent: "I'll analyze this document for the 3 coordinates you selected..."
        Agent: "For #5-1 (technical implementation), I found these relevant updates..."
        Agent: "For #5-2 (process dynamics), the document suggests..."
        Agent: "I also noticed these coordinates should be connected because..."
        Agent: "Based on the analysis, I'll create a 'HARMONIZES_WITH' relationship with detailed properties..."
        User: "Apply the #5-1 suggestions but tell me more about the #5-2 changes"
        Agent: [Provides detailed explanation and applies approved changes]
        Agent: "Updates applied successfully. Creating relational properties from analysis data..."
        Agent: "Regenerating embeddings for updated nodes..."
        Agent: "Embeddings updated for #5-1 and #5-2. Knowledge base is now current."
        ```
    *   **Implementation**: Modify generateLLMSuggestions() to detect multi-coordinate mode and route to agent
    *   **Embedding Regeneration**: Automatically call `generateBimbaEmbeddings` BPMCP tool for all updated nodes
    *   **Relational Property Integration**:
        - Parse analysis files for relational properties (semanticFramework, epistemicEssence, archetypalAnchors)
        - Create detailed relationships with comprehensive property structures using existing `manageBimbaRelationships` tool
        - Ensure same analysis files used for both Notion crystallization and Bimba property updates
    *   **Fallback**: Single-coordinate mode continues to work exactly as before

*   **[Backend] Task 2.5.5: Implement Advanced Node Detail Awareness**
    *   **Description:** Enhance the node detail awareness system to provide comprehensive context about node relationships, dependencies, and impact analysis for updates.
    *   **Details:** Implement deep relationship traversal, impact analysis, and intelligent suggestion generation based on node context and relationships.

    **CODEBASE CONTEXT:**
    *   **Current Node Fetching:** BimbaUpdateOverlay.tsx node data fetching and property management
    *   **Relationship Handling:** Lines 29-43 (BimbaNode interface with relationships)
    *   **Enhancement Areas:**
        - Deep relationship traversal (2-3 levels) for context awareness
        - Impact analysis for property changes (what other nodes are affected)
        - Intelligent default value suggestions based on related nodes
        - Conflict detection between related node properties
        - Historical change tracking and pattern recognition
    *   **New BPMCP Tools:**
        - `analyzeNodeImpact`: Analyze impact of changes on related nodes
        - `suggestPropertyDefaults`: Suggest property values based on context
        - `detectPropertyConflicts`: Identify conflicts in batch updates
        - `getNodeContext`: Get comprehensive node context with relationships
    *   **Integration:** Enhance existing queryBimbaGraph and bimbaKnowing tools with deeper context awareness
    *   **Embedding Workflow:** Ensure `generateBimbaEmbeddings` is called after any property updates to maintain search accuracy

*   **[Backend] Task 2.5.6: Implement Analysis-Driven Relational Property Management**
    *   **Description:** Create sophisticated relational property management that extracts relational properties from the same analysis files used for Notion crystallization and applies them to Bimba graph relationships.
    *   **Details:** Implement comprehensive relationship creation and updating using analysis file data, ensuring the same relational property information flows to both Notion (via manual property setup) and Bimba graph (via automated property updates).

    **CODEBASE CONTEXT:**
    *   **Current Relationship Schema:** `epii_app/friendly-file-backend/databases/shared/schemas/bimba.schema.mjs` (lines 134-232)
    *   **Current Relationship Management:** `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/docs/manageBimbaRelationships_Tool_Guide.md`
    *   **Notion Integration:** `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/notion/crystallizeToNotion.ts` (lines 218-243)
    *   **Current Relational Properties:** Lines 324-334 in bimba.schema.mjs (parentCoordinate, childCoordinates as Notion relations)
    *   **Enhancement Strategy:**
        - **Detailed Relationship Structures**: Support complex relationship properties with nested metadata
        - **Analysis File Integration**: Parse and apply relational properties from the same analysis files used for Notion crystallization
        - **Consistent Data Source**: Ensure both Notion (manual setup) and Bimba graph (automated) use identical analysis data
    *   **Enhanced Relationship Structure:**
        ```javascript
        // Enhanced relationship with detailed properties
        {
          source: '#5-1',
          target: '#5-2',
          relationshipType: 'HARMONIZES_WITH',
          properties: {
            // Core relationship metadata
            strength: 0.85,
            confidence: 0.92,
            bidirectional: true,

            // QL-specific properties
            qlType: 'processual_mediation',
            qlDynamics: 'formal_mediation',
            qlContextFrame: 'structural_integration',

            // Analysis-derived properties
            semanticFramework: 'Synthesizes, Transcends',
            epistemicEssence: 'Conceptual Integration',
            archetypalAnchors: 'Divine Marriage, Axis Mundi',

            // Temporal and contextual metadata
            discoveredVia: 'document-analysis',
            analysisConfidence: 0.88,
            createdBy: 'epi-logos-agent',
            lastVerified: '2025-01-02T10:30:00Z',

            // Analysis file reference
            sourceAnalysisFile: 'strategic_plan_analysis_2025.md',
            analysisSection: 'relational_properties'
          }
        }
        ```
    *   **Analysis File Integration:**
        - Parse relational properties from the same analysis files used for Notion crystallization
        - Convert analysis text into structured relationship properties for Bimba graph
        - Create appropriate relationship types based on semantic framework analysis
        - Maintain traceability from analysis file to relationship creation
        - Ensure consistency: same analysis data → Notion (manual) + Bimba graph (automated)
    *   **Existing Tool Enhancement:**
        - **`manageBimbaRelationships`**: Already exists and handles relationship CRUD operations (lines 1565-1643 in BimbaUpdateOverlay.tsx)
        - **`crystallizeToNotion`**: Already handles Notion page creation with relations (lines 218-243 in crystallizeToNotion.ts)
        - **Enhancement Strategy**: Extend existing tools rather than creating new ones
    *   **Enhanced Tool Usage:**
        - Use `manageBimbaRelationships` with enhanced relationshipProperties parameter for detailed structures from analysis files
        - Integrate analysis file parsing into existing bimba-update-management-skill.js workflow
        - Leverage existing relationship handling patterns from BimbaUpdateOverlay (lines 897-948)
        - Ensure analysis file data consistency between Notion crystallization and Bimba property updates

---

## Epic 2.6: Expert-Oriented Routing with Active Mode Detection

**Goal:** Implement intelligent routing that directs chat interactions to the appropriate subsystem expert based on the active page/mode, ensuring context-aware agent responses.

### Sub-Tasks:

*   **[Backend] Task 2.6.1: Implement Active Mode Detection Service**
    *   **Description:** Create a service that tracks the current active page/mode and routes agent interactions to the appropriate subsystem expert skill.
    *   **Details:** Detect active subsystem context and route chat interactions to the correct expert (#5 for epii, #4 for nara, #1 for paramasiva, etc.).

    **CODEBASE CONTEXT:**
    *   **Current Routing:** `epii_app/friendly-file-back2front/shared/services/bimba-skills-router.js` (lines 169-202)
    *   **Current Chat Skills:**
        - Epii Chat: #5 (lines 363-368 in bimba-skills-registry.js)
        - Need to implement: Nara Chat (#4), Paramasiva Chat (#1), Anuttara Chat (#0)
    *   **App Routing:** `epii_app/friendly-file-front/src/App.tsx` (lines 36-45)
    *   **Page-to-Coordinate Mapping:**
        - `/epii` → #5 (Epii expert)
        - `/chat` → #4 (Nara expert)
        - `/meta3d` → #1 (Paramasiva expert)
        - `/meta2d` → #0 (Anuttara expert)
        - `/files` → # (Universal/Root expert)
    *   **Implementation Strategy:**
        - Create `ActiveModeService` to track current route
        - Enhance AG-UI events with `activeMode` context
        - Update skills router to prioritize mode-specific experts
        - Fallback to universal expert for cross-mode queries

*   **[Frontend] Task 2.6.2: Implement Mode Context Provider**
    *   **Description:** Create a context provider that tracks the active subsystem mode and communicates it to the Epi-Logos Agent for intelligent routing.
    *   **Details:** Monitor route changes and provide mode context to the agent for expert-oriented responses.

    **CODEBASE CONTEXT:**
    *   **Target Location:** `epii_app/friendly-file-front/src/epi-logos-system/4_contexts/ActiveModeProvider.tsx` (NEW FILE)
    *   **Integration Point:** Add to App.tsx alongside UserContextProvider
    *   **Route Detection:** Use React Router's useLocation hook to detect active route
    *   **Mode Context Interface:**
        ```typescript
        interface ActiveModeContext {
          currentMode: 'epii' | 'nara' | 'paramasiva' | 'anuttara' | 'universal';
          currentCoordinate: string; // #5, #4, #1, #0, or #
          expertSkillId: string; // epii-chat, nara-chat, etc.
          modeCapabilities: string[]; // Available actions in current mode
        }
        ```
    *   **Agent Integration:** Send mode context with every agent interaction via AG-UI events
    *   **Mode Transitions:** Handle smooth transitions between modes with context preservation

*   **[Backend] Task 2.6.3: Create Subsystem Expert Chat Skills**
    *   **Description:** Implement dedicated chat skills for each subsystem expert to provide specialized, context-aware responses.
    *   **Details:** Create expert chat skills for Nara (#4), Paramasiva (#1), and Anuttara (#0) following the existing Epii chat pattern.

    **CODEBASE CONTEXT:**
    *   **Epii Chat Pattern:** `epii_app/friendly-file-back2front/subsystems/5_epii/skills/epii-chat-skill.js`
    *   **New Skills to Create:**
        - `epii_app/friendly-file-back2front/epi-logos-system/2_skills/nara-expert-chat-skill.js` (#4)
        - `epii_app/friendly-file-back2front/epi-logos-system/2_skills/paramasiva-expert-chat-skill.js` (#1)
        - `epii_app/friendly-file-back2front/epi-logos-system/2_skills/anuttara-expert-chat-skill.js` (#0)
        - `epii_app/friendly-file-back2front/epi-logos-system/2_skills/universal-expert-chat-skill.js` (#)
    *   **Expert Specializations:**
        - Nara Expert (#4): User context, identity, journaling, oracle functions
        - Paramasiva Expert (#1): 3D visualization, topological forms, QL processing
        - Anuttara Expert (#0): 2D visualization, foundational geometry, void operations
        - Universal Expert (#): Cross-system coordination, file management, general queries
    *   **Skill Registration:** Add to epi-logos-skills-registry.js with appropriate coordinates
    *   **Context Integration:** Each expert has access to their subsystem's specific context and capabilities

---

## Epic 3.5: EpiiModePage Layout Redesign & Chat Component Deprecation

**Goal:** Redesign the EpiiModePage layout to remove the embedded chat component, expand DocumentCanvas to full width, and reposition the sidebar for optimal workflow with the new floating Epi-Logos Agent.

### Sub-Tasks:

*   **[Frontend] Task 3.5.1: Remove EpiiChat from EpiiModePage Layout**
    *   **Description:** Remove the embedded EpiiChat component from the EpiiModePage split layout and expand DocumentCanvas to use the full available width.
    *   **Details:** Eliminate the 1/3 + 2/3 split layout, making DocumentCanvas occupy the full main content area while preserving the collapsible sidebar functionality.

    **CODEBASE CONTEXT:**
    *   **Target File:** `epii_app/friendly-file-front/src/subsystems/5_epii/5_integration/EpiiModePage.tsx`
    *   **Layout Changes:**
        - Remove EpiiChat import (line 13) and usage (lines 192-196)
        - Remove split layout div structure (lines 172-196)
        - Expand DocumentCanvas container to full width (remove w-2/3 class from line 199)
        - Remove chat-related state and handlers
        - Preserve sidebar toggle functionality (lines 131-167)
    *   **DocumentCanvas Expansion:** Change from `w-2/3` to `w-full` in DocumentCanvas container
    *   **Sidebar Preservation:** Keep existing collapsible sidebar with coordinate tree and document listing
    *   **Context Migration:** Move chat context to FloatingEpiLogosAgent via session history service

*   **[Frontend] Task 3.5.2: Optimize Sidebar Positioning and Responsiveness**
    *   **Description:** Enhance the EpiiSidebar positioning and responsiveness now that DocumentCanvas has full width available.
    *   **Details:** Improve sidebar overlay positioning, add better responsive behavior, and optimize the coordinate tree display for the new layout.

    **CODEBASE CONTEXT:**
    *   **Target File:** `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/EpiiSidebar.tsx`
    *   **Current Positioning:** Fixed width 256px (w-64) with absolute positioning (lines 147-167 in EpiiModePage)
    *   **Enhancements:**
        - Improve overlay backdrop behavior
        - Add smooth transitions for sidebar toggle
        - Optimize coordinate tree rendering for better performance
        - Add keyboard shortcuts for sidebar toggle (Ctrl+B)
    *   **Responsive Design:** Ensure sidebar works well on different screen sizes
    *   **Z-Index Management:** Coordinate with FloatingAgent z-index (ensure sidebar is below floating agent)

*   **[Frontend] Task 3.5.3: Implement AG-UI Event Mapping for All Frontend Actions**
    *   **Description:** Comprehensively map all frontend actions in the Epii subsystem to standard AG-UI events, minimizing custom event types.
    *   **Details:** Audit all user interactions and state changes in DocumentCanvas, EpiiSidebar, and BimbaUpdateOverlay to ensure they emit appropriate AG-UI events.

    **CODEBASE CONTEXT:**
    *   **Standard AG-UI Events to Use:**
        - `StateDelta`: For document selection, coordinate changes, UI state updates
        - `ToolCallStart/End`: For analysis requests, file uploads, bimba updates
        - `TextMessageStart/Content/End`: For user inputs and agent responses
        - `StateSnapshot`: For full state synchronization
        - `Custom`: Only when absolutely necessary with Bimba-specific payload
    *   **Frontend Actions to Map:**
        - Document selection → `StateDelta` with document context
        - Coordinate selection → `StateDelta` with coordinate context
        - File upload → `ToolCallStart` with upload parameters
        - Analysis start → `ToolCallStart` with analysis parameters
        - Bimba update → `ToolCallStart` with update parameters
        - Text selection → `StateDelta` with selection context
    *   **Implementation Files:**
        - DocumentCanvas: Lines 1547-1678 (action handlers)
        - EpiiSidebar: Lines 456-720 (selection handlers)
        - BimbaUpdateOverlay: Lines 1680-2860 (update handlers)
    *   **Event Emission Pattern:** Use existing `sendWebSocketMessage` from webSocketService
    *   **Backward Compatibility:** Maintain existing functionality while adding AG-UI events

---

## Epic 4: Evolve Backend Skills for Dynamic, Agent-Led Orchestration (Future Development)

**Goal:** To transition from monolithic skills to a suite of atomic, composable tools that the agent can dynamically chain together based on user intent and the QL framework.

*   **[Backend] Task 4.1: Decompose `epii-analysis-pipeline`**
    *   **Description:** Deprecate the single `epii-analysis-pipeline` skill. The agent will instead be taught to orchestrate the constituent BPMCP tools (`chunkDocument`, `generateEmbeddings`, `runVectorSearch`, etc.) in a flexible sequence.
    *   **QL Context:** This is a direct implementation of QL-based reasoning. The agent moves from understanding the user's goal (Pos 0/1) to selecting the right tools for the job (Pos 2), synthesizing the results (Pos 3), and integrating the new knowledge (Pos 4).

    **CODEBASE CONTEXT:**
    *   **Current Pipeline:** `epii_app/friendly-file-back2front/subsystems/5_epii/skills/epii-analysis-pipeline-skill.js`
    *   **Pipeline Implementation:** `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/pipelines/epii_analysis_pipeline.mjs`
    *   **Constituent Tools to Extract:**
        - `chunkDocument`: From pipeline stages (stage -5)
        - `generateEmbeddings`: From pipeline stages (stage -4)
        - `runVectorSearch`: From pipeline stages (stage -3)
        - `runGraphAnalysis`: From pipeline stages (stage -2)
        - `synthesizeResults`: From pipeline stages (stage -1)
        - `integrateKnowledge`: From pipeline stages (stage -0)
    *   **BPMCP Tool Locations:** Create in `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/`
    *   **Agent Orchestration:** Implement in new orchestrator-agent.js (from Task 1.3)
    *   **QL Framework Integration:** Use QL positions to guide tool selection and sequencing
    *   **Skill Registry:** Update `epii_app/friendly-file-back2front/shared/services/bimba-skills-registry.js`
    *   **Backward Compatibility:** Keep existing pipeline skill as "auto-orchestration" option

*   **[Backend] Task 4.2: Refine `bimba-update-management`**
    *   **Description:** Split the `bimba-update-management` skill into two distinct, atomic skills.
    *   **Details:**
        1.  `suggestBimbaUpdate`: A read-only operation using `UnifiedRag` to gather context and suggest changes.
        2.  `applyBimbaUpdate`: A write operation that commits the changes to the database after user approval.
    *   **Benefit:** This separation creates a safe, conversational loop, preventing the agent from making changes without explicit user confirmation.

    **CODEBASE CONTEXT:**
    *   **Current Skill:** `epii_app/friendly-file-back2front/shared/services/bimba-update-management-skill.js`
    *   **Split Points:**
        - `suggestBimbaUpdate`: Lines 35-400 (analysis and suggestion generation)
        - `applyBimbaUpdate`: Lines 400-620 (database write operations)
    *   **New Skill Files:**
        - `epii_app/friendly-file-back2front/subsystems/5_epii/skills/suggest-bimba-update-skill.js` (NEW FILE)
        - `epii_app/friendly-file-back2front/subsystems/5_epii/skills/apply-bimba-update-skill.js` (NEW FILE)
    *   **UnifiedRag Integration:** Already integrated in current skill (lines 136-155)
    *   **Database Operations:** Use existing BPMCP tools (updateBimbaGraph, queryBimbaGraph)
    *   **Skill Metadata:**
        - `suggestBimbaUpdate`: Bimba coordinate #5-2-1, QL Position 1, read-only
        - `applyBimbaUpdate`: Bimba coordinate #5-2-2, QL Position 4, write operations
    *   **Safety Mechanisms:** Implement approval workflow in agent orchestration
    *   **AG-UI Integration:** Emit appropriate events for suggestion display and confirmation