import { useeffect, usestate } from 'react';
import { usenavigate } from 'react-router';
import { toast } from 'react-toastify';
import cartcomparison from './cartcomparison';
import cartitem from './cart/cartitem';
import cartsummary from './cart/cartsummary';
import emptycart from './cart/emptycart';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comparison, setComparison] = useState(null);
    const [loadingComparison, setLoadingComparison] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión para ver tu carrito.");
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch('http://localhost:8080/cart/getProductsCart', {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                if (response.status === 401) {
                    toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
                    navigate('/login');
                } else {
                    toast.error("Error al cargar el carrito");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar el carrito");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProduct = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `http://localhost:8080/cart/removeProduct?id=${productId}`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                toast.success("Producto eliminado del carrito");
                fetchCart(); // Recargar carrito
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al eliminar el producto");
        }
    };

    const handleSubtractUnit = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `http://localhost:8080/cart/subtractUnitProductCart?id=${productId}`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                toast.success("Unidad quitada del carrito");
                fetchCart();
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar el carrito");
        }
    };

    const handleAddUnit = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `http://localhost:8080/cart/addProduct?id=${productId}&quant=1`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                fetchCart();
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar el carrito");
        }
    };

    const handleCalculateComparison = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión");
            navigate('/login');
            return;
        }

        setLoadingComparison(true);
        setShowModal(true);

        try {
            const response = await fetch('http://localhost:8080/cart/calculateCart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setComparison(data);
            } else {
                const errorText = await response.text();
                toast.error(errorText || 'Error al calcular el carrito');
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error de conexión');
            setShowModal(false);
        } finally {
            setLoadingComparison(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando carrito...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">🛒 Mi Carrito</h2>

            {cartItems.length === 0 ? (
                <EmptyCart onGoToProducts={() => navigate('/products')} />
            ) : (
                <>
                    <div className="row g-3">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="col-12">
                                <CartItem
                                    item={item}
                                    onRemove={handleRemoveProduct}
                                    onSubtract={handleSubtractUnit}
                                    onAdd={handleAddUnit}
                                />
                            </div>
                        ))}
                    </div>

                    <CartSummary onCalculate={handleCalculateComparison} />

                    {/* Modal de Comparación */}
                    {showModal && (
                        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Comparación de Carritos</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        ></button>
                                    </div>
                                    <CartComparison
                                        comparison={comparison}
                                        loading={loadingComparison}
                                        onClose={() => setShowModal(false)}
                                    />
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;