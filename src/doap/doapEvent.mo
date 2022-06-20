import D "mo:base/Debug";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";

import Types "./types";


module {
  type ClaimOptions = Types.ClaimOptions;
  type Error = Types.Error;
  type DoapEvent = Types.DoapEvent;

    private func isEqualEventName(event1_name : Text, event2_name : Text) : Bool{
        event2_name == event2_name
    };

    private func hashOfEventId(uid : Text) : Hash.Hash {
        Text.hash(uid)
    };

    public class DoapEventClass() {
        public let events = TrieMap.TrieMap<Text, DoapEvent>(isEqualEventName, hashOfEventId);

        public func getEvent(uid: Text): Result.Result<DoapEvent, Error> {
            return Result.fromOption(events.get(uid), #notFound);
        };

        public func getEvents(): [(Text, DoapEvent)] {
            return Iter.toArray(events.entries())
        };

        public func isEventActive(uid: Text): Result.Result<Bool, Error> {
          //get event
         
          let result = events.get(uid);
          D.print(debug_show(("isEventActive", uid, result)));
          switch(result) {
              case null{
                #err(#notFound);
              };
              case (? v) {
                //check date
                let now = Time.now();
                if(v.active == true){  //check if active = true
                   #ok(true);
                }else if(v.active == true and v.dateEnding < now){  //check if active and under dateEnd
                  #ok(true);
                }else{
                  #ok(false);
                }
              };
          }
        };

        public func createEvent(_uid: Text, _eventType: ClaimOptions, _name: Text, _description: Text, _image: Text, _timePeriod: Int): Result.Result<DoapEvent, Error> {
            let result = getEvent(_uid);

            switch(result) {
                case (#err(_)) {

                    //Setup value
                    var timeP : Int  = 0;
                    var dateEnd : Int = 0;
                    var dateCreated : Int = Time.now();
                    
                    if(_timePeriod > 0){
                      timeP := _timePeriod;
                      dateEnd := dateCreated + _timePeriod;
                    }else{
                      timeP := 0;
                      dateEnd := 0;
                    };
                    
                    // Create event
                    let event: DoapEvent = {
                      uid = _uid;
                      eventType = _eventType;
                      name = _name;
                      description= _description;
                      image = _image;
                      timePeriod = timeP;
                      dateCreated = dateCreated;
                      dateEnding = dateEnd;
                      active = true;
                    };

                    events.put(_uid, event);

                    #ok(event);
                };
                case(#ok(_)) {
                    #err(#alreadyExists);
                };
            };
        };

        public func endEvent(uid: Text): Result.Result<DoapEvent, Error>{
          let result = events.get(uid);
          switch(result) {
              case null{
                #err(#notFound);
              };
              case (? v) {
                let new_event : DoapEvent = {
                      uid = v.uid;
                      eventType = v.eventType;
                      name = v.name;
                      description= v.description;
                      image = v.image;
                      timePeriod = v.timePeriod;
                      dateCreated = v.dateCreated;
                      dateEnding = v.dateEnding;
                      active = false;
                    };
               let rsUpdateTP = events.replace(uid, new_event);
                #ok(new_event)
              };
          }
        };

        public func rePopulateHashmap(values: [(Text, DoapEvent)] ) {
            for ((name, event) in values.vals()) {
                events.put(name, event);
            }
        }
    }
}