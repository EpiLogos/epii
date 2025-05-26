# Document Sharding Plan for {Development Name}

This plan directs the agent on how to break down large source documents into smaller, granular files during its Librarian Phase for the **{Development Name}** initiative, operating within the **{PhilosophicalLayer} / {Subsystem}** context. The agent will refer to this plan to identify source documents (primarily the PRD and Architecture document for **{DevelopmentName}**), the specific sections to extract, and the target filenames for the sharded content within the `BMAD EPI-LOGOS MEMORY`.

**Target Base Path for Sharded Documents:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`

---

## 1. Source Document: PRD for {Development Name}

- **Note to Agent:** The primary PRD for this development is located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/prd.md`. Confirm this is the source.

### 1.1. Epic Granulation (from {Development Name} PRD)

- **Instruction:** For each Epic identified within the **{Development Name}** PRD:
- **Source Section(s) to Copy:** The complete text for the Epic, including its main description, goals, and all associated user stories or detailed requirements under that Epic. Ensure to capture content starting from a heading like "**Epic X:**" up to the next such heading or end of the "Epic Overview" section within the **{Development Name}** PRD.
- **Target File Pattern:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/epics/epic-<id>.md`
  - _Agent Note: `<id>` should correspond to the Epic number or a sanitized version of the Epic title from the **{Development Name}** PRD._

---

## 2. Source Document: Architecture Document for {Development Name}

- **Note to Agent:** The primary Architecture document for this development is located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md` (or a similarly named main architecture file within that directory, like `architecture.md`). Confirm this is the source.

### 2.1. Core Architecture Granules (from {Development Name} Architecture)

- **Source Section(s) to Copy:** Section(s) detailing "API Reference", "API Endpoints", or "Service Interfaces" relevant to **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/api-reference.md`

- **Source Section(s) to Copy:** Section(s) detailing "Data Models", "Database Schema", "Entity Definitions" relevant to **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/data-models.md`

- **Source Section(s) to Copy:** Section(s) titled "Environment Variables Documentation", "Configuration Settings", "Deployment Parameters" specific to **{Development Name}**, or relevant subsections within "Infrastructure and Deployment Overview" if a dedicated section is not found in the **{Development Name}** architecture doc.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/environment-vars.md`

- **Source Section(s) to Copy:** Section(s) detailing "Project Structure" as it pertains to the implementation of **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/project-structure.md`

- **Source Section(s) to Copy:** Section(s) detailing "Technology Stack", "Key Technologies", "Libraries and Frameworks", or "Definitive Tech Stack Selections" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/tech-stack.md`

- **Source Section(s) to Copy:** Sections detailing "Coding Standards", "Development Guidelines", "Best Practices", "Testing Strategy", "Testing Decisions", "QA Processes", "Overall Testing Strategy", "Error Handling Strategy", and "Security Best Practices" specifically for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/operational-guidelines.md`
  - _Agent Note: Consolidate aspects relevant to **{Development Name}**. Ensure clear delineation._

- **Source Section(s) to Copy:** Section(s) titled "Component View" (including sub-sections like "Architectural / Design Patterns Adopted") for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/component-view.md`

- **Source Section(s) to Copy:** Section(s) titled "Core Workflow / Sequence Diagrams" (including all sub-diagrams) relevant to **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/sequence-diagrams.md`

- **Source Section(s) to Copy:** Section(s) titled "Infrastructure and Deployment Overview" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/infra-deployment.md`

- **Source Section(s) to Copy:** Section(s) titled "Key Reference Documents" from the **{Development Name}** architecture doc.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/key-references.md`

---

## 3. Source Document(s): Front-End Specific Documentation for {Development Name} (if applicable)

- **Note to Agent:** If **{Development Name}** has a significant front-end component (Shakti aspect), its specific architecture/specification documents will be located within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/` (e.g., `front-end-architecture.md`) or a `frontend/` subdirectory therein. Confirm filenames.

### 3.1. Front-End Granules (from {Development Name} FE Docs)

- **Source Section(s) to Copy:** Section(s) detailing "Front-End Project Structure" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/project-structure.md`

- **Source Section(s) to Copy:** Section(s) detailing "UI Style Guide", "Visual Design Specifications" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/style-guide.md`

- **Source Section(s) to Copy:** Section(s) detailing "Component Library", "Reusable UI Components Guide" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/component-guide.md`

- **Source Section(s) to Copy:** Section(s) detailing "Front-End Coding Standards" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/coding-standards.md`

- **Source Section(s) to Copy:** Section(s) titled "State Management In-Depth" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/state-management.md`

- **Source Section(s) to Copy:** Section(s) titled "API Interaction Layer" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/api-interaction.md`

- **Source Section(s) to Copy:** Section(s) titled "Routing Strategy" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/routing-strategy.md`

- **Source Section(s) to Copy:** Section(s) titled "Frontend Testing Strategy" for **{Development Name}**.
- **Target File:** `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/frontend_shards/testing-strategy.md`

---

CRITICAL: **Index Management for {Development Name}:** After creating the files, update the main index/readme for this development, typically `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/README.md` or `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/index.md`, to reference and describe each new sharded document. Focus on the document's purpose within the **{Development Name}** context.
