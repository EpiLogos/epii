# AI Builder Prompt Package: E4_F1_S1 - Nara Agent Foundation

## 1. Overview

**Story ID:** E4_F1_S1
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F1 - Nara Agent Development
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Generate the architectural design and core logic for the Nara Prime agent, establishing its foundational capabilities for user session management, state tracking (with a Jungian-Saivist lens), UI input processing via `ag-ui` protocol, and basic orchestration for `bimba_map` and `epii` agent interaction.

## 2. Story Definition

**As a** System Architect developing the Nara agent within a framework integrating Jungian psychology with subtle insights from Kashmir Saivism,
**I want** to implement the foundational Nara Prime agent with core functionalities including user session management (tracking the user's individuation journey and evolving self-awareness – Pramata), state tracking (aware of the user's engagement with archetypal content and resonance with deeper vibrational realities – Spanda), receiving and processing UI input via the ag-ui protocol, and basic orchestration capabilities for future sub-agent interaction (initially focusing on interaction with the `epii` agent for philosophical depth and `bimba_map` access for symbolic connections reflecting both archetypal patterns and the unity of consciousness – Paramashiva),
**So that** Nara can serve as the central intelligence, managing user interactions and coordinating data synthesis in a way that supports the user's self-discovery, integration of unconscious material, and recognition of their inherent creative potency (Cit-Shakti) and the Self (Atman), reflecting a coherent, Jungian-informed and subtly Saivist-aware user experience that acknowledges the cosmic play (Lila).

## 3. Technical Context & Design Philosophy

*   **Focus:** Backend agent architecture and core logic.
*   **Agent Role:** Nara Prime acts as the central orchestrator for the user experience.
*   **Key Functionalities:**
    *   **Session Management:** Securely manage user sessions (ID, context, history).
    *   **State Tracking:** Monitor user's application state (active section, view, interactions) and interpret it through a combined Jungian (archetypal engagement, alchemical stages) and Saivist (Spanda, Pratibha) lens.
    *   **`ag-ui` Protocol:** Receive and process structured messages from the UI.
    *   **Basic Orchestration:** Delegate tasks/request info from `bimba_map` (via tools like `querybimbagraph`, `bimbaknowing`) and the `epii` agent.
    *   **Initial Synthesis:** Combine info from `bimba_map` and `epii` agent, framed by a Jungian-Saivist perspective (individuation, archetypes, consciousness as Lila, Cit-Shakti).
    *   **Narrative Voice:** Establish a Socratic, reflective, Jungian-Saivist informed voice for Nara.
*   **Extensibility:** Architecture must support future integration of specialized sub-agents.
*   **Philosophical Integration:** Deeply embed Jungian psychology and Kashmir Saivism concepts (Pramata, Spanda, Paramashiva, Cit-Shakti, Atman, Lila, Svatantrya) into the agent's logic and responses.
*   **Technology Stack (Assumed):** Node.js/Python backend, potential use of state machines, message queues for inter-agent communication.

## 4. Constraints and Challenges

*   **Philosophical Nuance:** Accurately translating complex Jungian and Saivist concepts into agent logic and communication style.
*   **State Representation:** Designing a robust state model that captures both UI state and the deeper psychological/spiritual context.
*   **Orchestration Logic:** Creating a flexible and reliable mechanism for delegating tasks and synthesizing responses from multiple sources.
*   **`ag-ui` Protocol Adherence:** Ensuring correct implementation and handling of the `ag-ui` protocol.
*   **Initial Synthesis Complexity:** Even rudimentary synthesis requires careful handling of diverse data types and philosophical framing.
*   **Maintaining Narrative Voice:** Consistently applying the desired Socratic/Jungian/Saivist voice across different interactions.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Epic Overview:** Summary of Epic 4's goals.
3.  **EFDD Concepts:** Definitions of Pramata, Spanda, Paramashiva, Cit-Shakti, Atman, Lila, Svatantrya, `ag-ui` protocol, `epii` agent role, `bimba_map` role.
4.  **`ag-ui` Protocol Specification (Partial/Conceptual):**
    *   Example message format: `{ "protocol_version": "1.0", "message_id": "uuid", "timestamp": "iso_datetime", "source": "ui", "target": "nara_prime", "type": "user_action", "payload": { "action_type": "click_symbol", "symbol_id": "sun_symbol", "ui_context": "oracle_reading_screen" } }`
5.  **`epii` Agent Interface (Conceptual):**
    *   Example request: `{ "query_type": "philosophical_reflection", "topic": "symbol_of_serpent", "context": "user_dream_journal", "desired_lens": ["jungian", "saivist_spanda"] }`
    *   Example response: `{ "reflection_text": "...", "key_concepts": [...], "further_questions": [...] }`
6.  **`bimba_map` Query Tool Interface (Conceptual):**
    *   `querybimbagraph({ symbol: "serpent", depth: 2, relations: ["archetypal_link", "alchemical_correspondence"] })`
7.  **Illustrative User Interaction Flow:**
    *   User clicks a symbol in the UI -> UI sends `ag-ui` message to Nara -> Nara updates state (e.g., `current_focus:symbol_X`) -> Nara queries `bimba_map` for connections -> Nara queries `epii` agent for deeper meaning -> Nara synthesizes responses -> Nara sends formatted insight back to UI (via a response protocol).

## 6. Expected Outputs from AI Builder (Design & Code Structure)

1.  **Nara Agent Architecture Diagram:** High-level diagram showing Nara Prime, its core modules (Session Manager, State Tracker, `ag-ui` Handler, Orchestrator, Synthesizer, Voice Engine), and its interactions with UI, `bimba_map`, and `epii` agent.
2.  **Core Module Designs (Pseudocode/Detailed Descriptions):**
    *   **Session Management:** Data structures, storage strategy (e.g., Redis, DB schema).
    *   **State Tracking:** State machine definition or logic for tracking UI and psycho-spiritual context. How Jungian/Saivist concepts inform state interpretation.
    *   **`ag-ui` Protocol Handler:** Main message loop, parsing logic, initial event handlers.
    *   **Orchestration Logic:** Flow for delegating to `bimba_map` and `epii`. Request/response handling.
    *   **Information Synthesizer:** Initial algorithms/rules for combining and framing information with a Jungian-Saivist lens.
    *   **Narrative Voice Engine (Stub):** Strategy for generating responses in Nara's voice (e.g., template system, basic NLG rules).
3.  **Data Models/Schemas:** For session data, user state, internal message formats between Nara's modules.
4.  **API Definitions (Internal):** How Nara's modules will communicate with each other.
5.  **Key Function/Class Definitions (Signatures & Purpose):** For the main functionalities outlined.
6.  **Extensibility Plan:** How the architecture supports adding new sub-agents or capabilities.
7.  **Philosophical Integration Strategy:** Specific examples of how Jungian and Saivist concepts will be implemented in state tracking, synthesis, and voice.
8.  **Logging and Diagnostics Plan:** What to log and how.
9.  **Directory Structure and Key File Outlines:** For the Nara agent codebase.

## 7. Prompt for Generative AI

```
As an expert AI architect specializing in complex agent systems and with a deep understanding of Jungian psychology and Kashmir Saivism, design the foundational Nara Prime agent as described in User Story E4_F1_S1. Nara serves as the central orchestrating intelligence for a user's journey of self-discovery, integrating symbolic exploration with philosophical depth.

Your design must address:
1.  **User Session Management:** Securely track user sessions and interaction history.
2.  **State Tracking:** Implement a state model that captures UI interactions and interprets them through a combined Jungian (archetypal engagement, individuation stages) and Saivist (Spanda, Pratibha, Pramata awareness) lens.
3.  **`ag-ui` Protocol Integration:** Design the mechanism for receiving and processing structured input from the UI.
4.  **Basic Orchestration:** Develop the logic for Nara to query the `bimba_map` (for symbolic/archetypal data) and the `epii` agent (for philosophical/Saivist insights). The architecture must be extensible for future sub-agents.
5.  **Information Synthesis:** Outline an initial approach to synthesize information from `bimba_map` and `epii`, framing it coherently for the user through the integrated Jungian-Saivist perspective (highlighting themes of individuation, consciousness as Cit-Shakti, and the cosmic play of Lila).
6.  **Narrative Voice Framework:** Establish a basic system for Nara to communicate in a Socratic, reflective, and subtly Jungian-Saivist informed voice, guiding self-exploration towards recognizing Svatantrya and Atman.

Deliver the following:

1.  **Nara Agent Architecture Diagram:** Illustrating core modules (Session Manager, State Tracker, `ag-ui` Handler, Orchestrator, Synthesizer, Voice Engine) and external interactions (UI, `bimba_map`, `epii`).
2.  **Detailed Design for Core Modules:** Provide pseudocode, state diagrams, or detailed descriptions for each module's logic and data handling, explicitly showing how Jungian and Saivist concepts are embedded.
3.  **Data Models/Schemas:** Define key data structures (session data, user state, internal messages).
4.  **API Definitions (Internal & External stubs):** For module communication and interaction with `bimba_map`/`epii`.
5.  **Extensibility Plan:** Briefly describe how new agents or capabilities can be integrated.
6.  **Philosophical Integration Examples:** Provide 2-3 concrete examples of how a user interaction would be processed and responded to, highlighting the application of Jungian-Saivist principles at each step (state update, queries, synthesis, response generation).
7.  **Logging Strategy:** Outline key data points for logging.
8.  **Proposed Codebase Structure:** Suggest a directory and file organization for the Nara agent.

Ensure the design is robust, extensible, and deeply embeds the specified philosophical orientations to create a unique and transformative user experience.
```