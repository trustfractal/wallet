import { Link } from "react-router-dom";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import credentialsActions from "@redux/stores/user/reducers/credentials";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

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

function CredentialsIndex() {
  const dispatch = useUserDispatch();

  const credentials = useUserSelector(getCredentials);

  const deleteCredential = (id) =>
    dispatch(credentialsActions.removeCredential(id));

  return (
    <div className="Popup">
      <Link to="/home">Back</Link>
      <hr />
      <h2>
        <strong>Credentials</strong>
      </h2>
      {credentials.length === 0 && <p>No credentials.</p>}
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
    </div>
  );
}

export default CredentialsIndex;
