import React, { useEffect, useState } from "react";
import { auth, db } from "../login/config"; // Import Firebase auth and Firestore
import { collection, getDocs } from "firebase/firestore";
import SignIn from "../login/signin"; // Import the SignIn component

// Function to fetch queries and their dates
export const fetchUserQueriesWithDates = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  // Fetch the "queries" subcollection for the authenticated user
  const userQueriesCollection = collection(db, `users/${user.uid}/queries`);
  const querySnapshot = await getDocs(userQueriesCollection);

  // Extract and format the data
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      query: data.query,
      response: data.response,
      probabilities: data.probabilities || null,
      timestamp: data.timestamp,
      formattedDate: new Date(data.timestamp).toLocaleString(), // Add formatted date
    };
  });
};

export default function PastQueries() {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true);
        fetchUserQueriesWithDates()
          .then(setQueries)
          .catch((err) => setError(err.message));
      } else {
        setIsSignedIn(false);
        setQueries([]);
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const fetchQueries = async (user) => {
    try {
      // Reference the "queries" subcollection for the authenticated user
      const userQueriesCollection = collection(db, `users/${user.uid}/queries`);

      // Fetch all documents from the "queries" subcollection
      const querySnapshot = await getDocs(userQueriesCollection);

      // Extract data from documents and update state
      const queriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID if needed
        ...doc.data(), // Spread the document data
      }));

      setQueries(queriesData); // Update the state with fetched queries
    } catch (err) {
      console.error("Error fetching past queries:", err);
      setError("An error occurred while fetching your past queries.");
    }
  };

  return (
    <div>
      <h2>Past Queries</h2>

      {!isSignedIn && (
        <div>
          <p>You must be signed in to view past queries.</p>
          <SignIn /> {/* Render the SignIn component */}
        </div>
      )}

      {isSignedIn && (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {queries.length === 0 ? (
            <p>No past queries found.</p>
          ) : (
            <ul>
              {queries.map((query) => (
                <li key={query.id}>
                  <strong>Query:</strong> {query.query} <br />
                  <strong>Response:</strong> {query.response} <br />
                  <strong>Confidence Score:</strong> {query.probabilities?.toFixed(4) || "N/A"} <br />
                  <strong>Timestamp:</strong> {new Date(query.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
