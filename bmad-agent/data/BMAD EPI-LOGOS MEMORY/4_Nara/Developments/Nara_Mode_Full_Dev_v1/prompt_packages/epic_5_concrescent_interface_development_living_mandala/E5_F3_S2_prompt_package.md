# AI Builder Prompt Package: E5_F3_S2 - Concrescence Phase Indicators: Typographic Weight

## 1. Overview

**Story ID:** E5_F3_S2
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F3 - Concrescence Phase Indicators
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Implement subtle changes in the typographic weight of designated UI text elements (e.g., headings, key prompts) to reflect the user's (Pramata's) current phase within a 12-fold concrescence cycle. This serves as another ambient, intuitive cue (a felt prehension) about their psycho-spiritual progression (Spanda), reinforcing the UI's responsiveness as a living mirror to their creative advance.

## 2. Story Definition

**As a** User (Pramata, an experiencing subject engaging in a process of active imagination and self-discovery),
**I want** the typographic weight used for certain UI text elements (e.g., headings, prompts that are data for prehension) to subtly change (e.g., lighter fonts during reflective, receptive phases of Vimarsha or initial prehensions; bolder fonts during decisive, integrative phases of strong subjective aim or Iccha Shakti),
**So that** I have another ambient, intuitive cue (a felt prehension) about my current phase within a 12-fold concrescence cycle—the creative advance of my experience—reinforcing the UI's responsiveness as a living mirror to my psychic Spanda.

## 3. Technical Context & Design Philosophy

*   **Focus:** Ambient UI feedback via typographic weight changes, reflecting concrescence phase.
*   **Mechanism:** Subtle adjustments to font weight for selected text elements.
*   **12-Fold Concrescence Cycle:** Typographic changes are mapped to phases of this model (each an actual occasion with a specific subjective form).
*   **Subjective Intensity:** Font weight can symbolize the intensity or quality of the user's subjective experience or aim (e.g., lighter for receptivity/Vimarsha, bolder for focused will/Iccha Shakti).
*   **Selective Application:** Changes apply only to specific, appropriate text elements to maintain clarity and impact.
*   **Philosophical Grounding:** Pramata, Spanda, concrescence, prehension, actual occasion, subjective form, Vimarsha (reflective consciousness), Iccha Shakti (power of will), Lila.

## 4. Constraints and Challenges

*   **Defining Phase-to-Weight Mapping:** Creating a meaningful and aesthetically sound correlation between 12 phases and typographic weights.
*   **Subtlety vs. Readability:** Ensuring changes are noticeable enough to be felt but do not impair legibility or create visual clutter.
*   **Font Support:** Requires fonts that offer a sufficient range of weights or variable font capabilities.
*   **Selective Element Choice:** Identifying which UI text elements are most suitable for this effect.
*   **Harmonization:** Coordinating with other phase indicators (like color temperature) and overall UI aesthetics.
*   **Accessibility:** Maintaining readability for all users, especially those with visual impairments.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **12-Fold Concrescence Cycle Model:** Detailed phase descriptions.
3.  **Nara Phase Tracking Mechanism.**
4.  **Nara UI Style Guide & Typography System:** Information on current font families and their available weights.
5.  **List of Key UI Text Elements:** Potential candidates for typographic modification (headings, prompts, etc.).
6.  **Design of Color Temperature Phase Indicators (E5_F3_S1):** For ensuring harmonious interplay.

## 6. Expected Outputs from AI Builder (Design & Implementation Plan for Typographic Weight Phase Indicators)

1.  **Phase-to-Typographic Weight Mapping Specification:**
    *   A table detailing the target font weight (e.g., specific numerical weights like 300, 400, 600, or descriptive terms if using variable fonts) for designated text elements in each of the 12 concrescence phases.
    *   Rationale for the mappings, linking font weight to the subjective intensity or nature of each phase (e.g., Vimarsha, Iccha Shakti).
2.  **Visual Design Mockups:**
    *   Examples of UI screens showing the typographic weight changes for different phases and text elements.
3.  **List of Targeted UI Elements:** Clear identification of which specific text components will be affected.
4.  **Transition Animation Design (If applicable):** Specifications for smooth transitions in font weight if technically feasible and desired.
5.  **Frontend Implementation Plan:**
    *   Technical strategy for dynamically adjusting font weights (e.g., via CSS classes, inline styles, or variable font settings).
    *   Integration with Nara's phase tracking mechanism.
6.  **Harmonization Guidelines:** How typographic changes will complement color temperature shifts and other UI elements.
7.  **Accessibility Compliance Plan:** Ensuring readability and contrast are maintained, with considerations for user overrides if necessary.
8.  **User Control Design (Optional):** UI for adjusting intensity or disabling the feature.

## 7. Prompt for Generative AI

```
As a Typographic Alchemist and Maestro of Microinteractions, you are tasked with designing the 'Concrescence Phase Indicators: Typographic Weight' for Nara, as detailed in User Story E5_F3_S2. The objective is to enable designated UI text elements (headings, key prompts) to subtly change their typographic weight in correspondence with the user's (Pramata's) current phase within a 12-fold concrescence cycle. This will provide another ambient, intuitive cue (a felt prehension) of their psycho-spiritual progression (Spanda), reflecting the subjective intensity (e.g., Vimarsha, Iccha Shakti) of each phase.

Your design must ensure these typographic shifts are subtle yet perceptible, enhancing the UI's responsiveness without compromising readability or aesthetic harmony. The changes should be selectively applied and work in concert with other phase indicators like color temperature.

Based on the provided story, concrescence cycle model, phase tracking, UI typography system, and list of potential text elements, deliver a comprehensive design and implementation plan:

1.  **Phase-to-Typographic Weight Mapping:** Specify target font weights for designated elements in each of the 12 phases, with rationale linking weight to subjective intensity (Vimarsha, Iccha Shakti).
2.  **Visual Design Mockups:** Demonstrate typographic changes across different phases and UI elements.
3.  **Targeted UI Elements List:** Clearly identify which text components are affected.
4.  **Transition Design (If applicable):** Specify smooth weight transitions.
5.  **Frontend Implementation Plan:** Outline the technical strategy for dynamic font weight adjustment and phase tracking integration.
6.  **Harmonization Guidelines:** Detail how typographic changes will complement other indicators and UI aesthetics.
7.  **Accessibility Compliance Plan:** Ensure readability and provide for user overrides if needed.
8.  **User Control Design (Optional):** Propose UI for user adjustments.

Your solution should make the Nara interface 'speak' through its typography, subtly echoing the user's inner state of becoming and the creative advance of their experience.
```