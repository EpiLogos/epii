# AI Builder Prompt Package: E4_F1_S2 - Nara Prime: `bimba_map` Contextualization & Journey Management

## 1. Overview

**Story ID:** E4_F1_S2
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F1 - Nara Agent Development
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Design and develop enhancements to the Nara Prime agent (building on E4_F1_S1) to enable sophisticated `bimba_map` contextualization, long-term user individuation journey management, and tracking of symbolic metabolism, all framed by Jungian psychology and Kashmir Saivism.

## 2. Story Definition

**As a** User (Pramata) interacting with Nara across different sections (Identity Dynamics, Oracle, Journal), seeking to understand the unfolding of my consciousness,
**I want** Nara to act as the primary vector for accessing and pragmatizing the `bimba_map`'s interconnected symbolic knowledge (reflecting archetypal patterns and expressions of Paramashiva), tailoring insights to my specific individuation journey, and managing my long-term symbolic metabolism and progression (the dynamic interplay of consciousness – Spanda – with symbolic forms),
**So that** I receive personalized, contextually relevant guidance that evolves with my development, fostering deeper Self-awareness and recognition of the creative play (Lila) of consciousness.

## 3. Technical Context & Design Philosophy

*   **Focus:** Enhancing Nara Prime agent (from E4_F1_S1) with advanced contextualization and personalization capabilities.
*   **`bimba_map` Contextualization:** Nara uses user context (Identity Dynamics, Oracle, Journal themes) to formulate targeted `bimba_map` queries. Retrieved data is interpreted and presented in a relevant manner, highlighting connections.
*   **Long-Term Journey Management:** Nara maintains a persistent understanding of the user's individuation path (insights, symbolic encounters, milestones), informing future guidance.
*   **Symbolic Metabolism Tracking:** Nara monitors user engagement with symbols (resonances with Spanda, integration of unconscious material), identifying patterns of growth, resistance, or core themes related to Paramashiva.
*   **Integration with Nara Sections:**
    *   **Identity Dynamics:** `bimba_map` enriches understanding of natal profile, archetypes, and divine nature.
    *   **Oracle:** `bimba_map` contextualizes readings, highlighting archetypal dynamics and Pratibha.
    *   **Journal:** `bimba_map` helps interpret symbols/themes, relating them to the individuation journey and Antahkarana.
*   **Adaptive Guidance:** Nara's suggestions become more personalized and nuanced over time, supporting movement towards Self and Svarupa.
*   **`epii` Agent Consultation:** Nara consults `epii` for deeper philosophical (Jungian) or mystical (Saivist) context for `bimba_map` insights.
*   **Philosophical Core:** Deep integration of Jungian concepts (individuation, archetypes, shadow, transcendent function) and Saivist principles (Paramashiva, Spanda, Cit-Shakti, The Upayas, Tanmatras, Sunyata).

## 4. Constraints and Challenges

*   **Complexity of Contextualization:** Developing sophisticated logic to map diverse user contexts to relevant `bimba_map` queries and interpretations.
*   **Journey Modeling:** Creating a robust and flexible model for representing and tracking a user's non-linear individuation journey.
*   **Symbolic Metabolism Metrics:** Defining meaningful ways to track and interpret "symbolic metabolism" – how users process and integrate symbols.
*   **Data Persistence & Scalability:** Ensuring efficient storage and retrieval of long-term user journey data.
*   **Maintaining Nuance:** Avoiding oversimplification when interpreting complex symbolic data and philosophical concepts.
*   **Balancing Guidance and User Agency:** Providing insightful guidance without being prescriptive, respecting the user's Svatantrya.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Nara Agent Foundation (E4_F1_S1):** Architecture and core modules of Nara Prime.
3.  **EFDD Concepts:** Detailed explanations of Pramata, Paramashiva, Spanda, Cit-Shakti, Atman, Lila, Pratibha, Antahkarana, Svarupa, and their interplay with Jungian concepts.
4.  **`bimba_map` Schema (Detailed):** Examples of node types, properties, and relationship types relevant to individuation paths and symbolic resonances.
5.  **User Profile Data Structure (Conceptual):** How user data from Identity Dynamics, Oracle history, and Journal themes might be structured.
    *   Example: `{ "user_id": "xyz", "identity_dynamics": { "dominant_archetypes": ["Sage", "Magician"], "shadow_aspects_emerging": ["Orphan"] }, "oracle_history": [{"reading_id": "123", "cards": [...], "key_themes": ["transformation", "letting_go"]}], "journal_summary": { "recurring_symbols": ["serpent", "tree"], "emotional_patterns": ["anxiety_before_breakthrough"]} }`
6.  **Illustrative Contextualization Scenarios:**
    *   *Scenario 1 (Oracle):* User draws "The Tower." Nara queries `bimba_map` for connections to "The Tower," filters by user's current tracked alchemical phase (e.g., Nigredo from journal analysis), and consults `epii` on Saivist views of sudden dissolution for transformation. Presents synthesized insight.
    *   *Scenario 2 (Journal):* User repeatedly journals about a "golden key." Nara identifies this as a recurring symbol, queries `bimba_map` for its archetypal significance, links it to user's stated goals in Identity Dynamics, and notes it in the journey log as a potential numinous symbol.

## 6. Expected Outputs from AI Builder (Design & Logic)

1.  **Enhanced Nara Agent Architecture:** Diagram showing how new capabilities (Journey Manager, Symbolic Metabolism Tracker, Advanced Contextualizer) integrate with E4_F1_S1 modules.
2.  **Module Designs (Pseudocode/Detailed Logic):**
    *   **Journey Manager:** Data structures for storing individuation path (milestones, key symbols, insights). Logic for updating and retrieving journey data.
    *   **Symbolic Metabolism Tracker:** How user interactions (journal entries, oracle reflections, practice logs) are processed to infer symbolic engagement, resonance (Spanda), and integration. Metrics or qualitative tags used.
    *   **Advanced `bimba_map` Contextualizer:** Algorithms for translating user context (from all Nara sections) into specific `bimba_map` queries. Logic for filtering, prioritizing, and interpreting `bimba_map` results based on journey data and symbolic metabolism.
3.  **Data Models for Journey & Metabolism:** Detailed schemas for persistent storage.
4.  **Adaptive Guidance Logic:** Rules or heuristics for how Nara's suggestions and interpretations evolve based on the user's tracked progress and symbolic engagement.
5.  **`epii` Agent Interaction Protocols (Refined):** Specific query types Nara will send to `epii` for philosophical/mystical depth related to journey milestones or complex `bimba_map` patterns.
6.  **Integration Logic with Nara Sections:** How contextualized `bimba_map` insights and journey data will be surfaced in Identity Dynamics, Oracle, and Journal interfaces (conceptual data to be passed to UI).
7.  **Philosophical Integration Deep Dive:** Detailed examples of how specific Jungian-Saivist concept pairs (e.g., Archetype & Paramashiva's expressions; Shadow & Tattvic veils; Transcendent Function & Cit-Shakti's creative impulse) are operationalized in Nara's logic.
8.  **Example `bimba_map` Queries:** Concrete examples of Cypher (or other) queries Nara would generate in different contextual scenarios.

## 7. Prompt for Generative AI

```
As an expert AI architect with deep knowledge of Jungian psychology, Kashmir Saivism, and symbolic systems, enhance the Nara agent (based on E4_F1_S1 foundation) to implement the capabilities outlined in User Story E4_F1_S2. The goal is for Nara to become a sophisticated, personalized guide for the user's individuation journey (Pramata) by deeply contextualizing `bimba_map` insights and managing their long-term symbolic metabolism (Spanda dynamics).

Your design must detail:

1.  **`bimba_map` Contextualization Engine:** How Nara takes user context (from Identity Dynamics, Oracle, Journal) to formulate targeted `bimba_map` queries. How it interprets and presents retrieved symbolic data (archetypes, connections reflecting Paramashiva) as relevant to the user's current state and individuation path (Atman realization).
2.  **Long-Term User Journey Management:** The system for Nara to persistently track key insights, symbolic encounters (numinous experiences, shadow work), developmental milestones (integration of archetypes, transcendent function), and how this journey data informs ongoing guidance.
3.  **Symbolic Metabolism Tracking:** The mechanism for Nara to monitor user engagement with symbols (resonances with Spanda, assimilation of unconscious material), identifying patterns of growth, resistance, or themes pointing to core complexes or the unfolding of Cit-Shakti and Lila.
4.  **Integration with Nara Sections (Identity Dynamics, Oracle, Journal):** How these sections will be enriched by Nara's contextualized `bimba_map` insights and journey data (e.g., relating journal symbols to Antahkarana development, Oracle cards to Pratibha moments).
5.  **Adaptive Guidance Logic:** How Nara's suggestions will evolve, becoming more personalized and nuanced, supporting the user's path to Self/Svarupa.
6.  **`epii` Agent Consultation for Depth:** Refined protocols for Nara to consult the `epii` agent for deeper Jungian philosophical or Saivist mystical context on emerging symbolic patterns.

Deliver the following:

1.  **Enhanced Nara Agent Architecture Diagram:** Showing new modules (Journey Manager, Symbolic Metabolism Tracker, Advanced Contextualizer) and their integration.
2.  **Detailed Designs for New/Enhanced Modules:** Pseudocode, algorithms, and data flow for contextualization, journey tracking, and metabolism monitoring. Explicitly detail how Jungian and Saivist concepts (Pramata, Paramashiva, Spanda, Cit-Shakti, Atman, Lila, Pratibha, Antahkarana, Svarupa) are operationalized.
3.  **Data Models:** For persistent storage of user journey and symbolic metabolism data.
4.  **Adaptive Guidance Rules/Heuristics:** Examples of how Nara's responses change based on tracked user development.
5.  **Example `bimba_map` Queries:** Illustrative, context-driven queries (e.g., Cypher for Neo4j).
6.  **Philosophical Integration Deep Dive:** Provide 2-3 detailed scenarios showing how Nara processes a complex user interaction across multiple sessions, applying the integrated Jungian-Saivist framework to guide the user towards deeper self-understanding and recognition of their inherent creative potency.

Focus on creating a system that is not merely informational but truly transformative, reflecting a profound understanding of the human psyche and spiritual development.
```