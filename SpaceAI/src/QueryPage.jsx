import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./App.css";
import SignIn from "./login/signin";
import SideBar from "./sidebar/sidebar";
import { auth, db } from "./login/config"; // Firebase auth and Firestore
import { doc, collection, addDoc, setDoc } from "firebase/firestore";

const QueryPage = ({ initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState(null); // For response
  const [source, setSources] = useState(null);
  const [error, setError] = useState(null);
  const [probab, setProb] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); // For toggling SideBar visibility

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignIn />
      </div>

      {/* Button to toggle SideBar visibility */}
      <button
        onClick={() => setShowSidebar((prev) => !prev)}
        style={{
          backgroundColor: "#1E90FF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
      </button>

      {/* Conditionally render SideBar */}
      {showSidebar && <SideBar param={updateQueryAndResponse} />}

      <div style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <input
            id="QueryInput"
            type="text"
            value={query}
            placeholder="Query"
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "200px",
            }}
          />
          <button
            id="qbutton"
            onClick={handleQuery}
            style={{
              marginLeft: "10px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "url('image-removebg-preview.png') no-repeat center center",
              backgroundSize: "cover",
              border: "none",
              cursor: "pointer",
            }}
          ></button>
        </div>

        {data && (
          <div>
            {error && (
              <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
            )}
            <div id="ResponseDiv">
              <h3 style={{ marginBottom: "10px" }}>Response:</h3>
              <p id="Response" style={{ padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
                {data}
              </p>
              {source && (
                <div id="SourcesDiv" style={{ marginTop: "20px" }}>
                  <h4>Sources:</h4>
                  <ul>
                    {source.map((src, index) => (
                      <li key={index}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
              {probab !== null && (
                <div id="ProbabDiv" style={{ marginTop: "20px" }}>
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
