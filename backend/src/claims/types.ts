import Wallet from "../wallet";
import { ClaimType } from "@fractalwallet/sdk";

export const LivenessSchema = {
  liveness: { type: "boolean" },
};

export const BasicSchema = {
  residential_address_country: { type: "string" },
  date_of_birth: { type: "string" },
  full_name: { type: "string" },
  identification_document_country: { type: "string" },
  identification_document_number: { type: "string" },
  identification_document_type: { type: "string" },
};

export const build = (level: string) => {
  const levels = level.split("+").sort();

  const fullSchema = levels.reduce((memo, level) => {
    switch (level) {
      case "liveness":
        return { ...memo, ...LivenessSchema };
      case "basic":
        return { ...memo, ...BasicSchema };
      default:
        return memo;
    }
  }, {});

  const schema = ClaimType.buildSchema(levels.join("+"), fullSchema);
  return ClaimType.fromSchema(schema, Wallet.address);
};

export default { BasicSchema, LivenessSchema, build };
