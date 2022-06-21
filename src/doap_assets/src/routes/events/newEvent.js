import React, { Fragment, useState, useEffect, useCallback } from "react";
// import { getInvoices } from "../data";
import { Link, Outlet } from "react-router-dom";
// import { doap } from "../services/wrapper";
import { doap } from "../../../../declarations/doap";
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
} from "grommet";

export default function NewEvent() {
  //   let events = getEvents();
  const createNewEvent = useCallback(async (eventDetails) => {
    const res = await doap.createEvent('kiki123',{open:null}, eventDetails.name, eventDetails.description, eventDetails.image, 0);
    // createEvent(_uid: Text, _eventType: ClaimOptions, _name: Text, _description: Text, _image: Text, _timePeriod: Int)
    console.log("reees", res);
  }, []);

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
          <TextInput name="URL" required/>
        </FormField>
        <FormField label="Event image URL" name="event_image">
          <TextInput name="image"required />
        </FormField>
        <Box direction="row" justify="between" margin={{ top: "medium" }}>
          <Button label="Cancel" />
          <Button type="submit" label="Update" primary />
        </Box>
      </Form>
    </Box>
  );
}
