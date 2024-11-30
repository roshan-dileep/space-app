import React, { useState, useEffect } from "react";
import { auth } from "./login/config";
import { fetchUserQueriesWithDates } from "./pastqueries/pastqueries";
function SideBar() {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsSignedIn(true); // Update state to indicate the user is signed in
        try {
          const queriesWithDates = await fetchUserQueriesWithDates();
          setQueries(queriesWithDates); // Fetch and display past queries
          setError(null); // Clear any previous errors
        } catch (err) {
          setError("Error fetching past queries.");
          console.error("Error fetching data:", err);
        }
      } else {
        setIsSignedIn(false); // Update state to indicate the user is signed out
        setQueries([]); // Clear past queries when signed out
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

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
          {queries.map((query) => (
            <li key={query.id} style={{ marginBottom: "10px" }}>
              <strong>{query.query}</strong> <br />
              <small>{query.formattedDate}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SideBar;
