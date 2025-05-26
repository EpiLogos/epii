# Checklist Validation Task

This task provides instructions for validating documentation against checklists within the Epi-Logos BMAD system. The agent should follow these instructions to ensure thorough and systematic validation of documents for a specific `{DevelopmentName}` within its `{PhilosophicalLayer}` and `{Subsystem}`.

## Context

The Epi-Logos BMAD Method uses various checklists to ensure quality and completeness of different artifacts. The mapping between checklists and their required documents is defined in `bmad-agent/tasks/checklist-mappings.yml`. This allows for easy addition of new checklists without modifying this task.

The paths in `checklist-mappings.yml` under `default_locations` are relative to the current development context: `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/`. The system will resolve these paths dynamically.

## Instructions

1. **Initial Assessment**

   - Check `bmad-agent/tasks/checklist-mappings.yml` for available checklists.
   - If user provides a checklist name:
     - Look for exact match in `checklist-mappings.yml`.
     - If no exact match, try fuzzy matching (e.g., "architect checklist" -> "architect-checklist").
     - If multiple matches found, ask user to clarify.
     - Once matched, use the `checklist_file` path (e.g., `checklists/architect-checklist.md`) from the mapping.
   - If no checklist specified:
     - Ask the user which checklist they want to use for the current `{DevelopmentName}`.
     - Present available options from `checklist-mappings.yml`.
   - Confirm if they want to work through the checklist:
     - Section by section (interactive mode)
     - All at once (YOLO mode)

2. **Document Location (within {DevelopmentName} context)**

   - Look up the required documents and their relative `default_locations` in `checklist-mappings.yml`.
   - For each required document:
     - Construct the full path: `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/` + `default_location_value`.
     - For story-specific documents, resolve `{StoryID}` based on the current context.
     - If not found at the resolved path, ask the user for the document location within the `{DevelopmentName}` context.
   - Verify all required documents for `{DevelopmentName}` are accessible.

3. **Checklist Processing (for {DevelopmentName} artifacts)**

   If in interactive mode:

   - Work through each section of the checklist one at a time.
   - For each section:
     - Review all items in the section.
     - Check each item against the relevant documentation for `{DevelopmentName}`.
     - Present findings for that section.
     - Get user confirmation before proceeding to next section.

   If in YOLO mode:

   - Process all sections at once.
   - Create a comprehensive report of all findings for `{DevelopmentName}`.
   - Present the complete analysis to the user.

4. **Validation Approach**

   For each checklist item:

   - Read and understand the requirement in the context of `{DevelopmentName}` and Epi-Logos principles.
   - Look for evidence in the `{DevelopmentName}` documentation that satisfies the requirement.
   - Consider both explicit mentions and implicit coverage.
   - Mark items as:
     - ✅ PASS: Requirement clearly met.
     - ❌ FAIL: Requirement not met or insufficient coverage.
     - ⚠️ PARTIAL: Some aspects covered but needs improvement.
     - N/A: Not applicable to this `{DevelopmentName}` or specific Epi-Logos context.

5. **Section Analysis**

   For each section:
   - Calculate pass rate for `{DevelopmentName}` artifacts.
   - Identify common themes in failed items.
   - Provide specific recommendations for improvement.
   - In interactive mode, discuss findings with user.
   - Document any user decisions or explanations relevant to `{DevelopmentName}`.

6. **Final Report (for {DevelopmentName})**

   Prepare a summary that includes:
   - Overall checklist completion status for `{DevelopmentName}`.
   - Pass rates by section.
   - List of failed items with context related to `{DevelopmentName}`.
   - Specific recommendations for improvement for `{DevelopmentName}`.
   - Any sections or items marked as N/A with justification for `{DevelopmentName}`.

## Special Considerations (Epi-Logos Aligned)

1.  **Architect Checklist (`architect-checklist.md`):**
    *   Used by Epi-Logos Contextual Architect.
    *   Focus on technical completeness, clarity, and philosophical alignment for `{DevelopmentName}`.
    *   Verify components map to Siva/Shakti/Siva-Sakti and Bimba coordinates within its `{Subsystem}`.
    *   Ensure suitability for AI Builder prompts.

2.  **Frontend Architecture Checklist (`frontend-architecture-checklist.md`):**
    *   Used by Epi-Logos Design Architect.
    *   Validate UI/UX specifications for `{DevelopmentName}` (Shakti aspect).
    *   Check component structure, state management, and alignment with Epi-Logos design philosophy.

3.  **PM Checklist (`pm-checklist.txt`):**
    *   Used by Epi-Logos Feature Definer.
    *   Focus on EFDD clarity for `{DevelopmentName}`.
    *   Verify user stories (seeker/participant perspective) and acceptance criteria align with Epi-Logos goals.
    *   Ensure NFRs reference `BMAD EPI-LOGOS MEMORY/Epi-Logos Project (Philosophy)/`.

4.  **PO Master Checklist (`po-master-checklist.md`):**
    *   Used by Epi-Logos Process Steward.
    *   Validate overall plan for `{DevelopmentName}` for readiness for AI Builder handoff.
    *   Ensure artifact integrity within `BMAD EPI-LOGOS MEMORY/{PhilosophicalLayer}/{Subsystem}/Developments/{DevelopmentName}/`.
    *   Verify philosophical alignment and potential for memory enrichment.

5.  **Story Checklists (`story-draft-checklist.md`, `story-dod-checklist.md`):**
    *   `story-draft-checklist.md` used by Epi-Logos Story Steward for prompt package readiness.
    *   `story-dod-checklist.md` used by Epi-Logos Aligned Dev Agent / AI Builder.
    *   Verify clear acceptance criteria, technical context from `BMAD EPI-LOGOS MEMORY` for `{DevelopmentName}`, and testability.
    *   Ensure user value (seeker/participant) is clear and aligns with `{DevelopmentName}` Epi-Logos objectives.

## Success Criteria

The checklist validation for `{DevelopmentName}` is complete when:
1. All applicable items have been assessed.
2. Clear pass/fail status for each item.
3. Specific recommendations provided for failed items.
4. User has reviewed and acknowledged findings for `{DevelopmentName}`.
5. Final report documents all decisions and rationales for `{DevelopmentName}`.

## Example Interaction

Agent: "Let me check the available checklists... According to `bmad-agent/tasks/checklist-mappings.yml`, we have several options. Which would you like to use for **{DevelopmentName}** (e.g., 'UserAuthFeature' in 'Nara/SecuritySubsystem')?"

User: "The architect-checklist for UserAuthFeature."

Agent: "Understood. We'll use `checklists/architect-checklist.md`. Would you like to work through it section by section (interactive) or get a complete analysis all at once (YOLO mode)?"

User: "Interactive please."

Agent: "Okay. For the 'Architecture Document' required by this checklist, the default relative path is 'architecture/index.md'. For **UserAuthFeature**, this resolves to `BMAD EPI-LOGOS MEMORY/Nara/SecuritySubsystem/Developments/UserAuthFeature/architecture/index.md`. Should I look there?"

[Continue interaction based on user responses...]
