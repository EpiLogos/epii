# AI Builder Prompt Package: E3_F2_S3 - Dynamic Symbolic Metabolism & Alchemical Phase Detection

## 1. Core Context & Objective

**Project:** Nara - An AI-augmented platform for self-discovery and individuation, integrating Tarot, Astrology, Jungian Psychology, and Saivist Philosophy.
**Epic:** 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** F2 - Journal Synthesis Engine - The Alchemical Retort
**User Story:** E3_F2_S3 - Dynamic Symbolic Metabolism & Alchemical Phase Detection (Jungian & Saivist Informed)

**Objective of this Story:** To empower the Journal Synthesis Engine to identify potential alchemical phases (e.g., Nigredo, Albedo) in user journal entries, reflecting stages of psychological transformation and the play of consciousness (Spanda). Additionally, to introduce an "Archetypal Composting" feature, allowing users to revisit and transmute themes from older entries into new, potent forms (mantras, ritual templates), thereby fostering a dynamic engagement with their symbolic material and recognizing divine creativity (Pratibha).

## 2. Story Definition (from `story_E3_F2_S3.md`)

**As a** User engaging in reflective journaling as part of my individuation journey and seeking to witness the divine alchemy (Shiva-Shakti lila) within my experiences,
**I want** Nara's Journal Synthesis Engine to use NLP algorithms to identify potential alchemical phases (e.g., Nigredo, Albedo) evident in my writing – recognizing these as stages in the psyche's transformation and the dance of consciousness (Spanda) – and to offer an "Archetypal Composting" feature where themes from older entries can be revisited and transmuted into new forms (e.g., personalized mantras, ritual templates), reflecting the ever-present divine creativity (Pratibha),
**So that** my journal becomes a dynamic space for symbolic metabolism and active imagination, helping me recognize and navigate my psychological processes, creatively repurpose past insights for ongoing growth, and deepen my recognition of the Self (Atman) manifesting through these transformations.

**Key Acceptance Criteria Highlights:**

*   **Alchemical Phase Detection:** Extend NLP (from E3_F2_S1) to identify cues for Nigredo, Albedo (and potentially Citrinitas, Rubedo) based on keywords, emotional tone, and themes, understanding these as individuation stages and cosmic rhythms.
*   **Phase-Specific Suggestions:** Offer relevant Oracle spreads, Alchemical Visionary Sequences (from E3_F1_S2), or other practices suitable for the detected phase.
*   **Archetypal Composting:**
    *   Identify key insights, affirmations, or symbolic statements from past entries.
    *   Provide tools/guidance to transmute these into personalized mantras, ritual/contemplative templates, or dream/visualization prompts.
*   **UI Integration:** Subtly indicate detected phases; make Archetypal Composting accessible.
*   **User Control:** Allow dismissal of suggestions and full control over composting.
*   **Longitudinal Tracking (Optional):** Show journey through alchemical phases over time.

## 3. Technical Context & Design Considerations

*   **System Component:** Primarily backend logic extending E3_F2_S1, with significant UI components for the Archetypal Composting feature and display of phase information.
*   **Building on E3_F2_S1:** Assumes foundational NLP capabilities for keyword extraction, sentiment analysis, and theme identification are in place.
*   **Alchemical Phase Model:** Requires a defined model of alchemical phases (Nigredo, Albedo, etc.) with associated keywords, emotional profiles, symbolic imagery, and typical experiences. This model will inform the NLP rules or classifiers.
    *   **Nigredo:** Keywords like "darkness," "loss," "confusion," "stuck," "shadow," "despair," "dissolution." Negative sentiment, themes of confrontation.
    *   **Albedo:** Keywords like "clarity," "insight," "dawn," "purification," "hope," "reflection." Positive or neutral sentiment, themes of new understanding, peace.
*   **NLP for Phase Detection:** This could involve:
    *   Rule-based systems checking for keyword clusters and sentiment patterns.
    *   Text classification models trained on examples of writing indicative of each phase.
    *   Analyzing the *sequence* of themes or emotions across recent entries.
*   **Archetypal Composting - Backend:**
    *   Ability to search and retrieve past journal entries based on user selection, date ranges, or previously identified themes/keywords (from E3_F2_S1).
    *   NLP to extract salient sentences, phrases, or affirmations from these selected entries (e.g., using summarization techniques, or identifying sentences with strong positive sentiment or key symbolic terms).
*   **Archetypal Composting - Frontend/UI:**
    *   Interface for users to select past entries or themes for composting.
    *   Display extracted elements (quotes, insights).
    *   Provide templates or guided steps for transformation (e.g., a mantra creation wizard: "Take this insight: '[User's quote]' and rephrase it as a short, present-tense affirmation.").
    *   Allow users to save their transmuted creations (e.g., in a personal "Book of Shadows" or "Alchemical Formulas" section).
*   **Saivist Lens:** Frame alchemical phases as part of the cosmic dance (Lila) of Shiva-Shakti, where dissolution (Nigredo) is as divine as creation (Albedo). Archetypal Composting is an act of co-creation, tapping into Pratibha (divine creative intuition) and recognizing the power of Shabda (sacred sound) in mantras.

## 4. Constraints & Challenges

*   **Defining Alchemical Phases Textually:** Accurately mapping complex psychological states to textual cues is challenging.
*   **Subjectivity of Phases:** User experience of these phases is highly personal.
*   **Avoiding Prescriptiveness:** Suggestions should be gentle and invitational, not diagnostic.
*   **UI for Composting:** Needs to be intuitive and empowering, not just a text editor.
*   **Scope of Past Entry Analysis:** Efficiently searching and processing potentially large journal histories.

## 5. Inputs for AI Builder (You, the Generative AI)

1.  **This Document (E3_F2_S3_prompt_package.md):** Provides overall context and requirements.
2.  **User Story File:** `story_E3_F2_S3_dynamic_symbolic_metabolism_phase_detection.md` (content provided above).
3.  **Outputs from E3_F2_S1 (Conceptual):** Assume access to structured data from journal entries, including identified themes, keywords, emotional resonances, and symbolic patterns.
4.  **Outputs from E3_F1_S2 (Conceptual):** A list of available Alchemical Visionary Sequences and their thematic relevance.
5.  **Illustrative Alchemical Phase Model (Simplified):**
    ```json
    {
      "alchemicalPhases": [
        {
          "name": "Nigredo",
          "description": "Descent, dissolution, confronting the shadow.",
          "keywords": ["dark", "loss", "chaos", "stuck", "despair", "shadow", "empty", "confused"],
          "emotionalProfile": ["sadness", "fear", "anger", "frustration"],
          "themes": ["confrontation", "letting go", "dissolution"],
          "saivistInterpretation": "The necessary embrace of Tamas, the void from which all arises; Shiva as Bhairava."
        },
        {
          "name": "Albedo",
          "description": "Purification, illumination, dawning awareness.",
          "keywords": ["clear", "light", "insight", "peace", "hope", "new beginning", "reflect"],
          "emotionalProfile": ["calm", "hopeful", "serene", "grateful"],
          "themes": ["clarity", "purification", "integration"],
          "saivistInterpretation": "Emergence of Sattva, the luminosity of pure consciousness (Prakasha); Shakti revealing Herself."
        }
        // Potentially Citrinitas, Rubedo with similar structures
      ]
    }
    ```
6.  **Illustrative Archetypal Composting Input/Output:**
    *   **Input (User selects an old entry snippet):** "I finally understood that my fear was just a call for more love."
    *   **Output (User-guided transformation into a mantra):** "My fear is a call for love. I meet fear with love."
    *   **Output (Transformed into a ritual step):** "Light a candle. Acknowledge any fear present. Affirm: 'I meet this with love.'"

## 6. Expected Outputs from AI Builder (You)

1.  **Alchemical Phase Detection Logic (Pseudocode/High-Level Description):**
    *   How to use the Alchemical Phase Model and NLP outputs (from E3_F2_S1) to identify potential phases in current or recent journal entries.
    *   Consider scoring or confidence levels for detected phases.
2.  **Phase-Specific Suggestion Engine Logic:**
    *   Rules or logic for recommending Oracle spreads or Alchemical Visionary Sequences based on the detected phase and its characteristics.
3.  **Archetypal Composting - Backend Design:**
    *   Logic for retrieving and processing past journal entries for composting.
    *   Techniques for extracting key insights/affirmations from selected text.
4.  **Archetypal Composting - Frontend Conceptual Design & Workflow:**
    *   Describe the user experience for selecting material, viewing extracted insights, and using tools/templates to transmute them (e.g., into mantras, ritual steps).
    *   Suggest UI elements for this feature.
5.  **Data Models (JSON Schema or similar):**
    *   For storing detected alchemical phase information associated with an entry.
    *   For storing user-created "composted" artifacts (mantras, ritual templates).
6.  **Key Function/Module Definitions (Python-like Pseudocode):**
    *   `def detect_alchemical_phase(journal_entry_data: dict, phase_model: dict) -> dict:`
    *   `def suggest_practices_for_phase(phase_name: str, available_practices: list) -> list:`
    *   `def extract_compostable_elements(journal_texts: list[str]) -> list[str]:`
    *   `def guide_mantra_creation(text_snippet: str) -> str:` (conceptual for UI interaction)
7.  **Saivist Philosophy Integration:**
    *   How to weave Saivist interpretations into the descriptions of phases and the purpose of composting (e.g., framing Nigredo as Shiva's destructive grace, composting as engaging with Pratibha).
8.  **UI Mockup Ideas/Sketches (Descriptive):** For how detected phases and the composting feature might appear.
9.  **Documentation Snippets:** Key comments for the proposed logic.

## 7. AI Builder Prompt

"Okay, Nara AI Builder, based on User Story E3_F2_S3, design the 'Dynamic Symbolic Metabolism & Alchemical Phase Detection' system. This involves identifying alchemical phases (Nigredo, Albedo, etc.) in journal entries and implementing an 'Archetypal Composting' feature to transmute past insights into new forms like mantras or ritual templates.

Please provide:

1.  **Alchemical Phase Detection Logic:** How to identify phases using NLP and a phase model.
2.  **Phase-Specific Suggestion Logic:** How to recommend practices based on detected phases.
3.  **Archetypal Composting - Backend Design:** Logic for retrieving and processing past entries for composting.
4.  **Archetypal Composting - Frontend Conceptual Design & Workflow:** User experience and UI ideas for the composting process.
5.  **Data Models:** For detected phases and composted artifacts.
6.  **Key Function Definitions (Python-like Pseudocode).**
7.  **Saivist Philosophy Integration:** How to frame these features through a Saivist lens.
8.  **Descriptive UI Mockup Ideas.**
9.  **Key Documentation Snippets.**

Emphasize the dynamic and transformative potential of the journal, supporting the user's individuation journey by recognizing psychological patterns as alchemical stages and fostering creative reuse of their own wisdom, all within the project's Jungian and Saivist framework."