import * as admin from "firebase-admin";
import { UserDto } from "../DTOS/userDto";
import { dataMaker } from "../dataMaker/dataMaker";
import { ServerDto } from "../DTOS/serverDto";
import { DocumentReference } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

export class dbManager {
  db = admin.firestore();
  userDocRef:DocumentReference<UserDto>;
  serverDocRef:DocumentReference<ServerDto>;
  req:any;
  constructor(req) {
    this.req = req;   
  }
  async getUserDocRef(): Promise<any>{
    return await this.db.collection("usersData").doc(this.req.user.uid);
  }

  async getUserData(req): Promise<UserDto> {
    try {
      this.userDocRef = await this.getUserDocRef();
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
      this.userDocRef = await this.getUserDocRef();
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
      this.userDocRef = await this.getUserDocRef();
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
      this.userDocRef = await this.getUserDocRef();
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
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
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      throw new Error(e);
    }
  }
  async addNewServer(req): Promise<void> {
    try {
      this.userDocRef = await this.getUserDocRef() ;
      let doc: any|UserDto= await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (req.body.id === undefined || req.body.id === "") {
        req.body.id = randomUUID();
      }else
      throw new Error("Something is wrong with ths server id");

      if (req.body.name === undefined || req.body.name === "") {
        throw new Error("name is empty");
      }
      if (req.body.name.length > 15 || req.body.name.length < 3) {
        throw new Error("name format is wrong");
      }
      doc.groups.map(async (group) => {
        if (group.id === req.body.group.id ){
          if(group.servers.length >30)
            throw new Error("this group has reached the limit of servers | 30 servers max");
          group.servers.every((server) => {
            if(server.uuid === req.body.uuid)
              throw new Error("server name already exists");
          })
          group.servers.push(await dbManager.serverSecurityChopper(req.body));
        }
      });
      console.log(doc);
      
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteServer(req): Promise<void> {
    try {
      let doc: any|UserDto= await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (req.body.id === undefined || req.body.id === "") {
        throw new Error("non existing server");
      }
      doc.groups.map((group) => {
        if (group.id === req.body.group.id ){
          group.servers = group.servers.filter((server) => {
            return server.id !== req.body.id;
          });
        }
      });
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      throw new Error(e);
    }
  }
  static serverSecurityChopper(server:ServerDto):ServerDto{
    server.ssh_passphrase,server.ssh_privatekey=undefined;
    return server;}

}
