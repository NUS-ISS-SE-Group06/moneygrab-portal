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
        
        // No need to manually clear localStorage - Amplify manages this
        // Just navigate to login
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
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          Checking authentication...
        </div>
        
        {/* Simple loading spinner */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        {authError && (
          <div style={{ 
            marginTop: '20px', 
            fontSize: '14px', 
            color: '#e74c3c',
            backgroundColor: '#fdf2f2',
            padding: '10px',
            borderRadius: '5px',
            maxWidth: '300px'
          }}>
            <div>{authError.message}</div>
            {retryCount < 2 && (
              <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
                Retrying... ({retryCount + 1}/3)
              </div>
            )}
          </div>
        )}
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  console.log("RequireAuth: Rendering children.");
  return children;
}