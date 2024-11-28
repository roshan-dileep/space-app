import React, { useState } from "react";
import $ from "jquery";
import "./App.css";
import SignIn from "./login/signin"; // Import the SignIn component
import SideBar from "./sidebar";
import { auth, db } from "./login/config"; // Firebase auth and Firestore
import { doc, collection, addDoc, setDoc } from "firebase/firestore";

function QueryPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [source, setSources] = useState(null);
  const [error, setError] = useState(null);
  const [probab, setProb] = useState(null);

  const saveQueryToFirestore = async (query, response, sources, probabilities) => {
    const user = auth.currentUser;

    if (!user) {
      setError("You must be signed in to save your queries.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { email: user.email }, { merge: true });

      const userQueriesCollection = collection(userDocRef, "queries");
      await addDoc(userQueriesCollection, {
        query,
        response,
        sources,
        probabilities,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError("An error occurred while saving your query.");
    }
  };

  const handleQuery = () => {
    setData(null);
    setError(null);
    setSources(null);
    setProb(null);

    $.ajax({
      url: "http://127.0.0.1:8080/query",
      method: "GET",
      data: { query },
      success: function (response) {
        if (response.response) setData(response.response);
        if (response.sources) setSources(response.sources);
        if (typeof response.probabilities === "number") setProb(response.probabilities);

        saveQueryToFirestore(
          query,
          response.response || "",
          response.sources || [],
          response.probabilities || null
        );
      },
      error: function () {
        setError("An error occurred while fetching data.");
      },
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
      <SideBar /> {/* Include SideBar */}
      {data && (
        <div className="response-container">
          {error && <p style={{ color: "red" }}>{error}</p>}
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
