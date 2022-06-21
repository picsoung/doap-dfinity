export const idlFactory = ({ IDL }) => {
  const ClaimOptions__1 = IDL.Variant({
    'open' : IDL.Null,
    'secret' : IDL.Null,
    'timelockAndSecret' : IDL.Null,
    'timelock' : IDL.Null,
  });
  const ClaimOptions = IDL.Variant({
    'open' : IDL.Null,
    'secret' : IDL.Null,
    'timelockAndSecret' : IDL.Null,
    'timelock' : IDL.Null,
  });
  const DoapEvent = IDL.Record({
    'uid' : IDL.Text,
    'active' : IDL.Bool,
    'dateCreated' : IDL.Int,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'dateEnding' : IDL.Int,
    'image' : IDL.Text,
    'timePeriod' : IDL.Int,
    'eventType' : ClaimOptions,
  });
  const Error = IDL.Variant({
    'alreadyExists' : IDL.Null,
    'notFound' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : DoapEvent, 'err' : Error });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : Error });
  return IDL.Service({
    'createEvent' : IDL.Func(
        [IDL.Text, ClaimOptions__1, IDL.Text, IDL.Text, IDL.Text, IDL.Int],
        [Result_1],
        [],
      ),
    'endEvent' : IDL.Func([IDL.Text], [Result_1], []),
    'getDirectEvent' : IDL.Func([IDL.Text], [IDL.Opt(DoapEvent)], ['query']),
    'getEvent' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getEvents' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, DoapEvent))],
        ['query'],
      ),
    'getEventsCount' : IDL.Func([], [IDL.Nat], ['query']),
    'isEventActive' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
