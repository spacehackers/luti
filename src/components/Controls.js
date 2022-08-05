import React, { useContext } from "react";

import SettingsContext from "./context";

import "./Controls.scss";

export default function Controls() {
  const { state, dispatch } = useContext(SettingsContext);
  const { darkMode, sound, newButtonsFlag } = state;

  if (!newButtonsFlag) return null;

  return (
    <div className="controls">
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch({ type: "SOUND", payload: !sound });
        }}
        type="button"
        className="sound"
        label="toggle sound"
      />

      <button
        onClick={() => dispatch({ type: "DARK_MODE", payload: !darkMode })}
        type="button"
        className="darkMode"
        label="toggle dark mode"
      />
    </div>
  );
}
