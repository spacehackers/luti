import React, { useContext, useEffect, useReducer, useState } from "react";
import WebFont from "webfontloader";
import ReactGA from "react-ga";
import queryString from "query-string";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { DARK_MODE_HASH } from "./constants";

import SettingsContext from "./components/context";
import settingsReducer from "./components/reducer";

import Controls from "./components/Controls";
import Menu from "./components/Menu";
import Homepage from "./Homepage";
import About from "./About";
import Acknowledgements from "./Acknowledgements";
import GAListener from "./GAListener";

import "./App.scss";

const trackingId = "UA-153597890-1";

ReactGA.initialize(trackingId);

export default function App() {
  const initialState = useContext(SettingsContext);
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const { darkMode, sound } = state;

  const [hideMap, setHideMap] = useState(true);

  useEffect(() => {
    WebFont.load({
      typekit: {
        id: "ikz3unr",
      },
    });

    const urlHash = window.location.hash;
    if (urlHash === `#${DARK_MODE_HASH}`) {
      dispatch({ type: "DARK_MODE", payload: true });
    }

    const query = queryString.parse(window.location.search);
    if (query.sound === "true" || query.sound === "on") {
      dispatch({ type: "SOUND", payload: true });
    }

    setHideMap(false);
  }, []);

  useEffect(() => {
    window.location.hash = darkMode ? "dark" : "";
  }, [darkMode]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("sound", sound);

    const mode = darkMode ? "dark" : "";
    const newUrl = `?${queryParams.toString()}#${mode}`;

    window.history.pushState({ path: newUrl }, "", newUrl);
  }, [sound]);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      <Router>
        <GAListener>
          <Switch>
            <Route
              path="/videos"
              component={() => {
                window.location.href =
                  "//www.youtube.com/channel/UCsQ5-o7tNvSxfAl8YjplKnw/";
                return null;
              }}
            />

            <Route path="/about">
              <Menu page="about" darkMode={darkMode} />
              <About darkMode={darkMode} />
            </Route>
            <Route path="/thanks">
              <Menu page="thanks" darkMode={darkMode} />
              <Acknowledgements darkMode={darkMode} />
            </Route>
            <Route path="/:x?/:y?/:hash?">
              <Menu page="home" darkMode={darkMode} />
              <Controls />
              <Homepage
                key="1"
                enabled={state.sound}
                hidden={hideMap}
                darkMode={darkMode}
              />
            </Route>
          </Switch>
        </GAListener>
      </Router>
    </SettingsContext.Provider>
  );
}
