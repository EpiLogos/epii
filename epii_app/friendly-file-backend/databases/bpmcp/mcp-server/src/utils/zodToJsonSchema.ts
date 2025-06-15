import { z } from "zod";

/**
 * Converts a Zod schema to a JSON Schema object
 * @param zodSchema The Zod schema to convert
 * @param schemaName Optional name for the schema
 * @returns JSON Schema object
 */
export function zodToJsonSchema(zodSchema: z.ZodType<any, any>, schemaName?: string): object {
  if (zodSchema instanceof z.ZodObject) {
    const properties: Record<string, object> = {};
    const required: string[] = [];
    const shape = zodSchema.shape;
    
    for (const key in shape) {
      if (!shape[key].isOptional()) {
        required.push(key);
      }
      properties[key] = zodToJsonSchema(shape[key]);
    }
    
    return {
      type: 'object',
      properties,
      ...(required.length > 0 && { required }),
    };
  } else if (zodSchema instanceof z.ZodString) {
    const description = zodSchema.description;
    return {
      type: 'string',
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodNumber) {
    const description = zodSchema.description;
    return {
      type: 'number',
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodBoolean) {
    const description = zodSchema.description;
    return {
      type: 'boolean',
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodArray) {
    const description = zodSchema.description;
    return {
      type: 'array',
      items: zodToJsonSchema(zodSchema.element),
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodEnum) {
    const description = zodSchema.description;
    return {
      type: 'string',
      enum: zodSchema.options,
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodOptional) {
    return zodToJsonSchema(zodSchema.unwrap());
  } else if (zodSchema instanceof z.ZodDefault) {
    const innerSchema = zodToJsonSchema(zodSchema.removeDefault());
    return {
      ...innerSchema,
      default: zodSchema._def.defaultValue(),
    };
  } else if (zodSchema instanceof z.ZodRecord) {
    const description = zodSchema.description;
    return {
      type: 'object',
      additionalProperties: zodToJsonSchema(zodSchema.valueSchema),
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodUnion) {
    const description = zodSchema.description;
    return {
      oneOf: zodSchema.options.map((option: z.ZodType<any, any>) => zodToJsonSchema(option)),
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodIntersection) {
    const description = zodSchema.description;
    const left = zodToJsonSchema(zodSchema._def.left);
    const right = zodToJsonSchema(zodSchema._def.right);
    
    return {
      allOf: [left, right],
      ...(description && { description }),
    };
  } else if (zodSchema instanceof z.ZodNullable) {
    const innerSchema = zodToJsonSchema(zodSchema.unwrap());
    return {
      oneOf: [innerSchema, { type: 'null' }],
    };
  } else {
    // Fallback for unsupported types
    return { type: 'object' };
  }
}
