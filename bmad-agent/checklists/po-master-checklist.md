# Epi-Logos Process Steward (PO) Validation Checklist for {Development Name}

This checklist serves as a comprehensive framework for the Epi-Logos Process Steward to validate the complete MVP plan for **{Development Name}** (within **{PhilosophicalLayer} / {Subsystem}**) before development execution by an external AI builder. The Process Steward should systematically work through each item, documenting compliance status and noting any deficiencies. All artifacts are expected to be within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/`.

## 1. PROJECT SETUP & INITIALIZATION (for {Development Name})

### 1.1 Project Scaffolding (as defined for {Development Name})
- [ ] Epic 1 (in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/epics/epic-1.md`) includes explicit steps for **{Development Name}** creation/initialization.
- [ ] If using a starter template for **{Development Name}**, steps for cloning/setup are included and align with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Starter_Templates/`.
- [ ] If building **{Development Name}** from scratch, all necessary scaffolding steps are defined.
- [ ] Initial README for **{Development Name}** (in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/README.md`) or documentation setup is included.
- [ ] Repository setup and initial commit processes for **{Development Name}** are defined (if applicable).

### 1.2 Development Environment (for {Development Name})
- [ ] Local development environment setup for **{Development Name}** is clearly defined in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/dev-environment.md`.
- [ ] Required tools and versions for **{Development Name}** are specified (ref: `.../docs/architecture_shards/tech-stack.md`).
- [ ] Steps for installing dependencies for **{Development Name}** are included.
- [ ] Configuration files (dotenv, config files, etc.) for **{Development Name}** are addressed (ref: `.../docs/architecture_shards/environment-vars.md`).
- [ ] Development server setup for **{Development Name}** is included.

### 1.3 Core Dependencies (for {Development Name})
- [ ] All critical packages/libraries for **{Development Name}** are installed early in the process.
- [ ] Package management for **{Development Name}** is properly addressed.
- [ ] Version specifications for **{Development Name}** are appropriately defined (ref: `.../docs/architecture_shards/tech-stack.md`).
- [ ] Dependency conflicts or special requirements for **{Development Name}** are noted.

## 2. INFRASTRUCTURE & DEPLOYMENT SEQUENCING (for {Development Name})

### 2.1 Database & Data Store Setup (Siva Aspect of {Development Name})
- [ ] Database selection/setup for **{Development Name}** occurs before any database operations (ref: `.../architecture/data-models.md`).
- [ ] Schema definitions for **{Development Name}** are created before data operations.
- [ ] Migration strategies for **{Development Name}** are defined if applicable.
- [ ] Seed data or initial data setup for **{Development Name}** is included if needed.
- [ ] Database access patterns and security for **{Development Name}** are established early.

### 2.2 API & Service Configuration (Siva/Siva-Sakti Aspects of {Development Name})
- [ ] API frameworks for **{Development Name}** are set up before implementing endpoints (ref: `.../architecture/api-specs.md`).
- [ ] Service architecture for **{Development Name}** is established before implementing services.
- [ ] Authentication framework for **{Development Name}** is set up before protected routes.
- [ ] Middleware and common utilities for **{Development Name}** are created before use.

### 2.3 Deployment Pipeline (for {Development Name})
- [ ] CI/CD pipeline for **{Development Name}** is established before any deployment actions (ref: `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Deployment_Strategy.md`).
- [ ] Infrastructure as Code (IaC) for **{Development Name}** is set up before use (ref: `.../docs/architecture_shards/infra-deployment.md`).
- [ ] Environment configurations (dev, staging, prod) for **{Development Name}** are defined early.
- [ ] Deployment strategies for **{Development Name}** are defined before implementation.
- [ ] Rollback procedures or considerations for **{Development Name}** are addressed.

### 2.4 Testing Infrastructure (for {Development Name})
- [ ] Testing frameworks for **{Development Name}** are installed before writing tests (ref: `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Testing_Strategy.md`).
- [ ] Test environment setup for **{Development Name}** precedes test implementation.
- [ ] Mock services or data for **{Development Name}** are defined before testing.
- [ ] Test utilities or helpers for **{Development Name}** are created before use.

## 3. EXTERNAL DEPENDENCIES & INTEGRATIONS (for {Development Name})

### 3.1 Third-Party Services
- [ ] Account creation steps for required services for **{Development Name}** are identified.
- [ ] API key acquisition processes for **{Development Name}** are defined.
- [ ] Steps for securely storing credentials for **{Development Name}** are included (ref: `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Security_Guidelines.md`).
- [ ] Fallback or offline development options for **{Development Name}** are considered.

### 3.2 External APIs
- [ ] Integration points with external APIs for **{Development Name}** are clearly identified (ref: `.../architecture/api-specs.md`).
- [ ] Authentication with external services for **{Development Name}** is properly sequenced.
- [ ] API limits or constraints for **{Development Name}** are acknowledged.
- [ ] Backup strategies for API failures for **{Development Name}** are considered.

### 3.3 Infrastructure Services
- [ ] Cloud resource provisioning for **{Development Name}** is properly sequenced.
- [ ] DNS or domain registration needs for **{Development Name}** are identified.
- [ ] Email or messaging service setup for **{Development Name}** is included if needed.
- [ ] CDN or static asset hosting setup for **{Development Name}** precedes their use.

## 4. USER/AGENT RESPONSIBILITY DELINEATION (for {Development Name})

### 4.1 User Actions
- [ ] User responsibilities for **{Development Name}** are limited to only what requires human intervention.
- [ ] Account creation on external services for **{Development Name}** is properly assigned to users.
- [ ] Purchasing or payment actions for **{Development Name}** are correctly assigned to users.
- [ ] Credential provision for **{Development Name}** is appropriately assigned to users.

### 4.2 Epi-Logos Aligned Dev Agent / External AI Builder Actions
- [ ] All code-related tasks for **{Development Name}** are assigned to the development agent/builder.
- [ ] Automated processes for **{Development Name}** are correctly identified as agent/builder responsibilities.
- [ ] Configuration management for **{Development Name}** is properly assigned.
- [ ] Testing and validation for **{Development Name}** are assigned to appropriate agents/builder or automated processes.

## 5. FEATURE SEQUENCING & DEPENDENCIES (within {Development Name})

### 5.1 Functional Dependencies
- [ ] Features within **{Development Name}** that depend on other features are sequenced correctly.
- [ ] Shared components for **{Development Name}** are built before their use.
- [ ] User flows for **{Development Name}** follow a logical progression.
- [ ] Authentication features for **{Development Name}** precede protected routes/features.

### 5.2 Technical Dependencies
- [ ] Lower-level services for **{Development Name}** are built before higher-level ones.
- [ ] Libraries and utilities for **{Development Name}** are created before their use.
- [ ] Data models for **{Development Name}** are defined before operations on them.
- [ ] API endpoints for **{Development Name}** are defined before client consumption.

### 5.3 Cross-Epic Dependencies (within {Development Name})
- [ ] Later epics for **{Development Name}** build upon functionality from earlier epics.
- [ ] No epic for **{Development Name}** requires functionality from later epics.
- [ ] Infrastructure established in early epics for **{Development Name}** is utilized consistently.
- [ ] Incremental value delivery for **{Development Name}** is maintained, aligned with Epi-Logos principles.

## 6. MVP SCOPE ALIGNMENT (for {Development Name})

### 6.1 EFDD Goals Alignment
- [ ] All core goals defined in the EFDD for **{Development Name}** (at `.../1_feature_definition/efdd.md`) are addressed in epics/stories.
- [ ] Features in **{Development Name}** directly support the defined MVP goals and philosophical intent.
- [ ] No extraneous features beyond MVP scope for **{Development Name}** are included.
- [ ] Critical features for **{Development Name}** are prioritized appropriately.

### 6.2 User Journey Completeness (Seeker/Participant Perspective)
- [ ] All critical user journeys for **{Development Name}** are fully implemented.
- [ ] Edge cases and error scenarios for **{Development Name}** are addressed.
- [ ] User experience considerations for **{Development Name}** are included (ref: `.../design/ui-ux-spec.md`).
- [ ] Accessibility requirements for **{Development Name}** are incorporated if specified.

### 6.3 Technical Requirements Satisfaction
- [ ] All technical constraints from the EFDD for **{Development Name}** are addressed.
- [ ] Non-functional requirements for **{Development Name}** are incorporated (ref: EFDD NFR section and `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/NFRs.md`).
- [ ] Architecture decisions for **{Development Name}** align with specified constraints (ref: `.../architecture/index.md`).
- [ ] Performance considerations for **{Development Name}** are appropriately addressed.

## 7. RISK MANAGEMENT & PRACTICALITY (for {Development Name})

### 7.1 Technical Risk Mitigation
- [ ] Complex or unfamiliar technologies for **{Development Name}** have appropriate learning/prototyping stories.
- [ ] High-risk components for **{Development Name}** have explicit validation steps.
- [ ] Fallback strategies exist for risky integrations for **{Development Name}**.
- [ ] Performance concerns for **{Development Name}** have explicit testing/validation.

### 7.2 External Dependency Risks
- [ ] Risks with third-party services for **{Development Name}** are acknowledged and mitigated.
- [ ] API limits or constraints for **{Development Name}** are addressed.
- [ ] Backup strategies exist for critical external services for **{Development Name}**.
- [ ] Cost implications of external services for **{Development Name}** are considered.

### 7.3 Timeline Practicality
- [ ] Story complexity and sequencing for **{Development Name}** suggest a realistic timeline.
- [ ] Dependencies on external factors for **{Development Name}** are minimized or managed.
- [ ] Parallel work for **{Development Name}** is enabled where possible.
- [ ] Critical path for **{Development Name}** is identified and optimized.

## 8. DOCUMENTATION & HANDOFF (for {Development Name} to AI Builder)

### 8.1 Developer Documentation / Prompt Package Readiness
- [ ] API documentation for **{Development Name}** is created alongside implementation (or stubs exist).
- [ ] Setup instructions for **{Development Name}** are comprehensive.
- [ ] Architecture decisions for **{Development Name}** are documented (`.../architecture/index.md`).
- [ ] Patterns and conventions for **{Development Name}** are documented (`.../docs/architecture_shards/operational-guidelines.md`).
- [ ] All stories for **{Development Name}** are detailed enough to serve as prompts for an external AI builder.

### 8.2 User Documentation (if applicable for {Development Name})
- [ ] User guides or help documentation for **{Development Name}** is included if required.
- [ ] Error messages and user feedback for **{Development Name}** are considered.
- [ ] Onboarding flows for **{Development Name}** are fully specified.
- [ ] Support processes for **{Development Name}** are defined if applicable.

## 9. POST-MVP CONSIDERATIONS (for {Development Name})

### 9.1 Future Enhancements
- [ ] Clear separation between MVP and future features for **{Development Name}**.
- [ ] Architecture for **{Development Name}** supports planned future enhancements.
- [ ] Technical debt considerations for **{Development Name}** are documented.
- [ ] Extensibility points for **{Development Name}** are identified.

### 9.2 Feedback Mechanisms & Memory Enrichment
- [ ] Analytics or usage tracking for **{Development Name}** is included if required.
- [ ] User (seeker) feedback collection for **{Development Name}** is considered.
- [ ] Monitoring and alerting for **{Development Name}** are addressed.
- [ ] Performance measurement for **{Development Name}** is incorporated.
- [ ] Plan for integrating learnings from **{Development Name}** back into `BMAD EPI-LOGOS MEMORY`.

## VALIDATION SUMMARY FOR {Development Name}

### Category Statuses
| Category | Status | Critical Issues |
|----------|--------|----------------|
| 1. Project Setup & Initialization | PASS/FAIL/PARTIAL | |
| 2. Infrastructure & Deployment Sequencing | PASS/FAIL/PARTIAL | |
| 3. External Dependencies & Integrations | PASS/FAIL/PARTIAL | |
| 4. User/Agent Responsibility Delineation | PASS/FAIL/PARTIAL | |
| 5. Feature Sequencing & Dependencies | PASS/FAIL/PARTIAL | |
| 6. MVP Scope Alignment | PASS/FAIL/PARTIAL | |
| 7. Risk Management & Practicality | PASS/FAIL/PARTIAL | |
| 8. Documentation & Handoff (Prompt Readiness) | PASS/FAIL/PARTIAL | |
| 9. Post-MVP Considerations | PASS/FAIL/PARTIAL | |

### Critical Deficiencies
- List all critical issues for **{Development Name}** that must be addressed before approval for AI builder handoff.

### Recommendations
- Provide specific recommendations for addressing each deficiency for **{Development Name}**.

### Final Decision for {Development Name}
- **APPROVED FOR AI BUILDER HANDOFF**: The plan for **{Development Name}** is comprehensive, philosophically aligned, properly sequenced, and its stories are ready to be used as prompts for an external AI builder.
- **REJECTED**: The plan for **{Development Name}** requires revision to address the identified deficiencies.
