// import React, { useEffect, useRef, useState } from "react";
import React from "react";
// import PropTypes from "prop-types";

import "./Controls.scss";

// export default function Controls({
//   displayMode,
//   soundEnabled,
//   toggleSound,
//   toggleDarkMode,
// }) {
export default function Controls({ toggleDarkMode, toggleSound }) {
  return (
    <div className="controls">
      <div>
        <button
          onClick={toggleSound}
          type="button"
          className="sound"
          label="toggle sound"
        />
      </div>

      <div>
        <button
          onClick={toggleDarkMode}
          type="button"
          className="darkMode"
          label="toggle dark mode"
        />
      </div>
    </div>
  );
}

Controls.propTypes = {};
