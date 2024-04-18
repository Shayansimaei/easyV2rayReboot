import * as express from 'express';
import { installFunction } from '../install/install';
import { getUserData,putGroup } from '../servers/getServers';
const router = express.Router();
router.get('/getServers', getUserData);
router.put('/AddGroup', putGroup);
router.post('/install', installFunction);

export default router;