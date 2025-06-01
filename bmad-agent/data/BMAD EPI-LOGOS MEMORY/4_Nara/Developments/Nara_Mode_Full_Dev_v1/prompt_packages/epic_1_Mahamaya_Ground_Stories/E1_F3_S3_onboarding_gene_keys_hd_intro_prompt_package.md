# AI Builder Prompt Package: E1.F3.S3 - User Onboarding - Introduction to Gene Keys & Human Design

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Story:** E1.F3.S3: User Onboarding - Introduction to Gene Keys & Human Design
**Target AI:** Claude 4 (via AI Builder)
**Relevant Files Read:**
*   `story_E1_F3_S3_onboarding_gene_keys_hd_intro.md`
*   `epic-1.md`
*   `ui-ux-spec.md`
*   `E1_F3_EFDD.md` (Attempted, Not Found)

## 1. Overall Context from Epic 1

Epic 1, "Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation," aims to establish the core symbolic and experiential architecture for Nara. This involves creating a dynamic, generative matrix based on the user's unique existential signature, actualized through a six-layered, 64-fold resonance. The user's birthdate encoding is central to this, acting as a root key for symbolic mappings. Key components include the Astrological Natal Chart, Jungian Psychological Types, Gene Keys, Human Design, and a synthesized Archetypal Quintessence, all stored in the Mahamaya Matrix (MongoDB) and related to the `bimba_map` (Neo4j) for universal symbolic knowledge.

The epic emphasizes that the user onboarding process (Feature E1.F3) will guide users through these layers, and the "Identity Dynamics" section will house these systems for deeper exploration.

## 2. Story Definition (E1.F3.S3)

This story focuses on the onboarding segment that introduces Gene Keys and Human Design concepts. After birth data collection (E1.F3.S1), this step aims to:
1.  Briefly explain Gene Keys and Human Design within the Nara context.
2.  Inform users that their profiles for these systems will be/have been generated from their birth details.
3.  Set expectations for deeper exploration within the "Identity Dynamics" section.

The goal is to create engaging, informative UI screens that achieve this without overwhelming the user.

**Acceptance Criteria Highlights:**
*   **AC1 (Frontend - UI/UX Design):** Clear, visually appealing UI for introducing Gene Keys and Human Design, consistent with `ui-ux-spec.md`.
*   **AC2 (Frontend - Explanatory Content):** Engaging, easy-to-understand content explaining the essence of Gene Keys and Human Design.
*   **AC3 (Frontend - Connection to Birth Data):** UI clearly communicates profiles are derived from birth info.
*   **AC4 (Frontend - Confirmation/Acknowledgement):** User acknowledges introductions.
*   **AC5 (Backend - Trigger/Flag):** Ensure backend processes for profile generation are initiated if not automatic.
*   **AC6 (Frontend - Next Steps Indication):** Smooth transition to next onboarding step or indication of later exploration.
*   **AC7 (Responsiveness & Accessibility):** Adherence to `ui-ux-spec.md` standards.

## 3. Technical Context & Guidance

*   **Architecture:** The system uses a frontend (Shakti aspect) interacting with backend services (BPMCP - BMad Process & Meta-Context Orchestration Platform) which manage data in MongoDB (Mahamaya Matrix for user-specific data) and Neo4j (`bimba_map` for universal symbolic knowledge).
*   **UI/UX Specification (`ui-ux-spec.md`):**
    *   **Overall Goals:** Transformative dialogue, co-creative meaning-making, ease of symbolic input, clarity in interpretation, reflective engagement.
    *   **Design Principles:** Clarity, consistency, feedback, resonance with Epi-Logos, facilitate dialogue, Quaternary Logic Integration, Dynamic Triad (Identity Dynamics, Oracle, Journal), Personalized Archetypal Map, Rich Symbolic Environment, Reflective Mirror, Recursive Interface Design, Multimodal Experience.
    *   **Information Architecture:** The "Identity Dynamics" section includes "Mahamaya Ground," which in turn contains "Gene Keys" and "Human Design."
    *   **User Flows:** The "Mahamaya Ground Onboarding Flow" includes steps to "Display Gene Keys profile" and "Display Human Design chart."
    *   **Visuals:** Emphasize symbolic and evocative imagery. The Mahamaya Ground could be an interactive visual (e.g., six-petaled flower).
    *   **Accessibility:** WCAG 2.1 AA.
    *   **Responsiveness:** Adaptable layouts for various screen sizes.
*   **Story-Specific Technical Guidance:**
    *   **Simplicity:** Avoid overwhelming users with full depth at this stage; focus on awareness and anticipation.
    *   **Visual Appeal:** Use visuals to make concepts intriguing.
    *   **Terminology:** Use accessible language.
    *   **User Control:** Ensure users understand what's happening with their data.
    *   **Timing of Profile Generation:** The story notes a developer comment from Epic 1: "collaboration on the details will be needed" for Gene Keys, implying nuance in how profile generation is communicated during onboarding.
*   **Dependencies:** Completion of E1.F3.S1 (birth data collection), backend capabilities for Gene Keys (Story 1.4) and Human Design (Story 1.5) profile generation, `ui-ux-spec.md`, and a content strategy.

## 4. Constraints & Assumptions

*   **Constraint:** Must align with the overall Nara architecture and Epi-Logos principles.
*   **Constraint:** UI must be consistent with `ui-ux-spec.md`.
*   **Assumption:** Users will not input new data for Gene Keys/Human Design at this stage; it's informational.
*   **Open Question (from story):** How to message if Gene Keys/HD systems require further user interaction later? Will there be any interactive element (e.g., gauge interest)? For this prompt, assume a simple informational display with acknowledgement.

## 5. Inputs for AI Builder (Claude 4)

*   **User Story:** E1.F3.S3 (details above).
*   **Epic Context:** Epic 1 (details above).
*   **UI/UX Specifications:** `ui-ux-spec.md` (key aspects summarized above).
*   **Required Technologies (Implied):** Frontend framework (e.g., React, Vue, Svelte - assume a modern JS framework), HTML, CSS/SCSS, JavaScript/TypeScript.
*   **Backend Interaction:** Assume API endpoints exist or will be created for:
    *   Fetching introductory content for Gene Keys and Human Design (if not hardcoded).
    *   Triggering/confirming Gene Keys profile generation (if necessary, as per AC5).
    *   Triggering/confirming Human Design profile generation (if necessary, as per AC5).

## 6. Expected Outputs from AI Builder

1.  **Frontend Code (e.g., React/Vue/Svelte components):**
    *   A main onboarding component managing the flow for Gene Keys and Human Design introductions.
    *   Separate UI components for the Gene Keys introduction screen(s).
    *   Separate UI components for the Human Design introduction screen(s).
    *   These components should:
        *   Display concise, engaging explanatory text (placeholder text can be used if final content isn't provided, but structure for it should be clear).
        *   Visually indicate that these profiles are derived from the user's birth data.
        *   Include a mechanism for user acknowledgement (e.g., a "Continue" or "Got it" button).
        *   Be styled according to `ui-ux-spec.md` principles (modern, symbolic, clear, accessible).
        *   Be responsive.
2.  **State Management Logic (Conceptual):** How these steps integrate into an overall onboarding flow state.
3.  **API Call Placeholders:** If backend interaction is needed (AC5), include placeholder functions for API calls.
4.  **Content Placeholders:** Clearly marked placeholders for the actual introductory text for Gene Keys and Human Design.

## 7. Detailed Prompt for Claude 4

```prompt
As an expert full-stack developer, please generate the frontend code and related logic for a user onboarding segment that introduces Gene Keys and Human Design concepts. This is part of a larger application called Nara, which aims to provide users with deep symbolic insights based on their unique archetypal makeup.

**Project Context:**
*   **Application:** Nara - a system for symbolic interpretation and transformative dialogue.
*   **Current Task:** Implement UI screens for the onboarding flow (Story E1.F3.S3) to introduce Gene Keys and Human Design.
*   **Core Principle:** The user has already provided their birth date, time, and location in a previous step (E1.F3.S1). These introductions are primarily informational, confirming that their Gene Keys and Human Design profiles will be/have been generated from this data and will be explorable later in the "Identity Dynamics" section of the app.
*   **Epic Goal:** Epic 1 focuses on establishing the "Mahamaya Ground," a 6-layered archetypal foundation including Gene Keys and Human Design.
*   **UI/UX Guidelines:** Adhere to the principles in `ui-ux-spec.md`. Key aspects include clarity, visual appeal (symbolic, modern), responsiveness, accessibility (WCAG 2.1 AA), and consistency with a design system that emphasizes transformative dialogue and quaternary logic. The Mahamaya Ground is envisioned as an interactive visual, and these introductory screens should align with that aesthetic.

**Specific Requirements for this Onboarding Segment (Story E1.F3.S3):**

1.  **Technology Stack:** Assume a modern JavaScript framework like React, Vue, or Svelte for the frontend. Provide code in that chosen framework (please specify which one you choose). Use HTML, CSS/SCSS, and JavaScript/TypeScript.

2.  **Component Structure:**
    *   Create a main parent component for this onboarding segment (e.g., `GeneKeysHumanDesignIntroFlow`).
    *   Create a reusable child component for an introductory screen (e.g., `IntroductoryScreen`) that can be used for both Gene Keys and Human Design with different content.

3.  **Gene Keys Introduction Screen(s):**
    *   **Content:** Display a brief, engaging explanation of Gene Keys (e.g., "Gene Keys are archetypal codes for personal transformation, derived from your birth data."). Use placeholder text if needed, but structure for it.
    *   **Visuals:** Suggest where symbolic imagery related to Gene Keys (e.g., 64-grid motif) could be incorporated.
    *   **Acknowledgement:** Include a button (e.g., "Continue" or "Learn More Later") for the user to proceed.

4.  **Human Design Introduction Screen(s):**
    *   **Content:** Display a brief, engaging explanation of Human Design (e.g., "Human Design reveals your unique energetic blueprint and decision-making strategy, based on your birth details."). Use placeholder text.
    *   **Visuals:** Suggest where symbolic imagery related to Human Design (e.g., simplified Bodygraph motif) could be incorporated.
    *   **Acknowledgement:** Include a button to proceed.

5.  **Flow Management:** The parent component should manage the sequence (e.g., show Gene Keys intro, then Human Design intro).

6.  **State Management (Conceptual):** Briefly describe or show how this segment would update an overall onboarding progress state (e.g., dispatching an action or updating a reactive variable).

7.  **Backend Interaction (AC5 - Optional Trigger):**
    *   The story mentions that if profile generation isn't automatic, this step should trigger it. For now, assume profile generation for Gene Keys (Story 1.4) and Human Design (Story 1.5) is handled elsewhere or automatically upon birth data submission. However, if you deem it essential for this UI step to *confirm* or *ensure* a flag is set, include placeholder API call functions (e.g., `triggerGeneKeysProfileGeneration()`, `triggerHumanDesignProfileGeneration()`) that could be called upon user acknowledgement.
    *   **Developer Note from Epic 1 for Gene Keys:** "collaboration on the details will be needed." This implies the full profile might not be auto-generated. The UI should communicate this nuance if applicable (e.g., "Your Gene Keys framework is being prepared for exploration."). For this prompt, lean towards a message that sets expectations for later exploration rather than immediate full reveal, unless the trigger is simple.

8.  **Styling:** Provide basic CSS/SCSS to ensure the screens are visually appealing, modern, and hint at the symbolic nature of the content. Ensure responsiveness.

9.  **Accessibility:** Keep WCAG 2.1 AA principles in mind (e.g., sufficient contrast, keyboard navigability for buttons).

**Deliverables:**
*   Frontend component code (specify framework).
*   Basic CSS/SCSS for styling.
*   Conceptual notes on state management integration.
*   Placeholder API call functions if deemed necessary for AC5.

**Focus on:** Clarity, user engagement, adherence to UI/UX principles, and setting correct expectations for the user about their Gene Keys and Human Design profiles within Nara.
```

## 8. Review & Next Steps

*   Review generated code for alignment with story requirements and UI/UX principles.
*   Integrate actual content for Gene Keys and Human Design introductions.
*   Connect with backend team to confirm API endpoints for profile generation triggers if necessary.
*   Perform usability testing.
*   Proceed to the next story in the onboarding feature (e.g., I Ching introduction).