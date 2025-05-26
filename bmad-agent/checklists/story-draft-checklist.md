# Story Draft Checklist for {Development Name}

The Epi-Logos Story Steward should use this checklist to validate that each story for **{Development Name}** (within **{PhilosophicalLayer} / {Subsystem}**) contains sufficient context for an external AI builder or the Epi-Logos Aligned Dev Agent to implement it successfully. Assume the agent/builder has reasonable capabilities but requires clear, context-rich prompts. The story file itself is located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/{epicNum}.{storyNum}.story.md`.

## 1. GOAL & CONTEXT CLARITY (for {Development Name} story)

- [ ] Story goal/purpose is clearly stated and aligns with **{Development Name}** objectives.
- [ ] Relationship to epic goals for **{Development Name}** is evident (Epic sharded docs: `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/epics/`).
- [ ] How the story fits into overall system flow for **{Development Name}** (and its **{Subsystem}**) is explained, referencing architectural documents (e.g., `.../architecture/index.md`, `.../docs/architecture_shards/sequence-diagrams.md`).
- [ ] Dependencies on previous stories within **{Development Name}** are identified (if applicable).
- [ ] Business context and value for **{Development Name}** are clear, reflecting Epi-Logos principles.
- [ ] Relevant Bimba coordinates or philosophical tenets from `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/` are referenced if they directly shape the story's intent.

## 2. TECHNICAL IMPLEMENTATION GUIDANCE (for {Development Name} story, for AI Builder)

- [ ] Key files to create/modify within the **{Development Name}** codebase (e.g., `epii_app/.../features/{DevelopmentNameFeatureComponent}/`) are identified (not necessarily exhaustive).
- [ ] Technologies specifically needed for this story in **{Development Name}** are mentioned (ref: `.../docs/architecture_shards/tech-stack.md`).
- [ ] Critical APIs or interfaces for **{Development Name}** are sufficiently described (ref: `.../docs/architecture_shards/api-reference.md`).
- [ ] Necessary data models or structures for **{Development Name}** are referenced (ref: `.../docs/architecture_shards/data-models.md`).
- [ ] Required environment variables for **{Development Name}** are listed (if applicable, ref: `.../docs/architecture_shards/environment-vars.md`).
- [ ] Any exceptions to standard coding patterns (from `.../docs/architecture_shards/operational-guidelines.md` or global `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Coding_Standards.md`) for **{Development Name}** are noted.
- [ ] Guidance considers Siva (backend), Shakti (frontend), and Siva-Sakti (integration) aspects if relevant to the story.

## 3. REFERENCE EFFECTIVENESS (within {Development Name} context)

- [ ] References to external documents (e.g., specific shards in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`) point to specific relevant sections.
- [ ] Critical information from previous stories for **{Development Name}** is summarized (not just referenced).
- [ ] Context is provided for why references (to `BMAD EPI-LOGOS MEMORY` artifacts or other documents) are relevant to this story for **{Development Name}**.
- [ ] References use consistent format (e.g., `BMAD EPI-LOGOS MEMORY/.../{filename}.md#section`).

## 4. SELF-CONTAINMENT ASSESSMENT (for AI Builder Prompt for {Development Name})

- [ ] Core information needed for the AI Builder to implement the story for **{Development Name}** is included (not overly reliant on external docs not explicitly linked).
- [ ] Implicit assumptions relevant to **{Development Name}** are made explicit.
- [ ] Domain-specific terms or Epi-Logos concepts relevant to **{Development Name}** are explained or linked to definitions in `BMAD EPI-LOGOS MEMORY`.
- [ ] Edge cases or error scenarios for **{Development Name}** are addressed or noted for consideration.

## 5. TESTING GUIDANCE (for {Development Name} story)

- [ ] Required testing approach for this story in **{Development Name}** is outlined (ref: `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Testing_Strategy.md` and `.../docs/architecture_shards/operational-guidelines.md`).
- [ ] Key test scenarios for this story in **{Development Name}** are identified.
- [ ] Success criteria for this story in **{Development Name}** are defined (should align with Acceptance Criteria).
- [ ] Special testing considerations for this story in **{Development Name}** are noted (if applicable).

## VALIDATION RESULT FOR {Development Name} STORY

| Category                             | Status            | Issues |
| ------------------------------------ | ----------------- | ------ |
| 1. Goal & Context Clarity            | PASS/FAIL/PARTIAL |        |
| 2. Technical Implementation Guidance | PASS/FAIL/PARTIAL |        |
| 3. Reference Effectiveness           | PASS/FAIL/PARTIAL |        |
| 4. Self-Containment Assessment       | PASS/FAIL/PARTIAL |        |
| 5. Testing Guidance                  | PASS/FAIL/PARTIAL |        |

**Final Assessment:**

- READY FOR AI BUILDER / DEV AGENT: The story for **{Development Name}** provides sufficient context for implementation.
- NEEDS REVISION: The story for **{Development Name}** requires updates (see issues).
- BLOCKED: External information required for **{Development Name}** (specify what information).
