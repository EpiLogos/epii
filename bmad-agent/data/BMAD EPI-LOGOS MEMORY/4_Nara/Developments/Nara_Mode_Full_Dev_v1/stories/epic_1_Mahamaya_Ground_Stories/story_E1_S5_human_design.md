# Story 1.5: Human Design - The Bodygraph as a Map of Psychic Energy & Individuation Strategy

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** Implement the Six Nested Layers of #0 (Mahamaya Ground)
**Sub-Feature:** Human Design (The 64 Gates and Bodygraph)
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on calculating and integrating the user's Human Design chart (Bodygraph). From a Jungian perspective, the Bodygraph can be seen as a symbolic map of the user's innate psychic energy system, highlighting their unique mode of functioning (Type, Strategy, Authority), areas of consistent energy (defined Centers/Channels – analogous to developed psychological functions), and areas of openness and potential conditioning (undefined Centers – where shadow material may be encountered and integrated). The 64 Gates represent archetypal themes influencing this energetic structure. Understanding one's Human Design supports the individuation process by fostering alignment with one's authentic nature and navigating life with greater self-awareness.

The goal is to implement backend logic for chart calculation and UI elements that present the Bodygraph as a tool for self-understanding and navigating one's unique path towards wholeness, within the "Identity Dynamics" section.

## 2. Acceptance Criteria

*   **AC1 (Backend - Psychodynamic Chart Calculation):** Based on birth data, the system calculates the Human Design chart. This calculation provides data points for understanding the user's inherent psychodynamics, including:
    *   Type (e.g., Manifestor, Generator, Manifesting Generator, Projector, Reflector).
    *   Strategy (e.g., To Inform, To Respond, To Wait for Invitation).
    *   Authority (e.g., Solar Plexus, Sacral, Splenic, Ego, Self-Projected, Mental Projector, Lunar).
    *   Profile (e.g., 1/3, 4/6, 5/1).
    *   Defined and undefined Centers (Head, Ajna, Throat, G-Center, Heart, Sacral, Spleen, Solar Plexus, Root).
    *   Defined Channels.
    *   Activated Gates (conscious and unconscious placements).
*   **AC2 (Backend - Data Storage):** The calculated Human Design chart data is stored in the user's profile in MongoDB, as part of their Mahamaya Ground data.
*   **AC3 (UI - Display Energetic Psyche Map):** Within 
*   **AC4 (UI - Display Individuation Keys):** Key Human Design information (Type, Strategy, Authority, Profile) is displayed, framed as essential keys for navigating their individuation process and making decisions aligned with their authentic Self.
*   **AC5 (UI - Display Archetypal Activations - Basic):** The UI shows activated Gates (archetypal influences) and defined Channels (consistent energy flows/psychological functions). Deeper exploration can link these to specific Jungian archetypes or complexes.
*   **AC6 (UI - Integration with Mahamaya Ground):** The Human Design chart display is visually and functionally integrated into the Mahamaya Ground interface, consistent with `ui-ux-spec.md`.
*   **AC7 (UI - Psycho-Spiritual Explanations):** The UI provides descriptions for Type, Strategy, Authority, Profile, and centers, interpreting them through a psycho-spiritual lens. For example, undefined centers can be explained as areas for wisdom development through conscious engagement with what is 'not-self' or potential shadow aspects. Language will be reflective, subtly hinting at deeper spiritual philosophies (e.g., Kashmir Saivism's emphasis on recognizing pure consciousness amidst varying energies).
*   **AC8 (Responsiveness):** The Human Design chart display is responsive and functions correctly across defined breakpoints as per `ui-ux-spec.md`.
*   **AC9 (Accessibility):** The Human Design chart display adheres to accessibility standards (WCAG 2.1 AA), providing alternatives or clear descriptions for complex visual information, as per `ui-ux-spec.md`.

## 3. Tasks

*   **Task 3.1 (Research/Backend):** Research and select a reliable method or library for Human Design chart calculations. This might involve complex astronomical calculations (similar to astrology) and specific Human Design logic. *Developer Note: This is a specialized calculation; accuracy is key.*
*   **Task 3.2 (Backend):** Implement the backend logic to calculate the Human Design chart from birth data.
*   **Task 3.3 (Backend):** Design the schema and implement storage for Human Design chart data in MongoDB.
*   **Task 3.4 (Backend):** Develop an API endpoint to retrieve the Human Design chart for a user.
*   **Task 3.5 (Frontend):** Design and develop the UI components to display the Human Design Bodygraph, including centers and channels.
*   **Task 3.6 (Frontend):** Design and develop UI elements to display the user's Type, Strategy, Authority, Profile, and activated Gates.
*   **Task 3.7 (Frontend):** Implement interactive elements, possibly allowing users to click on centers/channels/gates for more information (basic info for now).
*   **Task 3.8 (Frontend):** Integrate the frontend components with the backend API.
*   **Task 3.9 (Testing):** Write unit tests for backend calculation logic. Cross-validate chart calculations with established Human Design software/sources. Test UI components for accuracy, responsiveness, and accessibility.

## 4. Technical Guidance & Considerations

*   **Calculation Engine & Symbolic Mapping:** Accurate Human Design calculations are crucial. The engine's output provides the raw data for a symbolic mapping of the user's energetic and psychological predispositions, relevant to their individuation journey.
*   **Bodygraph Visualization as Mandala:** The Bodygraph visualization should aim to be more than a technical diagram; it can be presented as a personal mandala, a dynamic representation of the Self's energetic structure. SVG is suitable. The design should invite introspection.
*   **Information Density & Progressive Revelation:** The rich information in a Human Design chart should be presented progressively, guiding the user from core aspects of their design (Type, Strategy, Authority – their primary tools for individuation) to more nuanced layers (Centers, Channels, Gates – deeper psychic contents and potentials for shadow work).
*   **Data Source for Jungian-Informed Descriptions:** Descriptions for Human Design elements will be crafted locally, infused with Jungian psychological understanding and aligned with Nara's overall psycho-spiritual and philosophical framework.
*   **UI/UX & Self-Realization Journey:** Refer to `ui-ux-spec.md`. The Human Design chart presentation should support the user's journey of self-realization, offering practical insights for living authentically and integrating diverse aspects of their psyche.
*   **BPMCP Integration & Archetypal Dynamics:** Human Design data, reflecting individual energetic configurations and archetypal activations (Gates), will be integrated into the `bimba_map`, allowing for cross-referencing with other symbolic systems and understanding broader archetypal dynamics.

## 5. Dependencies

*   Completion of Story 1.1 (Birthdate Encoding) and Story 1.2 (Astrological Natal Chart - as HD calculations use similar birth data and planetary positions).
*   A reliable method/library for Human Design calculations.
*   Content (descriptions) for Human Design Types, Strategies, Authorities, Centers, etc.
*   Access to `ui-ux-spec.md` for design guidelines.
*   Access to `epic-1.md` for feature context.

## 6. Non-Functional Requirements

*   **Accuracy:** Human Design chart calculations must be highly accurate.
*   **Performance:** The Bodygraph display should load efficiently and be interactive without lag.

## 7. Open Questions/Assumptions

*   **Assumption:** An accurate method for Human Design chart calculation will be available or can be developed/sourced.
*   **Question:** What is the source and depth of descriptive content required for the various Human Design elements (Types, Centers, etc.) in this initial version?
*   **Question:** How much detail about individual Gates and Channels should be displayed initially versus reserved for future enhancements or deeper exploration views?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. Proceed to develop subsequent stories for Epic 1.