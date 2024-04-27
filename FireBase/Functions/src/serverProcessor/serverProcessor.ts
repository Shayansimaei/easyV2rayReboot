import { Client } from 'ssh2';
import { ServerDto } from '../DTOS/serverDto';

export class serverProcessor {
    private readonly connection: Client;
    public isConnected: boolean = false;
    constructor() {
        this.connection = new Client();
    }
    makeConnectionObject(req:ServerDto){
        
        let connectionObject ={
            host: req.ssh_host,
            port: req.ssh_port,
            username: req.ssh_user,
        }
        if(req.ssh_privatekey){
            connectionObject["privateKey"] = Buffer.from(req.ssh_privatekey);
           
        }
        if(req.ssh_passphrase){
            connectionObject["password"] = req.ssh_passphrase;
        
        }
        console.log(connectionObject);

        return connectionObject;
    }
    async connect(req:ServerDto,callback:(res:boolean)=>void){
        try{

            await this.connection.connect(await this.makeConnectionObject(req));
            await this.clientReady(callback);
        }catch(e){
            throw new Error(e);
        
        }
    }
    customExec(command: string) {
        this.connection.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
              console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
              this.connection.end();
            }).on('data', (data) => {
              console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
              console.log('STDERR: ' + data);
            });
          });
    }
    async clientReady(callback:(res:boolean)=>void):Promise<void>{
        await this.connection.on('ready', () => {this.isConnected = true; 
            callback(true);  
        });
       await  this.connection.on('error', function(err) {
            throw new Error("serverProcessor :: error :: " + err.message);
          });
          
         await this.connection.on('end', function() {
            throw new Error('Client :: end');
          });
          
    }
    
}