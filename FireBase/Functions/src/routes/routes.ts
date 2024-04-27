import * as express from "express";
import { installFunction } from "../install/install";
import {
  addNewGroup,
  deleteGroup,
  editGroups,
  getUserComplete,
  serverAvailability,
} from "../dataManager/dataManager";
const router = express.Router();
function functionHandler(
  next: any,
  handler: (req: any, res: any) => void | Promise<void>,
  req: any,
  res: any
) {
  try {
    handler(req, res);
  } catch (e) {
    next(e);
  }
}
router.get("/getServers", (req, res, next) =>
  functionHandler(next, getUserComplete, req, res)
);
router.post("/checkServer", (req, res, next) =>
  functionHandler(next, serverAvailability, req, res)
);

router.post("/editGroup", (req, res, next) =>
  functionHandler(next, editGroups, req, res)
);
router.post("/addGroup", (req, res, next) =>
  functionHandler(next, addNewGroup, req, res)
);

router.delete("/deleteGroup/:groupId", (req, res, next) =>
  functionHandler(next, deleteGroup, req, res)
);
// router.post('/install',(req, res,next) => installFunction(req, res,next));
export default router;
