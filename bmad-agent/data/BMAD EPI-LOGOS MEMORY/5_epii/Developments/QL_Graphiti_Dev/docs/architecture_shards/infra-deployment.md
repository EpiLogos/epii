# System Architecture & Data Flow

1. **Ingestion & Grounding** : Data enters LightRAG, Notion, Mongo. The Neo4j Bimba graph serves as the structural backbone.
2. **Trigger for Contemplation** : An agent, user, or automated process initiates the ContemplateKnowledge skill.
3. **Dynamic Retrieval** : The agent queries all relevant data sources via BPMCP tools, using the Bimba coordinate map as a guide.
4. **Synthesis & Creation** : The agent identifies a QL pattern and creates a POTENTIAL QuaternalUnit in Graphiti, grounded in a Bimba coordinate.
5. **Cross-Coordinate Linking** : During refinement, the agent establishes links to other QuaternalUnit s across the Bimba map, capturing emergent insights.
6. **Insight Logging** : The agent logs significant cross-coordinate discoveries to a MongoDB collection for future review.
7. **Bimba Map Evolution** : The separate Epii agent's "Bimba Update Skill" can periodically review this log, and, with user validation, use the updateBimbaGraph tool to formalize these emergent relationships in the core Neo4j Bimba graph, thus closing the knowledge loop.
8. **Utilization** : The agent can now query and use this validated, holistic memory artifact, representing a generative, Bimba-aligned reflection that is readily accessible for future reasoning.