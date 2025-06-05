# Mahamaya Matrix MongoDB Schema Documentation

**Epic 1, Story E1_F2_S1: Backend System for Mahamaya Matrix**

This document defines the MongoDB schema structure for the Mahamaya Matrix system, which stores and manages user context data derived from the six Mahamaya Ground layers and the synthesized Archetypal Quintessence.

## Overview

The Mahamaya Matrix consists of 8 main collections:

1. **mahamaya_user_profiles** - Central user profile linking to all layers
2. **mahamaya_birthdate_encoding** - Birthdate and numerological data
3. **mahamaya_astrological_charts** - Natal, progressed, and transit charts
4. **mahamaya_jungian_assessments** - Jungian archetype assessment results
5. **mahamaya_gene_keys** - Gene Keys profile data
6. **mahamaya_human_design** - Human Design profile data
7. **mahamaya_i_ching** - I Ching hexagram data
8. **mahamaya_archetypal_quintessence** - Synthesized archetypal essence

## Schema Definitions

### 1. User Profiles Collection: `mahamaya_user_profiles`

Central collection linking to all Mahamaya Ground layers.

```javascript
{
  _id: ObjectId,
  userId: String, // UUID - Primary identifier
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  isActive: Boolean,
  completionStatus: {
    birthdateEncoding: Boolean,
    astrologicalChart: Boolean,
    jungianAssessment: Boolean,
    geneKeysProfile: Boolean,
    humanDesignProfile: Boolean,
    iChingHexagrams: Boolean,
    archetypalQuintessence: Boolean
  },
  metadata: {
    version: String,
    lastSyncedAt: Date
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date // For soft deletes
}
```

**Indexes:**
- `{ userId: 1 }` (unique)

### 2. Birthdate Encoding Collection: `mahamaya_birthdate_encoding`

Stores encrypted birth information and numerological profiles.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  birthDate: {
    encrypted: String,
    iv: String,
    authTag: String
  }, // Encrypted birth date
  birthTime: {
    encrypted: String,
    iv: String,
    authTag: String
  }, // Encrypted birth time
  birthLocation: {
    encrypted: String,
    iv: String,
    authTag: String
  }, // Encrypted JSON of location data
  numerologicalProfile: {
    lifePathNumber: Number,
    destinyNumber: Number,
    soulUrgeNumber: Number,
    personalityNumber: Number,
    birthdayNumber: Number,
    maturityNumber: Number,
    karmaNumbers: [Number],
    masterNumbers: [Number]
  },
  encodingMetadata: {
    calculationMethod: String,
    version: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` (unique)

### 3. Astrological Charts Collection: `mahamaya_astrological_charts`

Stores natal, progressed, and transit chart data.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  chartType: String, // 'natal', 'progressed', 'transit'
  chartData: {
    houses: [{
      number: Number,
      sign: String,
      degree: Number,
      cusp: Number
    }],
    aspects: [{
      planet1: String,
      planet2: String,
      aspectType: String,
      orb: Number,
      applying: Boolean
    }]
  },
  planetaryPositions: [{
    planet: String,
    sign: String,
    house: Number,
    degree: Number,
    minute: Number,
    second: Number,
    retrograde: Boolean
  }],
  houses: [{
    number: Number,
    sign: String,
    cusp: Number,
    ruler: String
  }],
  aspects: [{
    planet1: String,
    planet2: String,
    type: String,
    orb: Number,
    exact: Boolean
  }],
  interpretations: {
    sunSign: String,
    moonSign: String,
    ascendant: String,
    midheaven: String,
    dominantElements: [String],
    dominantQualities: [String],
    planetaryStrengths: Object
  },
  calculationDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, chartType: 1 }`

### 4. Jungian Assessments Collection: `mahamaya_jungian_assessments`

Stores Jungian archetype assessment results.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  assessmentType: String, // 'MBTI', 'Enneagram', 'Jungian Functions', etc.
  personalityType: String, // e.g., 'INTJ', 'Type 5', etc.
  cognitiveFunction: {
    dominant: String,
    auxiliary: String,
    tertiary: String,
    inferior: String,
    shadow: [String]
  },
  archetypeProfile: {
    primaryArchetype: String,
    secondaryArchetypes: [String],
    shadowArchetypes: [String],
    animaAnimus: String,
    persona: String
  },
  shadowWork: {
    identifiedShadows: [String],
    integrationProgress: Number, // 0-100
    workingAreas: [String]
  },
  individuationStage: {
    currentStage: String,
    stageDescription: String,
    nextSteps: [String],
    challenges: [String]
  },
  assessmentDate: Date,
  assessmentVersion: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, assessmentDate: -1 }`

### 5. Gene Keys Profile Collection: `mahamaya_gene_keys`

Stores Gene Keys profile data.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  lifeWork: {
    activation: Number, // Gene Key number
    giftShadowSiddhi: {
      shadow: String,
      gift: String,
      siddhi: String
    },
    codonRing: String,
    aminoAcid: String
  },
  evolution: {
    activation: Number,
    giftShadowSiddhi: {
      shadow: String,
      gift: String,
      siddhi: String
    },
    codonRing: String,
    aminoAcid: String
  },
  radiance: {
    activation: Number,
    giftShadowSiddhi: {
      shadow: String,
      gift: String,
      siddhi: String
    },
    codonRing: String,
    aminoAcid: String
  },
  purpose: {
    activation: Number,
    giftShadowSiddhi: {
      shadow: String,
      gift: String,
      siddhi: String
    },
    codonRing: String,
    aminoAcid: String
  },
  geneKeys: [{
    number: Number,
    name: String,
    shadow: String,
    gift: String,
    siddhi: String,
    codonRing: String,
    aminoAcid: String,
    iChing: String
  }],
  activationSequence: {
    currentPhase: String,
    completedPhases: [String],
    nextActivation: Number,
    timeframe: String
  },
  contemplations: [{
    geneKey: Number,
    contemplation: String,
    insights: [String],
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` (unique)

### 6. Human Design Profile Collection: `mahamaya_human_design`

Stores Human Design profile data.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  type: String, // 'Generator', 'Projector', 'Manifestor', 'Reflector', 'Manifesting Generator'
  strategy: String,
  authority: String,
  profile: String, // e.g., '1/3', '2/4', etc.
  centers: [{
    name: String,
    defined: Boolean,
    gates: [Number],
    energy: String
  }],
  channels: [{
    number: String,
    name: String,
    gates: [Number],
    circuitry: String,
    type: String
  }],
  gates: [{
    number: Number,
    name: String,
    line: Number,
    planet: String,
    conscious: Boolean
  }],
  incarnationCross: {
    name: String,
    gates: [Number],
    description: String,
    lifeTheme: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` (unique)

### 7. I Ching Hexagrams Collection: `mahamaya_i_ching`

Stores I Ching hexagram data related to user context.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  hexagramNumber: Number, // 1-64
  hexagramName: String,
  contextType: String, // 'birth', 'query', 'transit', 'contemplation'
  lines: [{
    position: Number, // 1-6
    type: String, // 'yin', 'yang', 'changing'
    meaning: String
  }],
  interpretation: {
    general: String,
    personal: String,
    timing: String,
    advice: String,
    warning: String
  },
  relatedHexagrams: [{
    number: Number,
    relationship: String, // 'opposite', 'inverse', 'nuclear', etc.
  }],
  queryContext: {
    question: String,
    situation: String,
    dateAsked: Date,
    followUp: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, contextType: 1 }`

### 8. Archetypal Quintessence Collection: `mahamaya_archetypal_quintessence`

Stores the synthesized archetypal essence derived from all layers.

```javascript
{
  _id: ObjectId,
  userId: String, // Foreign key to user profile
  synthesizedArchetype: {
    primaryArchetype: String,
    archetypeDescription: String,
    coreQualities: [String],
    shadowAspects: [String],
    giftAspects: [String]
  },
  coreThemes: [{
    theme: String,
    description: String,
    sourceLayer: String, // Which Mahamaya layer contributed this theme
    strength: Number // 1-10 importance/strength rating
  }],
  shadowIntegration: {
    identifiedShadows: [String],
    integrationStrategies: [String],
    progressMarkers: [String],
    currentFocus: String
  },
  individuationPath: {
    currentStage: String,
    stageDescription: String,
    nextMilestones: [String],
    lifeThemes: [String],
    purposeStatement: String
  },
  symbolicResonance: {
    symbols: [String],
    colors: [String],
    elements: [String],
    animals: [String],
    myths: [String]
  },
  transformationalGuidance: {
    practices: [String],
    contemplations: [String],
    challenges: [String],
    opportunities: [String],
    timing: String
  },
  synthesisDate: Date,
  version: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` (unique)

## Security Considerations

### Field-Level Encryption

Sensitive PII fields are encrypted using AES-256-GCM:

- **birthDate** - Encrypted birth date
- **birthTime** - Encrypted birth time  
- **birthLocation** - Encrypted location data

Encrypted fields follow this structure:
```javascript
{
  encrypted: String, // Encrypted data
  iv: String,        // Initialization vector
  authTag: String    // Authentication tag
}
```

### Access Control

- All collections require authenticated access
- User data is isolated by `userId`
- Soft deletes preserve data integrity
- Audit trails track data modifications

## Performance Optimization

### Indexing Strategy

- Primary indexes on `userId` for all collections
- Composite indexes for common query patterns
- TTL indexes for session and temporary data
- Unique constraints where appropriate

### Query Patterns

- Single user data retrieval by `userId`
- Layer-specific data queries
- Completion status tracking
- Temporal data access (assessments, charts)

## Data Relationships

```
mahamaya_user_profiles (1)
├── mahamaya_birthdate_encoding (1:1)
├── mahamaya_astrological_charts (1:many)
├── mahamaya_jungian_assessments (1:many)
├── mahamaya_gene_keys (1:1)
├── mahamaya_human_design (1:1)
├── mahamaya_i_ching (1:many)
└── mahamaya_archetypal_quintessence (1:1)
```

All relationships are maintained through the `userId` foreign key, ensuring data consistency and enabling efficient queries across the Mahamaya Matrix.
