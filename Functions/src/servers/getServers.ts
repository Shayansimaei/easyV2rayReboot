import * as admin from 'firebase-admin';
import { UserDto } from '../DTOS/userDto';
import * as functions from 'firebase-functions';
import { randomUUID } from 'crypto';
import { dataMaker } from '../dataMaker/dataMaker';

  const db = admin.firestore();


  
  export async function getUserData(req):Promise<UserDto>{
    const data = new dataMaker(req);
    const userDocRef = db.collection('usersData').doc(req.user.uid);
    const doc = await userDocRef.get();
  
    if (!doc.exists) {
      await userDocRef.set(await data.init());
      return data.init();
    } else {
      return doc.data()as UserDto;
    }
  }
  export async function putGroup(req):Promise<UserDto>{
    const data = new dataMaker(req);
    const userDocRef = db.collection('usersData').doc(req.user.uid);
    const doc = await userDocRef.get();
  
    if (!doc.exists) {
      await userDocRef.set(await data.addNewGroup());
      return data.addNewGroup();
    } else {
      return doc.data()as UserDto;
    }
  }
  
  export const getUserComplete = functions.https.onRequest((req:any, res) => {
    getUserData(req.user.uid).then((data) => {
      res.send(data);
    });
  });
  export const getJustGroups = functions.https.onRequest((req:any, res) => {
    getUserData(req.user.uid).then((data) => {
      data.groups.forEach(group => {
        group.servers = [];
      });
      res.send(data);
    });
  });  
  export const AddGroup = functions.https.onRequest((req:any, res) => {
    getUserData(req.user.uid).then((data) => {
      data.groups.forEach(group => {
        group.servers = [];
      });
      
      res.send(data);
    });
  }); 
  
  