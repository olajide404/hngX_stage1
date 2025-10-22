import { Router } from 'express';
import { postString, getString } from '../controllers/strings.controller.js';
import { contentTypeJson } from '../middleware/contentType.js';

const router = Router();

// POST /strings
router.post('/', contentTypeJson, postString);

// GET /strings/:value
router.get('/:value', getString);

export default router;