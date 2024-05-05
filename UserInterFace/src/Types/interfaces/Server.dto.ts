import { GroupDto } from "./Group.dto";
import { V2rayUserDto } from "./V2rayUser.dto";

export interface ServerDto
{
    uuid?: string;
    name?: string;
    ssh_host?: string;
    ssh_user?: string;
    ssh_port?: number;
    ssh_privatekey?: ArrayBuffer;
    ssh_passphrase?: string;
    operatingSystem?: string;
    ConnectionLink?: string;
    group?: GroupDto;
    v2rayUsers?: V2rayUserDto[];
}