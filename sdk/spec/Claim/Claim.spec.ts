import "jasmine";

import Claim from "@src/Claim";
import ClaimType from "@src/ClaimType";

describe("build", () => {
  it("errors for invalid ClaimTypes", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const claimType = ClaimType.fromSchema(pseudoSchema);
    const { schema } = claimType;
    const owner = "0x0";
    const properties = { name: "Foo", age: 20 };

    // @ts-ignore
    schema["$schema"] = 1;

    // @ts-ignore
    const wrapper = () => Claim.build(claimType, properties, owner);

    expect(wrapper).toThrowError(Error, /Invalid ClaimType schema/);
  });

  it("errors for properties not matching the schema", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const claimType = ClaimType.fromSchema(pseudoSchema);
    const owner = "0x0";
    const properties = { name: "Foo", age: "20" };

    const wrapper = () => Claim.build(claimType, properties, owner);

    expect(wrapper).toThrowError(Error, /Properties do not match/);
  });

  it("builds a claim for valid properties and schemas", () => {
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const claimType = ClaimType.fromSchema(pseudoSchema);
    const owner = "0x0";
    const properties = { name: "Foo", age: 20 };

    const result = Claim.build(claimType, properties, owner);
    expect(result).toBeInstanceOf(Claim);
    expect(result.claimTypeHash).toEqual(claimType.hash);
  });
});
