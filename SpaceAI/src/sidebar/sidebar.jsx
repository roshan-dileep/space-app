import React, { useState, useEffect } from "react";
import { auth } from "../login/config";
import { fetchUserQueriesWithDates } from "../pastqueries/pastqueries";
import "./sidebar.css";

const SideBar = ({ param }) => {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsSignedIn(true);
        setIsLoading(true); // Start loading
        try {
          const queriesWithDates = await fetchUserQueriesWithDates();
          setQueries(queriesWithDates);
          setError(null);
        } catch (err) {
          setError("Error fetching past queries.");
          console.error("Error fetching data:", err);
        } finally {
          setIsLoading(false); // Stop loading
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
    <div className="sidebar">
      <h3>Past Queries</h3>
      {error && <p className="error-message">{error}</p>}
      {!isSignedIn ? (
        <p>Please sign in to view your past queries.</p>
      ) : isLoading ? (
        <p>Loading past queries...</p>
      ) : queries.length === 0 ? (
        <p>No past queries available.</p>
      ) : (
        <ul className="query-list">
          {queries.map((queryData) => (
            <li key={queryData.id} className="query-item">
              <strong>{queryData.query}</strong> <br />
              <small>{queryData.formattedDate}</small> <br />
              <button
                className="select-button"
                aria-label={`Select query: ${queryData.query}`}
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
