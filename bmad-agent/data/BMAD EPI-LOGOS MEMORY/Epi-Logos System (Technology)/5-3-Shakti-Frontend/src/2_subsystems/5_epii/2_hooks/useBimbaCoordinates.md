# useBimbaCoordinates.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-front/src/subsystems/5_epii/2_hooks/useBimbaCoordinates.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Bimba Coordinates Hook responsible for managing and providing access to Bimba coordinate data with caching and real-time updates. Provides coordinate resolution, validation, and hierarchical navigation within the Bimba coordinate system. Serves as the primary interface for coordinate-based operations in the Epii subsystem with comprehensive coordinate management and graph integration.

## System Integration
### Imports
- **React Hooks**: useState, useEffect, useCallback, useMemo for state management and lifecycle
- **React Query**: useQuery, useQueryClient for data fetching and caching
- **BPMCP Service**: bpmcpService for backend coordinate operations
- **Coordinate Utils**: Coordinate parsing and validation utilities

### Exports
- **useBimbaCoordinates**: Main hook providing coordinate management functionality
- **CoordinateData**: Interface for coordinate data structure
- **CoordinateHierarchy**: Interface for hierarchical coordinate relationships

### Dependencies
- **BPMCP Service**: Backend service for coordinate data retrieval
- **React Query**: Data fetching and caching infrastructure
- **Coordinate Utilities**: Parsing, validation, and manipulation functions
- **Graph Data Integration**: Connection to graph visualization systems

### Dependents
- **Document Canvas**: Coordinate-based document organization and navigation
- **Meta Visualizations**: Coordinate-aware graph rendering and interaction
- **Epii Components**: Coordinate-based UI components and navigation
- **Analysis Pipeline**: Coordinate context for document analysis

## Key Functions/Components
### useBimbaCoordinates Hook (Lines 25-392)
**Purpose**: Main hook providing comprehensive coordinate management with caching and real-time updates
**Parameters**: initialCoordinate (optional string), options (optional configuration object)
**Returns**: Object with coordinates, hierarchy, navigation functions, and state management
**Notes**: 392 lines implementing comprehensive coordinate system with React Query integration

### Coordinate Resolution (Lines 45-120)
**Purpose**: Resolves coordinate strings to full coordinate objects with metadata
**Parameters**: coordinate (string), includeHierarchy (boolean)
**Returns**: Resolved coordinate object with properties and relationships
**Notes**: Handles coordinate parsing, validation, and metadata enrichment

### Hierarchical Navigation (Lines 122-200)
**Purpose**: Provides navigation functions for coordinate hierarchy traversal
**Parameters**: Various navigation parameters (parent, children, siblings)
**Returns**: Navigation functions and hierarchical data structures
**Notes**: Supports parent-child relationships and sibling coordinate discovery

### Coordinate Validation (Lines 202-250)
**Purpose**: Validates coordinate format and existence in the system
**Parameters**: coordinate (string), validationOptions (object)
**Returns**: Validation result with error details and suggestions
**Notes**: Comprehensive validation with format checking and existence verification

### Cache Management (Lines 252-320)
**Purpose**: Manages coordinate data caching with React Query integration
**Parameters**: Cache configuration and invalidation options
**Returns**: Cache management functions and status
**Notes**: Optimized caching with selective invalidation and refresh strategies

### Real-time Updates (Lines 322-392)
**Purpose**: Handles real-time coordinate updates and synchronization
**Parameters**: WebSocket connection and update handlers
**Returns**: Real-time update functions and connection status
**Notes**: WebSocket integration for live coordinate system updates

## Data Flow
1. **Hook Initialization**: Parameters received → Initial coordinate resolution → Cache setup → Real-time connection
2. **Coordinate Resolution**: Coordinate string → Parsing → Validation → Backend query → Metadata enrichment
3. **Hierarchical Navigation**: Navigation request → Hierarchy traversal → Related coordinates → Navigation state update
4. **Cache Management**: Data requests → Cache check → Backend fetch → Cache update → State synchronization
5. **Real-time Updates**: WebSocket events → Coordinate changes → Cache invalidation → UI updates

## Configuration
### Hook Options
- **initialCoordinate**: Starting coordinate for hook initialization (optional string)
- **enableHierarchy**: Enable hierarchical navigation features (default: true)
- **cacheTimeout**: Cache timeout in milliseconds (default: 300000 - 5 minutes)
- **enableRealtime**: Enable real-time updates (default: true)
- **validationLevel**: Coordinate validation strictness ('strict', 'normal', 'lenient')

### Coordinate Format
- **Standard Format**: '#X-Y-Z' where X, Y, Z are numeric identifiers
- **Hierarchical Levels**: Support for multi-level coordinate hierarchies
- **Validation Rules**: Format validation and existence checking
- **Special Coordinates**: Support for system-level and meta-coordinates

### Caching Configuration
- **Query Keys**: Structured query keys for efficient cache management
- **Stale Time**: 5-minute default stale time for coordinate data
- **Cache Invalidation**: Selective invalidation based on coordinate changes
- **Background Refetch**: Automatic background updates for active coordinates

### Real-time Integration
- **WebSocket Connection**: Live connection to coordinate update stream
- **Event Handling**: Coordinate change, creation, and deletion events
- **Selective Updates**: Targeted updates for relevant coordinates only
- **Connection Management**: Automatic reconnection and error handling

## Testing
No explicit test files referenced, but includes comprehensive error handling and validation

## Related Files
### Core Dependencies
- **../../services/bpmcpService**: Backend service for coordinate operations
- **../../utils/coordinateUtils**: Coordinate parsing and validation utilities
- **../../hooks/useWebSocket**: WebSocket integration for real-time updates

### Integration Points
- **Document Canvas**: Coordinate-based document organization
- **Meta Visualizations**: Graph rendering with coordinate awareness
- **Analysis Pipeline**: Coordinate context for document analysis
- **Navigation Components**: Coordinate-based UI navigation

### Coordinate System Architecture
- **Hierarchical Structure**: Multi-level coordinate organization
- **Graph Integration**: Connection to graph visualization systems
- **Real-time Synchronization**: Live updates across system components
- **Cache Optimization**: Efficient data management and retrieval

## Development Notes
- **Comprehensive Coordinate Management**: Full lifecycle management of Bimba coordinates
- **React Query Integration**: Optimized data fetching with caching and background updates
- **Hierarchical Navigation**: Support for complex coordinate relationships and traversal
- **Real-time Synchronization**: WebSocket integration for live coordinate updates
- **Validation Framework**: Comprehensive coordinate validation with multiple strictness levels
- **Performance Optimization**: Efficient caching strategies and selective updates
- **Error Resilience**: Robust error handling and recovery mechanisms
- **Extensible Design**: Easy addition of new coordinate features and operations
- **Graph System Integration**: Deep integration with visualization and analysis systems
- **Cross-Subsystem Coordination**: Coordinate sharing across Epii and other subsystems
