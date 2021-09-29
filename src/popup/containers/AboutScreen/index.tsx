import { useHistory } from "react-router";

import { useAppSelector } from "@redux/stores/application/context";

import { getVersion } from "@redux/stores/application/reducers/app/selectors";

import About from "@popup/components/About";

import RoutesPaths from "@popup/routes/paths";

import { getWindowsService } from "@services/Factory";

import environment from "@environment/index";

function AboutScreen() {
  const history = useHistory();
  const version = useAppSelector(getVersion);

  const onNext = () => history.push(RoutesPaths.WALLET);
  const onClickFractalLink = () =>
    getWindowsService().createTab({
      url: environment.FRACTAL_WEBSITE_URL,
    });
  const onClickFractalTelegram = () =>
    getWindowsService().createTab({
      url: "https://t.me/fractal_protocol",
    });

  return (
    <About
      onClickFractalLink={onClickFractalLink}
      onClickFractalTelegram={onClickFractalTelegram}
      version={version}
      onNext={onNext}
    />
  );
}

export default AboutScreen;
