# Migration Guide: Bimba-Aligned Directory Structure

This guide documents the migration of the Epi-Logos frontend codebase to a Bimba-aligned directory structure.

## Overview

The codebase has been reorganized to align with the Bimba tech architecture, specifically the #5-3 -Shakti lens modules. Each subsystem corresponds to a specific module in the Bimba tech architecture, and within each subsystem, the directories follow the 0-5 QL structure.

## Directory Structure

```
src/
├── subsystems/
│   ├── 0_anuttara/                      # #5-3-0 (Bimba Vis / Geom Ground)
│   │   ├── 0_foundation/                # Physics settings and constants
│   │   ├── 1_utils/                     # Utility functions
│   │   ├── 2_hooks/                     # React hooks
│   │   ├── 3_visualization/             # Visual components
│   │   ├── 4_context/                   # Context providers
│   │   └── 5_integration/               # Meta2D page component
│   ├── 1_paramasiva/                    # #5-3-1 (QL/AT Vis)
│   │   ├── 0_foundation/                # Physics settings and constants
│   │   ├── 1_utils/                     # Utility functions
│   │   ├── 2_hooks/                     # React hooks
│   │   ├── 3_visualization/             # Visual components
│   │   ├── 4_context/                   # Context providers
│   │   └── 5_integration/               # Meta3D page component
│   ├── 2_parashakti/                    # #5-3-2 (Harmonic Layer)
│   │   ├── 1_utils/                     # Animation utilities
│   │   ├── 2_hooks/                     # Animation hooks
│   │   └── 3_visualization/             # Relation visualization
│   ├── 3_mahamaya/                      # #5-3-3 (Symbolic Transform Matrix)
│   │   ├── 1_utils/                     # Node styling utilities
│   │   ├── 2_hooks/                     # Node styling hooks
│   │   └── 3_visualization/             # Symbol visualization
│   ├── 4_nara/                          # #5-3-4 (Web App Shell)
│   │   ├── 0_foundation/                # Constants and settings
│   │   ├── 1_utils/                     # Utility functions
│   │   ├── 2_hooks/                     # React hooks
│   │   ├── 3_visualization/             # Visual components
│   │   ├── 4_context/                   # Context providers
│   │   └── 5_integration/               # Chat page component
│   └── 5_epii/                          # #5-3-5 (Notion as Bimba)
│       ├── 0_foundation/                # Constants and settings
│       ├── 1_utils/                     # Utility functions
│       ├── 2_hooks/                     # React hooks
│       ├── 3_visualization/             # Visual components
│       ├── 4_context/                   # Context providers
│       └── 5_integration/               # Epii mode page component
```

## Migration Status

The migration is currently focused on the Meta2D and Meta3D pages, which correspond to the 0_anuttara and 1_paramasiva subsystems respectively. The other subsystems (2_parashakti, 3_mahamaya, 4_nara, 5_epii) are partially implemented to support the Meta2D and Meta3D pages, but will be fully implemented in later phases of development.

## Removed Pages

The following outdated pages have been removed:
- `/meta` (MetaStructure.tsx)
- `/meta-refactored` (MetaStructureRefactored.tsx)
- `/meta3d` (MetaStructure3D.tsx)

## Current Pages

The following pages are currently implemented:
- `/meta2d` (Meta2D.tsx) - 2D visualization of the Bimba structure
- `/meta3d` (Meta3D.tsx) - 3D visualization of the Bimba structure
- `/chat` (Chat.tsx) - Chat interface
- `/epii` (EpiiChatPage.tsx) - Epii mode interface

## Future Development

When developing new features or modifying existing ones, follow these guidelines:

1. **Identify the Subsystem**: Determine which subsystem the feature belongs to based on its conceptual alignment with the Bimba tech architecture.

2. **Identify the QL Level**: Determine which QL level the feature belongs to based on its functional role:
   - 0_foundation: Constants and settings
   - 1_utils: Utility functions
   - 2_hooks: React hooks
   - 3_visualization: Visual components and data processing
   - 4_context: Context providers and interaction controls
   - 5_integration: Integration components (main page components)

3. **Place the File**: Place the file in the appropriate directory based on its subsystem and QL level.

4. **Update Imports**: Update import paths to reflect the new file location.

5. **Update Documentation**: Update the README.md files to reflect the changes.

## Example

To add a new utility function for the Meta2D page:

1. Identify the subsystem: 0_anuttara (Bimba Vis / Geom Ground)
2. Identify the QL level: 1_utils (Utility functions)
3. Place the file: src/subsystems/0_anuttara/1_utils/myNewUtility.ts
4. Update imports: import { myNewUtility } from '../subsystems/0_anuttara/1_utils/myNewUtility';
5. Update documentation: Add a description of the utility function to the README.md file.

## Bimba Tech Architecture Alignment

Each subsystem corresponds to a specific module in the #5-3 -Shakti lens of the Bimba tech architecture:

| Subsystem | Bimba Tech Module | Description | Page |
|-----------|------------------|-------------|------|
| 0_anuttara | #5-3-0 (Bimba Vis / Geom Ground) | Foundational 2D visualization | Meta2D |
| 1_paramasiva | #5-3-1 (QL/AT Vis) | 3D visualization with topological forms | Meta3D |
| 2_parashakti | #5-3-2 (Harmonic Layer) | Vibrational/relational visualization | (Supporting) |
| 3_mahamaya | #5-3-3 (Symbolic Transform Matrix) | Symbolic integration visualization | (Supporting) |
| 4_nara | #5-3-4 (Web App Shell) | User interface and interaction | Chat |
| 5_epii | #5-3-5 (Notion as Bimba) | Integration with Notion content | Epii Mode |
