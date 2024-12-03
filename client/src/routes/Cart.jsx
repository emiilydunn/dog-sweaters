import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [cookies] = useCookies(['cart']);
    const apiHost = import.meta.env.VITE_API_HOST;

    useEffect(() => {
        const fetchCartDetails = async () => {
            const cartCookie = cookies.cart || ''; //Get the cart cookie
            const cartArray = cartCookie.split(',').filter(Boolean); //Turn it into an array of product IDs

            const productCounts = {};
            cartArray.forEach((id) => {
                productCounts[id] = (productCounts[id] || 0) + 1;
            });

            const uniqueProductIds = Object.keys(productCounts);
            const products = [];
            let total = 0;

            for (const id of uniqueProductIds) {
                const response = await fetch(`${apiHost}/api/products/${id}`);
                if (response.ok) {
                    const product = await response.json();
                    const quantity = productCounts[id];
                    const totalCost = quantity * product.cost;

                    // Add to subtotal
                    total += totalCost;

                    products.push({
                        id,
                        name: product.name,
                        thumbnail: `${apiHost}/${product.image_filename}`,
                        price: Number(product.cost).toFixed(2), //Price formatted
                        quantity,
                        total: totalCost.toFixed(2), //Total for this product formatted
                    });
                }
            }

            setCartItems(products);
            setSubTotal(total.toFixed(2)); 
        };

        fetchCartDetails();
    }, [cookies.cart]);

    return (
        <div className="container mt-5">
            <h1>Your Cart</h1>
            {cartItems.length > 0 ? (
                <>
                    <div className="list-group">
                        {cartItems.map((item) => (
                            <div key={item.id} className="list-group-item d-flex align-items-center">
                                <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    className="img-thumbnail"
                                />
                                <div className="flex-grow-1">
                                    <h5>{item.name}</h5>
                                    <p>Price: ${item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Total: ${item.total}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3 className="text-success mt-4">Sub-total: ${subTotal}</h3>
                    <div className="mt-4">
                        <Link to="/" className="btn btn-secondary go-back-btn mb-5">
                            Continue Shopping
                        </Link>
                        <Link to="/checkout" className="btn btn-primary mb-5 cart-btn">
                            Complete Purchase
                        </Link>
                    </div>
                </>
            ) : (
                <p>Your cart is empty. <Link to="/">Continue shopping</Link>.</p>
            )}
        </div>
    );
}
