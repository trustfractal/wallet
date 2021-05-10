import styled from "styled-components";
import TopComponent from "./common/TopComponent";

const Root = styled.div`
  width: 80vw;
  min-height: 82vh;
`;

export type UploadFileProps = {
  onUpload: (file: Blob) => {};
  error?: string;
};

UploadFile.defaultProps = {
  error: "",
};

function UploadFile(props: UploadFileProps) {
  const { onUpload, error } = props;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target !== null &&
      event.target.files !== null &&
      event.target.files[0] !== undefined
    ) {
      onUpload(event.target.files[0]);
    }
  };

  return (
    <TopComponent>
      <Root>
        <div>
          <h1>Logo</h1>
        </div>
        <div>
          <h1>Upload your backup data</h1>
          <p>
            Import your backup data in order to recover your credentials back to
            your Fractal ID Wallet
          </p>
          <input type="file" accept="text/plain,.backup" onChange={onChange} />
          {error && <p>{error}</p>}
        </div>
      </Root>
    </TopComponent>
  );
}

export default UploadFile;
