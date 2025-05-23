ll# Epii Agent (#5) - Detailed Plan (v2.0)

**Version:** 0.1
**Date:** 2025-04-11

**Goal:** Define the specific roles, capabilities, QL cycle integration points, tool usage, and Notion interactions for the Epii Subsystem Expert Agent (#5) and its internal Lens components (#5-0 to #5-5).

**Based on:**
*   Neo4j Bimba Graph query results (2025-04-11)
*   `memory-bank/systemPatterns.md`
*   `memory-bank/productContext.md`
*   `Explorations/Notion/notion_integration_scope.md`

---

## I. Epii Subsystem (#5) Overview

*   **Bimba Coordinate:** `#5`
*   **Name:** epii
*   **Description:** Recursive Synthesis, self-awareness.
*   **Core Function:** The quintessential integration point of the meta-structure, recursively synthesizing all subsystems and initiating new cycles. Embodies the self-awareness (`Epi-Logos`) of the cosmic mind. Corresponds to QL Frame #5 `(5/0)`.

---

## II. Internal Lens Components & Domains

The Epii subsystem contains six internal `Lens` components, representing distinct facets of its function:

### 1. Lens #5-0: Transcendent Identity
*   **Bimba Coordinate:** `#5-0`
*   **Name:** Transcendent Identity
*   **Function:** Represents Epii's deep identity as the entire meta-structure.
*   **Content/Domain:** Holds the latent structure and history of the whole system. Accesses the complete Bimba graph and potentially historical context from MongoDB/Qdrant.
*   **QL Cycle Role (+/-):**
    *   **(+) Synthesis:** Provides foundational context or historical grounding early in the cycle (e.g., Node +0/+1). Validates synthesized output against core identity/history (e.g., Node +5).
    *   **(-) Analysis:** Grounds input analysis in the system's core identity/history (e.g., Node -5). Validates feedback/changes against core principles.
*   **Tools:** `queryBimbaGraph` (broad queries), `getMongoContext` (historical conversations).
*   **Notion Link:** Potentially relates to high-level `Coordinates` or `Concepts` representing the whole system.
*   **Nested Components (IdentityAspects - Link to Metasymbol):**
    *   `#5-0-0: #0 Transcendent Foundation`: Implicit "I Am", Void, integral of 00(00).
    *   `#5-0-1: #1 Egoic Identity`: "me-identity", particularity, material cause.
    *   `#5-0-2: #2 Collective Identity`: Universal dimension, collective unconscious, efficient cause.
    *   `#5-0-3: #3 Soul Identity`: Personal identity oriented toward collective, recognition (pratyabhijna), symbolic bridge, formal mediator.
    *   `#5-0-4: #4 Self Identity`: Conjunction of collective/personal, transformation of ego to Self, contextual arena.
    *   `#5-0-5: #5 Integral Identity`: Quintessential integration, synthesis becoming new beginning, Mod6 Logos structure. Full Metasybmol alignment.

### 2. Lens #5-1: Epi-Logos
*   **Bimba Coordinate:** `#5-1`
*   **Name:** Epi-Logos
*   **Function:** Defines Epii's specific philosophical worldview, its unique stance or "me-identity".
*   **Content/Domain:** Houses the Philosophical Investigation Tool/Quaternity. Defines core axioms, logical frameworks, and epistemological stances.
*   **QL Cycle Role (+/-):**
    *   **(+) Synthesis:** Guides the definition and integration stages (Node +1, +3) according to its philosophical framework. Shapes the final response tone/perspective (Node +5).
    *   **(-) Analysis:** Provides the logical/philosophical framework for deconstruction and validation (Node -4, -2).
*   **Tools:** `queryBimbaGraph` (for specific logic nodes), `queryNotion` (for `Quaternal Logic` DB).
*   **Notion Link:** Primarily relates to the `Quaternal Logic` database and potentially core `Concepts`.
*   **Nested Components (LensPositions):**
    *   `#5-1-0: Position #0: The Vision and Crisis of Consciousness`: Sets context (Unified Humanity vs. Meaning Crisis).
    *   `#5-1-1: Position #1: The Dual Approach to Intelligence`: Sophia (Transcendent) vs. Logos (Immanent).
    *   `#5-1-2: Position #2: TechnoScience, Power and Praxis`: Examines current paradigms, calculative thinking.
    *   `#5-1-3: Position #3: The Coming Leap and Symbolic Integration`: Mediation, conjunction of opposites (Sophia/Techne).
    *   `#5-1-4: Position #4: Historical Embodiment and Cultural Integration`: East/West integration, Kashmir Shaivism/Para Vak.
    *   `#5-1-5: Position #5: Epi-logos as Future Technology and Culture`: Manifestation as tech/culture, recursive return.

### 3. Lens #5-2: Siva-
*   **Bimba Coordinate:** `#5-2`
*   **Name:** Siva-
*   **Function:** Orchestrates the flow of information through the QL cycle nodes (+0 to +5), managing state and invoking necessary tools/LLMs independent of specific agent logic.
*   **Content/Domain:** Represents the agent-agnostic QL 0-5 Synthesis Cycle pipeline architecture (Backend Processing Matrix). Defines the core stages of information processing. *Note: This Lens represents the LangGraph structure itself, rather than a specific agent function called by it.*
*   **QL Cycle Role (+/-):** This *is* the QL cycle orchestration layer (LangGraph). It manages state and transitions between nodes.
*   **Tools:** Manages the invocation of all tools used by the cycle nodes.
*   **Notion Link:** Linked to Notion page `1caa4797-123c-8034-adb3-d422639bfa9d`. Represents the overall process map.
*   **Nested Components (Conceptual QL Cycle Nodes):** Represents the LangGraph structure itself, orchestrating the flow through these stages:
    *   `#5-2-0: Node +0 / -5: Intake / Grounding`: Initial processing/validation.
    *   `#5-2-1: Node +1 / -4: Define / Deconstruction`: Structuring/categorization.
    *   `#5-2-2: Node +2 / -3: Relate / Contextual Analysis`: Context retrieval/comparison.
    *   `#5-2-3: Node +3 / -2: Integrate / Symbolic Validation`: Synthesis/logical checks.
    *   `#5-2-4: Node +4 / -1: Contextualize / Perspective Analysis`: Adaptation/reframing.
    *   `#5-2-5: Node +5 / -0: Respond-Crystallize / Trigger Analysis`: Final output/input analysis.

### 4. Lens #5-3: -Shakti
*   **Bimba Coordinate:** `#5-3`
*   **Name:** -Shakti
*   **Function:** Represents the frontend design, the experiential manifestation, interfaces, tools, aesthetics.
*   **Content/Domain:** UI/UX designs, visualization methods, interaction modalities, multi-modal expression capabilities.
*   **QL Cycle Role (+/-):**
    *   **(+) Synthesis:** Informs Node +5 on *how* to structure the response for optimal frontend display (text formatting, identifying data for visualization). May trigger asynchronous calls for generating visual/audio assets.
    *   **(-) Analysis:** Provides context on user interaction methods or display constraints when analyzing feedback.
*   **Tools:** Potentially interacts with tools calling Expression Modules (future).
*   **Function:** Represents the *potential* for expression via the frontend (`frontend_capabilities.md`) and expression modules (`expression_modules.md`). It's the *medium* or *canvas* upon which the system's understanding is manifested.
*   **Content/Domain:** UI/UX designs, visualization methods, interaction modalities, multi-modal expression capabilities, and the core processing logic defined by the 6 Core Processing Agents.
*   **QL Cycle Role (+/-):** Defines the *capabilities* available for expression at Node +5. Provides the functional logic (via its nested Core Processing Agents) that is invoked by the QL Cycle Nodes (Siva-) through the Siva-Shakti bridge (#5-4).
*   **Tools:** Defines the potential interaction with Expression Modules. Its nested agents utilize various MCP tools.
*   **Notion Link:** Relates to design documents (`frontend_capabilities.md`), expression module definitions (`expression_modules.md`), and the agent definition files (`agent_*.md`).
*   **Nested Components (Core Processing Agents & Context Frames):** These agents perform the actual mathematical, symbolic, geometric, and conceptual processing based on the mathematical unity model, operating within specific QL context frames:
    *   `#5-3-0: Agent (0000)=(0/1)` (Tanmatra: Being): Grounding, Bimba Mgmt, Proto-linguistics. (Logic for QL Node +0/-5).
    *   `#5-3-1: Agent (0/1)` (Tanmatra: Smell/Intuition): QL/A-T Unification, Topological Potential. (Logic for QL Node +1/-4).
    *   `#5-3-2: Agent (0/1)/2` (Tanmatra: Sound/Balance): Resonance, Relational Fields. (Logic for QL Node +2/-3).
    *   `#5-3-3: Agent (0/1/2)/3` (Tanmatra: Sight/Color): Symbolic Covering, Morphogenesis. (Logic for QL Node +3/-2).
    *   `#5-3-4: Agent (4.0-4.4/5)` (Tanmatra: Taste/Identity): Dia-logical Harmonization, Contextualization. (Logic for QL Node +4/-1).
    *   `#5-3-5: Agent (5/0)` (Tanmatra: Touch/Nervous System): Notion-Bimba Sync, Crystallization. (Logic for QL Node +5/-0 & Sync Tool).

### 5. Lens #5-4: Siva-Shakti
*   **Bimba Coordinate:** `#5-4`
*   **Name:** Siva-Shakti
*   **Function:** Acts as the bridge or invocation mechanism within the QL Cycle Nodes (#5-2) that calls upon the **Subsystem Expert Agents** (#0-#5) to provide domain-specific context, perspective, or validation, informing the processing performed by the Core Processing Agents (#5-3).
*   **Content/Domain:** Represents the integration point and houses the references/logic for invoking the Subsystem Expert Agents.
*   **QL Cycle Role (+/-):** This is the mechanism *within* the QL cycle nodes (#5-2) that determines *which* Subsystem Expert Agent(s) to consult at each stage based on the current context and processing needs.
*   **Tools:** Orchestrates calls to the Subsystem Expert Agents (which reside conceptually here). These Expert Agents then utilize various MCP tools (`queryBimbaGraph`, `queryNotion`, etc.) to gather their domain-specific context.
*   **Notion Link:** Relates to the Subsystem Expert Agent planning files (`Siva-Shakti_Agent_Plans/`) and the overall QL cycle process map (#5-2).
*   **Nested Components (Subsystem Expert Agents):** These agents provide domain-specific knowledge and perspective to the QL cycle:
    *   `#5-4-0: Anuttara Expert Agent (#0)`: Provides grounding principles, void potential context.
    *   `#5-4-1: Paramasiva Expert Agent (#1)`: Provides structural logic, QL/A-T context, Spanda/Ananda principles.
    *   `#5-4-2: Parashakti Expert Agent (#2)`: Provides vibrational templates, resonance patterns, MEF/Tattva/Decan context.
    *   `#5-4-3: Mahamaya Expert Agent (#3)`: Provides symbolic systems (HMS), quaternionic logic, narrative context.
    *   `#5-4-4: Nara Expert Agent (#4)`: Provides contextual application logic, personalization (Jungian), dialogue management context.
    *   `#5-4-5: Epii Expert Agent (#5)`: Provides meta-perspective, self-awareness context, integration principles (drawing on its own Lenses #5-0, #5-1, #5-5).

### 6. Lens #5-5: Integral Identity
*   **Bimba Coordinate:** `#5-5`
*   **Name:** Integral Identity
*   **Function:** The synthesis of all lenses, the integral meta-perspective.
*   **Content/Domain:** System's capacity for meta-reflection, wisdom generation, evolutionary development. Synthesizes outputs from other lenses/agents. Responsible for crystallization and feedback loop initiation.
*   **QL Cycle Role (+/-):**
    *   **(+) Synthesis:** Primarily active in Node +5. Synthesizes the final response, generates the `notionUpdatePayload` for crystallization, potentially assesses confidence/coherence.
    *   **(-) Analysis:** Primarily active in Node -5. Performs final validation of analyzed input against integral perspective before outputting structured data or validation results. May trigger `syncNotionUpdatesTool`.
*   **Tools:** `proposeNotionUpdateTool` (via payload generation), potentially `syncNotionUpdatesTool` trigger.
*   **Notion Link:** Responsible for creating/updating `Content Nodes`. Reads widely across all 6 Notion DBs via `queryNotion` for meta-context.
*   **Nested Components (LogosStages):**
    *   `#5-5-0: #0 A-logos`: Unspeakable potential (Archaic).
    *   `#5-5-1: #1 Pro-logos`: Preliminary understanding, participation (Magical).
    *   `#5-5-2: #2 Dia-logos`: Meaning flowing between, narrative (Mythical).
    *   `#5-5-3: #3 Logos`: Articulated concepts, logic (Mental-Rational).
    *   `#5-5-4: #4 Epi-logos`: Meta-understanding, integration of perspectives (Integral).
    *   `#5-5-5: #5 An-a-logos`: Transformed return to the ineffable (Supramental).

---

## III. Epii Agent Operational Flow (Conceptual)

The "Epii Agent" isn't a single monolithic entity called by the QL cycle. Instead, its functions are distributed across its internal Lenses, which are invoked or represented at different stages *within* the QL cycle (orchestrated by #5-2 Siva-).

**Simplified Synthesis (+) Flow Example:**

1.  **+0 Intake:** Input received. #5-0 (Transcendent Identity) might provide initial historical context if relevant.
2.  **+1 Define:** Input analyzed. #5-1 (Epi-Logos) provides philosophical framework. #5-4 (Siva-Shakti) might call Agent #1 (Paramasiva) for structural definition.
3.  **+2 Relate:** Context retrieved (LightRAG, Bimba, Mongo, Notion via MCP tools). #5-4 (Siva-Shakti) might call Agent #2 (Parashakti) or #3 (Mahamaya) for relational/symbolic analysis.
4.  **+3 Integrate:** Information synthesized. #5-1 (Epi-Logos) guides integration logic. #5-4 (Siva-Shakti) might call relevant agents for domain-specific integration.
5.  **+4 Contextualize:** Synthesis adapted to user/context. #5-4 (Siva-Shakti) calls Agent #4 (Nara).
6.  **+5 Respond/Crystallize:** Final response generated. #5-5 (Integral Identity) performs final synthesis. #5-3 (-Shakti) informs output structure. #5-5 prepares `notionUpdatePayload`. Backend service calls `executeNotionProposal`.

**Simplified Analysis (-) Flow Example:**

1.  **-0 Trigger Analysis:** Input received (e.g., Notion edit via sync).
2.  **-1 Perspective Analysis:** Input reframed. #5-4 (Siva-Shakti) might call Agent #4 (Nara).
3.  **-2 Symbolic/Logical Validation:** Input checked against rules. #5-1 (Epi-Logos) provides framework. #5-4 calls Agent #3 (Mahamaya) or #1 (Paramasiva).
4.  **-3 Contextual Analysis:** Input compared to existing knowledge. #5-4 calls Agent #2 (Parashakti). Context retrieved via MCP tools.
5.  **-4 Deconstruction:** Input broken down/categorized. #5-1 (Epi-Logos) guides. #5-4 calls Agent #1 (Paramasiva).
6.  **-5 Grounding/Validation:** Final validation. #5-0 (Transcendent Identity) provides grounding. #5-5 (Integral Identity) performs final check, outputs structured data for ingestion/update.

---

## IV. Next Steps

1.  Review and refine the Lens descriptions and QL cycle roles.
2.  Detail the specific prompts and logic for how each Lens function manifests within the QL cycle nodes.
3.  Define the precise structure of the `notionUpdatePayload` generated by Lens #5-5 / Node +5.
4.  Begin planning for the other Subsystem Expert Agents (#0-#4), considering how they interact with the Epii Agent's lenses via the #5-4 Siva-Shakti integration point.
