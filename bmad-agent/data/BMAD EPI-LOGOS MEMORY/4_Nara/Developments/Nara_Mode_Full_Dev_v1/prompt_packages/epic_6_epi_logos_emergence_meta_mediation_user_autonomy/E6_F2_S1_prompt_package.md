# AI Builder Prompt Package: E6_F2_S1 - Guided Self-Interpretation Tools

**Project:** Nara Concrescent Interface Development
**Epic:** E6 - Epi-Logos Emergence: Meta-Mediation & User Autonomy
**Feature:** E6_F2 - Cultivating Symbolic Literacy & Interpretive Autonomy
**Story ID:** E6_F2_S1 - Provide Guided Self-Interpretation Tools Rooted in Epi-Logos Epistemology: Cultivating Prehensive Dialogue and Concrescent Insight

## 1. Context Overview

This prompt package is for designing tools within Nara that facilitate guided self-interpretation. When significant symbols or patterns emerge (from Oracle, Journal, or Identity), Nara will offer guiding questions and frameworks derived from the `bimba_map`'s integrated knowledge. These tools aim to encourage a dia-logical engagement with the user's own experience, drawing on Jungian psychology, Shaivist Spanda, and Whiteheadian concrescence. The goal is to cultivate the user's ability to engage in symbolic dialogue, discern the movements of consciousness, and connect disparate prehensions, fostering autonomy and active participation in their Epi-Logos journey.

## 2. Story Definition (from E6_F2_S1)

**As a** User seeking to understand my experiences more deeply through the multi-perspectival lens of Epi-Logos (integrating Jungian, Shaivist, and Whiteheadian insights),
**I want** Nara to facilitate my self-exploration of symbols, feelings, and patterns of prehension by offering guiding questions and frameworks based on the `bimba_map`'s integrated knowledge. These tools should encourage a dia-logical engagement with my own experience, recognizing the Spanda (creative pulse) within symbols and the potential for novel concrescence (creative advance),
**So that** I can cultivate my own ability to engage in symbolic dialogue, discern the movements of consciousness, and connect disparate elements (prehensions) within my personal context (Identity, Oracle, Journal). This fosters autonomy in my Epi-Logos journey, moving beyond received interpretations to active participation in the co-creation of meaning and the realization of new satisfactions.

## 3. Technical & Philosophical Context

*   **Facilitator, Not Interpreter:** Nara shifts from providing answers to facilitating the user's own insight generation process. This is key to fostering autonomy.
*   **Dia-logical Engagement:** Tools encourage a Socratic and Bohmian dialogue with oneself and the symbolic material.
*   **`bimba_map` as a Source of Inquiry:** The knowledge graph (`bimba_map`) is used not for definitive interpretations, but to generate relevant, thought-provoking questions that open up avenues for exploration.
*   **Multi-Perspectival Questioning:** Questions are framed to evoke:
    *   **Jungian insights:** Personal associations, shadow aspects, archetypal resonances.
    *   **Shaivist awareness:** Somatic resonance (Spanda), contractive/expansive qualities of energy.
    *   **Whiteheadian process:** Nature of prehensions (positive/negative), potential for novel concrescence and creative advance.
*   **Epi-Logos Epistemology:** The process is rooted in Epi-Logos principles: synthesis of opposites, immanent consciousness, active meaning-making, praxical philosophy.

## 4. Constraints & Design Challenges

*   **Formulating Effective Guiding Questions:** Designing questions that are open-ended yet specific enough to guide exploration without leading the user to a predetermined answer.
*   **`bimba_map` Integration for Question Generation:** Developing logic to translate `bimba_map` relationships and concepts into relevant questions.
*   **Contextual Sensitivity:** Tailoring questions appropriately to the specific symbol, its source (Oracle, Journal, Identity), and the user's current state (e.g., alchemical phase from E6_F1_S1).
*   **Avoiding Overwhelm:** Presenting a manageable number of insightful questions rather than a barrage.
*   **UI for Interaction:** Designing an intuitive interface for users to engage with these questions and potentially record their reflections.
*   **Balancing Guidance and Autonomy:** Providing enough framework to be helpful without undermining the user's sense of ownership over their interpretations.

## 5. Inputs for AI Builder

1.  **User Story Document:** `story_E6_F2_S1_guided_self_interpretation_tools.md`.
2.  **`bimba_map` Specification & Sample Data:** Details of the `bimba_map` structure, content, and how it encodes Jungian, Shaivist, Whiteheadian, and general symbolic relationships and epistemological principles relevant to Epi-Logos.
3.  **Epi-Logos Epistemology Guide:** A document outlining the core principles of Epi-Logos's approach to knowledge, meaning-making, and self-exploration (dia-logical engagement, synthesis, Spanda, concrescence, praxical philosophy).
4.  **NLP Capabilities:** Information on existing NLP tools for identifying symbols, patterns, and affective tones in user input.
5.  **Outputs from E6_F1_S1 (Alchemical Phase Detection):** To allow contextual tailoring of questions.
6.  **Examples of Symbols/Patterns for Exploration:** 2-3 scenarios illustrating a symbol or pattern a user might want to explore (e.g., a recurring dream image, a challenging Tarot card, a persistent feeling).
7.  **Principles of Socratic & Bohmian Dialogue:** Brief overview of these dialogical approaches as they might apply to self-reflection.

## 6. Expected Outputs from AI Builder

1.  **Question Generation Framework:**
    *   Logic for how Nara will use the `bimba_map` and Epi-Logos epistemological principles to formulate guiding questions related to a specific symbol, pattern, or feeling.
    *   Categorization of question types (e.g., personal association, somatic awareness (Spanda), archetypal connection (Jungian), prehensive analysis (Whiteheadian), potential for concrescence).
    *   Examples of question sets generated for the provided scenarios.
2.  **Contextualization Logic:**
    *   How the selection and phrasing of questions will be adapted based on the source of the symbol (Oracle, Journal, Identity) and the user's current alchemical phase (from E6_F1_S1).
3.  **UI/UX Design for Guided Self-Interpretation:**
    *   Mockups or detailed descriptions of how the 'Explore this Symbol/Pattern Further' option is presented.
    *   Interface design for displaying guiding questions and potentially an interactive journaling space for responses.
    *   How optional educational snippets about Epi-Logos principles might be accessed.
4.  **Interaction Flow Design:**
    *   Step-by-step flow of how a user would engage with this feature, from encountering a symbol to reflecting on the guiding questions.
5.  **Language and Tone Guidelines:**
    *   Specific recommendations for the language used in questions and any accompanying text to ensure it is invitational, non-definitive, and empowering.
6.  **Integration with Journal Module:**
    *   How reflections generated through this tool can be optionally saved or linked within the user's main Journal.
7.  **Documentation Plan for `BMAD EPI-LOGOS MEMORY`:**
    *   Outline of how the question generation framework, UI design, and underlying Epi-Logos principles for this feature will be documented.

## 7. Prompt for Generative AI

```
As an AI system architect and expert in human-computer interaction, with profound knowledge of depth psychology (Jungian), contemplative practices (Shaivist Spanda awareness), process philosophy (Whiteheadian thought), and dialogical methods (Socratic, Bohmian), you are tasked with designing Guided Self-Interpretation Tools for the Nara application, as per User Story E6_F2_S1.

**Objective:** Develop a comprehensive plan for Nara to facilitate user self-exploration of symbols, feelings, and patterns. Nara will offer guiding questions and frameworks derived from the `bimba_map`'s integrated knowledge (Jungian, Shaivist, Whiteheadian) and Epi-Logos epistemology. The goal is to cultivate user autonomy in symbolic dialogue, meaning-making, and the co-creation of concrescent insight, shifting Nara from an interpreter to a facilitator.

**Given Inputs (assume access to):
1.  User Story E6_F2_S1.
2.  Detailed `bimba_map` specifications, including its encoding of symbolic, philosophical, and epistemological relationships.
3.  An Epi-Logos Epistemology Guide detailing its approach to dia-logical engagement, synthesis, Spanda, concrescence, and praxical philosophy.
4.  Information on Nara's NLP capabilities.
5.  Outputs from the Alchemical Phase Detection system (E6_F1_S1).
6.  Illustrative scenarios of symbols/patterns for user exploration.
7.  Principles of Socratic & Bohmian dialogue.

**Produce the Following Outputs (as detailed in Section 6 of the Prompt Package E6_F2_S1_prompt_package.md):

1.  **Question Generation Framework:** How will Nara use the `bimba_map` and Epi-Logos epistemology to formulate guiding questions? Provide categories and examples for different scenarios.

2.  **Contextualization Logic:** How will questions be tailored to the symbol's source and the user's current alchemical phase?

3.  **UI/UX Design for Guided Self-Interpretation:** Design the interface for presenting the exploration option, displaying questions, and facilitating user reflection (e.g., interactive journaling space).

4.  **Interaction Flow Design:** Detail the user's step-by-step journey with this feature.

5.  **Language and Tone Guidelines:** Recommend language that is invitational, non-definitive, and empowering.

6.  **Integration with Journal Module:** How can user reflections be saved or linked within the Journal?

7.  **Documentation Plan for `BMAD EPI-LOGOS MEMORY`:** Outline the documentation strategy for this feature.

**Key Considerations for Your Design:**
*   **Fostering Autonomy:** The design must prioritize empowering the user's own interpretive capacities.
*   **Depth of Inquiry:** Questions should encourage profound reflection, drawing on the richness of the integrated philosophical framework.
*   **User Experience:** The interaction should feel natural, supportive, and insightful, not like an interrogation or a test.
*   **Non-Prescriptive Guidance:** Ensure the system guides exploration without imposing interpretations.
*   **Epi-Logos Alignment:** The entire feature should embody the core epistemological and praxical principles of Epi-Logos.

Present your response in a structured format, addressing each of the 7 output points with clear, actionable technical, design, and philosophical details.
```