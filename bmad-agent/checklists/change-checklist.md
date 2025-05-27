# Change Navigation Checklist for {Development Name}

**Purpose:** To systematically guide the selected Agent and user through the analysis and planning required when a significant change (pivot, tech issue, missing requirement, failed story) is identified during the BMAD workflow for a specific **{Development Name}**, operating within the **{PhilosophicalLayer} / {Subsystem}** context.

**Instructions:** Review each item with the user. Mark `[x]` for completed/confirmed, `[N/A]` if not applicable, or add notes for discussion points.

---

## 1. Understand the Trigger & Context

- [ ] **Identify Triggering Story:** Clearly identify the story (or stories) that revealed the issue within the current **{Development Name}**. (Story location: `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/`)
- [ ] **Define the Issue:** Articulate the core problem precisely.
  - [ ] Is it a technical limitation/dead-end?
  - [ ] Is it a newly discovered requirement for **{Development Name}**?
  - [ ] Is it a fundamental misunderstanding of existing requirements for **{Development Name}**?
  - [ ] Is it a necessary pivot based on feedback or new information for **{Development Name}**?
  - [ ] Is it a failed/abandoned story needing a new approach for **{Development Name}**?
- [ ] **Assess Initial Impact:** Describe the immediate observed consequences for **{Development Name}** (e.g., blocked progress, incorrect functionality, non-viable tech).
- [ ] **Gather Evidence:** Note any specific logs, error messages, user feedback, or analysis that supports the issue definition for **{Development Name}**.

## 2. Epic Impact Assessment (within {Development Name})

- [ ] **Analyze Current Epic:**
  - [ ] Can the current epic containing the trigger story (within **{Development Name}**) still be completed?
  - [ ] Does the current epic need modification (story changes, additions, removals)?
  - [ ] Should the current epic be abandoned or fundamentally redefined for **{Development Name}**?
- [ ] **Analyze Future Epics (for {Development Name}):**
  - [ ] Review all remaining planned epics for **{Development Name}**.
  - [ ] Does the issue require changes to planned stories in future epics for **{Development Name}**?
  - [ ] Does the issue invalidate any future epics for **{Development Name}**?
  - [ ] Does the issue necessitate the creation of entirely new epics for **{Development Name}**?
  - [ ] Should the order/priority of future epics for **{Development Name}** be changed?
- [ ] **Summarize Epic Impact:** Briefly document the overall effect on the **{Development Name}**'s epic structure and flow.

## 3. Artifact Conflict & Impact Analysis (for {Development Name})

- [ ] **Review EFDD (Epi-Logos Feature Definition Document):**
  - [ ] Does the issue conflict with the core goals or requirements stated in the EFDD for **{Development Name}** (located at `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/1_feature_definition/efdd.md`)?
  - [ ] Does the EFDD need clarification or updates based on the new understanding?
- [ ] **Review Architecture Document:**
  - [ ] Does the issue conflict with the documented architecture for **{Development Name}** (located at `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md`)?
  - [ ] Are specific components/diagrams/sections impacted?
  - [ ] Does the technology list need updating, referencing `{epi-logos-memory-root}/Epi-Logos System (Technology)/TechStack.md`?
  - [ ] Do data models or schemas need revision, referencing `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/data-models.md` or `{epi-logos-memory-root}/Epi-Logos System (Technology)/DataModels.md`?
  - [ ] Are external API integrations affected?
- [ ] **Review Frontend Spec (if applicable for {Development Name}):**
  - [ ] Does the issue conflict with the FE architecture, component library choice, or UI/UX design for **{Development Name}** (located at `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/front-end-architecture.md` or `.../design/ui-ux-spec.md`)?
  - [ ] Are specific FE components or user flows impacted?
- [ ] **Review Other Artifacts (if applicable for {Development Name}):**
  - [ ] Consider impact on deployment scripts, IaC, monitoring setup, sharded documents in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`, etc., within the **{Development Name}** context.
- [ ] **Summarize Artifact Impact:** List all artifacts for **{Development Name}** requiring updates and the nature of the changes needed.

## 4. Path Forward Evaluation (for {Development Name})

- [ ] **Option 1: Direct Adjustment / Integration:**
  - [ ] Can the issue be addressed by modifying/adding future stories within the existing plan for **{Development Name}**?
  - [ ] Define the scope and nature of these adjustments.
  - [ ] Assess feasibility, effort, and risks of this path for **{Development Name}**.
- [ ] **Option 2: Potential Rollback:**
  - [ ] Would reverting completed stories for **{Development Name}** significantly simplify addressing the issue?
  - [ ] Identify specific stories/commits to consider for rollback.
  - [ ] Assess the effort required for rollback.
  - [ ] Assess the impact of rollback (lost work, data implications for **{Development Name}**).
  - [ ] Compare the net benefit/cost vs. Direct Adjustment for **{Development Name}**.
- [ ] **Option 3: EFDD MVP Review & Potential Re-scoping:**
  - [ ] Is the original EFDD MVP for **{Development Name}** still achievable given the issue and constraints?
  - [ ] Does the MVP scope for **{Development Name}** need reduction (removing features/epics)?
  - [ ] Do the core MVP goals for **{Development Name}** need modification?
  - [ ] Are alternative approaches needed to meet the original MVP intent for **{Development Name}**?
  - [ ] **Extreme Case:** Does the issue necessitate a fundamental replan or potentially a new EFDD V2 for **{Development Name}** (to be handled by the Epi-Logos Feature Definer)?
- [ ] **Select Recommended Path:** Based on the evaluation, agree on the most viable path forward for **{Development Name}**.

## 5. Sprint Change Proposal Components (for {Development Name})

_(Ensure all agreed-upon points from previous sections are captured in the proposal for **{Development Name}**)_

- [ ] **Identified Issue Summary:** Clear, concise problem statement for **{Development Name}**.
- [ ] **Epic Impact Summary:** How epics within **{Development Name}** are affected.
- [ ] **Artifact Adjustment Needs:** List of documents for **{Development Name}** to change.
- [ ] **Recommended Path Forward:** Chosen solution with rationale for **{Development Name}**.
- [ ] **EFDD MVP Impact:** Changes to scope/goals for **{Development Name}** (if any).
- [ ] **High-Level Action Plan:** Next steps for stories/updates for **{Development Name}**.
- [ ] **Agent Handoff Plan:** Identify Epi-Logos personas needed (Epi-Logos Feature Definer, Epi-Logos Contextual Architect, Epi-Logos Design Architect, Epi-Logos Process Steward, Epi-Logos Aligned Dev Agent).

## 6. Final Review & Handoff

- [ ] **Review Checklist:** Confirm all relevant items were discussed for **{Development Name}**.
- [ ] **Review Sprint Change Proposal:** Ensure it accurately reflects the discussion and decisions for **{Development Name}**.
- [ ] **User Approval:** Obtain explicit user approval for the proposal for **{Development Name}**.
- [ ] **Confirm Next Steps:** Reiterate the handoff plan and the next actions to be taken by specific Epi-Logos personas for **{Development Name}**.

---
