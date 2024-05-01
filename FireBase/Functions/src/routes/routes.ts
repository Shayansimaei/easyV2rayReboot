import * as express from "express";
import {
  addNewGroup,
  addNewServer,
  deleteGroup,
  editGroups,
  getUserComplete,
  serverAvailability,
} from "../dataManager/dataManager";
const router = express.Router();
const functionHandler=(
  next: any,
  handler: (req: any, res: any) => void | Promise<void>,
  req: any,
  res: any
)=>{
  try {
    handler(req, res);
  } catch (e) {
    res.status(500).send({error: e})
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
router.post("/addServer", (req, res, next) =>
  functionHandler(next, addNewServer, req, res)
);

router.delete("/deleteGroup/:groupId", (req, res, next) =>
  functionHandler(next, deleteGroup, req, res)
);
export default router;
