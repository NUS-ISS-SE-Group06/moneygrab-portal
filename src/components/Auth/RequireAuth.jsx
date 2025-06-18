import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "@aws-amplify/auth";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log("RequireAuth: useEffect triggered, retry count:", retryCount);
    
    const verifyUser = async () => {
      try {
        console.log("RequireAuth: Attempting to fetch session...");
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth check timeout')), 10000);
        });
        
        const session = await Promise.race([
          fetchAuthSession(),
          timeoutPromise
        ]);
        
        console.log("RequireAuth: Session fetched:", {
          hasTokens: !!session?.tokens,
          hasIdToken: !!session?.tokens?.idToken,
          hasAccessToken: !!session?.tokens?.accessToken
        });

        if (!session?.tokens?.idToken) {
          throw new Error("No valid session found");
        }
        
        console.log("RequireAuth: User is authenticated.");
        setAuthError(null); // Clear any previous errors
        
      } catch (err) {
        console.error("RequireAuth: Auth check error:", err);
        
        // If it's a timeout or network error, allow retry
        if (err.message.includes('timeout') || err.message.includes('Network') || retryCount < 2) {
          setAuthError(err);
          if (retryCount < 2) {
            console.log("RequireAuth: Retrying auth check...");
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1000);
            return; // Don't navigate to login yet
          }
        }
        
        console.log("RequireAuth: Navigating to /login");
        // Clear any stale tokens before redirecting
        localStorage.removeItem("idToken");
        localStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
        
      } finally {
        setCheckingAuth(false);
        console.log("RequireAuth: setCheckingAuth(false)");
      }
    };
    
    verifyUser();
  }, [navigate, retryCount]);

  if (checkingAuth) {
    console.log("RequireAuth: Rendering 'Checking authentication...'");
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Checking authentication...</div>
        {authError && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'orange' }}>
            {authError.message}
            {retryCount < 2 && <div>Retrying... ({retryCount + 1}/3)</div>}
          </div>
        )}
      </div>
    );
  }
  
  console.log("RequireAuth: Rendering children.");
  return children;
}