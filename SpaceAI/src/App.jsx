import React, {Fragment} from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
// import Login from './login/login';
import QueryPage from './QueryPage';
import SignIn from './login/signin';
import PastQueries from './pastqueries/pastqueries';

const clientId = 'client_secret_315201939812-mh6gficmq7dkusjc9kpgo66rpdbu9c6n.apps.googleusercontent.com.json';

function App() {
  return (
    <Router>
      {/* <nav>
        <Link to="/">Home</Link>  | <Link to="/query">Query</Link>
        <Link to="/login">Login</Link> 
      </nav> */}
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/query" element={<QueryPage />} />
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/pastqueries' element={<PastQueries />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
