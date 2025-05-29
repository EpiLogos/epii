## Part 2: Nara_Mode_Full_Dev_v1 Architecture (Continued)

## 6. Integration of Existing Functionality (Renumbered)

- **`friendly-file-front/src/subsystems/4_nara/5_pages/UserSettings.tsx`:** As noted, this component appears to be misplaced. It is not directly related to the core "Dialogue/Taste" functionality of Nara. It should be moved to a more appropriate global settings or user management subsystem (e.g., `5_epii/5_integration/UserSettings.tsx`). This will be addressed in a separate task.

### 3.B Back-to-Front Layer (`friendly-file-back2front`)

This layer serves as the primary communication and orchestration hub between the frontend and the backend. It hosts Nara-specific AG-UI handlers, A2A client logic (if Nara needs to communicate with other agents like Epii), and orchestrates calls to the BPMCP for data operations.

**Target Directory:** `friendly-file-back2front/subsystems/4_nara/`

- **`ag-ui/`**: Contains Nara-specific AG-UI handlers (`nara-ag-ui-handler.js`) and event definitions (`nara-ag-ui-event-definitions.js`). This handler receives AG-UI events from the `friendly-file-front` (via the shared AG-UI gateway), processes them, interacts with the `friendly-file-backend` (Nara subsystem) for core logic, and sends AG-UI events back to the frontend.
- **`a2a/`**: Contains Nara-specific A2A client logic (`nara-a2a-client.js`) if Nara needs to initiate communication with other expert agents (e.g., Epii) via the shared A2A server.
- **`bpmcp-orchestration/`**: (Conceptual) This directory would house logic responsible for taking requests (likely originating from AG-UI events processed by `nara-ag-ui-handler.js`) and translating them into specific BPMCP calls to access Bimba (Neo4j), Notion, or MongoDB. Given that BPMCP is not yet refactored into the `friendly-file-backend/databases/` structure, this layer currently plays a crucial role in abstracting those interactions.

### 3.C Backend Layer (`friendly-file-backend`)

This layer contains the core intelligence and data processing capabilities of the Nara agent. It executes the primary logic, including the synthesis pipeline, and interacts with various data sources (currently via direct service calls, eventually through the refactored `databases/` layer and BPMCP).

**Target Directory:** `friendly-file-backend/subsystems/4_nara/`

- **`services/`**: Contains Nara-specific backend services.
    - `nara-core-logic.service.mjs`: Implements the main decision-making and processing logic for Nara.
    - `nara-contextual-processing.service.mjs`: Handles understanding and managing the user's context, archetypal states, etc.
    - `nara-interaction-manager.service.mjs`: Manages dialogue flow, Oracle interactions, and Journal interactions from a backend perspective.
    - (Services for interacting with Neo4j, MongoDB, Notion for Nara's specific needs. Currently, these might be direct calls or use existing non-refactored services. Post-refactor, they would leverage the `friendly-file-backend/databases/` layer).
- **`pipelines/`**: Houses the Nara Synthesis Pipeline.
    - `nara-synthesis-pipeline.mjs`: The main orchestrator for the synthesis pipeline (adapted from the current synthesis pipeline).
    - `stages/`: Sub-directory for individual stages of the synthesis pipeline (e.g., data gathering, pattern recognition, insight generation, narrative construction).
- **`prompts/`**: Contains LLM prompts specific to Nara's functionalities (e.g., for synthesis, dialogue, Oracle interpretation).
- **`models/`**: (If any Nara-specific data models are primarily used within the backend and not shared more broadly via `databases/shared/models/` post-refactor).
- **`utils/`**: Utility functions specific to the Nara backend subsystem.
- **`controllers/` / `routes/`**: (If Nara exposes any direct API endpoints not mediated by AG-UI. Typically, interaction would be via AG-UI through `friendly-file-back2front`).

## 4. Data Management and Communication Protocols (Cross-Cutting)

(The content of this section, previously section 4, remains largely the same but is now understood in the context of the three-layer architecture described above. BPMCP calls are orchestrated from `friendly-file-back2front` and executed by services that might currently reside in `friendly-file-backend`'s general services or will eventually be in `friendly-file-backend/databases/`.)

This section explicitly details how data is managed and communication occurs within Nara_Mode_Full_Dev_v1.

- **Bimba-Pratibimba-Memory-MCP (BPMCP):**
    - **Role:** Primary data access layer for backend knowledge and user data.
    - **Operations for Nara:**
        - **Bimba (Neo4j):** Read-only access for archetypal data, symbolic meanings, relational structures, etc. Nara will *not* write to the Bimba graph directly.
        - **Notion:** Read-access for contextual documents, extended descriptions, or other relevant textual/structured information.
        - **MongoDB:** Read/write access for user-specific data. This includes user profiles, journal entries, personalized settings, interaction history, and any potential future vectorized user data (leveraging MongoDB's native vector capabilities if explored). This ensures a clear separation between core Bimba knowledge and user-generated/related information.
- **Agent-User Interaction (AG-UI) Protocol:**
    - **Role:** Facilitates real-time, bidirectional, and context-aware communication between the Nara frontend (`friendly-file-front`) and the Nara Agent components within `friendly-file-back2front/subsystems/4_nara/ag-ui/`.
    - **Architecture:**
        - The frontend (`friendly-file-front`) acts as an AG-UI client, connecting to a central AG-UI WebSocket gateway (`friendly-file-back2front/shared/core-ag-ui/ag-ui-websocket-handler.js`).
        - This gateway routes messages to/from subsystem-specific AG-UI handlers. For Nara, this is `friendly-file-back2front/subsystems/4_nara/ag-ui/nara-ag-ui-handler.js` (or similar).
        - Nara-specific AG-UI event definitions might exist in `friendly-file-back2front/subsystems/4_nara/ag-ui/nara-ag-ui-event-definitions.js`.
    - **Capabilities Leveraged by Nara:**
        - **Event-Driven Architecture:** User interactions in the frontend trigger AG-UI events sent to the Nara AG-UI handler. The handler processes these, potentially interacts with BPMCP or other A2A agents, and then emits AG-UI events back to the frontend for UI updates.
        - **Streaming:** Enables progressive delivery of dialogue, Oracle card reveals, etc., from the Nara AG-UI handler to the frontend.
        - **State Synchronization:** AG-UI events help maintain a consistent view of the interaction state.
        - **Contextual Payloads:** Messages carry context for both frontend rendering and backend processing by the Nara agent components.
        - **Multimedia Delivery:** The Nara AG-UI handler can signal the frontend to play/display multimedia content.
- **Agent-to-Agent (A2A) Protocol (for inter-agent communication within `friendly-file-back2front`):**
    - **Role:** Facilitates communication between the Nara agent and other expert agents (e.g., Epii, Mahamaya) if needed.
    - **Architecture:**
        - If the Nara agent needs to invoke another agent, its A2A client (`friendly-file-back2front/subsystems/4_nara/a2a/nara-a2a-client.js`) sends a message to the central A2A server (`friendly-file-back2front/shared/core-a2a/a2a-server.js`).
        - The A2A server routes this to the target agent's A2A handler within its respective subsystem directory.
    - **Nara's Use:** Primarily as a client if it needs to delegate tasks or request information from other specialized agents. The results of A2A interactions would typically be processed by the Nara agent and then communicated to the frontend via AG-UI.

## 5. Future Development Considerations

- **Recursive Interface Design:** Architectural components should support dynamic styling and behavior based on the 12-fold concrescence rhythm. AG-UI can be used to signal state changes that trigger these visual updates.
- **Multimodal Experience:** Design for integration of planetary soundscapes, archetypal video collages, and haptic feedback patterns. AG-UI will be crucial for signaling and synchronizing these multimodal elements with the core interaction flow. BPMCP might store metadata or links to these assets.
- **Quaternal Logic Integration:** Ensure the architecture supports the visual and functional embodiment of the 6-fold structure. Data for this will be sourced via BPMCP, and interactions managed via AG-UI.

## 7. Conclusion (Renumbered)

This FCBAP provides a foundational architectural blueprint for `Nara_Mode_Full_Dev_v1`, aligning its development with the modular patterns of `5_epii` and the philosophical principles of Epi-Logos. It now explicitly incorporates the Bimba-Pratibimba-Memory-MCP (BPMCP) as the central data access layer for Bimba (read-only), Notion (read), and MongoDB (user data read/write), and the Agent-User Interaction (AG-UI) protocol for robust, real-time, and context-aware communication between the frontend and the Nara Agent. The next steps involve detailed component design and implementation based on this refined structure and the UI/UX Specification.