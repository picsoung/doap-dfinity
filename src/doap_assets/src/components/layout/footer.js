import React from "react";
import { Box, Paragraph, Heading, Image } from "grommet";

const Footer = () => (
  <Box direction="row" pad="small" justify="center" align="center" style={{backgroundColor:"#3A2A45"}}>
    <Box width="xlarge" align="start" direction="column" pad="small">
      <Heading level={4}>Doaps are dope</Heading>
    </Box>
    <Box width="xlarge" direction="column" align="end" pad="small">
      <Box direction="row" align="end">
        <a href="https://twitter.com/@picsoung">
          <Image
            style={{ maxWidth: "50%" }}
            src="https://simplesharebuttons.com/images/somacro/twitter.png"
            alt="buffer"
          />
        </a>
      </Box>
    </Box>
  </Box>
);

export default Footer;
