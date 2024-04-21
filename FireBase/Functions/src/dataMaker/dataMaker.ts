import { randomUUID } from "crypto";
import { GroupDto, UserDto } from "../DTOS/userDto";
import { UserMetadata, UserRecord } from "firebase-admin/auth";

export class dataMaker {
  req: any;
  constructor() {
  }
  public defaultUserData: UserDto= {  user: undefined, groups: [] };
  async init(req:UserRecord): Promise<UserDto> {
    this.defaultUserData.user = req;
    this.defaultUserData.groups = [
      { id: randomUUID(), name: "single servers", servers: [], isInit: true },
    ];
    return this.defaultUserData;
  }
  async makeNewGroup(req:any): Promise<GroupDto> {
    const newGroup:GroupDto = {
      id: randomUUID(),
      name: req.name,
      servers: [],
      isInit: false,
    }
    
    return newGroup;
  }
}
