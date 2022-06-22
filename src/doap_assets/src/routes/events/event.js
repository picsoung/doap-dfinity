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
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";

import { useParams, Link } from "react-router-dom";
import DayJS from "dayjs";

import { StoicIdentity } from "ic-stoic-identity";
import { Actor, HttpAgent } from "@dfinity/agent";

import { doap, idlFactory } from "../../../../declarations/doap";
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
  let [claimedDOAPs, setClaimedDOAPs] = useState([]);
  let [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const columns = [
    { property: "id", label: "Serial #" },
    { property: "owner", label: "Owner" },
  ];

  // const dip327canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai" //ryjl3-tyaaa-aaaaa-aaaba-cai";
  const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  useEffect(async () => {
    // const isConnected = async ()=>{
    console.log("userEffect");
    if (identity) {
      console.log("idenity loaded");
      setConnected(true);
      setCurrentUserPrincipalId(identity.getPrincipal().toText());
    }
  }, [identity]);

  const getEvent = useCallback(async () => {
    const res = await doap.getEvent(params.eventId);
    console.log("reees", res);
    if (res && res.ok) {
      setEvent(res.ok);
      let ownerP = Principal.fromUint8Array(res.ok.owner._arr).toText();
      setOwnerPrincipal(ownerP);
      const eventNFTs = await dip721.listEventNFTs(params.eventId);
      console.log("getNFTs", eventNFTs);
      if (eventNFTs && eventNFTs.length > 0) {
        setClaimedDOAPs(eventNFTs);
      }
    } else {
    }
  }, []);

  //is current user owner of current event
  useEffect(async () => {
    if (event && identity) {
      if (ownerPrincipal === currentUserPrincipal) {
        setIsOwner(true);
      }
    }
  }, [ownerPrincipal, currentUserPrincipal]);

  //already claimed by current user?
  useEffect(async () => {
    if (claimedDOAPs && currentUserPrincipal) {
      console.log("ddd", currentUserPrincipal);
      let existingNFT = claimedDOAPs.find((d) => {
        let ownerP = Principal.fromUint8Array(d.owner._arr).toText();
        return ownerP === currentUserPrincipal;
      });
      console.log("ll", existingNFT);
      if (existingNFT) {
        setAlreadyClaimed(true);
      }
    }
  }, [claimedDOAPs, currentUserPrincipal]);

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
  };

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
            {connected && event.active && !alreadyClaimed && (
              <Button
                type="submit"
                label="Claim this DOAP"
                primary
                onClick={handleClaim}
              />
            )}
            {connected && event.active && alreadyClaimed && (
              <Button type="submit" label="Already Claimed" />
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
        {event && claimedDOAPs.length > 0 && (
          <Box
            round="medium"
            style={{ backgroundColor: "#B99ACC" }}
            pad="medium"
            direction="column"
            gap="medium"
          >
            <Box align="center" gap="small" pad="small">
              <Heading level={2}>Owned By</Heading>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((c) => (
                      <TableCell key={c.property} scope="col">
                        <Text size="xlarge">{c.label}</Text>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claimedDOAPs.map((nft) => (
                    <TableRow key={Number(nft.id)}>
                      {columns.map((c) => (
                        <TableCell key={Number(nft.id)}>
                          {c.property === "owner" ? (
                            <Text size="large">
                              {Principal.fromUint8Array(
                                nft[c.property]._arr
                              ).toText()}
                            </Text>
                          ) : (
                            <Text size="large">{Number(nft[c.property])}</Text>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
      </Box>
    </main>
  );
}
