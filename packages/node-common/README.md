# @syllabus/common

A common library for Syllabus projects that provides shared utilities, error wrappers, and middleware for nice-grpc.

## Installation

```bash
npm install @syllabus/common
```

## Usage

### Error Handling

The library provides a set of error classes that map to gRPC status codes. These can be thrown in your service implementations and will be automatically converted to the appropriate gRPC status codes.

```typescript
import { NotFoundError, InvalidArgumentError } from '@syllabus/common';

// In your gRPC service implementation
export const findExample = async (request: FindExampleRequest): Promise<ExampleResponse> => {
  const result = await findExampleById(request.id);
  if (!result) {
    throw new NotFoundError('Example not found');
  }
  return result;
};

export const createExample = async (request: CreateExampleRequest): Promise<ExampleResponse> => {
  if (!request.name) {
    throw new InvalidArgumentError('Name is required');
  }
  // Implementation...
};
```

### Error Handler Middleware

The library also provides a middleware for nice-grpc that automatically handles error conversion:

```typescript
import { createServer } from 'nice-grpc';
import { errorHandlerMiddleware } from '@syllabus/common';
import { ExampleServiceDefinition } from './grpc/service';
import * as methods from './methods';

async function startServer(): Promise<void> {
  const server = createServer();
  
  // Add the error handler middleware
  server.use(errorHandlerMiddleware());
  
  server.add(ExampleServiceDefinition, methods);
  await server.listen('0.0.0.0:50051');
}
```

## Available Error Classes

- `GrpcError` - Base class for all gRPC errors
- `NotFoundError` - For when a requested resource is not found (Status.NOT_FOUND)
- `InvalidArgumentError` - For when a request is invalid (Status.INVALID_ARGUMENT)
- `AlreadyExistsError` - For when a resource already exists (Status.ALREADY_EXISTS)
- `UnauthenticatedError` - For when a user is not authenticated (Status.UNAUTHENTICATED)
- `PermissionDeniedError` - For when a user does not have permission (Status.PERMISSION_DENIED)
- `UnavailableError` - For when a resource is unavailable (Status.UNAVAILABLE)
- `DeadlineExceededError` - For when a deadline is exceeded (Status.DEADLINE_EXCEEDED)
- `InternalError` - For internal server errors (Status.INTERNAL)

## License

ISC
