import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./App.css";
import SignIn from "./login/signin";
import SideBar from "./sidebar";
import { auth, db } from "./login/config"; // Firebase auth and Firestore
import { doc, collection, addDoc, setDoc } from "firebase/firestore";

const QueryPage = ({ initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState(null); // For response
  const [source, setSources] = useState(null);
  const [error, setError] = useState(null);
  const [probab, setProb] = useState(null);

  const updateQueryAndResponse = (newQuery, newResponse) => {
    setQuery(newQuery); // Update query input value
    setData(newResponse); // Update response paragraph value
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

  // Run query automatically if `initialQuery` is provided
  useEffect(() => {
    if (initialQuery) {
      handleQuery();
    }
  }, [initialQuery]); // Dependency ensures this only runs when `initialQuery` changes

  return (
    <div className="main-container">
      <div className="top-right">
        <SignIn />
      </div>
      <SideBar param={updateQueryAndResponse} /> {/* Pass function to SideBar */}

      <div className="content-container">
        <div className="input-container">
          <input
            id="QueryInput"
            type="text"
            value={query}
            placeholder="Query"
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white rounded-full border-0 text-black h-6 w-[200px] text-xl"
          />
          <button
            id="qbutton"
            onClick={handleQuery}
            className="bg-white w-8 h-8 rounded-full bg-[url('image-removebg-preview.png')] bg-cover border-0 cursor-pointer"
          ></button>
        </div>

        {data && (
          <div className="response-container">
            {error && <p className="text-red-500">{error}</p>}
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
      </div>
    </div>
  );
};

export default QueryPage;
