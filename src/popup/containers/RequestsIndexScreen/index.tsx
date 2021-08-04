import { useEffect } from "react";
import { useHistory } from "react-router";

import { useUserSelector } from "@redux/stores/user/context";

import { getPendingRequests } from "@redux/stores/user/reducers/requests/selectors";

import RoutesPaths from "@popup/routes/paths";

import WindowsService from "@services/WindowsService";

function RequestsIndexScreen() {
  const history = useHistory();

  const requests = useUserSelector(getPendingRequests);

  const closeAndRedirect = async () => {
    await WindowsService.closeAllPopups();
    history.push(RoutesPaths.WALLET);
  };

  useEffect(() => {
    if (requests.length === 0) {
      // close popup if it's open
      closeAndRedirect();
      return;
    }

    const [request] = requests;
    history.push(`${RoutesPaths.REQUESTS_INDEX}/${request.id}`);
  });

  return null;
}

export default RequestsIndexScreen;
