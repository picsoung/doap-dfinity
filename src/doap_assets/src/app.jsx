import React, { useState } from "react";
import Home from "./components/home";
import Greeting from "./components/greeting";
import Events from "./routes/events/Events";
import Event from "./routes/events/event";
import NewEvent from "./routes/events/newEvent";
import Layout from "./components/layout/layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context";

function App() {
  const [identity, setIdentity] = useState(false);
  const login = (data) => {
    setIdentity(data);
  };
  const logout = () => {
    setIdentity(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!identity, login: login, logout: logout, identity: identity }}
    >
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
    </AuthContext.Provider>
  );
}

export default App;
