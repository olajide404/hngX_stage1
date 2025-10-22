import { Errors } from '../utils/errors.js';

// parse the boolean from query. accept 'true' or 'false' (case insensitive).
export function parseOptionalBoolean(q, key) {
    if (!(key in q)) return undefined;
    const raw = String(q[key]).toLowerCase();
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    throw Errors.BadRequest(`${key} must be 'true' or 'false'.`);
}

export  function parseOptionalNonNegativeInt(q, key) {
    if (!(key in q)) return undefined;
    const raw = String(q[key]).trim();
    if (!/^\d+$/.test(raw)) {
        throw Errors.BadRequest(`${key} must be a non-negative integer.`);
    }
    return Number(raw);
}

export function parseOptionalSingleChar(q, key) {
  if (!(key in q)) return undefined;
  const raw = String(q[key]);
  const nfc = raw.normalize('NFC');
  const cps = Array.from(nfc);
  if (cps.length !== 1) {
    throw Errors.BadRequest(`'${key}' must be exactly one character.`);
  }
  return cps[0];
}

export function validateFilterRelationships(filters) {
  const { min_length, max_length } = filters;
  if (min_length != null && max_length != null && min_length > max_length) {
    throw Errors.BadRequest(`'min_length' cannot be greater than 'max_length'.`);
  }
}