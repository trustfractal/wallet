import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import RequestStatus from "@models/Request/RequestStatus";

import requestsActions from "@redux/requests";
import { getCredentials } from "@redux/selectors";

function ShareCredentialRequest(props) {
  const { request } = props;
  const { cTypeHash, credential, properties } = request.content;

  const dispatch = useDispatch();
  const credentials = useSelector(getCredentials).filterByCType(cTypeHash);
  const credentialsById = credentials.indexedById();
  const credentialsIds = Object.keys(credentialsById);

  const [selectedCredentialId, setSelectedCredentialId] = useState(credential);
  const [selectedProperties, setSelectedProperties] = useState(properties);

  const isPending = request.status === RequestStatus.PENDING;

  const acceptRequest = () =>
    dispatch(
      requestsActions.acceptShareCredentialRequest({
        id: request.id,
        credential: selectedCredentialId,
        properties: selectedProperties,
      }),
    );
  const declineRequest = () =>
    dispatch(requestsActions.declineRequest(request.id));
  const ignoreRequest = () =>
    dispatch(requestsActions.ignoreRequest(request.id));

  return (
    <div className="Popup">
      <Link to="/requests">Back</Link>
      <hr />
      <h2>
        <strong>{`Request - ${request.id}`}</strong>
      </h2>
      <div>
        <div>
          <p>
            <strong>Requester: </strong>
            {request.requester}
          </p>
          <p>
            <strong>Type: </strong>
            Share Credential
          </p>
          <p>
            <strong>Status: </strong>
            {request.status}
          </p>
          <p>
            <strong>Date: </strong>
            {request.createdAt.toLocaleString()}
          </p>
          <p>
            <strong>CType: </strong>
            {cTypeHash}
          </p>
          <p>
            <strong>Credential: </strong>
            <select
              value={selectedCredentialId}
              onChange={(id) => setSelectedCredentialId(id)}
              disabled={!isPending}
            >
              {credentialsIds.map((id) => (
                <option key={id}>{id}</option>
              ))}
            </select>
          </p>
          <div>
            <p>
              <strong>Properties: </strong>
            </p>
            <ul>
              {Object.keys(selectedProperties).map((property) => (
                <li key={property}>
                  <p>
                    <strong>{property}: </strong>
                    {credentialsById[selectedCredentialId].properties[property]}
                    <input
                      name={`property-${property}`}
                      type="checkbox"
                      checked={selectedProperties[property]}
                      disabled={!isPending}
                      onChange={() =>
                        setSelectedProperties({
                          ...selectedProperties,
                          [property]: !selectedProperties[property],
                        })
                      }
                    />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          {isPending && (
            <>
              <button onClick={acceptRequest}>Accept</button>
              <button onClick={declineRequest}>Decline</button>
              <button onClick={ignoreRequest}>Ignore</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareCredentialRequest;
