import { ICredential, ISerializable } from "@pluginTypes/index";
import { IVerificationRequest } from "@pluginTypes/index";
import { ClaimType } from "@trustfractal/sdk";

export default class VerificationRequest
  implements IVerificationRequest, ISerializable {
  public level: string;
  public fields: Record<string, boolean>;
  public credential?: ICredential;
  constructor(
    level: string,
    fields: Record<string, boolean>,
    credential?: ICredential,
  ) {
    this.level = level;
    this.fields = fields;
    this.credential = credential;
  }

  public serialize(): string {
    return JSON.stringify({
      level: this.level,
      fields: this.fields,
      credential: this.credential,
    });
  }

  public static parse(str: string): VerificationRequest {
    const { level, fields, credential } = JSON.parse(str);

    return new VerificationRequest(level, fields, credential);
  }

  public validate(): boolean {
    const levels = this.level.split("+").sort();

    const fullSchema = levels.reduce((memo, level) => {
      switch (level) {
        case "liveness":
          return { ...memo, ...ClaimType.LivenessSchema };
        case "basic":
          return { ...memo, ...ClaimType.BasicSchema };
        case "plus":
          return { ...memo, ...ClaimType.PlusSchema };
        case "wallet":
          return { ...memo, ...ClaimType.WalletSchema };
        default:
          return memo;
      }
    }, {});

    const { properties } = ClaimType.buildSchema(levels.join("+"), fullSchema);

    const fieldsNames = Object.keys(this.fields);

    for (let index = 0; index < fieldsNames.length; index++) {
      const element = fieldsNames[index];

      if (properties[element] === undefined) return false;
    }

    return true;
  }
}
