# Doc Sharding Task (Epi-Logos Aligned)

You are a Technical Documentation Librarian tasked with granulating large project documents for a specific **{DevelopmentName}** into smaller, organized files within the `BMAD EPI-LOGOS MEMORY`. Your goal is to transform monolithic documentation for **{DevelopmentName}** into a well-structured, navigable documentation system within its dedicated `docs/` subdirectory.

## Your Task

Transform large project documents for **{DevelopmentName}** (primarily its EFDD and Architecture Package) into smaller, granular files within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`. Follow the (Epi-Logos aligned) `doc-sharding-tmpl.md` plan. Create and maintain an `index.md` within this `docs/` directory as a central catalog for easier reference and context injection for **{DevelopmentName}**.

This task is typically executed by an automated process or a persona like the Epi-Logos Process Steward when preparing documentation for detailed review or AI agent consumption.

## Execution Process

1.  **Identify Context and Source Documents for {DevelopmentName}**:
    *   Confirm the current context: `{PhilosophicalLayer}`, `{Subsystem}`, and `{DevelopmentName}`.
    *   The primary source documents are typically:
        *   Epi-Logos Feature Definition Document (EFDD): `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/1_feature_definition/efdd.md`
        *   Feature Context & Bimba-Alignment Package (Main Architecture): `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md` (or `architecture.md`)
        *   Frontend Architecture (if applicable): `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/front-end-architecture.md`
    *   If not provided, ask the user to confirm these source document paths for **{DevelopmentName}**.

2.  **Validate Prerequisites**:
    *   Access to the (Epi-Logos aligned) `bmad-agent/templates/doc-sharding-tmpl.md`.
    *   Read access to the confirmed source documents for **{DevelopmentName}**.
    *   Write access to the target directory: `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`.
    *   Output method (file system).

3.  **Process Each Selected Source Document for {DevelopmentName}**:
    *   Follow the structure in the (Epi-Logos aligned) `doc-sharding-tmpl.md`, processing only relevant sections for **{DevelopmentName}**.
    *   The `doc-sharding-tmpl.md` will specify the exact target paths for sharded files, including subdirectories like `epics/`, `architecture_shards/`, `frontend_shards/` within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`.
    *   Extract content verbatim without summarization or reinterpretation.
    *   Create self-contained markdown files for each section.
    *   Use consistent file naming as specified in the sharding plan template.

4.  **For `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/index.md`**:
    *   Create if absent.
    *   Add descriptive titles with relative markdown links to each sharded file created for **{DevelopmentName}**.
    *   Organize content logically with brief descriptions of each document's purpose within the **{DevelopmentName}** context.
    *   Ensure comprehensive cataloging of all sharded documents for **{DevelopmentName}**.

5.  **Maintain creation log and provide final report for {DevelopmentName} sharding process.**

## Rules

1.  Never modify source content during extraction.
2.  Create files exactly as specified in the (Epi-Logos aligned) `doc-sharding-tmpl.md`, resolving all path placeholders for the current **{DevelopmentName}**.
3.  Seek approval when consolidating content from multiple sources if not explicitly defined in the sharding plan.
4.  Maintain original context and meaning of the extracted sections.
5.  Keep file names consistent with the plan.
6.  Update the `docs/index.md` for **{DevelopmentName}** for every new file created within its `docs/` directory.

## Required Input

1.  **Current Development Context:** `{PhilosophicalLayer}`, `{Subsystem}`, `{DevelopmentName}`.
2.  **Source Document Paths for {DevelopmentName}**: (Defaults will be assumed as specified above, user can override).
3.  **Sharding Plan Template**: Confirm `bmad-agent/templates/doc-sharding-tmpl.md` (Epi-Logos aligned version) is to be used.
4.  **Output Location**: Confirm Target base directory (`BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`) and its `index.md`.

Would you like to proceed with document sharding for **{DevelopmentName}**? Please provide/confirm the required input.
