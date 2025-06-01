# AI Builder Prompt Package: Epic 2, Feature 2, Story 2 - Archetypal Embodiment: Decanically-Aligned Movement Practices

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 2 - Identity Dynamics Integration - Decanic Lifestyle
**Story:** E2_F2_S2 - Archetypal Embodiment: Decanically-Aligned Movement Practices

## 1. Context & Objective

This document outlines the requirements for an AI code generation task to implement **Story E2_F2_S2: Archetypal Embodiment**. The goal is to provide users with suggestions for elemental movement practices (e.g., yoga, tai chi, dance, archetypal gestures) tailored to current solar and lunar decans and their own elemental temperament. This aims to help users align their physical practices with supportive archetypal and elemental energies for psycho-physical balance, vitality, and conscious integration, recognizing movement as active imagination.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F2_S2_elemental_movement_practices.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (especially sections related to Identity Dynamics if available, otherwise general UI principles apply)
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management solution, existing styling solution.
*   **Backend/Data Assumptions:**
    *   User's elemental temperament (e.g., predominant fire, earth, air, water balance from Mahamaya Ground) is accessible via BPMCP.
    *   Current solar and lunar decans are accessible (similar to E2_F1_S2, via a shared astrological data service/BPMCP endpoint).
    *   A knowledge base (e.g., JSON file, dedicated API endpoint via BPMCP, potentially part of `bimba_map`) exists, mapping elements, zodiac signs, decans, and planetary rulers to movement practices, qualities, somatic focuses, and mythic gestures. This includes rationales and reflective prompts.
*   **API Interaction (Frontend Focus):**
    *   The frontend will fetch the user's elemental temperament.
    *   The frontend will fetch current solar and lunar decans.
    *   The frontend will fetch or filter the archetype-movement correspondence data.
    *   Alternatively, a dedicated backend API endpoint might synthesize this information and provide tailored suggestions.
*   **UI/UX Integration:**
    *   Movement suggestions will be displayed in a dedicated section within the user's Identity Dynamics dashboard.
    *   Suggestions should be practical, evocative, and include symbolic rationale and reflective somatic prompts.
    *   A clear disclaimer about consulting healthcare professionals must be present.

## 4. Constraints & Considerations

*   **Not Medical Advice:** Emphasize that these are psycho-somatic suggestions, not medical or exercise prescriptions.
*   **Complexity of Knowledge Base:** The quality of suggestions depends on the richness of the archetype-movement correspondence data.
*   **Personalization:** The system should clearly link suggestions to the user's temperament and current decanic influences.
*   **Tone:** Suggestions should be invitational, empowering, and respectful of individual capabilities.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F2_S2_elemental_movement_practices.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
4.  **EFDD/PRD File Content:** (Content of `efdd.md`)
5.  **Illustrative Archetype-Movement Correspondence Data (Example - could be a JSON file or API response):**
    ```json
    {
      "elementalMovements": {
        "Fire": {
          "practices": ["Dynamic yoga (e.g., Sun Salutations)", "Expressive dance", "Martial arts katas"],
          "qualities": ["Energetic", "Expansive", "Assertive", "Radiant"],
          "archetypes": ["Hero", "Warrior", "Performer"],
          "rationale": "Fire movements ignite inner power and encourage bold self-expression.",
          "prompt": "How can you embody a sense of courage and vitality in your movement today?"
        },
        "Earth": {
          "practices": ["Grounding yoga poses (e.g., Mountain Pose)", "Tai Chi", "Walking meditation"],
          "qualities": ["Stable", "Centered", "Nourishing", "Patient"],
          "archetypes": ["Great Mother", "Gardener", "Craftsperson"],
          "rationale": "Earth movements connect you to stability and the nurturing power of the present moment.",
          "prompt": "Feel the support of the earth beneath you. What sensations of stability arise?"
        },
        "Air": {
          "practices": ["Flowing Qigong", "Light, improvisational dance", "Breath-focused movements"],
          "qualities": ["Light", "Graceful", "Adaptable", "Communicative"],
          "archetypes": ["Sage", "Messenger", "Puer/Puella"],
          "rationale": "Air movements enhance mental clarity and invite a sense of freedom and perspective.",
          "prompt": "As you move, imagine a gentle breeze guiding you. What new perspectives open up?"
        },
        "Water": {
          "practices": ["Restorative yoga", "Fluid dance (e.g., 5Rhythms Flowing)", "Swimming (if applicable)"],
          "qualities": ["Fluid", "Releasing", "Intuitive", "Receptive"],
          "archetypes": ["Mystic", "Healer", "Dreamer"],
          "rationale": "Water movements encourage emotional release and connection to your intuitive depths.",
          "prompt": "Allow your movements to be like water, flowing around obstacles. What emotions are you invited to release or embrace?"
        }
      },
      "decanMovements": {
        "Aries I (Mars)": {
          "focus": "Initiating action, directness",
          "suggestion": "Short bursts of intense, focused movement. Consider warrior-like stances or dynamic stretches."
        },
        "Taurus II (Moon)": {
          "focus": "Sensual embodiment, grounding pleasure",
          "suggestion": "Slow, deliberate movements that engage the senses. Focus on the feeling of muscles and breath."
        }
        // ... more decan-specific movement suggestions or qualities
      }
    }
    ```
6.  **User Data (Illustrative - what the frontend would have or fetch):**
    ```json
    {
      "userId": "user-123",
      "elementalTemperament": {
        "fire": 40, // Percentage or relative score
        "earth": 25,
        "air": 20,
        "water": 15
      },
      "currentDecans": {
        "solarDecan": "Aries I (Mars)",
        "lunarDecan": "Taurus II (Moon)"
      }
    }
    ```

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   `DecanicMovementSuggestions` component: Fetches necessary data (temperament, decans, movement correspondences) and displays synthesized suggestions.
    *   Sub-components for individual movement suggestions, including practice type, qualities, rationale, and reflective prompts.
2.  **Data Handling & Logic:**
    *   Utility functions to fetch/access correspondence data.
    *   Logic to select/synthesize relevant movement suggestions based on the user's elemental temperament and current solar/lunar decans. This might involve suggesting practices that balance the user's temperament, or practices that align with the current decanic energies, or a combination.
3.  **State Management (if needed):**
    *   To store fetched data if not managed globally.
4.  **Type Definitions (TypeScript):**
    *   Interfaces for elemental temperament, movement correspondence data, and decan data.
5.  **Disclaimer:**
    *   A clearly visible disclaimer: "These movement suggestions are for psycho-somatic exploration and are not a substitute for professional medical or fitness advice. Please consult a healthcare professional before starting any new exercise program."
6.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining the components, data flow, how suggestions are derived, and integration points.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F2_S2, Epic 2, UI/UX Specifications, EFDD, illustrative data structures), please generate the necessary frontend code (React with TypeScript) to implement the "Archetypal Embodiment: Decanically-Aligned Movement Practices" feature.

**Key Requirements:**

1.  **Data Structures & Mock Data:**
    *   Define TypeScript interfaces for user's elemental temperament, archetype-movement correspondence data (for `elementalMovements` and `decanMovements`), and current decan data.
    *   Create mock utility functions to return sample elemental temperament, movement correspondence data, and current solar/lunar decans.

2.  **`DecanicMovementSuggestions` Component:**
    *   This component should orchestrate fetching/accessing all necessary data.
    *   Implement logic to generate personalized movement suggestions. This should consider:
        *   The user's predominant element(s) from their temperament.
        *   The elemental nature of the current solar decan.
        *   The elemental nature of the current lunar decan.
    *   The logic should aim to suggest practices that either: a) harmonize with the user's temperament while engaging with current decanic energies, or b) offer a balancing counterpoint if appropriate (e.g., grounding practices for a very fiery temperament during a fiery decan).
    *   Display suggestions clearly, perhaps grouped (e.g., "Movement for Your [Predominant Element] Nature", "Aligning with Today's Solar Decan ([Solar Decan Name])", "Connecting with Lunar Rhythms ([Lunar Decan Name])").
    *   Each suggestion should include the practice type/quality, symbolic rationale, and a reflective somatic prompt.

3.  **Display & UI:**
    *   Present information in an engaging way within a conceptual 'Identity Dynamics' section.
    *   Include the mandatory disclaimer about consulting healthcare professionals.

4.  **Code Structure & Best Practices:**
    *   Organize code logically into components, utilities, and types.
    *   Ensure components are functional, use hooks, and are well-typed.
    *   Provide clear comments.

5.  **Deliverables:**
    *   All necessary TypeScript/TSX files.
    *   A brief `README.md` explaining the component, data flow, and suggestion generation logic.

**Assumptions for you to make:**
*   Focus on the `DecanicMovementSuggestions` component and its core logic.
*   Styling should be minimal.
*   The component will be part of a larger 'Identity Dynamics' dashboard.
```

## 8. Review & Next Steps

*   Review generated code for functionality, clarity, and adherence to requirements.
*   Curate and integrate the actual archetype-movement correspondence knowledge base.
*   Finalize integration into the Identity Dynamics dashboard.
*   Consider future enhancements like linking to resource videos or allowing user feedback on suggestions.