# Nara Agent (#4) - Detailed Plan

**Version:** 0.1
**Date:** 2025-04-11

**Goal:** Define the specific roles, capabilities, QL cycle integration points, tool usage, and Notion interactions for the Nara Subsystem Expert Agent (#4) and its internal components (#4.0 to #4.5).

**Based on:**
*   Neo4j Bimba Graph query results (2025-04-11)
*   Agent Definition: `memory-bank/reflections/-Shakti/agent_4_dialogue.md`
*   `memory-bank/systemPatterns.md`
*   `memory-bank/productContext.md`
*   `Explorations/Notion/notion_integration_scope.md`

---

## I. Nara Subsystem (#4) Overview

*   **Bimba Coordinate:** `#4`
*   **Name:** Nara
*   **Description:** Contextual Application, individualized cognition.
*   **Core Function:** Orchestrates user dialogue, contextualizes integrated information from previous agents (0-3) for personalized application, facilitates multi-modal expression, and applies frameworks like the Jungian model for transformation. Embodies the **Dia-logos** principle.
*   **QL Context Frame:** `(4.0-4.4/5)` (Nested structure bridging 4 and 5).
*   **Ontology Layer:** Maps to "Dia-logos".
*   **Tanmatra:** Taste (Identity).

---

## II. Internal Components & Domains (`NaraComponent`)

The Nara subsystem contains six internal components:

### 1. Component #4.0: Mahamaya Ground
*   **Bimba Coordinate:** `#4.0`
*   **Name:** Mahamaya Ground
*   **Function:** Archetypal Mathematical Ground.
*   **Details:** Provides seed potential. Birthdate Encoding system transforms universal archetypes into personalized context. Represents the foundational input from the symbolic/archetypal layer (Mahamaya #3).

### 2. Component #4.1: Decanic Magic
*   **Bimba Coordinate:** `#4.1`
*   **Name:** Decanic Magic
*   **Function:** Material Cause ("What").
*   **Details:** Links user structure (potentially derived from #4.0) to natural correspondences via 36 decans, planetary rulers, elements. Defines the specific archetypal materials or forces relevant to the context.

### 3. Component #4.2: Tarot Systems
*   **Bimba Coordinate:** `#4.2`
*   **Name:** Tarot Systems
*   **Function:** Efficient Cause ("How").
*   **Details:** Primary symbolic interface (Rider-Waite, Thoth). Provides tools for dynamic interpretation based on personal compass (from #4.0/#4.1) & concrescence phase (system state).

### 4. Component #4.3: Alchemical Mediator
*   **Bimba Coordinate:** `#4.3`
*   **Name:** Alchemical Mediator
*   **Function:** Formal Mediator ("Which/Who").
*   **Details:** Integrates symbolic understanding (Tarot from #4.2) with embodied transformation (Alchemy, Major Arcana, Codons). Facilitates the synthesis and application of symbolic insights.

### 5. Component #4.4: Contextual Arena Anchor
*   **Bimba Coordinate:** `#4.4`
*   **Name:** Contextual Arena Anchor
*   **Function:** Anchor point for MEF-specific Contextual Arenas.
*   **Details:** Connects the generalized Nara processing to specific ContextualArenaInstance nodes (defined elsewhere in Bimba) based on Meta-Epistemic Framework (MEF) conditions active in the QL cycle state. Allows tailoring of dialogue/analysis to specific domains (e.g., psychological, philosophical, creative).
*   **Nested Arena (#4.4.3 - Jungian Psychodynamics):**
    *   `#4.4.3-0: Archetypal Foundation`: (Ajnana) - Archetypes, Psychoid Numbers, Unconscious.
    *   `#4.4.3-1: Psychological Typology`: (Ontology) - 4 Functions, Psychic Reality.
    *   `#4.4.3-2: Synchronicity & Expression`: (Epistemology) - Archetype/Image Distinction, Shadow, Mythology, Astrology.
    *   `#4.4.3-3: Alchemical Transformation`: (Psychology) - Individuation, Transcendent Function, Active Imagination.
    *   `#4.4.3-4: Self-Expression`: (Contextual Domain) - Self Archetype Expression, Mandala Symbolism.
    *   `#4.4.3-5: Transcendent Integration`: (Jnana) - Gnosis, Mystical Dimensions, Transcendence of Psych Framework.

### 6. Component #4.5: Epii Integration
*   **Bimba Coordinate:** `#4.5`
*   **Name:** Epii Integration
*   **Function:** Quintessence ("Why").
*   **Details:** Represents the emergent agentic intelligence within Nara. Handles recursive synthesis of the Nara process, interfaces with the source/higher levels (Epii #5), and embodies the +5/-0 roles *within the Nara subsystem's context*, bridging back to the overall system integration.

---

## III. Nara Agent Operational Flow & Role (`agent_4_dialogue.md` Synthesis)

*   **QL Cycle Role:** Operates primarily at **Node +4 (Contextualize)** in the synthesis (+) cycle and **Node -1 (Perspective Analysis)** in the analysis (-) cycle.
*   **Core Function:** Acts as the primary interface and harmonizer between the user and the deeper QL cycle processing. Takes integrated symbolic/resonant/topological data from Agent #3 (`(0/1/2)/3`) and makes it accessible, relevant, and potentially transformative for the user.
*   **Input:** Receives integrated data structure from Agent #3. Accesses user context (history, profile via `getMongoContextTool`, `getUserContextTool`), crystallized knowledge (Notion via `queryNotionTool`), and potentially user's archetypal profile (derived from Birthdate Encoding/#4.0).
*   **Processing:**
    *   Applies nested Jungian framework (#4.0-#4.5 logic) for personalization.
    *   Synthesizes information from all sources using LLM (Gemini) with dialogue-focused prompts.
    *   Determines optimal multi-modal expression (text, visuals, sound) leveraging -Shakti potential (Lens #5-3) via calls to Expression Modules (mediated by backend).
    *   Manages dialogue state.
*   **Output:** Produces the final payload for the frontend, including:
    *   Formatted text response.
    *   Structured data for visualizations/sonification (identifying layer contributions 0-3).
    *   Links to relevant Notion pages.
    *   Personalized symbolic elements (Tarot, hexagrams, etc.).
*   **Dia-logos & Pedagogy:** Facilitates conversation between universal principles (from Agents 0-3) and the user's particular context. Enables bidirectional learning where user interaction informs the system.
*   **Notion Integration:** Reads from Notion (crystallized knowledge, archetypes) to enrich dialogue. Provides links back to Notion.

---

## IV. Mathematical/ML Associations & Implementation Ideas

*   **Math:** Information Synthesis, Decision Theory, Graph Algorithms (context integration), Dialogue/Argumentation Theory, Information Fusion, Mappings (Archetype -> Output), Bayesian Inference (user modeling).
*   **ML:** Dialogue Management (LLM fine-tuning), Response Generation (LLM fine-tuning on specific sources like Jung/Alchemy/HMS), Wisdom Training (LLM fine-tuning on teacher dialogues), RL (dialogue strategy optimization), Multi-Modal Synthesis, User Modeling/Archetype Recognition.
*   **Implementation:** Requires robust LLM prompting, integration with Mongo/Notion tools, logic for applying Jungian framework, structuring multi-modal output payload, dialogue state management.

---

## V. Next Steps

1.  Refine the descriptions of the internal NaraComponents (#4.0-#4.5) and their specific interactions.
2.  Detail the specific prompts and logic for the Nara agent operating within QL Nodes +4 / -1.
3.  Define the structure of the data passed *from* Agent #3 and the structure of the payload passed *to* the frontend/Node +5.
4.  Plan the implementation of the Jungian framework logic and personalization based on user context/archetype.
5.  Proceed with planning for the next agent (e.g., #3 Mahamaya).
