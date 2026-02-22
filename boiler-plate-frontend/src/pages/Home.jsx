import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../services/api';

export default function Home() {
  const [health, setHealth] = useState({ status: 'loading', text: 'Checking backend...' });
  const [hello, setHello] = useState('Loading...');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [healthRes, helloRes] = await Promise.all([
          api.get('/health'),
          api.get('/api/hello'),
        ]);
        if (!active) return;
        setHealth({ status: 'online', text: healthRes.data?.status || 'ok' });
        setHello(helloRes.data?.message || 'Hello');
      } catch (err) {
        if (!active) return;
        setHealth({ status: 'offline', text: 'Could not reach API' });
        setHello('Connect the backend to see this message.');
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">MERN boilerplate</p>
        <h1>Simple, clean, ready for your next full stack app.</h1>
        <p className="lead">
          React + Vite on the frontend, Express + Mongo on the backend, and JWT auth to get you moving fast.
        </p>
        <div className="actions">
          <Link className="button" to="/register">Create account</Link>
          <Link className="button ghost" to="/login">Login</Link>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Backend status</h3>
          <p className={`status status--${health.status}`}>{health.text}</p>
          <p className="muted">API base: {API_BASE_URL}</p>
        </div>
        <div className="card">
          <h3>Sample response</h3>
          <p className="status status--neutral">{hello}</p>
          <p className="muted">From <code>GET /api/hello</code>.</p>
        </div>
        <div className="card">
          <h3>What is inside</h3>
          <ul className="list">
            <li>JWT auth endpoints and middleware</li>
            <li>Optional MongoDB with in-memory fallback</li>
            <li>Simple API helper and routing</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
