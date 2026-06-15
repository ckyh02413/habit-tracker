export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends HttpError {
  constructor(message) {
    super(400, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message) {
    super(409, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
  }
}
