import React from "react";
import classNames from "classnames";

import { CSSTransition } from "react-transition-group";
import { TRANSITION_SPEED, MOBILE_BREAKPOINT } from "../constants";

import "./Menu.scss";

const menuData = [
  { slug: "anchor", content: "Life Under the Ice" },
  { slug: "home", content: "Home" },
  { slug: "about", content: "About the Project" },
  { slug: "thanks", content: "Acknowledgements" },
];

export default class Menu extends React.Component {
  static isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: "",
      open: false,
      tabKeyPress: false,
      navigatingMap: false,
    };
  }

  componentDidMount() {
    this.setState({ selected: this.props.page });
  }

  handleMenuClick(e, slug) {
    switch (slug) {
      case "anchor":
        if (!Menu.isMobile()) {
          this.setState({ selected: "home" });
          return;
        }

        e.preventDefault();
        this.setState((prevState) => ({ open: !prevState.open }));
        break;

      default:
        this.setState({ selected: slug });
    }
  }

  handleKeyUp = (e) => {
    if (e.which !== 9) return;
    if (this.state.open) return;
    if (Menu.isMobile()) return;

    let focusTarget;
    if (!this.state.tabKeyPress) {
      if (this.state.navigatingMap && e.shiftKey) {
        focusTarget = document.getElementsByClassName("anchor");
        focusTarget[0].focus();
      }

      this.setState({ tabKeyPress: true });
      return;
    }

    if (Menu.isMobile() && this.state.tabKeyPress) {
      // this is a 2nd consecutive tab press
      focusTarget = document.getElementsByClassName("leaflet-container");
      focusTarget[0].focus();

      this.setState({ tabKeyPress: false, navigatingMap: true });
    }
  };

  getAriaLabel() {
    if (this.state.open) {
      return "lose the menu";
    }
    return "open the menu";
  }

  hidden(slug) {
    if (this.state.open || slug === "anchor") return null;

    return true;
  }

  renderItem(menuItem, key) {
    const { slug, content } = menuItem;
    const hidden = this.hidden(slug) ? "hidden" : "";
    const hash = window.location.hash;

    const href =
      slug === "home" || slug === "anchor" ? `/${hash}` : `/${slug}${hash}`;

    let selected = slug === this.state.selected ? "selected" : "";

    if (slug === "anchor" && this.state.selected === "home") {
      selected = "selected";
    }

    return (
      <li key={key} className={`${selected} ${hidden} ${slug}`}>
        <div className="menu-item-wrapper">
          <span className="menu-link">
            <a
              href={href}
              className={slug}
              onClick={(e) => {
                this.handleMenuClick(e, slug);
              }}
              onKeyUp={this.handleKeyUp}
            >
              {this.renderIcon(key)}
              {content}
            </a>
          </span>
        </div>
      </li>
    );
  }

  renderIcon(key) {
    if (key !== 0) return null;

    return (
      <span className="icon-wrapper">
        <img
          className="menu-toggle"
          src="/LUTI_hamburger.svg"
          aria-label={this.getAriaLabel()}
          alt=""
        />
      </span>
    );
  }

  render() {
    return (
      <nav>
        <CSSTransition in={this.state.open} timeout={TRANSITION_SPEED}>
          <ul className={classNames("menu", this.props.displayMode)}>
            {menuData.map((menuItem, key) => this.renderItem(menuItem, key))}
          </ul>
        </CSSTransition>
      </nav>
    );
  }
}
