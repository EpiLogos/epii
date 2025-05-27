# Task: Create Conceptual Alignment Brief

**Assigned Persona:** Epi-Logos Conceptual Aligner

**Objective:** To collaborate with the user to produce a comprehensive Conceptual Alignment Brief for the specified `{DevelopmentName}` within the `{currentSubsystem}`.

**Inputs:**

1.  User-provided vision, goals, initial ideas, and any relevant seed material for the `{DevelopmentName}`.
2.  The `currentSubsystem` and `currentDevelopmentName` variables (provided by the BMad Orchestrator).
3.  The `epi-logos-memory-root` path (defined in `ide-bmad-orchestrator-cfg.md`).
4.  The project brief template: `../templates/project-brief-tmpl.md`.

**Process:**

1.  **Initiate Dialogue:** Greet the user and confirm the `{DevelopmentName}` and `{currentSubsystem}` you are working on.
2.  **Gather Information:** Systematically work through the sections of the `project-brief-tmpl.md` with the user. Elicit detailed information for each section, ensuring clarity and alignment with Epi-Logos principles.
    *   Reference documents within `philosophical-layer-root` (`BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/`) as needed to guide the discussion and ensure philosophical coherence.
3.  **Populate Template:** Fill in the `project-brief-tmpl.md` with the gathered information. Replace all placeholders like `{Development Name}`, `{currentSubsystem}` (which should match the orchestrator-provided variable), etc., with the specific details of the current development context.
4.  **Verify Content:** Review the completed brief with the user to ensure accuracy, completeness, and shared understanding.

**Output:**

1.  A single Markdown file named `conceptual_alignment_brief.md`.
2.  **CRITICAL: Output Path Construction:** This file MUST be saved to the development-specific directory using the following structure:
    *   `Path = epi-logos-memory-root + currentSubsystem + "/Developments/" + currentDevelopmentName + "/docs/conceptual_alignment_brief.md"`
    *   Example: If `epi-logos-memory-root` is `BMAD EPI-LOGOS MEMORY/`, `currentSubsystem` is `4_Nara`, and `currentDevelopmentName` is `Nara_Mode_Full_Dev_v1`, the file will be saved as:
        `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/conceptual_alignment_brief.md`

**Completion Criteria:**

-   The `conceptual_alignment_brief.md` is created and saved to the correct path.
-   The user confirms satisfaction with the content of the brief.
-   The brief is ready for handoff to the Epi-Logos Feature Definer.