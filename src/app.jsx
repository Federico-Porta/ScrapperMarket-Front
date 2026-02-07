// 1. Corregimos los nombres de las funciones importadas a Mayúsculas
import Login from './components/login'
import './bootstrap.min.css'
// 2. Corregimos la librería (es case-sensitive)
import { BrowserRouter, Route, Routes } from 'react-router-dom' 
import Signup from './components/signup'
import ProductList from './components/productlist'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Cart from './components/cart'
import NavBar from './components/navbar'
import UserProfile from './components/userprofile'
import AdminPanel from './components/adminpanel'

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Ahora las etiquetas coinciden con los imports de arriba */}
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App