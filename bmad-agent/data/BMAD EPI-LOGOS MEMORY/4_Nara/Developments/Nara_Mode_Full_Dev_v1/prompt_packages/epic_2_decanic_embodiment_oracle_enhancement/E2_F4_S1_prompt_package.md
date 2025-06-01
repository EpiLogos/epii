# AI Builder Prompt Package: Epic 2, Feature 4, Story 1 - Oracle UI for Archetypal Decan Exploration

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 4 - User Interface for Decanic Exploration
**Story:** E2_F4_S1 - Oracle UI for Archetypal Decan Exploration (Jungian & Saivist Informed)

## 1. Context & Objective

This document outlines requirements for an AI code generation task to implement **Story E2_F4_S1: Oracle UI for Archetypal Decan Exploration**. The goal is to create an intuitive user interface within the Oracle section that allows users to explore the decanic associations of drawn cards, their resonance with the user's natal psyche (natal chart), and current cosmic activations (transits). This UI aims to deepen understanding of the decanic context as a mirror to the inner world and the interconnectedness of phenomena, informed by Jungian psychology and Kashmir Saivism.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F4_S1_oracle_ui_decanic_exploration.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (especially Oracle section and any general UI guidelines for decanic info display).
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`
*   **Advanced Symbolic Synthesis Engine (E2_F3_S1):** The UI will display data provided by this engine.

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management, existing styling solution.
*   **Data Source:** The UI will primarily consume structured data from the Advanced Symbolic Synthesis Engine (E2_F3_S1). This engine provides synthesized insights about the drawn card's decan, its general meaning, natal resonances, and transit activations.
*   **`bimba_map` Data:** Detailed decan imagery, symbols, and descriptions might be fetched directly or be part of the data provided by the Synthesis Engine.
*   **Interactivity:** The UI will feature clickable elements to reveal deeper layers of information (e.g., tooltips, modals, expandable sections).

## 4. Constraints & Considerations

*   **Information Density:** Balance richness of information with clarity and avoid overwhelming the user.
*   **Intuitive Navigation:** Users should easily understand how to explore different layers of decanic meaning.
*   **Symbolic Visual Language:** Visuals should enhance understanding and be aesthetically resonant.
*   **Responsiveness & Accessibility:** Standard requirements for modern UI.
*   **Psychological & Philosophical Tone:** The language and presentation should encourage reflection and align with Jungian/Saivist perspectives.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F4_S1_oracle_ui_decanic_exploration.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`, including any mockups for this specific UI if available)
4.  **EFDD/PRD File Content:** (Content of `efdd.md`)
5.  **Illustrative Data Structure from Synthesis Engine (E2_F3_S1) - What the UI will consume:**
    ```json
    {
      "drawnCard": {
        "name": "Temperance",
        "primaryDecan": {
          "name": "Sagittarius I (Mercury)",
          "archetype": "The Alchemical Mediator",
          "rulingPlanet": "Mercury",
          "sign": "Sagittarius",
          "element": "Fire",
          "modality": "Mutable",
          "symbolicImage": "path/to/decan_image_sag1.svg",
          "description": "This decan embodies the art of synthesis, blending opposites to create a harmonious whole. It speaks to communication, learning, and the integration of diverse perspectives, reflecting Mercury's role in bridging worlds."
        }
      },
      "natalResonance": {
        "hasResonance": true,
        "details": [
          {
            "natalPlacement": "Natal Mercury in Sagittarius",
            "significance": "Your innate communicative style and intellectual curiosity (Natal Mercury) are strongly aligned with this decan's theme of alchemical mediation and learning.",
            "type": "Conjunction/PlacementInDecan"
          },
          {
            "natalPlacement": "Natal Jupiter in Gemini",
            "significance": "Your expansive wisdom-seeking nature (Natal Jupiter) is in a dynamic dialogue (opposition) with this decan's ruler, Mercury, inviting a synthesis of broad vision and detailed understanding.",
            "type": "AspectToRuler"
          }
        ]
      },
      "transitActivations": {
        "hasActivations": true,
        "details": [
          {
            "transitingPlanet": "Transiting Mars in Sagittarius I",
            "significance": "Current assertive energies (Transiting Mars) are directly activating this decan's field, potentially bringing opportunities for dynamic communication or a drive to integrate new knowledge.",
            "type": "TransitInDecan"
          }
        ]
      },
      "overallSynthesisNarrative": "The appearance of Temperance, linked to Sagittarius I, highlights a call for balance and skillful integration in your life... Your natal Mercury here amplifies this theme, while transiting Mars energizes your capacity for alchemical action..."
    }
    ```

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   `DecanExplorationView` (or similar): Main component to display within the Oracle reading section when a user wants to explore decanic details.
    *   `DecanSummaryCard`: Displays the primary decan of the drawn card (name, archetype, image).
    *   `DecanDetailModal` (or expandable section): Shows detailed decan info (rulers, sign, element, description).
    *   `NatalResonanceSection`: Displays highlighted natal placements relevant to the decan.
    *   `TransitActivationSection`: Displays key transits activating the decan's themes.
    *   Components for visual cues (icons, color-coding) to differentiate information layers.
2.  **Data Handling & Logic:**
    *   Logic to parse and display the structured data received from the (mocked) Synthesis Engine.
    *   State management for interactive elements (e.g., modal visibility, expanded sections).
3.  **Type Definitions (TypeScript):**
    *   Interfaces for the data structure consumed from the Synthesis Engine.
4.  **Styling (Conceptual):**
    *   Suggestions for a symbolic and intuitive visual language (though detailed CSS is secondary to structure and logic).
5.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining the component hierarchy, data flow from the Synthesis Engine, and key interactive features.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F4_S1, Epic 2, UI/UX Specifications, EFDD, and the illustrative data structure from a Symbolic Synthesis Engine), please generate the necessary frontend code (React with TypeScript) for the "Oracle UI for Archetypal Decan Exploration" feature.

**Key Requirements:**

1.  **Data Structures & Mock Data:**
    *   Define TypeScript interfaces for the data structure the UI will consume from the Synthesis Engine (as per the example: `drawnCard` with `primaryDecan` details, `natalResonance`, `transitActivations`, `overallSynthesisNarrative`).
    *   Create a mock data object adhering to this structure that the main component can use for development.

2.  **Main Component (`DecanExplorationView`):**
    *   This component will receive the mock synthesis data as a prop.
    *   It should clearly display the drawn card's primary decan information (name, archetype, symbolic image if provided).
    *   Make the decan name/archetype clickable to reveal more details (e.g., in a modal or an expandable section). This detailed view should show the decan's ruling planet, sign, element, modality, and a fuller description.

3.  **Layered Information Display:**
    *   **Natal Resonance:** If `natalResonance.hasResonance` is true, display the details in a dedicated section. Each resonance point should clearly state the natal placement and its significance.
    *   **Transit Activations:** If `transitActivations.hasActivations` is true, display these details in another section, explaining the transiting planet and its significance for the decan's themes.
    *   Use distinct visual cues (e.g., icons, subtle background color changes, or section headers) to differentiate between general decan info, natal resonance, and transit activations.

4.  **Interactivity & Navigation:**
    *   Ensure the UI is intuitive. Users should easily understand how to access the different layers of information.
    *   Consider using tooltips for brief explanations of terms if necessary.

5.  **Code Structure & Best Practices:**
    *   Organize code into logical, reusable components.
    *   Ensure components are functional, use hooks, and are well-typed.
    *   Provide clear comments.

6.  **Deliverables:**
    *   All necessary TypeScript/TSX files for the components and type definitions.
    *   A brief `README.md` explaining the component structure, how it uses the input data, and its interactive features.

**Assumptions for you to make:**
*   Focus on the structure, data display, and interactivity of the UI components.
*   Styling should be minimal and functional; the primary goal is to demonstrate how the information is presented and accessed.
*   The component will be integrated into a larger Oracle reading view.
```

## 8. Review & Next Steps

*   Review generated code for functionality, clarity, adherence to UI/UX principles, and responsiveness.
*   Integrate with the actual Advanced Symbolic Synthesis Engine (once available).
*   Refine visual design and styling based on overall application aesthetics.
*   Conduct user testing to ensure intuitiveness and clarity.