import { ServerError, Status } from 'nice-grpc-common';
import { GrpcErrorMessage } from './constant';

export class CancelledError extends ServerError {
  constructor(message: string = GrpcErrorMessage.CANCELLED_ERROR) {
    super(Status.CANCELLED, message);
    Object.setPrototypeOf(this, CancelledError.prototype);
  }
}

export class UnknownError extends ServerError {
  constructor(message: string = GrpcErrorMessage.UNKNOWN_ERROR) {
    super(Status.UNKNOWN, message);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}

export class InvalidArgumentError extends ServerError {
  constructor(message: string = GrpcErrorMessage.INVALID_ARGUMENT_ERROR) {
    super(Status.INVALID_ARGUMENT, message);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}



export class NotFoundError extends ServerError {
  constructor(message: string = GrpcErrorMessage.NOT_FOUND_ERROR) {
    super(Status.NOT_FOUND, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class AlreadyExistsError extends ServerError {
  constructor(message: string = GrpcErrorMessage.ALREADY_EXISTS_ERROR) {
    super(Status.ALREADY_EXISTS, message);
    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}

export class PermissionDeniedError extends ServerError {
  constructor(message: string = GrpcErrorMessage.PERMISSION_DENIED_ERROR) {
    super(Status.PERMISSION_DENIED, message);
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}

export class AbortedError extends ServerError {
  constructor(message: string = GrpcErrorMessage.ABORTED_ERROR) {
    super(Status.ABORTED, message);
    Object.setPrototypeOf(this, AbortedError.prototype);
  }
}

export class InternalError extends ServerError {
  constructor(message: string = GrpcErrorMessage.INTERNAL_ERROR) {
    super(Status.INTERNAL, message);
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

export class UnauthenticatedError extends ServerError {
  constructor(message: string = GrpcErrorMessage.UNAUTHENTICATED_ERROR) {
    super(Status.UNAUTHENTICATED, message);
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }
}