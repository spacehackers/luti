import React from "react"
import classNames from "classnames"
import { CSSTransition } from "react-transition-group"
import { TRANSITION_SPEED } from "./constants.js"

import "./Menu.scss"

const menuData = [
  { slug: "anchor", content: "Life Under the Ice" },
  { slug: "home", content: "Home" },
  { slug: "about", content: "About the Project" },
  { slug: "thanks", content: "Acknowledgements" }
]

export default class Menu extends React.Component {
  constructor() {
    super()

    this.state = {
      selected: "anchor",
      open: false
    }
  }

  handleMenuClick(e, slug) {
    e.preventDefault()
    const open = slug === "anchor" ? !this.state.open : this.state.open

    this.setState({ selected: slug, open: open })
  }

  hidden(slug) {
    if (this.state.open || slug === "anchor") return

    return true
  }

  renderItem(menuItem, key) {
    const { slug, content } = menuItem
    const selected = this.state.selected === slug

    return (
      <li
        key={key}
        className={classNames({
          selected: selected,
          hidden: this.hidden(slug)
        })}
      >
        <a
          href="#"
          onClick={e => {
            this.handleMenuClick(e, slug)
          }}
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
