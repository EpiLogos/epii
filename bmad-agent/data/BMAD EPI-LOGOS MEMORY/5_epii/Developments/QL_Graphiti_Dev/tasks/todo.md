# QL-Graphiti Development Plan & TODO

**Primary Context Document:** `bmad-agent/data/BMAD EPI-LOGOS MEMORY/5_epii/Developments/QL_Graphiti_Dev/QL_Graphiti_Alignment_prd.md`

This plan outlines the development of the foundational components for the QL-Graphiti Episodic Memory Engine, following a principle of gentle evolution of existing services.

---

## Phase 1: Graphiti Service Enhancement (Python Backend)

*   **Location:** `epii_app/friendly-file-backend/databases/graphiti/mcp-server/`
*   **Goal:** Enhance the core Graphiti service to recognize and structure `QuaternalUnit`s as a specialized type of `Community`.

- [ ] **Task 1.1: Define `QuaternalUnit` Schema**
    - **File to Modify:** `entity_schemas.py` (or similar schema definition file).
    - **Action:** Introduce a new node label `QuaternalUnit` which will be applied *in addition* to the existing `Community` label.
    - **Details:** Add the specific properties for a `QuaternalUnit` as defined in the PRD (Section 4.1). This includes:
        - `quaternal_type`: Enum (e.g., `FOUR_PART`, `SIX_PART`, etc.)
        - `status`: Enum (`POTENTIAL`, `REFINING`, `VALIDATED`)
        - `bimba_coordinate`: String
        - `source_references`: Array of objects
        - `summary`: String
        - `cross_coordinate_links`: Array of objects
    - **Context:** See PRD Section 4.1, "Data Model: The `QuaternalUnit` as a Graphiti Community".

- [ ] **Task 1.2: Enhance Community Creation Logic**
    - **File to Modify:** The Python file containing the business logic for creating communities (likely within `graphiti_core` or `mcp_server`).
    - **Action:** Modify the function that creates a `Community`.
    - **Details:**
        - The function should check for an optional `quaternal_type` parameter in the input.
        - If `quaternal_type` is present, the function should:
            1.  Create the `Community` node as usual.
            2.  Apply the additional `QuaternalUnit` label to it.
            3.  Set the `quaternal_type` and other `QuaternalUnit`-specific properties from the input.
            4.  Based on the `quaternal_type` (e.g., `FOUR_PART`), automatically create 4 placeholder `Entity` nodes.
            5.  Add a `ql_position` property (e.g., 0, 1, 2, 3) to each new placeholder entity.
            6.  Establish a `HAS_MEMBER` relationship from the `QuaternalUnit` community to each new placeholder entity.
    - **Context:** See PRD Section 4.2, "Graphiti MCP Service: QL Identification & Refinement".

- [ ] **Task 1.3: Enhance Community API Endpoint**
    - **File to Modify:** The Python file defining the API routes (e.g., using FastAPI).
    - **Action:** Update the existing `POST /community` endpoint.
    - **Details:** Modify the endpoint's input model/schema to accept the new optional `quaternal_type` and other `QuaternalUnit` properties. Ensure these new properties are passed down to the creation logic from Task 1.2.
    - **Context:** This makes the enhanced functionality accessible via the API.

---

## Phase 2: BPMCP Mediator Enhancement (JavaScript Backend)

*   **Location:** `epii_app/friendly-file-backend/databases/bpmcp/`
*   **Goal:** Enhance the existing BPMCP tools to pass the necessary information to the newly enhanced Graphiti service.

- [ ] **Task 2.1: Enhance `createGraphitiCommunity` Tool**
    - **File to Modify:** `bpMCP.service.mjs`.
    - **Action:** Find the existing function that wraps the Graphiti community creation (likely named `createGraphitiCommunity` or similar).
    - **Details:**
        - Modify the function to accept an optional `options` object that can contain `quaternal_type` and other `QuaternalUnit` properties.
        - In the body of the function, check if these options are present.
        - If so, include them in the payload of the HTTP request sent to the Graphiti MCP's `POST /community` endpoint.
    - **Context:** See PRD Section 4.2.1, which outlines the desired schema for the `createQuaternalUnit` concept, which we are now merging into the existing community creation tool.

- [ ] **Task 2.2: Review `updateGraphitiCommunity` and `getGraphitiContext`**
    - **File to Review:** `bpMCP.service.mjs`.
    - **Action:** Analyze the existing tools for updating and getting community data.
    - **Details:**
        - **Update:** No immediate changes should be needed. Adding members to the `QuaternalUnit` should work via the existing `update` logic, as it's just a specialized community.
        - **Get:** No immediate changes should be needed. The existing `get` logic should retrieve the `QuaternalUnit` community along with its placeholder members and all its properties, because we are simply adding a label and properties to a standard community.
    - **Goal:** Confirm that no changes are required for these tools. If they are, create new sub-tasks.

---

## Review

*(This section will be filled out with a summary of changes as tasks are completed.)*
