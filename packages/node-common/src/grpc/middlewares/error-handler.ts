import { CallContext, ServerError, ServerMiddlewareCall } from "nice-grpc";
import { isAbortError } from "abort-controller-x";
import { InvalidArgumentError, UnknownError } from "../specific-errors";
import { ZodError } from "zod";
import { parseZodError } from "../parser";

export async function* errorHandlingMiddleware<Request, Response>(
  call: ServerMiddlewareCall<Request, Response>,
  context: CallContext
) {
  try {
    return yield* call.next(call.request, context);
  } catch (error: unknown) {
    if (error instanceof ServerError || isAbortError(error)) {
      throw error;
    }
    if (error instanceof ZodError) {
      const parsedError = parseZodError(error);
      throw new InvalidArgumentError(JSON.stringify(parsedError.details));
    }
    throw new UnknownError();
  }
}
