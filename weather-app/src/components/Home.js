import React from "react";
import { Link } from "react-router-dom";
import "../Style.css";

export default function Home({ date }) {
  return (
    <div className="HomeContainer">
      <h2>Weather Forecast for the Royal Palace in Stockholm</h2>
      <Link className="HomeLink" to={`/dates/${date}`}>
        Get Weather Information
      </Link>
    </div>
  );
}
