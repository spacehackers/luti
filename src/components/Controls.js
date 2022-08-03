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
export default function Controls({ toggleDarkMode }) {
  return (
    <div className="controls">
      <button
        onClick={toggleDarkMode}
        type="button"
        className="sound"
        label="toggle sound"
      />
    </div>
  );
}

Controls.propTypes = {};
