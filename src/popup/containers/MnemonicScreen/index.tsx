import { useHistory } from "react-router";

import Mnemonic from "@popup/components/Mnemonic";

import RoutesPaths from "@popup/routes/paths";

function MnemonicScreen() {
  const history = useHistory();

  const onNext = () => history.push(RoutesPaths.WALLET);

  return <Mnemonic onNext={onNext} />;
}

export default MnemonicScreen;
