const sortKYCType = (type: string): string => type.split("+").sort().join("+");

const SupportedKYCs = [
  "plus+liveness+wallet",
  "plus+liveness+wallet+sow",
  "plus+selfie+wallet",
  "plus+selfie+wallet+sow",
  "plus+liveness+accreditation+wallet",
  "plus+liveness+accreditation+wallet+sow",
  "plus+selfie+accreditation+wallet",
  "plus+selfie+accreditation+wallet+sow",
].map(sortKYCType);

const isSupported = (level: string): Boolean => {
  return SupportedKYCs.includes(sortKYCType(level));
};

const KYCTypes = {
  SupportedKYCs,
  isSupported,
};

export default KYCTypes;
