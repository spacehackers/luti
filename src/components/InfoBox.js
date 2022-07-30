import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";

import InfoButton from "./InfoButton";
import ShareButtons from "./ShareButtons";

import "./InfoBox.scss";

const TRANSITION_SPEED = 500;

export default function InfoBox({ desc, displayMode, title, url }) {
  const [closed, setClosed] = useState(true);

  const ref = useRef(null);

  const setKeyboardUser = (e) => {
    const body = document.body;

    if (e.keyCode === 9) {
      body.classList.add("using-keyboard");
    }
  };

  useEffect(() => {
    const map = document.getElementsByClassName("leaflet-container")[0];

    map.addEventListener("keyup", setKeyboardUser);

    return () => {
      map.removeEventListener("keyup", setKeyboardUser);
    };
  }, []);

  useEffect(() => {
    const intro = document.querySelector(".leaflet-control-zoom");
    const height = ref.current.clientHeight;

    if (!height || !intro) return;

    if (closed) {
      intro.style.transition = "margin 300ms";
      intro.style.marginBottom = "80px"; // .leaflet-bottom .leaflet-control in App.scss
    } else {
      intro.style.transition = "margin 300ms 200ms";
      intro.style.marginBottom = `${height + 64}px`;
    }
  }, [closed]);

  useEffect(() => {
    const body = document.body;
    body.classList.add("overflow-hidden");

    const map = document.getElementsByClassName("leaflet-container")[0];

    const handleMapClick = () => {
      setClosed(!closed);
    };

    if (closed) {
      document.querySelector(".leaflet-container").focus();
      map.removeEventListener("click", handleMapClick);
      map.removeEventListener("touchstart", handleMapClick);
      map.removeEventListener("touchmove", handleMapClick);
    } else {
      map.addEventListener("click", handleMapClick);
      map.addEventListener("touchstart", handleMapClick);
      map.addEventListener("touchmove", handleMapClick);
    }

    return () => {
      map.removeEventListener("click", handleMapClick);
      map.removeEventListener("touchstart", handleMapClick);
      map.removeEventListener("touchmove", handleMapClick);
    };
  }, [closed]);

  return (
    <CSSTransition in={!closed} timeout={TRANSITION_SPEED}>
      <div>
        <InfoButton
          displayMode={displayMode}
          handleClick={() => setClosed(!closed)}
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
