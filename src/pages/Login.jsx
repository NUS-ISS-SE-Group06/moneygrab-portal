import React, { useState, useEffect } from 'react';
import { signIn, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          console.log("Login: User already authenticated, redirecting...");
          navigate('/');
        }
      } catch {
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
      await signIn({ username, password });
      const session = await fetchAuthSession();

      if (!session.tokens?.idToken) {
        throw new Error("Authentication successful but no tokens received");
      }

      navigate('/', { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Sign In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              backgroundColor: isLoading ? '#bbb' : '#007bff',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {error && <div style={styles.errorBox}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f3f4f6',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  heading: {
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: '15px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px'
  },
  errorBox: {
    marginTop: '15px',
    backgroundColor: '#ffe6e6',
    color: '#cc0000',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ffcccc'
  }
};

export default Login;
