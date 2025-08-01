# useNodeDetails.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/shared/hooks/bimba/useNodeDetails.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Node Details Hook responsible for fetching and managing node details from the Bimba graph. Aligns with the #4 Nara subsystem (contextual application) providing comprehensive node information including properties, connections, and Notion resolution. Serves as the primary interface for retrieving detailed node information with caching and error handling.

## System Integration
### Imports
- **React Query**: useQuery for data fetching and caching
- **Meta Components**: Node type and NodeDetailsPanel interfaces
- **BPMCP Service**: bpmcpService for backend communication

### Exports
- **NodeDetails**: Interface for node details structure
- **useNodeDetails**: Main hook for fetching node details

### Dependencies
- **BPMCP Service**: Backend service for node data retrieval
- **React Query**: Data fetching and caching infrastructure
- **Meta Data Types**: Node and connection type definitions

### Dependents
- **NodeDetailsPanel**: Primary consumer for displaying node information
- **Meta Visualizations**: Node detail display in graph components
- **Graph Interactions**: Node information on hover and click

## Key Functions/Components
### NodeDetails Interface (Lines 14-18)
**Purpose**: Interface defining the structure of node details data
**Parameters**: properties (MCPNodeProperties), connections (MCPNodeConnection[]), notionResolution (optional)
**Returns**: Type definition for node details
**Notes**: Comprehensive interface covering all node detail aspects

### useNodeDetails Hook (Lines 25-68)
**Purpose**: Main hook for fetching and managing node details with caching
**Parameters**: node (Node | null) - The node to fetch details for
**Returns**: Object with data, error, isLoading states
**Notes**: 69 lines implementing comprehensive node detail management

### Query Configuration (Lines 29-65)
**Purpose**: React Query configuration for node details fetching
**Parameters**: queryKey, queryFn, enabled, staleTime
**Returns**: Query result with data, error, loading states
**Notes**: Optimized caching with 5-minute stale time and conditional execution

### Data Transformation (Lines 38-58)
**Purpose**: Transform BPMCP data to match hook interface requirements
**Parameters**: BPMCP node details and notion resolution
**Returns**: Transformed NodeDetails object
**Notes**: Comprehensive transformation including parents, children, and siblings

### Connection Mapping (Lines 40-56)
**Purpose**: Map BPMCP relations to connection format for display
**Parameters**: Relations data (parents, children, siblings)
**Returns**: Array of MCPNodeConnection objects
**Notes**: Handles all relationship types with proper direction mapping

## Data Flow
1. **Hook Invocation**: Node provided → Coordinate extraction → Query enablement check
2. **Data Fetching**: Coordinate available → BPMCP service call → Enhanced node details retrieval
3. **Data Transformation**: BPMCP data → Interface transformation → Connection mapping → Notion resolution
4. **Caching**: Transformed data → React Query cache → 5-minute stale time → Performance optimization
5. **State Management**: Query states → Loading/error/success → Component updates → UI feedback

## Configuration
### Query Configuration
- **Query Key**: ['bpmcpNodeDetails', coordinate] for unique identification
- **Stale Time**: 5 minutes (300,000ms) for performance optimization
- **Enabled**: Conditional execution based on coordinate availability
- **Error Handling**: Comprehensive error catching and reporting

### Data Structure
#### NodeDetails Interface
- **properties**: MCPNodeProperties - Node metadata and attributes
- **connections**: MCPNodeConnection[] - Related nodes and relationships
- **notionResolution**: NotionResolution (optional) - Notion integration data

#### Connection Types
- **Parents**: Incoming relationships with 'in' direction
- **Children**: Outgoing relationships with 'out' direction
- **Siblings**: Related nodes with 'out' direction

### Relationship Mapping
- **Direction In**: Parent relationships and incoming connections
- **Direction Out**: Child and sibling relationships and outgoing connections
- **Type Preservation**: Original relationship types maintained in transformation

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- **../../services/bpmcpService**: Backend service for node data retrieval
- **../../components/meta/metaData**: Node type definitions
- **../../components/meta/NodeDetailsPanel**: Interface definitions

### Integration Points
- **NodeDetailsPanel**: Primary consumer for displaying node information
- **Meta Visualizations**: Node detail display in graph components
- **Graph Interactions**: Node information on hover and click

### Service Architecture
- **React Query**: Data fetching and caching infrastructure
- **BPMCP Integration**: Backend service communication
- **Type Safety**: Comprehensive TypeScript interfaces

## Development Notes
- **Nara Subsystem Alignment**: Aligns with #4 Nara subsystem for contextual application
- **Performance Optimization**: 5-minute caching reduces unnecessary API calls
- **Conditional Execution**: Query only runs when coordinate is available
- **Comprehensive Transformation**: Handles all relationship types (parents, children, siblings)
- **Error Resilience**: Robust error handling with detailed logging
- **Type Safety**: Full TypeScript integration with comprehensive interfaces
- **Notion Integration**: Optional Notion resolution for enhanced context
- **Relationship Direction**: Proper direction mapping for visual representation
- **Coordinate-Based**: Uses Bimba coordinates as primary identification
- **Extensible Design**: Easy addition of new node detail properties and relationships
