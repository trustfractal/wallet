import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["RESET_REGISTER", "SET_REGISTER_PASSWORD"]);

const creators = createActions(
  types.RESET_REGISTER,
  types.SET_REGISTER_PASSWORD,
);

const initialState = {
  password: "",
};

export const reducer = handleActions(
  {
    [types.RESET_REGISTER]: () =>
      Object.freeze({
        ...initialState,
      }),
    [types.SET_REGISTER_PASSWORD]: (state, { payload: password }) =>
      Object.freeze({
        ...state,
        password,
      }),
  },
  initialState,
);

export default creators;
