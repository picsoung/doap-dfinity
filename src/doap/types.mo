module {
  public type ClaimOptions = {
    #timelock;
    #secret;
    #open;
    #timelockAndSecret
  };
  public type Error = {
    #alreadyExists;
    #notFound;
    #NotAuthorized;
  };
  public type DoapEvent = {
    owner: Principal;
    uid: Text;
    eventType: ClaimOptions;
    url: Text;
    name: Text;
    description: Text;
    image: Text;
    dateCreated: Int;
    timePeriod: Int;
    dateEnding: Int;
    active: Bool;
  }
}