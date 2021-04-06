import mirrorCreator from "mirror-creator";

const status = mirrorCreator(["ACCEPTED", "DECLINED", "PENDING", "TIMED_OUT"]);

export default status;
