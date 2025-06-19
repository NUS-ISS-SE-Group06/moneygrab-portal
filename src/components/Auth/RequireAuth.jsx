import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "@aws-amplify/auth";
import PropTypes from 'prop-types';

// CSS styles object to avoid inline styles and jsx unknown property
const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: '18px',
    marginBottom: '10px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#e74c3c',
    backgroundColor: '#fdf2f2',
    padding: '10px',
    borderRadius: '5px',
    maxWidth: '300px'
  },
  retryText: {
    marginTop: '5px',
    fontWeight: 'bold'
  }
};

// Extracted loading component to reduce nesting
const LoadingSpinner = ({ authError, retryCount }) => (
  <div style={styles.container}>
    <div style={styles.title}>
      Checking authentication...
    </div>
    
    <div style={styles.spinner}></div>
    
    {authError && (
      <div style={styles.errorContainer}>
        <div>{authError.message}</div>
        {retryCount < 2 && (
          <div style={styles.retryText}>
            Retrying... ({retryCount + 1}/3)
          </div>
        )}
      </div>
    )}
    
    {/* CSS animation using a style tag instead of jsx */}
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `
    }} />
  </div>
);

// PropTypes for LoadingSpinner
LoadingSpinner.propTypes = {
  authError: PropTypes.object,
  retryCount: PropTypes.number.isRequired
};

// Extracted auth verification logic to reduce nesting
const useAuthVerification = (navigate) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const createTimeoutPromise = () => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth check timeout')), 10000);
    });
  };

  const handleAuthError = (err) => {
    console.error("RequireAuth: Auth check error:", err);
    
    const shouldRetry = (
      err.message.includes('timeout') || 
      err.message.includes('Network') || 
      retryCount < 2
    );

    if (shouldRetry) {
      setAuthError(err);
      if (retryCount < 2) {
        console.log("RequireAuth: Retrying auth check...");
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000);
        return false; // Don't navigate to login yet
      }
    }
    
    console.log("RequireAuth: Navigating to /login");
    navigate("/login", { replace: true });
    return true;
  };

  const verifyUser = async () => {
    try {
      console.log("RequireAuth: Attempting to fetch session...");
      
      const session = await Promise.race([
        fetchAuthSession(),
        createTimeoutPromise()
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
      setAuthError(null);
      
    } catch (err) {
      const shouldNavigate = handleAuthError(err);
      if (shouldNavigate) {
        return;
      }
    } finally {
      setCheckingAuth(false);
      console.log("RequireAuth: setCheckingAuth(false)");
    }
  };

  useEffect(() => {
    console.log("RequireAuth: useEffect triggered, retry count:", retryCount);
    verifyUser();
  }, [navigate, retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return { checkingAuth, authError, retryCount };
};

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { checkingAuth, authError, retryCount } = useAuthVerification(navigate);

  if (checkingAuth) {
    console.log("RequireAuth: Rendering 'Checking authentication...'");
    return <LoadingSpinner authError={authError} retryCount={retryCount} />;
  }
  
  console.log("RequireAuth: Rendering children.");
  return children;
}

// PropTypes validation for children
RequireAuth.propTypes = {
  children: PropTypes.node.isRequired
};