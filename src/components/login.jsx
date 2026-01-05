import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => { // 1. Recibimos la función para avisar al App.jsx
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

            // 2. Extraemos el token y los datos del usuario del AuthResponse
            const token = response.data.token;

            if (token) {
                // Guardamos el token para las peticiones a la API
                localStorage.setItem('token', token);

                // Guardamos el objeto usuario completo (contiene userName, mail, etc.)
                // Lo convertimos a String porque localStorage solo guarda texto
                localStorage.setItem('user', JSON.stringify(response.data));

                alert("¡Bienvenido a ScrapperMarket!");

                // 3. ¡IMPORTANTE! Avisamos al App.jsx que cargue los nuevos datos
                if (onLoginSuccess) {
                    onLoginSuccess();
                }

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
                <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>ScrapperMarket</h2>
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

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' };
const cardStyle = { padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;