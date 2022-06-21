import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import PlugConnect from "@psychedelic/plug-connect";
import Layout from "./layout/layout";

import { Box, Header, Main, Text, Image, Heading, Button } from "grommet";

import { doap } from "../../../declarations/doap";
import { dip721 } from "../../../declarations/dip721";

function Home({ name }) {
  const [connected, setConnected] = useState(false);
  const [nbEvents, setNbEvents] = useState(0);
  const [nbNFTs, setNbNFTs] = useState(0);
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

  const getNbEvents = useCallback(async () => {
    const res = await doap.getEventsCount();
    setNbEvents(Number(res));
  }, []);

  const getNbNFTs = useCallback(async () => {
    const res = await dip721.totalSupplyDip721();
    console.log('nft', res, typeof res)
    setNbNFTs(Number(res));
  }, []);

  useEffect(() => {
    getNbEvents();
    getNbNFTs();
  }, []);

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
          <Link to="/events/new"><Button primary label="Create an event" /></Link>
          <Link to="/events"><Button primary label="All events" /></Link>
        </Box>
      </Box>
      <Box pad="small" gap="small" direction="row" align="start">
        <Box>
          <Heading level={5}>DOAPs claimed</Heading>
          <Heading level={2}>{nbNFTs}</Heading>
        </Box>
        <Box>
          <Heading level={5}>Events created</Heading>
          <Heading level={2}>{nbEvents}</Heading>
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
    </Layout>
  );
}

export default Home;
