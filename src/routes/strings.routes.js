// src/routes/strings.routes.js
import { Router } from 'express';
import {
  postString,
  getString,
  getStrings,                 // list with filters
  getStringsByNaturalLanguage,
  deleteString
} from '../controllers/strings.controller.js';
import { contentTypeJson } from '../middleware/contentType.js';

const router = Router();

// Create (POST) - content-type guard only here
router.post('/', contentTypeJson, postString);

// Natural language filter MUST come before the param route
router.get('/filter-by-natural-language', getStringsByNaturalLanguage);

// List with query filters
router.get('/', getStrings);

// Specific by original string
router.get('/:value', getString);

// Delete by original string
router.delete('/:value', deleteString);

export default router;
