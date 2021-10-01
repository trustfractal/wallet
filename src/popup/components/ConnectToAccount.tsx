import {
  Cta,
  VerticalSequence,
  Title,
} from "@popup/components/Protocol/common";
import { getFractalAccountConnector } from "@services/Factory";

export function ConnectToAccount() {
  return (
    <VerticalSequence>
      <Title>Connect Your Fractal Account</Title>

      <Cta onClick={() => getFractalAccountConnector().doConnect()}>
        Go to Fractal ID
      </Cta>
    </VerticalSequence>
  );
}
