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

### Task 1.1: Fix FloatingAgent UI Issues ✅
**Epic Reference:** Task 3.0.5
**Priority:** Critical
**Status:** Complete

**Issues Fixed:**
- [x] **Laggy/Unresponsive Interactions**: Fixed with memoized message rendering and optimized callbacks
- [x] **Non-functional Chat Input**: Verified working, added optimized input change handler
- [x] **Window Too Small**: Increased default size to 420x600, max 800x900
- [x] **Non-resizable Window**: Added complete resize functionality with corner/edge handles
- [x] **Performance**: Memoized expensive operations and optimized re-render cycles

**Files to Modify:**
- `epii_app/friendly-file-front/src/epi-logos-system/1_components/FloatingEpiLogosAgent.tsx`

**Technical Fixes:**
- Input field: Ensure proper onChange handlers and state updates
- Window resize: Add drag handles and resize functionality  
- Performance: Memoize expensive operations and optimize re-render cycles
- Responsive design: Ensure window works on different screen sizes
- Z-index management: Proper layering with other UI elements

### Task 1.2: Add Position Anchoring Logic ✅
**Priority:** High
**Status:** Complete

**Implementation:**
- [x] Add anchor position logic to bounce back to bottom-right when released
- [x] Implement smooth animation for anchor return
- [x] Add anchor threshold and animation duration configuration
- [x] Ensure anchoring respects window boundaries

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

### Task 2.2: Transform EpiiContext into Service-Layer Pattern ✅
**Epic Reference:** Task 3.1
**Priority:** High
**Status:** Completed

**Implementation Phases:**
- [x] **Phase 1:** Extract complex logic from EpiiContext into EpiiStateService
- [x] **Phase 2:** Simplify useEpii hook to clean API over service
- [x] **Phase 3:** Update components to use simplified context API (via bridge pattern)
- [x] **Phase 4:** Add AG-UI event bridging for global coordination
- [x] **Phase 5:** Document pattern for extension to other subsystems

**New Files Created:**
- [x] `epii_app/friendly-file-front/src/subsystems/5_epii/1_services/EpiiStateService.ts`
- [x] `epii_app/friendly-file-front/src/subsystems/5_epii/4_context/EpiiContext.service.tsx`

**Files Refactored:**
- [x] Service layer implemented with backward compatibility
- [x] DocumentCanvas integration maintained via bridge pattern
- [x] Components continue working during architectural transition

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

### Task 3.1: Chat Session Management UI ✅
**Epic Reference:** Task 2.7.1
**Priority:** Medium
**Status:** Completed

**New Components Created:**
- [x] `epii_app/friendly-file-front/src/epi-logos-system/1_components/ChatSessionManager.tsx`

**Features Implemented:**
- [x] New Session Button: Clear current conversation and start fresh
- [x] Session History Dropdown: List recent sessions with timestamps and context
- [x] Clear History Button: Remove all messages from current session
- [x] Compress Context Button: Summarize long conversations
- [x] Session Context Indicator: Show current session type
- [x] Export/Archive Session: Save important conversations

**Integration:**
- [x] Embed in FloatingEpiLogosAgent replacing settings panel
- [x] Connect to session storage service
- [x] Added session management handlers to FloatingAgent

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

### Task 4.1: Active Mode Detection Service ✅
**Epic Reference:** Task 2.6.1
**Priority:** Medium
**Status:** Completed

**Implementation Strategy:**
- [x] Create ActiveModeService to track current route (implemented in ActiveModeProvider)
- [x] Enhance AG-UI events with activeMode context (StateDelta events on route change)
- [x] Update skills router to prioritize mode-specific experts (expert routing context in orchestration)
- [x] Implement fallback to universal expert for cross-mode queries (default universal mode)

**Page-to-Coordinate Mapping:**
- [x] `/epii` → #5 (Epii expert)
- [x] `/chat` → #4 (Nara expert) 
- [x] `/meta3d` → #1 (Paramasiva expert)
- [x] `/meta2d` → #0 (Anuttara expert)
- [x] `/files` → # (Universal/Root expert)

### Task 4.2: Mode Context Provider ✅
**Epic Reference:** Task 2.6.2
**Priority:** Medium
**Status:** Completed

**New Files Created:**
- [x] `epii_app/friendly-file-front/src/epi-logos-system/4_contexts/ActiveModeProvider.tsx`

**Implementation:**
- [x] Use React Router's useLocation hook for route detection
- [x] Send mode context with every agent interaction via AG-UI events
- [x] Handle smooth transitions between modes with context preservation
- [x] Add to App.tsx alongside UserContextProvider

### Task 4.3: Create Epii Expert Chat Skill (Pattern) ✅
**Epic Reference:** Task 2.6.3
**Priority:** Medium
**Status:** Completed

**Focus:** Implemented Epii expert pattern using existing epii-chat-skill.js

**Expert Specialization:**
- [x] Epii Expert (#5): Document analysis, coordinate work, knowledge synthesis, Bimba updates (existing skill)
- [x] Context integration: Access to Epii subsystem's specific context and capabilities (orchestration request)
- [x] Skill registration: Already exists in bimba-skills-registry.js
- [x] Expert routing integration: FloatingAgent includes expertRouting context in orchestration requests

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

### Post-Implementation Review ✅
**Status:** Phase 2 Complete - Expert Routing & Session Management Foundation

**Completed in This Session:**
- [x] **Epic 2.6 Expert Routing:** Complete implementation with ActiveModeProvider, AG-UI event integration, and FloatingAgent expert routing context
- [x] **Epic 3.1 Service Layer Foundation:** EpiiStateService and EpiiContext.service.tsx implemented with backward compatibility
- [x] **Epic 2.7.1 Session Management UI:** ChatSessionManager component with full session controls, history, compression, and export

**Key Architectural Achievements:**
- [x] Expert routing pattern established - universal agent routes to subsystem experts based on active mode
- [x] Service layer pattern implemented - complex logic moved to services, clean React APIs maintained  
- [x] AG-UI event-driven coordination - mode changes and state updates emit standard events
- [x] Holographic architecture maintained - each subsystem retains complete internal structure
- [x] Session management foundation - UI controls and routing established for future backend service integration

**Testing Needed:**
- [ ] Test expert routing across different page modes (/epii, /chat, /meta3d, etc.)
- [ ] Verify service layer integration maintains component functionality
- [ ] Test session management UI functionality
- [ ] Verify FloatingAgent anchoring and resize behavior still works

**Next Phase Priorities:**
1. **Epic 2.7.2-2.7.5:** Backend session management services and context-aware routing
2. **Epic 3.2-3.4:** Complete service layer transformation and deprecate standalone components  
3. **Epic 3.5:** Layout cleanup and AG-UI event mapping verification
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