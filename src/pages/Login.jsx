import React, { useState, useEffect } from 'react';
import { signIn, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          console.log("Login: User already authenticated, redirecting...");
          navigate('/'); // already logged in
        }
      } catch {
        // not logged in, continue showing login
        console.log("Login: No existing session found");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Login: Attempting to sign in...");
      
      // Sign in with Cognito
      const signInResult = await signIn({ username, password });
      console.log("Login: Sign in successful:", signInResult);

      // Verify we have a valid session after sign in
      const session = await fetchAuthSession();
      console.log("Login: Session verified:", {
        hasIdToken: !!session.tokens?.idToken,
        hasAccessToken: !!session.tokens?.accessToken
      });

      if (!session.tokens?.idToken) {
        throw new Error("Authentication successful but no tokens received");
      }

      // No need to manually store tokens - Amplify does this automatically
      console.log("Login: Redirecting to home page...");
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error("Login failed:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.name === 'UserNotConfirmedException') {
        errorMessage = "Please confirm your account before signing in.";
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = "Invalid username or password.";
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = "User not found. Please check your username.";
      } else if (error.name === 'TooManyRequestsException') {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
            disabled={isLoading}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={isLoading}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {error && (
        <p style={{ 
          color: 'red', 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px'
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Login;