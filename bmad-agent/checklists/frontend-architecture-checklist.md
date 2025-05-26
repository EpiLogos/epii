# Frontend Architecture Document Review Checklist for {Development Name} ({PhilosophicalLayer} / {Subsystem}) - Shakti Aspect

## Purpose
This checklist is for the Epi-Logos Design Architect to use after completing the "Frontend Architecture Mode" and populating the `front-end-architecture.md` document for **{Development Name}**. It ensures all sections are comprehensively covered, meet quality standards, and align with Epi-Logos principles before finalization. The frontend architecture document itself is located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/front-end-architecture.md`.

---

## I. Introduction

- [ ] Is the `{Development Name}`, `{PhilosophicalLayer}`, and `{Subsystem}` context correctly filled in throughout the Introduction?
- [ ] Is the link to the Main Architecture Document for **{Development Name}** (e.g., `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md`) present and correct?
- [ ] Is the link to the UI/UX Specification for **{Development Name}** (e.g., `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/design/ui-ux-spec.md` or sharded docs) present and correct?
- [ ] Is the link to the Primary Design Files (Figma, Sketch, etc.) for **{Development Name}** present and correct?
- [ ] Is the link to a Deployed Storybook / Component Showcase for **{Development Name}** included, if applicable and available?
- [ ] Does the introduction clearly state how this Shakti architecture aligns with Epi-Logos principles (e.g., from `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Design_Philosophy.md`)?

## II. Overall Frontend Philosophy & Patterns (Shakti Aspect for {Development Name})

- [ ] Are the chosen Framework & Core Libraries clearly stated and aligned with the main architecture document for **{Development Name}**?
- [ ] Is the Component Architecture (e.g., Atomic Design, Presentational/Container) clearly described and aligned with Epi-Logos modularity?
- [ ] Is the State Management Strategy (e.g., Redux Toolkit, Zustand) clearly described at a high level, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/5-3_Sakti/State_Management_Guidelines.md`?
- [ ] Is the Data Flow (e.g., Unidirectional) clearly explained, considering interaction with Siva/Siva-Sakti aspects?
- [ ] Is the Styling Approach (e.g., CSS Modules, Tailwind CSS) clearly defined?
- [ ] Are Key Design Patterns to be employed (e.g., Provider, Hooks) listed and aligned with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/5-3_Sakti/Frontend_Patterns.md`?
- [ ] Does this section align with "Definitive Tech Stack Selections" in the main architecture document for **{Development Name}**?
- [ ] Are implications from overall system architecture (monorepo/polyrepo, backend services for **{Development Name}**) considered?

## III. Detailed Frontend Directory Structure (for {Development Name})

- [ ] Is an ASCII diagram representing the frontend application's folder structure for **{Development Name}** provided (e.g., within `epii_app/friendly-file-front/src/features/{DevelopmentNameFeatureComponent}/`)?
- [ ] Is the diagram clear, accurate, and reflective of the chosen framework/patterns for **{Development Name}**?
- [ ] Are conventions for organizing components, pages, services, state, styles, etc., for **{Development Name}** highlighted?
- [ ] Are notes explaining specific conventions or rationale for the structure (for **{Development Name}**) present and clear?

## IV. Component Breakdown & Implementation Details (for {Development Name})

### Component Naming & Organization
- [ ] Are conventions for naming components (e.g., PascalCase) for **{Development Name}** described?
- [ ] Is the organization of components on the filesystem for **{Development Name}** clearly explained?

### Template for Component Specification
- [ ] Is the "Template for Component Specification" (within `front-end-architecture.md` for **{DevelopmentName}**) itself complete and well-defined for creating components of **{DevelopmentName}**?
  - [ ] Does it include fields for: Purpose, Source File(s) (within **{DevelopmentName}** structure), Visual Reference (to **{DevelopmentName}** designs)?
  - [ ] Does it include a table structure for Props (Name, Type, Required, Default, Description)?
  - [ ] Does it include a table structure for Internal State (Variable, Type, Initial Value, Description)?
  - [ ] Does it include a section for Key UI Elements / Structure (textual or pseudo-HTML)?
  - [ ] Does it include a section for Events Handled / Emitted?
  - [ ] Does it include a section for Actions Triggered (State Management for **{DevelopmentName}**, API Calls to **{DevelopmentName}** backend)?
  - [ ] Does it include a section for Styling Notes (referencing design system for **{DevelopmentName}**)?
  - [ ] Does it include a section for Accessibility Notes (relevant to **{DevelopmentName}** components)?
- [ ] Is there a clear statement that this template should be used for most feature-specific components within **{Development Name}**?

### Foundational/Shared Components (if any specified upfront for {Development Name})
- [ ] If any foundational/shared UI components are specified for **{Development Name}**, do they follow the "Template for Component Specification"?
- [ ] Is the rationale for specifying these components upfront for **{Development Name}** clear?

## V. State Management In-Depth (for {Development Name})

- [ ] Is the chosen State Management Solution for **{Development Name}** reiterated?
- [ ] Are conventions for Store Structure / Slices for **{Development Name}** clearly defined (e.g., location within **{DevelopmentName}**'s structure)?
- [ ] If a Core Slice Example is provided for **{Development Name}**: (e.g. `sessionSlice` if part of this dev)
  - [ ] Is its purpose clear for **{Development Name}**?
  - [ ] Is its State Shape defined?
  - [ ] Are its Key Reducers/Actions listed?
- [ ] Is a Feature Slice Template provided for **{Development Name}**, outlining purpose, state shape, and key reducers/actions to be filled in?
- [ ] Are conventions for Key Selectors (e.g., use `createSelector`) for **{Development Name}** noted?
- [ ] Are examples of Key Selectors for any core slices for **{Development Name}** provided?
- [ ] Are conventions for Key Actions / Reducers / Thunks (especially async) for **{Development Name}** described?
- [ ] Is an example of a Core Action/Thunk for **{Development Name}** provided, detailing its purpose and dispatch flow?
- [ ] Is a Feature Action/Thunk Template provided for **{Development Name}** for feature-specific async operations?

## VI. API Interaction Layer (Shakti with Siva/Siva-Sakti for {Development Name})

- [ ] Is the HTTP Client Setup for **{Development Name}** detailed (e.g., Axios instance, Fetch wrapper, base URL, default headers, interceptors)?
- [ ] Are Service Definitions conventions for **{Development Name}** explained?
- [ ] Is an example of a service for **{Development Name}** (e.g., `dataService.ts` for **{DevelopmentName}**) provided?
- [ ] Is Global Error Handling for API calls for **{Development Name}** described?
- [ ] Is guidance on Specific Error Handling within components of **{Development Name}** provided?
- [ ] Is any client-side Retry Logic for API calls for **{Development Name}** detailed and configured?
- [ ] Does it consider the Model Context Protocol (MCP) for data exchange, as outlined in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/mcp-interfaces.md`?

## VII. Routing Strategy (for {Development Name})

- [ ] Is the chosen Routing Library for **{Development Name}** stated?
- [ ] Is a table of Route Definitions for **{Development Name}** provided?
  - [ ] Does it include Path Pattern, Component/Page, Protection status, and Notes for each route within **{Development Name}**?
- [ ] Is the Authentication Guard mechanism for protecting routes in **{Development Name}** described?
- [ ] Is the Authorization Guard mechanism (if applicable for roles/permissions) for **{Development Name}** described?

## VIII. Build, Bundling, and Deployment (for {Development Name} Frontend)

- [ ] Are Key Build Scripts for **{Development Name}** listed and their purpose explained?
- [ ] Is the handling of Environment Variables for **{Development Name}** during the build process described?
- [ ] Is Code Splitting strategy for **{Development Name}** detailed?
- [ ] Is Tree Shaking for **{Development Name}** confirmed or explained?
- [ ] Is Lazy Loading strategy for **{Development Name}** outlined?
- [ ] Is Minification & Compression by build tools for **{Development Name}** mentioned?
- [ ] Is the Target Deployment Platform for **{Development Name}** specified?
- [ ] Is the Deployment Trigger for **{Development Name}** described, referencing the main CI/CD pipeline for the project?
- [ ] Is the Asset Caching Strategy for **{Development Name}** (CDN/browser) outlined?

## IX. Frontend Testing Strategy (for {Development Name})

- [ ] Is there a link to the Main Testing Strategy for **{Development Name}** (e.g., in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/index.md#overall-testing-strategy`)?
- [ ] For Component Testing within **{Development Name}**: Scope, Tools, Focus, Location of tests defined?
- [ ] For UI Integration/Flow Testing within **{Development Name}**: Scope, Tools, Focus defined?
- [ ] For End-to-End UI Testing for **{Development Name}**: Tools, Scope (key user journeys for **{DevelopmentName}**), Test Data Management addressed?

## X. Accessibility (AX) Implementation Details (for {Development Name})

- [ ] Emphasis on Semantic HTML for **{Development Name}**?
- [ ] Guidelines for ARIA Implementation for **{Development Name}** custom components?
- [ ] Requirements for Keyboard Navigation for **{Development Name}** stated?
- [ ] Focus Management for **{Development Name}** (modals, dynamic content) addressed?
- [ ] Testing Tools for AX for **{Development Name}** listed? (Referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Accessibility_Guidelines.md`)
- [ ] Does this section align with AX requirements from the UI/UX Specification for **{Development Name}**?

## XI. Performance Considerations (for {Development Name})

- [ ] Image Optimization for **{Development Name}** discussed?
- [ ] Code Splitting & Lazy Loading impact on perceived performance for **{Development Name}** reiterated?
- [ ] Techniques for Minimizing Re-renders for **{Development Name}** components mentioned?
- [ ] Use of Debouncing/Throttling for event handlers in **{Development Name}** considered?
- [ ] Virtualization for long lists in **{Development Name}** mentioned if applicable?
- [ ] Client-Side Caching Strategies for **{Development Name}** discussed?
- [ ] Performance Monitoring Tools for **{Development Name}** listed? (Referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Scalability_Performance_Guidelines.md`)

## XII. Change Log

- [ ] Is the Change Log table present and initialized for the **{Development Name}** Frontend Architecture document?
- [ ] Is there a process for updating the change log as the document evolves?

---

## Final Review Sign-off

- [ ] Have all placeholders (e.g., `{Development Name}`, `{PhilosophicalLayer}`, `{Subsystem}`) been filled in?
- [ ] Has the document been reviewed for clarity, consistency, and completeness by the Epi-Logos Design Architect?
- [ ] Are all linked documents (Main Architecture for **{DevelopmentName}**, UI/UX Spec for **{DevelopmentName}**) finalized or stable?
- [ ] Is the document ready to be shared with the development team for **{Development Name}**?
