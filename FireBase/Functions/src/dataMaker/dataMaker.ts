import { randomUUID } from "crypto";
import { UserDto } from "../DTOS/userDto";
import { UserMetadata } from "firebase-admin/auth";

export class dataMaker {
  req: any;
  constructor(req: any) {
    this.req = req;
  }
  public defaultUserData: UserDto= {  user: undefined, groups: [] };
  async init(): Promise<UserDto> {
    this.defaultUserData.user = this.req;
    this.defaultUserData.groups = [
      { id: randomUUID(), name: "single servers", servers: [], isInit: true },
    ];
    return this.defaultUserData;
  }
  async addNewGroup(): Promise<UserDto> {
    this.defaultUserData.user = this.req.user;
    const newGroup = {
      id: randomUUID(),
      name: this.req.body.groupName,
      servers: this.req.body.servers,
      isInit: false,
    }
    this.defaultUserData.groups.push(newGroup);
    return this.defaultUserData;
  }
}
