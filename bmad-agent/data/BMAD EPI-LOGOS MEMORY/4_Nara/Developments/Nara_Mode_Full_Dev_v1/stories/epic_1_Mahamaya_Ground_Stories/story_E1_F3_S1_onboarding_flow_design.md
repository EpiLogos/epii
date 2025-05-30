# Story E1.F3.S1: User Onboarding Flow Design & Initial Mahamaya Ground Introduction

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Sub-Feature:** Design and Implement Initial Onboarding Steps for Mahamaya Ground Data Collection
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on designing and implementing the initial steps of the first-time user experience (FTUE) for Nara. The primary goal of this initial onboarding phase is to guide users through the process of providing the necessary information to populate the first few layers of their Mahamaya Ground, specifically focusing on birthdata collection for the "Birthdate Encoding" and "Astrological Natal Chart" layers.

The onboarding should be engaging, clear, and allow users to understand the purpose of the information they are providing. It should also allow users to complete it in stages, as per `epic-1.md` ("users need not complete this in one session, and can return to it as they wish").

## 2. Acceptance Criteria

*   **AC1 (Frontend - UI/UX Design):** A clear and intuitive UI/UX design for the initial onboarding flow is created, consistent with `ui-ux-spec.md`. This includes screens/steps for:
    *   Welcome/Introduction to Nara and the Mahamaya Ground concept.
    *   Inputting birth date (Year, Month, Day).
    *   Inputting birth time (Hour, Minute - with an option for 'unknown' or 'approximate' if necessary, and clear indication of its importance for accuracy).
    *   Inputting birth location (City, Country - potentially with a location picker/autocomplete for accuracy in timezone/latitude/longitude determination).
*   **AC2 (Frontend - Implementation):** The designed onboarding screens are implemented as functional UI components.
*   **AC3 (Frontend - Data Input & Validation):** User input for birth date, time, and location is captured and validated (e.g., valid dates, time format, location lookup).
*   **AC4 (Backend - Data Submission):** Validated birth data is securely submitted to the backend to initiate the creation/update of the user's Mahamaya Matrix (specifically for Story 1.1 and 1.2 data points).
*   **AC5 (Frontend - Progress Indication & Navigation):** The onboarding flow provides clear progress indication and allows users to navigate back to previous steps if needed (where appropriate).
*   **AC6 (Frontend - Save & Continue Later):** The system allows users to save their progress during onboarding and resume later. The state of their onboarding completion is tracked.
*   **AC7 (Frontend - Clarity of Purpose):** Each step briefly explains why the requested information is needed and how it contributes to their Nara experience (e.g., "Your birth details help us unveil your unique Celestial Blueprint").
*   **AC8 (Responsiveness & Accessibility):** The onboarding UI is responsive and adheres to accessibility standards (WCAG 2.1 AA) as per `ui-ux-spec.md`.

## 3. Tasks

*   **Task 3.1 (UX Design):** Design the overall user flow for the initial onboarding sequence. Create wireframes and mockups for each screen/step, focusing on clarity and ease of use. Refer to `ui-ux-spec.md`.
*   **Task 3.2 (UI Design):** Develop the visual design for the onboarding screens, ensuring consistency with Nara's branding and style guide (`ui-ux-spec.md`).
*   **Task 3.3 (Frontend - Development):** Implement the UI components for each onboarding step (welcome, birthdate input, birth time input, birth location input).
*   **Task 3.4 (Frontend - Location Services):** Integrate a location picker or geocoding service (e.g., Google Places API, Mapbox Geocoding API - *developer note: check for free tiers/costs*) to accurately capture birth location and derive timezone/latitude/longitude.
*   **Task 3.5 (Frontend - Input Validation):** Implement robust client-side input validation.
*   **Task 3.6 (Frontend - State Management):** Implement state management for the onboarding flow, including handling user inputs and progress.
*   **Task 3.7 (Frontend - API Integration):** Integrate with backend APIs to submit birth data (linking to Story E1.F2.S1 for Mahamaya Matrix creation/update).
*   **Task 3.8 (Backend - Onboarding State):** Implement backend logic to track the user's onboarding progress/completion status.
*   **Task 3.9 (Frontend - Explanatory Content):** Write concise and engaging copy for each onboarding step to explain its purpose.
*   **Task 3.10 (Testing):** Conduct usability testing on the onboarding flow. Test UI components for functionality, responsiveness, accessibility, and data submission accuracy.

## 4. Technical Guidance & Considerations

*   **Location Picker/Geocoding:** Choosing a reliable and potentially cost-effective geocoding service is important for accuracy of astrological calculations. Ensure API keys are handled securely.
*   **Time Zone Handling:** Accurately determining the birth timezone from the location is critical. Libraries like `moment-timezone` or `date-fns-tz` can be helpful.
*   **User Experience:** The onboarding is the user's first impression. It should be smooth, encouraging, and not feel overly burdensome.
*   **Modularity:** Design the onboarding steps to be somewhat modular, as later steps will introduce other Mahamaya Ground layers (e.g., Jungian assessment).
*   **Error Handling:** Provide clear feedback for validation errors or API submission failures.
*   **Security:** Ensure birth data is transmitted securely (HTTPS) and handled according to privacy best practices.

## 5. Dependencies

*   Completion of `ui-ux-spec.md` (or at least the relevant sections for onboarding and Identity Dynamics).
*   Backend APIs for user creation and Mahamaya Matrix initialization/update (from Story E1.F2.S1).
*   Backend logic for astrological calculations (Story 1.2) will be triggered by this data, so the data format must be compatible.
*   Decision on a geocoding service if one is to be used.

## 6. Non-Functional Requirements

*   **Ease of Use:** The onboarding process should be very easy for non-technical users to complete.
*   **Performance:** Screens should load quickly, and location lookups should be responsive.
*   **Reliability:** Data submission must be reliable.

## 7. Open Questions/Assumptions

*   **Assumption:** Users will generally have access to their birth date, time, and location.
*   **Question:** How should the system handle cases where birth time is unknown or approximate? What are the implications for the accuracy of subsequent calculations (e.g., astrological houses, Human Design)? This needs clear communication to the user.
*   **Question:** What is the exact flow if a user chooses to skip or "complete later"? How are they reminded or guided back?
*   **Question:** Will there be an option to manually input latitude/longitude/timezone if the location lookup fails or for advanced users?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. Subsequent stories for this feature will cover onboarding for the remaining Mahamaya Ground layers (Jungian assessment, Gene Keys/HD import/explanation, Quintessence reveal).