# Story E1.F3.S3: User Onboarding - Introduction to Gene Keys & Human Design

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Sub-Feature:** Introducing Gene Keys and Human Design Concepts in Onboarding
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on the part of the user onboarding flow that introduces the concepts of Gene Keys and Human Design. Since the core data for these systems (birth date, time, location) has already been collected (Story E1.F3.S1), this step is less about new data input and more about:
1.  Briefly explaining what Gene Keys and Human Design are within the Nara context.
2.  Informing the user that their profiles for these systems will be (or have been) generated based on their birth details.
3.  Setting expectations that these layers will be available for deeper exploration within the "Identity Dynamics" section.

The goal is to create engaging and informative UI screens within the onboarding flow that achieve this, ensuring the user understands these valuable additions to their Mahamaya Ground without overwhelming them with complexity at this stage.

## 2. Acceptance Criteria

*   **AC1 (Frontend - UI/UX Design):** Clear and visually appealing UI/UX for introducing Gene Keys and Human Design is designed as part of the onboarding flow, consistent with `ui-ux-spec.md`.
    *   Separate, concise introductory screens for Gene Keys.
    *   Separate, concise introductory screens for Human Design.
*   **AC2 (Frontend - Explanatory Content):** Engaging and easy-to-understand content is created that briefly explains:
    *   The essence of Gene Keys (e.g., archetypal codes for personal transformation).
    *   The essence of Human Design (e.g., energetic blueprint, decision-making strategy).
*   **AC3 (Frontend - Connection to Birth Data):** The UI clearly communicates that these profiles are derived from the previously entered birth information.
*   **AC4 (Frontend - Confirmation/Acknowledgement):** The user acknowledges these introductions, understanding that these profiles are being integrated into their Mahamaya Ground.
*   **AC5 (Backend - Trigger/Flag for Profile Generation):** If Gene Keys/Human Design profile generation (Stories 1.4 & 1.5 backend logic) is not automatically triggered by birth data submission, this onboarding step ensures the necessary flags are set or processes are initiated in the backend.
*   **AC6 (Frontend - Next Steps Indication):** The UI smoothly transitions the user to the next part of the onboarding or indicates that these profiles will be explorable later in the main application.
*   **AC7 (Responsiveness & Accessibility):** The introductory screens are responsive and adhere to accessibility standards (WCAG 2.1 AA) as per `ui-ux-spec.md`.

## 3. Tasks

*   **Task 3.1 (Content Creation):** Write concise, engaging, and accurate introductory texts for Gene Keys and Human Design, tailored for a first-time user.
*   **Task 3.2 (UX Design):** Design the user flow for these introductory steps within onboarding. Create wireframes/mockups. Refer to `ui-ux-spec.md`.
*   **Task 3.3 (UI Design):** Develop the visual design for these screens, potentially incorporating symbolic imagery related to Gene Keys (e.g., the 64-grid) or Human Design (e.g., a simplified Bodygraph motif).
*   **Task 3.4 (Frontend - Development):** Implement the UI components for the Gene Keys introductory screen(s).
*   **Task 3.5 (Frontend - Development):** Implement the UI components for the Human Design introductory screen(s).
*   **Task 3.6 (Frontend - State Management):** Integrate these steps into the overall onboarding state management.
*   **Task 3.7 (Backend - Coordination - Optional):** If profile generation isn't automatic, ensure this step triggers backend processes for Gene Keys (Story 1.4) and Human Design (Story 1.5) calculations via API calls.
*   **Task 3.8 (Testing):** Test the display of introductory content. Conduct usability testing to ensure clarity and user understanding. Test UI components for responsiveness and accessibility.

## 4. Technical Guidance & Considerations

*   **Simplicity is Key:** Avoid overwhelming the user with the full depth of Gene Keys or Human Design at this stage. The goal is awareness and anticipation.
*   **Visual Appeal:** Use visuals effectively to make these concepts intriguing rather than intimidating.
*   **Terminology:** Use accessible language. Define any specific terms briefly if unavoidable.
*   **User Control:** While not a data input step, ensure the user feels in control and understands what's happening with their data.
*   **Timing of Profile Generation:** Decide if the actual calculation of Gene Keys/HD profiles happens immediately after birth data input, or if it's deferred until this introductory step (or even later). This impacts backend coordination.
    *   *Developer Note from Epic 1 for Gene Keys: "collaboration on the details will be needed." This implies that the full profile might not be auto-generated but rather the framework is set up. The onboarding should reflect this nuance if it's the case, perhaps stating that the system is now ready to help them explore their Gene Keys.*

## 5. Dependencies

*   Completion of Story E1.F3.S1 (Birth data collection).
*   Backend capabilities for Gene Keys profile generation (Story 1.4) and Human Design chart calculation (Story 1.5) must exist, even if their full display is deferred.
*   `ui-ux-spec.md` for design consistency.
*   Content strategy for explaining these complex systems simply.

## 6. Non-Functional Requirements

*   **Clarity:** The purpose and nature of Gene Keys and Human Design should be made clear to the user at a high level.
*   **Engagement:** The presentation should pique the user's interest to explore these systems later.

## 7. Open Questions/Assumptions

*   **Assumption:** Users will not be required to input any new data for Gene Keys/Human Design at this stage; it's primarily informational.
*   **Question:** What is the exact message if the Gene Keys or Human Design systems require further user interaction or choices later for full profile development (as hinted in Epic 1 for Gene Keys)? How is this expectation managed during onboarding?
*   **Question:** Will there be any interactive element at all (e.g., a single question to gauge interest, or a choice to learn more immediately vs. later)?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. The next onboarding story will likely cover the introduction/generation of the I Ching component and then the reveal of the synthesized Archetypal Quintessence.