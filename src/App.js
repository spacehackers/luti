import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";
import ReactGA from "react-ga";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { DARK_MODE_HASH } from "./constants";

// import SettingsContext from "../context";

import Menu from "./components/Menu";
import Homepage from "./Homepage";
import About from "./About";
import Acknowledgements from "./Acknowledgements";
import GAListener from "./GAListener";

import "./App.scss";

const trackingId = "UA-153597890-1";

ReactGA.initialize(trackingId);

// const {
//   state: { darkMode: false, soundOn: true },
//   dispatch,
// } = useContext(SettingsContext);

export default function App() {
  const [hideMap, setHideMap] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const urlHash = window.location.hash;

    if (urlHash === `#${DARK_MODE_HASH}`) {
      setDarkMode(true);
      document.body.classList.add(DARK_MODE_HASH);
    }

    WebFont.load({
      typekit: {
        id: "ikz3unr",
      },
    });

    setHideMap(false);
  }, []);

  return (
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
            <Homepage hidden={hideMap} darkMode={darkMode} />
          </Route>
        </Switch>
      </GAListener>
    </Router>
  );
}
