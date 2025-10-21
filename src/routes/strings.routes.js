import { Router } from 'express';
import { postString } from '../controllers/strings.controller.js';
import { contentTypeJson } from '../middleware/contentType.js';

const router = Router();

// POST /strings
router.post('/', contentTypeJson, postString);

export default router;