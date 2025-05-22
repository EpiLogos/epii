/**
 * Helper functions for Epii mode
 * Bimba Coordinate: #5-3-4.5-1
 */

import { Document, AnalysisSession } from '../0_foundation/epiiTypes';

/**
 * Detect file type from content
 */
export const detectFileType = (content: string): string => {
  // Check for common file signatures
  if (content.trim().startsWith('<!DOCTYPE html>') || content.trim().startsWith('<html')) {
    return 'html';
  }

  if (content.includes('function') || content.includes('const ') || content.includes('let ') || content.includes('var ')) {
    if (content.includes('import React') || content.includes('from "react"') || content.includes('from \'react\'')) {
      return 'jsx';
    }
    if (content.includes('interface ') || content.includes('type ') || content.includes(': string') || content.includes(': number')) {
      return 'typescript';
    }
    return 'javascript';
  }

  if (content.includes('class ') && content.includes('def ')) {
    return 'python';
  }

  if (content.includes('#include') && (content.includes('<stdio.h>') || content.includes('<iostream>'))) {
    return 'cpp';
  }

  if (content.startsWith('# ') || content.includes('\n# ') || content.includes('**') || content.includes('__')) {
    return 'markdown';
  }

  return 'text';
};

/**
 * Extract file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  if (parts.length === 1) return '';
  return parts[parts.length - 1].toLowerCase();
};

/**
 * Map file extension to language for syntax highlighting
 */
export const mapExtensionToLanguage = (extension: string): string => {
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'cpp',
    'java': 'java',
    'rb': 'ruby',
    'php': 'php',
    'go': 'go',
    'rs': 'rust',
    'sh': 'bash',
    'yml': 'yaml',
    'yaml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
    'txt': 'text'
  };

  return extensionMap[extension] || 'text';
};

/**
 * Get language for syntax highlighting based on filename and content
 */
export const getLanguageForSyntaxHighlighting = (filename: string, content: string): string => {
  const extension = getFileExtension(filename);
  if (extension && extension !== 'txt') {
    return mapExtensionToLanguage(extension);
  }

  return detectFileType(content);
};

/**
 * Validate Bimba coordinate format
 */
export const isValidBimbaCoordinate = (coordinate: string): boolean => {
  // Special case for root coordinate
  if (coordinate === '#') {
    return true;
  }

  // Basic validation for Bimba coordinates
  const pattern = /^#?\d+(-\d+)*(\.\d+)?$/;
  return pattern.test(coordinate);
};

/**
 * Get document status based on analysis sessions
 */
export const getDocumentStatus = (document: Document, sessions: AnalysisSession[]): string => {
  const documentSessions = sessions.filter(s => s.documentId === document.id);

  if (documentSessions.length === 0) {
    return 'Not analyzed';
  }

  const latestSession = documentSessions.sort((a, b) =>
    b.startedAt.getTime() - a.startedAt.getTime()
  )[0];

  return latestSession.status;
};

/**
 * Clean document ID to ensure it's in a format that MongoDB can handle
 * Remove any non-hexadecimal characters and ensure it's 24 characters long
 */
export const cleanDocumentId = (documentId: string): string => {
  if (!documentId || documentId.startsWith('temp-')) {
    return documentId;
  }

  // Remove any non-hexadecimal characters
  const cleanedId = documentId.replace(/[^0-9a-f]/gi, '');

  // Ensure it's exactly 24 characters (MongoDB ObjectId length)
  if (cleanedId.length < 24) {
    return cleanedId.padEnd(24, '0');
  } else if (cleanedId.length > 24) {
    return cleanedId.substring(0, 24);
  }

  return cleanedId;
};
