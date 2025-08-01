# bimba-skills-registry.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-back2front/shared/services/bimba-skills-registry.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Bimba Skills Registry managing skill registration, discovery, and coordination aligned with Bimba coordinates and Quaternary Logic. Provides centralized registry for agent skills with QL metadata, harmonic metadata, and skill relationships. Enables dynamic skill discovery, agent-skill mapping, and coordinate-based skill routing within the Siva-Shakti layer.

## System Integration
### Imports
- No external imports (self-contained registry implementation)

### Exports
- **BimbaSkillsRegistry**: Main registry class for skill management
- **Skill Registration**: Methods for registering and managing skills
- **Skill Discovery**: Query and retrieval methods for skill lookup
- **Agent Integration**: Agent-skill mapping and coordination

### Dependencies
- **Agent Systems**: Agents register their skills with the registry
- **Bimba Coordinate System**: Skills aligned with coordinate structure
- **Quaternary Logic Framework**: QL metadata for skill positioning
- **Harmonic Metadata**: Vibrational ontology integration

### Dependents
- **A2A Server**: Uses registry for skill discovery and routing
- **Agent Adapters**: Register skills and query available capabilities
- **Frontend Components**: Query registry for available skills and agents
- **Skill Orchestration**: Route skill execution based on registry data

## Key Functions/Components
### BimbaSkillsRegistry Class (Lines 9-430)
**Purpose**: Main registry class managing skill registration and discovery
**Parameters**: None (constructor)
**Returns**: BimbaSkillsRegistry instance
**Notes**: 430 lines implementing complete skills registry functionality

### registerSkill(skill) (Lines 32-53)
**Purpose**: Register skill with registry including QL and harmonic metadata
**Parameters**: skill (object) with id, name, description, bimbaCoordinate, agentId, handler, qlMetadata, harmonicMetadata
**Returns**: Registered skill object
**Notes**: Validates required fields, infers QL metadata, maintains agent-skill mappings

### getSkillById(skillId) (Lines 85-87)
**Purpose**: Retrieve skill by unique identifier
**Parameters**: skillId (string)
**Returns**: Skill object or null if not found
**Notes**: Direct lookup from skills Map

### getSkillByBimbaCoordinate(coordinate) (Lines 94-101)
**Purpose**: Retrieve skill by Bimba coordinate
**Parameters**: coordinate (string)
**Returns**: Skill object or null if not found
**Notes**: Iterates through skills to find coordinate match

### findSkills(query) (Lines 131-180)
**Purpose**: Find skills matching query parameters
**Parameters**: query (object) with agentId, bimbaPrefix, textQuery, qlPosition, qlMode
**Returns**: Array of matching skills
**Notes**: Supports multiple filter criteria with flexible querying

### getSkillsForAgent(agentId) (Lines 108-111)
**Purpose**: Get all skills provided by specific agent
**Parameters**: agentId (string)
**Returns**: Array of skills for the agent
**Notes**: Uses agent-skill mapping for efficient lookup

### _inferQLMetadataFromBimbaCoordinate(bimbaCoordinate) (Lines 61-78)
**Purpose**: Infer QL metadata from Bimba coordinate structure
**Parameters**: bimbaCoordinate (string)
**Returns**: QL metadata object with qlPosition and qlMode
**Notes**: Extracts position from coordinate pattern, defaults to ascending mode

## Data Flow
1. **Skill Registration**: Agent registers skill → Validation → QL metadata inference → Storage → Agent mapping
2. **Skill Discovery**: Query received → Filter application → Results compilation → Skill objects returned
3. **Coordinate Lookup**: Coordinate provided → Skills iteration → Match found → Skill returned
4. **Agent Querying**: Agent ID provided → Skill IDs retrieved → Skill objects compiled → Array returned
5. **Relationship Management**: Skills registered → Relationships tracked → Nested skills managed

## Configuration
### Skill Structure
- **Required Fields**: id, name, description, bimbaCoordinate, agentId, handler
- **Optional Fields**: qlMetadata, harmonicMetadata
- **QL Metadata**: qlPosition (0-5), qlMode (ascending/descending)
- **Harmonic Metadata**: Vibrational ontology properties

### Registry Storage
- **Skills Map**: skillId → skill object
- **Agent Skills Map**: agentId → Set of skill IDs
- **Skill Relationships Map**: skillId → relationship data
- **Nested Skills Map**: parentSkillId → nested skill IDs

### Query Parameters
- **Agent Filtering**: Filter by agent ID
- **Coordinate Filtering**: Filter by Bimba coordinate prefix
- **Text Search**: Search in name and description
- **QL Filtering**: Filter by QL position and mode

## Testing
No explicit test files referenced, but includes validation and error handling

## Related Files
### Integration Points
- **A2A Server**: Primary consumer for skill routing and discovery
- **Agent Adapters**: Register skills and query capabilities
- **Skill Orchestration**: Route execution based on registry data

### Coordinate System
- **Bimba Coordinates**: Skills aligned with coordinate structure
- **QL Framework**: Quaternary Logic integration for skill positioning
- **Harmonic System**: Vibrational ontology metadata

### Agent Systems
- **Agent Registration**: Agents register their available skills
- **Skill Execution**: Skills executed through agent handlers
- **Capability Discovery**: Dynamic discovery of agent capabilities

## Development Notes
- **Coordinate Alignment**: Skills aligned with Bimba coordinate system
- **QL Integration**: Quaternary Logic metadata for skill positioning
- **Harmonic Metadata**: Support for vibrational ontology properties
- **Dynamic Discovery**: Runtime skill discovery and querying
- **Agent Mapping**: Efficient agent-skill relationship management
- **Flexible Querying**: Multiple query parameters for skill discovery
- **Relationship Tracking**: Support for skill relationships and nesting
- **Validation**: Comprehensive validation of skill registration
- **Memory Efficiency**: Map-based storage for efficient lookups
- **Extensible Design**: Support for future metadata and relationship types
