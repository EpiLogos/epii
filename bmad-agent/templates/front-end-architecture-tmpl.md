# {Development Name} - Shakti Frontend Architecture

**Context:** {PhilosophicalLayer} / {Subsystem}
**Location:** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/front-end-architecture.md`

## Table of Contents
{ Update this if sections and subsections are added or removed }
- [Introduction](#introduction)
- [Overall Frontend Philosophy & Patterns (Shakti Aspect)](#overall-frontend-philosophy--patterns-shakti-aspect)
- [Detailed Frontend Directory Structure (for {Development Name})](#detailed-frontend-directory-structure-for-development-name)
- [Component Breakdown & Implementation Details (for {Development Name})](#component-breakdown--implementation-details-for-development-name)
  - [Component Naming & Organization](#component-naming--organization)
  - [Template for Component Specification](#template-for-component-specification)
- [State Management In-Depth (for {Development Name})](#state-management-in-depth-for-development-name)
  - [Store Structure / Slices](#store-structure--slices)
  - [Key Selectors](#key-selectors)
  - [Key Actions / Reducers / Thunks](#key-actions--reducers--thunks)
- [API Interaction Layer (Shakti with Siva/Siva-Sakti)](#api-interaction-layer-shakti-with-sivasiva-sakti)
  - [Client/Service Structure](#clientservice-structure)
  - [Error Handling & Retries (Frontend)](#error-handling--retries-frontend)
- [Routing Strategy (for {Development Name})](#routing-strategy-for-development-name)
  - [Route Definitions](#route-definitions)
  - [Route Guards / Protection](#route-guards--protection)
- [Build, Bundling, and Deployment (for {Development Name} Frontend)](#build-bundling-and-deployment-for-development-name-frontend)
  - [Build Process & Scripts](#build-process--scripts)
  - [Key Bundling Optimizations](#key-bundling-optimizations)
  - [Deployment to CDN/Hosting](#deployment-to-cdnhosting)
- [Frontend Testing Strategy (for {Development Name})](#frontend-testing-strategy-for-development-name)
  - [Component Testing](#component-testing)
  - [UI Integration/Flow Testing](#ui-integrationflow-testing)
  - [End-to-End UI Testing Tools & Scope](#end-to-end-ui-testing-tools--scope)
- [Accessibility (AX) Implementation Details (for {Development Name})](#accessibility-ax-implementation-details-for-development-name)
- [Performance Considerations (for {Development Name})](#performance-considerations-for-development-name)
- [Internationalization (i18n) and Localization (l10n) Strategy (for {Development Name})](#internationalization-i18n-and-localization-l10n-strategy-for-development-name)
- [Feature Flag Management (for {Development Name})](#feature-flag-management-for-development-name)
- [Frontend Security Considerations (for {Development Name})](#frontend-security-considerations-for-development-name)
- [Browser Support and Progressive Enhancement (for {Development Name})](#browser-support-and-progressive-enhancement-for-development-name)
- [Change Log](#change-log)

## Introduction

{ This document details the technical architecture specifically for the frontend (Shakti aspect) of the **{Development Name}** development initiative. It complements the main **{Development Name}** Architecture Document (`../index.md` or `../architecture.md`) and the UI/UX Specification (`{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/design/ui-ux-spec.md` or sharded docs in `../docs/frontend_shards/`). This document details the frontend architecture and **builds upon the foundational decisions** (e.g., overall tech stack, CI/CD, primary testing tools) defined in the main **{Development Name}** Architecture Document. **Frontend-specific elaborations or deviations from general patterns must be explicitly noted here.** The goal is to provide a clear blueprint for frontend development for **{DevelopmentName}**, ensuring consistency, maintainability, and alignment with the overall system design, Epi-Logos principles (e.g., from `{epi-logos-memory-root}/Epi-Logos Project (Philosophy)/Design_Philosophy.md`), and user experience goals for **{DevelopmentName}**.}

- **Link to Main Architecture Document (REQUIRED):** `../index.md` (or `../architecture.md`) for **{Development Name}**
- **Link to UI/UX Specification (REQUIRED if exists):** `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/design/ui-ux-spec.md` (or `../docs/frontend_shards/style-guide.md` etc.)
- **Link to Primary Design Files (Figma, Sketch, etc.) (REQUIRED if exists):** {From UI/UX Spec for **{Development Name}**}
- **Link to Deployed Storybook / Component Showcase (if applicable for {Development Name}):** {URL}

## Overall Frontend Philosophy & Patterns (Shakti Aspect)

{ Describe the core architectural decisions and patterns chosen for the Shakti frontend of **{Development Name}**. This should align with the "Definitive Tech Stack Selections" in the main architecture document (`../index.md`) and consider implications from the overall system architecture (e.g., monorepo vs. polyrepo, Siva backend service structure). It should also reflect any relevant principles from the Epi-Logos philosophical layer (e.g., Vibrational-Harmonic Aesthetics from `{epi-logos-memory-root}/Epi-Logos Project (Philosophy)/Core_Principles.md`). }
// ... existing code ...

## Detailed Frontend Directory Structure (for {Development Name})
{ Provide an ASCII diagram representing the frontend application's specific folder structure for **{DevelopmentName}** (e.g., within `epii_app/friendly-file-front/src/features/{DevelopmentNameFeatureComponent}/` or a dedicated `frontend/` root directory if part of a monorepo). This should elaborate on the frontend part of the main project structure outlined in the architecture document for **{DevelopmentName}**. Highlight conventions for organizing components, pages/views, services, state, styles, assets, etc. For each key directory, provide a one-sentence mandatory description of its purpose. Reference global frontend patterns from `{epi-logos-memory-root}/Epi-Logos System (Technology)/5-3_Sakti/Frontend_Patterns.md` if applicable.}
// ... existing code ...

## Component Breakdown & Implementation Details (for {Development Name})
// ... existing code ...
#### Component: `{ComponentName}` (e.g., `UserProfileCard` for {Development Name})
// ... existing code ...
- **Visual Reference:** {Link to specific Figma frame/component for **{DevelopmentName}**, or Storybook page.}
// ... existing code ...
- **Actions Triggered (Side Effects):**
  - **State Management:** {e.g., "Dispatches `userSlice.actions.setUserName(newName)` from `{epi-logos-memory-root}/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/store/slices/userSlice.ts`."}
  - **API Calls:** {Specify which service/function from the "API Interaction Layer" for **{DevelopmentName}** is called.}
// ... existing code ...

## State Management In-Depth (for {Development Name})
{ This section expands on the State Management strategy for **{DevelopmentName}**. **Refer to the main Architecture Document for **{DevelopmentName}** (`../index.md`) for the definitive choice of state management solution.** Reference global state patterns from `{epi-logos-memory-root}/Epi-Logos System (Technology)/5-3_Sakti/State_Management_Guidelines.md`.}
// ... existing code ...

## API Interaction Layer (Shakti with Siva/Siva-Sakti)
{ Describe how the Shakti frontend for **{DevelopmentName}** communicates with the Siva/Siva-Sakti backend APIs defined in the main Architecture Document for **{DevelopmentName}** (`../index.md`). Reference Model Context Protocol details from `../mcp-interfaces.md` if applicable.}
// ... existing code ...

## Routing Strategy (for {Development Name})
// ... existing code ...

## Build, Bundling, and Deployment (for {Development Name} Frontend)
{ Details specific to the frontend build and deployment process for **{DevelopmentName}**, complementing the "Infrastructure and Deployment Overview" in the main architecture document for **{DevelopmentName}** (`../index.md`). Reference global deployment strategies from `{epi-logos-memory-root}/Epi-Logos System (Technology)/Deployment_Strategy.md`.}
// ... existing code ...

## Frontend Testing Strategy (for {Development Name})
{ This section elaborates on the "Testing Strategy" from the main architecture document for **{DevelopmentName}** (`../index.md`), focusing on frontend-specific aspects. **Refer to the main Architecture Document for **{DevelopmentName}** for definitive choices of testing tools.** Reference global testing strategies from `{epi-logos-memory-root}/Epi-Logos System (Technology)/Testing_Strategy.md`.}
// ... existing code ...

## Accessibility (AX) Implementation Details (for {Development Name})
{ Based on the AX requirements in the UI/UX Specification for **{DevelopmentName}**, detail how these will be technically implemented. Reference global accessibility guidelines from `{epi-logos-memory-root}/Epi-Logos Project (Philosophy)/Accessibility_Guidelines.md`.}
// ... existing code ...

## Performance Considerations (for {Development Name})
{ Highlight frontend-specific performance optimization strategies for **{DevelopmentName}**. Reference global performance guidelines from `{epi-logos-memory-root}/Epi-Logos System (Technology)/Scalability_Performance_Guidelines.md`.}
// ... existing code ...

## Internationalization (i18n) and Localization (l10n) Strategy (for {Development Name})
{This section defines the strategy for supporting multiple languages for **{DevelopmentName}**. If not applicable, state "Internationalization is not a requirement for **{DevelopmentName}** at this time." Reference global i18n strategy from `{epi-logos-memory-root}/Epi-Logos System (Technology)/Internationalization_Strategy.md`.}
// ... existing code ...

## Feature Flag Management (for {Development Name})
{This section outlines how conditionally enabled features are managed for **{DevelopmentName}**. If not applicable, state "Feature flags are not a primary architectural concern for **{DevelopmentName}** at this time."}
// ... existing code ...

## Frontend Security Considerations (for {Development Name})
{This section highlights mandatory frontend-specific security practices for **{DevelopmentName}**, complementing the main Architecture Document for **{DevelopmentName}** (`../index.md`). Reference global security guidelines from `{epi-logos-memory-root}/Epi-Logos System (Technology)/Security_Guidelines.md`.}
// ... existing code ...

## Browser Support and Progressive Enhancement (for {Development Name})
// ... existing code ...

## Change Log (for {Development Name} Frontend Architecture)

| Change | Date | Version | Description | Author |
| ------ | ---- | ------- | ----------- | ------ |
