import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const MenuItem = ({
  slug,
  selected,
  onMenuClick,
  copy,
  menuOpen,
  menuData
}) => {
  function handleClick(e) {
    onMenuClick(e, slug);
  }

  function is_hidden(slug) {
    if (menuOpen) return;
    const hidden_items = menuData.slice(1).map(i => i.slug);

    return hidden_items.includes(slug);
  }

  return (
    <li className={classNames({ selected: selected, hidden: is_hidden(slug) })}>
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
  copy: PropTypes.string.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  menuData: PropTypes.array.isRequired
};

export default MenuItem;
