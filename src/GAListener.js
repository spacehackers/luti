import { useEffect } from "react";
import ReactGA from "react-ga";
import { useHistory } from "react-router-dom";

const sendPageView = location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
  console.debug("GA|Pageview Sent: ", location.pathname);
};

const GAListener = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    sendPageView(history.location);
    return history.listen(sendPageView);
  }, [history]);

  return children;
};

export default GAListener;
