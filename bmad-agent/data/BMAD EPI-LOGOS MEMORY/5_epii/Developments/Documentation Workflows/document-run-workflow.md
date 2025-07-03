# /document-run Workflow: Systematic Documentation Updates

**Version:** 1.0
**Purpose:** Standardized workflow for maintaining accurate documentation across the Epi-Logos codebase that reflects actual implementation vs planned development
**Usage:** Custom Claude slash command pattern for holographic documentation maintenance

## Overview

The `/document-run` workflow ensures that documentation remains synchronized with actual development, bridging the gap between development plans and implemented features. This maintains the holographic principle where documentation accurately reflects the living system.

## Workflow Pattern

### Input Requirements
- **Development Folder Context**: Path to specific development folder in bmad-agent/data/BMAD EPI-LOGOS MEMORY
- **Target Scope**: Which documentation areas to update (project, component, or granular)

### Process Flow

#### 1. Context Ingestion Phase
```
/document-run --context "{development-folder-path}" --scope "{target-scope}"
```

**Steps:**
1. **Read Development Plans**: Ingest original actionable plans and todo.md files
2. **Analyze Implementation Gap**: Compare plans vs actual implemented features
3. **Identify Key Changes**: Extract major achievements, new components, architectural changes
4. **Categorize Updates**: Sort by project-level, component-level, and granular changes

#### 2. Documentation Scope Selection

**Project Level** (`--scope project`):
- Update main README.md with current implementation state
- Add/update "Current Implementation" sections
- Bridge philosophical vision with practical achievements

**Component Level** (`--scope components`):
- Update frontend, backend, back2front README files
- Add new architectural patterns and Phase information
- Document new directory structures and components

**Granular Level** (`--scope granular`):
- Update system/subsystem/shared directory documentation
- Create component-specific README files where needed
- Document feature breakdown and contextual hooks

**Full Update** (`--scope full`):
- Execute all three levels systematically
- Ensure consistency across all documentation layers

#### 3. Documentation Update Execution

**Sequential Processing:**
1. **Project README** → **Component READMEs** → **Granular Documentation**
2. **Context Refresh**: Re-read development context between major sections if needed
3. **Consistency Validation**: Ensure information aligns across documentation levels
4. **Accuracy Verification**: Cross-reference with actual codebase structure

#### 4. Style and Content Guidelines

**Documentation Style:**
- **Nice and pithy**: Concise but semantically rich
- **Tight context**: Essential information without bloat
- **Adequate principle representation**: Core philosophical foundations preserved
- **Contextual hooks**: Information structured for future agent development runs

**Content Requirements:**
- **Actual vs Planned**: Always document what was actually implemented, not just what was planned
- **Architectural Clarity**: Clear explanation of new patterns and structures
- **Phase Attribution**: Clearly mark which development phase introduced features
- **Forward Compatibility**: Structure for future development phases

## Implementation Template

### Basic Usage
```bash
# Project-level documentation update
/document-run --context "bmad-agent/data/BMAD EPI-LOGOS MEMORY/5_epii/Developments/Agent Developments June 2025" --scope project

# Component-level updates
/document-run --context "bmad-agent/data/BMAD EPI-LOGOS MEMORY/5_epii/Developments/Agent Developments June 2025" --scope components

# Full documentation refresh
/document-run --context "bmad-agent/data/BMAD EPI-LOGOS MEMORY/5_epii/Developments/Agent Developments June 2025" --scope full
```

### Advanced Usage with Sequential Thinking
```bash
# Complex development cycle with multiple phases
/document-run --context "bmad-agent/data/BMAD EPI-LOGOS MEMORY/5_epii/Developments/Agent Developments June 2025" --scope full --use-sequential-thinking --phases "phase1,phase2"
```

## Workflow Steps Detail

### Step 1: Context Ingestion
- **Read actionable plan files**: Understand original development intentions
- **Read todo.md files**: Identify what was actually completed
- **Scan development notes**: Capture implementation insights and changes
- **Current codebase analysis**: Verify actual file structure and components

### Step 2: Gap Analysis
- **Planned vs Implemented**: Identify differences between plan and reality
- **New Discoveries**: Document features/patterns that emerged during development
- **Architectural Evolution**: Capture how the architecture actually evolved
- **Success Metrics**: Evaluate what worked vs what needed adjustment

### Step 3: Documentation Structure Planning
- **Information Architecture**: Organize updates by scope and importance
- **Content Flow**: Plan how information flows between documentation levels
- **Consistency Points**: Identify where documentation must align across files
- **Future Hooks**: Structure for upcoming development phases

### Step 4: Systematic Updates
- **Project README**: Bridge vision with implementation, add current state sections
- **Component READMEs**: Update architecture, add new patterns, document phases
- **Granular Docs**: Create/update subsystem documentation and component guides
- **Cross-Reference**: Ensure all documentation points align

### Step 5: Validation and Refinement
- **Accuracy Check**: Verify documentation matches actual codebase
- **Completeness Review**: Ensure all major features are documented
- **Style Consistency**: Apply project documentation standards
- **Future Readiness**: Structure for next development cycle

## File Targets by Scope

### Project Scope
- `/README.md` - Main project documentation
- Update philosophical vision + current implementation bridge

### Component Scope
- `/epii_app/friendly-file-backend/README.md`
- `/epii_app/friendly-file-front/README.md`
- `/epii_app/friendly-file-back2front/README.md`

### Granular Scope
- `/epii_app/*/src/subsystems/*/README.md`
- `/epii_app/*/src/epi-logos-system/README.md`
- `/epii_app/*/src/shared/README.md`
- Component-specific documentation files

## Quality Assurance

### Documentation Standards
- **Accuracy**: Documentation reflects actual implementation
- **Completeness**: All major features and patterns documented
- **Clarity**: Information accessible to future developers/agents
- **Consistency**: Aligned information across all documentation levels
- **Maintainability**: Structured for easy future updates

### Validation Checklist
- [ ] Plans vs implementation gap analyzed
- [ ] New architectural patterns documented
- [ ] Phase attribution clear throughout
- [ ] File structure matches documentation
- [ ] Cross-references validated
- [ ] Style guidelines followed
- [ ] Future development hooks in place

## Integration with Development Cycles

### Pre-Development
- Use documentation to understand current state
- Identify gaps and improvement opportunities
- Plan documentation updates alongside feature development

### During Development
- Update todo.md files with actual progress
- Document architectural decisions and pattern discoveries
- Note deviations from original plans

### Post-Development
- Execute `/document-run` workflow
- Bridge implementation reality with documentation
- Prepare documentation foundation for next cycle

## Maintenance Schedule

### After Each Development Phase
- **Immediate**: Execute `/document-run` for completed phase
- **Weekly**: Review and refine documentation accuracy
- **Monthly**: Validate cross-references and consistency

### Quarterly Reviews
- **Comprehensive audit**: Full documentation review
- **Process refinement**: Improve `/document-run` workflow
- **Archive management**: Organize development history

## Future Enhancements

### Potential Automations
- **Auto-detection**: Identify when development context changes
- **Template generation**: Standardized documentation templates
- **Consistency checking**: Automated cross-reference validation
- **Version management**: Track documentation evolution

### Integration Possibilities
- **Development tools**: IDE integration for real-time documentation
- **CI/CD pipelines**: Automated documentation updates
- **Knowledge management**: Integration with BPMCP and memory systems
- **Collaborative editing**: Multi-agent documentation workflows

---

**Implementation Status**: Phase 1 Complete - Pattern Established
**Next Steps**: Systematic application across future development cycles
**Maintenance**: Update workflow based on usage experience and development evolution