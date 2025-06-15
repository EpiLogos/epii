# AG-UI Backend Integration Guide

## Overview

The A2A server provides AG-UI (Agent-Generated User Interface) capabilities through its integrated AG-UI Gateway, enabling skills to emit real-time events that directly update frontend components.

## Architecture

### A2A Server AG-UI Gateway

The A2A server includes an integrated AG-UI Gateway that:
- Receives WebSocket connections from frontend clients
- Manages client subscriptions to AG-UI events
- Broadcasts skill-emitted events to subscribed clients
- Provides skill execution context and metadata handling

**Connection Endpoint**: `ws://localhost:3033`

### AG-UI Event Broadcasting System

Skills can emit AG-UI events using the established patterns:

```javascript
// Emit progress updates
await this.emitAGUIEvent('BimbaAnalysisProgress', {
  stage: 'document_analysis',
  progress: 45,
  currentStep: 'Analyzing document structure...',
  targetCoordinate: params.bimbaCoordinate
});

// Emit final results
await this.emitAGUIEvent('BimbaUpdateSuggestions', {
  propertyUpdates: suggestions.propertyUpdates,
  relationshipSuggestions: suggestions.relationshipSuggestions,
  targetCoordinate: params.bimbaCoordinate,
  reasoning: suggestions.reasoning
});
```

## Skill Development Patterns

### 1. AG-UI Enabled Skill Structure

```javascript
class MyAGUISkill extends BaseSkill {
  constructor() {
    super();
    this.id = 'my-agui-skill';
    this.name = 'My AG-UI Enabled Skill';
    this.description = 'Example skill with AG-UI integration';
  }

  async execute(params, context) {
    try {
      // Emit start event
      await this.emitAGUIEvent('RunStarted', {
        skillId: this.id,
        targetCoordinate: params.targetCoordinate
      });

      // Stage 1: Initialization
      await this.emitAGUIEvent('MySkillProgress', {
        stage: 'initialization',
        progress: 10,
        currentStep: 'Initializing skill execution...'
      });

      // Perform work...
      const results = await this.performWork(params);

      // Stage 2: Processing
      await this.emitAGUIEvent('MySkillProgress', {
        stage: 'processing',
        progress: 50,
        currentStep: 'Processing data...'
      });

      // More work...
      const finalResults = await this.finalizeResults(results);

      // Emit final results
      await this.emitAGUIEvent('MySkillResults', {
        results: finalResults,
        targetCoordinate: params.targetCoordinate
      });

      // Emit completion
      await this.emitAGUIEvent('RunFinished', {
        skillId: this.id,
        success: true
      });

      return finalResults;

    } catch (error) {
      // Emit error event
      await this.emitAGUIEvent('RunError', {
        skillId: this.id,
        error: error.message,
        targetCoordinate: params.targetCoordinate
      });
      throw error;
    }
  }
}
```

### 2. Progress Reporting Standards

Use consistent progress reporting patterns:

```javascript
// Stage-based progress
const stages = [
  { name: 'initialization', weight: 10 },
  { name: 'document_analysis', weight: 40 },
  { name: 'llm_processing', weight: 30 },
  { name: 'result_formatting', weight: 20 }
];

let currentProgress = 0;
for (const stage of stages) {
  await this.emitAGUIEvent('MySkillProgress', {
    stage: stage.name,
    progress: currentProgress,
    currentStep: `Starting ${stage.name}...`
  });

  // Perform stage work with sub-progress
  await this.performStageWork(stage, (subProgress) => {
    const totalProgress = currentProgress + (stage.weight * subProgress / 100);
    this.emitAGUIEvent('MySkillProgress', {
      stage: stage.name,
      progress: Math.round(totalProgress),
      currentStep: `Processing ${stage.name}: ${subProgress}%`
    });
  });

  currentProgress += stage.weight;
}
```

### 3. Metadata Integration

Include comprehensive metadata in AG-UI events:

```javascript
await this.emitAGUIEvent('BimbaUpdateSuggestions', {
  propertyUpdates: suggestions.propertyUpdates,
  relationshipSuggestions: suggestions.relationshipSuggestions,
  targetCoordinate: params.bimbaCoordinate,
  reasoning: suggestions.reasoning,
  metadata: {
    skillId: this.id,
    executionTime: Date.now() - startTime,
    documentCount: params.documents?.length || 0,
    qlMetadata: {
      qlPosition: extractedQLPosition,
      contextFrame: params.qlMetadata?.contextFrame,
      qlMode: params.qlMetadata?.qlMode
    },
    analysisMetrics: {
      tokensProcessed: totalTokens,
      confidenceScore: averageConfidence,
      suggestionsGenerated: Object.keys(suggestions.propertyUpdates).length
    }
  }
});
```

## Bimba Update Management Skill Reference

The enhanced Bimba Update Management skill serves as the reference implementation for AG-UI-enabled skills.

### Key Features:

1. **Foundational Property Focus**: Prioritizes the four core relational properties
2. **Real-time Progress Reporting**: Detailed progress updates throughout execution
3. **Structured LLM Prompting**: Refined prompting strategy for quality suggestions
4. **AG-UI Event Integration**: Comprehensive event emission patterns

### LLM Prompting Strategy

The skill implements a refined prompting strategy focusing on the four foundational relational properties:

```javascript
const promptTemplate = `
TASK: Generate foundational property updates for this Bimba node based on the document content, strictly prioritizing the four core relational properties from the Notion crystallisation framework.

**🎯 FOUNDATIONAL PRIORITY: The Four Core Relational Properties**

These FOUR properties are the foundational layer and MUST be prioritized above all others:

1. **qlOperators** (Rich Text) - ESSENTIAL FOUNDATION
   - Identify and structure the quaternary logic operators present in the document
   - Format as structured text describing the QL operational patterns
   - Focus on how the document reveals specific QL operational dynamics

2. **epistemicEssence** (Rich Text) - ESSENTIAL FOUNDATION
   - Extract deep insights about the epistemic nature revealed by the document
   - Focus on knowledge structures, truth patterns, and cognitive architectures
   - Capture the essential knowing patterns embedded in the content

3. **archetypalAnchors** (Rich Text) - ESSENTIAL FOUNDATION
   - Identify archetypal patterns and symbolic anchors for manual page creation
   - Focus on universal patterns, symbolic structures, and archetypal resonances
   - Provide structured content suitable for Notion page creation

4. **semanticFramework** (Rich Text) - ESSENTIAL FOUNDATION
   - Derive the semantic framework structure from document analysis
   - Focus on meaning relationships, conceptual hierarchies, and semantic networks
   - Capture how concepts relate within the quaternary logic structure

**CRITICAL REQUIREMENTS**:
1. **FOUNDATIONAL PRIORITY**: The four core relational properties are MANDATORY
2. **Quality over Quantity**: Maximum 6-10 total properties
3. **Document Grounding**: All suggestions must be directly supported by document content
4. **Structured Format**: Format foundational properties as rich text suitable for Notion database integration
`;
```

### Execution Flow with AG-UI

```javascript
async execute(params, context) {
  const startTime = Date.now();

  try {
    // 1. Initialization
    await this.emitAGUIEvent('BimbaAnalysisProgress', {
      stage: 'initialization',
      progress: 5,
      currentStep: 'Initializing Bimba analysis...',
      targetCoordinate: params.bimbaCoordinate
    });

    // 2. Document Processing
    await this.emitAGUIEvent('BimbaAnalysisProgress', {
      stage: 'document_processing',
      progress: 15,
      currentStep: 'Processing uploaded documents...'
    });

    const processedDocuments = await this.processDocuments(params.documents);

    // 3. LLM Analysis
    await this.emitAGUIEvent('BimbaAnalysisProgress', {
      stage: 'llm_analysis',
      progress: 30,
      currentStep: 'Analyzing content with LLM...'
    });

    const llmSuggestions = await this.generateLLMSuggestions(processedDocuments, params);

    // 4. Relationship Analysis
    await this.emitAGUIEvent('BimbaAnalysisProgress', {
      stage: 'relationship_analysis',
      progress: 60,
      currentStep: 'Generating relationship suggestions...'
    });

    const relationshipSuggestions = await this.generateRelationshipSuggestions(params);

    // 5. Result Formatting
    await this.emitAGUIEvent('BimbaAnalysisProgress', {
      stage: 'result_formatting',
      progress: 85,
      currentStep: 'Formatting suggestions...'
    });

    const formattedResults = this.formatResults(llmSuggestions, relationshipSuggestions);

    // 6. Final Results
    await this.emitAGUIEvent('BimbaUpdateSuggestions', {
      propertyUpdates: formattedResults.propertyUpdates,
      relationshipSuggestions: formattedResults.relationshipSuggestions,
      targetCoordinate: params.bimbaCoordinate,
      reasoning: formattedResults.reasoning,
      qlAlignment: formattedResults.qlAlignment
    });

    await this.emitAGUIEvent('BimbaAnalysisProgress', {
      stage: 'completed',
      progress: 100,
      currentStep: 'Analysis completed successfully!'
    });

    return formattedResults;

  } catch (error) {
    await this.emitAGUIEvent('RunError', {
      message: error.message,
      targetCoordinate: params.bimbaCoordinate,
      stage: 'error'
    });
    throw error;
  }
}
```

## Event Broadcasting Standards

### Event Naming Conventions
- Use descriptive, action-oriented names
- Include component/skill context
- Follow pattern: `{Context}{Action}` (e.g., 'BimbaUpdateSuggestions')

### Required Event Fields
```javascript
{
  // Core fields (always required)
  type: 'EventType',
  timestamp: new Date().toISOString(),

  // Context fields (when applicable)
  targetCoordinate: '#1-2-3',
  skillId: 'skill-identifier',

  // Data payload
  data: {
    // Event-specific data
  },

  // Optional metadata
  metadata: {
    executionContext: {},
    performance: {},
    debugging: {}
  }
}
```

### Progress Event Standards
```javascript
{
  type: 'SkillProgress',
  stage: 'current_stage_name',
  progress: 45, // 0-100
  currentStep: 'Human-readable description',
  targetCoordinate: '#1-2-3',
  metadata: {
    estimatedTimeRemaining: 30000, // milliseconds
    stageDetails: {
      totalStages: 5,
      currentStage: 2
    }
  }
}
```

## Error Handling and Recovery

### Error Event Emission
```javascript
try {
  // Skill execution
} catch (error) {
  await this.emitAGUIEvent('RunError', {
    skillId: this.id,
    error: {
      message: error.message,
      type: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    targetCoordinate: params.targetCoordinate,
    stage: currentStage,
    recoverable: this.isRecoverableError(error),
    suggestedAction: this.getSuggestedRecoveryAction(error)
  });

  // Attempt recovery if possible
  if (this.isRecoverableError(error)) {
    return await this.attemptRecovery(params, context, error);
  }

  throw error;
}
```

### Graceful Degradation
```javascript
async executeWithFallback(params, context) {
  try {
    // Attempt AG-UI enabled execution
    return await this.executeWithAGUI(params, context);
  } catch (aguiError) {
    console.warn('AG-UI execution failed, falling back to standard execution:', aguiError);

    // Emit fallback notification
    await this.emitAGUIEvent('FallbackMode', {
      reason: 'AG-UI execution failed',
      fallbackMethod: 'standard_execution'
    });

    // Execute without AG-UI features
    return await this.executeStandard(params, context);
  }
}
```

## Performance Optimization

### Event Batching
```javascript
class EventBatcher {
  constructor(batchSize = 10, flushInterval = 1000) {
    this.batch = [];
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.timer = null;
  }

  addEvent(event) {
    this.batch.push(event);

    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush() {
    if (this.batch.length > 0) {
      this.emitBatchedEvents(this.batch);
      this.batch = [];
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
```

### Rate Limiting
```javascript
class RateLimitedEmitter {
  constructor(maxEventsPerSecond = 10) {
    this.maxEvents = maxEventsPerSecond;
    this.eventTimes = [];
  }

  async emitWithRateLimit(eventType, data) {
    const now = Date.now();

    // Remove events older than 1 second
    this.eventTimes = this.eventTimes.filter(time => now - time < 1000);

    if (this.eventTimes.length >= this.maxEvents) {
      // Rate limit exceeded, queue or drop event
      console.warn(`Rate limit exceeded for ${eventType}, queuing event`);
      await this.queueEvent(eventType, data);
      return;
    }

    this.eventTimes.push(now);
    await this.emitAGUIEvent(eventType, data);
  }
}
```

## Testing AG-UI Skills

### Unit Testing
```javascript
describe('MyAGUISkill', () => {
  let skill;
  let mockEmitAGUIEvent;

  beforeEach(() => {
    skill = new MyAGUISkill();
    mockEmitAGUIEvent = jest.fn();
    skill.emitAGUIEvent = mockEmitAGUIEvent;
  });

  test('should emit progress events during execution', async () => {
    const params = { targetCoordinate: '#1-2-3' };

    await skill.execute(params, {});

    // Verify progress events were emitted
    expect(mockEmitAGUIEvent).toHaveBeenCalledWith('MySkillProgress',
      expect.objectContaining({
        stage: 'initialization',
        progress: expect.any(Number)
      })
    );
  });

  test('should emit error events on failure', async () => {
    const params = { targetCoordinate: '#1-2-3' };

    // Mock a failure
    skill.performWork = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(skill.execute(params, {})).rejects.toThrow('Test error');

    expect(mockEmitAGUIEvent).toHaveBeenCalledWith('RunError',
      expect.objectContaining({
        error: expect.stringContaining('Test error')
      })
    );
  });
});
```

### Integration Testing
```javascript
describe('AG-UI Integration', () => {
  test('should broadcast events to connected clients', async () => {
    const mockClient = new MockWebSocketClient();
    await mockClient.connect('ws://localhost:3033');

    const skill = new MyAGUISkill();
    await skill.execute({ targetCoordinate: '#1-2-3' }, {});

    // Verify client received events
    expect(mockClient.receivedEvents).toContainEqual(
      expect.objectContaining({
        type: 'MySkillProgress'
      })
    );
  });
});
```

## Best Practices

### 1. Event Design
- Keep event payloads focused and minimal
- Use consistent data structures across similar events
- Include sufficient context for frontend processing
- Avoid sensitive data in event payloads

### 2. Progress Reporting
- Report progress at meaningful intervals (not too frequent)
- Use descriptive stage names and current step messages
- Include estimated time remaining when possible
- Provide actionable feedback to users

### 3. Error Handling
- Emit specific error events with recovery suggestions
- Include debugging information in development mode
- Implement graceful degradation for AG-UI failures
- Log errors comprehensively for debugging

### 4. Performance
- Batch rapid events to avoid overwhelming clients
- Implement rate limiting for high-frequency events
- Use efficient data serialization
- Monitor event emission performance

### 5. Debugging
- Include comprehensive metadata in events
- Use consistent logging patterns
- Implement event tracing for complex workflows
- Provide debugging tools for event monitoring
