// src/QueryPage.jsx
import React, { useState } from 'react';
import $ from 'jquery';
import './App.css';
import SignIn from './login/signin'; // Import the SignIn component

function QueryPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [source, setSources] = useState(null);
  const [error, setError] = useState(null);
  const [probab, setProb] = useState(null);

  const handleQuery = () => {
    setData(null);
    setError(null);
    setSources(null);
    setProb(null);

    $.ajax({
      url: 'http://127.0.0.1:8080/query',
      method: 'GET',
      data: { query },
      success: function(response) {
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
      },
      error: function(xhr, status, error) {
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
