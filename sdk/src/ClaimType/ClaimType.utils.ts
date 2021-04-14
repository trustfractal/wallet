import { Validator } from "jsonschema";

import FractalError from "@src/FractalError";
import { IClaimProperties, IClaimSchema } from "@src/types";

import { ClaimTypeMetaschema } from "./meta";

function valid(schema: object, values: any): boolean {
  return new Validator().validate(values, schema).valid;
}

function validSchema(schema: IClaimSchema): boolean {
  return valid(ClaimTypeMetaschema, schema);
}

function error(message: string) {
  throw new FractalError(message);
}

function invalidClaimTypeSchemaError(schema: object): void {
  error(`Invalid ClaimType schema ${JSON.stringify(schema)}`);
}

function propertyMismatchError(properties: object, schema: object): void {
  error(`Properties do not match schema
        Properties: ${JSON.stringify(properties)}
        Schema: ${JSON.stringify(schema)}`);
}

export function validateSchema(
  schema: IClaimSchema,
  properties: IClaimProperties
): boolean {
  if (!validSchema(schema)) invalidClaimTypeSchemaError(schema);

  if (!valid(schema, properties)) propertyMismatchError(properties, schema);

  return true;
}
