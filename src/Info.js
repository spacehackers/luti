import React from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import debounce from "lodash/debounce";

import "./Info.scss";
import "./InfoButton.scss";

const TRANSITION_SPEED = 500;

const propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired
};

export default class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true
    };

    this.handleClick = debounce(this.handleClick, 500, {
      leading: true,
      trailing: false
    });
  }

  componentDidMount() {
    const body = document.body;
    body.classList.add("overflow-hidden");
  }

  handleClick = () => {
    this.setState(
      prevState => ({ hidden: !prevState.hidden }),
      () => {
        this.handleOpen();
      }
    );
  };

  handleOpen = () => {
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

  getAriaLabel() {
    if (this.state.open) {
      return "click for info";
    }
    return "close info";
  }

  renderSharingButtons() {
    const message =
      "Woah! Check out this microscopic creature I found on Life Under The Ice:";
    const encodedMessage = encodeURIComponent(message);
    const encodedURI = encodeURIComponent(this.props.url);
    const shareClick = e => {
      navigator
        .share({
          text: message,
          url: this.props.url
        })
        .then(() => {
          console.debug("Thanks for sharing!");
        })
        .catch(console.error);
    };
    if (navigator.share) {
      return (
        <div className="share-links-mobile">
          <button type="button" onClick={shareClick}>
            Share this
          </button>
        </div>
      );
    }
    return (
      <div className="share-links">
        <a
          className="resp-sharing-button__link"
          href={`https://facebook.com/sharer/sharer.php?u=${encodedURI}&title=${encodedMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=""
        >
          <div className="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small">
            <div
              aria-hidden="true"
              className="resp-sharing-button__icon resp-sharing-button__icon--solid"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
              </svg>
            </div>
          </div>
        </a>

        <a
          className="resp-sharing-button__link"
          href={`https://twitter.com/intent/tweet/?text=${encodedMessage}&url=${encodedURI}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=""
        >
          <div className="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small">
            <div
              aria-hidden="true"
              className="resp-sharing-button__icon resp-sharing-button__icon--solid"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
              </svg>
            </div>
          </div>
        </a>

        <a
          className="resp-sharing-button__link"
          href={`mailto:?subject=${encodedMessage}&body=${encodedURI}`}
          target="_self"
          rel="noopener"
          aria-label=""
        >
          <div className="resp-sharing-button resp-sharing-button--email resp-sharing-button--small">
            <div
              aria-hidden="true"
              className="resp-sharing-button__icon resp-sharing-button__icon--solid"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    );
  }

  renderButton() {
    return (
      <button type="button" className="info-button" onClick={this.handleClick}>
        <img
          className="info-toggle"
          src="/LUTI_WhatsThis5.svg"
          aria-label={this.getAriaLabel()}
          alt=""
        />
      </button>
    );
  }

  renderInfo() {
    const { title, desc } = this.props;
    return (
      <>
        <div className="info-title">
          <h1>{title}</h1>
        </div>
        <div className="info-description">{desc}</div>
      </>
    );
  }

  renderInfoWrapper() {
    return (
      <div className="info-wrapper">
        {this.renderInfo()}
        {this.renderSharingButtons()}
      </div>
    );
  }

  render() {
    return (
      <CSSTransition in={!this.state.hidden} timeout={TRANSITION_SPEED}>
        <div>
          {this.renderButton()}
          {this.renderInfoWrapper()}
        </div>
      </CSSTransition>
    );
  }
}

Info.propTypes = propTypes;
