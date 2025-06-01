# AI Builder Prompt Package: E4_F4_S3 - `ag-ui` Protocol Integration

## 1. Overview

**Story ID:** E4_F4_S3
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F4 - External Service & Data Integration
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Ensure seamless and robust `ag-ui` (Agent-UI) protocol integration for bidirectional communication between the frontend (User Interface) and the backend (Nara agent system). This will allow UI context to effectively inform Nara's processing, and Nara's responses to be accurately and dynamically rendered in the UI, supporting the user's individuation and journey towards Svatantrya.

## 2. Story Definition

**As a** Developer creating the Nara application, aiming to foster a reflective dialogue between the user's conscious experience (Pramata interacting with the UI) and the deeper symbolic intelligence of Nara (reflecting the Self and Saivist principles),
**I want** to ensure seamless and robust `ag-ui` (Agent-UI) protocol integration for communication between the frontend (User Interface – the field of conscious interaction) and the backend (Nara agent system – the wellspring of archetypal insight and Spanda-informed wisdom),
**So that** UI context (the user's current focus, questions, and expressions – their active engagement in the Lila) can effectively inform backend processing by Nara, and Nara's responses and synthesized information (emergent insights, symbolic reflections, echoes of Pratibha) can be accurately and dynamically rendered in the UI, supporting the user's individuation process and their journey towards recognizing their inherent Svatantrya.

## 3. Technical Context & Design Philosophy

*   **Focus:** Bidirectional communication integration between frontend (UI) and backend (Nara agent) using the `ag-ui` protocol.
*   **`ag-ui` Protocol Role:** Primary channel for user's conscious dialogue with Nara's deeper wisdom.
*   **Communication Flow:**
    *   **FE to BE:** User actions, UI state, contextual data (user's active engagement in Lila).
    *   **BE to FE:** Synthesized responses, data updates, UI directives, status updates (Nara's wisdom reflecting to consciousness).
*   **Real-time Channel:** Typically WebSockets.
*   **Philosophical Grounding:** Fostering reflective dialogue, bridging conscious experience (Pramata) with symbolic intelligence (Self, Spanda, Pratibha), supporting individuation and Svatantrya.

## 4. Constraints and Challenges

*   **Protocol Strictness:** Ensuring both frontend and backend strictly adhere to the `ag-ui` protocol specification and message schemas.
*   **Real-time Reliability:** Maintaining a stable and responsive communication channel (e.g., handling WebSocket disconnections/reconnections).
*   **Schema Versioning & Validation:** Managing changes to message schemas over time and ensuring validation on both ends.
*   **Context Management:** Accurately capturing and transmitting relevant UI context to the backend.
*   **Dynamic UI Updates:** Efficiently updating the UI based on backend messages without full page reloads.
*   **Security:** Securing the communication channel (e.g., WSS) and authenticating messages.
*   **Performance:** Minimizing latency for a responsive user experience.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **`ag-ui` Protocol Specification:** Detailed documentation of the protocol, including:
    *   Message types for FE to BE (e.g., `USER_ACTION`, `UI_STATE_UPDATE`, `CONTEXT_DATA`).
    *   Message types for BE to FE (e.g., `SYNTHESIZED_RESPONSE`, `DATA_UPDATE`, `UI_DIRECTIVE`, `STATUS_UPDATE`).
    *   Versioned JSON schemas for all messages.
    *   Handshake and connection management procedures.
3.  **Nara Agent Core Architecture (E4_F1):** How Nara is structured to receive, process, and send `ag-ui` messages.
4.  **Frontend Application Architecture:** How the UI framework will manage WebSocket connections, send/receive messages, and update the DOM.
5.  **Example Interaction Scenarios:**
    *   *Scenario 1 (User Input):* User types a question into a chat interface. Frontend sends an `ag-ui` message with the question text. Nara processes it and sends back a response message, which the UI displays.
    *   *Scenario 2 (Oracle Interaction):* User clicks on an Oracle card. Frontend sends card ID. Nara generates interpretation and sends it back for display.
    *   *Scenario 3 (Dynamic Insight):* Nara proactively identifies a relevant insight based on background processing and sends an `ag-ui` message to the frontend to display a notification or update a specific UI panel.

## 6. Expected Outputs from AI Builder (Integration Design & Implementation Plan for both Frontend and Backend)

1.  **`ag-ui` Protocol Implementation Guide (for both FE & BE):**
    *   Detailed instructions and code examples for establishing and managing the WebSocket connection.
    *   How to serialize/deserialize messages according to the defined schemas.
    *   Best practices for message validation on both ends.
2.  **Frontend `ag-ui` Integration Module Design:**
    *   Code structure for the frontend module responsible for `ag-ui` communication.
    *   Logic for sending user actions and UI context to Nara.
    *   Logic for receiving messages from Nara and dispatching them to appropriate UI components for dynamic updates.
    *   State management for the communication channel.
3.  **Backend (Nara) `ag-ui` Integration Module Design:**
    *   Code structure for Nara's module responsible for handling `ag-ui` communication (e.g., WebSocket server endpoint).
    *   Logic for receiving messages from the frontend, parsing them, and routing them to relevant Nara services/modules.
    *   Logic for constructing and sending response messages back to the frontend.
4.  **Contextual Information Flow Design:**
    *   Specific mechanisms for capturing and transmitting relevant UI context (e.g., active elements, user selections, form data) to Nara.
    *   How Nara will utilize this context in its processing logic.
5.  **Dynamic UI Update Strategy:**
    *   Patterns and best practices for the frontend to efficiently update UI elements based on messages from Nara (e.g., using a reactive framework, targeted DOM manipulation).
6.  **Error Handling and Resilience Plan (Bidirectional):**
    *   Comprehensive list of potential communication errors (e.g., connection lost, message validation failure, processing errors).
    *   Strategies for handling these errors on both frontend and backend, including logging, user notification, and reconnection attempts.
7.  **Security Implementation Details:**
    *   Configuration for secure WebSockets (WSS).
    *   If applicable, mechanisms for message authentication/authorization.
8.  **Performance Optimization Recommendations:**
    *   Tips for minimizing message size, reducing latency, and ensuring efficient message processing on both ends.
9.  **Joint Testing Plan (FE & BE):** Test cases to verify end-to-end communication, context transfer, dynamic updates, error handling, and security.

## 7. Prompt for Generative AI

```
As a Full-Stack AI Application Architect with expertise in real-time communication protocols (especially WebSockets), frontend frameworks, backend agent systems, and the philosophical underpinnings of user-AI dialogue (Jungian active imagination, Saivist reflective practice), you are tasked with designing the comprehensive integration of the `ag-ui` protocol. This protocol facilitates communication between the Nara application's frontend and the Nara agent backend, as detailed in User Story E4_F4_S3.

The objective is to create a seamless, robust, and responsive dialogue channel where UI context (user's conscious engagement/Lila) informs Nara's processing, and Nara's synthesized wisdom (reflecting Self/Pratibha) dynamically updates the UI, supporting the user's individuation and journey to Svatantrya.

Based on the provided story, a defined `ag-ui` protocol specification (assume access to message schemas and interaction patterns), conceptual frontend/backend architectures, and example interaction scenarios, deliver a detailed integration design and implementation plan covering both frontend and backend aspects:

1.  **`ag-ui` Protocol Implementation Guide (FE & BE):** Provide instructions and code examples for WebSocket connection management, message serialization/deserialization per schemas, and validation.
2.  **Frontend `ag-ui` Integration Module Design:** Detail the frontend module for sending user actions/context and receiving/dispatching Nara's messages for dynamic UI updates. Include state management for the channel.
3.  **Backend (Nara) `ag-ui` Integration Module Design:** Detail Nara's module for handling WebSocket connections, parsing frontend messages, routing them for processing, and sending responses.
4.  **Contextual Information Flow Design:** Specify how UI context is captured and transmitted to Nara, and how Nara uses it.
5.  **Dynamic UI Update Strategy:** Recommend patterns for the frontend to efficiently update based on Nara's messages.
6.  **Error Handling and Resilience Plan (Bidirectional):** Outline comprehensive error handling for communication failures, including logging, user notification, and reconnections.
7.  **Security Implementation Details:** Specify WSS configuration and any message authentication/authorization.
8.  **Performance Optimization Recommendations:** Provide tips for minimizing latency and ensuring responsiveness.
9.  **Joint Testing Plan (FE & BE):** Define test cases for end-to-end validation.

Your design must ensure a deeply interactive and intelligent user experience, where the `ag-ui` protocol serves as a true conduit for reflective dialogue between the user and the Nara system.
```