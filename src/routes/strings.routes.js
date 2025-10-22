import { Router } from 'express';
import { postString, getString, getStrings} from '../controllers/strings.controller.js';
import { contentTypeJson } from '../middleware/contentType.js';

const router = Router();


router.get('/', getStrings);

// POST /strings
router.post('/', contentTypeJson, postString);

// GET /strings/:value
router.get('/:value', getString);



export default router;