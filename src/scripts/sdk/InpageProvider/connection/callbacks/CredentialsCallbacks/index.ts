import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService/Web3ProviderService";

export const getAttestationRequest = ([address, level, serializedProperties]: [
  string,
  string,
  string,
]) =>
  EthereumProviderService.getAttestationRequest(
    address,
    level,
    serializedProperties,
  );

const Callbacks = {
  [ConnectionTypes.GET_ATTESTATION_REQUEST_INPAGE]: {
    callback: getAttestationRequest,
  },
};

export default Callbacks;
