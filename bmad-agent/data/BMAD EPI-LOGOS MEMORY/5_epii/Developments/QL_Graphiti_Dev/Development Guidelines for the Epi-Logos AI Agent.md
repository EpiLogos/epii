<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Development Guidelines for the Epi-Logos AI Agent

*(Single-agent core, expert-domain modules, AG-UI state management)*

**Main takeaway:** Combine rigorous context-engineering practices from today’s most reliable agent frameworks with the philosophical-geometric insights of Epi-Logos to build a single, stateless orchestrator that routes tasks to specialised “expert domain” loops, each governed by explicit epistemic principles rather than ad-hoc prompt chaining.

## 1. Architectural Ground-Rules

| Guideline | Purpose | Key Practices | Sources |
| :-- | :-- | :-- | :-- |
| 1. Single-Agent Orchestrator with Expert Domains | Retain one coherent context while still leveraging specialisation. | -  One orchestrator loop owns the global task plan. <br>-  Delegate subtasks to **in-process expert modules** (not separate LLM agents). <br>-  Return results as structured objects, not prose. | [1], [2] |
| 2. Stateless Core, Externalised State | Avoid brittle hidden memory and enable long-running tasks. | -  Persist conversation, scratch-pad and tool results in external DB. <br>-  AG-UI protocol serialises loop snapshots; can pause/resume. | Attach. 2, [3] |
| 3. Event-Driven Control Flow (AG-UI) | Guarantee reliability and debuggability. | -  Each loop iteration emits an AG-UI event. <br>-  Front-end or non-LLM services subscribe for progress, rollback, tracing. | Attach. 2 |
| 4. Epistemic Layer Separation | Map knowledge work to coherent “domains of knowing.” | -  Each expert module is scoped to an *epistemic domain* (logic, process, symbolism, context, synthesis). <br>-  Orchestrator activates one domain at a time to reduce prompt entropy. | Attach. 1, 3 |

## 2. Context Engineering \& Knowledge Management

1. **Coordinate-Inspired Compression**
    - Instead of wideloading text chunks, encode large knowledge regions as *abstract handles* (e.g., “dynamic-process domain”). <br>-  Expand on demand (“lossless decompression”) only when the agent needs fine-grained facts.
    - Mirrors Cache-/Coordinate-Augmented Generation ideas that trade tokens for pointers [4].
2. **Context Frames, not Sliding Windows**
    - Before each step, the orchestrator establishes an explicit *frame* containing: task objective, active domain, tool inventory, output schema.
    - Frames prevent cross-talk and enable deterministic evaluation [1].
3. **Dual Retrieval Strategy**
    - Vector search for atomic facts. <br>-  Knowledge-graph / ontology queries for relationships [5].
    - The agent decides which to call via tool-selection rules in its system prompt.
4. **Memory Taxonomy**


| Layer | Persistence | Contents |
| :-- | :-- | :-- |
| Short-term | loop scratch-pad (in-prompt) | reasoning chain, tool outputs |
| Mid-term | task session (DB) | summarised frame history |
| Long-term | knowledge base | ontologically indexed artefacts |


## 3. Prompt, Output \& Control-Flow Patterns

| Element | Recommendation | Rationale |
| :-- | :-- | :-- |
| System Prompt | Declare role, domain, allowed tools, JSON schema. | Reduces hallucinations; enforces deterministic parsing [6]. |
| Loop Logic | “Think → Act → Observe → Reflect” (TAOR). | Reflection step trims context and logs trace for evaluation. |
| Structured Output | Always emit `{"action":…,"args":…}` or final `{"result":…}`. | Lets deterministic code switch or exit; aligns with Cognition “LLM as JSON generator” [1]. |
| Exit Criteria | Stop when: goal complete, unreachable, or human-input needed. | Prevents infinite loops; supports human-in-the-loop escalation. |

## 4. Tooling \& Interfaces

1. **Tool Contracts**
    - Every external tool exposes: name, args schema, cost estimate, failure modes.
    - Agent chooses tool via explicit `select_tool` action; orchestrator validates.
2. **Observable Traces**
    - Log each tool call, inputs, outputs in AG-UI event stream.
    - Expose “full trace replay” to downstream evaluators and human debuggers [7].
3. **Evaluation Harness**
    - Automated tests feed synthetic goals and verify JSON outputs, latency, correctness.
    - Use reflection prompts to self-grade intermediate reasoning.

## 5. Reliability, Safety \& Ethics

| Concern | Mitigation |
| :-- | :-- |
| Conflicting Decisions | Single orchestrator keeps authoritative plan; modules cannot overwrite global state without confirmation [1]. |
| Context Explosion | Frames \& coordinate handles maintain <8 k tokens active at any time. |
| Bias / Alignment | Expert domains embed explicit philosophical principles (e.g., semantic-harmonics) to surface value assumptions Attach. 1. |
| Human Oversight | Agent can raise `{"action":"request_human","reason":…}`; UI routes to reviewer. |

## 6. Continuous Improvement Loop (“Meta-Techne”)

1. **Self-Instrumentation** – Every run emits metrics (token spend, success/fail, user satisfaction).
2. **Offline Analysis** – Batch jobs cluster failure traces; surface unhandled intents.
3. **Prompt \& Tool Evolution** – Use analysis to refine schemas, add specialised tools, or split/merge expert domains.

## 7. Putting It All Together: Minimal Reference Stack

| Layer | Technology | Notes |
| :-- | :-- | :-- |
| Interface | AG-UI WebSockets | Real-time event feed, progress bars. |
| Orchestrator | Single LLM function-calling loop (e.g., GPT-4o, Claude 3) | Holds root prompt \& TAOR loop. |
| Expert Modules | Domain-scoped prompts + optional local code | Loaded dynamically; stateless. |
| Memory \& State | Postgres (sessions) + Neo4j/Vector DB (knowledge) | AG-UI serialises frames. |
| Observability | OpenTelemetry spans + JSON traces | Dashboards for latency \& accuracy. |

## 8. Checklist for First Implementation

1. [ ] Draft root system prompt with role, output schema, domain list.
2. [ ] Implement AG-UI event types: `frame_start`, `tool_call`, `reflection`, `result`.
3. [ ] Build knowledge base adapters (vector, graph).
4. [ ] Scaffold five expert domains (matching project’s philosophical taxonomy) with minimal prompts.
5. [ ] Wire evaluation harness with synthetic tasks.
6. [ ] Run closed-loop tests; iterate on context frames until token usage stable.

### References

Internal attachments:

1. Geometric Epistemology draft.
2. Epi-Logos README \& architecture.
3. High-Level Encapsulation of QL \& Algebraic Topology.

External research:
[6] Gopinath, “Cheat Sheet for Building AI Agents 2024”.
[5] Stackademic, “Building Next-Gen AI Agents”.
[4] Cache-Augmented Generation tutorial.
[2] McGuinness, “AI Agent Architecture Debate”.
[1] Cognition AI, “Don’t Build Multi-Agents”.
[7] Forte Group, “Designing Effective Agent Architectures”.

The above guidelines give a **clear, technology-agnostic roadmap** for implementing the Epi-Logos agent while honouring its distinctive epistemic vision and leveraging the most reliable patterns emerging in the field.

