import React, { useState, useEffect } from 'react'; // ⬅️ include useEffect
import { signIn, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ⬇️ Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          navigate('/'); // already logged in
        }
      } catch {
        // not logged in, continue showing login
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn({ username, password });
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);

      navigate('/');
    } catch (e) {
      console.error("Login failed (from Login.jsx):", e); // Enhanced log
      setError("Login failed. Check username/password.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username}
               onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
