# Story Definition of Done (DoD) Checklist for {Development Name}

## Instructions for Epi-Logos Aligned Dev Agent / External AI Builder:

Before marking a story for **{Development Name}** (within **{PhilosophicalLayer} / {Subsystem}**) as 'Review', please go through each item in this checklist. Report the status of each item (e.g., [x] Done, [ ] Not Done, [N/A] Not Applicable) and provide brief comments if necessary. The story file is located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/{epicNum}.{storyNum}.story.md`.

## Checklist Items:

1.  **Requirements Met (for {Development Name} story):**

    - [ ] All functional requirements specified in the story are implemented.
    - [ ] All acceptance criteria defined in the story are met, including any philosophical alignment aspects.

2.  **Coding Standards & Project Structure (for {Development Name}):**

    - [ ] All new/modified code strictly adheres to `Operational Guidelines` for **{Development Name}** (located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/operational-guidelines.md` or global `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Coding_Standards.md`).
    - [ ] All new/modified code aligns with `Project Structure` for **{Development Name}** (file locations, naming, etc., from `.../docs/architecture_shards/project-structure.md`).
    - [ ] Adherence to `Tech Stack` for **{Development Name}** for technologies/versions used (ref: `.../docs/architecture_shards/tech-stack.md`).
    - [ ] Adherence to `Api Reference` and `Data Models` for **{Development Name}** (if story involves API or data model changes, ref: `.../docs/architecture_shards/api-reference.md`, `.../data-models.md`).
    - [ ] Basic security best practices (e.g., input validation, proper error handling, no hardcoded secrets) applied for new/modified code, aligning with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Security_Guidelines.md`.
    - [ ] No new linter errors or warnings introduced.
    - [ ] Code is well-commented where necessary (clarifying complex logic, not obvious statements), resonating with Epi-Logos clarity.

3.  **Testing (for {Development Name}):**

    - [ ] All required unit tests as per the story and `Operational Guidelines` Testing Strategy for **{Development Name}** are implemented.
    - [ ] All required integration tests (if applicable) as per the story and `Operational Guidelines` Testing Strategy for **{Development Name}** are implemented.
    - [ ] All tests (unit, integration, E2E if applicable) pass successfully for **{Development Name}**.
    - [ ] Test coverage meets project standards for **{Development Name}** (if defined). (Ref: `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Testing_Strategy.md`).

4.  **Functionality & Verification (for {Development Name}):**

    - [ ] Functionality for **{Development Name}** has been manually verified by the developer/builder (e.g., running the app locally, checking UI, testing API endpoints).
    - [ ] Edge cases and potential error conditions for **{Development Name}** considered and handled gracefully.

5.  **Story Administration (for {Development Name} story file):**
    - [ ] All tasks within the story file are marked as complete.
    - [ ] Any clarifications or decisions made during development of the **{Development Name}** story are documented in the story file or linked appropriately.
    - [ ] The story wrap up section has been completed with notes of changes or information relevant to the next story or overall project for **{Development Name}**, the agent model used, and the changelog.
6.  **Dependencies, Build & Configuration (for {Development Name}):**

    - [ ] Project for **{Development Name}** builds successfully without errors.
    - [ ] Project linting for **{Development Name}** passes.
    - [ ] Any new dependencies added for **{Development Name}** were either pre-approved in the story requirements OR explicitly approved by the user during development (approval documented in story file).
    - [ ] If new dependencies were added for **{Development Name}**, they are recorded in the appropriate project files with justification.
    - [ ] No known security vulnerabilities introduced by newly added and approved dependencies for **{Development Name}**.
    - [ ] If new environment variables or configurations were introduced by the story for **{Development Name}**, they are documented (e.g., in `.../docs/architecture_shards/environment-vars.md`) and handled securely.

7.  **Documentation (If Applicable for {Development Name}):**
    - [ ] Relevant inline code documentation (e.g., JSDoc, TSDoc, Python docstrings) for new public APIs or complex logic in **{Development Name}** is complete.
    - [ ] User-facing documentation for **{Development Name}** updated, if changes impact users.
    - [ ] Technical documentation (e.g., READMEs for **{DevelopmentName}**, system diagrams in `.../architecture/diagrams/`) updated if significant architectural changes were made by this story.
    - [ ] Contributions to `BMAD EPI-LOGOS MEMORY` (e.g., new patterns discovered, `Progress.md` updates for **{DevelopmentName}**) are noted or made if applicable.

## Final Confirmation (for {Development Name} story):

- [ ] I, the Epi-Logos Aligned Dev Agent / External AI Builder, confirm that all applicable items above have been addressed for this story within **{Development Name}**.
