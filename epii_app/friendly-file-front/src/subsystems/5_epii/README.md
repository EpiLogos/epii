# 5_epii Subsystem

## Bimba Tech Architecture Alignment
- **#5-3-4.5 (Epii Mode)**
- Document analysis and integration with Notion content
- Represents Agent (5/0) (Crystallize/Touch)

## Overview
The 5_epii subsystem is responsible for document analysis and integration with Notion content. It embodies the Epii principle (integration/crystallization) by providing tools for analyzing documents, extracting knowledge, and integrating with the Bimba-Pratibimba memory architecture.

## QL Structure

### 0_foundation (#5-3-4.5-0)
Contains document store, history tracking, and type definitions:
- `epiiDocStore.ts` - Document storage service
- `epiiTypes.ts` - Type definitions for documents, analysis sessions, and chat messages

### 1_utils (#5-3-4.5-1)
Contains utility functions for document analysis and formatting:
- `epiiFormatters.ts` - Formatting utilities for documents and analysis results
- `epiiHelpers.ts` - Helper functions for document processing

### 2_hooks (#5-3-4.5-2)
Contains React hooks for document analysis and state management:
- `useEpiiAnalysis.ts` - Hooks for document analysis
- `useEpiiDocument.ts` - Hooks for document management

### 3_visualization (#5-3-4.5-3)
Contains visual components for document editing and analysis:
- `DocumentCanvas.tsx` - Main canvas component for document editing and analysis
- `DocumentViewer.tsx` (#5-3-4.5-3-0) - Document viewing and editing component
- `DocumentChat.tsx` (#5-3-4.5-3-1) - Chat interface for document analysis
- `DocumentControls.tsx` (#5-3-4.5-3-2) - Controls for analysis and coordination
- `AnalysisVisualizer.tsx` (#5-3-4.5-3-3) - Visualization of analysis results

### 4_context (#5-3-4.5-4)
Contains context providers for Epii mode state:
- `EpiiContext.tsx` (#5-3-4.5-4-X) - Context provider for global Epii mode state

### 5_integration (#5-3-4.5-5)
Contains integration components that combine other elements:
- `EpiiModePage.tsx` - Main Epii Mode page component
- `EpiiModeChat.tsx` (#5-3-4.5-2) - Dialogue interface for LLM chat
- `EpiiDocStore.tsx` (#5-3-4.5-0) - Document store and history component

## Usage
To use the Epii mode page, import the EpiiModePage component:

```tsx
import EpiiModePage from '../subsystems/5_epii/5_integration/EpiiModePage';

const App = () => {
  return (
    <div>
      <EpiiModePage />
    </div>
  );
};
```

To use the document canvas component directly:

```tsx
import DocumentCanvas from '../subsystems/5_epii/3_visualization/DocumentCanvas';
import { EpiiProvider } from '../subsystems/5_epii/4_context/EpiiContext';

const MyComponent = () => {
  return (
    <EpiiProvider>
      <DocumentCanvas userId="admin" />
    </EpiiProvider>
  );
};
```

## Component Interactions

The Epii mode components interact in the following way:

1. **EpiiContext** provides global state management for documents, analysis sessions, and chat messages
2. **DocumentCanvas** serves as the main container for document editing and analysis
3. **DocumentViewer** handles document viewing and editing
4. **DocumentChat** provides a chat interface for interacting with the document
5. **DocumentControls** provides controls for starting analysis and setting parameters
6. **AnalysisVisualizer** visualizes the results of document analysis

## API Integration

The components integrate with the following backend API endpoints:

- `/api/epii-agent/analyze` - Analyze a document using the Epii agent
- `/api/epii-agent/chat` - Process chat messages in the context of document analysis
- `/files/upload` - Upload files for analysis

## Future Development

Planned enhancements for this subsystem include:

1. **Analysis Visualization** - Enhanced visualization of analysis results
2. **Document History** - Improved history tracking and version control
3. **Chat Integration** - Better integration with the LangSmith-enhanced pipeline
4. **Notion Integration** - Direct integration with Notion for document storage and retrieval
5. **Multi-Document Analysis** - Support for analyzing multiple documents together
