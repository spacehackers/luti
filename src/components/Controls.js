import React, { useContext } from "react";
import SettingsContext from "./context";

import "./Controls.scss";

export default function Controls() {
  const { state, dispatch } = useContext(SettingsContext);
  const { darkMode, sound } = state;

  return (
    <div className="controls">
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "SOUND", payload: !sound });
          }}
          type="button"
          className="sound"
          label="toggle sound"
        />
      </div>

      <div>
        <button
          onClick={() => dispatch({ type: "DARK_MODE", payload: !darkMode })}
          type="button"
          className="darkMode"
          label="toggle dark mode"
        />
      </div>
    </div>
  );
}
