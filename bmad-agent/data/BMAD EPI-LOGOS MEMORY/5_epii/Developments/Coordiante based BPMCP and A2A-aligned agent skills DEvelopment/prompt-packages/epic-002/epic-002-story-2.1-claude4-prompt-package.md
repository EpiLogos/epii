# AI Builder Prompt Package: EPIC-002 / Story 2.1

**Development Context:** 5_epii / Coordiante based BPMCP and A2A-aligned agent skills DEvelopment
**Target AI Generation Platform:** Claude 4
**Task Type for AI Builder:** Full-stack development of all stated goals in Story 2.1, contributing to EPIC-002.

## 1. Story Context & Goals

**Story ID:** 2.1
**Epic ID:** EPIC-002: A2A Skill Management Framework with Graphiti-Powered Dynamic Contextualization

**Story Description (from story-2.1.md):**
```
- As a Developer (within the 6-subsystem architecture context),
- I want to define an agent skill with inputs, outputs, Bimba coordinate applicability, and linkage to Graphiti entities/types, considering UI context (chat/canvas selections) for dynamic contextualization and leveraging document-level memory/Bimba structure from Graphiti,
- So that it can be registered, enabling refined analysis for skill execution, streamlined context for invocation, and informing potential Notion/Bimba updates.
```

**Epic Goal (from epic-002.md, relevant excerpt):**
```
To establish a robust foundation for creating and managing reusable agent capabilities that are discoverable and executable within Bimba coordinate and rich Graphiti context (including real-time user interactions via AG-UI and refined analytical insights from the Graphiti service). This ensures skills adapt to evolving information, streamline their own context windows for execution, and can effectively inform or trigger updates to Notion or Bimba, maintaining Bimba coordinate integrity.
```

## 2. Acceptance Criteria (from story-2.1.md)

```
1.  Standardized skill definition schema (JSON/YAML) is established, reflecting the 6-subsystem architecture's needs.
2.  Schema includes: name, description, version, I/O params, Bimba coordinate patterns, Graphiti entity/type patterns (for dynamic context, including UI context markers like chat/canvas selections), and BPMCP tool to execute, explicitly supporting document-level memory and Bimba structural knowledge from Graphiti.
3.  Skill registration process/API (within the 6-subsystem architecture) is available.
4.  Skills Registry validates definitions against schema.
5.  Registered skills are persistently stored and retrievable.
6.  Documentation covers skill definition, registration, and how UI context influences applicability and parameterization, streamlining context for invocation.
7.  Skill definitions consider how their execution might inform Notion/Bimba updates.
8.  The definition supports refined analysis for skill execution by allowing detailed contextual prerequisites.
```

## 3. Tasks / Subtasks (from story-2.1.md)

```
- [ ] Task 1: Design the skill definition schema (AC: #1, #2)
    - [ ] Subtask 1.1: Research existing skill/function definition standards for inspiration.
    - [ ] Subtask 1.2: Define fields for metadata, input/output, Bimba applicability, Graphiti entity/type applicability, and execution details.
    - [ ] Subtask 1.3: Choose a format (JSON/YAML) and document the schema.
- [ ] Task 2: Develop the Skill Registration mechanism (AC: #3)
    - [ ] Subtask 2.1: Design API endpoint(s) for skill registration (e.g., POST /skills).
    - [ ] Subtask 2.2: Implement the logic to receive and process skill definitions.
- [ ] Task 3: Implement schema validation for skill registration (AC: #4)
- [ ] Task 4: Implement persistent storage for registered skills in the Skills Registry (AC: #5)
    - [ ] Subtask 4.1: Choose a suitable database/storage mechanism for the Skills Registry.
    - [ ] Subtask 4.2: Implement save and retrieve functions.
- [ ] Task 5: Create developer documentation for skill definition and registration (AC: #6)
```

## 4. Philosophical Context (from Project README.md - Key Concepts)

*   **Epi-Logos Vision:** Grounded in epistemic humility and an idealist cosmology.
*   **Six-Fold Recursive Architecture:** Skills operate within this, likely managed by Siva aspect (#5-2).
*   **Bimba Coordinate System:** Essential for contextual grounding of skills.
*   **Vibrational-Harmonic Ontology:** Underlying philosophical assumption.

## 5. Technical Context (from friendly-file-backend/README.md, epic-002.md & story-2.1.md)

*   **Backend Architecture (Siva Aspect #5-2):** Hosts the Skills Registry and Skill Router.
*   **BPMCP:** The Skills Registry is a critical component of BPMCP. Skills will likely execute BPMCP tools.
*   **Graphiti Service:** Python-based, dynamic knowledge graph. Crucial for dynamic contextualization of skills, incorporating UI context (via AG-UI) and document-level memory/Bimba structure.
*   **AG-UI Protocol:** Communicates UI context (chat/canvas selections) to backend/Graphiti for skill contextualization.
*   **A2A Skills:** The core of this epic. Defined by a schema, registered, and dynamically invoked.
*   **Skills Registry:** Validates, stores, and allows retrieval of skill definitions.
*   **Schema Definition:** JSON or YAML format for skill definitions, including metadata, I/O, Bimba/Graphiti applicability, and execution details.
*   **Programming Languages/Frameworks:** Node.js (BPMCP, Skills Registry likely), Python (Graphiti).

## 6. Prompt for Claude 4 (Full-Stack Development)

```
Primary Goal: Implement the foundational elements for the A2A Skill Management Framework as defined in Story 2.1. This involves designing the skill definition schema, developing the skill registration mechanism (including API, validation, and persistent storage), and creating initial developer documentation. This work is critical for EPIC-002.

Key Objectives & Requirements:

1.  **Skill Definition Schema Design (JSON/YAML):
    *   **Research & Define Fields:** Based on AC#1 and AC#2, research existing standards and define a comprehensive schema. It MUST include:
        *   Metadata: `name`, `description`, `version`, `author`, `tags`.
        *   Input Parameters: Array of objects, each with `name`, `description`, `type` (e.g., string, number, BimbaCoordinate, GraphitiEntityID), `required` (boolean).
        *   Output Parameters: Similar structure to input parameters.
        *   Bimba Coordinate Applicability: Define a structure to specify applicable Bimba coordinates or patterns (e.g., `"bimbaPatterns": ["#5-2-*", "#3-*-1"]`).
        *   Graphiti Context Linkage: Define how skills link to Graphiti entities/types for dynamic contextualization. This should include patterns for matching Graphiti nodes/edges and how UI context markers (e.g., `activeChatFocus`, `canvasSelectionIDs`) are considered (e.g., `"graphitiContext": {"nodeTypes": ["DocumentChunk"], "uiContextTriggers": ["canvasSelectionIDs"]}`).
        *   Execution Details: Specify the BPMCP tool or internal function to execute, and how input parameters map to the tool's inputs (e.g., `"execution": {"type": "bpmcpTool", "toolName": "searchPratibimbaContext", "parameterMapping": { ... }}`).
        *   Potential Updates: A field to note how skill execution might inform Notion/Bimba updates (e.g., `"informsSystemUpdates": ["NotionPageProperty", "BimbaNodeRelationship"]`).
    *   **Format & Documentation:** Choose JSON or YAML. Provide a clear, documented version of this schema (e.g., a JSON Schema file or a well-commented YAML example).

2.  **Skill Registration Mechanism (Node.js - likely part of BPMCP or a dedicated service within the 6-subsystem architecture):
    *   **API Endpoint Design:** Design a RESTful API endpoint for skill registration (e.g., `POST /api/v1/skills`). Define the request body (the skill definition itself) and response codes (success, validation error, server error).
    *   **Registration Logic:** Implement the backend logic to receive a skill definition via the API.
    *   **Schema Validation:** Integrate a robust validation mechanism (e.g., using `ajv` for JSON Schema) to validate incoming skill definitions against the designed schema (AC#4). Return clear error messages for invalid definitions.

3.  **Persistent Storage for Skills Registry (Node.js):
    *   **Storage Choice:** Select a suitable persistent storage mechanism (e.g., a dedicated table in an existing SQL/NoSQL database used by BPMCP, or a simple file-based store for initial development if appropriate, like a JSON file or a local SQLite database). Justify the choice briefly.
    *   **Save & Retrieve Functions:** Implement functions to save validated skill definitions to the chosen storage and to retrieve them (e.g., by skill name/ID, or list all).

4.  **Developer Documentation (Markdown):
    *   Create initial documentation covering:
        *   The skill definition schema in detail, with examples.
        *   How to register a new skill using the API endpoint.
        *   Explanation of how Bimba coordinate and Graphiti entity/type applicability (including UI context considerations) are used for dynamic contextualization and to streamline context for invocation.
        *   How to specify potential Notion/Bimba updates informed by the skill.

Considerations:

*   **Modularity & Extensibility:** Design the schema and registration process to be extensible for future enhancements.
*   **Error Handling:** Implement comprehensive error handling in the registration API.
*   **Security:** If the API is exposed, consider basic authentication/authorization (though full security implementation might be a separate story).
*   **Alignment with 6-Subsystem Architecture:** Ensure the design fits within the overall Epi-Logos architecture, particularly how the Skills Registry interacts with other components like the Skill Router and BPMCP tools.

Please provide the necessary code (Node.js for API/storage, JSON/YAML for schema), documentation (Markdown), and any configuration files. Structure your response clearly.
```

## 7. Output Location

This prompt package is located at: `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/prompt-packages/epic-002-story-2.1-claude4-prompt-package.md`

## 8. Checklist Mappings (from `bmad-agent/tasks/checklist-mappings.yml` - for reference)

*   `story-dod-checklist.md`
*   `story-draft-checklist.md`