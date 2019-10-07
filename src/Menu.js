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
      open: false
    }
  }

  componentDidMount() {
    this.setState({ selected: this.props.page })
  }

  handleMenuClick(e, slug) {
    if (slug === "anchor") {
      e.preventDefault()
      const open = !this.state.open
      this.setState({ open: open })
    } else {
      this.setState({ selected: slug })
    }
  }

  hidden(slug) {
    if (this.state.open || slug === "anchor") return

    return true
  }

  renderItem(menuItem, key) {
    const { slug, content } = menuItem

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
          href={slug === "home" ? "/" : `/${slug}`}
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
