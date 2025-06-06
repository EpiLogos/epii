# AI Builder Prompt Package: EPIC-002 / Story 2.3

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 2.3, contributing to EPIC-002.

## 1. Story Context & Goals

**Story ID:** 2.3
**Epic ID:** EPIC-002: A2A Skill Management Framework with Graphiti-Powered Dynamic Contextualization

**Story Description (from story-2.3.md):**
```
- As the Skills Router (within the 6-subsystem architecture),
- I want to invoke a skill, passing parameters, Bimba coordinate, UI context (chat/canvas selections for Graphiti), and leveraging document-level memory/Bimba structure from Graphiti, managing its execution,
- So that agent capabilities are reliably executed, enabling refined analysis, with streamlined context, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-002.md, relevant excerpt):**
```
To establish a robust foundation for creating and managing reusable agent capabilities that are discoverable and executable within Bimba coordinate and rich Graphiti context (including real-time user interactions via AG-UI and refined analytical insights from the Graphiti service). This ensures skills adapt to evolving information, streamline their own context windows for execution, and can effectively inform or trigger updates to Notion or Bimba, maintaining Bimba coordinate integrity.
```

## 2. Acceptance Criteria (from story-2.3.md)

```
1.  Skills Router API (part of 6-subsystem architecture) for invoking skills by ID is available.
2.  Invocation request includes: input params (per schema), Bimba context, dynamic Graphiti context (influenced by UI context like chat/canvas selections), and mechanisms to utilize document-level memory/Bimba structural knowledge from Graphiti.
3.  Skills Router retrieves skill definition from Skills Registry.
4.  Input parameters validated against skill's input schema.
5.  Skills Router maps to and executes underlying BPMCP tool/function with validated params and all relevant context (Bimba, Graphiti, UI context markers), supporting refined analysis for skill execution.
6.  Output captured and returned per skill's output schema, ensuring streamlined context.
7.  Error handling for: skill not found, input validation failure, execution errors.
8.  Logging of skill invocations (ID, timestamp, status, UI context snapshot).
9.  Skill execution considers how results might inform Notion/Bimba updates.
```

## 3. Tasks / Subtasks (from story-2.3.md)

```
- [ ] Task 1: Design the Skill Invocation API for the Skills Router (AC: #1, #2)
    - [ ] Subtask 1.1: Define input (skill ID, parameters, Bimba context, Graphiti context) and output (skill execution result, status).
- [ ] Task 2: Implement skill definition retrieval from Skills Registry (AC: #3)
- [ ] Task 3: Implement input parameter validation against skill schema (AC: #4)
- [ ] Task 4: Implement the core skill execution logic (AC: #5)
    - [ ] Subtask 4.1: Develop a mechanism to dynamically call the BPMCP tool/function specified in the skill definition.
    - [ ] Subtask 4.2: Ensure Bimba coordinate context and Graphiti-derived dynamic context are appropriately passed or utilized by the underlying tool.
- [ ] Task 5: Implement output formatting according to skill schema (AC: #6)
- [ ] Task 6: Implement comprehensive error handling (AC: #7)
- [ ] Task 7: Implement logging for skill invocations (AC: #8)
- [ ] Task 8: Document the Skill Invocation API.
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology.
*   **Six-Fold Recursive Architecture:** Skill invocation and execution are central to this architecture.
*   **Bimba Coordinate System:** Provides foundational context for skill execution.
*   **Vibrational-Harmonic Ontology:** Underlying philosophical assumption.

## 5. Technical Context (from friendly-file-backend/README.md, epic-002.md, story-2.3.md & relevant architecture shards)

*   **Skills Router:** A key component within the 6-subsystem architecture, responsible for the actual execution of registered A2A skills. It acts as the bridge between a skill's definition and the underlying BPMCP tool/function that implements its logic.
*   **Graphiti Service:** Provides critical dynamic context for skill execution. This includes document-level memory, Bimba structural knowledge, and real-time UI context (chat/canvas selections) communicated via the AG-UI protocol. The Skills Router must leverage this Graphiti context to ensure skills operate with precision.
*   **AG-UI Protocol:** The mechanism by which UI interactions are fed into the Graphiti service, which then makes this context available to the Skills Router.
*   **BPMCP (Bimba-Pratibimba-Memory-MCP):** The suite of tools and capabilities that skills ultimately wrap or orchestrate. The Skills Router will dynamically invoke these BPMCP tools based on a skill's definition.
*   **Skills Registry:** The component (developed in Story 2.1 & 2.2) where skill definitions are stored and from which the Skills Router retrieves them.
*   **Skill Definition:** Includes input/output schemas, the specific BPMCP tool/function to execute, Bimba coordinate associations, and Graphiti context linkage.
*   **Invocation API:** The Skills Router will expose an API (likely RESTful) to invoke skills by their ID, passing necessary parameters and contextual information (Bimba, Graphiti, UI markers).
*   **Dynamic Invocation:** The Skills Router needs a mechanism (e.g., reflection, command pattern, service lookup) to dynamically call the correct BPMCP tool/function based on the skill's definition.
*   **Context Management:** Ensuring that Bimba coordinates, dynamic Graphiti context (including UI state and document memory), and explicit parameters are correctly passed to and utilized by the underlying BPMCP tool is paramount.
*   **Error Handling & Logging:** Robust error handling and detailed logging (including a snapshot of the UI context at invocation time) are essential.
*   **Programming Languages/Frameworks:** Likely Node.js for the Skills Router API and core logic, interacting with BPMCP tools which might be in various languages (e.g., Python for Graphiti-related tools).
*   **Relevant Documentation:** `bpmcp-architecture-overview.md#skills-router`, `A2A_Skill_Framework_Design.md`, `Epii_Agent_Skill_Orchestration_Logic.md`.

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the Skills Router component as defined in Story 2.3. This component is responsible for invoking registered A2A skills, managing their execution by calling underlying BPMCP tools, and handling the flow of parameters and rich contextual information (Bimba coordinates, dynamic Graphiti context including UI state and document memory). This is a critical part of EPIC-002.

Key Objectives & Requirements:

1.  **Skill Invocation API Design (Node.js - Skills Router Service/Module):
    *   **API Definition:** Design a RESTful API endpoint (e.g., `POST /api/v1/skills/invoke/{skillId}`). (AC#1)
    *   **Request Body:** The request body should include:
        *   `parameters`: An object containing the input parameters for the skill, conforming to its defined input schema. (AC#2)
        *   `bimbaContext`: Information about the relevant Bimba coordinate(s). (AC#2)
        *   `graphitiContext`: Dynamic contextual information derived from the Graphiti service. This should include markers for UI context (e.g., `{"ui": {"chatKeywords": ["term"], "canvasSelection": "node-id-xyz"}}`) and potentially references or summaries of relevant document-level memory or Bimba structural knowledge from Graphiti. (AC#2)
    *   **Response Structure:** The API response should include the skill's execution result (conforming to its output schema), execution status (success/failure), and any error messages. (AC#6)

2.  **Skill Definition Retrieval (Node.js - Skills Router):
    *   Implement logic to retrieve the full skill definition (including input/output schemas, BPMCP tool mapping, Bimba/Graphiti linkage) from the Skills Registry using the `skillId` provided in the invocation request. (AC#3)

3.  **Input Parameter Validation (Node.js - Skills Router):
    *   Implement robust validation of the `parameters` provided in the invocation request against the `inputSchema` defined in the retrieved skill definition. (AC#4)
    *   Return appropriate error responses if validation fails.

4.  **Core Skill Execution Logic (Node.js - Skills Router):
    *   **Dynamic BPMCP Tool Invocation:** Develop a mechanism to dynamically identify and call the underlying BPMCP tool or function specified in the skill's definition (e.g., in a `toolMapping` or `executionTarget` field). This might involve a registry of BPMCP tools accessible to the Skills Router, or a more direct invocation method if tools are exposed as services. (AC#5, Subtask 4.1)
    *   **Contextual Parameter Passing:** Ensure that all validated input parameters, the `bimbaContext`, and the rich `graphitiContext` (including UI markers and Graphiti-derived memory/structure) are appropriately formatted and passed to the underlying BPMCP tool. The skill definition should guide how this context is used by the tool. (AC#5, Subtask 4.2)
    *   **Execution Management:** Manage the lifecycle of the tool execution (e.g., handling asynchronous operations if BPMCP tools are called remotely).

5.  **Output Formatting (Node.js - Skills Router):
    *   Once the BPMCP tool completes, capture its output.
    *   Validate and format this output according to the `outputSchema` defined in the skill definition before returning it in the API response. (AC#6)

6.  **Error Handling (Node.js - Skills Router):
    *   Implement comprehensive error handling for various scenarios: (AC#7)
        *   Skill ID not found in the Skills Registry.
        *   Input parameter validation failure.
        *   Errors during the execution of the underlying BPMCP tool.
        *   Errors in formatting the output.
    *   Ensure error responses are clear and informative.

7.  **Logging (Node.js - Skills Router):
    *   Implement detailed logging for each skill invocation. Logs should include: (AC#8)
        *   `skillId`
        *   Timestamp of invocation
        *   Invocation parameters (potentially summarized or sensitive parts redacted)
        *   `bimbaContext`
        *   A snapshot or key elements of the `graphitiContext`, especially `uiContext` markers.
        *   Execution status (success/failure)
        *   Execution duration
        *   Error messages, if any.

8.  **Consideration for Notion/Bimba Updates (Conceptual):
    *   While direct implementation of Notion/Bimba updates might be out of scope for this story's core implementation, the design should acknowledge that skill execution results might need to inform such updates (AC#9). This could involve the skill itself being designed to output data suitable for an update, or the Skills Router emitting events that other services can consume to trigger updates.

9.  **Developer Documentation (Markdown):
    *   Document the new Skill Invocation API endpoint in detail, including the request and response structures, authentication/authorization (if applicable), and error codes.
    *   Provide an overview of the Skills Router's role and architecture.
    *   Explain how context (Bimba, Graphiti, UI) is handled during skill invocation.

Considerations:

*   **Security:** How will access to the Skill Invocation API be secured? How are BPMCP tools invoked securely?
*   **Asynchronous Skills:** How will the Skills Router handle skills that represent long-running operations?
*   **State Management:** Does the Skills Router need to maintain any state about ongoing skill executions?
*   **Interaction with Graphiti:** Clarify how the Skills Router obtains the `graphitiContext`. Does the calling agent provide it, or does the Skills Router query Graphiti based on initial context?

Please provide the necessary Node.js code for the Skills Router service/module, API definitions, documentation updates (Markdown), and any relevant configuration. Structure your response clearly, addressing each of the key objectives.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-002-story-2.3-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`