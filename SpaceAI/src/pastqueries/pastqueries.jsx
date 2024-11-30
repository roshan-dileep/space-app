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
      formattedDate: data.timestamp?.toDate
        ? data.timestamp.toDate().toLocaleString() // Firestore Timestamp to JS Date
        : new Date(data.timestamp).toLocaleString(), // Fallback if timestamp is already a JS Date
    };
  });
};

// export const fetchUserQueryResults = async () => {
//     const user = auth.currentUser;

//     if (!user) {
//         throw new Error("User is not authenticated.");

//     }
//     const userQueriesCollection = collection(db,`users/${user.uid}/queries`);
//     const querySnapshot = await getDocs(userQueriesCollection);


// }

export default function PastQueries() {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsSignedIn(true);
        try {
          const userQueries = await fetchUserQueriesWithDates();
          setQueries(userQueries);
        } catch (err) {
          setError(err.message);
        }
      } else {
        setIsSignedIn(false);
        setQueries([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Past Queries</h2>

      {!isSignedIn && (
        <div>
          <p>You must be signed in to view past queries.</p>
          <SignIn />
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
                  <p>
                    <strong>Query:</strong> {query.query}
                  </p>
                  <p>
                    <strong>Response:</strong> {query.response}
                  </p>
                  <p>
                    <strong>Confidence Score:</strong>{" "}
                    {query.probabilities?.toFixed(4) || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong> {query.formattedDate}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
