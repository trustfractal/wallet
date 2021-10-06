import { ReplaySubject } from "rxjs";

import CredentialsCollection from "@models/Credential/CredentialsCollection";

export const credentialsSubject = new ReplaySubject<CredentialsCollection>();
