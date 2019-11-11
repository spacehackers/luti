import React from "react"

import "./Info.scss"

export default class Info extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleClick(e) {
    const url = window.location.href

    alert(url)
  }

  getAriaLabel() {
    if (this.state.open) {
      return "click for info"
    }
    return "close info"
  }

  render() {
    return (
      <button className="info-button" onClick={this.handleClick}>
        <img
          className="info-toggle"
          src="LUTI_WhatsThis.svg"
          aria-label={this.getAriaLabel()}
          alt=""
        />
      </button>
    )
  }
}
