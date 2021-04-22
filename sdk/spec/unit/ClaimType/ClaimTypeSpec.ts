import "jasmine";

import ClaimType from "../../../src/ClaimType";

describe(".fromSchema", () => {
  it("generates a hash", () => {
    const schema = ClaimType.buildSchema("ID Card", {
      first_name: {
        type: "string",
      },
      last_name: {
        type: "string",
      },
    });

    const claimType = ClaimType.fromSchema(schema, "0x0");

    expect(claimType.hash).toBeDefined();
  });

  it("generates an id for the schema", () => {
    const schema = ClaimType.buildSchema("ID Card", {
      first_name: {
        type: "string",
      },
      last_name: {
        type: "string",
      },
    });

    const { schema: claimSchema } = ClaimType.fromSchema(schema, "0x0");

    expect(claimSchema.$id).toBeDefined();
  });
});
