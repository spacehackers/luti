import React from "react";

const SettingsContext = React.createContext({
  darkMode: false,
  sound: false,
  infoBoxHeight: null,
});

export default SettingsContext;
