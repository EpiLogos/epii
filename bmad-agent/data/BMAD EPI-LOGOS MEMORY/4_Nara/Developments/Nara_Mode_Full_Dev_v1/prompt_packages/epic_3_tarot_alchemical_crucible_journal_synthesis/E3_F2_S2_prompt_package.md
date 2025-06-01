# AI Builder Prompt Package: E3_F2_S2 - Journal Imagery Analysis (Dreams, Meditations, Synchronicities)

## 1. Core Context & Objective

**Project:** Nara - An AI-augmented platform for self-discovery and individuation, integrating Tarot, Astrology, Jungian Psychology, and Saivist Philosophy.
**Epic:** 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** F2 - Journal Synthesis Engine - The Alchemical Retort
**User Story:** E3_F2_S2 - Journal Imagery Analysis (Dreams, Meditations, Synchronicities) (Jungian & Saivist Informed)

**Objective of this Story:** To enhance the Journal Synthesis Engine by enabling it to analyze and interpret imagery reported by the user in their journal entries (from dreams, active imagination/meditations, or synchronistic events). The system will map this imagery to symbolic systems (Tarot, decans, alchemy) via the `bimba_map`, providing the user with deeper understanding and suggestions for further exploration, all within a Jungian and Saivist framework.

## 2. Story Definition (from `story_E3_F2_S2.md`)

**As a** User recording experiences in my Journal, including dreams (as messages from the unconscious), meditation/visualization imagery (from active imagination), and descriptions of mundane or synchronistic phenomena (as meaningful coincidences reflecting the interplay of psyche and world, or Lila),
**I want** Nara to analyze the imagery I report, automatically mapping it to relevant Tarot archetypes, decanic imagery, alchemical symbols, or other symbolic systems within `bimba_map`, recognizing these images as potent expressions of the unconscious and subtle vibrations (Spanda) of consciousness,
**So that** I can understand the deeper symbolic meaning of these images as part of my individuation journey, recognize their connection to universal consciousness (Paramashiva), and receive suggestions for related meditations, Oracle explorations, or further journaling prompts to engage with their transformative potential.

**Key Acceptance Criteria Highlights:**

*   Extract key images/symbols/scenes from journal entries (especially dreams, visualizations, synchronicities).
*   Map extracted imagery to Tarot, decans, alchemical symbols, etc., using `bimba_map`.
*   Attempt disambiguation and contextualization (personal vs. archetypal meaning).
*   Generate suggestions: relevant Tarot cards, decanic themes, alchemical symbols, journaling prompts, related meditations (from E3_F1_S2).
*   Provide a UI for presenting mappings and suggestions within the journal.
*   Optionally include a user feedback loop for interpretations.
*   Gracefully handle novel imagery not in `bimba_map`.

## 3. Technical Context & Design Considerations

*   **System Component:** Primarily backend, extending the NLP capabilities of E3_F2_S1 and integrating deeply with the `bimba_map`. Also involves frontend UI elements for displaying insights.
*   **Building on E3_F2_S1:** This story assumes the NLP engine from E3_F2_S1 can identify and tag sections of text as descriptions of dreams, visualizations, or significant events. This story focuses on the *next step*: analyzing the *content* (specifically imagery) of these tagged sections.
*   **`bimba_map` as Core:** The `bimba_map` (likely a graph database like Neo4j) is central. It needs to be populated with a rich set of images and their symbolic associations across various systems (Tarot, astrology, alchemy, mythology, common symbols).
    *   Example `bimba_map` relationships: `(Image:Snake)-[:SYMBOLIZES]->(Concept:Transformation)`, `(Image:Snake)-[:ASSOCIATED_WITH]->(TarotCard:Strength)`, `(Image:Snake)-[:REPRESENTS]->(Energy:Kundalini)`.
*   **Imagery Extraction:** This might involve:
    *   Noun phrase extraction from relevant text sections.
    *   Identifying keywords that denote common symbols (e.g., "river," "mountain," "key," "bird").
    *   Potentially using more advanced techniques like object detection if users can upload drawings, or analyzing descriptive language to infer visual qualities.
*   **Symbolic Mapping Logic:**
    1.  Extract potential symbolic images/phrases from the journal entry.
    2.  Query `bimba_map` for direct matches or similar concepts.
    3.  If multiple mappings exist, consider context from the journal entry (e.g., surrounding emotions, themes identified by E3_F2_S1) to rank or select the most relevant ones - favour certain regions of the bimba map (such as decan images, I-ching hexagrams, 72 names of God etc.).
    4.  Consider multi-hop queries in `bimba_map` to find indirect associations (e.g., Image -> Concept -> Tarot Card).
*   **Suggestion Generation Engine:** A rule-based or simple ML system that takes the identified symbols and their `bimba_map` associations as input and generates relevant suggestions (e.g., if "snake" maps to "Transformation" and "The World" card, suggest exploring The World card).
*   **Saivist Lens:** Interpretation should emphasize images as manifestations of consciousness (Cit), divine play (Lila), and energetic vibrations (Spanda). For example, a turbulent dream image could be framed as a strong Spanda indicating an area of active transformation.

## 4. Constraints & Challenges

*   **Richness of `bimba_map`:** The effectiveness heavily depends on the comprehensiveness and quality of the `bimba_map`.
*   **Ambiguity of Imagery:** Symbols can have multiple, often contradictory, meanings. Personal association is key.
*   **Contextual Understanding:** True understanding requires deep contextual awareness, which is challenging for AI.
*   **Avoiding Oversimplification:** Symbolic interpretation should not be reduced to a mechanical lookup. The system should encourage user reflection.
*   **User Interface:** Presenting these insights without overwhelming the user or making the journal feel cluttered.

## 5. Inputs for AI Builder (You, the Generative AI)

1.  **This Document (E3_F2_S2_prompt_package.md):** Provides overall context and requirements.
2.  **User Story File:** `story_E3_F2_S2_journal_imagery_analysis.md` (content provided above).
3.  **Prerequisite Story Output (Conceptual from E3_F2_S1):** Assume the NLP from E3_F2_S1 provides structured data that includes tagged sections (e.g., `dream_description`, `visualization_narrative`) and extracted entities/keywords.
    *   Example input from E3_F2_S1's output for this story's processing:
        ```json
        {
          "entryId": "journal_entry_456",
          "taggedSections": [
            {
              "sectionType": "dream_description",
              "text": "I dreamt I was flying over a vast, shimmering ocean. A giant silver bird with eyes like stars flew beside me, guiding me towards a glowing island.",
              "keywords": ["flying", "ocean", "silver bird", "stars", "glowing island"]
            }
          ]
          // ... other patterns from E3_F2_S1 ...
        }
        ```
4.  **`bimba_map` Structure (Conceptual - Assume a graph structure):**
    *   Nodes: `Image`, `Symbol`, `Concept`, `TarotCard`, `Decan`, `AlchemicalSymbol`, `Element`, `Planet`, `MythologicalFigure`, `Quality`, etc.
    *   Relationships: `SYMBOLIZES`, `ASSOCIATED_WITH`, `REPRESENTS`, `PART_OF`, `MANIFESTS_AS`, `RELATED_TO_DECAN`, etc.
    *   Example data points in `bimba_map`:
        *   `(Image {name: "bird"}) -[:SYMBOLIZES]-> (Concept {name: "freedom"})`
        *   `(Image {name: "bird"}) -[:SYMBOLIZES]-> (Concept {name: "messenger"})`
        *   `(Image {name: "ocean"}) -[:REPRESENTS]-> (Concept {name: "unconscious"})`
        *   `(Image {name: "ocean"}) -[:ASSOCIATED_WITH]-> (Element {name: "Water"})`
        *   `(TarotCard {name: "The Star"}) -[:DEPICTS_IMAGE]-> (Image {name: "star"})`
        *   `(Decan {name: "Aries I"}) -[:HAS_SYMBOLIC_IMAGE]-> (Image {name: "warrior's helm"})`
5.  **Illustrative Output (Structured JSON from this Imagery Analysis module - Conceptual):**
    ```json
    {
      "entryId": "journal_entry_456",
      "analyzedImagery": [
        {
          "originalTextSnippet": "flying over a vast, shimmering ocean",
          "extractedImages": ["flying", "ocean"],
          "interpretations": [
            {
              "image": "flying",
              "bimbaMapLinks": [
                {"symbol": "Freedom", "path": "Image:flying -> SYMBOLIZES -> Concept:Freedom"},
                {"symbol": "Transcendence", "path": "Image:flying -> SYMBOLIZES -> Concept:Transcendence"}
              ],
              "archetypalMeaning": "Represents liberation, rising above limitations, spiritual aspiration.",
              "saivistHint": "Experience of expansive consciousness, lightness of being (Laghima Siddhi)."
            },
            {
              "image": "ocean",
              "bimbaMapLinks": [
                {"symbol": "Unconscious Mind", "path": "Image:ocean -> REPRESENTS -> Concept:Unconscious"},
                {"symbol": "Primordial Feminine/Shakti", "path": "Image:ocean -> ASSOCIATED_WITH -> Concept:Shakti"},
                {"tarotLink": "The Moon", "path": "Image:ocean -> RELATED_TO_TAROT -> TarotCard:TheMoon"}
              ],
              "archetypalMeaning": "Symbol of the collective unconscious, emotions, the unknown, primordial source.",
              "saivistHint": "The vast expanse of Cit (consciousness) or the dynamic flow of Shakti."
            }
          ],
          "suggestions": [
            {"type": "OracleExploration", "text": "Consider exploring Tarot cards like The Star or The Moon.", "target": "Oracle:TheStar,TheMoon"},
            {"type": "JournalPrompt", "text": "What did it feel like to fly? What did the ocean represent to you in that moment?", "target": "Journal"},
            {"type": "MeditationLink", "text": "Explore the 'Soaring Spirit' meditation.", "target": "AlchemicalVisionarySequence:AVS_SoaringSpirit"}
          ]
        },
        {
          "originalTextSnippet": "A giant silver bird with eyes like stars",
          "extractedImages": ["bird (giant, silver)", "eyes (stars)"],
          "interpretations": [
            {
              "image": "bird (silver)",
              "bimbaMapLinks": [
                {"symbol": "Messenger/Guide", "path": "Image:bird -> SYMBOLIZES -> Concept:Messenger"},
                {"symbol": "Psyche/Soul", "path": "Image:bird -> REPRESENTS -> Concept:Psyche"},
                {"alchemicalLink": "Alchemical Bird (soul's ascent)", "path": "Image:bird -> RELATED_TO_ALCHEMY -> AlchemicalSymbol:BirdOfHermes"}
              ],
              "archetypalMeaning": "Often a psychopomp or spiritual guide, representing the soul or higher self. Silver can denote purity, intuition, lunar qualities.",
              "saivistHint": "A manifestation of guiding intelligence (Buddhi) or a subtle form of divine grace (Anugraha Shakti)."
            }
          ],
          "suggestions": [
            {"type": "SymbolExploration", "text": "Research the symbolism of birds in alchemy or mythology.", "target": "BimbaMap:Bird,Alchemy"}
          ]
        }
      ]
    }
    ```

## 6. Expected Outputs from AI Builder (You)

1.  **Imagery Extraction Strategy:**
    *   How to identify and extract key images from text sections already flagged as dreams, visualizations, etc. (building on E3_F2_S1's output).
    *   Suggest techniques (e.g., enhanced noun phrase extraction, keyword spotting for symbolic objects, handling descriptive adjectives).
2.  **Symbolic Mapping Logic (Pseudocode or High-Level Description):**
    *   Describe the process of taking extracted images and querying the `bimba_map`.
    *   How to handle multiple potential meanings or associations from `bimba_map` (disambiguation).
    *   How to incorporate personal context (if available from journal) vs. archetypal meaning.
3.  **Suggestion Generation Rules/Logic:**
    *   Provide examples of rules for generating suggestions (Oracle cards, journal prompts, meditations) based on `bimba_map` findings.
    *   E.g., "IF image maps to TarotCard X AND Concept Y, THEN suggest Oracle reading with Card X and journal prompt about Y."
4.  **Refined Data Model for Imagery Analysis Output (JSON Schema):**
    *   Define a clear JSON schema for the output of this module, ensuring it includes original text, extracted images, `bimba_map` links, interpretations (archetypal, Saivist), and actionable suggestions.
5.  **Key Function/Module Definitions (Python-like Pseudocode):**
    *   `def analyze_journal_imagery(tagged_journal_section: dict, bimba_map_accessor) -> dict:` (main function for this story)
    *   `def extract_images_from_text(text: str) -> list[str]:`
    *   `def query_bimba_map_for_image(image_term: str, context: dict, bimba_map_accessor) -> list[dict]:`
    *   `def generate_suggestions_from_mappings(mappings: list[dict]) -> list[dict]:`
6.  **Integration with `bimba_map`:**
    *   Elaborate on the types of queries made to `bimba_map` (e.g., Cypher queries if Neo4j).
    *   How to structure `bimba_map` data to best support these queries.
7.  **UI Considerations (Briefly):**
    *   How might these insights and suggestions be presented to the user in the journal interface?
8.  **Handling Novel Imagery and User Feedback:**
    *   Strategies for when an image isn't in `bimba_map`.
    *   How a user feedback loop could work to refine interpretations.
9.  **Documentation Snippets:** Key comments for the proposed logic.

## 7. AI Builder Prompt

"Okay, Nara AI Builder, based on User Story E3_F2_S2 and its context, please generate the design for the 'Journal Imagery Analysis' system. This system will process imagery from dreams, meditations, and synchronicities described in journal entries, map them to symbolic systems using `bimba_map`, and provide Jungian/Saivist-informed insights and suggestions.

Provide:

1.  **Imagery Extraction Strategy:** How to get key images from pre-identified journal text.
2.  **Symbolic Mapping Logic:** Pseudocode/description for querying `bimba_map` and handling results.
3.  **Suggestion Generation Rules/Logic:** Examples of how to create actionable suggestions.
4.  **Refined JSON Schema for Output:** For the imagery analysis results.
5.  **Key Function Definitions (Python-like Pseudocode):** For analysis, `bimba_map` querying, and suggestion generation.
6.  **`bimba_map` Integration Details:** Query types and data structure considerations.
7.  **Brief UI Considerations:** How to display this to the user.
8.  **Handling Novel Imagery & User Feedback:** Approaches for these scenarios.
9.  **Key Documentation Snippets.**

Focus on leveraging the `bimba_map` effectively and providing meaningful, actionable insights that respect both archetypal patterns and personal meaning-making, all within the project's Jungian and Saivist philosophical framework."