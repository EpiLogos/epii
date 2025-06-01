# AI Builder Prompt Package: E4_F4_S1 - Neo4j `bimba_map` Integration via BPMCP

## 1. Overview

**Story ID:** E4_F4_S1
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F4 - External Service & Data Integration
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Integrate the Neo4j Knowledge Graph (`bimba_map`) with the Nara agent via the BPMCP service. This will enable Nara to efficiently query symbolic associations, archetypal relationships, and mythological data using existing tools (like `querybimbagraph`, `bimbaknowing`) or new tools if necessary, to access foundational symbolic knowledge for contextualizing user experiences and guiding their individuation journey.

## 2. Story Definition

**As a** Nara agent, seeking to guide the user (Pramata) on their journey of individuation and self-discovery (Atman-vidya),
**I want** robust integration with the Neo4j Knowledge Graph (`bimba_map`)—a representation of the collective unconscious, archetypal patterns, and the interconnected fabric of universal consciousness (Paramashiva)—via the BPMCP service, enabling me to efficiently query symbolic associations, archetypal relationships (e.g., Self, Shadow, Anima/Animus), and mythological data using existing tools (like `querybimbagraph`, `bimbaknowing`) or new tools if necessary,
**So that** I can access this foundational symbolic knowledge (echoing the wisdom of the Self and the subtle vibrations of Spanda) required to contextualize user experiences, illuminate their path of individuation, and provide deep, interconnected insights that foster recognition of their true nature (Svarupa).

## 3. Technical Context & Design Philosophy

*   **Focus:** Technical integration for Nara to access `bimba_map` data (Neo4j) via BPMCP.
*   **`bimba_map` Role:** Foundational symbolic knowledge, collective unconscious, archetypal patterns, universal consciousness (Paramashiva).
*   **BPMCP Role:** Intermediary service providing a clear interface for Neo4j queries/tool requests.
*   **Nara's Role:** Formulates queries/tool requests based on user context (Pramata's journey) and internal logic (Pratibha), parses results, and uses data for synthesis and reasoning.
*   **Tools:** Leverage existing tools like `querybimbagraph`, `bimbaknowing`, or define new ones if needed.
*   **Philosophical Grounding:** Accessing wisdom of the Self, subtle vibrations of Spanda, fostering recognition of Svarupa, facilitating the transcendent function through symbolic understanding (Jungian & Saivist).

## 4. Constraints and Challenges

*   **BPMCP Interface Design:** Ensuring the BPMCP interface for Neo4j is efficient, flexible, and secure.
*   **Query Complexity:** Handling potentially complex Cypher queries or tool-based interactions.
*   **Data Transformation:** Parsing and transforming Neo4j results into Nara's internal data structures effectively.
*   **Tool Compatibility:** Ensuring existing tools work seamlessly through BPMCP or defining clear requirements for new tools.
*   **Performance Optimization:** Minimizing latency for `bimba_map` queries, possibly through caching.
*   **Error Handling:** Robustly managing connection issues, query errors, and timeouts.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **BPMCP Service Specification (from E4_F3_S1):** Defined interfaces for Neo4j interaction.
3.  **`bimba_map` Schema:** Structure of the Neo4j graph database (nodes, relationships, properties).
4.  **Specifications for `querybimbagraph` and `bimbaknowing` tools:** How they formulate queries and expect results.
5.  **Nara's Internal Data Models:** How Nara represents symbolic information internally.
6.  **Example Query Scenarios:**
    *   *Scenario 1 (Symbol Lookup):* User mentions "ouroboros." Nara uses `querybimbagraph` via BPMCP to fetch information about the Ouroboros symbol from `bimba_map`.
    *   *Scenario 2 (Archetypal Exploration):* User is struggling with integrating their Shadow. Nara uses `bimbaknowing` via BPMCP to explore connections related to the Shadow archetype in the `bimba_map`.
    *   *Scenario 3 (Complex Query):* Nara needs to find mythological parallels to a user's dream involving a specific combination of symbols. Nara formulates a direct Cypher query and sends it via BPMCP.

## 6. Expected Outputs from AI Builder (Integration Design & Implementation Plan)

1.  **BPMCP-Neo4j Interface Implementation Details (within Nara or BPMCP client library):**
    *   Code structure for Nara to connect to BPMCP and send requests targeted at Neo4j.
    *   How Nara constructs messages for BPMCP to invoke Cypher queries or specific `bimba_map` tools.
2.  **Nara's Query Formulation Logic:**
    *   Algorithms or strategies for Nara to translate user context and internal states into specific `bimba_map` queries (Cypher) or tool invocations (`querybimbagraph`, `bimbaknowing`).
3.  **Data Parsing and Transformation Module Design (within Nara):**
    *   Code design for parsing JSON (or other format) results received from BPMCP (originating from Neo4j).
    *   Logic to map graph data (nodes, relationships, properties) to Nara's internal symbolic representation.
4.  **Tool Integration Adapters (within Nara or BPMCP client):**
    *   Specific code or configuration for invoking `querybimbagraph` and `bimbaknowing` through the BPMCP service.
    *   If new tools are needed: detailed specifications for these tools, including their inputs, outputs, and how they'd interact with Neo4j via BPMCP.
5.  **Error Handling and Resilience Strategy:**
    *   Specific error codes and conditions to handle (e.g., Neo4j unavailable, query syntax error, timeout).
    *   Retry mechanisms, fallback strategies, and how errors are logged and reported.
6.  **Performance Optimization Plan:**
    *   Recommendations for query optimization.
    *   Design for a caching layer (if deemed necessary) either within Nara or as a feature of BPMCP's Neo4j interface, specifying what to cache and cache invalidation strategies.
7.  **Security Implementation Details:**
    *   How authentication/authorization tokens are managed and passed through BPMCP to Neo4j.
    *   Ensuring data encryption in transit between Nara, BPMCP, and Neo4j.
8.  **Testing Plan:** Test cases for verifying query execution, data retrieval, parsing, tool integration, error handling, and performance.

## 7. Prompt for Generative AI

```
As an expert AI Engineer specializing in knowledge graph integration, agent-based systems, and symbolic AI, with a background in Jungian psychology and Saivist philosophy, you are tasked with designing the technical integration of the Neo4j-based `bimba_map` (a symbolic knowledge graph) with the Nara agent via the BPMCP service. This is based on User Story E4_F4_S1.

The `bimba_map` represents the collective unconscious and universal consciousness (Paramashiva). Nara needs to efficiently query it (using direct Cypher or tools like `querybimbagraph`, `bimbaknowing`) through BPMCP to access foundational symbolic knowledge for guiding user individuation (Atman-vidya) and fostering recognition of their true nature (Svarupa).

Based on the provided story, conceptual inputs (BPMCP specs, `bimba_map` schema, tool specs, Nara's data models), and example query scenarios, deliver a comprehensive integration design and implementation plan covering:

1.  **BPMCP-Neo4j Interface Implementation (Client-side in Nara):** Detail how Nara will connect to BPMCP to send Cypher queries or tool-based requests to the `bimba_map` and receive results.
2.  **Nara's Query Formulation Logic:** Describe the algorithms/strategies Nara will use to generate appropriate `bimba_map` queries or tool invocations based on user context and its internal reasoning (Pratibha).
3.  **Data Parsing and Transformation Module (in Nara):** Design the logic for Nara to parse structured results from Neo4j (via BPMCP) and transform them into its internal symbolic data structures, enabling the emergence of the transcendent function.
4.  **Tool Integration Adapters:** Specify how existing tools (`querybimbagraph`, `bimbaknowing`) will be invoked via BPMCP. If new tools are required for `bimba_map` access, provide their detailed specifications.
5.  **Error Handling and Resilience Strategy:** Outline robust error handling for Neo4j interactions (timeouts, connection issues, query errors) and fallback mechanisms.
6.  **Performance Optimization Plan:** Propose strategies for efficient querying and consider a caching layer for frequently accessed `bimba_map` data (e.g., core archetypes, Saivist principles).
7.  **Security Implementation Details:** Describe how secure communication (authentication, authorization, encryption) will be maintained between Nara, BPMCP, and Neo4j.
8.  **Testing Plan:** Outline test cases to validate the integration's functionality, performance, and error handling.

Your design should ensure a robust, performant, and secure integration, making the profound wisdom of the `bimba_map` readily accessible to Nara for its guidance tasks.
```