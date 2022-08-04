import React from "react";
import classNames from "classnames";

import "./Page.scss";

const Page = (props) => {
  return (
    <div
      className={classNames(
        "page",
        props.slug,
        { dark: props.darkMode },
        { light: !props.darkMode }
      )}
    >
      <div className="wrapper">{props.children}</div>
    </div>
  );
};
export default Page;
