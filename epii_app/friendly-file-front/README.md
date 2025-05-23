# Epi-Logos Frontend (`friendly-file-front`)

## Overview and Purpose

The `friendly-file-front` application serves as the **primary user interface** for the Epi-Logos project, embodying the **#5-3 "-Shakti"** (expressive/manifesting) aspect of the Bimba architecture. As the dynamic, expressive counterpart to the backend's structural Siva nature, the frontend transforms the system's deep epistemic processing into intuitive, interactive experiences that make cosmic knowledge accessible and navigable.

### Core Purpose and Vision

- **Expressive Interface**: Manifests the backend's sophisticated QL cycles and memory architectures through elegant, responsive visualizations
- **Knowledge Crystallization Portal**: Provides seamless integration with Notion's fractal "book" structure, enabling users to explore and contribute to the evolving knowledge base
- **Multi-Modal Interaction**: Supports diverse interaction patterns from 2D/3D graph exploration to conversational document analysis
- **Bimba Navigation**: Enables intuitive traversal of the cosmic mind architecture through coordinate-based exploration and relationship mapping

## Current Frontend Architecture

The frontend follows a **Bimba-aligned vertical slice architecture** organized within the **#5-3-4.X** coordinate structure, representing the webapp frontend that contains all other frontend modules:

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

## Notion Integration: The Crystallization Interface

The frontend provides sophisticated integration with **Notion as the dynamic crystallization medium**:

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

### **Integration Workflow**
1. **Analysis Generation**: Frontend captures and visualizes analysis results
2. **Crystallization Preparation**: Formats insights for Notion integration
3. **Automated Synchronization**: Creates/updates Notion pages with structured content
4. **Relationship Establishment**: Links new content to existing coordinate structure
5. **Feedback Integration**: Incorporates Notion refinements back into system understanding

*For detailed Notion interface workflows and database structure, see the complete crystallization documentation in the project-level README.*

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

#### **WebSocket Communication**
- **Real-time chat**: Instant message delivery and typing indicators
- **Analysis progress**: Live updates during document processing
- **Graph updates**: Dynamic graph changes and coordinate updates

#### **Data Flow Architecture**
```
Frontend → Backend API → BPMCP Service → Memory Systems
    ↑                                         ↓
    ←─── Crystallized Knowledge ←─── Notion Integration
```

### **Back2Front System Integration (`friendly-file-back2front`)**

The frontend integrates with the **Agent-to-Agent (A2A) communication framework**:

#### **A2A Protocol Support**
- **Agent Discovery**: Automatic detection of available agents (Epii, Nara, etc.)
- **Task Routing**: Intelligent routing of requests to appropriate agent subsystems
- **State Synchronization**: Coordinated state management across agent interactions

#### **WebSocket Gateway Integration**
```typescript
// A2A WebSocket connection
const a2aConnection = new WebSocket('ws://localhost:3033');

// Agent communication patterns
interface A2AMessage {
  agentId: string;
  taskType: string;
  payload: any;
  bimbaCoordinate?: string;
}
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
