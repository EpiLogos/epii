# Data Model: The `QuaternalUnit` as a Graphiti Community

To align with the existing Graphiti architecture, the `QuaternalUnit` will be implemented as a specialized **`Community` node**. This `Community` node will act as a container, grouping the `Entity` nodes that represent each of the 4 or 6 positions of the Quaternal Logic structure. This model is grounded in the existing `Bimba-Pratibimba-Memory-MCP` schemas.

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