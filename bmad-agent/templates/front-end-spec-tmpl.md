# {Development Name} - Shakti UI/UX Specification

**Context:** {PhilosophicalLayer} / {Subsystem}
**Location:** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/design/ui-ux-spec.md` (or sharded within `../docs/frontend_shards/`)

## Introduction

{State the purpose - to define the user experience goals, information architecture, user flows, and visual design specifications for the **{Development Name}** frontend (Shakti aspect) interface. This specification is guided by Epi-Logos principles and the overall vision for **{DevelopmentName}**.}

- **Link to Primary Design Files:** {e.g., Figma, Sketch, Adobe XD URL - specific to **{Development Name}**}
- **Link to Deployed Storybook / Design System (if applicable for {Development Name}):** {URL}
- **Link to {Development Name} Frontend Architecture:** `../architecture/front-end-architecture.md`
- **Link to {Development Name} PRD/EFDD:** `../1_feature_definition/efdd.md`

## Overall UX Goals & Principles (for {Development Name}, Shakti Aspect)

- **Target User Personas (as Participants in Epi-Logos):** {Reference personas or briefly describe key user types and their goals relevant to **{Development Name}** and its role within the **{Subsystem}**. How does this interface facilitate their participation in the Epi-Logos experience?}
- **Usability Goals (Epi-Logos Aligned):** {e.g., Ease of learning, efficiency of use, error prevention for **{Development Name}** features, promoting reflective engagement.}
- **Design Principles (Guided by Epi-Logos):** {List 3-5 core principles guiding the UI/UX design for **{Development Name}** - e.g., "Clarity over cleverness," "Consistency," "Provide feedback," "Resonance with {Epi-Logos_Concept}". These should align with broader Epi-Logos UX philosophy defined in `{epi-logos-memory-root}/Epi-Logos Project (Philosophy)/Design_Philosophy.md`.}

## Information Architecture (IA) for {Development Name}

- **Site Map / Screen Inventory (for {Development Name}):**
  ```mermaid
  graph TD
      A[Main Screen for {Development Name}] --> B(Sub-feature 1 View);
      A --> C{Sub-feature 2 Settings};
      B --> D[Detail Page for Sub-feature 1];
  ```
  _(Or provide a list of all screens/pages relevant to **{Development Name}**)_
- **Navigation Structure (within {Development Name}):** {Describe primary navigation (e.g., top bar, sidebar), secondary navigation, breadcrumbs, etc., as it pertains to **{Development Name}** and its integration with the broader `{Subsystem}` or application interface.}

## User Flows (for {Development Name})

{Detail key user tasks within **{Development Name}**. Use diagrams or descriptions. These flows should reflect how users interact with the Shakti aspect to achieve goals defined by the Epi-Logos Feature Definer.}

### {User Flow Name, e.g., User Login for {Development Name}}

- **Goal:** {What the user wants to achieve within **{Development Name}**.}
- **Steps / Diagram:**
  ```mermaid
  graph TD
      Start --> Action1[User performs action within {Development Name}];
      Action1 --> CheckCondition{Condition Met?};
      CheckCondition -- Yes --> SuccessScreen[Show Success for {Development Name}];
      CheckCondition -- No --> ErrorScreen[Show Error for {Development Name}];
      ErrorScreen --> Action1;
  ```
  _(Or: Link to specific flow diagram in Figma/Miro for **{Development Name}**)_

### {Another User Flow Name for {Development Name}}

{...}

## Wireframes & Mockups (for {Development Name})

{Reference the main design file link above (specific to **{Development Name}**). Optionally embed key mockups or describe main screen layouts for **{Development Name}**.}

- **Screen / View Name 1 (within {Development Name}):** {Description of layout and key elements. Link to specific Figma frame/page for **{Development Name}**.}
- **Screen / View Name 2 (within {Development Name}):** {...}

## Component Library / Design System Reference (for {Development Name})

{Reference the global design system from `{epi-logos-memory-root}/Epi-Logos System (Interface)/Design_System.md` and specify any new components or variations created for **{Development Name}**. New components should be documented in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/design/components/`.}

## Branding & Style Guide Reference (for {Development Name})

{Link to the primary source (e.g., `{epi-logos-memory-root}/Epi-Logos Project (Philosophy)/Brand_Guidelines.md`) or define key elements here if they are specific or nuanced for **{Development Name}**.}

- **Color Palette (for {Development Name}):** {Primary, Secondary, Accent, Feedback colors (hex codes). Note if these are variations for **{DevelopmentName}** from the global palette.}
- **Typography (for {Development Name}):** {Font families, sizes, weights for headings, body, etc., within **{DevelopmentName}**.}
- **Iconography (for {Development Name}):** {Link to icon set, usage notes for **{DevelopmentName}**.}
- **Spacing & Grid (for {Development Name}):** {Define margins, padding, grid system rules for **{DevelopmentName}**.}

## Accessibility (AX) Requirements (for {Development Name})

- **Target Compliance:** {e.g., WCAG 2.1 AA, as per `{epi-logos-memory-root}/Epi-Logos Project (Philosophy)/Accessibility_Guidelines.md`}
- **Specific Requirements for {Development Name}:** {Keyboard navigation patterns, ARIA landmarks/attributes for complex components within **{DevelopmentName}**, color contrast minimums.}

## Responsiveness (for {Development Name})

- **Breakpoints:** {Define pixel values for mobile, tablet, desktop, etc., for **{DevelopmentName}**.}
- **Adaptation Strategy for {Development Name}:** {Describe how layout and components adapt across breakpoints. Reference designs for **{DevelopmentName}**.}

## Change Log (for {Development Name} UI/UX Specification)

| Change        | Date       | Version | Description         | Author         |
| ------------- | ---------- | ------- | ------------------- | -------------- |
