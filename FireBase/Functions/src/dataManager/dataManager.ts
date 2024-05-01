import * as functions from "firebase-functions";
import { dbManager } from "../dbManager/dbManager";
import {
  serverProcessor,
  serverProcessorEvents,
} from "../serverProcessor/serverProcessor";
import { bashOperators, bashOperatorsEvents } from "../bashOperators/bashOperators";

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
      new dbManager(req)
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
    new dbManager(req)
      .editGroup(req)
      .then(() => {
        new dbManager(req).getUserData(req).then((data) => {
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
  new dbManager(req)
    .addNewGroupToDb(req)
    .then(() => {
      new dbManager(req).getUserData(req).then((data) => {
        res.send(data);
      });
    })

    .catch((e) => {
     errorManager(e, res, 500);;
    });
});

export const deleteGroup = functions.https.onRequest((req: any, res: any) => {
  try {
    new dbManager(req)
      .deleteGroup(req.params.groupId)
      .then(() => {
        new dbManager(req).getUserData(req).then((data) => {
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
    const server = new serverProcessor();
    const osOP = new bashOperators();

    let os;
    const checkIfIsPossible = (
      serverClass: serverProcessor,
    ) => {

        // new dbManager(req).addNewServer(request).then(() => {
        //   new dbManager(req).getUserData(request).then((data) => {
        //     resp.send(data);
        //   });
        // });
        osOP.operatingSystem(serverClass);
        osOP.on(bashOperatorsEvents.operatingSystem, (data) => {                              
          if (String(data).includes("Linux")){
            osOP.OSVersion(serverClass);
          }else
          {
            errorManager("Os is not supported", res, 500);

          } 
        }); 
       
    };
    osOP.on(bashOperatorsEvents.OSVersion, (data) => {
      os = data;      
      // new dbManager(req)
      //   .addNewServer(req.body, os)
      //   .then(() => {
      //     new dbManager(req).getUserData(req).then((data) => {
      //       res.send(data);
      //     });
      //   })
      //   .catch((e) => {
      //    errorManager(e, res, 500);;
      //   });
      res.send({os:os});
    });  
    server
      .clientReady(req.body)
      .then(() => {
        server.on(serverProcessorEvents.onReady, (data) =>{          
          checkIfIsPossible(server)

        }
        );
        server.on(serverProcessorEvents.onEnd, (data) =>{  
          errorManager("connection closed", res, 500);

        
        }
        );
        server.on(serverProcessorEvents.onError, (data) =>{          

          errorManager(data.level, res, 500);
          
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