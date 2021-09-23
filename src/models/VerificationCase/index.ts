import {
  IVerificationCase,
  ISerializable,
  ICredential,
} from "@pluginTypes/index";
import VerificationCaseStatus from "./status";

const statusOrder = [
  VerificationCaseStatus.APPROVED,
  VerificationCaseStatus.ISSUING,
  VerificationCaseStatus.REJECTED,
  VerificationCaseStatus.CONTACTED,
  VerificationCaseStatus.PENDING,
  VerificationCaseStatus.INCOMPLETE,
  VerificationCaseStatus.UNKNOWN,
];

export default class VerificationCase
  implements IVerificationCase, ISerializable
{
  public id: string;
  public clientId: string;
  public level: string;
  public status: VerificationCaseStatus;

  public constructor(
    id: string,
    clientId: string,
    level: string,
    status: VerificationCaseStatus,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.level = level;
    this.status = status;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      clientId: this.clientId,
      level: this.level,
      status: this.status,
    });
  }

  public static getStatus(
    id: string,
    status: "done" | "pending" | "contacted",
    credential: "approved" | "rejected",
    journey_completed: boolean,
    credentials: ICredential[],
  ): VerificationCaseStatus {
    if (status === "done") {
      if (credential === "approved") {
        // check if a credential has already been issued for this approved verification case
        if (!credentials.find((item) => item.verificationCaseId === id)) {
          return VerificationCaseStatus.ISSUING;
        }

        return VerificationCaseStatus.APPROVED;
      } else if (credential === "rejected") {
        return VerificationCaseStatus.REJECTED;
      }
    } else if (status === "pending") {
      if (journey_completed) {
        return VerificationCaseStatus.PENDING;
      } else {
        return VerificationCaseStatus.INCOMPLETE;
      }
    } else if (status === "contacted") {
      return VerificationCaseStatus.CONTACTED;
    }

    return VerificationCaseStatus.UNKNOWN;
  }

  public static parse(str: string): IVerificationCase {
    const { id, clientId, level, status } = JSON.parse(str);

    return new VerificationCase(id, clientId, level, status);
  }

  public static sortByStatus(
    { status: vcStatusA }: IVerificationCase,
    { status: vcStatusB }: IVerificationCase,
  ) {
    return (
      statusOrder.indexOf(vcStatusA as VerificationCaseStatus) -
      statusOrder.indexOf(vcStatusB as VerificationCaseStatus)
    );
  }
}
