import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    // Estados para los datos
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para Filtros y Paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Función principal de búsqueda
    const fetchProducts = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/products/index', {
                params: {
                    name: searchTerm,
                    store: selectedStore,
                    page: page,
                    size: 15 // Cantidad de productos por página
                }
            });

            // IMPORTANTE: Con paginación, los datos vienen en .content
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setCurrentPage(response.data.number || 0);
            setLoading(false);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false);
        }
    };

    // Carga inicial de tiendas (solo una vez)
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

    // Se dispara la búsqueda automáticamente al cambiar de TIENDA o de PÁGINA
    useEffect(() => {
        fetchProducts(currentPage);
    }, [selectedStore, currentPage]);

    return (
        <div style={{ padding: '20px' }}>
            {/* --- SECCIÓN DE FILTROS --- */}
            <div style={filterContainer}>
                <input
                    type="text"
                    placeholder="¿Qué buscas? (Enter para buscar)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={inputStyle}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            setCurrentPage(0); // Reset a la primera página al buscar
                            fetchProducts(0);
                        }
                    }}
                />

                <select
                    value={selectedStore}
                    onChange={(e) => {
                        setSelectedStore(e.target.value);
                        setCurrentPage(0); // Reset a la primera página
                    }}
                    style={selectStyle}
                >
                    <option value="">Todos los Supermercados</option>
                    {stores && stores.map(s => (
                        <option key={s.id} value={s.fantasyName}>
                            {s.fantasyName}
                        </option>
                    ))}
                </select>

                <button onClick={() => { setCurrentPage(0); fetchProducts(0); }} style={searchBtnStyle}>
                    🔍 Buscar
                </button>
            </div>

            {/* --- GRILLA DE PRODUCTOS --- */}
            {loading ? (
                <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando catálogo...</p>
            ) : (
                <>
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
                                <p>No se encontraron productos.</p>
                            </div>
                        )}
                    </div>

                    {/* --- CONTROLES DE PAGINACIÓN --- */}
                    {totalPages > 1 && (
                        <div style={paginationContainer}>
                            <button
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                style={currentPage === 0 ? disabledPageBtn : pageBtnStyle}
                            >
                                ⬅ Anterior
                            </button>

                            <span style={pageInfo}>
                                Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
                            </span>

                            <button
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                style={currentPage >= totalPages - 1 ? disabledPageBtn : pageBtnStyle}
                            >
                                Siguiente ➡
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- ESTILOS ---
const filterContainer = { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '300px', fontSize: '1rem' };
const selectStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', fontSize: '1rem', cursor: 'pointer' };
const searchBtnStyle = { padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' };
const cardStyle = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const imageContainer = { width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '10px' };
const imgStyle = { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' };

const storeBadge = { fontSize: '0.65rem', background: '#e67e22', color: 'white', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold' };
const titleStyle = { margin: '10px 0 5px 0', fontSize: '0.95rem', color: '#2c3e50', height: '40px', overflow: 'hidden' };
const brandStyle = { color: '#7f8c8d', fontSize: '0.85rem', marginBottom: '10px' };
const priceStyle = { fontWeight: 'bold', fontSize: '1.3rem', color: '#27ae60' };
const addBtnStyle = { width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

const priceContainer = { marginBottom: '15px' };

// Estilos de Paginación
const paginationContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px', paddingBottom: '40px' };
const pageBtnStyle = { padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #3498db', color: '#3498db', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const disabledPageBtn = { ...pageBtnStyle, borderColor: '#ccc', color: '#ccc', cursor: 'not-allowed' };
const pageInfo = { fontSize: '1rem', color: '#2c3e50' };

export default ProductList;