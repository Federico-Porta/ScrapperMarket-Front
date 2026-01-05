import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

 const fetchCart = async () => {
         try {
             const response = await axios.get('http://localhost:8080/cart', {
                 headers: { 'Authorization': `Bearer ${token}` }
             });

             // --- LÓGICA DE ORDENAMIENTO ---
             // Ordenamos alfabéticamente por productName para que no salte de lugar
             const sortedItems = (response.data.items || []).sort((a, b) =>
                 a.productName.localeCompare(b.productName)
             );

             setCartData({ ...response.data, items: sortedItems });
             setLoading(false);
         } catch (error) {
             console.error("Error al obtener el carrito:", error);
             setLoading(false);
         }
     };

    // Función para actualizar cantidad (Suma o Resta)
    const updateQuantity = async (productEan, newQuantity) => {
        if (newQuantity < 1) return; // Evitamos cantidades menores a 1

        try {
            await axios.post('http://localhost:8080/cart/add', {
                productEan: productEan,
                quantity: newQuantity
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCart(); // Recargamos para ver el cambio
        } catch (error) {
            alert("Error al actualizar cantidad");
        }
    };

    const handleRemove = async (productEan) => {
        try {
            await axios.delete(`http://localhost:8080/cart/remove/${productEan}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            alert("No se pudo eliminar el producto");
        }
    };

    useEffect(() => {
        if (!token) navigate('/login');
        else fetchCart();
    }, [token]);

    if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Cargando carrito...</p>;

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Tu Carrito de Compras</h2>

            {!cartData || !cartData.items || cartData.items.length === 0 ? (
                <div style={emptyStyle}>
                    <p>Tu carrito está vacío.</p>
                    <button onClick={() => navigate('/')} style={shopBtnStyle}>Ir al catálogo</button>
                </div>
            ) : (
                <div style={cartWrapper}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRow}>
                                <th style={thStyle}>Producto</th>
                                <th style={thStyle}>EAN</th>
                                <th style={thStyle}>Cantidad</th>
                                <th style={thStyle}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartData.items.map((item) => (
                                <tr key={item.productEan} style={rowStyle}>
                                    <td style={nameCell}>{item.productName}</td>
                                    <td style={tdStyle}>{item.productEan}</td>
                                    <td style={tdStyle}>
                                        <div style={qtyContainer}>
                                            <button
                                                style={qtyBtn}
                                                onClick={() => updateQuantity(item.productEan, item.quantity - 1)}
                                            > - </button>

                                            <span style={qtyText}>{item.quantity}</span>

                                            <button
                                                style={qtyBtn}
                                                onClick={() => updateQuantity(item.productEan, item.quantity + 1)}
                                            > + </button>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleRemove(item.productEan)}
                                            style={removeBtnStyle}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={summaryStyle}>
                        <h3>Resumen</h3>
                        <p>Items totales: {cartData.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                        <button style={checkoutBtnStyle}>Comparar Precios</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS NUEVOS PARA SELECTOR DE CANTIDAD ---
const qtyContainer = { display: 'flex', alignItems: 'center', gap: '10px' };
const qtyBtn = {
    width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd',
    backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
};
const qtyText = { fontSize: '1rem', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' };

// --- RESTO DE ESTILOS (Mantenidos) ---
const containerStyle = { padding: '40px', maxWidth: '1000px', margin: '0 auto' };
const titleStyle = { color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' };
const cartWrapper = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const headerRow = { backgroundColor: '#f8f9fa', textAlign: 'left' };
const thStyle = { padding: '15px', borderBottom: '2px solid #eee' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #eee' };
const rowStyle = { borderBottom: '1px solid #eee' };
const nameCell = { padding: '15px', fontWeight: 'bold', borderBottom: '1px solid #eee' };
const removeBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };
const summaryStyle = { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' };
const checkoutBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const emptyStyle = { textAlign: 'center', marginTop: '50px' };
const shopBtnStyle = { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };

export default Cart;