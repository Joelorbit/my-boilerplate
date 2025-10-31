import { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { setAuthToken } from './services/api'

function Home() {
  return (
    <h1>hello motherfuckers</h1>
  )
}

function App() {
  useEffect(() => {
    // read token from localStorage for demo convenience
    const t = localStorage.getItem('token');
    if (t) setAuthToken(t);
  }, [])

  return (
    <BrowserRouter>
      <nav style={{ padding: 12 }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
