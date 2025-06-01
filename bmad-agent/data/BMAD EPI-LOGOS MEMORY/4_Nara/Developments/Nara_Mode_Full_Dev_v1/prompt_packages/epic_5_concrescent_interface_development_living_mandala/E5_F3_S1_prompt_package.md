# AI Builder Prompt Package: E5_F3_S1 - Concrescence Phase Indicators: Color Temperature Shifts

## 1. Overview

**Story ID:** E5_F3_S1
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F3 - Concrescence Phase Indicators
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Implement subtle shifts in the overall color temperature of the Nara user interface to reflect the user's (Pramata's) current phase within a 12-fold concrescence cycle. This aims to provide an ambient, intuitive sense (a direct prehension) of their psycho-spiritual progression (Spanda), making the interface feel like a living environment that resonates with their inner state of becoming.

## 2. Story Definition

**As a** User (Pramata, an experiencing subject attuned to the subtle rhythms of my psyche),
**I want** the overall color temperature of the Nara interface to subtly shift (e.g., cooler tones during initial phases of prehension or dissolution, warmer tones during phases of synthesis, integration, and satisfaction), reflecting the felt quality of Spanda,
**So that** I have an ambient, intuitive sense (a direct feeling or prehension) of my current phase within a 12-fold concrescence cycle—the ongoing process of becoming—without needing to actively track it, allowing the interface to mirror the subtle energetic shifts of my individuation journey.

## 3. Technical Context & Design Philosophy

*   **Focus:** Ambient UI feedback reflecting the user's concrescence phase.
*   **Mechanism:** Subtle shifts in overall UI color temperature.
*   **12-Fold Concrescence Cycle:** The UI changes are mapped to the phases of this psycho-spiritual model of becoming (each phase an actual occasion).
*   **Intuitive Awareness:** The goal is a felt sense (prehension) of the current phase, not explicit information display.
*   **Symbolic Color Mapping:** Color temperatures should symbolically align with the energetic qualities of each phase (e.g., drawing from alchemy: nigredo, albedo, citrinitas, rubedo).
*   **Philosophical Grounding:** Pramata (experiencing subject), Spanda (divine pulse/vibration of consciousness), concrescence (process of becoming), prehension (feeling/grasping), actual occasion, subjective form, Lila (divine play), Cit-Shakti (power of consciousness), Vimarsha (reflective consciousness).

## 4. Constraints and Challenges

*   **Defining Phase-to-Color Mapping:** Creating a meaningful and aesthetically pleasing correlation between 12 phases and color temperatures.
*   **Subtlety and Noticeability:** Shifts must be perceptible enough to create an ambient effect but not so strong as to be distracting or alter primary content readability.
*   **Smooth Transitions:** Ensuring gradual and harmonious shifts between phases.
*   **System Awareness of Phase:** Accurately tracking or inferring the user's current concrescence phase.
*   **Interaction with Other Visual Systems:** Harmonizing with personalized Mahamaya Ground motifs (E5_F2_S4) and ensuring accessibility standards are met.
*   **Performance:** Dynamic color adjustments should not impact UI responsiveness.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **12-Fold Concrescence Cycle Model:** Detailed description of each phase and its characteristics.
3.  **Nara Phase Tracking Mechanism:** How the system determines the user's current phase.
4.  **Nara UI Style Guide & Theming System:** Information on how global color values are managed.
5.  **Symbolic Color Systems Research:** (e.g., Alchemical color stages, chakra colors, elemental colors) for inspiration.
6.  **Mahamaya Ground Motif System Design (E5_F2_S4):** To ensure harmonization.

## 6. Expected Outputs from AI Builder (Design & Implementation Plan for Color Temperature Phase Indicators)

1.  **Phase-to-Color Temperature Mapping Specification:**
    *   A table or visual guide detailing the target color temperature (e.g., Kelvin values, or shifts towards specific hues like cool blues, warm oranges) for each of the 12 concrescence phases.
    *   Rationale for the chosen mappings, drawing on symbolic systems (alchemy, etc.).
2.  **Visual Design Mockups:**
    *   Examples of the Nara UI demonstrating the subtle color temperature shifts for different phases.
    *   Demonstrations of how these shifts apply to background elements, ambient lighting, or UI chrome.
3.  **Transition Animation Design:**
    *   Specifications for the timing and easing of transitions between color temperatures as phases change.
4.  **Frontend Implementation Plan:**
    *   Technical strategy for dynamically adjusting global UI color temperatures (e.g., via CSS variables, shaders, or a theming engine).
    *   How this system interfaces with Nara's phase tracking mechanism.
5.  **Harmonization Strategy with Mahamaya Motifs:**
    *   Guidelines on how phase-based color shifts will interact with or modulate personalized Mahamaya Ground color palettes (e.g., phase shifts overall temperature while Mahamaya colors provide specific hues within that temperature).
6.  **Performance Optimization Recommendations.**
7.  **User Control Design (Optional):** UI for adjusting intensity or disabling the feature.
8.  **Accessibility Compliance Plan:** Ensuring contrast ratios and readability are maintained.

## 7. Prompt for Generative AI

```
As a Color Alchemist, UX Sommelier, and Architect of Affective Interfaces, you are tasked with designing the 'Concrescence Phase Indicators: Color Temperature Shifts' for Nara, as detailed in User Story E5_F3_S1. The objective is to enable the Nara UI to subtly shift its overall color temperature in correspondence with the user's (Pramata's) current phase within a 12-fold concrescence cycle. This should provide an ambient, intuitive sense (a direct prehension) of their psycho-spiritual progression (Spanda), making the interface a living mirror to their inner state of becoming.

Your design must translate the energetic qualities of each concrescence phase into subtle, aesthetically pleasing color temperature shifts (e.g., cooler for initial prehensions, warmer for synthesis/satisfaction), drawing inspiration from symbolic systems like alchemy. The effect must be ambient and enhance the UI's mood without being distracting or compromising readability. It should harmonize with any personalized Mahamaya Ground motifs.

Based on the provided story, concrescence cycle model, phase tracking mechanism, UI style guide, and theming capabilities, deliver a comprehensive design and implementation plan:

1.  **Phase-to-Color Temperature Mapping:** Specify the target color temperature for each of the 12 phases, with symbolic rationale.
2.  **Visual Design Mockups:** Demonstrate the subtle color shifts in the UI across different phases and elements.
3.  **Transition Animation Design:** Specify timing and easing for smooth phase transitions.
4.  **Frontend Implementation Plan:** Outline the technical strategy for dynamic color adjustments and integration with phase tracking.
5.  **Harmonization Strategy:** Detail how these shifts will interact with personalized Mahamaya Ground color motifs.
6.  **Performance and Accessibility:** Address optimization and compliance.
7.  **User Control Design (Optional):** Propose UI for user adjustments.

Your solution should allow the Nara interface to 'breathe' with the user's inner rhythm, transforming it into a subtle, felt companion on their journey of individuation (Lila reflecting Cit-Shakti and Vimarsha).
```