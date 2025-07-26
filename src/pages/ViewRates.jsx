import React, { useEffect, useState } from "react";
import axios from "../api/axios.js";
import RateBoard from "../components/RateBoard.jsx";
import moolaLogo from "../assets/moola-logo.png";

const ViewRates = () => {
  const [style, setStyle] = useState("Normal Monitor Style");
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/view-rates")
      .then((res) => {
        setStyle(res.data.style);
        setRates(res.data.rates || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rates:", err);
        setError("Failed to fetch rates.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Display style: {style}</h2>
        <img src={moolaLogo} alt="Moola Logo" className="h-10 mb-2" />
      </div>
      <RateBoard rates={rates} style={style} />
    </div>
  );
};

export default ViewRates;