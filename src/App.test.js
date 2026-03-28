import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

jest.mock(
  "./Homepage",
  () =>
    function MockHomepage() {
      return <div>Mock Homepage</div>;
    }
);

jest.mock(
  "./About",
  () =>
    function MockAbout() {
      return <div>Mock About</div>;
    }
);

jest.mock(
  "./Acknowledgements",
  () =>
    function MockAcknowledgements() {
      return <div>Mock Acknowledgements</div>;
    }
);

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<App />);
  root.unmount();
});
