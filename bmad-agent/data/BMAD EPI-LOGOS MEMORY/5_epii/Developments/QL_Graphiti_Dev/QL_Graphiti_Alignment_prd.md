# PRD: Quaternal Logic (QL) Alignment for Graphiti Episodic Memory

**Version:** 1.0

## 1. Vision & Goal

To evolve the Graphiti episodic memory system from a repository of simple entities and relations into a sophisticated engine for conceptual synthesis. This will be achieved by enabling Graphiti to identify, model, and refine holistic epistemic structures based on the foundational 4-part and 6-part variants of Quaternal Logic.

The primary goal is to create a high-level layer of refined, structured memory (`epistemic wholes`). This will empower the agent to perform deeper reasoning and generate insights by operating on these complete conceptual units, thereby reducing the cognitive load and context-dependency of the `UnifiedRag` process for many interactions.

## 2. Problem Statement

The current agent memory architecture, while effective at storing and retrieving factual data (entities, relations, document chunks), lacks the capacity to represent or understand the *synthesis* of these elements into a coherent, meaningful whole. It sees the trees but not the forest. This limitation prevents the agent from grasping the deeper conceptual structures latent within its knowledge base, forcing it to re-derive complex relationships from scratch in every session. This is inefficient and inhibits the development of true systemic understanding.

## 3. High-Level Requirements & Scope

This development focuses on empowering the **Graphiti MCP Service** to act as the primary engine for identifying and structuring QL units from the lower-level memory stores (Neo4j Bimba graph, LightRAG document store, Notion, MongoDB).

- **Extend Graphiti Data Model:** Introduce new schemas to represent 4-part and 6-part QL structures as specialized `Community` nodes.
- **Develop New BPMCP Tools:** Create specific tools within the BPMCP's Graphiti toolset to manage the lifecycle of these QL structures.
- **Implement a `Contemplation` Skill:** Design a core agent skill that orchestrates the dynamic sourcing, synthesis, and refinement of QL units.
- **Enable Closed-Loop Knowledge Processing:** Institute a logging mechanism to capture emergent insights for future updates to the core Bimba map.

## 4. Key Features & Design

### 4.1. Data Model: The `QuaternalUnit` as a Graphiti Community

To align with the existing Graphiti architecture, the `QuaternalUnit` will be implemented as a specialized **`Community` node**. This `Community` node will act as a container, grouping the `Entity` nodes that represent each of the 4 or 6 positions of the Quaternal Logic structure.

**New Node Label:** `QuaternalUnit` (in addition to `Community`)

**`QuaternalUnit` Community Node Properties:**
- `quaternal_type`: Enum (`FOUR_PART`, `SIX_PART`).
- `status`: Enum (`POTENTIAL`, `REFINING`, `VALIDATED`).
- `bimba_coordinate`: String. The primary Bimba coordinate this unit is grounded in.
- `source_references`: Array of objects, each containing a `uuid` and `source_type` (e.g., `lightrag_doc`, `notion_page`, `neo4j_node`, `mongo_doc`).
- `summary`: A human-readable summary of the epistemic whole.
- `cross_coordinate_links`: Array of objects, each with `target_qu_id` and `target_bimba_coordinate`, describing the relationship to other QL units.

**Relationships:**
- The `QuaternalUnit` community node will have `HAS_MEMBER` relationships to each of its constituent `Entity` nodes.
- Each constituent `Entity` node will have a property `ql_position` (e.g., `0`, `1`, `2`, `3`, `4`, `5`) to denote its role within the structure.

### 4.2. New & Enhanced BPMCP Graphiti Tools

To manage the lifecycle of `QuaternalUnit`s, we will introduce two new tools and enhance one existing tool within the BPMCP's Graphiti toolset, ensuring they align with the server's architecture.

#### 4.2.1. **NEW**: `createQuaternalUnit`

This tool allows the agent or user to initiate the creation of a QL structure, providing the initial seed for the `Contemplation` skill.

**Schema (`CreateQuaternalUnitSchema`):**
```typescript
z.object({
  quaternal_type: z.enum(["FOUR_PART", "SIX_PART"]).optional().describe("User-specified QL structure. If omitted, the agent will infer it."),
  bimbaCoordinate: z.string().describe("The primary Bimba coordinate to ground the unit."),
  source_references: z.array(z.object({ 
    uuid: z.string(), 
    source_type: z.enum(["lightrag_doc", "notion_page", "neo4j_node", "mongo_doc"])
  })).optional().describe("Optional initial evidence to seed the process."),
  initial_entities: z.array(z.object({
    name: z.string(),
    ql_position: z.number(),
    summary: z.string().optional()
  })).optional().describe("User's intuition-driven mapping of initial entities to QL positions.")
});
```

### 4.2. Graphiti MCP Service: QL Identification & Refinement

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

### 4.3. Agent Interaction

- **New Skill/BPMCP Tool:** `findQuaternalUnits(query)`: Allows the agent to search for validated QL units related to a topic.
- **New Skill/BPMCP Tool:** `refineQuaternalUnit(id)`: Triggers the refinement process for a potential QL unit.
- Agent reasoning should be modified to prioritize using `VALIDATED` `QuaternalUnit` structures as a primary source of context before falling back to lower-level RAG.

## 5. System Architecture & Data Flow

1.  **Ingestion:** Data enters LightRAG (documents) and Neo4j (graph entities).
2.  **Identification:** The **Graphiti MCP Service** runs its QL Identification algorithms over the ingested data.
3.  **Creation:** A `QuaternalUnit` node with `status: POTENTIAL` is created in the Graphiti memory layer.
4.  **Orchestration:** An agent (or user) triggers the refinement of the potential unit.
5.  **Refinement:** The agent interacts with the source data to define and link nodes for each of the 4/6 positions.
6.  **Validation:** The completed unit is validated, and its status is set to `VALIDATED`.
7.  **Utilization:** The agent can now query and use this validated, holistic memory unit in future tasks, significantly streamlining its reasoning process.

## 6. Success Metrics

- **Quantitative:**
    - Number of `POTENTIAL` `QuaternalUnit`s identified per week.
    - Ratio of `POTENTIAL` units successfully promoted to `VALIDATED`.
- **Qualitative:**
    - The agent's ability to answer complex, systemic questions by referencing a single `QuaternalUnit` instead of multiple raw sources.
    - Reduction in verbosity and token count for agent responses on topics covered by a `QuaternalUnit`.
    - User feedback on the quality and depth of insights generated by the agent.

    4.2.2. NEW : updateQuaternalUnit
Used by the Contemplation skill to flesh out the QuaternalUnit with synthesized information and cross-coordinate links.

Schema ( UpdateQuaternalUnitSchema ):

```
z.object({
  qu_id: z.string().describe("The 
  UUID of the QuaternalUnit to 
  update."),
  status: z.enum(["REFINING", 
  "VALIDATED"]).optional(),
  summary: z.string().optional(),
  entities_to_add: z.array(z.object
  ({
    name: z.string(),
    ql_position: z.number(),
    summary: z.string().optional()
  })).optional(),
  cross_coordinate_links_to_add: z.
  array(z.object({
    target_qu_id: z.string(),
    target_bimba_coordinate: z.
    string(),
    relationship_summary: z.string
    ()
  })).optional()
});
``` 4.2.3. ENHANCED : getGraphitiContext
We will enhance the existing getGraphitiContext tool to recognize and retrieve QuaternalUnit communities, allowing the agent to fetch fully formed conceptual units.

### 4.3. Agent Interaction: The Contemplation Skill & Closed-Loop Reporting
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
## 5. System Architecture & Data Flow
1. Ingestion & Grounding : Data enters LightRAG, Notion, Mongo. The Neo4j Bimba graph serves as the structural backbone.
2. Trigger for Contemplation : An agent, user, or automated process initiates the ContemplateKnowledge skill.
3. Dynamic Retrieval : The agent queries all relevant data sources via BPMCP tools, using the Bimba coordinate map as a guide.
4. Synthesis & Creation : The agent identifies a QL pattern and creates a POTENTIAL QuaternalUnit in Graphiti, grounded in a Bimba coordinate.
5. Cross-Coordinate Linking : During refinement, the agent establishes links to other QuaternalUnit s across the Bimba map, capturing emergent insights.
6. Insight Logging : The agent logs significant cross-coordinate discoveries to a MongoDB collection for future review.
7. Bimba Map Evolution : The separate Epii agent's "Bimba Update Skill" can periodically review this log, and, with user validation, use the updateBimbaGraph tool to formalize these emergent relationships in the core Neo4j Bimba graph, thus closing the knowledge loop.
8. Utilization : The agent can now query and use this validated, holistic memory artifact, representing a generative, Bimba-aligned reflection that is readily accessible for future reasoning.
## 6. Success Metrics
- Quantitative:
  - Number of POTENTIAL QuaternalUnit s identified per week.
  - Ratio of POTENTIAL units successfully promoted to VALIDATED .
  - Number of cross_coordinate_links created, indicating the generation of novel insights.
- Qualitative:
  - The agent's ability to answer complex, systemic questions by referencing a single `QuaternalUnit` instead of multiple raw sources.
  - Reduction in verbosity and token count for agent responses on topics covered by a `QuaternalUnit` .
  - User feedback on the quality and depth of insights generated by the agent.

## 7. Development Standard: Streamlined RAG and Multi-Layered Knowledge Synthesis

The development of Graphiti with Quaternal Logic alignment establishes a critical standard for future agent development, particularly concerning data processing and knowledge synthesis. This architecture enables a multi-layered approach to Retrieval-Augmented Generation (RAG).

- **Generative Core (Asynchronous Rumination):** The `UnifiedRAG` system, integrated with the `Contemplation` skill, will function as the generative core. It performs the "heavy lifting" of deep knowledge synthesis, creating and refining `QuaternalUnit`s as a background, asynchronous process. This can be considered the system's "rumination" capability, which continuously improves the quality and structure of the core memory bank. Likely the epii agent will manage and orchestrate this process.

- **Dynamic RAG (Real-Time Application):** The Graphiti service itself will serve as the "topmost layer" for cognitive operations. Individual agents within the multi-agent architecture can leverage the refined `QuaternalUnit`s for dynamic, in-the-moment RAG. This allows for rapid, low-latency access to pre-synthesized knowledge, making individual agent interactions faster and more contextually precise.

This explicit separation of concerns—from heavier, asynchronous synthesis to lighter, dynamic retrieval—is a guiding principle. It ensures that the entire multi-agent architecture can leverage a constantly improving, centrally-managed knowledge base, while individual agents remain agile and responsive. All future agent development should adhere to this model, utilizing the Graphiti service for immediate knowledge needs and contributing to the deeper `Contemplation` cycle where appropriate.

  