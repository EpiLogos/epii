# AI Builder Prompt Package: Epic 2, Feature 1, Story 4 - Somatic Archetypes: Mapping Decanic Energies to the Felt Sense

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 1 - Oracle Core Enhancements
**Story:** E2_F1_S4 - Somatic Archetypes: Mapping Decanic Energies to the Felt Sense

## 1. Context & Objective

This document outlines the requirements for an AI code generation task to implement **Story E2_F1_S4: Somatic Archetypes**. The goal is to provide users with a visual mapping of drawn Tarot card imagery and their decanic symbols onto relevant energetic centers or areas of a human form model within the UI. This aims to help users gain a more direct, visceral sense of where these archetypal energies might be resonating within their somatic experience, fostering a deeper mind-body-psyche connection.

This story builds upon E2_F1_S1 (Dynamic Card Rendering) and enhances the Oracle experience by adding an embodied, somatic dimension to card interpretations.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F1_S4_bodily_resonance_mapping.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md`
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management solution, existing styling solution. SVG or a lightweight 2D graphics library might be useful for the body map visualization.
*   **Backend/Data Assumptions:**
    *   Drawn card's decanic information is available (from E2_F1_S1).
    *   A data source (e.g., a JSON file, or an API endpoint via BPMCP) provides the correspondences between Tarot cards/decans and specific somatic regions/energetic centers. This data will define which areas on the body map to highlight for a given card/decan.
    *   This correspondence data will also include reflective somatic prompts associated with each mapping.
*   **UI/UX Integration:**
    *   A visual model of the human form (e.g., simplified chakra system, chinese medicine qi body-energy map (or Human Design body map), generic body outline) will be displayed.
    *   When a card is drawn, the UI will offer an option to view its 'Somatic Resonance Map'.
    *   Relevant symbols/colors will be overlaid on the body map based on the correspondence data.
    *   Users can interact with highlighted areas to see reflective prompts.

## 4. Constraints & Considerations

*   **Visual Clarity:** The body map and overlays must be clear and intuitive, not cluttered.
*   **Performance:** Rendering the body map and interactive elements should be performant.
*   **Data Structure for Correspondences:** The structure of the correspondence data (linking cards/decans to body areas and prompts) needs to be well-defined for easy frontend consumption.
*   **Iterative Detail:** The initial implementation might use a simplified body model and a core set of correspondences (correspondences built into the neo4j bimba map; leverage BPMCP to query for somatic/pranic resonances).

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F1_S4_bodily_resonance_mapping.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
4.  **EFDD/PRD File Content:** (Content of `efdd.md`)
5.  **Illustrative Somatic Correspondence Data Structure (Example - could be a JSON file or API response):**
    ```json
    [
      {
        "cardName": "The Magician",
        "decan": "Aries I (Mars)",
        "somaticPoints": [
          {
            "pointId": "throat_chakra", // An identifier for a predefined point on the body map
            "pointName": "Throat Chakra (Vishuddha)",
            "overlaySymbol": "aries_glyph", // Or a color, or card mini-icon
            "reflectivePrompt": "The Magician's power of manifestation often connects to clear expression. Notice any sensations in your throat area. Is there something you feel called to voice or create?"
          },
          {
            "pointId": "solar_plexus_chakra",
            "pointName": "Solar Plexus Chakra (Manipura)",
            "overlaySymbol": "mars_glyph",
            "reflectivePrompt": "The assertive energy of Mars in Aries I can be felt in your center of will. How does your personal power feel in relation to this card's message?"
          }
        ]
      },
      {
        "cardName": "The High Priestess",
        "decan": "Moon in Cancer I", // Example
        "somaticPoints": [
          {
            "pointId": "third_eye_chakra",
            "pointName": "Third Eye Chakra (Ajna)",
            "overlaySymbol": "moon_glyph",
            "reflectivePrompt": "The High Priestess invites deep intuition. Gently bring your awareness to the space between your eyebrows. What subtle insights or images arise?"
          }
        ]
      }
      // ... more card/decan correspondences
    ]
    ```
6.  **Simple SVG Body Map (Illustrative - or guidance to create one):**
    A basic SVG outline of a human figure with identifiable regions/points that correspond to `pointId` in the data (e.g., head, throat, heart, solar plexus, sacral, root areas).

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   `SomaticBodyMap` component: Displays the visual model of the human form (e.g., using an imported SVG or generating simple shapes). It should be able to highlight specific points/regions based on props.
    *   `SomaticResonanceView` component: Orchestrates the display. It takes the drawn card/decan information, fetches/receives the corresponding somatic points from the data structure, and passes the points to be highlighted to `SomaticBodyMap`.
    *   Logic to display reflective prompts when a user interacts with a highlighted point on the `SomaticBodyMap` (e.g., on hover or click).
2.  **Data Handling:**
    *   Utility function to fetch or access the somatic correspondence data (e.g., from a local JSON file or a mock API).
    *   Logic to filter/find the relevant somatic points for the currently drawn card/decan.
3.  **State Management (if needed):**
    *   Minimal state, perhaps to manage which somatic point's prompt is currently displayed.
4.  **Type Definitions (TypeScript):**
    *   Interfaces for the somatic correspondence data structure, card/decan inputs, etc.
5.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining the components, data flow, and how to integrate this view into the Oracle section (e.g., as a toggleable display).
    *   The SVG for the basic body map if one is generated, or instructions on how to create/procure one that matches the `pointId` system.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F1_S4, Epic 2, UI/UX Specifications, EFDD, illustrative data structure, and the need for a simple body map), please generate the necessary frontend code (React with TypeScript) to implement the "Somatic Archetypes Mapping" feature for the Nara Oracle.

**Key Requirements:**

1.  **Somatic Correspondence Data:**
    *   Define TypeScript interfaces for the somatic correspondence data (as per the illustrative JSON: array of objects with `cardName`, `decan`, and `somaticPoints` which itself is an array with `pointId`, `pointName`, `overlaySymbol`, `reflectivePrompt`).
    *   Create a mock utility function that returns a sample of this data (e.g., for 2-3 cards). In a real app, this would fetch from a file or API.

2.  **`SomaticBodyMap` Component:**
    *   Create a React component that renders a simple visual representation of a human body (e.g., using basic SVG shapes or an imported SVG). If generating SVG, include a few predefined 'hotspot' areas (e.g., circles or rects) corresponding to `pointId` values like `head_area`, `throat_chakra`, `heart_chakra`, `solar_plexus_chakra`, `sacral_chakra`, `root_chakra`.
    *   This component should accept an array of `pointId`s to highlight. Highlighted points should change appearance (e.g., color fill).
    *   When a highlighted point is hovered over or clicked, it should trigger a callback function passed via props, providing the `pointId` or the full somatic point data.

3.  **`SomaticResonanceView` Component:**
    *   This component receives the `drawnCardName` and `drawnCardDecan` as props.
    *   It uses the mock utility to get all somatic correspondences and filters them to find the data for the current card/decan.
    *   It passes the list of `pointId`s from the filtered data to the `SomaticBodyMap` for highlighting.
    *   It manages the display of the `reflectivePrompt` for a currently selected/hovered somatic point (e.g., in a tooltip or a dedicated text area).

4.  **Interaction & Display:**
    *   When a user interacts with a highlighted point on the `SomaticBodyMap`, the corresponding `reflectivePrompt` should be displayed.
    *   The `overlaySymbol` (from the data) could be conceptually used to inform the highlighting style or display a small icon near the point, but a simple color change for highlighting is sufficient for the first pass.

5.  **Code Structure & Best Practices:**
    *   Organize code logically.
    *   Ensure components are functional, use hooks, and are well-typed.
    *   Provide clear comments.

6.  **Deliverables:**
    *   All necessary TypeScript/TSX files for the components, data utilities, and types.
    *   If an SVG is generated directly in a component, that's fine. If you suggest an external SVG, provide a simple example of what it might look like and how its elements should be identifiable (e.g., by `id` attributes matching `pointId`).
    *   A brief `README.md` explaining the components, how they interact, and how to use the mock data.

**Assumptions for you to make:**
*   The `drawnCardName` and `drawnCardDecan` are available as props to the `SomaticResonanceView`.
*   Focus on the visual mapping and interaction within this self-contained view. Integration into the larger Oracle flow (e.g., how this view is toggled) is a secondary concern for this task but can be mentioned in the README.
*   Styling should be minimal; functionality is key.
```

## 8. Review & Next Steps

*   The generated code will be reviewed for functionality, clarity, and adherence to requirements.
*   The actual somatic correspondence data will need to be curated and made available (e.g., as a JSON file or via a backend API).
*   The visual design of the body map and overlays will be refined based on UI/UX feedback.
*   This feature will be integrated as an optional, enhanced view within the Oracle reading experience.