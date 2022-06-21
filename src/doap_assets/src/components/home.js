import React, { Fragment, useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import PlugConnect from "@psychedelic/plug-connect";
import Layout from "./layout/layout";

import { Box, Header, Main, Text, Image, Heading, Button } from "grommet";

function Home({ name }) {
  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState("");
  const network = "https://mainnet.dfinity.network/";
  const whitelist = [
    process.env.PLUG_COIN_FLIP_CANISTER_ID || "rkp4c-7iaaa-aaaaa-aaaca-cai",
  ];

  const handleConnect = async () => {
    setConnected(true);

    if (!window.ic.plug.agent) {
      const whitelist = [
        process.env.PLUG_COIN_FLIP_CANISTER_ID || "rkp4c-7iaaa-aaaaa-aaaca-cai",
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

  //   useEffect(async () => {
  //     if (!window.ic?.plug?.agent) {
  //     //   setActor(false);
  //       setConnected(false);
  //       window.location.hash = '/connect';
  //     }
  //   }, []);

  //   useEffect(async () => {
  //     if (connected) {
  //       const principal = await window.ic.plug.agent.getPrincipal();

  //       if (principal) {
  //         setPrincipalId(principal.toText());
  //       }
  //     } else {
  //       window.location.hash = '/connect';
  //     }
  //   }, [connected]);

  return (
    <Layout>
      <Box pad="small" gap="small" direction="row" align="start">
        <Box>
          <Image
            fallback="//v2.grommet.io/assets/IMG_4245.jpg"
            src="//v2.grommet.io/assets/IMG_4245_not_exists.jpg"
          />
        </Box>
        <Box>
          <Heading level={1}>Welcome to DOAP</Heading>
          <Heading level={3}>Claim unique NFT for attending events</Heading>
          <Button primary label="Create an event" />
        </Box>
      </Box>
      <Box pad="small" gap="small" direction="row" align="start">
        <Box>
          <Heading level={5}>DOAPs claimed</Heading>
          <Heading level={2}>5,002</Heading>
        </Box>
        <Box>
          <Heading level={5}>Events created</Heading>
          <Heading level={2}>200</Heading>
        </Box>
      </Box>
      {/* <ConnectionBadge principalId={principalId} /> */}
      {connected ? (
        "ssss"
      ) : (
        <PlugConnect
          host={network}
          whitelist={whitelist}
          dark
          onConnectCallback={handleConnect}
        />
      )}

      <Link to="/greeting">Greeting</Link>
      <Outlet />
    </Layout>
  );
}

export default Home;
