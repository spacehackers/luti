import React from "react";
import { withCookies } from "react-cookie";

class PasswordPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: ""
    };

    this.passwordAction = evt => {
      evt.preventDefault();
      this.props.cookies.set("password", this.state.password.toLowerCase(), {
        path: "/"
      });
      this.forceUpdate();
    };
  }

  render() {
    if (this.props.cookies.get("password") === "tardigrade") {
      return this.props.children;
    }
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

export default withCookies(PasswordPrompt);
