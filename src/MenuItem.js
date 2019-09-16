import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const MenuItem = ({ slug, selected, onMenuClick, copy }) => {
  function handleClick(e) {
    onMenuClick(e, slug);
  }

  return (
    <li className={classNames({ selected: selected })}>
      <a href="#" onClick={handleClick}>
        {copy}
      </a>
    </li>
  );
};

MenuItem.propTypes = {
  slug: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  copy: PropTypes.string.isRequired
};

export default MenuItem;
