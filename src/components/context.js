import React from "react";

const SettingsContext = React.createContext({
  darkMode: false,
  sound: false,
  infoBoxHeight: null,
  newButtonsFlag: false,
});

export default SettingsContext;
