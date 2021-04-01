import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  getAcceptedRequests,
  getDeclinedRequests,
  getPendingRequests,
} from "@redux/selectors";

import "@popup/styles.css";

function truncate(str, length = 10) {
  if (str.length > length) {
    return str.substr(0, length) + "...";
  }

  return str;
}

function renderRequests(requests) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Requester</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.sortByDate().map((request) => (
            <tr key={request.id}>
              <td>
                <Link to={`requests/${request.id}`}>
                  {truncate(request.id, 8)}
                </Link>
              </td>
              <td>{truncate(request.requester)}</td>
              <td>{request.type}</td>
              <td>{request.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function renderAcceptedRequests(requests) {
  return (
    <div>
      <p>Accepted</p>
      {renderRequests(requests)}
    </div>
  );
}

function renderDeclinedRequests(requests) {
  return (
    <div>
      <p>Declined</p>
      {renderRequests(requests)}
    </div>
  );
}

function renderPendingRequests(requests) {
  return (
    <div>
      <p>Pending</p>
      {renderRequests(requests)}
    </div>
  );
}

function RequestsIndex() {
  const accepted = useSelector(getAcceptedRequests);
  const declined = useSelector(getDeclinedRequests);
  const pending = useSelector(getPendingRequests);

  const hasAcceptedRequests = accepted.length > 0;
  const hasDeclinedRequests = declined.length > 0;
  const hasPendingRequests = pending.length > 0;

  const hasRequests =
    hasDeclinedRequests || hasAcceptedRequests || hasPendingRequests;

  return (
    <div className="Popup">
      <Link to="/home">Back</Link>
      <hr />
      <h2>
        <strong>Requests</strong>
      </h2>
      {!hasRequests && <p>No data requests.</p>}
      {hasRequests && (
        <div>
          {hasPendingRequests && renderPendingRequests(pending)}
          {hasAcceptedRequests && renderAcceptedRequests(accepted)}
          {hasDeclinedRequests && renderDeclinedRequests(declined)}
        </div>
      )}
    </div>
  );
}

export default RequestsIndex;
