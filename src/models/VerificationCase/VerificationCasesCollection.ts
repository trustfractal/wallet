import { IVerificationCase } from "@pluginTypes/index";

import { KYCTypes } from "@trustfractal/sdk";

import Collection from "@models/Base/BaseCollection";
import VerificationCase from "@models/VerificationCase";
import VerificationCaseStatus from "@models/VerificationCase/status";

export default class VerificationCasesCollection extends Collection<IVerificationCase> {
  static parse(str: string) {
    const verificationCases = JSON.parse(str);

    const elements = verificationCases.map((element: string) =>
      VerificationCase.parse(element),
    );

    return new VerificationCasesCollection(...elements);
  }

  public filterProtocolVerificationCases() {
    return this.filter(({ level }) => VerificationCase.isProtocolLevel(level));
  }

  public filterApprovedProtocolVerificationCases() {
    return this.filter(
      ({ level, status }) =>
        VerificationCase.isProtocolLevel(level) &&
        status === VerificationCaseStatus.APPROVED,
    );
  }

  public filterPendingOrContactedProtocolVerificationCases() {
    return this.filter(
      ({ level, status }) =>
        VerificationCase.isProtocolLevel(level) &&
        (status === VerificationCaseStatus.PENDING ||
          status === VerificationCaseStatus.CONTACTED),
    );
  }

  public filterPendingOrContactedOrIssuingSupportedVerificationCases() {
    return this.filter(
      ({ level, status }) =>
        KYCTypes.isSupported(level) &&
        (status === VerificationCaseStatus.PENDING ||
          status === VerificationCaseStatus.CONTACTED ||
          status === VerificationCaseStatus.ISSUING),
    );
  }
}
