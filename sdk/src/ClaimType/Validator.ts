import { Validator as SchemaValidator } from "jsonschema";

import FractalError from "../FractalError";
import { IClaimProperties, IClaimSchema } from "../types";

import { ClaimTypeMetaschema } from "./meta";

const isValid = (schema: object, values: any): boolean => {
  return new SchemaValidator().validate(values, schema).valid;
};

const isValidSchema = (schema: IClaimSchema): boolean => {
  return isValid(ClaimTypeMetaschema, schema);
};

const validate = (
  schema: IClaimSchema,
  properties: IClaimProperties
): boolean => {
  switch (true) {
    case !isValidSchema(schema):
      throw FractalError.invalidClaimTypeSchemaError(schema);
    case !isValid(schema, properties):
      throw FractalError.propertyMismatchError(properties, schema);
    default:
      return true;
  }
};

export default { validate };
