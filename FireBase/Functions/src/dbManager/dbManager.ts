import * as admin from "firebase-admin";
import { UserDto } from "../DTOS/userDto";
import { dataMaker } from "../dataMaker/dataMaker";

export class dbManager {
  db = admin.firestore();
  userDocRef;
  constructor(req) {
    this.userDocRef = this.db.collection(`usersData`).doc(`${req.user.uid}`);
  }
  async getUserData(req): Promise<UserDto> {
    try {
      const data = new dataMaker();
      let doc = await this.userDocRef.get();
      if (!doc.exists) {
        const newDocument = (await data.init(req.user)) as UserDto;
        await this.userDocRef.set(newDocument);
        const doc = await this.userDocRef.get();
        return doc.data() as UserDto;
      } else {
        return doc.data() as UserDto;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  async addNewGroupToDb(req): Promise<void> {
    try {
      const data = new dataMaker();
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (req.body.name === undefined || req.body.name === "") {
        throw new Error("name is empty");
      }
      if (req.body.name.length > 15 || req.body.name.length < 3) {
        throw new Error("name format is wrong");
      }
      if (doc.groups.length > 299) {
        throw new Error("group limit reached | 300 groups max");
      }
      doc.groups.push(await data.makeNewGroup(req.body));
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      throw new Error(e);
    }
  }
  async deleteGroup(id): Promise<void> {
    try {
      const data = new dataMaker();
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (id === undefined || id === "") {
        throw new Error("non existing group");
      }
      doc.groups = doc.groups.filter((group) => {
        if (group.id === id && group.isInit)
          throw new Error("can't delete init group");
        return group.id !== id;
      });
      await this.userDocRef.set(doc as UserDto);
      // if (!req.body.serversDelete){dont delete servers}
    } catch (e) {
      throw new Error(e);
    }
  }
  async editGroup(req): Promise<void> {
    try {
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
      console.log((req.body.id === undefined || req.body.id === "" ) ,
      (req.body.name === undefined || req.body.name === "") ,
      (req.body.name.length > 15 || req.body.name.length < 3) ,
      (doc.groups.length > 299))
      if (req.body.id === undefined || req.body.id === "") {
        throw new Error("non existing group");
      }
      if (req.body.name === undefined || req.body.name === "") {
        throw new Error("name is empty");
      }
      if (req.body.name.length > 15 || req.body.name.length < 3) {
        throw new Error("name format is wrong");
      }
      if (doc.groups.length > 299) {
        throw new Error("group limit reached | 300 groups max");
      }
      doc.groups.map((group) => {
        if (group.id === req.body.id ){
          if(group.isInit)
            throw new Error("can't edit init group");
          group.name = req.body.name;
        }
      });
      console.log(doc)
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      throw new Error(e);
    }
  }
}
