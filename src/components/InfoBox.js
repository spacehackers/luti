import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";

import SettingsContext from "./context";
import InfoButton from "./InfoButton";
import ShareButtons from "./ShareButtons";

import "./InfoBox.scss";

const TRANSITION_SPEED = 500;

export default function InfoBox({ desc, title, url }) {
  const { state, dispatch } = useContext(SettingsContext);
  const { darkMode, infoBoxHeight, newButtonsFlag } = state;

  const [closed, setClosed] = useState(true);
  const [spaceKeyPressed, setSpaceKeyPressed] = useState(false);

  const ref = useRef(null);

  const handleKeyUp = (e) => {
    const body = document.body;

    if (e.keyCode === 9) {
      body.classList.add("using-keyboard");
    }

    if (e.keyCode === 32) {
      if (document.activeElement.classList.contains("leaflet-container")) {
        setSpaceKeyPressed(true);
      }
    }
  };

  const handleMapClick = () => {
    setClosed(true);
  };

  const infoBoxStyles = () => {
    let transition;
    let margins = {};
    if (closed) {
      transition = "margin 300ms";
      margins = { zoomButtons: "32px", controlButtons: "0px" };
    } else {
      transition = "margin 300ms 200ms";
      const zoomButtonMargin = `${infoBoxHeight + 32}px`;
      const controlButtonMargin = `${infoBoxHeight}px`;
      margins = {
        zoomButtons: zoomButtonMargin,
        controlButtons: controlButtonMargin,
      };
    }

    return { margins, transition };
  };

  useEffect(() => {
    if (spaceKeyPressed) {
      setClosed(!closed);
    }
  }, [spaceKeyPressed]);

  useEffect(() => {
    const map = document.getElementsByClassName("leaflet-container")[0];

    map.addEventListener("keyup", handleKeyUp);

    return () => {
      map.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setSpaceKeyPressed(false);
    const height = ref.current.clientHeight;
    dispatch({ type: "INFO_BOX_HEIGHT", payload: height });
  }, [closed]);

  useEffect(() => {
    const zoomButtons = document.querySelector(".leaflet-control-zoom");
    const controlButtons = document.querySelector(".controls");
    if (!infoBoxHeight || !zoomButtons) return;

    const { margins, transition } = infoBoxStyles();

    zoomButtons.style.transition = transition;
    zoomButtons.style.marginBottom = margins.zoomButtons;

    if (newButtonsFlag) {
      controlButtons.style.transition = transition;
      controlButtons.style.marginBottom = margins.controlButtons;
    }
  }, [closed, infoBoxHeight]);

  useEffect(() => {
    const body = document.body;
    body.classList.add("overflow-hidden");

    const map = document.getElementsByClassName("leaflet-container")[0];

    if (closed) {
      document.querySelector(".leaflet-container").focus();
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
          darkMode={darkMode}
          handleClick={() => setClosed(!closed)}
        />
        <div
          ref={ref}
          className={classNames(
            "info-wrapper",
            { dark: darkMode },
            { light: !darkMode }
          )}
        >
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
