import React from "react";

import "./InfoButton.scss";

export default function InfoButton({ darkMode, handleClick }) {
  const img =
    darkMode === true ? "/LUTI_WhatsThis5.svg" : "/LUTI_WhatsThis5.svg"; // todo: update with dark mode svg

  const ariaLabel = "What's this?";

  return (
    <button type="button" className="info-button" onClick={handleClick}>
      <img className="info-toggle" src={img} aria-label={ariaLabel} alt="" />
    </button>
  );
}
