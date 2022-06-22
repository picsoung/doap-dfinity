import React from "react";
import { Grommet, Box } from "grommet";
// import { materiallight } from 'grommet-controls/themes';
import { Outlet, Link } from "react-router-dom";

import Header from "./header.js";
import Footer from "./footer.js";

const Layout = (props) => (
  <Grommet full={true}>
    <Header siteName={props.siteName} />
    <Box justify="center" align="center" pad="xxsmall" style={{ minHeight: "90%", marginBottom: "-50px" }}>
      {props.children}
      <Outlet />
    </Box>
    <Footer />
  </Grommet>
);

export default Layout;
