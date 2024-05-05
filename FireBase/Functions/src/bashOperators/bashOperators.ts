import { EventEmitter } from "events";
import { operatingSystemCommands } from "../enums/osBash.enum";
import { serverProcessor } from "../serverProcessor/serverProcessor";
import { EventEmitterClass } from "../DTOS/eventEmitterClasses.interface";

export class bashOperators implements EventEmitterClass {
  eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }
  operatingSystem(connectedServer: serverProcessor) {
    connectedServer.customExec(
      operatingSystemCommands.operatingSystem,
      bashOperatorsEvents.operatingSystem
    );
    connectedServer.on(bashOperatorsEvents.operatingSystem, (data) => {
      this.emitter(bashOperatorsEvents.operatingSystem, data);
    });
  }
  OSVersion(connectedServer: serverProcessor) {
    connectedServer.customExec(
      operatingSystemCommands.OSVersion,
      bashOperatorsEvents.OSVersion
    );
    connectedServer.on(bashOperatorsEvents.OSVersion, (data) => {
      this.emitter(bashOperatorsEvents.OSVersion, data);
    });
    
  }
  isV2rayInstalled(connectedServer: serverProcessor) {
    connectedServer.customExec(
      operatingSystemCommands.checkV2rayInstallation,
      bashOperatorsEvents.isV2rayInstalled
    );
    connectedServer.on(bashOperatorsEvents.isV2rayInstalled, (data) => {
      this.emitter(bashOperatorsEvents.isV2rayInstalled, data);
    });

  }
  on(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }
  emitter(emitterType: bashOperatorsEvents, data?: any) {
    this.eventEmitter.emit(emitterType, data);
  }
}
export enum bashOperatorsEvents {
  operatingSystem = "operatingSystem",
  OSVersion = "OSVersion",
  isV2rayInstalled = "isV2rayInstalled",
  onError = "onError",
  onEnd = "onEnd",
  onExecData = "onExecData",
  onExecError = "onExecError",
}
