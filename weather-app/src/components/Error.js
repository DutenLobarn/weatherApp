import React from "react";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <section>
      <h3>404, Page Not Found.</h3>
      <h3>The Weather in this Date is not available.</h3>
      <Link to="/">
        <button>Back Home</button>
      </Link>
    </section>
  );
}
