import { UUID } from "crypto";
import { GroupDto } from "./userDto";

export interface ServerDto
{
    uuid?: UUID;
    name?: string;
    ssh_host?: string;
    ssh_user?: string;
    ssh_port?: number;
    ssh_privatekey?: ArrayBuffer;
    ssh_passphrase?: string;
    operatingSystem?: string;
    connectionLink?: string;
    group?: GroupDto;
    v2rayUsers?: V2rayUserDto[];
}
export interface V2rayUserDto{
    email?: string;
    level?: number;
    alterId?: number;
    uuid?: string;
    security?: string;
    // StreamSettings?: StreamSettingsDto;
}