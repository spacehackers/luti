import React from "react"
import WebFont from "webfontloader"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Menu from "./Menu"
import Homepage from "./Homepage"
import About from "./About"
import Acknowledgements from "./Acknowledgements"

import "./App.scss"

export default class App extends React.Component {
  constructor(props) {
    super(props)

    WebFont.load({
      typekit: {
        id: "ikz3unr"
      },
      timeout: 7000
    })
  }

  componentDidMount() {
    // redirect to home on reload from localhost with hash
    // great for debugging and maybe a feature?
    // if (window.location.hash && document.referrer.includes("localhost")) {
    //   document.location.href = "/"
    // }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/about">
            <Menu page="about" />
            <About />
          </Route>
          <Route path="/acknowledgements">
            <Menu page="acknowledgements" />
            <Acknowledgements />
          </Route>
          <Route path="/">
            <Menu page="home" />
            <Homepage />
          </Route>
        </Switch>
      </Router>
    )
  }
}
