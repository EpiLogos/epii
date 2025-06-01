### 2. Current System Context Relevant to this Feature

*   **Epi-Logos Philosophical Layers:** This feature primarily enhances layers #5-2 (BPMCP), #5-3 (Epii Analysis Pipeline), and #5-4 (Siva-Shakti A2A Communication Layer).
*   **BPMCP (Business Process & Metaphysical Choreography Platform):** The existing suite of tools for data interaction, processing, and RAG (e.g., Neo4j queries, Qdrant searches, text summarizers).
*   **Epii Analysis Pipeline:** The multi-stage pipeline for ingesting and processing information, particularly Stage -3 (RAG) and its outputs.
*   **A2A Communication Layer (`friendly-file-back2front`):
    *   Implements Google's A2A protocol with Bimba coordinate extensions.
    *   Includes `bimba-skills-registry.js` and `bimba-skills-router.js` which are foundational for the proposed skill-based architecture.
    *   Manages agent cards (`agent-cards/`) and skill initializers (`skills/`).
*   **Epii Agent (`epii_app/friendly-file-backend/agents/epiiAgent.js`):** The primary intelligent agent whose capabilities will be extended.
*   **Bimba Coordinates:** The existing system for multi-dimensional contextualization.