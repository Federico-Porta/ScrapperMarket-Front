import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './bootstrap.min.css'
import './styles.css'
// Importamos el archivo y le damos un nombre CUALQUIERA, por ejemplo 'Raiz'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)