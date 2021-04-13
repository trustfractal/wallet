import Loading from "@popup/containers/Loading";
import Login from "@popup/containers/Login";

import Routes from "@popup/routes";

import { useAppSelector } from "@redux/stores/application/context";
import { UserContextProvider } from "@redux/stores/user/context";

import { isLaunched } from "@redux/stores/application/reducers/app/selectors";
import {
  isRegistered,
  isLoggedIn,
} from "@redux/stores/application/reducers/auth/selectors";

function App() {
  const launched = useAppSelector(isLaunched);
  const registered = useAppSelector(isRegistered);
  const loggedIn = useAppSelector(isLoggedIn);

  if (!launched) {
    return <Loading />;
  }

  if (registered) {
    if (loggedIn) {
      return (
        <UserContextProvider>
          <Routes.App />
        </UserContextProvider>
      );
    }

    return <Login />;
  }

  return <Routes.Register />;
}

export default App;
