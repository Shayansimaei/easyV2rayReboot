import { ServerDto } from "./Server.dto";

export interface GroupDto
{
    Uuid?: string;
    Name?: string;
    Servers?: ServerDto[];
}