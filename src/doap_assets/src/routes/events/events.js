import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import DayJS from "dayjs";
import { Link, Outlet } from "react-router-dom";
// import { doap } from "../services/wrapper";
import { doap } from "../../../../declarations/doap";

import {
  Box,
  Button,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from "grommet";

export default function Events() {
  const [events, setEvents] = useState([]);
  const columns = [
    { property: "name", label: "Event name" },
    { property: "active", label: "Active" },
    { property: "dateCreated", label: "Created At" },
  ];

  const getEvents = useCallback(async () => {
    const res = await doap.getEvents();
    console.log("reees", res);
    //getEvents returns an array of array
    let flatEvents = res.flat().filter((a) => typeof a != "string");
    flatEvents = flatEvents.sort((a, b) => {
      return Number(b.dateCreated) - Number(a.dateCreated);
    });
    setEvents(flatEvents);
  }, []);

  useEffect(() => {
    getEvents();
  }, []);

  //   let events = getEvents();
  return (
    <Box style={{ display: "flex" }} direction="column" gap="medium">
      <Heading level={1}>All DOAP events</Heading>
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
          {events.map((event) => (
            <TableRow key={event.uid}>
              {columns.map((c) => (
                <TableCell key={c.property}>
                  {(() => {
                    switch (c.property) {
                      case "name":
                        return (
                          <Link key={event.name} to={`/events/${event.uid}`}>
                            <Text size="large">{event[c.property]}</Text>
                          </Link>
                        );
                      case "active":
                        return (
                          <Text size="large">{event.active ? "✅" : "🛑"}</Text>
                        );
                      case "dateCreated":
                        return (
                          <Text size="large">
                            {DayJS(Number(event.dateCreated) / 1000000).format(
                              "MM/DD/YYYY, HH:mm:ssa"
                            )}
                          </Text>
                        );
                      default:
                        null;
                    }
                  })()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link to="/events/new">
        <Button size="medium" primary label="Create an event" />
      </Link>
    </Box>
  );
}
