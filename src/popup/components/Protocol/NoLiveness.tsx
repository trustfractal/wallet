import {
  Cta,
  Title,
  BoldText,
  Icon,
  IconNames,
  VerticalSequence,
} from "@popup/components/Protocol/common";

import environment from "@environment/index";

export function NoLiveness({ onClick }: { onClick: () => void }) {
  return (
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL} />

      <Title>You haven’t verified your identity yet</Title>
      <BoldText>
        To earn {environment.PROTOCOL_CURRENCY}, start by providing a valid
        liveness.
      </BoldText>

      <Cta onClick={onClick}>Verify Identity</Cta>
    </VerticalSequence>
  );
}
