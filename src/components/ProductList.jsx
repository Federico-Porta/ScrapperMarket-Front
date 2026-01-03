import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products/index');
                console.log("Datos recibidos:", response.data);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error detallado:", error);
                setLoading(false);
            }
        };

        fetchProducts(); // <--- IMPORTANTE: Llamar a la función
    }, []); // <--- El array vacío asegura que solo corra una vez

    if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Cargando productos...</p>;

    return (
        <div style={gridStyle}>
            {products.length > 0 ? (
                products.map(p => (
                    <div key={p.ean} style={cardStyle}>
                        <img src={p.imageUrl || 'https://via.placeholder.com/150'} alt={p.name} style={imgStyle} />
                        <div style={{padding: '10px'}}>
                            <span style={storeBadge}>{p.storeName}</span> {/* Ahora p.storeName existe! */}
                            <h4 style={titleStyle}>{p.name}</h4>
                            <p style={brandStyle}>{p.brand}</p>
                            <p style={priceStyle}>{p.currency || '$'} {p.price}</p> {/* Ahora p.price y p.currency existen! */}
                            <button style={addBtnStyle}>Añadir al carrito</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No se encontraron productos.</p>
            )}
        </div>
    );
};

// Estilos (se mantienen igual)
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' };
const cardStyle = { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '150px', objectFit: 'contain', background: '#f9f9f9' };
const storeBadge = { fontSize: '0.7rem', background: '#e67e22', color: 'white', padding: '2px 6px', borderRadius: '4px' };
const titleStyle = { margin: '10px 0 5px 0', fontSize: '0.9rem', height: '40px', overflow: 'hidden' };
const brandStyle = { color: '#666', fontSize: '0.8rem', marginBottom: '10px' };
const priceStyle = { fontWeight: 'bold', fontSize: '1.1rem', color: '#27ae60' };
const addBtnStyle = { width: '100%', padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default ProductList;