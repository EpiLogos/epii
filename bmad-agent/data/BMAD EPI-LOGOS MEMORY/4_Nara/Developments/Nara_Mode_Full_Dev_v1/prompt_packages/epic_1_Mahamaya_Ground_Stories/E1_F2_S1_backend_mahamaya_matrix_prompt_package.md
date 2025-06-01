# AI Builder Prompt Package: Epic 1 - Story E1_F2_S1_backend_mahamaya_matrix

**Development Context:** 4_Nara / Nara_Mode_Full_Dev_v1

## 1. Story / Task Definition

**Story ID:** E1_F2_S1
**Story Title:** Backend System for Mahamaya Matrix

**Goal:** Develop the backend system for the Mahamaya Matrix. This system is responsible for storing and managing user context data derived from the six Mahamaya Ground layers (Birthdate Encoding, Astrological Chart, Jungian Archetype Assessment, Gene Keys Profile, Human Design Profile, I Ching Hexagrams) and the synthesized Archetypal Quintessence.

**User Story:** As a Nara user, I want my foundational archetypal data (from Mahamaya Ground layers and Quintessence) to be securely stored and efficiently managed so that the Nara system can provide personalized insights and experiences.

**Acceptance Criteria:**

1.  **Schema Design (MongoDB):** A clear, flexible, and scalable MongoDB schema is designed to store data for each of the six Mahamaya Ground layers and the Archetypal Quintessence. The schema must accommodate various data types (text, numbers, dates, complex objects) and allow for future evolution.
2.  **Data Integrity:** Mechanisms are in place to ensure data integrity, including validation rules and appropriate indexing for efficient querying.
3.  **CRUD API Endpoints:** Secure and well-documented CRUD (Create, Read, Update, Delete) API endpoints are developed for managing user data within the Mahamaya Matrix. These endpoints will be consumed by other backend services or the Nara Agent Core.
4.  **Security:** All sensitive user data, particularly PII, is encrypted at rest and in transit. Access controls are implemented to ensure only authorized services can access the data.
5.  **Performance:** The system is optimized for performance, ensuring quick data retrieval and updates, especially for frequently accessed user profiles.
6.  **Documentation:** Comprehensive documentation is provided for the schema design, API endpoints, and data management processes.

**Specific Tasks:**

1.  **Schema Design:** Define MongoDB schemas for:
    *   User Profile (linking to Mahamaya data)
    *   Birthdate Encoding Data
    *   Astrological Chart Data (Natal, Progressed, Transit)
    *   Jungian Archetype Assessment Results
    *   Gene Keys Profile Data
    *   Human Design Profile Data
    *   I Ching Hexagram Data (related to user context)
    *   Archetypal Quintessence Data
2.  **Schema Implementation:** Implement the defined schemas in MongoDB, including necessary indexes.
3.  **API Development:** Develop RESTful or GraphQL API endpoints for:
    *   Creating/updating a user's Mahamaya Matrix data.
    *   Retrieving a user's complete Mahamaya Matrix data.
    *   Retrieving specific layers of a user's Mahamaya Matrix data.
    *   (Consider if 'Delete' is a soft delete or hard delete, and implications).
4.  **Security Implementation:** Implement data encryption (e.g., field-level encryption for PII in MongoDB) and secure API authentication/authorization (e.g., JWT, OAuth2).
5.  **Testing:** Develop unit and integration tests for the API endpoints and data management logic.
6.  **Documentation:** Document the MongoDB schema, API endpoints (e.g., using Swagger/OpenAPI), and data flow.

## 2. Technical Context & Guidance

**Source Story File:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_1/story_E1_F2_S1_backend_mahamaya_matrix.md`

**Key Technical Guidance from Story:**

*   **Database Choice:** MongoDB is specified for its flexibility and scalability, suitable for evolving schema requirements of archetypal data.
*   **Schema Flexibility:** Design schemas to be adaptable for future additions or modifications to the Mahamaya Ground layers.
*   **Data Relationships:** Consider how data from different layers will be linked to a central user profile.
*   **Scalability:** Design for a growing number of users and potentially increasing data complexity per user.
*   **Encryption:** Emphasize encryption for PII and sensitive data.
*   **API Versioning:** Plan for API versioning to manage future changes without breaking existing integrations.

**Relevant Architecture Information (from FCBAP Part 1 & 2):**

*   **Bimba Coordinate Alignment:** While this is a backend component, its data serves the frontend's (#5-3-4) purpose.
*   **Distributed Architecture:** This backend system resides within the `friendly-file-backend` layer.
    *   **Target Directory:** `friendly-file-backend/subsystems/4_nara/services/` (likely a new service, e.g., `mahamaya-matrix.service.mjs`)
    *   **Data Interaction:** This service will interact with MongoDB. Post-refactor, this would be via `friendly-file-backend/databases/mongodb/`, but currently might involve direct calls or existing non-refactored MongoDB services.
*   **BPMCP Interaction:** The Mahamaya Matrix data will be accessed by other services (e.g., Nara Agent Core) via BPMCP. This implies that the API endpoints developed for the Mahamaya Matrix need to be callable/integrable by BPMCP or services that BPMCP orchestrates.
    *   BPMCP will handle MongoDB read/write access for user-specific data like this.
*   **AG-UI Protocol:** Not directly consumed by this specific backend data storage system, but the data stored here is fundamental for what the Nara Agent (interacting via AG-UI) will present to the user.

**Dependencies:**

*   **Story E1_F1_S1 (User Onboarding - Birth Details):** Requires the schema to store initial birth details.
*   **Stories E1_F3_S1 to E1_F3_S5 (Assessment Integrations):** Schemas must accommodate data from Jungian, Gene Keys, Human Design, and I Ching assessments.
*   **Story E1_F4_S1 (Archetypal Quintessence Synthesis):** Schema must store the output of the Quintessence.
*   **Backend Architectural Framework:** Decisions on the overall backend framework (e.g., Node.js with Express/Fastify, Python with Flask/Django) will influence API implementation details. (The FCBAP suggests `.mjs` files, implying a Node.js/ESM environment).

**Non-Functional Requirements (from Story & EFDD):**

*   **Reliability:** High availability and data durability.
*   **Maintainability:** Clean, well-structured, and documented code.
*   **Security:** As per acceptance criteria; adherence to `Data_Governance_Policy.md`.
*   **Data Provenance & Transparency:** Ensure clarity on data sources and transformations if applicable at this storage stage.

## 3. Design & Implementation Constraints

*   **Technology Stack (Inferred & from FCBAP):**
    *   Backend Language/Runtime: Node.js (ESM modules, `.mjs`)
    *   Database: MongoDB
    *   API Style: RESTful or GraphQL (RESTful is often simpler for CRUD, but GraphQL offers query flexibility).
*   **Existing Architecture:** Must integrate within the `friendly-file-backend/subsystems/4_nara/` structure.
*   **Data Model:** Must align with the six Mahamaya Ground layers plus the Archetypal Quintessence.
*   **Security Standards:** Implement robust encryption for PII and secure authentication/authorization for APIs.

## 4. Input Data / Resources

*   **Primary User Story:** `story_E1_F2_S1_backend_mahamaya_matrix.md`
*   **EFDD for Nara_Mode_Full_Dev_v1:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`
*   **Architecture Document (FCBAP):**
    *   `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/architecture/feature-context-bimba-alignment-package_Part1.md`
    *   `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/architecture/feature-context-bimba-alignment-package_Part2.md`
*   **(Assumed) General Coding Standards & Tech Stack Docs:** While specific files weren't found, assume general best practices for Node.js, MongoDB, and API design apply.

## 5. Expected Output / Deliverables

1.  **MongoDB Schema Definition:** Document detailing the structure, fields, data types, and relationships for each collection related to the Mahamaya Matrix.
2.  **API Endpoint Definitions:** OpenAPI/Swagger specification for all CRUD endpoints.
3.  **Source Code:** Implemented backend service(s) in Node.js (`.mjs`) within `friendly-file-backend/subsystems/4_nara/services/`.
4.  **Unit and Integration Tests:** Test suite covering critical data management logic and API functionality.
5.  **README/Documentation:** Updated or new documentation within the service's directory explaining its purpose, setup, API usage, and data models.

## 6. Prompt for AI Builder

```plaintext
As an expert backend developer, your task is to design and implement the backend system for the Mahamaya Matrix within the Epi-Logos Nara_Mode_Full_Dev_v1 project. This system will use MongoDB to store and manage user context data derived from six Mahamaya Ground layers (Birthdate Encoding, Astrological Chart, Jungian Archetype Assessment, Gene Keys Profile, Human Design Profile, I Ching Hexagrams) and a synthesized Archetypal Quintessence.

**Project Context:**
- Development Name: Nara_Mode_Full_Dev_v1
- Subsystem: 4_Nara
- Target Backend Directory: `friendly-file-backend/subsystems/4_nara/services/`
- Database: MongoDB
- Language/Runtime: Node.js (ESM, .mjs files)

**Key Requirements & Inputs:**

1.  **Review Attached Documents:** Thoroughly review the provided information: Story details (E1_F2_S1), EFDD, and Architecture (FCBAP Parts 1 & 2) to understand the full scope, technical constraints, and integration points (especially with BPMCP).
2.  **MongoDB Schema Design:**
    *   Design flexible and scalable MongoDB schemas for a central User Profile and individual collections/documents for each of the six Mahamaya Ground layers and the Archetypal Quintessence. Detail fields, data types, and relationships.
    *   Ensure the schema can store diverse data (text, numbers, dates, nested objects, arrays).
    *   Implement appropriate indexing for query performance.
3.  **API Development (RESTful or GraphQL - prioritize RESTful if simpler for CRUD):**
    *   Develop secure CRUD API endpoints for managing user data in the Mahamaya Matrix.
    *   Endpoints should cover: creating/updating user profiles with associated Mahamaya data, retrieving complete or partial Mahamaya Matrix data for a user.
    *   Consider data validation and error handling.
4.  **Security:**
    *   Implement field-level encryption in MongoDB for all PII and sensitive archetypal data.
    *   Ensure API endpoints are secured (e.g., using JWT-based authentication/authorization, to be provided by the broader system context).
5.  **Implementation:**
    *   Write clean, modular, and well-documented Node.js (ESM) code for the service(s).
    *   Place the code in `friendly-file-backend/subsystems/4_nara/services/` (e.g., `mahamaya-matrix.service.mjs`).
6.  **Testing:**
    *   Outline a strategy for unit and integration tests. Provide examples of key test cases.
7.  **Documentation:**
    *   Generate an OpenAPI/Swagger specification for the API.
    *   Provide a clear README.md for the service, explaining its schema, API, and setup.

**Deliverables:**

1.  Detailed MongoDB Schema Definitions (document format).
2.  API Endpoint Specifications (OpenAPI/Swagger JSON or YAML).
3.  Node.js source code for the Mahamaya Matrix service(s) (`.mjs`).
4.  Example unit/integration test cases.
5.  README.md for the service.

**Clarifications to Consider & State Assumptions:**

*   Assume an existing mechanism for user authentication and JWT generation/validation is available system-wide and can be leveraged by your API endpoints.
*   Specify how data from different layers will be linked (e.g., `userId` foreign key).
*   Detail the structure for storing astrological data (natal, progressed, transits).
*   For 'Delete' operations, clarify if it's a soft delete (marking as inactive) or hard delete.
*   Assume standard error handling and logging practices are expected.

Focus on creating a robust, secure, and scalable backend foundation for the Mahamaya Matrix, ensuring it aligns with the provided architectural guidelines and can be effectively integrated into the broader Epi-Logos system via BPMCP.

**IMPORTANT ADDITIONAL CONSIDERATION: User Authentication System**

While the primary focus is the Mahamaya Matrix, the foundational nature of Epic 1 implies that a robust user authentication system should be considered and potentially developed or enhanced alongside this work. The current system has basic user profiles but may lack a comprehensive authentication mechanism (e.g., secure password hashing, session management, token-based authentication like OAuth2/OIDC, social logins, MFA options).

**Guidance for AI Builder regarding Authentication:**
*   **Assess Current State:** Briefly consider what a minimal existing user profile system might entail and identify gaps for a proper authentication system.
*   **Propose Enhancements:** As part of the Mahamaya Matrix backend development, or as a closely related foundational piece, outline or stub out the key components of a secure user authentication system. This might include:
    *   User registration with secure password handling (e.g., hashing with bcrypt or Argon2).
    *   Login endpoint that issues secure tokens (e.g., JWTs).
    *   Token validation middleware/logic.
    *   Secure session management (if applicable).
    *   Endpoints for password reset/recovery.
*   **Integration with Mahamaya Matrix:** Ensure that the User Profile schema within the Mahamaya Matrix can seamlessly integrate with or be an extension of the user entity managed by the authentication system (e.g., `userId` from the auth system is the primary key for Mahamaya Matrix profiles).
*   **Security Best Practices:** Emphasize industry best practices for authentication (OWASP guidelines).
*   **Scalability & Flexibility:** Design the authentication components to be scalable and flexible for future needs (e.g., adding social logins, MFA).

This consideration is crucial for the overall security and integrity of the Nara application as it handles sensitive user data. While not the sole focus of *this specific story*, its foundational importance means it should be addressed as part of the broader Epic 1 development effort.
```

## 7. Additional Considerations for AI Builder

*   **User Authentication System:** As detailed in the prompt, the AI builder should consider the implementation or enhancement of a robust user authentication system as a foundational element alongside the Mahamaya Matrix. This is critical for the overall security and integrity of user data within Nara.

## 8. Open Questions & Assumptions from Original Story

*   **Backend Framework:** Assumed Node.js/Express or similar, consistent with `.mjs` usage. The prompt reinforces Node.js (ESM).
*   **PII Encryption Details:** The prompt requests implementation of field-level encryption. Specific library/method can be proposed by the AI builder.
*   **Update Granularity:** The API design should allow for updating individual layers or the entire matrix. The prompt asks for CRUD, implying this flexibility.

This package provides the necessary context for an AI builder to develop the Mahamaya Matrix backend system.