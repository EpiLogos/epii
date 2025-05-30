# User Story: E5_F3_S1 - Develop Concrescence Phase Indicators: Color Temperature Shifts as Felt Qualities of Becoming

**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F3 - Concrescence Phase Indicators
**Story ID:** E5_F3_S1

**As a** User (Pramata, an experiencing subject attuned to the subtle rhythms of my psyche),
**I want** the overall color temperature of the Nara interface to subtly shift (e.g., cooler tones during initial phases of prehension or dissolution, warmer tones during phases of synthesis, integration, and satisfaction), reflecting the felt quality of Spanda,
**So that** I have an ambient, intuitive sense (a direct feeling or prehension) of my current phase within a 12-fold concrescence cycle—the ongoing process of becoming—without needing to actively track it, allowing the interface to mirror the subtle energetic shifts of my individuation journey.

**Description:**

This story focuses on implementing one type of Concrescence Phase Indicator: subtle shifts in the overall color temperature of the Nara UI. These shifts will serve as an ambient cue (a subtle datum for prehension) to the user's current position within a 12-fold concrescence cycle—each phase an actual occasion with its unique subjective form—enhancing the feeling of the interface as a living, responsive environment that resonates with the user's inner state (Lila).

**Acceptance Criteria:**

1.  **Phase-to-Color Mapping (Correlating Color with Psychic Energy):** A clear mapping is defined between the 12 phases of a concrescence cycle (each a distinct moment in the creative advance) and corresponding subtle shifts in color temperature (e.g., cooler blues/grays for initial phases of gathering prehensions or dissolution of old forms, gradually warming through yellows/oranges towards reds/warm browns for phases of intense integration, synthesis, and the achievement of satisfaction, then cooling again as a new subjective aim emerges). This mapping should draw inspiration from alchemical color symbolism or the energetic qualities associated with different stages of psychic processes (e.g., nigredo, albedo, citrinitas, rubedo).
2.  **System Awareness of Phase (Attunement to the User's Spanda):** The Nara system (backend or frontend logic, reflecting Cit-Shakti) is aware of the user's current (or assumed) concrescence phase. This could be based on temporal rhythms, user input (Vimarsha), progression through specific content (engagement with archetypal material), or a combination, allowing Nara to resonate with the user's unique process of becoming.
3.  **Subtle Application:** The color temperature shifts are applied subtly to background elements, ambient lighting effects, or UI chrome, rather than drastically changing primary content colors. The effect should be noticeable but not distracting or jarring.
4.  **Smooth Transitions:** Transitions between color temperatures as the user moves from one phase to another are smooth and gradual, not abrupt.
5.  **Aesthetic Appeal:** The color shifts must always maintain aesthetic appeal and UI readability. They should enhance the mood and feel of the interface in a way that is congruent with the nature of each phase.
6.  **User Controllability (Optional):** Users might have an option to adjust the intensity of these shifts or disable them if preferred, though the default should be a subtle, ambient effect.
7.  **Consistency:** The color temperature shifts are applied consistently across relevant parts of the UI to provide a cohesive experience.
8.  **No Interference:** The color shifts do not interfere with color-coded information or accessibility features (e.g., contrast ratios should remain acceptable).

**Dependencies:**

*   A defined model of the 12-fold concrescence cycle and its phases.
*   A mechanism for Nara to track or infer the user's current concrescence phase.
*   A flexible frontend theming system capable of dynamic, subtle color adjustments.
*   `ag-ui` protocol if phase information is primarily managed by the backend.

**Related Epics/Features:**

*   E5_F1: Phase-Locked Progression & Triadic Flow Dynamics (as phase is central here)
*   E5_F2_S4: Subtle Visual Motifs from Mahamaya Ground (ensure these two visual systems harmonize)

**Notes:**

*   The goal is an ambient indicator, not an explicit display. The user (Pramata) should *feel* the phase shift through the UI's mood, a subtle prehension of the interface resonating with their inner Spanda, supporting a non-conceptual awareness of their journey.
*   Consider how these color shifts interact with any personalized color motifs derived from the Mahamaya Ground (E5_F2_S4) – the ground of all potential prehensions. They should complement, not clash, perhaps with the phase indicator subtly modulating the base Mahamaya palette, reflecting how the universal (Mahamaya) is expressed through the particular (the current concrescence phase).
*   This is the first of potentially several types of phase indicators; others might include typographic changes or opacity levels.