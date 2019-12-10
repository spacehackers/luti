import React from "react";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
    this.passwordAction = evt => {
      evt.preventDefault();
      window.location = `/?${this.state.password}=1`;
    };
  }

  render() {
    return (
      <div className="password-prompt">
        <h1>Life Under The Ice</h1>
        <form onSubmit={this.passwordAction}>
          <label htmlFor="password">
            Password:
            <input
              type="text"
              onChange={evt => this.setState({ password: evt.target.value })}
            />
          </label>
        </form>
      </div>
    );
  }
}
