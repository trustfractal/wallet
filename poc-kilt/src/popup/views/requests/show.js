import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import RequestTypes from "@models/Request/RequestTypes";

import { getRequests } from "@redux/selectors";

import ShareDataRequest from "./components/ShareDataRequest";
import ShareCredentialRequest from "./components/ShareCredentialRequest";
import StoreCredentialRequest from "./components/StoreCredentialRequest";

import "@popup/styles.css";

function RequestsShow() {
  const { id } = useParams();

  const requests = useSelector(getRequests);
  const request = requests.getById(id);

  if (request.type === RequestTypes.SHARE_DATA) {
    return <ShareDataRequest request={request} />;
  }

  if (request.type === RequestTypes.SHARE_CREDENTIAL) {
    return <ShareCredentialRequest request={request} />;
  }

  return <StoreCredentialRequest request={request} />;
}

export default RequestsShow;
