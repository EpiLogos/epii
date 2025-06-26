

# Product Requirements Document (PRD): Epii Agentic Redesign

**Version:** 1.0

**Date:** 2023-10-27

**Author:** Trae AI

## 1. Overview & Vision

This document outlines the requirements for the evolution of the Epii subsystem into a fully integrated, context-aware, and proactive agentic experience. The core vision is to transform the user's interaction with the application from a series of discrete, user-initiated tasks into a continuous, collaborative dialogue with a "floating" intelligent agent. This agent will be ever-present but unobtrusive, capable of understanding the user's context, anticipating needs, and seamlessly orchestrating backend tools and frontend components to facilitate a deeper, more intuitive workflow.

This redesign is inspired by the capabilities of modern agentic frameworks like the **Copilot Kit SDK** and will be built upon the existing **AG-UI (Agent-Generated User Interface)** protocol, harmonizing the two to create a powerful, bespoke agentic architecture.

## 2. Core Problem & Goals

### 2.1. Problem Statement

The current Epii agent is powerful but its functionality is hardwired into specific UI components (`EpiiModePage`, Bimba Update Overlay). The user must navigate to specific sections to interact with the agent, limiting its utility. The agent lacks awareness of the user's broader context within the application, and the communication is largely one-way (backend to frontend). Furthermore, state management issues in components like the Document Canvas lead to a disjointed user experience.

### 2.2. High-Level Goals

1.  **Develop a Floating, Context-Aware Agent:** Implement a persistent, overlay-style chat component that is always accessible. This agent will use the standard AG-UI protocol to be contextually aware of the active UI components and user actions, all grounded in the Bimba coordinate system.
2.  **Shift to Agent-Led Orchestration:** Evolve from a model where the frontend calls backend skills to one where the agent intelligently orchestrates both backend skills (via BPMCP) and frontend actions based on user intent and context. This orchestration will be deeply tied to the Quaternal Logic embedded in the Bimba coordinate system.
3.  **Enhance Core Epii Functionalities:** Leverage the new agentic model to dramatically improve the user experience of key features, including the Bimba Update Manager, Document Canvas interaction, and the analysis pipeline.
4.  **Stabilize Frontend State Management:** Fully transition state management to the global, AG-UI-driven WebSocket service, deprecating the fragmented and buggy `EpiiContext` approach. This ensures a robust, predictable, and seamless user experience, which is foundational for reliable context passing.
5.  **Deepen BPMCP & Skill Integration:** Expand the suite of BPMCP tools and Epii agent skills to support more dynamic and nuanced interactions. The `UnifiedRag` skill and its associated database components are central to this, providing the foundational framework for the system to reason and operate within the Bimba coordinate system.

## 3. Key Features & Requirements

### 3.1. The Floating Agent UI

*   **Requirement 3.1.1:** A new, persistent chat component shall be developed. It should be accessible as a floating overlay across the entire application.
*   **Requirement 3.1.2:** The agent's UI shall be able to display not just text, but also rich, interactive components (Generative UI) suggested by the agent (e.g., a confirmation dialog, a list of suggested documents).
*   **Requirement 3.1.3:** The agent must be able to proactively offer assistance based on user behavior (e.g., if a user is lingering on the Bimba Update Overlay, the agent might offer to run the `bimba-update-management` skill).

### 3.2. AG-UI Protocol Enhancement (Harmonization with Copilot Kit Concepts)

*   **Requirement 3.2.1:** The existing AG-UI protocol will be leveraged for all agent-frontend communication, prioritizing standard event types (e.g., `ToolCallStart`, `ToolCallEnd`, `StateDelta`) over custom ones where possible. The goal is to create a robust, bidirectional communication channel for context and actions, inspired by Copilot Kit's capabilities but implemented within the existing AG-UI and WebSocket service framework.
    *   **Context Pull (Agent -> Frontend):**
        *   **Mechanism:** The agent will use the `getFrontendContext` BPMCP tool. This tool will emit a standard `ToolCallStart` AG-UI event with a specific tool name (e.g., `frontend:getContext`). The existing frontend `webSocketService` will listen for this. Frontend components will register their context-providing functions with a central service using a new React hook, `useAgentContext(providerFunction, dependencies)`.
        *   **Payload Schema for `frontend:getContext` (`args` in `ToolCallStart`):**
            ```json
            {
              "componentId": "string", // Bimba Coordinate or other unique ID
              "contextType": "string" // e.g., 'selection', 'fullState', 'viewPort'
            }
            ```
    *   **Context Push (Frontend -> Agent):**
        *   **Mechanism:** The frontend service, upon receiving the context request, will invoke the appropriate registered function. The result will be sent back to the backend within the `ToolCallEnd` event's `result` payload, resolving the `getFrontendContext` tool call.
    *   **Frontend Action Invocation (Agent -> Frontend):**
        *   **Mechanism:** The agent will use the `executeFrontendAction` skill. This will emit a `ToolCallStart` event with the tool name `frontend:invokeAction` and the action details in its `args`. The `webSocketService` will route this to the `AgentActionRegistry`, which will execute the corresponding handler registered via the `useAgentAction(actionName, handlerFunction)` hook.
        *   **Payload Schema for `frontend:invokeAction` (`args` in `ToolCallStart`):**
            ```json
            {
              "actionName": "string", // e.g., 'showNotification', 'updateNodeVisuals'
              "componentId": "string", // Bimba Coordinate or other unique ID
              "args": {}
            }
            ```

*   **Requirement 3.2.2:** The central `webSocketService` on the frontend will be the single point of entry for all incoming AG-UI events. It will be responsible for delegating context requests and action invocations to the appropriate registries (`AgentContextProvider`, `AgentActionRegistry`). This centralizes logic and aligns with the strategy of using the WebSocket connection for global state management.

*   **Requirement 3.2.3 (New Frontend Services & Hooks):**
    *   **`AgentContextProvider`:** A service (likely a React Context Provider) that manages the registry of context-providing functions from various components.
    *   **`AgentActionRegistry`:** A service that holds a map of `actionName` to handler functions registered by components.
    *   **`useAgentContext(componentId: string, contextProvider: () => any, dependencies: any[])`:** A React hook that allows a component to register a function that provides its current state or context. The `componentId` should be a unique identifier, preferably its Bimba coordinate.
    *   **`useAgentAction(actionName: string, handler: (args: any) => void)`:** A React hook that allows a component to register a function to be called by the agent.

### 3.3. Frontend Component & State Management Overhaul

*   **Requirement 3.3.1 (Document Canvas):** The state management for the Document Canvas will be completely refactored. The local `EpiiContext` and `useEpiiAnalysis` hooks will be deprecated and replaced by the global `webSocketService`. All state changes will be received as `StateDelta` events from the backend, ensuring a single, reliable source of truth for documents, analysis sessions, and UI state. The specific state to be globalized includes: `activeDocument`, `selectedNodes`, `graphLayout`, `analysisResults`, and `uiFlags` (e.g., `isLoading`).
*   **Requirement 3.3.2 (Bimba Update Overlay):** The overlay will be redesigned to be fully driven by the agent. The existing "LLM Suggestions" button will be a primary entry point to the agentic overlay. Instead of a static form, it will become a conversational interface where the user discusses the update with the agent. The agent will then use the `bimba-update-management` skill, which can now suggest and apply updates across multiple Bimba coordinates, not just the one being viewed. The agent will orchestrate a chat-based workflow:
    1.  User initiates an update, opening the agent overlay in the context of a Bimba node.
    2.  Agent prompts: "I see you want to update this node. What changes are you considering? I can also look for related information to help."
    3.  User interacts via chat. The agent can use `UnifiedRag` to pull context from related documents or other nodes.
    4.  The agent presents suggested changes (e.g., filling in form fields, suggesting new links) for the user to review and approve before applying them via the backend skill.
*   **Requirement 3.3.3 (Document Chat):** The chat functionality will be subsumed by the new global Floating Agent. The agent will be aware when the user is viewing a document and will automatically load the relevant chat history and context.
*   **Requirement 3.3.4 (Analysis Pipeline):** The agent will orchestrate the `epii-analysis-pipeline`. The user will request analysis in natural language, and the agent will configure and execute the pipeline, streaming progress back to the UI via standard AG-UI events.

### 3.4. BPMCP & Epii Agent Skill Development

*   **Requirement 3.4.1 (New BPMCP Tool):** A new BPMCP tool, `getFrontendContext`, will be created. This tool will be the agent's mechanism for triggering the `frontend:getContext` event on the frontend via the AG-UI WebSocket bridge. It will be an asynchronous tool that waits for the corresponding `ToolCallEnd` event before returning the context to the agent.
*   **Requirement 3.4.2 (New Epii Skill):** A new universal agent skill, `executeFrontendAction`, will be developed. This skill will allow any agent to trigger the `frontend:invokeAction` event on the frontend. It will take `actionName`, `componentId`, and `args` as parameters.
*   **Requirement 3.4.3 (Tool & Skill Refinement):** Existing tools and skills will be refined to support a more dynamic, agent-led workflow, embodying the principles of Quaternal Logic (QL) and the Bimba coordinate system.
    *   **Philosophical Alignment & Quaternal Logic (QL) Foundation:** All agentic orchestration will be guided by the principles of QL. The agent will use QL as a meta-framework for reasoning about tasks. For example, when approaching a problem, it will frame it using the QL positions:
        *   **Pos 0 (Implicit Field):** What is the unstated goal or potential? (Leverages `UnifiedRag` to find latent connections).
        *   **Pos 1 & 2 (What & How):** What is the explicit data/content, and how should it be processed? (Maps to specific BPMCP tools).
        *   **Pos 3 (Formal Mediation):** How do I integrate the results into a coherent pattern? (Synthesis step, often involving an LLM call).
        *   **Pos 4 (Contextual Arena):** Where does this new knowledge fit in the broader Bimba system? (Updating graphs, notifying user).
        *   The agent's internal monologue and planning steps should reflect this QL structure, drawing high-level guidance from the provided QL documentation.
    *   **Dynamic, Multi-Tool Orchestration (`epii-analysis-pipeline`):** The monolithic `epii-analysis-pipeline` skill will be deprecated in favor of agent-led orchestration of its constituent parts, which are already modular in the backend. The agent will dynamically chain these BPMCP tools based on the user's request and the QL framework:
        1.  `startAnalysisSession` (Initializes the context).
        2.  `chunkDocument`
        3.  `generateEmbeddings`
        4.  `runVectorSearch`
        5.  `runGraphAnalysis`
        6.  `synthesizeResults` (LLM call to interpret and present findings).
        This allows for a flexible, conversational analysis process where the user can intervene at any step.
    *   **Core Skill Focus (`UnifiedRag` and Epii Agent Skills):**
        *   **`UnifiedRag`:** This is the agent's primary tool for QL Position 0/1 reasoning (understanding the implicit field and the 'what'). It must be enhanced to accept more flexible inputs, such as a Bimba coordinate, a document chunk, or a conversational snippet, and return a rich context object containing text, data, and related coordinates. This makes it the cornerstone of the agent's ability to ground its reasoning in the existing knowledge base.
        *   **Epii Agent Skills (`bimba-update-management`, etc.):** These skills represent QL Position 2/4 actions (the 'how' and the 'where'). They will be refined to be more atomic. For example, `bimba-update-management` will be broken down into `suggestBimbaUpdate` (a read-only operation using `UnifiedRag`) and `applyBimbaUpdate` (a write operation). This separation allows the agent to have a conversational loop with the user before committing any changes to the database.

## 4. Success Metrics

*   **User Engagement:** Increased use of agent-assisted features compared to manual interaction.
*   **Task Completion Time:** Reduction in the time it takes for users to perform complex tasks like updating Bimba or analyzing a set of documents.
*   **Qualitative Feedback:** User feedback indicates the new agentic interface feels more intuitive, helpful, and collaborative.
*   **Technical Stability:** A significant reduction in reported bugs related to state management in the Epii subsystem.
        