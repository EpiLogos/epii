# BMad Epi-Logos Agent System

This directory, `bmad-agent`, contains the core components of the BMad Epi-Logos intelligent agent system designed to operate within an IDE environment. It facilitates a structured, philosophically-aligned approach to software development, leveraging a dynamic knowledge base known as the `BMAD EPI-LOGOS MEMORY`.

## Overview

The BMad Epi-Logos system is built around a central **IDE Orchestrator** (`ide-bmad-orchestrator.md`) that manages various specialized **Epi-Logos Personas**. These personas are AI roles designed to handle specific aspects of the development lifecycle, from conceptualization to implementation. The entire system is driven by a configuration file (`ide-bmad-orchestrator-cfg.md`) and operates within a defined development context (`currentSubsystem` and `currentDevelopmentName`).

All development artifacts, documentation, and knowledge generated or used by the system are stored and organized within the `BMAD EPI-LOGOS MEMORY`. This memory structure is hierarchical and uses parameterized paths to ensure that information is correctly contextualized to the specific **Philosophical Layer**, **Subsystem**, and **Development Name**.

## Core Components

1.  **`ide-bmad-orchestrator.md`**: 
    *   This file defines the operational logic and core principles of the central orchestrating AI agent.
    *   **Key Responsibilities**:
        *   Loading and parsing the `ide-bmad-orchestrator-cfg.md` file upon initialization.
        *   Managing the `currentSubsystem` and `currentDevelopmentName` to provide development context.
        *   Activating and embodying specific Epi-Logos personas based on user requests and the configuration file.
        *   Identifying and initiating tasks for the active persona.
        *   Resolving paths to resources (templates, checklists, development artifacts) by combining base paths from the config with the current development context (e.g., `epi-logos-memory-root/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/...`).
        *   Handling requests for persona changes.

2.  **`ide-bmad-orchestrator-cfg.md`**: 
    *   The central configuration file for the orchestrator.
    *   **Defines**:
        *   `Data Resolution` paths: Base paths for personas, tasks, templates, checklists, and the crucial `epi-logos-memory-root`, `philosophical-layer-root`, and `system-technology-root`.
        *   `Epi-Logos Personas`: A list of all available specialist personas, including:
            *   `Name` and `Title`.
            *   `Description` of their role and expertise.
            *   `Persona`: The filename of the markdown file defining the persona's detailed behavior and instructions (located in `bmad-agent/personas/`).
            *   `Customize`: A specific prompt string to further tailor the persona's embodiment.
            *   `Tasks`: A list of tasks the persona can perform, each with a `Display Name` and a `Target` (which can be a task instruction file in `bmad-agent/tasks/` or a checklist file in `bmad-agent/checklists/`).

3.  **`BMAD EPI-LOGOS MEMORY/` (Conceptual Root)**:
    *   This is not a literal directory at the `bmad-agent` level but represents the structured knowledge base where all development-specific artifacts are stored. Its actual root path in a project would be defined by the user/system implementing BMad.
    *   The orchestrator and personas construct paths into this memory using `epi-logos-memory-root` from the config, combined with `currentSubsystem`, `currentDevelopmentName`, and relative paths defined in templates, checklists, or task instructions.
    *   **Example Structure within MEMORY** (for a specific development):
        *   `BMAD EPI-LOGOS MEMORY/{Subsystem}/Developments/{DevelopmentName}/`
            *   `architecture/` (diagrams, detailed design docs)
            *   `docs/` (PRD, EFDD, sharded documents, specifications)
                *   `epics/`
                *   `architecture_shards/`
            *   `stories/` (individual story files)
            *   `src/` (actual source code - managed by IDE/dev tools, but referenced)
            *   `data/` (feature progress, plans, feedback)
            *   `README.md` (index for the development)

4.  **`personas/` Directory**:
    *   Contains markdown files, each defining a specific Epi-Logos persona (e.g., `architect.md`, `product-manager.md`).
    *   These files provide detailed instructions, guiding principles, and operational directives for the LLM when it embodies that persona.

5.  **`tasks/` Directory**:
    *   Contains markdown files that define the steps and procedures for specific tasks listed in the `ide-bmad-orchestrator-cfg.md`.
    *   These task files often instruct the persona to use specific templates or checklists and to save outputs to the `BMAD EPI-LOGOS MEMORY`.
    *   Examples: `define-initial-architecture.md`, `draft-efdd.md`.

6.  **`templates/` Directory**:
    *   Contains markdown template files used by various personas and tasks to generate standardized documents.
    *   These templates extensively use placeholders like `{Development Name}`, `{Subsystem}`, `{Project Name}`, etc., which are filled in based on the current development context.
    *   They also contain parameterized paths pointing to locations within the `BMAD EPI-LOGOS MEMORY`.
    *   Examples: `prd-tmpl.md`, `architecture-tmpl.md`, `story-tmpl.md` (if it existed, or similar).

7.  **`checklists/` Directory**:
    *   Contains markdown checklist files used for validation and ensuring completeness of various artifacts or process steps.
    *   Like templates, these checklists use placeholders for dynamic content and reference documents within the `BMAD EPI-LOGOS MEMORY` using parameterized paths.
    *   Some checklists also serve directly as task definitions for certain personas.
    *   Examples: `architect-checklist.md`, `pm-checklist.txt`, `story-dod-checklist.md`.

## Workflow and Path Resolution

1.  The user interacts with the **IDE Orchestrator**.
2.  The Orchestrator loads `ide-bmad-orchestrator-cfg.md`.
3.  The user specifies a **Persona** to activate, a **Task** to perform, and sets the **Development Context** (`currentSubsystem`, `currentDevelopmentName`).
4.  The Orchestrator activates the chosen Persona by loading its definition from `personas/`.
5.  The active Persona, guided by its definition and the specified Task (from `tasks/` or `checklists/`), performs its duties.
6.  When accessing or creating resources (e.g., using a template from `templates/` to create a document), paths are resolved dynamically:
    *   The base path `epi-logos-memory-root` (from config) is combined with `currentSubsystem`, `currentDevelopmentName`, and any relative path specified in the template/checklist/task file.
    *   Example: A template might reference `BMAD EPI-LOGOS MEMORY/{Subsystem}/Developments/{DevelopmentName}/docs/architecture_shards/main-architecture.md`. The Orchestrator/Persona resolves `{Subsystem}`, and `{DevelopmentName}` from its current context.

## Key Principles Embodied

*   **Contextualization**: All work is performed within a specific development context, ensuring relevance and proper organization within the `BMAD EPI-LOGOS MEMORY`.
*   **Config-Driven**: The system's capabilities and structure are defined by the configuration file, allowing for flexibility and extensibility.
*   **Modularity**: Personas, tasks, templates, and checklists are modular components that can be updated or expanded.
*   **Philosophical Alignment**: The entire system is designed to support the Epi-Logos philosophy, ensuring that development activities are guided by overarching principles.
*   **Structured Knowledge Management**: The `BMAD EPI-LOGOS MEMORY` provides a consistent and predictable structure for all project-related information.

This system aims to provide a highly organized, context-aware, and philosophically grounded AI-assisted development experience.