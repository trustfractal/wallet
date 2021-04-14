import "jasmine";

import ClaimType from "@src/ClaimType";
import { validateSchema } from "@src/ClaimType/ClaimType.utils";

describe("validateSchema", () => {
  it("errors for invalid ClaimTypes", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const { schema } = ClaimType.fromSchema(pseudoSchema);

    // @ts-ignore
    schema["$schema"] = 1;

    // @ts-ignore
    const wrapper = () => validateSchema(schema, { name: "foo", age: 20 });
    expect(wrapper).toThrowError(Error, /Invalid ClaimType schema/);
  });

  it("errors for properties not matching the schema", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const { schema } = ClaimType.fromSchema(pseudoSchema);

    const properties = { name: "Foo", age: "20" };

    const wrapper = () => validateSchema(schema, properties);
    expect(wrapper).toThrowError(Error, /Properties do not match/);
  });

  it("is true for valid properties and schemas", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const { schema } = ClaimType.fromSchema(pseudoSchema);

    const properties = { name: "Foo", age: 20 };

    const result = validateSchema(schema, properties);
    expect(result).toBeTrue();
  });
});
