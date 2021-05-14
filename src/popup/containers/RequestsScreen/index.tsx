import { ICredential } from "@pluginTypes/plugin";
import Requests from "@popup/components/Requests";
import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import requestsActions from "@redux/stores/user/reducers/requests";
import { getPendingRequests } from "@redux/stores/user/reducers/requests/selectors";

function RequestsScreen() {
  const dispatch = useUserDispatch();

  const credentials = useUserSelector(getCredentials);
  const requests = useUserSelector(getPendingRequests);
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

  return (
    <Requests
      requests={requests}
      credentials={credentials}
      onAccept={onAccept}
      onDecline={onDecline}
    />
  );
}

export default RequestsScreen;
