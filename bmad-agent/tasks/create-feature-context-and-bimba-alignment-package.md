# Create Feature Context & Bimba-Alignment Package Task

## Purpose

- To design a "Feature Context & Bimba-Alignment Package" for a given `{DevelopmentName}`, based on the "Epi-Logos Feature Definition Document (EFDD)", research, and user input. This package details how the feature integrates with the existing Epi-Logos/Bimba architecture.
- To make definitive technology choices for `{DevelopmentName}` (if not already fully determined by global Epi-Logos tech stack) and articulate the rationale, using `architecture-tmpl.md` as a structural guide for the output document.
- To produce all necessary technical artifacts for `{DevelopmentName}`, ensuring the architecture is optimized for generating clear prompts for an external AI builder and validated against the (Epi-Logos aligned) `architect-checklist.md`.
- Ensure all outputs are stored correctly within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/`.

## Instructions

1.  **Input Analysis & Dialogue Establishment (for {DevelopmentName}):**

    - Ensure you (Epi-Logos Contextual Architect) have all necessary inputs: EFDD for `{DevelopmentName}` (from `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/1_feature_definition/efdd.md`), `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/` documents, `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/` documents (especially for the relevant `{Subsystem}` and global architectural/technology principles). Request any missing critical documents.
    - Thoroughly review all inputs, focusing on how `{DevelopmentName}` fits into its `{Subsystem}` and the broader Epi-Logos framework.
    - Summarize key technical requirements, constraints, NFRs for `{DevelopmentName}`, and the decided repository/service architecture. Present this summary to the user for confirmation.
    - Share initial architectural observations for `{DevelopmentName}`, potential challenges, or areas needing clarification (e.g., specific Bimba coordinates to map to, integration points with other `{Subsystem}` components).
      **Establish Interaction Mode for Architecture Creation for {DevelopmentName}:**
      - Ask the user: "How would you like to proceed with creating the architecture package for **{DevelopmentName}**? We can work:
        A. **Incrementally (Default & Recommended):** We'll go through each architectural decision, document section, or design point step-by-step.
        B. **"YOLO" Mode:** I can produce a more comprehensive initial draft for **{DevelopmentName}**."
      - Request the user to select their preferred mode. Confirm the selected mode.

2.  **Resolve Ambiguities & Gather Missing Information (for {DevelopmentName}):**

    - If key information for `{DevelopmentName}` is missing (e.g., unclear Bimba mapping, specific `{Subsystem}` interface details), formulate specific, targeted questions.
    - **External API Details (if relevant to {DevelopmentName}):** If `{DevelopmentName}` involves new integrations not covered by existing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/APIs/` documentation, ask the user for precise details.
    - Document all decisions and clarifications in the `{DevelopmentName}` decision log (`BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/decisions.md`).

3.  **Iterative Technology Selection & Design (for {DevelopmentName}, Interactive if not YOLO mode):**

    - For each major architectural component or decision point for `{DevelopmentName}`:
      - Consult `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md` and any `{Subsystem}`-specific tech preferences.
      - If options exist, present choices with pros/cons for `{DevelopmentName}`, state your recommendation aligned with Epi-Logos principles (e.g., Sacred Technology Ethos).
      - Seek user feedback and explicit approval. Document in `{DevelopmentName}` decision log and the main architecture document for `{DevelopmentName}`.
    - **Starter Templates:** If applicable for `{DevelopmentName}`, consult `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Starter_Templates/`.

4.  **Create Technical Artifacts (for {DevelopmentName}, guided by `architecture-tmpl.md`):**

    - The primary output is the "Feature Context & Bimba-Alignment Package" for `{DevelopmentName}`, typically `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md` (or `architecture.md`).
    - For each artifact or section:
      - **Explain Purpose** in the context of `{DevelopmentName}` and its `{Subsystem}`.
      - **Draft Section-by-Section:**
        - Ensure 'High-Level Overview' and 'Component View' detail how `{DevelopmentName}` integrates with the existing `{Subsystem}` architecture and Bimba coordinates.
        - Reference global Epi-Logos coding standards (`BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Coding_Standards.md`) and testing strategies (`.../Testing_Strategy.md`), noting any `{DevelopmentName}`-specific additions.
        - **Incorporate Feedback** and iterate.
        - [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options) (adapted for Epi-Logos context).
        - **Seek Approval** for the section/artifact for `{DevelopmentName}`.

5.  **Identify Missing Technical Stories / Refine Epics (for {DevelopmentName}, Interactive):**

    - Based on the designed architecture for `{DevelopmentName}`, identify any necessary technical stories/tasks not yet in the EFDD (e.g., "Map {DevelopmentName} to Bimba Coordinate X in {Subsystem}", "Define interface for {DevelopmentName} to interact with {Subsystem}_Service_Y").
    - Collaborate with the user (or Epi-Logos Process Steward) to refine these stories for `{DevelopmentName}` and suggest adding them to the backlog.
    - Review existing epics/stories for `{DevelopmentName}` from the EFDD and suggest technical considerations for prompt engineering.
    - Prepare a summary of proposed changes for `{DevelopmentName}` stories/epics.

6.  **Validate Architecture Against Checklist & Finalize Output (for {DevelopmentName}):**
    - Perform a comprehensive review using the (Epi-Logos aligned) `architect-checklist.md`.
    - Address any deficiencies identified for `{DevelopmentName}`.
    - Present a summary of the checklist review to the user.
    - **Offer Epi-Logos Design Architect Prompt (If Shakti aspect exists for {DevelopmentName}):**
      - If `{DevelopmentName}` includes UI components, ask the user if they'd like a prompt for the **Epi-Logos Design Architect**.
      - The prompt should guide the Design Architect to define the detailed frontend architecture for `{DevelopmentName}` using its specialized mode.
      - Append this prompt to the main architecture document for `{DevelopmentName}`.
    - Obtain final user approval for the complete "Feature Context & Bimba-Alignment Package" for `{DevelopmentName}`.
    - **Recommend Next Steps for UI (If Shakti aspect for {DevelopmentName}):**
      - If UI is involved, recommend engaging the **Epi-Logos Design Architect** in **'Frontend Architecture Mode'**, using this package and the EFDD's UI/UX sections as input.
      - If no UI, recommend proceeding to the **Epi-Logos Process Steward** for prompt package creation based on this architectural context.

### Output Deliverables for {DevelopmentName} Architecture Creation Phase

- A comprehensive "Feature Context & Bimba-Alignment Package" (main document: `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md` or `architecture.md`), structured according to `architecture-tmpl.md`.
- Supporting documents within `.../{DevelopmentName}/architecture/` (e.g., `data-models.md`, `api-specs.md`, `diagrams/`, `components/`, `decisions.md`, `mcp-interfaces.md`).
- A list of new or refined technical user stories/tasks for `{DevelopmentName}`.
- A completed (Epi-Logos aligned) `architect-checklist.md` (or a summary).
- Optionally, a prompt for the Epi-Logos Design Architect.

## Offer Advanced Self-Refinement & Elicitation Options
(As defined in the original `create-architecture.md` task, adapted for Epi-Logos context and the specific `{DevelopmentName}` architecture.)

"To ensure the quality of the current architectural section for **{DevelopmentName}**: **[Specific Section Name]** ...
... (options from original task, ensuring they are framed in the context of refining the architectural package for {DevelopmentName}) ...
"
