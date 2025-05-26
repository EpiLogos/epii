# Architect Solution Validation Checklist for {Development Name} ({PhilosophicalLayer} / {Subsystem})

This checklist serves as a comprehensive framework for the Epi-Logos Contextual Architect to validate the technical design and architecture for **{Development Name}** before development execution. The Architect should systematically work through each item, ensuring the architecture is robust, scalable, secure, and aligned with the product requirements and Epi-Logos principles.

## 1. REQUIREMENTS ALIGNMENT (for {Development Name})

### 1.1 Functional Requirements Coverage

- [ ] Architecture supports all functional requirements in the EFDD for **{Development Name}** (located at `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/1_feature_definition/efdd.md`)
- [ ] Technical approaches for all epics and stories within **{Development Name}** are addressed, considering the **{PhilosophicalLayer}** context
- [ ] Edge cases and performance scenarios for **{Development Name}** are considered
- [ ] All required integrations for **{Development Name}** are accounted for, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Integration_Patterns.md`
- [ ] User journeys for **{Development Name}** are supported by the technical architecture

### 1.2 Non-Functional Requirements Alignment

- [ ] Performance requirements for **{Development Name}** are addressed with specific solutions, referencing foundational principles in `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/NFRs.md` and specific NFRs in the EFDD for **{DevelopmentName}**.
- [ ] Scalability considerations for **{Development Name}** are documented with approach, aligned with **{PhilosophicalLayer}** principles and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Scalability_Performance_Guidelines.md`.
- [ ] Security requirements for **{Development Name}** have corresponding technical controls, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Security_Principles.md` and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Security_Guidelines.md`.
- [ ] Reliability and resilience approaches for **{Development Name}** are defined, considering the **{PhilosophicalLayer}** context.
- [ ] Compliance requirements for **{Development Name}** have technical implementations, aligned with project-level guidelines and any specific needs of its **{Subsystem}**.

### 1.3 Technical Constraints Adherence

- [ ] All technical constraints from EFDD for **{Development Name}** are satisfied
- [ ] Platform/language requirements for **{Development Name}** are followed, consistent with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md`
- [ ] Infrastructure constraints for **{Development Name}** are accommodated, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Deployment_Strategy.md`
- [ ] Third-party service constraints for **{Development Name}** are addressed, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/ThirdPartyIntegrations.md`
- [ ] Organizational technical standards (e.g., from `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Coding_Standards.md`) are followed for **{Development Name}**

## 2. ARCHITECTURE FUNDAMENTALS (for {Development Name})

### 2.1 Architecture Clarity

- [ ] Architecture for **{Development Name}** is documented with clear diagrams in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/diagrams/`
- [ ] Major components and their responsibilities for **{Development Name}** are defined, consistent with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/ComponentLibrary.md` and detailed in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/components/`
- [ ] Component interactions and dependencies for **{Development Name}** are mapped, reflecting the **{PhilosophicalLayer}** integration patterns and Bimba coordinates of its **{Subsystem}**.
- [ ] Data flows for **{Development Name}** are clearly illustrated, aligning with the overall Epi-Logos data philosophy (`BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Data_Management_Strategy.md`).
- [ ] Technology choices for each component of **{Development Name}** are specified, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md`.

### 2.2 Separation of Concerns (Siva, Shakti, Siva-Sakti for {Development Name})

- [ ] Clear boundaries between UI (Shakti aspect), business logic (Siva-Sakti aspect), and data layers (Siva aspect) for **{Development Name}**.
- [ ] Responsibilities are cleanly divided between components of **{Development Name}**.
- [ ] Interfaces between components of **{Development Name}** are well-defined.
- [ ] Components of **{Development Name}** adhere to single responsibility principle.
- [ ] Cross-cutting concerns (logging, auth, etc.) for **{Development Name}** are properly addressed, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Cross_Cutting_Concerns.md`.

### 2.3 Design Patterns & Best Practices

- [ ] Appropriate design patterns are employed for **{Development Name}**, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Architectural_Patterns/`.
- [ ] Industry best practices are followed for **{Development Name}**.
- [ ] Anti-patterns are avoided in **{Development Name}**.
- [ ] Consistent architectural style throughout **{Development Name}**.
- [ ] Pattern usage is documented and explained in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/`.

### 2.4 Modularity & Maintainability

- [ ] **{Development Name}** is divided into cohesive, loosely-coupled modules.
- [ ] Components of **{Development Name}** can be developed and tested independently.
- [ ] Changes within **{Development Name}** can be localized to specific components.
- [ ] Code organization for **{Development Name}** promotes discoverability.
- [ ] Architecture specifically designed for AI agent implementation and **{Development Name}** feature evolution, considering Epi-Logos principles.

## 3. TECHNICAL STACK & DECISIONS (for {Development Name})

### 3.1 Technology Selection

- [ ] Selected technologies meet all requirements for **{Development Name}**, consistent with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md`.
- [ ] Technology versions for **{Development Name}** are specifically defined (not ranges), as per `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/TechStack.md`.
- [ ] Technology choices for **{Development Name}** are justified with clear rationale, considering the **{PhilosophicalLayer}** context and Epi-Logos Sacred Technology Ethos.
- [ ] Alternatives considered for **{Development Name}** are documented with pros/cons.
- [ ] Selected stack components for **{Development Name}** work well together.

### 3.2 Frontend Architecture (Shakti Aspect of {Development Name})

- [ ] UI framework and libraries for **{Development Name}** are specifically selected, aligned with Shakti principles and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/5-3_Sakti/Frontend_Patterns.md`. Details in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/front-end-architecture.md`.
- [ ] State management approach for **{Development Name}** is defined, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/5-3_Sakti/State_Management_Guidelines.md`.
- [ ] Component structure and organization for **{Development Name}** is specified.
- [ ] Responsive/adaptive design approach for **{Development Name}** is outlined.
- [ ] Build and bundling strategy for **{Development Name}** frontend is determined.

### 3.3 Backend Architecture (Siva Aspect of {Development Name})

- [ ] API design and standards for **{Development Name}** are defined, aligned with Siva principles and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/5-2_Siva/Backend_Patterns.md`. Details in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/api-specs.md`.
- [ ] Service organization and boundaries for **{Development Name}** are clear.
- [ ] Authentication and authorization approach for **{Development Name}** is specified, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Security_Guidelines.md`.
- [ ] Error handling strategy for **{Development Name}** is outlined, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Error_Handling_Guidelines.md`.
- [ ] Backend scaling approach for **{Development Name}** is defined.

### 3.4 Data Architecture (Siva Aspect of {Development Name})

- [ ] Data models for **{Development Name}** are fully defined in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/data-models.md`, consistent with Siva principles and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/DataModels.md`.
- [ ] Database technologies for **{Development Name}** are selected with justification.
- [ ] Data access patterns for **{Development Name}** are documented.
- [ ] Data migration/seeding approach for **{Development Name}** is specified.
- [ ] Data backup and recovery strategies for **{Development Name}** are outlined.

## 4. RESILIENCE & OPERATIONAL READINESS (for {Development Name})

### 4.1 Error Handling & Resilience

- [ ] Error handling strategy for **{Development Name}** is comprehensive, aligned with **{PhilosophicalLayer}** resilience principles and `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Error_Handling_Guidelines.md`.
- [ ] Retry policies for **{Development Name}** are defined where appropriate.
- [ ] Circuit breakers or fallbacks for **{Development Name}** are specified for critical services.
- [ ] Graceful degradation approaches for **{Development Name}** are defined.
- [ ] **{Development Name}** can recover from partial failures.

### 4.2 Monitoring & Observability

- [ ] Logging strategy for **{Development Name}** is defined, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Observability_Strategy.md`.
- [ ] Monitoring approach for **{Development Name}** is specified.
- [ ] Key metrics for **{Development Name}** health are identified.
- [ ] Alerting thresholds and strategies for **{Development Name}** are outlined.
- [ ] Debugging and troubleshooting capabilities for **{Development Name}** are built in.

### 4.3 Performance & Scaling

- [ ] Performance bottlenecks for **{Development Name}** are identified and addressed.
- [ ] Caching strategy for **{Development Name}** is defined where appropriate.
- [ ] Load balancing approach for **{Development Name}** is specified.
- [ ] Horizontal and vertical scaling strategies for **{Development Name}** are outlined.
- [ ] Resource sizing recommendations for **{Development Name}** are provided.

### 4.4 Deployment & DevOps

- [ ] Deployment strategy for **{Development Name}** is defined, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Deployment_Strategy.md`.
- [ ] CI/CD pipeline approach for **{Development Name}** is outlined.
- [ ] Environment strategy (dev, staging, prod) for **{Development Name}** is specified.
- [ ] Infrastructure as Code approach for **{Development Name}** is defined.
- [ ] Rollback and recovery procedures for **{Development Name}** are outlined.

## 5. SECURITY & COMPLIANCE (for {Development Name})

### 5.1 Authentication & Authorization

- [ ] Authentication mechanism for **{Development Name}** is clearly defined, consistent with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Security_Guidelines.md` and `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/Security_Principles.md`.
- [ ] Authorization model for **{Development Name}** is specified.
- [ ] Role-based access control for **{Development Name}** is outlined if required.
- [ ] Session management approach for **{Development Name}** is defined.
- [ ] Credential management for **{Development Name}** is addressed.

### 5.2 Data Security

- [ ] Data encryption approach (at rest and in transit) for **{Development Name}** is specified, aligned with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Security_Guidelines.md`.
- [ ] Sensitive data handling procedures for **{Development Name}** are defined.
- [ ] Data retention and purging policies for **{Development Name}** are outlined.
- [ ] Backup encryption for **{Development Name}** is addressed if required.
- [ ] Data access audit trails for **{Development Name}** are specified if required.

### 5.3 API & Service Security

- [ ] API security controls for **{Development Name}** are defined.
- [ ] Rate limiting and throttling approaches for **{Development Name}** are specified.
- [ ] Input validation strategy for **{Development Name}** is outlined.
- [ ] CSRF/XSS prevention measures for **{Development Name}** are addressed.
- [ ] Secure communication protocols for **{Development Name}** are specified.

### 5.4 Infrastructure Security

- [ ] Network security design for **{Development Name}** is outlined.
- [ ] Firewall and security group configurations for **{Development Name}** are specified.
- [ ] Service isolation approach for **{Development Name}** is defined.
- [ ] Least privilege principle is applied for **{Development Name}**.
- [ ] Security monitoring strategy for **{Development Name}** is outlined.

## 6. IMPLEMENTATION GUIDANCE (for {Development Name})

### 6.1 Coding Standards & Practices

- [ ] Coding standards for **{Development Name}** are defined, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Coding_Standards.md`.
- [ ] Documentation requirements for **{Development Name}** are specified.
- [ ] Testing expectations for **{Development Name}** are outlined, referencing `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/Testing_Strategy.md`.
- [ ] Code organization principles for **{Development Name}** are defined.
- [ ] Naming conventions for **{Development Name}** are specified.

### 6.2 Testing Strategy

- [ ] Unit testing approach for **{Development Name}** is defined.
- [ ] Integration testing strategy for **{Development Name}** is outlined.
- [ ] E2E testing approach for **{Development Name}** is specified.
- [ ] Performance testing requirements for **{Development Name}** are outlined.
- [ ] Security testing approach for **{Development Name}** is defined.

### 6.3 Development Environment

- [ ] Local development environment setup for **{Development Name}** is documented in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/dev-environment.md`.
- [ ] Required tools and configurations for **{Development Name}** are specified.
- [ ] Development workflows for **{Development Name}** are outlined.
- [ ] Source control practices for **{Development Name}** are defined.
- [ ] Dependency management approach for **{Development Name}** is specified.

### 6.4 Technical Documentation

- [ ] API documentation standards for **{Development Name}** are defined, consistent with `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/api-specs.md`.
- [ ] Architecture documentation requirements for **{Development Name}** are specified, with outputs in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/`.
- [ ] Code documentation expectations for **{Development Name}** are outlined.
- [ ] System diagrams and visualizations for **{Development Name}** are included.
- [ ] Decision records for key choices for **{Development Name}** are included in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/architecture/decisions.md`.

## 7. DEPENDENCY & INTEGRATION MANAGEMENT (for {Development Name})

### 7.1 External Dependencies

- [ ] All external dependencies for **{Development Name}** are identified, consistent with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/ExternalDependencies.md`.
- [ ] Versioning strategy for dependencies for **{Development Name}** is defined.
- [ ] Fallback approaches for critical dependencies for **{Development Name}** are specified.
- [ ] Licensing implications for **{Development Name}** are addressed.
- [ ] Update and patching strategy for **{Development Name}** is outlined.

### 7.2 Internal Dependencies (within {Subsystem} or across Epi-Logos)

- [ ] Component dependencies for **{Development Name}** are clearly mapped.
- [ ] Build order dependencies for **{Development Name}** are addressed.
- [ ] Shared services and utilities within Epi-Logos are identified.
- [ ] Circular dependencies involving **{Development Name}** are eliminated.
- [ ] Versioning strategy for internal components used by **{Development Name}** is defined.

### 7.3 Third-Party Integrations

- [ ] All third-party integrations for **{Development Name}** are identified, consistent with `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/ThirdPartyIntegrations.md`.
- [ ] Integration approaches for **{Development Name}** are defined.
- [ ] Authentication with third parties for **{Development Name}** is addressed.
- [ ] Error handling for integration failures for **{Development Name}** is specified.
- [ ] Rate limits and quotas for **{Development Name}** are considered.

## 8. AI AGENT / EXTERNAL BUILDER IMPLEMENTATION SUITABILITY (for {Development Name})

### 8.1 Modularity for AI Agents / External Builder

- [ ] Components of **{Development Name}** are sized appropriately for implementation.
- [ ] Dependencies between components of **{Development Name}** are minimized.
- [ ] Clear interfaces between components of **{Development Name}** are defined.
- [ ] Components of **{Development Name}** have singular, well-defined responsibilities.
- [ ] File and code organization for **{Development Name}** optimized for understanding.

### 8.2 Clarity & Predictability for AI / External Builder

- [ ] Patterns used in **{Development Name}** are consistent and predictable.
- [ ] Complex logic in **{Development Name}** is broken down into simpler steps.
- [ ] Architecture for **{Development Name}** avoids overly clever or obscure approaches.
- [ ] Examples are provided for unfamiliar patterns in **{Development Name}**.
- [ ] Component responsibilities in **{Development Name}** are explicit and clear.

### 8.3 Implementation Guidance for AI / External Builder

- [ ] Detailed implementation guidance for **{Development Name}** is provided in `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/implementation-guidance.md`.
- [ ] Code structure templates for **{Development Name}** are defined.
- [ ] Specific implementation patterns for **{Development Name}** are documented.
- [ ] Common pitfalls for **{Development Name}** are identified with solutions.
- [ ] References to similar implementations are provided when helpful.

### 8.4 Error Prevention & Handling for AI / External Builder

- [ ] Design of **{Development Name}** reduces opportunities for implementation errors.
- [ ] Validation and error checking approaches for **{Development Name}** are defined.
- [ ] Self-healing mechanisms for **{Development Name}** are incorporated where possible.
- [ ] Testing patterns for **{Development Name}** are clearly defined.
- [ ] Debugging guidance for **{Development Name}** is provided.
