import React from "react";
import classNames from "classnames";

import "./Page.scss";

const Page = props => {
  return (
    <div className={classNames("page", props.slug)}>
      <div className="wrapper">{props.children}</div>
    </div>
  );
};
export default Page;
