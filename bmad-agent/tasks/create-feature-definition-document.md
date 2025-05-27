# Create Epi-Logos Feature Definition Document (EFDD) Task

## Purpose

- Transform the "Conceptual Alignment Brief" for a `{DevelopmentName}` into a comprehensive "Epi-Logos Feature Definition Document (EFDD)" conforming to the `prd-tmpl.md` (which should be understood as an EFDD template).
- Define clear MVP scope for `{DevelopmentName}` focused on essential functionality and philosophical alignment with its target `{Subsystem}` and the broader Epi-Logos.
- Provide foundation for the Epi-Logos Contextual Architect and eventually for generating prompt packages for an external AI builder.
- Ensure all outputs are stored correctly. The primary EFDD MUST be saved to `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/features/efdd.md`. Supporting documents like checklists follow a similar path in a relevant subfolder (e.g., `/docs/features/checklists/`).

Remember as you (Epi-Logos Feature Definer) follow the upcoming instructions:

- Your EFDD forms the foundation for the `{DevelopmentName}` development process.
- Output will be directly used by the Epi-Logos Contextual Architect to create a "Feature Context & Bimba-Alignment Package".
- Your epics/stories will ultimately be transformed into detailed prompt packages for an external AI builder by the Epi-Logos Process Steward.
- While you focus on the "what" and "why" from an Epi-Logos perspective, be precise enough to support a logical sequential order of operations.

## Instructions

### 1. Define Project Workflow Context (Epi-Logos Aligned)

- The workflow is Outcome Focused by default, aligning with Epi-Logos principles. You will define outcome-focused User Stories (phrased from a seeker/participant perspective), leaving detailed technical "how" for the Epi-Logos Contextual Architect and Epi-Logos Process Steward.
- Capture nuances for subsequent personas as "Notes for Epi-Logos Contextual Architect" or "Notes for Epi-Logos Process Steward" within the EFDD.

### 2. Determine Interaction Mode (for EFDD Structure & Detail)

- Confirm with the user their preferred interaction style for creating the EFDD for `{DevelopmentName}` if unknown - INCREMENTAL or YOLO?:
  - **Incrementally (Default):** Address EFDD sections sequentially, seeking feedback on each. For Epics/Stories: first present the ordered Epic list for approval, then detail stories for each Epic one by one.
  - **"YOLO" Mode:** Draft a more comprehensive EFDD for `{DevelopmentName}` (or significant portions) for a single, larger review.

### 3. Review Inputs Provided for {DevelopmentName}

- Review the "Conceptual Alignment Brief" for `{DevelopmentName}` (from `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/conceptual_alignment_brief.md`).
- Consult relevant sections of `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/` and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/` (especially for the target `{Subsystem}`).
- Incorporate any user input and ideas specific to `{DevelopmentName}`.

### 4. Process EFDD Sections (using `prd-tmpl.md` as the structural template)

- Inform the user you will work through the EFDD sections (as outlined in `prd-tmpl.md`) in order for `{DevelopmentName}`.
- After presenting each section to the user, also [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options) (from original `create-prd.md` task, adapted for Epi-Logos context).

<important_note>
When working on the "Technical Assumptions" section of the EFDD for `{DevelopmentName}`:
- Explicitly guide the user through discussing and deciding on the repository structure and high-level service architecture, ensuring alignment with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/System_Design_Principles.md`.
- Emphasize that this is a critical decision point that will be formally documented here with its rationale, impacting MVP scope for `{DevelopmentName}` and informing the Epi-Logos Contextual Architect.
- Ensure this decision is captured in the EFDD's `Technical Assumptions` and then reiterated in the `Initial Architect Prompt` section of the EFDD.
</important_note>

<important_note>
For the Epic and Story Section of the EFDD for `{DevelopmentName}` (if in Incremental mode):
- Prepare in memory the initial epic and story list for `{DevelopmentName}`.
- Use all information from the "Conceptual Alignment Brief" and memory exploration.
- Follow the [Guiding Principles for Epic and User Story Generation](#guiding-principles-for-epic-and-user-story-generation) (adapted for Epi-Logos context: user as seeker/participant, value aligned with Epi-Logos principles, stories as basis for AI builder prompts).
</important_note>

#### 4A. Epic Presentation and Drafting Strategy (for {DevelopmentName})

- First present the user with the epic titles and descriptions for `{DevelopmentName}` for approval.

#### 4B. Story Generation and Review within Epics (Incremental Mode for {DevelopmentName})

**Once the Epic List for `{DevelopmentName}` is approved, THEN for each Epic, you will proceed as follows:**

i. **Draft All Stories for the Current Epic:** Based on the Epic's goal for `{DevelopmentName}`.
ii. **Perform Internal Story Analysis & Propose Order:**
    a. **Re-evaluate for Cross-Cutting Concerns & Philosophical Alignment.**
    b. **Analyze for Logical Sequence & Dependencies within `{DevelopmentName}`.**
    c. **Formulate a Rationale for the Order.**
iii. **Present Proposed Story Set & Order for the Epic to the user.**
iv. **Collaborative Review of Sequence & Story Shells for `{DevelopmentName}`.**
v. Once agreed, review details (description, Acceptance Criteria reflecting Epi-Logos values) of each story.
vi. [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options).

#### 4C. Present Complete EFDD Draft for {DevelopmentName}

- Present the user with the complete full EFDD draft for `{DevelopmentName}`.

#### 4D. UI Component Handoff Note (Shakti Aspect for {DevelopmentName})

- If there is a UI component to `{DevelopmentName}`, inform the user that the Epi-Logos Design Architect should take this final EFDD output.

### 5\. Checklist Assessment (for EFDD of {DevelopmentName})

- Use the `pm-checklist.txt` (Epi-Logos aligned version) to validate the EFDD for `{DevelopmentName}`.
- Document completion status for each item.
- Present the user with a summary of each section of the checklist.
- Address deficiencies with user for input or suggested updates.
- Output the final checklist. This will be stored as a supporting document using the path: `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/features/checklists/pm_checklist_completed.md`.

### 6\. Produce the EFDD for {DevelopmentName}

- Produce the EFDD for `{DevelopmentName}` using `prd-tmpl.md` as a base structure, saving it to `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/features/efdd.md`.
- Ensure all placeholders like `{DevelopmentName}` (which should match `currentDevelopmentName`), and `{currentSubsystem}` are correctly filled.

<important_note>
**Next Steps for UI/UX Specification (If Shakti aspect exists for {DevelopmentName}):**

- If `{DevelopmentName}` includes a user interface:
  1.  **Include Design Architect Prompt in EFDD:** Add a dedicated section in the EFDD for `{DevelopmentName}` (as per `prd-tmpl.md` structure) for the **Epi-Logos Design Architect**.
      - Prompt should state operation in **'UI/UX Specification Mode'**.
      - Instruct to use this EFDD as input to define UI/UX specs for `{DevelopmentName}`, potentially creating/populating `front-end-spec-tmpl.md` (Epi-Logos aligned) at `epi-logos-memory-root` (from config) + `currentSubsystem` + `/Developments/` + `currentDevelopmentName` + `/docs/design/ui-ux-spec.md`.
  2.  **Recommend User Workflow:** After finalizing this EFDD, strongly recommend to the user:
      a. First, engage the **Epi-Logos Design Architect**.
      b. Second, _after_ UI/UX specification, engage the **Epi-Logos Contextual Architect** using the 'Initial Architect Prompt' in this EFDD.
- If no UI, recommend proceeding directly to the Epi-Logos Contextual Architect.
</important_note>

## Guiding Principles for Epic and User Story Generation (Epi-Logos Context for {DevelopmentName})

### I. Strategic Foundation: Define Core Value & MVP Scope (Epi-Logos Aligned)
- Understand & Clarify Core Needs: Based on "Conceptual Alignment Brief" for `{DevelopmentName}` and `BMAD EPI-LOGOS MEMORY`.
- Challenge Scope Relentlessly: Align with Epi-Logos core goals for `{DevelopmentName}`.

### II. Structuring the Work: Value-Driven Epics & Logical Sequencing (for {DevelopmentName})
- Organize into Deployable, Value-Driven Epics: Each Epic in `{DevelopmentName}` delivers tangible value aligned with `{Subsystem}` goals.
- Logical Epic Sequencing & Foundational Work for `{DevelopmentName}`.
- Ensure Logical Story Sequencing and Dependency Awareness within Epics of `{DevelopmentName}`.

### III. Crafting Effective User Stories: Vertical Slices Focused on Value & Clarity (for {DevelopmentName})
- Define Stories as "Vertical Slices" for `{DevelopmentName}`.
- Focus on "What" and "Why," Not "How": User stories from seeker/participant perspective.
- Ensure User Value (Epi-Logos Aligned), Not Just Technical Tasks for `{DevelopmentName}`.
- Appropriate Sizing & Strive for Independence for stories within `{DevelopmentName}`.

### IV. Detailing Stories: Comprehensive Acceptance Criteria & Developer/AI Builder Enablement (for {DevelopmentName})
- Clear, Comprehensive, and Testable Acceptance Criteria: Reflecting functional and philosophical aspects for `{DevelopmentName}`.
- Integrate Developer/AI Builder Enablement & Iterative Design into Stories for `{DevelopmentName}`.
- Local Testability (CLI) for relevant backend/data stories of `{DevelopmentName}`.
- Iterative Schema Definition for `{DevelopmentName}`.
- Upfront UI/UX Standards (Shakti aspect) for `{DevelopmentName}`.

### V. Managing Complexity: Addressing Cross-Cutting Concerns Effectively (for {DevelopmentName})
- Critically Evaluate for Cross-Cutting Concerns within `{DevelopmentName}`.
- Integrate requirements into ACs or document in EFDD / `BMAD EPI-LOGOS MEMORY`.

### VI. Ensuring Quality & Smooth Handoff (for {DevelopmentName})
- Maintain Clarity for Handoff (to Epi-Logos Contextual Architect, then Process Steward for AI Builder prompts) and Architectural Freedom.
- Confirm "Ready" State for stories of `{DevelopmentName}`.

## Offer Advanced Self-Refinement & Elicitation Options
(As defined in the original `create-prd.md` task, adapted for Epi-Logos context and the EFDD for `{DevelopmentName}`. This mechanism allows the user to prompt deeper exploration or alternative considerations for sections of the EFDD.)

"To ensure the quality of the current EFDD section for **{DevelopmentName}**: **[Specific Section Name]** and to ensure its robustness, explore alternatives, and consider all angles, I can perform any of the following actions. Please choose a number (8 to finalize and proceed):
... (options from original task) ...
"
