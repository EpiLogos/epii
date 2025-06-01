### 8. Initial Technology Choices & Rationale

*   **Primary Language:** JavaScript (Node.js environment), consistent with the existing Epi-Logos backend and A2A layer.
*   **Agent Framework:** Leverage the existing agent structure within `epii_app/friendly-file-backend/agents/`.
*   **A2A Communication:** Utilize the established Google A2A protocol implementation in `friendly-file-back2front`.
*   **Skills Registry/Router:** Build upon the existing `bimba-skills-registry.js` and `bimba-skills-router.js` in `friendly-file-back2front`.
*   **BPMCP Tools:** Utilize the existing suite of BPMCP tools.
*   **Databases:** Neo4j for graph-based coordinate and entity relationships, Qdrant for semantic vector storage and search.