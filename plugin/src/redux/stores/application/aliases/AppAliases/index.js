import appActions, { appTypes } from "@redux/stores/application/reducers/app";

export const startup = () => {
  return async (dispatch) => {
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
