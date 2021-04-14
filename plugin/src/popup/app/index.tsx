import LoadingScreen from "@popup/containers/LoadingScreen";
import Login from "@popup/containers/LoginScreen";

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
    return <LoadingScreen />;
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
