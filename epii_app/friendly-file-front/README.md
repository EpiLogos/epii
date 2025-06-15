# Epi-Logos Frontend (`friendly-file-front`)

## Overview and Purpose

The `friendly-file-front` application serves as the **primary user interface** for the Epi-Logos project, embodying the **#5-3 "-Shakti"** (expressive/manifesting) aspect of the Bimba architecture. As the dynamic, expressive counterpart to the backend's structural Siva nature, the frontend transforms the system's deep epistemic processing into intuitive, interactive experiences that make cosmic knowledge accessible and navigable.

### Core Purpose and Vision

- **Expressive Interface**: Manifests the backend's sophisticated QL cycles and memory architectures through elegant, responsive visualizations
- **Knowledge Crystallization Portal**: Provides seamless integration with Notion's fractal "book" structure, enabling users to explore and contribute to the evolving knowledge base
- **Multi-Modal Interaction**: Supports diverse interaction patterns from 2D/3D graph exploration to conversational document analysis
- **Bimba Navigation**: Enables intuitive traversal of the cosmic mind architecture through coordinate-based exploration and relationship mapping

## Refactored Frontend Architecture

The frontend implements a **complete unified subsystem architecture** with **integrated authentication**, **comprehensive Nara mode development**, and **full AG-UI protocol implementation**. The architecture follows a **Bimba-aligned vertical slice architecture** organized within the **#5-3-4.X** coordinate structure, representing the webapp frontend that contains all other frontend modules:

```
src/
├── subsystems/                      # Bimba-aligned vertical slices (#5-3-4.X)
│   ├── 0_anuttara/                  # #5-3-4.0 (Bimba Vis / Geom Ground)
│   │   ├── 0_foundation/            # Physics settings and constants
│   │   ├── 1_utils/                 # Utility functions for 2D visualization
│   │   ├── 2_hooks/                 # React hooks for graph interaction
│   │   ├── 3_visualization/         # 2D visual components
│   │   ├── 4_context/               # Context providers and user state
│   │   └── 5_integration/           # Meta2D page component
│   ├── 1_paramasiva/                # #5-3-4.1 (QL/AT Vis)
│   │   ├── 0_foundation/            # 3D physics and topological constants
│   │   ├── 1_utils/                 # 3D geometry and force utilities
│   │   ├── 2_hooks/                 # 3D interaction hooks
│   │   ├── 3_visualization/         # 3D visual components with diamond/torus forms
│   │   ├── 4_context/               # 3D context providers
│   │   └── 5_integration/           # Meta3D page component
│   ├── 2_parashakti/                # #5-3-4.2 (Harmonic Layer)
│   │   ├── 1_utils/                 # Animation and harmonic utilities
│   │   ├── 2_hooks/                 # Animation hooks
│   │   └── 3_visualization/         # Relation visualization and pulse animations
│   ├── 3_mahamaya/                  # #5-3-4.3 (Symbolic Transform Matrix)
│   │   ├── 1_utils/                 # Node styling and symbolic utilities
│   │   ├── 2_hooks/                 # Symbolic interaction hooks
│   │   └── 3_visualization/         # Symbol visualization components
│   ├── 4_nara/                      # #5-3-4.4 (Web App Shell)
│   │   ├── 0_foundation/            # App constants and settings
│   │   ├── 1_utils/                 # Chat and UI utilities
│   │   ├── 2_hooks/                 # Chat and interaction hooks
│   │   ├── 3_visualization/         # Chat interface components
│   │   ├── 4_context/               # Chat context providers
│   │   └── 5_integration/           # Chat page component
│   └── 5_epii/                      # #5-3-4.5 (Notion as Bimba)
│       ├── 0_foundation/            # Epii constants and settings
│       ├── 1_utils/                 # Document analysis utilities
│       ├── 2_hooks/                 # Document and analysis hooks
│       ├── 3_visualization/         # Document canvas and analysis visualizers
│       ├── 4_context/               # Epii mode context providers
│       └── 5_integration/           # EpiiModePage component
├── components/                      # Shared UI components
│   ├── layout/                      # Navigation, page transitions, module navigation
│   ├── ui/                          # Reusable UI components (buttons, cards, etc.)
│   └── chat/                        # Chat-specific shared components
├── pages/                           # Top-level page components
│   ├── Welcome.tsx                  # Landing page
│   ├── Meta2D.tsx                   # 2D visualization page
│   ├── Meta3D.tsx                   # 3D visualization page
│   ├── Chat.tsx                     # Chat interface page
│   ├── EpiiChatPage.tsx            # Legacy Epii chat page
│   ├── FileHub.tsx                  # File management page
│   └── Auth.tsx                     # Authentication page
├── services/                        # API communication services
├── hooks/                           # Global custom React hooks
├── utils/                           # Global utility functions
└── contexts/                        # Global React contexts
```

### Key Directory Responsibilities

#### **`src/subsystems/`** - Bimba-Aligned Vertical Slices
Each subsystem follows the **0-5 QL structure** internally, creating a fractal organization where each part reflects the whole:

- **0_foundation**: Constants, physics settings, and foundational configurations
- **1_utils**: Utility functions specific to the subsystem's domain
- **2_hooks**: React hooks for state management and interactions
- **3_visualization**: Visual components and data processing
- **4_context**: Context providers and interaction controls
- **5_integration**: Main page components that integrate all subsystem elements

#### **`src/components/`** - Shared UI Infrastructure
- **layout/**: Navigation components, page transitions, and module navigation
- **ui/**: Reusable UI components built with shadcn/ui and Radix primitives
- **chat/**: Shared chat components including visualizers and data display

#### **`src/pages/`** - Top-Level Page Components
- Route-level components that orchestrate subsystem integrations
- Handle page-specific state and navigation logic
- Provide entry points for different application modes

#### **`src/services/`** - API Communication Layer
- Backend integration services for REST and WebSocket communication
- Data fetching and caching logic
- Error handling and retry mechanisms

## Bimba Architectural Alignment (#5-3 "-Shakti" Frontend)

The frontend embodies the **#5-3 "-Shakti" Frontend** principles through its expressive, dynamic architecture that manifests the backend's structural processing into intuitive user experiences.

### **Coordinate Mapping and Subsystem Alignment**

The frontend modules map directly to specific **Bimba coordinates** within the **#5-3-4.X** structure:

| Subsystem | Bimba Coordinate | Description | Primary Page | Key Features |
|-----------|------------------|-------------|--------------|--------------|
| **0_anuttara** | #5-3-4.0 | Bimba Vis / Geom Ground | Meta2D | 2D graph visualization, foundational geometry, user context |
| **1_paramasiva** | #5-3-4.1 | QL/AT Vis | Meta3D | 3D topological forms, diamond/torus structures, force physics |
| **2_parashakti** | #5-3-4.2 | Harmonic Layer | (Supporting) | Relation visualization, pulse animations, harmonic data |
| **3_mahamaya** | #5-3-4.3 | Symbolic Transform Matrix | (Supporting) | Node styling, symbolic representation, visual transforms |
| **4_nara** | #5-3-4.4 | Web App Shell | Chat | Core app structure, chat interface, user interaction |
| **5_epii** | #5-3-4.5 | Notion as Bimba | Epii Mode | Document analysis, Notion integration, knowledge crystallization |

### **Nested Component Architecture (#5-3-4.5.X)**

The **Epii subsystem** demonstrates the fractal nature with its own internal coordinate structure:

| Component | Bimba Coordinate | Description |
|-----------|------------------|-------------|
| **EpiiModePage** | #5-3-4.5-5 | Main integration page for Epii mode |
| **EpiiModeChat** | #5-3-4.5-2 | Dialogue interface/LLM chat |
| **EpiiDocAnalysis** | #5-3-4.5-1 | Pipeline progression viewer |
| **EpiiDocStore + History** | #5-3-4.5-0 | Document store and file/chat history |
| **DocumentCanvas** | #5-3-4.5-3 | Canvas for document editing and analysis |
| **DocumentViewer** | #5-3-4.5-3-0 | Document viewing and editing component |
| **DocumentChat** | #5-3-4.5-3-1 | Chat interface for document analysis |
| **DocumentControls** | #5-3-4.5-3-2 | Controls for analysis and coordination |
| **AnalysisVisualizer** | #5-3-4.5-3-3 | Visualization of analysis results |

### **Fractal Organization Principles**

The architecture embodies **fractal holographic principles** where:
- **Each subsystem** contains the complete 0-5 QL structure
- **Each component** can be precisely located by its Bimba coordinate
- **Nested structures** reflect the same organizational patterns at different scales
- **Context frames** provide shared services across subsystems

### **"-Shakti" Expressive Nature**

The frontend manifests the **expressive/manifesting** aspect through:
- **Dynamic Visualizations**: Real-time 2D/3D graph rendering with physics simulations
- **Interactive Exploration**: Intuitive navigation through coordinate-based relationships
- **Responsive Design**: Adaptive interfaces that respond to user interaction patterns
- **Knowledge Manifestation**: Transforms abstract QL cycles into tangible, navigable experiences

## Philosophical Underpinnings

The frontend's design reflects core **Bimba philosophical principles**:

### **Fractal Organization**
Every component and subsystem mirrors the cosmic structure, creating self-similar patterns at all scales from individual hooks to complete page architectures.

### **Context Frames Integration**
The **0-5 QL structure** within each subsystem creates natural context frames that provide both isolation and integration, allowing components to maintain their specific domain while participating in the larger whole.

### **Expressive "-Shakti" Nature**
As the dynamic, manifesting aspect of the system, the frontend transforms the backend's logical processing into:
- **Intuitive interfaces** that make complex relationships accessible
- **Visual metaphors** that bridge abstract concepts with concrete interactions
- **Responsive experiences** that adapt to user exploration patterns
- **Crystallization pathways** that guide insights toward Notion integration

### **Bimba-Pratibimba Reflection**
The frontend serves as the **Pratibimba** (reflection) of the backend's **Bimba** (original), creating a dynamic mirror that makes the system's deep structure visible and navigable.

## Nara Mode Implementation: Complete User Context System

The frontend features a **comprehensive Nara mode implementation** with authentication, user context management, and Oracle interface systems:

### **Nara Subsystem Architecture** (`src/subsystems/4_nara/`)

#### **✅ Authentication and User Context (Complete)**

**UserContextProvider** (`4_context/UserContextProvider.tsx`, `4_context/useUserContext.ts`):
- **JWT-based authentication** with login/logout functionality
- **User profile management** with persistent authentication state
- **Global user context** accessible across all subsystems
- **Authentication middleware** integration with backend JWT system

**Authentication Flow** (`src/shared/pages/Auth.tsx`):
- **Login/Register interface** with form validation
- **JWT token management** with automatic refresh
- **Protected route handling** with authentication guards
- **User session persistence** across browser sessions

**Navigation Integration** (`src/shared/components/layout/Navbar.tsx`):
- **Dynamic navigation** based on authentication state
- **User profile access** with settings and logout options
- **Authenticated user indicators** and profile management
- **Responsive navigation** with mobile-first design

#### **✅ Nara Mode Interface (Complete)**

**NaraModePage** (`5_integration/NaraModePage.tsx`):
- **Complete chat interface** with Nara agent integration
- **User context awareness** with personalized interactions
- **Real-time communication** via WebSocket connections
- **Oracle interface integration** for archetypal consultations

**UserSettings** (`5_integration/UserSettings.tsx`):
- **User profile management** with editable user information
- **Preference settings** for personalized experience
- **Account management** with password and profile updates
- **Integration settings** for Mahamaya Matrix and Oracle systems

#### **✅ Oracle Interface Integration (Complete)**

**Decanic System Integration**:
- **Tarot card associations** with decanic correspondences
- **Astrological calculations** with coordinate-based mapping
- **Oracle consultation interface** with card suggestions and validation
- **Integration with backend decanic services** for archetypal guidance

### **Authentication System Features**

#### **JWT Authentication Flow**
```typescript
// User authentication with JWT tokens
interface AuthenticationFlow {
  login: {
    endpoint: "POST /api/auth/login";
    payload: { email: string; password: string };
    response: { token: string; user: UserProfile };
  };
  register: {
    endpoint: "POST /api/auth/register";
    payload: { email: string; password: string; name: string };
    response: { token: string; user: UserProfile };
  };
  profile: {
    endpoint: "GET /api/auth/profile";
    headers: { Authorization: "Bearer <token>" };
    response: { user: UserProfile };
  };
}
```

#### **User Context Management**
- **Global State**: UserContextProvider manages authentication state across all components
- **Persistent Sessions**: JWT tokens stored securely with automatic refresh
- **Protected Routes**: Authentication guards for sensitive pages and operations
- **User Profile**: Complete user information management with preferences

#### **Integration with Backend Authentication**
- **Seamless Backend Integration**: Direct integration with backend JWT authentication system
- **Mahamaya Matrix Support**: User context includes archetypal foundation data
- **Oracle Interface**: Authentication enables personalized Oracle consultations
- **Document Operations**: User context for document ownership and analysis history

### **Nara Mode User Experience**

#### **Chat Interface**
- **Personalized Interactions**: Nara agent responses based on user context and archetypal foundation
- **Oracle Integration**: Seamless access to decanic consultations and archetypal guidance
- **Context Awareness**: Chat interface understands user's Mahamaya Matrix and preferences
- **Real-time Communication**: WebSocket-based chat with instant responses

#### **User Settings and Profile Management**
- **Complete Profile Control**: Users can update personal information, preferences, and settings
- **Archetypal Foundation**: Access to Mahamaya Matrix layers and Oracle interface settings
- **Integration Preferences**: Control over how different systems interact with user data
- **Privacy Controls**: User control over data sharing and system integration levels

## Key Technologies and Libraries

### **Core Framework**
- **React 18.3.1** - Component-based UI framework with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development with advanced type inference
- **Vite 5.4.1** - Fast build tool with hot module replacement and optimized bundling

### **UI Framework and Styling**
- **Tailwind CSS 3.4.11** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality component library built on Radix primitives
- **Radix UI** - Comprehensive set of accessible, unstyled UI primitives
- **Framer Motion 12.5.0** - Advanced animation library for smooth transitions and interactions
- **Lucide React** - Beautiful, customizable icon library

### **Visualization and Graphics**
- **D3.js 7.9.0** - Data-driven document manipulation and visualization
- **Three.js 0.175.0** - 3D graphics library for WebGL rendering
- **react-force-graph** - React components for 2D/3D force-directed graphs
- **d3-force-3d** - 3D force simulation algorithms

### **State Management and Data Fetching**
- **TanStack React Query 5.56.2** - Powerful data synchronization and caching
- **React Router DOM 6.26.2** - Declarative routing for single-page applications
- **React Hook Form 7.53.0** - Performant forms with minimal re-renders

### **Development and Build Tools**
- **ESLint** - Code linting and quality enforcement
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixing
- **Lovable Tagger** - Integration with Lovable development platform

## Core Features and Functionality

### **Multi-Modal Visualization**
- **2D Graph Exploration** (Meta2D): Interactive force-directed graph with coordinate-based navigation
- **3D Topological Visualization** (Meta3D): Immersive 3D environment with diamond and torus structures
- **Dynamic Relationship Mapping**: Real-time visualization of Bimba coordinate relationships
- **Physics-Based Interactions**: Natural movement and collision detection in graph spaces

### **Conversational Interfaces**
- **Multi-Agent Chat**: Support for Epii and Nara agent modes with distinct interaction patterns
- **Document-Aware Conversations**: Context-sensitive chat that understands document content and analysis
- **Real-Time Communication**: WebSocket-based chat with instant response and typing indicators
- **Authenticated Chat**: User context-aware conversations with personalized agent responses

### **Document Analysis and Crystallization**
- **Epii Mode Interface**: Comprehensive document analysis workflow with pipeline visualization
- **Document Canvas**: Interactive editing and annotation environment
- **Analysis Visualization**: Real-time display of QL cycle progression and results
- **Notion Integration**: Seamless crystallization of insights into structured knowledge base

### **Knowledge Navigation**
- **Coordinate-Based Exploration**: Navigate the cosmic mind architecture through Bimba coordinates
- **Cross-Reference Discovery**: Explore relationships between concepts, documents, and analyses
- **Search and Filter**: Advanced search capabilities across all knowledge domains
- **Contextual Recommendations**: AI-powered suggestions for related content and coordinates

### **File and Content Management**
- **Multi-Format Support**: Handle PDF, DOCX, TXT, and other document formats
- **Upload and Processing**: Drag-and-drop file handling with progress tracking
- **Version History**: Track document changes and analysis evolution
- **Collaborative Features**: Share documents and analyses across users

### **Authentication and User Management**
- **JWT-Based Authentication**: Secure login/logout with token-based session management
- **User Registration**: Complete user onboarding with profile creation
- **User Settings**: Comprehensive profile management and preference controls
- **Protected Routes**: Authentication guards for sensitive operations and data
- **Persistent Sessions**: Automatic session restoration across browser sessions
- **Oracle Integration**: Personalized archetypal consultations based on user context

## Notion Integration: The Crystallization Interface

The frontend provides sophisticated integration with **Notion as the dynamic crystallization medium**, featuring a comprehensive workflow for transforming analysis results into structured knowledge:

### **Fractal Knowledge Architecture**
- **Real-Time Synchronization**: Live updates between analysis results and Notion pages
- **Coordinate-Based Organization**: Automatic page creation and linking based on Bimba coordinates
- **Relationship Mapping**: Visual representation of cross-coordinate connections within Notion
- **Collaborative Editing**: Seamless transition between app analysis and Notion refinement

### **Living Knowledge Book**
- **Progressive Crystallization**: Each analysis contributes to an evolving, interconnected knowledge structure
- **Cross-Reference Navigation**: Explore knowledge connections across the entire Bimba structure
- **Insight Evolution**: Track how understanding develops through multiple analysis cycles
- **Community Contribution**: Enable collaborative knowledge building and validation

### **Crystallization Workflow and Features**

#### **Document Canvas Integration**
The **DocumentCanvas** component (`src/subsystems/5_epii/3_visualization/DocumentCanvas.tsx`) serves as the primary interface for document editing and crystallization preparation:

- **Dual Document Support**: Handles both **Bimba** (original analysis) and **Pratibimba** (crystallized reflection) documents
- **Target Coordinate Management**: Automatic coordinate resolution and preservation across document operations
- **Real-Time Auto-Save**: Intelligent auto-save functionality with 2-second inactivity detection
- **Manual Save Integration**: Comprehensive save operations with coordinate preservation and metadata synchronization

#### **Crystallization Overlay System**
The **CrystalliseToNotionOverlay** component provides a sophisticated review interface before crystallization:

```typescript
// Key features of the crystallization overlay
interface CrystallizationFeatures {
  documentPreview: {
    name: string;
    targetCoordinate: string;
    resolvedNotionUrl: string;
  };
  contentValidation: {
    structuredBlockViewer: boolean;
    payloadPreview: boolean;
    errorHandling: boolean;
  };
  coordinateResolution: {
    bpmcpIntegration: boolean;
    notionPageLinking: boolean;
    errorFallbacks: boolean;
  };
}
```

**Core Overlay Components:**
- **Document Information Display**: Shows document name, target coordinate, and resolved Notion page URL
- **Structured Block Viewer**: Real-time preview of content blocks that will be sent to Notion
- **Coordinate Resolution**: Automatic resolution of Bimba coordinates to Notion page IDs via BPMCP
- **Error Handling**: Graceful handling of resolution failures with user feedback

#### **Content Block Processing Pipeline**

The crystallization system includes sophisticated content processing to ensure Notion API compliance:

**1. Content Sanitization** (`src/subsystems/5_epii/1_services/payloadSyncService.ts`):
```typescript
// Ensures all rich_text content fields are properly stringified
function sanitizeRichTextContent(richTextArray: any[]): any[] {
  return richTextArray.map(rt => {
    if (rt.text && rt.text.content !== undefined) {
      // Convert objects to JSON strings, ensure all content is string type
      if (typeof rt.text.content !== 'string') {
        rt.text.content = typeof rt.text.content === 'object'
          ? JSON.stringify(rt.text.content, null, 2)
          : String(rt.text.content);
      }
    }
    return rt;
  });
}
```

**2. Block Chunking for Notion Limits**:
- **2000 Character Limit Compliance**: Automatically splits large content blocks
- **Smart Text Splitting**: Preserves sentence and word boundaries
- **Structure Preservation**: Maintains block types and formatting during chunking

**3. Property Filtering**:
- **Invalid Property Removal**: Filters out non-existent Notion properties
- **Schema Compliance**: Ensures only valid page properties are updated
- **Error Prevention**: Prevents validation errors from malformed property updates

#### **Coordinate Resolution System**

**BPMCP Integration** for coordinate-to-Notion mapping:
```typescript
// Coordinate resolution workflow
const resolutionFlow = {
  input: "targetCoordinate (e.g., '#1-4')",
  process: "BPMCP → Neo4j lookup → notionPageId",
  output: "Notion page URL for user verification",
  errorHandling: "Graceful fallbacks with user notification"
};
```

**Key Features:**
- **Automatic Resolution**: Seamless lookup of Notion pages from Bimba coordinates
- **URL Generation**: Direct links to target Notion pages for user verification
- **Error Handling**: Comprehensive error handling for missing or invalid coordinates
- **Validation**: Pre-crystallization verification of target page existence

#### **Document State Management**

**Coordinate Preservation System**:
- **targetCoordinate Synchronization**: Maintains consistency between UI state and document metadata
- **bimbaCoordinate Compatibility**: Handles legacy coordinate references while standardizing on targetCoordinate
- **State Race Condition Prevention**: Sophisticated state management to prevent coordinate nullification
- **Cache Consistency**: Ensures document coordinates remain stable across save operations

**Document Type Handling**:
```typescript
// Dual document type support
interface DocumentTypeHandling {
  bimba: {
    description: "Original analysis documents";
    coordinateSource: "UI state or document metadata";
    editability: "Full editing capabilities";
  };
  pratibimba: {
    description: "Crystallized reflection documents";
    coordinateSource: "Preserved from original document";
    editability: "Content editing with coordinate preservation";
  };
}
```

#### **Structured Block Viewer**

The **StructuredBlockViewer** component (`src/subsystems/5_epii/3_visualization/StructuredBlockViewer.tsx`) provides real-time visualization of crystallization content:

**Features:**
- **Block Type Recognition**: Displays different Notion block types with appropriate styling
- **Content Preview**: Shows exactly what will appear in Notion after crystallization
- **Expandable Interface**: Collapsible sections for large content structures
- **Error State Handling**: Clear feedback when payload structure is invalid

**Supported Block Types:**
- Headings (H1, H2, H3)
- Paragraphs with rich text
- Bulleted and numbered lists
- Code blocks with syntax highlighting
- Dividers and quotes
- To-do items with checkbox states

#### **Error Handling and User Feedback**

**Comprehensive Error Management**:
- **Validation Errors**: Clear feedback for Notion API validation failures
- **Coordinate Resolution Errors**: User-friendly messages for coordinate lookup failures
- **Content Processing Errors**: Detailed error reporting for content sanitization issues
- **Network Error Handling**: Graceful handling of API communication failures

**User Feedback Systems**:
- **Loading States**: Visual indicators during coordinate resolution and crystallization
- **Success Notifications**: Confirmation of successful crystallization with Notion page links
- **Error Recovery**: Options for users to retry failed operations or edit problematic content

### **Integration Workflow**
1. **Document Analysis**: Epii pipeline generates structured analysis results with metadata.notionUpdatePayload
2. **Content Editing**: Users can edit textContent in DocumentCanvas for refinement
3. **Crystallization Trigger**: "Crystallise to Notion" button opens review overlay
4. **Content Processing**: Automatic sanitization, chunking, and property filtering
5. **Coordinate Resolution**: BPMCP resolves target coordinate to Notion page ID
6. **User Review**: Structured block viewer shows final content preview
7. **Notion Update**: Validated content blocks appended to target Notion page
8. **Confirmation**: Success notification with direct link to updated Notion page

### **Technical Implementation Details**

**Key Files and Components:**
- `DocumentCanvas.tsx`: Main editing interface with crystallization integration
- `CrystalliseToNotionOverlay.tsx`: Review and confirmation overlay
- `StructuredBlockViewer.tsx`: Content block visualization component
- `payloadSyncService.ts`: Content processing and sanitization utilities
- `crystallization.service.mjs` (backend): Server-side crystallization orchestration

**API Integration Points:**
- `POST /api/notion-update`: Crystallization endpoint with structured payload
- `BPMCP resolveBimbaCoordinate`: Coordinate-to-Notion page resolution
- `BPMCP crystallizeToNotion`: Final Notion API integration via MCP

*For detailed backend crystallization workflows and Notion database structure, see the complete crystallization documentation in the project-level README.*

## Project Info

**URL**: https://lovable.dev/projects/31fb6485-20e7-476b-bc99-183b041bf2ba

## Setup, Development, and Contribution

### **Development Environment Setup**

#### **Prerequisites**
- **Node.js 18+** and **npm** - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Git** for version control
- **Modern browser** with WebGL support for 3D visualizations

#### **Quick Start**

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the frontend directory
cd epii_app/friendly-file-front

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` with hot module replacement enabled.

#### **Available Scripts**

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Development build (for testing)
npm run build:dev

# Code linting
npm run lint

# Preview production build
npm run preview
```

### **Development Workflow and Conventions**

#### **Bimba-Aligned Development**
When adding new features or components, follow the **Bimba coordinate system**:

1. **Identify the Subsystem**: Determine which subsystem (#5-3-4.0 through #5-3-4.5) the feature belongs to
2. **Determine QL Level**: Place the component in the appropriate QL level (0-5) within the subsystem
3. **Follow Naming Conventions**: Use descriptive names that reflect the component's Bimba coordinate
4. **Update Documentation**: Add component descriptions to subsystem README files

#### **Code Organization Patterns**

```typescript
// Example: Adding a new utility to the Anuttara subsystem
// Location: src/subsystems/0_anuttara/1_utils/graphCalculations.ts

export const calculateNodePositions = (nodes: Node[]) => {
  // Utility logic for 2D graph positioning
};

// Import pattern in components
import { calculateNodePositions } from '../1_utils/graphCalculations';
```

#### **Component Development Guidelines**

- **TypeScript First**: All components must be written in TypeScript with proper type definitions
- **Responsive Design**: Use Tailwind CSS utilities for mobile-first responsive design
- **Accessibility**: Implement ARIA labels and keyboard navigation using Radix primitives
- **Performance**: Optimize re-renders using React.memo, useMemo, and useCallback where appropriate
- **Error Boundaries**: Implement error handling for visualization components

#### **State Management Patterns**

- **Local State**: Use useState for component-specific state
- **Shared State**: Use React Context for subsystem-wide state
- **Server State**: Use TanStack React Query for API data management
- **Form State**: Use React Hook Form for complex form interactions

### **Contributing Guidelines**

#### **Feature Development Process**

1. **Create Feature Branch**: Branch from main with descriptive name
2. **Follow Bimba Structure**: Place new code in appropriate subsystem and QL level
3. **Implement with Tests**: Add unit tests for utility functions and integration tests for components
4. **Update Documentation**: Update README files and add JSDoc comments
5. **Code Review**: Submit PR with clear description of changes and Bimba alignment

#### **Pull Request Requirements**

- **Bimba Coordinate Documentation**: Clearly specify which coordinates are affected
- **Type Safety**: Ensure all TypeScript types are properly defined
- **Performance Impact**: Document any performance implications
- **Accessibility Compliance**: Verify WCAG 2.1 AA compliance
- **Cross-Browser Testing**: Test in Chrome, Firefox, Safari, and Edge

#### **Code Quality Standards**

- **ESLint Compliance**: All code must pass linting without warnings
- **TypeScript Strict Mode**: No `any` types without explicit justification
- **Component Documentation**: JSDoc comments for all exported components
- **Consistent Formatting**: Use project's Prettier configuration

## Interaction with Backend and Other Systems

### **Backend Integration (`friendly-file-backend`)**

The frontend communicates with the backend through multiple channels:

#### **REST API Integration**
```typescript
// Primary API endpoints
const API_BASE = 'http://localhost:3001';

// Graph data fetching
GET /api/graph - Retrieve Bimba graph structure
GET /api/notion-content/:coordinate - Fetch Notion page content

// Document operations
POST /files/upload - Upload documents for analysis
POST /api/epii-agent/analyze - Trigger document analysis
GET /api/documents - Retrieve document metadata

// Chat functionality
POST /api/chat - Send chat messages to agents
POST /api/epii-agent/chat - Epii-specific chat interactions
```

#### **WebSocket Communication with AG-UI Integration** ✅ **COMPLETE**
- **AG-UI Events**: Real-time frontend-agent communication via centralized WebSocket service
- **Analysis progress**: Live updates during document processing with progress tracking
- **Bimba Updates**: Real-time property suggestions and coordinate updates
- **Document lifecycle**: AG-UI events for document operations and state changes
- **Centralized Service**: Single WebSocket connection initialized at app startup (`src/main.tsx`)

#### **Data Flow Architecture**
```
Frontend → Backend API → BPMCP Service → Memory Systems
    ↑                                         ↓
    ←─── Crystallized Knowledge ←─── Notion Integration
```

### **Back2Front System Integration (`friendly-file-back2front`)** ✅ **COMPLETE**

The frontend fully integrates with the **Agent-to-Agent (A2A) communication framework** enhanced with **complete AG-UI protocol support**:

#### **AG-UI Protocol Implementation**
- **Centralized WebSocket Service**: Single connection to A2A server (`webSocketService.ts`)
- **Event-Driven Architecture**: Real-time AG-UI events for progress tracking and updates
- **Component Integration**: BimbaUpdateOverlay and DocumentCanvas with AG-UI support
- **State Synchronization**: Frontend-agent consistency via AG-UI events
- **App-Level Initialization**: WebSocket service initialized at startup for global availability

#### **Complete AG-UI Integration Status**
**✅ Fully Implemented:**
- WebSocket service with AG-UI event handling (`src/subsystems/5_epii/1_services/webSocketService.ts`)
- BimbaUpdateOverlay with real-time suggestions and progress tracking
- Document Canvas with AG-UI event integration
- Analysis pipeline progress visualization
- Centralized event routing and state management
- Complete frontend-agent communication protocol

#### **AG-UI WebSocket Integration**
```typescript
// Centralized AG-UI WebSocket service
import { webSocketService, onAGUIEvent } from './subsystems/5_epii/1_services/webSocketService';

// AG-UI Event handling
onAGUIEvent('BimbaAnalysisProgress', (event) => {
  setAnalysisProgress({
    stage: event.stage,
    progress: event.progress,
    message: event.message
  });
});

// Skill execution with AG-UI support
await webSocketService.executeSkillWithAGUI('5-0', 'Document Analysis Pipeline', {
  targetCoordinate: '#1-4',
  documentContent: content
});
```

### **External System Integrations**

#### **Notion API Integration**
- **Direct API calls** for real-time content synchronization
- **Webhook support** for bidirectional updates
- **Database relationship management** across six interconnected databases

#### **LightRAG Integration**
- **Document ingestion** with Bimba coordinate tagging
- **Context retrieval** for enhanced analysis capabilities
- **Graph+vector fusion** for comprehensive knowledge synthesis

### **Development and Production Environments**

#### **Local Development**
```bash
# Start all services for full development environment
cd epii_app/friendly-file-backend && npm run dev  # Port 3001
cd epii_app/friendly-file-front && npm run dev    # Port 5173
cd epii_app/friendly-file-back2front && npm start # Port 3033
```

#### **Environment Configuration**
```typescript
// Environment-specific API endpoints
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    a2aUrl: 'ws://localhost:3033',
    notionApiUrl: 'https://api.notion.com/v1'
  },
  production: {
    apiUrl: process.env.VITE_API_URL,
    a2aUrl: process.env.VITE_A2A_URL,
    notionApiUrl: 'https://api.notion.com/v1'
  }
};
```

## Lovable Platform Integration

### **Development Options**

**Use Lovable Platform**

Simply visit the [Lovable Project](https://lovable.dev/projects/31fb6485-20e7-476b-bc99-183b041bf2ba) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use Local IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit Directly in GitHub**

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right of the file view
- Make your changes and commit the changes

**Use GitHub Codespaces**

- Navigate to the main page of your repository
- Click on the "Code" button (green button) near the top right
- Select the "Codespaces" tab
- Click on "New codespace" to launch a new Codespace environment
- Edit files directly within the Codespace and commit and push your changes once you're done

### **Deployment**

Simply open [Lovable](https://lovable.dev/projects/31fb6485-20e7-476b-bc99-183b041bf2ba) and click on Share → Publish.

For custom domains, we recommend using Netlify. Visit the [Lovable docs](https://docs.lovable.dev/tips-tricks/custom-domain/) for more details.
