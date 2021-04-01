import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import dataActions from "@redux/data";
import { getCredentials, getData } from "@redux/selectors";

import "@popup/styles.css";

function Data() {
  const dispatch = useDispatch();

  const data = useSelector(getData);
  const credentials = useSelector(getCredentials);

  const removeEntry = (id) => dispatch(dataActions.removeDataEntry(id));

  return (
    <div className="Popup">
      <Link to="/home">Back</Link>
      <hr />
      <h2>
        <strong>Data</strong>
      </h2>
      {data.length === 0 && <p>No data entries, please create one.</p>}
      {data.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Credentials</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.map((elem) => (
                <tr key={elem.key}>
                  <td>{elem.key}</td>
                  <td>{elem.value}</td>
                  <td>{credentials.countByData(elem.key, elem.value)}</td>
                  <td>
                    <button onClick={() => removeEntry(elem.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <br />
      <br />

      <Link to="/data/create">Create</Link>
    </div>
  );
}

export default Data;
