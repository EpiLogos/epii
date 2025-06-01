# AI Builder Prompt Package: E5_F2_S1 - Evolving Card Canvas: Patina & Prehensions

## 1. Overview

**Story ID:** E5_F2_S1
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F2 - Self-Modifying & Recursive UX Elements
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Implement an evolving Card Canvas within the Nara Oracle section where digital Tarot cards and decks visually change over time based on user interaction. This includes developing a 'patina' effect for frequently used cards and unlocking subtle symbolic 'easter eggs' or deeper layers of meaning, transforming static representations into living symbols (actual occasions) that reflect the user's journey of concrescence and psychic integration (Cit-Shakti manifesting as Spanda).

## 2. Story Definition

**As a** User (Pramata, an experiencing subject on an individuation journey),
**I want** the digital Tarot cards and decks I frequently interact with within the Oracle section (my field of active imagination and symbolic dialogue) to visually evolve over time—each card becoming an actual occasion shaped by my prehensions—developing a 'patina' (a testament to repeated engagement, a history of feeling) or unlocking subtle symbolic 'easter eggs' or deeper layers of meaning (the emergence of novel satisfactions and Pratibha),
**So that** my connection with these living symbols deepens, and the interface reflects my ongoing journey of concrescence and the psyche's integration of archetypal energies (Cit-Shakti manifesting as Spanda), transforming them from mere representations into vessels of personal and transpersonal significance.

## 3. Technical Context & Design Philosophy

*   **Focus:** Dynamic visual evolution of Tarot cards/decks in the Oracle section.
*   **Living Symbols:** Cards are not static but are actual occasions shaped by user prehensions (interactions).
*   **Patina Effect:** Subtle visual changes (e.g., softened edges, faint glow) on frequently used cards, suggesting age, wear, or energetic imbuement – a history of feeling.
*   **Symbolic Easter Eggs:** Unlocking subtle visual details on cards or deeper interpretive content based on specific interaction patterns, reflecting emergent novelty (Pratibha).
*   **Aesthetic Goal:** Delightful discoveries that deepen engagement, not game mechanics.
*   **Philosophical Grounding:** Pramata (experiencing subject), prehension, actual occasion, concrescence, satisfaction, Pratibha (intuitive insight), Cit-Shakti (power of consciousness), Spanda (divine pulse), Lila (divine play), Vimarsha (reflective consciousness), Svatantrya (autonomy of consciousness).

## 4. Constraints and Challenges

*   **Subtlety and Sophistication:** Visual effects must be aesthetically pleasing and thematically consistent, avoiding gimmicks.
*   **Performance:** Dynamic visual effects should not degrade Oracle interface performance.
*   **Configurability vs. Discovery:** Balancing user control (Svatantrya) over effects with the joy of spontaneous discovery.
*   **Tracking Logic:** Accurately tracking diverse user interactions (frequency, recency, context) to trigger evolutions appropriately.
*   **Defining Thresholds:** Determining the interaction levels or patterns that trigger patina or easter eggs.
*   **Artistic Implementation:** Creating visual effects that genuinely enhance the symbolic depth of the cards.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Oracle Section Design (Epic 2):** Details of card rendering, deck selection, and interaction mechanics.
3.  **Digital Tarot Card Assets:** High-resolution images for all cards in available decks.
4.  **Nara User Interaction Data Model:** How card/deck usage is tracked and stored.
5.  **Frontend Technology Stack:** Information on capabilities for dynamic image manipulation, shaders, or layering.
6.  **Examples of Desired Visual Effects (Mood Board/Sketches):** Illustrating the intended aesthetic for 'patina' and 'easter eggs'.
7.  **List of Potential 'Easter Eggs':** Ideas for specific cards – e.g., a symbol that could animate, an additional textual insight that could be revealed.

## 6. Expected Outputs from AI Builder (Design & Implementation Plan for Evolving Card Canvas)

1.  **Visual Design Specifications for 'Patina':**
    *   Detailed mockups/prototypes showing various stages of patina on different card examples.
    *   Technical specifications for achieving the visual effects (e.g., shader parameters, image filter settings, overlay textures).
2.  **Design and Content for Symbolic 'Easter Eggs':**
    *   For a selection of cards: specific visual changes (e.g., subtle animation of a star, a glyph appearing) or additional content (e.g., a short myth, a contemplative question) to be unlocked.
    *   Mockups of how these easter eggs appear or are accessed.
3.  **Interaction Tracking and Trigger Logic:**
    *   Algorithm/ruleset defining how user interactions (frequency, context, specific sequences) translate into patina progression or easter egg unlocking.
    *   How this logic interfaces with the stored user interaction data.
4.  **Deck-Level Evolution Design:** Visual concepts for how entire decks might show signs of frequent use.
5.  **Frontend Implementation Plan:**
    *   Strategy for applying dynamic visual effects to card images efficiently.
    *   How to manage different evolutionary states for each card/deck per user.
    *   Integration with the interaction tracking logic.
6.  **Performance Optimization Strategy:** Techniques to ensure smooth rendering and minimal performance impact.
7.  **Configuration Options (If any):** UI design for user settings related to these evolutionary effects.
8.  **Discovery Mechanism (Optional):** Ideas for subtly informing users about these evolving features or allowing them to review 'evolved' items.

## 7. Prompt for Generative AI

```
As a Creative Technologist and UX Alchemist, specializing in crafting interfaces that feel alive and responsive to user engagement, with a deep appreciation for symbolic systems, Jungian archetypes, and the poetics of digital interaction (drawing from concepts like Whitehead's process philosophy – actual occasions, prehension, concrescence), you are tasked with designing the 'Evolving Card Canvas' for the Nara Oracle, as detailed in User Story E5_F2_S1.

The objective is to transform digital Tarot cards from static images into 'living symbols'—actual occasions shaped by the user's (Pramata's) prehensions. Frequently used cards should develop a visual 'patina' (a history of feeling), and specific interaction patterns should unlock subtle symbolic 'easter eggs' or deeper layers of meaning (emergent Pratibha). This should deepen the user's connection with the Oracle, reflecting their journey of concrescence and the integration of archetypal energies (Cit-Shakti manifesting as Spanda) in a delightful, non-gamified way.

Based on the provided story, Oracle section designs, card assets, interaction data model, and frontend capabilities, deliver a comprehensive design and implementation plan:

1.  **Visual Design Specifications for 'Patina':** Provide detailed mockups/prototypes and technical specs for achieving subtle, aesthetically pleasing patina effects on cards.
2.  **Design and Content for Symbolic 'Easter Eggs':** For selected cards, define specific visual changes (e.g., subtle animations, new glyphs) or additional content (myths, questions) to be unlocked. Include mockups.
3.  **Interaction Tracking and Trigger Logic:** Detail the algorithm/ruleset for how user interactions translate into patina progression or easter egg unlocking.
4.  **Deck-Level Evolution Design:** Propose visual concepts for how entire decks might evolve with use.
5.  **Frontend Implementation Plan:** Outline the strategy for applying dynamic visual effects, managing evolutionary states per user, and integrating tracking logic.
6.  **Performance Optimization Strategy:** Recommend techniques for ensuring smooth rendering.
7.  **Configuration Options (If any):** Design UI for user settings related to these effects, respecting user Svatantrya.
8.  **Discovery Mechanism (Optional):** Suggest subtle ways for users to become aware of or review these evolutions.

Your design must be subtle, sophisticated, and thematically resonant, making the Oracle a space of ongoing discovery and Lila, where symbols become personal vessels of meaning through interaction.
```