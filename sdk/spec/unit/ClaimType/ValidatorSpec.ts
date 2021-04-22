import "jasmine";

import ClaimType from "../../../src/ClaimType";
import Validator from "../../../src/ClaimType/Validator";

describe("validate", () => {
  it("errors for invalid ClaimTypes", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const { schema } = ClaimType.fromSchema(pseudoSchema);

    // @ts-ignore
    schema["$schema"] = 1;

    // @ts-ignore
    const wrapper = () => Validator.validate(schema, { name: "foo", age: 20 });
    expect(wrapper).toThrowError(Error, /Invalid ClaimType schema/);
  });

  it("errors for properties not matching the schema", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const { schema } = ClaimType.fromSchema(pseudoSchema);

    const properties = { name: "Foo", age: "20" };

    const wrapper = () => Validator.validate(schema, properties);
    expect(wrapper).toThrowError(Error, /Properties do not match/);
  });

  it("is true for valid properties and schemas", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const { schema } = ClaimType.fromSchema(pseudoSchema);

    const properties = { name: "Foo", age: 20 };

    const result = Validator.validate(schema, properties);
    expect(result).toBeTrue();
  });
});
