import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

   const handleLogin = async (e) => {
       e.preventDefault();
       try {
           const response = await axios.post('http://localhost:8080/users/login', {
               mail: email,
               password: password
           });

           console.log("Respuesta del servidor:", response.data);

           // Si tu backend devuelve un objeto como { token: "..." }
           // usamos response.data.token. Si devuelve el string directo, response.data
           const token = typeof response.data === 'object' ? response.data.token : response.data;

           if (token) {
               localStorage.setItem('token', token);
               alert("¡Bienvenido a ScrapperMarket!");
               navigate('/');
           } else {
               alert("Error: El servidor no envió un token válido.");
           }

       } catch (error) {
           console.error("Error completo:", error);
           alert("Credenciales incorrectas o problema de conexión.");
       }
   };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2>ScrapperMarket</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                        style={inputStyle}
                    />
                    <input
                        type="password" placeholder="Contraseña" value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                        style={inputStyle}
                    />
                    <button type="submit" style={btnStyle}>Ingresar</button>
                </form>
            </div>
        </div>
    );
};

// Estilos rápidos para que no se vea feo
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' };
const cardStyle = { padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;