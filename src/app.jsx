import login from './components/login'
import './bootstrap.min.css'
import { browserrouter, route, routes } from 'react-router'
import signup from './components/signup'
import productlist from './components/productlist'
import { toastcontainer } from 'react-toastify'
import "react-toastify/dist/reacttoastify.css";
import cart from './components/cart'
import navbar from './components/navbar'
import userprofile from './components/userprofile'
import adminpanel from './components/adminpanel'

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
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
