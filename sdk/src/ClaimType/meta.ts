export const ClaimTypeMetaschema = {
  $id: "http://kilt-protocol.org/draft-01/ctype#",
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    $id: {
      type: "string",
      format: "uri",
      pattern: "^fractal:ctype:0x[0-9a-f]+$",
    },
    $schema: {
      type: "string",
      format: "uri",
      const: "http://kilt-protocol.org/draft-01/ctype#",
    },
    title: {
      type: "string",
    },
    type: {
      type: "string",
      const: "object",
    },
    properties: {
      type: "object",
      patternProperties: {
        "^.*$": {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["string", "integer", "number", "boolean"],
            },
            $ref: {
              type: "string",
              format: "uri",
            },
            format: {
              type: "string",
              enum: ["date", "time", "uri"],
            },
          },
          additionalProperties: false,
          oneOf: [
            {
              required: ["type"],
            },
            {
              required: ["$ref"],
            },
          ],
        },
      },
    },
  },
  additionalProperties: false,
  required: ["$id", "title", "$schema", "properties", "type"],
};
