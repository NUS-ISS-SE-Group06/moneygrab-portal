// Home.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchAuthSession } from "@aws-amplify/auth";

const Home = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const session = await fetchAuthSession();
        
        // Extract user information from the ID token
        const idToken = session.tokens?.idToken;
        if (idToken) {
          // Parse the JWT payload to get user info
          const payload = JSON.parse(atob(idToken.toString().split('.')[1]));
          setUserInfo({
            username: payload['cognito:username'] || payload.sub,
            email: payload.email,
            name: payload.name,
            // Add other fields as needed
          });
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      } finally {
        setLoading(false);
      }
    };

    // Clean up any OAuth redirect parameters from URL
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    
    if (code || state) {
      // Remove OAuth parameters from URL without triggering navigation
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    loadUserInfo();
  }, [location.search]);

  if (loading) {
    return (
      <div className="text-gray-600 text-xl p-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-gray-600 text-xl p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Money Exchange App</h1>
      
      {userInfo && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">User Information:</h2>
          <p><strong>Username:</strong> {userInfo.username}</p>
          {userInfo.email && <p><strong>Email:</strong> {userInfo.email}</p>}
          {userInfo.name && <p><strong>Name:</strong> {userInfo.name}</p>}
        </div>
      )}
      
    </div>
  );
};

export default Home;