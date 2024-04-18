export interface ServerDto
{
    Uuid?: string;
    Name?: string;
    SSH_host?: string;
    SSH_user?: string;
    SSH_port?: number;
    SSH_privatekey?: ArrayBuffer;
    SSH_passphrase?: string;
    OperatingSystem?: string;
    ConnectionLink?: string;
}