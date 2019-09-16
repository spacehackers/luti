import React from "react";

import MenuItem from "./MenuItem";
import "./Menu.scss";

const menuData = [
  { slug: "home", copy: "Life Under the Ice" },
  { slug: "about", copy: "About the Project" },
  { slug: "thanks", copy: "Acknowledgements" }
];

export default class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      selected: "home"
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick(e, slug) {
    e.preventDefault();

    console.log(slug);
    this.setState({ selected: slug });
  }

  render() {
    return (
      <nav>
        <ul className="menu">
          {menuData.map((menuItem, key) => (
            <MenuItem
              key={key}
              slug={menuItem.slug}
              copy={menuItem.copy}
              selected={this.state.selected === menuItem.slug}
              onMenuClick={this.handleMenuClick}
            />
          ))}
        </ul>
      </nav>
    );
  }
}
