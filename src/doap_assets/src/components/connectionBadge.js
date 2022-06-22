import React, { useState, useEffect } from "react";
import { Button, Text, Layer, Heading, Box } from "grommet";
import "../style/badge.css";

import { StoicIdentity } from "ic-stoic-identity";
import "../style/badge.css";

import { useAuthContext } from "../context";

const ConnectionBadge = () => {
  const { login, logout, identity } = useAuthContext();
  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState("");
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  useEffect(async () => {
    const identity = await StoicIdentity.load();
    if (identity) {
      // setConnected(true);
      setPrincipalId(identity.getPrincipal().toText());
      login(identity);
    }
  }, []);

  const shortPrincipal = (principal) =>
    `${principal.substr(0, 8)}...${principal.substr(-4)}`;

  const handleConnect = async () => {
    let identity = await StoicIdentity.load();
    console.log("identity", identity);
    if (!identity) {
      identity = await StoicIdentity.connect();
    }
    login(identity);
    setPrincipalId(identity.getPrincipal().toText());
    // //Create an actor canister
    // const actor = await Actor.createActor(idlFactory, {
    //   agent: new HttpAgent({
    //     identity,
    //     host: "http://localhost:8000",
    //   }),
    //   canisterId,
    // });
    // console.log("acctor", actor);
  };

  const handleModal = () => {
    setShowDisconnectModal(!showDisconnectModal);
  };
  const handleDisConnect = () => {
    StoicIdentity.disconnect();
    logout();
    setShowDisconnectModal(!showDisconnectModal);
  };

  return (
    <>
      <div className="connection-badge">
        <div className="connection-row">
          <div className={`principal-badge ${!identity && "not-connected"}`}>
            <div className="connection-dot" />
            {identity ? (
              <Text onClick={handleModal}>{shortPrincipal(principalId)}</Text>
            ) : (
              <Button label="Connect to wallet" onClick={handleConnect} />
            )}
          </div>
        </div>
      </div>
      {showDisconnectModal && (
        <Layer>
          <Box
            align="center"
            justify="center"
            gap="small"
            direction="column"
            alignSelf="center"
            pad="large"
          >
            <Heading level={2}>Do you want to disconnect?</Heading>
            <Box
              align="center"
              justify="center"
              gap="small"
              direction="column"
              alignSelf="center"
            >
              <Button label="Disconnect" onClick={handleDisConnect} />
              <Button label="Cancel" onClick={handleModal} />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default ConnectionBadge;
