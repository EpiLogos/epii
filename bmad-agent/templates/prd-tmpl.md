# {Project Name} - {Development Name} Product Requirements Document (PRD)

**Context:** This PRD outlines the requirements for the **{Development Name}** initiative, a specific feature/component/subsystem enhancement within the broader **{Project Name} ({PhilosophicalLayer} - {Subsystem})** context. All artifacts related to this PRD are stored in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/`. The primary output of this PRD process will be an Epi-Logos Feature Definition Document (EFDD) located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/1_feature_definition/efdd.md`.

## Goal, Objective and Context (for {Development Name})

{This should come mostly from the user or the "Conceptual Alignment Brief" for **{Development Name}** (from `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/0_conceptual_alignment/conceptual_alignment_brief.md`), but ask for clarifications as needed. Ensure alignment with the overarching goals of the **{PhilosophicalLayer}** and **{Subsystem}** as defined in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/README.md` and `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/README.md` respectively.}

## Functional Requirements (MVP for {Development Name})

{You should have a good idea at this point for **{Development Name}**, but clarify, suggest questions, and explain to ensure these are correct and directly contribute to the **{Development Name}**'s objectives.}

## Non-Functional Requirements (MVP for {Development Name})

{For **{Development Name}**, these NFRs must align with and draw from the core philosophical and ethical principles outlined in `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Core_Principles.md` and any relevant NFRs defined at the `{Subsystem}` level in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/NFRs.md` or system-wide NFRs in `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/NFRs.md`. Clarify, suggest questions, and explain to ensure these are correct for **{Development Name}**.

Examples for **{Development Name}** might include:
- **Philosophical Alignment:** Ensure {specific aspect of Development Name} resonates with {relevant Epi-Logos principle, e.g., 'Anuttara Awareness Integration'}.
- **Data Provenance & Transparency (if applicable):** All data processed by **{Development Name}** must have clear lineage, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Data_Governance_Policy.md`.
- **Resonance & Coherence:** The user experience of **{Development Name}** should promote a sense of {desired quality, e.g., 'intuitive flow', 'reflective engagement'}, drawing from design tenets in `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Design_Philosophy.md`.
- **Performance/Scalability/Security specific to {Development Name}:** Detail specific targets, referencing general guidelines in `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/{Subsystem}/Performance_Guidelines.md` etc.}

## User Interaction and Design Goals (for {Development Name})

{
If **{Development Name}** includes a User Interface (UI) (Shakti aspect), this section captures the Product Manager's high-level vision and goals for the User Experience (UX) for this specific development. This information will serve as a crucial starting point and brief for the Epi-Logos Design Architect working on **{Development Name}**. Detailed UI/UX specifications will be stored in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/design/ui-ux-spec.md` or sharded within its `docs/frontend_shards/` directory.

Consider and elicit information from the user regarding **{Development Name}**:
// ... existing code ...
}

## Technical Assumptions (for {Development Name})

{This is where we can list information mostly to be used by the Epi-Logos Contextual Architect to produce the technical details for **{Development Name}**. This could be anything we already know or found out from the user at a technical high level for this specific development. Inquire about this from the user to get a basic idea of languages, frameworks, knowledge of starter templates, libraries, external apis, potential library choices relevant to **{Development Name}**. Reference existing system-wide technical choices documented in `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md` and subsystem-specific choices in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Architecture.md`.

- **Repository & Service Architecture (Impact for {Development Name}):** {CRITICAL DECISION: Document how **{Development Name}** fits into the chosen repository structure (e.g., Monorepo, Polyrepo) and the high-level service architecture (e.g., Monolith, Microservices, Serverless functions). Explain the rationale based on **{Development Name}**'s goals, MVP scope, team structure, and scalability needs. This decision directly impacts the technical approach for **{Development Name}** and informs the Epi-Logos Contextual Architect. Reference overall architecture in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md`.}

### Testing requirements (for {Development Name})

{How will we validate functionality for **{Development Name}** beyond unit testing? Will we want manual scripts or testing, e2e, integration etc... figure this out from the user to populate this section. Testing plans and artifacts for **{Development Name}** will be stored in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/tests/` or sharded within its `docs/architecture_shards/testing-strategy.md`.}

## Epic Overview (for {Development Name})

{All Epics and Stories defined here are specific to the **{Development Name}** initiative. They will be individually stored and tracked, potentially as sharded documents in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/epics/` and stories within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/Stories/`.}

// ... existing code ...

## Key Reference Documents (for {Development Name})

{ This section will list key documents relevant to **{Development Name}**. Many will be generated from this PRD's sections being sharded, or point to existing foundational documents within the `BMAD EPI-LOGOS MEMORY`.
Examples:
- **{Development Name} Conceptual Alignment Brief:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/0_conceptual_alignment/conceptual_alignment_brief.md`
- **{Development Name} Architecture:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md`
- **{Development Name} Sharded Documents Index:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/index.md`
- **Core Epi-Logos Principles:** `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Core_Principles.md`
- **{Subsystem} Overview:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/README.md`
- **Relevant Codebase READMEs:** (e.g., `epii_app/friendly-file-backend/subsystems/{Subsystem}/README.md`)}

## Out of Scope Ideas Post MVP (for {Development Name})

{Anything you and the user agreed is out of scope for the current **{Development Name}** MVP or can be removed from its scope to keep it lean. Consider the goals of this specific PRD.}

## [OPTIONAL: For Simplified PM-to-Development Workflow Only] Core Technical Decisions & Application Structure (for {Development Name})

{This section is to be populated ONLY if the Epi-Logos Feature Definer (PM) is operating in the 'Simplified PM-to-Development Workflow' for **{Development Name}**. It captures essential technical foundations for **{Development Name}** that would typically be defined by an Epi-Logos Contextual Architect. This information should be gathered after initial PRD sections for **{Development Name}** are drafted.}

### Technology Stack Selections (for {Development Name})

{Collaboratively define the core technologies for **{Development Name}**. Be specific about choices and versions where appropriate, considering existing system stack defined in `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md` and `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Architecture.md`.}

// ... existing code ...

### Proposed Application Structure (for {Development Name})

{Describe the high-level organization of the codebase for **{Development Name}**. This might include a simple text-based directory layout, a list of main modules/components for this development, and a brief explanation of how they interact. The goal is to provide a clear starting point for developers working on **{Development Name}**. Refer to the main architecture document for **{Development Name}** at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md`.}

// ... existing code ...

## Change Log (for {Development Name} PRD)

| Change | Date | Version | Description | Author |
| ------ | ---- | ------- | ----------- | ------ |

----- END PRD START CHECKLIST OUTPUT ------

// ... rest of the file with prompts would also need to be contextualized if used, e.g., passing {Development Name} to the Architect prompt ...

## Initial Architect Prompt (for {Development Name})

Based on our discussions and requirements analysis for the **{Development Name}** (part of {Project Name}, {PhilosophicalLayer}/{Subsystem}), I've compiled the following technical guidance to inform your architecture analysis and decisions to kick off Architecture Creation Mode for this specific development. This will contribute to the "Feature Context & Bimba-Alignment Package" for **{DevelopmentName}**.

// ... existing code ...
