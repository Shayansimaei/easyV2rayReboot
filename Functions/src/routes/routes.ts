import * as express from 'express';
import { installFunction } from '../install/install.js';
const router = express.Router();

router.post('/install', installFunction);

export default router;