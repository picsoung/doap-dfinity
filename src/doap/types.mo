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
  };
  public type DoapEvent = {
    uid: Text;
    eventType: ClaimOptions;
    name: Text;
    description: Text;
    image: Text;
    dateCreated: Int;
    timePeriod: Int;
    dateEnding: Int;
    active: Bool;
  }
}