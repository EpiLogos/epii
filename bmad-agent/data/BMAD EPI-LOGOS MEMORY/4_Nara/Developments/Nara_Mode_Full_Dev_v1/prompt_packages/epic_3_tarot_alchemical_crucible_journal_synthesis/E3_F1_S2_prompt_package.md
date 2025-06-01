# AI Builder Prompt Package: Epic 3, Feature 1, Story 2 - Alchemical Visionary Sequences

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** Feature 1 - Advanced Oracle Reading Modes - The Alchemical Catalyst
**Story:** E3_F1_S2 - Alchemical Visionary Sequences from Card Interpretations (Jungian & Saivist Informed)

## 1. Context & Objective

This document outlines requirements for an AI code generation task to implement **Story E3_F1_S2: Alchemical Visionary Sequences from Card Interpretations**. The goal is to develop a feature that transforms Tarot card interpretations into guided, embodied practices. These "Alchemical Visionary Sequences" (e.g., elemental meditations, planetary embodiment exercises, suggestive mantras) aim to help users move beyond intellectual understanding to a bodily resonant experience of archetypal energies and transformative processes, framed by Jungian alchemy and Kashmir Saivism's understanding of consciousness (Cit-Shakti Vilasa, Spanda).

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_3_tarot_alchemical_crucible_journal_synthesis/story_E3_F1_S2_alchemical_visionary_sequences.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-3.md` (or summary)
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md` (especially Oracle section, and any new UI for guided practices).
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`
*   **`bimba_map`:** May contain mappings from cards/symbols to alchemical stages, elements, planets, and practices.

## 3. Technical Context & Assumptions

*   **Content-Heavy:** Requires a library of guided practice content (textual, potentially audio).
*   **Backend Logic:** For mapping cards to practices and managing practice content.
*   **Frontend:** UI for selecting and engaging with guided practices, potentially with audio playback.
*   **Existing Oracle Engine:** Builds upon existing card interpretation features.

## 4. Constraints & Considerations

*   **Practice Mapping:** The logic linking Tarot cards to specific alchemical stages (Nigredo, Albedo, etc.) and embodied practices needs to be well-defined and psychologically sound from a Jungian perspective.
*   **Content Quality:** Guided sequences must be clear, safe, engaging, and appropriately framed within psychological exploration and the recognition of consciousness, avoiding prescriptive or overly esoteric language.
*   **User Experience:** The transition from card interpretation to guided practice should be seamless and invitational.
*   **Safety:** Practices should be gentle and emphasize user well-being and self-awareness.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E3_F1_S2_alchemical_visionary_sequences.md`)
2.  **Epic Definition File Content:** (Content of `epic-3.md` - or summary)
3.  **Illustrative Card-to-Practice Mapping Logic & Content Examples:**
    *   **Mapping Concept:** Describe how a few example cards might map to alchemical stages and practice types.
        *   *Example Card 1: The Tower*
            *   **Alchemical Stage:** Nigredo (Dissolution, Confronting Shadow)
            *   **Practice Type:** Grounding meditation, somatic release practice.
            *   **Practice Theme:** Safely acknowledging and witnessing disruptive energy, finding stability amidst chaos.
        *   *Example Card 2: The Star*
            *   **Alchemical Stage:** Albedo (Purification, Hope, Illumination)
            *   **Practice Type:** Visualization of light, heart-opening meditation.
            *   **Practice Theme:** Connecting with inner guidance, cultivating hope and clarity.
        *   *Example Card 3: The Empress (Venusian Archetype)*
            *   **Archetypal Resonance:** Anima, Creative Flow, Embodied Nurturing
            *   **Practice Type:** Sensory awareness practice, gentle movement, affirmation for self-care.
            *   **Practice Theme:** Embracing receptivity, creativity, and connection to the body's wisdom.
    *   **Sample Guided Practice Snippet (Textual - for The Tower/Nigredo):**
        "*Find a comfortable, stable position. Close your eyes if you wish. Bring your awareness to your breath... Notice any sensations of turbulence or intensity within, like the energy of the Tower card. Acknowledge these feelings without judgment, as if observing a storm from a safe shelter. This is the Nigredo, the descent into darkness where old structures crumble to make way for new growth. Feel the support of the earth beneath you, a constant presence. With each exhale, imagine releasing any tension held from this disruptive energy. This practice is an invitation to witness this transformative process with courage and self-compassion, recognizing even in chaos the dynamic play of consciousness seeking renewal...*"
4.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md` relevant to Oracle and guided practices)
5.  **EFDD/PRD File Content:** (Content of `efdd.md`)

## 6. Expected Outputs from AI Code Generation

1.  **Backend Logic (Conceptual Pseudocode/High-Level Design for Node.js/Python or similar):**
    *   **Practice Mapping Module:**
        *   Data structure to store mappings from Tarot cards (or their key attributes like element, planet, archetype, alchemical stage association) to specific `AlchemicalVisionarySequence` IDs.
        *   Function to retrieve relevant sequence(s) for a given card (e.g., `getSequencesForCard(cardId, cardAttributes)`).
    *   **Content Management Module:**
        *   Data structure for `AlchemicalVisionarySequence` (ID, title, description, type [meditation, mantra, embodiment], textual content, optional audio file link, associated alchemical stage/archetype).
        *   Function to retrieve sequence content by ID.
2.  **API Endpoint Definitions (Conceptual):**
    *   `GET /api/oracle/sequences?cardId={cardId}`: Returns a list of available Alchemical Visionary Sequences for a given card.
    *   `GET /api/sequences/{sequenceId}`: Returns the detailed content for a specific sequence.
3.  **Frontend Components (React/TypeScript):**
    *   `SequenceSelector`: Component displayed after card interpretation, offering relevant sequences.
    *   `GuidedPracticePlayer`: Component to display textual instructions, manage audio playback (if applicable), and provide a calm interface for the practice.
    *   Logic to fetch sequence options and content from the backend.
    *   Button/prompt to navigate to journaling after practice completion.
4.  **Type Definitions (TypeScript):**
    *   Interfaces for `CardPracticeMapping`, `AlchemicalVisionarySequence`.
5.  **Sample Content (Textual):**
    *   Text for 1-2 complete Alchemical Visionary Sequences based on the examples (e.g., for The Tower and The Star), including brief Jungian/Saivist framing.
6.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining:
        *   The conceptual logic for card-to-practice mapping.
        *   How sequence content is managed and retrieved.
        *   The frontend component hierarchy for selecting and engaging with practices.
        *   API interactions.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E3_F1_S2, Epic 3 themes, illustrative card-to-practice mappings, sample guided practice content, UI/UX specs, and EFDD), please generate the necessary backend logic design (conceptual pseudocode/high-level design), API endpoint definitions, frontend components (React with TypeScript), type definitions, and sample textual content for the "Alchemical Visionary Sequences" feature.

**Key Requirements:**

1.  **Card-to-Practice Mapping & Content Management (Backend Design):**
    *   Define TypeScript interfaces: `AlchemicalVisionarySequence` (including `id`, `title`, `description`, `type: 'meditation' | 'mantra' | 'embodiment'`, `alchemicalStage?: string`, `archetypalTheme?: string`, `textContent: string`, `audioUrl?: string`) and `CardPracticeMapping` (`cardNameOrId: string`, `sequenceIds: string[]`).
    *   Outline conceptual functions (pseudocode for Node.js/Python):
        *   `getSequencesForCard(cardNameOrId, allMappings)`: Returns an array of `sequenceIds` for a card.
        *   `getSequenceContent(sequenceId, allSequences)`: Returns an `AlchemicalVisionarySequence` object.
    *   Create sample arrays for `allMappings` (linking 2-3 cards to sequence IDs) and `allSequences` (containing 2-3 full sequence objects with textual content based on the provided examples).

2.  **API Endpoints (Conceptual Definition):**
    *   `GET /api/oracle/sequences?cardNameOrId={cardNameOrId}`: Response: Array of `AlchemicalVisionarySequence` (summary: id, title, description, type).
    *   `GET /api/sequences/{sequenceId}`: Response: Full `AlchemicalVisionarySequence` object.

3.  **Frontend Components (React/TypeScript):**
    *   `SequenceSelector`: Takes a `cardNameOrId` prop. Fetches (mocked) sequence options from `/api/oracle/sequences`. Displays a list of sequences (title, description). Clicking one sets a selected sequence ID.
    *   `GuidedPracticePlayer`: Takes a `sequenceId` prop. If `sequenceId` is set, fetches (mocked) full sequence content from `/api/sequences/{sequenceId}`. Displays `textContent`. If `audioUrl` exists, shows conceptual audio player controls (play/pause buttons - no actual audio implementation needed). Includes a "Go to Journal" button.

4.  **Sample Textual Content:**
    *   Provide the full `textContent` for two `AlchemicalVisionarySequence` objects (e.g., one for a 'Nigredo' themed card like The Tower, and one for an 'Albedo' themed card like The Star), including the Jungian/Saivist framing as described in the story.

5.  **Type Definitions:**
    *   Provide all necessary TypeScript interfaces.

6.  **Deliverables:**
    *   Backend design/pseudocode.
    *   API endpoint definitions.
    *   TypeScript/TSX files for frontend components and types.
    *   The sample textual content for two sequences.
    *   A brief `README.md` explaining the architecture, data flow, and component interactions.

**Assumptions for you to make:**
*   Focus on the system structure, data flow, and UI for practice engagement.
*   Actual audio implementation is out of scope; represent with UI placeholders.
*   Styling should be minimal.
```

## 8. Review & Next Steps

*   Review generated designs and code for logical coherence and adherence to requirements.
*   Develop a comprehensive library of Alchemical Visionary Sequences with high-quality textual and (potentially) audio content.
*   Refine the card-to-practice mapping logic with deep Jungian and Saivist considerations.
*   Build out the full backend and frontend functionality.
*   Thoroughly test for user experience, safety, and clarity.
*   Integrate with the journaling feature.