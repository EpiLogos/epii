# Story E1.F2.S2: Bimba Map Foundation (Neo4j)

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** Backend System Development & Bimba Map Foundation
**Sub-Feature:** Bimba Map Graph Database Structure and Initial Seeding
**AI Builder Target:** Augment Code (Claude 4)
**Status:** Draft

## 1. Story Description & Goal

This story focuses on establishing the foundational structure of the `bimba_map`, a Neo4j graph database. The `bimba_map` is designed to hold the pre-integrated relationships and harmonic unifications between diverse symbolic and spiritual systems (e.g., astrology, tarot, I Ching, alchemy, Gene Keys, Human Design). This inherent epistemic unification within the `bimba_map` provides the rich semantic foundation from which Nara draws its universal symbolic knowing.

The goal is to design the initial graph model (nodes, relationships, properties) for the `bimba_map`, set up the Neo4j instance, and implement scripts or processes to seed the database with core symbolic system data and their interconnections.

## 2. Acceptance Criteria

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

## 3. Tasks

*   **Task 3.1 (Research/Design):** Research and define the core symbolic systems to be included in the initial `bimba_map` and their key entities and attributes.
*   **Task 3.2 (Backend - Design):** Design the graph model: identify node labels, properties for each node type, and relationship types that connect them. Visualize this model (e.g., using arrows.app or similar).
*   **Task 3.3 (Backend - Setup):** Set up a local or cloud-hosted Neo4j instance for development.
*   **Task 3.4 (Backend - Data Preparation):** Collect and structure the data for the initial seeding of symbolic systems. This might involve creating CSV files, JSON files, or directly scripting Cypher `CREATE` statements.
*   **Task 3.5 (Backend - Seeding Implementation):** Develop scripts (e.g., Python with Neo4j driver, or direct Cypher scripts) to load the prepared data into Neo4j, creating nodes and relationships.
*   **Task 3.6 (Backend - API/Service Layer Design - Basic):** Design a basic service layer or API (internal to the backend) that will allow other parts of the Nara application to query the `bimba_map`.
*   **Task 3.7 (Backend - Testing):** Write and execute Cypher queries to validate the seeded data and relationships. Test the basic service layer for querying.
*   **Task 3.8 (Documentation):** Document the graph model, data sources for seeding, and the seeding scripts/process.

## 4. Technical Guidance & Considerations

*   **Database Choice:** Neo4j is specified in `epic-1.md`.
*   **Graph Model Design Principles:** Aim for a model that is intuitive, allows for efficient querying of correspondences, and is extensible for future additions of symbolic systems.
*   **Data Sources:** Identify reliable sources for symbolic data. Public domain information, academic texts, or established esoteric literature can be used. Ensure consistency.
*   **Seeding Strategy:** For larger datasets, consider using Neo4j's `LOAD CSV` for efficient bulk loading. For smaller, more complex structures, direct Cypher or programmatic creation might be better.
*   **Query Language:** Cypher will be the primary language for interacting with the `bimba_map`.
*   **Integration with Mahamaya Matrix:** While the `bimba_map` holds universal symbolic knowledge, the Mahamaya Matrix (Story E1.F2.S1) holds the *user's specific* instantiation of these symbols. The `bimba_map` will be queried using context from the Mahamaya Matrix to provide personalized insights.
*   **Scalability of Model:** Consider how new symbolic systems or deeper layers of existing systems can be added without major refactoring.

## 5. Dependencies

*   Conceptual understanding of the symbolic systems to be included (Astrology, Tarot, I Ching, Gene Keys, Human Design, etc.).
*   Access to data sources for these symbolic systems.
*   Neo4j instance available.

## 6. Non-Functional Requirements

*   **Data Accuracy:** The symbolic data and correspondences seeded into the `bimba_map` must be accurate according to chosen reputable sources.
*   **Query Performance:** Common queries for symbolic correspondences should be performant.
*   **Extensibility:** The graph model should be designed to easily accommodate new symbolic systems and relationships.

## 7. Open Questions/Assumptions

*   **Assumption:** The list of initial symbolic systems for seeding is well-defined (Astrology, Tarot, I Ching, Gene Keys, Human Design seem to be core based on Epic 1).
*   **Question:** What is the definitive source for each piece of symbolic data and correspondence to ensure consistency and avoid conflicting information?
*   **Question:** How deep should the initial seeding go for each system (e.g., for astrology, just planets and signs, or also decans, terms, etc.)?
*   **Question:** What are the primary query patterns anticipated for the `bimba_map`? This will influence indexing and model optimization.

## 8. Progress Notes & Iterations

*   **[Date] - v0.1:** Initial draft created by EpiLogos Story Steward.

---
**Next Steps:** Review against `story-draft-checklist.md`. This story lays the groundwork for the universal knowledge base. The subsequent story in this feature will likely focus on how the Mahamaya Matrix (user-specific data) interacts with or queries the `bimba_map`.