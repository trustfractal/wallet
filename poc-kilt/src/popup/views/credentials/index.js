import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import kiltActions from "@redux/kilt";
import { getCredentials } from "@redux/selectors";

import "@popup/styles.css";

function truncate(str, length = 10) {
  if (str.length > length) {
    return str.substr(0, length) + "...";
  }

  return str;
}

function renderProperties(properties) {
  const keys = Object.keys(properties);

  return keys.map((key) => <p key={key}>{`${key} - ${properties[key]}`}</p>);
}

function CredentialsHome() {
  const dispatch = useDispatch();

  const credentials = useSelector(getCredentials);

  const createCredential = () => dispatch(kiltActions.createCredential());
  const verifyCredential = (id) => dispatch(kiltActions.verifyCredential(id));
  const deleteCredential = (id) => dispatch(kiltActions.removeCredential(id));

  return (
    <div className="Popup">
      <Link to="/home">Back</Link>
      <hr />
      <h2>
        <strong>Credentials</strong>
      </h2>
      {credentials.length === 0 && (
        <p>No data credentials, please create one.</p>
      )}
      {credentials.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Attester</th>
                <th>Claimer</th>
                <th>Properties</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {credentials.map((elem) => (
                <tr key={elem.id}>
                  <td>{truncate(elem.attester)}</td>
                  <td>{truncate(elem.claimer)}</td>
                  <td>{renderProperties(elem.properties)}</td>
                  <td>
                    <p>{elem.status}</p>
                    <button onClick={() => verifyCredential(elem.id)}>
                      Verify
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteCredential(elem.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <br />
      <br />

      <button onClick={createCredential}>Create</button>
    </div>
  );
}

export default CredentialsHome;
