# AI Builder Prompt Package: Epic 2, Feature 2, Story 3 - Pranic Resonance & Archetypal Attunement Practices

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 2 - Identity Dynamics Integration - Decanic Lifestyle
**Story:** E2_F2_S3 - Pranic Resonance & Archetypal Attunement Practices (Jungian & Saivist Informed)

## 1. Context & Objective

This document outlines requirements for an AI code generation task to implement **Story E2_F2_S3: Pranic Resonance & Archetypal Attunement Practices**. The goal is to provide users with targeted practice suggestions (meditations, breathwork, affirmations, subtle body visualizations) for archetypal and energetic attunement. These suggestions will be based on `bimba_map` relationships between pranic channels/chakras (as symbolic psychic energy centers) and currently active decans, fostering psycho-energetic integration and recognizing the body as a field of consciousness (Spanda).

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F2_S3_pranic_system_decan_practices.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (Identity Dynamics section)
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`
*   **Bimba Map Concept:** (Reference relevant `bimba_map` documentation if available, e.g., from E1_F2_S2)

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management, existing styling.
*   **Backend/Data Assumptions:**
    *   `bimba_map` data is accessible (e.g., via BPMCP API or a local data store). This map contains correspondences between decans, planets, signs, and pranic systems (chakras as psychic centers, nadis as energy pathways), informed by traditional sources and Jungian symbolic associations.
    *   Currently active/significant decans (solar, lunar, potent transits) are accessible (similar to E2_F1_S2).
    *   A library of practice content (meditations, breathwork, affirmations, visualizations descriptions, potentially links to audio/video guides) exists and is tagged or mappable to `bimba_map` entities (decan archetypes, chakras, pranic channels).
*   **API Interaction (Frontend Focus):**
    *   Fetch current active decans.
    *   Query `bimba_map` for correspondences related to these decans (associated chakras, nadis, archetypal themes).
    *   Fetch relevant practice suggestions from the practice library based on these correspondences.
    *   Alternatively, a dedicated backend API endpoint synthesizes this information.
*   **UI/UX Integration:**
    *   Suggestions displayed in a dedicated section of the Identity Dynamics dashboard.
    *   Clear, easy-to-follow instructions, symbolic rationale, and reflective prompts.
    *   Disclaimer: not medical/psychological treatment.

## 4. Constraints & Considerations

*   **Depth of `bimba_map`:** Quality depends on the richness of `bimba_map` correspondences.
*   **Practice Library:** A comprehensive and well-organized library of practices is crucial.
*   **Safety & Appropriateness:** Practices must be generally safe. Complex techniques need clear warnings or prerequisites.
*   **Tone:** Invitational, non-prescriptive, respectful of user's journey.
*   **Philosophical Nuance:** Subtly weave in Jungian psychological interpretations and hints of Saivist perspectives on consciousness without being overly academic or dogmatic.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F2_S3_pranic_system_decan_practices.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
4.  **EFDD/PRD File Content:** (Content of `efdd.md`)
5.  **Illustrative `bimba_map` Snippet (Conceptual - how decans might link to chakras/practices):**
    ```json
    {
      "decanCorrespondences": {
        "Leo I (Sun)": {
          "archetypalTheme": "Radiant Self-Expression, Creative Power",
          "associatedChakra": "Manipura (Solar Plexus)",
          "chakraSymbolism": "Personal power, will, vitality, self-esteem",
          "pranicChannels": ["Pingala Nadi"],
          "suggestedPracticeCategories": ["Vitality Meditation", "Confidence Affirmation", "Solar Plexus Breathwork"]
        },
        "Cancer III (Jupiter/Pisces)": {
          "archetypalTheme": "Compassionate Wisdom, Emotional Depth, Spiritual Nurturing",
          "associatedChakra": "Anahata (Heart Center)",
          "chakraSymbolism": "Love, compassion, empathy, connection",
          "pranicChannels": ["Sushumna Nadi (related to heart-mind integration)"],
          "suggestedPracticeCategories": ["Loving-Kindness Meditation", "Heart-Opening Visualization", "Gentle Heart-Centered Breathwork"]
        }
        // ... more decan to subtle body correspondences
      }
    }
    ```
6.  **Illustrative Practice Library Snippet (Conceptual - how practices are defined):**
    ```json
    {
      "practices": {
        "Vitality Meditation": {
          "category": "Vitality Meditation",
          "title": "Sun-Charged Vitality Meditation",
          "description": "A guided meditation to connect with the radiant energy of the sun within your solar plexus, enhancing vitality and confidence.",
          "instructions": "Sit comfortably... visualize a golden sun at your solar plexus... breathe into this light...",
          "duration": "10-15 minutes",
          "reflectivePrompt": "What sensations of energy or empowerment did you notice?"
        },
        "Loving-Kindness Meditation": {
          "category": "Loving-Kindness Meditation",
          "title": "Cultivating Compassion: Loving-Kindness Practice",
          "description": "Extend feelings of warmth, kindness, and compassion towards yourself and others.",
          "instructions": "Begin by offering loving-kindness to yourself... then to loved ones... then to neutral persons... then to difficult persons... and finally to all beings.",
          "duration": "15-20 minutes",
          "reflectivePrompt": "How did your heart-space feel as you extended these wishes?"
        }
        // ... more practices
      }
    }
    ```
7.  **User Data (Illustrative - current active decans):**
    ```json
    {
      "currentActiveDecans": {
        "solarDecan": "Leo I (Sun)",
        "lunarDecan": "Cancer III (Jupiter/Pisces)"
        // Potentially other significant transiting decans
      }
    }
    ```

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   `PranicAttunementPractices` component: Fetches active decans, queries `bimba_map` (mocked), retrieves corresponding practice categories, and then fetches/displays specific practices from a practice library (mocked).
    *   Sub-components for displaying individual practice suggestions (title, description, instructions, rationale, reflective prompt).
2.  **Data Handling & Logic:**
    *   Mock utility functions to simulate: fetching active decans, querying `bimba_map` for decan-chakra/pranic channel-archetype links, and fetching practices from a library based on categories derived from `bimba_map`.
    *   Logic to select and present relevant practices based on the active decans and their `bimba_map` associations.
3.  **State Management (if needed):** For fetched data.
4.  **Type Definitions (TypeScript):** For `bimba_map` snippets, practice library structure, active decan data.
5.  **Disclaimer:** Prominent disclaimer about practices not being medical/psychological treatment.
6.  **Explanation & Documentation:** Comments and a brief markdown explaining components, data flow, and logic.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F2_S3, Epic 2, UI/UX Specs, EFDD, illustrative data structures for `bimba_map` and a practice library), generate frontend code (React with TypeScript) for the "Pranic Resonance & Archetypal Attunement Practices" feature.

**Key Requirements:**

1.  **Data Structures & Mock Data:**
    *   Define TypeScript interfaces for: active decan data, a conceptual `bimba_map` snippet linking decans to chakras/archetypes/practice categories, and a practice library structure.
    *   Create mock utility functions: `getActiveDecans()`, `queryBimbaMap(decanName)` (returns associated chakra, archetypal theme, practice categories), and `getPracticesByCategory(categoryName)` (returns a list of practices).

2.  **`PranicAttunementPractices` Component:**
    *   Fetch active solar and lunar decans.
    *   For each active decan, query the (mocked) `bimba_map` to get its associated archetypal theme, chakra/pranic focus, and suggested practice categories.
    *   For each practice category identified, fetch 1-2 sample practices from the (mocked) practice library.
    *   Display these practices, grouped by the decan they relate to (e.g., "Attunement for Solar Decan: [Decan Name]").
    *   Each practice should show its title, description, a brief symbolic rationale linking it to the decan's archetypal theme/chakra, and a reflective prompt.

3.  **Display & UI:**
    *   Present information clearly within a conceptual 'Identity Dynamics' section.
    *   Include the mandatory disclaimer.

4.  **Code Structure & Best Practices:**
    *   Logical organization, functional components, hooks, TypeScript types.
    *   Clear comments.

5.  **Deliverables:**
    *   All necessary TypeScript/TSX files.
    *   A brief `README.md` explaining the component, data flow, and suggestion logic.

**Assumptions:**
*   Focus on the `PranicAttunementPractices` component and its interaction with mocked data services.
*   Minimal styling.
*   Integration within a larger 'Identity Dynamics' dashboard.
```

## 8. Review & Next Steps

*   Review generated code for functionality and clarity.
*   Develop the actual `bimba_map` with detailed pranic correspondences.
*   Curate the comprehensive library of practices with appropriate tagging.
*   Finalize UI/UX and integration.
*   Consider user education modules on pranic systems from a Jungian/Saivist symbolic perspective.