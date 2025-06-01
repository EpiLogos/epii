# AI Builder Prompt Package: E5_F3_S3 - Concrescence Phase Indicators: Opacity/Transparency

**Project:** Nara Concrescent Interface Development
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F3 - Concrescence Phase Indicators
**Story ID:** E5_F3_S3 - Develop Concrescence Phase Indicators: Opacity/Transparency as Veiling/Unveiling of Potential

## 1. Context Overview

This prompt package is for designing and planning the implementation of a subtle UI feature in Nara: dynamic changes in the opacity or transparency of selected non-critical UI elements. These changes will serve as an ambient indicator of the user's current phase within a 12-fold concrescence cycle. The core idea is to reflect the philosophical concept of "veiling/unveiling of potential" – how different phases of becoming (concrescence) involve varying degrees of definiteness versus openness to potentiality (Lila, Spanda, Cit-Shakti).

## 2. Story Definition (from E5_F3_S3)

**As a** User (Pramata, an experiencing subject navigating the interplay of the manifest and unmanifest),
**I want** the opacity or transparency of certain non-critical UI elements (e.g., background layers, decorative elements, perhaps hinting at the Mahamaya ground) to subtly change (e.g., more translucent during dissolution/contemplative phases where potentiality is high and forms are less defined; more solid during integration/focused work where specific actual occasions achieve definite satisfaction),
**So that** I receive a further ambient cue (a subtle prehension of the shifting veils of Lila) about my current phase within a 12-fold concrescence cycle, adding to the UI's dynamic and responsive nature as a field for the psyche's unfolding (Spanda).

## 3. Technical & Philosophical Context

*   **UI/UX Focus:** The primary goal is to enhance the user's ambient awareness of their psycho-spiritual rhythm through subtle, non-intrusive visual cues.
*   **12-Fold Concrescence Rhythm:** The opacity changes are directly tied to a 12-phase model of concrescence, representing a cycle of becoming or experience.
*   **Intuitive Awareness:** The effect should be felt more than explicitly noticed, contributing to an intuitive sense of the current phase's quality (e.g., openness, definition, dissolution, integration).
*   **Symbolic Opacity Mapping:** The core design challenge is to map phases to opacity levels in a way that symbolically reflects the interplay of manifest form and unmanifest potential.
*   **Philosophical Grounding:** The feature draws on concepts like Pramata (experiencing subject), Lila (divine play), Spanda (creative pulsation), Cit-Shakti (consciousness-power), Unus Mundus (unified reality), and Whiteheadian prehensions (how actual occasions grasp and integrate data from their environment).

## 4. Constraints & Design Challenges

*   **Defining Phase-to-Opacity Mapping:** Establishing a meaningful and intuitive correlation between each of the 12 phases and specific opacity/transparency characteristics (e.g., more translucent for phases emphasizing potentiality, more solid for phases emphasizing definiteness).
*   **Subtlety vs. Perceptibility:** Changes must be subtle enough not to distract but noticeable enough to provide an ambient cue.
*   **Aesthetic Harmony:** Opacity shifts must integrate seamlessly with the overall UI aesthetics and other dynamic elements (like Mahamaya motifs, color temperature, typographic weight).
*   **Readability & Usability:** Core interactive elements, primary text, and essential information must *always* maintain full readability and usability. Opacity changes apply *only* to non-critical, often decorative or background, elements.
*   **Smooth Transitions:** Animations between opacity states must be smooth and unobtrusive.
*   **System Awareness:** Relies on Nara's ability to track or infer the user's current concrescence phase.
*   **Selective Application:** Careful selection of UI elements that can afford to have their opacity modulated without impacting core functionality.
*   **Performance:** Opacity changes, especially if animated, should not degrade UI performance.
*   **User Controllability (Optional):** Consideration for allowing users to adjust intensity or disable the feature.
*   **Accessibility:** Ensuring changes do not negatively impact users with visual sensitivities; maintaining sufficient contrast for essential elements.
*   **Harmonization:** Must work in concert with E5_F3_S1 (Color Temperature) and E5_F3_S2 (Typographic Weight).

## 5. Inputs for AI Builder

1.  **User Story Document:** `story_E5_F3_S3_concrescence_phase_indicators_opacity_transparency.md` (this document's source).
2.  **Concrescence Cycle Model:** A detailed definition of the 12 phases, their characteristics, and their sequence.
3.  **Phase Tracking Mechanism:** Information on how Nara determines the user's current phase.
4.  **Nara UI Style Guide & Component Library:** Existing design language, color palettes, and standard UI components.
5.  **Candidate UI Elements List:** Examples or categories of non-critical UI elements that could be targeted for opacity changes (e.g., background textures, subtle geometric patterns, decorative borders, ethereal Mahamaya ground hints).
6.  **Symbolic Research (Optional):** Any existing research or theories on the symbolic meaning of transparency, translucency, and opacity in relation to psychological states, spiritual concepts, or cyclical processes (e.g., veiling/unveiling, presence/absence, potential/actual).
7.  **Specifications for Related Indicators:** Design documents for E5_F3_S1 (Color Temperature) and E5_F3_S2 (Typographic Weight) to ensure cohesive design.

## 6. Expected Outputs from AI Builder

1.  **Phase-to-Opacity/Transparency Mapping Specification:**
    *   A table or detailed description mapping each of the 12 concrescence phases to specific opacity/transparency values (e.g., 0.0 to 1.0) or qualitative states (e.g., "highly translucent," "semi-opaque," "fully solid") for designated UI element categories.
    *   Rationale for each mapping, linking it to the phase's characteristics and the concept of "veiling/unveiling of potential."
2.  **Visual Design Mockups/Prototypes:**
    *   Static mockups and/or simple animated prototypes illustrating how these opacity changes would appear in the Nara UI across several key phases (e.g., a phase of high potentiality, a phase of focused integration, a phase of dissolution).
    *   Demonstrate application to different types of non-critical elements.
    *   Highlight subtlety and aesthetic integration.
3.  **Transition Design Specifications:**
    *   Recommendations for the timing, easing curves, and duration of opacity transitions between phases to ensure smoothness and prevent jarring effects.
4.  **UI Element Selection Guidelines & Examples:**
    *   Clear criteria for identifying suitable non-critical UI elements for opacity modulation.
    *   Examples of "do's and don'ts" to maintain core usability and readability.
5.  **Frontend Implementation Plan & Considerations:**
    *   High-level recommendations for implementing dynamic opacity changes in the target frontend framework (e.g., CSS custom properties, JavaScript animations).
    *   Notes on performance optimization (e.g., hardware acceleration, minimizing reflows).
6.  **Harmonization Strategy with Other Indicators:**
    *   Guidelines on how opacity changes should visually and conceptually integrate with color temperature shifts (E5_F3_S1) and typographic weight changes (E5_F3_S2) to create a unified ambient feedback system.
7.  **Performance Impact Analysis:**
    *   Identification of potential performance bottlenecks and suggested mitigation strategies.
8.  **User Control Design (If Deemed Necessary):**
    *   If user controls are included, provide mockups and interaction design for settings to adjust the intensity of opacity shifts or disable the feature.
9.  **Accessibility Review & Guidelines:**
    *   A review of potential accessibility issues and guidelines to ensure that opacity changes do not compromise usability for users with visual impairments (e.g., maintaining minimum contrast ratios for any text overlaid on elements with changing opacity).

## 7. Prompt for Generative AI

```
As an expert UI/UX designer and frontend strategist specializing in ambient, philosophically-grounded interfaces, you are tasked with designing the "Opacity/Transparency as Veiling/Unveiling of Potential" feature for the Nara application, as detailed in Story E5_F3_S3.

**Objective:** Develop a system where the opacity/transparency of selected non-critical UI elements subtly shifts to reflect the user's current phase in a 12-fold concrescence cycle. This should provide an ambient, intuitive cue about the interplay between manifest form and unmanifest potential, enhancing the UI's dynamic and responsive nature.

**Given Inputs (assume access to):**
1.  The full User Story E5_F3_S3.
2.  A detailed 12-phase concrescence cycle model (describing the quality of each phase, e.g., Phase 1: Initial Receptivity - high potential, low definition; Phase 6: Peak Integration - high definition, focused energy; Phase 12: Dissolution & Release - fading forms, return to potential).
3.  Nara's UI style guide, component library, and examples of non-critical decorative/background elements (e.g., subtle background patterns, ethereal geometric overlays, Mahamaya ground hints).
4.  Specifications for related indicators: E5_F3_S1 (Color Temperature) and E5_F3_S2 (Typographic Weight).

**Produce the Following Outputs (as detailed in Section 6 of the Prompt Package E5_F3_S3_prompt_package.md):

1.  **Phase-to-Opacity/Transparency Mapping Specification:** Create a clear mapping for all 12 phases to opacity values/states for designated element types. Justify each choice based on the phase's nature (potential vs. actuality, veiling vs. unveiling).
    *   *Example Detail Level:* "Phase 1 (Initial Receptivity): Background decorative elements at 30% opacity (highly translucent) to signify openness to potential. Mahamaya ground hints at 20% opacity, very subtle." "Phase 6 (Peak Integration): Background decorative elements at 80% opacity (semi-solid) to signify focused form. Mahamaya ground hints at 60% opacity, more present."

2.  **Visual Design Mockups/Prototypes:** Provide visual examples (static or described for animation) for at least 3 distinct phases, showing how opacity changes affect different non-critical elements. Emphasize subtlety and aesthetic appeal. Describe the intended 'feel'.

3.  **Transition Design Specifications:** Define how opacity transitions between phases should occur (e.g., duration, easing functions) to ensure smoothness.

4.  **UI Element Selection Guidelines & Examples:** Provide clear rules for choosing which elements can have their opacity changed, ensuring no impact on essential UI components or text readability. Give examples of suitable and unsuitable elements.

5.  **Frontend Implementation Plan & Considerations:** Briefly outline technical approaches for implementation (CSS/JS) and key performance considerations (e.g., use of `opacity` vs. `rgba`, hardware acceleration).

6.  **Harmonization Strategy with Other Indicators:** Explain how these opacity shifts will complement and work harmoniously with the planned color temperature and typographic weight changes, creating a cohesive set of ambient cues.

7.  **Performance Impact Analysis:** Briefly discuss potential performance issues and how to mitigate them.

8.  **User Control Design (Optional but Recommended):** Sketch or describe simple user controls for adjusting the intensity or toggling this feature.

9.  **Accessibility Review & Guidelines:** Outline key accessibility considerations, especially regarding contrast and legibility if any text is near or on elements with modulated opacity.

**Focus on:**
*   **Philosophical Resonance:** Ensure the design choices deeply reflect the story's intent of "veiling/unveiling potential."
*   **Subtlety and Ambience:** The effect should be felt, not overtly distracting.
*   **Practicality:** Solutions should be implementable and performant.
*   **Holistic Integration:** Consider how this feature fits within the broader Nara UI and its other dynamic elements.

Present your response in a structured format, addressing each of the 9 output points clearly and comprehensively.
```