/**
 * LangSmith Evaluators for the Epii Pipeline
 *
 * This module provides custom evaluators for assessing the quality of LLM outputs
 * in the Epii pipeline, particularly focusing on JSON parsing success and
 * coordinate assignment quality.
 */

import { Client } from "langsmith";

// Initialize LangSmith client
const langsmithClient = new Client();

// Create a mock evaluation function if the real one doesn't exist
if (!langsmithClient.createEvaluation) {
  langsmithClient.createEvaluation = async (evalData) => {
    console.log(`MOCK EVALUATION: ${evalData.evaluation_name} - ${evalData.value} (${evalData.score})`);
    console.log(`Comment: ${evalData.comment}`);
    return {
      id: "mock-eval-" + Math.random().toString(36).substring(2, 9),
      ...evalData
    };
  };
}

/**
 * Evaluates JSON parsing success
 *
 * @param {string} runId - The LangSmith run ID to evaluate
 * @param {object} runOutput - The output from the LLM
 * @returns {Promise<object>} - The evaluation result
 */
export async function evaluateJsonParsing(runId, runOutput) {
  try {
    // For string outputs, try to parse as JSON
    let parsed;
    let outputToEvaluate = runOutput;

    if (typeof outputToEvaluate === 'string') {
      // Try to extract JSON from code block if present
      const jsonMatch = outputToEvaluate.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        outputToEvaluate = jsonMatch[1].trim();
      }

      try {
        parsed = JSON.parse(outputToEvaluate);
      } catch (parseError) {
        // If direct parsing fails, try to extract JSON object with regex
        const objectMatch = outputToEvaluate.match(/{[\s\S]*"mappings"[\s\S]*"variations"[\s\S]*}/m);
        if (objectMatch) {
          try {
            parsed = JSON.parse(objectMatch[0].trim());
          } catch (objectParseError) {
            // Failed to parse even with regex extraction
            return await langsmithClient.createEvaluation({
              run_id: runId,
              evaluation_name: "JSON Parsing Success",
              value: "INCORRECT",
              score: 0.0,
              comment: `Failed to parse as JSON: ${parseError.message}`
            });
          }
        } else {
          // No JSON object found
          return await langsmithClient.createEvaluation({
            run_id: runId,
            evaluation_name: "JSON Parsing Success",
            value: "INCORRECT",
            score: 0.0,
            comment: "No valid JSON structure found in output"
          });
        }
      }
    } else if (typeof outputToEvaluate === 'object') {
      // Already an object, use as is
      parsed = outputToEvaluate;
    } else {
      // Not a string or object
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "JSON Parsing Success",
        value: "INCORRECT",
        score: 0.0,
        comment: `Output is not a string or object: ${typeof outputToEvaluate}`
      });
    }

    // Check if it has the expected structure
    if (parsed &&
        parsed.mappings && Array.isArray(parsed.mappings) &&
        parsed.variations && Array.isArray(parsed.variations)) {

      // Check if mappings have the expected properties
      const validMappings = parsed.mappings.every(mapping =>
        mapping.mappingType &&
        mapping.mappingValue &&
        typeof mapping.confidenceScore === 'number' &&
        mapping.status &&
        mapping.reasoning
      );

      // Check if variations have the expected properties
      const validVariations = parsed.variations.every(variation =>
        variation.variationType &&
        variation.variationText &&
        variation.status
      );

      if (validMappings && validVariations) {
        return await langsmithClient.createEvaluation({
          run_id: runId,
          evaluation_name: "JSON Parsing Success",
          value: "CORRECT",
          score: 1.0,
          comment: "Successfully parsed as valid JSON with complete expected structure"
        });
      } else {
        return await langsmithClient.createEvaluation({
          run_id: runId,
          evaluation_name: "JSON Parsing Success",
          value: "PARTIAL",
          score: 0.7,
          comment: "Parsed as valid JSON with expected structure but some properties are missing"
        });
      }
    } else if (parsed) {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "JSON Parsing Success",
        value: "PARTIAL",
        score: 0.5,
        comment: "Parsed as valid JSON but missing expected structure"
      });
    } else {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "JSON Parsing Success",
        value: "INCORRECT",
        score: 0.0,
        comment: "Failed to parse as valid JSON"
      });
    }
  } catch (error) {
    console.error("Error in evaluateJsonParsing:", error);
    return await langsmithClient.createEvaluation({
      run_id: runId,
      evaluation_name: "JSON Parsing Success",
      value: "ERROR",
      score: 0.0,
      comment: `Evaluation error: ${error.message}`
    });
  }
}

/**
 * Evaluates coordinate assignment quality
 *
 * @param {string} runId - The LangSmith run ID to evaluate
 * @param {object} runInput - The input to the LLM
 * @param {object} runOutput - The output from the LLM
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @returns {Promise<object>} - The evaluation result
 */
export async function evaluateCoordinateAssignment(runId, runInput, runOutput, targetCoordinate) {
  try {
    // Extract assigned coordinates from the output
    let assignedCoords = [];

    if (typeof runOutput === 'string') {
      // Try to extract JSON array from the output
      const jsonMatch = runOutput.match(/\[[\s\S]*\]/m);
      if (jsonMatch) {
        try {
          assignedCoords = JSON.parse(jsonMatch[0].trim());
        } catch (parseError) {
          // Failed to parse as JSON array
          return await langsmithClient.createEvaluation({
            run_id: runId,
            evaluation_name: "Coordinate Assignment Quality",
            value: "INCORRECT",
            score: 0.0,
            comment: `Failed to parse coordinates: ${parseError.message}`
          });
        }
      } else {
        // Try to extract coordinates using regex
        const coordMatches = runOutput.match(/#[0-5](?:-[0-5]){0,2}/g);
        if (coordMatches) {
          assignedCoords = coordMatches;
        } else {
          // No coordinates found
          return await langsmithClient.createEvaluation({
            run_id: runId,
            evaluation_name: "Coordinate Assignment Quality",
            value: "INCORRECT",
            score: 0.0,
            comment: "No valid coordinates found in output"
          });
        }
      }
    } else if (Array.isArray(runOutput)) {
      // Already an array, use as is
      assignedCoords = runOutput;
    } else {
      // Not a string or array
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "Coordinate Assignment Quality",
        value: "INCORRECT",
        score: 0.0,
        comment: `Output is not a string or array: ${typeof runOutput}`
      });
    }

    // Check if assigned coordinates are valid
    const validCoords = assignedCoords.every(coord =>
      typeof coord === 'string' &&
      /^#[0-5](?:-[0-5]){0,2}$/.test(coord)
    );

    if (!validCoords) {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "Coordinate Assignment Quality",
        value: "INCORRECT",
        score: 0.0,
        comment: "Invalid coordinate format"
      });
    }

    // Check if assigned coordinates are related to the target coordinate
    const targetParts = targetCoordinate.split('-');
    const relatedCoords = assignedCoords.filter(coord => {
      const coordParts = coord.replace('#', '').split('-');
      // Check if the first part matches
      return coordParts[0] === targetParts[0];
    });

    const relatedRatio = relatedCoords.length / assignedCoords.length;

    if (relatedRatio >= 0.8) {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "Coordinate Assignment Quality",
        value: "CORRECT",
        score: 1.0,
        comment: "Assigned coordinates are highly relevant to the target coordinate"
      });
    } else if (relatedRatio >= 0.5) {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "Coordinate Assignment Quality",
        value: "PARTIAL",
        score: 0.7,
        comment: "Most assigned coordinates are relevant to the target coordinate"
      });
    } else if (relatedRatio > 0) {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "Coordinate Assignment Quality",
        value: "PARTIAL",
        score: 0.4,
        comment: "Some assigned coordinates are relevant to the target coordinate"
      });
    } else {
      return await langsmithClient.createEvaluation({
        run_id: runId,
        evaluation_name: "Coordinate Assignment Quality",
        value: "INCORRECT",
        score: 0.0,
        comment: "No assigned coordinates are relevant to the target coordinate"
      });
    }
  } catch (error) {
    console.error("Error in evaluateCoordinateAssignment:", error);
    return await langsmithClient.createEvaluation({
      run_id: runId,
      evaluation_name: "Coordinate Assignment Quality",
      value: "ERROR",
      score: 0.0,
      comment: `Evaluation error: ${error.message}`
    });
  }
}

export default {
  evaluateJsonParsing,
  evaluateCoordinateAssignment,
  langsmithClient
};
