import React from "react";
import { Redirect, useLocation } from "react-router-dom";

export default function withRedirectToQueryRoute(WrappedComponent) {
  return () => (
    <RedirectToQueryRoute>
      <WrappedComponent />
    </RedirectToQueryRoute>
  );
}

export function RedirectToQueryRoute(props) {
  const { children } = props;

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  if (query.has("route")) {
    return (
      <Redirect
        to={{
          pathname: `/${query.get("route")}`,
          state: { from: location },
        }}
      />
    );
  }

  return children;
}
