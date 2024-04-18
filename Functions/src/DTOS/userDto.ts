import { UUID } from "crypto";
import { UserRecord } from "firebase-admin/auth";

export interface UserDto {
    // Define the properties of UserDto here
    user:UserRecord
    servers: ServerDto[];
    // ...
  }
  interface ServerDto {
    id:UUID;
    name?:string;
    host?:string;
    user?:string;
    sSH_privatekey?:ArrayBuffer;
    password?:string;
    operatingSystem?:string;
    servers?:ServerDto[];
}
  