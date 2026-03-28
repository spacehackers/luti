import React from "react";
import WebFont from "webfontloader";
import ReactGA from "react-ga";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DARK_MODE_HASH, LIGHT_MODE_HASH } from "./constants";

import Menu from "./components/Menu";
import Homepage from "./Homepage";
import About from "./About";
import Acknowledgements from "./Acknowledgements";
import GAListener from "./GAListener";

import "./App.scss";

const trackingId = "UA-153597890-1";

if (process.env.NODE_ENV !== "test") {
  ReactGA.initialize(trackingId);
}

function VideoRedirect() {
  React.useEffect(() => {
    window.location.href =
      "//www.youtube.com/channel/UCsQ5-o7tNvSxfAl8YjplKnw/";
  }, []);

  return null;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideMap: true,
      displayMode: LIGHT_MODE_HASH.slice(1),
    };

    WebFont.load({
      typekit: {
        id: "ikz3unr",
      },
    });
  }

  componentDidMount() {
    const urlHash = window.location.hash;

    if (urlHash === DARK_MODE_HASH) {
      const displayMode = DARK_MODE_HASH.slice(1);
      this.setState({ displayMode });
      document.body.classList.add(displayMode);
    }

    window.setTimeout(() => {
      this.setState({ hideMap: false });
    }, 500);
  }

  render() {
    return (
      <Router>
        <GAListener>
          <Routes>
            <Route path="/videos" element={<VideoRedirect />} />
            <Route
              path="/about"
              element={
                <>
                  <Menu page="about" displayMode={this.state.displayMode} />
                  <About displayMode={this.state.displayMode} />
                </>
              }
            />
            <Route
              path="/thanks"
              element={
                <>
                  <Menu page="thanks" displayMode={this.state.displayMode} />
                  <Acknowledgements displayMode={this.state.displayMode} />
                </>
              }
            />
            <Route
              path="/:x?/:y?/:hash?"
              element={
                <>
                  <Menu page="home" displayMode={this.state.displayMode} />
                  <Homepage
                    hidden={this.state.hideMap}
                    displayMode={this.state.displayMode}
                  />
                </>
              }
            />
          </Routes>
        </GAListener>
      </Router>
    );
  }
}
