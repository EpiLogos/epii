# AI Builder Prompt Package: E1.F3.S4 - User Onboarding - Introduction to I Ching

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Story:** E1.F3.S4: User Onboarding - Introduction to I Ching
**Target AI:** Claude 4 (via AI Builder)
**Relevant Files Read:**
*   `story_E1_F3_S4_onboarding_i_ching_intro.md`
*   `epic-1.md`
*   `ui-ux-spec.md`
*   `E1_F3_EFDD.md` (Attempted, Not Found)

## 1. Overall Context from Epic 1

Epic 1, "Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation," aims to establish the core symbolic and experiential architecture for Nara. This involves creating a dynamic, generative matrix based on the user's unique existential signature, actualized through a six-layered, 64-fold resonance. The user's birthdate encoding is central. Key components include Astrological Natal Chart, Jungian Psychological Types, Gene Keys, Human Design, and a synthesized Archetypal Quintessence. The epic explicitly mentions the 64-fold logic (I Ching, codons, Gene Keys, HD gates) as a harmonizing principle. The user onboarding (Feature E1.F3) guides users through these layers, which will be explorable in the "Identity Dynamics" section.

## 2. Story Definition (E1.F3.S4)

This story focuses on the onboarding segment that introduces the I Ching (Book of Changes). The user's primary I Ching hexagram(s) might be derived from birth data or linked to Gene Keys/Human Design gates (as per Story 1.6 backend logic). This step is primarily informational.

The goal is to create an engaging UI screen that briefly explains the I Ching in the Nara context, informs the user their relevant hexagram(s) will be/have been identified, and sets expectations for deeper exploration in "Identity Dynamics."

**Acceptance Criteria Highlights:**
*   **AC1 (Frontend - UI/UX Design):** Clear, visually appealing UI for I Ching introduction, consistent with `ui-ux-spec.md`.
*   **AC2 (Frontend - Explanatory Content):** Engaging, easy-to-understand content explaining the I Ching's essence (e.g., ancient wisdom of change, 64 hexagrams).
*   **AC3 (Frontend - Connection to Other Layers):** UI communicates how I Ching insights might be derived (birth data, Gene Keys/Human Design linkage).
*   **AC4 (Frontend - Confirmation/Acknowledgement):** User acknowledges the introduction.
*   **AC5 (Backend - Trigger/Flag):** Ensure backend processes for hexagram identification (Story 1.6) are initiated if not automatic.
*   **AC6 (Frontend - Next Steps Indication):** Smooth transition in onboarding.
*   **AC7 (Responsiveness & Accessibility):** Adherence to `ui-ux-spec.md` standards.

## 3. Technical Context & Guidance

*   **Architecture:** Frontend (Shakti) interacts with backend (BPMCP), managing data in MongoDB (Mahamaya Matrix) and Neo4j (`bimba_map`).
*   **UI/UX Specification (`ui-ux-spec.md`):**
    *   **Overall Goals:** Transformative dialogue, co-creative meaning-making, symbolic input ease, clarity, reflective engagement.
    *   **Design Principles:** Clarity, consistency, feedback, Epi-Logos resonance, Quaternary Logic, Dynamic Triad (Identity Dynamics, Oracle, Journal), Personalized Archetypal Map, Rich Symbolic Environment, Recursive Interface Design.
    *   **Information Architecture:** "Identity Dynamics" -> "Mahamaya Ground" includes I Ching related insights (implicitly part of the 64-fold resonance with Gene Keys/HD).
    *   **User Flows:** "Mahamaya Ground Onboarding Flow" will incorporate this I Ching introduction step.
    *   **Visuals:** Symbolic, evocative imagery. I Ching elements (hexagrams, trigrams, yin-yang) are appropriate.
*   **Story-Specific Technical Guidance:**
    *   **Clarity and Brevity:** High-level, inviting introduction to the I Ching.
    *   **Visuals:** Use visuals effectively.
    *   **Derivation Method:** Be clear or appropriately nuanced about how hexagram(s) are determined.
*   **Dependencies:** Completion of E1.F3.S1 (birth data), potentially E1.F3.S3 (Gene Keys/HD intro if linked). Backend capabilities for I Ching hexagram identification (Story 1.6). `ui-ux-spec.md`.

## 4. Constraints & Assumptions

*   **Constraint:** Align with Nara architecture and Epi-Logos principles.
*   **Constraint:** UI consistent with `ui-ux-spec.md`.
*   **Assumption:** Informational step, no new user data input for I Ching.
*   **Open Question (from story):** How to address oracular vs. natal hexagram aspects? (Focus on natal/archetypal for onboarding). How specific to be about derivation method?

## 5. Inputs for AI Builder (Claude 4)

*   **User Story:** E1.F3.S4 (details above).
*   **Epic Context:** Epic 1 (details above, esp. 64-fold resonance).
*   **UI/UX Specifications:** `ui-ux-spec.md` (key aspects summarized).
*   **Required Technologies:** Modern JS framework (e.g., React, Vue, Svelte), HTML, CSS/SCSS, JS/TS.
*   **Backend Interaction:** Assume API endpoints for:
    *   Fetching introductory content for I Ching.
    *   Triggering/confirming I Ching hexagram identification (if per AC5).

## 6. Expected Outputs from AI Builder

1.  **Frontend Code (e.g., React/Vue/Svelte components):**
    *   An onboarding component for the I Ching introduction.
    *   Should display concise explanatory text (placeholder if needed).
    *   Visually indicate connection to user's data (birth info, Gene Keys/HD).
    *   Include user acknowledgement mechanism.
    *   Styled per `ui-ux-spec.md` (modern, symbolic, clear, accessible, responsive).
2.  **State Management Logic (Conceptual):** Integration into overall onboarding state.
3.  **API Call Placeholders:** If backend interaction for AC5 is needed.
4.  **Content Placeholders:** For I Ching introductory text.

## 7. Detailed Prompt for Claude 4

```prompt
As an expert full-stack developer, please generate the frontend code for a user onboarding screen that introduces the I Ching (Book of Changes). This is for an application called Nara, focused on symbolic insights and transformative dialogue.

**Project Context:**
*   **Application:** Nara.
*   **Current Task:** Implement a UI screen for the onboarding flow (Story E1.F3.S4) to introduce the I Ching.
*   **Core Principle:** The user has already provided birth data. This I Ching introduction is informational, confirming that their relevant I Ching hexagram(s) (linked to their overall archetypal makeup, possibly via Gene Keys/Human Design which operate on a 64-fold system like the I Ching) will be identified and explorable later in the "Identity Dynamics" section.
*   **Epic Goal:** Epic 1 establishes the "Mahamaya Ground," a 6-layered archetypal foundation emphasizing 64-fold resonance (I Ching, Gene Keys, HD gates).
*   **UI/UX Guidelines (`ui-ux-spec.md`):** Prioritize clarity, symbolic visual appeal, responsiveness, accessibility (WCAG 2.1 AA). The design should be modern and consistent with a system fostering transformative dialogue.

**Specific Requirements for this I Ching Introduction Screen (Story E1.F3.S4):**

1.  **Technology Stack:** Choose a modern JavaScript framework (React, Vue, or Svelte - please specify). Use HTML, CSS/SCSS, and JavaScript/TypeScript.

2.  **Component Structure:** Create a component for the I Ching introductory screen (e.g., `IChingIntroScreen`).

3.  **Content Display:**
    *   Display a brief, engaging explanation of the I Ching (e.g., "The I Ching, or Book of Changes, offers ancient wisdom on the patterns of energy and transformation through 64 hexagrams. Insights relevant to your unique blueprint will be available for exploration."). Use placeholder text if needed, but structure for it.
    *   Subtly communicate that these insights are connected to their previously provided data or other 64-fold systems like Gene Keys/Human Design.

4.  **Visuals:** Suggest where symbolic I Ching imagery (e.g., hexagrams, trigrams, yin-yang symbol) could be incorporated to enhance understanding and visual appeal.

5.  **User Acknowledgement:** Include a button (e.g., "Continue" or "Understood") for the user to proceed in the onboarding flow.

6.  **State Management (Conceptual):** This screen is part of a larger onboarding flow. Briefly note how it would signal completion to a parent/global state manager.

7.  **Backend Interaction (AC5 - Optional Trigger):**
    *   Assume I Ching hexagram identification (Story 1.6 backend logic) is mostly handled. If a specific trigger or flag confirmation from the frontend is sensible upon user acknowledgement, include a placeholder API call function (e.g., `confirmIChingProfileSetup()`).

8.  **Styling:** Provide basic CSS/SCSS for a visually appealing, modern, and symbolic presentation. Ensure responsiveness.

9.  **Accessibility:** Adhere to WCAG 2.1 AA principles.

**Deliverables:**
*   Frontend component code (specify framework).
*   Basic CSS/SCSS for styling.
*   Conceptual notes on state management integration.
*   Placeholder API call function if relevant for AC5.

**Focus on:** A clear, inviting introduction to the I Ching within the Nara context, managing user expectations for later exploration, and aligning with the overall UI/UX vision.
```

## 8. Review & Next Steps

*   Review generated code against story requirements.
*   Integrate final introductory content for the I Ching.
*   Confirm backend integration for hexagram identification if any frontend trigger is implemented.
*   Usability testing.
*   Proceed to the next onboarding story (likely Archetypal Quintessence reveal).