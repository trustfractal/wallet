import {
  IClaimPseudoSchema,
  ClaimType as SDKClaimType,
} from "@fractalwallet/sdk";

import ClaimTypes from "./types";

export default class ClaimType extends SDKClaimType {
  public static buildSchemaFromLevel(level: string): IClaimPseudoSchema {
    const levels = level.split("+").sort();
    const fullSchema = levels.reduce((memo, level) => {
      switch (level) {
        case "liveness":
          return { ...memo, ...ClaimTypes.LivenessSchema };
        case "basic":
          return { ...memo, ...ClaimTypes.BasicSchema };
        case "dummy":
          return { ...memo, ...ClaimTypes.DummySchema };
        default:
          return memo;
      }
    }, {});

    return SDKClaimType.buildSchema(levels.join("+"), fullSchema);
  }
}
