import React from "react";
import Home from "./components/home";
import Greeting from "./components/greeting";
import Events from "./routes/Events";
import Event from "./routes/Event";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<Home name="Base Dfinity + ReactJs: " />}
        >
          <Route path="/greeting" element={<Greeting />} />
          <Route path="events" element={<Events />}/>
          <Route path="/events/:eventId" element={<Event />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
