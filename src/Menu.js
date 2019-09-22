import React from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";

import "./Menu.scss";

const menuData = [
  { slug: "home", content: "Life Under the Ice" },
  { slug: "about", content: "About the Project" },
  { slug: "thanks", content: "Acknowledgements" }
];

export default class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      selected: "home",
      open: false
    };
  }

  handleMenuClick(e, slug) {
    e.preventDefault();
    if (slug !== "home") return;

    this.setState(
      { selected: slug, open: !this.state.open },
      console.log(this.state)
    );
  }

  hidden(slug) {
    if (this.state.open || slug === "home") return;

    return true;
  }

  renderItem(menuItem, key) {
    const { slug, content } = menuItem;

    return (
      <li
        key={key}
        className={classNames({
          selected: this.state.selected === "slug",
          hidden: this.hidden(slug)
        })}
      >
        <a
          href="#"
          onClick={e => {
            this.handleMenuClick(e, slug);
          }}
        >
          {content}
        </a>
      </li>
    );
  }

  render() {
    return (
      <nav>
        <CSSTransition in={this.state.open} timeout={100}>
          <ul className="menu">
            {menuData.map((menuItem, key) => this.renderItem(menuItem, key))}
          </ul>
        </CSSTransition>
      </nav>
    );
  }
}
