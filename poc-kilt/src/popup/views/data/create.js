import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import dataActions from "@redux/data";

import DataKeys from "@models/Data/DataKeys";

import "@popup/styles.css";

function DataCreate() {
  const history = useHistory();

  const dispatch = useDispatch();

  const keys = Object.values(DataKeys);
  const [key, setKey] = useState(DataKeys.EMAIL.key);
  const [format, setFormat] = useState(DataKeys.EMAIL.format);
  const [value, setValue] = useState("");

  const isDisabled = value.length === 0;

  const onChangeKey = (event) => {
    const newKey =
      keys[
        keys.findIndex(
          ({ key: searchedKey }) => searchedKey === event.target.value,
        )
      ];

    if (newKey) {
      setKey(newKey.key);
      setFormat(newKey.format);
    }
  };

  const addEntry = (event) => {
    event.preventDefault();

    dispatch(dataActions.addDataEntry({ key, value }));

    setKey(DataKeys.EMAIL.key);
    setFormat(DataKeys.EMAIL.format);
    setValue("");

    // Navigate back
    history.push("data");
  };

  return (
    <div className="Popup">
      <Link to="/data">Back</Link>
      <hr />
      <h2>
        <strong>Create new data entry</strong>
      </h2>
      <div>
        <p>
          <strong>New entry</strong>
        </p>
        <select value={key} onChange={onChangeKey}>
          {keys.map(({ key }) => (
            <option key={key}>{key}</option>
          ))}
        </select>
        <br />
        <input
          name="value"
          placeholder={format}
          type={format}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <br />
        <br />
        <button disabled={isDisabled} onClick={addEntry}>
          Create
        </button>
      </div>
    </div>
  );
}

export default DataCreate;
