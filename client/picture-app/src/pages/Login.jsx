import React, { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      setMessage('Login successful');
      navigate('/content');
      // redirect or load protected data
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Login failed'
      );
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}

      <p>
        Don't have an account?{' '}
        <Link to="/register">Register here</Link>
      </p>
    </form>
  );
}

export default Login;
