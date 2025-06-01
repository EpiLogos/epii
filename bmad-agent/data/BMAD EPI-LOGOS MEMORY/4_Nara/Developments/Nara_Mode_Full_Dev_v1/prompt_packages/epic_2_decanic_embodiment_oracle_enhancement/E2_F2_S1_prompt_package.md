# AI Builder Prompt Package: Epic 2, Feature 2, Story 1 - Archetypal Sustenance: Decanically-Aligned Nutritional Wisdom

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 2 - Identity Dynamics Integration - Decanic Lifestyle
**Story:** E2_F2_S1 - Archetypal Sustenance: Decanically-Aligned Nutritional Wisdom

## 1. Context & Objective

This document outlines the requirements for an AI code generation task to implement **Story E2_F2_S1: Archetypal Sustenance**. The goal is to provide users with decanically-informed nutrition suggestions based on their natal Venus placement and current significant decanic influences. This aims to help users align their dietary choices with supportive archetypal energies for holistic well-being and pleasure, integrating this into their Identity Dynamics.

This story connects the user's personal archetypal makeup (Identity Dynamics) with practical lifestyle suggestions (Decanic Lifestyle), drawing on astrological and symbolic correspondences.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F2_S1_decanic_nutrition_plans.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (especially sections related to Identity Dynamics if available, otherwise general UI principles apply)
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management solution, existing styling solution.
*   **Backend/Data Assumptions:**
    *   User's natal Venus sign and decan are accessible (e.g., via BPMCP from Mahamaya Ground).
    *   Current significant decanic influences (Sun's decan, Moon's decan, other major transits) are accessible (similar to E2_F1_S2, potentially via a shared astrological data service/BPMCP endpoint).
    *   A knowledge base (e.g., JSON file, dedicated API endpoint via BPMCP) exists, mapping zodiac signs, decans, and planetary rulers to food types, herbs, spices, dietary principles, and their symbolic/energetic qualities. This knowledge base will also contain rationales and reflective prompts.
*   **API Interaction (Frontend Focus):**
    *   The frontend will need to fetch the user's natal Venus data.
    *   The frontend will need to fetch current decanic influences.
    *   The frontend will need to fetch or filter the archetypal nourishment correspondences based on the user's Venus and current decans.
    *   Alternatively, a dedicated backend API endpoint might synthesize this information and provide tailored suggestions to the frontend.
*   **UI/UX Integration:**
    *   Nutrition suggestions will be displayed in a dedicated section within the user's Identity Dynamics dashboard.
    *   Suggestions should be practical, actionable, and include symbolic rationale and reflective prompts.
    *   A clear disclaimer that this is not medical advice must be present.

## 4. Constraints & Considerations

*   **Not Medical Advice:** Emphasize that these are symbolic/energetic suggestions, not medical or dietary prescriptions.
*   **Complexity of Knowledge Base:** The quality of suggestions depends heavily on the richness and nuance of the archetype-nourishment correspondence data.
*   **Personalization:** The system should clearly link suggestions to the user's natal Venus and current influences.
*   **Tone:** Suggestions should be invitational and empowering.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F2_S1_decanic_nutrition_plans.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
4.  **EFDD/PRD File Content:** (Content of `efdd.md`)
5.  **Illustrative Archetype-Nourishment Correspondence Data (Example - could be a JSON file or API response):**
    ```json
    {
      "decanCorrespondences": {
        "Aries I (Mars)": {
          "foods": ["Spicy foods", "Red lentils", "Ginger", "Garlic"],
          "principles": ["Energizing meals", "Support for initiative"],
          "rationale": "Mars-ruled Aries I supports dynamic energy. These foods can help fuel action and assertiveness.",
          "prompt": "How can your food choices this week support your active projects or intentions?"
        },
        "Taurus II (Moon)": {
          "foods": ["Root vegetables", "Dairy products (if tolerated)", "Oats", "Pears"],
          "principles": ["Comforting and grounding meals", "Nourishing the senses"],
          "rationale": "The Moon in Taurus II emphasizes sensual nourishment and emotional security. These foods can be grounding and comforting.",
          "prompt": "What foods make you feel truly nurtured and connected to your body?"
        }
        // ... more decan correspondences
      },
      "venusPlacements": {
        "Venus in Libra": {
          "foods": ["Balanced meals", "Artistically presented food", "Apples", "Almonds"],
          "principles": ["Harmony in flavors and textures", "Social dining"],
          "rationale": "Venus in Libra seeks balance, beauty, and harmony. Dietary choices can reflect these values.",
          "prompt": "How can you bring more beauty and balance to your meals this week?"
        },
        "Venus in Scorpio": {
          "foods": ["Dark berries", "Mushrooms", "Pomegranate", "Foods with intense flavors"],
          "principles": ["Transformative and deeply nourishing foods", "Exploring depth of flavor"],
          "rationale": "Venus in Scorpio values depth and transformation. Foods with intense or complex flavors can resonate.",
          "prompt": "What dietary choices might support your deeper emotional processing or transformation currently?"
        }
        // ... more Venus placement correspondences
      }
    }
    ```
6.  **User Data (Illustrative - what the frontend would have or fetch):**
    ```json
    {
      "userId": "user-123",
      "natalVenus": {
        "sign": "Libra",
        "decan": "Libra I (Venus)" // Example
      },
      "currentDecanicInfluences": {
        "sunDecan": "Aries I (Mars)",
        "moonDecan": "Taurus II (Moon)"
        // ... other relevant transits if used by the logic
      }
    }
    ```

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   `DecanicNutritionSuggestions` component: This component will be responsible for fetching necessary data (user's Venus, current decans, nourishment correspondences) and displaying the synthesized suggestions.
    *   Sub-components for displaying individual suggestions, including food items, principles, rationale, and reflective prompts.
2.  **Data Handling & Logic:**
    *   Utility functions to fetch/access the archetype-nourishment correspondence data.
    *   Logic to select relevant suggestions based on the user's natal Venus and current decanic influences.
    *   This might involve combining suggestions from the user's Venus placement with suggestions for the current Sun and/or Moon decan.
3.  **State Management (if needed):**
    *   To store fetched correspondence data, user data, and current decanic influences if not already managed globally.
4.  **Type Definitions (TypeScript):**
    *   Interfaces for the nourishment correspondence data structure, user data, and decanic influences.
5.  **Disclaimer:**
    *   A clearly visible disclaimer stating that the suggestions are for informational and reflective purposes only and do not constitute medical or dietary advice.
6.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining the components, data flow, how suggestions are derived, and integration into the Identity Dynamics dashboard.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F2_S1, Epic 2, UI/UX Specifications, EFDD, illustrative data structures), please generate the necessary frontend code (React with TypeScript) to implement the "Archetypal Sustenance: Decanically-Aligned Nutritional Wisdom" feature.

**Key Requirements:**

1.  **Data Structures & Mock Data:**
    *   Define TypeScript interfaces for the archetype-nourishment correspondence data (for `decanCorrespondences` and `venusPlacements` as shown in the example), user's natal Venus, and current decanic influences.
    *   Create a mock utility function that returns a sample of the archetype-nourishment correspondence data.
    *   Assume functions exist or create mock functions to get the user's natal Venus data and current decanic influences (Sun decan, Moon decan).

2.  **`DecanicNutritionSuggestions` Component:**
    *   This component should orchestrate the fetching of all necessary data (user Venus, current decans, correspondence data).
    *   It should then implement logic to select relevant nutritional suggestions:
        *   One set of suggestions based on the user's natal Venus placement.
        *   Another set of suggestions based on the current Sun's decan.
        *   (Optional) A third set for the current Moon's decan.
    *   Display these suggestions clearly, grouped by their source (e.g., "For Your Natal Venus in [Sign]", "Aligning with the Current Sun in [Decan]").
    *   Each suggestion group should list recommended foods, dietary principles, the symbolic rationale, and a reflective prompt.

3.  **Display & UI:**
    *   Present the information in a readable and engaging way within a conceptual 'Identity Dynamics' section.
    *   Include a prominent disclaimer: "These suggestions are for archetypal reflection and inspiration, not medical or dietary advice. Please consult with a qualified healthcare professional for any health concerns or before making any changes to your diet."

4.  **Code Structure & Best Practices:**
    *   Organize code logically.
    *   Ensure components are functional, use hooks, and are well-typed.
    *   Provide clear comments.

5.  **Deliverables:**
    *   All necessary TypeScript/TSX files for the component(s), data utilities, and types.
    *   A brief `README.md` explaining the component, data flow, and how suggestions are generated.

**Assumptions for you to make:**
*   The primary focus is on the `DecanicNutritionSuggestions` component and its logic for selecting and displaying information based on the provided data structures.
*   Styling should be minimal; functionality and clarity are key.
*   The component will be placed within a larger 'Identity Dynamics' dashboard page.
```

## 8. Review & Next Steps

*   The generated code will be reviewed for functionality, clarity, and adherence to requirements.
*   The actual archetype-nourishment correspondence data will need to be curated and made available.
*   Integration into the Identity Dynamics dashboard will be finalized.
*   Consideration for user preferences or dietary restrictions could be a future enhancement.