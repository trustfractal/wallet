import { ICredential, ISerializable } from "@pluginTypes/index";
import { IVerificationRequest } from "@pluginTypes/index";
import { Schema } from "@trustfractal/sdk";

export default class VerificationRequest
  implements IVerificationRequest, ISerializable
{
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
    try {
      const schema = Schema.build(this.level);
      return Schema.Validator.validate(schema, this.fields);
    } catch (e) {
      console.log(e.message);

      return false;
    }
  }
}
