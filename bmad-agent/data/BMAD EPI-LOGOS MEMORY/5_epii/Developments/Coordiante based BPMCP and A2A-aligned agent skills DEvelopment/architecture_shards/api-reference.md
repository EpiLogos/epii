### 5. Integration Points

*   **Epii Agent:** Enhancements will be made to the existing Epii agent's codebase (e.g., `epii_app/friendly-file-backend/agents/epiiAgent.js`).
*   **A2A Communication Layer (`friendly-file-back2front`):
    *   `agent-cards/` (e.g., `epii-agent-card.js`): For advertising new skills.
    *   `skills/` (e.g., `epii-skills-initializer.js`): For defining and initializing skill implementations.
    *   `bimba-skills-registry.js`: For registering skills and their coordinate mappings.
    *   `bimba-skills-router.js`: For routing skill invocation requests.
*   **BPMCP Tools:** Agents/skills will invoke existing BPMCP tools. No direct modification to BPMCP tools themselves is anticipated by this feature, but their usage patterns will be defined by the new skills.
*   **Epii Analysis Pipeline:** Agents may consume outputs from or provide inputs to the pipeline. This integration will be through existing pipeline interfaces or data structures.
*   **Databases (Neo4j, Qdrant):** Accessed via BPMCP tools. Skills will define how these databases are queried using Bimba coordinates.