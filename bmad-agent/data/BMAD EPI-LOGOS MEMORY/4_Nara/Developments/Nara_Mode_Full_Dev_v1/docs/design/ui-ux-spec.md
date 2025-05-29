# Nara_Mode_Full_Dev_v1 - Shakti UI/UX Specification

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Location:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/design/ui-ux-spec.md`

## Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the **Nara_Mode_Full_Dev_v1** frontend (Shakti aspect) interface. This specification is guided by Epi-Logos principles and the overall vision for **Nara_Mode_Full_Dev_v1**, focusing on symbolic "reading" and interpretive dialogue.

- **Link to Primary Design Files:** {e.g., Figma, Sketch, Adobe XD URL - specific to **Nara_Mode_Full_Dev_v1**}
- **Link to Deployed Storybook / Design System (if applicable for Nara_Mode_Full_Dev_v1):** {URL}
- **Link to Nara_Mode_Full_Dev_v1 Frontend Architecture:** `../architecture/front-end-architecture.md`
- **Link to Nara_Mode_Full_Dev_v1 PRD/EFDD:** `../1_feature_definition/efdd.md`

## Overall UX Goals & Principles (for Nara_Mode_Full_Dev_v1, Shakti Aspect)

- **Target User Personas (as Participants in Epi-Logos):** Users seeking transformative dialogue by co-creating meaning from symbolic inputs, including interpretation of structured symbolic systems (e.g., Tarot) and deconstruction of subjective experiences (dreams, visions, journal entries). These users are seekers/participants in the Epi-Logos experience, engaging in Dia-Logos.
- **Usability Goals (Epi-Logos Aligned):** Ease of use for symbolic input, clarity in presenting interpretive synthesis, efficiency in navigating dialogue, promoting reflective engagement and self-discovery, and fostering co-creative meaning-making.
- **Design Principles (Guided by Epi-Logos):**
  - Clarity over cleverness: Interpretations should be clear and understandable.
  - Consistency: Consistent interaction patterns for various symbolic inputs.
  - Provide feedback: Clear feedback on input processing and interpretation generation.
  - Resonance with Epi-Logos_Concept: Design should align with Nara's role in "Dia-Logos" and its internal quaternal structure.
  - Facilitate transformative dialogue: The UI should encourage and and support ongoing interpretive dialogue.
  - **Quaternary Logic Integration:** The UI/UX should visually and functionally embody the four-fold structure, allowing the system to operate at multiple levels simultaneously.
  - **Dynamic Triad:** The Identity Dynamics, Oracle, and Journal sections should operate as integrated phases of a larger transformational cycle, with clear feedback loops.
  - **Personalized Archetypal Map:** The Identity Dynamics section should function as a living archetypal map, evolving with the user's journey, potentially through visual mandala-like representations.
  - **Rich Symbolic Environment:** The Oracle section should support dynamic, intuitive layouts for card spreads, with visual integration of card imagery and related archetypal symbols, and voice interaction.
  - **Reflective Mirror:** The Journal section should act as a mirror reflecting unconscious processes, promoting integration and growth through sophisticated NLP.
  - **Recursive Interface Design:** UI elements should self-modify and evolve based on user interaction and progress through the 12-fold concrescence rhythm, including color temperature shifts, typographic weight changes, and interface opacity levels.
  - **Multimodal Experience:** Support for multimedia synthesis, including planetary soundscapes, archetypal video collages, and haptic feedback patterns.

## Information Architecture (IA) for Nara_Mode_Full_Dev_v1

- **Site Map / Screen Inventory (for Nara_Mode_Full_Dev_v1):**
  ```mermaid
  graph TD
      A[Nara Main Interface] --> B(Identity Dynamics);
      A --> C(Oracle);
      A --> D(Journal);
      B --> B1(Mahamaya Ground);
      B --> B2(Archetypal Profile);
      C --> C1(Tarot Readings);
      C --> C2(Concrescence Spreads);
      C --> C3(Alchemical Visionary Sequences);
      D --> D1(Journal Entries);
      D --> D2(Insights & Reflections);
      D --> D3(Journal Synthesis Engine);
      B1 --> B1a(Birthdate Encoding);
      B1 --> B1b(Natal Chart);
      B1 --> B1c(Jungian Psychological Types);
      B1 --> B1d(Gene Keys);
      B1 --> B1e(Human Design);
      B1 --> B1f(Archetypal Quintessence);
  ```
  - Nara Main Interface: Entry point for all Nara mode functionalities, reflecting the integrated triad of Identity Dynamics, Oracle, and Journal.
  - Identity Dynamics: Where users explore their archetypal profile and personal foundations, including the foundational Mahamaya Ground.
  - Mahamaya Ground: A dedicated section for the user's unique archetypal DNA, encompassing Birthdate Encoding, Natal Chart, Jungian Psychological Types, Gene Keys, Human Design, and Archetypal Quintessence.
  - Oracle: Interface for engaging with structured symbolic readings, including traditional Tarot Readings, Concrescence Spreads, and Alchemical Visionary Sequences.
  - Journal: For personal reflections, tracking insights, and inverse readings of subjective experiences, powered by a Journal Synthesis Engine.

- **Navigation Structure (within Nara_Mode_Full_Dev_v1):** Primary navigation will allow switching between "Identity Dynamics", "Oracle", and "Journal" modes. The flow within each mode will be guided by the interpretive process, leading to a dialogue interface. The Mahamaya Ground will be a persistent reference within Identity Dynamics. Contextual links will allow access to A2A query results and Notion for deeper dives.

## User Flows (for Nara_Mode_Full_Dev_v1)

### Mahamaya Ground Onboarding Flow

- **Goal:** First-time user establishes their foundational archetypal profile.
- **Steps / Diagram:**
  ```mermaid
  graph TD
      Start[User initiates Onboarding] --> InputBirthdate[User provides birthdate];
      InputBirthdate --> GenerateNatalChart[Nara generates Natal Chart];
      GenerateNatalChart --> CompleteJungianQuiz[User completes Jungian Psychological Types assessment];
      CompleteJungianQuiz --> DisplayGeneKeys[Nara displays Gene Keys profile];
      DisplayGeneKeys --> DisplayHumanDesign[Nara displays Human Design chart];
      DisplayHumanDesign --> SynthesizeQuintessence[Nara synthesizes Archetypal Quintessence];
      SynthesizeQuintessence --> End[Mahamaya Ground established and accessible];
  ```

### Structured Symbolic Reading (e.g., Tarot)

- **Goal:** User obtains a rich, layered interpretation of symbolic inputs from a structured system and engages in further dialogue.
- **Steps / Diagram:**
  ```mermaid
  graph TD
      Start[User initiates Tarot Reading] --> SelectSpread[User selects spread option (including Concrescence Spreads)];
      SelectSpread --> InputCards[User provides card draws & context];
      InputCards --> ProcessInterpretation[Nara processes & synthesizes interpretation (incorporating decanic associations, multimedia synthesis)];
      ProcessInterpretation --> DisplayInterpretation[Display rich interpretation (with dynamic card rendering, AR overlay)];
      DisplayInterpretation --> Dialogue[Engage in responsive dialogue (via text or voice)];
      Dialogue -- Query Epii --> A2AContext[Display A2A Contextual Query Results];
      A2AContext --> Dialogue;
      Dialogue --> End[User concludes session];
  ```

### Inverse Reading (Subjective Experience Deconstruction)

- **Goal:** User gains insights and understanding from their subjective experiences through symbolic deconstruction and guided dialogue.
- **Steps / Diagram:**
  ```mermaid
  graph TD
      Start[User initiates Inverse Reading] --> InputExperience[User shares dream/journal entry];
      InputExperience --> ProcessDeconstruction[Nara extracts symbols & associates (Journal Synthesis Engine)];
      ProcessDeconstruction --> DisplayInsights[Display observations & questions (including alchemical operations, codon mappings)];
      DisplayInsights --> Dialogue[Engage in responsive dialogue (based on archetypal composting)];
      Dialogue -- Query Epii --> A2AContext[Display A2A Contextual Query Results];
      A2AContext --> Dialogue;
      Dialogue --> End[User concludes session];
  ```

## Wireframes & Mockups (for Nara_Mode_Full_Dev_v1)

{Reference the main design file link above (specific to **Nara_Mode_Full_Dev_v1**). Optionally embed key mockups or describe main screen layouts for **Nara_Mode_Full_Dev_v1**.}

- **Nara Main Interface:** Layout emphasizing the integrated triad of Identity Dynamics, Oracle, and Journal, with dynamic concrescence phase indicators.
- **Identity Dynamics Profile:** Interactive display of archetypal information, utilizing visual mandala-like representations and a dynamic Mahamaya Matrix sigil/glyph.
- **Mahamaya Ground Interface:** A dedicated interactive visual element (e.g., a six-petaled flower) that reveals each layer of the user's archetypal foundation upon exploration.
- **Tarot Reading Interface:** Layout for card spreads (traditional, dynamic, concrescence), interpretation display, and interaction controls, featuring dynamic card rendering, visual integration of archetypal symbols, and voice interaction prompts.
- **Journal Entry Screen:** Input area for text, display of analysis results (alchemical operations, codon mappings), and reflection prompts, with journaling palimpsests and dynamic symbolic metabolism indicators.

## Component Library / Design System Reference (for Nara_Mode_Full_Dev_v1)

{Reference the global design system from `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Interface)/Design_System.md` and specify any new components or variations created for **Nara_Mode_Full_Dev_v1**. New components should be documented in `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/design/components/`.}

- **Navigation Bar:** Consistent navigation elements across the application, potentially with concrescence phase indicators (color shifts, typographic changes).
- **Card Components:** Reusable components for displaying Tarot cards and other symbolic imagery, supporting dynamic rendering, AR overlays, and evolving patina effects.
- **Text Input Fields:** Standardized input fields for journal entries and queries, integrated with NLP feedback.
- **Button & Call-to-Action Elements:** Consistent styling for interactive buttons, potentially with haptic feedback.
- **Data Visualization Components:** For displaying archetypal profiles, analytical insights, and the dynamic Mahamaya Matrix, including interactive mandalas and evolving visual elements.
- **Multimedia Playback Components:** For integrating planetary soundscapes and archetypal video collages.

## Branding & Style Guide Reference (for Nara_Mode_Full_Dev_v1)

{Link to the primary source (e.g., `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Brand_Guidelines.md`) or define key elements here if they are specific or nuanced for **Nara_Mode_Full_Dev_v1**.}

- **Color Palette (for Nara_Mode_Full_Dev_v1):** {Primary, Secondary, Accent, Feedback colors (hex codes). Note if these are variations for **Nara_Mode_Full_Dev_v1** from the global palette.} Dynamic color schemes derived from planetary hours of birth and concrescence phase indicators.
- **Typography (for Nara_Mode_Full_Dev_v1):** {Font families, sizes, weights for headings, body, etc., within **Nara_Mode_Full_Dev_v1**.} Dynamic typographic weight changes during decisive phases.
- **Iconography (for Nara_Mode_Full_Dev_v1):** {Link to icon set, usage notes for **Nara_Mode_Full_Dev_v1**.} Icons may evolve with user interaction.
- **Spacing & Grid (for Nara_Mode_Full_Dev_v1):** {Define margins, padding, grid system rules for **Nara_Mode_Full_Dev_v1**.} Layouts should adapt seamlessly to various screen sizes, maintaining the integrity of visual mandalas and dynamic elements.
- **Imagery:** Guidelines for the use of symbolic and evocative imagery, including dynamic card canvas evolution and archetypal video collages.
- **Geometric Patterns:** Integration of geometric patterns generated from quaternary compass angles.
- **Rhythmic Interface Animations:** Guidelines for subtle animations tied to personal biorhythms and concrescence phases.

## Accessibility (AX) Requirements (for Nara_Mode_Full_Dev_v1)

- **Target Compliance:** {e.g., WCAG 2.1 AA, as per `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Accessibility_Guidelines.md`}
- **Specific Requirements for Nara_Mode_Full_Dev_v1:** {Keyboard navigation patterns, ARIA landmarks/attributes for complex components within **Nara_Mode_Full_Dev_v1**, color contrast minimums.} Adherence to WCAG guidelines for color contrast ratios, considering dynamic color changes. Options for adjusting font sizes for readability, alongside dynamic typographic adjustments. User controls for haptic feedback intensity or disabling.

## Responsiveness (for Nara_Mode_Full_Dev_v1)

- **Breakpoints:** {Define pixel values for mobile, tablet, desktop, etc., for **Nara_Mode_Full_Dev_v1**.}
- **Adaptation Strategy for Nara_Mode_Full_Dev_v1:** {Describe how layout and components adapt across breakpoints. Reference designs for **Nara_Mode_Full_Dev_v1**.} Ensure smooth animations and quick loading times across devices, especially for multimedia synthesis and recursive interface updates.

## Change Log (for Nara_Mode_Full_Dev_v1 UI/UX Specification)

| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| Initial Draft | 2024-05-25 | 0.1 | Based on `Nara_initial_development_doc_25_5_25.md` | Epi-Logos Design Architect |
| UI/UX Refinement | [Current Date] | 0.2 | Incorporated detailed UI/UX concepts from `Nara Perplexity High Level Planning.md`, including Mahamaya Ground, recursive interface design, and multimodal interactions. | Epi-Logos Design Architect |