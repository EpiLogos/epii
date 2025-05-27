# Create Frontend Architecture Task (Shakti Aspect for {Development Name})

## Purpose

To define the technical architecture for the frontend (Shakti aspect) of a specific **{Development Name}** within its **{PhilosophicalLayer} / {Subsystem}**. This includes selecting appropriate patterns, structuring the codebase, defining component strategy, planning state management, outlining API interactions, and setting up testing and deployment approaches, all while adhering to the guidelines in the (Epi-Logos aligned) `front-end-architecture-tmpl.md` template. The output document will be stored at `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/architecture/front-end-architecture.md`.

This task is typically executed by the **Epi-Logos Design Architect**.

## Inputs (for {Development Name})

- **Epi-Logos Feature Definition Document (EFDD):** From `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/features/efdd.md`.
- **UI/UX Specification for {Development Name}:** From `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/design/ui-ux-spec.md` (or sharded docs in `.../docs/frontend_shards/`).
- **Main System Architecture Document for {Development Name} (Feature Context & Bimba-Alignment Package):** From `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/architecture/index.md` (or `architecture.md`). Particularly note overall system structure, "Definitive Tech Stack Selections", and API contracts.
- **Primary Design Files (Figma, Sketch, etc.):** Linked from UI/UX Spec for **{Development Name}**.
- **Relevant Epi-Logos Memory Context:**
    - `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Design_Philosophy.md`
    - `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/5-3_Sakti/` (Frontend Patterns, State Management Guidelines, etc.)
    - `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md`

## Key Activities & Instructions (for {Development Name})

### 1. Confirm Interaction Mode

- Ask the user: "How would you like to proceed with creating the frontend architecture for **{DevelopmentName}**? We can work: A. Incrementally (Default & Recommended) or B. "YOLO" Mode."
- Confirm the selected mode.

### 2. Review Inputs & Establish Context (for {DevelopmentName})

- Thoroughly review all inputs, focusing on the Shakti aspect of **{DevelopmentName}**.
- Ask clarifying questions to bridge any gaps between the UI/UX vision for **{DevelopmentName}** and the overall system architecture for **{DevelopmentName}**.

### 3. Define Overall Frontend Philosophy & Patterns (for `front-end-architecture.md` of {DevelopmentName})

- Based on the main architecture for **{DevelopmentName}** and global Epi-Logos tech stack/patterns:
  - Confirm and detail Framework & Core Libraries choices.
  - High-level Component Architecture strategy (aligning with Epi-Logos modularity).
  - High-level State Management Strategy (referencing global Epi-Logos Shakti guidelines).
  - Data Flow principles (interaction with Siva/Siva-Sakti aspects of **{DevelopmentName}**).
  - Styling Approach.
  - Key Design Patterns to be employed (referencing global Epi-Logos Shakti patterns).

### 4. Specify Detailed Frontend Directory Structure (for `front-end-architecture.md` of {DevelopmentName})

- Collaboratively define or refine the frontend-specific directory structure for **{DevelopmentName}** (e.g., within `epii_app/friendly-file-front/src/features/{DevelopmentNameFeatureComponent}/`), ensuring alignment with the chosen framework and Epi-Logos principles.

### 5. Outline Component Strategy & Conventions (for `front-end-architecture.md` of {DevelopmentName})

- Define Component Naming & Organization conventions for **{DevelopmentName}**.
- Establish the "Template for Component Specification" (as per `front-end-architecture-tmpl.md`), ensuring it captures all necessary details for components of **{DevelopmentName}**.

### 6. Detail State Management Setup & Conventions (for `front-end-architecture.md` of {DevelopmentName})

- Based on the high-level strategy, detail the chosen solution, store structure, and conventions for Selectors/Actions for **{DevelopmentName}**.

### 7. Plan API Interaction Layer (for `front-end-architecture.md` of {DevelopmentName})

- Define HTTP Client Setup for **{DevelopmentName}**.
- Establish patterns for Service Definitions (how API calls for **{DevelopmentName}** will be encapsulated).
- Outline frontend Error Handling & Retry strategies for API calls related to **{DevelopmentName}**.
- Consider Model Context Protocol (MCP) interfaces if defined in the main architecture for **{DevelopmentName}**.

### 8. Define Routing Strategy (for `front-end-architecture.md` of {DevelopmentName})

- Confirm Routing Library for **{DevelopmentName}**.
- Collaboratively define main Route Definitions and any Route Guards for **{DevelopmentName}**.

### 9. Specify Build, Bundling, and Deployment Details (for `front-end-architecture.md` of {DevelopmentName})

- Outline frontend-specific Build Process & Scripts for **{DevelopmentName}**.
- Document Key Bundling Optimizations for **{DevelopmentName}**.
- Confirm Deployment to CDN/Hosting details for **{DevelopmentName}** frontend.

### 10. Refine Frontend Testing Strategy (for `front-end-architecture.md` of {DevelopmentName})

- Elaborate on the main testing strategy for **{DevelopmentName}** with specifics for Component Testing, UI Integration/Flow Testing, and E2E UI Testing.

### 11. Outline Performance Considerations (for `front-end-architecture.md` of {DevelopmentName})

- List key frontend-specific performance strategies for **{DevelopmentName}**.

### 12. Document Drafting & Confirmation (Guided by `front-end-architecture-tmpl.md` for {DevelopmentName})

- **If "Incremental Mode":**
  - For each relevant section: Explain, Draft, Discuss, [Offer Advanced Self-Refinement](#offer-advanced-self-refinement--elicitation-options), Final Approval.
  - Once all sections approved, confirm overall document readiness for **{DevelopmentName}**.
- **If "YOLO Mode":**
  - Populate all relevant sections for **{DevelopmentName}**.
  - Present complete draft for holistic review.
  - Optionally offer condensed 'Advanced Reflective & Elicitation Options'.
  - Obtain explicit user approval for the entire document for **{DevelopmentName}**.

### 13. Identify & Summarize Epic/Story Impacts (Frontend Focus for {DevelopmentName})

- Review the `front-end-architecture.md` for **{DevelopmentName}** in context of its EFDD's epics/stories.
- Identify frontend-specific technical tasks for **{DevelopmentName}** (new stories or sub-tasks).
- Identify if existing stories for **{DevelopmentName}** require refinement of ACs due to frontend architectural decisions.
- Collaborate with the user (or Epi-Logos Process Steward) to define these.
- Prepare a concise summary. If no changes, state this.

### 14. Checklist Review and Finalization (for {DevelopmentName})

- Use the (Epi-Logos aligned) `frontend-architecture-checklist.md`.
- Go through each item to ensure the `front-end-architecture.md` for **{DevelopmentName}** is comprehensive.
- Discuss and address any identified deficiencies for **{DevelopmentName}**.
- Present a summary of the checklist review to the user.
- The goal is a complete and actionable `front-end-architecture.md` for **{DevelopmentName}`, stored at `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/architecture/front-end-architecture.md`.

## Offer Advanced Self-Refinement & Elicitation Options
(As defined in other task files, adapted for the context of creating the Frontend Architecture for **{DevelopmentName}**.)

"To ensure the quality of the current Frontend Architecture section for **{DevelopmentName}**: **[Specific Section Name]** ...
... (options from original task, framed for frontend architecture) ...
"
