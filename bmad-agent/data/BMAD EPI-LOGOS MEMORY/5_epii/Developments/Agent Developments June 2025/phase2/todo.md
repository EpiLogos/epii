# Epi-Logos Agent Development - Phase 2 Implementation

**Version:** 1.0  
**Objective:** Implement undone epics from epii_agent_actionable_plan.md with service-layer architecture

## Architectural Principles
- Service Layer Pattern: Complex async operations in services, clean React hooks as API
- Holographic Design: Each subsystem complete internally while exposing universal interfaces
- AG-UI Event-Driven: Use standard AG-UI events for all state coordination
- Agent "Skin" Architecture: Chat skills as personality layers over universal agent
- Simplicity & Gentle Evolution: Every change minimal and testable in isolation

---

## Phase 1: Fix Critical Issues (IMMEDIATE)

### Task 1.1: Fix FloatingAgent UI Issues ❌
**Epic Reference:** Task 3.0.5
**Priority:** Critical
**Status:** Not Started

**Issues to Fix:**
- [ ] **Laggy/Unresponsive Interactions**: Fix excessive re-renders or blocking operations
- [ ] **Non-functional Chat Input**: Ensure text input accepts user input and triggers send operations
- [ ] **Window Too Small**: Increase default size from current to 400x600 minimum
- [ ] **Non-resizable Window**: Add drag handles and resize functionality
- [ ] **Performance**: Memoize expensive operations and optimize re-render cycles

**Files to Modify:**
- `epii_app/friendly-file-front/src/epi-logos-system/1_components/FloatingEpiLogosAgent.tsx`

**Technical Fixes:**
- Input field: Ensure proper onChange handlers and state updates
- Window resize: Add drag handles and resize functionality  
- Performance: Memoize expensive operations and optimize re-render cycles
- Responsive design: Ensure window works on different screen sizes
- Z-index management: Proper layering with other UI elements

### Task 1.2: Add Position Anchoring Logic ❌
**Priority:** High
**Status:** Not Started

**Implementation:**
- [ ] Add anchor position logic to bounce back to bottom-right when released
- [ ] Implement smooth animation for anchor return
- [ ] Add user preference for anchor position
- [ ] Ensure anchoring respects window boundaries

**Files to Modify:**
- `epii_app/friendly-file-front/src/epi-logos-system/1_components/FloatingEpiLogosAgent.tsx`

---

## Phase 2: Epic 3 - State Management Foundation (HIGH PRIORITY)

### Task 2.1: Audit and Restore Missing EpiiContext State Management ❌
**Epic Reference:** Task 3.0
**Priority:** High
**Status:** Not Started

**Audit Targets:**
- [ ] Document state management (creation, updates, deletion, coordinate assignment)
- [ ] Selection state management (text selections, persistence, coordinate awareness)
- [ ] Analysis session management (session creation, results tracking, history)
- [ ] Chat message state (if not fully migrated to Floating Agent)
- [ ] UI state coordination (loading states, error handling, status messages)

**Files to Audit:**
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/4_context/EpiiContext.tsx`
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentCanvas.tsx`
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/1_hooks/useUniversalDocumentState.ts`

**Restoration Strategy:**
- [ ] Identify missing state coordination causing functionality gaps
- [ ] Restore critical state management temporarily in current EpiiContext
- [ ] Document restored functionality for proper service layer migration
- [ ] Ensure DocumentCanvas has complete, working state before transformation

### Task 2.2: Transform EpiiContext into Service-Layer Pattern ❌
**Epic Reference:** Task 3.1
**Priority:** High
**Status:** Not Started

**Implementation Phases:**
- [ ] **Phase 1:** Extract complex logic from EpiiContext into EpiiStateService
- [ ] **Phase 2:** Simplify useEpii hook to clean API over service
- [ ] **Phase 3:** Update components to use simplified context API
- [ ] **Phase 4:** Add AG-UI event bridging for global coordination
- [ ] **Phase 5:** Document pattern for extension to other subsystems

**New Files to Create:**
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/1_services/EpiiStateService.ts`

**Files to Refactor:**
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/4_context/EpiiContext.tsx`
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/DocumentCanvas.tsx`
- [ ] `epii_app/friendly-file-front/src/subsystems/5_epii/3_visualization/EpiiSidebar.tsx`

### Task 2.3: Deprecate Standalone Chat Components ❌
**Epic Reference:** Task 3.2
**Priority:** Medium
**Status:** Not Started

**Components to Remove:**
- [ ] Remove DocumentChat import and usage from DocumentCanvas.tsx
- [ ] Remove EpiiChat.tsx entirely
- [ ] Clean up exports from index.ts
- [ ] Check for any direct chat routes

**Feature Migration:**
- [ ] Move document-specific chat history to FloatingAgent
- [ ] Implement document context in FloatingAgent via useAgentContext hook
- [ ] Migrate text selection integration patterns
- [ ] Preserve analysis integration patterns

### Task 2.4: Redesign Bimba Update Overlay for Agent Interaction ❌
**Epic Reference:** Task 3.3
**Priority:** Medium
**Status:** Not Started

**Workflow Changes:**
- [ ] Replace form-based interaction with conversational flow
- [ ] Trigger FloatingAgent with specific context when "LLM Suggestions" clicked
- [ ] Pass current coordinate and node data as agent context
- [ ] Use agent skills instead of direct API calls

**Skills Integration:**
- [ ] Verify UnifiedRag skill integration
- [ ] Implement suggestBimbaUpdate conversation flow
- [ ] Implement applyBimbaUpdate with conversational approval
- [ ] Maintain backward compatibility with existing overlay

---

## Phase 3: Epic 2.7 - Session Management (MEDIUM PRIORITY)

### Task 3.1: Chat Session Management UI ❌
**Epic Reference:** Task 2.7.1
**Priority:** Medium
**Status:** Not Started

**New Components to Create:**
- [ ] `epii_app/friendly-file-front/src/epi-logos-system/1_components/ChatSessionManager.tsx`

**Features to Implement:**
- [ ] New Session Button: Clear current conversation and start fresh
- [ ] Session History Dropdown: List recent sessions with timestamps and context
- [ ] Clear History Button: Remove all messages from current session
- [ ] Compress Context Button: Summarize long conversations
- [ ] Session Context Indicator: Show current session type
- [ ] Export/Archive Session: Save important conversations

**Integration:**
- [ ] Embed in FloatingEpiLogosAgent header/toolbar area
- [ ] Connect to session storage service

### Task 3.2: Backend Session Management Service ❌
**Epic Reference:** Task 2.7.2
**Priority:** Medium
**Status:** Not Started

**New Files to Create:**
- [ ] `epii_app/friendly-file-backend/epi-logos-system/3_services/ChatSessionService.mjs`

**Service Methods to Implement:**
- [ ] `createNewSession(userId, sessionType, contextId)`
- [ ] `getSessionHistory(userId, limit)`
- [ ] `compressSessionContext(sessionId)`
- [ ] `clearSessionMessages(sessionId)`
- [ ] `archiveSession(sessionId)`

**Database Schema:**
- [ ] Extend ChatMessage model with sessionId field
- [ ] Create ChatSession collection with metadata
- [ ] Implement session indexing for performance

### Task 3.3: Context-Aware Session Routing ❌
**Epic Reference:** Task 2.7.3
**Priority:** Medium
**Status:** Not Started

**New Files to Create:**
- [ ] `epii_app/friendly-file-front/src/epi-logos-system/3_services/SessionRoutingService.ts`

**Routing Logic:**
- [ ] Document selection → switch to document-specific session
- [ ] Document deselection → switch to general mode session
- [ ] Mode change → switch to appropriate expert session
- [ ] Manual session creation → user-controlled session

**Integration Points:**
- [ ] FloatingEpiLogosAgent message sending
- [ ] Document selection changes in DocumentCanvas
- [ ] Mode transitions between subsystems

### Task 3.4: Context Compression & History Management ❌
**Epic Reference:** Task 2.7.4
**Priority:** Medium
**Status:** Not Started

**New Files to Create:**
- [ ] `epii_app/friendly-file-backend/epi-logos-system/3_services/ContextCompressionService.mjs`

**Compression Strategy:**
- [ ] Trigger compression when session exceeds 50 messages
- [ ] Preserve last 10 messages + compressed summary
- [ ] Maintain context continuity for document-specific conversations
- [ ] Use expert-specific compression prompts

**History Management:**
- [ ] Archive old sessions after 30 days of inactivity
- [ ] Export session history for important conversations
- [ ] Search across session history
- [ ] Restore archived sessions on demand

### Task 3.5: Session History UI & Storage Interface ❌
**Epic Reference:** Task 2.7.5
**Priority:** Medium
**Status:** Not Started

**New Files to Create:**
- [ ] `epii_app/friendly-file-front/src/epi-logos-system/1_components/SessionHistoryPanel.tsx`

**UI Features:**
- [ ] Session List: Chronological list with context indicators
- [ ] Search & Filter: Search by content, filter by type/date/context
- [ ] Session Preview: Quick preview of content and summary
- [ ] Bulk Actions: Archive, delete, export multiple sessions
- [ ] Context Indicators: Visual badges for session types
- [ ] Compression Status: Show compressed sessions with previews

---

## Phase 4: Epic 2.6 - Expert Routing (MEDIUM PRIORITY)

### Task 4.1: Active Mode Detection Service ❌
**Epic Reference:** Task 2.6.1
**Priority:** Medium
**Status:** Not Started

**Implementation Strategy:**
- [ ] Create ActiveModeService to track current route
- [ ] Enhance AG-UI events with activeMode context
- [ ] Update skills router to prioritize mode-specific experts
- [ ] Implement fallback to universal expert for cross-mode queries

**Page-to-Coordinate Mapping:**
- [ ] `/epii` → #5 (Epii expert)
- [ ] `/chat` → #4 (Nara expert) 
- [ ] `/meta3d` → #1 (Paramasiva expert)
- [ ] `/meta2d` → #0 (Anuttara expert)
- [ ] `/files` → # (Universal/Root expert)

### Task 4.2: Mode Context Provider ❌
**Epic Reference:** Task 2.6.2
**Priority:** Medium
**Status:** Not Started

**New Files to Create:**
- [ ] `epii_app/friendly-file-front/src/epi-logos-system/4_contexts/ActiveModeProvider.tsx`

**Implementation:**
- [ ] Use React Router's useLocation hook for route detection
- [ ] Send mode context with every agent interaction via AG-UI events
- [ ] Handle smooth transitions between modes with context preservation
- [ ] Add to App.tsx alongside UserContextProvider

### Task 4.3: Create Epii Expert Chat Skill (Pattern) ❌
**Epic Reference:** Task 2.6.3
**Priority:** Medium
**Status:** Not Started

**Focus:** Implement Epii expert pattern only (other subsystems in future)

**New Files to Create:**
- [ ] `epii_app/friendly-file-back2front/epi-logos-system/2_skills/epii-expert-chat-skill.js`

**Expert Specialization:**
- [ ] Epii Expert (#5): Document analysis, coordinate work, knowledge synthesis, Bimba updates
- [ ] Context integration: Access to Epii subsystem's specific context and capabilities
- [ ] Skill registration: Add to epi-logos-skills-registry.js

---

## Phase 5: Epic 3.5 - Layout Cleanup (LOW PRIORITY)

### Task 5.1: Verify EpiiChat Removal ❌
**Epic Reference:** Task 3.5.1
**Priority:** Low
**Status:** Not Started

**Verification Tasks:**
- [ ] Confirm EpiiChat import removed from EpiiModePage.tsx
- [ ] Confirm split layout structure removed
- [ ] Confirm DocumentCanvas expanded to full width
- [ ] Confirm sidebar toggle functionality preserved

### Task 5.2: Verify Sidebar Optimization ❌ 
**Epic Reference:** Task 3.5.2
**Priority:** Low
**Status:** Not Started

**Enhancement Verification:**
- [ ] Confirm overlay backdrop behavior
- [ ] Verify smooth transitions for sidebar toggle
- [ ] Check coordinate tree rendering performance
- [ ] Verify keyboard shortcuts (Ctrl+B)
- [ ] Confirm z-index coordination with FloatingAgent

### Task 5.3: Implement AG-UI Event Mapping ❌
**Epic Reference:** Task 3.5.3
**Priority:** Low
**Status:** Not Started

**Frontend Actions to Map:**
- [ ] Document selection → StateDelta with document context
- [ ] Coordinate selection → StateDelta with coordinate context
- [ ] File upload → ToolCallStart with upload parameters
- [ ] Analysis start → ToolCallStart with analysis parameters
- [ ] Bimba update → ToolCallStart with update parameters
- [ ] Text selection → StateDelta with selection context

**Files to Update:**
- [ ] DocumentCanvas: Action handlers (lines 1547-1678)
- [ ] EpiiSidebar: Selection handlers (lines 456-720)
- [ ] BimbaUpdateOverlay: Update handlers (lines 1680-2860)

---

## Review & Testing

### Post-Implementation Review ❌
**Status:** Not Started

**Review Tasks:**
- [ ] Test all FloatingAgent functionality (input, resize, anchoring)
- [ ] Verify EpiiContext service layer transformation
- [ ] Test session management across document contexts
- [ ] Verify expert routing works correctly
- [ ] Test AG-UI event emission and handling
- [ ] Performance testing for service layer patterns
- [ ] Documentation of patterns for other subsystems

### Integration Testing ❌
**Status:** Not Started

**Testing Areas:**
- [ ] Agent-to-subsystem communication
- [ ] Cross-subsystem state coordination
- [ ] Session persistence and restoration
- [ ] Document context awareness
- [ ] Mode transitions and expert routing

---

## Development Notes

**Current Status:** Ready to begin Phase 1 critical fixes

**Next Actions:**
1. Fix FloatingAgent UI issues and add anchoring
2. Audit and restore EpiiContext functionality
3. Implement service layer transformation
4. Add session management capabilities
5. Implement expert routing patterns

**Architectural Patterns Established:**
- Service layer for complex async operations outside React
- Clean hook APIs over services for React components
- AG-UI events for cross-subsystem coordination
- Holographic subsystem completeness with universal interfaces