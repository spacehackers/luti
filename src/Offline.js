import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const isOffline = () => {
  const query = window.location.search;
  return !!new URLSearchParams(query).get("offline");
};

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export const Offline = ({ children }) => {
  const offline = !!useQuery().get("offline");
  if (offline) {
    return children;
  }
  return null;
};
export const Online = ({ children }) => {
  const offline = !!useQuery().get("offline");
  if (offline) {
    return null;
  }
  return children;
};
