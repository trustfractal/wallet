import { useHistory, useParams } from "react-router";

import { ICredential } from "@pluginTypes/plugin";

import Requests from "@popup/components/Request";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import requestsActions from "@redux/stores/user/reducers/requests";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

import RoutesPaths from "@popup/routes/paths";

function RequestsShowScreen() {
  const history = useHistory();
  const dispatch = useUserDispatch();

  const { requestId } = useParams<{ requestId: string }>();

  const credentials = useUserSelector(getCredentials);
  const requests = useUserSelector(getRequests);
  const request = requests.find(({ id }) => id === requestId);

  if (request === undefined) {
    history.push(RoutesPaths.REQUESTS_INDEX);
    return null;
  }

  const onAccept = (
    id: string,
    credential: ICredential,
    properties: Record<string, boolean>,
  ) =>
    dispatch(
      requestsActions.acceptVerificationRequest({
        id,
        credential: credential.serialize(),
        properties,
      }),
    );
  const onDecline = (id: string, credential: ICredential) =>
    dispatch(
      requestsActions.declineVerificationRequest({
        id,
        credential: credential.serialize(),
      }),
    );
  const onNext = () => history.push(RoutesPaths.REQUESTS_INDEX);

  return (
    <Requests
      request={request}
      credentials={credentials}
      onAccept={onAccept}
      onDecline={onDecline}
      onNext={onNext}
    />
  );
}

export default RequestsShowScreen;
