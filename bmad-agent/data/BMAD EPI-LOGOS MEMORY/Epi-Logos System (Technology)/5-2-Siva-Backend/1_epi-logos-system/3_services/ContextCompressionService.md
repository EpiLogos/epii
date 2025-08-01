# ContextCompressionService.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/3_services/ContextCompressionService.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Context Compression Service providing intelligent context compression, history management, and archival capabilities with expert-specific compression strategies. Implements sophisticated compression algorithms tailored to each subsystem expert (Epii, Nara, Paramasiva, Anuttara, Universal) with LLM-powered summarization and background archival scheduling. Serves as the primary service for managing conversation context and memory optimization.

## System Integration
### Imports
- **ChatSessionService**: Session management and message storage

### Exports
- **ContextCompressionService**: Main service class for context compression

### Dependencies
- **MongoDB Client**: Database storage for compressed sessions
- **LLM Service**: AI-powered compression and summarization
- **Chat Session Service**: Session and message management

### Dependents
- **Universal Orchestration Pipeline**: Context management for agent interactions
- **Chat Session Service**: Compression integration for session management
- **Frontend Context Manager**: Compressed context delivery
- **Background Scheduler**: Automated archival and compression

## Key Functions/Components
### ContextCompressionService Class (Lines 12-668)
**Purpose**: Main service class providing intelligent context compression with expert-specific strategies
**Parameters**: mongoClient (MongoDB client), llmService (LLM service instance)
**Returns**: ContextCompressionService instance
**Notes**: 668 lines implementing comprehensive compression functionality

### _initializeCompressionPrompts() (Lines 26-113)
**Purpose**: Initialize expert-specific compression prompts and templates
**Parameters**: None
**Returns**: Object with compression strategies for each expert
**Notes**: Defines unique compression approaches for Epii, Nara, Paramasiva, Anuttara, and Universal experts

### compressSessionContext(sessionId, keepRecentCount, forceCompression) (Lines 122-200)
**Purpose**: Compress session context with expert-specific strategy
**Parameters**: sessionId (string), keepRecentCount (number), forceCompression (boolean)
**Returns**: Promise<Object> - Compression result with summary and metadata
**Notes**: Intelligent compression with configurable recent message retention

### _generateIntelligentSummary(messages, strategy, session) (Lines 250-300)
**Purpose**: Generate AI-powered compression summary using expert-specific prompts
**Parameters**: messages (array), strategy (object), session (object)
**Returns**: Promise<string> - Generated compression summary
**Notes**: LLM-powered summarization with expert-specific context and templates

### _startArchivalScheduler() (Lines 400-450)
**Purpose**: Start background scheduler for automated session archival
**Parameters**: None
**Returns**: void
**Notes**: Periodic archival of old sessions with configurable intervals

### archiveOldSessions(olderThanDays) (Lines 500-550)
**Purpose**: Archive sessions older than specified threshold
**Parameters**: olderThanDays (number)
**Returns**: Promise<Object> - Archival statistics
**Notes**: Batch archival with compression and metadata preservation

### getCompressedContext(sessionId) (Lines 600-650)
**Purpose**: Retrieve compressed context for session continuation
**Parameters**: sessionId (string)
**Returns**: Promise<Object> - Compressed context with recent messages
**Notes**: Optimized context retrieval for conversation continuation

## Data Flow
1. **Compression Request**: Session ID → Session retrieval → Message analysis → Compression strategy selection
2. **Expert Strategy**: Expert skill ID → Strategy lookup → Prompt selection → Template application
3. **LLM Summarization**: Messages → Expert prompt → LLM processing → Summary generation
4. **Context Storage**: Summary → Session update → Message archival → Metadata preservation
5. **Background Archival**: Scheduler trigger → Old session detection → Batch compression → Archival completion

## Configuration
### Expert-Specific Strategies
- **epii-chat**: Meta-perspective compression focusing on document analysis and coordinate relationships
- **nara-chat**: Personal context compression emphasizing identity and oracle guidance
- **paramasiva-chat**: Quaternary logic compression highlighting geometric and topological insights
- **anuttara-chat**: Foundational compression preserving void operations and emergent patterns
- **universal-chat**: Cross-system compression maintaining integration and coordination themes

### Compression Templates
- **Epii Template**: Coordinate focus, documents analyzed, key insights, knowledge synthesis, conversation arc
- **Nara Template**: Identity context, personal themes, oracle guidance, growth patterns, individual focus
- **Paramasiva Template**: Geometric patterns, QL cycles, topological forms, dimensional work, structural logic
- **Anuttara Template**: Foundational patterns, void operations, emergent forms, proto-logic, root understanding
- **Universal Template**: Cross-system insights, integration points, universal principles, multi-domain connections

### Compression Parameters
- **keepRecentCount**: Number of recent messages to preserve (default: 10)
- **forceCompression**: Force compression regardless of message count
- **compressionThreshold**: Minimum messages required for compression (default: 15)
- **archivalInterval**: Background archival frequency
- **olderThanDays**: Age threshold for session archival

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- **ChatSessionService.mjs**: Session and message management
- **LLM Service**: AI-powered summarization and compression

### Integration Points
- **Universal Orchestration Pipeline**: Context management for agent interactions
- **Frontend Context Manager**: Compressed context delivery
- **Background Scheduler**: Automated archival and compression

### Service Architecture
- **Compression Engine**: Expert-specific compression strategies
- **Archival System**: Background session archival and cleanup
- **Context Retrieval**: Optimized context delivery for conversation continuation

## Development Notes
- **Expert-Specific Compression**: Unique compression strategies tailored to each subsystem expert
- **LLM Integration**: AI-powered summarization with expert-specific prompts and templates
- **Background Processing**: Automated archival scheduler for system maintenance
- **Context Preservation**: Intelligent preservation of essential conversation elements
- **Memory Optimization**: Efficient context management for long-running conversations
- **Template System**: Structured compression templates for consistent output format
- **Configurable Retention**: Flexible message retention policies for different use cases
- **Error Resilience**: Comprehensive error handling with graceful degradation
- **Performance Optimization**: Efficient compression algorithms with minimal overhead
- **Scalability**: Designed for high-volume session compression and archival
