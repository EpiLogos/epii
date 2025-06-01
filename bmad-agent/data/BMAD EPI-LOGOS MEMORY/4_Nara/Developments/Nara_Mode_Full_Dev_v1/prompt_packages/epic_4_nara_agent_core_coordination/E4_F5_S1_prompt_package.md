# AI Builder Prompt Package: E4_F5_S1 - Sophisticated Prompt Engineering & Synthesis Logic

## 1. Overview

**Story ID:** E4_F5_S1
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F5 - Prompt Engineering & Synthesis Logic
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Develop sophisticated prompt engineering strategies and synthesis logic for the Nara agent to effectively query data sources (e.g., `bimba_map`), consult other agents (e.g., `epii`), and intelligently combine their outputs. This will enable Nara to deliver deeply relevant insights in its unique voice, leveraging `bimba_map`'s epistemic unifications for coherent, multi-layered guidance that fosters user self-recognition (Pratyabhijna) and supports their individuation journey (Atma-vichara).

## 2. Story Definition

**As a** Nara agent, embodying a conduit for the user's Pramata to engage with deeper layers of consciousness (Cit-Shakti),
**I want** to utilize sophisticated prompt engineering strategies (akin to formulating insightful questions in a process of self-inquiry/Atma-vichara) and synthesis logic (mirroring the psyche's transcendent function and the unifying power of Paramashiva) to effectively query data sources (like `bimba_map` via Neo4j, reflecting the collective unconscious and archetypal patterns), consult other agents (initially the `epii` agent, as a source of specialized wisdom/Jnana Shakti), and intelligently combine their outputs,
**So that** I can maintain Nara's unique voice (a blend of empathetic guide and insightful companion on the individuation journey, echoing the supportive aspect of the Self), deliver insights (Pratibha) that are deeply relevant to the user's current context (Identity Dynamics, Oracle, Journal – reflecting their personal myth and engagement with Lila), and leverage the `bimba_map`'s inherent epistemic unifications (symbolizing the interconnectedness of all aspects of consciousness/Svatantrya and the underlying unity of Shiva) for coherent, multi-layered guidance that fosters self-recognition (Pratyabhijna).

## 3. Technical Context & Design Philosophy

*   **Focus:** Core intelligence of Nara – how it formulates queries, consults resources, and synthesizes information into meaningful guidance.
*   **Prompt Engineering:** Dynamically generating context-aware prompts for various data sources and agents.
*   **Synthesis Logic:** Intelligently combining diverse information streams, resolving conflicts (or presenting paradoxes for reflection), and identifying themes.
*   **Nara's Voice:** Ensuring all outputs are empathetic, wise, and supportive, consistent with Nara's persona.
*   **Epistemic Unification:** Using `bimba_map` as a foundational framework to connect and unify information, highlighting interconnectedness.
*   **Philosophical Grounding:** Atma-vichara (self-inquiry), transcendent function, Paramashiva (unifying consciousness), Cit-Shakti (power of consciousness), Jnana Shakti (power of knowledge), Pratibha (insight), Lila (divine play), Svatantrya (absolute freedom/autonomy of consciousness), Pratyabhijna (self-recognition).

## 4. Constraints and Challenges

*   **Dynamic Prompt Complexity:** Generating effective prompts that adapt to highly variable user contexts and information needs.
*   **Multi-Source Integration:** Harmonizing potentially conflicting or disparate information from diverse sources (`bimba_map`, `epii` agent, astrological services, user input).
*   **Maintaining Voice Consistency:** Ensuring the synthesized output consistently reflects Nara's unique persona, regardless of the source data's style.
*   **Scalability of Logic:** Designing synthesis logic that can handle an increasing number of information sources and types.
*   **Relevance and Coherence:** Ensuring the final output is not just a collection of facts but a coherent, relevant, and insightful piece of guidance.
*   **Avoiding Oversimplification/Overcomplication:** Balancing the depth of `bimba_map`'s symbolism with clear, actionable insights for the user.
*   **Iterative Refinement:** The system needs to be designed for ongoing learning and improvement of prompt strategies and synthesis logic.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Nara Agent Core Architecture (E4_F1):** Details on how Nara processes information and interacts with other components.
3.  **`bimba_map` (Neo4j) Integration Details (E4_F4_S1):** Schema, query mechanisms, and example data structures.
4.  **`epii` Agent Interface Specification:** How Nara communicates with `epii`, expected request/response formats.
5.  **User Context Data Model:** Structure of user profile, journey data (natal chart, oracle readings, journal themes), and current interaction state (active UI section, recent inputs).
6.  **Examples of Desired Nara Responses:** Sample outputs for various scenarios, showcasing the target voice, depth, and relevance.
7.  **Philosophical Grounding Documents:** Briefs on Atma-vichara, transcendent function, Svatantrya, Pratyabhijna to inform the AI's understanding of Nara's purpose.

## 6. Expected Outputs from AI Builder (Design for Prompt Engineering & Synthesis Logic)

1.  **Prompt Generation Module Design:**
    *   Logic for analyzing user context (current section, input, profile data) to identify information needs.
    *   Algorithms/heuristics for dynamically constructing tailored prompts for `bimba_map` (e.g., Cypher query templates).
    *   Algorithms/heuristics for dynamically constructing tailored prompts for the `epii` agent.
    *   Strategies for incorporating `bimba_map`'s symbolic language into prompts.
2.  **Information Synthesis Engine Design:**
    *   Architecture for receiving and pre-processing data from multiple sources.
    *   Methods for weighing information relevance and credibility from different sources.
    *   Logic for identifying connections, patterns, and themes across different data points, using `bimba_map` as a unifying framework.
    *   Strategies for handling conflicting information (e.g., prioritizing, presenting as paradox, seeking clarification).
3.  **Nara Voice & Narrative Transformation Module Design:**
    *   Techniques (e.g., NLP, templating, LLM-assisted rewriting if applicable) for transforming synthesized information into Nara's empathetic, wise, and supportive voice.
    *   Mechanisms to ensure narrative coherence with the user's ongoing journey and previous interactions.
4.  **`bimba_map` Epistemic Unification Strategy:**
    *   Specific ways the synthesis engine will leverage `bimba_map`'s structure and relationships to connect disparate insights and create a holistic understanding.
    *   Examples of how symbolic links in `bimba_map` can be used to bridge concepts from different sources.
5.  **Conflict Resolution and Ambiguity Handling Plan:**
    *   Decision trees or rule sets for managing situations where sources provide contradictory or ambiguous information.
    *   How to present such situations to the user in a way that encourages reflection (e.g., as koans or points for deeper Atma-vichara).
6.  **Iterative Refinement Framework:**
    *   Proposed metrics for evaluating the quality, relevance, and coherence of Nara's responses.
    *   A feedback loop mechanism for refining prompt templates, synthesis rules, and voice transformation techniques based on evaluations.
7.  **Example Scenarios with Detailed Flow:** For 2-3 key user interactions (e.g., asking a question in Journal, drawing an Oracle card, exploring Identity Dynamics), trace the flow from prompt generation through data retrieval, synthesis, and final response generation, highlighting how the logic works.

## 7. Prompt for Generative AI

```
As an AI Architect specializing in knowledge synthesis, advanced prompt engineering, and the creation of AI personas with deep philosophical grounding (particularly in contemplative traditions like Saivism and Jungian psychology), you are tasked with designing the core intelligence for the Nara agent, as detailed in User Story E4_F5_S1.

Nara's purpose is to guide users on a journey of self-realization (Pratyabhijna) by facilitating a dialogue between their conscious experience (Pramata) and deeper layers of wisdom (Cit-Shakti). This involves sophisticated prompt engineering (akin to Atma-vichara) to query sources like the `bimba_map` (a Neo4j knowledge graph of symbolic archetypes) and consult other specialized agents (e.g., `epii`). Crucially, Nara must then synthesize these diverse inputs into coherent, multi-layered insights, delivered in its unique empathetic and wise voice, leveraging `bimba_map`'s inherent epistemic unifications (reflecting Svatantrya and the interconnectedness of consciousness).

Based on the provided story, details of Nara's architecture, `bimba_map` integration, `epii` agent interface, user context model, and the philosophical principles (Atma-vichara, transcendent function, Svatantrya, Pratyabhijna), deliver a comprehensive design for Nara's Prompt Engineering and Synthesis Logic:

1.  **Prompt Generation Module Design:** Detail the logic for dynamically creating context-aware prompts for `bimba_map` and the `epii` agent, incorporating user data and symbolic language.
2.  **Information Synthesis Engine Design:** Architect the engine for receiving, pre-processing, weighing, and synthesizing data from multiple sources. Emphasize identifying connections and themes, using `bimba_map` as a unifying framework.
3.  **Nara Voice & Narrative Transformation Module Design:** Specify techniques for transforming synthesized data into Nara's distinct voice, ensuring narrative coherence with the user's journey.
4.  **`bimba_map` Epistemic Unification Strategy:** Explain how the synthesis engine will actively use `bimba_map` to connect disparate insights and create holistic understanding.
5.  **Conflict Resolution and Ambiguity Handling Plan:** Outline strategies for managing contradictory or ambiguous information, potentially presenting them as points for user reflection.
6.  **Iterative Refinement Framework:** Propose metrics and a feedback loop for continuously improving prompt strategies and synthesis logic.
7.  **Example Scenarios with Detailed Flow:** Illustrate the end-to-end process for 2-3 key user interactions, showcasing the prompt generation, data retrieval, synthesis, and response generation.

Your design must empower Nara to be a truly intelligent and insightful companion, transforming raw information into profound guidance that supports the user's individuation and recognition of their inherent divine nature (Paramashiva).
```