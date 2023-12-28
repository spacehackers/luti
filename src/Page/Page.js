import React from "react";
import classNames from "classnames";
import { Offline, Online } from "../Offline";

import "./Page.scss";

const RemoveAnchorTags = ({ children }) => {
  const processChildren = (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.type === "a" && child.props.href) {
      // If it's an anchor tag, return its children without the anchor
      return child.props.children;
    }

    if (child.props.children) {
      // If the element has children, process them recursively
      return React.cloneElement(child, {
        ...child.props,
        children: React.Children.map(child.props.children, processChildren),
      });
    }

    // Return the element if it doesn't meet the above conditions
    return child;
  };

  // Process each child of this component
  const processedChildren = React.Children.map(children, processChildren);

  return <>{processedChildren}</>;
};

const Page = (props) => {
  return (
    <div className={classNames("page", props.slug, props.displayMode)}>
      <div className="wrapper">
        <Online>{props.children}</Online>
        <Offline>
          <RemoveAnchorTags>{props.children}</RemoveAnchorTags>
        </Offline>
      </div>
    </div>
  );
};
export default Page;
