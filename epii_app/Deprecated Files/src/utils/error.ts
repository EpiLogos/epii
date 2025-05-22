import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

/**
 * Error types
 */
export enum ErrorType {
  ValidationError = 'ValidationError',
  DatabaseError = 'DatabaseError',
  NotFoundError = 'NotFoundError',
  AuthenticationError = 'AuthenticationError',
  AuthorizationError = 'AuthorizationError',
  InternalError = 'InternalError',
}

/**
 * Custom error class
 */
export class AppError extends Error {
  type: ErrorType;
  
  constructor(type: ErrorType, message: string) {
    super(message);
    this.type = type;
    this.name = 'AppError';
  }
  
  /**
   * Convert to MCP error
   */
  toMcpError(): McpError {
    switch (this.type) {
      case ErrorType.ValidationError:
        return new McpError(ErrorCode.InvalidParams, this.message);
      case ErrorType.NotFoundError:
        return new McpError(ErrorCode.NotFound, this.message);
      case ErrorType.AuthenticationError:
        return new McpError(ErrorCode.Unauthorized, this.message);
      case ErrorType.AuthorizationError:
        return new McpError(ErrorCode.Forbidden, this.message);
      default:
        return new McpError(ErrorCode.InternalError, this.message);
    }
  }
}

/**
 * Handle errors in a consistent way
 * @param error Error to handle
 * @param toolName Name of the tool that threw the error
 * @returns McpError
 */
export function handleError(error: any, toolName: string): McpError {
  console.error(`Error in ${toolName}:`, error);
  
  if (error instanceof McpError) {
    return error;
  }
  
  if (error instanceof AppError) {
    return error.toMcpError();
  }
  
  if (error.name === 'ZodError') {
    return new McpError(
      ErrorCode.InvalidParams, 
      `Invalid arguments for tool ${toolName}: ${error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
    );
  }
  
  return new McpError(
    ErrorCode.InternalError, 
    `Failed to execute tool ${toolName}: ${error.message || 'Unknown error'}`
  );
}
