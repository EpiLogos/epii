# Feature Context & Bimba-Alignment Package (FCBAP) for Nara_Mode_Full_Dev_v1

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Location:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/architecture/feature-context-bimba-alignment-package.md`

## 1. Introduction

This document outlines the architectural context and Bimba alignment for the `Nara_Mode_Full_Dev_v1` development, based on the provided UI/UX Specification. It translates the high-level UI/UX features into a modular architectural plan, ensuring alignment with Epi-Logos principles and the Bimba coordinate system.

## 2. Bimba Tech Architecture Alignment

As defined in the `4_nara` subsystem README, `Nara_Mode_Full_Dev_v1` aligns with:
- **Bimba Coordinate:** #5-3-4 (Web App Shell / Notion Frontend)
- **Represents Agent:** (4.0-4.4/5) (Dialogue/Taste)

All architectural components and their interactions within `Nara_Mode_Full_Dev_v1` will be designed to resonate with these core Bimba principles, facilitating transformative dialogue and personalized, context-aware interactions.

## 3. Nara Mode (`Nara_Mode_Full_Dev_v1`) Distributed Architecture Plan

This section outlines the planned distribution of Nara's functionalities across the three main architectural layers: `friendly-file-front` (frontend), `friendly-file-back2front` (AG-UI/A2A and BPMCP orchestration), and `friendly-file-backend` (core agent logic, data processing, and synthesis pipeline).

### 3.A Frontend Layer (`friendly-file-front`)

This layer is responsible for the user interface and user experience of Nara Mode. It interacts with the `friendly-file-back2front` layer via the AG-UI protocol.

**Target Directory:** `friendly-file-front/src/subsystems/4_nara/`

(The following subsections 3.A.0 to 3.A.6 detail the frontend components, previously numbered 3.0 to 3.6. The content of these subsections remains largely the same as previously defined, focusing on UI, local state, and communication with `friendly-file-back2front`.)

The `4_nara` subsystem will mirror the modular structure of `5_epii` to ensure consistency, maintainability, and clear separation of concerns. The following outlines the purpose of each module and how existing/future components will be integrated.

### 3.A.0 `0_foundation` (Frontend - `friendly-file-front/src/subsystems/4_nara/0_foundation`)
- **Purpose:** Contains foundational elements, constants, types, and global configurations specific to the Nara subsystem.
- **Bimba Alignment:** Provides the underlying structural integrity for Nara's dialogue and taste functionalities.
- **Components:**
    - `nara-constants.ts`: Defines key constants for Nara's UI/UX, such as concrescence rhythm values, default settings for dynamic elements.
    - `nara-types.ts`: TypeScript interfaces and types for Nara-specific data structures (e.g., dialogue states, archetypal profiles, journal entries, Oracle readings).

### 3.A.1 `1_services` (Frontend - `friendly-file-front/src/subsystems/4_nara/1_services`)
- **Purpose:** Handles frontend business logic, data fetching coordination, and interactions with the `friendly-file-back2front` layer (which houses AG-UI/A2A handlers and BPMCP interactions).
- **Bimba Alignment:** Facilitates the "Dia-Logos" by managing the flow of information and interpretations, relying on `friendly-file-back2front` for BPMCP knowledge access and AG-UI dynamic interaction.
- **Key Technologies Leveraged (via `friendly-file-back2front`):**
    - **BPMCP:** All backend data operations are orchestrated by the Nara agent components within `friendly-file-back2front/subsystems/4_nara/` which then calls the BPMCP.
        - Reading archetypal and symbolic data from the Bimba graph (Neo4j) – strictly read-only for Nara.
        - Reading contextual information and content from Notion.
        - Reading and writing user-specific data (e.g., profiles, journal entries, preferences) to MongoDB.
    - **AG-UI Protocol:** Manages real-time, bidirectional communication between the Nara frontend (`friendly-file-front`) and the Nara Agent backend components residing in `friendly-file-back2front/subsystems/4_nara/ag-ui/`. The frontend client connects to the central AG-UI WebSocket gateway in `friendly-file-back2front/shared/core-ag-ui/`.
    - **A2A Protocol:** If Nara needs to communicate with other expert agents (e.g., Epii), its A2A client logic in `friendly-file-back2front/subsystems/4_nara/a2a/` would interact with the central A2A server in `friendly-file-back2front/shared/core-a2a/`.
- **Frontend Service Components (`friendly-file-front/src/subsystems/4_nara/1_services`):**
    - `nara-frontend-comms-service.ts`: This service in the frontend will be responsible for establishing and managing the WebSocket connection to the AG-UI gateway in `friendly-file-back2front`. It will send user-generated AG-UI events and subscribe to/handle AG-UI events emitted by the Nara-specific AG-UI handler in `friendly-file-back2front/subsystems/4_nara/ag-ui/`.
    - `oracle-ui-service.ts`: Handles frontend logic for Oracle interactions, packaging requests to be sent via `nara-frontend-comms-service.ts` and processing AG-UI responses for display.
    - `journal-ui-service.ts`: Handles frontend logic for Journal interactions, similarly using `nara-frontend-comms-service.ts` for communication and data synchronization via AG-UI events.

### 3.A.2 `1_utils` (Frontend - `friendly-file-front/src/subsystems/4_nara/1_utils`)
- **Purpose:** Provides reusable utility functions that support various aspects of the Nara UI/UX but do not contain business logic or direct API calls.
- **Bimba Alignment:** Supports the efficient and harmonious operation of the Nara interface.
- **Components:**
    - `nara-helpers.ts`: General utility functions (e.g., date formatting for journal entries, string manipulation for dialogue).
    - `bimba-coordinate-utils.ts`: Functions to map UI elements or data points to Bimba coordinates for internal tracking or display.
    - `animation-utils.ts`: Helpers for managing recursive interface animations and dynamic visual elements.

### 3.A.3 `2_hooks` (Frontend - `friendly-file-front/src/subsystems/4_nara/2_hooks`)
- **Purpose:** Contains React hooks for managing state, side effects, and reusable logic within Nara components.
- **Bimba Alignment:** Enables dynamic and responsive interactions, reflecting the evolving nature of dialogue and self-discovery.
- **Existing Components & Integration:
    - `useGraphInteractions.ts` (Existing): To be integrated for managing graph-based interactions, potentially for visualizing archetypal relationships or dialogue flows.
    - `useGraphInteractions3D.ts` (Existing): For 3D visualization aspects, possibly for the Mahamaya Matrix or complex symbolic representations.
    - `useNaraDialogue.ts`: Manages the state and logic for the main dialogue interface.
    - `useArchetypalProfile.ts`: Handles fetching and managing the user's archetypal profile data.
    - `useOracleReadings.ts`: Manages state for Oracle readings, including selected spreads and interpretations.
    - `useJournalEntries.ts`: Manages state for journal entries and their associated insights.

### 3.A.4 `3_visualization` (Frontend - `friendly-file-front/src/subsystems/4_nara/3_visualization`)
- **Purpose:** Houses presentational components responsible for rendering the UI, including complex visualizations and interactive elements.
- **Bimba Alignment:** Embodies the "Shakti" aspect of Nara, providing the visual and interactive interface for the user's journey.
- **Existing Components & Integration:
    - `InteractionLayer.tsx` (Existing): To be utilized as a foundational layer for interactive UI elements, potentially for dynamic card rendering or mandala interactions.
    - `NaraMainInterface.tsx`: The top-level component for the Nara interface, integrating Identity Dynamics, Oracle, and Journal sections.
    - `IdentityDynamicsProfile.tsx`: Displays the user's archetypal profile, including the Mahamaya Ground.
    - `MahamayaGroundVisualizer.tsx`: Interactive visual component for the Mahamaya Ground (e.g., six-petaled flower).
    - `OracleReadingDisplay.tsx`: Renders Tarot spreads, card imagery, and interpretations.
    - `JournalEntryEditor.tsx`: UI for inputting journal entries and displaying analysis results.
    - `DynamicConcrescenceIndicator.tsx`: Visualizes the 12-fold concrescence rhythm.

### 3.A.5 `4_context` (Frontend - `friendly-file-front/src/subsystems/4_nara/4_context`)
- **Purpose:** Provides React Contexts for managing global state that needs to be accessible across multiple components without prop-drilling. This includes state derived from AG-UI events and data fetched via BPMCP.
- **Bimba Alignment:** Ensures a cohesive and integrated user experience by centralizing shared data and interaction states.
- **Components:**
    - `NaraContext.tsx`: Provides global state for the current dialogue session (managed via AG-UI), user preferences within Nara (potentially stored via BPMCP/MongoDB), and overall application flow.
    - `ArchetypalProfileContext.tsx`: Manages the user's archetypal profile data (sourced via BPMCP) across the Identity Dynamics section.
    - `OracleContext.tsx`: Manages state related to active Oracle readings (data via BPMCP, interaction via AG-UI).
    - `JournalContext.tsx`: Manages state related to journal entries and their synthesis (data via BPMCP/MongoDB, interaction via AG-UI).

### 3.A.6 `5_integration` (Frontend - `friendly-file-front/src/subsystems/4_nara/5_integration`)

- **Purpose:** To house the primary integration points within the frontend, the main `NaraModeOrchestrator.tsx` component, and to detail its communication flow with the `friendly-file-back2front` layer via AG-UI.
- **Key Components & Flow (`friendly-file-front/src/subsystems/4_nara/5_integration`):**
  - `NaraModeOrchestrator.tsx` (evolving from `chatpage.tsx`): The main frontend component orchestrating the Nara mode UI and logic. It will:
      - Utilize `nara-frontend-comms-service.ts` (from `1_services`) to establish and manage the AG-UI WebSocket connection to the central AG-UI gateway in `friendly-file-back2front/shared/core-ag-ui/ag-ui-websocket-handler.js`.
      - Dispatch user actions (e.g., text input, UI interactions) by sending AG-UI events via the `nara-frontend-comms-service.ts`.
      - Subscribe to and handle AG-UI events received from the Nara-specific AG-UI handler (`friendly-file-back2front/subsystems/4_nara/ag-ui/`) via `nara-frontend-comms-service.ts`. These events will drive UI updates, display dialogue, render Oracle results, show journal insights, etc.
      - Coordinate calls to UI-specific services (e.g., `oracle-ui-service.ts`, `journal-ui-service.ts`) based on user interactions and AG-UI event responses.
  - **AG-UI Client Logic (within `nara-frontend-comms-service.ts`):** This service encapsulates the frontend's AG-UI client responsibilities: low-level WebSocket message handling, event serialization/deserialization, and connection state management with the `friendly-file-back2front` AG-UI gateway.
  - **BPMCP Interaction (Indirect):** The frontend (`NaraModeOrchestrator.tsx` and its child components/services) does not directly interact with BPMCP. All data requests that require BPMCP are sent as AG-UI events to the Nara agent components in `friendly-file-back2front/subsystems/4_nara/`, which then orchestrate BPMCP calls. The results are returned to the frontend via AG-UI events.
  - **A2A Interaction (Indirect and Optional):** If Nara needs to trigger an action that involves another agent (e.g., asking Epii to analyze a document), this request would be sent as an AG-UI event to the Nara agent in `friendly-file-back2front`. The Nara agent would then use its A2A client (`friendly-file-back2front/subsystems/4_nara/a2a/nara-a2a-client.js`) to communicate with the target agent via the central A2A server. The final result or updates would flow back to the frontend via AG-UI events from the Nara agent.


## End of Part 1 - Part 2 continues in `feature-context-bimba-alignment-package_Part2.md`