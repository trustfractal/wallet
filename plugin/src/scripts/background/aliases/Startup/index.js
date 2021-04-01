import { appTypes } from "@redux/app";
import appActions from "@redux/app";

export const startup = () => {
  return async (dispatch) => {
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
