import React from "react";

import "./Menu.scss";

export default class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false
    };
  }

  render() {
    return (
      <div className="menu_container">
        <div />
        <div className="home selected">Life Under the Ice</div>
        <div className="menu">
          <div>About the Project</div>
          <div>Acknowledgements</div>
        </div>
      </div>
    );
  }
}
