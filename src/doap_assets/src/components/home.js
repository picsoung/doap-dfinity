import React, { Fragment } from "react";
import { Outlet, Link } from "react-router-dom";

function Home({ name }) {
  return (
    <Fragment>
      <div>Home {name}</div>
      <Link to="/greeting">Greeting</Link>
      <Outlet />
    </Fragment>
  );
}

export default Home;
