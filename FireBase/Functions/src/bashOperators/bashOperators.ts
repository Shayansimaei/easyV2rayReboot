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
  oSRelease(connectedServer: serverProcessor) {
    connectedServer.customExec(
      operatingSystemCommands.OSVersion,
      bashOperatorsEvents.OSRelease
    );
    connectedServer.on(bashOperatorsEvents.OSRelease, (data) => {
      this.emitter(bashOperatorsEvents.OSRelease, data);
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
  OSRelease = "OSRelease",
  onError = "onError",
  onEnd = "onEnd",
  onExecData = "onExecData",
  onExecError = "onExecError",
}
