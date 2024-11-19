// src/SignIn.jsx
import React, { useEffect, useState } from "react";
import { auth, provider } from "./config"; // Make sure to import auth and provider
import { signInWithPopup } from "firebase/auth";

function SignIn() {
  const [value, setValue] = useState('');

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setValue(storedEmail);
    }
  }, []); // Only run on component mount

  return (
    <div>
      {value ? (
        <span>Welcome, {value}</span> // Replace Home with a welcome message or similar
      ) : (
        <button onClick={handleClick}>Sign in With Google</button>
      )}
    </div>
  );
}

export default SignIn;



// src/SignIn.jsx
// import React, { useState } from "react";
// import { auth } from "./config"; // Import the auth instance from your config
// import { createUserWithEmailAndPassword } from "firebase/auth";

// function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSignUp = () => {
//     setError('');
//     setMessage('');

//     // Create a new user with email and password
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed up successfully
//         setMessage(`Welcome, ${userCredential.user.email}!`);
//       })
//       .catch((error) => {
//         // Handle errors here
//         setError(`Error: ${error.message}`);
//       });
//   };

//   return (
//     <div>
//       <h2>Sign Up</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleSignUp}>Sign Up</button>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//     </div>
//   );
// }

// export default SignIn;
