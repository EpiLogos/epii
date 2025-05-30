# Story E1.F3.S2: User Onboarding - Jungian Psychological Type Assessment

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Sub-Feature:** Integrating Jungian Type Assessment into the Onboarding Flow
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on integrating a Jungian psychological type assessment into the user onboarding flow. After providing their birth details (Story E1.F3.S1), users will be guided to complete an assessment to determine their 16-type profile (e.g., similar to Myers-Briggs Type Indicator - MBTI, but potentially a custom or open-source variant aligned with Nara's philosophy). This determined type will then be mapped to one of the four alchemical elements (Fire, Water, Air, Earth) as per `epic-1.md`.

The goal is to design and implement the UI for presenting the assessment, capture user responses, calculate their Jungian type and corresponding element, and store this information in their Mahamaya Matrix.

## 2. Acceptance Criteria

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

## 3. Tasks

*   **Task 3.1 (Research/Content):** Select or develop the Jungian type assessment to be used. This includes defining the questions, response options, and the scoring/typing algorithm. Define the mapping from the 16 types to the 4 alchemical elements.
*   **Task 3.2 (UX Design):** Design the user flow for the assessment within onboarding. Create wireframes/mockups for the assessment screens. Refer to `ui-ux-spec.md`.
*   **Task 3.3 (UI Design):** Develop the visual design for the assessment screens.
*   **Task 3.4 (Frontend - Development):** Implement the UI components for presenting assessment questions and capturing responses.
*   **Task 3.5 (Frontend/Backend - Logic):** Implement the logic for calculating the Jungian type from responses and mapping it to an element. *Decision: Determine if calculation happens client-side or server-side.*
*   **Task 3.6 (Frontend - State Management):** Manage the state of the assessment (current question, responses).
*   **Task 3.7 (Frontend - API Integration):** Integrate with backend APIs to submit assessment results/derived type and element to the user's Mahamaya Matrix (linking to Story E1.F2.S1).
*   **Task 3.8 (Frontend - Results Display):** Implement a simple UI to display the determined type and element to the user upon completion within the onboarding flow.
*   **Task 3.9 (Testing):** Test the assessment logic for accuracy. Conduct usability testing on the assessment flow. Test UI components for functionality, responsiveness, and accessibility.

## 4. Technical Guidance & Considerations

*   **Assessment Choice/Creation:** The choice of assessment is critical. If using an existing model like MBTI, be mindful of licensing. Creating a custom assessment requires psychometric considerations.
*   **Calculation Logic:** If complex, server-side calculation might be better to protect the algorithm or handle more sophisticated scoring.
*   **User Experience:** Assessments can be tedious. Keep it engaging, provide clear instructions, and manage expectations about length.
*   **Ethical Considerations:** Psychological assessments should be handled responsibly. Clearly state it's for self-exploration within Nara's context and not a clinical diagnosis.
*   **Saving Progress:** For longer assessments, allowing users to save progress and resume is important.

## 5. Dependencies

*   Completion of Story E1.F3.S1 (Initial onboarding steps, so user context exists).
*   A defined Jungian assessment (questions, scoring, type descriptions, element mapping).
*   Backend APIs for updating the Mahamaya Matrix with Jungian type data (from Story E1.F2.S1, extended for Story 1.3 data).
*   `ui-ux-spec.md` for design consistency.

## 6. Non-Functional Requirements

*   **Accuracy of Typing:** The assessment logic should accurately determine the type based on its own defined rules.
*   **User Engagement:** The assessment should not feel overly clinical or lengthy to the point of user drop-off.

## 7. Open Questions/Assumptions

*   **Assumption:** A suitable Jungian assessment (either pre-existing or custom-developed) will be available with clear scoring and typing logic.
*   **Question:** What specific 16-type model and elemental mapping will be used? (e.g., Keirsey Temperaments, standard MBTI mappings to elements, or a custom Nara system?).
*   **Question:** Will users be able to retake the assessment later? If so, how is this handled in their profile?
*   **Question:** How much detail about their type will be revealed during onboarding versus saved for deeper exploration in the "Identity Dynamics" section?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. The next onboarding story will likely cover how Gene Keys and Human Design information is introduced/imported.