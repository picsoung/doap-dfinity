import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";

import Hash "mo:base/Hash";

import Types "./types";
import DoapEvent "./doapevent";

actor Doap {
  type ClaimOptions = Types.ClaimOptions;
  type Error = Types.Error;
  type DoapEvent = Types.DoapEvent;

  let eventClass = DoapEvent.DoapEventClass();

  stable var events: [(Text, DoapEvent)] = [];
  stable var eventsCount : Nat = 0;
  stable var totalSupply : Nat = 0;

  // Event functions
    public query(msg) func getEvent(uid: Text): async Result.Result<DoapEvent, Error> {
        // let callerId = msg.caller;

        // // Reject AnonymousIdentity
        // if (Principal.toText(callerId) == "2vxsx-fae") {
        //     return #err(#NotAuthorized);
        // };

        return eventClass.getEvent(uid);
    };

    public query(msg) func getDirectEvent(uid: Text): async ?DoapEvent {
      return eventClass.getDirectEvent(uid);
    };

    public query(msg) func getEventsCount(): async Nat {
        return eventClass.eventsCount;
    };

    public query(msg) func getEvents(): async [(Text, DoapEvent)] {
        return eventClass.getEvents();
    };

    public shared(msg) func endEvent(uid: Text): async Result.Result<DoapEvent, Error> {
      let callerId = msg.caller;

        // // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        return eventClass.endEvent(callerId, uid);
    };

    public shared(msg) func isEventActive(uid: Text): async Result.Result<Bool, Error> {
        return eventClass.isEventActive(uid);
    }; 

    public shared(msg) func createEvent(_uid: Text, _eventType: ClaimOptions, _name: Text, _description: Text, _image: Text, _timePeriod: Int): async Result.Result<DoapEvent, Error> {
        let callerId = msg.caller;

        // // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        return eventClass.createEvent(callerId, _uid, _eventType, _name , _description, _image, _timePeriod);
    };

    system func preupgrade() {
        events := eventClass.getEvents();
    };

    system func postupgrade() {
        eventClass.rePopulateHashmap(events);
        events := [];
    };

}