### 3.3. Data Flow and Control Flow (Conceptual)

*   **Control Flow:**
    1.  A task is initiated (e.g., via user request, A2A message from another agent).
    2.  The relevant agent receives the task, including Bimba coordinate context.
    3.  Agent queries `Skills Registry` via A2A for suitable skills based on task and coordinates.
    4.  Agent selects a skill and invokes it via the `Skills Router`.
    5.  The skill executes, potentially calling multiple BPMCP tools in sequence.
    6.  BPMCP tools interact with underlying data stores (Neo4j, Qdrant, etc.).
    7.  Results are returned to the skill, then to the agent.
    8.  The agent processes results, potentially performs synthesis, and may invoke further skills or report completion/output via A2A.
*   **Data Flow:**
    1.  Input data (queries, documents, Bimba coordinates) flows into agents/skills.
    2.  Data is passed to BPMCP tools as parameters.
    3.  BPMCP tools retrieve/generate data from/to databases.
    4.  Output data from tools flows back to skills/agents.
    5.  Synthesized knowledge, tagged with Bimba coordinates, is the final output.