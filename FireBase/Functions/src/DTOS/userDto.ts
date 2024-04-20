import { UUID } from "crypto";
import { UserRecord } from "firebase-admin/auth";

export interface UserDto {
  // Define the properties of UserDto here
  user: UserRecord|undefined;
  groups: GroupsDto[];
 
  // ...
}
interface GroupsDto {
  id: UUID;
  name?: string;
  servers?: ServerDto[];
  isInit: boolean;
}
interface ServerDto {
  id: UUID;
  groupUuid: UUID;
  name?: string;
  host?: string;
  user?: string;
  sSH_privatekey?: ArrayBuffer;
  password?: string;
  operatingSystem?: string;
}