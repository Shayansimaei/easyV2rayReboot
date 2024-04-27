import * as functions from "firebase-functions";
import { dbManager } from "../dbManager/dbManager";
import { serverProcessor } from "../serverProcessor/serverProcessor";

export function errorHandler(err: any, req: Request, res: functions.Response, next: any) {
  console.error(err.stack); // Log error stack trace to the console
  res.status(500).send('Something broke!');
}

//================================================================================================
// group and user Data Manager
/**
 * Handles the editGroups function.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */ 

export const getUserComplete = functions.https.onRequest(
  (req: any, res:any) => {
  try {
    new dbManager(req)
      .getUserData(req)
      .then((data) => {
        return res.send(data);
      })
      .catch((e) => {throw new Error(e);});
  }
  catch (e) {
    throw new Error('BROKEN')
} 
  }
);

export const editGroups = functions.https.onRequest((req: any, res) => {
  try {
    new dbManager(req)
      .editGroup(req)
      .then(() => {
        new dbManager(req).getUserData(req).then((data) => {
          res.send(data);
        });
      })
      .catch((e) =>{throw new Error(e);});
  } catch (e) {
    throw new Error('BROKEN')
  }
});

export const addNewGroup = functions.https.onRequest((req: any, res) => {
  new dbManager(req)
    .addNewGroupToDb(req)
    .then(() => {
      new dbManager(req).getUserData(req).then((data) => {
        res.send(data);
      });
    })

    .catch((e) => {throw new Error(e);});
});

export const deleteGroup = functions.https.onRequest((req: any, res:any) => {
  try {
    new dbManager(req)
      .deleteGroup(req.params.groupId)
      .then(() => {
        new dbManager(req).getUserData(req).then((data) => {
          res.send(data);
        });
      })
      .catch((e) => {throw new Error(e);});
  } catch (e) {
    throw new Error(e)
  }
});

//================================================================================================	
// server Data Manager
export const serverAvailability = functions.https.onRequest((req: any, res) => {
  try {    
    const server=new serverProcessor();
    const clientRes=(possibility,resp=res)=>{
      resp.send(possibility);
    }
    server.connect(req.body,clientRes)
      .then(() => {})
      .catch((e) =>{throw new Error(e);});
  } catch (e) {
    throw e;
  }
  
});