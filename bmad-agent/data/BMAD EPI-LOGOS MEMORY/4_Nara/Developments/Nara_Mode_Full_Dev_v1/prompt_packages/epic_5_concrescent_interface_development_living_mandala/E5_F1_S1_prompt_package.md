# AI Builder Prompt Package: E5_F1_S1 - Core Concrescence Rhythm UI/UX Flow

## 1. Overview

**Story ID:** E5_F1_S1
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F1 - Phase-Locked Progression & Triadic Flow Dynamics
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Implement the foundational UI/UX flow for the Nara application, guiding users (Pramata) through Identity Dynamics, Oracle, and Journal sections in a way that naturally reflects the 12-fold concrescence rhythm (Spanda). This aims to create a coherent, unfolding journey (Lila) that fosters organic growth and integration towards psychic wholeness.

## 2. Story Definition

**As a** User (Pramata, an experiencing subject on an individuation journey),
**I want** the Nara interface to guide me through the Identity Dynamics (exploring the Self and its archetypal expressions), Oracle (engaging with synchronicity and intuitive wisdom/Pratibha), and Journal (reflecting on personal experiences and insights – a process of Vimarsha) sections in a way that naturally reflects the 12-fold concrescence rhythm (a felt sense of Spanda, the pulse of becoming),
**So that** my interaction with the system feels like a coherent and unfolding journey (Lila, the divine play of consciousness actualizing its subjective aim), rather than a series of disconnected tools, fostering a sense of organic growth and integration towards psychic wholeness (satisfaction).

## 3. Technical Context & Design Philosophy

*   **Focus:** UI/UX flow design and implementation for the core triadic interaction (Identity Dynamics, Oracle, Journal).
*   **Concrescence Rhythm:** A 12-fold cycle representing a fundamental pattern of creative advance (Spanda), derived from Quaternal Logic principles. This rhythm should be implicitly felt through the UI's flow, not explicitly stated.
*   **Guided Navigation:** The system intelligently suggests or highlights next steps based on the user's current phase in a concrescence cycle and recent activities.
*   **Triadic Flow:** Identity -> Oracle -> Journal -> Identity (and variations).
*   **User Autonomy (Svatantrya):** Users can always override suggested navigation.
*   **Philosophical Grounding:** Pramata (experiencing subject), Pratibha (intuitive wisdom), Vimarsha (reflective consciousness), Spanda (divine pulse/vibration), Lila (divine play), Cit-Shakti (power of consciousness), Svatantrya (autonomy of consciousness), Quaternal Logic (underpinning the concrescence rhythm).

## 4. Constraints and Challenges

*   **Implicit Guidance:** Making the concrescence rhythm felt without being overly prescriptive or explicitly labeling phases.
*   **Phase Determination:** Accurately determining or inferring the user's current concrescence phase (or allowing intuitive user input).
*   **Balancing Guidance and Freedom:** Providing helpful suggestions without restricting user autonomy.
*   **Subtlety of Cues:** Designing visual cues that are noticeable but not intrusive.
*   **Initial Implementation Scope:** Focusing on logical flow and prompting, deferring deeper dynamic linkages.
*   **Integration with Nara Agent:** Ensuring the frontend can receive and act upon guidance from the backend Nara agent via `ag-ui` protocol regarding flow suggestions.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Conceptual Model of 12-Fold Concrescence Rhythm:** Explanation of the phases and their characteristics, and how they relate to Quaternal Logic.
3.  **Wireframes/Mockups of Identity Dynamics, Oracle, and Journal Sections:** Basic UI layouts.
4.  **`ag-ui` Protocol Specification:** Details on how frontend will receive guidance messages from Nara.
5.  **Nara Agent Capabilities (E4):** Understanding of how Nara might track user activity and infer concrescence phases.
6.  **Example User Scenarios:** Illustrating how a user might move through the sections and how the guidance would apply.
    *   *Scenario 1:* User completes a deep reflection in Identity Dynamics; UI suggests a specific Oracle spread.
    *   *Scenario 2:* User finishes an Oracle reading; UI prompts journaling on key symbols.
    *   *Scenario 3:* User identifies a major theme in Journal; UI suggests revisiting Identity Dynamics.

## 6. Expected Outputs from AI Builder (UI/UX Design & Frontend Implementation Plan)

1.  **UI Flow Diagrams:** Detailed diagrams illustrating the guided navigation paths between Identity Dynamics, Oracle, and Journal, showing decision points and prompts based on concrescence phases and user activity.
2.  **Concrescence Phase Tracking Logic (Frontend/Backend Interaction):**
    *   How the frontend communicates relevant user activity to the Nara agent.
    *   How Nara might determine/suggest the current concrescence phase.
    *   How this phase information is communicated back to the frontend to influence UI guidance via `ag-ui`.
3.  **Design of Visual Cues and Prompts:**
    *   Specific visual designs for highlighting suggested next steps (e.g., subtle animations, pathway indicators, contextual buttons/links).
    *   Wording and placement of prompts for guiding users to the next logical section.
4.  **User Override Mechanisms:** Clear and intuitive ways for users to ignore suggestions and navigate freely.
5.  **Frontend Implementation Plan for Guidance Logic:**
    *   How the frontend will interpret guidance messages from Nara (via `ag-ui`).
    *   How UI elements will dynamically update to reflect suggested flows.
    *   State management for current concrescence phase and user activity relevant to flow.
6.  **Interaction Design for Phase Indication (Optional/Subtle):** If any subtle, non-explicit indication of the concrescence rhythm is to be visually hinted at in the UI, design proposals for this.
7.  **Accessibility Considerations:** Ensuring guided navigation and visual cues are accessible.

## 7. Prompt for Generative AI

```
As a Senior UI/UX Designer and Frontend Architect with expertise in creating intuitive, flowing user experiences and a deep understanding of process philosophy (like Whitehead's concrescence) and symbolic systems (informed by Jungian psychology and contemplative traditions like Kashmir Saivism), you are tasked with designing the core UI/UX flow for the Nara application, as detailed in User Story E5_F1_S1.

The goal is to implement a guided navigation system across Nara's primary sections—Identity Dynamics, Oracle, and Journal—that implicitly reflects a 12-fold concrescence rhythm (Spanda, the pulse of becoming). This flow should feel like a coherent, unfolding journey (Lila), fostering organic growth and integration for the user (Pramata) while respecting their autonomy (Svatantrya). The system should intelligently suggest next steps based on the user's inferred concrescence phase and recent activities, communicated via the `ag-ui` protocol from the backend Nara agent.

Based on the provided story, a conceptual model of the 12-fold concrescence rhythm (derived from Quaternal Logic), basic wireframes, and the `ag-ui` protocol, deliver a comprehensive UI/UX design and frontend implementation plan:

1.  **UI Flow Diagrams:** Create detailed diagrams for the guided navigation paths (Identity -> Oracle -> Journal -> Identity, etc.), showing decision points and prompts based on concrescence phases and user activity.
2.  **Concrescence Phase Tracking & Communication Logic:** Describe how user activity is sent to Nara, how Nara might determine/suggest the phase, and how this guidance is received and interpreted by the frontend via `ag-ui`.
3.  **Design of Visual Cues and Prompts:** Propose specific, subtle visual designs (animations, highlights, contextual links) and prompt wording for guiding users.
4.  **User Override Mechanisms:** Detail how users can easily ignore suggestions and navigate freely.
5.  **Frontend Implementation Plan for Guidance Logic:** Outline how the frontend will dynamically update UI elements based on Nara's guidance and manage relevant state.
6.  **Interaction Design for Implicit Rhythm Indication (Optional):** If applicable, suggest subtle visual ways to hint at the underlying concrescence rhythm without explicit labeling.
7.  **Accessibility Considerations:** Ensure all proposed designs are accessible.

Your design should make the 12-fold concrescence rhythm a tangible, felt sense within the UI, guiding the user's dance of becoming (Lila) towards psychic wholeness and self-recognition (Pratyabhijna).
```