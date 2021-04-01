import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import RequestStatus from "@models/Request/RequestStatus";

import requestsActions from "@redux/requests";

function renderContent(content) {
  return <>{Object.values(content).join(", ")}</>;
}

function ShareDataRequest(props) {
  const { request } = props;

  const dispatch = useDispatch();

  const isPending = request.status === RequestStatus.PENDING;

  const acceptRequest = () =>
    dispatch(requestsActions.acceptShareDataRequest(request.id));
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
            Share Data
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
            <strong>Content: </strong>
            {renderContent(request.content)}
          </p>
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

export default ShareDataRequest;
