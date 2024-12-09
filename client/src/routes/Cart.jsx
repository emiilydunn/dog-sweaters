import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [cookies, setCookie] = useCookies(['cart']);
    const apiHost = import.meta.env.VITE_API_HOST;
    const taxRate = 0.15; // Tax rate (e.g., 15%)

    // Function to calculate tax
    const calculateTax = (subTotal) => (subTotal * taxRate).toFixed(2);

    // Function to calculate total (subTotal + tax)
    const calculateTotal = (subTotal, tax) => (parseFloat(subTotal) + parseFloat(tax)).toFixed(2);

    useEffect(() => {
        const fetchCartDetails = async () => {
            const cartCookie = cookies.cart + ',' || ''; // Get the cart cookie
            const cartArray = cartCookie.split(',').filter(Boolean); // Turn it into an array of product IDs
           

            if (cartArray.length === 0) {
                setCartItems([]);
                setSubTotal(0);
                return;
            }

            const productCounts = {};
            cartArray.forEach((id) => {
                productCounts[id] = (productCounts[id] || 0) + 1;
            });

            const uniqueProductIds = Object.keys(productCounts);
            const products = [];
            let total = 0;

            // Fetch product details for each unique product
            for (const id of uniqueProductIds) {
                const response = await fetch(`${apiHost}/api/products/${id}`);
                if (response.ok) {
                    const product = await response.json();
                    const quantity = productCounts[id];
                    const totalCost = quantity * product.cost;

                    total += totalCost; // Update subtotal

                    products.push({
                        id,
                        name: product.name,
                        thumbnail: `${apiHost}/${product.image_filename}`,
                        price: Number(product.cost).toFixed(2),
                        quantity,
                        total: totalCost.toFixed(2),
                    });
                }
            }

            // Update cart state
            setCartItems(products);
            setSubTotal(total.toFixed(2)); // Set the subtotal state
        };

        fetchCartDetails();
    }, [cookies.cart]); // Run effect when cookies.cart changes

    const handleRemoveItem = (id) => {
        // Remove the item from the cart cookie
        const cartArray = cookies.cart ? cookies.cart.split(',') : [];
        const updatedCart = cartArray.filter((itemId) => itemId !== id);

        // Update the cookie with the new cart
        if (updatedCart.length === 0) {
            setCookie('cart', '', { path: '/', maxAge: 3600 }); // Clear the cookie if cart is empty
        } else {
            setCookie('cart', updatedCart.join(','), { path: '/', maxAge: 3600 }); // Update cookie with new cart
        }

        // Remove the item from the UI (cartItems state)
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));


        // Recalculate the subtotal after removing the item
        const newSubTotal = updatedCart.reduce((total, itemId) => {
            const item = cartItems.find((item) => item.id === itemId);
            return item ? total + parseFloat(item.total) : total;
        }, 0);
        setSubTotal(newSubTotal.toFixed(2)); // Set the new subtotal
    };

    const tax = calculateTax(subTotal);
    const total = calculateTotal(subTotal, tax);

    return (
        <div className="container mt-5">
            <h1>Your Cart</h1>
            {cartItems.length !== 0 ? (
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
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="btn btn-link icon-black"
                                    style={{ fontSize: '1.5rem', padding: 0 }}
                                >
                                    <i className="bi bi-x-square-fill"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <h3 className="text-success mt-4">Sub-total: ${subTotal}</h3>
                    <h4 className="text-success">Tax: ${tax}</h4>
                    <h4 className="text-success">Total: ${total}</h4>
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
