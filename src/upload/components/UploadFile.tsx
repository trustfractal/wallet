import { useDropzone } from "react-dropzone";
import styled, { css } from "styled-components";

import Icon, { IconNames } from "@popup/components/common/Icon";

import Text from "./common/Text";
import Title from "./common/Title";
import TopComponent from "./common/TopComponent";

import Button from "@popup/components/common/Button";

const Root = styled.div`
  width: 80vw;
  min-height: 82vh;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  margin-bottom: var(--s-80);
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: var(--s-48);
`;

const TitleContainer = styled.div`
  margin-bottom: var(--s-24);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  outline: none;

  cursor: pointer;

  padding: var(--s-64);

  border: 1px dashed var(--c-dark-blue);
  border-radius: 12px;
  background: var(--c-dark-gray);
  color: var(--c-dark-blue);
  transition: border 0.2s ease-in-out;

  background: ${(props) =>
    // @ts-ignore
    props.isDragReject &&
    css`
      border-color: var(--c-red);
    `};
`;

const LabelContainer = styled.div`
  opacity: 0.6;
  margin-bottom: 32px;
`;

const ButtonContainer = styled.div`
  text-weight: normal;
`;

export type UploadFileProps = {
  onUpload: (file: Blob) => {};
  error?: string;
};

UploadFile.defaultProps = {
  error: "",
};

function UploadFile(props: UploadFileProps) {
  const { onUpload } = props;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "text/plain,.backup",
    multiple: false,
    onDropAccepted: ([file]) => {
      onUpload(file);
    },
  });

  return (
    <TopComponent>
      <Root>
        <LogoContainer>
          <Icon name={IconNames.LOGO_NAME} />
        </LogoContainer>
        <HeaderContainer>
          <TitleContainer>
            <Title>Upload your backup data</Title>
          </TitleContainer>
          <Text>
            Import your backup data in order to recover your credentials back to
            your Fractal ID Wallet
          </Text>
        </HeaderContainer>
        <InputContainer
          {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          <LabelContainer>
            <Text>Upload or drag & drop your data</Text>
          </LabelContainer>
          <ButtonContainer>
            <Button leftIcon={<Icon name={IconNames.IMPORT} />}>Upload</Button>
          </ButtonContainer>
        </InputContainer>
      </Root>
    </TopComponent>
  );
}

export default UploadFile;
