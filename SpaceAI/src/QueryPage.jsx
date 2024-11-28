import React, { useState } from 'react';
import $ from 'jquery';
import './App.css';
import SignIn from './login/signin'; // Import the SignIn component
import { auth, db } from './login/config'; // Import Firebase auth and Firestore
import { doc, collection, addDoc, setDoc } from 'firebase/firestore'; // Firestore functions

function QueryPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [source, setSources] = useState(null);
  const [error, setError] = useState(null);
  const [probab, setProb] = useState(null);

  const saveQueryToFirestore = async (query, response, sources, probabilities) => {
    const user = auth.currentUser; // Get the currently authenticated user

    if (!user) {
      console.error("User is not authenticated.");
      setError("You must be signed in to save your queries.");
      return;
    }

    try {
      // Create or reference the user's document in the "users" collection
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { email: user.email }, { merge: true }); // Ensure user document exists

      // Create or reference the "queries" subcollection for the authenticated user
      const userQueriesCollection = collection(userDocRef, "queries");

      // Add the query data as a new document in the "queries" subcollection
      await addDoc(userQueriesCollection, {
        query,
        response,
        sources,
        probabilities,
        timestamp: new Date().toISOString(), // Save the time the query was made
      });

      console.log("Query saved to Firestore under user's queries collection.");
    } catch (err) {
      console.error("Error saving query to Firestore:", err);
      setError("An error occurred while saving your query.");
    }
  };

  const handleQuery = () => {
    setData(null);
    setError(null);
    setSources(null);
    setProb(null);

    $.ajax({
      url: 'http://127.0.0.1:8080/query',
      method: 'GET',
      data: { query },
      success: function (response) {
        console.log(response);
        if (response.response) {
          setData(response.response);
        }
        if (response.sources) {
          setSources(response.sources);
        }
        if (typeof response.probabilities === 'number') {
          setProb(response.probabilities);
        } else {
          console.error('Probabilities are not in the expected format:', response.probabilities);
          setProb(null);
        }

        // Save the query and its results to Firestore
        saveQueryToFirestore(
          query,
          response.response || '',
          response.sources || [],
          response.probabilities || null
        );
      },
      error: function (xhr, status, error) {
        console.error(status, error);
        setError('An error occurred while fetching data.');
      }
    });
  };

  return (
    <>
      <div className="container">
        <div className="top-right">
          <SignIn />
        </div>
        <div className="input-container">
          <input
            id="QueryInput"
            type="text"
            value={query}
            placeholder="Query"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button id="qbutton" onClick={handleQuery}></button>
        </div>
      </div>

      {data && (
        <div className="response-container">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div id="ResponseDiv">
            <h3>Response:</h3>
            <p id="Response">{data}</p>
            {source && (
              <div id="SourcesDiv">
                <h4>Sources:</h4>
                <ul>
                  {source.map((src, index) => (
                    <li key={index}>{src}</li>
                  ))}
                </ul>
              </div>
            )}
            {probab !== null && (
              <div id="ProbabDiv">
                <h4>Confidence Score:</h4>
                <p>{probab.toFixed(4)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default QueryPage;
