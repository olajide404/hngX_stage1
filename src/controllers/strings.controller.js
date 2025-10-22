// interacts with incoming HTTP requests and sends responses.

import { Errors } from '../utils/errors.js';
import { createString, getStringByOriginalValue } from '../service.js/strings.service.js';
import { ensureHasValueField, ensureValueIsString } from '../utils/validate.js'


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

