import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Header,
  Anchor,
  Nav,
} from "grommet";
import ConnectionBadge from "../connectionBadge";

import DoapLogo from "../../../assets/doap_logo.png";

export default function SiteHeader({ siteName }) {
  const [websiteName, setWebsiteName] = useState(siteName);

  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState("");
  const network = "https://mainnet.dfinity.network/";
  const whitelist = [
    process.env.PLUG_COIN_FLIP_CANISTER_ID || "ryjl3-tyaaa-aaaaa-aaaba-cai",
  ];

  const handleConnect = async () => {
    setConnected(true);

    if (!window.ic.plug.agent) {
      const whitelist = [
        process.env.PLUG_COIN_FLIP_CANISTER_ID || "ryjl3-tyaaa-aaaaa-aaaba-cai",
      ];
      await window.ic?.plug?.createAgent(whitelist);
    }

    // Create an actor to interact with the NNS Canister
    // we pass the NNS Canister id and the interface factory
    // const NNSUiActor = await window.ic.plug.createActor({
    //   canisterId: process.env.PLUG_COIN_FLIP_CANISTER_ID,
    //   interfaceFactory: idlFactory,
    // });

    // setActor(NNSUiActor);
  };

  useEffect(async () => {
    if (!window.ic?.plug?.agent) {
      //   setActor(false);
      setConnected(false);
      window.location.hash = "/connect";
    }
  }, []);

  useEffect(async () => {
    if (connected) {
      const principal = await window.ic.plug.agent.getPrincipal();

      if (principal) {
        setPrincipalId(principal.toText());
      }
    } else {
      window.location.hash = "/connect";
    }
  }, [connected]);

  return (
    <Header background="#3A2A45" pad="medium" height="xsmall">
      <Box direction="row">
      <Anchor href="/"><Image src={DoapLogo} style={{ margin: 0, width: "200px" }} /></Anchor>
        <Box direction="row" pad="medium" gap="medium">
          <Anchor href="/events" label="Events" />
          <Anchor href="/events/new" label="New event" />
        </Box>
        {/* <Box justify="end"> */}
          <ConnectionBadge principalId={principalId} />
        {/* </Box> */}
      </Box>
    </Header>
  );
}
