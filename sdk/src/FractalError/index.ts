export default class FractalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FractalError";
  }

  public static invalidClaimTypeSchemaError(schema: object): FractalError {
    return new FractalError(
      `Invalid ClaimType schema ${JSON.stringify(schema)}`
    );
  }

  public static propertyMismatchError(
    properties: object,
    schema: object
  ): FractalError {
    return new FractalError(`Properties do not match schema
        Properties: ${JSON.stringify(properties)}
        Schema: ${JSON.stringify(schema)}`);
  }

  public static invalidHashing(term: any) {
    return new FractalError(
      `Invalid term to be hashed: ${JSON.stringify(term)}`
    );
  }
}
