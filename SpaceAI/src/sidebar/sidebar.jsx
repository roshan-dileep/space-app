import React, { useState, useEffect } from "react";
import { auth } from "../login/config";
import { fetchUserQueriesWithDates } from "../pastqueries/pastqueries";
import "./sidebar.css";
const SideBar = ({ param }) => {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsSignedIn(true);
        try {
          const queriesWithDates = await fetchUserQueriesWithDates();
          setQueries(queriesWithDates);
          setError(null);
        } catch (err) {
          setError("Error fetching past queries.");
          console.error("Error fetching data:", err);
        }
      } else {
        setIsSignedIn(false);
        setQueries([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleButtonClick = (queryData) => {
    param(queryData.query, queryData.response); // Pass both query and response
  };

  return (
    <div className="sidebar" style={{ padding: "10px" }}>
      <h3>Past Queries</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isSignedIn ? (
        <p>Please sign in to view your past queries.</p>
      ) : queries.length === 0 ? (
        <p>No past queries available.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {queries.map((queryData) => (
            <li key={queryData.id} style={{ marginBottom: "10px" }}>
              <strong>{queryData.query}</strong> <br />
              <small>{queryData.formattedDate}</small> <br />
              <button
                style={{
                  marginTop: "5px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  backgroundColor: "#646cff",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleButtonClick(queryData)} // Pass query and response
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SideBar;
