# epii-agent-card.js - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-back2front/subsystems/5_epii/agent-cards/epii-agent-card.js`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Epii Agent Card defining capabilities and skills of the Epii Agent embodying recursive synthesis at the culmination of the quaternary cycle. Provides comprehensive skill definitions with input/output schemas, Bimba coordinate mappings, and philosophical framework integration. Serves as the agent specification for meta-perspective analysis, philosophical framing, and crystallization validation within the Siva-Shakti layer.

## System Integration
### Imports
- **No external imports**: Pure JavaScript object definition

### Exports
- **epiiAgentCard**: Complete agent card specification with skills and capabilities

### Dependencies
- **A2A Protocol**: Agent card follows A2A specification format
- **Bimba Coordinate System**: Skills aligned with coordinate structure
- **Quaternary Logic Framework**: QL integration in skill definitions

### Dependents
- **A2A Server**: Uses agent card for agent registration and capability discovery
- **Epii Agent Adapter**: Implements skills defined in the agent card
- **Agent Registration Service**: Frontend discovery of Epii agent capabilities
- **Skills Registry**: Skills registered based on agent card definitions

## Key Functions/Components
### epiiAgentCard Object (Lines 9-135)
**Purpose**: Complete agent card specification with metadata, capabilities, and skills
**Parameters**: Static object definition
**Returns**: Agent card object
**Notes**: 138 lines defining comprehensive Epii agent specification

### Agent Metadata (Lines 10-29)
**Purpose**: Basic agent identification and configuration
**Parameters**: Agent properties
**Returns**: Agent metadata
**Notes**: ID, name, description, coordinate, URL, provider, version, capabilities, authentication

### Provide Meta-Perspective Skill (Lines 31-59)
**Purpose**: Skill for providing meta-level perspective on documents or concepts
**Parameters**: content (string), targetCoordinate (optional string)
**Returns**: metaPerspective (string), relevantCoordinates (array)
**Notes**: Bimba coordinate #5-5, highest-level meta-analysis capability

### Philosophical Framing Skill (Lines 61-95)
**Purpose**: Skill for framing concepts within Epi-Logos philosophical framework
**Parameters**: concept (string), contextFrame (optional string)
**Returns**: philosophicalFraming (string), quaternaryLogicMapping (object)
**Notes**: Bimba coordinate #5-1, complete QL mapping with all six stages

### Validate Crystallization Payload Skill (Lines 97-133)
**Purpose**: Skill for validating crystallization payloads before Notion storage
**Parameters**: notionUpdatePayload (object), contextFrame (optional string)
**Returns**: isValid (boolean), validationMessage (string), suggestedRevisions (array)
**Notes**: Bimba coordinate #5-0, foundational validation with revision suggestions

## Data Flow
1. **Agent Registration**: Agent card → A2A server → Agent registration → Capability discovery
2. **Skill Discovery**: Agent card → Skills extraction → Registry registration → Frontend availability
3. **Skill Execution**: Skill invocation → Schema validation → Agent processing → Response formatting
4. **Meta-Perspective**: Content input → Meta-analysis → Perspective generation → Coordinate identification
5. **Philosophical Framing**: Concept input → Framework application → QL mapping → Philosophical output

## Configuration
### Agent Specification
- **ID**: "epii-agent"
- **Name**: "Epii Agent"
- **Description**: "Embodies recursive synthesis at the culmination of the quaternary cycle (#5)"
- **Subsystem Coordinate**: "#5"
- **URL**: "http://localhost:3033/a2a/epii"
- **Version**: "1.0.0"

### Capabilities
- **Streaming**: true (supports streaming responses)
- **Push Notifications**: false (no push notification support)
- **State Transition History**: true (maintains state history)

### Authentication
- **Schemes**: ["Bearer"] (Bearer token authentication)

### Input/Output Modes
- **Default Input**: ["text/plain", "application/json"]
- **Default Output**: ["text/plain", "application/json"]

### Skills Configuration
- **Provide Meta-Perspective**: #5-5 coordinate, meta-level analysis
- **Philosophical Framing**: #5-1 coordinate, QL framework integration
- **Validate Crystallization Payload**: #5-0 coordinate, validation and revision

## Testing
No explicit test files referenced, but includes comprehensive schema definitions and examples

## Related Files
### Core Dependencies
- **A2A Protocol**: Agent card specification format
- **Bimba Coordinate System**: Coordinate-based skill organization

### Integration Points
- **A2A Server**: Agent registration and capability discovery
- **Epii Agent Adapter**: Skill implementation and execution
- **Agent Registration Service**: Frontend agent discovery
- **Skills Registry**: Skill registration and management

### Skill Implementation
- **Epii Skills Initializer**: Implements skills defined in agent card
- **Agent Processing**: Actual skill execution and response generation
- **Schema Validation**: Input/output validation based on card schemas

## Development Notes
- **Quaternary Logic Integration**: Complete QL mapping in philosophical framing skill
- **Coordinate-Based Organization**: Skills organized by Bimba coordinates (#5-0, #5-1, #5-5)
- **Schema-Driven Design**: Comprehensive input/output schemas for all skills
- **Meta-Level Capabilities**: Highest-level meta-perspective and synthesis capabilities
- **Philosophical Framework**: Deep integration with Epi-Logos philosophical framework
- **Crystallization Support**: Validation capabilities for knowledge crystallization
- **A2A Compliance**: Full compliance with A2A agent specification format
- **Extensible Design**: Easy to add new skills and capabilities
- **Example Integration**: Comprehensive examples for each skill capability
- **Revision Support**: Intelligent revision suggestions for crystallization validation
