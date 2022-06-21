import React, { Fragment, useState, useEffect, useCallback } from "react";
// import { getInvoices } from "../data";
import { useNavigate } from "react-router-dom";
// import { doap } from "../services/wrapper";
import {
  Box,
  Form,
  Main,
  Text,
  Image,
  Heading,
  Button,
  FormField,
  TextInput,
  CheckBox,
  Select,
  RadioButtonGroup,
  TextArea,
  Spinner
} from "grommet";
import { v5 as uuidv5 } from "uuid";

import Range from "../../components/dateRange";
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, HttpAgent } from "@dfinity/agent";
import { doap, idlFactory } from "../../../../declarations/doap";

export default function NewEvent() {
  let eventTypes = ["open", "timelock", "secret", "timelockAndSecret"];
  let [secretOption, setSecretOption] = useState("open");
  let [timeLimitOption, setTimeLimitOption] = useState("open");
  let [connected, setConnected] = useState(false);
  let [principal, setPrincipalId] = useState(null);
  let [doapActor, setDoapActor] = useState(null);
  let [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const network = "https://localhost:8000"; //https://mainnet.dfinity.network/";
  const whitelist = [
    process.env.PLUG_COIN_FLIP_CANISTER_ID || "rkp4c-7iaaa-aaaaa-aaaca-cai",
  ];
  const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  useEffect(async () => {
    console.log("userEffect");
    // const result = await window.ic.plug.isConnected();
    const identity = await StoicIdentity.load();
    setConnected(identity);
    if (identity) {
      setConnected(true);
      setPrincipalId(identity.getPrincipal().toText());
      //Create an actor canister
      const agent = await new HttpAgent({
        identity,
        host: "http://localhost:8000",
      });
      let key = await agent.fetchRootKey();
      const actor = await Actor.createActor(idlFactory, {
        agent,
        canisterId,
      });
      console.log("acctor", actor);
      setDoapActor(actor);
    }
  }, []);

  const handleConnect = async () => {
    let identity = await StoicIdentity.load();
    console.log("identity", identity);
    if (!identity) {
      identity = await StoicIdentity.connect();
    }
    setConnected(true);
    setPrincipalId(identity.getPrincipal().toText());
    //Create an actor canister
    const actor = await Actor.createActor(idlFactory, {
      agent: new HttpAgent({
        identity,
        host: "http://localhost:8000",
      }),
      canisterId,
    });
    console.log("acctor", actor);
    setDoapActor(actor);
    // const result = await window.ic.plug.requestConnect({ whitelist, network });
    // console.log("handleConnect", result);
    // const principal = await window.ic.plug.agent.getPrincipal();

    // if (!window.ic.plug.agent) {
    //   await window.ic?.plug?.createAgent(whitelist);
    // }

    // if (principal) {
    //   setPrincipalId(principal.toText());
    //   setConnected(true);

    //   const NNSUiActor = await window.ic.plug.createActor({
    //     canisterId: whitelist[0],
    //     interfaceFactory: idlFactory,
    //   });
    //   console.log(NNSUiActor);
    //   setDoapActor(NNSUiActor);
    // }
  };

  const handleDisconnect = async () => {
    setConnected(false);
    // let res = await window.ic.plug.disconnect();
    let res = await StoicIdentity.disconnect();

    console.log("handleDisconnect", res);
  };

  const createNewEvent = async (eventDetails) => {
    let eventType = {};
    if (secretOption == "open" && timeLimitOption == "open") {
      eventType = { open: null };
    } else if (secretOption == "secret" && timeLimitOption == "open") {
      eventType = { secret: null };
    } else if (secretOption == "open" && timeLimitOption == "timelock") {
      eventType = { timelock: null };
    } else {
      eventType = { timelockAndSecret: null };
    }
    console.log(
      uuidv5(eventDetails.name, "e881001d-65dd-489f-8f26-41d1bfbaa659")
    );
    console.log(doapActor, window.ic?.plug?.agent);
    try {
      setLoading(true);
      const res = await doapActor.createEvent(
        uuidv5(eventDetails.name, "e881001d-65dd-489f-8f26-41d1bfbaa659"),
        eventType,
        eventDetails.name,
        eventDetails.description,
        eventDetails.image,
        0,
        eventDetails.URL
      );

      console.log("res", res);
      if (res && res.ok) {
        console.log("oook", res.ok.uid);
        navigate(`/events/${res.ok.uid}`);
      }
    } catch (e) {
      console.log("ERROR Creating event", e);
    }

    // createEvent(_uid: Text, _eventType: ClaimOptions, _name: Text, _description: Text, _image: Text, _timePeriod: Int)
    // console.log("reees", res);
  };

  return (
    <Box>
      <Heading>Create a new DOAP</Heading>
      <Form
        onSubmit={(event) => {
          createNewEvent(event.value);
          console.log("Submit", event.value, event.touched);
        }}
      >
        <FormField label="Event name" name="event_name">
          <TextInput name="name" required />
        </FormField>
        <FormField label="Event description" name="event_description">
          <TextInput name="description" required />
        </FormField>
        <FormField label="Event URL" name="event_URL">
          <TextInput name="URL" required />
        </FormField>
        <FormField label="Event image URL" name="event_image">
          <TextInput name="image" required />
        </FormField>
        {/* <Select
          id="select"
          name="select"
          placeholder="Select"
          value={value}
          options={options}
          onChange={({ option }) => setValue(option)}
        /> */}
        <FormField>
          <RadioButtonGroup
            name="secretOption"
            options={[
              { label: "Anyone can claim", value: "open" },
              { label: "Secret code", value: "secret" },
            ]}
            value={secretOption}
            onChange={(event) => setSecretOption(event.target.value)}
          />
          {secretOption == "secret" && (
            <FormField label="Secret Code" name="secret">
              <TextInput name="secretcode" required />
            </FormField>
          )}
        </FormField>
        <FormField>
          <RadioButtonGroup
            name="timeLimitOption"
            options={[
              { label: "No time limit", value: "open" },
              { label: "Time limit", value: "timelock" },
            ]}
            value={timeLimitOption}
            onChange={(event) => setTimeLimitOption(event.target.value)}
          />
        </FormField>
        {timeLimitOption == "timelock" && (
          <FormField label="Date range to claim doap" name="secret">
            <Range />
          </FormField>
        )}
        <Box direction="row" justify="between" margin={{ top: "medium" }}>
          {connected ? (
            <Button type="submit" label="Create" primary />
          ) : (
            <Button label="Connect to wallet" onClick={handleConnect} />
          )}
          {isLoading && <Spinner />}
        </Box>
        {connected && <Button label="Disconnect" onClick={handleDisconnect} />}
      </Form>
    </Box>
  );
}
