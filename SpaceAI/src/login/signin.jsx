import React, { useState } from "react";
import { auth, provider, db } from "./config"; // Import Firestore instance
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions

function SignIn() {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    setError("");

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user; // User object from the result

      // Save user data to Firestore
      const userRef = doc(db, "users", signedInUser.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userRef, {
          uid: signedInUser.uid,
          displayName: signedInUser.displayName,
          email: signedInUser.email,
          photoURL: signedInUser.photoURL,
          createdAt: new Date().toISOString(),
        });
        console.log("New user document created in Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }

      setUser(signedInUser); // Update the user state to reflect the signed-in user
    } catch (err) {
      console.error("Error during sign-in:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div>
      {!user ? (
        <>
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <img
            src={user.photoURL}
            alt="User avatar"
            style={{ width: "50px", borderRadius: "50%" }}
          />
        </div>
      )}
    </div>
  );
}

export default SignIn;
