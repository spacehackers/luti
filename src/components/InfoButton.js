import React from "react";

import "./InfoButton.scss";

export default function InfoButton({ displayMode, handleClick }) {
  const img =
    displayMode === "dark" ? "/LUTI_WhatsThis5.svg" : "/LUTI_WhatsThis5.svg"; // todo: update with dark mode svg

  const ariaLabel = "What's this?";

  return (
    <button type="button" className="info-button" onClick={handleClick}>
      <img className="info-toggle" src={img} aria-label={ariaLabel} alt="" />
    </button>
  );
}
