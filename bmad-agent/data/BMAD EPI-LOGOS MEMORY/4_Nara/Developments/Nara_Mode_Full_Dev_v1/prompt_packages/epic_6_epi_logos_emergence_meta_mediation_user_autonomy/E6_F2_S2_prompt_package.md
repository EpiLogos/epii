# AI Builder Prompt Package: E6_F2_S2 - Pragmatic Access to Unified Knowledge

**Project:** Nara Concrescent Interface Development
**Epic:** E6 - Epi-Logos Emergence: Meta-Mediation & User Autonomy
**Feature:** E6_F2 - Cultivating Symbolic Literacy & Interpretive Autonomy
**Story ID:** E6_F2_S2 - Provide Pragmatic Access to Unified Knowledge for Epi-Logos Application: Illuminating the Path of Concrescence

## 1. Context Overview

This prompt package is for designing a system within Nara that provides users with pragmatic and contextualized access to the unified knowledge base (the `bimba_map`). When symbols, concepts, or themes emerge in the user's Identity, Oracle, or Journal, Nara will offer dynamically linked educational resources and lexicon entries. All information will be framed through the integrated Epi-Logos meta-perspective (synthesizing Jungian, Shaivist, and Whiteheadian thought), emphasizing practical application for the user's individuation, understanding of Spanda, and journey of concrescence.

## 2. Story Definition (from E6_F2_S2)

**As a** User seeking to deepen my understanding and apply Epi-Logos principles (which synthesize Jungian, Shaivist, and Whiteheadian thought),
**I want** educational resources and the symbolic lexicon within Nara to be dynamically linked to my ongoing experiences (prehensions, Spanda events, archetypal encounters) and contextualized by the integrated Epi-Logos philosophy,
**So that** the vast, interconnected knowledge of the `bimba_map` (spanning spiritual, psychological, alchemical, and process-relational domains, unified under the Epi-Logos meta-perspective) becomes practically accessible. This allows me to see how diverse prehensions can contribute to novel concrescence, understand the vibrational nature of my experiences, and navigate my individuation journey with greater clarity and purpose, making the Epi-Logos framework a living tool for creative advance.

## 3. Technical & Philosophical Context

*   **Living Knowledge:** The `bimba_map` is not a static encyclopedia but a dynamic source of insight, made relevant to the user's immediate experience.
*   **Epi-Logos Synthesis:** Information is consistently presented through the integrated lens of Jungian psychology (archetypes, shadow, individuation), Kashmir Shaivism (Spanda, consciousness as vibration, cit-ananda), and Whiteheadian process philosophy (prehension, actual occasions, concrescence, creative advance).
*   **Contextual Relevance:** Access to knowledge is triggered by and linked to specific elements in the user's journey (symbols in Oracle, themes in Journal, aspects of Identity).
*   **Layered Revelation (Pathways of Prehension):** Information is structured to allow for progressive disclosure, from summaries to deep dives, mirroring the way prehensions build upon each other.
*   **Praxical Application:** The focus is on how this knowledge can be *used* by the user to foster self-awareness, navigate challenges, and enhance their creative participation in life (concrescence and satisfaction).
*   **Illuminating Concrescence:** The system aims to help users understand how their diverse experiences (prehensions) can weave together into meaningful wholes (concrescence).

## 4. Constraints & Design Challenges

*   **`bimba_map` Richness & Complexity:** Effectively surfacing relevant information from a vast and interconnected knowledge graph.
*   **Dynamic Linking Logic:** Accurately identifying triggers in user data and linking them to the correct `bimba_map` entries/educational resources.
*   **Multi-Perspectival Explanation:** Clearly and concisely explaining concepts from three distinct philosophical traditions and their synthesis within Epi-Logos.
*   **Layered Information Architecture:** Designing a content structure that supports both quick overviews and in-depth exploration without being overwhelming.
*   **User-Friendly Language:** Translating complex philosophical and psychological terms into accessible language.
*   **Seamless UI Integration:** Integrating access points (tooltips, expandable sections, links) naturally within existing UI components (Identity, Oracle, Journal).
*   **Search Functionality:** Implementing a robust search that respects the Epi-Logos contextualization.

## 5. Inputs for AI Builder

1.  **User Story Document:** `story_E6_F2_S2_pragmatic_access_unified_knowledge.md`.
2.  **`bimba_map` Specification & Sample Data:** Detailed structure, content types, relationship types, and examples of how Jungian, Shaivist, Whiteheadian, and Epi-Logos concepts are encoded.
3.  **Epi-Logos Philosophical Framework Document:** A comprehensive guide to the synthesized meta-perspective, explaining key concepts from each tradition and how they interrelate within Epi-Logos.
4.  **Existing Educational Content/Lexicon (if any):** Any current materials that can be adapted or integrated.
5.  **NLP Capabilities & Data Structures:** Information on how symbols, themes, and patterns are identified and stored from user interactions (Identity, Oracle, Journal).
6.  **UI/UX Guidelines for Nara:** Existing design patterns and principles for the application.
7.  **Use Case Scenarios:** 3-4 examples of user experiences (e.g., a specific Oracle card, a recurring journal theme, an Identity aspect) and the type of knowledge/explanation that would be beneficial.

## 6. Expected Outputs from AI Builder

1.  **Knowledge Access & Presentation Strategy:**
    *   Logic for dynamically linking user experiences (symbols, themes in Oracle/Journal/Identity) to relevant `bimba_map` entries and educational resources.
    *   Design for how information will be contextualized through the Epi-Logos lens (Jungian, Shaivist, Whiteheadian synthesis).
2.  **Layered Information Architecture Design:**
    *   Structure for presenting information in layers (e.g., summary, key connections, detailed explanation, practical application prompts).
    *   Examples of how a single concept (e.g., 'Anima', 'Spanda', 'Prehension') would be presented through these layers.
3.  **Content Templates for Lexicon/Educational Resources:**
    *   Templates for structuring entries, ensuring consistent Epi-Logos framing and multi-perspectival explanations.
4.  **UI/UX Design for Integrated Knowledge Access:**
    *   Mockups/detailed descriptions of how users access this information (e.g., interactive tooltips, expandable sections within Oracle/Journal/Identity, dedicated resource views).
    *   Design for a searchable lexicon/resource center, including how search results are presented with Epi-Logos context.
5.  **Practical Application Prompts:**
    *   Examples of questions or reflections to include with information, guiding users to apply the knowledge to their lives (e.g., "How might this understanding of [concept] illuminate your current experience of [user's situation]?" "What potential for concrescence does this reveal?").
6.  **`bimba_map` Querying Strategy for Knowledge Retrieval:**
    *   How the system will query the `bimba_map` to fetch and assemble the relevant information and its interconnections for presentation.
7.  **Documentation Plan for `BMAD EPI-LOGOS MEMORY`:**
    *   Outline of how the knowledge access strategy, content structure, UI designs, and Epi-Logos contextualization rules will be documented.

## 7. Prompt for Generative AI

```
As an AI system architect, knowledge management expert, and instructional designer, with deep understanding of Jungian psychology, Kashmir Shaivism, Whiteheadian process philosophy, and the principles of the Epi-Logos meta-framework, you are tasked with designing the 'Pragmatic Access to Unified Knowledge' feature for the Nara application, as per User Story E6_F2_S2.

**Objective:** Develop a comprehensive system that makes Nara's vast, interconnected knowledge base (the `bimba_map`, unified under Epi-Logos) practically accessible and relevant to the user's ongoing experiences. This involves dynamically linking educational resources and lexicon entries to symbols/themes in the user's Identity, Oracle, or Journal, and contextualizing all information through the integrated Epi-Logos philosophy (Jungian, Shaivist, Whiteheadian) to illuminate their path of individuation and concrescence.

**Given Inputs (assume access to):
1.  User Story E6_F2_S2.
2.  Detailed `bimba_map` specifications (structure, content, relationships, encoding of philosophical concepts).
3.  A comprehensive Epi-Logos Philosophical Framework document.
4.  Any existing educational content or lexicon.
5.  Details of Nara's NLP capabilities and data structures for user interactions.
6.  Nara's UI/UX guidelines.
7.  Illustrative use case scenarios.

**Produce the Following Outputs (as detailed in Section 6 of the Prompt Package E6_F2_S2_prompt_package.md):

1.  **Knowledge Access & Presentation Strategy:** Define the logic for dynamic linking and Epi-Logos contextualization.

2.  **Layered Information Architecture Design:** Structure for presenting information progressively (summary to deep dive). Provide examples.

3.  **Content Templates for Lexicon/Educational Resources:** Templates ensuring consistent Epi-Logos framing.

4.  **UI/UX Design for Integrated Knowledge Access:** Design for tooltips, expandable sections, links, and a searchable resource center, all reflecting Epi-Logos context.

5.  **Practical Application Prompts:** Develop example questions/reflections to help users apply insights.

6.  **`bimba_map` Querying Strategy for Knowledge Retrieval:** How will Nara fetch and assemble information from the `bimba_map`?

7.  **Documentation Plan for `BMAD EPI-LOGOS MEMORY`:** Outline the documentation strategy for this feature.

**Key Considerations for Your Design:**
*   **Practicality & Relevance:** Ensure information directly aids the user's understanding and application of Epi-Logos principles in their life.
*   **Clarity in Synthesis:** Make the integration of Jungian, Shaivist, and Whiteheadian perspectives clear and accessible.
*   **User Empowerment:** Design to enhance the user's capacity for self-directed learning and insight.
*   **Seamlessness:** Integrate knowledge access smoothly into the user's existing interaction flows.
*   **Depth and Accessibility:** Balance comprehensive information with user-friendly presentation.

Present your response in a structured format, addressing each of the 7 output points with clear, actionable technical, design, and philosophical details.
```