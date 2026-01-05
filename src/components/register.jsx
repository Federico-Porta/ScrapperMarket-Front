import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        ci: '',
        name: '',
        lastName: '',
        userName: '',
        mail: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden");
        }

        setLoading(true);
        try {
            // Enviamos los datos tal cual los espera tu RegisterRequest.java
            const response = await axios.post('http://localhost:8080/users/register', {
                ci: parseInt(formData.ci), // Convertimos a número para el long de Java
                name: formData.name,
                lastName: formData.lastName,
                userName: formData.userName,
                mail: formData.mail,
                password: formData.password
            });

            console.log("Registro exitoso:", response.data);
            alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
            navigate('/login');
        } catch (err) {
            console.error("Error en registro:", err);
            setError("Error al registrarse. Verifica que la CI o el Mail no existan ya.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Registro de Usuario</h2>

                {error && <div style={errorBanner}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={rowStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Cédula (CI)</label>
                            <input name="ci" type="number" style={inputStyle} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Nombre</label>
                            <input name="name" type="text" style={inputStyle} onChange={handleChange} required />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Apellido</label>
                            <input name="lastName" type="text" style={inputStyle} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Nombre de Usuario</label>
                        <input name="userName" type="text" style={inputStyle} onChange={handleChange} required />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Email</label>
                        <input name="mail" type="email" style={inputStyle} onChange={handleChange} required />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Contraseña</label>
                        <input name="password" type="password" style={inputStyle} onChange={handleChange} required />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Confirmar Contraseña</label>
                        <input name="confirmPassword" type="password" style={inputStyle} onChange={handleChange} required />
                    </div>

                    <button type="submit" disabled={loading} style={loading ? {...btnStyle, opacity: 0.7} : btnStyle}>
                        {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <p style={footerText}>
                    ¿Ya tienes cuenta? <Link to="/login" style={linkStyle}>Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

// --- ESTILOS ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', backgroundColor: '#f4f7f6' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' };
const titleStyle = { margin: '0 0 20px 0', textAlign: 'center', color: '#2c3e50' };
const rowStyle = { display: 'flex', gap: '15px' };
const inputGroup = { marginBottom: '15px', flex: 1 };
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: '#34495e' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const errorBanner = { backgroundColor: '#fab1a0', color: '#c0392b', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' };
const footerText = { textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' };
const linkStyle = { color: '#3498db', fontWeight: 'bold', textDecoration: 'none' };

export default Register;