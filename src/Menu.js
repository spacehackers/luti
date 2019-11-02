import React from "react"
import classNames from "classnames"
import { CSSTransition } from "react-transition-group"
import { TRANSITION_SPEED } from "./constants.js"

import "./Menu.scss"

const menuData = [
  { slug: "anchor", content: "Life Under the Ice" },
  { slug: "home", content: "Home" },
  { slug: "about", content: "About the Project" },
  { slug: "acknowledgements", content: "Acknowledgements" }
]

export default class Menu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: "",
      open: false,
      tabKeyPress: false
    }
  }

  componentDidMount() {
    this.setState({ selected: this.props.page })
  }

  handleMenuClick(e, slug) {
    switch (slug) {
      case "anchor":
        e.preventDefault()
        const open = !this.state.open
        this.setState({ open: open })
        break

      default:
        this.setState({ selected: slug })
    }
  }

  hidden(slug) {
    if (this.state.open || slug === "anchor") return

    return true
  }

  handleTabNavigation = e => {
    if (e.which !== 9) return
    if (this.state.open) return

    if (!this.state.tabKeyPress) {
      this.setState({ tabKeyPress: true })
      return
    }

    if (this.state.tabKeyPress) {
      // this is a 2nd consecutive tab press
      const focusTarget = document.getElementsByClassName("leaflet-container")
      focusTarget[0].focus()

      this.setState({ tabKeyPress: false })
    }
  }

  renderItem(menuItem, key) {
    const { slug, content } = menuItem
    const hash = "" // window.location.hash

    const selected = slug === this.state.selected
    return (
      <li
        key={key}
        className={classNames({
          selected,
          hidden: this.hidden(slug)
        })}
      >
        <a
          href={slug === "home" ? "/" : `/${slug}#${hash}`}
          onClick={e => {
            this.handleMenuClick(e, slug)
          }}
          onKeyUp={this.handleTabNavigation}
        >
          {content}
        </a>
      </li>
    )
  }

  render() {
    return (
      <nav>
        <CSSTransition in={this.state.open} timeout={TRANSITION_SPEED}>
          <ul className="menu">
            {menuData.map((menuItem, key) => this.renderItem(menuItem, key))}
          </ul>
        </CSSTransition>
      </nav>
    )
  }
}
