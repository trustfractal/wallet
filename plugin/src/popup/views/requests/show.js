import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getRequests } from "@redux/selectors";

import ShareCredentialRequest from "./components/ShareCredentialRequest";

import "@popup/styles.css";

function Request() {
  const { id } = useParams();

  const requests = useSelector(getRequests);
  const request = requests.getById(id);

  return <ShareCredentialRequest request={request} />;
}

export default Request;
