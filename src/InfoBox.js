import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { CSSTransition } from "react-transition-group";
import InfoButton from "./InfoButton";
import ShareButtons from "./ShareButtons";

import "./InfoBox.scss";

const TRANSITION_SPEED = 500;

export default class InfoBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
    };

    this.handleClick = debounce(this.handleClick, 500, {
      leading: true,
      trailing: false,
    });
  }

  componentDidMount() {
    const body = document.body;
    body.classList.add("overflow-hidden");
  }

  handleClick = () => {
    this.setState(
      (prevState) => ({ hidden: !prevState.hidden }),
      () => {
        this.toggleOpenClose();
      }
    );
  };

  toggleOpenClose = () => {
    const map = document.getElementsByClassName("leaflet-container")[0];

    if (this.state.hidden) {
      map.removeEventListener("click", this.handleClick);
      map.removeEventListener("touchstart", this.handleClick);
      map.removeEventListener("touchmove", this.handleClick);
      return;
    }

    window.setTimeout(() => {
      map.addEventListener("click", this.handleClick);
      map.addEventListener("touchstart", this.handleClick);
      map.addEventListener("touchmove", this.handleClick);
    }, 100);
  };

  render() {
    const { title, desc } = this.props;

    return (
      <CSSTransition in={!this.state.hidden} timeout={TRANSITION_SPEED}>
        <div>
          <InfoButton
            displayMode={this.props.displayMode}
            handleClick={this.handleClick}
          />
          <div className={classNames("info-wrapper", this.props.displayMode)}>
            <div className="info-title">
              <h1>{title}</h1>
            </div>
            <div className="info-description">{desc}</div>
            <ShareButtons url={this.props.url} />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired,
};
