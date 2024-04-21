import { ServerDto } from "./Server.dto";

export interface GroupDto
{
    id: string;
    name?: string;
    servers?: ServerDto[];
    isInit: boolean; 
}