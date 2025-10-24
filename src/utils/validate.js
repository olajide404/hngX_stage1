import { Errors } from './errors.js';

// Ensures the request body contains a "value" field
export function ensureHasValueField(body) {
  if (!body || typeof body !== 'object' || !Object.hasOwn(body, 'value')) {
    throw Errors.BadRequest("Invalid request: missing 'value' field.");
  }
}

// Ensures that the "value" field is a valid non-empty string
export function ensureValueIsString(value) {
  if (typeof value !== 'string') {
    throw Errors.Unprocessable("'value' must be a string.");
  }
  if (value.trim().length === 0) {
    throw Errors.Unprocessable("'value' must be a non-empty string.");
  }
}
