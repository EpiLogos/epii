# LangSmith Tracing in the Epii Pipeline

This document explains the LangSmith tracing implementation in the Epii Pipeline and recent improvements.

## Overview

LangSmith tracing is used to monitor and debug the execution of the Epii Pipeline. It provides visibility into:

- Pipeline stages
- LLM calls
- Tool calls
- Chain executions
- Errors and their context

## Tracing Functions

The `langsmith-tracing.mjs` service provides the following functions:

### 1. `createStageRunTree(stageName, inputs, projectName)`

Creates a top-level run tree for a pipeline stage.

```javascript
const stageRun = langsmithTracing.createStageRunTree(
  "Stage -2: Relate Concepts & Identify Variations",
  {
    numChunks: documentChunks.length,
    targetCoordinate: sourceMetadata.targetCoordinate,
    sourceFileName: sourceMetadata.sourceFileName
  }
);
```

### 2. `createChildRun(parentRun, name, inputs, runType = "chain")`

Creates a child run of any type (chain, llm, tool). This is a convenience function that delegates to the appropriate specific function.

```javascript
const batchRun = langsmithTracing.createChildRun(
  stageRun,
  `Batch ${batchIndex + 1}`,
  {
    batchIndex,
    batchSize: currentBatchSize,
    chunkRange: `${batchStart + 1}-${batchEnd}`
  }
);
```

### 3. `createLLMRun(parentRun, name, inputs)`

Creates a child run specifically for LLM calls.

```javascript
const llmRun = langsmithTracing.createLLMRun(
  stageRun,
  "Generate Analysis",
  {
    prompt: prompt.substring(0, 100) + "..."
  }
);
```

### 4. `createToolRun(parentRun, name, inputs)`

Creates a child run specifically for tool calls.

```javascript
const toolRun = langsmithTracing.createToolRun(
  stageRun,
  "Fetch Document",
  {
    documentId: documentId
  }
);
```

### 5. `createChainRun(parentRun, name, inputs)`

Creates a child run specifically for chain executions.

```javascript
const chainRun = langsmithTracing.createChainRun(
  stageRun,
  "Process Chunks",
  {
    numChunks: chunks.length
  }
);
```

### 6. `endRunSuccess(run, outputs)`

Ends a run with success status and outputs.

```javascript
langsmithTracing.endRunSuccess(llmRun, {
  response: response.substring(0, 100) + "..."
});
```

### 7. `endRunError(run, error)`

Ends a run with error status.

```javascript
langsmithTracing.endRunError(llmRun, error);
```

## Error Handling

All tracing functions include robust error handling to prevent tracing issues from breaking the pipeline:

```javascript
try {
  // Tracing code
} catch (tracingError) {
  console.warn(`LangSmith tracing error: ${tracingError.message}`);
  // Return a mock object that won't break the pipeline
  return {
    end: () => {},
    patch: () => {}
  };
}
```

## Recent Improvements

1. **Added `createChildRun` function**: This convenience function delegates to the appropriate specific function based on the run type, simplifying the code in the pipeline stages.

2. **Fixed duplicate variable declarations**: Removed duplicate declarations of `batchRun` in stage_minus2.mjs that were causing syntax errors.

3. **Improved error handling**: Enhanced error handling in all tracing functions to prevent tracing issues from breaking the pipeline.

4. **Added compatibility with different LangSmith versions**: The code now checks for both `createChild` and `create_child` methods to support different versions of the LangSmith library.

## Best Practices

1. **Always use try-catch blocks**: Wrap all tracing code in try-catch blocks to prevent tracing issues from breaking the pipeline.

2. **Use the appropriate function**: Use the specific function for the type of run you're creating (LLM, tool, chain).

3. **Always end runs**: Make sure to call `endRunSuccess` or `endRunError` for every run you create.

4. **Include relevant inputs and outputs**: Include relevant inputs and outputs in the run to make debugging easier.

5. **Use descriptive names**: Use descriptive names for runs to make it easier to understand the pipeline execution.

## Example Usage

```javascript
// Create a stage run
let stageRun;
try {
  stageRun = langsmithTracing.createStageRunTree(
    "Stage -2: Relate Concepts & Identify Variations",
    {
      numChunks: documentChunks.length,
      targetCoordinate: sourceMetadata.targetCoordinate
    }
  );
} catch (tracingError) {
  console.warn(`LangSmith tracing error: ${tracingError.message}`);
  // Create a mock stageRun that won't break the pipeline
  stageRun = {
    create_child: () => ({ end: () => {}, patch: () => {} }),
    end: () => {},
    patch: () => {}
  };
}

// Create a child run
let batchRun;
try {
  batchRun = langsmithTracing.createChildRun(
    stageRun,
    `Batch ${batchIndex + 1}`,
    {
      batchIndex,
      batchSize: currentBatchSize
    }
  );
} catch (tracingError) {
  console.warn(`LangSmith tracing error: ${tracingError.message}`);
  // Create a mock run that won't break the pipeline
  batchRun = {
    end: () => {},
    patch: () => {}
  };
}

// End the run with success
try {
  langsmithTracing.endRunSuccess(batchRun, {
    result: "Success"
  });
} catch (tracingError) {
  console.warn(`LangSmith tracing error: ${tracingError.message}`);
}
```
