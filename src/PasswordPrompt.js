import React from "react";
import { withCookies } from "react-cookie";
import queryString from "query-string";

class PasswordPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
    };

    this.passwordAction = (evt) => {
      evt.preventDefault();
      const timestamp = new Date().getTime();
      const expire = timestamp + 60 * 60 * 24 * 1000 * 30; // 30 days

      // lower case, trim whitespace
      const normalizedPassword = this.state.password
        .toLowerCase()
        .replace(/^\s+|\s+$/g, "");

      this.props.cookies.set("password", normalizedPassword, {
        path: "/",
        expires: new Date(expire),
      });
      this.forceUpdate();
    };
  }

  componentDidMount() {
    const query = queryString.parse(window.location.search);
    if (query.reset_password) {
      this.props.cookies.set("password", "", {
        path: "/",
      });
    }
    this.forceUpdate();
  }

  render() {
    if (this.props.cookies.get("password") === "secrettardigrade") {
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
              onChange={(evt) => this.setState({ password: evt.target.value })}
            />
            <input type="submit" value="submit" />
          </label>
        </form>
      </div>
    );
  }
}

export default withCookies(PasswordPrompt);
