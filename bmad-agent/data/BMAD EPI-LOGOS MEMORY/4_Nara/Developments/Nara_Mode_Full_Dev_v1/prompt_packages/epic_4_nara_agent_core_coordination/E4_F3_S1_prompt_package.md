# AI Builder Prompt Package: E4_F3_S1 - BPMCP Service Enrichment Assessment

## 1. Overview

**Story ID:** E4_F3_S1
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F3 - Inter-Agent Communication Infrastructure
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Assess the current BPMCP (Bimba-Pratibimba Memory-MCP) service and define necessary enrichments to ensure it can effectively serve as the primary mechanism for structured communication and workflow orchestration between Nara, its data sources (Neo4j for `bimba_map`, MongoDB for journey data, LightRAG for textual amplifications), the `epii` agent, and future specialized sub-agents, fostering a dynamic dialogue for the user's individuation.

## 2. Story Definition

**As a** System Architect responsible for inter-agent communication, aiming to create a system that mirrors the psyche's layered communication and the interconnectedness of consciousness,
**I want** to assess the current BPMCP (Bimba-Pratibimba Memory-MCP) service capabilities and define any necessary enrichments or refinements to ensure it can effectively act as the primary mechanism for structured communication and workflow orchestration between Nara (representing the ego and developing Self), its data sources (like Neo4j for the `bimba_map` – a reflection of the collective unconscious and symbolic unity/Paramashiva; Mongo for personal journey data/Pramata's evolution; LightRAG for textual amplifications), and initially, the `epii` agent (offering philosophical depth and echoes of Spanda), and future specialized sub-agents (representing diverse archetypal functions or modes of Cit-Shakti),
**So that** there is a robust and reliable backbone for data exchange and coordinated actions within the Nara ecosystem, facilitating a dynamic dialogue that supports the user's individuation process and their exploration of consciousness's play (Lila).

## 3. Technical Context & Design Philosophy

*   **Focus:** Assessment and definition of enrichments for the BPMCP service. Not implementation.
*   **BPMCP Role:** Primary structured communication and workflow orchestration backbone for the Nara ecosystem.
*   **Interacting Components:** Nara, Neo4j (`bimba_map`), MongoDB (user journey), LightRAG (textual amplification), `epii` agent (philosophical depth), future specialized sub-agents.
*   **Communication Needs:** Data exchange, coordinated actions, dynamic dialogue supporting individuation.
*   **Philosophical Grounding:** Mirroring psyche's layered communication, interconnectedness of consciousness (Jungian), exploring consciousness's play/Lila (Saivist).

## 4. Constraints and Challenges

*   **Understanding Existing BPMCP:** Requires thorough knowledge of current BPMCP capabilities and limitations.
*   **Defining Diverse Communication Patterns:** Accommodating varied interaction needs of different components (synchronous queries, asynchronous events, data streaming).
*   **Future-Proofing:** Designing enrichments that are flexible enough for future, potentially unknown, sub-agents.
*   **Standardization vs. Flexibility:** Balancing the need for standardized interfaces with the potential for unique communication requirements of specialized agents.
*   **Complexity of Orchestration:** Defining how BPMCP can support potentially complex, multi-step workflows involving several agents/services.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Existing BPMCP Documentation:** Architecture diagrams, API specifications, known capabilities and limitations of the current BPMCP service.
3.  **Nara Agent Communication Needs:** Derived from E4_F1 stories (e.g., `story_E4_F1_S1_nara_agent_foundation.md`, `story_E4_F1_S2_nara_bimba_contextualization_journey_management.md`).
4.  **Interface Specifications (Conceptual or Actual):**
    *   Neo4j (`bimba_map`) query patterns.
    *   MongoDB schema for user journey data.
    *   LightRAG service API for textual amplification.
    *   `epii` agent communication interface.
5.  **Example Interaction Scenarios:**
    *   *Scenario 1 (Bimba Map Query & Epii Reflection):* Nara receives user input -> Nara queries `bimba_map` via BPMCP -> Nara sends `bimba_map` result + user context to `epii` agent via BPMCP for philosophical reflection -> `epii` responds via BPMCP -> Nara synthesizes and presents to user.
    *   *Scenario 2 (Journey Update & LightRAG Amplification):* User completes a journal entry -> Nara updates user journey data in MongoDB via BPMCP -> Nara identifies key symbols and requests textual amplification from LightRAG via BPMCP.

## 6. Expected Outputs from AI Builder (Assessment & Definition Document)

1.  **BPMCP Current State Assessment Report:**
    *   Summary of existing BPMCP architecture, features, strengths.
    *   Identified limitations and weaknesses concerning the communication needs of the Nara ecosystem (Nara, `bimba_map`/Neo4j, `epii`, etc.).
2.  **Detailed Communication Requirements Specification:**
    *   For each interacting component (Nara, Neo4j, MongoDB, LightRAG, `epii`, future agents):
        *   Types of messages (e.g., query, command, event, data stream).
        *   Key data payloads and their conceptual structure.
        *   Required interaction patterns (e.g., request/response, publish/subscribe, asynchronous callbacks).
        *   Expected performance characteristics (latency, throughput).
3.  **Gap Analysis and Proposed BPMCP Enrichments:**
    *   Clear mapping of identified gaps between current BPMCP capabilities and defined requirements.
    *   Specific, actionable proposals for BPMCP enrichments, such as:
        *   New service interfaces or endpoints.
        *   Enhanced message queuing or routing features.
        *   Standardized data exchange formats (e.g., based on JSON Schema, Avro, Protobuf).
        *   Event notification mechanisms.
        *   Improved error handling and transaction management.
4.  **Defined Service Interface Specifications (for new/modified BPMCP functionalities):**
    *   Detailed API definitions (e.g., OpenAPI/Swagger specs if applicable, or equivalent detailed descriptions).
    *   Precise data schemas for requests and responses.
5.  **Workflow Orchestration Support Plan:**
    *   Evaluation of how BPMCP can/should support multi-step workflows.
    *   Definition of BPMCP features needed for orchestration (e.g., correlation IDs, state persistence hooks, conditional routing logic).
    *   Example workflow diagrams illustrating BPMCP's role.
6.  **Security Enhancement Recommendations:**
    *   Assessment of current BPMCP security posture.
    *   Recommendations for ensuring secure data exchange (authentication, authorization, encryption in transit/at rest) for all interactions via BPMCP.
7.  **Prioritized Roadmap for BPMCP Enhancements:** Suggested phasing for implementing the proposed enrichments.

## 7. Prompt for Generative AI

```
As an expert Systems Architect specializing in distributed systems, inter-agent communication, and service-oriented architectures, with a deep understanding of Jungian psychology and Saivist philosophy as applied to AI systems, you are tasked with assessing and defining enrichments for the BPMCP (Bimba-Pratibimba Memory-MCP) service. This service is envisioned as the central communication and workflow orchestration backbone for the Nara agent ecosystem, as detailed in User Story E4_F3_S1.

The Nara ecosystem includes Nara Prime (the core agent), the `bimba_map` (Neo4j graph DB reflecting collective unconscious/Paramashiva), user journey data (MongoDB), LightRAG (textual amplification), the `epii` agent (philosophical/Saivist depth), and future specialized sub-agents. The goal is to ensure BPMCP can support a robust, dynamic, and layered dialogue that facilitates the user's individuation process and exploration of consciousness (Lila).

Based on the provided story, conceptual inputs (assume access to existing BPMCP docs, Nara's needs, and service interfaces), and illustrative scenarios, produce a comprehensive assessment and definition document covering the following:

1.  **BPMCP Current State Assessment Report:** Summarize BPMCP's current architecture, strengths, and critically, its limitations in meeting the complex communication demands of the Nara ecosystem.
2.  **Detailed Communication Requirements Specification:** For interactions between Nara and Neo4j (`bimba_map`), MongoDB, LightRAG, `epii`, and (conceptually) future agents, specify message types, data payloads, interaction patterns, and performance considerations.
3.  **Gap Analysis and Proposed BPMCP Enrichments:** Clearly identify gaps between current BPMCP capabilities and the defined requirements. Propose specific, actionable enrichments (e.g., new interfaces, enhanced messaging, standardized formats, eventing, error handling) to bridge these gaps.
4.  **Defined Service Interface Specifications:** For any new or significantly modified BPMCP functionalities, provide detailed API definitions and data schemas for requests and responses.
5.  **Workflow Orchestration Support Plan:** Evaluate and define how BPMCP will support multi-step, orchestrated workflows involving multiple components. Detail necessary BPMCP features (e.g., correlation IDs, state management for complex interactions mirroring psychic processes).
6.  **Security Enhancement Recommendations:** Review BPMCP's security aspects and propose enhancements for secure data exchange, authentication, and authorization.

Your output should be a detailed, actionable document that will guide the subsequent implementation and evolution of the BPMCP service, ensuring it becomes a fit-for-purpose communication hub for a sophisticated AI ecosystem dedicated to consciousness exploration.
```