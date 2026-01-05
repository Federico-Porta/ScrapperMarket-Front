import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Register from './components/Register';
import Cart from './components/Cart'; // Asegúrate de haber creado Cart.jsx

function App() {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div style={appContainer}>
        <nav style={navStyle}>
          <Link to="/" style={logoStyle}>ScrapperMarket</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user ? (
              <>
                <span style={welcomeStyle}>Hola, <strong>{user.userName || 'Usuario'}</strong></span>
                <button onClick={handleLogout} style={logoutBtnStyle}>Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/register" style={linkStyle}>Registro</Link>
                <Link to="/login" style={linkStyle}>Login</Link>
              </>
            )}
            {/* BOTÓN DEL CARRITO CON LINK */}
            <Link to="/cart" style={cartLinkStyle}>
              🛒 Carrito
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h2 style={{ textAlign: 'center', color: '#333' }}>Catálogo de Productos</h2>
              <ProductList />
            </div>
          } />
          <Route path="/login" element={<Login onLoginSuccess={loadUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- ESTILOS ---
const appContainer = { minHeight: '100vh', backgroundColor: '#f4f4f4', margin: 0 };
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: '#2c3e50',
  color: 'white'
};
const logoStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' };
const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '1rem' };
const welcomeStyle = { color: '#ecf0f1', fontSize: '0.9rem' };

const cartLinkStyle = {
  padding: '8px 15px',
  backgroundColor: '#e67e22',
  textDecoration: 'none',
  color: 'white',
  borderRadius: '5px',
  fontWeight: 'bold',
  display: 'inline-block'
};

const logoutBtnStyle = {
  background: 'transparent',
  border: '1px solid #e74c3c',
  color: '#e74c3c',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default App;