# Create AI Builder Prompt Package Task

## Purpose

To generate a masterful, comprehensive, and optimized prompt package for a specific story/task within a `{DevelopmentName}`. This package will be used by an external AI builder or the Epi-Logos Aligned Dev Agent to generate code or other artifacts. The output prompt package will be stored in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/{StoryID}/prompt_package.md` (or a similar structured path, with supporting files like `technical_notes.md` in the same `{StoryID}` directory).

This task is typically executed by the **Epi-Logos Prompt Weaver** or **Epi-Logos Process Steward**.

## Inputs

- **Epi-Logos Feature Definition Document (EFDD):** Located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/1_feature_definition/efdd.md`.
- **Feature Context & Bimba-Alignment Package:** Main document at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md` (or `architecture.md`). This includes:
    - Detailed technical architecture for `{DevelopmentName}`.
    - API specifications (`api-specs.md`), Data models (`data-models.md`).
    - UI/UX Specifications (`design/ui-ux-spec.md`) and Frontend Architecture (`architecture/front-end-architecture.md`) if the story involves UI (Shakti aspect).
- **Specific Story File:** The story that requires a prompt package, from `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/{StoryID}/story-{StoryID}.md`. This story file should already contain acceptance criteria and initial technical guidance.
- **Relevant Philosophical Context:** From `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/` (e.g., `Core_Principles.md`, `Design_Philosophy.md`).
- **Relevant Technological Context:** From `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/` (e.g., `TechStack.md`, `Coding_Standards.md`, specific `{Subsystem}` patterns).

## Key Activities & Instructions

1.  **Confirm Target AI Generation Platform & Task Type:**

    - Ask the user to specify which AI builder tool/platform they intend to use (if known, as this might influence prompt structure).
    - Clarify the nature of the task for the AI builder: frontend component generation, backend API endpoint, full-stack microservice, documentation update, etc. This will determine which input documents are most critical.

2.  **Synthesize Inputs into a Structured Prompt Package for Story `{StoryID}`:**

    - **Overall `{DevelopmentName}` Context:**
      - Briefly state the purpose of `{DevelopmentName}` (from EFDD).
      - Specify the chosen technology stack for `{DevelopmentName}` (from its architecture package, referencing global Epi-Logos tech stack).
      - Mention key philosophical principles or `{Subsystem}` characteristics that should guide this specific task.
    - **Specific Story `{StoryID}` Context:**
      - State the user story: "As a {role}, I want {action}, so that {benefit}."
      - List clear, testable Acceptance Criteria.
    - **Technical Specifications (drawing from `{DevelopmentName}` architecture and `{StoryID}` technical notes):**
      - **For Frontend (Shakti) Tasks:**
        - Reference specific UI/UX designs for `{StoryID}` (e.g., Figma links from UI/UX Spec).
        - Describe visual style, color palette, typography if not covered by a global design system referenced in the architecture for `{DevelopmentName}`.
        - Specify component structure, props, state, and interactions as per `front-end-architecture.md` for `{DevelopmentName}`.
        - Detail API calls to Siva/Siva-Sakti aspects.
      - **For Backend (Siva) Tasks:**
        - Specify API endpoint details (path, method, request/response schemas) from `api-specs.md` for `{DevelopmentName}`.
        - Detail data models involved from `data-models.md` for `{DevelopmentName}`.
        - Describe business logic and algorithms.
        - Mention database interactions and any schema changes for `{DevelopmentName}`.
      - **For Integration (Siva-Sakti) Tasks:**
        - Detail data transformations, communication protocols (e.g., Model Context Protocol interfaces from `mcp-interfaces.md` for `{DevelopmentName}`), and orchestration logic.
    - **Code Implementation Guidance:**
      - Reference `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Coding_Standards.md` and any `{DevelopmentName}`-specific elaborations.
      - Point to relevant patterns from `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Architectural_Patterns/` or `{Subsystem}`-specific patterns.
      - Specify file/folder structure for the output of Story `{StoryID}` within the `{DevelopmentName}` codebase.
    - **Testing Requirements:**
      - Outline expectations for unit tests, integration tests, etc., for Story `{StoryID}` based on `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Testing_Strategy.md`.
    - **Critical "Don'ts" or Constraints for Story `{StoryID}`:**
      - e.g., "Do not use libraries not listed in the approved Tech Stack for `{DevelopmentName}`." "Ensure error handling aligns with `Error_Handling_Guidelines.md`."
    - **Platform-Specific Optimizations (if known for the target AI Builder).**

3.  **Assemble the Prompt Package for Story `{StoryID}`:**

    - The "prompt package" might consist of:
        a.  A main prompt file (`prompt_package.md` or `README.md` within the `Stories/{StoryID}/` directory) that synthesizes all the above information into a coherent set of instructions.
        b.  Supporting technical notes (`technical_notes.md`).
        c.  Relevant snippets or links to specific sections of architectural documents, EFDD, or philosophical texts.
        d.  Example code snippets if helpful.
    - The main prompt should be structured logically for the AI builder.
    - Output the generated prompt package into `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/{StoryID}/`.

4.  **Present and Refine the Prompt Package:**

    - Present the complete prompt package for Story `{StoryID}` to the user (or the Epi-Logos Process Steward for validation).
    - Explain the structure and why certain information was included.
    - Work with the user/reviewer to refine the prompt package.
    - <important_note>Remind the user that the output from the AI builder will likely require review, testing, and further refinement by the Epi-Logos Aligned Dev Agent or human developers.</important_note>

5.  **Final Handoff:**
    - Once approved, the prompt package for Story `{StoryID}` is ready for the external AI builder or the Epi-Logos Aligned Dev Agent. The story status in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/{StoryID}/story-{StoryID}.md` should be updated accordingly.
