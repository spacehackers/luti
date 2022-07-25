import React, { useEffect, useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";

import InfoButton from "./InfoButton";
import ShareButtons from "./ShareButtons";

import "./InfoBox.scss";

const TRANSITION_SPEED = 500;

export default function InfoBox({ desc, displayMode, title, url }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const body = document.body;
    body.classList.add("overflow-hidden");

    const map = document.getElementsByClassName("leaflet-container")[0];

    const handleClick = () => {
      setHidden(!hidden);
    };

    if (hidden) {
      map.removeEventListener("click", handleClick);
      map.removeEventListener("touchstart", handleClick);
      map.removeEventListener("touchmove", handleClick);
      return;
    }

    window.setTimeout(() => {
      map.addEventListener("click", handleClick);
      map.addEventListener("touchstart", handleClick);
      map.addEventListener("touchmove", handleClick);
    }, 100);
  }, [hidden]);

  return (
    <CSSTransition in={!hidden} timeout={TRANSITION_SPEED}>
      <div>
        <InfoButton
          displayMode={displayMode}
          handleClick={() => setHidden(!hidden)}
        />
        <div className={classNames("info-wrapper", displayMode)}>
          <div className="info-title">
            <h1>{title}</h1>
          </div>
          <div className="info-description">{desc}</div>
          <ShareButtons url={url} />
        </div>
      </div>
    </CSSTransition>
  );
}

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired,
};
