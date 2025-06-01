# AI Builder Prompt Package: E1.F3.S2 - User Onboarding - Jungian Psychological Type Assessment

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Sub-Feature:** Integrating Jungian Type Assessment into the Onboarding Flow
**Source Story File:** `story_E1_F3_S2_onboarding_jungian_assessment.md`
**Source Epic File:** `epic-1.md`
**Source UI/UX Spec:** `ui-ux-spec.md`
**Source EFDD File:** `E1_F3_EFDD.md` (Not Found)

## 1. Story Definition (from `story_E1_F3_S2_onboarding_jungian_assessment.md`)

This story focuses on integrating a Jungian psychological type assessment into the user onboarding flow. After providing their birth details (Story E1.F3.S1), users will be guided to complete an assessment to determine their 16-type profile (e.g., similar to Myers-Briggs Type Indicator - MBTI, but potentially a custom or open-source variant aligned with Nara's philosophy). This determined type will then be mapped to one of the four alchemical elements (Fire, Water, Air, Earth) as per `epic-1.md`.

The goal is to design and implement the UI for presenting the assessment, capture user responses, calculate their Jungian type and corresponding element, and store this information in their Mahamaya Matrix.

## 2. Acceptance Criteria (from `story_E1_F3_S2_onboarding_jungian_assessment.md`)

*   **AC1 (Frontend - UI/UX Design):** A clear and engaging UI/UX for the Jungian assessment is designed as part of the onboarding flow, consistent with `ui-ux-spec.md`.
    *   Includes introduction to the assessment and its purpose.
    *   Presents questions and response options clearly.
*   **AC2 (Frontend - Assessment Implementation):** The assessment questions and response logic are implemented in the frontend.
*   **AC3 (Backend - Type Calculation):** Logic is implemented (either frontend or backend, depending on assessment complexity and IP) to calculate the user's Jungian type based on their responses.
*   **AC4 (Backend - Element Mapping):** Logic is implemented to map the calculated Jungian type to one of the four alchemical elements.
*   **AC5 (Backend - Data Submission & Storage):** The user's assessment responses (optional, for review/retake), calculated Jungian type, and mapped alchemical element are securely submitted to the backend and stored in their Mahamaya Matrix (linking to Story 1.3 data points).
*   **AC6 (Frontend - Results Presentation - Basic):** After completing the assessment, the user is shown their determined Jungian type and its corresponding alchemical element in a simple, understandable way within the onboarding flow.
*   **AC7 (Frontend - Progress & Navigation):** The assessment step is integrated into the overall onboarding progress, allowing users to potentially save and continue later if the assessment is lengthy.
*   **AC8 (Responsiveness & Accessibility):** The assessment UI is responsive and adheres to accessibility standards (WCAG 2.1 AA) as per `ui-ux-spec.md`.

## 3. Technical Context & Constraints

*   **Epic Context (from `epic-1.md`):**
    *   The Mahamaya Ground involves integrating a 16-type Jungian assessment, mapping each type to one of the four alchemical elements (Fire, Water, Air, Earth).
    *   This yields a “psychological alchemy” profile, contextualizing guidance within the user’s elemental psyche.
    *   User onboarding guides users through these layers.
    *   Backend systems (Mahamaya Matrix - MongoDB) store this multi-layered user context.
*   **UI/UX Specification (from `ui-ux-spec.md`):**
    *   The UI/UX should visually and functionally embody the four-fold structure.
    *   The "Identity Dynamics" section is where users explore their archetypal profile, including the Mahamaya Ground.
    *   The Mahamaya Ground Onboarding Flow includes: User provides birthdate -> Nara generates Natal Chart -> User completes Jungian Psychological Types assessment -> Nara displays Gene Keys profile -> Nara displays Human Design chart -> Nara synthesizes Archetypal Quintessence.
    *   Adherence to WCAG 2.1 AA for accessibility.
    *   Responsive design for mobile, tablet, and desktop.
    *   Consistent branding, color palette, typography, iconography, spacing, and grid as defined in the global design system and `ui-ux-spec.md`.
*   **Story Specific Technical Guidance (from `story_E1_F3_S2_onboarding_jungian_assessment.md`):**
    *   Assessment Choice/Creation: If using an existing model like MBTI, be mindful of licensing. Creating a custom assessment requires psychometric considerations.
    *   Calculation Logic: If complex, server-side calculation might be better.
    *   User Experience: Keep it engaging, provide clear instructions, manage expectations about length.
    *   Ethical Considerations: State it's for self-exploration, not clinical diagnosis.
    *   Saving Progress: Important for longer assessments.
*   **Dependencies (from `story_E1_F3_S2_onboarding_jungian_assessment.md`):
    *   Completion of Story E1.F3.S1 (Initial onboarding steps, so user context exists).
    *   A defined Jungian assessment (questions, scoring, type descriptions, element mapping).
    *   Backend APIs for updating the Mahamaya Matrix with Jungian type data (from Story E1.F2.S1, extended for Story 1.3 data).
    *   `ui-ux-spec.md` for design consistency.

## 4. Inputs for AI Builder (Claude 4)

1.  **This Document:** The complete AI Builder Prompt Package.
2.  **`story_E1_F3_S2_onboarding_jungian_assessment.md`:** Full content.
3.  **`epic-1.md`:** Full content.
4.  **`ui-ux-spec.md`:** Full content.
5.  **Assumed Jungian Assessment Details (to be provided or developed by user/SME if not available):
    *   Specific 16-type model (e.g., MBTI-like, Keirsey, or custom Nara system).
    *   Assessment questions (e.g., 40-70 dichotomous choice questions).
    *   Scoring algorithm to determine the 4 preferences and final 16-type.
    *   Mapping of the 16 types to the 4 alchemical elements (Fire, Water, Air, Earth).
    *   Brief descriptions for each of the 16 types and 4 elements for display to the user.

## 5. Expected Outputs from AI Builder

*   **Frontend Code (React/Next.js with TypeScript, Tailwind CSS - or as per project stack defined in `frontend-architecture.md` if available):**
    *   React components for the Jungian assessment UI, including:
        *   Introduction screen/modal.
        *   Question presentation (one by one or sectioned).
        *   Response capture (e.g., radio buttons, sliders for dichotomous choices).
        *   Progress indicators.
        *   Results display screen showing determined type and element.
    *   Logic for client-side type calculation (if chosen) or integration with backend API for calculation.
    *   State management for the assessment process (e.g., using Zustand or Redux Toolkit).
    *   API integration for submitting assessment data and retrieving/storing type/element.
    *   Styling according to `ui-ux-spec.md` and project's design system.
*   **Backend Code (Node.js/Express with TypeScript, MongoDB - or as per project stack defined in `backend-architecture.md` if available):**
    *   API endpoint(s) to:
        *   Receive assessment responses (if calculation is server-side).
        *   Store calculated Jungian type and alchemical element in the user's Mahamaya Matrix document in MongoDB.
        *   (Optional) Store raw assessment responses.
    *   Logic for server-side type calculation (if chosen) and element mapping.
*   **Documentation/Comments:** Clear comments in the code explaining logic and component usage.
*   **Unit/Integration Test Stubs:** Basic test stubs for key functions and components.

## 6. AI Builder Prompt (for Claude 4)

```
Primary Goal: Implement the Jungian Psychological Type Assessment feature for the Nara application as part of the user onboarding flow, based on Story E1.F3.S2.

Detailed Instructions:

Referencing the provided documents (`story_E1_F3_S2_onboarding_jungian_assessment.md`, `epic-1.md`, `ui-ux-spec.md`, and this prompt package):

1.  **Understand the Context:**
    *   The assessment is a step in the Mahamaya Ground onboarding (Epic 1).
    *   It determines a 16-type profile and maps it to one of four alchemical elements.
    *   This data is stored in the user's Mahamaya Matrix (MongoDB).
    *   The UI/UX must strictly adhere to `ui-ux-spec.md` and be consistent with the overall Nara design.

2.  **Assumptions for Assessment Content (If specific assessment details are not provided, make reasonable, clearly stated assumptions for a typical 16-type assessment, e.g., MBTI-like with ~50 questions leading to 4 dichotomies. State that these are placeholders.):**
    *   Assume a set of dichotomous questions (e.g., 10 questions for each of the 4 dichotomies: Introversion/Extraversion, Sensing/Intuition, Thinking/Feeling, Judging/Perceiving).
    *   Assume a simple scoring mechanism (e.g., majority choice for each dichotomy determines the preference).
    *   Assume a standard mapping of the 16 types to the 4 alchemical elements (e.g., NTs = Air, NFs = Water, SJs = Earth, SPs = Fire - or provide a placeholder mapping and state it's a placeholder).
    *   You will need to generate placeholder questions and type/element descriptions if not provided.

3.  **Frontend Development (React/Next.js, TypeScript, Tailwind CSS - or project default if specified elsewhere):
    *   **Create UI Components:**
        *   `JungianAssessmentIntro`: Explains the purpose and what to expect.
        *   `AssessmentQuestion`: Displays a single question and options for response.
        *   `AssessmentProgress`: Shows current progress (e.g., question X of Y, or progress bar).
        *   `JungianAssessmentFlow`: Manages the sequence of questions, state, and navigation (Next/Previous if allowed).
        *   `JungianAssessmentResults`: Displays the determined 16-type and its mapped alchemical element, with brief descriptions. This should be presented clearly within the onboarding flow.
    *   **Implement Logic:**
        *   Client-side calculation of the 16-type based on responses (unless server-side is explicitly preferred for complexity/IP reasons – if so, implement API call for calculation).
        *   Mapping of the calculated type to the alchemical element.
    *   **State Management:** Use a suitable state management solution (e.g., Zustand, Redux Toolkit, or React Context) to manage assessment state (current question index, user answers, calculated type/element).
    *   **API Integration:** Call backend API to submit the final Jungian type and element to be stored in the user's Mahamaya Matrix.
    *   **Styling:** Ensure all components are styled according to `ui-ux-spec.md`, including responsiveness (mobile, tablet, desktop) and accessibility (WCAG 2.1 AA).
    *   **Navigation:** Integrate this assessment step into the overall onboarding flow (assume previous step was birth details, next step might be Gene Keys/HD intro).

4.  **Backend Development (Node.js/Express, TypeScript, MongoDB - or project default):
    *   **API Endpoint:** Create an endpoint (e.g., `POST /api/user/onboarding/jungian-type`) that accepts the user ID, calculated Jungian type, and mapped alchemical element.
    *   **Data Storage:** Update the user's document in the Mahamaya Matrix (MongoDB `users` collection) to include:
        *   `jungianType: String` (e.g., "INFJ")
        *   `alchemicalElement: String` (e.g., "Water")
        *   (Optional) `assessmentResponses: Array` (if storing raw responses is desired).
    *   **Server-Side Calculation (Optional):** If type calculation is too complex or sensitive for the client-side, implement the calculation logic on the backend. The API would then accept raw responses and return the calculated type/element, in addition to storing it.

5.  **Code Quality & Documentation:**
    *   Write clean, well-organized, and maintainable code.
    *   Include JSDoc/TSDoc comments for all functions, components, and critical logic sections.
    *   Provide basic unit/integration test stubs for key functionalities.

6.  **Deliverables:**
    *   Separate frontend and backend code modules/files.
    *   Clear instructions on how to integrate these modules into an existing Nara application structure.

**Key UI/UX Guidelines (from `ui-ux-spec.md` - adapt if actual spec is provided later):**
*   **Clarity & Engagement:** The assessment should be presented in a way that is easy to understand and encourages completion.
*   **Visual Consistency:** Adhere to Nara's branding, color palette, typography, and iconography.
*   **Responsiveness:** Ensure the UI adapts seamlessly to mobile, tablet, and desktop screens.
*   **Accessibility:** Implement ARIA attributes, ensure keyboard navigability, and meet color contrast requirements.
*   **Feedback:** Provide clear feedback to the user during the assessment (e.g., progress, confirmation of completion).
*   **Integration:** The assessment should feel like a natural part of the onboarding journey described in `ui-ux-spec.md`'s "Mahamaya Ground Onboarding Flow".

If any part of the requirements is unclear or conflicting, please state your assumptions and proceed with the most logical interpretation based on the goal of creating an engaging and functional Jungian type assessment for user onboarding.
```

---
**Next Steps:** The AI Builder (Claude 4) will use this package to generate the code. The developer will then review, integrate, and test the generated code. The next story in this feature (F3) is `story_E1_F3_S3_onboarding_gene_keys_hd_intro.md`.
"rewrite":false}}}