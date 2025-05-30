# Story 1.1: Birthdate Encoding - The Seed Formula

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** Implement the Six Nested Layers of #0 (Mahamaya Ground)
**Sub-Feature:** Birthdate Encoding (The Seed Formula)
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story covers the initial step in establishing the user's Mahamaya Ground: capturing the user's birthdate and mathematically encoding it to generate a unique numerical/archetypal "DNA." This encoded "Seed Formula" serves as the root key for subsequent symbolic mappings and can be understood from a Jungian perspective as an initial symbolic representation of the innate psychic structure or the 'blueprint' of the Self at the beginning of the user's conscious individuation journey within Nara.

The primary goal is to implement the UI for birthdate input within the "Identity Dynamics" section and the backend logic to perform the encoding. The UI should be intuitive and align with the overall aesthetic defined in the `ui-ux-spec.md`, subtly hinting at the profound journey of self-discovery being initiated.

## 2. Acceptance Criteria

*   **AC1 (UI - Input):** The user can access an input field within the "Identity Dynamics" section (specifically as part of the Mahamaya Ground onboarding/exploration flow) to enter their full birthdate (date, month, year) and time of birth (hour, minute). (Refer to `ui-ux-spec.md` for Mahamaya Ground Onboarding Flow and UI mockups/descriptions for the Identity Dynamics section).
*   **AC2 (UI - Presentation):** The input fields are clearly labeled and visually integrated into the "Identity Dynamics" section, consistent with the project's branding and style guide (dynamic color schemes, typography, etc. as per `ui-ux-spec.md`).
*   **AC3 (Backend - Encoding Logic & Symbolic Seeding):** Upon submission, the backend system correctly performs a numerological calculation (details of the specific algorithm to be provided/developed based on Mahamaya's 64-bit/codon logic principles) on the birthdate and time. This generates a unique numerical/archetypal signature (the "Seed Formula"), which can be conceptualized as the initial symbolic seed for the user's individuation process as tracked within Nara, reflecting an initial archetypal potential.
*   **AC4 (Backend - Storage):** The original birthdate (encrypted) and the derived "Seed Formula" (e.g., as encrypted birthdate matrices) are securely stored in the `Users` collection in MongoDB, associated with the user's profile. (Refer to `epic-1.md` technical note).
*   **AC5 (UI - Feedback):** The user receives clear visual feedback confirming their birthdate has been submitted and processed (e.g., a subtle animation or a message within the Mahamaya Ground interface).
*   **AC6 (UI - Display of Encoded Result - Initial & Jungian Framing):** An initial, simple representation or acknowledgment of the encoded "Seed Formula" (e.g., a unique glyph) is displayed. This display should subtly hint at its foundational nature for the user's journey of self-discovery and individuation, perhaps framed as the 'Prima Materia' or initial psychic constellation from which their unique 'Archetypal Quintessence' will emerge and evolve. The language used will be mindful of the dynamic nature of the Self.
*   **AC7 (Responsiveness):** The birthdate input UI is responsive and functions correctly across defined breakpoints (mobile, tablet, desktop) as per `ui-ux-spec.md`.
*   **AC8 (Accessibility):** The birthdate input form adheres to accessibility standards (WCAG 2.1 AA), ensuring keyboard navigability and appropriate ARIA attributes, as outlined in `ui-ux-spec.md`.

## 3. Tasks

*   **Task 3.1 (Frontend):** Design and implement the birthdate and time input form component within the "Identity Dynamics" section, specifically for the Mahamaya Ground onboarding/exploration. Ensure styling aligns with `ui-ux-spec.md`.
*   **Task 3.2 (Frontend):** Implement UI feedback mechanisms for submission and processing.
*   **Task 3.3 (Frontend):** Implement an initial, simple UI element to represent/acknowledge the processed "Seed Formula" within the user's Identity Dynamics profile.
*   **Task 3.4 (Backend):** Define and implement the specific numerological algorithm for encoding the birthdate and time into the "Seed Formula" based on Mahamaya's 64-bit/codon logic.
*   **Task 3.5 (Backend):** Implement the API endpoint to receive birthdate data, perform encoding, and store the encrypted birthdate and encoded "Seed Formula" in the MongoDB `Users` collection.
*   **Task 3.6 (Integration):** Connect the frontend input form to the backend API endpoint.
*   **Task 3.7 (Testing):** Write unit and integration tests for the encoding logic and API endpoint. Perform UI testing for responsiveness and accessibility.

## 4. Technical Guidance & Considerations

*   **Encoding Algorithm & Symbolic Resonance:** The specific mathematical/numerological algorithm for the "Seed Formula" needs to be precisely defined. While rooted in Mahamaya's logic, its output should be considered as a symbolic starting point that resonates with the initial conditions of the user's psyche, offering a foundational layer for exploring Jungian archetypes and the individuation process. *Developer Note: Liaise with project lead for the definitive algorithm. Consider how the output might subtly inform the initial presentation of archetypal themes.*
*   **Encryption:** Ensure robust encryption methods are used for storing the user's birthdate in MongoDB.
*   **UI Framework:** Utilize the established frontend framework and component library (refer to `ui-ux-spec.md` and `frontend-architecture.md` if available in the project context).
*   **State Management:** Ensure proper state management for the user's input and the resulting encoded data on the frontend.
*   **Error Handling:** Implement comprehensive error handling for invalid input, API errors, and encoding failures, providing user-friendly messages.
*   **Data Source:** All user data, including birthdate and the encoded Seed Formula, will be managed via the BPMCP (Bimba-Pratibimba Memory Control Plane) once fully integrated. For this initial story, direct MongoDB interaction via a backend API is acceptable, with a view to future BPMCP integration.
*   **Visual Design & Symbolic Introduction:** Refer to `ui-ux-spec.md`. The birthdate input is the first step in revealing the "Mahamaya Ground Interface." The visual feedback and initial representation of the "Seed Formula" should evoke a sense of entering a space of profound self-exploration, subtly aligning with the Jungian idea of embarking on the individuation journey and perhaps hinting at the mandalic nature of the Self.

## 5. Dependencies

*   Basic User Authentication/Profile system in place (to associate the birthdate with a user).
*   MongoDB `Users` collection schema defined to accommodate encrypted birthdate and the "Seed Formula."
*   Access to `ui-ux-spec.md` for design guidelines.
*   Access to `epic-1.md` for feature context.

## 6. Non-Functional Requirements

*   **Performance:** Birthdate submission and encoding should be processed quickly, providing near real-time feedback to the user.
*   **Security:** User's birthdate information must be handled with utmost security, including encryption at rest and in transit.

## 7. Open Questions/Assumptions

*   **Assumption:** The detailed numerological algorithm for birthdate encoding will be provided or co-developed. If not, a temporary unique ID generation method will be used.
*   **Question:** What is the exact format/structure expected for the "Seed Formula" (e.g., a single string, a structured object, a 64-bit representation)?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. Proceed to develop subsequent stories for Epic 1.