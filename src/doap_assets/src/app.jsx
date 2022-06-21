import React from "react";
import Home from "./components/home";
import Greeting from "./components/greeting";
import Events from "./routes/events/Events";
import Event from "./routes/events/event";
import NewEvent from "./routes/events/newEvent";
import Layout from "./components/layout/layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          index
          path="/"
          element={<Home name="Base Dfinity + ReactJs: " />}
        ></Route>
        <Route path="events" element={<Layout />}>
          <Route path=":eventId" element={<Event />} />
          <Route path="new" element={<NewEvent />} />
          <Route index element={<Events />} />
        </Route>
        <Route path="/greeting" element={<Greeting />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
