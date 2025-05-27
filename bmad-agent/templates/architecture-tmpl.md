# {Project Name} - {Development Name} Architecture Document

## Introduction / Preamble

{This document outlines the architecture for the **{Development Name}** development initiative, a specific feature/component/subsystem enhancement within the broader **{Project Name} ({PhilosophicalLayer} - {Subsystem})** context. It details the backend systems (Siva aspect), frontend considerations (Shakti aspect), integration points (Siva-Shakti aspect), shared services, and non-UI specific concerns relevant to this development slice. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development for **{DevelopmentName}**, ensuring consistency and adherence to chosen patterns and technologies, all while resonating with the Epi-Logos philosophical underpinnings.

All detailed artifacts, diagrams, and evolving specifications for this development are maintained within the `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/` directory.

**Relationship to Frontend Architecture (if applicable for this Development):**
If **{DevelopmentName}** includes a significant user interface (Shakti aspect), a separate Frontend Architecture Document (e.g., `front-end-architecture.md` located in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/`) details the frontend-specific design and MUST be used in conjunction with this document. Core technology stack choices documented herein (see "Definitive Tech Stack Selections") are definitive for **{DevelopmentName}**, including any frontend components.}

## Table of Contents

{ Update this if sections and subsections are added or removed }

## Technical Summary

{ Provide a brief paragraph overview of the **{Development Name}**'s architecture, its key components, technology choices, and architectural patterns used. Reference the goals from the PRD for **{DevelopmentName}** (located at `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/prd.md`). }

## High-Level Overview

{ Describe the main architectural style (e.g., Monolith, Microservices, Serverless, Event-Driven) as it applies to **{Development Name}**, reflecting the decision made in its PRD. Explain the repository structure relevant to this development (Monorepo/Polyrepo contributions). Explain the primary user interaction or data flow for **{DevelopmentName}** at a conceptual level. Diagrams and detailed specifications are located in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/diagrams/`. }

{ Insert high-level mermaid system context or interaction diagram here - e.g., Mermaid Class C4 Models Layer 1 and 2 }

## Architectural / Design Patterns Adopted for {Development Name}

{ List the key high-level patterns chosen for the architecture of **{Development Name}**. These foundational patterns should be established early as they guide component design, interactions, and technology choices for this specific development. Reference `{epi-logos-memory-root}/Epi-Logos System (Technology)/System_Design_Principles.md` for overarching principles.}

- **Pattern 1:** {e.g., Serverless, Event-Driven, Microservices, CQRS} - _Rationale/Reference:_ {Briefly why, or link to `{epi-logos-memory-root}/Epi-Logos System (Technology)/Architectural_Patterns/{PatternName}.md`}
- **Pattern 2:** {e.g., Dependency Injection, Repository Pattern, Module Pattern} - _Rationale/Reference:_ {...}
- **Pattern N:** {...}

## Component View for {Development Name}

{ Describe the major logical components or services of **{Development Name}** and their responsibilities, reflecting the decided overall architecture and the architectural patterns adopted for this development. Explain how they collaborate. Detail how components map to Siva, Shakti, or Siva-Sakti domains. Detailed component diagrams and specifications are in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/components/`. }

- Component A (Siva/Shakti/Siva-Sakti): {Description of responsibility}

{Insert component diagram here if it helps - e.g., using Mermaid graph TD or C4 Model Container/Component Diagram}

- Component N... (Siva/Shakti/Siva-Sakti): {Description of responsibility}

{ Insert component diagram here if it helps - e.g., using Mermaid graph TD or C4 Model Container/Component Diagram }

## Project Structure (Context: {Development Name})

{The following illustrates a general project structure. Specific contributions and artifacts for **{Development Name}** will primarily reside within the `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/` directory and relevant codebase locations (e.g., `epii_app/friendly-file-backend/subsystems/{Subsystem}/features/{DevelopmentNameFeatureComponent}/`).}

```plaintext
// {project-root}/ (Illustrative - actual code may be in epii_app or other designated areas)
// ... (standard project structure elements)

{epi-logos-memory-root}/
└── {PhilosophicalLayer}/
    └── {Subsystem}/ (e.g., 5-2_Siva, 5-3_Sakti, 5-4_Siva-Sakti)
        └── Developments/
            └── {DevelopmentName}/
                ├── architecture/
                │   ├── index.md (This document or a more specific main arch doc for the dev)
                │   ├── front-end-architecture.md (If applicable for Shakti aspect)
                │   ├── data-models.md
                │   ├── api-specs.md
                │   ├── diagrams/
                │   ├── components/
                │   └── mcp-interfaces.md (Model Context Protocol interfaces)
                ├── prd.md
                ├── plan.md
                ├── progress.md
                ├── docs/ (Sharded documents from PRD, Architecture, etc.)
                │   ├── epics/
                │   ├── architecture_shards/
                │   └── frontend_shards/
                ├── stories/
                └── tests/
// ... (other memory bank structures)
```

### Key Directory Descriptions (for {Development Name})

- `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/`: Contains all planning, design, and reference documentation specific to this development.
- `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/`: Core architectural artifacts for this development.
- `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`: Granular, sharded documents derived from PRD, architecture, etc., for detailed planning and AI agent consumption.
- `epii_app/friendly-file-backend/subsystems/{Subsystem}/features/{DevelopmentNameFeatureComponent}/` (Example): Location for backend (Siva) source code related to this development.
- `epii_app/friendly-file-front/src/features/{DevelopmentNameFeatureComponent}/` (Example): Location for frontend (Shakti) source code related to this development.
- `epii_app/friendly-file-back2front/services/{DevelopmentNameFeatureComponent}/` (Example): Location for integration (Siva-Sakti) code related to this development.

### Notes

{Mention any specific build output paths, compiler configuration pointers, or other relevant structural notes for **{Development Name}**.}

## API Reference (for {Development Name})

{Detail APIs consumed or provided specifically by or for **{Development Name}**. For comprehensive API documentation across the system, refer to `{epi-logos-memory-root}/Epi-Logos System (Technology)/APIs/` or relevant `{Subsystem}` API docs.}

### External APIs Consumed by {Development Name}
{...}
    - Request Body Schema: {Provide JSON schema inline, or link to `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/data-models.md#api-{APIName}-request` or `.../api-specs.md#...`}
{...}
    - Success Response Schema (Code: `200 OK`): {Provide JSON schema inline, or link to `.../data-models.md#api-{APIName}-response` or `.../api-specs.md#...`}
{...}

### Internal APIs Provided/Modified by {Development Name} (If Applicable)
{...}
    - Request Body Schema: {Provide JSON schema inline, or link to `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/data-models.md#internal-api-{APIName}-request` or `.../api-specs.md#...`}
{...}
    - Success Response Schema (Code: `200 OK`): {Provide JSON schema inline, or link to `.../data-models.md#internal-api-{APIName}-response` or `.../api-specs.md#...`}
{...}

### Model Context Protocol (MCP) Endpoints/Interfaces for {Development Name}

{This section details any APIs or interfaces specifically designed for the Model Context Protocol for **{DevelopmentName}**, facilitating communication and context exchange between different AI agents or system components. These are critical for the Epi-Logos system's agentic capabilities and may involve specialized data formats or interaction patterns. Detailed specifications should reside in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/mcp-interfaces.md`.}

#### {MCP Interface Name / Purpose} (e.g., Agent Contextualization Service for {DevelopmentName})
- **Purpose:** {Describe the role of this MCP interface in **{DevelopmentName}**, e.g., "Provides contextual information from `bmad-epilogos-memory` related to `{DevelopmentName}` to requesting agents."}
- **Protocol/Transport:** {e.g., HTTP/JSON, gRPC, Message Queue (specify which)}
- **Key Operations/Messages:**
  - **Operation/Message: `{OperationName}` (e.g., `GetContextForDevelopmentName`, `UpdateMemoryForDevelopmentName`)**
    - Description: {What does this operation/message achieve for **{DevelopmentName}**?}
    - Request Payload Schema: {Define the structure. Link to `.../data-models.md#MCPRequestModelNameForDevelopmentName` if complex.}
    - Response Payload Schema: {Define the structure. Link to `.../data-models.md#MCPResponseModelNameForDevelopmentName` if complex.}
    - Interaction Pattern: {e.g., Request/Response, Publish/Subscribe}
  // ... repeat for other MCP operations/messages ...

## Data Models (for {Development Name})

{Core data models for **{DevelopmentName}**. These models underpin the Siva (backend logic), influence Shakti (frontend display), and are exchanged via Siva-Sakti integrations and MCP. Detailed specifications should reside in `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/data-models.md`.}

### Core Application Entities / Domain Objects relevant to {Development Name}
{...}
  ```typescript
  // Example using TypeScript Interface - Full definitions in `.../architecture/data-models.md#{EntityName}ForDevelopmentName`
  export interface {EntityName} {
    id: string; // {Description, e.g., Unique identifier}
    philosophicalLayerContext?: string; // {e.g., Anuttara, Iccha - if relevant}
    subsystemContext?: string; // {e.g., 5-2_Siva - if relevant}
    developmentNameContext: string; // Must be {DevelopmentName}
    propertyName: string; // {Description}
    // ... other properties
  }
  ```
{...}

### API Payload Schemas (If distinct for {Development Name})
{Define schemas here only if they are distinct for **{Development Name}** AND not fully detailed under the API endpoint definitions. Prefer detailing request/response schemas directly with their APIs. Link to `.../architecture/data-models.md#{PayloadNameForDevelopmentName}` or `.../api-specs.md#{PayloadNameForDevelopmentName}`.}
{...}

### Database Schemas (Changes/Additions for {Development Name})
{If **{Development Name}** involves changes or additions to database schemas. Full schema definitions might reside in `{epi-logos-memory-root}/Epi-Logos System (Technology)/{Subsystem_Name e.g., Siva}/Database_Schemas/` or linked from `.../architecture/data-models.md`.}
{...}

## Data Storage and Persistence (for {Development Name})

{Describe how data relevant to **{Development Name}** is stored and persisted. Reference overall system data storage strategies from `{epi-logos-memory-root}/Epi-Logos System (Technology)/Data_Management_Strategy.md` and specify choices for this development.}
{...}

## Definitive Tech Stack Selections (for {Development Name})
{ This section outlines the definitive technology choices for **{Development Name}**. These selections should align with `{epi-logos-memory-root}/Epi-Logos System (Technology)/TechStack.md` and specify any variations or additions for this development. The Architect Agent should guide the user through these decisions.}
{...}

## Infrastructure and Deployment Overview (for {Development Name})
{Outline how **{Development Name}** will be deployed. This might involve updates to existing CI/CD pipelines or new deployment considerations. Reference `{epi-logos-memory-root}/Epi-Logos System (Technology)/Deployment_Strategy.md` for system-wide approaches.}
{...}

## Error Handling Strategy (for {Development Name})
{Detail error handling for **{DevelopmentName}**, aligning with `{epi-logos-memory-root}/Epi-Logos System (Technology)/Error_Handling_Guidelines.md`.}
{...}

## Coding Standards (for {Development Name})
{Adhere to standards in `{epi-logos-memory-root}/Epi-Logos System (Technology)/Coding_Standards.md`, noting any specific considerations for **{DevelopmentName}**.}
{...}

## Overall Testing Strategy (for {Development Name})
{Detail testing for **{DevelopmentName}**, aligning with `{epi-logos-memory-root}/Epi-Logos System (Technology)/Testing_Strategy.md`.}
{...}

## Security Best Practices (for {Development Name})
{Highlight specific security considerations for **{Development Name}**. Reference `{epi-logos-memory-root}/Epi-Logos System (Technology)/Security_Guidelines.md` for overall security policies.}
{...}

## Scalability and Performance (for {Development Name})
{Discuss scalability requirements and performance targets for **{Development Name}**. How will the architecture support these? Reference `{epi-logos-memory-root}/Epi-Logos System (Technology)/Scalability_Performance_Guidelines.md`.}
{...}

## Logging, Monitoring, and Alerting (for {Development Name})
{Detail how logging, monitoring, and alerting will be implemented for **{Development Name}**. Reference `{epi-logos-memory-root}/Epi-Logos System (Technology)/Observability_Strategy.md`.}
{...}

## Key Reference Documents (for {Development Name})

- **{Development Name} PRD:** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/prd.md`
- **{Development Name} Plan:** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/plan.md`
- **{Development Name} Data Models (detailed):** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/data-models.md`
- **{Development Name} API Specifications (detailed):** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/api-specs.md`
- **{Development Name} Sharded Docs Index:** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/index.md`
- **Overall System Design Principles:** `{epi-logos-memory-root}/Epi-Logos System (Technology)/System_Design_Principles.md`
- **Siva (Backend) Architecture Overview:** `{epi-logos-memory-root}/Epi-Logos System (Technology)/5-2_Siva/Architecture.md` (if relevant)
- **Shakti (Frontend) Architecture Overview:** `{epi-logos-memory-root}/Epi-Logos System (Technology)/5-3_Sakti/Architecture.md` (if relevant)
- **Siva-Sakti (Integration) Patterns:** `{epi-logos-memory-root}/Epi-Logos System (Technology)/5-4_Siva-Sakti/Integration_Patterns.md` (if relevant)
- **{Link to relevant codebase READMEs, e.g., in `epii_app/friendly-file-backend/subsystems/{Subsystem}/README.md`}

## Change Log (for {Development Name} Architecture)

| Change | Date | Version | Description | Author |
| ------ | ---- | ------- | ----------- | ------ |

--- Below, Prompt for Design Architect (If Project has UI) To Produce Front End Architecture ----
