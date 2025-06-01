# AI Builder Prompt Package: Epic 2, Feature 3, Story 1 - Advanced Symbolic Synthesis Engine

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 3 - Advanced Symbolic Synthesis Engine
**Story:** E2_F3_S1 - Advanced Symbolic Synthesis Engine for Archetypal Integration (Jungian & Saivist Informed)

## 1. Context & Objective

This document outlines requirements for an AI code/system design generation task to develop the **Story E2_F3_S1: Advanced Symbolic Synthesis Engine**. This is a backend engine/pipeline designed to intelligently synthesize multiple layers of symbolic information (tarot, decans, natal chart, transits, `bimba_map` correspondences) into coherent, actionable, and deeply personalized guidance. The aim is to foster user individuation and self-recognition (Pratyabhijna), informed by Jungian psychology and Kashmir Saivism.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F3_S1_advanced_symbolic_synthesis_engine.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`
*   **Bimba Map Concept/Schema:** (Reference relevant `bimba_map` documentation, e.g., from E1_F2_S2)
*   **Dependent Story Details:** Implicitly, details from E2_F1_S1, E2_F1_S2, E2_F1_S3, E2_F1_S4, E2_F2_S3 regarding data inputs.

## 3. Technical Context & Assumptions

*   **Backend Focus:** This is primarily a backend system. Technologies might include Python, Node.js, or another suitable language for data processing and API development.
*   **Database Integration:**
    *   Neo4j for `bimba_map` (knowledge graph traversal).
    *   MongoDB or similar for user data, session data, potentially cached interpretations.
*   **LLM Integration:** Likely involves crafting prompts and interacting with an LLM (e.g., via a "Parashakti Agent" abstraction) for narrative generation and nuanced interpretation.
*   **Microservices Architecture:** The engine might be a standalone service or part of a larger microservices ecosystem managed by BPMCP.
*   **Data Inputs:** The engine will receive structured data representing tarot cards, decans, astrological transits, natal chart data, and `bimba_map` queries/results.

## 4. Constraints & Considerations

*   **Complexity of Synthesis:** The core challenge is creating a robust and meaningful synthesis logic.
*   **LLM Prompt Engineering:** Effective use of LLMs will require sophisticated prompt design.
*   **Performance:** Synthesis needs to be timely for user-facing applications.
*   **Modularity & Extensibility:** Design for future additions of symbolic systems.
*   **Psychological & Philosophical Depth:** The output must be more than just data aggregation; it needs to offer genuine insight aligned with Jungian and Saivist principles.

## 5. Input for AI Code Generation / System Design

1.  **Story Definition File Content:** (Content of `story_E2_F3_S1_advanced_symbolic_synthesis_engine.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **EFDD/PRD File Content:** (Content of `efdd.md`)
4.  **Conceptual Data Model for Inputs (Illustrative - 'Archetypal Constellation Object'):**
    ```json
    {
      "userId": "user-123",
      "triggerEvent": "OracleCardDraw", // or "DailyReflection", "IdentityDynamicQuery"
      "inputs": {
        "tarotCard": {
          "name": "The Magician",
          "keywords": ["Willpower", "Manifestation", "Skill", "Action"],
          "decanAssociation": "Aries I (Mars)" // Example from bimba_map
        },
        "activeDecans": {
          "solarDecan": "Aries I (Mars)",
          "lunarDecan": "Taurus II (Moon)"
        },
        "natalChartHighlights": {
          "sun": {"sign": "Leo", "decan": "Leo II (Jupiter)"},
          "moon": {"sign": "Scorpio", "decan": "Scorpio I (Mars)"},
          "relevantAspects": ["Sun trine Mars", "Moon square Saturn"]
        },
        "currentTransits": {
          "majorTransits": [
            {"planet": "Saturn", "aspect": "conjunction", "natalPlanet": "Moon", "significance": "Period of emotional maturation and responsibility"}
          ],
          "planetaryHourRuler": "Mercury"
        },
        "bimbaMapQueries": [
          {"queryType": "decanToChakra", "decan": "Aries I (Mars)", "result": {"chakra": "Manipura", "theme": "Action, Will"}},
          {"queryType": "decanToBodyResonance", "decan": "Taurus II (Moon)", "result": {"bodyArea": "Throat, Neck", "sensation": "Groundedness, Sensual awareness"}}
        ]
      }
    }
    ```

## 6. Expected Outputs from AI Code Generation / System Design

This task is more about system architecture, API design, and core logic definition than specific UI components.

1.  **System Architecture Diagram/Description:**
    *   High-level components of the Synthesis Engine (e.g., Data Ingestion Module, `bimba_map` Query Module, Pattern Recognition Module, LLM Interaction Module, Output Formatting Module).
    *   Data flow between these modules.
    *   Interaction with external services (Neo4j, LLM Agent, other data sources).
2.  **API Definition (e.g., OpenAPI Specification):**
    *   Endpoint for requesting symbolic synthesis (e.g., `POST /synthesize-archetypal-guidance`).
    *   Request body schema (similar to the 'Archetypal Constellation Object' above).
    *   Response body schema, including structured symbolic data and/or narrative guidance.
    ```json
    // Example Response Snippet
    {
      "synthesisId": "unique-synthesis-id",
      "primaryArchetypalTheme": "Embracing Transformative Action through Conscious Will",
      "keyInsights": [
        {"layer": "Tarot (The Magician)", "insight": "A call to harness your skills and actively shape your reality.", "relevance": "High"},
        {"layer": "Solar Decan (Aries I)", "insight": "Current energies support bold new beginnings and direct action.", "relevance": "High"},
        {"layer": "Natal Sun in Leo / Transit Interaction", "insight": "Your innate creative fire (Leo Sun) is amplified by the current Aries energy, urging authentic self-expression.", "relevance": "Medium"}
      ],
      "narrativeGuidance": "The Magician appears today, mirrored by the fiery Aries decan, inviting you to step into your power. This is a potent time for manifestation, where your will, aligned with the archetypal energies of initiative, can bring forth new realities. Your Leo Sun resonates with this call to create, while Saturn's touch to your natal Moon asks for emotional maturity in how you wield this power... Consider how the Manipura chakra, energized by Aries I, can fuel your endeavors. This is a moment of Pratyabhijna – recognizing your inherent capacity to co-create with the cosmos...",
      "suggestedReflections": [
        "How can I consciously direct my will today?",
        "What new project or intention feels most alive for me now?"
      ],
      "linkedBimbaMapNodes": ["decan:AriesI", "chakra:Manipura", "tarot:Magician"]
    }
    ```
3.  **Core Synthesis Logic Pseudocode/Description:**
    *   Outline of the steps involved in processing the input data.
    *   How different data layers are weighted or prioritized.
    *   How `bimba_map` graph traversals might identify connections.
    *   Example prompt structures for the LLM if used for narrative generation, emphasizing Jungian/Saivist perspectives (individuation, Self, consciousness as Spanda).
4.  **Data Model Definitions (e.g., for internal processing stages):**
    *   Intermediate data structures used within the pipeline.
5.  **Testing Strategy Outline:**
    *   How the quality and relevance of synthesized outputs will be evaluated.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Design an Advanced Symbolic Synthesis Engine as a backend system, as per Story E2_F3_S1. The engine's purpose is to synthesize multi-layered symbolic data (tarot, astrology, `bimba_map`) into personalized guidance fostering individuation, informed by Jungian psychology and Kashmir Saivism.

**Key Deliverables:**

1.  **System Architecture:**
    *   Provide a high-level architectural diagram or a textual description of the engine's main modules (e.g., Data Ingestion, `bimba_map` Querier, Archetypal Pattern Recognizer, LLM Integration, Output Formatter) and their interactions.
    *   Describe the data flow through the engine.

2.  **API Definition:**
    *   Define a primary API endpoint (e.g., `POST /synthesize-archetypal-guidance`) using a conceptual OpenAPI-like structure.
    *   Specify the request schema, using the provided 'Archetypal Constellation Object' as a basis for input.
    *   Specify the response schema, including fields for key themes, layered insights, narrative guidance (to be generated by an LLM), reflective prompts, and linked `bimba_map` entities. Provide an example response.

3.  **Core Synthesis Logic Outline:**
    *   Describe the key steps the engine would take to synthesize the input data into meaningful guidance.
    *   How would it identify primary archetypal themes from the combined inputs?
    *   How might it use `bimba_map` (Neo4j graph) to find deeper connections?
    *   Provide an example of a sophisticated prompt structure for an LLM (acting as a 'Parashakti Agent') to generate the narrative guidance. This prompt should instruct the LLM to adopt a tone and perspective aligned with Jungian individuation and Saivist concepts of consciousness (e.g., Spanda, Pratyabhijna, the psyche's journey to Self-recognition).

4.  **Key Data Models (Conceptual):**
    *   Briefly describe any important internal data models the engine might use during its synthesis process.

5.  **Modularity and Extensibility:**
    *   Briefly explain how the engine's design would support future expansion with new symbolic data layers or analytical modules.

**Focus on the conceptual design, API, and the logic/philosophy of synthesis. Detailed code implementation is not required for this step, but the design should be clear enough to guide implementation.**
```

## 8. Review & Next Steps

*   Review the generated system design for coherence, completeness, and alignment with psych-spiritual goals.
*   Refine API specifications and data models.
*   Begin implementation of core modules, starting with data ingestion and `bimba_map` integration.
*   Develop and iterate on LLM prompts for narrative generation.
*   Establish a robust testing framework.