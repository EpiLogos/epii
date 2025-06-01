# AI Builder Prompt Package: Epic 3, Feature 1, Story 1 - Archetypal Concrescence Spreads

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** Feature 1 - Advanced Oracle Reading Modes - The Alchemical Catalyst
**Story:** E3_F1_S1 - Archetypal Concrescence Spreads for Oracle Readings (Jungian & Saivist Informed)

## 1. Context & Objective

This document outlines requirements for an AI code generation task to implement **Story E3_F1_S1: Archetypal Concrescence Spreads for Oracle Readings**. The goal is to develop a system where 6-card Tarot layouts ("Archetypal Concrescence Spreads") are automatically configured and presented to the user based on their current determined "12-fold concrescence phase." This phase reflects their stage in psychospiritual development (Jungian individuation) and the unfolding of consciousness (Kashmir Saivism), making Oracle readings highly tailored and relevant to their present state.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_3_tarot_alchemical_crucible_journal_synthesis/story_E3_F1_S1_concrescence_spreads.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-3.md` (To be created/referenced, assuming it defines the overall goals of Epic 3)
*   **Mahamaya Ground (Epic 1):** Data from Epic 1 (e.g., user's archetypal quintessence, natal chart info) will be crucial for determining the concrescence phase.
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (especially Oracle section and guidelines for spread display).
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`
*   **`bimba_map`:** May inform spread design by linking phases to symbols/archetypes.

## 3. Technical Context & Assumptions

*   **Backend Focus:** Significant logic will be backend-driven for phase determination and spread configuration.
*   **Frontend:** React, TypeScript for displaying the selected spread and handling card drawing interaction.
*   **Data Model:** A clear data model for the "12-fold concrescence phase" and its characteristics is needed. This model should link phases to specific spread configurations.
*   **Existing Oracle Engine:** Leverages existing card drawing and basic interpretation capabilities.

## 4. Constraints & Considerations

*   **Defining Concrescence Phases:** The "12-fold archetypal concrescence phase" model needs robust definition, integrating Jungian and Saivist principles. The method for determining a user's current phase is critical.
*   **Spread Design:** Each 6-card spread must be thoughtfully designed, with each position having a clear symbolic inquiry relevant to its associated concrescence phase.
*   **User Experience:** The system should feel intuitive. The connection between the user's phase and the chosen spread should be subtly and evocatively communicated.
*   **Scalability:** The system should allow for adding more phases and spreads over time.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E3_F1_S1_concrescence_spreads.md`)
2.  **Epic Definition File Content:** (Content of `epic-3.md` - or a summary of its themes if not yet created)
3.  **Illustrative Model of the 12-Fold Concrescence Cycle:**
    *   Provide a conceptual outline of at least 3-4 distinct concrescence phases (e.g., Phase 1: Seed of Potential, Phase 4: Shadow Encounter, Phase 8: Intellectual Synthesis, Phase 12: Integration & Wholeness).
    *   For each phase, describe its core archetypal theme and energetic signature.
4.  **Example Archetypal Concrescence Spread Configurations (for 2-3 phases):**
    ```json
    [
      {
        "phaseName": "Phase 4: Shadow Encounter",
        "phaseId": "P4SE",
        "description": "A period of confronting and integrating repressed or unacknowledged aspects of the self.",
        "spreadName": "The Mirror of Shadows Spread",
        "positions": [
          {"id": 1, "label": "The Unseen Aspect", "inquiry": "What hidden part of me is now seeking light?"},
          {"id": 2, "label": "Its Current Manifestation", "inquiry": "How is this shadow aspect appearing in my life?"},
          {"id": 3, "label": "The Fear or Resistance", "inquiry": "What fear holds this aspect in shadow?"},
          {"id": 4, "label": "The Gift Within", "inquiry": "What strength or wisdom does integrating this shadow offer?"},
          {"id": 5, "label": "Path to Integration", "inquiry": "What action or shift in perspective aids integration?"},
          {"id": 6, "label": "Emerging Wholeness", "inquiry": "What new wholeness emerges from this encounter?"}
        ]
      },
      {
        "phaseName": "Phase 8: Intellectual Synthesis (Air Element Focus)",
        "phaseId": "P8IS",
        "description": "A time for mental clarity, new perspectives, and synthesizing diverse ideas.",
        "spreadName": "The Winds of Clarity Spread",
        "positions": [
          {"id": 1, "label": "The Core Question", "inquiry": "What central question seeks clarity now?"},
          {"id": 2, "label": "Prevailing Mental Pattern", "inquiry": "What thought pattern currently shapes my understanding?"},
          {"id": 3, "label": "New Information/Insight", "inquiry": "What new data or perspective is emerging?"},
          {"id": 4, "label": "Challenging Assumption", "inquiry": "What assumption needs re-evaluation?"},
          {"id": 5, "label": "Path to Synthesis", "inquiry": "How can these diverse elements be integrated into a new understanding?"},
          {"id": 6, "label": "Resulting Clarity/Action", "inquiry": "What clarity or inspired action arises from this synthesis?"}
        ]
      }
    ]
    ```
5.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md` relevant to Oracle spreads)
6.  **EFDD/PRD File Content:** (Content of `efdd.md`)

## 6. Expected Outputs from AI Code Generation

1.  **Backend Logic (Conceptual Pseudocode/High-Level Design for Node.js/Python or similar):**
    *   **Concrescence Phase Determination Module:**
        *   Function to determine current phase (e.g., `determineUserConcrescencePhase(userId, mahamayaData)`). This is conceptual; the AI won't have live Mahamaya data but should outline how it *might* be used (e.g., based on archetypal scores, recent journal themes if available, user-set intentions).
        *   Data structure for storing the 12 phases and their characteristics.
    *   **Spread Configuration Module:**
        *   Data structure to store the defined Archetypal Concrescence Spreads (similar to the JSON example above).
        *   Function to select the appropriate spread based on the determined phase (e.g., `getSpreadForPhase(phaseId)`).
2.  **API Endpoint Definition (Conceptual):**
    *   Endpoint to get the current concrescence spread for a user (e.g., `GET /api/oracle/concrescence-spread`).
    *   Request: User ID (implicitly via auth).
    *   Response: JSON object of the selected spread configuration (name, positions with labels and inquiries).
3.  **Frontend Components (React/TypeScript):**
    *   `ConcrescenceSpreadDisplay`: Component to render the 6-card spread layout, displaying position labels and inquiries.
    *   Logic to fetch the spread configuration from the backend.
    *   Integration with existing card drawing components.
    *   A small UI element to subtly explain the connection between the user's phase and the chosen spread.
4.  **Type Definitions (TypeScript):**
    *   Interfaces for `ConcrescencePhase`, `SpreadPosition`, `SpreadConfiguration`.
5.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining:
        *   The conceptual logic for phase determination.
        *   How spreads are configured and selected.
        *   The frontend component hierarchy for displaying the spread.
        *   The API interaction.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E3_F1_S1, Epic 3 themes, illustrative concrescence phase model, example spread configurations, UI/UX specs, and EFDD), please generate the necessary backend logic design (conceptual pseudocode/high-level design), API endpoint definition, frontend components (React with TypeScript), and type definitions for the "Archetypal Concrescence Spreads" feature.

**Key Requirements:**

1.  **Concrescence Phase Model & Determination (Backend Design):**
    *   Define a TypeScript interface for a `ConcrescencePhase` (e.g., `id`, `name`, `description`, `archetypalTheme`).
    *   Outline a conceptual function (e.g., in pseudocode for Node.js/Python) `determineUserConcrescencePhase(userId, mahamayaData)` that describes how a user's current phase might be determined (you can make assumptions about `mahamayaData` structure, e.g., it contains scores for archetypes or recent themes). For now, this function can return a hardcoded phase for testing.
    *   Create a sample array of 3-4 `ConcrescencePhase` objects.

2.  **Spread Configuration & Selection (Backend Design):**
    *   Define TypeScript interfaces for `SpreadPosition` (`id`, `label`, `inquiry`) and `SpreadConfiguration` (`phaseId`, `spreadName`, `positions: SpreadPosition[]`).
    *   Create an array of 2-3 sample `SpreadConfiguration` objects, linking them to the sample `ConcrescencePhase` IDs (as per the example provided in the inputs).
    *   Outline a function `getSpreadForPhase(phaseId, allSpreads)` that returns the correct spread configuration.

3.  **API Endpoint (Conceptual Definition):**
    *   Define a `GET /api/oracle/concrescence-spread` endpoint.
    *   Specify its expected response: a JSON object of the selected `SpreadConfiguration` for the current user's phase.

4.  **Frontend Components (React/TypeScript):**
    *   Create a `ConcrescenceSpreadDisplay` component that:
        *   Conceptually fetches the spread configuration from the API (you can mock this fetch call initially).
        *   Renders the 6 card positions with their `label` and `inquiry` text.
        *   (Placeholder) Indicates where card drawing/display for each position would occur.
    *   Include a small, simple UI element (e.g., a short text paragraph) that explains to the user *why* this spread was chosen, based on the (mocked) current concrescence phase name/description.

5.  **Type Definitions:**
    *   Provide all necessary TypeScript interfaces (`ConcrescencePhase`, `SpreadPosition`, `SpreadConfiguration`).

6.  **Deliverables:**
    *   Backend design/pseudocode for phase determination and spread selection.
    *   API endpoint definition.
    *   TypeScript/TSX files for the frontend component(s) and type definitions.
    *   A brief `README.md` explaining the overall architecture, data flow, and how the components work together.

**Assumptions for you to make:**
*   Focus on the logic for phase-to-spread mapping and the UI display of the spread structure.
*   The actual card drawing and detailed interpretation logic are handled by existing/other components.
*   Styling should be minimal and functional.
```

## 8. Review & Next Steps

*   Review generated code for logical correctness, adherence to requirements, and clarity.
*   Develop the full 12-fold concrescence phase model and its determination logic.
*   Design and implement all 12+ corresponding Archetypal Concrescence Spreads.
*   Integrate with live Mahamaya Ground data and user progress tracking.
*   Refine UI/UX for clarity, beauty, and intuitive interaction.
*   Conduct user testing.