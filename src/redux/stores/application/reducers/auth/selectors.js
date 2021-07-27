import { createSelector } from "reselect";

export const isRegistered = createSelector(
  (state) => state.auth,
  (auth) => auth.registered,
);

export const isLoggedIn = createSelector(
  (state) => state.auth,
  (auth) => auth.loggedIn,
);

export const isSignInLoading = createSelector(
  (state) => state.auth,
  (auth) => auth.signIn.loading,
);

export const getSignInError = createSelector(
  (state) => state.auth,
  (auth) => auth.signIn.error,
);

export const isSignInSuccess = createSelector(
  (state) => state.auth,
  (auth) => auth.signIn.success,
);

export const isSignUpLoading = createSelector(
  (state) => state.auth,
  (auth) => auth.signUp.loading,
);

export const getSignUpError = createSelector(
  (state) => state.auth,
  (auth) => auth.signUp.error,
);

export const isSignUpSuccess = createSelector(
  (state) => state.auth,
  (auth) => auth.connect.success,
);

export const isConnectFractalLoading = createSelector(
  (state) => state.auth,
  (auth) => auth.connect.loading,
);

export const getConnectFractalError = createSelector(
  (state) => state.auth,
  (auth) => auth.connect.error,
);

export const isConnectFractalSuccess = createSelector(
  (state) => state.auth,
  (auth) => auth.connect.success,
);

export const getHashedPassword = createSelector(
  (state) => state.auth,
  (auth) => auth.hashedPassword,
);

export const getBackendSessions = createSelector(
  (state) => state.auth,
  (auth) => auth.sessions,
);

export const getBackendCatfishSession = createSelector(
  (state) => state.auth,
  (auth) => auth.sessions.catfish,
);

export const getBackendMegalodonSession = createSelector(
  (state) => state.auth,
  (auth) => auth.sessions.megalodon,
);

export const getBackendScopes = createSelector(
  (state) => state.auth,
  (auth) => auth.sessions.scopes,
);
