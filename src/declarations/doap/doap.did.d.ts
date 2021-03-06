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
  'url' : string,
  'active' : boolean,
  'dateCreated' : bigint,
  'owner' : Principal,
  'name' : string,
  'description' : string,
  'dateEnding' : bigint,
  'image' : string,
  'timePeriod' : bigint,
  'eventType' : ClaimOptions,
}
export type Error = { 'alreadyExists' : null } |
  { 'NotAuthorized' : null } |
  { 'notFound' : null };
export type Result = { 'ok' : DoapEvent } |
  { 'err' : Error };
export type Result_1 = { 'ok' : boolean } |
  { 'err' : Error };
export interface _SERVICE {
  'createEvent' : ActorMethod<
    [string, ClaimOptions__1, string, string, string, bigint, string],
    Result,
  >,
  'getDirectEvent' : ActorMethod<[string], [] | [DoapEvent]>,
  'getEvent' : ActorMethod<[string], Result>,
  'getEvents' : ActorMethod<[], Array<[string, DoapEvent]>>,
  'getEventsCount' : ActorMethod<[], bigint>,
  'isEventActive' : ActorMethod<[string], Result_1>,
  'toggleEvent' : ActorMethod<[string], Result>,
}
