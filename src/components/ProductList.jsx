import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState('');

    // Esta función ahora es la ÚNICA encargada de pedir productos
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/products/index', {
                params: {
                    name: searchTerm,
                    store: selectedStore
                }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false);
        }
    };

    // 1. Carga inicial de TIENDAS (solo se hace una vez)
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await axios.get('http://localhost:8080/stores');
                setStores(res.data);
            } catch (err) {
                console.error("Error cargando tiendas:", err);
            }
        };
        fetchStores();
    }, []);

    // 2. Carga de PRODUCTOS (se dispara al inicio Y cada vez que cambias el Select de tienda)
    useEffect(() => {
        fetchProducts();
    }, [selectedStore]); // <-- Al cambiar la tienda, busca solo

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando catálogo...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={filterContainer}>
                <input
                    type="text"
                    placeholder="¿Qué estás buscando? (ej. Leche)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={inputStyle}
                    onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
                />

               <select
                   value={selectedStore}
                   onChange={(e) => setSelectedStore(e.target.value)}
                   style={selectStyle}
               >
                   <option value="">Todos los Supermercados</option>
                   {stores && stores.map(s => (
                       <option key={s.id} value={s.fantasyName}>
                           {s.fantasyName}
                       </option>
                   ))}
               </select>

                <button onClick={() => fetchProducts()} style={searchBtnStyle}>
                    🔍 Buscar
                </button>
            </div>

            <div style={gridStyle}>
                {products && products.length > 0 ? (
                    products.map((p) => (
                        <div key={p.ean + p.storeName} style={cardStyle}>
                            <div style={imageContainer}>
                                <img
                                    src={p.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={p.name}
                                    style={imgStyle}
                                />
                            </div>
                            <div style={{ padding: '15px' }}>
                                <span style={storeBadge}>{p.storeName}</span>
                                <h4 style={titleStyle}>{p.name}</h4>
                                <p style={brandStyle}>{p.brand}</p>
                                <div style={priceContainer}>
                                    <span style={priceStyle}>{p.currency || '$'} {p.price}</span>
                                </div>
                                <button style={addBtnStyle}>Añadir al carrito</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', gridColumn: '1 / -1', marginTop: '40px' }}>
                        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (Tus estilos se mantienen exactamente igual)
const filterContainer = { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '300px', fontSize: '1rem' };
const selectStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', fontSize: '1rem', cursor: 'pointer' };
const searchBtnStyle = { padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' };
const cardStyle = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'transform 0.2s', overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const imageContainer = { width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '10px' };
const imgStyle = { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' };
const storeBadge = { fontSize: '0.65rem', background: '#e67e22', color: 'white', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold' };
const titleStyle = { margin: '10px 0 5px 0', fontSize: '0.95rem', color: '#2c3e50', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' };
const brandStyle = { color: '#7f8c8d', fontSize: '0.85rem', marginBottom: '10px' };
const priceContainer = { marginBottom: '15px' };
const priceStyle = { fontWeight: 'bold', fontSize: '1.3rem', color: '#27ae60' };
const addBtnStyle = { width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' };

export default ProductList;