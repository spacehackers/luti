import React from "react";
import WebFont from "webfontloader";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Menu from "./Menu";
import Homepage from "./Homepage";
import About from "./About";
import Acknowledgements from "./Acknowledgements";
import PasswordPrompt from "./PasswordPrompt";

import "./App.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideMap: true
    };

    WebFont.load({
      typekit: {
        id: "ikz3unr"
      }
    });
  }

  componentDidMount() {
    // redirect to home on reload from localhost with hash
    // great for debugging and maybe a feature?
    // if (window.location.hash && document.referrer.includes("localhost")) {
    //   document.location.href = "/"
    // }

    window.setTimeout(() => {
      this.setState({ hideMap: false });
    }, 500);
  }

  render() {
    return (
      <PasswordPrompt>
        <Router>
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
              <Menu page="about" />
              <About />
            </Route>
            <Route path="/thanks">
              <Menu page="thanks" />
              <Acknowledgements />
            </Route>
            <Route path="/:x?/:y?">
              <Menu page="home" />
              <Homepage hidden={this.state.hideMap} />
            </Route>
          </Switch>
        </Router>
      </PasswordPrompt>
    );
  }
}
