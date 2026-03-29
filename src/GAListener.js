import { useEffect } from "react";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

const sendPageView = (location) => {
  const page = `${location.pathname}${location.search}${location.hash}`;
  ReactGA.set({ page });
  ReactGA.pageview(page);
  console.debug("GA|Pageview Sent: ", page);
};

const GAListener = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    sendPageView(location);
  }, [location]);

  return children;
};

export default GAListener;
