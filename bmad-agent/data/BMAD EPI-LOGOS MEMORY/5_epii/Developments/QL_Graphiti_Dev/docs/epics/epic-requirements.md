# High-Level Requirements & Scope

This development focuses on empowering the **Graphiti MCP Service** to act as the primary engine for identifying and structuring QL units from the lower-level memory stores (Neo4j Bimba graph, LightRAG document store, Notion, MongoDB).

- **Extend Graphiti Data Model:** Introduce new schemas to represent 4-part and 6-part QL structures as specialized `Community` nodes.
- **Develop New BPMCP Tools:** Create specific tools within the BPMCP's Graphiti toolset to manage the lifecycle of these QL structures.
- **Implement a `Contemplation` Skill:** Design a core agent skill that orchestrates the dynamic sourcing, synthesis, and refinement of QL units.
- **Enable Closed-Loop Knowledge Processing:** Institute a logging mechanism to capture emergent insights for future updates to the core Bimba map.