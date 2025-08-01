# AgentRegistrationService.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/epi-logos-system/3_services/AgentRegistrationService.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Agent Registration Service querying existing A2A registration systems to discover available agents and skills. Provides caching, fallback mechanisms, and structured data processing for agent discovery. Enables dynamic skill resolution, agent-skill mapping, and chat skill identification for intelligent routing within the Epi-Logos system.

## System Integration
### Imports
- **TypeScript Interfaces**: RegistrationData, SkillInfo for type safety

### Exports
- **AgentRegistrationService**: Main service class for agent discovery
- **agentRegistrationService**: Singleton service instance

### Dependencies
- **A2A Server**: Registry query endpoint for agent and skill discovery
- **Backend API**: Fallback endpoint for registration data
- **Environment Variables**: VITE_BACKEND_URL, VITE_A2A_URL for service endpoints

### Dependents
- **Active Mode Provider**: Uses service for skill resolution and availability checking
- **FloatingEpiLogosAgent**: Agent routing based on available agents and skills
- **Expert Routing**: Dynamic routing based on discovered capabilities

## Key Functions/Components
### AgentRegistrationService Class (Lines 27-212)
**Purpose**: Main service class providing agent and skill discovery with caching
**Parameters**: None (singleton pattern)
**Returns**: AgentRegistrationService instance
**Notes**: 212 lines implementing complete registration service functionality

### getRegistrationData() (Lines 37-49)
**Purpose**: Get registration data with cache management
**Parameters**: None
**Returns**: Promise<RegistrationData> - Complete registration data
**Notes**: 5-minute cache duration, automatic refresh on stale data

### refreshRegistrationData() (Lines 54-92)
**Purpose**: Refresh registration data from A2A registry with fallback
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Queries A2A server, processes data, falls back to defaults on failure

### processRegistryData(data) (Lines 97-120)
**Purpose**: Process raw registry data into structured format
**Parameters**: data (any) - Raw registry response
**Returns**: RegistrationData - Structured registration data
**Notes**: Filters chat skills, builds agent-skill mapping, validates data structure

### getDefaultRegistrationData() (Lines 125-144)
**Purpose**: Provide fallback registration data for system resilience
**Parameters**: None
**Returns**: RegistrationData - Default known working configuration
**Notes**: Hardcoded epii-agent configuration as fallback

### getAvailableAgents() (Lines 149-152)
**Purpose**: Get list of available agents
**Parameters**: None
**Returns**: Promise<string[]> - Array of agent IDs
**Notes**: Convenience method accessing cached registration data

### getBestAvailableChatSkill() (Lines 180-212)
**Purpose**: Find best available chat skill with intelligent fallback
**Parameters**: None
**Returns**: Promise<string> - Best chat skill ID
**Notes**: Prioritizes specific skills, falls back to epii-chat

## Data Flow
1. **Data Request**: Service method called → Cache check → Fresh data or cached return
2. **Data Refresh**: A2A registry query → Response processing → Data structuring → Cache update
3. **Fallback Handling**: Query failure → Default data generation → Cache update → Service continuation
4. **Skill Resolution**: Skill query → Registration data access → Filtering → Best match return
5. **Agent Discovery**: Agent query → Registration data access → Agent list return

## Configuration
### Environment Variables
- **VITE_BACKEND_URL**: Backend API endpoint (default: http://localhost:3001)
- **VITE_A2A_URL**: A2A server endpoint (default: http://localhost:3033)

### Cache Settings
- **Cache Duration**: 5 minutes for registration data
- **Automatic Refresh**: Stale data triggers background refresh
- **Fallback Strategy**: Default data on query failure

### API Endpoints
- **Registry Query**: POST /api/registry/query on A2A server
- **Query Payload**: { query: 'getRegistrationData' }
- **Response Format**: { availableAgents, availableSkills }

### Data Structure
- **RegistrationData**: availableAgents, availableSkills, chatSkills, agentSkillMap
- **SkillInfo**: id, name, description, bimbaCoordinate, agentId, qlMetadata
- **QL Metadata**: qlPosition, qlMode for skill positioning

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- **A2A Server**: Registry query endpoint for dynamic discovery
- **Backend API**: Fallback endpoint for registration data

### Integration Points
- **Active Mode Provider**: Primary consumer for skill resolution
- **FloatingEpiLogosAgent**: Agent routing based on discovered capabilities
- **Expert Routing**: Dynamic routing system integration

### Service Architecture
- **Singleton Pattern**: Single service instance across application
- **Cache Management**: Performance optimization with TTL
- **Fallback Strategy**: System resilience with default configurations

## Development Notes
- **Dynamic Discovery**: Runtime discovery of available agents and skills
- **Cache Strategy**: 5-minute TTL with automatic refresh on access
- **Error Resilience**: Comprehensive fallback to known working configuration
- **Type Safety**: Full TypeScript integration with comprehensive interfaces
- **Performance Optimization**: Caching reduces redundant API calls
- **Skill Filtering**: Intelligent chat skill identification and filtering
- **Agent Mapping**: Complete agent-to-skill relationship mapping
- **Environment Awareness**: Configurable endpoints via environment variables
- **Logging Strategy**: Comprehensive logging for debugging and monitoring
- **Fallback Data**: Hardcoded epii-agent configuration ensures system functionality
