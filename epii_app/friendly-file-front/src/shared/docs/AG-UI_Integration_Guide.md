# AG-UI Integration Guide - Frontend 🔄 **PARTIALLY IMPLEMENTED**

## Overview

The AG-UI (Agent-Generated User Interface) integration provides real-time communication between the frontend and A2A server, enabling skills to directly update UI components with progress reports, suggestions, and results.

### **Current Implementation Status**

**✅ Implemented Components:**
- **Centralized WebSocket Service**: `webSocketService.ts` with AG-UI event handling
- **BimbaUpdateOverlay**: Real-time suggestions and progress tracking
- **Document Canvas**: AG-UI event integration for document operations
- **Analysis Pipeline**: Progress visualization via AG-UI events

**🔄 Partial Coverage:**
- **Limited Component Integration**: Only specific components have AG-UI support
- **Event Emission Patterns**: Inconsistent across different system operations
- **Protocol Compliance**: Basic AG-UI events implemented, full protocol coverage needed

**📋 Development Standards Needed:**
- **Unified Event Patterns**: Standardize AG-UI event emission across all skills
- **Complete Protocol Coverage**: Extend AG-UI integration to all user-facing operations
- **Development Guidelines**: Establish consistent AG-UI/A2A integration workflows

## Architecture

### Centralized WebSocket Service

The `webSocketService.ts` provides a centralized WebSocket connection that all components should use for AG-UI communication.

```typescript
// Location: src/subsystems/5_epii/1_services/webSocketService.ts
import { webSocketService } from './subsystems/5_epii/1_services/webSocketService';
```

**Key Features:**
- Single WebSocket connection to A2A server (`ws://localhost:3033`)
- Automatic reconnection with exponential backoff
- Global AG-UI event subscription on connection
- Event handler registration and management
- Skill execution with AG-UI metadata support

### AG-UI Event System

#### Standard AG-UI Event Types (Protocol Compliant)
```typescript
// Standard AG-UI Protocol Events (16 types in 5 categories)
type StandardAGUIEventType =
  // Lifecycle Events
  | 'RunStarted' | 'RunFinished' | 'RunError' | 'StepStarted' | 'StepFinished'
  // Text Message Events
  | 'TextMessageStart' | 'TextMessageContent' | 'TextMessageEnd'
  // Tool Call Events
  | 'ToolCallStart' | 'ToolCallArgs' | 'ToolCallEnd'
  // State Management Events
  | 'StateSnapshot' | 'StateDelta' | 'MessagesSnapshot'
  // Special Events
  | 'Raw' | 'Custom';

// Bimba-Specific Custom Events (extending AG-UI protocol)
type BimbaCustomEventType =
  | 'BimbaUpdateSuggestions'
  | 'BimbaAnalysisProgress'
  | 'BimbaContextUpdate'
  | 'QLStageTransition'
  | 'CoordinateChange';
```

#### Event Structure (AG-UI Protocol Compliant)
```typescript
// Standard AG-UI Event Structure
interface AGUIEvent {
  type: StandardAGUIEventType | BimbaCustomEventType;
  runId?: string;
  threadId?: string;
  timestamp: string;

  // Event-specific data (varies by event type)
  data?: any;

  // Standard AG-UI metadata
  metadata?: {
    agentId?: string;
    skillId?: string;

    // Bimba-specific extensions
    targetCoordinate?: string;
    bimbaCoordinates?: string[];
    qlStage?: number;
    contextFrame?: string;
    qlMode?: string;
  };
}

// Specific event interfaces for type safety
interface RunStartedEvent extends AGUIEvent {
  type: 'RunStarted';
  runId: string;
  threadId?: string;
}

interface TextMessageContentEvent extends AGUIEvent {
  type: 'TextMessageContent';
  messageId: string;
  delta: string;
}

interface ToolCallStartEvent extends AGUIEvent {
  type: 'ToolCallStart';
  toolCallId: string;
  toolCallName: string;
}
```

## Component Integration Patterns

### 1. Event Handler Registration

Components should register AG-UI event handlers when they mount:

```typescript
import { onAGUIEvent, offAGUIEvent } from './subsystems/5_epii/1_services/webSocketService';

useEffect(() => {
  if (!isOpen) return;

  // Register event handlers
  const handleUpdateSuggestions = (event: any) => {
    console.log('Received suggestions:', event);
    // Process suggestions...
  };

  const handleProgress = (event: any) => {
    console.log('Progress update:', event);
    // Update progress UI...
  };

  // Register handlers
  onAGUIEvent('BimbaUpdateSuggestions', handleUpdateSuggestions);
  onAGUIEvent('BimbaAnalysisProgress', handleProgress);

  // Cleanup on unmount
  return () => {
    offAGUIEvent('BimbaUpdateSuggestions', handleUpdateSuggestions);
    offAGUIEvent('BimbaAnalysisProgress', handleProgress);
  };
}, [isOpen]);
```

### 2. Skill Execution with AG-UI

Use `executeSkillWithAGUI()` for skills that support real-time updates:

```typescript
import { executeSkillWithAGUI } from './subsystems/5_epii/1_services/webSocketService';

const runAnalysis = async () => {
  try {
    const runId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await executeSkillWithAGUI({
      skillId: 'bimba-update-management',
      args: {
        bimbaCoordinate: selectedCoordinate,
        documents: uploadedDocuments
      },
      agentId: 'epii-agent',
      runId,
      threadId,
      metadata: {
        targetCoordinate: selectedCoordinate,
        qlMetadata: {
          qlPosition: 2,
          contextFrame: "(0/1/2)",
          qlMode: "ascending"
        }
      }
    });

    console.log('Skill execution completed:', result);
  } catch (error) {
    console.error('Skill execution failed:', error);
  }
};
```

### 3. State Management Integration

AG-UI events should integrate with existing state management patterns:

```typescript
// Example from BimbaUpdateOverlay
const applySuggestionsToForm = (suggestions: any) => {
  if (!selectedCoordinate) return;

  // Apply property updates using existing change tracking
  Object.entries(suggestions.propertyUpdates).forEach(([key, value]) => {
    // Update form state
    setEditedProperties(prev => ({ ...prev, [key]: value }));

    // Track changes in pending changes
    setPendingChanges(prevChanges => {
      const newChanges = new Map(prevChanges);
      const changeKey = `prop_${key}`;

      if (isPropertyChanged(key, value)) {
        newChanges.set(changeKey, value);
      } else {
        newChanges.delete(changeKey);
      }

      // Update cache and global state
      setHasUnsavedChanges(newChanges.size > 0);
      saveChangesToCache(selectedCoordinate, newChanges);

      return newChanges;
    });
  });
};
```

## BimbaUpdateOverlay Reference Implementation

The `BimbaUpdateOverlay` component serves as the reference implementation for AG-UI integration:

### Key Features Implemented:
1. **Centralized WebSocket Usage**: No ad-hoc connections
2. **Real-time Progress Reporting**: Live progress bars during analysis
3. **Automatic Suggestion Application**: Events trigger immediate UI updates
4. **Change Tracking Integration**: AG-UI suggestions integrate with existing change management
5. **Suggestion Management System**: Individual and bulk deletion capabilities

### Event Handlers:
```typescript
// Progress updates
const handleAnalysisProgress = (event: any) => {
  setAnalysisProgress({
    stage: event.stage,
    progress: event.progress,
    message: event.message
  });
};

// Suggestion updates
const handleUpdateSuggestions = (event: any) => {
  const suggestions = {
    propertyUpdates: event.propertyUpdates || {},
    relationshipSuggestions: event.relationshipSuggestions || [],
    targetCoordinate: event.targetCoordinate
  };

  setLLMSuggestions(suggestions);
  applySuggestionsToForm(suggestions);
  setIsGeneratingSuggestions(false);
};
```

## Suggestion Management System

### Individual Change Deletion
```typescript
const deleteSpecificChange = (coordinate: string, changeKey: string) => {
  // Remove from cache
  const cacheKey = `bimba-changes-${coordinate}`;
  const cachedChanges = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  delete cachedChanges[changeKey];

  // Update local state if current coordinate
  if (coordinate === selectedCoordinate) {
    const newChanges = new Map(pendingChanges);
    newChanges.delete(changeKey);
    setPendingChanges(newChanges);

    // Revert form field
    if (changeKey.startsWith('prop_')) {
      const propKey = changeKey.replace('prop_', '');
      setEditedProperties(prev => ({
        ...prev,
        [propKey]: originalProperties[propKey]
      }));
    }
  }
};
```

### Bulk Suggestion Deletion
```typescript
const deleteAllSuggestions = () => {
  // Clear all cached changes
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith('bimba-changes-')) {
      localStorage.removeItem(key);
    }
  }

  // Reset current state
  setEditedProperties({ ...originalProperties });
  setPendingChanges(new Map());
  setLLMSuggestions(null);
  setGlobalChangeCount(0);
};
```

## Best Practices

### 1. Connection Management
- Always use the centralized `webSocketService`
- Never create additional WebSocket connections
- Check connection status before executing skills

### 2. Event Handler Cleanup
- Always unregister event handlers on component unmount
- Use specific handler functions (not anonymous) for proper cleanup

### 3. State Synchronization
- Integrate AG-UI updates with existing state management
- Maintain consistency with change tracking systems
- Preserve user's manual changes when applying suggestions

### 4. Error Handling
- Implement proper error handling for skill execution
- Provide user feedback for connection issues
- Handle partial or malformed AG-UI events gracefully

### 5. Performance
- Debounce rapid AG-UI events if necessary
- Use React.memo() for components that receive frequent updates
- Batch state updates when processing multiple suggestions

## Troubleshooting

### Common Issues:

1. **Events Not Received**: Check WebSocket connection status
2. **State Not Updating**: Verify event handler registration
3. **Suggestions Not Applied**: Check data structure compatibility
4. **Memory Leaks**: Ensure proper event handler cleanup

### Debug Tools:
```typescript
// Check connection status
console.log('WebSocket connected:', webSocketService.isWebSocketConnected());

// Monitor AG-UI events
onAGUIEvent('*', (event) => {
  console.log('AG-UI Event:', event);
});
```

## Component Integration Template

Use this template for new components that need AG-UI integration:

```typescript
import React, { useEffect, useState } from 'react';
import { onAGUIEvent, offAGUIEvent, executeSkillWithAGUI } from '../1_services/webSocketService';

interface MyComponentProps {
  targetCoordinate?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ targetCoordinate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    // Register AG-UI event handlers
    const handleProgress = (event: any) => {
      setProgress({
        stage: event.stage,
        progress: event.progress,
        message: event.currentStep
      });
    };

    const handleResults = (event: any) => {
      setResults(event);
      setIsProcessing(false);
    };

    const handleError = (event: any) => {
      console.error('Skill execution error:', event);
      setIsProcessing(false);
    };

    onAGUIEvent('MySkillProgress', handleProgress);
    onAGUIEvent('MySkillResults', handleResults);
    onAGUIEvent('RunError', handleError);

    return () => {
      offAGUIEvent('MySkillProgress', handleProgress);
      offAGUIEvent('MySkillResults', handleResults);
      offAGUIEvent('RunError', handleError);
    };
  }, []);

  const executeMySkill = async () => {
    if (!targetCoordinate) return;

    setIsProcessing(true);
    setProgress(null);

    try {
      const runId = `my_skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await executeSkillWithAGUI({
        skillId: 'my-skill-id',
        args: {
          targetCoordinate,
          // ... other args
        },
        agentId: 'epii-agent',
        runId,
        threadId: `thread_${runId}`,
        metadata: {
          targetCoordinate,
          component: 'MyComponent'
        }
      });
    } catch (error) {
      console.error('Failed to execute skill:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Your component UI */}
      {progress && (
        <div>
          <div>Stage: {progress.stage}</div>
          <div>Progress: {progress.progress}%</div>
          <div>Message: {progress.message}</div>
        </div>
      )}

      <button onClick={executeMySkill} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Execute Skill'}
      </button>
    </div>
  );
};
```

## AG-UI Protocol Compliance & Current Limitations

### **Protocol Compliance Status**

**✅ Implemented Standard Events:**
- `RunStarted`, `RunFinished`, `RunError` - Basic lifecycle management
- `StepStarted`, `StepFinished` - Pipeline stage tracking
- Custom events for Bimba-specific functionality

**🔄 Partially Implemented:**
- `TextMessageStart`, `TextMessageContent`, `TextMessageEnd` - Limited streaming support
- `ToolCallStart`, `ToolCallEnd` - Basic tool call events (missing `ToolCallArgs`)
- `StateSnapshot`, `StateDelta` - Basic state management (needs enhancement)

**📋 Not Yet Implemented:**
- `MessagesSnapshot` - Chat history synchronization
- `Raw` events - Direct protocol passthrough
- Full streaming text message support across all components

### **Current Limitations**

1. **Incomplete Protocol Coverage**: Not all 16 standard AG-UI events are fully implemented
2. **Component-Specific Implementation**: AG-UI integration limited to BimbaUpdateOverlay and DocumentCanvas
3. **Event Emission Inconsistency**: Different skills emit events with varying patterns
4. **State Synchronization Gaps**: StateDelta events not comprehensively used for state management

### **Development Roadmap for Full Protocol Compliance**

#### **Phase 1: Complete Standard Event Implementation**
- Implement full `TextMessage*` event streaming for all chat components
- Add comprehensive `ToolCallArgs` streaming for complex tool parameters
- Enhance `StateSnapshot`/`StateDelta` for complete state synchronization

#### **Phase 2: Standardize Event Emission Patterns**
- Create unified AG-UI event emission utilities
- Standardize metadata structure across all skills
- Implement consistent error handling and recovery patterns

#### **Phase 3: Expand Component Coverage**
- Integrate AG-UI events into all user-facing components
- Add real-time updates to graph visualization components
- Implement AG-UI support for document management operations

## Future Development Standards

### 1. AG-UI Protocol First Approach
- **Standard Events Priority**: Use standard AG-UI events before creating custom events
- **Protocol Compliance**: Follow AG-UI specification for event structure and timing
- **Transport Agnostic**: Design for WebSocket, SSE, or webhook transport options
- **Bi-directional Communication**: Support both agent-to-user and user-to-agent event flows

### 2. Consistent Event Naming & Structure
- **Standard Event Usage**: Prefer `RunStarted`/`RunFinished` over custom lifecycle events
- **Custom Event Naming**: Use `Custom` event type with descriptive `data` payload for Bimba-specific functionality
- **Metadata Standards**: Include `bimbaCoordinates`, `qlStage`, and `targetCoordinate` in metadata
- **Event Timing**: Emit events at appropriate protocol-defined moments

### 3. Bimba Architecture Integration
- **Coordinate Preservation**: All events must carry Bimba coordinate context
- **QL Stage Tracking**: Include QL stage information in event metadata
- **Context Frame Awareness**: Preserve context frame information across event streams
- **State Synchronization**: Use `StateDelta` events for Bimba coordinate changes

### 4. State Management Integration
- **Protocol-Compliant State**: Use `StateSnapshot`/`StateDelta` for state synchronization
- **Backward Compatibility**: Maintain non-AG-UI workflows during transition
- **User Change Preservation**: Protect user modifications when applying automated suggestions
- **Conflict Resolution**: Handle state conflicts between user actions and agent updates
