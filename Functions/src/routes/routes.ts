import * as express from 'express';
import { installFunction } from '../install/install';
import { getservers } from '../servers/getServers';
const router = express.Router();
router.get('/getServers', getservers);

router.post('/install', installFunction);

export default router;