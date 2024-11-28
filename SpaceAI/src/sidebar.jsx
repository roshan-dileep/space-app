import React, { useState, useEffect } from "react";
import { fetchUserQueriesWithDates } from "./pastqueries/pastqueries";

function SideBar() {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const queriesWithDates = await fetchUserQueriesWithDates();
      setQueries(queriesWithDates);
    } catch (err) {
      setError("Error fetching past queries.");
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="sidebar">
      <h3>Past Queries</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {queries.length === 0 ? (
        <p>No past queries available.</p>
      ) : (
        <ul>
          {queries.map((query) => (
            <li key={query.id}>
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
