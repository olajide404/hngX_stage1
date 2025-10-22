import { Router } from 'express';
import { postString, getString, getStrings, getStringsByNaturalLanguage} from '../controllers/strings.controller.js';
import { contentTypeJson } from '../middleware/contentType.js';
import { deleteString } from '../controllers/strings.controller.js';

const router = Router();

// List (structured filters)
router.get('/', getStrings);

// Natural-language filter — must be before '/:value'
router.get('/filter-by-natural-language', getStringsByNaturalLanguage);

// POST /strings
router.post('/', contentTypeJson, postString);

// GET /strings/:value
router.get('/:value', getString);

router.delete('/:value', deleteString);



export default router;