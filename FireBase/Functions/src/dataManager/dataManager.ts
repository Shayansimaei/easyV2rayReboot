import { UserDto } from "../DTOS/userDto";
import * as functions from "firebase-functions";
import { randomUUID } from "crypto";
import { dbManager } from "../dbManager/dbManager";
// export async function putGroup(req, res): Promise<UserDto> {
//   const data = new dataMaker(req);
//   const userDocRef = db.collection("usersData").doc(req.uid);
//   const doc = await userDocRef.get();

//   if (!doc.exists) {
//     db.collection("usersData")
//       .doc(req.uid)
//       .set(await data.addNewGroup());
//     await userDocRef.set(await data.addNewGroup());
//     return data.addNewGroup();
//   } else {
//     return doc.data() as UserDto;
//   }
// }

export const getUserComplete = functions.https.onRequest((req: any, res) => {
  try {
    
    new dbManager(req).getUserData(req)
      .then((data) => {
        return res.send(data);
      })
      .catch((e) => res.send(e));
  } catch (e) {
    res.status(422).send(e);
  }
});
// export const getJustGroups = functions.https.onRequest((req: any, res) => {
//   getUserData(req).then((data) => {
//     data.groups.forEach((group) => {
//       group.servers = [];
//     });
//     res.send(data);
//   });
// });
export const addNewGroup = functions.https.onRequest((req: any, res) => {
  new dbManager(req).addNewGroupToDb(req)
    .then(() => {
        new dbManager(req).getUserData(req).then((data) => {
        res.send(data);})
      })
  
    .catch((e) => res.status(422).send(e));
});
export const deleteGroup =functions.https.onRequest((req: any, res) => {
  new dbManager(req).deleteGroup(req.params.groupId)
    .then(() => {
      new dbManager(req).getUserData(req).then((data) => {
      res.send(data);})
    })
    .catch((e) => res.status(422).send(e));
});
