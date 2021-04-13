export class RequestForAttestation {
  constructor(claimer: string, contents: object) {
    this.claimer = claimer;
    this.contents = contents;
    this.claimerSignature = undefined;
  }
}
