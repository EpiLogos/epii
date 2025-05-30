# Story 1.2: Astrological Natal Chart - The Celestial Blueprint & Archetypal Psyche Map

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** Implement the Six Nested Layers of #0 (Mahamaya Ground)
**Sub-Feature:** Astrological Natal Chart (The Celestial Blueprint)
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on calculating and integrating the user's full astrological natal chart. From a Jungian perspective, this chart serves as a symbolic map of the user's psyche at birth – a personal mandala reflecting inherent archetypal energies, potentials, and complexes relevant to their individuation journey. It includes planetary positions (representing archetypal functions/drives), aspects (symbolizing dynamic relationships between these energies), houses (areas of life expression), and decanic placements, based on the birthdate and time from Story 1.1. The natal chart will be a key component of the user's "Identity Dynamics" profile, specifically within the Mahamaya Ground, offering insights into the Self's unique configuration.

The goal is to implement the backend logic for natal chart calculation and UI elements to display this information in a way that invites reflection on these psycho-spiritual dynamics, as per `ui-ux-spec.md`.

## 2. Acceptance Criteria

*   **AC1 (Backend - Calculation & Archetypal Data Points):** Given a user's birthdate, time, and location, the system accurately calculates the astrological natal chart. This data provides foundational symbolic points for understanding the user's archetypal makeup and potential individuation path, including:
    *   Positions of Sun, Moon, and all planets (e.g., Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) in zodiac signs and degrees.
    *   Ascendant (Rising Sign) and Midheaven (MC).
    *   House cusps (e.g., using Placidus or Whole Sign system - to be specified).
    *   Major aspects between planets (e.g., conjunction, sextile, square, trine, opposition) with orbs.
    *   Decanic placements for planets.
*   **AC2 (Backend - Data Storage):** The calculated natal chart data (planetary positions, aspects, houses, etc.) is stored efficiently and accessibly in the user's profile in MongoDB, linked to their Mahamaya Ground.
*   **AC3 (UI - Display - Core Archetypal Elements):** Within the "Identity Dynamics" section (Mahamaya Ground), the user can view a clear representation of their natal chart, presented as a symbolic key to their psyche. This initial display must include:
    *   A visual representation of the zodiac wheel with planetary glyphs in their correct signs and degrees.
    *   A list or table of planetary positions (Planet, Sign, Degree).
    *   The user's Ascendant and Midheaven.
*   **AC4 (UI - Display - Aspects & Houses):** The UI provides a way to visualize or list major aspects between planets and the house placements of planets.
*   **AC5 (UI - Integration as Personal Mandala):** The natal chart display is visually and functionally integrated into the Mahamaya Ground interface, potentially presented as an interactive personal mandala. This aligns with the Jungian concept of the mandala as a symbol of the Self and wholeness, consistent with `ui-ux-spec.md`.
*   **AC6 (UI - Tooltips/Archetypal Insights):** Hovering over or selecting planetary glyphs, aspects, or house numbers provides basic explanatory tooltips. These explanations will subtly incorporate Jungian perspectives, framing astrological elements in terms of archetypal energies, psychological functions, or potential areas of shadow work and integration (e.g., "Mars in Aries: Archetype of the Warrior; drive for assertion, potential for impulsiveness, shadow aspect could be unexpressed anger or passivity"). Language will be chosen to be reflective and non-deterministic.
*   **AC7 (Responsiveness):** The natal chart display is responsive and adapts gracefully to different screen sizes (mobile, tablet, desktop) as per `ui-ux-spec.md`.
*   **AC8 (Accessibility):** The natal chart information is presented in an accessible manner, considering users with visual impairments (e.g., sufficient color contrast, alternative text for visual elements where appropriate, keyboard navigation for interactive elements).

## 3. Tasks

*   **Task 3.1 (Backend):** Research and select a reliable open-source library or API for astrological calculations (e.g., Astropy, Swiss Ephemeris bindings, or a dedicated astrology API). If using an external API, manage API keys securely.
*   **Task 3.2 (Backend):** Implement the backend logic to take user's birth data (date, time, location - NB: location input needs to be handled) and use the chosen library/API to calculate the full natal chart.
*   **Task 3.3 (Backend):** Design the schema and implement storage for natal chart data in MongoDB.
*   **Task 3.4 (Backend):** Develop an API endpoint to retrieve the calculated natal chart data for a user.
*   **Task 3.5 (Frontend):** Design and develop the UI components for displaying the natal chart (zodiac wheel, planetary positions, aspects, houses) within the Mahamaya Ground section of "Identity Dynamics."
*   **Task 3.6 (Frontend):** Implement interactive elements, such as tooltips for chart elements.
*   **Task 3.7 (Frontend):** Integrate the frontend components with the backend API to fetch and display user-specific natal chart data.
*   **Task 3.8 (Testing):** Write unit tests for backend calculation logic. Perform cross-validation of chart calculations with established astrology software. Test UI components for accuracy, responsiveness, and accessibility.

## 4. Technical Guidance & Considerations

*   **Astrology Library/API Choice:** The accuracy and reliability of the chosen astrological calculation engine are paramount. Consider licensing, ease of integration, and community support. *Developer Note: This choice needs careful evaluation and approval.*
*   **Birth Location Input:** This story assumes birth location (latitude/longitude or city/country for timezone lookup) is available. If not, a preceding story or task will be needed to capture this. For now, development might proceed with a default or placeholder location for testing.
*   **House System:** Decide on a default house system (e.g., Placidus, Whole Sign). Offering user selection could be a future enhancement.
*   **Aspect Orbs:** Define standard orbs for aspects or allow for configurable orbs.
*   **Data Volume & Performance:** Natal chart data can be extensive. Ensure efficient storage and retrieval. Frontend rendering of the chart should be performant.
*   **Visualization & Symbolic Depth:** Creating an accurate and aesthetically pleasing visual representation of the natal chart is key. The visualization should aim to evoke the chart as a personal mandala, a symbolic representation of the user's psyche. Consider SVG for scalability and interactivity. The design should subtly hint at the depth of meaning and the journey of individuation the chart represents.
*   **UI/UX & Journey of Self-Discovery:** Refer to `ui-ux-spec.md`. The natal chart, as part of the Mahamaya Ground, should be presented as a "living dashboard or mandala," inviting the user into a journey of self-discovery through the lens of archetypal psychology and their unique celestial signature. The interaction should feel like an exploration of their inner cosmos.
*   **BPMCP Integration:** Long-term, natal chart data and its interpretations will be part of the `bimba_map` and accessed via BPMCP. Initial implementation can focus on direct calculation and storage, with future refactoring for BPMCP.

## 5. Dependencies

*   Completion of Story 1.1 (Birthdate Encoding) or at least availability of user's birth date and time.
*   A mechanism to obtain the user's birth location (latitude/longitude or city for timezone lookup).
*   Access to `ui-ux-spec.md` for design guidelines.
*   Access to `epic-1.md` for feature context.

## 6. Non-Functional Requirements

*   **Accuracy:** Natal chart calculations must be highly accurate.
*   **Performance:** Chart display should load quickly and interact smoothly.

## 7. Open Questions/Assumptions

*   **Assumption:** A suitable astrological calculation library/API will be identified and approved for use.
*   **Question:** What is the specific house system to be used by default (e.g., Placidus, Whole Sign)?
*   **Question:** How will birth location be captured from the user if not already part of Story 1.1? For initial development, can a default location be assumed for testing?
*   **Question:** What level of detail is required for the initial display of aspects (e.g., just major aspects, specific orbs)?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. Proceed to develop subsequent stories for Epic 1.