import { Link, useParams } from "react-router-dom";

import RequestStatus from "@models/Request/RequestStatus";

import requestsActions from "@redux/stores/user/reducers/requests";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import "@popup/styles.css";

function renderContent(content) {
  return (
    <ul>
      <li>
        <strong>attester: </strong>
        {content.attester}
      </li>
      <li>
        <strong>claimer: </strong>
        {content.claimer}
      </li>
      <li>
        <strong>ctype: </strong>
        {content.ctype}
      </li>
      <li>
        <strong>properties: </strong>
        {Object.keys(content.properties)
          .map((key) => `${key}: ${content.properties[key]}`)
          .join(", ")}
      </li>
    </ul>
  );
}

function RequestsShow() {
  const dispatch = useUserDispatch();
  const { id } = useParams();

  const requests = useUserSelector(getRequests);
  const request = requests.getById(id);

  const isPending = request.status === RequestStatus.PENDING;

  const acceptRequest = () =>
    dispatch(requestsActions.acceptConfirmCredentialRequest(request.id));
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
            Store Credential
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

export default RequestsShow;
