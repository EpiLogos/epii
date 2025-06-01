# AI Builder Prompt Package: E3_F3_S1 - External Knowledge Base Integration for Symbolic Enrichment

## 1. Core Context & Objective

**Project:** Nara - An AI-augmented platform for self-discovery and individuation, integrating Tarot, Astrology, Jungian Psychology, and Saivist Philosophy.
**Epic:** 3 - Tarot-Alchemical Crucible & Journal Synthesis
**Feature:** F3 - Integration with External Knowledge Bases - The Alchemical Library
**User Story:** E3_F3_S1 - External Knowledge Base Integration for Symbolic Enrichment (Jungian & Saivist Informed)

**Objective of this Story:** To enable Nara to query curated external knowledge bases (e.g., APIs for mythology, symbology, `sacred-texts.com`) when significant symbols or themes are identified in a user's journal or Oracle readings. This will provide cultural amplifications, archetypal parallels, and historical context from diverse traditions, enriching the user's personal insights by connecting them to the collective unconscious and the multifaceted expressions of universal Consciousness (Cit-Shakti).

## 2. Story Definition (from `story_E3_F3_S1.md`)

**As a** User seeking deeper understanding of symbols and themes emerging in my journal or Oracle readings, recognizing these as expressions of my individuation journey and manifestations of universal Consciousness (Paramashiva),
**I want** Nara to be able to query curated external knowledge bases (e.g., APIs for mythology, symbology, `sacred-texts.com` archives, academic resources) when a symbol or theme is identified, providing cultural amplifications and archetypal parallels from diverse traditions,
**So that** I can access a broader range of interpretations, historical context, and cross-cultural associations, enriching my personal insights by connecting them to the collective unconscious and witnessing the multifaceted play of Cit-Shakti across different symbolic languages.

**Key Acceptance Criteria Highlights:**

*   Identify queryable symbols/themes from journal/Oracle that resonate with universal patterns.
*   Define a curated list of external knowledge bases (APIs, archives) and query protocols.
*   Formulate and execute effective search queries.
*   Retrieve, parse, and extract relevant information (definitions, myths, cultural associations).
*   Present supplementary information clearly in the UI, with attribution.
*   Filter/rank retrieved information for relevance and thematic coherence.
*   Handle errors and fallbacks gracefully.
*   Comply with external sources' terms of service.

## 3. Technical Context & Design Considerations

*   **System Component:** Primarily a backend module responsible for interfacing with external APIs/sources, with frontend components for displaying the retrieved information.
*   **Building on E3_F2:** Assumes that symbols, themes, and archetypes are already being identified by the Journal Synthesis Engine (E3_F2_S1, E3_F2_S2).
*   **External Source Management:**
    *   Maintain a configurable list of external sources, including API endpoints, authentication details (if any), query parameters, and data parsing instructions.
    *   Consider a plugin-style architecture to easily add new sources.
*   **Query Strategy:**
    *   For a given symbol (e.g., "Serpent"), the system might query multiple sources.
    *   Query terms may need normalization or expansion (e.g., "snake," "dragon," "ouroboros" for "Serpent").
*   **Data Parsing and Normalization:** External sources will return data in various formats (JSON, XML, HTML). Robust parsing logic is needed for each source type. The goal is to extract key pieces of information (e.g., description, associated myths, cultural significance) into a standardized internal format.
*   **Relevance Filtering:** This is crucial to avoid overwhelming the user. Techniques might include:
    *   Keyword matching against the user's original journal context.
    *   Prioritizing information from sources deemed more authoritative or aligned with Nara's philosophical underpinnings.
    *   Summarization of longer texts.
*   **Caching:** Implement caching for responses from external APIs to reduce redundant calls, manage rate limits, and improve performance.
*   **Presentation Layer:** Information should be presented as supplementary. For example, if Nara identifies a "Moon" symbol in a journal, alongside its `bimba_map` associations, there could be an expandable section: "Cultural Amplifications for 'Moon' (from external sources)" showing snippets from mythological databases or symbolic dictionaries.
*   **Saivist Lens:** Frame the diverse cultural expressions as different facets of the same universal Consciousness (Cit) playing out in myriad forms (Lila). The goal is to see the underlying unity (Paramashiva) in the diversity of symbols.

## 4. Constraints & Challenges

*   **Reliability of External Sources:** APIs can change, go down, or alter their data formats.
*   **Varying Data Quality:** Information from external sources can vary in accuracy and depth.
*   **Information Overload:** Presenting too much external information can be counterproductive.
*   **Terms of Service & Copyright:** Strict adherence to the usage policies of external data providers is essential.
*   **Parsing Complexity:** Handling diverse data formats, especially scraping HTML if APIs are not available, can be complex and brittle.

## 5. Inputs for AI Builder (You, the Generative AI)

1.  **This Document (E3_F3_S1_prompt_package.md):** Provides overall context and requirements.
2.  **User Story File:** `story_E3_F3_S1_external_knowledge_base_integration.md` (content provided above).
3.  **Identified Symbol/Theme (Input from E3_F2):**
    *   Example: `{ "symbol": "Tree", "context": "Dreamt of a giant tree with roots reaching deep and branches to the sky.", "source": "journal_entry_789" }`
4.  **Conceptual List of External Knowledge Bases (Illustrative):**
    *   **Source 1: Mythology API (Fictional)**
        *   Endpoint: `https://api.mythology.example.com/v1/symbols/{symbol_name}`
        *   Auth: API Key
        *   Output: JSON (e.g., `{"name": "Yggdrasil", "culture": "Norse", "description": "The World Tree..."}`)
    *   **Source 2: Sacred-Texts.com Archive (Conceptual Access Layer)**
        *   Access Method: Internal scraper/parser targeting specific sections or search functionality.
        *   Output: HTML snippets, parsed text.
    *   **Source 3: Symbolic Dictionary API (Fictional)**
        *   Endpoint: `https://api.symboldict.example.com/search?term={symbol_name}`
        *   Output: JSON (e.g., `[{"symbol": "Tree of Life", "meaning": "Connection between heaven and earth..."}]`)
5.  **Illustrative Output (Structured JSON for internal use before UI rendering):**
    ```json
    {
      "queriedSymbol": "Tree",
      "sourceSymbolContext": "Dreamt of a giant tree with roots reaching deep and branches to the sky.",
      "externalAmplifications": [
        {
          "sourceName": "MythologyAPI",
          "retrievedTimestamp": "2023-10-27T14:00:00Z",
          "content": [
            {
              "title": "Yggdrasil (Norse Mythology)",
              "snippet": "Yggdrasil is an immense ash tree that is central in Norse cosmology... its branches extend far into the heavens, and the tree is supported by three roots that extend far away into other locations...",
              "relevanceScore": 0.85,
              "link": "https://mythology.example.com/yggdrasil"
            }
          ]
        },
        {
          "sourceName": "SymbolicDictionaryAPI",
          "retrievedTimestamp": "2023-10-27T14:01:00Z",
          "content": [
            {
              "title": "Tree of Life",
              "snippet": "The Tree of Life is a widespread archetype in many mythologies, religious and philosophical traditions. It relates to the concept of interconnectedness of all life on our planet and serves as a metaphor for common descent in the evolutionary sense.",
              "relevanceScore": 0.9,
              "link": "https://symboldict.example.com/tree_of_life"
            }
          ]
        },
        {
          "sourceName": "SacredTextsArchive",
          "retrievedTimestamp": "2023-10-27T14:05:00Z",
          "content": [
            {
              "title": "The Bodhi Tree (Buddhism)",
              "snippet": "...Siddhartha Gautama, attained enlightenment (bodhi) under a pipal tree, thereafter known as the Bodhi tree... a symbol of awakening and liberation.",
              "relevanceScore": 0.75,
              "sourceReference": "From 'Buddhist Sacred Texts', Chapter X"
            }
          ]
        }
      ],
      "summaryForUser": "The symbol 'Tree' in your dream resonates with powerful archetypes like the World Tree (Yggdrasil in Norse myth), the Tree of Life representing interconnectedness, and the Bodhi Tree of enlightenment. These diverse traditions see the tree as a connection between realms, a source of life, and a path to wisdom."
    }
    ```

## 6. Expected Outputs from AI Builder (You)

1.  **System Architecture for External Integration:**
    *   Describe the components: Source Manager, Query Engine, Parser/Normalizer, Relevancy Filter, Caching Layer.
2.  **External Source Management Strategy:**
    *   How to define and configure external sources (e.g., a JSON/YAML config file format).
    *   How to handle authentication and rate limiting for different sources.
3.  **Query Formulation and Execution Logic (Pseudocode/High-Level Description):**
    *   How to take an internal symbol/theme and generate appropriate queries for different types of external sources.
4.  **Data Parsing and Normalization Strategy:**
    *   General approaches for extracting key information from diverse formats (JSON, XML, HTML).
    *   Define a standardized internal format for storing retrieved amplifications.
5.  **Relevance Filtering and Ranking Algorithm (Conceptual):**
    *   Suggest methods to score or rank the relevance of retrieved information based on the user's context or Nara's thematic focus.
6.  **Data Model for Storing/Presenting External Amplifications (Refine/Expand JSON example):**
    *   JSON schema for the structured data containing symbol, context, and list of amplifications from various sources, including metadata like source name, timestamp, relevance, and original link.
7.  **Key Function/Module Definitions (Python-like Pseudocode):**
    *   `def get_external_amplifications(symbol: str, context: str) -> dict:` (main orchestrator)
    *   `def query_external_source(source_config: dict, symbol: str) -> list[dict]:`
    *   `def parse_source_response(source_config: dict, response_data) -> list[dict]:`
    *   `def filter_and_rank_amplifications(amplifications: list[dict], context: str) -> list[dict]:`
8.  **Caching Strategy:** How and what to cache to optimize performance and API usage.
9.  **UI Presentation Ideas (Descriptive):** How to integrate this external information seamlessly and non-intrusively.
10. **Ethical Handling and Attribution:** Reinforce best practices.
11. **Documentation Snippets:** Key comments for the proposed logic.

## 7. AI Builder Prompt

"Okay, Nara AI Builder, based on User Story E3_F3_S1, design the 'External Knowledge Base Integration' system. This system will query external sources like mythology APIs and symbolic dictionaries to provide cultural and archetypal amplifications for symbols/themes identified in Nara.

Please provide:

1.  **System Architecture:** Components for managing sources, querying, parsing, filtering, and caching.
2.  **External Source Management Strategy:** Configuration and handling of diverse sources.
3.  **Query Formulation and Execution Logic.**
4.  **Data Parsing and Normalization Strategy.**
5.  **Relevance Filtering and Ranking Algorithm (Conceptual).**
6.  **Refined Data Model (JSON Schema) for external amplifications.**
7.  **Key Function Definitions (Python-like Pseudocode).**
8.  **Caching Strategy.**
9.  **Descriptive UI Presentation Ideas.**
10. **Notes on Ethical Handling and Attribution.**
11. **Key Documentation Snippets.**

Focus on creating a flexible and robust system that can enrich user understanding by connecting personal symbols to the broader human experience, viewed through Jungian and Saivist lenses. The system should be respectful of external data sources and prioritize clear, relevant presentation to the user."