import { UserRecord } from "firebase-admin/auth";

export interface UserDto {
    // Define the properties of UserDto here
    user:UserRecord
    servers: ServerDto[];
    // ...
  }
  interface ServerDto {
    Name?:string;
    host?:string;
    user?:string;
    SSH_privatekey?:File;
    password?:string;
    OperatingSystem?:string;
    Servers?:ServerDto[];
}
  