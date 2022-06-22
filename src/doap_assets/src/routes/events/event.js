import React, { useEffect, useCallback, useState } from "react";

import {
  Box,
  Form,
  Main,
  Text,
  Image,
  Heading,
  Button,
  Anchor,
  FormField,
  TextInput,
  CheckBox,
  Select,
  RadioButtonGroup,
  TextArea,
  Spinner,
} from "grommet";

import { useParams, Link } from "react-router-dom";
import DayJS from "dayjs";

import { StoicIdentity } from "ic-stoic-identity";
import { Actor, HttpAgent } from "@dfinity/agent";

import { doap , idlFactory } from "../../../../declarations/doap";
import { dip721 } from "../../../../declarations/dip721";
import { Principal } from "@dfinity/principal";
import { useAuthContext } from "../../context";
import { off } from "process";

export default function Event() {
  let params = useParams();
  const { identity } = useAuthContext();

  const [event, setEvent] = useState([]);
  const [ownerPrincipal, setOwnerPrincipal] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);
  let [connected, setConnected] = useState(false);
  let [isOwner, setIsOwner] = useState(false);
  let [currentUserPrincipal, setCurrentUserPrincipalId] = useState(null);
  // let [dip721Actor, setDip721Actor] = useState(null);
  let [doapActor, setDoapActor] = useState(null);

  // const dip327canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai" //ryjl3-tyaaa-aaaaa-aaaba-cai";
  const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai"

  useEffect(async () => {
    // const isConnected = async ()=>{
    console.log("userEffect");
    if (identity) {
      console.log("idenity loaded");
      setConnected(true);
      setCurrentUserPrincipalId(identity.getPrincipal().toText());
      //Create an actor canister
      // const agent = await new HttpAgent({
      //   identity,
      //   host: "http://localhost:8000",
      // });
      // let key = await agent.fetchRootKey();
      // const actor = await Actor.createActor(idlFactory, {
      //   agent,
      //   dip327canisterId,
      // });
      // console.log("acctor", actor);
      // setDip721Actor(actor);

      // const dAgent = await new HttpAgent({
      //   identity,
      //   host: "http://localhost:8000",
      // });
      // console.log('dAgent', dAgent)
      // // let dKey = await dAgent.fetchRootKey();
      // const dActor = await Actor.createActor(doapIdlFactory, {
      //   dAgent,
      //   doapCanisterId,
      // });
      // console.log("dActor", dActor);
      // setDoapActor(dActor);
      // }
    }
  }, [identity]);

  const getEvent = useCallback(async () => {
    const res = await doap.getEvent(params.eventId);
    console.log("reees", res);
    if (res && res.ok) {
      setEvent(res.ok);
      let ownerP = Principal.fromUint8Array(res.ok.owner._arr).toText();
      setOwnerPrincipal(ownerP);
    } else {
    }
  }, []);

  //is current user owner of current event
  useEffect(async () => {
    if (event && identity) {
      if (ownerPrincipal === currentUserPrincipal) {
        setIsOwner(true);
        // const agent = await new HttpAgent({
        //   identity,
        //   host: "http://localhost:8000",
        // });
        // let key = await agent.fetchRootKey();
        // const actor = await Actor.createActor(doapIdlFactory, {
        //   agent,
        //   doapCanisterId,
        // });
        // console.log("acctor", actor);
        // setDoapActor(actor);
      }
    }
  }, [ownerPrincipal, currentUserPrincipal]);

  const handleConnect = async () => {
    let identity = await StoicIdentity.load();
    console.log("identity", identity);
    if (!identity) {
      identity = await StoicIdentity.connect();
    }
    login(identity);
    setCurrentUserPrincipalId(identity.getPrincipal().toText());
  };

  useEffect(() => {
    getEvent();
  }, []);

  const handleClaim = async () => {
    try {
      // setLoading(true);
      const res = await dip721.claimDip721Event(
        identity.getPrincipal(),
        event.uid
      );
      console.log("res", res);
    } catch (e) {
      console.log("error minting ", e);
    }
  };

  const handleToggleEvent = async () => {
    const agent = await new HttpAgent({
      identity,
      host: "http://localhost:8000",
    });
    let key = await agent.fetchRootKey();
    const actor = await Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
    const res = await actor.toggleEvent(event.uid);
    if (res && res.ok) {
      getEvent();
    }
  }

  return (
    <main style={{ padding: "1rem" }}>
      <Box gap="medium">
        {event && (
          <Box
            round="medium"
            style={{ backgroundColor: "#B99ACC" }}
            pad="medium"
            direction="column"
            gap="medium"
          >
            <Box
              align="center"
              gap="small"
              pad="small"
              style={{ backgroundColor: "#4D4352" }}
            >
              <Heading level={1}>{event.name}</Heading>
              <Text size="medium">DOAP event #{event.uid}</Text>
              <Text size="medium">
                Created{" "}
                {DayJS(Number(event.dateCreated) / 1000000).format(
                  "MM/DD/YYYY, HH:mm:ssa"
                )}
              </Text>
            </Box>
            <Box align="center" gap="xmall">
              <Box height="small" width="small">
                <Image fit="cover" src={event.image} />
              </Box>
              <Heading level={3}>{event.name}</Heading>
              <Text size="medium" level={5}>
                Created by
              </Text>
              <Text size="medium" level={5}>
                {ownerPrincipal}
              </Text>
            </Box>
            <Box gap="small">
              <Text size="large">Description</Text>
              <Text size="medium">{event.description}</Text>
              <Text size="medium">
                <Anchor href={event.url} target="_blank">
                  Website
                </Anchor>
              </Text>
            </Box>
            {connected && event.active && (
              <Button
                type="submit"
                label="Claim this DOAP"
                primary
                onClick={handleClaim}
              />
            )}
            {!connected && event.active && (
              <Button
                type="submit"
                label="Connect to wallet"
                primary
                onClick={handleConnect}
              />
            )}
          </Box>
        )}
        {!event && <Box>No event found :(</Box>}
        {event && isOwner && (
          <Box
            round="medium"
            style={{ backgroundColor: "#B99ACC" }}
            pad="medium"
            direction="column"
            gap="medium"
          >
            <Box align="center" gap="small" pad="small">
              <Heading level={2}>Admin</Heading>
              {event.active ? (
                <Button
                  type="submit"
                  label="Pause claiming"
                  primary
                  onClick={handleToggleEvent}
                />
              ) : (
                <Button
                  type="submit"
                  label="Open Claiming"
                  primary
                  onClick={handleToggleEvent}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </main>
  );
}
