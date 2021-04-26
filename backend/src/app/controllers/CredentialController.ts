import { Response } from "express";
import { AuthenticatedRequest, Verification } from "../types";

import Controller from "./Controller";
import AttestRequest from "../../services/AttestRequest";
import RequestBuilder from "../../services/RequestBuilder";
import RequestValidator from "../../services/RequestValidator";

export default class CredentialController extends Controller {
  public req: AuthenticatedRequest;
  public res: Response;

  constructor(req: AuthenticatedRequest, res: Response) {
    super(req, res);
    this.req = req;
    this.res = res;
  }

  public async create() {
    const {
      body: { request, level },
      user,
    } = this.req;

    if (!request) return this.badRequest("Missing attestation request");
    if (!level) return this.badRequest("Missing KYC level");
    if (!user) return this.unauthorized();

    const levels = level.split("+");

    // TODO: Enable these verifications
    const verifications = user.verifications.filter(
      ({ status: _status, report: _report, level: kycLevel }: Verification) =>
        levels.includes(kycLevel) // && status === "done" && report === "approved"
    );

    if (!verifications) return this.badRequest("KYC level not approved");

    const attestationRequest = RequestBuilder.perform(request);

    if (!attestationRequest)
      return this.badRequest("Malformed attestation request");

    if (!RequestValidator.perform(attestationRequest, verifications))
      return this.badRequest(
        "Attestation Request and KYC level verifications do not match"
      );

    const credential = await AttestRequest.perform(attestationRequest);

    if (!credential)
      return this.badRequest(
        "Credential does not have integrity. Possibly due to a malformed Attestation Request"
      );

    this.res.send({ credential });
  }
}
