import React from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { TRANSITION_SPEED } from "./constants";

import "./Intro.scss";

const Intro = (props) => {
  return (
    <div className="intro">
      <CSSTransition in={props.visible} timeout={TRANSITION_SPEED}>
        <h2
          className={classNames(props.displayMode, { hidden: !props.visible })}
        >
          {props.children}
        </h2>
      </CSSTransition>
    </div>
  );
};

export default Intro;
