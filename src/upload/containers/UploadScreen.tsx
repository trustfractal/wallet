import { useState } from "react";

import { useUserDispatch } from "@redux/stores/user/context";
import credentialsActions from "@redux/stores/user/reducers/credentials";

import CredentialsCollection from "@models/Credential/CredentialsCollection";

import { importFile } from "@utils/FileUtils";

import UploadCompleted from "../components/UploadCompleted";
import UploadFile from "../components/UploadFile";
import { ICredential } from "@pluginTypes/plugin";

function UploadScreen() {
  const dispatch = useUserDispatch();

  const [newCredentials, setNewCredentials] = useState<ICredential[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const onUpload = async (file: Blob) => {
    try {
      const serializedCredentials = await importFile(file);

      const importedCredentials = CredentialsCollection.parse(
        serializedCredentials,
      );

      // add new credentials
      importedCredentials.forEach((importedCredential) =>
        dispatch(
          credentialsActions.addCredential(importedCredential.serialize()),
        ),
      );

      setUploaded(true);
      setNewCredentials(importedCredentials);
    } catch (error) {
      console.error(error);
      setError("Invalid backup file.");
      throw error;
    }
  };

  if (uploaded) {
    return <UploadCompleted credentials={newCredentials} />;
  }

  return <UploadFile onUpload={onUpload} error={error} />;
}

export default UploadScreen;
