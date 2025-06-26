# New & Enhanced BPMCP Graphiti Tools

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

#### 4.2.2. NEW : updateQuaternalUnit
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
```

#### 4.2.3. ENHANCED : getGraphitiContext
We will enhance the existing getGraphitiContext tool to recognize and retrieve QuaternalUnit communities, allowing the agent to fetch fully formed conceptual units.