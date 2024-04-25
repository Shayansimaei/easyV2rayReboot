import { UUID } from "crypto";
import { GroupDto } from "./userDto";

export interface ServerDto
{
    Uuid?: UUID;
    Name?: string;
    SSH_host?: string;
    SSH_user?: string;
    SSH_port?: number;
    SSH_privatekey?: ArrayBuffer;
    SSH_passphrase?: string;
    OperatingSystem?: string;
    ConnectionLink?: string;
    Group?: GroupDto;
    V2rayUsers?: V2rayUserDto[];
}
export interface V2rayUserDto{
    Email?: string;
    Level?: number;
    AlterId?: number;
    Uuid?: string;
    Security?: string;
    // StreamSettings?: StreamSettingsDto;
}