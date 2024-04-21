import * as express from 'express';
import { installFunction } from '../install/install';
import { addNewGroup, deleteGroup, getUserComplete } from '../dataManager/dataManager';
const router = express.Router();
router.get('/getServers', (req, res) => getUserComplete(req, res));
router.post('/addGroup',(req, res) =>  addNewGroup(req, res));
router.delete('/deleteGroup/:groupId',(req, res) => deleteGroup(req, res));
router.post('/install',(req, res) => installFunction(req, res));

export default router;