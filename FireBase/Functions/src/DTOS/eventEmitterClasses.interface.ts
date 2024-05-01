import { EventEmitter } from "events";

export interface EventEmitterClass {
     eventEmitter: EventEmitter;
    emitter(emitterType:string, data?: any): void;
    on(event: string, listener: (...args: any[]) => void): void;
}