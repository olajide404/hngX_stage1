export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }

  toJSON() {
    return { error: this.message };
  }
}

export const Errors = {
  BadRequest: (msg = 'Bad request.') => new HttpError(400, msg),
  Unprocessable: (msg = 'Unprocessable entity.') => new HttpError(422, msg),
  Conflict: (msg = 'Conflict.') => new HttpError(409, msg),
  PayloadTooLarge: (msg = 'Payload too large.') => new HttpError(413, msg),
  NotFound: (msg = 'Not found.') => new HttpError(404, msg)
};
