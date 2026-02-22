import { useState } from 'react';
import api, { setAuthToken } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.post('/api/auth/register', form);
      const { token } = res.data;
      setAuthToken(token);
      localStorage.setItem('token', token);
      setMessage({ text: 'Registered and signed in', tone: 'success' });
    } catch (err) {
      const text = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setMessage({ text, tone: 'error' });
    }
  }

  return (
    <div className="page">
      <div className="card form-card">
        <h2>Create account</h2>
        <p className="muted">Start simple. You can always expand the profile later.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              className="input"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <button className="button" type="submit">Register</button>
        </form>
        {message && <p className={`notice ${message.tone || ''}`}>{message.text}</p>}
      </div>
    </div>
  );
}
