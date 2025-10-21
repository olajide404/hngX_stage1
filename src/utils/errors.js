export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const Errors = {
  BadRequest: (msg = 'Bad request.') => new HttpError(400, msg),
  Unprocessable: (msg = 'Unprocessable entity.') => new HttpError(422, msg),
  Conflict: (msg = 'Conflict.') => new HttpError(409, msg),
  PayloadTooLarge: (msg = 'Payload too large.') => new HttpError(413, msg)
};
