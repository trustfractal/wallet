import { IConnectionStatus } from "./Connection";
import { IVerificationRequest } from "./Request";

export interface IFractalInpageProvider {
  init: () => Promise<void>;
  isCredentialValid(id: string, level: string): Promise<boolean>;
  getVerificationRequest(
    level: string,
    requester: { name: string; url: string; icon: string },
    fields: Record<string, boolean>,
  ): Promise<IVerificationRequest>;
  setupPlugin(): Promise<IConnectionStatus>;
  verifyConnection(): Promise<IConnectionStatus>;
}
