# User Story: E3_F4_S2 - Interactive Visualizations in the Crucible UI

**Epic:** 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** F4 - User Interface for Alchemical Work - The Crucible Interface
**Story ID:** E3_F4_S2

**As a** User working within the Alchemical Crucible interface,
**I want** access to interactive visualizations, such as a dynamic representation of relevant parts of the `bimba_map` or a visual timeline illustrating my journey through detected alchemical phases,
**So that** I can gain a more intuitive and holistic understanding of the symbolic connections and personal transformations occurring in my process.

**Acceptance Criteria:**

1.  **Dynamic `bimba_map` Visualization (Contextual):**
    *   When a key symbol, archetype, or theme is active (e.g., from an Oracle reading or journal insight), the UI should offer an option to view its connections within a simplified, interactive visualization of the `bimba_map`.
    *   This visualization should highlight the active element and its immediate, relevant relationships (e.g., to other symbols, Tarot cards, decans, planetary energies).
    *   Users should be able to click on connected nodes to get more information or navigate to related content within Nara.
2.  **Alchemical Phase Timeline (Optional but Desirable):**
    *   If the system tracks detected alchemical phases (from E3_F2_S3) over time, provide a visual timeline where users can see the sequence and duration of these phases as reflected in their journal entries.
    *   This timeline could be annotated with key events or insights from the journal.
3.  **Clarity and Intuitiveness:** Visualizations must be clear, aesthetically pleasing, and easy to understand, even for users not familiar with graph theory or complex diagrams.
4.  **Interactivity:** Users should be able to interact with the visualizations (e.g., zoom, pan, click on elements for more details).
5.  **Integration with Crucible UI:** Visualizations should be seamlessly integrated into the Alchemical Crucible UI (E3_F4_S1), appearing in contextually relevant places.
6.  **Performance:** Visualizations should load reasonably quickly and not degrade the performance of the application.
7.  **Data Source:** Visualizations will draw data from the `bimba_map` (Neo4j) and the processed journal data (alchemical phase tagging).

**Dependencies:**

*   Story E3_F4_S1 (Alchemical Crucible UI Design) for the overall interface framework.
*   Story E3_F2_S3 (Dynamic Symbolic Metabolism & Alchemical Phase Detection) for phase data.
*   A well-structured and queryable `bimba_map`.
*   A suitable front-end library for rendering interactive graphs/visualizations (e.g., D3.js, Vis.js, or similar).

**Notes:**

*   These visualizations aim to make abstract symbolic connections and temporal patterns more tangible and accessible.
*   The `bimba_map` visualization is not intended to display the entire map at once, but rather contextually relevant subgraphs.
*   The alchemical phase timeline can provide a powerful reflective tool for users to see their progress and patterns over time.
*   Start with one core visualization (e.g., contextual `bimba_map` snippets) and potentially add others later.