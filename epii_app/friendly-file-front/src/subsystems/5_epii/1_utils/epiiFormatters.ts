/**
 * Formatting utilities for Epii mode
 * Bimba Coordinate: #5-3-4.5-1
 */

import { AnalysisResults, AnalysisMapping, AnalysisVariation } from '../0_foundation/epiiTypes';

/**
 * Format a date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Format analysis results for display
 */
export const formatAnalysisResults = (results: AnalysisResults | null): string => {
  if (!results) return 'No analysis results available';
  
  let formattedResults = '';
  
  if (results.extractedMappings && results.extractedMappings.length > 0) {
    formattedResults += '## Extracted Mappings\n\n';
    results.extractedMappings.forEach((mapping: AnalysisMapping) => {
      formattedResults += `- **${mapping.mappingType}**: ${mapping.mappingValue}\n`;
      if (mapping.reasoning) {
        formattedResults += `  - *Reasoning*: ${mapping.reasoning}\n`;
      }
    });
    formattedResults += '\n';
  }
  
  if (results.identifiedVariations && results.identifiedVariations.length > 0) {
    formattedResults += '## Identified Variations\n\n';
    results.identifiedVariations.forEach((variation: AnalysisVariation) => {
      formattedResults += `- **${variation.variationType}**: ${variation.status}\n`;
      if (variation.variationText) {
        formattedResults += `  - *Text*: ${variation.variationText}\n`;
      }
    });
    formattedResults += '\n';
  }
  
  if (results.overallSummary) {
    formattedResults += '## Overall Summary\n\n';
    formattedResults += results.overallSummary;
  }
  
  return formattedResults;
};

/**
 * Format code with syntax highlighting
 */
export const formatCode = (code: string, language: string = 'text'): string => {
  // This is a placeholder - in a real implementation, you would use a syntax highlighting library
  return `\`\`\`${language}\n${code}\n\`\`\``;
};

/**
 * Format Bimba coordinate for display
 */
export const formatBimbaCoordinate = (coordinate: string): string => {
  // Add proper formatting for Bimba coordinates
  if (!coordinate.startsWith('#')) {
    return `#${coordinate}`;
  }
  return coordinate;
};
