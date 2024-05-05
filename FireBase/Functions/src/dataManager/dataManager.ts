import * as functions from "firebase-functions";
import { dbManager } from "../dbManager/dbManager";
import {
  serverProcessor,
  serverProcessorEvents,
} from "../serverProcessor/serverProcessor";
import { bashOperators, bashOperatorsEvents } from "../bashOperators/bashOperators";
import { ServerDto } from "../DTOS/serverDto";

//================================================================================================
// group and user Data Manager
/**
 * Handles the editGroups function.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */

export const getUserComplete = functions.https.onRequest(
  (req: any, res: any) => {
    try {
      new dbManager(req,res)
        .getUserData(req)
        .then((data) => {
          return res.send(data);
        })
        .catch((e) => {
         errorManager(e, res, 500);;
        });
    } catch (e) {
     errorManager(e, res, 500);;
    }
  }
);

export const editGroups = functions.https.onRequest((req: any, res) => {
  try {
    new dbManager(req,res)
      .editGroup(req)
      .then(() => {
        new dbManager(req,res).getUserData(req).then((data) => {
          res.send(data);
        });
      })
      .catch((e) => {
       errorManager(e, res, 500);;
      });
  } catch (e) {
    errorManager(e, res, 500);;
  }
});

export const addNewGroup = functions.https.onRequest((req: any, res) => {
  new dbManager(req,res)
    .addNewGroupToDb(req)
    .then(() => {
      new dbManager(req,res).getUserData(req).then((data) => {
        res.send(data);
      });
    })

    .catch((e) => {
     errorManager(e, res, 500);;
    });
});

export const deleteGroup = functions.https.onRequest((req: any, res: any) => {
  try {
    new dbManager(req,res)
      .deleteGroup(req.params.groupId)
      .then(() => {
        new dbManager(req,res).getUserData(req).then((data) => {
          res.send(data);
        });
      })
      .catch((e) => {
       errorManager(e, res, 500);;
      });
  } catch (e) {
   errorManager(e, res, 500);;
  }
});

//================================================================================================
// server Data Manager
export const serverAvailability = functions.https.onRequest((req: any, res) => {
  try {
    const server = new serverProcessor();
    const clientRes = (possibility, resp = res) => {
      resp.send(possibility);
    };
    server
      .clientReady(req.body)
      .then(() => {
        server.on(serverProcessorEvents.onReady, (data) =>
          clientRes(data, res)
        );
      })
      .catch((e) => {
        errorManager(e, res, 500);
      });
  } catch (e) {
    errorManager(e, res, 500);
  }
});
export const addNewServer = functions.https.onRequest((req: any, res) => {
  try {
    let reqBody=req.body as ServerDto;
    const server = new serverProcessor();
    const osOP = new bashOperators();

    let os;

    const serverProperties = (
      serverClass: serverProcessor,
    ) => {
        osOP.operatingSystem(serverClass);
        osOP.on(bashOperatorsEvents.operatingSystem, (data) => {

          if (String(data.data).match("Linux")){
            osOP.OSVersion(serverClass);
            osOP.isV2rayInstalled(serverClass);
          }else
          {
            errorManager("Os is not supported", res, 500);

          } 
        }); 
       
    };
    osOP.on(bashOperatorsEvents.OSVersion, (data) => {
      os = data;
      reqBody.operatingSystem = os;

    });  
    osOP.on(bashOperatorsEvents.isV2rayInstalled, (data) => {
      reqBody.installed={};
     if(!data.code)
      {
        reqBody.installed.v2ray=true;
        let result=server.removeStyling(data.data);
       if(result.match("modified for EasyV2ray")){
        reqBody.installed.modified=true;
        const parts = result.split(/[\(\)]/);
        reqBody.installed.version=parts[1];
        reqBody.installed.caddyVersion=parts[3];        
       }
       else{
        reqBody.installed.modified=false;

       }
      }
      else
      reqBody.installed.v2ray=false;
      addServerToDb();
    });
    const addServerToDb = () => {
      req.body = reqBody;
      console.log("started");
      
      new dbManager(req,res)
        .addNewServer(req)
        .then(() => {
          console.log("done");
          
          new dbManager(req,res).getUserData(req).then((data) => {
            res.send(data);
          });
        })
        .catch((e) => {
          errorManager(e, res, 500);
        });
    }
    server
      .clientReady(req.body)
      .then(() => {
        server.on(serverProcessorEvents.onReady, (data) =>{          
          serverProperties(server)

        }
        );
      })
      .catch((e) => {
        errorManager(e, res, 500);
      });
      
  } catch (e) {
    errorManager("server is not available", res, 500);
    }
});


const errorManager = (e: any, res: any,code:number) => {
  res.status(code|500).send({ error: e });
}