import { Client } from "ssh2";
import { ServerDto } from "../DTOS/serverDto";
import { Buffer } from "buffer";
import { EventEmitter } from "events";
import { EventEmitterClass } from "../DTOS/eventEmitterClasses.interface";

export class serverProcessor implements EventEmitterClass{
  private readonly connection: Client;
  public isConnected: boolean = false;
  eventEmitter: EventEmitter;
  constructor() {
    this.connection = new Client();
    this.eventEmitter = new EventEmitter();
  }
  makeConnectionObject(req: ServerDto) {
    let connectionObject = {
      host: req.ssh_host,
      port: req.ssh_port,
      username: req.ssh_user,
    };
    if (req.ssh_privatekey) {
      connectionObject["privateKey"] = Buffer.from(req.ssh_privatekey);
    }
    if (req.ssh_passphrase) {
      connectionObject["password"] = req.ssh_passphrase;
    }
    return connectionObject;
  }
  private async connect(req: ServerDto) {
    try {
      await this.connection.connect(await this.makeConnectionObject(req));
    } catch (e) {
      throw new Error(e);
    }
  }
  emitter(emitterType: serverProcessorEvents|string, data?: customExecOutput) {
    if(data&&data.signal===undefined)data.signal="";
    this.eventEmitter.emit(emitterType, data);

  }
  customExec(command: string,event?:string){
    
    if (this.isConnected) {
      this.connection.exec(command, (err: Error | undefined, stream: any) => {
        let result = '';

        if (err) throw err;
        stream
          .on("close", (code: number, signal: string) => {
            this.emitter(event?event:serverProcessorEvents.onExecData,{data:result,code:code,signal:signal} );
            
          })
          .on("data", (data: any) => {
            result+=data.toString();
            
          })
          .stderr.on("data", (data: any) => {
            result+=data.toString();
          })
      });
    } else {
      throw new Error("serverProcessor :: customExec :: not connected");
    }
  }
  async clientReady(req: any): Promise<void> {
    if (!this.isConnected) await this.connect(req);
     this.connection.on("ready", () => {
      this.isConnected = true;
      this.emitter(serverProcessorEvents.onReady);
    });
     this.connection.on("error",(err)=>{
        this.emitter(serverProcessorEvents.onError, err);
    });

     this.connection.on("end", ()=>{
      console.log("end");
      
        this.emitter(serverProcessorEvents.onEnd);
    });
  }
  close(){
    this.connection.end();
    this.emitter(serverProcessorEvents.onEnd);

  }
  on(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }
  removeStyling(text:string):string{
    const regex = /\x1b\[[0-9;]*m/g;
    text=text.replace(regex, '');
    return text;
  }
}
export enum serverProcessorEvents {
  onReady = "onReady",
  onError = "onError",
  onEnd = "onEnd",
  onExecData = "onExecData",
  onExecError = "onExecError",
}
// Add the missing type declaration for customExecOutput
export type customExecOutput = {
  data: string|boolean;
  code: number;
  signal: string;
};


