// interacts with incoming HTTP requests and sends responses.

import { Errors } from '../utils/errors.js';
import { createString, getStringByOriginalValue, listStrings } from '../service.js/strings.service.js';
import { ensureHasValueField, ensureValueIsString } from '../utils/validate.js';
import {
    parseOptionalBoolean,
    parseOptionalNonNegativeInt,
    parseOptionalSingleChar,
    validateFilterRelationships
} from '../utils/parse.js';

export async function postString(req, res, next) {
    try {
        if (req.body == null || typeof req.body !== 'object') {
            throw Errors.BadRequest('Invalid JSON.');
        }
        ensureHasValueField(req.body);
        ensureValueIsString(req.body.value);

        const result = await createString(req.body.value);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getString(req, res, next) {
    try {
        const originalValue = req.params.value;

        if (typeof originalValue !== 'string') {
            throw Errors.BadRequest('Missing or invalid path parameter')
        }

        const doc = await getStringByOriginalValue(originalValue)
        return res.status(200).json(doc)
    } catch (err) {
        next(err)
    }
}


export async function getStrings(req, res, next) {
  try {
    const { query } = req;

    // Parse each filter (may be undefined if not provided)
    const is_palindrome      = parseOptionalBoolean(query, 'is_palindrome');
    const min_length         = parseOptionalNonNegativeInt(query, 'min_length');
    const max_length         = parseOptionalNonNegativeInt(query, 'max_length');
    const word_count         = parseOptionalNonNegativeInt(query, 'word_count');
    const contains_character = parseOptionalSingleChar(query, 'contains_character');

    // define the 'filters' variable used below
    const filters = { is_palindrome, min_length, max_length, word_count, contains_character };

    // Cross-field validation (e.g., min_length <= max_length)
    validateFilterRelationships(filters);

    // Query DB with these filters
    const { data, count } = await listStrings(filters);

    // Build filters_applied with only the provided ones
    const filters_applied = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined)
    );

    return res.status(200).json({ data, count, filters_applied });
  } catch (err) {
    next(err);
  }
}


