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
          navigate('/');
        }
      } catch {
        console.log("No active session");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn({ username, password });
      const session = await fetchAuthSession();

      if (!session.tokens?.idToken) {
        throw new Error("Authentication successful but no tokens received");
      }

      navigate('/', { replace: true });
    } catch (error) {
      let errorMessage = "The username or password you entered is incorrect.";
      if (error.name === 'UserNotConfirmedException') {
        errorMessage = "Please confirm your account before signing in.";
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = "User not found. Please check your email.";
      } else if (error.name === 'TooManyRequestsException') {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <img
          src={require('../assets/moola-logo.png')}
          alt="Illustration"
          style={styles.illustration}
        />
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome back 👋</h2>
          <p style={styles.subheading}>Log in your account</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="What is your e-mail?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={styles.input}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                backgroundColor: isLoading ? '#9f9fed' : '#6366f1',
              }}
            >
              {isLoading ? 'Signing In...' : 'Continue'}
            </button>
          </form>
          {error && (
            <div style={styles.errorBox}>
              <strong style={{ color: '#dc2626' }}>Error Message</strong>
              <p style={{ margin: '4px 0 0 0' }}>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9fafb',
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  illustration: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#111827',
  },
  subheading: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: '16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  errorBox: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '20px',
    color: '#b91c1c',
    fontSize: '14px',
  }
};

export default Login;
