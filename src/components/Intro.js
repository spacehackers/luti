import React, { useRef } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { TRANSITION_SPEED } from "../constants";

import "./Intro.scss";

export default function Intro(props) {
  const headingRef = useRef(null);

  return (
    <div className="intro">
      <CSSTransition
        in={props.visible}
        timeout={TRANSITION_SPEED}
        nodeRef={headingRef}
      >
        <h2
          ref={headingRef}
          className={classNames(props.displayMode, { hidden: !props.visible })}
        >
          {props.children}
        </h2>
      </CSSTransition>
    </div>
  );
}
