import { IVerificationCase } from "@pluginTypes/index";

import { KYCTypes } from "@trustfractal/sdk";

import { ICredential } from "@pluginTypes/index";
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

  static fromRpcList(cases: any[], credentials: ICredential[]) {
    return cases.reduce(
      (
        memo,
        { id, client_id, level, status, credential, journey_completed },
      ) => {
        let vcStatus = VerificationCase.getStatus({
          id,
          level,
          status,
          credential,
          journey_completed,
          credentials,
        });

        memo.push(new VerificationCase(id, client_id, level, vcStatus));

        return memo;
      },
      new VerificationCasesCollection(),
    );
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
