import dataActions, { dataTypes } from "@redux/data";
import { getData } from "@redux/selectors";

import DataEntry from "@models/Data/DataEntry";

export const addDataEntry = ({ payload: { id, key, value } }) => {
  return async (dispatch, getState) => {
    const data = getData(getState());

    // create entry instance
    const entry = new DataEntry(id, key, value);

    // append entry
    data.push(entry);

    // update redux store
    dispatch(dataActions.setData(data));
  };
};

export const removeDataEntry = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const data = getData(getState());

    // remove entry
    data.removeById(id);

    // update redux store
    dispatch(dataActions.setData(data));
  };
};

const Aliases = {
  [dataTypes.ADD_DATA_ENTRY]: addDataEntry,
  [dataTypes.REMOVE_DATA_ENTRY]: removeDataEntry,
};

export default Aliases;
