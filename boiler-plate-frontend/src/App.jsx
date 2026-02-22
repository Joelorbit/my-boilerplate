import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { setAuthToken } from './services/api';

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

function App() {
  useEffect(() => {
    // Read token from localStorage for demo convenience
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="nav">
          <div className="brand">
            <span className="dot" />
            MERN Starter
          </div>
          <nav className="nav-links">
            <NavLink className={navClass} to="/" end>Home</NavLink>
            <NavLink className={navClass} to="/login">Login</NavLink>
            <NavLink className={navClass} to="/register">Register</NavLink>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <footer className="footer">
          <span>Simple MERN starter for quick builds.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
