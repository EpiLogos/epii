# Create Next Story / AI Builder Prompt Package Task

## Purpose

To identify the next logical story for a given `{DevelopmentName}` (within its `{PhilosophicalLayer}` and `{Subsystem}`) based on project progress and epic definitions. Then, to prepare a comprehensive, self-contained, and actionable story file (which serves as an AI Builder Prompt Package) using the (Epi-Logos aligned) `story-tmpl.md`. This task ensures the story/prompt package is enriched with all necessary technical context, requirements, acceptance criteria, and philosophical alignment, making it ready for efficient implementation by an external AI builder or the Epi-Logos Aligned Dev Agent with minimal need for additional research.

This task is typically executed by the **Epi-Logos Story Steward**.

## Inputs for this Task (for {DevelopmentName})

- Access to the project's `BMAD EPI-LOGOS MEMORY` (path from `epi-logos-memory-root` in config), specifically:
  - `epi-logos-memory-root` + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/` which contains:
    - `1_feature_definition/efdd.md` (Epi-Logos Feature Definition Document for `{DevelopmentName}`)
    - `architecture/index.md` (Main Architecture for `{DevelopmentName}`)
    - `architecture/front-end-architecture.md` (Frontend Architecture for `{DevelopmentName}`, if relevant)
    - `docs/index.md` (Index to sharded documents for `{DevelopmentName}`)
    - `docs/epics/epic-{n}.md` (Sharded Epic files for `{DevelopmentName}`)
    - `docs/architecture_shards/` (Sharded architecture details like data models, API references, tech stack, operational guidelines for `{DevelopmentName}`)
    - `Stories/` (Directory of existing story/prompt package files for `{DevelopmentName}`)
- The (Epi-Logos aligned) `bmad-agent/templates/story-tmpl.md`.
- The (Epi-Logos aligned) `bmad-agent/checklists/story-draft-checklist.md`.
- User confirmation to proceed.

## Task Execution Instructions (for {DevelopmentName})

### 1. Identify Next Story for Preparation

- Review `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/stories/` to find the highest-numbered story file.
- **If a highest story file exists (`story-{lastEpicNum}.{lastStoryNum}.md`):**
  - Verify its `Status` is 'Done' (or equivalent).
  - If not 'Done', present an alert to the user regarding the incomplete story for `{DevelopmentName}` and ask to Override, View, or Cancel.
  - Proceed only if user Overrides or the last story was 'Done'.
  - If proceeding: Check the Epic File for `{lastEpicNum}` (e.g., `.../docs/epics/epic-{lastEpicNum}.md`) for a story numbered `{lastStoryNum + 1}`. If it exists and its prerequisites (per Epic File) are met, this is the next story for `{DevelopmentName}`.
  - Else: The next story is the first story in the next Epic File for `{DevelopmentName}` whose prerequisites are met.
- **If no story files exist for `{DevelopmentName}`:**
  - The next story is the first story in the first Epic File for `{DevelopmentName}` (e.g., `.../docs/epics/epic-1.md`) whose prerequisites are met.
- If no suitable story with met prerequisites is found for `{DevelopmentName}`, report to the user that story creation is blocked, specifying what prerequisites are pending. HALT task.
- Announce the identified story: "Identified next story for preparation for **{DevelopmentName}**: {epicNum}.{storyNum} - {Story Title}". Let this be `{StoryID}`.

### 2. Gather Core Story Requirements (from Epic File for {DevelopmentName})

- For the identified story `{StoryID}`, open its parent Epic File within `.../Developments/{DevelopmentName}/docs/epics/`.
- Extract: Exact Title, full Goal/User Story statement, initial list of Requirements, all Acceptance Criteria (ACs), and any predefined high-level Tasks.
- Keep a record of this original epic-defined scope for later deviation analysis.

### 3. Gather & Synthesize In-Depth Technical Context for AI Builder (for Story `{StoryID}` of {DevelopmentName})

- <critical_rule>Systematically use the sharded documents within `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/` as your primary guide to discover ALL detailed documentation relevant to Story `{StoryID}`'s implementation needs.</critical_rule>
- Thoroughly review the EFDD (`.../1_feature_definition/efdd.md`), Main Architecture (`.../architecture/index.md`), and Frontend Architecture (`.../architecture/front-end-architecture.md` if relevant for Story `{StoryID}`).
- Guided by the sharded documents index (`.../docs/index.md`) and the story's needs, locate, analyze, and synthesize specific, relevant information from sources such as:
  - Sharded Data Models (`.../docs/architecture_shards/data-models.md`).
  - Sharded API Reference (`.../docs/architecture_shards/api-reference.md`).
  - Applicable architectural patterns or component designs from `.../docs/architecture_shards/component-view.md` or `.../architecture/components/`.
  - UI/UX Specs, Style Guides, Component Guides (for UI stories, from `.../design/` or `.../docs/frontend_shards/`).
  - Specifics from Tech Stack for `{DevelopmentName}` (`.../docs/architecture_shards/tech-stack.md`).
  - Relevant sections of Operational Guidelines (`.../docs/architecture_shards/operational-guidelines.md`), including story-specific error handling, security, or philosophical alignment considerations for Story `{StoryID}`.
- The goal is to collect all necessary details the AI Builder or Epi-Logos Aligned Dev Agent would need. Note any discrepancies between the epic and these details for "Deviation Analysis."

### 4. Verify Project Structure Alignment (for Story `{StoryID}` of {DevelopmentName})

- Cross-reference Story `{StoryID}`'s requirements and anticipated file manipulations with the Project Structure defined in `.../docs/architecture_shards/project-structure.md` (and frontend structure if applicable).
- Ensure any file paths, component locations, or module names implied by Story `{StoryID}` align with defined structures for `{DevelopmentName}` (e.g., within `epii_app/.../features/{DevelopmentNameFeatureComponent}/`).
- Document any structural conflicts or necessary clarifications in a "Project Structure Notes" section within the story draft.

### 5. Populate Story Template (for Story `{StoryID}` of {DevelopmentName})

- Create a new story file: `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/stories/story-{StoryID}.md` (e.g., `story-1.1.md`).
- Use the (Epi-Logos aligned) `story-tmpl.md` to structure the file.
- Fill in:
  - Story `{EpicNum}.{StoryNum}: {Short Title Copied from Epic File}` (ensure `{StoryID}` matches `{EpicNum}.{StoryNum}`).
  - Context: Part of `{DevelopmentName}` (`{PhilosophicalLayer}` / `{Subsystem}`)
  - Location: (The full path as created above).
  - `Status: Draft`
  - `Story` (User Story statement from Epic, phrased from seeker/participant perspective).
  - `Acceptance Criteria (ACs)` (from Epic, refined for clarity, testability, and philosophical alignment for `{DevelopmentName}`).
- **`Dev Technical Guidance` section (CRITICAL for AI Builder Prompt):**
  - Based on all context gathered (Step 3 & 4), embed concise but critical snippets of information, specific data structures, API endpoint details, precise references to _specific sections_ in other documents (e.g., "See `.../docs/architecture_shards/data-models.md#UserSchema` for details"), or brief explanations of how architectural patterns or Epi-Logos principles apply to _this story_ for `{DevelopmentName}`.
  - If UI story, provide specific references to Component/Style Guides relevant to Story `{StoryID}`'s elements.
  - The aim is to make this section the AI Builder's primary source for _story-specific_ technical and philosophical context for `{DevelopmentName}`.
- **`Tasks / Subtasks` section:**
  - Generate a detailed, sequential list of technical tasks and subtasks the AI Builder/Dev Agent must perform to complete Story `{StoryID}`.
  - Link tasks to ACs where applicable.
- Add notes on project structure alignment or discrepancies found in Step 4.
- Prepare content for a "Deviation Analysis" section if the detailed context gathering revealed significant deviations from the original Epic scope for Story `{StoryID}`.

### 6. Validate Story Draft (Prompt Package)

- Use the (Epi-Logos aligned) `story-draft-checklist.md` to validate the story file for Story `{StoryID}`.
- Ensure all sections of the checklist are addressed, paying particular attention to clarity for the AI Builder, contextual richness from `BMAD EPI-LOGOS MEMORY` (via `epi-logos-memory-root`), and philosophical alignment for `{DevelopmentName}`.
- Present the completed checklist and the draft story file to the user (or Epi-Logos Process Steward) for approval.
- Incorporate any feedback to finalize the story/prompt package for Story `{StoryID}`.

### 7. Finalize Story

- Once approved, update the `Status: Approved` in the story file located at `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/stories/story-{StoryID}.md`.
- The story/prompt package is now ready for handoff to the Epi-Logos Aligned Dev Agent or an external AI builder.
