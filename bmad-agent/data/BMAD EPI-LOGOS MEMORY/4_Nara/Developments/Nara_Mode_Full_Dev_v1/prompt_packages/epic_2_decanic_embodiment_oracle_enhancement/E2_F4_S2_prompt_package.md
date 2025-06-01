# AI Builder Prompt Package: Epic 2, Feature 4, Story 2 - Visual Cues for Active Decans

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 4 - User Interface for Decanic Exploration
**Story:** E2_F4_S2 - Visual Cues for Active Archetypal Decanic Resonances in Oracle UI (Jungian & Saivist Informed)

## 1. Context & Objective

This document outlines requirements for an AI code generation task to implement **Story E2_F4_S2: Visual Cues for Active Archetypal Decanic Resonances in Oracle UI**. The goal is to enhance the Oracle UI (developed in E2_F4_S1) by incorporating clear, aesthetically resonant visual cues that highlight the most active or significant decanic archetypal influences impacting a user's reading. These cues aim to provide an immediate, intuitive grasp of the primary archetypal themes and focal points of consciousness (Spanda) at play, informed by Jungian psychology and Kashmir Saivism.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F4_S2_visual_cues_for_active_decans.md`
*   **Parent Story (UI Base):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F4_S1_oracle_ui_decanic_exploration.md`
*   **Data Source Story (Synthesis Engine):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F3_S1_advanced_symbolic_synthesis_engine.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (especially Oracle section, general UI guidelines, and any specific mockups for visual cues).
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management, existing styling solution.
*   **Data Source:** The UI will consume structured data from the Advanced Symbolic Synthesis Engine (E2_F3_S1). This engine will identify and prioritize the most significant decanic influences, potentially providing a 'resonance score' or flags for highlighting.
*   **Existing UI:** This story builds upon the UI components created in E2_F4_S1.

## 4. Constraints & Considerations

*   **Subtlety and Aesthetics:** Visual cues must be harmonious, beautiful, and unobtrusive, enhancing rather than distracting.
*   **Clarity:** Cues should clearly indicate significance without requiring complex interpretation.
*   **Symbolic Resonance:** The visual language should align with the overall symbolic and archetypal nature of the application.
*   **Performance:** Visual effects should be lightweight and not impact UI performance.
*   **Accessibility:** Cues should be designed with accessibility in mind (e.g., not relying solely on color).

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F4_S2_visual_cues_for_active_decans.md`)
2.  **Parent Story E2_F4_S1 File Content:** (Content of `story_E2_F4_S1_oracle_ui_decanic_exploration.md`)
3.  **Data Source Story E2_F3_S1 File Content:** (Content of `story_E2_F3_S1_advanced_symbolic_synthesis_engine.md`)
4.  **Epic Definition File Content:** (Content of `epic-2.md`)
5.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
6.  **EFDD/PRD File Content:** (Content of `efdd.md`)
7.  **Illustrative Enhanced Data Structure from Synthesis Engine (E2_F3_S1) - showing how active decans might be flagged:**
    ```json
    {
      "drawnCard": {
        "name": "Temperance",
        "primaryDecan": {
          "name": "Sagittarius I (Mercury)",
          "archetype": "The Alchemical Mediator",
          // ... other decan details
          "isActiveHighlight": true, // Flag for primary decan of the card
          "visualCueSuggestion": "subtleGlow"
        }
      },
      "natalResonance": {
        "hasResonance": true,
        "details": [
          {
            "natalPlacement": "Natal Mercury in Sagittarius",
            "significance": "...",
            "type": "Conjunction/PlacementInDecan",
            "isActiveHighlight": true, // Flag for strong natal resonance
            "visualCueSuggestion": "resonanceIcon"
          }
        ]
      },
      "transitActivations": {
        "hasActivations": true,
        "details": [
          {
            "transitingPlanet": "Transiting Mars in Sagittarius I",
            "significance": "...",
            "type": "TransitInDecan",
            "isActiveHighlight": true, // Flag for potent transit
            "visualCueSuggestion": "pulsingElementSymbol"
          }
        ]
      },
      "additionalActiveDecans": [
        {
          "name": "Aries III (Venus)",
          "archetype": "The Perfected Work",
          "reasonForHighlight": "Strong current collective influence (e.g., major transit)",
          "isActiveHighlight": true,
          "visualCueSuggestion": "highlightOnZodiacWheel"
        }
      ],
      "overallSynthesisNarrative": "..."
    }
    ```

## 6. Expected Outputs from AI Code Generation

1.  **Modified Frontend Components (React/TypeScript from E2_F4_S1):**
    *   Updates to `DecanExplorationView`, `DecanSummaryCard`, `NatalResonanceSection`, `TransitActivationSection` to incorporate visual cues based on the `isActiveHighlight` and `visualCueSuggestion` flags (or similar mechanism) from the synthesis data.
    *   New sub-components if needed for specific visual effects (e.g., `HighlightGlow`, `ResonanceIconDisplay`).
2.  **Visual Cue Logic:**
    *   Functions or logic to conditionally apply visual styles (e.g., glows, borders, icon overlays) based on the data.
    *   (Optional) A small, dedicated "Current Archetypal Resonances" panel component that summarizes the top 1-3 decanic themes with associated evocative visual symbols, if data supports this.
3.  **Styling (Conceptual & CSS Snippets):**
    *   CSS or styled-component snippets for the proposed visual cues (e.g., subtle glow effect, icon styling).
    *   Suggestions for how these cues integrate aesthetically with the existing UI.
4.  **Updated Type Definitions (TypeScript):**
    *   Modifications to interfaces to include fields like `isActiveHighlight` and `visualCueSuggestion` in the data structure from the Synthesis Engine.
5.  **Explanation & Documentation:**
    *   Clear comments in the code explaining the visual cue logic.
    *   Updates to the `README.md` from E2_F4_S1, detailing the new visual cue features, how they are triggered by data, and any new components.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F4_S2, its parent Story E2_F4_S1, the Synthesis Engine Story E2_F3_S1, Epic 2, UI/UX Specifications, EFDD, and the illustrative enhanced data structure), please generate the necessary modifications and additions to the frontend code (React with TypeScript) from E2_F4_S1 to implement the "Visual Cues for Active Archetypal Decanic Resonances" feature.

**Key Requirements:**

1.  **Data Structure Adaptation:**
    *   Update TypeScript interfaces (from E2_F4_S1) for the Synthesis Engine data to include new fields like `isActiveHighlight: boolean` and `visualCueSuggestion: string` (e.g., 'subtleGlow', 'resonanceIcon', 'pulsingElementSymbol', 'highlightOnZodiacWheel') within the `primaryDecan`, `natalResonance.details`, `transitActivations.details`, and a potential `additionalActiveDecans` array.
    *   Update the mock data object to include these new fields, demonstrating various active states.

2.  **Modify Existing Components (from E2_F4_S1):**
    *   **`DecanSummaryCard` / `DecanExplorationView`:** If `drawnCard.primaryDecan.isActiveHighlight` is true, apply a visual cue (e.g., a subtle glow or border) to the card's decan display. The type of cue could be suggested by `visualCueSuggestion`.
    *   **`NatalResonanceSection`:** For each item in `natalResonance.details`, if `isActiveHighlight` is true, apply a distinct visual cue (e.g., a small icon next to it, a change in text style/color).
    *   **`TransitActivationSection`:** Similarly, for each item in `transitActivations.details`, if `isActiveHighlight` is true, apply a visual cue.

3.  **New Visual Cue Components/Logic (as needed):**
    *   Create small, reusable components or helper functions to render these visual cues (e.g., a component that wraps its children with a glow effect if a prop is true, or an icon component that changes based on a cue type).
    *   (Optional) If the data includes `additionalActiveDecans`, consider how these might be displayed, perhaps in a new small panel summarizing key active themes with symbols.

4.  **Styling for Cues:**
    *   Provide example CSS (or styled-components) for the visual cues. Focus on subtlety, beauty, and symbolic resonance. Examples:
        *   A soft, pulsating glow effect.
        *   Elegant, minimalist icons (you can describe them or use placeholders if actual SVG generation is out of scope).
        *   Harmonious color accents.

5.  **Tooltips (Optional but Recommended):**
    *   If feasible, demonstrate how a simple tooltip could be added to a visual cue, providing a brief text explanation (e.g., "Mars in Aries decan: Courageous self-expression highlighted").

6.  **Code Structure & Best Practices:**
    *   Ensure modifications are cleanly integrated into the existing E2_F4_S1 component structure.
    *   Maintain type safety and clear commenting.

7.  **Deliverables:**
    *   Modified TypeScript/TSX files from E2_F4_S1, incorporating the visual cue logic and components.
    *   Any new TypeScript/TSX files for new visual cue components.
    *   CSS/styling snippets for the visual cues.
    *   An updated `README.md` (building on E2_F4_S1's README) explaining the new visual cue system, how cues are triggered by the data, and any new components or styling approaches.

**Assumptions for you to make:**
*   You are modifying the codebase generated for E2_F4_S1.
*   The primary goal is to show *how* these visual cues are implemented and triggered by data, not to achieve pixel-perfect final styling.
*   Accessibility considerations (like sufficient contrast) should be noted, even if not fully implemented in the example styling.
```

## 8. Review & Next Steps

*   Review generated code for functionality, clarity, and aesthetic harmony of visual cues.
*   Ensure cues are responsive and accessible.
*   Integrate with the actual Advanced Symbolic Synthesis Engine data feed.
*   Refine visual design based on user feedback and overall application aesthetics.
*   Consider integration with Bodily Resonance Mapping (E2_F1_S4) if applicable.