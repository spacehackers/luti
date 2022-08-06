import React, { useContext } from "react";

import Control from "react-leaflet-control";
import SettingsContext from "./context";

import "./Controls.scss";

export default function Controls() {
  const { state, dispatch } = useContext(SettingsContext);
  const { darkMode, sound, newButtonsFlag } = state;

  if (!newButtonsFlag) return null;

  return (
    <Control position="bottomright">
      <div className="controls">
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "SOUND", payload: !sound });
          }}
          type="button"
          className="sound"
          aria-label={`turn ${sound ? "off" : "on"} sound`}
        />

        <button
          onClick={() => dispatch({ type: "DARK_MODE", payload: !darkMode })}
          type="button"
          className="darkMode"
          aria-label={`turn ${darkMode ? "off" : "on"} dark mode`}
        />
      </div>
    </Control>
  );
}
