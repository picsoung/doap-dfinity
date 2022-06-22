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

import { doap } from "../../../../declarations/doap";
import { dip721, idlFactory } from "../../../../declarations/dip721";
import { Principal } from "@dfinity/principal";
import { useAuthContext } from "../../context";

export default function Event() {
  let params = useParams();
  const { identity } = useAuthContext();

  const [event, setEvent] = useState([]);
  const [ownerPrincipal, setOwnerPrincipal] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);
  let [connected, setConnected] = useState(false);
  let [principal, setPrincipalId] = useState(null);
  let [dip721Actor, setDip721Actor] = useState(null);

  const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  useEffect(async () => {
    console.log("userEffect");
    if (identity) {
      setConnected(true);
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
      setDip721Actor(actor);
    }
  }, [identity]);

  const getEvent = useCallback(async () => {
    const res = await doap.getEvent(params.eventId);
    console.log("reees", res);
    if (res && res.ok) {
      setEvent(res.ok);
      // let k = new Principal()
      setOwnerPrincipal(Principal.fromUint8Array(res.ok.owner._arr).toText());
    } else {
    }
  }, []);

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

  return (
    <main style={{ padding: "1rem" }}>
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
            <Button type="submit" label="Connect to wallet" primary />
          )}
        </Box>
      )}
    </main>
  );
}
