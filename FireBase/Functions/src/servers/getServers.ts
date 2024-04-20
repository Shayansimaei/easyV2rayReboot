import * as admin from 'firebase-admin';
import { UserDto } from '../DTOS/userDto';
import * as functions from 'firebase-functions';
import { randomUUID } from 'crypto';
import { dataMaker } from '../dataMaker/dataMaker';

  const db = admin.firestore();


  
  export async function getUserData(req):Promise<UserDto>{

    try{
      const data = new dataMaker(req.user);
      const userDocRef = db.collection(`usersData`).doc(`${req.user.uid}`);
      let doc = await userDocRef.get();
      if (!doc.exists) {
        const newData= await data.init();
        console.log(newData)
        await userDocRef.set(newData as UserDto);
        const doc = await userDocRef.get()
        return doc.data() as UserDto;
      } else {
        return doc.data() as UserDto;
      }
    }catch(e){
      console.log(e);
    }
  }
  export async function putGroup(req,res):Promise<UserDto>{
    const data = new dataMaker(req);
    const userDocRef = db.collection('usersData').doc(req.uid);
    const doc = await userDocRef.get();
  
    if (!doc.exists) {
      db.collection('usersData').doc(req.uid).set(await data.addNewGroup());
      await userDocRef.set(await data.addNewGroup());
      return data.addNewGroup();
    } else {
      return doc.data()as UserDto;
    }
  }
  
  export const getUserComplete = functions.https.onRequest((req:any, res) => {
    try{
      getUserData(req).then((data) => {
                return res.send(data);
      }).catch(e => res.send(e));
    }
    catch(e){
      res.send(e);
    }
    
  });
  export const getJustGroups = functions.https.onRequest((req:any, res) => {
    getUserData(req).then((data) => {
      data.groups.forEach(group => {
        group.servers = [];
      });
      res.send(data);
    });
  });  
  export const AddGroup = functions.https.onRequest((req:any, res) => {
    getUserData(req.user).then((data) => {
      data.groups.forEach(group => {
        group.servers = [];
      });
      
      res.send(data);
    });
  }); 
  
  