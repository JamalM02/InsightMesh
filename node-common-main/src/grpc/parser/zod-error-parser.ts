import { ZodError } from "zod";

interface ParsedZodError {
  details: Record<string, string>;
}

/**
 * Formats a Zod validation error into a structured error message for gRPC responses
 * @param error The ZodError thrown by Zod validation
 * @returns A formatted error object with status code and detailed message
 */
export function parseZodError(error: ZodError): ParsedZodError {
  const errorsMap = error.errors.reduce((acc, issue) => {
    const path = issue.path.join(".");
    acc[path] = issue.message;
    return acc;
  }, {} as Record<string, string>);

  return {
    details: errorsMap,
  };
}
