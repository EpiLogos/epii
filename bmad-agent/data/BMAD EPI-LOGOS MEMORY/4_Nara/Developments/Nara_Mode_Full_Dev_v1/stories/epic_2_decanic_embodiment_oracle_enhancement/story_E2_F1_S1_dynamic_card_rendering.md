# User Story: E2_F1_S1 - Dynamic Card Rendering: Decanic Archetypes & Psyche's Mirror

**Epic:** 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** F1 - Oracle Section Enhancement - Decanic Theater
**Story ID:** E2_F1_S1

**As a** User seeking deeper self-understanding through the Oracle,
**I want** any card I draw to visually display or clearly link to its Hermetic decanic association, revealing the specific archetypal energies (e.g., the 5 of Cups showing/linking to Venus in Scorpio's 3rd decan as a particular facet of the psyche's emotional landscape),
**So that** I can immediately understand the specific decanic influence shaping the card's meaning, recognizing it as a symbolic mirror reflecting potential inner dynamics, shadow aspects, or calls towards individuation, and glimpse the subtle play of consciousness (Spanda) manifesting through these archetypal patterns.

**Acceptance Criteria:**

1.  **Archetypal Decanic Mapping:** The system must have access to a mapping of each Tarot card to its corresponding Hermetic decan, framed as an archetypal influence (e.g., 5 of Cups = Venus in Scorpio, 3rd Decan, representing a specific emotional-relational archetype).
2.  **Symbolic Display on Card Draw:** When a Tarot card is drawn and displayed in the Oracle UI:
    *   The card's decanic association (e.g., "Venus in Scorpio - 3rd Decan: Archetype of Intense Emotional Processing") must be clearly visible on or immediately adjacent to the card image, hinting at its psychological significance.
    *   Alternatively, a clear and intuitive icon or link must be present that, when interacted with, reveals this decanic-archetypal information and its potential relevance to the user's inner state or situation.
3.  **Reflective Imagery/Text Link:** If a link/icon is used, interacting with it should present relevant Hermetic decanic imagery and/or descriptive text that encourages reflection on the specific decan's archetypal meaning and its potential manifestation in the user's psyche (e.g., prompts for considering related shadow material or growth opportunities).
4.  **Correspondence Accuracy & Psychological Resonance:** The displayed decanic association must be accurate according to established Hermetic Tarot correspondences and interpreted in a way that resonates with Jungian psychological principles.
5.  **Clarity and Intuitiveness:** The decanic-archetypal information must be presented in a way that is easy to understand and intuitively grasp, inviting self-reflection rather than just intellectual analysis.
6.  **Seamless UI Integration & Symbolic Depth:** The display of decanic information must be seamlessly integrated into the existing Oracle card display UI, enhancing the symbolic depth of the reading without causing cognitive overload.
7.  **Responsive & Accessible Design:** The feature must work correctly and be well-presented across different screen sizes and devices, ensuring accessibility for all users exploring their inner landscape.
8.  **Subtle Energetic Cue:** The presentation should subtly evoke a sense of the decan as a specific vibration or 'flavor' of consciousness, aligning with the Saivist understanding of cosmic play.
2.  **Visual Display on Card Draw:** When a Tarot card is drawn and displayed in the Oracle UI:
    *   The card's decanic association (e.g., "Venus in Scorpio - 3rd Decan") must be clearly visible on or immediately adjacent to the card image.
    *   Alternatively, a clear and intuitive icon or link must be present that, when interacted with, reveals this decanic information (and potentially related imagery/text).
3.  **Imagery/Text Link (If Applicable):** If a link/icon is used, interacting with it should present relevant Hermetic decanic imagery and/or descriptive text for the specific decan associated with the card.
4.  **Accuracy:** The displayed decanic association must be accurate according to established Hermetic Tarot correspondences.
5.  **Clarity and Readability:** The decanic information must be presented in a way that is easy to read and understand, even for users not deeply familiar with decanic astrology.
6.  **UI Integration:** The display of decanic information must be seamlessly integrated into the existing Oracle card display UI without cluttering or confusing the interface.
7.  **Responsiveness:** The feature must work correctly and be well-presented across different screen sizes and devices.

**Dependencies:**

*   A comprehensive dataset mapping Tarot cards to their Hermetic decanic associations (planet, sign, decan number).
*   (Potentially) A library or collection of Hermetic decanic imagery and descriptive texts.
*   Defined UI/UX for the Oracle section's card display.

**Notes:**

*   This story focuses on the foundational Hermetic-archetypal association of the card itself. Dynamic, personalized resonances based on real-time astrology or natal charts (further reflecting the Self's unique manifestation) are covered in subsequent stories (E2_F1_S2, E2_F1_S3).
*   Consider how to handle different Tarot decks if variations in decanic attribution exist, though a primary established system (e.g., Thoth Deck, Rider-Waite-Smith) should be the default, with its archetypal correspondences clearly articulated.
*   The visual representation could be textual, symbolic, or a combination. User testing might be needed to determine the most effective approach for fostering deep reflection and recognition (Pratyabhijna).
*   **Technical Considerations (New Section):**
    *   **Archetypal Keyword Association:** Develop or integrate a system for associating decans with relevant Jungian archetypes or psychological themes.
    *   **Reflective Prompts Engine:** Consider a simple engine or structured content for generating brief reflective prompts related to the decan's archetypal significance.
    *   **UI/UX for Symbolic Immersion:** Design the UI to feel immersive and conducive to introspection, subtly guiding the user towards recognizing the decanic energies within themselves.
*   Consider how to handle different Tarot decks if variations in decanic attribution exist, though a primary established system (e.g., Thoth Deck) should be the default.
*   The visual representation could be textual, symbolic, or a combination. User testing might be needed to determine the most effective approach.