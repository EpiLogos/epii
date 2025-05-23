# Bimba Graph Schema (Neo4j) - Synced with Database

This document reflects the node labels, properties, and relationship types currently present in the Epi-Logos Neo4j bimba graph, as retrieved directly from the database or updated based on recent Cypher scripts.

*Note: This schema was generated based on a direct query to the database and manual updates reflecting recent changes.*

## Node Labels, Attributes & Relationships

*   **`Agent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING unique indexed
        *   `ql_role_neg`: INTEGER
        *   `ql_role_pos`: INTEGER
        *   `roles`: LIST
        *   `bimbaCoordinate`: STRING (*Assigned based on position within #5-1 Lens*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`AnandaComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `role`: STRING
        *   `bimbaCoordinate`: STRING (*Potentially assigned if nested*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`AnuttaraComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `quality`: STRING
        *   `symbol`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #0-X*)
    *   **Relationships:**
        *   `DEVELOPS_INTO`: `AnuttaraComponent`
        *   `RETURNS_TO`: `AnuttaraComponent`

*   **`ContextualArenaInstance`**
    *   **Attributes:**
        *   `description`: STRING
        *   `mefCondition`: INTEGER
        *   `name`: STRING
        *   `type`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #4.4.3*)
    *   **Relationships:**
        *   `HAS_NESTED_COMPONENT`: `NaraNestedComponent`

*   **`IdentityAspect`** (*New Label*)
    *   **Attributes:**
        *   `aspectId`: INTEGER
        *   `name`: STRING
        *   `content`: STRING
        *   `function`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #5-0-X*)
    *   **Relationships:**
        *   `TRANSCENDENT_IDENTITY_OF`: `Subsystem`
        *   `EGOIC_IDENTITY_OF`: `Lens`
        *   `COLLECTIVE_IDENTITY_OF`: `Lens`
        *   `SOUL_IDENTITY_OF`: `Lens`
        *   `SELF_IDENTITY_OF`: `Lens`
        *   `INTEGRAL_IDENTITY_OF`: `Lens`
        *   `TRANSCENDENT_GROUND_OF`: `Project`

*   **`Lens`**
    *   **Attributes:**
        *   `content`: STRING
        *   `function`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #5-X*)
    *   **Relationships:**
        *   `CONTAINS_AGENT`: `Agent`
        *   `DEVELOPS_INTO`: `Lens`
        *   `RETURNS_TO`: `Lens`
        *   `HAS_POSITION`: `LensPosition` (*New Relationship*)
        *   `HAS_IDENTITY_ASPECT`: `IdentityAspect` (*New Relationship*)

*   **`LensPosition`** (*New Label*)
    *   **Attributes:**
        *   `positionId`: INTEGER
        *   `name`: STRING
        *   `content`: STRING
        *   `function`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #5-1-X*)
    *   **Relationships:**
        *   `HAS_LOGOS_STAGE`: `LogosStage` (*New Relationship*)

*   **`LogicSubsystem`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING unique indexed
        *   `bimbaCoordinate`: STRING (*Potentially assigned if nested*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`LogosStage`** (*New Label*)
    *   **Attributes:**
        *   `stageId`: INTEGER
        *   `name`: STRING
        *   `content`: STRING
        *   `function`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #5-5-X*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`MEFLens`**
    *   **Attributes:**
        *   `coreRole`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #2-1-X*)
    *   **Relationships:**
        *   `HAS_SUB_LENS`: `MEFSubLens`

*   **`MEFSubLens`**
    *   **Attributes:**
        *   `hasNestedReflection`: BOOLEAN
        *   `id`: STRING unique indexed (*Format: "X.Y"*)
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #2-1-X-Y*)
    *   **Relationships:**
        *   `HARMONIZED_IN`: `IdentityAspect` (*New Relationship*)

*   **`MahamayaComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #3-X*)
    *   **Relationships:**
        *   `DEVELOPS_INTO`: `MahamayaComponent`
        *   `INTEGRATES_WITH`: `NaraComponent`
        *   `REFLECTS_FOUNDATION`: `ParashaktiComponent`
        *   `RETURNS_TO`: `MahamayaComponent`

*   **`Metasymbol`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING unique indexed
        *   `bimbaCoordinate`: STRING (*Potentially assigned if central*)
    *   **Relationships:**
        *   `HAS_SYMBOL_COMPONENT`: `MetasymbolComponent`
        *   `META_SYMBOL_OF`: `Project`

*   **`MetasymbolComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING unique indexed
        *   `role`: STRING
        *   `bimbaCoordinate`: STRING (*Potentially assigned if nested*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`NaraComponent`**
    *   **Attributes:**
        *   `details`: STRING
        *   `function`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #4.X*)
    *   **Relationships:**
        *   `DEVELOPS_INTO`: `NaraComponent`
        *   `HAS_ARENA_INSTANCE`: `ContextualArenaInstance`
        *   `RETURNS_TO`: `NaraComponent`

*   **`NaraNestedComponent`**
    *   **Attributes:**
        *   `id`: STRING unique indexed (*Format: "4.3-Z"*)
        *   `jungianConcept`: STRING
        *   `mefCondition`: INTEGER
        *   `name`: STRING
        *   `ontologicalLayer`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #4.4.3-Z*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`OntologyLayer`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING unique indexed
        *   `bimbaCoordinate`: STRING (*Potentially assigned*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`ParamasivaComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #1-X*)
    *   **Relationships:**
        *   `CONTAINS_ANANDA_COMPONENT`: `AnandaComponent`
        *   `CONTAINS_LOGIC_STAGE`: `QLComponent`
        *   `CONTAINS_SPANDA_STAGE`: `SpandaComponent`
        *   `DEVELOPS_INTO`: `ParamasivaComponent`
        *   `DEVELOPS_LOGIC_SYSTEM`: `LogicSubsystem`
        *   `INTEGRATES_CONCEPT`: `ParamasivaConcept`
        *   `RETURNS_TO`: `ParamasivaComponent`
        *   `ZERO_ONE_UNITY`: `ParamasivaComponent`

*   **`ParamasivaConcept`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING unique indexed
        *   `bimbaCoordinate`: STRING (*Potentially assigned if nested*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`ParashaktiComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #2-X*)
    *   **Relationships:**
        *   `DEVELOPS_INTO`: `ParashaktiComponent`
        *   `HAS_ARENA_INSTANCE`: `ContextualArenaInstance`
        *   `REPRESENTS_LENS`: `MEFLens`
        *   `RETURNS_TO`: `ParashaktiComponent`

*   **`Project`**
    *   **Attributes:**
        *   `description`: STRING
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*Potentially assigned if central*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`QLComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*Potentially assigned if nested*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`QLFrame`**
    *   **Attributes:**
        *   `contextFrame`: STRING
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*Potentially assigned*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`SpandaComponent`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `role`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #1-3-X*)
    *   **Relationships:**
        *   `HAS_NESTED_STAGE`: `SpandaNestedStage`

*   **`SpandaNestedStage`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: STRING unique indexed (*Format: "4.Y"*)
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #1-3-4.Y*)
    *   **Relationships:** (None outgoing reported by schema tool)

*   **`Subsystem`**
    *   **Attributes:**
        *   `description`: STRING
        *   `id`: INTEGER unique indexed
        *   `name`: STRING
        *   `bimbaCoordinate`: STRING (*e.g., #X*)
    *   **Relationships:**
        *   `FOLLOWS`: `Subsystem`
        *   `HAS_INTERNAL_COMPONENT`: `AnuttaraComponent` (*Note: Also links to other Component types*)
        *   `HAS_LENS`: `Lens`
        *   `HAS_QL_FRAME`: `QLFrame`
        *   `MAPS_TO_ONTOLOGY_LAYER`: `OntologyLayer`
        *   `META_STRUCTURE_ELEMENT_OF`: `Project`
        *   `RETURNS_TO`: `Subsystem`
        *   `ZERO_ONE_UNITY`: `ParamasivaComponent`

*Note: Relationships reported by the schema tool only show outgoing relationships from the primary label. Inverse relationships exist but are not listed here. Some relationships might exist to labels not captured if those labels have no properties.*
