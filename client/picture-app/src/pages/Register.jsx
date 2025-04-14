import React, { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('/register', {
        name,
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      setMessage('Registration successful');
      // redirect or load dashboard
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Registration failed'
      );
    }
  };

  return (
    <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <p>
  Already have an account? <Link to="/">Login here</Link>
</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Register;
