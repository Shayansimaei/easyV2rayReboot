import * as admin from 'firebase-admin';
import { UserDto } from '../DTOS/userDto';
import * as functions from 'firebase-functions';


  const db = admin.firestore();


  
  export async function getUserData(req):Promise<UserDto>{
    const userDocRef = db.collection('usersServers').doc(req.user.uid);
  
    const doc = await userDocRef.get();
  
    if (!doc.exists) {
      await userDocRef.set(await makeInitialData(req));
      return makeInitialData(req);
    } else {
      return doc.data()as UserDto;
    }
  }
  async function makeInitialData(req):Promise<UserDto> {
    let defaultUserData:UserDto
    defaultUserData.user = req.user;
    defaultUserData.servers = [];
    return defaultUserData;
  }
  export const getservers = functions.https.onRequest((req:any, res) => {
    getUserData(req.user.uid).then((data) => {
      res.send(data.servers);
    });
  });
  