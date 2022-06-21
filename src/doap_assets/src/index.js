import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import ErrorBoundary from "./components/error_boundary";
import { Grommet } from "grommet";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Grommet plain>
        <App />
      </Grommet>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("app")
);
