# Feature Context & Bimba-Alignment Package (FCBAP)

**Development Name:** Coordinate-based BPMCP and A2A-aligned agent skills Development
**Subsystem/Layer:** Epii (#5)
**Version:** 0.1.0 (Initial YOLO Draft)
**Date:** {{CURRENT_DATE}}
**Architect:** Epi-Logos Contextual Architect (BMad AI)

## 1. Introduction and Goals

This document outlines the initial architectural approach for the "Coordinate-based BPMCP and A2A-aligned agent skills Development" feature. The primary goal is to establish a robust and flexible framework that allows for the dynamic orchestration of BPMCP tools by intelligent agents, leveraging Bimba coordinates for contextual awareness and task routing, and defining A2A-aligned agent skills for standardized interaction and capability advertisement.

This FCBAP builds upon the requirements and epics detailed in the [Epii Feature Definition Document (EFDD)](./efdd.md) for this development.

**Key Architectural Goals:**

*   **Leverage Bimba Coordinates:** Ensure Bimba coordinates are central to agent awareness, tool selection, data interpretation, and skill invocation.
*   **Dynamic BPMCP Orchestration:** Enable agents to intelligently select and sequence BPMCP tools based on task context and available skills.
*   **A2A-Aligned Agent Skills:** Define a clear methodology for creating, registering, and discovering agent skills that are compatible with the existing A2A communication framework (`friendly-file-back2front`).
*   **Integrate with Epii Analysis Pipeline:** Utilize outputs from and potentially provide inputs to the Epii Analysis Pipeline, particularly Stage -3 (RAG & Bimba-Pratibimba Nexus).
*   **Modular and Extensible Design:** Create an architecture that allows for the easy addition of new agents, skills, and BPMCP tool integrations.
*   **Knowledge Synthesis:** Facilitate agent-level synthesis of information gathered through BPMCP tools and pipeline interactions.

## 2. Current System Context Relevant to this Feature

This development will interact with and extend several key existing components of the Epi-Logos ecosystem:

*   **Bimba-Pratibimba Memory-Coupled Peripherals (BPMCP):** A suite of 18+ tools for interacting with various data sources (Neo4j, Qdrant, MongoDB, Notion, Web). The architecture must allow agents to call these tools dynamically. The BPMCP operates via WebSocket and has a defined tool architecture.
*   **Epii Analysis Pipeline:** A 6-stage QL-aligned analytical engine. Stage -3 (RAG & Bimba-Pratibimba Nexus) is particularly relevant for leveraging existing RAG capabilities. Agents may consume outputs from this pipeline or trigger specific stages.
*   **Epii Mode (#5-0):** Focuses on Bimba-Pratibimba operations, sacred knowledge, and Notion/Neo4j unity. The new agent skills should respect and enhance these operations.
*   **Agent-to-Agent (A2A) Communication Layer (`friendly-file-back2front`, #5-4 Siva-Shakti):** This layer provides the core A2A communication hub, including:
    *   `a2a-server.js`: WebSocket server for agent communication.
    *   `a2a-message.schema.js`: Standardized message structure with Bimba extensions.
    *   `agent-cards/`: Defines agent capabilities and Bimba coordinates (e.g., `epii-agent-card.js`). This is where new A2A-aligned skills will be advertised.
    *   `skills/`: Contains the `bimba-skills-registry.js` and `bimba-skills-router.js` for central skill management and intelligent routing based on coordinates. New skills will need to be registered here.
*   **Bimba Coordinates:** The foundational spatial and semantic addressing system used throughout Epi-Logos. They will be crucial for context, routing, and skill definition.

## 3. Proposed Architectural Solution

This section details the proposed architecture for enabling coordinate-based BPMCP tool orchestration and A2A-aligned agent skills.

### 3.1. Core Architectural Principles

*   **Agent-Centric Design:** Intelligent agents are the primary actors, making decisions about tool usage and skill invocation.
*   **Skill-Based Capabilities:** Agent functionalities are exposed as discrete, discoverable, and invocable "skills."
*   **Coordinate-Driven Context:** Bimba coordinates provide the necessary spatial, semantic, and contextual information for agents to operate effectively.
*   **Decoupled Components:** Agents, skills, BPMCP tools, and the A2A layer should be loosely coupled to promote modularity and maintainability.

### 3.2. Key Components and Interactions

**(Diagram to be developed in a future iteration - conceptual flow described below)**

1.  **Intelligent Agent Focus: Epii Agent (Enhanced):**
    *   The primary agent for this development will be the existing **Epii agent**. Its capabilities will be enhanced to incorporate the new functionalities for coordinate-based BPMCP orchestration and A2A-aligned skills.
    *   The Epii agent will possess the logic to understand task requirements (potentially derived from user input or other system triggers within its operational domain).
    *   It will query the `Skills Registry` to discover available skills relevant to the task and current Bimba coordinate context.
    *   Based on discovered skills and internal logic, it will select and sequence BPMCP tools.
    *   It will interact with the A2A layer to communicate with other agents or report status.
    *   **Location of Enhancements:** Primarily within the existing Epii agent's codebase, likely in `epii_app/friendly-file-backend/agents/epiiAgent.js` (or equivalent) and its associated skill definitions in `friendly-file-back2front/agent-cards/epii-agent-card.js` and `friendly-file-back2front/skills/epii-skills-initializer.js`.
    *   **Consideration for Sub-Agents:** While the initial approach is to enhance the Epii agent, if specific functionalities emerge that are highly distinct, require a separate lifecycle, or would make the Epii agent overly complex, the creation of specialized sub-agents (coordinated by the Epii agent or operating peer-to-peer via A2A) will be considered. However, the preference is for simplicity by augmenting the existing agent first.

2.  **A2A-Aligned Agent Skills:**
    *   **Definition:** Skills will be defined as specific, invokable functions or modules that encapsulate a particular capability (e.g., "retrieve documents from Qdrant based on semantic query and Bimba coordinates," "summarize text using specific BPMCP tool").
    *   **Structure:** Each skill will have a defined input/output schema, specify the BPMCP tools it utilizes, and be associated with relevant Bimba coordinates (indicating its operational domain or the type of context it expects).
    *   **Registration (`agent-cards/` & `skills/` in `friendly-file-back2front`):
        *   Skills will be advertised in the respective `agent-card.js` (e.g., `epii-agent-card.js`).
        *   They will be registered in `bimba-skills-registry.js`, mapping the skill to its implementation and relevant Bimba coordinates.
        *   Initialization might occur in files like `epii-skills-initializer.js`.
    *   **Invocation:** Agents will invoke skills through the `bimba-skills-router.js`, which will handle locating and executing the skill based on the A2A message and coordinate context.

3.  **Dynamic BPMCP Tool Orchestration Logic (within Agents/Skills):
    *   Agents/Skills will contain the logic to dynamically select BPMCP tools.
    *   This selection will be based on the task, the current Bimba coordinate context, and the specific parameters of the skill being executed.
    *   Example: A "knowledge retrieval" skill might first use a BPMCP tool to query Neo4j for relevant nodes (Bimba coordinates), then use another BPMCP tool to fetch document chunks from Qdrant based on those coordinates, and finally a tool to summarize the results.

4.  **Bimba Coordinate Integration:**
    *   **Contextualization:** Agents will receive and operate within Bimba coordinate contexts.
    *   **Skill Matching:** The `Skills Registry` and `Router` will use Bimba coordinates to match tasks/requests to appropriate skills.
    *   **Data Tagging:** Data processed and generated by agents/skills will be tagged with relevant Bimba coordinates.
    *   **Tool Parameterization:** BPMCP tool calls will often include Bimba coordinates as parameters (e.g., to scope a search in Qdrant or Neo4j).

5.  **Interaction with Epii Analysis Pipeline:**
    *   **Consuming Pipeline Output:** Agents can be designed to act upon the structured output of the Epii Analysis Pipeline (e.g., identified patterns, semantic mappings from Stage -2, or RAG results from Stage -3).
    *   **Triggering Pipeline Stages:** Agents could potentially initiate or provide input to specific stages of the pipeline as part of a broader workflow.
    *   **Leveraging Stage -3 (RAG):** New agent skills can be designed to directly leverage the existing RAG capabilities within Stage -3, perhaps by formatting queries for it or processing its outputs in novel ways.

### 3.3. Data Flow and Control Flow (Conceptual)

*   **Control Flow:**
    1.  A task is initiated (e.g., via user request, A2A message from another agent).
    2.  The relevant agent receives the task, including Bimba coordinate context.
    3.  Agent queries `Skills Registry` via A2A for suitable skills based on task and coordinates.
    4.  Agent selects a skill and invokes it via the `Skills Router`.
    5.  The skill executes, potentially calling multiple BPMCP tools in sequence.
    6.  BPMCP tools interact with underlying data stores (Neo4j, Qdrant, etc.).
    7.  Results are returned to the skill, then to the agent.
    8.  The agent processes results, potentially performs synthesis, and may invoke further skills or report completion/output via A2A.
*   **Data Flow:**
    1.  Input data (queries, documents, Bimba coordinates) flows into agents/skills.
    2.  Data is passed to BPMCP tools as parameters.
    3.  BPMCP tools retrieve/generate data from/to databases.
    4.  Output data from tools flows back to skills/agents.
    5.  Synthesized knowledge, tagged with Bimba coordinates, is the final output.

### 3.4. Agent Decision Logic for Tool Selection

*   Initially, this logic might be rule-based or scripted within each skill's definition.
*   Future enhancements could involve more sophisticated AI-driven planning capabilities within agents to determine optimal tool sequences.
*   The `Skills Registry` itself could evolve to include metadata about skill prerequisites, effects, and costs, aiding agent decision-making.

## 4. Bimba Alignment

This architecture aligns with Bimba principles in several ways:

*   **Six-Fold Cosmic Mind Model:**
    *   **Epii (#5):** The primary operational domain for these agents and skills, focusing on knowledge processing and integration.
    *   **Nara (#4):** The A2A layer (`friendly-file-back2front`) acts as the Nara layer, mediating communication and providing contextual awareness for agent interactions.
    *   **Mahamaya (#3):** Symbolic transformation occurs as agents interpret Bimba coordinates and translate task requirements into tool invocations.
    *   **Parashakti (#2):** The dynamic execution of skills and BPMCP tools represents the power of expression.
    *   **Paramasiva (#1):** The underlying logic of Bimba coordinates and QL principles guides the system's structure.
    *   **Anuttara (#0):** The foundational data stores (Neo4j, Qdrant) represent the ultimate ground of being/information.
*   **Quaternal Logic (QL):** Task states managed by the A2A layer (`task-state-manager.js`) already map to QL stages. Agent operations and skill executions will naturally fit within this QL cycle, moving from initial request (A-logos) through processing stages to completion/crystallization (An-a-logos).
*   **Vibrational-Harmonic Ontology:** Bimba coordinates themselves are rooted in this ontology. By making them central, the architecture inherently aligns with this principle, allowing for resonant matching of tasks, skills, and data.

## 5. Integration Points

*   **`friendly-file-back2front` (A2A Layer):**
    *   New/updated `agent-card.js` files for advertising skills.
    *   Updates to `bimba-skills-registry.js` and `*-skills-initializer.js` to register new skills.
    *   Agents will use `a2a-client.service.js` to communicate.
*   **BPMCP Server:** Agents/skills will make WebSocket calls to the BPMCP server to invoke tools.
*   **Epii Analysis Pipeline (`epii_app/friendly-file-backend/pipelines/`):**
    *   Agents may read outputs from pipeline stages (e.g., files, database entries created by the pipeline).
    *   Agents may trigger pipeline execution or specific stages via existing mechanisms (if any, or to be developed).
*   **Databases (Neo4j, Qdrant, MongoDB):** Indirectly via BPMCP tools. Direct interaction is not anticipated for agents in this scope.

## 6. Non-Functional Requirements Considerations (from EFDD)

*   **Scalability:** The skill-based, decoupled architecture should allow for scaling by adding more agent instances or enhancing the `Skills Registry` for load distribution (future consideration).
*   **Maintainability:** Clear separation of concerns (agents, skills, A2A layer, BPMCP) should improve maintainability.
*   **Extensibility:** Adding new skills or integrating new BPMCP tools should be relatively straightforward by following defined patterns.
*   **Security:** API key management for BPMCP tools needs careful handling, likely managed by the environment/configuration where agents run, not hardcoded in skills.
*   **Performance:** Efficiency of skill discovery and BPMCP tool calls will be important. Caching strategies for skill definitions or BPMCP results could be explored if needed.
*   **Testability:** Individual skills should be testable in isolation. Integration tests will be crucial for agent-skill-BPMCP workflows.

## 7. Open Questions and Future Considerations

*   **Granularity of Skills:** What is the optimal level of granularity for defining agent skills? Too fine-grained might lead to complex orchestration; too coarse might limit flexibility.
*   **Agent Autonomy vs. Predefined Workflows:** How much autonomy should agents have in selecting tools versus following more predefined workflows encapsulated in skills?
*   **Error Handling and Recovery:** How will errors from BPMCP tools or within skills be propagated and handled by agents?
*   **Complex Workflow Orchestration:** For multi-step, complex tasks, will a dedicated workflow engine or more sophisticated agent planning capabilities be needed beyond simple skill sequencing?
*   **Skill Versioning:** How will versions of skills be managed and selected by agents?
*   **Monitoring and Logging:** What level of monitoring and logging is required for agent actions and skill executions?
*   **Integration with "Deep Crystallization Search":** How will these agent skills interact with or leverage the planned "Deep Crystallization Search" feature mentioned in the Epii Mode README?
*   **User Interface for Skill Management:** Will a UI be needed for browsing, managing, or defining skills (out of scope for MVP, but a future thought)?

## 8. Initial Technology Choices & Rationale

*   **Programming Language:** JavaScript/Node.js, consistent with existing `friendly-file-back2front` and `epii_app` backend components.
*   **Communication:** WebSockets for A2A communication (existing) and for BPMCP interaction (existing).
*   **Data Formats:** JSON for A2A messages and BPMCP tool interactions.

## 9. Next Steps

*   Refine skill definition patterns and schemas.
*   Develop a prototype for a simple agent and a few A2A-aligned skills interacting with BPMCP.
*   Define specific Bimba coordinate usage patterns for skill registration and invocation.
*   Elaborate on testing strategies for agents and skills.

## Change Log

*   **Version 0.1.1 ({{CURRENT_DATE}}):** Clarified agent focus to be primarily on enhancing the existing Epii agent. (Epi-Logos Contextual Architect)
*   **Version 0.1.0 ({{CURRENT_DATE}}):** Initial YOLO draft of FCBAP. (Epi-Logos Contextual Architect)