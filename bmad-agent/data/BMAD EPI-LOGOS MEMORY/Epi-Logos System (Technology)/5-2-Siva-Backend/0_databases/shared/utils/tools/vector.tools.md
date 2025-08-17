# vector.tools.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/shared/utils/tools/vector.tools.mjs`
**Bimba Coordinate**: `#5-2-0-1`
**Last Updated**: `2025-01-30`

## Purpose & Role
Vector Tools for Pratibimba semantic search providing LangChain-compatible tools for vector database operations with Qdrant integration. Handles semantic search operations, vector filtering, and contextual information retrieval from the Pratibimba vector store. Serves as the primary tool interface enabling semantic search capabilities with QL tag and Bimba coordinate filtering for enhanced contextual relevance.

## System Integration
### Imports
- **@langchain/core/tools**: DynamicStructuredTool for LangChain tool integration
- **zod**: Schema validation for tool input parameters
- **../../../lightrag/qdrant.service.mjs**: Qdrant client and collection configuration

### Exports
- **searchPratibimbaContextTool**: LangChain tool for semantic vector search operations

### Dependencies
- **Qdrant Service**: Vector database client for semantic search operations
- **LangChain Tools**: Tool framework for agent integration
- **Zod Validation**: Input parameter validation and schema enforcement

### Dependents
- **BPMCP Service**: Utilizes vector tools for semantic search operations
- **Analysis Pipeline**: Consumes vector search for contextual information retrieval
- **Agent Systems**: LangChain agents using vector search capabilities
- **Document Processing**: Document analysis requiring semantic context retrieval

## Key Functions/Components
### searchPratibimbaContextTool (Lines 17-96)
**Purpose**: LangChain-compatible tool for semantic vector search in Pratibimba Qdrant collection
**Parameters**: queryVector (array), limit (number), qlTags (array), bimba_coordinates (array)
**Returns**: JSON string with search results including content, metadata, and similarity scores
**Notes**: 96 lines implementing comprehensive vector search with filtering capabilities and error handling

### searchPratibimbaSchema (Lines 6-14)
**Purpose**: Zod validation schema for tool input parameters ensuring type safety
**Parameters**: Schema definition for queryVector, limit, qlTags, and bimba_coordinates
**Returns**: Validated input parameters for vector search operations
**Notes**: Comprehensive input validation with descriptive parameter documentation

## Data Flow
1. **Tool Invocation**: LangChain agent → Tool call → Parameter validation → Search execution
2. **Vector Search**: Query vector → Qdrant search → Filter application → Result ranking → Response formatting
3. **Filter Processing**: QL tags/coordinates → Filter construction → Search constraint application → Filtered results
4. **Result Processing**: Raw results → Metadata extraction → JSON formatting → Tool response delivery
5. **Error Handling**: Error detection → Error message formatting → Graceful failure response

## Configuration
**Qdrant Integration**: Configured through qdrant.service.mjs with collection name and client settings
**Search Parameters**: Configurable limit (default 5), optional QL tag and coordinate filtering
**Tool Registration**: LangChain DynamicStructuredTool with comprehensive schema validation

## Testing
Vector tools testing available in databases/shared/tests/ directory with comprehensive search functionality and filtering validation

## Related Files
**../../../lightrag/qdrant.service.mjs**: Qdrant client configuration and collection management
**../../bpmcp/bpMCP.service.mjs**: BPMCP service consuming vector search tools
**Analysis Pipeline**: Pipeline stages utilizing vector search for contextual enhancement

## Development Notes
- **LangChain Integration**: Comprehensive LangChain tool integration enabling agent-based semantic search operations
- **Vector Search Excellence**: Advanced vector search capabilities with QL tag and Bimba coordinate filtering for enhanced contextual relevance
- **Schema Validation**: Robust input validation ensuring type safety and parameter correctness
- **Error Handling**: Comprehensive error handling with graceful failure responses and detailed error messages
- **Performance Optimization**: Efficient vector search with configurable limits and targeted filtering capabilities
- **Production Ready**: Scalable vector search tool suitable for production semantic search operations
- **BPMCP Alignment**: Vector tools integration with sophisticated Bimba coordinate system and QL tag support
