# Story 1.3: Jungian Psychological Types - The Alchemical Temperament

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** Implement the Six Nested Layers of #0 (Mahamaya Ground)
**Sub-Feature:** Jungian Psychological Types (The Alchemical Temperament)
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on integrating a Jungian Psychological Types assessment. This assessment, reflecting Jung's core concepts of attitudes (Introversion/Extraversion) and functions (Thinking, Feeling, Sensation, Intuition), helps illuminate the user's innate psychological orientation. The resulting type profile, or "Alchemical Temperament," is mapped to elemental analogues (Fire, Water, Air, Earth), symbolizing the foundational energies of their psyche. This contributes to their "psychological alchemy" within the Mahamaya Ground, offering insights into their natural modes of perception and judgment. Understanding these dynamics is crucial for navigating the individuation journey, fostering awareness of both preferred functions and their less developed, often shadow, counterparts, ultimately guiding the user towards a more integrated experience of the Self. The elemental mapping can also subtly reflect the interplay of consciousness (Shiva) and energy (Shakti) as understood in traditions like Kashmir Saivism.

The goal is to implement the UI for the assessment, the logic for type calculation and elemental mapping, and the display of the user's psychological type and associated element within the "Identity Dynamics" section, explicitly linking this to Jungian psychodynamics.

## 2. Acceptance Criteria

*   **AC1 (UI - Assessment):** The user can access and complete a questionnaire or assessment designed to determine their Jungian Psychological Type (e.g., a series of multiple-choice questions) within the "Identity Dynamics" section (Mahamaya Ground onboarding/exploration).
*   **AC2 (Backend - Type Calculation):** Based on the user's answers, the system correctly calculates their psychological type (one of the 16 archetypal types).
*   **AC3 (Backend - Elemental & Psychodynamic Mapping):** The calculated psychological type is mapped to the four alchemical elements. This mapping will be based on a logic that reflects the dynamic qualities of the functions and attitudes, hinting at how these elemental energies contribute to the user's overall psychic economy and their path of individuation.
*   **AC4 (Backend - Data Storage):** The user's assessment answers (optional, for review/retake), their calculated psychological type, and the associated alchemical element are stored in their profile in MongoDB, as part of their Mahamaya Ground data.
*   **AC5 (UI - Display Type & Element):** Within the "Identity Dynamics" section (Mahamaya Ground), the user can clearly view their determined Jungian Psychological Type (e.g., "INTJ") and its corresponding alchemical element (e.g., "Air").
*   **AC6 (UI - Integration with Mahamaya Ground):** The display of the psychological type and element is visually and functionally integrated into the Mahamaya Ground interface, consistent with `ui-ux-spec.md`.
*   **AC7 (UI - Explanatory Information & Reflective Prompts):** The UI provides descriptions of the user's psychological type (dominant/auxiliary functions, attitude, and potential inferior function/shadow aspects) and its alchemical element. This is framed within Jungian psychology, emphasizing its relevance to the individuation journey—the lifelong process of becoming a more whole and authentic Self. Explanations will encourage reflection on how these typological preferences manifest and how engaging with less preferred functions can lead to greater psychic balance and integration, subtly alluding to the non-dual perspectives of traditions like Kashmir Saivism where all aspects are part of a unified consciousness.
*   **AC8 (Responsiveness):** The assessment UI and the display of results are responsive and function correctly across defined breakpoints as per `ui-ux-spec.md`.
*   **AC9 (Accessibility):** The assessment and results display adhere to accessibility standards (WCAG 2.1 AA) as per `ui-ux-spec.md`.

## 3. Tasks

*   **Task 3.1 (Research/Content):** Select or develop the set of questions for the Jungian Psychological Type assessment. Define the scoring logic for determining the 16 types.
*   **Task 3.2 (Research/Content):** Define the mapping logic from each of the 16 types to one of the four alchemical elements.
*   **Task 3.3 (Backend):** Implement the backend logic to process assessment answers, calculate the psychological type, and perform the elemental mapping.
*   **Task 3.4 (Backend):** Design the schema and implement storage for assessment data, psychological type, and elemental mapping in MongoDB.
*   **Task 3.5 (Backend):** Develop an API endpoint to submit assessment answers and retrieve the calculated type and element.
*   **Task 3.6 (Frontend):** Design and develop the UI components for the psychological type assessment questionnaire.
*   **Task 3.7 (Frontend):** Design and develop the UI components to display the user's psychological type, its description, its associated alchemical element, and its description within the Mahamaya Ground.
*   **Task 3.8 (Frontend):** Integrate the frontend components with the backend API.
*   **Task 3.9 (Testing):** Write unit tests for backend calculation and mapping logic. Test the assessment flow and results display on the UI for accuracy, responsiveness, and accessibility.

## 4. Technical Guidance & Considerations

*   **Assessment Instrument:** The choice of assessment questions and scoring logic is crucial. Consider using established, validated questions if possible, or clearly document the basis for custom questions. *Developer Note: Liaise with project lead/content expert for the assessment instrument and elemental mapping logic.*
*   **User Experience of Assessment:** The assessment should not be overly long or tedious. Provide clear instructions and progress indicators if it's multi-paged.
*   **Elemental Mapping Rationale & Symbolic Resonance:** The logic for mapping types to elements will be consistent with Jungian principles and Nara's broader philosophical framework. This mapping will draw parallels between elemental qualities and the dynamic characteristics of the Jungian functions, highlighting their role in the user's unique expression of consciousness and their journey towards integrating the Self. The symbolism should resonate with the idea of the psyche as a dynamic system seeking equilibrium and wholeness.
*   **Data Privacy:** If storing raw assessment answers, ensure this is communicated to the user and handled according to privacy policies.
*   **UI/UX:** Refer to `ui-ux-spec.md` for how the Mahamaya Ground elements are presented. The psychological type is another facet of the user's "archetypal DNA."
*   **BPMCP Integration:** As with other Mahamaya Ground elements, this data will eventually be integrated with the `bimba_map` via BPMCP.

## 5. Dependencies

*   Completion of Story 1.1 (Birthdate Encoding) as this is part of the Mahamaya Ground onboarding sequence.
*   Defined assessment questions, scoring logic, and type-to-element mapping.
*   Access to `ui-ux-spec.md` for design guidelines.
*   Access to `epic-1.md` for feature context.

## 6. Non-Functional Requirements

*   **Accuracy:** Type calculation and elemental mapping must be accurate according to the defined logic.
*   **Usability:** The assessment process should be user-friendly.

## 7. Open Questions/Assumptions

*   **Assumption:** The specific questions, scoring, and elemental mapping for the Jungian Psychological Types assessment will be provided or co-developed.
*   **Question:** Will users be able to retake the assessment? If so, how is historical data handled?
*   **Question:** What is the source/rationale for the type-to-element mapping?

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. Proceed to develop subsequent stories for Epic 1.