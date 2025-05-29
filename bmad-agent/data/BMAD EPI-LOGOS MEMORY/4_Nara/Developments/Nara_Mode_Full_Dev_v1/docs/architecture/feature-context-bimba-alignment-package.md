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

## 3. Architectural Plan for `friendly-file-front/src/subsystems/4_nara`

The `4_nara` subsystem will mirror the modular structure of `5_epii` to ensure consistency, maintainability, and clear separation of concerns. The following outlines the purpose of each module and how existing/future components will be integrated.

### 3.0 `0_foundation`
- **Purpose:** Contains foundational elements, constants, types, and global configurations specific to the Nara subsystem.
- **Bimba Alignment:** Provides the underlying structural integrity for Nara's dialogue and taste functionalities.
- **Components:**
    - `nara-constants.ts`: Defines key constants for Nara's UI/UX, such as concrescence rhythm values, default settings for dynamic elements.
    - `nara-types.ts`: TypeScript interfaces and types for Nara-specific data structures (e.g., dialogue states, archetypal profiles, journal entries, Oracle readings).

### 3.1 `1_services`
- **Purpose:** Handles business logic, data fetching, and interactions with external APIs (e.g., `friendly-file-back2front` for A2A queries, Notion integration).
- **Bimba Alignment:** Facilitates the "Dia-Logos" by managing the flow of information and interpretations.
- **Components:**
    - `nara-api-service.ts`: Functions for interacting with the backend to retrieve archetypal data, process symbolic inputs, and manage journal entries.
    - `oracle-service.ts`: Specific service for handling Oracle-related logic, such as card drawing algorithms, spread generation, and interpretation processing.
    - `journal-synthesis-service.ts`: Logic for the Journal Synthesis Engine, including NLP processing, symbolic deconstruction, and insight generation.

### 3.2 `1_utils`
- **Purpose:** Provides reusable utility functions that support various aspects of the Nara UI/UX but do not contain business logic or direct API calls.
- **Bimba Alignment:** Supports the efficient and harmonious operation of the Nara interface.
- **Components:**
    - `nara-helpers.ts`: General utility functions (e.g., date formatting for journal entries, string manipulation for dialogue).
    - `bimba-coordinate-utils.ts`: Functions to map UI elements or data points to Bimba coordinates for internal tracking or display.
    - `animation-utils.ts`: Helpers for managing recursive interface animations and dynamic visual elements.

### 3.3 `2_hooks`
- **Purpose:** Contains React hooks for managing state, side effects, and reusable logic within Nara components.
- **Bimba Alignment:** Enables dynamic and responsive interactions, reflecting the evolving nature of dialogue and self-discovery.
- **Existing Components & Integration:
    - `useGraphInteractions.ts` (Existing): To be integrated for managing graph-based interactions, potentially for visualizing archetypal relationships or dialogue flows.
    - `useGraphInteractions3D.ts` (Existing): For 3D visualization aspects, possibly for the Mahamaya Matrix or complex symbolic representations.
    - `useNaraDialogue.ts`: Manages the state and logic for the main dialogue interface.
    - `useArchetypalProfile.ts`: Handles fetching and managing the user's archetypal profile data.
    - `useOracleReadings.ts`: Manages state for Oracle readings, including selected spreads and interpretations.
    - `useJournalEntries.ts`: Manages state for journal entries and their associated insights.

### 3.4 `3_visualization`
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

### 3.5 `4_context`
- **Purpose:** Provides React Contexts for managing global state that needs to be accessible across multiple components without prop-drilling.
- **Bimba Alignment:** Ensures a cohesive and integrated user experience by centralizing shared data.
- **Components:**
    - `NaraContext.tsx`: Provides global state for the current dialogue session, user preferences within Nara, and overall application flow.
    - `ArchetypalProfileContext.tsx`: Manages the user's archetypal profile data across the Identity Dynamics section.
    - `OracleContext.tsx`: Manages state related to active Oracle readings.
    - `JournalContext.tsx`: Manages state related to journal entries and their synthesis.

### 5. Integration

- **Purpose:** To house the primary integration points and the main `NaraModeIntegration.tsx` component, which will serve as the entry point for the Nara mode within the larger application. This will encapsulate the core chat interface functionality. It is clarified that the existing `chatpage.tsx` will evolve into this `NaraModeIntegration.tsx` component (or a similarly named component).
- **Key Components:**
  - `NaraModeIntegration.tsx` (evolving from `chatpage.tsx`): The main component orchestrating the Nara mode UI and logic.
  - Integration with external APIs (e.g., for LLM interaction, data persistence).
  - Event listeners and dispatchers for inter-subsystem communication.


## 4. Integration of Existing Functionality

- **`friendly-file-front/src/subsystems/4_nara/5_pages/UserSettings.tsx`:** As noted, this component appears to be misplaced. It is not directly related to the core "Dialogue/Taste" functionality of Nara. It should be moved to a more appropriate global settings or user management subsystem (e.g., `5_epii/5_integration/UserSettings.tsx`). This will be addressed in a separate task.

## 5. Future Development Considerations

- **Recursive Interface Design:** Architectural components should support dynamic styling and behavior based on the 12-fold concrescence rhythm, including color temperature shifts, typographic weight changes, and interface opacity levels.
- **Multimodal Experience:** Design for integration of planetary soundscapes, archetypal video collages, and haptic feedback patterns, requiring specific component and service considerations.
- **Quaternal Logic Integration:** Ensure the architecture supports the visual and functional embodiment of the 6-fold structure across Identity Dynamics, Oracle, and Journal sections.

## 6. Conclusion

This FCBAP provides a foundational architectural blueprint for `Nara_Mode_Full_Dev_v1`, aligning its development with the modular patterns of `5_epii` and the philosophical principles of Epi-Logos, particularly its Bimba coordinate alignment. The next steps involve detailed component design and implementation based on this structure and the UI/UX Specification.