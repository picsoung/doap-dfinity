import React from "react";
import "../style/badge.css";

const ConnectionBadge = ({ principalId }) => {
  const shortPrincipal = (principal) =>
    `${principal.substr(0, 8)}...${principal.substr(-4)}`;
    
  return (
    <div className="connection-badge">
      <div className="connection-row">
        <div
          className={`principal-badge ${
            !principalId.length && "not-connected"
          }`}
        >
          <div className="connection-dot" />
          {principalId.length ? shortPrincipal(principalId) : "Not Connected"}
        </div>
      </div>
    </div>
  );
};

export default ConnectionBadge;
