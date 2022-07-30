import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";

import InfoButton from "./InfoButton";
import ShareButtons from "./ShareButtons";

import "./InfoBox.scss";

const TRANSITION_SPEED = 500;

export default function InfoBox({ desc, displayMode, title, url }) {
  const [hidden, setHidden] = useState(true);

  const ref = useRef(null);

  useEffect(() => {
    const intro = document.querySelector(".leaflet-control-zoom");
    const height = ref.current.clientHeight;

    if (!height || !intro) return;

    if (hidden) {
      intro.style.transition = "margin 300ms";
      intro.style.marginBottom = "80px"; // .leaflet-bottom .leaflet-control in App.scss
    } else {
      intro.style.transition = "margin 300ms 200ms";
      intro.style.marginBottom = `${height + 64}px`;
    }
  }, [hidden]);

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
        <div ref={ref} className={classNames("info-wrapper", displayMode)}>
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
