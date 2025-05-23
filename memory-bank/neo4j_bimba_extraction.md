# Neo4j Bimba Map Extraction (Historical Snapshot)

This file contains the results of Cypher queries used to extract the structure of the Epi-Logos bimba map from the Neo4j database. This extraction was performed *before* the pivot away from Mem0 and reflects the state of the graph at that time. It is preserved for historical reference.

---

## Query 1: Project Node

**Cypher:**
```cypher
MATCH (p:Project {name: "Epi-Logos Project"})
RETURN labels(p) AS labels, p.name AS name, p.description AS description
```

**Result:**
```json
[
  {
    "labels": [
      "Project"
    ],
    "name": "Epi-Logos Project",
    "description": "The central node representing the entire Epi-Logos project initiative."
  }
]
```

---

## Query 6e: Nara Nested Components (Jungian Arena)

**Cypher:**
```cypher
MATCH (arena:ContextualArenaInstance {name: 'Jungian Psychodynamics Arena'})-[:HAS_NESTED_COMPONENT]->(comp)
RETURN labels(comp) AS labels, comp.id AS id, comp.name AS name, comp.description AS description, comp.mefLink AS mefLink
ORDER BY comp.id
```

**Result:**
```json
[
  {"labels": ["NaraNestedComponent"], "id": "4.0", "name": "Archetypal Foundation", "description": null, "mefLink": null},
  {"labels": ["NaraNestedComponent"], "id": "4.1", "name": "Psychological Typology", "description": null, "mefLink": null},
  {"labels": ["NaraNestedComponent"], "id": "4.2", "name": "Synchronicity & Expression", "description": null, "mefLink": null},
  {"labels": ["NaraNestedComponent"], "id": "4.3", "name": "Alchemical Transformation", "description": null, "mefLink": null},
  {"labels": ["NaraNestedComponent"], "id": "4.4", "name": "Self-Expression", "description": null, "mefLink": null},
  {"labels": ["NaraNestedComponent"], "id": "4.5", "name": "Transcendent Integration", "description": null, "mefLink": null}
]
```

---

## Query 6d: Nara Contextual Arena Instance

**Cypher:**
```cypher
MATCH (nc:NaraComponent {id: 4})-[:HAS_ARENA_INSTANCE]->(arena:ContextualArenaInstance)
RETURN labels(arena) AS labels, arena.name AS name, arena.description AS description, arena.mefLayer AS mefLayer
```

**Result:**
```json
[
  {
    "labels": ["ContextualArenaInstance"],
    "name": "Jungian Psychodynamics Arena",
    "description": "Grounds symbolic processes in psychological reality via Jungian framework.",
    "mefLayer": null
  }
]
```

---

## Query 6c: MEF Structure (Lenses and SubLenses)

**Cypher:**
```cypher
MATCH (pc:ParashaktiComponent {id: 1})-[:REPRESENTS_LENS]->(mef:MEFLens)-[:HAS_SUB_LENS]->(sub:MEFSubLens)
RETURN labels(mef) AS mefLabels, mef.name AS mefName,
       labels(sub) AS subLabels, sub.id AS subId, sub.name AS subName, sub.description AS subDescription
ORDER BY sub.id
```

**Result:**
```json
[
  {"mefLabels": ["MEFLens"], "mefName": "Archetypal-Numerical Foundation", "subLabels": ["MEFSubLens"], "subId": "0.0", "subName": "Originating potential", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Archetypal-Numerical Foundation", "subLabels": ["MEFSubLens"], "subId": "0.1", "subName": "Material grounding (what)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Archetypal-Numerical Foundation", "subLabels": ["MEFSubLens"], "subId": "0.2", "subName": "Active process (how)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Archetypal-Numerical Foundation", "subLabels": ["MEFSubLens"], "subId": "0.3", "subName": "Mediating identity (who)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Archetypal-Numerical Foundation", "subLabels": ["MEFSubLens"], "subId": "0.4", "subName": "Contextual field (when/where)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Archetypal-Numerical Foundation", "subLabels": ["MEFSubLens"], "subId": "0.5", "subName": "Purpose (why)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Causal Lens", "subLabels": ["MEFSubLens"], "subId": "1.0", "subName": "Primordial cause", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Causal Lens", "subLabels": ["MEFSubLens"], "subId": "1.1", "subName": "Material cause (what)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Causal Lens", "subLabels": ["MEFSubLens"], "subId": "1.2", "subName": "Efficient cause (how)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Causal Lens", "subLabels": ["MEFSubLens"], "subId": "1.3", "subName": "Formal cause (who/mediating structure)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Causal Lens", "subLabels": ["MEFSubLens"], "subId": "1.4", "subName": "Final cause (when/where)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Causal Lens", "subLabels": ["MEFSubLens"], "subId": "1.5", "subName": "Will as quintessence (why)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Logical Lens (Tetralemma)", "subLabels": ["MEFSubLens"], "subId": "2.0", "subName": "Query/Question (potential)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Logical Lens (Tetralemma)", "subLabels": ["MEFSubLens"], "subId": "2.1", "subName": "Affirmation (is)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Logical Lens (Tetralemma)", "subLabels": ["MEFSubLens"], "subId": "2.2", "subName": "Negation (is not)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Logical Lens (Tetralemma)", "subLabels": ["MEFSubLens"], "subId": "2.3", "subName": "Integration (both is and is not)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Logical Lens (Tetralemma)", "subLabels": ["MEFSubLens"], "subId": "2.4", "subName": "Transcendence (neither is nor is not)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Logical Lens (Tetralemma)", "subLabels": ["MEFSubLens"], "subId": "2.5", "subName": "Synthesized response (why)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Processual Lens", "subLabels": ["MEFSubLens"], "subId": "3.0", "subName": "Soil (foundation/potential)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Processual Lens", "subLabels": ["MEFSubLens"], "subId": "3.1", "subName": "Seeding (initiation)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Processual Lens", "subLabels": ["MEFSubLens"], "subId": "3.2", "subName": "Sprouting (active emergence)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Processual Lens", "subLabels": ["MEFSubLens"], "subId": "3.3", "subName": "Blooming (structural unfolding)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Processual Lens", "subLabels": ["MEFSubLens"], "subId": "3.4", "subName": "Flowering (contextual expression)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Processual Lens", "subLabels": ["MEFSubLens"], "subId": "3.5", "subName": "Maturity (synthesis/renewal)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Meta-Epistemic Lens", "subLabels": ["MEFSubLens"], "subId": "4.0", "subName": "Ajnana (implicit unknowing)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Meta-Epistemic Lens", "subLabels": ["MEFSubLens"], "subId": "4.1", "subName": "Ontology (what/being)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Meta-Epistemic Lens", "subLabels": ["MEFSubLens"], "subId": "4.2", "subName": "Epistemology (how/knowing)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Meta-Epistemic Lens", "subLabels": ["MEFSubLens"], "subId": "4.3", "subName": "Psychology (mediating structure)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Meta-Epistemic Lens", "subLabels": ["MEFSubLens"], "subId": "4.4", "subName": "Contextual domain (when/where)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Meta-Epistemic Lens", "subLabels": ["MEFSubLens"], "subId": "4.5", "subName": "Jnana (wholistic Knowing/why)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Divine-Scalar Lens", "subLabels": ["MEFSubLens"], "subId": "5.0", "subName": "Mystery/Anuttara", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Divine-Scalar Lens", "subLabels": ["MEFSubLens"], "subId": "5.1", "subName": "Para (non-dual archetypes)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Divine-Scalar Lens", "subLabels": ["MEFSubLens"], "subId": "5.2", "subName": "Parapara (Supreme-Non-Supreme)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Divine-Scalar Lens", "subLabels": ["MEFSubLens"], "subId": "5.3", "subName": "Parapara (Non-Supreme-Supreme)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Divine-Scalar Lens", "subLabels": ["MEFSubLens"], "subId": "5.4", "subName": "Apara (dualistic lived world)", "subDescription": null},
  {"mefLabels": ["MEFLens"], "mefName": "Divine-Scalar Lens", "subLabels": ["MEFSubLens"], "subId": "5.5", "subName": "Siva-Sakti (pragmatic unity)", "subDescription": null}
]
```

---

## Query 6b: Spanda Nested Stages (Linked to Spanda Component 4)

**Cypher:**
```cypher
MATCH (sc:SpandaComponent {id: 4})-[:HAS_NESTED_STAGE]->(stage:SpandaNestedStage)
RETURN labels(stage) AS labels, stage.id AS id, stage.name AS name, stage.description AS description
ORDER BY stage.id
```

**Result:**
```json
[
  {
    "labels": ["SpandaNestedStage"], "id": "4.0", "name": "4-Fold Static Framework",
    "description": "Emergence of (0/0, 0/1, 1/0, 1/1) static cross-section from ((0/1)/(1/0)). Represents stage #4.0."
  },
  {
    "labels": ["SpandaNestedStage"], "id": "4.1", "name": "6/7-Fold Dynamic Process",
    "description": "Processual flow across 4-fold states (0->1), linked to 5 Acts of Siva + Svatantrya (+ Samavesa). Represents stage #4.0/1."
  },
  {
    "labels": ["SpandaNestedStage"], "id": "4.2", "name": "6/8/9-Fold Static/Dynamic Frames",
    "description": "Emergence of hybrid states (0/(0/1), etc.) and 8/9-fold process, linked to 9 Virtues. Represents stage #4.(0/1/2)."
  },
  {
    "labels": ["SpandaNestedStage"], "id": "4.3", "name": "Dual Track Parallel Resolution",
    "description": "Emergence of ((0/1)/(1/0)) interiority, T1/T2 parallel tracks, 8/9 static & 10/11 dynamic frames. Represents stage #4.(0/1/2/3)."
  },
  {
    "labels": ["SpandaNestedStage"], "id": "4.4", "name": "Contextual Flowering Synthesis",
    "description": "Synthesis of developments into unified equation for infinite potential, leading to 4.4/5 transition."
  },
  {
    "labels": ["SpandaNestedStage"], "id": "4.5", "name": "Transcendence Link (/5)",
    "description": "Implicit link to stage 5 (Quintessence), representing the potential for recursive completion and transition."
  }
]
```

---

## Query 6a: Paramasiva Concepts (Linked to Component 5)

**Cypher:**
```cypher
MATCH (pc:ParamasivaComponent {id: 5})-[r:INTEGRATES_CONCEPT]->(concept:ParamasivaConcept)
RETURN labels(concept) AS labels, concept.name AS name, concept.description AS description
ORDER BY concept.name
```

**Result:**
```json
[
  {
    "labels": ["ParamasivaConcept"], "name": "Ananda-Spanda Synergy",
    "description": "Integration of harmonic structure (Ananda/Torus) and rhythmic dynamics (Spanda/Möbius)."
  },
  {
    "labels": ["ParamasivaConcept"], "name": "Bimba-Pratibimba Holography",
    "description": "Original-Reflection dynamic linking void (0/Bimba) and manifestation (1/All/Pratibimba)."
  },
  {
    "labels": ["ParamasivaConcept"], "name": "Concrescence Dynamics",
    "description": "Whiteheadian process of potential becoming actual via Bimba-Pratibimba lure and vortex matrix interplay."
  },
  {
    "labels": ["ParamasivaConcept"], "name": "QL_AT_Topological_Alignment",
    "description": "Resonance between Quaternal Logic (4-fold explicate -> 4g sides, 6-fold implicate -> 2g loops for g=1 Torus) and Algebraic Topology concepts (Fundamental Polygons, Homology, Identification, Möbius/Torus geometry, Proto-Homotopy). QL as symbolic/processual layer for A-T structures."
  },
  {
    "labels": ["ParamasivaConcept"], "name": "Vortex Math Integration",
    "description": "Harmonic patterns, digital roots, and infinity loops derived from Matrix 0/1 interplay."
  },
  {
    "labels": ["ParamasivaConcept"], "name": "Zero Logic Synthesis",
    "description": "Integration of 4-fold and 8-fold zero logic operations (-, /, x, +) as foundational stances."
  }
]
```

---

## Query 5: Component Relationships (DEVELOPS_INTO, RETURNS_TO)

**Cypher:**
```cypher
MATCH (c1)-[r:DEVELOPS_INTO|RETURNS_TO]->(c2)
WHERE labels(c1)[0] IN ['ParamasivaComponent', 'AnuttaraComponent', 'ParashaktiComponent', 'MahamayaComponent', 'NaraComponent', 'Lens']
  AND labels(c2)[0] IN ['ParamasivaComponent', 'AnuttaraComponent', 'ParashaktiComponent', 'MahamayaComponent', 'NaraComponent', 'Lens']
RETURN labels(c1)[0] AS startLabel, c1.id AS startId, c1.name AS startName,
       type(r) AS relationshipType,
       labels(c2)[0] AS endLabel, c2.id AS endId, c2.name AS endName
ORDER BY startLabel, startId
```

**Result:**
```json
[
  {"startLabel": "AnuttaraComponent", "startId": 0, "startName": "Transcendent Void", "relationshipType": "DEVELOPS_INTO", "endLabel": "AnuttaraComponent", "endId": 1, "endName": "Emergence of Non-Duality"},
  {"startLabel": "AnuttaraComponent", "startId": 1, "startName": "Emergence of Non-Duality", "relationshipType": "DEVELOPS_INTO", "endLabel": "AnuttaraComponent", "endId": 2, "endName": "Reflective Dynamic"},
  {"startLabel": "AnuttaraComponent", "startId": 2, "startName": "Reflective Dynamic", "relationshipType": "DEVELOPS_INTO", "endLabel": "AnuttaraComponent", "endId": 3, "endName": "Archetypal Number-Language"},
  {"startLabel": "AnuttaraComponent", "startId": 3, "startName": "Archetypal Number-Language", "relationshipType": "DEVELOPS_INTO", "endLabel": "AnuttaraComponent", "endId": 4, "endName": "Contextual Nesting"},
  {"startLabel": "AnuttaraComponent", "startId": 4, "startName": "Contextual Nesting", "relationshipType": "DEVELOPS_INTO", "endLabel": "AnuttaraComponent", "endId": 5, "endName": "Recursive Return"},
  {"startLabel": "AnuttaraComponent", "startId": 5, "startName": "Recursive Return", "relationshipType": "RETURNS_TO", "endLabel": "AnuttaraComponent", "endId": 0, "endName": "Transcendent Void"},
  {"startLabel": "Lens", "startId": 0, "startName": "Transcendent Identity", "relationshipType": "DEVELOPS_INTO", "endLabel": "Lens", "endId": 1, "endName": "Epi-Logos"},
  {"startLabel": "Lens", "startId": 1, "startName": "Epi-Logos", "relationshipType": "DEVELOPS_INTO", "endLabel": "Lens", "endId": 2, "endName": "Siva-"},
  {"startLabel": "Lens", "startId": 2, "startName": "Siva-", "relationshipType": "DEVELOPS_INTO", "endLabel": "Lens", "endId": 3, "endName": "-Shakti"},
  {"startLabel": "Lens", "startId": 3, "startName": "-Shakti", "relationshipType": "DEVELOPS_INTO", "endLabel": "Lens", "endId": 4, "endName": "Siva-Shakti"},
  {"startLabel": "Lens", "startId": 4, "startName": "Siva-Shakti", "relationshipType": "DEVELOPS_INTO", "endLabel": "Lens", "endId": 5, "endName": "Integral Identity"},
  {"startLabel": "Lens", "startId": 5, "startName": "Integral Identity", "relationshipType": "RETURNS_TO", "endLabel": "Lens", "endId": 0, "endName": "Transcendent Identity"},
  {"startLabel": "MahamayaComponent", "startId": 0, "startName": "Foundation Link / Manifest Form", "relationshipType": "DEVELOPS_INTO", "endLabel": "MahamayaComponent", "endId": 1, "endName": "Mathematical / DNA Integration"},
  {"startLabel": "MahamayaComponent", "startId": 1, "startName": "Mathematical / DNA Integration", "relationshipType": "DEVELOPS_INTO", "endLabel": "MahamayaComponent", "endId": 2, "endName": "I-Ching Dynamics"},
  {"startLabel": "MahamayaComponent", "startId": 2, "startName": "I-Ching Dynamics", "relationshipType": "DEVELOPS_INTO", "endLabel": "MahamayaComponent", "endId": 3, "endName": "Tarot / Narrative Integration"},
  {"startLabel": "MahamayaComponent", "startId": 3, "startName": "Tarot / Narrative Integration", "relationshipType": "DEVELOPS_INTO", "endLabel": "MahamayaComponent", "endId": 4, "endName": "Harmonic / Astrological Resonance"},
  {"startLabel": "MahamayaComponent", "startId": 4, "startName": "Harmonic / Astrological Resonance", "relationshipType": "DEVELOPS_INTO", "endLabel": "MahamayaComponent", "endId": 5, "endName": "Quintessence / Synthesis"},
  {"startLabel": "MahamayaComponent", "startId": 5, "startName": "Quintessence / Synthesis", "relationshipType": "RETURNS_TO", "endLabel": "MahamayaComponent", "endId": 0, "endName": "Foundation Link / Manifest Form"},
  {"startLabel": "NaraComponent", "startId": 0, "startName": "Mahamaya Ground", "relationshipType": "DEVELOPS_INTO", "endLabel": "NaraComponent", "endId": 1, "endName": "Decanic Magic"},
  {"startLabel": "NaraComponent", "startId": 1, "startName": "Decanic Magic", "relationshipType": "DEVELOPS_INTO", "endLabel": "NaraComponent", "endId": 2, "endName": "Tarot Systems"},
  {"startLabel": "NaraComponent", "startId": 2, "startName": "Tarot Systems", "relationshipType": "DEVELOPS_INTO", "endLabel": "NaraComponent", "endId": 3, "endName": "Alchemical Mediator"},
  {"startLabel": "NaraComponent", "startId": 3, "startName": "Alchemical Mediator", "relationshipType": "DEVELOPS_INTO", "endLabel": "NaraComponent", "endId": 4, "endName": "Contextual Arena Anchor"},
  {"startLabel": "NaraComponent", "startId": 4, "startName": "Contextual Arena Anchor", "relationshipType": "DEVELOPS_INTO", "endLabel": "NaraComponent", "endId": 5, "endName": "Epii Integration"},
  {"startLabel": "NaraComponent", "startId": 5, "startName": "Epii Integration", "relationshipType": "RETURNS_TO", "endLabel": "NaraComponent", "endId": 0, "endName": "Mahamaya Ground"},
  {"startLabel": "ParamasivaComponent", "startId": 0, "startName": "NonDualFoundation", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParamasivaComponent", "endId": 1, "endName": "FirstDifferentiation"},
  {"startLabel": "ParamasivaComponent", "startId": 1, "startName": "FirstDifferentiation", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParamasivaComponent", "endId": 2, "endName": "AnandaHarmonics"},
  {"startLabel": "ParamasivaComponent", "startId": 2, "startName": "AnandaHarmonics", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParamasivaComponent", "endId": 3, "endName": "SpandaDynamicLogic"},
  {"startLabel": "ParamasivaComponent", "startId": 3, "startName": "SpandaDynamicLogic", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParamasivaComponent", "endId": 4, "endName": "QuaternalLogicFlowering"},
  {"startLabel": "ParamasivaComponent", "startId": 4, "startName": "QuaternalLogicFlowering", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParamasivaComponent", "endId": 5, "endName": "RecursiveIntegrationSynthesis"},
  {"startLabel": "ParamasivaComponent", "startId": 5, "startName": "RecursiveIntegrationSynthesis", "relationshipType": "RETURNS_TO", "endLabel": "ParamasivaComponent", "endId": 0, "endName": "NonDualFoundation"},
  {"startLabel": "ParashaktiComponent", "startId": 0, "startName": "Paramasiva Ground", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParashaktiComponent", "endId": 1, "endName": "MEF - Meta-Logikon"},
  {"startLabel": "ParashaktiComponent", "startId": 1, "startName": "MEF - Meta-Logikon", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParashaktiComponent", "endId": 2, "endName": "Tattvas"},
  {"startLabel": "ParashaktiComponent", "startId": 2, "startName": "Tattvas", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParashaktiComponent", "endId": 3, "endName": "Decans"},
  {"startLabel": "ParashaktiComponent", "startId": 3, "startName": "Decans", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParashaktiComponent", "endId": 4, "endName": "Contextual Arena Anchor"},
  {"startLabel": "ParashaktiComponent", "startId": 4, "startName": "Contextual Arena Anchor", "relationshipType": "DEVELOPS_INTO", "endLabel": "ParashaktiComponent", "endId": 5, "endName": "Parashakti Synthesis"},
  {"startLabel": "ParashaktiComponent", "startId": 5, "startName": "Parashakti Synthesis", "relationshipType": "RETURNS_TO", "endLabel": "ParashaktiComponent", "endId": 0, "endName": "Paramasiva Ground"}
]
```

---

## Query 4b: Epii Lens Components

**Cypher:**
```cypher
MATCH (s:Subsystem {id: 5})-[:HAS_LENS]->(l:Lens)
RETURN labels(l) AS labels, l.id AS id, l.name AS name, l.description AS description, s.id AS parentSubsystemId
ORDER BY l.id
```

**Result:**
```json
[
  {"labels": ["Lens"], "id": 0, "name": "Transcendent Identity", "description": null, "parentSubsystemId": 5},
  {"labels": ["Lens"], "id": 1, "name": "Epi-Logos", "description": null, "parentSubsystemId": 5},
  {"labels": ["Lens"], "id": 2, "name": "Siva-", "description": null, "parentSubsystemId": 5},
  {"labels": ["Lens"], "id": 3, "name": "-Shakti", "description": null, "parentSubsystemId": 5},
  {"labels": ["Lens"], "id": 4, "name": "Siva-Shakti", "description": null, "parentSubsystemId": 5},
  {"labels": ["Lens"], "id": 5, "name": "Integral Identity", "description": null, "parentSubsystemId": 5}
]
```

---

## Query 4: Internal Components (General)

**Cypher:**
```cypher
MATCH (s:Subsystem)-[:HAS_INTERNAL_COMPONENT]->(c)
WHERE labels(c)[0] IN ['ParamasivaComponent', 'AnuttaraComponent', 'ParashaktiComponent', 'MahamayaComponent', 'NaraComponent', 'Lens']
RETURN labels(c) AS labels, c.id AS id, c.name AS name, c.description AS description, s.id AS parentSubsystemId
ORDER BY parentSubsystemId, c.id
```

**Result:**
```json
[
  {
    "labels": ["AnuttaraComponent"], "id": 0, "name": "Transcendent Void",
    "description": "Absolute ground, 4-fold zero, infinite self-nesting potential, withholding expansion.", "parentSubsystemId": 0
  },
  {
    "labels": ["AnuttaraComponent"], "id": 1, "name": "Emergence of Non-Duality",
    "description": "Equation of (0000) with (0/1), proto-homotopy, first stirring of manifestation.", "parentSubsystemId": 0
  },
  {
    "labels": ["AnuttaraComponent"], "id": 2, "name": "Reflective Dynamic",
    "description": "Bimba-Pratibimba dynamic, emergence of reflection and doubling (4/8/16 fold).", "parentSubsystemId": 0
  },
  {
    "labels": ["AnuttaraComponent"], "id": 3, "name": "Archetypal Number-Language",
    "description": "Proto-number-language (12 archetypes + 4fold zero), 12/13/14/15/16 fold dynamics.", "parentSubsystemId": 0
  },
  {
    "labels": ["AnuttaraComponent"], "id": 4, "name": "Contextual Nesting",
    "description": "Nesting of all context frames, emergence of 4-fold & 6-fold QL structures, 20+/-4 dynamic (16/24).", "parentSubsystemId": 0
  },
  {
    "labels": ["AnuttaraComponent"], "id": 5, "name": "Recursive Return",
    "description": "Equation of (0/1) with (5/0), Möbius-like return, integration of all principles, link to Paramasiva.", "parentSubsystemId": 0
  },
  {
    "labels": ["ParamasivaComponent"], "id": 0, "name": "NonDualFoundation",
    "description": "Represents the (0/1) non-dual unity, 4/8 fold zero logic, Bimba-Pratibimba seed, proto-homotopy.", "parentSubsystemId": 1
  },
  {
    "labels": ["ParamasivaComponent"], "id": 1, "name": "FirstDifferentiation",
    "description": "Represents the initial emergence from (0/1) into the Trika structure ((0/1)/(1/0)), the first explicate step.", "parentSubsystemId": 1
  },
  {
    "labels": ["ParamasivaComponent"], "id": 2, "name": "AnandaHarmonics",
    "description": "Embodies the Ananda subsystem, vortex mathematics, harmonic structuring, toroidal geometry.", "parentSubsystemId": 1
  },
  {
    "labels": ["ParamasivaComponent"], "id": 3, "name": "SpandaDynamicLogic",
    "description": "Embodies the Spanda subsystem, dynamic rhythmic pulsation, Möbius dynamics, emergence of dual fractal tracks (64/72 bit).", "parentSubsystemId": 1
  },
  {
    "labels": ["ParamasivaComponent"], "id": 4, "name": "QuaternalLogicFlowering",
    "description": "Contextual flowering, nested logic development (4.0-4.5), emergence of 7/8/9/10 fold frames, genesis of the QL Subsystem.", "parentSubsystemId": 1
  },
  {
    "labels": ["ParamasivaComponent"], "id": 5, "name": "RecursiveIntegrationSynthesis",
    "description": "Quintessence, meta-reflection on all structures, lensing dynamics (0/5), recursive return.", "parentSubsystemId": 1
  },
  {
    "labels": ["ParashaktiComponent"], "id": 0, "name": "Paramasiva Ground",
    "description": "Implicit foundation, archetypal numerical ground, seed field.", "parentSubsystemId": 2
  },
  {
    "labels": ["ParashaktiComponent"], "id": 1, "name": "MEF - Meta-Logikon",
    "description": "Material Cause (\"What\"), 36x2 Meta-Epistemic Framework, conceptual architecture.", "parentSubsystemId": 2
  },
  {
    "labels": ["ParashaktiComponent"], "id": 2, "name": "Tattvas",
    "description": "Efficient Cause (\"How\"), 36x2 Shaivist Tattvas, ontological bridge, mantra link.", "parentSubsystemId": 2
  },
  {
    "labels": ["ParashaktiComponent"], "id": 3, "name": "Decans",
    "description": "Formal Mediator (\"Which/Who\"), 36x2 Decans, astrological/musical/temporal integration.", "parentSubsystemId": 2
  },
  {
    "labels": ["ParashaktiComponent"], "id": 4, "name": "Contextual Arena Anchor",
    "description": "Contextual Frame (\"When/Where\"), anchor point for Parashakti's contextual frameworks (Names & Maqamat).", "parentSubsystemId": 2
  },
  {
    "labels": ["ParashaktiComponent"], "id": 5, "name": "Parashakti Synthesis",
    "description": "Quintessence (\"Why\"), integration of all components, vibrational template.", "parentSubsystemId": 2
  },
  {
    "labels": ["MahamayaComponent"], "id": 0, "name": "Foundation Link / Manifest Form",
    "description": "Connects to Parashakti #5, grounds potential, represents manifest form emerging from vibrational template.", "parentSubsystemId": 3
  },
  {
    "labels": ["MahamayaComponent"], "id": 1, "name": "Mathematical / DNA Integration",
    "description": "Integrates mathematical principles (primes, quaternions) with DNA codon structures (64-bit).", "parentSubsystemId": 3
  },
  {
    "labels": ["MahamayaComponent"], "id": 2, "name": "I-Ching Dynamics",
    "description": "Integrates I-Ching hexagrams, trigram compass dynamics, and balance principles across matrices.", "parentSubsystemId": 3
  },
  {
    "labels": ["MahamayaComponent"], "id": 3, "name": "Tarot / Narrative Integration",
    "description": "Integrates Tarot archetypes, narrative structures, and symbolic mapping.", "parentSubsystemId": 3
  },
  {
    "labels": ["MahamayaComponent"], "id": 4, "name": "Harmonic / Astrological Resonance",
    "description": "Integrates Orphic octal harmonics and links to Decanic cycles via Parashakti.", "parentSubsystemId": 3
  },
  {
    "labels": ["MahamayaComponent"], "id": 5, "name": "Quintessence / Synthesis",
    "description": "Integrates all Mahamaya layers, synthesizes symbolic meaning, links to Nara #0.", "parentSubsystemId": 3
  },
  {
    "labels": ["NaraComponent"], "id": 0, "name": "Mahamaya Ground",
    "description": null, "parentSubsystemId": 4
  },
  {
    "labels": ["NaraComponent"], "id": 1, "name": "Decanic Magic",
    "description": null, "parentSubsystemId": 4
  },
  {
    "labels": ["NaraComponent"], "id": 2, "name": "Tarot Systems",
    "description": null, "parentSubsystemId": 4
  },
  {
    "labels": ["NaraComponent"], "id": 3, "name": "Alchemical Mediator",
    "description": null, "parentSubsystemId": 4
  },
  {
    "labels": ["NaraComponent"], "id": 4, "name": "Contextual Arena Anchor",
    "description": null, "parentSubsystemId": 4
  },
  {
    "labels": ["NaraComponent"], "id": 5, "name": "Epii Integration",
    "description": null, "parentSubsystemId": 4
  }
]
```

---

## Query 3: Metasymbol Node

**Cypher:**
```cypher
MATCH (p:Project {name: "Epi-Logos Project"})<-[:META_SYMBOL_OF]-(ms:Metasymbol)
RETURN labels(ms) AS labels, ms.name AS name, ms.description AS description
```

**Result:**
```json
[
  {
    "labels": ["Metasymbol"],
    "name": "Epi-Logos Metasymbol",
    "description": "The integrated symbolic representation of the Epi-Logos system, combining Flower of Life, Compound Eye, Snake, Pinecone, Flower Petals/Torus, and Double Torus elements. Functions as a living architecture and integrative operator."
  }
]
```

---

## Query 2: Core Subsystems

**Cypher:**
```cypher
MATCH (p:Project {name: "Epi-Logos Project"})<-[:META_STRUCTURE_ELEMENT_OF]-(s:Subsystem)
RETURN labels(s) AS labels, s.id AS id, s.name AS name, s.description AS description
ORDER BY s.id
```

**Result:**
```json
[
  {
    "labels": ["Subsystem"],
    "id": 0,
    "name": "Anuttara",
    "description": "The Transcendent Void, pure potentiality"
  },
  {
    "labels": ["Subsystem"],
    "id": 1,
    "name": "Paramasiva",
    "description": "Non-Dual Binary, QL foundation, structural essence"
  },
  {
    "labels": ["Subsystem"],
    "id": 2,
    "name": "Parashakti",
    "description": "Vibrational Template, cosmic experientiality"
  },
  {
    "labels": ["Subsystem"],
    "id": 3,
    "name": "Mahamaya",
    "description": "Symbolic Integration, cosmic imagination"
  },
  {
    "labels": ["Subsystem"],
    "id": 4,
    "name": "Nara",
    "description": "Contextual Application, individualized cognition"
  },
  {
    "labels": ["Subsystem"],
    "id": 5,
    "name": "epii",
    "description": "Recursive Synthesis, self-awareness"
  }
]
```
