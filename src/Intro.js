import React from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { TRANSITION_SPEED } from "./constants.js";

import "./Intro.scss";

const Intro = props => {
  return (
    <CSSTransition in={props.visible} timeout={TRANSITION_SPEED}>
      <div className="intro">
        <h2
          className={classNames({
            hidden: !props.visible
          })}
        >
          {props.children}
        </h2>
      </div>
    </CSSTransition>
  );
};

export default Intro;
