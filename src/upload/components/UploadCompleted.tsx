import styled from "styled-components";

import { ICredential } from "@pluginTypes/plugin";
import TopComponent from "./common/TopComponent";

const Root = styled.div`
  width: 80vw;
  min-height: 82vh;
`;

export type UploadCompletedProps = {
  credentials: ICredential[];
};

function UploadCompleted(props: UploadCompletedProps) {
  const { credentials } = props;

  return (
    <TopComponent>
      <Root>
        <div>
          <h1>Logo</h1>
        </div>
        <div>
          <h1>Data recovered successfully!</h1>
          <p>
            Below you can see the credentials you were able to recover to your
            Fractal ID Wallet.
          </p>
          {credentials.map((credential) => (
            <div>
              <p>{credential.level}</p>
            </div>
          ))}
          {credentials.length === 0 && (
            <p>No new credentials could be recovered</p>
          )}
        </div>
      </Root>
    </TopComponent>
  );
}

export default UploadCompleted;
