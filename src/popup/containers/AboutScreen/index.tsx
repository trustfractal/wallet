import { useHistory } from "react-router";

import { useAppSelector } from "@redux/stores/application/context";

import { getVersion } from "@redux/stores/application/reducers/app/selectors";

import About from "@popup/components/About";

import RoutesPaths from "@popup/routes/paths";

function AboutScreen() {
  const history = useHistory();
  const version = useAppSelector(getVersion);

  const onNext = () => history.push(RoutesPaths.WALLET);

  return <About version={version} onNext={onNext} />;
}

export default AboutScreen;
