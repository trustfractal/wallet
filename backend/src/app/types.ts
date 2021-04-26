import { Request } from "express";
import { IncomingHttpHeaders } from "node:http";

interface AuthenticatedHeaders extends IncomingHttpHeaders {
  authorization: string;
}

export interface Verification {
  status: "done" | "pending" | "contacted";
  report: "approved" | "rejected";
  level: string;
  details: Record<string, any>;
}

export interface User {
  verifications: Array<Verification>;
}

export interface AuthenticatedRequest extends Request {
  token?: string;
  user?: User;
  headers: AuthenticatedHeaders;
}
