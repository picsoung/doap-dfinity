import React, { useEffect, useCallback, useState } from "react";

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
  Spinner,
} from "grommet";

import { useParams, Link } from "react-router-dom";
import DayJS from "dayjs";

import { doap } from "../../../../declarations/doap";
import { Principal } from '@dfinity/principal';


export default function Event() {
  let params = useParams();

  const [event, setEvent] = useState([]);
  const [ownerPrincipal, setOwnerPrincipal] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);

  const getEvent = useCallback(async () => {
    const res = await doap.getEvent(params.eventId);
    console.log("reees", res);
    if (res && res.ok) {
      setEvent(res.ok);
      // let k = new Principal()
      setOwnerPrincipal(Principal.fromUint8Array(res.ok.owner._arr).toText())
    } else {
    }
  }, []);

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <main style={{ padding: "1rem" }}>
      {event && (
        <Box>
          <Box style={{ backgroundColor: "red" }}>
            <Heading level={1}>{event.name}</Heading>
            <Heading level={5}>DOAP event #{event.uid}</Heading>
            <Heading level={5}>
              Created{" "}
              {DayJS(Number(event.dateCreated) / 1000000).format(
                "MM/DD/YYYY, HH:mm:ssa"
              )}
            </Heading>
          </Box>
          <Box>
            <Image src={event.image}/>
            <Heading level={2}>{event.name}</Heading>
            <Heading level={5}>Created by</Heading>
            <Heading level={5}>{ownerPrincipal}</Heading>
          </Box>
          <Box>
            <Heading level={2}>Description</Heading>
            <Heading level={5}>{event.description}</Heading>
            <Heading level={5}><a href={event.url } target="_blank" >Website</a></Heading>
          </Box>
          {event.active && (
            <Button type="submit" label="Claim this DOAP" primary/>
          )}
        </Box>
      )}
    </main>
  );
}
