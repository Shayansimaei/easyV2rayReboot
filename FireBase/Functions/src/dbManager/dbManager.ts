import * as admin from "firebase-admin";
import { UserDto } from "../DTOS/userDto";
import { dataMaker } from "../dataMaker/dataMaker";
import { ServerDto } from "../DTOS/serverDto";
import { DocumentReference } from "firebase-admin/firestore";
import { randomUUID } from "crypto";
const errorManager = (e: any, res: any,code:number) => {
  console.log(e);
  
  res.status(code|500).send({ error: e });
}
export class dbManager {
  db = admin.firestore();
  userDocRef:DocumentReference<UserDto>;
  serverDocRef:DocumentReference<ServerDto>;
  req:any;
  res:any;
  constructor(req,res) {
    this.res = res;
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
      errorManager(e, this.res, 500);
    }
  }
  async addNewGroupToDb(req): Promise<void> {
    try {
      this.userDocRef = await this.getUserDocRef();
      const data = new dataMaker();
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (req.body.name === undefined || req.body.name === "") {
        errorManager("name is empty", this.res, 500);
      }
      if (req.body.name.length > 15 || req.body.name.length < 3) {
        errorManager("name format is wrong", this.res, 500);
      }
      if (doc.groups.length > 299) {
        errorManager("group limit reached | 300 groups max", this.res, 500);
      }
      doc.groups.push(await data.makeNewGroup(req.body));
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      errorManager(e, this.res, 500);
    }
  }
  async deleteGroup(id): Promise<void> {
    try {
      this.userDocRef = await this.getUserDocRef();
      const data = new dataMaker();
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (id === undefined || id === "") {
        errorManager("non existing group", this.res, 500);
      }
      doc.groups = doc.groups.filter((group) => {
        if (group.id === id && group.isInit)
          errorManager("can't delete init group", this.res, 500);
        return group.id !== id;
      });
      await this.userDocRef.set(doc as UserDto);
      // if (!req.body.serversDelete){dont delete servers}
    } catch (e) {
      errorManager(e, this.res, 500);
    }
  }
  async editGroup(req): Promise<void> {
    try {
      this.userDocRef = await this.getUserDocRef();
      let doc: any = await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (req.body.id === undefined || req.body.id === "") {
        errorManager("non existing group", this.res, 500);
      }
      if (req.body.name === undefined || req.body.name === "") {
        errorManager("name is empty", this.res, 500);
      }
      if (req.body.name.length > 15 || req.body.name.length < 3) {
        errorManager("name format is wrong", this.res, 500);
      }
      if (doc.groups.length > 299) {
        errorManager("group limit reached | 300 groups max", this.res, 500);
      }
      doc.groups.map((group) => {
        if (group.id === req.body.id ){
          if(group.isInit)
            errorManager("can't edit init group", this.res, 500);
          group.name = req.body.name;
        }
      });
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      errorManager(e, this.res, 500);
    }
  }
  async addNewServer(req): Promise<void> {
    try {
      
      this.userDocRef = await this.getUserDocRef() ;
      let doc: any|UserDto= await this.userDocRef.get();
      doc = doc.data() as UserDto;      
      if (req.body.id!||req.body.id === undefined || req.body.id === "") {
        req.body.id = randomUUID();
      }else{
      errorManager("Something is wrong with ths server id", this.res, 500);
      }
      if (req.body.name === undefined || req.body.name === "") {
        errorManager("name is empty", this.res, 500);
      }

      if (req.body.name.length > 15 || req.body.name.length < 3) {
        errorManager("name format is wrong", this.res, 500);
      }
      doc.groups.map(async (group) => {
        if (group.id === req.body.group.id ){
          if(group.servers.length >30)
            errorManager("this group has reached the limit of servers | 30 servers max", this.res, 500);
         await group.servers.every((server) => {
            if(server.uuid === req.body.uuid)
              errorManager("server name already exists", this.res, 500);
          })
          let newGroup=dbManager.serverSecurityChopper(req.body);          
          group.servers.push(newGroup);
        }
      });
      console.log(doc,3);
      
      await this.userDocRef.set(doc as UserDto);
    } catch (e) {
      errorManager(e, this.res, 500);
    }
  }

  async deleteServer(req): Promise<void> {
    try {
      let doc: any|UserDto= await this.userDocRef.get();
      doc = doc.data() as UserDto;
      if (req.body.id === undefined || req.body.id === "") {
        errorManager("non existing server", this.res, 500);
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
      errorManager(e, this.res, 500);
    }
  }
  static serverSecurityChopper(server:ServerDto):ServerDto{
    server.ssh_passphrase=null;
    server.ssh_privatekey=null;
    return server;}

}
