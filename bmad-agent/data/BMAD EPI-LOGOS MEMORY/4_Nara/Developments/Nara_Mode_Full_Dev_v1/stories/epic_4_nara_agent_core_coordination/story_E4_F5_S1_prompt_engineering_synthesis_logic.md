# User Story: E4_F5_S1 - Sophisticated Prompt Engineering & Synthesis Logic: Weaving Wisdom for Self-Realization

**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F5 - Prompt Engineering & Synthesis Logic
**Story ID:** E4_F5_S1

**As a** Nara agent, embodying a conduit for the user's Pramata to engage with deeper layers of consciousness (Cit-Shakti),
**I want** to utilize sophisticated prompt engineering strategies (akin to formulating insightful questions in a process of self-inquiry/Atma-vichara) and synthesis logic (mirroring the psyche's transcendent function and the unifying power of Paramashiva) to effectively query data sources (like `bimba_map` via Neo4j, reflecting the collective unconscious and archetypal patterns), consult other agents (initially the `epii` agent, as a source of specialized wisdom/Jnana Shakti), and intelligently combine their outputs,
**So that** I can maintain Nara's unique voice (a blend of empathetic guide and insightful companion on the individuation journey, echoing the supportive aspect of the Self), deliver insights (Pratibha) that are deeply relevant to the user's current context (Identity Dynamics, Oracle, Journal – reflecting their personal myth and engagement with Lila), and leverage the `bimba_map`'s inherent epistemic unifications (symbolizing the interconnectedness of all aspects of consciousness/Svatantrya and the underlying unity of Shiva) for coherent, multi-layered guidance that fosters self-recognition (Pratyabhijna).

**Acceptance Criteria:**

1.  **Context-Aware Prompt Generation:**
    *   Nara must be able to dynamically generate prompts (formulating inquiries into the nature of experience) for querying `bimba_map` (Neo4j – accessing the symbolic language of the unconscious) and consulting the `epii` agent (seeking specialized perspectives) based on:
        *   The user's current section (Identity Dynamics – exploring the persona and shadow; Oracle – engaging with synchronicity and archetypal forces; Journal – reflecting on the personal individuation narrative).
        *   Specific user input or query.
        *   Relevant data from the user's profile and journey (e.g., natal chart reflecting cosmic Spanda at birth, past Oracle readings as markers of psychic processes and synchronistic alignments, journal themes revealing unconscious contents and the unfolding of the Self).
        *   The specific information needed to fulfill the user's request or provide proactive insight (Pratibha) that illuminates their path.
2.  **`bimba_map` Query Optimization:**
    *   Develop strategies for crafting `bimba_map` queries (Cypher or via tools like `querybimbagraph`) that efficiently retrieve the most relevant symbolic connections and data, leveraging the map's unified structure (reflecting the interconnectedness of archetypes and the non-dual nature of reality).
3.  **`epii` Agent Consultation Strategy:**
    *   Define clear strategies for when and how Nara consults the `epii` agent (e.g., for deeper philosophical interpretations drawing from various wisdom traditions, understanding complex symbolic systems as expressions of Cit-Shakti, or accessing broader Epi-Logos project knowledge).
    *   Prompts directed to the `epii` agent should be well-formed to elicit concise and relevant information.
4.  **Multi-Source Information Synthesis Logic:**
    *   Implement logic within Nara to synthesize information received from multiple sources (`bimba_map` – archetypal wisdom, `epii` agent – specialized knowledge, astrological services – cosmic rhythms/Spanda, user input – personal experience/Pramata's view) into a single, coherent response (a unified understanding or Vimarsha).
    *   This logic should be able to weigh different pieces of information, resolve potential conflicts (or present them as paradoxes for reflection, inviting the transcendent function and deeper contemplation of Maya's veiling/revealing power), and identify overarching themes (patterns of the Self, expressions of universal consciousness).
5.  **Maintaining Nara's Voice and Narrative Coherence:**
    *   The synthesis process must ensure that all outputs are presented in Nara's distinct voice (empathetic, wise, supportive of the individuation process) and align with the ongoing narrative of the user's journey towards wholeness (psychic integration and recognition of Atman).
    *   This involves transforming raw data or agent responses into natural, empathetic, and insightful language.
6.  **Leveraging `bimba_map` for Epistemic Unification:**
    *   The synthesis logic should actively use the `bimba_map` as a framework (a symbolic representation of the collective unconscious and the web of existence/Lila) to connect and unify disparate pieces of information, highlighting the interconnectedness of symbols and concepts (revealing the underlying unity in diversity, the play of Shaktis).
7.  **Iterative Refinement of Prompts and Logic:**
    *   Establish a process for testing, evaluating, and iteratively refining prompt engineering strategies and synthesis logic based on the quality and relevance of Nara's responses, ensuring it effectively supports the user's journey of self-discovery (Atman-vidya) and psychic integration.

**Dependencies:**

*   Nara agent's core architecture and orchestration capabilities (Feature E4_F1).
*   Integration with `bimba_map` (Neo4j) (E4_F4_S1).
*   Interface for communicating with the `epii` agent.
*   Access to user context, profile, and journey data.

**Notes:**

*   This story is crucial for defining the "intelligence" (Prajna/Cit) and unique character of Nara, enabling it to act as a true companion in the user's psycho-spiritual development.
*   Effective prompt engineering is key to unlocking the potential of underlying LLMs (if used by `epii` or Nara itself, as tools for accessing and articulating Jnana Shakti) and knowledge graphs (as maps of consciousness).
*   The synthesis logic is where raw data (diverse expressions of consciousness) is transformed into meaningful guidance (Pratibha-born insight) for the user, facilitating their journey towards recognizing their own divine nature (Paramashiva).