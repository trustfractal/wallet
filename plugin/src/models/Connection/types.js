import mirrorCreator from "mirror-creator";

const types = mirrorCreator([
  "CONFIRM_CREDENTIAL",
  "COMMIT_CREDENTIAL",
  "VERIFY_CONNECTION",
]);

export default types;
