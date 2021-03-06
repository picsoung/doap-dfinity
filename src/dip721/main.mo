import Array "mo:base/Array";
import Bool "mo:base/Bool";
import D "mo:base/Debug";
import Int "mo:base/Int";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

import Doap "canister:doap";
import DoapTypes "../doap/types";
import Types "./dip721_types";


shared actor class Dip721NFT(custodian: Principal, init : Types.Dip721NonFungibleToken) = Self {
  stable var transactionId: Types.TransactionId = 0;
  stable var nfts = List.nil<Types.Nft>();
  stable var custodians = List.make<Principal>(custodian);
  stable var logo : Types.LogoResult = init.logo;
  stable var name : Text = init.name;
  stable var symbol : Text = init.symbol;


  type DoapEvent = DoapTypes.DoapEvent;

  // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
  let null_address : Principal = Principal.fromText("aaaaa-aa");

  public query func balanceOfDip721(user: Principal) : async Nat64 {
    return Nat64.fromNat(
      List.size(
        List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user })
      )
    );
  };

  public query func ownerOfDip721(token_id: Types.TokenId) : async Types.OwnerResult {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.owner);
      };
    };
  };

  public query func listEventNFTs(event_uid: Text) : async [Types.Nft]{
    let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.eventId == event_uid });
    // let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
    return List.toArray(items);
  };

  public shared({ caller }) func safeTransferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {  
    if (to == null_address) {
      return #Err(#ZeroAddress);
    } else {
      return transferFrom(from, to, token_id, caller);
    };
  };

  public shared({ caller }) func transferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {
    return transferFrom(from, to, token_id, caller);
  };

  func transferFrom(from: Principal, to: Principal, token_id: Types.TokenId, caller: Principal) : Types.TxReceipt {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        if (
          caller != token.owner and
          not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
        ) {
          return #Err(#Unauthorized);
        } else if (Principal.notEqual(from, token.owner)) {
          return #Err(#Other);
        } else {
          nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                owner = to;
                id = item.id;
                eventId = item.eventId;
                metadata = token.metadata;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #Ok(transactionId);   
        };
      };
    };
  };

  public query func supportedInterfacesDip721() : async [Types.InterfaceId] {
    return [#TransferNotification, #Burn, #Mint];
  };

  public query func logoDip721() : async Types.LogoResult {
    return logo;
  };

  public query func nameDip721() : async Text {
    return name;
  };

  public query func symbolDip721() : async Text {
    return symbol;
  };

  public query func totalSupplyDip721() : async Nat64 {
    return Nat64.fromNat(
      List.size(nfts)
    );
  };

  public query func getMetadataDip721(token_id: Types.TokenId) : async Types.MetadataResult {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.metadata);
      }
    };
  };

  // public query func getMaxLimitDip721() : async Nat16 {
  //   return maxLimit;
  // };

  public func getMetadataForUserDip721(user: Principal) : async Types.ExtendedMetadataResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    switch (item) {
      case null {
        return #Err(#Other);
      };
      case (?token) {
        return #Ok({
          metadata_desc = token.metadata;
          token_id = token.id;
        });
      }
    };
  };

  public query func getTokenIdsForUserDip721(user: Principal) : async [Types.TokenId] {
    let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
    return List.toArray(tokenIds);
  };

   public shared({ caller }) func claimDip721Event(to: Principal, eventId: Types.EventId) : async Types.MintReceipt {
    // Can only claim one
    let didAlreadyClaimed = List.some(nfts, func (token: Types.Nft) : Bool { token.owner == to and token.eventId == eventId });
    if (didAlreadyClaimed == true) {
      return #Err(#AlreadyClaimed);
    };

    let result = await Doap.getDirectEvent(eventId);
    switch(result) {
      case (null) {
        #Err(#CantClaim);
      };
      case (? v) {
        if(v.active == true and v.dateEnding < Time.now()) {
          let newId = Nat64.fromNat(List.size(nfts));

          //generate metadata from event infos
          let eventName: Text = v.name;
          let eventDesc: Text = v.description;
          let eventImg: Text = v.image;
          let dateClaimed: Text = Int.toText(Time.now());

          let metadata: Types.MetadataDesc =  [{
              purpose = #Rendered;
              data = "";
              key_val_data = [
                { key = "event"; val = #TextContent eventName },
                { key = "description"; val = #TextContent eventDesc },
                { key = "image"; val = #TextContent eventImg },
                { key = "tokenId"; val = #Nat64Content newId },
                { key = "dateClaimed"; val = #TextContent dateClaimed }
              ]
          }];

          let nft : Types.Nft = {
            owner = to;
            id = newId;
            eventId = eventId;
            metadata = metadata;
          };

          nfts := List.push(nft, nfts);

          transactionId += 1;

          return #Ok({
            token_id = newId;
            id = transactionId;
          });
        }else{
          return #Err(#CantClaim);
        };
      };
    };

    // D.print(debug_show(("result", result)));

    // switch(result) {
    //   case (#err(_)) {
    //     return #Err(#Other);
    //   };
    //   case (#ok(false)) {
    //     return #Err(#CantClaim);
    //   };
    //   case(#ok(true)) {
    //     let newId = Nat64.fromNat(List.size(nfts));
    //     let nft : Types.Nft = {
    //       owner = to;
    //       id = newId;
    //       eventId = eventId;
    //       metadata = metadata;
    //     };

    //     nfts := List.push(nft, nfts);

    //     transactionId += 1;

    //     return #Ok({
    //       token_id = newId;
    //       id = transactionId;
    //     });
    //   };
    // };
    // if(result == false){
    //   return #Err(#CantClaim);
    // };
    // Main.isEventActive(eventId);

  };

  public shared({ caller }) func mintDip721(to: Principal, eventId: Types.EventId, metadata: Types.MetadataDesc) : async Types.MintReceipt {
    if (not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      return #Err(#Unauthorized);
    };

    let newId = Nat64.fromNat(List.size(nfts));
    let nft : Types.Nft = {
      owner = to;
      id = newId;
      eventId = eventId;
      metadata = metadata;
    };

    nfts := List.push(nft, nfts);

    transactionId += 1;

    return #Ok({
      token_id = newId;
      id = transactionId;
    });
  };
};