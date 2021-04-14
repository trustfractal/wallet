export default class FractalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FractalError";
  }
}
