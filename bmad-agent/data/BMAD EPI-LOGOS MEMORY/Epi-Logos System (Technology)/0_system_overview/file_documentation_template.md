# File Documentation Template - BMAD Memory System

## Standard Template Structure

```markdown
# [File Name] - BMAD Memory Documentation

## File Location
**Path**: `[relative path from epii_app root]`
**Bimba Coordinate**: `[coordinate if applicable]`
**Last Updated**: `[YYYY-MM-DD]`

## Purpose & Role
[2-3 sentence description of what this file does and its role in the system]

## System Integration
### Imports
- [List of key imports with brief descriptions]

### Exports
- [List of key exports with brief descriptions]

### Dependencies
- [List of files/services this depends on]

### Dependents
- [List of files/services that depend on this]

## Key Functions/Components
### [Function/Component Name] (Lines X-Y)
**Purpose**: [Brief description]
**Parameters**: [If applicable]
**Returns**: [If applicable]
**Notes**: [Any important implementation details, bugs, or quirks]

## Data Flow
[Description of how data flows through this file]

## Configuration
[Any configuration options, environment variables, or settings]

## Known Issues
[List any bugs, TODOs, or problematic areas]

## Testing
[Information about tests, if any]

## Related Files
[List of closely related files with brief descriptions of relationships]

## Development Notes
[Any important notes for future development]
```

## Template Usage Guidelines

### When to Create Documentation
- **Every code file** (.js, .mjs, .ts, .tsx, .css, .json, .md) gets documented
- **New files** must have documentation created immediately after creation
- **Modified files** must have documentation updated immediately after changes

### Documentation Accuracy Standards
- **Reflect actual implementation**, not intended functionality
- **Document current state**, including known bugs and limitations
- **Keep cross-references current** when dependencies change
- **Include line numbers** for key functions/components when helpful

### Cross-Reference System
- **Dependencies**: Files this file imports or calls
- **Dependents**: Files that import or call this file
- **Related Files**: Files with similar functionality or shared patterns
- **Integration Points**: Where this file connects to other systems

### Agent Context Engineering
- **Data Flow**: How information moves through this file
- **Pattern Recognition**: Common patterns this file follows or establishes
- **Issue Tracking**: Bugs, TODOs, or problematic areas for agent awareness
- **Development Context**: Important background for future modifications