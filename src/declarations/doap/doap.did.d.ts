import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ClaimOptions = { 'open' : null } |
  { 'secret' : null } |
  { 'timelockAndSecret' : null } |
  { 'timelock' : null };
export type ClaimOptions__1 = { 'open' : null } |
  { 'secret' : null } |
  { 'timelockAndSecret' : null } |
  { 'timelock' : null };
export interface DoapEvent {
  'uid' : string,
  'active' : boolean,
  'dateCreated' : bigint,
  'name' : string,
  'description' : string,
  'dateEnding' : bigint,
  'image' : string,
  'timePeriod' : bigint,
  'eventType' : ClaimOptions,
}
export type Error = { 'alreadyExists' : null } |
  { 'notFound' : null };
export type Result = { 'ok' : boolean } |
  { 'err' : Error };
export type Result_1 = { 'ok' : DoapEvent } |
  { 'err' : Error };
export interface _SERVICE {
  'createEvent' : ActorMethod<
    [string, ClaimOptions__1, string, string, string, bigint],
    Result_1,
  >,
  'endEvent' : ActorMethod<[string], Result_1>,
  'getEvent' : ActorMethod<[string], Result_1>,
  'getEvents' : ActorMethod<[], Array<[string, DoapEvent]>>,
  'isEventActive' : ActorMethod<[string], Result>,
}
