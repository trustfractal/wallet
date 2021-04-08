import { Link } from "react-router-dom";

import "@popup/styles.css";

function Home() {
  return (
    <div className="Popup">
      <h2>Home</h2>
      <div>
        <Link to="/credentials">Credentials</Link>
        <br />
        <br />
        <Link to="/requests">Requests</Link>
      </div>
    </div>
  );
}

export default Home;
