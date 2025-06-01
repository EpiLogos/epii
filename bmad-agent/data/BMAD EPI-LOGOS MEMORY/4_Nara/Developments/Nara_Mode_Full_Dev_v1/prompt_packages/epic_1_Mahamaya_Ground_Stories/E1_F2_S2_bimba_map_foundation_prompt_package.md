# AI Builder Prompt Package: Epic 1 - Story E1.F2.S2: Bimba Map Foundation (Neo4j)

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** Backend System Development & Bimba Map Foundation
**Sub-Feature:** Bimba Map Graph Database Structure and Initial Seeding
**AI Builder Target:** Augment Code (Claude 4)

## 1. Story Definition

This story focuses on establishing the foundational structure of the `bimba_map`, a Neo4j graph database. The `bimba_map` is designed to hold the pre-integrated relationships and harmonic unifications between diverse symbolic and spiritual systems (e.g., astrology, tarot, I Ching, alchemy, Gene Keys, Human Design). This inherent epistemic unification within the `bimba_map` provides the rich semantic foundation from which Nara draws its universal symbolic knowing.

The goal is to design the initial graph model (nodes, relationships, properties) for the `bimba_map`, set up the Neo4j instance, and implement scripts or processes to seed the database with core symbolic system data and their interconnections.

**Acceptance Criteria:**

*   **AC1 (Backend - Graph Model Design):** A clear graph model for the `bimba_map` is designed, defining key node labels (e.g., `Symbol`, `Archetype`, `Planet`, `ZodiacSign`, `TarotCard`, `Hexagram`, `GeneKey`, `Chakra`, `Element`) and relationship types (e.g., `CORRESPONDS_TO`, `INFLUENCES`, `PART_OF`, `DERIVED_FROM`).
*   **AC2 (Backend - Neo4j Setup):** A Neo4j database instance is set up and configured for the development environment.
*   **AC3 (Backend - Seeding Data - Core Systems):** Initial data for core symbolic systems is prepared and seeded into the `bimba_map`. This includes, but is not limited to:
    *   Astrology: Planets, Signs, Houses, Aspects.
    *   Tarot: Major Arcana, Minor Arcana (Suits, Numbers).
    *   I Ching: 64 Hexagrams.
    *   Gene Keys: 64 Gene Keys (potentially linking to Hexagrams).
    *   Human Design: 64 Gates, 9 Centers, 36 Channels (potentially linking to Gene Keys/Hexagrams).
*   **AC4 (Backend - Seeding Data - Interconnections):** Key relationships and correspondences *between* these systems are defined and seeded (e.g., astrological planet corresponding to a tarot card, a Gene Key linked to an I Ching hexagram and an amino acid).
*   **AC5 (Backend - Query Capability):** Basic Cypher queries can be executed against the seeded `bimba_map` to retrieve symbolic data and demonstrate interconnectedness (e.g., find all symbols related to the planet Mars).
*   **AC6 (Documentation):** The graph model (node labels, relationship types, key properties) and the seeding process are documented.

## 2. Technical Context

**From Epic 1: Mahamaya Ground Implementation:**

*   The `bimba_map` (Neo4j graph database) will be structured to hold the pre-integrated relationships and harmonic unifications between diverse symbolic and spiritual systems.
*   This inherent epistemic unification within the `bimba_map` provides the rich semantic foundation from which Nara draws its universal symbolic knowing.
*   The User Identity object (Mahamaya Matrix) will condition Nara's knowledge from the `bimba_map` to form contextualized insights.

**From Architecture Documents (feature-context-bimba-alignment-package_Part1.md & Part2.md):**

*   **System Architecture:** Three-layer distributed architecture: Frontend (Vue.js, Quasar), Back-to-Front (Node.js, Express), Backend (Python, Flask/FastAPI).
*   **BPMCP (Bimba-Pratibimba-Memory-MCP):** The `bimba_map` is a core component of the BPMCP. The BPMCP is responsible for data access and management.
    *   **Bimba (Neo4j):** Read-only access for universal symbolic data. This is where the `bimba_map` resides.
    *   **Pratibimba (MongoDB):** Read/write access for user-specific data (Mahamaya Matrix).
    *   **Memory (Notion):** Read-only access for curated knowledge.
*   **Target Directory (Backend):** `/epii_app/friendly-file-backend/`
*   **Key Backend Components for this story:** Likely within `/epii_app/friendly-file-backend/subsystems/bimba_map/` or `/epii_app/friendly-file-backend/services/` for data seeding and querying logic, and `/epii_app/friendly-file-backend/models/` or `/epii_app/friendly-file-backend/schemas/` for graph model definitions if represented in code.
*   **Communication:** AG-UI (Agent-User Interaction) and A2A (Agent-to-Agent) protocols are defined but may be less directly relevant for the initial seeding and structure, more for later querying by other services.

## 3. Constraints & Considerations

*   **Database:** Neo4j is specified.
*   **Graph Model Design:** Must be intuitive, allow efficient querying of correspondences, and be extensible.
*   **Data Sources:** Reliable sources for symbolic data are needed. Consistency is key.
*   **Seeding Strategy:** Consider `LOAD CSV` for bulk loading or Cypher/programmatic creation for complex structures.
*   **Query Language:** Cypher.
*   **Integration with Mahamaya Matrix:** The `bimba_map` (universal) will be queried using context from the Mahamaya Matrix (user-specific) for personalized insights. This story focuses on the `bimba_map`'s foundation.
*   **Scalability:** The model should accommodate new symbolic systems.
*   **Data Accuracy:** Seeded data must be accurate.
*   **Query Performance:** Common queries should be performant.
*   **Extensibility:** Design for easy addition of new systems/relationships.
*   **EFDD Not Found:** The Feature Definition Document (E1_F2_EFDD.md) was not available, so reliance is on the story, epic, and architecture docs.

## 4. Inputs to AI Builder (Claude 4 - Augment Code)

*   The story description, acceptance criteria, and tasks for E1.F2.S2.
*   The graph model design (conceptual: node labels, relationship types, properties – to be translated into Cypher DDL or Python models).
*   Sample data structures or sources for the initial symbolic systems (Astrology, Tarot, I Ching, Gene Keys, Human Design).
*   Guidance on Neo4j setup and configuration within a Python/Flask/FastAPI backend environment.
*   Target directory structure within `/epii_app/friendly-file-backend/`.

## 5. Expected Outputs from AI Builder

1.  **Neo4j Setup and Configuration Assistance:**
    *   Guidance or code snippets for setting up and connecting to a Neo4j instance from a Python backend (e.g., using `neo4j` Python driver).
    *   Configuration examples (e.g., environment variables for connection details).
2.  **Graph Model Implementation (Cypher DDL or Python Models):
    *   Cypher `CREATE CONSTRAINT` statements for unique identifiers on key nodes.
    *   If using an OGM (Object Graph Mapper) like `neomodel` (Python), provide Python class definitions for nodes and relationships based on the conceptual model.
3.  **Data Seeding Scripts (Python or Cypher):
    *   Python scripts using the `neo4j` driver to create nodes and relationships for the core symbolic systems and their interconnections. These scripts should be organized and runnable.
    *   Alternatively, a set of Cypher scripts (`.cypher` files) that can be executed to seed the data.
    *   Examples of how to structure input data (e.g., CSV, JSON) if `LOAD CSV` or programmatic loading from files is preferred for parts of the seeding.
4.  **Basic Query Service Layer (Python/Flask or FastAPI):
    *   A Python module/service with functions to execute basic Cypher queries against the `bimba_map`.
    *   Example: A function `find_symbols_related_to(node_type, node_id_or_name)` that returns connected symbols.
    *   This service should be designed to be called internally by other backend components.
5.  **Documentation Snippets:
    *   Markdown snippets describing the implemented graph model (nodes, relationships, properties).
    *   Notes on how to run the seeding scripts.

## 6. Detailed Prompt for AI Builder (Claude 4 - Augment Code)

```
As an AI Code Augmentation assistant (Claude 4), your task is to help implement the backend components for Story E1.F2.S2: Bimba Map Foundation (Neo4j) within the Nara project.

**Project Context:**
Nara is a system with a three-layer architecture (Vue.js Frontend, Node.js B2F, Python Backend). This story focuses on the Python backend, specifically establishing the Neo4j graph database (`bimba_map`) which stores universal symbolic knowledge.
The target backend directory is `/epii_app/friendly-file-backend/`.

**Story Goal:** Design the initial graph model for `bimba_map`, set up Neo4j, and implement scripts to seed it with core symbolic data (Astrology, Tarot, I Ching, Gene Keys, Human Design) and their interconnections.

**Key Requirements from Story & Epic:**

1.  **Graph Model Design (Conceptual - to be implemented):
    *   **Node Labels:** `Symbol`, `Archetype`, `Planet`, `ZodiacSign`, `TarotCard` (Major, Minor, Suit, Number), `Hexagram`, `GeneKey`, `HumanDesignGate`, `HumanDesignCenter`, `HumanDesignChannel`, `Chakra`, `Element`.
    *   **Relationship Types:** `CORRESPONDS_TO`, `INFLUENCES`, `PART_OF`, `DERIVED_FROM`, `HAS_ASPECT_TO`, `IN_HOUSE`, `REPRESENTS_QUALITY` (and others as appropriate for symbolic connections).
    *   **Properties:** Nodes should have `name`, `description`, and system-specific attributes (e.g., `TarotCard` might have `suit`, `number`, `arcana_type`; `Planet` might have `symbol`, `ruler_of_sign`).

2.  **Neo4j Setup & Configuration (Python Backend - Flask/FastAPI context):
    *   Provide guidance on connecting to a Neo4j instance (assume it's running locally or accessible via URI, user, password).
    *   Show how to manage connection details securely (e.g., environment variables).

3.  **Data Seeding (Core Systems & Interconnections):
    *   **Core Systems Data:** Astrology (Planets, Signs), Tarot (Major Arcana), I Ching (64 Hexagrams), Gene Keys (64 Keys), Human Design (64 Gates).
    *   **Interconnections:** Examples: Planet <-> Tarot Card, Gene Key <-> Hexagram, Human Design Gate <-> Hexagram.
    *   Implement Python scripts (using the `neo4j` driver) to perform this seeding. Structure the scripts for clarity and reusability. Consider a main seeding script that calls functions for each system/set of relationships.
    *   Show how to create nodes with properties and establish relationships between them.
    *   Include examples of creating constraints (e.g., `Symbol.name` should be unique).

4.  **Basic Query Capability (Internal Service Layer):
    *   Develop a Python module (e.g., `bimba_map_service.py`) with functions to perform basic queries.
    *   Example query: "Find all `TarotCard` nodes that `CORRESPONDS_TO` a given `Planet` node."
    *   Example query: "Retrieve a `Hexagram` by its number and list its associated `GeneKey`."

5.  **Documentation:
    *   Provide brief markdown documentation for the graph model elements you implement (nodes, key properties, relationships).
    *   Explain how to run the seeding scripts.

**Expected Output Structure:**

Organize your response into the following sections. Provide runnable Python code where applicable, assuming a standard Python project structure within `/epii_app/friendly-file-backend/` (e.g., a `subsystems/bimba_map/` directory for graph logic and seeding, and `services/` for query layers).

1.  **Neo4j Connection & Configuration (Python):
    *   Code for a utility/config module to handle Neo4j connection.
2.  **Graph Model Implementation (Cypher DDL for Constraints & Python for OGM if applicable, otherwise conceptual mapping to seeding script logic):
    *   Cypher `CREATE CONSTRAINT` statements.
    *   (Optional, if you recommend an OGM like `neomodel`): Python class definitions for nodes/relationships.
3.  **Data Seeding Scripts (Python):
    *   `seed_bimba_map.py` (main script)
    *   Helper functions/modules for seeding specific systems (e.g., `seed_astrology.py`, `seed_tarot.py`, `seed_interconnections.py`).
    *   Show clear examples of node and relationship creation for a few symbolic entities and their connections.
4.  **Basic Query Service Layer (Python - e.g., `bimba_map_service.py`):
    *   Functions demonstrating how to query the seeded graph.
5.  **Documentation (Markdown):
    *   Graph model summary.
    *   Instructions for running seeders.

**Focus on providing practical, runnable code examples and clear explanations for a developer to integrate this into the existing Python backend.**
Assume the developer has `neo4j` Python driver installed.
Prioritize clarity, correctness, and adherence to the described symbolic systems and their relationships.
If you need to make assumptions about specific symbolic correspondences (e.g., which planet maps to which tarot card), state them clearly.
```