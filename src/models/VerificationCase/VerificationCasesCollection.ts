import { IVerificationCase } from "@pluginTypes/index";

import Collection from "@models/Base/BaseCollection";
import VerificationCase from "@models/VerificationCase";

export default class VerificationCasesCollection extends Collection<IVerificationCase> {
  static parse(str: string) {
    const verificationCases = JSON.parse(str);

    const elements = verificationCases.map((element: string) =>
      VerificationCase.parse(element),
    );

    return new VerificationCasesCollection(...elements);
  }
}
