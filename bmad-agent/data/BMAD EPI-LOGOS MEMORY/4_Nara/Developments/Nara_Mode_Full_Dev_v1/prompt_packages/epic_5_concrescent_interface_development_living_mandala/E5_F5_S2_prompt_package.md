# AI Builder Prompt Package: E5_F5_S2 - `ag-ui` Protocol Integration for Living Mandala

**Project:** Nara Concrescent Interface Development
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F5 - Frontend Technology & `ag-ui` Protocol
**Story ID:** E5_F5_S2 - Ensure Tight `ag-ui` Protocol Integration for Fluent Prehension and Responsive Concrescence

## 1. Context Overview

This prompt package is for designing and planning the frontend implementation of the `ag-ui` (Agent-UI) protocol. This integration is crucial for enabling the Nara "Living Mandala" UI to communicate effectively with the Nara backend/agent. It allows the frontend to receive real-time updates, send user interactions, and maintain a responsive, contextually aware experience, thereby facilitating a fluent "prehension" of system states and supporting the user's "responsive concrescence" with the application.

## 2. Story Definition (from E5_F5_S2)

**As a** Frontend System (a nexus of actual occasions mediating user experience),
**I want** to tightly and efficiently integrate with the Nara backend (a society of actual occasions) via the `ag-ui` protocol (the channel for mutual prehension),
**So that** the Living Mandala UI can receive real-time updates (fresh data for prehension), send user interactions (expressions of subjective aim) promptly, and maintain a responsive, contextually aware experience (a coherent concrescence) for the user.

## 3. Technical & Philosophical Context

*   **Channel for Mutual Prehension:** The `ag-ui` protocol serves as the vital communication link enabling the frontend (user's immediate experience) and backend (Nara's deeper processing) to mutually "prehend" or grasp data and states from each other.
*   **Real-time Responsiveness:** Essential for the "living" quality of the mandala, allowing UI elements to dynamically update based on backend events (e.g., phase changes, new insights, Oracle results).
*   **Supporting Concrescence:** The fluent exchange of information supports the user's ongoing process of becoming (concrescence) in interaction with Nara, providing timely data for their subjective aim.
*   **Contextual Awareness:** Enables the UI to display information and prompts that are relevant to the user's current state and interaction history, as understood by the backend agent.
*   **Frontend Counterpart to Backend Integration:** This story focuses on the client-side implementation of the protocol defined and implemented on the backend in Epic 4 (E4_F4_S3).

## 4. Constraints & Design Challenges

*   **Strict Protocol Adherence:** Ensuring the frontend implementation precisely matches the `ag-ui` message schemas, data formats, and communication patterns (likely WebSocket-based).
*   **Efficient Real-time Data Handling:** Processing incoming messages and updating the UI without performance degradation.
*   **State Synchronization:** Managing UI state in sync with relevant backend states, especially across potential disconnections.
*   **Robust Error Handling:** Gracefully managing communication failures, message validation issues, and backend errors.
*   **Security:** Implementing necessary security measures if sensitive data is exchanged.
*   **Testability:** Designing the integration points for effective unit and integration testing.
*   **Optimizing Message Payloads:** Ensuring messages are concise to minimize latency.

## 5. Inputs for AI Builder

1.  **User Story Document:** `story_E5_F5_S2_ag_ui_protocol_integration_living_mandala.md`.
2.  **`ag-ui` Protocol Specification (from E4_F4_S3):** The complete and finalized technical specification of the `ag-ui` protocol, including:
    *   Communication channel details (e.g., WebSocket endpoint, connection handshake).
    *   All defined message types (for both client-to-server and server-to-client).
    *   Detailed schemas for each message type (e.g., JSON schema).
    *   Sequence diagrams for key interaction flows.
    *   Authentication/authorization mechanisms, if any.
    *   Error message formats.
3.  **Selected Frontend Technology Stack (from E5_F5_S1):** Information on the chosen frontend framework (e.g., React, Vue, Svelte) and any relevant libraries for state management or WebSocket communication.
4.  **List of UI Features Requiring `ag-ui` Communication:** A breakdown of specific UI elements and functionalities from Epic 5 stories that will send or receive data via `ag-ui` (e.g., concrescence phase indicators, mandala progressions, Oracle interactions, Journal entries, voice command processing).

## 6. Expected Outputs from AI Builder

1.  **Frontend `ag-ui` Client Architecture Design:**
    *   Overall architecture for the `ag-ui` client module within the frontend application.
    *   How it integrates with the chosen framework (e.g., as a service, hook, or store module).
    *   Patterns for establishing and managing the WebSocket connection.
2.  **Message Handling Logic:**
    *   Detailed strategy for parsing incoming `ag-ui` messages.
    *   Mapping specific message types to UI updates or state changes (e.g., how a `PhaseUpdate` message triggers changes in phase indicators).
    *   Logic for constructing and sending outgoing `ag-ui` messages based on user interactions.
3.  **State Synchronization Strategy:**
    *   Approach for keeping frontend UI state consistent with backend state as communicated via `ag-ui`.
    *   Handling initial state hydration and subsequent updates.
    *   Re-synchronization logic after connection interruptions.
4.  **Error Handling and Resilience Plan:**
    *   Specific error handling routines for connection failures, invalid messages, backend errors, and timeouts.
    *   User feedback mechanisms for different error states.
    *   Retry strategies, if applicable.
5.  **Security Implementation Guidelines (Frontend):**
    *   How the frontend will handle any specified authentication/authorization tokens or procedures required by `ag-ui`.
    *   Ensuring secure WebSocket connection (WSS).
6.  **Testing Strategy for `ag-ui` Integration:**
    *   Approach for unit testing message construction and parsing logic.
    *   Strategy for integration testing, possibly involving mock WebSocket servers or simulated backend responses.
7.  **Code Structure and Module Definitions:**
    *   Recommendations for organizing the `ag-ui` client code within the frontend project (e.g., specific files, folders, classes, functions).
8.  **Sequence Diagrams for Key Frontend-Backend Interactions via `ag-ui`:**
    *   Illustrative diagrams showing the flow of messages for 2-3 critical UI features (e.g., initiating an Oracle reading and receiving results, updating a concrescence phase indicator, submitting a voice command).

## 7. Prompt for Generative AI

```
As a senior frontend engineer specializing in real-time web applications and protocol integration, you are tasked with designing the frontend implementation for the `ag-ui` protocol within the Nara "Living Mandala" UI, as per User Story E5_F5_S2.

**Objective:** Define a robust and efficient architecture for the frontend `ag-ui` client. This client must reliably send user interactions to the Nara backend and process real-time updates from the backend to dynamically drive the Living Mandala UI, ensuring a responsive and contextually aware user experience.

**Given Inputs (assume access to):**
1.  The full User Story E5_F5_S2.
2.  The complete `ag-ui` protocol specification (detailing WebSocket communication, message types, schemas, and interaction patterns from Epic 4).
3.  The selected frontend technology stack (e.g., React with Zustand and a WebSocket library like `socket.io-client` or native WebSockets).
4.  A list of specific UI features from Epic 5 that depend on `ag-ui` communication (e.g., phase indicators, mandala updates, Oracle interactions).

**Produce the Following Outputs (as detailed in Section 6 of the Prompt Package E5_F5_S2_prompt_package.md):

1.  **Frontend `ag-ui` Client Architecture Design:** Describe the overall structure of the `ag-ui` client module within the chosen frontend framework (e.g., React). How will it manage the WebSocket connection?

2.  **Message Handling Logic:** Detail how incoming messages will be parsed and mapped to UI/state updates. How will outgoing messages be constructed from user actions?

3.  **State Synchronization Strategy:** Outline the approach for keeping frontend UI state consistent with backend state via `ag-ui`, including handling disconnections.

4.  **Error Handling and Resilience Plan:** Specify routines for connection failures, invalid messages, and backend errors, including user feedback.

5.  **Security Implementation Guidelines (Frontend):** How will the frontend handle `ag-ui` authentication/authorization and secure connections (WSS)?

6.  **Testing Strategy for `ag-ui` Integration:** Propose methods for unit and integration testing the `ag-ui` client.

7.  **Code Structure and Module Definitions:** Suggest an organization for the `ag-ui` client code (files, folders, key functions/classes).

8.  **Sequence Diagrams for Key Interactions:** Provide 2-3 sequence diagrams illustrating message flows for critical features (e.g., Oracle query, phase indicator update).

**Key Considerations for Your Design:**
*   **Protocol Fidelity:** Strict adherence to the `ag-ui` specification is paramount.
*   **Performance:** Ensure efficient message processing and UI updates to maintain responsiveness.
*   **Modularity and Reusability:** Design the client for clarity and potential reuse if other UI components need `ag-ui` access.
*   **Developer Experience:** Make the client easy to use and debug for other frontend developers working on UI features.
*   **Scalability:** The design should handle a growing number of message types and UI interactions.

Present your response in a structured format, addressing each of the 8 output points with clear, actionable technical details and patterns.
```