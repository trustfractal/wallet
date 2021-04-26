import { Verification } from "../app/types";
import ClaimTypes from "../claims/types";

import { AttestationRequest, Utils as SDKUtils } from "@fractalwallet/sdk";

const takeKeys = (obj: Record<string, any>, keys: Array<string>) =>
  Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((memo, key) => ({ ...memo, [key]: obj[key] }), {});

const perform = (
  request: AttestationRequest,
  verifications: Verification[]
) => {
  const level = verifications.map(({ level }) => level).join("+");
  const claimType = ClaimTypes.build(level);

  if (!claimType) return false;

  const {
    hash: claimTypeHash,
    schema: { properties: claimTypeProperties },
  } = claimType;

  const {
    claim: { properties: requestProperties },
  } = request;

  const details = verifications.reduce(
    (memo, { details }) => ({ ...memo, ...details }),
    {}
  );

  const relevantDetails = takeKeys(details, Object.keys(claimTypeProperties));

  const equalData = SDKUtils.compareObjects(requestProperties, relevantDetails);
  const equalClaimType = claimTypeHash === request.claim.claimTypeHash;

  return equalData && equalClaimType;
};

export default { perform };
