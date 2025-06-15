# LangSmith Integration for Epii Pipeline

This document describes the LangSmith integration for the Epii Pipeline, which provides tracing, evaluation, and debugging capabilities for LLM calls.

## Overview

LangSmith is a platform for debugging, testing, evaluating, and monitoring LLM applications. The Epii Pipeline uses LangSmith to:

1. **Trace LLM Calls**: Track all LLM calls in the pipeline, including inputs, outputs, and metadata
2. **Evaluate Outputs**: Automatically evaluate the quality of LLM outputs, particularly JSON parsing success
3. **Debug Issues**: Identify and debug issues with LLM responses
4. **Compare Models**: Compare different models (Flash vs Pro) to find the optimal cost/performance balance
5. **Optimize Prompts**: Iterate on prompts and see the impact on success rates in real-time

## Architecture

The LangSmith integration consists of the following components:

1. **LangSmith Tracing Service**: `services/langsmith-tracing.mjs`
   - Creates run trees for pipeline stages
   - Provides utilities for creating child runs for LLM calls, tool calls, and chains
   - Handles run success and error states

2. **LangSmith Evaluators**: `services/langsmith-evaluators.mjs`
   - Evaluates JSON parsing success
   - Evaluates coordinate assignment quality
   - Provides custom evaluation metrics

3. **LLM Service Integration**: `services/epii-llm.service.mjs`
   - Wraps LLM calls with LangSmith tracing
   - Provides options for parent runs to create run trees

4. **Pipeline Integration**: `pipelines/epii_analysis_pipeline.mjs`
   - Creates run trees for each pipeline stage
   - Creates child runs for chunk processing, tagging, and analysis
   - Evaluates LLM outputs automatically

## Run Tree Structure

The LangSmith integration creates a hierarchical run tree for the Epii Pipeline:

```
Stage -2: Relate Concepts & Identify Variations
├── Get Metalogikon Template
├── Process Chunk 1/33
│   ├── Assign Bimba Coordinates
│   └── Analyze Chunk
├── Process Chunk 2/33
│   ├── Assign Bimba Coordinates
│   └── Analyze Chunk
└── ...
```

Each run contains:
- **Inputs**: The inputs to the run (e.g., chunk text, assigned coordinates)
- **Outputs**: The outputs of the run (e.g., analysis results)
- **Metadata**: Additional metadata about the run (e.g., model used, temperature)
- **Evaluations**: Automatic evaluations of the run (e.g., JSON parsing success)

## Automatic Evaluations

The LangSmith integration automatically evaluates:

1. **JSON Parsing Success**: Evaluates whether the LLM output can be parsed as valid JSON with the expected structure
   - **CORRECT**: Successfully parsed as valid JSON with complete expected structure
   - **PARTIAL**: Parsed as valid JSON but missing some expected properties
   - **INCORRECT**: Failed to parse as valid JSON

2. **Coordinate Assignment Quality**: Evaluates whether the assigned coordinates are relevant to the target coordinate
   - **CORRECT**: Assigned coordinates are highly relevant to the target coordinate
   - **PARTIAL**: Some assigned coordinates are relevant to the target coordinate
   - **INCORRECT**: No assigned coordinates are relevant to the target coordinate

## Usage

To use the LangSmith integration:

1. Set the following environment variables in `.env`:
   ```
   LANGSMITH_TRACING=true
   LANGSMITH_API_KEY=your_api_key_here
   LANGSMITH_PROJECT=epii_pipeline
   ```

2. Run the Epii Pipeline as usual:
   ```bash
   curl -X POST http://localhost:3001/api/epii-agent/analyze \
     -H "Content-Type: application/json" \
     -d '{
       "targetCoordinate": "#5-2-1",
       "fileId": "your_file_id"
     }'
   ```

3. View the traces in the LangSmith UI:
   - Go to [LangSmith](https://smith.langchain.com/)
   - Navigate to the `epii_pipeline` project
   - View the traces for the pipeline runs

## Benefits

The LangSmith integration provides several benefits:

1. **Improved Debugging**: Easily identify and debug issues with LLM responses
2. **Better Prompt Engineering**: Iterate on prompts and see the impact on success rates
3. **Model Optimization**: Compare different models to find the optimal cost/performance balance
4. **Quality Metrics**: Track the quality of LLM outputs over time
5. **Transparency**: Understand how the pipeline is processing data

## Future Improvements

Potential future improvements to the LangSmith integration:

1. **Custom Datasets**: Create datasets for systematic testing of the pipeline
2. **Human Feedback**: Incorporate human feedback into the evaluation process
3. **A/B Testing**: Systematically test different prompts and models
4. **Continuous Monitoring**: Set up alerts for pipeline issues
5. **Integration with CI/CD**: Automatically test pipeline changes
