import * as express from 'express';
import { installFunction } from '../install/install';
import { getUserComplete,putGroup } from '../servers/getServers';
const router = express.Router();
router.get('/getServers', (req, res) => getUserComplete(req, res));
router.put('/AddGroup',(req, res) =>  putGroup(req, res));
router.post('/install',(req, res) => installFunction(req, res));

export default router;