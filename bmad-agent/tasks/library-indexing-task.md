# Library Indexing Task (Epi-Logos Aligned)

## Purpose

This task maintains the integrity and completeness of index files (typically `index.md` or `README.md`) within specified directories of the `BMAD EPI-LOGOS MEMORY`. It scans documentation files and ensures they are properly indexed with descriptions.

## Task Instructions

You are now operating as a Documentation Indexer for the `BMAD EPI-LOGOS MEMORY`. Your goal is to ensure all documentation files within a specified scope are properly cataloged in the relevant index file.

### Required Steps

1.  **Determine Indexing Scope & Target Index File:**
    *   Ask the user to specify the target directory within `BMAD EPI-LOGOS MEMORY` to be indexed. Examples:
        *   A specific Development: `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/docs/`
        *   A Subsystem technology document root: `BMAD EPI-LOGOS MEMORY/Epi-Logos System (Technology)/{Subsystem}/`
        *   A Philosophical section: `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/`
    *   Ask the user for the name of the index file within that target directory (e.g., `index.md`, `README.md`). Default to `index.md` if not specified.
    *   Let the specified target directory be `TARGET_DOCS_DIR` and the index file be `TARGET_INDEX_FILE`.

2.  **Initial Scan & Index Analysis:**
    *   Scan `TARGET_DOCS_DIR` and all its subdirectories.
    *   Locate and parse the existing `TARGET_INDEX_FILE` (create if absent).
    *   Identify all markdown (`.md`) and text (`.txt`) files within `TARGET_DOCS_DIR` (excluding `TARGET_INDEX_FILE` itself).
    *   From `TARGET_INDEX_FILE`:
        *   Parse current entries.
        *   Note existing file references and descriptions.
        *   Identify any broken links (files referenced in index but not found in `TARGET_DOCS_DIR`) or missing files.
        *   Keep track of already-indexed content.

3.  **Process Each Documentation File Found in `TARGET_DOCS_DIR`:**
    *   For each documentation file found:
        *   Extract the title (from first heading or filename).
        *   Generate a brief description by analyzing the content (e.g., first paragraph or summary).
        *   Create a relative markdown link from `TARGET_INDEX_FILE` to this file.
        *   Check if it's already in `TARGET_INDEX_FILE`.
        *   If missing or outdated, prepare an update.

4.  **Handle Missing Files Referenced in `TARGET_INDEX_FILE`:**
    *   Present a list of all entries in `TARGET_INDEX_FILE` that reference non-existent files within `TARGET_DOCS_DIR`.
    *   For each such entry:
        *   Show the full entry details (title, path, description).
        *   Ask for explicit user confirmation before removal from `TARGET_INDEX_FILE`.
        *   Provide option to update the path if the file was moved within `TARGET_DOCS_DIR`.
        *   Log the decision (remove/update/keep) for the final report.

5.  **Update `TARGET_INDEX_FILE`:**
    *   Maintain existing structure and organization as much as possible.
    *   Add missing entries with descriptions.
    *   Update outdated entries.
    *   Remove only entries that were confirmed for removal.
    *   Ensure consistent formatting throughout `TARGET_INDEX_FILE`.

### Index Entry Format

Each entry in `TARGET_INDEX_FILE` should follow this format:

```markdown
### [Document Title](relative/path/to/file.md)

Brief description of the document's purpose and contents relative to the scope of `TARGET_DOCS_DIR`.
```

### Rules of Operation

1.  NEVER modify the content of indexed files (only `TARGET_INDEX_FILE`).
2.  Preserve existing descriptions in `TARGET_INDEX_FILE` when they are adequate.
3.  Maintain any existing categorization or grouping in `TARGET_INDEX_FILE`.
4.  Use relative paths for all links within `TARGET_INDEX_FILE`, appropriate for its location.
5.  Ensure descriptions are concise but informative.
6.  NEVER remove entries from `TARGET_INDEX_FILE` without explicit user confirmation.
7.  Report any broken links or inconsistencies found.
8.  Allow path updates for moved files before considering removal.

### Process Output

The task will provide:

1.  A summary of changes made to `TARGET_INDEX_FILE`.
2.  List of newly indexed files.
3.  List of updated entries in `TARGET_INDEX_FILE`.
4.  List of entries presented for removal from `TARGET_INDEX_FILE` and their status:
    *   Confirmed removals.
    *   Updated paths.
    *   Kept despite missing file (user decision).
5.  Any other issues or inconsistencies found within the specified scope.

### Handling Missing Files (within `TARGET_INDEX_FILE` context)

For each file referenced in `TARGET_INDEX_FILE` but not found in `TARGET_DOCS_DIR`:
1.  Present the entry (as shown in the original task).
2.  Wait for user confirmation.
3.  Log the decision.

## Required Input

Please provide:

1.  **Target Directory for Indexing (`TARGET_DOCS_DIR`):** Full path within `BMAD EPI-LOGOS MEMORY` (e.g., `BMAD EPI-LOGOS MEMORY/Nara/AuthSubsystem/Developments/UserLoginFeature/docs/`).
2.  **Target Index File Name (`TARGET_INDEX_FILE`):** (e.g., `index.md`, `README.md`. Defaults to `index.md`).
3.  Confirmation of write access to `TARGET_INDEX_FILE`.
4.  Any specific categorization preferences for `TARGET_INDEX_FILE`.
5.  Any files or subdirectories within `TARGET_DOCS_DIR` to exclude from indexing.

Would you like to proceed with library indexing for the specified scope? Please provide the required input above.
