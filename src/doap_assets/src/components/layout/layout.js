import React from "react";
import { Grommet, Box } from "grommet";
// import { materiallight } from 'grommet-controls/themes';
import { Outlet, Link } from "react-router-dom";

import Header from "./header.js";
import Footer from "./footer.js";

const Layout = (props) => (
  <Grommet full={true}>
    <Header siteName={props.siteName} />
    <Box justify="center" align="center" pad="xxsmall">
      {props.children}
      <Outlet/>
      <Footer />
    </Box>
  </Grommet>
);

export default Layout;
