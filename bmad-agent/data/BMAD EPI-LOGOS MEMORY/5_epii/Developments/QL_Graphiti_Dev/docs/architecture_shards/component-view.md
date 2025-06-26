# Component View: QL Processing

### Graphiti MCP Service: QL Identification & Refinement

The core of this development lies in the Graphiti MCP service. It will be responsible for orchestrating the lifecycle of a `QuaternalUnit`.

**Phase 1: Identification (Automated)**
- The service will periodically or on-demand scan new content from LightRAG and changes in the Neo4j Bimba graph.
- It will use a combination of NLP techniques (semantic analysis, keyword/pattern matching) and graph analysis to identify clusters of information that strongly suggest a 4-part or 6-part structure.
- **Example Heuristic:** If a document discusses a problem, outlines a series of steps, describes the outcome, and specifies the application context, the service will flag this as a `POTENTIAL` 4-part `QuaternalUnit`.
- Upon identification, it creates a `QuaternalUnit` node with `status: POTENTIAL` and links to the source evidence.

**Phase 2: Refinement (Agent/Human-in-the-Loop)**
- A `POTENTIAL` unit is a candidate for refinement.
- The agent can be tasked to "think about" a potential unit. It would review the source material, attempt to explicitly define each of the 4 or 6 parts, and fill in any gaps.
- This process creates or links the specific nodes for each position and updates the `QuaternalUnit` status to `REFINING`.

**Phase 3: Validation**
- A refined unit can be presented to a human user or a specialized validation agent for confirmation.
- Once confirmed, the status is moved to `VALIDATED`. Validated units are considered stable, high-quality memory artifacts.

### Agent Interaction: The Contemplation Skill & Closed-Loop Reporting
The agent's ability to reflect and synthesize knowledge will be encapsulated in a core skill: ContemplateKnowledge . This skill is more than a simple tool call; it's an orchestrated process that leverages the entire data ecosystem.

Core Logic of ContemplateKnowledge :

1. Trigger : Can be triggered by a POTENTIAL QuaternalUnit , a user prompt (e.g., "Contemplate the relationship between X and Y"), or a scheduled process.
2. Dynamic Sourcing : The agent uses a suite of BPMCP tools to gather relevant context:
   - queryBimbaGraph(coordinate) : To fetch the foundational structural truth.
   - searchLightRAG(query) : To find relevant unstructured text from documents.
   - queryNotion(query) : To access crystallized knowledge and human-curated content.
   - getMongoContext(query) : To retrieve operational data or other relevant records.
3. Synthesis : The agent analyzes the gathered information, looking for the 4-part or 6-part QL pattern. It identifies the entities for each position.
4. Grounding & Linking :
   - It calls createQuaternalUnit or updateQuaternalUnit , explicitly grounding the unit in a primary bimbaCoordinate .
   - Crucially, if the synthesis reveals connections to concepts in other coordinates, it identifies the relevant QuaternalUnit in that coordinate and creates a cross_coordinate_link .
5. Closed-Loop Bimba Update Logging : When a significant cross_coordinate_link is established, the Contemplation skill will log this relationship as a POTENTIAL_BIMBA_UPDATE event in a dedicated MongoDB collection. This log will contain the source coordinate, target coordinate, and a summary of the relationship.
6. Refinement Loop : The process is iterative. The agent may identify gaps and perform further searches to create a more complete and validated unit.