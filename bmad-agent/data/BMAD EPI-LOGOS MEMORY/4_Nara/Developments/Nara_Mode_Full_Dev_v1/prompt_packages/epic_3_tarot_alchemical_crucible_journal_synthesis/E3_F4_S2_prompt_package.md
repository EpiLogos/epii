# AI Builder Prompt Package: E3_F4_S2 - Interactive Visualizations in the Crucible UI

## 1. Overview

**Story ID:** E3_F4_S2
**Epic:** 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** F4 - User Interface for Alchemical Work - The Crucible Interface
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Generate a design and development plan for interactive visualizations within the "Alchemical Crucible" UI, specifically focusing on dynamic `bimba_map` representations and a potential alchemical phase timeline.

## 2. Story Definition

**As a** User working within the Alchemical Crucible interface,
**I want** access to interactive visualizations, such as a dynamic representation of relevant parts of the `bimba_map` or a visual timeline illustrating my journey through detected alchemical phases,
**So that** I can gain a more intuitive and holistic understanding of the symbolic connections and personal transformations occurring in my process.

## 3. Technical Context & Design Philosophy

*   **Focus:** Frontend development of interactive visualizations, building upon the Alchemical Crucible UI (E3_F4_S1).
*   **Core Visualizations:**
    *   **Contextual `bimba_map` Snippets:** When a key symbol/archetype is active (from Oracle or Journal), display a simplified, interactive graph showing its immediate, relevant connections within the `bimba_map`. Nodes should be clickable for more info/navigation.
    *   **Alchemical Phase Timeline (Optional but Desirable):** If alchemical phases (from E3_F2_S3) are tracked, visualize their sequence and duration based on journal entries, potentially annotated with key insights.
*   **Interactivity:** Users must be able to interact (zoom, pan, click) with visualizations.
*   **Clarity & Aesthetics:** Visualizations must be clear, intuitive, and aesthetically aligned with the Crucible's theme.
*   **Data Sources:** `bimba_map` (likely Neo4j, requiring specific queries to fetch subgraphs) and processed journal data (for phase tagging).
*   **Technology:** Requires a frontend library for interactive graphs (e.g., D3.js, Vis.js, Sigma.js, React Flow, or similar).
*   **Saivist Philosophical Lens:** Visualizations should not merely present data but evoke a sense of wonder at the interconnectedness of symbols and the unfolding patterns of one's own consciousness. They are maps of the *lila*, revealing the playful dance of energies within and without.

## 4. Constraints and Challenges

*   **`bimba_map` Complexity:** Visualizing even subgraphs of a complex `bimba_map` effectively without overwhelming the user.
*   **Data Fetching & Processing:** Efficiently querying the `bimba_map` (e.g., Neo4j) for contextual subgraphs and formatting data for the chosen visualization library.
*   **Performance:** Ensuring visualizations are responsive and don't degrade app performance, especially with potentially large datasets or complex graphs.
*   **Intuitiveness:** Designing interactions that are immediately understandable.
*   **Library Selection:** Choosing the right visualization library that balances features, performance, and ease of integration.
*   **Timeline Data Representation:** If implementing the phase timeline, effectively representing temporal data and annotations.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **Crucible UI Design (E3_F4_S1):** Key mockups/wireframes of the Alchemical Crucible interface where these visualizations will be embedded.
3.  **`bimba_map` Structure (Conceptual):** A simplified schema or example of `bimba_map` nodes and relationships (e.g., `(:Symbol {name: "Sun"})-[:ASSOCIATED_WITH]->(:TarotCard {name: "The Sun"})`).
4.  **Example `bimba_map` Query & Result (Conceptual):**
    *   *Query Idea:* "Given symbol 'Serpent', find directly connected symbols, Tarot cards, and alchemical principles."
    *   *Expected Result (JSON for visualization):* `{ "nodes": [{"id": "serpent", "label": "Serpent", "type": "symbol"}, {"id": "tarot_death", "label": "Death (Tarot)", "type": "tarot"}], "edges": [{"from": "serpent", "to": "tarot_death", "label": "transforms"}] }`
5.  **Alchemical Phase Data (Conceptual):** Example of how phase data might be stored or retrieved (e.g., `[{ "date": "YYYY-MM-DD", "phase": "Nigredo", "journal_excerpt_id": "..." }]`).
6.  **Illustrative Scenarios for Visualization Triggering:**
    *   User views a Tarot card in an Oracle reading; an option "Explore in `bimba_map`" appears.
    *   Journal Synthesis identifies "Moon" as a key symbol; a `bimba_map` snippet showing connections to "Moon" is displayed.

## 6. Expected Outputs from AI Builder (Design & Plan)

1.  **Visualization Design Mockups/Prototypes:**
    *   Detailed mockups for the contextual `bimba_map` visualization, showing node styles, edge styles, interaction points (e.g., on-hover info, on-click actions).
    *   Mockups for the Alchemical Phase Timeline (if pursued), showing its appearance and how data is presented.
2.  **Choice of Visualization Library:** Recommendation for a frontend visualization library (e.g., D3.js, Vis.js, React Flow) with justification based on project needs (interactivity, data binding, performance, theming capabilities).
3.  **Data Flow Diagrams:** How data from `bimba_map` (Neo4j) and journal analysis will be fetched, processed, and fed into the visualizations.
4.  **Interaction Design for Visualizations:**
    *   Specifics on zoom, pan, click behaviors.
    *   How users navigate from a visualization node to other parts of Nara (e.g., detailed symbol page, relevant journal entry).
5.  **`bimba_map` Query Strategy (Conceptual):** Examples of Cypher queries (if Neo4j) or other database queries needed to extract relevant subgraphs for visualization based on context (e.g., active symbol, Tarot card).
6.  **Component Design:** How the visualization(s) will be structured as frontend components and integrated into the E3_F4_S1 Crucible UI.
7.  **Performance Considerations & Optimization Strategies:** How to ensure visualizations remain performant (e.g., data limiting, rendering strategies, lazy loading).
8.  **Theming and Aesthetics:** How the visualizations will align with the overall "alchemical crucible" theme.
9.  **Saivist Philosophical Integration in Visualizations:** How the visual representation of interconnectedness and temporal flow can reflect Saivist principles.
10. **Fallback/Error Handling:** What to display if data is unavailable or a visualization cannot be rendered.
11. **Documentation Structure:** Outline for documenting the visualization components and their data requirements.

## 7. Prompt for Generative AI

```
As an expert frontend developer and data visualization specialist, focusing on creating intuitive and meaningful interactive experiences, design the interactive visualizations for the Nara application's "Alchemical Crucible" UI, as per User Story E3_F4_S2.

Your primary tasks are to design:
1.  A **Contextual `bimba_map` Visualization:** This should dynamically display relevant subgraphs of the `bimba_map` when a user interacts with key symbols, archetypes, or themes from Oracle readings or journal insights. Users should be able to click nodes for more information or navigation.
2.  (Optional but Desirable) An **Alchemical Phase Timeline:** This would visually represent the user's journey through detected alchemical phases over time, based on their journal entries.

Deliver the following:

1.  **Visualization Design Mockups/Prototypes:** Detailed visual designs for both the `bimba_map` snippets and the (optional) phase timeline. Specify node/edge styles, interaction cues, and overall aesthetic.
2.  **Recommended Visualization Library:** Propose a suitable JavaScript library (e.g., D3.js, Vis.js, React Flow, Sigma.js) and justify your choice based on interactivity, performance, theming, and integration with a modern frontend framework (assume React if no other is specified).
3.  **Data Flow & Query Strategy:** Describe how data will be fetched from backend sources (assume `bimba_map` is in Neo4j and journal phase data is available) and processed for visualization. Provide conceptual Cypher query examples for fetching contextual `bimba_map` subgraphs.
4.  **Interaction Design:** Detail user interactions (zoom, pan, click, hover) and how these link to other parts of the Nara application.
5.  **Component Integration Plan:** Explain how these visualizations will be structured as frontend components and integrated into the existing Alchemical Crucible UI (designed in E3_F4_S1).
6.  **Performance & Optimization:** Outline strategies to ensure the visualizations are performant and responsive.
7.  **Theming & Aesthetics:** Ensure the visualizations align with the "alchemical crucible" theme and Saivist philosophical underpinnings (emphasizing interconnectedness and transformative flow).
8.  **Fallback/Error Handling:** Describe how the UI will handle cases where visualization data is unavailable or errors occur.

Your output should provide a clear plan for developing these interactive visualizations, making complex symbolic data more accessible and insightful for the user.
```