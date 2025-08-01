# ChatSessionService.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/epi-logos-system/3_services/ChatSessionService.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
Chat Session Management Service providing comprehensive session management with MongoDB persistence, context-aware routing, compression, and archival capabilities. Handles session lifecycle management, message storage, expert skill routing, and session compression for the Epi-Logos system. Serves as the primary backend service for chat session operations with performance optimization through strategic indexing.

## System Integration
### Imports
- **mongodb**: ObjectId for MongoDB document identification

### Exports
- **ChatSessionService**: Main service class for chat session management

### Dependencies
- **MongoDB**: Database storage for sessions and messages
- **MongoDB Client**: Database connection and operations

### Dependents
- **Universal Orchestration Pipeline**: Session management for agent interactions
- **Frontend Context Manager**: Session state synchronization
- **Floating Agent**: Session history and management
- **Chat Components**: Session creation and message handling

## Key Functions/Components
### ChatSessionService Class (Lines 12-643)
**Purpose**: Main service class providing comprehensive chat session management
**Parameters**: mongoClient (MongoDB client instance)
**Returns**: ChatSessionService instance
**Notes**: 643 lines implementing complete session management functionality

### _ensureIndexes() (Lines 27-45)
**Purpose**: Create database indexes for optimal query performance
**Parameters**: None
**Returns**: Promise<void>
**Notes**: Creates indexes for sessions and messages collections with performance optimization

### createNewSession(userId, sessionType, contextId, metadata) (Lines 55-87)
**Purpose**: Create new chat session with metadata and expert skill routing
**Parameters**: userId (string), sessionType (string), contextId (optional), metadata (optional)
**Returns**: Promise<Object> - Created session object
**Notes**: Generates session title, determines expert skill, handles session metadata

### getSession(sessionId, includeMessages, messageLimit) (Lines 96-119)
**Purpose**: Retrieve session by ID with optional message loading
**Parameters**: sessionId (string), includeMessages (boolean), messageLimit (number)
**Returns**: Promise<Object|null> - Session object or null if not found
**Notes**: Optional message inclusion with configurable limit, chronological ordering

### getSessionHistory(userId, limit, sessionType) (Lines 128-150)
**Purpose**: Get session history for user with filtering and pagination
**Parameters**: userId (string), limit (number), sessionType (optional)
**Returns**: Promise<Array> - Array of session objects
**Notes**: Includes message count and last message preview, sorted by last activity

### addMessage(sessionId, userId, content, messageType, metadata) (Lines 200-250)
**Purpose**: Add message to session with automatic session updates
**Parameters**: sessionId, userId, content, messageType, metadata
**Returns**: Promise<Object> - Created message object
**Notes**: Updates session activity, increments message count, handles metadata

### compressSession(sessionId, compressionSummary) (Lines 300-350)
**Purpose**: Compress session by archiving old messages and storing summary
**Parameters**: sessionId (string), compressionSummary (string)
**Returns**: Promise<boolean> - Success status
**Notes**: Archives messages, updates session compression status, maintains recent messages

### archiveSession(sessionId) (Lines 400-430)
**Purpose**: Archive session by marking as inactive
**Parameters**: sessionId (string)
**Returns**: Promise<boolean> - Success status
**Notes**: Marks session as inactive, preserves data for historical access

## Data Flow
1. **Session Creation**: User request → Session creation → Expert skill determination → Database storage
2. **Message Addition**: Message content → Session validation → Message storage → Session update
3. **Session Retrieval**: Session query → Database lookup → Optional message loading → Response formatting
4. **Session Compression**: Compression trigger → Message archival → Summary storage → Session update
5. **Session History**: User query → Session filtering → Message preview → Response compilation

## Configuration
### Database Structure
- **Database**: 'epi_logos_sessions'
- **Collections**: 'chat_sessions', 'chat_messages'
- **Indexes**: Performance-optimized indexes for common queries

### Session Types
- **general**: General conversation sessions
- **document**: Document-focused sessions
- **analysis**: Analysis-specific sessions
- **coordinate**: Coordinate-based sessions

### Session Schema
- **_id**: Unique session identifier
- **userId**: User identifier
- **sessionType**: Type of session
- **contextId**: Associated context (documentId, coordinate, etc.)
- **title**: Generated session title
- **timestamp**: Session creation time
- **lastActivity**: Last activity timestamp
- **messageCount**: Number of messages in session
- **isActive**: Session active status
- **isCompressed**: Compression status
- **compressionSummary**: Compression summary text
- **expertSkillId**: Associated expert skill
- **metadata**: Additional session metadata

### Message Schema
- **_id**: Unique message identifier
- **sessionId**: Associated session ID
- **userId**: Message author
- **content**: Message content
- **messageType**: Type of message (user, agent, system)
- **timestamp**: Message timestamp
- **metadata**: Additional message metadata

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- **MongoDB**: Database storage and persistence
- **MongoDB Client**: Database connection and operations

### Integration Points
- **Universal Orchestration Pipeline**: Session management for agent interactions
- **Frontend Context Manager**: Session state synchronization
- **Floating Agent**: Session history and management
- **Chat Components**: Session creation and message handling

### Service Architecture
- **Session Management**: Complete session lifecycle management
- **Message Storage**: Persistent message storage with metadata
- **Performance Optimization**: Strategic indexing for query performance

## Development Notes
- **Performance Optimization**: Strategic database indexing for common query patterns
- **Session Compression**: Intelligent session compression with summary preservation
- **Expert Routing**: Automatic expert skill determination based on session context
- **Context Awareness**: Session context tracking for document and coordinate associations
- **Archival Support**: Session archival with data preservation for historical access
- **Metadata Management**: Comprehensive metadata support for sessions and messages
- **Error Resilience**: Comprehensive error handling with detailed logging
- **Scalability**: Designed for high-volume session and message management
- **Type Safety**: Consistent data types and validation throughout
- **Activity Tracking**: Automatic session activity updates and tracking
