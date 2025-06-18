import React, { useState } from 'react';
import { signIn, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn({ username, password });
      const session = await fetchAuthSession();
      const idToken = session.tokens.idToken.toString();
      const accessToken = session.tokens.accessToken.toString();

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);

      navigate('/'); // redirect to home or dashboard
    } catch (err) {
      setError("Login failed: " + err.message);
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
