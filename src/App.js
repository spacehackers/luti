import React from "react";
import WebFont from "webfontloader";
import ReactGA from "react-ga";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { DARK_MODE_HASH, LIGHT_MODE_HASH } from "./constants.js";

import Menu from "./Menu";
import Homepage from "./Homepage";
import About from "./About";
import Acknowledgements from "./Acknowledgements";
import GAListener from "./GAListener";

import "./App.scss";

const trackingId = "UA-153597890-1";

ReactGA.initialize(trackingId);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideMap: true,
      displayMode: LIGHT_MODE_HASH.slice(1)
    };

    WebFont.load({
      typekit: {
        id: "ikz3unr"
      }
    });
  }

  componentDidMount() {
    const urlHash = window.location.hash

    if (urlHash === DARK_MODE_HASH) {
      const displayMode = DARK_MODE_HASH.slice(1)
      this.setState({ displayMode: displayMode })
      document.body.classList.add(displayMode)
    }

    window.setTimeout(() => {
      this.setState({ hideMap: false })
    }, 500);
  }

  render() {
    return (
      <Router>
        <GAListener>
          <Switch>
            <Route
              path="/videos"
              component={() => {
                window.location.href =
                  "//www.youtube.com/channel/UCsQ5-o7tNvSxfAl8YjplKnw/"
                return null;
              }}
            />

            <Route path="/about">
              <Menu page="about" displayMode={this.state.displayMode} />
              <About displayMode={this.state.displayMode} />
            </Route>
            <Route path="/thanks">
              <Menu page="thanks" displayMode={this.state.displayMode} />
              <Acknowledgements displayMode={this.state.displayMode} />
            </Route>
            <Route path="/:x?/:y?/:hash?">
              <Menu page="home" displayMode={this.state.displayMode} />
              <Homepage
                hidden={this.state.hideMap}
                displayMode={this.state.displayMode}
              />
            </Route>
          </Switch>
        </GAListener>
      </Router>
    );
  }
}
