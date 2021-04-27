export const LivenessSchema = {
  liveness: { type: "boolean" },
};

export const BasicSchema = {
  residential_address_country: { type: "string" },
  date_of_birth: { type: "string" },
  full_name: { type: "string" },
  identification_document_country: { type: "string" },
  identification_document_number: { type: "string" },
  identification_document_type: { type: "string" },
};

export const DummySchema = {
  name: { type: "string" },
  age: { type: "number" },
};

const claimTypes = {
  LivenessSchema,
  BasicSchema,
  DummySchema,
};

export default claimTypes;
