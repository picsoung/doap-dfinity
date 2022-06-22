import D "mo:base/Debug";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";

import DoapEvent "./doapevent";
import Types "./types";

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

    public shared(msg) func toggleEvent(uid: Text): async Result.Result<DoapEvent, Error> {
      let callerId = msg.caller;
       D.print(debug_show(("toggleEvent", uid, callerId)));

        // // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        return eventClass.toggleEvent(callerId, uid);
    };

    public shared(msg) func isEventActive(uid: Text): async Result.Result<Bool, Error> {
        return eventClass.isEventActive(uid);
    }; 

    public shared(msg) func createEvent(_uid: Text, _eventType: ClaimOptions, _name: Text, _description: Text, _image: Text, _timePeriod: Int, _url: Text): async Result.Result<DoapEvent, Error> {
        let callerId = msg.caller;

        // // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        return eventClass.createEvent(callerId, _uid, _eventType, _name , _description, _image, _timePeriod, _url);
    };

    system func preupgrade() {
        events := eventClass.getEvents();
    };

    system func postupgrade() {
        eventClass.rePopulateHashmap(events);
        events := [];
    };

}