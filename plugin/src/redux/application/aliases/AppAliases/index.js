import appActions, { appTypes } from "@redux/application/reducers/app";

export const startup = () => {
  return async (dispatch) => {
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
