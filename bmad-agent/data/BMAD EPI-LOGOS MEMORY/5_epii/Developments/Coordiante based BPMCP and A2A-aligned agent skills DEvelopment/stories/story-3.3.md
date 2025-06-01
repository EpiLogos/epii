# Story 3.3: Epii Agent Interaction with Epii Analysis Pipeline via Skills

**Context:** Part of Coordiante based BPMCP and A2A-aligned agent skills DEvelopment (5_epii / Developments)
**Location:** `BMAD EPI-LOGOS MEMORY/5_epii/Developments/Coordiante based BPMCP and A2A-aligned agent skills DEvelopment/stories/story-3.3.md`

## Status: Approved

## Story

- **As an** Epii Agent (within the **6-subsystem architecture**),
- **I want** to use skills to submit data (including **UI context like chat/canvas selections** and **Graphiti-derived document-level memory/Bimba structure**) to the Epii Analysis Pipeline and retrieve/interpret results, within Bimba context, enriching interaction with dynamic Graphiti data/updates,
- **So that** I can leverage specialized analytical capabilities, enabling **refined analysis for skill execution,** with **streamlined context windows,** and **informing potential Notion/Bimba updates.**

## Acceptance Criteria (ACs)

1.  Dedicated skill `submitToAnalysisPipelineSkill` exists (within **6-subsystem architecture**).
2.  Submission skill accepts data, analysis params, Bimba coordinate, and pertinent Graphiti context (related entities, current state, **UI context markers**, **Graphiti-derived document-level memory/Bimba structure**).
3.  Submission skill returns job ID/tracking mechanism.
4.  Dedicated skill `getAnalysisPipelineResultsSkill` exists.
5.  Retrieval skill uses job ID and Bimba coordinate to fetch results.
6.  Retrieval skill returns structured results for Agent processing, potentially updating Graphiti with metadata/findings, ensuring **streamlined context windows.**
7.  Epii Agent orchestrates these skills (plan from Story 3.1/3.2) to submit, wait/poll, retrieve/use results, enabling **refined analysis.**
8.  Both skills use Bimba coordinate and relevant Graphiti context (reflecting **UI context**) for data scoping, result interpretation, or updating Graphiti.
9.  The interaction with the Analysis Pipeline is designed to **inform potential Notion/Bimba updates** based on analytical outcomes.

## Tasks / Subtasks

- [ ] Task 1: Design and implement `submitToAnalysisPipelineSkill` (AC: #1, #2)
    - [ ] Subtask 1.1: Define the interface for the Epii Analysis Pipeline for task submission.
    - [ ] Subtask 1.2: Implement the skill logic to package data and parameters and send them to the pipeline, including Bimba coordinate **and relevant Graphiti context.**
    - [ ] Subtask 1.3: Ensure the skill correctly handles the pipeline's response (e.g., job ID) (AC: #3).
- [ ] Task 2: Design and implement `getAnalysisPipelineResultsSkill` (AC: #4, #5)
    - [ ] Subtask 2.1: Define the interface for the Epii Analysis Pipeline for result retrieval using a job ID and Bimba coordinate.
    - [ ] Subtask 2.2: Implement the skill logic to query the pipeline, parse the results (AC: #6), **and potentially update Graphiti with analysis summaries or links.**
- [ ] Task 3: Register both skills in the Skills Registry (Story 2.1).
- [ ] Task 4: Develop Epii Agent logic to orchestrate the submission and retrieval skills (AC: #7)
    - [ ] Subtask 4.1: Implement waiting/polling strategy if pipeline processing is asynchronous.
- [ ] Task 5: Ensure Bimba coordinate **and Graphiti context** are consistently used, propagated, and potentially updated by both skills and the agent (AC: #8).
- [ ] Task 6: Document the new skills and the agent's interaction pattern with the Epii Analysis Pipeline.

## Dev Technical Guidance

-   This story integrates the Epii Agent with a potentially complex backend system (Epii Analysis Pipeline).
-   The design of the skills should abstract the complexities of the pipeline interaction.
-   Refer to `../../docs/architecture_shards/epii-analysis-pipeline-interface.md` for details on how the pipeline is expected to be called.
-   The Bimba coordinate **and dynamic Graphiti context** are crucial for ensuring that analysis is contextually relevant and that its results can be integrated back into the agent's evolving understanding.
-   These skills will likely be A2A-aligned, meaning they are discoverable and invocable via the standard mechanisms (Skills Router).
-   Consider asynchronous communication patterns. The submission skill might return immediately with a job ID, and the agent might need to poll for results using the retrieval skill.
-   Error handling for pipeline interactions (e.g., pipeline unavailable, analysis failed) is important.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List
{Any notes about implementation choices, difficulties, or follow-up needed for Coordiante based BPMCP and A2A-aligned agent skills DEvelopment.}

### Change Log