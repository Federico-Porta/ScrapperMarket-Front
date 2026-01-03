import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';

function App() {
  return (
    <Router>
      <div style={appContainer}>
        <nav style={navStyle}>
          <Link to="/" style={logoStyle}>ScrapperMarket</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/login" style={linkStyle}>Login</Link>
            <button style={cartBtnStyle}>🛒 Carrito</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h2 style={{ textAlign: 'center', color: '#333' }}>Catálogo de Productos</h2>
              <ProductList />
            </div>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

const appContainer = { minHeight: '100vh', backgroundColor: '#f4f4f4', margin: 0 };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white' };
const logoStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' };
const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '1rem' };
const cartBtnStyle = { padding: '8px 15px', backgroundColor: '#e67e22', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default App;