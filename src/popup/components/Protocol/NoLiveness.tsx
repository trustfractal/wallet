import {
  Cta,
  Title,
  BoldText,
  Icon,
  IconNames,
  VerticalSequence,
} from "@popup/components/Protocol/common";

import { getFractalAccountConnector } from "@services/Factory";

import environment from "@environment/index";

export function NoLiveness({ onClick }: { onClick: () => void }) {
  const nextStep = getFractalAccountConnector().hasConnectedAccount() ? (
    <>
      <BoldText>
        To earn {environment.PROTOCOL_CURRENCY}, start by providing a valid
        liveness.
      </BoldText>

      <Cta onClick={onClick}>Verify Identity</Cta>
    </>
  ) : (
    <>
      <BoldText>
        You haven't connected your Fractal Account to the extension.
      </BoldText>
      <Cta onClick={() => getFractalAccountConnector().doConnect()}>
        Connect Account
      </Cta>
    </>
  );
  return (
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL} />

      <Title>You haven’t verified your identity yet</Title>
      {nextStep}
    </VerticalSequence>
  );
}
