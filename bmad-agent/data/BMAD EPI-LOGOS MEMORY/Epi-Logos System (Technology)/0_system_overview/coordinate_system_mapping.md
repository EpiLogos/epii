# Coordinate System Mapping - BMAD Memory Documentation

## Bimba Coordinate System Implementation
**Last Updated**: 2025-01-27

## Core Coordinate Structure

### Primary Coordinates (#0-#5)
The Epi-Logos system implements a six-fold recursive architecture where each subsystem contains its own complete mod6 internal structure:

#### **#0 Anuttara** - The Transcendent Void (Proto-logy)
- **Frontend**: Meta2D visualization, foundational patterns
- **Backend**: Base patterns, meta-systemic operations
- **Skills**: Pattern recognition, void operations
- **Domain**: Foundational logic, emergence patterns

#### **#1 Paramasiva** - Quaternal Logic and Algebraic Topology (Homo-logy)
- **Frontend**: Meta3D visualization, torus-based representations
- **Backend**: QL cycle implementations, topological operations
- **Skills**: Logical transformations, geometric operations
- **Domain**: Mathematical foundations, structural logic

#### **#2 Parashakti** - The Cosmic Experientiality (Co-homo-logos)
- **Frontend**: Developer console, experiential interfaces
- **Backend**: Experiential processing, harmonic operations
- **Skills**: Experience synthesis, harmonic analysis
- **Domain**: Dynamic experience, energy patterns

#### **#3 Mahamaya** - The Cosmic Imagination (Axio-logos)
- **Frontend**: Symbolic transformation interfaces
- **Backend**: Symbolic processing, imagination engines
- **Skills**: Symbol transformation, archetypal operations
- **Domain**: Symbolic transformation, imagination

#### **#4 Nara** - Individualized Cognition (Dia-logos)
- **Frontend**: Oracle interface, identity matrix, journal
- **Backend**: Individual processing, personalization engines
- **Skills**: Identity operations, personal synthesis
- **Domain**: Individual cognition, personalized processing

#### **#5 Epii** - Self-Awareness of Cosmic Mind (Epi-Logos)
- **Frontend**: Document canvas, analysis interfaces
- **Backend**: Analysis pipelines, crystallization
- **Skills**: Meta-reflection, consciousness operations
- **Domain**: Self-awareness, meta-cognitive processing

## Coordinate Assignment Patterns

### Infrastructure vs Epistemic Coordinates

#### **Infrastructure Coordinates** (Skills Registry/Management)
Used for organizing registry/router/initializer components within skills management:
- `bimba-skills-registry.js` (#5-4-3) - Registry management component
- `bimba-skills-router.js` (#5-4-4) - Routing management component
- These components stay in shared services directories

#### **Epistemic Domain Coordinates** (Actual Skills/Components)
Determine subsystem placement based on genuine epistemic domain:
- `epii-chat-skill.js` (#5) → `subsystems/5_epii/skills/`
- `nara-oracle-skill.js` (#4) → `subsystems/4_nara/skills/`
- Skills reflect actual domain expertise and cognitive function

### Coordinate Notation Systems

#### **Simple Notation**: `#X`
- Used for primary subsystem identification
- Example: `#5` = Epii domain

#### **Hierarchical Notation**: `#X-Y-Z`
- X = Primary subsystem (0-5)
- Y = Internal structure layer (0-5)
- Z = Specific component/function (0-5)
- Example: `#5-2-3` = Epii → Backend → Specific service

#### **Path-Based Notation**: `#X-Y-Z-W`
- Extended hierarchy for deep nesting
- W = Sub-component or method level
- Example: `#5-2-3-1` = Epii → Backend → Service → Method

## File System Coordinate Mapping

### Backend Coordinate Mapping (`5-2-Siva-Backend/`)
```
#5-2-0 = Database layer (/0_databases/)
  #5-2-0-0 = BPMCP services
  #5-2-0-1 = LightRAG services
  #5-2-0-2 = Graphiti services
  #5-2-0-3 = Neo4j services
  #5-2-0-4 = MongoDB services
  #5-2-0-5 = Notion services

#5-2-1 = Subsystem backend logic (/1_subsystems/)
  #5-2-1-0 = Anuttara backend
  #5-2-1-1 = Paramasiva backend
  #5-2-1-2 = Parashakti backend
  #5-2-1-3 = Mahamaya backend
  #5-2-1-4 = Nara backend
  #5-2-1-5 = Epii backend

#5-2-2 = Shared backend components
#5-2-3 = Configuration
#5-2-4 = Utilities
#5-2-5 = Integration points
```

### Frontend Coordinate Mapping (`5-3-Shakti-Frontend/`)
```
#5-3-0 = Shared frontend components
#5-3-1 = Subsystem frontend logic
  #5-3-1-0 = Anuttara frontend (Meta2D)
  #5-3-1-1 = Paramasiva frontend (Meta3D)
  #5-3-1-2 = Parashakti frontend (Developer Console)
  #5-3-1-3 = Mahamaya frontend
  #5-3-1-4 = Nara frontend (Oracle/Journal/Identity)
  #5-3-1-5 = Epii frontend (Document Canvas)

#5-3-2 = Universal agent system frontend
#5-3-3 = React hooks
#5-3-4 = Frontend services
#5-3-5 = Integration points
```

### Back2Front Coordinate Mapping (`5-4-Siva-Shakti-Back2Front/`)
```
#5-4-0 = Shared infrastructure (/shared/)
  #5-4-0-0 = A2A communication layer (/shared/a2a/)
  #5-4-0-1 = AG-UI communication layer (/shared/ag-ui/)
  #5-4-0-2 = Shared services (/shared/services/)
  #5-4-0-3 = Documentation (/shared/docs/)
  #5-4-0-4 = Tests (/shared/tests/)

#5-4-1 = Universal agent system (/epi-logos-system/)
  #5-4-1-0 = Foundation types and interfaces
  #5-4-1-1 = Agent orchestration logic
  #5-4-1-2 = Universal agent skills
  #5-4-1-3 = Communication integration
  #5-4-1-4 = System-wide integrations
  #5-4-1-5 = Universal services

#5-4-2 = Subsystem back2front (/subsystems/)
  #5-4-2-0 = Anuttara back2front
  #5-4-2-1 = Paramasiva back2front
  #5-4-2-2 = Parashakti back2front
  #5-4-2-3 = Mahamaya back2front
  #5-4-2-4 = Nara back2front
  #5-4-2-5 = Epii back2front

Root Level Components:
- /adapters/ = Agent-specific A2A protocol adapters
- /agent-cards/ = Agent capability and skill definitions
- /skills/ = Bimba-aligned skills registry and routing
- /examples/ = Test clients and usage demonstrations
```

## Coordinate-Based Development Rules

### Placement Guidelines
1. **Epistemic Domain**: Files belong in subsystems based on their cognitive/epistemic function
2. **Infrastructure vs Domain**: Distinguish between management infrastructure and actual domain functionality
3. **Holographic Completeness**: Each subsystem contains its complete internal 0-5 structure
4. **Cross-Coordinate Integration**: Use coordinate references for inter-subsystem communication

### Coordinate Discovery Process
1. **Analyze Function**: What is the actual cognitive/epistemic role of this component?
2. **Check Existing Patterns**: What coordinate patterns exist for similar functionality?
3. **Verify Placement**: Does the coordinate reflect the true nature of the component?
4. **Document Rationale**: Why does this coordinate assignment make sense?

### Development Workflow Integration
- **File Creation**: Assign coordinate based on epistemic function
- **Cross-References**: Use coordinates for dependency tracking
- **Pattern Recognition**: Identify coordinate-based patterns
- **Refactoring**: Maintain coordinate consistency during restructuring

## Future Coordinate Evolution

### Coordinate Extensions
- **Temporal Coordinates**: Adding time-based coordinate dimensions
- **Context Coordinates**: Adding situational/contextual coordinate layers
- **User Coordinates**: Adding personalization coordinate dimensions
- **Scale Coordinates**: Adding scope/scale coordinate dimensions

### Coordinate Validation
- **Consistency Checking**: Automated validation of coordinate assignments
- **Pattern Detection**: Recognition of coordinate-based patterns
- **Dependency Mapping**: Coordinate-aware dependency analysis
- **Architecture Validation**: Ensuring coordinate assignments reflect system architecture