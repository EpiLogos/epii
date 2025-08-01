# zodToJsonSchema.ts - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/bpmcp/mcp-server/src/utils/zodToJsonSchema.ts`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Zod to JSON Schema Converter providing schema transformation utilities for MCP tool registration. Converts Zod validation schemas to JSON Schema format required by the Model Context Protocol with comprehensive type mapping and validation preservation. Serves as the schema conversion bridge within the BPMCP server architecture ensuring proper MCP tool registration and input validation across all tools.

## System Integration
### Imports
- **Zod**: z from "zod" for Zod schema type definitions and validation

### Exports
- **zodToJsonSchema**: Main conversion function transforming Zod schemas to JSON Schema format

### Dependencies
- **Zod**: Zod validation library for schema definitions and type checking
- **JSON Schema**: Standard JSON Schema specification for output format

### Dependents
- **All BPMCP Tools**: Every tool uses zodToJsonSchema for MCP tool registration
- **Schema Validation**: Input validation systems rely on converted schemas
- **MCP Server**: Server uses converted schemas for tool registration and validation
- **Tool Registration**: All tool definitions require JSON Schema format for MCP compliance

## Key Functions/Components
### zodToJsonSchema Function (Lines 9-99)
**Purpose**: Main conversion function transforming Zod schemas to JSON Schema format
**Parameters**: zodSchema (z.ZodType<any, any>), schemaName (optional string)
**Returns**: JSON Schema object conforming to JSON Schema specification
**Notes**: 99 lines implementing comprehensive Zod to JSON Schema conversion

### ZodObject Conversion (Lines 10-26)
**Purpose**: Converts Zod object schemas to JSON Schema object format
**Parameters**: ZodObject schema with shape and property definitions
**Returns**: JSON Schema object with properties and required fields
**Notes**: Handles nested objects, required fields, and property recursion

### ZodString Conversion (Lines 27-35)
**Purpose**: Converts Zod string schemas to JSON Schema string format
**Parameters**: ZodString schema with optional constraints and descriptions
**Returns**: JSON Schema string type with validation constraints
**Notes**: Preserves string validation rules and descriptions

### ZodNumber Conversion (Lines 36-45)
**Purpose**: Converts Zod number schemas to JSON Schema number format
**Parameters**: ZodNumber schema with optional constraints
**Returns**: JSON Schema number type with validation constraints
**Notes**: Handles integer and float number types with constraints

### ZodBoolean Conversion (Lines 46-50)
**Purpose**: Converts Zod boolean schemas to JSON Schema boolean format
**Parameters**: ZodBoolean schema
**Returns**: JSON Schema boolean type
**Notes**: Simple boolean type conversion

### ZodArray Conversion (Lines 51-60)
**Purpose**: Converts Zod array schemas to JSON Schema array format
**Parameters**: ZodArray schema with element type definitions
**Returns**: JSON Schema array type with items specification
**Notes**: Recursive conversion of array element types

### ZodEnum Conversion (Lines 61-70)
**Purpose**: Converts Zod enum schemas to JSON Schema enum format
**Parameters**: ZodEnum schema with enumeration values
**Returns**: JSON Schema enum type with allowed values
**Notes**: Preserves enumeration constraints and values

### ZodOptional Handling (Lines 71-80)
**Purpose**: Handles optional Zod schema types for proper JSON Schema conversion
**Parameters**: ZodOptional wrapper schemas
**Returns**: Unwrapped schema conversion with optional handling
**Notes**: Properly handles optional field detection and conversion

### Recursive Conversion (Lines 81-99)
**Purpose**: Handles recursive schema conversion for nested structures
**Parameters**: Nested Zod schemas of various types
**Returns**: Recursively converted JSON Schema structures
**Notes**: Comprehensive recursive handling for complex nested schemas

## Data Flow
1. **Schema Input**: Zod schema received → Type detection → Conversion routing → Processing initiation
2. **Type Detection**: Schema type → Handler selection → Conversion strategy → Processing execution
3. **Property Processing**: Object properties → Recursive conversion → Required field detection → Schema building
4. **Validation Preservation**: Zod constraints → JSON Schema constraints → Validation rule mapping → Constraint preservation
5. **Schema Output**: Converted schema → JSON Schema validation → MCP compliance → Tool registration

## Configuration
### Conversion Configuration
- **Type Mapping**: Comprehensive mapping between Zod and JSON Schema types
- **Constraint Preservation**: Maintains validation constraints during conversion
- **Recursive Processing**: Handles nested and complex schema structures
- **Optional Handling**: Proper detection and handling of optional fields

### JSON Schema Compliance
- **Specification Adherence**: Full compliance with JSON Schema specification
- **MCP Requirements**: Meets Model Context Protocol schema requirements
- **Validation Preservation**: Maintains all Zod validation rules in JSON format
- **Type Safety**: Ensures type safety during conversion process

### Schema Support
- **Object Schemas**: Complete object schema conversion with properties and requirements
- **Primitive Types**: String, number, boolean type conversion with constraints
- **Array Schemas**: Array type conversion with recursive element processing
- **Enum Schemas**: Enumeration type conversion with value preservation
- **Optional Types**: Optional field handling and detection
- **Nested Structures**: Recursive conversion for complex nested schemas

## Testing
No explicit test files referenced, but includes comprehensive type conversion validation and JSON Schema compliance checking

## Related Files
### Core Dependencies
- **zod**: Zod validation library for schema definitions

### Integration Points
- **All BPMCP Tools**: Universal schema conversion for all tool registrations
- **MCP Server**: Server-level tool registration and schema validation
- **Schema Validation**: Input validation systems using converted schemas
- **Tool Registration**: MCP tool registration requiring JSON Schema format

### Conversion Architecture
- **Schema Transformation**: Comprehensive Zod to JSON Schema conversion
- **Type Mapping**: Complete type system mapping between libraries
- **Validation Preservation**: Maintains validation rules during conversion
- **MCP Compliance**: Ensures proper MCP protocol compliance

## Development Notes
- **Comprehensive Type Support**: Supports all major Zod schema types and constructs
- **Validation Preservation**: Maintains all validation constraints during conversion process
- **Recursive Processing**: Handles complex nested schema structures with proper recursion
- **MCP Compliance**: Ensures full compliance with Model Context Protocol requirements
- **JSON Schema Standards**: Adheres to JSON Schema specification for maximum compatibility
- **Type Safety**: Maintains type safety throughout conversion process
- **Performance Optimization**: Efficient conversion with minimal computational overhead
- **Extensible Design**: Easy addition of new Zod type conversions and JSON Schema features
- **Error Handling**: Graceful handling of unsupported or malformed schemas
- **BPMCP Alignment**: Properly aligned with Bimba Process Management and Coordination Protocol architecture
