/**
 * LangSmith Tracing Service for the Epii Pipeline
 *
 * This module provides utilities for creating and managing run trees
 * to trace the execution of the Epii pipeline in LangSmith.
 */

import { Client } from "langsmith";
import { RunTree } from "langsmith/run_trees";
import { traceable } from "langsmith/traceable";

// Initialize LangSmith client
const langsmithClient = new Client();

/**
 * Creates a run tree for a pipeline stage
 *
 * @param {string} stageName - The name of the stage
 * @param {object} inputs - The inputs to the stage
 * @param {string} [projectName] - Optional project name
 * @returns {RunTree} - The created run tree
 */
export function createStageRunTree(stageName, inputs, projectName = process.env.LANGSMITH_PROJECT) {
  try {
    const runTree = new RunTree({
      name: stageName,
      run_type: "chain",
      inputs,
      project_name: projectName
    });

    // Check if postRun method exists before calling it
    if (typeof runTree.postRun === 'function') {
      runTree.postRun();
    } else if (typeof runTree.post === 'function') {
      // Fallback for older versions
      runTree.post();
    }

    return runTree;
  } catch (error) {
    console.warn(`LangSmith tracing error in createStageRunTree: ${error.message}`);
    // Return a mock runTree object that won't break the pipeline
    return {
      createChild: () => ({ end: () => {}, patchRun: () => {} }),
      create_child: () => ({ end: () => {}, patch: () => {} }),
      end: () => {},
      patchRun: () => {},
      patch: () => {}
    };
  }
}

/**
 * Creates a child run for an LLM call
 *
 * @param {RunTree} parentRun - The parent run tree
 * @param {string} name - The name of the LLM call
 * @param {object} inputs - The inputs to the LLM
 * @returns {RunTree} - The created child run
 */
export function createLLMRun(parentRun, name, inputs) {
  try {
    // Check which method is available (createChild for newer versions, create_child for older)
    let llmRun;
    if (typeof parentRun.createChild === 'function') {
      llmRun = parentRun.createChild({
        name,
        run_type: "llm",
        inputs
      });
    } else if (typeof parentRun.create_child === 'function') {
      llmRun = parentRun.create_child({
        name,
        run_type: "llm",
        inputs
      });
    } else {
      throw new Error('No createChild or create_child method available on parentRun');
    }

    // Check which post method is available
    if (typeof llmRun.postRun === 'function') {
      llmRun.postRun();
    } else if (typeof llmRun.post === 'function') {
      llmRun.post();
    }

    return llmRun;
  } catch (error) {
    console.warn(`LangSmith tracing error in createLLMRun: ${error.message}`);
    // Return a mock run object that won't break the pipeline
    return {
      end: () => {},
      patchRun: () => {},
      patch: () => {}
    };
  }
}

/**
 * Creates a child run for a tool call
 *
 * @param {RunTree} parentRun - The parent run tree
 * @param {string} name - The name of the tool
 * @param {object} inputs - The inputs to the tool
 * @returns {RunTree} - The created child run
 */
export function createToolRun(parentRun, name, inputs) {
  try {
    // Check which method is available (createChild for newer versions, create_child for older)
    let toolRun;
    if (typeof parentRun.createChild === 'function') {
      toolRun = parentRun.createChild({
        name,
        run_type: "tool",
        inputs
      });
    } else if (typeof parentRun.create_child === 'function') {
      toolRun = parentRun.create_child({
        name,
        run_type: "tool",
        inputs
      });
    } else {
      throw new Error('No createChild or create_child method available on parentRun');
    }

    // Check which post method is available
    if (typeof toolRun.postRun === 'function') {
      toolRun.postRun();
    } else if (typeof toolRun.post === 'function') {
      toolRun.post();
    }

    return toolRun;
  } catch (error) {
    console.warn(`LangSmith tracing error in createToolRun: ${error.message}`);
    // Return a mock run object that won't break the pipeline
    return {
      end: () => {},
      patchRun: () => {},
      patch: () => {}
    };
  }
}

/**
 * Creates a child run for a chain
 *
 * @param {RunTree} parentRun - The parent run tree
 * @param {string} name - The name of the chain
 * @param {object} inputs - The inputs to the chain
 * @returns {RunTree} - The created child run
 */
export function createChainRun(parentRun, name, inputs) {
  try {
    // Check which method is available (createChild for newer versions, create_child for older)
    let chainRun;
    if (typeof parentRun.createChild === 'function') {
      chainRun = parentRun.createChild({
        name,
        run_type: "chain",
        inputs
      });
    } else if (typeof parentRun.create_child === 'function') {
      chainRun = parentRun.create_child({
        name,
        run_type: "chain",
        inputs
      });
    } else {
      throw new Error('No createChild or create_child method available on parentRun');
    }

    // Check which post method is available
    if (typeof chainRun.postRun === 'function') {
      chainRun.postRun();
    } else if (typeof chainRun.post === 'function') {
      chainRun.post();
    }

    return chainRun;
  } catch (error) {
    console.warn(`LangSmith tracing error in createChainRun: ${error.message}`);
    // Return a mock run object that won't break the pipeline
    return {
      end: () => {},
      patchRun: () => {},
      patch: () => {}
    };
  }
}

/**
 * Wraps a function with LangSmith tracing
 *
 * @param {string} name - The name of the function
 * @param {string} runType - The type of run (chain, llm, tool)
 * @param {Function} func - The function to wrap
 * @returns {Function} - The wrapped function
 */
export function traceableFunction(name, runType, func) {
  return traceable({
    name,
    run_type: runType
  })(func);
}

/**
 * Ends a run with success
 *
 * @param {RunTree} run - The run to end
 * @param {object} outputs - The outputs of the run
 */
export function endRunSuccess(run, outputs) {
  try {
    if (run) {
      // End the run
      if (typeof run.end === 'function') {
        run.end({
          outputs
        });
      }

      // Patch the run
      if (typeof run.patchRun === 'function') {
        run.patchRun();
      } else if (typeof run.patch === 'function') {
        run.patch();
      }
    }
  } catch (error) {
    console.warn(`LangSmith tracing error in endRunSuccess: ${error.message}`);
  }
}

/**
 * Ends a run with error
 *
 * @param {RunTree} run - The run to end
 * @param {Error|string} error - The error that occurred
 */
export function endRunError(run, error) {
  try {
    if (run) {
      const errorMessage = error instanceof Error ? error.message : error;

      // End the run
      if (typeof run.end === 'function') {
        run.end({
          error: errorMessage
        });
      }

      // Patch the run
      if (typeof run.patchRun === 'function') {
        run.patchRun();
      } else if (typeof run.patch === 'function') {
        run.patch();
      }
    }
  } catch (traceError) {
    console.warn(`LangSmith tracing error in endRunError: ${traceError.message}`);
  }
}

/**
 * Creates a child run (generic function that can be used for any run type)
 * This is a convenience function that delegates to the appropriate specific function
 *
 * @param {RunTree} parentRun - The parent run tree
 * @param {string} name - The name of the run
 * @param {object} inputs - The inputs to the run
 * @param {string} [runType="chain"] - The type of run (chain, llm, tool)
 * @returns {RunTree} - The created child run
 */
export function createChildRun(parentRun, name, inputs, runType = "chain") {
  // Delegate to the appropriate specific function based on runType
  switch (runType.toLowerCase()) {
    case "llm":
      return createLLMRun(parentRun, name, inputs);
    case "tool":
      return createToolRun(parentRun, name, inputs);
    case "chain":
    default:
      return createChainRun(parentRun, name, inputs);
  }
}

export default {
  langsmithClient,
  createStageRunTree,
  createLLMRun,
  createToolRun,
  createChainRun,
  createChildRun, // Add the new function to the default export
  traceableFunction,
  endRunSuccess,
  endRunError
};
