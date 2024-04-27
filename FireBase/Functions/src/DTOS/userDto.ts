import { UUID } from "crypto";
import { UserRecord } from "firebase-admin/auth";
import { ServerDto } from "./serverDto";

export interface UserDto {
  // Define the properties of UserDto here
  user: UserRecord|undefined;
  groups: GroupDto[];
 
  // ...
}
export interface GroupDto {
  id: UUID;
  name?: string;
  servers?: ServerDto[];
  isInit: boolean;
}
