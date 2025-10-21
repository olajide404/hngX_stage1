import { Errors } from './errors.js';

export function ensureHasValueField(body) {
  if (!body || typeof body !== 'object' || !Object.hasOwn(body, 'value')) {
    throw Errors.BadRequest("Invalid request: missing 'value' field.");
  }
}
export function ensureValueIsString(value) {
  if (typeof value !== 'string') {
    throw Errors.Unprocessable("'value' must be a string.");
  }
}
