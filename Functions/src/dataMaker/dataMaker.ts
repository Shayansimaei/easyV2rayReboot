import { randomUUID } from "crypto";
import { UserDto } from "../DTOS/userDto";

export class dataMaker{ 
    req:any;
    constructor(req:any){
      this.req=req;
    }
      public defaultUserData:UserDto
      async init():Promise<UserDto>{
      this.defaultUserData.user = this.req.user;
      this.defaultUserData.groups = [{id:randomUUID(),name:"single servers",servers:[],isInit:true}];
      return this.defaultUserData;
    }
    async addNewGroup():Promise<UserDto>{
      this.defaultUserData.user = this.req.user;
      this.defaultUserData.groups = [{id:randomUUID(),name:this.req.body.groupName,servers:this.req.body.servers,isInit:false}];
      return this.defaultUserData;
    }
    }