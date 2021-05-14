import { ICredential, ISerializable } from "@pluginTypes/index";
import { IVerificationRequest } from "@pluginTypes/index";

export default class VerificationRequest
  implements IVerificationRequest, ISerializable {
  public level: string;
  public credential?: ICredential;
  constructor(level: string, credential?: ICredential) {
    this.level = level;
    this.credential = credential;
  }

  public serialize(): string {
    return JSON.stringify({
      level: this.level,
      credential: this.credential,
    });
  }

  public static parse(str: string): VerificationRequest {
    const { level, credential } = JSON.parse(str);

    return new VerificationRequest(level, credential);
  }
}
