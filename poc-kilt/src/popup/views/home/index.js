import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getMnemonic, getBalance } from "@redux/selectors";

import "@popup/styles.css";

function Home() {
  const mnemonic = useSelector(getMnemonic);
  const balance = useSelector(getBalance);

  return (
    <div className="Popup">
      <h2>
        <center>Home</center>
      </h2>
      <div>
        <div>
          <p>
            <strong>Mnemonic</strong>
          </p>
          <p>{mnemonic}</p>
          <br />
          <p>
            <strong>Balance</strong>
          </p>
          <p>{balance}</p>
        </div>
        <br />
        <br />
        <Link to="/data">Data</Link>
        <br />
        <br />
        <Link to="/credentials">Credentials</Link>
        <br />
        <br />
        <Link to="/requests">Requests</Link>
      </div>
    </div>
  );
}

export default Home;
