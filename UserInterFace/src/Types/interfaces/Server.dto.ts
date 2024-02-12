export interface ServerDto
{
    Name?:string;
    SSH_host?:string;
    SSH_user?:string;
    SSH_privatekey?:string;
    SSH_passphrase?:string;
    OperatingSystem?:string;
    ConnectionLink?:string;
    Servers?:ServerDto[];

}