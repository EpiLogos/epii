# schemas.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/tools/notion/schemas.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Notion Tools Schema Definitions providing comprehensive input validation and type safety for Notion workspace operations within the BPMCP server. Handles schema definitions for all Notion tools including query, page properties, block append, and crystallization operations with parameter validation, type constraints, and default value management. Serves as the primary validation layer within the BPMCP Notion tools ecosystem enabling robust input validation, type safety, and parameter management across all Notion-based operations.

## System Integration
### Imports
- **Zod**: z from zod for schema definition and validation

### Exports
- **QueryNotionSchema**: Schema definition for Notion workspace search operations
- **GetNotionPagePropertiesSchema**: Schema definition for page properties retrieval operations
- **AppendNotionBlockSchema**: Schema definition for block append operations
- **CrystallizeToNotionSchema**: Schema definition for comprehensive page creation operations

### Dependencies
- **Zod Library**: Schema validation and type safety framework
- **Type System**: TypeScript type inference and validation

### Dependents
- **Query Tool**: queryNotion.ts for workspace search validation
- **Properties Tool**: getNotionPageProperties.ts for page data retrieval validation
- **Block Tool**: appendNotionBlock.ts for content addition validation
- **Crystallization Tool**: crystallizeToNotion.ts for page creation validation
- **Tool Registry**: MCP server tool registration and schema conversion

## Key Functions/Components
### QueryNotionSchema Definition (Lines 4-8)
**Purpose**: Defines validation schema for Notion workspace search operations
**Parameters**: query (string), limit (number 1-50, default 10), includeContent (boolean, default false)
**Returns**: Zod schema object for workspace search validation
**Notes**: 61 lines implementing comprehensive Notion tools schema definitions

### GetNotionPagePropertiesSchema Definition (Lines 10-15)
**Purpose**: Defines validation schema for page properties retrieval operations
**Parameters**: pageId (string), includeContent (boolean, default false), includeFileContent (boolean, default false)
**Returns**: Zod schema object for page properties validation
**Notes**: Advanced page analysis schema with flexible content inclusion options

### AppendNotionBlockSchema Definition (Lines 17-22)
**Purpose**: Defines validation schema for block append operations
**Parameters**: pageId (string), blocks (array of block objects)
**Returns**: Zod schema object for block append validation
**Notes**: Block content schema with structured block data validation

### CrystallizeToNotionSchema Definition (Lines 24-61)
**Purpose**: Defines validation schema for comprehensive page creation operations
**Parameters**: coordinate (string), title (string), content (string), properties (object), parentPageId (string, optional), databaseId (string, optional)
**Returns**: Zod schema object for crystallization validation
**Notes**: Complex schema for comprehensive page creation with coordinate integration

### Page ID Validation (Lines 11, 18, 26)
**Purpose**: Validates Notion page ID strings for page operations
**Parameters**: String input for page IDs
**Returns**: Validated page ID strings
**Notes**: Consistent page ID validation across Notion tools

### Content Inclusion Flags (Lines 7, 13, 14)
**Purpose**: Manages content inclusion preferences for Notion operations
**Parameters**: Boolean flags for content and file content inclusion
**Returns**: Validated boolean values with appropriate defaults
**Notes**: Flexible content inclusion management across tools

### Block Data Validation (Line 19)
**Purpose**: Validates arrays of block objects for content append operations
**Parameters**: Array of block objects with structured data
**Returns**: Validated block array
**Notes**: Complex block structure validation for Notion API compatibility

### Coordinate Integration (Line 25)
**Purpose**: Validates Bimba coordinate strings for crystallization operations
**Parameters**: Coordinate string input
**Returns**: Validated coordinate string
**Notes**: Coordinate-based integration for BPMCP alignment

### Properties Object Validation (Line 29)
**Purpose**: Validates property objects for page creation operations
**Parameters**: Object with page properties and metadata
**Returns**: Validated properties object
**Notes**: Flexible property validation for comprehensive page creation

### Optional Parent References (Lines 30-31)
**Purpose**: Validates optional parent page and database references
**Parameters**: Optional parent page ID and database ID strings
**Returns**: Validated optional references
**Notes**: Flexible parent relationship management for page organization

## Data Flow
1. **Schema Definition**: Zod schema creation → Parameter specification → Validation rules → Type inference
2. **Input Validation**: Client input → Schema validation → Type checking → Parameter extraction
3. **Error Handling**: Validation errors → Error formatting → Client feedback → Correction guidance
4. **Type Safety**: Schema validation → TypeScript type inference → Compile-time safety → Runtime validation

## Configuration
### Schema Configuration
- **QueryNotionSchema**: Workspace search with query, limit, and content inclusion
- **GetNotionPagePropertiesSchema**: Page analysis with content and file inclusion options
- **AppendNotionBlockSchema**: Block append with page targeting and block data
- **CrystallizeToNotionSchema**: Comprehensive page creation with coordinate integration

### Parameter Configuration
- **Search Limits**: 1-50 results with default 10 for optimal workspace performance
- **Content Inclusion**: Optional content and file retrieval for bandwidth management
- **Block Management**: Structured block data validation for content operations
- **Coordinate Integration**: Bimba coordinate validation for BPMCP alignment

### Validation Configuration
- **String Validation**: Query, page ID, and coordinate string validation
- **Number Constraints**: Integer limits with min/max bounds for search operations
- **Boolean Flags**: Content inclusion preferences and operational flags
- **Object Validation**: Complex object validation for properties and block data

## Testing
No explicit test files referenced, but schemas provide comprehensive validation testing through Zod framework

## Related Files
### Core Dependencies
- **zod**: Schema validation and type safety framework

### Notion Tools Ecosystem
- **./queryNotion.ts**: Workspace search tool using QueryNotionSchema
- **./getNotionPageProperties.ts**: Page properties tool using GetNotionPagePropertiesSchema
- **./appendNotionBlock.ts**: Block append tool using AppendNotionBlockSchema
- **./crystallizeToNotion.ts**: Page creation tool using CrystallizeToNotionSchema
- **./index.ts**: Notion tools module exports and organization

### Integration Points
- **MCP Server**: Schema conversion for tool registration
- **Tool Registry**: Schema-based tool validation and registration
- **Client Applications**: Input validation for Notion operations
- **Type System**: TypeScript type inference and compile-time safety

## Development Notes
- **Comprehensive Validation**: Complete schema definitions for all Notion tool operations
- **Type Safety**: Full TypeScript integration with runtime validation
- **Parameter Management**: Consistent parameter constraints and default values across tools
- **Coordinate Integration**: Bimba coordinate validation for BPMCP alignment
- **Flexible Content**: Optional content inclusion with configurable parameters
- **Complex Operations**: Advanced schema support for comprehensive page creation
- **Production Ready**: Robust schema validation suitable for production Notion operations
- **Development Support**: Clear schema definitions and validation for development
- **Extensible Design**: Easy addition of new Notion tool schemas and validation rules
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
