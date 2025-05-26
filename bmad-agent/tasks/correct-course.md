# Correct Course Task (Epi-Logos Aligned)

## Purpose

- Guide a structured response to a change trigger for a specific **{DevelopmentName}** (within its **{PhilosophicalLayer} / {Subsystem}**) using the (Epi-Logos aligned) `change-checklist.md`.
- Analyze the impacts of the change on epics, project artifacts (within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/`), and the MVP for **{DevelopmentName}**.
- Explore potential solutions as prompted by the checklist.
- Draft specific, actionable proposed updates to any affected project artifacts for **{DevelopmentName}**.
- Produce a consolidated "Sprint Change Proposal" document for **{DevelopmentName}**.
- Ensure a clear handoff path if changes necessitate fundamental replanning by other Epi-Logos personas (like Epi-Logos Feature Definer or Epi-Logos Contextual Architect).

## Instructions

### 1. Initial Setup & Mode Selection (for {DevelopmentName})

- **Acknowledge Task & Inputs:**
  - Confirm that the "Correct Course Task" is being initiated for **{DevelopmentName}**.
  - Verify the change trigger and ensure you have the user's initial explanation of the issue for **{DevelopmentName}**.
  - Confirm access to relevant artifacts for **{DevelopmentName}** within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/` (e.g., EFDD, Epics/Stories, Architecture Package, UI/UX Specifications) and the (Epi-Logos aligned) `bmad-agent/checklists/change-checklist.md`.
- **Establish Interaction Mode:**
  - Ask the user their preferred interaction mode for this task regarding **{DevelopmentName}**: Incremental or YOLO.
  - Confirm the selected mode.
- **Explain Process:** Briefly inform the user: "We will now use the (Epi-Logos aligned) `change-checklist.md` to analyze the change for **{DevelopmentName}** and draft proposed updates."

### 2. Execute Checklist Analysis (Iteratively or Batched, for {DevelopmentName})

- Systematically work through Sections 1-4 of the (Epi-Logos aligned) `change-checklist.md`, focusing on the context of **{DevelopmentName}**.
- For each checklist item:
  - Present relevant prompts from the checklist to the user.
  - Request information and analyze relevant artifacts for **{DevelopmentName}**.
  - Discuss findings with the user.
  - Record status and notes for each checklist item for **{DevelopmentName}**.
  - Collaboratively agree on the "Recommended Path Forward" for **{DevelopmentName}**.

### 3. Draft Proposed Changes (Iteratively or Batched, for {DevelopmentName})

- Based on the completed checklist analysis for **{DevelopmentName}** and the agreed "Recommended Path Forward":
  - Identify specific project artifacts for **{DevelopmentName}** requiring updates (e.g., specific epics in `.../docs/epics/`, stories in `.../Stories/`, EFDD sections in `.../1_feature_definition/efdd.md`, architecture documents in `.../architecture/`).
  - **Draft the proposed changes directly and explicitly for each identified artifact of {DevelopmentName}.**
  - If in "Incremental Mode," discuss and refine these proposed edits with the user.
  - If in "YOLO Mode," compile all drafted edits for presentation.

### 4. Generate "Sprint Change Proposal" with Edits (for {DevelopmentName})

- Synthesize the complete `change-checklist.md` analysis and all agreed-upon proposed edits into a document titled "Sprint Change Proposal for {DevelopmentName}".
- The proposal must clearly present:
  - **Analysis Summary:** Overview of the issue for **{DevelopmentName}**, its impact, and rationale for the chosen path.
  - **Specific Proposed Edits:** For each affected artifact of **{DevelopmentName}**, show exact changes.
- Present the complete draft "Sprint Change Proposal for {DevelopmentName}" to the user for final review. Incorporate final adjustments.

### 5. Finalize & Determine Next Steps (for {DevelopmentName})

- Obtain explicit user approval for the "Sprint Change Proposal for {DevelopmentName}".
- Provide the finalized document to the user.
- **Based on the nature of the approved changes for {DevelopmentName}:**
  - **If edits sufficiently address the change:** State task is complete regarding analysis and proposal. Suggest handoff to an **Epi-Logos Process Steward** for backlog organization if appropriate.
  - **If fundamental replan needed for {DevelopmentName}:** Clearly state this. Advise user to engage the **Epi-Logos Feature Definer** (for EFDD changes) or **Epi-Logos Contextual Architect** (for major architectural rework), using the "Sprint Change Proposal for {DevelopmentName}" as input.

## Output Deliverables (for {DevelopmentName})

- **Primary:** A "Sprint Change Proposal for {DevelopmentName}" document (markdown).
- **Implicit:** An annotated (Epi-Logos aligned) `change-checklist.md` reflecting discussions for **{DevelopmentName}**.
